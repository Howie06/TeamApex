import { Link } from 'react-router-dom'
import HourlyUvChart from '../components/HourlyUvChart'
import Panel from '../components/Panel'
import UVHeroCard from '../components/UVHeroCard'
import { useSunSafety } from '../context/useSunSafety'
import { usePreventionData } from '../hooks/usePreventionData'

function buildImmediateActions(riskLevel: string | undefined, sunscreenAdvice: string | undefined) {
  return [
    {
      title: 'Before heading outside',
      detail:
        sunscreenAdvice ??
        'Apply sunscreen, pack sunglasses, and protect exposed skin before longer outdoor travel.',
    },
    {
      title: 'During the peak window',
      detail:
        riskLevel === 'Extreme' || riskLevel === 'Very High'
          ? 'Keep outdoor time short and move between shaded or indoor zones wherever possible.'
          : 'Use shaded routes and reduce open-sun exposure around midday.',
    },
    {
      title: 'For longer afternoon activity',
      detail:
        riskLevel === 'High' || riskLevel === 'Very High' || riskLevel === 'Extreme'
          ? 'Reapply sunscreen and switch into sleeves, hat, and sunglasses before extended outdoor activity.'
          : 'Keep sunscreen nearby and review your protection plan before later outdoor sessions.',
    },
  ]
}

function HomePage() {
  const { currentUv, error, uvHistory, uvLoading } = useSunSafety()
  const { recommendation } = usePreventionData(currentUv?.uv_index ?? null)

  const trackContextRows = [
    {
      label: 'Current risk level',
      value:
        currentUv?.warning_message ??
        'Live UV conditions are loading so the alert can be translated into plain language.',
    },
    {
      label: 'Estimated damage window',
      value:
        currentUv?.estimated_damage_window ??
        'Waiting for a location-specific estimate of how quickly exposed skin may begin taking damage.',
    },
    {
      label: 'Primary next action',
      value:
        recommendation?.general_advice ??
        'Once live UV data is ready, this page will translate the number into a simple protection action.',
    },
  ]

  const alertActions = buildImmediateActions(currentUv?.risk_level, recommendation?.sunscreen_advice)

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

        <UVHeroCard compact data={currentUv} loading={uvLoading} error={error} />
      </section>

      <div className="section-grid">
        <Panel
          title="Real-time localised UV alerts"
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
            <span>Peak {currentUv?.peak_window ?? 'Loading'}</span>
            <span>{currentUv?.source ?? 'Waiting for source'}</span>
          </div>
        </Panel>

        <Panel
          title="Today's local UV pattern"
          description="A simple hourly view helps users judge when exposure is likely to stay high."
          badge="Track"
          badgeTone="muted"
        >
          {uvHistory.length > 0 ? (
            <HourlyUvChart series={uvHistory} />
          ) : (
            <p className="state-note">Hourly UV history will appear once the live feed is ready.</p>
          )}
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
      </div>
    </div>
  )
}

export default HomePage
