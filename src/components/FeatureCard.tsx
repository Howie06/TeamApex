import { Link } from 'react-router-dom'
import type { FeatureItem } from '../data/siteData'

type FeatureCardProps = FeatureItem & {
  ctaLabel?: string
}

function FeatureCard({
  story,
  title,
  category,
  description,
  benefit,
  path,
  ctaLabel = 'Open page',
}: FeatureCardProps) {
  return (
    <article className="feature-card">
      <div className="feature-meta">
        <span>{story}</span>
        <span>{category}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <strong>{benefit}</strong>
      <Link className="inline-link" to={path}>
        {ctaLabel}
      </Link>
    </article>
  )
}

export default FeatureCard
