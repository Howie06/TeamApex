import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { getCurrentUv, getLocations, getUvByCoordinates, getUvHistory } from '../lib/api'
import type { LocationSummary, UvCurrentResponse, UvHistoryPoint } from '../types/api'
import { SunSafetyContext } from './sunSafetyStore'

const DEFAULT_LOCATION = 'Melbourne'

type SunSafetyProviderProps = {
  children: ReactNode
}

function normalizeLocationName(locationName: string) {
  return locationName.split(',')[0]?.trim() || locationName
}

export function SunSafetyProvider({ children }: SunSafetyProviderProps) {
  const [selectedLocation, setSelectedLocation] = useState(DEFAULT_LOCATION)
  const [currentUv, setCurrentUv] = useState<UvCurrentResponse | null>(null)
  const [uvHistory, setUvHistory] = useState<UvHistoryPoint[]>([])
  const [locations, setLocations] = useState<LocationSummary[]>([])
  const [searchResults, setSearchResults] = useState<LocationSummary[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [uvLoading, setUvLoading] = useState(true)
  const [locationState, setLocationState] = useState<'locating' | 'ready' | 'fallback' | 'error'>(
    'locating',
  )
  const [error, setError] = useState<string | null>(null)
  const deferredSearchQuery = useDeferredValue(searchQuery)

  const loadByLocation = useCallback(async (locationName: string) => {
    setUvLoading(true)
    setError(null)

    try {
      const normalizedLocation = normalizeLocationName(locationName)
      const [uv, history] = await Promise.all([
        getCurrentUv(normalizedLocation),
        getUvHistory(normalizedLocation),
      ])
      setSelectedLocation(uv.location)
      setCurrentUv(uv)
      setUvHistory(history.series)
      setLocationState('ready')
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load UV data.')
      setLocationState('error')
    } finally {
      setUvLoading(false)
    }
  }, [])

  const loadByCoordinates = useCallback(async (latitude: number, longitude: number) => {
    setUvLoading(true)
    setError(null)

    try {
      const uv = await getUvByCoordinates(latitude, longitude)
      const history = await getUvHistory(normalizeLocationName(uv.location))
      setSelectedLocation(uv.location)
      setCurrentUv(uv)
      setUvHistory(history.series)
      setLocationState('ready')
    } catch (loadError) {
      setLocationState('fallback')
      setError(
        loadError instanceof Error
          ? `${loadError.message} Showing Melbourne as the fallback location.`
          : 'Unable to resolve your current location. Showing Melbourne instead.',
      )
      await loadByLocation(DEFAULT_LOCATION)
    } finally {
      setUvLoading(false)
    }
  }, [loadByLocation])

  const refreshCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState('fallback')
      setError('Browser geolocation is not available. Showing Melbourne instead.')
      void loadByLocation(DEFAULT_LOCATION)
      return
    }

    setLocationState('locating')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        void loadByCoordinates(position.coords.latitude, position.coords.longitude)
      },
      () => {
        setLocationState('fallback')
        setError('Location access was denied. Showing Melbourne instead.')
        void loadByLocation(DEFAULT_LOCATION)
      },
      {
        enableHighAccuracy: false,
        timeout: 6000,
        maximumAge: 300000,
      },
    )
  }, [loadByCoordinates, loadByLocation])

  useEffect(() => {
    let cancelled = false

    async function loadLocations() {
      try {
        const loadedLocations = await getLocations()
        if (cancelled) {
          return
        }

        setLocations(loadedLocations)
        setSearchResults(loadedLocations)
      } catch (loadError) {
        if (cancelled) {
          return
        }

        setError(
          loadError instanceof Error ? loadError.message : 'Failed to load available locations.',
        )
      }
    }

    void loadLocations()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    refreshCurrentLocation()
  }, [refreshCurrentLocation])

  useEffect(() => {
    let cancelled = false

    async function searchLocations() {
      setSearchLoading(true)

      try {
        const loadedLocations = await getLocations(deferredSearchQuery)
        if (cancelled) {
          return
        }

        startTransition(() => {
          setSearchResults(loadedLocations)
        })
      } catch (loadError) {
        if (cancelled) {
          return
        }

        setError(
          loadError instanceof Error ? loadError.message : 'Failed to search locations.',
        )
      } finally {
        if (!cancelled) {
          setSearchLoading(false)
        }
      }
    }

    void searchLocations()

    return () => {
      cancelled = true
    }
  }, [deferredSearchQuery])

  return (
    <SunSafetyContext.Provider
      value={{
        selectedLocation,
        currentUv,
        uvHistory,
        locations,
        searchResults,
        searchQuery,
        searchLoading,
        uvLoading,
        locationState,
        error,
        setSearchQuery,
        selectLocation: loadByLocation,
        refreshCurrentLocation,
      }}
    >
      {children}
    </SunSafetyContext.Provider>
  )
}
