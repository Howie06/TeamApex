import { Link } from 'react-router-dom'
import FeatureCard from '../components/FeatureCard'
import HourlyUvChart from '../components/HourlyUvChart'
import Panel from '../components/Panel'
import UVHeroCard from '../components/UVHeroCard'
import {
  alertActions,
  coreFeatures,
  currentUv,
  trackContextRows,
} from '../data/siteData'

function HomePage() {
  return (
    <div className="page-view">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">EPIC 1 · Track</p>
          <h1>Track UV danger before it turns into skin damage.</h1>
          <p className="hero-text">
            The homepage now represents the Track epic. Real-time local UV information makes
            invisible danger visible first, then routes the user into skin understanding and
            prevention planning.
          </p>

          <div className="hero-actions">
            <Link className="header-action" to="/skin-guide">
              Understand skin impact
            </Link>
            <Link className="secondary-link" to="/prevention">
              Open prevention page
            </Link>
          </div>
        </div>

        <UVHeroCard compact />
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Three-page structure</p>
            <h2>Our application now addresses UV risk in three connected pages.</h2>
            <p>
              Track makes danger visible, Understand explains skin impact, and Prevent turns that
              awareness into protection behaviour.
            </p>
          </div>
        </div>

        <div className="feature-grid">
          {coreFeatures.map((feature) => (
            <FeatureCard key={feature.id} {...feature} ctaLabel="Open epic" />
          ))}
        </div>
      </section>

      <div className="section-grid">
        <Panel
          title="US1.1 Real-time localised UV alerts"
          description="This must-have user story stays on the homepage as the first decision point in the product."
          badge="Must have"
          badgeTone="danger"
        >
          <div className="info-list">
            {trackContextRows.map((row) => (
              <div className="info-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>

          <div className="summary-list">
            <span>{currentUv.city}</span>
            <span>UV {currentUv.value}</span>
            <span>Peak {currentUv.peakWindow}</span>
          </div>
        </Panel>

        <Panel
          title="Today's local UV pattern"
          description="A simple hourly view helps users judge when exposure is likely to stay high."
          badge="Track"
          badgeTone="muted"
        >
          <HourlyUvChart />
        </Panel>
      </div>

      <div className="section-grid">
        <Panel
          title="Immediate actions after the alert"
          description="The homepage should keep the next step short, local, and practical."
          badge="Action now"
          badgeTone="soft"
        >
          <div className="action-list">
            {alertActions.map((action) => (
              <div className="action-card" key={action.title}>
                <strong>{action.title}</strong>
                <p>{action.detail}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="How the flow continues"
          description="After tracking the live danger, users should move into awareness and prevention without leaving the design system."
          badge="Next pages"
          badgeTone="soft"
          className="panel-cta"
        >
          <div className="summary-list">
            <span>Skin page combines US2.1 and US2.2</span>
            <span>Prevention page combines US3.1 to US3.3</span>
            <span>Current status: {currentUv.risk}</span>
          </div>
          <Link className="inline-link" to="/prevention">
            Continue to prevention planning
          </Link>
        </Panel>
      </div>
    </div>
  )
}

export default HomePage
