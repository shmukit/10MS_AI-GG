# 10MS SheSTEM Application

AI-Enabled Group Guidance Program for 10 Minute School

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
[![Contributing Welcome](https://img.shields.io/badge/Contributing-Welcome-orange.svg)](CONTRIBUTING.md)
[![Code Audit](https://img.shields.io/badge/CI-Code%20Audit-green.svg)](.github/workflows/code-audit.yml)

---

## Overview

10MS SheSTEM is an open-source mentorship platform that connects mentors and students through structured roadmaps, batch management, progress tracking, and community features. Built with React, TypeScript, Vite, and Supabase.

## Project Structure

```
.
├── src/                  # React application source
│   ├── components/       # UI components (Auth, Mentor, Student, Roadmap, etc.)
│   ├── config/           # Environment and partner configuration
│   ├── lib/              # Supabase client, auth, caching, analytics
│   └── services/db/      # Database service layer
├── sql/                  # Database migrations and schema scripts
│   └── archive/          # Historical operational scripts (not for fresh deploys)
├── scripts/              # Build, test, and deployment scripts
│   └── archive/          # Historical operational scripts
├── docs/                 # Documentation
├── docker/               # Docker configuration
├── .github/              # CI/CD workflows, issue templates, CODEOWNERS
└── config/               # Vite, Tailwind, TypeScript configs
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Supabase project ([setup guide](docs/SUPABASE_SETUP.md))

### Installation

```bash
git clone https://github.com/tenminschool/10MS_AI-GG.git
cd 10MS_AI-GG
npm install
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Required
VITE_SUPABASE_URL=https://your_project_ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Optional — analytics
VITE_POSTHOG_KEY=your_posthog_key
VITE_POSTHOG_HOST=https://us.i.posthog.com

# Optional — mentor dashboard default password for new students
VITE_DEFAULT_STUDENT_PASSWORD=change_me

# Optional — single-partner auto-routing hack (leave unset to disable).
# Not multi-partner; see docs/internal/PARTNER_ROUTING_PLAN.md for maintainers.
VITE_PARTNER_EMAIL_DOMAINS=example.com,partner.org
VITE_PARTNER_ROADMAP_KEYWORD=partner
```

### Development

```bash
npm run dev
```

App runs at [http://localhost:5173](http://localhost:5173).

### Database Setup

1. Run `sql/create_tables.sql` in the Supabase SQL Editor
2. Apply security migrations (`sql/security_hardening_2026.sql`, dated `YYYYMMDD_*.sql` files)
3. Run `sql/sync_auth_users.sql` to enable auth → public user sync

See [sql/README.md](sql/README.md) for the full migration order.

## Architecture

| Layer | Stack |
| ----- | ----- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| Analytics | PostHog (optional) |
| CI | GitHub Actions (gitleaks, ESLint, code audit) |

### Key Features

- Role-based authentication (student, mentor, admin)
- Mentor dashboard: batch management, student tracking, notices
- Student dashboard: roadmap navigation, progress tracking, task completion
- Real-time progress synchronization
- Responsive, mobile-first design

## Documentation

| Document | Description |
| -------- | ----------- |
| [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Complete database schema |
| [SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) | Supabase project setup |
| [MENTOR_FEATURES.md](docs/MENTOR_FEATURES.md) | Mentor dashboard features |
| [STUDENT_FEATURES.md](docs/STUDENT_FEATURES.md) | Student dashboard features |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deployment instructions |
| [OPEN_SOURCE_CHECKLIST.md](docs/OPEN_SOURCE_CHECKLIST.md) | Open source readiness tracker |
| [SECURITY.md](SECURITY.md) | Vulnerability reporting policy |
| [TRADEMARK.md](TRADEMARK.md) | Trademark usage guidelines |

## Deployment

### Docker

```bash
docker build -f docker/dockerfile -t shestem-app .
docker-compose -f docker/docker-compose.yaml up
```

For production Docker builds that fetch secrets from AWS SSM, pass `SSM_PARAM_NAME` as a build arg. See [DEPLOYMENT.md](docs/DEPLOYMENT.md).

### Manual

```bash
npm run build:prod
./scripts/deploy.sh
```

## Contributing

We welcome contributions! Please read:

- [Contributing Guidelines](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)

1. Fork the repository
2. Create a feature branch from `develop`
3. Make your changes and run `npm run lint`
4. Submit a pull request

## Community

- **Issues:** [GitHub Issues](https://github.com/tenminschool/10MS_AI-GG/issues) — bug reports and feature requests
- **Discussions:** Enable [GitHub Discussions](https://github.com/tenminschool/10MS_AI-GG/discussions) on the repository for Q&A (maintainer action required)
- **Email:** tech@10minuteschool.com

## License

This project is licensed under the [MIT License](LICENSE). Trademark and logo usage is governed separately by [TRADEMARK.md](TRADEMARK.md).

## Support

For support, feedback, and questions:

- Open an issue in this repository
- Email **tech@10minuteschool.com**
