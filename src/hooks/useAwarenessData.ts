import { useEffect, useState } from 'react'
import { getMyths, getSkinCancerTrend, getUvTrend } from '../lib/api'
import type { AwarenessTrendResponse, MythFactListResponse } from '../types/api'

type AwarenessState = {
  skinCancerTrend: AwarenessTrendResponse | null
  uvTrend: AwarenessTrendResponse | null
  myths: MythFactListResponse | null
  loading: boolean
  error: string | null
}

const initialState: AwarenessState = {
  skinCancerTrend: null,
  uvTrend: null,
  myths: null,
  loading: true,
  error: null,
}

export function useAwarenessData() {
  const [state, setState] = useState<AwarenessState>(initialState)

  useEffect(() => {
    let cancelled = false

    async function loadAwarenessData() {
      setState((current) => ({
        ...current,
        loading: true,
        error: null,
      }))

      try {
        const [skinCancerTrend, uvTrend, myths] = await Promise.all([
          getSkinCancerTrend(),
          getUvTrend(),
          getMyths(),
        ])

        if (cancelled) {
          return
        }

        setState({
          skinCancerTrend,
          uvTrend,
          myths,
          loading: false,
          error: null,
        })
      } catch (error) {
        if (cancelled) {
          return
        }

        setState({
          skinCancerTrend: null,
          uvTrend: null,
          myths: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load awareness data.',
        })
      }
    }

    void loadAwarenessData()

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
