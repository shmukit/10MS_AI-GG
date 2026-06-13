# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `SECURITY.md` vulnerability disclosure policy
- `TRADEMARK.md` trademark usage guidelines
- `docs/OPEN_SOURCE_CHECKLIST.md` open source readiness tracker
- `src/config/partnerConfig.ts` for configurable partner email domain matching
- `.github/dependabot.yml` for automated dependency updates
- `.github/CODEOWNERS` for PR review routing

### Changed
- PostHog analytics key moved to `VITE_POSTHOG_KEY` environment variable
- Default student password moved to `VITE_DEFAULT_STUDENT_PASSWORD` environment variable
- Partner email domain logic made configurable via `VITE_PARTNER_EMAIL_DOMAINS`
- Docker builds use `SSM_PARAM_NAME` build arg instead of hardcoded parameter names
- CI/CD workflows use GitHub repository variables for deployment identifiers
- Operational SQL/scripts with PII moved to `sql/archive/` and `scripts/archive/`

### Security
- Removed hardcoded PostHog project key from source
- Removed hardcoded Supabase project URL from `index.html`
- Removed `echo $AWS_SECRET_ACCESS_KEY` from Docker build layers
- Sanitized seed SQL scripts to use `admin@example.com` / `mentor@example.com` placeholders

## [1.0.0] - 2026-06-12

### Added
- Initial open source release of the 10MS SheSTEM AI-GG platform
- MIT License, CONTRIBUTING.md, and CODE_OF_CONDUCT.md
- React + TypeScript frontend with Vite and Tailwind CSS
- Supabase backend with Row Level Security (RLS)
- Mentor dashboard: batch management, student tracking, notices
- Student dashboard: roadmap navigation, progress tracking, task completion
- Gitleaks secret scanning in CI
- ESLint and code duplication audit workflow

[Unreleased]: https://github.com/tenminschool/10MS_AI-GG/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/tenminschool/10MS_AI-GG/releases/tag/v1.0.0
