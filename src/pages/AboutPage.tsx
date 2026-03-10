import FeatureCard from '../components/FeatureCard'
import PageIntro from '../components/PageIntro'
import Panel from '../components/Panel'
import { aboutHighlights, coreFeatures, navItems } from '../data/siteData'

function AboutPage() {
  return (
    <div className="page-view">
      <PageIntro
        eyebrow="Project context"
        title="About the SunSafe Victoria prototype"
        description="This page explains the project purpose, the modular page structure, and the feature roadmap that now sits behind routed navigation instead of one long scrolling screen."
      />

      <div className="section-grid">
        <Panel
          title="Project highlights"
          description="The product is designed around immediate warning, explainable risk, and practical behaviour change."
          badge="Overview"
          badgeTone="soft"
        >
          <div className="insight-grid">
            {aboutHighlights.map((item) => (
              <div className="insight-card" key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Current page map"
          description="The app now has a clearer division of responsibilities."
          badge="Routes"
          badgeTone="muted"
        >
          <div className="info-list">
            {navItems.map((item) => (
              <div className="info-row" key={item.path}>
                <span>{item.label}</span>
                <strong>{item.path}</strong>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Feature roadmap</p>
            <h2>The original six functions are still present, now split into clearer destinations.</h2>
          </div>
        </div>

        <div className="feature-grid">
          {coreFeatures.map((feature) => (
            <FeatureCard key={feature.id} {...feature} ctaLabel="View assigned page" />
          ))}
        </div>
      </section>
    </div>
  )
}

export default AboutPage
