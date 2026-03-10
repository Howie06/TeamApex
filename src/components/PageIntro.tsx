import type { ReactNode } from 'react'

type PageIntroProps = {
  eyebrow: string
  title: string
  description: string
  actions?: ReactNode
  aside?: ReactNode
}

function PageIntro({ eyebrow, title, description, actions, aside }: PageIntroProps) {
  return (
    <section className={`page-hero ${aside ? 'page-hero-split' : 'page-hero-single'}`.trim()}>
      <div className="page-hero-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-hero-text">{description}</p>
        {actions ? <div className="hero-actions">{actions}</div> : null}
      </div>

      {aside ? <div className="page-hero-aside">{aside}</div> : null}
    </section>
  )
}

export default PageIntro
