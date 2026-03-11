import { useEffect, useState } from 'react'
import { getSkinGuidance } from '../lib/api'
import type { SkinGuidanceResponse } from '../types/api'

type SkinGuidanceState = {
  data: SkinGuidanceResponse | null
  loading: boolean
  error: string | null
}

const initialState: SkinGuidanceState = {
  data: null,
  loading: false,
  error: null,
}

export function useSkinGuidance(uvIndex: number | null, skinType: string) {
  const [state, setState] = useState<SkinGuidanceState>(initialState)

  useEffect(() => {
    if (uvIndex === null) {
      return
    }

    let cancelled = false
    const requestedUvIndex = uvIndex

    async function loadGuidance() {
      setState((current) => ({
        ...current,
        loading: true,
        error: null,
      }))

      try {
        const data = await getSkinGuidance(requestedUvIndex, skinType)

        if (cancelled) {
          return
        }

        setState({
          data,
          loading: false,
          error: null,
        })
      } catch (error) {
        if (cancelled) {
          return
        }

        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load skin guidance.',
        })
      }
    }

    void loadGuidance()

    return () => {
      cancelled = true
    }
  }, [skinType, uvIndex])

  return uvIndex === null ? initialState : state
}
