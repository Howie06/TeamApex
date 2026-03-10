export type NavItem = {
  label: string
  path: string
}

export type FeatureItem = {
  id: string
  story: string
  title: string
  category: string
  description: string
  benefit: string
  path: string
}

export type ToneProfile = {
  id: string
  label: string
  swatch: string
  burnWindow: string
  guidance: string
  emphasis: string
}

export const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Skin Guide', path: '/skin-guide' },
  { label: 'Prevention', path: '/prevention' },
]

export const currentUv = {
  city: 'Melbourne, VIC',
  value: 9,
  max: 11,
  risk: 'Very High',
  updatedAt: 'Updated 1:20 PM',
  peakWindow: '11:00 AM - 3:00 PM',
}

export const coreFeatures: FeatureItem[] = [
  {
    id: 'epic1',
    story: 'EPIC 1',
    title: 'Track local UV levels',
    category: 'Track',
    description:
      'The homepage keeps live local UV information front and center so users can see risk immediately.',
    benefit: 'US1.1 Must have: real-time localised UV alerts.',
    path: '/',
  },
  {
    id: 'epic2',
    story: 'EPIC 2',
    title: 'Understand skin impact',
    category: 'Understand',
    description:
      'Visualisations and skin-tone guidance turn climate and health data into simple awareness.',
    benefit: 'US2.1 Must have plus US2.2 Should have.',
    path: '/skin-guide',
  },
  {
    id: 'epic3',
    story: 'EPIC 3',
    title: 'Prevent overexposure',
    category: 'Prevent',
    description:
      'Protection guidance translates awareness into clothing, dosage, and reminder actions.',
    benefit: 'US3.3 Must have with US3.1 and US3.2 as supporting stories.',
    path: '/prevention',
  },
]

export const trackContextRows = [
  {
    label: 'Current risk level',
    value: 'Very high conditions need immediate protection before longer outdoor travel.',
  },
  {
    label: 'Local context',
    value: 'Walking between classes and outdoor lunch periods are the main exposure moments today.',
  },
  {
    label: 'Primary next action',
    value: 'Apply SPF 50+, choose shade-first routes, and reduce time in direct midday sun.',
  },
]

export const alertActions = [
  {
    title: 'Before heading outside',
    detail: 'Apply SPF 50+, pack sunglasses, and move your first walk into the shaded side of campus.',
  },
  {
    title: 'During the peak window',
    detail: 'Keep outdoor exposure short and prioritise covered or indoor waiting areas.',
  },
  {
    title: 'For longer afternoon activity',
    detail: 'Reapply sunscreen and switch to longer sleeves when UV stays above 6.',
  },
]

export const hourlyUv = [
  { label: '8 AM', value: 2 },
  { label: '10 AM', value: 5 },
  { label: '12 PM', value: 8 },
  { label: '2 PM', value: 9 },
  { label: '4 PM', value: 6 },
]

export const trendSeries = [
  { year: '2021', value: 34 },
  { year: '2022', value: 41 },
  { year: '2023', value: 47 },
  { year: '2024', value: 56 },
  { year: '2025', value: 64 },
]

export const toneProfiles: ToneProfile[] = [
  {
    id: 'tone-light',
    label: 'Light',
    swatch: '#f3d7c1',
    burnWindow: '10-15 min',
    guidance: 'Higher sensitivity. Early protection matters even when the day feels mild.',
    emphasis: 'Use SPF 50+, shade first, and reapply before the peak block starts.',
  },
  {
    id: 'tone-medium',
    label: 'Medium',
    swatch: '#d4a784',
    burnWindow: '20-30 min',
    guidance: 'Can still burn quickly at UV 9, especially on shoulders, nose, and neck.',
    emphasis: 'Pack sunglasses and a hat, and avoid assuming a tan equals protection.',
  },
  {
    id: 'tone-olive',
    label: 'Olive',
    swatch: '#a77455',
    burnWindow: '30-40 min',
    guidance: 'Visible burning may take longer, but DNA damage still builds under strong UV.',
    emphasis: 'Use lightweight long sleeves and keep reapplication on schedule.',
  },
  {
    id: 'tone-deep',
    label: 'Deep',
    swatch: '#6c4735',
    burnWindow: '40+ min',
    guidance: 'Lower burn visibility does not remove the need for eye and skin protection.',
    emphasis: 'Prioritise sunglasses, sunscreen, and midday shade for consistent prevention.',
  },
]

export const insightCards = [
  {
    title: 'Burn risk',
    detail: 'At UV 9, exposed skin can begin taking damage in well under half an hour.',
  },
  {
    title: 'Trend meaning',
    detail: 'Longer-term rises in UV-driven harm make prevention messaging more urgent, not less.',
  },
  {
    title: 'Skin-tone context',
    detail: 'Different skin tones change visible burn timing, but they do not remove the need for protection.',
  },
  {
    title: 'Shareable takeaway',
    detail: 'Simple visuals help students explain UV risk to friends and classmates in plain language.',
  },
]

export const skinInterpretationRows = [
  {
    label: 'US2.1 outcome',
    value: 'Users can see how invisible UV exposure connects to long-term skin harm and cancer trends.',
  },
  {
    label: 'US2.2 outcome',
    value: 'Users can compare how skin-tone context changes urgency, timing, and advice emphasis.',
  },
  {
    label: 'Design goal',
    value: 'Complex health and climate information should feel readable within a few seconds.',
  },
]

export const outfitCards = [
  {
    label: 'Hat',
    title: 'Wide-brim hat',
    detail: 'Better face and neck coverage than a cap when UV is very high.',
  },
  {
    label: 'Eyes',
    title: 'UV-rated sunglasses',
    detail: 'Useful for walking between classes or waiting outside transport stops.',
  },
  {
    label: 'Top',
    title: 'Light long sleeves',
    detail: 'Breathable layers reduce direct exposure on shoulders and forearms.',
  },
  {
    label: 'Carry',
    title: 'Pocket sunscreen',
    detail: 'Keep a travel-size SPF nearby so reapplication is realistic, not optional.',
  },
]

export const dosageCards = [
  {
    area: 'Face + neck',
    amount: '0.5 tsp',
    note: 'Apply first, especially across the nose, ears, and hairline.',
  },
  {
    area: 'Both arms',
    amount: '1 tsp',
    note: 'Do not forget the backs of hands if you are walking outdoors.',
  },
  {
    area: 'Upper body',
    amount: '1 tsp',
    note: 'Relevant for open shirts, sportswear, and wide necklines.',
  },
  {
    area: 'Both legs',
    amount: '2 tsp',
    note: 'Prioritise when commuting, exercising, or eating outside.',
  },
]

export const reminderTimeline = [
  { time: '1:20 PM', label: 'Applied', detail: 'First layer logged before leaving class.' },
  { time: '3:15 PM', label: 'Reapply', detail: 'Reminder scheduled before the late afternoon walk.' },
  { time: '5:30 PM', label: 'Review', detail: 'Check if more sun exposure is still planned today.' },
]

export const preventionChecklist = [
  'SPF 50+ before the next outdoor walk',
  'Hat and sunglasses packed',
  'Long sleeves ready for peak UV',
]

export const aboutHighlights = [
  {
    title: 'Track on the homepage',
    detail: 'The first page now leads with live UV danger because it is the fastest route to immediate action.',
  },
  {
    title: 'Understand on the skin page',
    detail: 'Awareness content and skin-tone guidance now live together so the explanation feels coherent.',
  },
  {
    title: 'Prevent on one action page',
    detail: 'Clothing, sunscreen dosage, and reminders now share one prevention-focused destination.',
  },
]
