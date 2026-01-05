# Dashboard Configuration Guide

This guide covers the security warnings that must be addressed through the Supabase Dashboard.

## Auth OTP Long Expiry

**Issue:** OTP expiry exceeds recommended threshold (currently > 1 hour)

**How to Fix:**
1. Navigate to your Supabase project dashboard
2. Go to **Authentication** → **Settings** → **Email Auth**
3. Find the **OTP expiry** setting
4. Set the value to **3600 seconds (1 hour)** or less
5. Click **Save**

**Recommended Value:** 3600 seconds (1 hour) or 1800 seconds (30 minutes) for higher security

---

## Leaked Password Protection

**Issue:** Leaked password protection is currently disabled

**What it does:** Prevents users from using passwords that have been compromised in data breaches by checking against the HaveIBeenPwned.org database.

**How to Fix:**
1. Navigate to your Supabase project dashboard
2. Go to **Authentication** → **Settings** → **Password**
3. Find the **Leaked Password Protection** toggle
4. Enable it
5. Click **Save**

**Impact:** When enabled, users will not be able to sign up or change their password to one that appears in known data breaches.

---

## Postgres Version Upgrade

**Issue:** Current version (supabase-postgres-17.4.1.074) has security patches available

**How to Fix:**
1. Navigate to your Supabase project dashboard
2. Go to **Settings** → **Database**
3. Look for the **Postgres Version** section
4. If an upgrade is available, you'll see an **Upgrade** button
5. Review the upgrade notes and click **Upgrade**
6. Wait for the upgrade to complete (this may cause brief downtime)

**Important Notes:**
- Always test upgrades in a staging environment first if possible
- Schedule upgrades during low-traffic periods
- Review the PostgreSQL release notes for any breaking changes
- Supabase will typically handle the upgrade smoothly with minimal downtime

**Documentation:** https://supabase.com/docs/guides/platform/upgrading

---

## Verification

After making these changes:
1. Navigate to **Advisors** → **Security Advisor** in the Supabase Dashboard
2. Confirm that all three warnings are resolved
3. The remaining warnings should only be function-related (fixed via SQL migration)
