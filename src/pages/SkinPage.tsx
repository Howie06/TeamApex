import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import Panel from '../components/Panel'
import SkinToneGuide from '../components/SkinToneGuide'
import TrendChart from '../components/TrendChart'
import {
  currentUv,
  insightCards,
  skinInterpretationRows,
  toneProfiles,
} from '../data/siteData'

const initialTone = toneProfiles[1] ?? toneProfiles[0]

function SkinPage() {
  const [selectedToneId, setSelectedToneId] = useState<string>(initialTone.id)
  const selectedTone = toneProfiles.find((tone) => tone.id === selectedToneId) ?? initialTone

  return (
    <div className="page-view">
      <PageIntro
        eyebrow="EPIC 2 · Understand"
        title="Understand how UV affects skin, not just the weather."
        description="This page combines the awareness epic into one place. It uses visual insight to explain harm, then personalises the message with skin-tone based guidance."
        actions={
          <>
            <Link className="header-action" to="/">
              Back to track
            </Link>
            <Link className="secondary-link" to="/prevention">
              Continue to prevention
            </Link>
          </>
        }
        aside={
          <div className="stack">
            <div className="callout-box">
              <strong>User stories on this page</strong>
              <p>
                US2.1 covers UV impact and skin cancer visualisations. US2.2 adds skin-tone based
                guidance for more personal awareness.
              </p>
            </div>

            <div className="summary-list">
              <span>Must have: US2.1</span>
              <span>Should have: US2.2</span>
              <span>Current UV {currentUv.value}</span>
            </div>
          </div>
        }
      />

      <div className="section-grid">
        <Panel
          title="US2.1 UV impact and skin cancer trends"
          description="Simple visualisation keeps long-term harm visible and easier to explain."
          badge="Must have"
          badgeTone="danger"
        >
          <TrendChart />

          <div className="info-list">
            {skinInterpretationRows.map((row) => (
              <div className="info-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="US2.2 Skin-tone based guidance"
          description="Tone selection personalises urgency without changing the core need for protection."
          badge="Should have"
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

          <div className="callout-box">
            <strong>Current emphasis at UV {currentUv.value}</strong>
            <p>{selectedTone.emphasis}</p>
          </div>
        </Panel>
      </div>

      <div className="section-grid">
        <Panel
          title="Simple visual insights for awareness"
          description="These cards turn complex health messaging into something users can scan quickly."
          badge="Understand"
          badgeTone="muted"
        >
          <div className="insight-grid">
            {insightCards.map((card) => (
              <div className="insight-card" key={card.title}>
                <strong>{card.title}</strong>
                <p>{card.detail}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="What this page should lead to next"
          description="Awareness matters only if the user can carry it into protection planning."
          badge="Flow"
          badgeTone="soft"
          className="panel-cta"
        >
          <div className="info-list">
            <div className="info-row">
              <span>After the chart</span>
              <strong>Users understand why today's UV exposure matters.</strong>
            </div>
            <div className="info-row">
              <span>After tone selection</span>
              <strong>Users see how urgency changes by skin context.</strong>
            </div>
            <div className="info-row">
              <span>Next action</span>
              <strong>Move into clothing, sunscreen, and reminder planning.</strong>
            </div>
          </div>

          <Link className="inline-link" to="/prevention">
            Open prevention page
          </Link>
        </Panel>
      </div>
    </div>
  )
}

export default SkinPage
