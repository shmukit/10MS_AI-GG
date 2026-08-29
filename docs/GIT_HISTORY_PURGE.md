# Git History Purge Guide

**Run this before making the repository public.** Secrets committed in past commits remain accessible even after you remove them from the current files.

## What to purge

At minimum, rotate and purge:

- PostHog project key (`phc_...`) — was hardcoded in `src/lib/posthog.ts`
- Any Supabase project URLs that were committed (`*.supabase.co` project refs)
- Default student passwords in application source, scripts, and SQL

After purging history, **rotate all affected credentials** in PostHog and Supabase dashboards.

Do **not** paste real keys or passwords into this file. Use placeholders only.

## Option A: BFG Repo-Cleaner (recommended)

```bash
# 1. Install BFG (macOS)
brew install bfg

# 2. Clone a fresh mirror
git clone --mirror git@github.com:tenminschool/10MS_AI-GG.git
cd 10MS_AI-GG.git

# 3. Create a secrets file listing strings to remove (fill from your password manager)
cat > /tmp/secrets-to-purge.txt << 'EOF'
<POSTHOG_PROJECT_API_KEY>
<SUPABASE_PROJECT_REF>.supabase.co
<SHARED_STUDENT_PASSWORD>
EOF

# 4. Run BFG
bfg --replace-text /tmp/secrets-to-purge.txt

# 5. Clean and force-push
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

## Option B: git filter-repo

```bash
pip install git-filter-repo

git filter-repo --replace-text <(echo '<POSTHOG_PROJECT_API_KEY>==>REDACTED')
```

## After purging

1. Rotate PostHog API key in the PostHog dashboard
2. Confirm Supabase anon/service keys are not in git history (`gitleaks detect --source .`)
3. Notify all collaborators to re-clone the repository
4. Update `docs/OPEN_SOURCE_CHECKLIST.md` — mark "Git history purge" as complete

## Verification

```bash
# Run gitleaks against full history
gitleaks detect --source . --verbose

# Search for known leaked strings (replace with the real value from your password manager)
git log --all -S '<POSTHOG_PROJECT_API_KEY>' --oneline
```

If the last command returns no results, the key has been purged from history.
