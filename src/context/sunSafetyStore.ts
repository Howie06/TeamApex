import { createContext } from 'react'
import type { LocationSummary, UvCurrentResponse, UvHistoryPoint } from '../types/api'

export type LocationState = 'locating' | 'ready' | 'fallback' | 'error'

export type SunSafetyContextValue = {
  selectedLocation: string
  currentUv: UvCurrentResponse | null
  uvHistory: UvHistoryPoint[]
  locations: LocationSummary[]
  searchResults: LocationSummary[]
  searchQuery: string
  searchLoading: boolean
  uvLoading: boolean
  locationState: LocationState
  error: string | null
  setSearchQuery: (query: string) => void
  selectLocation: (locationName: string) => Promise<void>
  refreshCurrentLocation: () => void
}

export const SunSafetyContext = createContext<SunSafetyContextValue | undefined>(undefined)
