import { currentUv } from '../data/siteData'

type UVHeroCardProps = {
  compact?: boolean
}

function UVHeroCard({ compact = false }: UVHeroCardProps) {
  return (
    <section className={`hero-live-card ${compact ? 'hero-live-card-compact' : ''}`.trim()}>
      <div className="card-topline">
        <span className="section-kicker">Live UV alert</span>
        <span className="card-chip danger">{currentUv.risk}</span>
      </div>

      <div className="live-card-body">
        <div>
          <div className="uv-reading">
            <strong>{currentUv.value}</strong>
            <span>/ {currentUv.max}</span>
          </div>
          <h2>Current UV risk near you</h2>
          <p>
            Skin damage may begin quickly. Shade, sunscreen, and protective clothing should be
            treated as immediate actions.
          </p>
        </div>

        <div className="uv-ring" aria-hidden="true">
          <div className="uv-ring-core">UV</div>
        </div>
      </div>

      <div className="hero-metrics">
        <div>
          <span className="metric-label">Location</span>
          <strong>{currentUv.city}</strong>
        </div>
        <div>
          <span className="metric-label">Peak window</span>
          <strong>{currentUv.peakWindow}</strong>
        </div>
        <div>
          <span className="metric-label">Status</span>
          <strong>{currentUv.updatedAt}</strong>
        </div>
      </div>
    </section>
  )
}

export default UVHeroCard
