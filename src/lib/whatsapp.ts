// Which helper skills are relevant for each need category
export const CATEGORY_SKILL_MAP: Record<string, string[]> = {
  'Elderly support':    ['Care & companionship', 'Cooking', 'Driving', 'Physical labour'],
  'Children & youth':  ['Care & companionship', 'Teaching', 'Creative'],
  'Environment & nature': ['Physical labour', 'Animal care'],
  'Animals':           ['Animal care', 'Physical labour'],
  'Housing & repairs': ['Physical labour', 'Skilled trades'],
  'Food & hunger':     ['Cooking', 'Driving', 'Physical labour'],
  'Community spaces':  ['Physical labour', 'Creative', 'Skilled trades'],
  'Events':            ['Physical labour', 'Creative', 'Cooking', 'Digital / tech'],
  'Other':             [],
}

export function relevantSkillsForNeed(categories: string[]): string[] {
  const skills = new Set<string>()
  for (const cat of categories) {
    for (const skill of (CATEGORY_SKILL_MAP[cat] ?? [])) {
      skills.add(skill)
    }
  }
  return [...skills]
}

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 9) return `351${digits}` // Portuguese mobile
  return digits
}

export function waLink(phone: string, message: string): string {
  return `https://wa.me/${formatPhone(phone)}?text=${encodeURIComponent(message)}`
}

export function matchToVolunteer(
  volunteer: { name: string; whatsapp: string },
  poster: { name: string; whatsapp: string },
  task: string,
  area: string
): string {
  const msg = `Hi ${volunteer.name}! I'm from Umuganda — the community action platform.\n\n${poster.name} posted a need: "${task}" in ${area}.\n\nI've reviewed your profile and you're a great fit. Their WhatsApp: ${poster.whatsapp}\n\nFeel free to reach out directly to coordinate. Thank you for showing up!`
  return waLink(volunteer.whatsapp, msg)
}

export function matchToPoster(
  poster: { name: string; whatsapp: string },
  volunteer: { name: string; whatsapp: string },
  task: string
): string {
  const msg = `Hi ${poster.name}! Great news from Umuganda.\n\nWe've found a volunteer for "${task}".\n\n${volunteer.name} has offered to help. Their WhatsApp: ${volunteer.whatsapp}\n\nThey'll be in touch soon. Thank you for using Umuganda!`
  return waLink(poster.whatsapp, msg)
}

export function indirectMatchSameArea(
  volunteer: { name: string; whatsapp: string; skills: string[] },
  task: string,
  area: string
): string {
  const theirSkills = volunteer.skills.slice(0, 2).join(' and ')
  const msg = `Hi ${volunteer.name}! I'm from Umuganda.\n\nThere's a need in your area (${area}) that's a little outside your usual skills (${theirSkills}), but we think you could be great for it.\n\nThe task: "${task}"\n\nWould you be open to it? No pressure at all — just thought of you. Let me know!`
  return waLink(volunteer.whatsapp, msg)
}

export function indirectMatchSameSkill(
  volunteer: { name: string; whatsapp: string; area: string },
  task: string,
  needArea: string
): string {
  const msg = `Hi ${volunteer.name}! I'm from Umuganda.\n\nWe have a need that matches your skills, but it's in ${needArea} rather than ${volunteer.area}.\n\nThe task: "${task}"\n\nWould you be willing to travel for this? Let me know and I'll make the introduction!`
  return waLink(volunteer.whatsapp, msg)
}

export function verifyToPoster(phone: string, name: string, task: string, url: string): string {
  const msg = `Hi ${name}! The volunteer for your Umuganda task "${task}" says it's complete.\n\nPlease take 30 seconds to confirm how it went: ${url}`
  return waLink(phone, msg)
}

export function verifyToVolunteer(phone: string, name: string, task: string, url: string): string {
  const msg = `Hi ${name}! Thanks for completing "${task}" through Umuganda.\n\nPlease take 30 seconds to confirm how it went: ${url}`
  return waLink(phone, msg)
}
