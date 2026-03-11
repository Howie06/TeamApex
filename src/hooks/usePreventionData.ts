import { useEffect, useState } from 'react'
import { getRecommendations, getSunscreenDosage } from '../lib/api'
import type {
  PreventionRecommendationResponse,
  SunscreenDosageResponse,
} from '../types/api'

type PreventionState = {
  recommendation: PreventionRecommendationResponse | null
  dosage: SunscreenDosageResponse | null
  loading: boolean
  error: string | null
}

const initialState: PreventionState = {
  recommendation: null,
  dosage: null,
  loading: false,
  error: null,
}

export function usePreventionData(uvIndex: number | null) {
  const [state, setState] = useState<PreventionState>(initialState)

  useEffect(() => {
    if (uvIndex === null) {
      return
    }

    let cancelled = false
    const requestedUvIndex = uvIndex

    async function loadPreventionData() {
      setState((current) => ({
        ...current,
        loading: true,
        error: null,
      }))

      try {
        const [recommendation, dosage] = await Promise.all([
          getRecommendations(requestedUvIndex),
          getSunscreenDosage(requestedUvIndex),
        ])

        if (cancelled) {
          return
        }

        setState({
          recommendation,
          dosage,
          loading: false,
          error: null,
        })
      } catch (error) {
        if (cancelled) {
          return
        }

        setState({
          recommendation: null,
          dosage: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load prevention data.',
        })
      }
    }

    void loadPreventionData()

    return () => {
      cancelled = true
    }
  }, [uvIndex])

  return uvIndex === null ? initialState : state
}
