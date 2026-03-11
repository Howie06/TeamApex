import type { CSSProperties } from 'react'
import type { UvCurrentResponse } from '../types/api'

type UVHeroCardProps = {
  compact?: boolean
  data: UvCurrentResponse | null
  loading?: boolean
  error?: string | null
}

function UVHeroCard({ compact = false, data, loading = false, error = null }: UVHeroCardProps) {
  const ringStyle = {
    '--risk-accent': data?.risk_color ?? '#64deaf',
  } as CSSProperties

  const locationText = data?.location ?? 'Resolving location'
  const peakWindow = data?.peak_window ?? 'Waiting for live UV data'
  const statusText = loading ? 'Refreshing live UV' : data?.recorded_at ?? 'Waiting for update'
  const riskLabel = data?.risk_level ?? 'Loading'
  const heroTitle = data ? `Current UV risk near ${data.location}` : 'Current UV risk near you'
  const heroCopy = error
    ? error
    : data?.human_alert ?? 'We are checking today’s UV conditions and preparing local advice.'

  return (
    <section
      className={`hero-live-card ${compact ? 'hero-live-card-compact' : ''}`.trim()}
      style={ringStyle}
    >
      <div className="card-topline">
        <span className="section-kicker">Live UV alert</span>
        <span className="card-chip danger">{riskLabel}</span>
      </div>

      <div className="live-card-body">
        <div>
          <div className="uv-reading">
            <strong>{data?.uv_index.toFixed(1) ?? '--'}</strong>
            <span>/ 11+</span>
          </div>
          <h2>{heroTitle}</h2>
          <p>{heroCopy}</p>
        </div>

        <div className="uv-ring" aria-hidden="true">
          <div className="uv-ring-core">UV</div>
        </div>
      </div>

      <div className="hero-metrics">
        <div>
          <span className="metric-label">Location</span>
          <strong>{locationText}</strong>
        </div>
        <div>
          <span className="metric-label">Peak window</span>
          <strong>{peakWindow}</strong>
        </div>
        <div>
          <span className="metric-label">Status</span>
          <strong>{statusText}</strong>
        </div>
      </div>
    </section>
  )
}

export default UVHeroCard
