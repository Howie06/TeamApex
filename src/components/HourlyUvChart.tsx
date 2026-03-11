import type { UvHistoryPoint } from '../types/api'

type HourlyUvChartProps = {
  series: UvHistoryPoint[]
}

function formatHourLabel(recordedAt: string) {
  const parsedDate = new Date(recordedAt)

  if (Number.isNaN(parsedDate.getTime())) {
    return recordedAt
  }

  return parsedDate.toLocaleTimeString('en-AU', {
    hour: 'numeric',
    minute: undefined,
  })
}

function HourlyUvChart({ series }: HourlyUvChartProps) {
  const safeSeries = series.length > 0 ? series : []

  return (
    <div className="bar-chart" aria-label="Hourly UV chart">
      {safeSeries.map((bar) => (
        <div className="bar-column" key={bar.recorded_at}>
          <div className="bar-fill" style={{ height: `${Math.max(bar.uv_index, 1) * 14}px` }} />
          <strong>{bar.uv_index.toFixed(1)}</strong>
          <span>{formatHourLabel(bar.recorded_at)}</span>
        </div>
      ))}
    </div>
  )
}

export default HourlyUvChart
