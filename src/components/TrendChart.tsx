import { trendSeries } from '../data/siteData'

function TrendChart() {
  const chartPoints = trendSeries
    .map((point, index) => {
      const x = (index / (trendSeries.length - 1)) * 100
      const y = 100 - point.value
      return `${x},${y}`
    })
    .join(' ')

  return (
    <>
      <div className="trend-chart" aria-label="Skin cancer trend chart">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            points={chartPoints}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {trendSeries.map((point, index) => {
            const x = (index / (trendSeries.length - 1)) * 100
            const y = 100 - point.value
            return <circle key={point.year} cx={x} cy={y} r="3.2" />
          })}
        </svg>
      </div>

      <div className="axis-row">
        {trendSeries.map((point) => (
          <span key={point.year}>{point.year}</span>
        ))}
      </div>
    </>
  )
}

export default TrendChart
