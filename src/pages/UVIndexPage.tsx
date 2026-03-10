import { Link } from 'react-router-dom'
import HourlyUvChart from '../components/HourlyUvChart'
import PageIntro from '../components/PageIntro'
import Panel from '../components/Panel'
import UVHeroCard from '../components/UVHeroCard'
import { alertActions } from '../data/siteData'

function UVIndexPage() {
  return (
    <div className="page-view">
      <PageIntro
        eyebrow="US1.1 Real-time localised UV alerts"
        title="Immediate UV warning and next-step guidance"
        description="This page focuses only on the live index experience: current risk, local context, hourly pattern, and what the user should do right now."
        actions={
          <>
            <Link className="header-action" to="/protection-planner">
              Continue to protection planner
            </Link>
            <Link className="secondary-link" to="/profile">
              Personalise guidance
            </Link>
          </>
        }
      />

      <div className="section-grid">
        <UVHeroCard />

        <Panel
          title="Local context"
          description="The alert becomes more credible when it is tied to location, movement, and the next exposure window."
          badge="Melbourne"
          badgeTone="muted"
        >
          <div className="info-list">
            <div className="info-row">
              <span>Exposure window</span>
              <strong>High from 11 AM onward</strong>
            </div>
            <div className="info-row">
              <span>Walking between classes</span>
              <strong>Use shade-first routes</strong>
            </div>
            <div className="info-row">
              <span>Outdoor lunch risk</span>
              <strong>Reapply before 3 PM</strong>
            </div>
          </div>
        </Panel>
      </div>

      <div className="section-grid">
        <Panel
          title="What to do right now"
          description="Short action blocks keep the alert useful under time pressure."
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
          title="Today's hourly UV pattern"
          description="A simple forecast view helps the user understand when the risk will stay elevated."
          badge="Hourly"
          badgeTone="muted"
        >
          <HourlyUvChart />
        </Panel>
      </div>
    </div>
  )
}

export default UVIndexPage
