import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import Panel from '../components/Panel'
import PlannerForm from '../components/PlannerForm'
import ReminderTimeline from '../components/ReminderTimeline'
import { currentUv, dosageCards, outfitCards, reminderTimeline } from '../data/siteData'

function ProtectionPlannerPage() {
  const [remindersEnabled, setRemindersEnabled] = useState(true)

  return (
    <div className="page-view">
      <PageIntro
        eyebrow="US3.1 + US3.2 + US3.3 Protection Planner"
        title="A dedicated page for practical prevention"
        description="Protection planning is now separated from the homepage so clothing advice, sunscreen dosage, and reminders can grow as real product features."
        actions={
          <>
            <Link className="header-action" to="/uv-index">
              Back to live UV
            </Link>
            <Link className="secondary-link" to="/profile">
              Adjust personal guidance
            </Link>
          </>
        }
      />

      <div className="section-grid">
        <div className="stack">
          <Panel
            title="Plan today's outdoor protection"
            description="A lightweight planner form keeps the page interactive and ready for future expansion."
            badge={`UV ${currentUv.value}`}
            badgeTone="danger"
          >
            <PlannerForm uvValue={currentUv.value} />
          </Panel>

          <Panel
            title="Clothing recommendations based on UV"
            description="Outfit suggestions are framed as practical choices for a very high UV day."
            badge="US3.3"
            badgeTone="danger"
          >
            <div className="outfit-grid">
              {outfitCards.map((item) => (
                <div className="outfit-card" key={item.title}>
                  <span className="outfit-badge">{item.label}</span>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="stack">
          <Panel
            title="Sunscreen dosage guidance"
            description="Amounts are broken into body zones so the advice stays usable at a glance."
            badge="US3.1"
            badgeTone="soft"
          >
            <div className="dosage-summary dosage-summary-two">
              <div>
                <span className="metric-label">Suggested total</span>
                <strong>4.5 - 5.5 tsp</strong>
              </div>
              <div>
                <span className="metric-label">For today</span>
                <strong>Prioritise exposed areas</strong>
              </div>
            </div>

            <div className="dosage-grid">
              {dosageCards.map((dose) => (
                <div className="dosage-card" key={dose.area}>
                  <strong>{dose.area}</strong>
                  <span>{dose.amount}</span>
                  <p>{dose.note}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            title="Sunscreen reminders"
            description="Reminder behaviour now lives on its own page, where it belongs."
            badge="US3.2"
            badgeTone="soft"
          >
            <ReminderTimeline
              items={reminderTimeline}
              enabled={remindersEnabled}
              onToggle={() => setRemindersEnabled((enabled) => !enabled)}
            />
          </Panel>

          <Panel
            title="Daily protection summary"
            description="This closes the loop from warning to action."
            badge="Checklist"
            badgeTone="muted"
            className="panel-cta"
          >
            <div className="summary-list">
              <span>SPF 50+ before next walk</span>
              <span>Hat + sunglasses packed</span>
              <span>{remindersEnabled ? 'Reminder set for 3:15 PM' : 'Reminders currently paused'}</span>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}

export default ProtectionPlannerPage
