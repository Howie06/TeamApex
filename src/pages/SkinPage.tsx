import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import Panel from '../components/Panel'
import SkinToneGuide from '../components/SkinToneGuide'
import TrendChart from '../components/TrendChart'
import { useSunSafety } from '../context/useSunSafety'
import { skinInterpretationRows, skinToneOptions } from '../data/siteData'
import { useAwarenessData } from '../hooks/useAwarenessData'
import { useSkinGuidance } from '../hooks/useSkinGuidance'

const SKIN_TONE_STORAGE_KEY = 'teamapex.selected-skin-tone'
const initialTone = skinToneOptions[1] ?? skinToneOptions[0]

function SkinPage() {
  const [selectedToneId, setSelectedToneId] = useState<string>(() => {
    const savedToneId = window.localStorage.getItem(SKIN_TONE_STORAGE_KEY)
    return savedToneId ?? initialTone.id
  })
  const { currentUv } = useSunSafety()
  const { loading, error, myths, skinCancerTrend, uvTrend } = useAwarenessData()
  const selectedTone = skinToneOptions.find((tone) => tone.id === selectedToneId) ?? initialTone
  const {
    data: skinGuidance,
    error: guidanceError,
    loading: guidanceLoading,
  } = useSkinGuidance(currentUv?.uv_index ?? null, selectedTone.skinType)

  function handleToneSelect(toneId: string) {
    setSelectedToneId(toneId)
    window.localStorage.setItem(SKIN_TONE_STORAGE_KEY, toneId)
  }

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
              <span>Current UV {currentUv?.uv_index.toFixed(1) ?? '--'}</span>
              <span>{currentUv?.location ?? 'Resolving location'}</span>
            </div>
          </div>
        }
      />

      <div className="section-grid">
        <div className="stack">
          <Panel
            title="US2.1 Skin cancer impact trend"
            description="This chart turns long-term UV harm into a simple visual story for awareness."
            badge="Must have"
            badgeTone="danger"
          >
            {loading ? (
              <p className="state-note">Loading skin cancer trend...</p>
            ) : error ? (
              <p className="state-note state-note-error">{error}</p>
            ) : skinCancerTrend ? (
              <TrendChart
                ariaLabel="Skin cancer trend chart"
                series={skinCancerTrend.series.map((point) => ({
                  label: point.label,
                  value: point.value,
                }))}
              />
            ) : null}
          </Panel>

          <Panel
            title="US2.1 Australia UV and heat trend"
            description="The second chart explains why repeated high-UV days make prevention feel urgent."
            badge="Must have"
            badgeTone="muted"
          >
            {loading ? (
              <p className="state-note">Loading Australia UV trend...</p>
            ) : error ? (
              <p className="state-note state-note-error">{error}</p>
            ) : uvTrend ? (
              <TrendChart
                ariaLabel="Australia UV exposure trend chart"
                series={uvTrend.series.map((point) => ({
                  label: point.label,
                  value: point.value,
                }))}
              />
            ) : null}

            <div className="info-list">
              {skinInterpretationRows.map((row) => (
                <div className="info-row" key={row.label}>
                  <span>{row.label}</span>
                  <strong>{row.value}</strong>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel
          title="US2.2 Skin-tone based guidance"
          description="Tone selection personalises urgency without changing the core need for protection."
          badge="Should have"
          badgeTone="soft"
        >
          <SkinToneGuide
            profiles={skinToneOptions}
            selectedToneId={selectedToneId}
            onSelect={handleToneSelect}
          />

          <div className="tone-detail dosage-summary-two">
            <div>
              <span className="metric-label">Selected profile</span>
              <strong>{selectedTone.label}</strong>
            </div>
            <div>
              <span className="metric-label">Estimated burn window</span>
              <strong>{skinGuidance?.burn_window ?? 'Loading'}</strong>
            </div>
          </div>

          <p className="tone-copy">
            {guidanceLoading
              ? 'Loading personalised skin guidance for the current UV conditions.'
              : skinGuidance?.guidance ?? guidanceError ?? 'Skin guidance is not available yet.'}
          </p>

          <div className="callout-box">
            <strong>Current emphasis at UV {currentUv?.uv_index.toFixed(1) ?? '--'}</strong>
            <p>
              {skinGuidance?.emphasis ??
                'The selected tone will surface a protection emphasis once the live UV reading is ready.'}
            </p>
          </div>
        </Panel>
      </div>

      <div className="section-grid">
        <Panel
          title="Myths and facts for awareness sharing"
          description="These myth cards help young adults explain UV risk to friends in plain language."
          badge="Understand"
          badgeTone="muted"
        >
          {loading ? (
            <p className="state-note">Loading myth and fact cards...</p>
          ) : error ? (
            <p className="state-note state-note-error">{error}</p>
          ) : myths ? (
            <div className="insight-grid">
              {myths.items.map((item) => (
                <div className="insight-card" key={item.id}>
                  <strong>{item.title}</strong>
                  <p className="myth-line">Myth: {item.myth}</p>
                  <p>Fact: {item.fact}</p>
                </div>
              ))}
            </div>
          ) : null}
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
              <strong>Users see how urgency changes by skin context and current UV.</strong>
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
