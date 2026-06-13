# Internal Documentation

Documents in this folder contain **product strategy and roadmap planning** intended for maintainers. They are kept in the repository for team reference but are not required for external contributors setting up the platform.

## Contents

| Document | Description |
| -------- | ----------- |
| `PLATFORM_EXPANSION_PLAN.md` | Strategic expansion roadmap (TaRL, B2B/B2C, AI features) |
| `PASSWORD_MANAGEMENT_PLAN.md` | Deferred plan to replace shared default student password with per-user credentials |
| `PARTNER_ROUTING_PLAN.md` | Deferred plan to replace single-keyword partner email → roadmap hack with multi-partner routing |

## Local-only maintainer tooling

The `docs/10ms-design-skill/` folder (Cursor/Windsurf design system skill) is listed in `.gitignore`. It can exist on maintainer machines for internal use but is **not pushed** to the public repository.

## For external contributors

If you are forking or deploying this project, you do not need these documents. Start with:

- [README.md](../../README.md)
- [docs/SUPABASE_SETUP.md](../SUPABASE_SETUP.md)
- [docs/DATABASE_SCHEMA.md](../DATABASE_SCHEMA.md)
- [docs/OPEN_SOURCE_CHECKLIST.md](../OPEN_SOURCE_CHECKLIST.md)
