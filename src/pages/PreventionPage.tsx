import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import Panel from '../components/Panel'
import PlannerForm from '../components/PlannerForm'
import ReminderTimeline from '../components/ReminderTimeline'
import {
  currentUv,
  dosageCards,
  outfitCards,
  preventionChecklist,
  reminderTimeline,
} from '../data/siteData'

function PreventionPage() {
  const [remindersEnabled, setRemindersEnabled] = useState(true)

  return (
    <div className="page-view">
      <PageIntro
        eyebrow="EPIC 3 · Prevent"
        title="Prevent UV overexposure with practical protection decisions."
        description="This page groups the prevention epic into one action surface. Clothing, sunscreen dosage, and reminder support now live together instead of being split across separate pages."
        actions={
          <>
            <Link className="header-action" to="/">
              Back to track
            </Link>
            <Link className="secondary-link" to="/skin-guide">
              Revisit skin guidance
            </Link>
          </>
        }
        aside={
          <div className="stack">
            <div className="callout-box">
              <strong>User stories on this page</strong>
              <p>
                US3.1 explains sunscreen dosage, US3.2 handles reminders, and US3.3 gives
                clothing recommendations based on the UV index.
              </p>
            </div>

            <div className="summary-list">
              <span>Must have: US3.3</span>
              <span>Should have: US3.1</span>
              <span>Should have: US3.2</span>
            </div>
          </div>
        }
      />

      <div className="section-grid">
        <div className="stack">
          <Panel
            title="Plan today's outdoor protection"
            description="A lightweight planner keeps prevention actionable under the current UV conditions."
            badge={`UV ${currentUv.value}`}
            badgeTone="danger"
          >
            <PlannerForm uvValue={currentUv.value} />
          </Panel>

          <Panel
            title="US3.3 Clothing recommendations based on UV index"
            description="This must-have story connects the UV number to practical carry items and clothing choices."
            badge="Must have"
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
            title="US3.1 Sunscreen dosage guidance"
            description="Body-zone dosage cards keep the advice legible instead of forcing users to estimate."
            badge="Should have"
            badgeTone="soft"
          >
            <div className="dosage-summary dosage-summary-two">
              <div>
                <span className="metric-label">Suggested total</span>
                <strong>4.5 - 5.5 tsp</strong>
              </div>
              <div>
                <span className="metric-label">Best use today</span>
                <strong>Prioritise all exposed areas</strong>
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
            title="US3.2 Sunscreen reminders"
            description="Reminder behaviour supports long exposure days without overcrowding the core protection advice."
            badge="Should have"
            badgeTone="soft"
          >
            <ReminderTimeline
              items={reminderTimeline}
              enabled={remindersEnabled}
              onToggle={() => setRemindersEnabled((enabled) => !enabled)}
            />
          </Panel>

          <Panel
            title="Daily prevention summary"
            description="This section closes the loop from live warning to protection behaviour."
            badge="Checklist"
            badgeTone="muted"
            className="panel-cta"
          >
            <div className="summary-list">
              {preventionChecklist.map((item) => (
                <span key={item}>{item}</span>
              ))}
              <span>{remindersEnabled ? 'Reminder set for 3:15 PM' : 'Reminders currently paused'}</span>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}

export default PreventionPage
