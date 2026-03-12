import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import Panel from '../components/Panel'
import PlannerForm from '../components/PlannerForm'
import ReminderManager from '../components/ReminderManager'
import { useSunSafety } from '../context/useSunSafety'
import { usePreventionData } from '../hooks/usePreventionData'
import { useReminders } from '../hooks/useReminders'

function PreventionPage() {
  const { currentUv } = useSunSafety()
  const { dosage, error, loading, recommendation } = usePreventionData(currentUv?.uv_index ?? null)
  const reminders = useReminders()

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
      />

      <div className="section-grid">
        <div className="stack">
          <Panel
            title="Plan today's outdoor protection"
            description="A lightweight planner keeps prevention actionable under the current UV conditions."
            badge={`UV ${currentUv?.uv_index.toFixed(1) ?? '--'}`}
            badgeTone="danger"
          >
            <PlannerForm uvValue={currentUv?.uv_index ?? 0} />
          </Panel>

          <Panel
            title="Clothing recommendations based on UV index"
            description="This must-have story connects the UV number to practical carry items and clothing choices."
            badge="Must have"
            badgeTone="danger"
          >
            {loading ? (
              <p className="state-note">Loading clothing recommendations...</p>
            ) : error ? (
              <p className="state-note state-note-error">{error}</p>
            ) : recommendation ? (
              <>
                <div className="outfit-grid">
                  <div className="outfit-card">
                    <span className="outfit-badge">Wear</span>
                    <strong>Protective clothing</strong>
                    <p>{recommendation.clothing_advice}</p>
                  </div>
                  <div className="outfit-card">
                    <span className="outfit-badge">Apply</span>
                    <strong>Sunscreen strategy</strong>
                    <p>{recommendation.sunscreen_advice}</p>
                  </div>
                  <div className="outfit-card">
                    <span className="outfit-badge">Plan</span>
                    <strong>General protection</strong>
                    <p>{recommendation.general_advice}</p>
                  </div>
                  <div className="outfit-card">
                    <span className="outfit-badge">Risk</span>
                    <strong>{recommendation.risk_level} UV response</strong>
                    <p>{currentUv?.human_alert ?? 'Live UV guidance will appear here.'}</p>
                  </div>
                </div>

                <div className="summary-list">
                  {recommendation.checklist.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </>
            ) : null}
          </Panel>
        </div>

        <div className="stack">
          <Panel
            title="Sunscreen dosage guidance"
            description="Body-zone dosage cards keep the advice legible instead of forcing users to estimate."
            badge="Should have"
            badgeTone="soft"
          >
            {loading ? (
              <p className="state-note">Loading dosage guidance...</p>
            ) : error ? (
              <p className="state-note state-note-error">{error}</p>
            ) : dosage ? (
              <>
                <div className="dosage-summary dosage-summary-two">
                  <div>
                    <span className="metric-label">Risk level</span>
                    <strong>{dosage.risk_level}</strong>
                  </div>
                  <div>
                    <span className="metric-label">Body zones</span>
                    <strong>{dosage.dosage_guide.length} coverage areas</strong>
                  </div>
                </div>

                <p className="tone-copy">{dosage.dosage_advice}</p>

                <div className="dosage-grid">
                  {dosage.dosage_guide.map((dose) => (
                    <div className="dosage-card" key={dose.area}>
                      <strong>{dose.area}</strong>
                      <span>{dose.amount}</span>
                      <p>{dose.note}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </Panel>

          <Panel
            title="Sunscreen reminders"
            description="Reminder behaviour supports long exposure days without overcrowding the core protection advice."
            badge="Should have"
            badgeTone="soft"
          >
            <ReminderManager
              reminders={reminders.reminders}
              loading={reminders.loading}
              saving={reminders.saving}
              error={reminders.error}
              onCreate={reminders.addReminder}
              onUpdate={reminders.editReminder}
              onDelete={reminders.removeReminder}
            />
          </Panel>
        </div>
      </div>
    </div>
  )
}

export default PreventionPage
