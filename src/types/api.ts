export type LocationSummary = {
  id: number
  name: string
  state: string
  country: string
  latitude: number
  longitude: number
  display_name: string
  peak_window: string
}

export type UvCurrentResponse = {
  location: string
  uv_index: number
  risk_level: string
  risk_color: string
  warning_message: string
  human_alert: string
  estimated_damage_window: string
  recorded_at: string
  source: string
  peak_window: string
}

export type UvHistoryPoint = {
  recorded_at: string
  uv_index: number
}

export type UvHistoryResponse = {
  location: string
  series: UvHistoryPoint[]
  source: string
}

export type AwarenessPoint = {
  label: string
  value: number
  description: string
}

export type AwarenessTrendResponse = {
  title: string
  metric: string
  source: string
  series: AwarenessPoint[]
}

export type MythFact = {
  id: number
  title: string
  myth: string
  fact: string
  category: string
}

export type MythFactListResponse = {
  source: string
  items: MythFact[]
}

export type PreventionRecommendationResponse = {
  uv_index: number
  risk_level: string
  clothing_advice: string
  sunscreen_advice: string
  general_advice: string
  checklist: string[]
}

export type DosageGuideItem = {
  area: string
  amount: string
  note: string
}

export type SunscreenDosageResponse = {
  uv_index: number
  risk_level: string
  dosage_advice: string
  dosage_guide: DosageGuideItem[]
}

export type SkinGuidanceResponse = {
  uv_index: number
  skin_type: string
  burn_window: string
  guidance: string
  emphasis: string
}

export type Reminder = {
  id: number
  title: string
  reminder_time: string
  frequency: string
  status: string
  notes: string
  created_at: string
  updated_at: string
}

export type ReminderCreatePayload = {
  title: string
  reminder_time: string
  frequency: string
  status: string
  notes: string
}

export type ReminderUpdatePayload = Partial<ReminderCreatePayload>
