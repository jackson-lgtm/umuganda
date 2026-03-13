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

// Which document types are preferred/required per need category
// Values match the doc_type values in user_documents table
export const CATEGORY_DOC_REQUIREMENTS: Record<string, { type: string; label: string; required: boolean }[]> = {
  'Children & youth':    [{ type: 'working_with_children', label: 'Working with Children check', required: true }],
  'Elderly support':     [{ type: 'working_with_children', label: 'Working with Children check', required: false }, { type: 'medical', label: 'Medical qualification', required: false }],
  'Housing & repairs':   [{ type: 'trade_licence', label: 'Trade licence', required: false }],
  'Community spaces':    [{ type: 'trade_licence', label: 'Trade licence', required: false }],
  'Food & hunger':       [],
  'Environment & nature': [],
  'Animals':             [],
  'Events':              [],
  'Other':               [],
}

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
  is_trusted_voucher: boolean
}

export interface UserDocument {
  id: string
  created_at: string
  user_id: string
  document_type: string
  file_url: string
  is_verified: boolean
  verified_at: string | null
  expires_at: string | null
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
