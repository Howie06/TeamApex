import type {
  AwarenessTrendResponse,
  LocationSummary,
  MythFactListResponse,
  PreventionRecommendationResponse,
  Reminder,
  ReminderCreatePayload,
  ReminderUpdatePayload,
  SkinGuidanceResponse,
  SunscreenDosageResponse,
  UvCurrentResponse,
  UvHistoryResponse,
} from '../types/api'

const hostedFallbackApiBaseUrl =
  typeof window !== 'undefined' && window.location.hostname.endsWith('.netlify.app')
    ? 'https://teamapex-api.onrender.com'
    : 'http://127.0.0.1:8000'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? hostedFallbackApiBaseUrl).replace(
  /\/$/,
  '',
)

type ApiErrorShape = {
  detail?: string
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`

    try {
      const errorBody = (await response.json()) as ApiErrorShape
      if (errorBody.detail) {
        errorMessage = errorBody.detail
      }
    } catch {
      // Ignore non-JSON error payloads and keep the generic message.
    }

    throw new Error(errorMessage)
  }

  return (await response.json()) as T
}

export function getLocations(query?: string) {
  const normalizedQuery = query?.trim()
  const path = normalizedQuery
    ? `/api/locations/search?q=${encodeURIComponent(normalizedQuery)}`
    : '/api/locations'
  return request<LocationSummary[]>(path)
}

export function getCurrentUv(location: string) {
  return request<UvCurrentResponse>(`/api/uv/current?location=${encodeURIComponent(location)}`)
}

export function getUvByCoordinates(latitude: number, longitude: number) {
  return request<UvCurrentResponse>(
    `/api/uv/by-coordinates?lat=${encodeURIComponent(latitude)}&lng=${encodeURIComponent(longitude)}`,
  )
}

export function getUvHistory(location: string) {
  return request<UvHistoryResponse>(`/api/uv/history?location=${encodeURIComponent(location)}`)
}

export function getSkinCancerTrend() {
  return request<AwarenessTrendResponse>('/api/awareness/skin-cancer-trend')
}

export function getUvTrend() {
  return request<AwarenessTrendResponse>('/api/awareness/uv-trend')
}

export function getMyths() {
  return request<MythFactListResponse>('/api/awareness/myths')
}

export function getRecommendations(uvIndex: number) {
  return request<PreventionRecommendationResponse>(
    `/api/prevention/recommendations?uv_index=${encodeURIComponent(uvIndex)}`,
  )
}

export function getSunscreenDosage(uvIndex: number) {
  return request<SunscreenDosageResponse>(
    `/api/prevention/sunscreen-dosage?uv_index=${encodeURIComponent(uvIndex)}`,
  )
}

export function getSkinGuidance(uvIndex: number, skinType: string) {
  return request<SkinGuidanceResponse>(
    `/api/prevention/skin-guidance?uv_index=${encodeURIComponent(uvIndex)}&skin_type=${encodeURIComponent(skinType)}`,
  )
}

export function listReminders() {
  return request<Reminder[]>('/api/reminders')
}

export function createReminder(payload: ReminderCreatePayload) {
  return request<Reminder>('/api/reminders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateReminder(reminderId: number, payload: ReminderUpdatePayload) {
  return request<Reminder>(`/api/reminders/${reminderId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function deleteReminder(reminderId: number) {
  return request<{ message: string }>(`/api/reminders/${reminderId}`, {
    method: 'DELETE',
  })
}
