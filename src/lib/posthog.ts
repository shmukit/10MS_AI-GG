import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init('phc_cfUCdGAUd0Y5AxxIRnvEeKQ7EEyfRI2UcursFuYpZQ3', {
      api_host: 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false, // We'll handle this manually
      capture_pageleave: true,
    })
  }
}

export { posthog }
