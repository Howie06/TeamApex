import { useState } from 'react'

type PlannerFormProps = {
  uvValue: number
}

const activityAdvice = {
  commute: 'Pack sunglasses and keep a quick reapply option in your bag.',
  study: 'Choose shaded seating and avoid long open-sun sessions around midday.',
  sport: 'Use stronger coverage and schedule a hard reminder before activity starts.',
  beach: 'Treat this as full exposure and plan around repeated sunscreen use.',
} as const

const durationAdvice = {
  short: 'One well-applied layer before leaving is the minimum.',
  medium: 'Plan at least one reminder during the active UV window.',
  long: 'Build the day around shade breaks, reapplication, and stronger coverage.',
} as const

const exposureAdvice = {
  partial: 'Protected walkways and indoor pauses still reduce total exposure.',
  mixed: 'Switch clothing and sunscreen strategy as you move between sun and shade.',
  full: 'Use the most protective clothing set and expect repeated sunscreen use.',
} as const

function PlannerForm({ uvValue }: PlannerFormProps) {
  const [activity, setActivity] = useState<keyof typeof activityAdvice>('commute')
  const [duration, setDuration] = useState<keyof typeof durationAdvice>('medium')
  const [exposure, setExposure] = useState<keyof typeof exposureAdvice>('mixed')

  const reminderText =
    duration === 'long' || activity === 'sport' || activity === 'beach'
      ? 'Set a 2-hour reapply reminder.'
      : 'Set one reminder before the peak window ends.'

  const dosageText =
    exposure === 'full' || activity === 'beach'
      ? 'Aim for full exposed-area coverage before leaving.'
      : 'Focus on face, neck, arms, and any other uncovered skin.'

  return (
    <div className="planner-form-shell">
      <div className="planner-form-grid">
        <label className="form-field">
          <span>Activity</span>
          <select
            value={activity}
            onChange={(event) => setActivity(event.target.value as keyof typeof activityAdvice)}
          >
            <option value="commute">Campus commute</option>
            <option value="study">Outdoor study</option>
            <option value="sport">Sport or exercise</option>
            <option value="beach">Beach or open recreation</option>
          </select>
        </label>

        <label className="form-field">
          <span>Outdoor duration</span>
          <select
            value={duration}
            onChange={(event) => setDuration(event.target.value as keyof typeof durationAdvice)}
          >
            <option value="short">Under 30 minutes</option>
            <option value="medium">30 to 90 minutes</option>
            <option value="long">More than 90 minutes</option>
          </select>
        </label>

        <label className="form-field">
          <span>Exposure type</span>
          <select
            value={exposure}
            onChange={(event) => setExposure(event.target.value as keyof typeof exposureAdvice)}
          >
            <option value="partial">Mostly shaded</option>
            <option value="mixed">Mixed sun and shade</option>
            <option value="full">Mostly open sun</option>
          </select>
        </label>
      </div>

      <div className="planner-plan">
        <strong>Suggested plan for UV {uvValue}</strong>
        <p>{activityAdvice[activity]}</p>
        <p>{durationAdvice[duration]}</p>
        <p>{exposureAdvice[exposure]}</p>
        <div className="summary-list">
          <span>{reminderText}</span>
          <span>{dosageText}</span>
          <span>Hat and sunglasses stay high priority.</span>
        </div>
      </div>
    </div>
  )
}

export default PlannerForm
