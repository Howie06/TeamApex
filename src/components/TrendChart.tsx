type TrendPoint = {
  label: string
  value: number
}

type TrendChartProps = {
  series: TrendPoint[]
  ariaLabel: string
}

function TrendChart({ series, ariaLabel }: TrendChartProps) {
  const maxValue = Math.max(...series.map((point) => point.value), 1)
  const minValue = Math.min(...series.map((point) => point.value), maxValue)
  const valueRange = Math.max(maxValue - minValue, 1)

  const chartPoints = series
    .map((point, index) => {
      const x = series.length > 1 ? (index / (series.length - 1)) * 100 : 50
      const normalizedValue = ((point.value - minValue) / valueRange) * 72 + 14
      const y = 100 - normalizedValue
      return `${x},${y}`
    })
    .join(' ')

  return (
    <>
      <div className="trend-chart" aria-label={ariaLabel}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            points={chartPoints}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {series.map((point, index) => {
            const x = series.length > 1 ? (index / (series.length - 1)) * 100 : 50
            const normalizedValue = ((point.value - minValue) / valueRange) * 72 + 14
            const y = 100 - normalizedValue
            return <circle key={point.label} cx={x} cy={y} r="3.2" />
          })}
        </svg>
      </div>

      <div className="axis-row">
        {series.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </>
  )
}

export default TrendChart
