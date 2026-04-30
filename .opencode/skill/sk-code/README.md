# sk-code — Smart-Routing Code Skill

`sk-code` is the unified umbrella skill for application code work. It detects the project stack from marker files, classifies intent, and loads the right resources.

Successor to two earlier code skills (a Webflow-only skill and a multi-stack skill); both were retired in packet `055-cli-skill-removal-sk-code-merger-deprecated` on 2026-04-30.

---

## Quick Start

The skill activates automatically when the advisor detects a code-related prompt. Manual invocation:

```bash
# Inside an OpenCode session
@code <prompt>
# or
Read .opencode/skill/sk-code/SKILL.md
```

---

## Stack Detection

The router runs marker-file detection in this order (first match wins):

| Stack | Marker | Route |
|---|---|---|
| WEBFLOW | `src/2_javascript/`, `*.webflow.js`, `Webflow.push`, motion.dev / GSAP / Lenis / HLS / Swiper / FilePond signals | LIVE — full Webflow / vanilla animation content |
| GO | `go.mod` | STUB — scaffolded for a future gin + sqlc + Postgres backend (paired with NEXTJS). Populate when a real Go service is wired into this skill. |
| NEXTJS | `next.config.{js,mjs,ts}` OR `package.json`+react/next | STUB — scaffolded for a future Next.js 14 frontend (paired with GO). Populate when a real Next.js project is wired into this skill. |
| UNKNOWN | (none, or any stack not above) | Disambiguation prompt — `sk-code` does not own Node.js / React Native / Swift / other stacks |

See `references/router/stack_detection.md` for the detection precedence and edge cases. For the React↔Go cross-stack contract: `references/router/cross_stack_pairing.md`.

---

## Structure Inventory

```
sk-code/
├── SKILL.md                    Merged routing pseudocode (stack → intent → load level → resources)
├── README.md                   This file
├── changelog/                  Per-version changelog files (v1.0.0 baseline · v1.1.0 fullstack branch · v1.2.0 stack pruning · v1.3.0 placeholder fill + nextjs→react rename)
├── graph-metadata.json         Skill graph relationships
├── description.json            Auto-discoverable description
│
├── references/
│   ├── router/                 Routing internals (deep-reference reads)
│   │   ├── stack_detection.md
│   │   ├── intent_classification.md
│   │   ├── resource_loading.md
│   │   ├── phase_lifecycle.md
│   │   └── cross_stack_pairing.md   React↔Go API / JWT / CORS canonical contract
│   ├── universal/              Stack-agnostic core (4 files: error_recovery, code_quality_standards, code_style_guide, multi_agent_research)
│   ├── webflow/                LIVE — 28 files across implementation/debugging/verification/deployment/performance/standards
│   ├── react/                  STUB — scaffolded for a future Next.js 14 project (App Router + vanilla-extract + motion v12 + react-hook-form/zod + react-aria + Untitled UI + next-themes + optional TinaCMS)
│   │   ├── README.md           stack overview stub
│   │   ├── implementation/     implementation_workflows.md (Phase-1 entry stub) + per-domain stubs (app_router_patterns, vanilla_extract_styling, motion_animation, forms_validation, accessibility_aria, api_integration, content_tinacms)
│   │   ├── debugging/          debugging_workflows.md, hydration_errors.md
│   │   ├── verification/       verification_workflows.md
│   │   ├── deployment/         vercel_deploy.md
│   │   └── standards/          code_style.md
│   ├── go/                     STUB — scaffolded for a future gin + sqlc + pgx + Postgres + go-playground/validator + golang-jwt service
│   │   ├── README.md           stack overview stub
│   │   ├── implementation/     implementation_workflows.md (Phase-1 entry stub) + per-domain stubs (gin_handler_patterns, service_layer, database_sqlc_postgres, validation_patterns, jwt_middleware, error_envelopes, api_design)
│   │   ├── debugging/          debugging_workflows.md, pprof_profiling.md
│   │   ├── verification/       verification_workflows.md
│   │   ├── deployment/         docker_railway.md
│   │   └── standards/          code_style.md
│   └── (no other stacks — Node.js / React Native / Swift fall through to UNKNOWN)
│
├── assets/
│   ├── universal/              Stack-agnostic checklists + JS validation/wait patterns
│   ├── webflow/                LIVE — copied verbatim (10 files)
│   ├── react/                  STUB — checklists (code quality, debugging, verification) + patterns (server_action, api_call, form, motion, vanilla_extract recipe) + integrations (vanilla-extract, untitled-ui, tinacms)
│   └── go/                     STUB — checklists (code quality, debugging, verification) + patterns (handler, service, repository_sqlc, jwt_middleware, table_test)
│
└── scripts/                    Webflow build utilities (CWD-relative; portable from new location)
    ├── minify-webflow.mjs
    ├── verify-minification.mjs
    └── test-minified-runtime.mjs
```

---

## Setup

This skill is part of the OpenCode skills system. No special setup required — the advisor auto-discovers it.

To verify advisor routing, dispatch a test prompt:

```bash
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py \
  "fix Webflow animation flicker" --threshold 0.8
```

Expected: `sk-code` returned with high confidence and stack=WEB.

---

## Troubleshooting

### Stack detection picks the wrong stack

Provide an explicit hint in your prompt: include the stack name (e.g. "in this Webflow project, fix...") to nudge the intent scorer.

### Web scripts can't find the source files

The minification scripts use CWD-relative paths (`'src/2_javascript'`). Run them from the project root, not from the skill directory:

```bash
cd <your-webflow-project-root>
node /path/to/.opencode/skill/sk-code/scripts/minify-webflow.mjs
```

### Skill routing score < 0.8

The advisor scoring is hand-tuned. After major edits, run:

```bash
/doctor:skill-advisor :confirm
```

This re-tunes TOKEN_BOOSTS / PHRASE_BOOSTS for the current skill set and regenerates `skill-graph.json`.

---

## Migration from Legacy Skills

The two legacy code skills (a Webflow-focused skill and a multi-stack skill) were retired on 2026-04-30. Use `Read .opencode/skill/sk-code/SKILL.md` — the smart router auto-detects the project stack from cwd. The minify-webflow / verify-minification / test-minified-runtime scripts now live at `.opencode/skill/sk-code/scripts/`.

The non-Webflow stack folders in `sk-code/` (`react/`, `go/`) are scaffolded stubs as of v1.3.0 (packet `057-sk-code-multi-stack-placeholders`, 2026-04-30). They route correctly via SKILL.md but contain placeholder content with `populated: false` and `last_synced_at: 2026-04-30`. Populate them when a real Next.js / Go project is wired into this skill. The `cross_stack_pairing.md` doc under `references/router/` is the canonical React ↔ Go API contract — preserved as live content, not a stub.

---

## Related Skills

- **`sk-code-review`** — formal findings-first review baseline (this skill produces overlay compliance evidence at Phase 1.5; sk-code-review produces severity-ranked findings)
- **`sk-code-opencode`** — OpenCode harness/system code (the `.opencode/` directory itself) — sibling, NOT subsumed
- **`mcp-chrome-devtools`** — WEBFLOW stack browser debugging (Phase 2 + Phase 3)
- **`sk-doc`** — documentation quality, skill creation, markdown validation
- **`sk-git`** — git workflows, conventional commits, PR creation
- **`system-spec-kit`** — spec folder management, memory system, context preservation

---

## See Also

- `SKILL.md` — full routing pseudocode + phase lifecycle + per-phase rules
- `references/router/` — deep-reference docs for the routing internals
- `CHANGELOG.md` — version history including the 1.0.0 baseline merger
- Spec folder: `.opencode/specs/skilled-agent-orchestration/054-sk-code-merger/` (the merger spec, plan, decision records)
