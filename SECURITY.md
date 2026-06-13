# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security issue, report it privately to:

**Email:** tech@10minuteschool.com  
**Subject:** `[SECURITY] 10MS SheSTEM — brief description`

### What to include

- Description of the vulnerability and its potential impact
- Steps to reproduce (proof of concept if available)
- Affected component (frontend, Supabase RLS, API, deployment, etc.)
- Your contact information for follow-up

### Response timeline

| Stage | Target |
| ----- | ------ |
| Acknowledgment | Within 48 hours |
| Initial assessment | Within 5 business days |
| Fix or mitigation plan | Within 14 days for critical issues |
| Public disclosure | Coordinated with reporter after fix is deployed |

### In scope

- Authentication and authorization bypass
- Row Level Security (RLS) policy flaws
- Exposure of secrets, API keys, or service role credentials
- Cross-site scripting (XSS) or injection in the application
- Insecure direct object references affecting user data

### Out of scope

- Social engineering attacks
- Denial of service (DoS) without a demonstrated application flaw
- Issues in third-party services (Supabase, PostHog, hosting providers) — report those to the respective vendor
- Vulnerabilities in archived scripts under `sql/archive/` or `scripts/archive/`

## Known limitations

- **Shared student password:** New students created via the mentor dashboard currently use a single platform-wide default password configured as `VITE_DEFAULT_STUDENT_PASSWORD`. This is a known limitation; per-user password management is planned. See [docs/internal/PASSWORD_MANAGEMENT_PLAN.md](docs/internal/PASSWORD_MANAGEMENT_PLAN.md).

## Security Best Practices for Deployers

- Never commit `.env` or `.env.local` files
- Rotate `VITE_POSTHOG_KEY` and Supabase keys if they were ever exposed in git history
- Set `VITE_DEFAULT_STUDENT_PASSWORD` in build-time env (SSM) to your **current** shared default — individual password management is planned separately
- Restrict `SUPABASE_SERVICE_ROLE_KEY` to server-side scripts only — never expose in frontend code
- Enable MFA on Supabase, GitHub, and cloud provider accounts

See [Open Source Security Best Practices](https://opensource.guide/security-best-practices-for-your-project/) for general guidance.
