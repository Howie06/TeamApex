import type { UvCurrentResponse, UvHistoryResponse } from '../types/api'

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast'
const NO_CURRENT_UV_THRESHOLD = 0.2

type OpenMeteoPayload = {
  current?: {
    time?: string
    uv_index?: number
  }
  hourly?: {
    time?: string[]
    uv_index?: Array<number | null>
  }
}

type DirectUvSnapshotArgs = {
  latitude: number
  longitude: number
  locationLabel: string
  peakWindow: string
}

function estimateDamageMinutes(uvIndex: number) {
  if (uvIndex <= NO_CURRENT_UV_THRESHOLD) {
    return 120
  }

  return Math.max(8, Math.min(120, Math.round(96 / uvIndex)))
}

function formatDamageWindow(uvIndex: number) {
  const minutes = estimateDamageMinutes(uvIndex)

  if (minutes >= 60) {
    const lower = Math.max(45, minutes - 15)
    const upper = minutes
    return `${lower}-${upper} minutes`
  }

  if (minutes >= 20) {
    const lower = Math.max(15, minutes - 5)
    const upper = minutes + 5
    return `${lower}-${upper} minutes`
  }

  return `${Math.max(5, minutes - 2)}-${minutes + 2} minutes`
}

function buildHumanAlert(uvIndex: number, locationLabel: string, action: string) {
  const minutes = estimateDamageMinutes(uvIndex)
  return `Unprotected skin may start taking damage in about ${minutes} minutes in ${locationLabel}. ${action}`
}

function mapUvRisk(uvIndex: number, locationLabel: string) {
  if (uvIndex <= NO_CURRENT_UV_THRESHOLD) {
    return {
      riskLevel: 'No current',
      riskColor: '#5B8DEF',
      warningMessage: `UV is currently negligible in ${locationLabel}. Active sun protection is not needed right now.`,
      humanAlert: `Current UV is 0 in ${locationLabel}. No immediate sun-protection action is needed unless you are planning ahead for the next daytime outing.`,
      estimatedDamageWindow: 'No immediate UV damage risk',
    }
  }

  const estimatedDamageWindow = formatDamageWindow(uvIndex)

  if (uvIndex <= 2) {
    return {
      riskLevel: 'Low',
      riskColor: '#2E8B57',
      warningMessage: `Low UV in ${locationLabel}. Protection is still recommended for long outdoor exposure.`,
      humanAlert: buildHumanAlert(
        uvIndex,
        locationLabel,
        'Keep sunscreen nearby for long outdoor sessions.',
      ),
      estimatedDamageWindow,
    }
  }

  if (uvIndex <= 5) {
    return {
      riskLevel: 'Moderate',
      riskColor: '#D4A017',
      warningMessage: `Moderate UV in ${locationLabel}. Use sunscreen, sunglasses, and plan around midday sun.`,
      humanAlert: buildHumanAlert(
        uvIndex,
        locationLabel,
        'Pack sunscreen and choose shade before midday exposure builds.',
      ),
      estimatedDamageWindow,
    }
  }

  if (uvIndex <= 7) {
    return {
      riskLevel: 'High',
      riskColor: '#F28C28',
      warningMessage: `High UV in ${locationLabel}. Limit direct sun exposure and apply SPF 50+ before going outside.`,
      humanAlert: buildHumanAlert(
        uvIndex,
        locationLabel,
        'Apply SPF 50+ and shorten open-sun time now.',
      ),
      estimatedDamageWindow,
    }
  }

  if (uvIndex <= 10) {
    return {
      riskLevel: 'Very High',
      riskColor: '#D94841',
      warningMessage: `Very high UV in ${locationLabel}. Skin damage can happen quickly, so use shade, clothing, and sunscreen together.`,
      humanAlert: buildHumanAlert(
        uvIndex,
        locationLabel,
        'Find shade now and use clothing plus sunscreen together.',
      ),
      estimatedDamageWindow,
    }
  }

  return {
    riskLevel: 'Extreme',
    riskColor: '#7A306C',
    warningMessage: `Extreme UV in ${locationLabel}. Avoid peak sun where possible and use full protection immediately.`,
    humanAlert: buildHumanAlert(
      uvIndex,
      locationLabel,
      'Move indoors or under deep shade immediately and fully cover exposed skin.',
    ),
    estimatedDamageWindow,
  }
}

export async function getDirectUvSnapshot({
  latitude,
  longitude,
  locationLabel,
  peakWindow,
}: DirectUvSnapshotArgs): Promise<{
  current: UvCurrentResponse
  history: UvHistoryResponse
}> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'uv_index',
    hourly: 'uv_index',
    forecast_days: '1',
    timezone: 'auto',
  })

  const response = await fetch(`${OPEN_METEO_BASE_URL}?${params.toString()}`)
  if (!response.ok) {
    throw new Error(`Direct Open-Meteo request failed with status ${response.status}`)
  }

  const payload = (await response.json()) as OpenMeteoPayload
  const currentTime = payload.current?.time
  const currentUvRaw = payload.current?.uv_index

  if (currentTime == null || currentUvRaw == null) {
    throw new Error('Direct Open-Meteo response did not include current UV data.')
  }

  const currentUv = Number(currentUvRaw.toFixed(1))
  const risk = mapUvRisk(currentUv, locationLabel)
  const times = payload.hourly?.time ?? []
  const values = payload.hourly?.uv_index ?? []

  return {
    current: {
      location: locationLabel,
      uv_index: currentUv,
      risk_level: risk.riskLevel,
      risk_color: risk.riskColor,
      warning_message: risk.warningMessage,
      human_alert: risk.humanAlert,
      estimated_damage_window: risk.estimatedDamageWindow,
      recorded_at: currentTime,
      source: 'Open-Meteo Weather API (browser fallback)',
      peak_window: peakWindow,
    },
    history: {
      location: locationLabel,
      source: 'Open-Meteo Weather API (browser fallback)',
      series: times.flatMap((recordedAt, index) => {
        const uvIndex = values[index]
        if (uvIndex == null) {
          return []
        }

        return [
          {
            recorded_at: recordedAt,
            uv_index: Number(uvIndex.toFixed(2)),
          },
        ]
      }),
    },
  }
}
