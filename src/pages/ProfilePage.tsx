import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import Panel from '../components/Panel'
import SkinToneGuide from '../components/SkinToneGuide'
import { currentUv, toneProfiles } from '../data/siteData'

function ProfilePage() {
  const [selectedToneId, setSelectedToneId] = useState<string>(toneProfiles[1].id)
  const selectedTone =
    toneProfiles.find((tone) => tone.id === selectedToneId) ?? toneProfiles[1]

  return (
    <div className="page-view">
      <PageIntro
        eyebrow="US2.2 Skin-tone based guidance"
        title="A dedicated profile page for personal relevance"
        description="Personalisation no longer competes with the education charts or the planner. This page focuses on tailoring guidance to the user profile and showing how that changes the advice."
        actions={
          <>
            <Link className="header-action" to="/education">
              Back to education
            </Link>
            <Link className="secondary-link" to="/protection-planner">
              Use this in planner
            </Link>
          </>
        }
      />

      <div className="section-grid">
        <Panel
          title="Select a skin-tone profile"
          description="Interactive selection previews how future personal guidance can work."
          badge="Profile"
          badgeTone="soft"
        >
          <SkinToneGuide
            profiles={toneProfiles}
            selectedToneId={selectedToneId}
            onSelect={setSelectedToneId}
          />

          <div className="tone-detail dosage-summary-two">
            <div>
              <span className="metric-label">Selected profile</span>
              <strong>{selectedTone.label}</strong>
            </div>
            <div>
              <span className="metric-label">Estimated burn window</span>
              <strong>{selectedTone.burnWindow}</strong>
            </div>
          </div>

          <p className="tone-copy">{selectedTone.guidance}</p>
        </Panel>

        <Panel
          title="Guidance preview for current UV"
          description="Profile-aware messaging changes the emphasis without changing the overall protection goal."
          badge={`UV ${currentUv.value}`}
          badgeTone="danger"
        >
          <div className="callout-box">
            <strong>Design emphasis</strong>
            <p>{selectedTone.emphasis}</p>
          </div>

          <div className="insight-grid">
            <div className="insight-card">
              <strong>Alert wording</strong>
              <p>Shorten the burn window message and raise urgency based on profile sensitivity.</p>
            </div>
            <div className="insight-card">
              <strong>Planner priority</strong>
              <p>Change clothing, dosage, and reminder emphasis to reflect personal risk context.</p>
            </div>
            <div className="insight-card">
              <strong>Daily carry items</strong>
              <p>Keep sunglasses, sunscreen, and coverage cues visible as persistent habits.</p>
            </div>
            <div className="insight-card">
              <strong>Education link</strong>
              <p>Connect the user back to broader awareness content without repeating the whole page.</p>
            </div>
          </div>
        </Panel>
      </div>

      <div className="section-grid">
        <Panel
          title="Saved profile defaults"
          description="These are the kinds of settings this page can own as the product grows."
          badge="Future"
          badgeTone="muted"
        >
          <div className="info-list">
            <div className="info-row">
              <span>Default location</span>
              <strong>{currentUv.city}</strong>
            </div>
            <div className="info-row">
              <span>Safety mode</span>
              <strong>High caution during peak UV</strong>
            </div>
            <div className="info-row">
              <span>Preferred next step</span>
              <strong>Route to planner after alert</strong>
            </div>
          </div>
        </Panel>

        <Panel
          title="Where this profile data flows"
          description="Personalisation should strengthen the rest of the product rather than sit in isolation."
          badge="Flow"
          badgeTone="soft"
          className="panel-cta"
        >
          <div className="summary-list">
            <span>Sharper alert wording</span>
            <span>More relevant planner defaults</span>
            <span>Education that feels specific</span>
          </div>
        </Panel>
      </div>
    </div>
  )
}

export default ProfilePage
