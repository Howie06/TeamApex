import { useState } from 'react'
import type { FormEvent } from 'react'

type UVHeroCardProps = {
  compact?: boolean
}

type UVLookupResponse = {
  postcode: string
  suburb: string
  state: string
  latitude: number
  longitude: number
  location: string
  uvIndex: number
  risk: string
  updatedAt: string
  temperature?: number
  weather?: string
}

type ApiErrorResponse = {
  detail?: string
}

function UVHeroCard({ compact = false }: UVHeroCardProps) {
  const [postcode, setPostcode] = useState('')
  const [suburb, setSuburb] = useState('')
  const [displayUv, setDisplayUv] = useState<string | number>('--')
  const [queryTime, setQueryTime] = useState('Not searched yet')
  const [status, setStatus] = useState('Waiting for search')
  const [lookupResult, setLookupResult] = useState<UVLookupResponse | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedPostcode = postcode.trim()
    const normalizedSuburb = suburb.trim()

    if (normalizedPostcode === '' || normalizedSuburb === '') {
      setLookupResult(null)
      setDisplayUv('--')
      setStatus('Enter postcode and suburb')
      setQueryTime('Not searched yet')
      return
    }

    setStatus('Looking up UV...')
    setLookupResult(null)
    setDisplayUv('--')

    try {
      const params = new URLSearchParams({
        postcode: normalizedPostcode,
        suburb: normalizedSuburb,
      })

      const response = await fetch(`http://127.0.0.1:8000/api/uv/current?${params}`)
      const payload: unknown = await response.json()

      if (!response.ok) {
        const errorPayload = payload as ApiErrorResponse
        throw new Error(errorPayload.detail ?? 'UV lookup failed.')
      }

      const uvPayload = payload as UVLookupResponse

      setLookupResult(uvPayload)
      setDisplayUv(uvPayload.uvIndex.toFixed(1))
      setStatus(`${uvPayload.location} · ${uvPayload.risk}`)
      setQueryTime(uvPayload.updatedAt)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'UV lookup failed.'

      setLookupResult(null)
      setDisplayUv('--')
      setStatus(message)
      setQueryTime(
        new Intl.DateTimeFormat('en-AU', {
          hour: 'numeric',
          minute: '2-digit',
          day: '2-digit',
          month: 'short',
        }).format(new Date()),
      )
    }
  }

  return (
    <section className={`hero-live-card ${compact ? 'hero-live-card-compact' : ''}`.trim()}>
      <div className="card-topline">
        <span className="section-kicker">Live UV query</span>
        <span className="card-chip danger">{lookupResult?.risk ?? 'Ready'}</span>
      </div>

      <div className="live-card-body">
        <div>
          <h2>Check UV near you</h2>
          <p>
            Enter a postcode and suburb to look up local UV from Neon coordinates and
            OpenWeather current conditions.
          </p>

          <form className="hero-query-form planner-form-shell" onSubmit={handleSubmit}>
            <div className="hero-query-grid planner-form-grid">
              <label className="form-field">
                <span>Postcode</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="3000"
                  value={postcode}
                  onChange={(event) => setPostcode(event.target.value)}
                />
              </label>

              <label className="form-field">
                <span>Suburb</span>
                <input
                  type="text"
                  placeholder="Melbourne"
                  value={suburb}
                  onChange={(event) => setSuburb(event.target.value)}
                />
              </label>

              <div className="hero-query-action">
                <button className="hero-query-button" type="submit">
                  Check UV
                </button>
              </div>
            </div>
          </form>

          {lookupResult ? (
            <p className="hero-query-feedback">
              {lookupResult.location}: {lookupResult.latitude}, {lookupResult.longitude}
              {lookupResult.temperature !== undefined ? ` · ${lookupResult.temperature}°C` : ''}
              {lookupResult.weather ? ` · ${lookupResult.weather}` : ''}
            </p>
          ) : null}
        </div>

        <div className="uv-ring" aria-hidden="true">
          <div className="uv-ring-core">UV</div>
        </div>
      </div>

      <div className="hero-metrics hero-result-grid">
        <div>
          <span className="metric-label">Current UV</span>
          <strong>{displayUv}</strong>
        </div>
        <div>
          <span className="metric-label">Query time</span>
          <strong>{queryTime}</strong>
        </div>
        <div>
          <span className="metric-label">Status</span>
          <strong>{status}</strong>
        </div>
      </div>
    </section>
  )
}

export default UVHeroCard
