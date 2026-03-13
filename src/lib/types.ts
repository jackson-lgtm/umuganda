export type Pipeline_Need = 'Open' | 'Helper assigned' | 'In progress' | 'Fulfilled' | 'Closed'
export type Pipeline_Helper = 'New' | 'Active' | 'Paused' | 'Inactive'
export type ModerationStatus = 'live' | 'pending_review' | 'rejected'
export type Urgency = 'Urgent — today/tomorrow' | 'This week' | 'This month' | 'Ongoing'
export type Area = 'Ericeira' | 'Mafra' | 'Sintra' | 'Lisbon' | 'Cascais' | 'Setubal' | 'Other'

export const AREAS: Area[] = ['Ericeira', 'Mafra', 'Sintra', 'Lisbon', 'Cascais', 'Setubal', 'Other']

export const CATEGORIES = [
  'Elderly support',
  'Children & youth',
  'Environment & nature',
  'Animals',
  'Housing & repairs',
  'Food & hunger',
  'Community spaces',
  'Events',
  'Other',
]

export const SKILLS = [
  'Physical labour',
  'Care & companionship',
  'Cooking',
  'Animal care',
  'Driving',
  'Skilled trades',
  'Teaching',
  'Digital / tech',
  'Creative',
  'Other',
]

export const AVAILABILITY = ['Weekdays', 'Weekends', 'Evenings', 'Flexible / anytime']

export const TIME_OPTIONS = ['1–2 hrs', 'Half day', 'Full day', 'Multi-day', 'Flexible']

export const URGENCY_OPTIONS: Urgency[] = [
  'Urgent — today/tomorrow',
  'This week',
  'This month',
  'Ongoing',
]

export const LANGUAGES = ['English', 'Portuguese', 'Spanish', 'French', 'Other']

export interface Need {
  id: string
  created_at: string
  title: string
  description: string | null
  category: string[]
  area: Area | null
  location: string | null
  urgency: Urgency | null
  helpers_needed: number | null
  time_required: string | null
  contact_name: string | null
  contact_whatsapp: string | null
  submitted_by: string | null
  pipeline: Pipeline_Need
  moderation_status: ModerationStatus
  moderation_note: string | null
}

export interface Helper {
  id: string
  created_at: string
  name: string
  whatsapp: string | null
  email: string | null
  area: Area | null
  skills: string[]
  availability: string[]
  time_per_session: string | null
  languages: string[]
  about: string | null
  pipeline: Pipeline_Helper
  moderation_status: ModerationStatus
  moderation_note: string | null
}

export interface HelperResponse {
  id: string
  created_at: string
  need_id: string
  helper_name: string
  helper_whatsapp: string | null
  helper_email: string | null
  message: string | null
}
