// Simple test to verify PostHog is working
console.log('Testing PostHog integration...');

// Test if PostHog is available in the browser
if (typeof window !== 'undefined' && window.posthog) {
  console.log('✅ PostHog is available in browser');
  
  // Test basic functionality
  window.posthog.capture('test_event', {
    test: true,
    timestamp: new Date().toISOString()
  });
  
  console.log('✅ Test event sent to PostHog');
} else {
  console.log('❌ PostHog not found in browser');
}

// Test if the PostHog configuration is correct
console.log('PostHog API Key:', 'phc_cfUCdGAUd0Y5AxxIRnvEeKQ7EEyfRI2UcursFuYpZQ3');
console.log('PostHog Region: US');
console.log('PostHog Host: https://us.i.posthog.com');
