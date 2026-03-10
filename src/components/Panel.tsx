import type { ReactNode } from 'react'

type BadgeTone = 'soft' | 'danger' | 'muted'

type PanelProps = {
  title: string
  description?: string
  badge?: string
  badgeTone?: BadgeTone
  className?: string
  children: ReactNode
}

function Panel({
  title,
  description,
  badge,
  badgeTone = 'soft',
  className,
  children,
}: PanelProps) {
  return (
    <article className={['panel', className].filter(Boolean).join(' ')}>
      <div className="panel-head">
        <div>
          <h3>{title}</h3>
          {description ? <p>{description}</p> : null}
        </div>
        {badge ? <span className={`card-chip ${badgeTone}`}>{badge}</span> : null}
      </div>
      {children}
    </article>
  )
}

export default Panel
