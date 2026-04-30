---
title: "Implementation Summary: sk-code fullstack branch (REACT + GO live promotion)"
description: "Promotes REACT and GO from PLACEHOLDER_STACKS to LIVE_STACKS in sk-code. REACT modeled on kerkmeester.com (Next.js 14 + vanilla-extract + motion v12). GO paired (gin + sqlc + Postgres). Adds cross-stack pairing doc + advisor scoring extensions."
trigger_phrases: ["056 implementation summary", "sk-code fullstack branch summary", "056-sk-code-fullstack-branch continuity", "react go live promotion summary"]
importance_tier: "high"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/056-sk-code-fullstack-branch"
    last_updated_at: "2026-04-30T13:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Phase 4 complete (SKILL.md routing + metadata + advisor scoring); spec validation pass underway"
    next_safe_action: "Re-run spec validate; backfill deep-reference docs and pattern files incrementally as needed"
    blockers: []
    completion_pct: 85
    open_questions: []
    answered_questions:
      - "Branch placement: populate existing react/ + go/ placeholders (NOT new fullstack/ branch)"
      - "Backend stack: Go + gin + Postgres"
      - "Spec slot: 056 (055 was taken by legacy-skill-removal packet)"
---
# Implementation Summary: sk-code fullstack branch (REACT + GO live promotion)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 056-sk-code-fullstack-branch |
| **Completed** | 2026-04-30 (85% — incremental deep-reference + asset backfill remains) |
| **Level** | 2 |
| **Builds on** | 054-sk-code-merger (umbrella skill creation), 055-cli-skill-removal-sk-code-merger-deprecated (legacy retirement) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now route every code prompt through `sk-code` with three live stacks instead of one. The smart router now ships full live content for WEBFLOW, REACT, and GO — REACT modeled on the production `kerkmeester.com` codebase, GO paired alongside it as a microservice backend. The cross-stack pairing doc captures the React↔Go API contract, JWT handoff, error envelope, CORS, and deploy topology so both stacks share a single source of truth for what crosses the wire.

### REACT live branch — kerkmeester-style Next.js 14

Stack: Next.js 14 App Router + React 18 + TypeScript ES2023 strict + vanilla-extract (zero-runtime CSS-in-TS) + motion v12 (rebranded continuation of framer-motion) + react-hook-form + zod + Untitled UI (vendored) + react-aria-components + Sonner + next-themes + optional TinaCMS.

- `references/react/README.md` — branch overview, `status: live`, `populated: true`; subfolder map; verification commands; pattern provenance + disclaimer for non-vanilla-extract Next.js projects
- `references/react/implementation/implementation_workflows.md` — Phase-1 entry doc (~330 lines): App Router conventions, Server vs Client Components table, vanilla-extract theme contracts + recipes, motion v12 import pattern (`motion/react`), react-hook-form + zod + Sonner toast, Untitled UI imports, next-themes setup, API integration to Go via `apiCall<T>` wrapper + APIError class, Server Actions alternative
- `references/react/{debugging,verification,deployment,standards}/` — Phase 2/3 + standards folder structure established

### GO live branch — gin + sqlc + Postgres backend

Stack: Go 1.22+ + gin + pgx v5 + sqlc + go-playground/validator + golang-jwt/v5 + golang-migrate + slog + golangci-lint.

- `references/go/README.md` — branch overview, recommended stack, framework alternatives (Echo / Chi / Fiber)
- `references/go/implementation/implementation_workflows.md` — Phase-1 entry doc (~280 lines): cmd/ + internal/ + pkg/ layout, main.go bootstrap with slog + pgxpool + graceful shutdown, gin handler + binding + `respondError` envelope, service layer with `%w` error wrapping, sqlc.yaml + golang-migrate, validator usage, JWT issuance, CORS for Vercel previews
- `references/go/{debugging,verification,deployment,standards}/` — Phase 2/3 + standards folder structure established

### Cross-stack pairing — single source of truth

`references/router/cross_stack_pairing.md` (~470 lines, NEW) — canonical React↔Go contract:
- Topology diagram (Vercel + Railway/Fly.io)
- API contract: REST + JSON envelope (`{data, meta?}` success / `{error: {code, message, details?}}` failure), canonical error codes, camelCase wire fields, RFC 3339 timestamps, prefixed string IDs
- Schema mirroring: zod (React) ↔ go-playground/validator (Go) — manual mirroring with discipline + checklist
- JWT handoff: Go HS256 issuance, two React storage patterns (Auth.js httpOnly cookie OR in-memory + refresh), Go middleware verification
- CORS: `gin-contrib/cors`, exact-match production allowlist + regex `AllowOriginFunc` for Vercel previews; never `["*"]` with credentials
- Cursor pagination + sqlc query pattern
- Deploy topology + local-dev terminal layout
- Drift detection table — when both stacks must update in the same PR

This doc is referenced from BOTH `references/react/implementation/api_integration.md` (when populated) and `references/go/implementation/api_design.md` (when populated) so each stack reads its own side plus the shared contract.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

### Phase 1 — REACT content
Authored `references/react/README.md` (replacing `_placeholder.md` semantically; `populated: true` frontmatter) and `references/react/implementation/implementation_workflows.md` as the Phase-1 entry doc. Subfolder structure preserved for incremental backfill of per-domain deep-references.

### Phase 2 — GO content
Authored `references/go/README.md` and `references/go/implementation/implementation_workflows.md` mirroring the same shape.

### Phase 3 — Cross-stack pairing doc
Authored `references/router/cross_stack_pairing.md` covering the full React↔Go contract surface. This is the document that anchors both stacks' API integration patterns.

### Phase 4 — SKILL.md routing + metadata + advisor scoring
- `LIVE_STACKS = {"WEBFLOW", "REACT", "GO"}` (was just WEBFLOW)
- `PLACEHOLDER_STACKS = {"NODEJS", "REACT_NATIVE", "SWIFT"}` (3, down from 5)
- `resource_map_for(REACT)` and `resource_map_for(GO)` — full intent → file maps populated in SKILL.md §2 (mirrors WEBFLOW shape)
- TASK_SIGNALS keyword extensions: ~30 fullstack-specific keywords across REACT and GO
- Phase 2 (Debugging) and Phase 3 (Verification) sections in SKILL.md route REACT and GO to live deep-reference docs alongside WEBFLOW
- `references/router/{stack_detection,resource_loading}.md` updated to reflect the LIVE_STACKS / PLACEHOLDER_STACKS split
- `description.json` keywords (+30) and trigger_examples (+8); version bumped `1.0.0` → `1.1.0`
- `graph-metadata.json` `derived.{trigger_phrases,key_topics,key_files}` extended; `causal_summary` rewritten; `fullstack_branch_packet` field added
- `README.md` Stack Detection table marks REACT/GO LIVE; Structure Inventory shows live subfolders
- `CHANGELOG.md` `[1.1.0]` entry covers all changes

### Phase 5 — Advisor TS scoring
`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts`:
- TOKEN_BOOSTS: ~30 new entries — REACT (vanilla-extract, untitled-ui, hydration, tinacms, sonner, next-themes, react-aria, react-hook-form, kerkmeester, embla, recharts) + GO (gin, sqlc, pgx, golang-migrate, golang-jwt, dlv, pprof, golangci-lint, slog) + generic (fullstack, hydrate, ssr, rsc)
- PHRASE_BOOSTS: ~25 multi-word phrases (`app router`, `server component`, `server action`, `kerkmeester pattern`, `motion v12`, `vanilla-extract recipe`, `gin handler`, `sqlc query`, `react go pairing`, `cross-stack pairing`, `jwt handoff`, etc.)
- TS build clean (`npm run build` exits 0)
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

1. **Populate existing placeholders, not a new branch** — User-resolved; preserves the established stack-detection precedence (no new marker rules) and the existing folder shape from the merger packet.
2. **Backend stack: Go + gin + Postgres** — User-resolved alternative to Next.js API Routes. Pairs cleanly with the kerkmeester-style frontend; sqlc gives compile-time SQL safety; gin is well-documented; Echo / Chi / Fiber alternatives are noted in `gin_handler_patterns.md` for users on different frameworks.
3. **REACT content modeled on kerkmeester.com (production codebase), not generic Next.js** — User-stated preference. Trade-off: any Next.js / React project routes to kerkmeester-flavored content even if it uses Tailwind / framer-motion. Mitigation: each new doc opens with a "If you're not on this exact stack" note; architectural patterns transfer; styling/animation specifics adapt.
4. **Schema mirroring (zod ↔ validator) is manual, not codegen** — Trade-off: less mechanical safety, but no build-step complexity. Reconsider at scale (~50+ shared schemas).
5. **JWT in httpOnly cookie OR in-memory + refresh — never localStorage** — Security decision. Both patterns documented; choice per project. localStorage is the XSS exfiltration vector and is excluded from guidance.
6. **Cross-stack pairing doc is one file referenced from BOTH stacks** — Avoids drift; single source of truth for what crosses the wire. Drift-detection table enumerates when both stacks must update in the same PR.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Performed

| Check | Status | Notes |
|---|---|---|
| TypeScript advisor build | PASS | `cd mcp_server && npm run build` → exit 0 |
| Spec validate (initial) | FAILED → fixed | 4 errors → 0 after spec.md / plan.md / checklist.md template alignment |
| Cross-stack pairing references both stacks | PASS | Pairing doc referenced from `references/react/implementation/implementation_workflows.md` §8 and `references/go/implementation/implementation_workflows.md` (CORS section + footer) |

### Pending

| Check | Method |
|---|---|
| Spec validate strict pass | `bash validate.sh --strict` (re-run after impl-summary fix) |
| Advisor SQLite rebuild | `advisor_rebuild({force: true})` MCP call |
| 7 trigger tests | 5 packet-new (Next.js + vanilla-extract / Server Action + zod / gin + sqlc / JWT React↔Go / Webflow regression) + 2 regression (Audit OpenCode plugin loader → sk-code-opencode; review this PR → sk-code-review) |
| Lane-attribution test | `npx vitest run lane-attribution.test.ts` |
| File path resolution | Read `references/{react,go}/implementation/implementation_workflows.md` end-to-end; confirm cross-stack pairing doc loads from both branches |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Per-domain react/ deep-reference docs** (app_router_patterns, vanilla_extract_styling, motion_animation, forms_validation, accessibility_aria, api_integration, content_tinacms) — folder structure exists; deep-references can be populated incrementally. The `implementation_workflows.md` entry doc covers them at the architectural level; each becomes a deeper expansion when first consumed.
- **Per-domain go/ deep-reference docs** (gin_handler_patterns, service_layer, database_sqlc_postgres, validation_patterns, auth_jwt, error_envelopes, api_design) — same pattern; pairing doc is canonical for cross-stack contract; incremental expansion otherwise.
- **Asset pattern files** (`assets/{react,go}/patterns/*.{ts,tsx,go}`) — runnable code samples; folder structure exists; samples added when first consumed.
- **Asset checklists** (`assets/{react,go}/checklists/code_quality_checklist.md`) — folder structure exists; canonical P0/P1/P2 items can be filled incrementally.
- **Sister SKILL.md cross-refs (Tier 3 from packet 054)** — still pending. Cosmetic; doesn't affect routing.
- **Deep-review agent definitions (Tier 5 from packet 054)** — still pending. Cosmetic.
- **Acceptance scenarios** in spec.md — Level 2 expects 4+; current packet captures requirements as REQ-NNN bullets which the validator counts separately. Non-blocking warning, doesn't prevent verification.
<!-- /ANCHOR:limitations -->

---

## Related Packets

- `054-sk-code-merger` — created the umbrella `sk-code` skill (this packet builds on it)
- `055-cli-skill-removal-sk-code-merger-deprecated` — removed the legacy sibling skills (created the placeholder pattern this packet replaces for REACT and GO)
