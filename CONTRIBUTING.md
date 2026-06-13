# Contributing to 10MS SheSTEM Application

First off, thank you for taking the time to contribute! 🎉

This document outlines a set of guidelines and procedures for contributing to the 10MS SheSTEM Application. Following these guidelines helps us maintain code quality, keep the git history clean, and ensure a welcoming and efficient collaboration environment.

---

## 🏛️ Governance Model

1. **Founder-Leader (Benevolent Dictator):** 
   The project is managed and maintained by **10 Minute School**. Maintainers retain ultimate decision-making authority over the codebase, feature roadmap, and pull request approvals.
2. **Do-ocracy (Community Recognition):**
   We value actions over words. Power and responsibility are granted to contributors who consistently deliver quality work:
   - **Triage Team:** After **5 successfully merged Pull Requests**, you will be invited to join our triage team to help manage issues and review code.
   - **Module Maintainer:** Consistent stewardship over specific areas (such as the student/mentor dashboard frontend, SQL migration quality, or test automation) will lead to co-maintainer roles.

---

## 🛠️ Local Development Setup

To contribute to this codebase, you need to set up your local development environment.

### Prerequisites
- **Node.js**: Version 18 or higher (check version using `node -v`)
- **npm**: Version 9 or higher
- **Supabase Cloud Project or Local Postgres**: To handle backend operations and row-level security (RLS)

### Installation Steps

1. **Fork and Clone the Repository**
   Fork the repository to your own GitHub account and clone it locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/10MS_AI-GG.git
   cd 10MS_AI-GG
   ```

2. **Install Dependencies**
   Use `npm` to install node modules:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Copy the example environment configuration to `.env.local` (Vite automatically picks up `.env.local` for local development):
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` in your preferred editor and fill in your values:
   ```env
   # Required
   VITE_SUPABASE_URL=https://your_project_ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Optional — analytics
   VITE_POSTHOG_KEY=your_posthog_key
   VITE_POSTHOG_HOST=https://us.i.posthog.com

   # Optional — mentor dashboard default password for new students
   VITE_DEFAULT_STUDENT_PASSWORD=change_me

   # Optional — partner email auto-assignment (comma-separated domains)
   VITE_PARTNER_EMAIL_DOMAINS=example.com,partner.org
   VITE_PARTNER_ROADMAP_KEYWORD=partner
   ```
   > [!WARNING]
   > **Never commit your `.env` or `.env.local` files to version control.** These files are automatically ignored by `.gitignore` to prevent credential exposure.

4. **Set Up Your Supabase Instance**

   If you do not have access to the production Supabase project, create your own:

   1. Create a free project at [supabase.com](https://supabase.com)
   2. Run `sql/create_tables.sql` in the Supabase SQL Editor
   3. Apply security migrations in order (see [sql/README.md](sql/README.md))
   4. Run `sql/sync_auth_users.sql` to enable auth → public user sync
   5. Copy your project URL and anon key into `.env.local`

   See [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) for detailed instructions.

5. **Run the Development Server**
   Start the Vite dev server locally:
   ```bash
   npm run dev
   ```
   Your app will be running at [http://localhost:5173](http://localhost:5173).

---

## 🌿 Git & Branching Strategy

We follow a structured branching system to ensure production stability:

- **`main`**: Represents the current stable, production-ready release. Direct commits to `main` are strictly prohibited.
- **`develop`**: The main integration branch where new features and bug fixes accumulate.
- **Feature/Bugfix Branches**: Create individual branches for your changes from the `develop` branch.
  - Formats:
    - `feature/short-description` (for new features)
    - `bugfix/short-description` (for bug fixes)
    - `docs/short-description` (for documentation changes)

### How to start a new branch:
```bash
# Pull the latest changes from develop
git checkout develop
git pull origin develop

# Create your feature branch
git checkout -b feature/my-cool-upgrade
```

---

## ✍️ Coding & Quality Guidelines

### TypeScript & React
- Ensure all code is strongly typed. Avoid using `any` or loose type assertions (`as never`, `as any`) unless absolutely necessary.
- Write functional React components using hooks.
- Use Lucide React for consistent icons.
- Style with utility classes using Tailwind CSS.

### Static Code Analysis
Our CI/CD pipeline runs automated code quality checks on every Pull Request. You can (and should) run these locally before committing:

1. **Linting (ESLint):**
   ```bash
   npm run lint
   ```
   Ensure your IDE is configured to use ESLint, and resolve all linter errors/warnings.

2. **Logic Duplication Check (jscpd):**
   Our CI requires that code duplication in the `src/` directory is below 10%.
   ```bash
   npx jscpd src --threshold 10
   ```
   Avoid copy-pasting complex logical code. Instead, modularize and write reusable utility functions in `src/utils/` or hooks in `src/lib/`.

---

## 🧪 Testing

We believe robust testing is the key to codebase confidence. Before submitting your pull request, please run the following test suites to ensure zero regressions:

```bash
# Production smoke test (env, Supabase API, RLS, optional frontend)
npm run smoke

# Database connectivity test (RLS-aware)
npm run test:db
```

Scripts load `.env` then `.env.local` automatically. For authenticated table checks, set in your env file:

```env
SMOKE_TEST_EMAIL=your_test_user@example.com
TEST_USER_PASSWORD=your_test_password
```

Optional: start the preview server first (`npm run build:prod && npm run preview`) so the frontend check runs against `http://127.0.0.1:4173`.

Ensure `npm run smoke` reports zero failures before submitting!

---

## 🚀 Pull Request Process

When you are ready to submit your code, follow this checklist to ensure a swift review:

1. **Self-Review:**
   - Did you remove all `console.log` statements and debugging blocks?
   - Did you verify that no secret keys or hardcoded passwords exist in your code?
   - Did you run `npm run lint` and verify it passes?
2. **Submit the PR:**
   - Target the **`develop`** branch (unless instructed otherwise).
   - Fill out the provided Pull Request Template completely.
   - Attach screenshots/videos for visual or UI-related upgrades.
3. **Squash and Merge:**
   - Maintainers use "Squash and Merge" to keep git logs clean. Ensure your individual commit messages are descriptive as they will be squashed into a single clean commit on the destination branch.
4. **Be Responsive:**
   - Reviewers may ask questions or suggest refinements. Please check back on your PR to address feedback!

---

## 🛡️ Security Vulnerabilities & Reports

If you discover a security vulnerability (such as a database leak, exposed API keys, or RLS bypass), **do not open a public issue**. Please report it privately to **tech@10minuteschool.com** so we can address and patch it responsibly.

Thank you for contributing to the 10MS SheSTEM platform! 🚀
