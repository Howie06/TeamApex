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
  { label: 'UV Index', path: '/uv-index' },
  { label: 'Education', path: '/education' },
  { label: 'Protection Planner', path: '/protection-planner' },
  { label: 'Profile', path: '/profile' },
  // { label: 'About', path: '/about' },
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
    id: 'us11',
    story: 'US1.1',
    title: 'Real-time localised UV alerts',
    category: 'UV Index',
    description: 'Live warning tied to the current location, exposure window, and next best action.',
    benefit: 'Users recognise immediate danger and act before leaving shade.',
    path: '/uv-index',
  },
  {
    id: 'us21',
    story: 'US2.1',
    title: 'UV impact and skin cancer visualisations',
    category: 'Education',
    description: 'Charts turn invisible UV risk into something easy to scan, compare, and explain.',
    benefit: 'Complex health information becomes easier to understand and share.',
    path: '/education',
  },
  {
    id: 'us22',
    story: 'US2.2',
    title: 'Skin-tone based guidance',
    category: 'Profile',
    description: 'Personal context shifts the advice from generic awareness to relevant caution.',
    benefit: 'Sun-safety guidance feels more personal and credible.',
    path: '/profile',
  },
  {
    id: 'us31',
    story: 'US3.1',
    title: 'Sunscreen dosage guidance',
    category: 'Protection Planner',
    description: 'Body-zone dosage cards make correct sunscreen use easier to follow.',
    benefit: 'Users apply protection with more confidence.',
    path: '/protection-planner',
  },
  {
    id: 'us32',
    story: 'US3.2',
    title: 'Sunscreen reminders',
    category: 'Protection Planner',
    description: 'Reminder timeline keeps reapplication visible during long outdoor periods.',
    benefit: 'Protection habits stay consistent throughout the day.',
    path: '/protection-planner',
  },
  {
    id: 'us33',
    story: 'US3.3',
    title: 'Clothing recommendations by UV index',
    category: 'Protection Planner',
    description: 'Outfit cards match UV severity to practical clothing and carry items.',
    benefit: 'Awareness turns into daily protective behaviour.',
    path: '/protection-planner',
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
    title: 'Tanning myth',
    detail: 'A tan is not a shield against deeper UV-driven skin damage.',
  },
  {
    title: 'Peak exposure',
    detail: 'Late morning through mid-afternoon remains the most important protection window.',
  },
  {
    title: 'Shareable takeaway',
    detail: 'Simple visuals help students explain risk to friends and classmates.',
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

export const aboutHighlights = [
  {
    title: 'Why this product exists',
    detail: 'Young adults often underestimate UV exposure even on familiar daily routines such as commuting, campus travel, and outdoor social time.',
  },
  {
    title: 'Design direction',
    detail: 'The interface stays bold, legible, and action-first so the user can move from awareness to prevention without friction.',
  },
  {
    title: 'Current build goal',
    detail: 'This refactor turns the concept from one long presentation page into a routed front-end structure that can keep growing feature by feature.',
  },
]
