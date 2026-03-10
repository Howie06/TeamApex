import { hourlyUv } from '../data/siteData'

function HourlyUvChart() {
  return (
    <div className="bar-chart" aria-label="Hourly UV chart">
      {hourlyUv.map((bar) => (
        <div className="bar-column" key={bar.label}>
          <div className="bar-fill" style={{ height: `${bar.value * 14}px` }} />
          <strong>{bar.value}</strong>
          <span>{bar.label}</span>
        </div>
      ))}
    </div>
  )
}

export default HourlyUvChart
