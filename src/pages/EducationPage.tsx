import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import Panel from '../components/Panel'
import TrendChart from '../components/TrendChart'
import { insightCards } from '../data/siteData'

function EducationPage() {
  return (
    <div className="page-view">
      <PageIntro
        eyebrow="US2.1 Visualisations of UV impact and skin cancer trends"
        title="Education content that makes invisible risk easier to see"
        description="This page is dedicated to explanation and awareness. It keeps the visualisation work separate from the alert screen so the user can learn without the layout feeling overloaded."
        actions={
          <>
            <Link className="header-action" to="/profile">
              Open personalised guidance
            </Link>
            <Link className="secondary-link" to="/about">
              Read project context
            </Link>
          </>
        }
      />

      <div className="section-grid">
        <Panel
          title="Skin cancer trend snapshot"
          description="Simple line work makes long-term impact feel visible rather than abstract."
          badge="Trend view"
          badgeTone="danger"
        >
          <TrendChart />
        </Panel>

        <Panel
          title="Key insights for young adults"
          description="Compact cards keep this page presentation-ready and shareable."
          badge="Awareness"
          badgeTone="soft"
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
      </div>

      <div className="section-grid">
        <Panel
          title="How to read the visuals"
          description="This page should help users move from abstract health information to a clear mental model."
          badge="Interpretation"
          badgeTone="muted"
        >
          <div className="info-list">
            <div className="info-row">
              <span>Higher peaks</span>
              <strong>Faster accumulation of damage risk</strong>
            </div>
            <div className="info-row">
              <span>Longer trend rise</span>
              <strong>Reinforces that prevention remains important</strong>
            </div>
            <div className="info-row">
              <span>Educational goal</span>
              <strong>Replace vague awareness with concrete caution</strong>
            </div>
          </div>
        </Panel>

        <Panel
          title="Next step after learning"
          description="Once the user understands the risk, the product should route them into personal and practical protection advice."
          badge="Flow"
          badgeTone="soft"
          className="panel-cta"
        >
          <div className="summary-list">
            <span>Go to Profile for skin-tone guidance</span>
            <span>Go to Protection Planner for action</span>
          </div>
          <Link className="inline-link" to="/protection-planner">
            Continue to planner
          </Link>
        </Panel>
      </div>
    </div>
  )
}

export default EducationPage
