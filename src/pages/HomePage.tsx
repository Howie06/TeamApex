import { Link } from 'react-router-dom'
import FeatureCard from '../components/FeatureCard'
import Panel from '../components/Panel'
import UVHeroCard from '../components/UVHeroCard'
import { coreFeatures } from '../data/siteData'

const homeGateways = [
  {
    title: 'Check current UV risk',
    description:
      'Go straight to the live UV view for the current alert, context, and immediate next actions.',
    path: '/uv-index',
  },
  {
    title: 'Learn why it matters',
    description:
      'Open the education page for visualisations, trend context, and awareness content.',
    path: '/education',
  },
  {
    title: 'Build today’s protection plan',
    description:
      'Use the planner page for clothing, sunscreen dosage, and reminder support.',
    path: '/protection-planner',
  },
]

function HomePage() {
  return (
    <div className="page-view">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Multi-page product structure</p>
          <h1>SunSafe Victoria now navigates like a real app.</h1>
          <p className="hero-text">
            The homepage now stays lightweight: it introduces the product, shows the current UV
            snapshot, and routes people into dedicated pages for UV alerts, education, protection
            planning, profile-based guidance, and project context.
          </p>

          <div className="hero-actions">
            <Link className="header-action" to="/uv-index">
              Check live UV
            </Link>
            <Link className="secondary-link" to="/protection-planner">
              Open protection planner
            </Link>
          </div>
        </div>

        <UVHeroCard compact />
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Core feature entry points</p>
            <h2>Go directly to the part of the product you need.</h2>
            <p>
              Detailed modules are no longer stacked into one long page. Each feature cluster now
              has its own destination.
            </p>
          </div>
        </div>

        <div className="feature-grid">
          {coreFeatures.map((feature) => (
            <FeatureCard key={feature.id} {...feature} />
          ))}
        </div>
      </section>

      <section className="gateway-grid">
        {homeGateways.map((gateway) => (
          <Panel
            key={gateway.title}
            title={gateway.title}
            description={gateway.description}
            badge="Route"
            badgeTone="muted"
          >
            <Link className="inline-link" to={gateway.path}>
              Enter page
            </Link>
          </Panel>
        ))}
      </section>
    </div>
  )
}

export default HomePage
