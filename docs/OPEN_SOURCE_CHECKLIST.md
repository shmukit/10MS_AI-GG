# Open Source Readiness Checklist

Living tracker for preparing the 10MS SheSTEM repository for public open source release.

**References:** [Open Source Guides](https://opensource.guide/) · [Producing Open Source Software](https://producingoss.com/en/index.html)

**Last updated:** 2026-06-12

---

## Status Legend

| Symbol | Meaning |
| ------ | ------- |
| ✅ | Complete |
| 🔄 | In progress |
| ⏳ | Pending (manual action required) |
| ⏸️ | Deferred (intentional) |
| ❌ | Gap / blocker |

---

## 1. Security & Secrets

| # | Task | Status | Notes |
| - | ---- | ------ | ----- |
| 1.1 | Remove hardcoded PostHog key from `src/lib/posthog.ts` | ✅ | Uses `VITE_POSTHOG_KEY` |
| 1.2 | Remove hardcoded Supabase URL from `index.html` | ✅ | Preconnect hint removed |
| 1.3 | Externalize default student password | ✅ | `VITE_DEFAULT_STUDENT_PASSWORD` — **keep current shared default in SSM; no rotation** |
| 1.4 | Remove Docker `echo $AWS_SECRET_ACCESS_KEY` | ✅ | Both dockerfiles fixed |
| 1.5 | Abstract SSM parameter name in Docker | ✅ | `SSM_PARAM_NAME` build arg |
| 1.6 | Sanitize `scripts/create_users_via_api.js` | ✅ | Uses env vars + example emails |
| 1.7 | Delete `test-posthog.js` (leaked key) | ✅ | File removed |
| 1.8 | Redact PostHog key from docs | ✅ | `POSTHOG_EVENTS_DOCUMENTATION.md` updated |
| 1.9 | **Rotate PostHog key in dashboard** | ⏳ | Manual — old key was in git history |
| 1.10 | **Purge secrets from git history** | ⏳ | See [GIT_HISTORY_PURGE.md](GIT_HISTORY_PURGE.md) |
| 1.11 | Run `gitleaks detect` on full history | ⏳ | After history purge |

---

## 2. PII & Data Remediation

| # | Task | Status | Notes |
| - | ---- | ------ | ----- |
| 2.1 | Delete PII-containing SQL scripts | ✅ | 25 files permanently deleted (not archived) |
| 2.2 | Delete PII-containing scripts | ✅ | 14 files permanently deleted (not archived) |
| 2.3 | Sanitize `create_tables.sql` seed emails | ✅ | `admin@example.com`, `mentor@example.com` |
| 2.4 | Sanitize `add_test_users.sql` | ✅ | Placeholder emails |
| 2.5 | Update `sql/README.md` | ✅ | No archive references; explains history |
| 2.6 | Gitignore `sql/archive/` and `scripts/archive/` | ✅ | Safety net — cannot accidentally be committed |

> **Why delete rather than archive?** Moving PII files to a subdirectory does not protect them — they remain fully visible to anyone cloning the repo. The files are deleted from the working tree. If team members need them for reference, they can access them from git history on a private machine before the BFG purge commit. Historical operational scripts that name real people have no value to external contributors.

---

## 3. Governance Documents

| # | Document | Status | Path |
| - | -------- | ------ | ---- |
| 3.1 | LICENSE (MIT) | ✅ | `LICENSE` |
| 3.2 | CONTRIBUTING.md | ✅ | `CONTRIBUTING.md` (env vars section added) |
| 3.3 | CODE_OF_CONDUCT.md | ✅ | `CODE_OF_CONDUCT.md` |
| 3.4 | SECURITY.md | ✅ | `SECURITY.md` |
| 3.5 | CHANGELOG.md | ✅ | `CHANGELOG.md` |
| 3.6 | TRADEMARK.md | ✅ | `TRADEMARK.md` |
| 3.7 | README.md | ✅ | Fixed links, env vars, badges |
| 3.8 | .env.example | ✅ | All public env vars documented |
| 3.9 | CODEOWNERS | ✅ | `.github/CODEOWNERS` |
| 3.10 | dependabot.yml | ✅ | `.github/dependabot.yml` |
| 3.11 | Issue templates | ✅ | `.github/ISSUE_TEMPLATE/` |
| 3.12 | PR template | ✅ | `.github/pull_request_template.md` |
| 3.13 | Gitleaks config | ✅ | `.gitleaks.toml` |

---

## 4. Repository Hygiene

| # | Task | Status | Notes |
| - | ---- | ------ | ----- |
| 4.1 | Add `.vite/` to `.gitignore` | ✅ | Untracked from git |
| 4.2 | Add `dist/`, `*.pem` to `.gitignore` | ✅ | Done |
| 4.3 | Update `package.json` metadata | ✅ | Name, description, repo, license |
| 4.4 | Exclude `docs/10ms-design-skill/` from public repo | ✅ | Gitignored + untracked; stays local on maintainer machines |
| 4.5 | Move strategy docs to `docs/internal/` | ✅ | `PLATFORM_EXPANSION_PLAN.md` |
| 4.6 | CI/CD abstract infra names | ✅ | Uses `vars.DEPLOY_IMAGE_NAME`, etc. |
| 4.7 | Fix deprecated `::set-output` in prod.yaml | ✅ | Uses `$GITHUB_OUTPUT` |

### GitHub repository variables to set (maintainer action)

| Variable | Example Value | Used In |
| -------- | ------------- | ------- |
| `DEPLOY_IMAGE_NAME` | `tenms-ai-gg` | prod.yaml, prod-updated.yaml |
| `SSM_PARAM_NAME` | `prod-tenms-ai-gg` | Docker build |
| `K8S_DEPLOYMENT_NAME` | `tenms-ai-gg` | AKS deploy |
| `K8S_CONTAINER_NAME` | `tenms-ai-gg` | AKS deploy |
| `AWS_REGION` | `ap-southeast-1` | CI workflows |

---

## 5. Configurability & Company-Agnostic

| # | Task | Status | Notes |
| - | ---- | ------ | ----- |
| 5.1 | Partner email domain logic → env config | ✅ | `src/config/partnerConfig.ts` — **single-partner hack only**; see [PARTNER_ROUTING_PLAN.md](internal/PARTNER_ROUTING_PLAN.md) |
| 5.2 | Partner roadmap keyword → env config | ✅ | `VITE_PARTNER_ROADMAP_KEYWORD` — preserves prod Augmedix routing; not multi-partner |
| 5.3 | **Branding de-coupling (app name, URLs, logos)** | ⏸️ | Deferred — keeping SheSTEM / 10MS branding for now |
| 5.4 | **Logo replacement for forks** | ⏸️ | Documented in `TRADEMARK.md`; logos kept in repo |

---

## 6. Community & Launch

| # | Task | Status | Notes |
| - | ---- | ------ | ----- |
| 6.1 | Enable GitHub Discussions | ⏳ | Maintainer: Settings → General → Discussions |
| 6.2 | Tag `v1.0.0` release | ⏳ | After history purge and final review |
| 6.3 | Write launch announcement | ⏳ | Blog / social post |
| 6.4 | Community links in README | ✅ | Issues + Discussions placeholder |

---

## 7. Pre-Launch Blockers

These **must** be completed before making the repository public:

1. ❌ → ⏳ **Rotate PostHog API key** (compromised by git history)
2. ❌ → ⏳ **Purge git history** ([GIT_HISTORY_PURGE.md](GIT_HISTORY_PURGE.md))
3. ❌ → ⏳ **Run gitleaks on full history** and confirm clean
4. ❌ → ⏳ **Set GitHub repository variables** for CI/CD (table above)
5. ❌ → ⏳ **Review `docs/internal/`** for any remaining sensitive strategy content

---

## 8. Deferred Decisions

| Decision | Status | Rationale |
| -------- | ------ | --------- |
| Keep 10MS/SheSTEM branding in source | ⏸️ Decided | Team wants to keep branding for now |
| Move production deploy to private repo | ⏳ Open | Cleanest OSS pattern; workflows currently guarded by `if: github.repository` |
| Replace logos with generic placeholders | ⏸️ Decided | Keep logos + `TRADEMARK.md` notice |
| Review all `docs/` PRDs for public release | ⏳ Open | Strategy doc moved; other PRDs kept as technical reference |
| **Individual student password management** | ⏸️ Deferred | Keep shared default for now; see [PASSWORD_MANAGEMENT_PLAN.md](internal/PASSWORD_MANAGEMENT_PLAN.md) |
| **Multi-partner email → roadmap routing** | ⏸️ Deferred | Keep env-based single-keyword hack for prod; see [PARTNER_ROUTING_PLAN.md](internal/PARTNER_ROUTING_PLAN.md) |

---

## 9. Known Limitations (deferred, not OSS blockers)

| Limitation | Status | Plan |
| ---------- | ------ | ---- |
| Shared default password for all new students | ⏸️ Accepted for now | [PASSWORD_MANAGEMENT_PLAN.md](internal/PASSWORD_MANAGEMENT_PLAN.md) |
| Password baked into frontend via `VITE_*` at build time | ⏸️ Accepted until Phase 1 | Remove env var; server-side creation |
| No student self-service password change | ⏸️ Future | Phase 3 in password plan |
| Single keyword routes all partner domains to one roadmap | ⏸️ Accepted for now | [PARTNER_ROUTING_PLAN.md](internal/PARTNER_ROUTING_PLAN.md) |
| `roadmapService.ts` still hardcodes `augmedix` in sort scoring | ⏸️ Known debt | Phase 1 in partner routing plan |

| Date | Change |
| ---- | ------ |
| 2026-06-12 | Initial checklist created during open source prep implementation |
| 2026-06-12 | Marked security, PII, governance, and hygiene items complete |
| 2026-06-13 | Password management deferred; shared default unchanged for production |
| 2026-06-13 | Partner routing documented as single-partner hack; multi-partner fix deferred |
