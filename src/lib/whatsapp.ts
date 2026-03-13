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

export function verifyToPoster(phone: string, name: string, task: string, url: string): string {
  const msg = `Hi ${name}! The volunteer for your Umuganda task "${task}" says it's complete.\n\nPlease take 30 seconds to confirm how it went: ${url}`
  return waLink(phone, msg)
}

export function verifyToVolunteer(phone: string, name: string, task: string, url: string): string {
  const msg = `Hi ${name}! Thanks for completing "${task}" through Umuganda.\n\nPlease take 30 seconds to confirm how it went: ${url}`
  return waLink(phone, msg)
}
