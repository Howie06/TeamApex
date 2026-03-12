import { useSunSafety } from '../context/useSunSafety'

function LocationToolbar() {
  const {
    currentUv,
    error,
    locationState,
    searchLoading,
    searchQuery,
    searchResults,
    selectedLocation,
    setSearchQuery,
    selectLocation,
    refreshCurrentLocation,
    uvLoading,
  } = useSunSafety()

  const statusLabel =
    locationState === 'locating'
      ? 'Finding your current location'
      : locationState === 'fallback'
        ? 'Using Melbourne fallback'
        : locationState === 'error'
          ? 'Location unavailable'
          : 'Live location ready'

  return (
    <section className="location-toolbar">
      <div className="location-toolbar-copy">
        <p className="eyebrow">Live location</p>
        <h2>{currentUv?.location ?? selectedLocation}</h2>
        <p className="location-toolbar-text">
          {error ?? currentUv?.human_alert ?? 'Search a Victoria location or use your current position.'}
        </p>
      </div>

      <div className="location-toolbar-controls">
        <div className="location-toolbar-topline">
          <span className={`card-chip ${uvLoading ? 'muted' : 'soft'}`}>{statusLabel}</span>
          <button
            className="secondary-link toolbar-button"
            type="button"
            onClick={refreshCurrentLocation}
          >
            Use my location
          </button>
        </div>

        <label className="location-search-field">
          <span>Search location</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search Carnegie, Clayton, Melbourne CBD..."
          />
        </label>

        <div className="location-results" role="listbox" aria-label="Location search results">
          {searchLoading ? (
            <span className="location-result-empty">Searching locations...</span>
          ) : searchResults.length > 0 ? (
            searchResults.slice(0, 6).map((location) => {
              const isActive = currentUv?.location === location.display_name || selectedLocation === location.display_name

              return (
                <button
                  key={location.id}
                  className={`location-result-button ${isActive ? 'location-result-button-active' : ''}`.trim()}
                  type="button"
                  onClick={() => {
                    setSearchQuery(location.display_name)
                    void selectLocation(location.display_name)
                  }}
                >
                  <strong>{location.display_name}</strong>
                  <span>Peak {location.peak_window}</span>
                </button>
              )
            })
          ) : (
            <span className="location-result-empty">No matching Victoria locations found.</span>
          )}
        </div>
      </div>
    </section>
  )
}

export default LocationToolbar
