/**
 * Optional single-partner auto-routing (email domain list → one roadmap keyword).
 * Not multi-partner. See docs/internal/PARTNER_ROUTING_PLAN.md.
 */
const parsePartnerDomains = (): string[] => {
  const raw = import.meta.env.VITE_PARTNER_EMAIL_DOMAINS as string | undefined
  if (!raw?.trim()) return []
  return raw.split(',').map((d) => d.trim().toLowerCase()).filter(Boolean)
}

export const partnerConfig = {
  emailDomains: parsePartnerDomains(),
  roadmapKeyword: (import.meta.env.VITE_PARTNER_ROADMAP_KEYWORD as string | undefined)?.trim().toLowerCase() || '',
}

export const isPartnerEmail = (email: string | null | undefined): boolean => {
  if (!email || partnerConfig.emailDomains.length === 0) return false
  const normalized = email.toLowerCase()
  return partnerConfig.emailDomains.some((domain) => normalized.includes(`@${domain}`))
}
