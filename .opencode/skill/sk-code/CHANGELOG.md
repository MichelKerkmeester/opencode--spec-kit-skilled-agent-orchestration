# Changelog: sk-code

All notable changes to the `sk-code` skill are documented here. The skill follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions.

---

## [1.2.0] — 2026-04-30

### Removed — placeholder stacks dropped entirely

User-directed cleanup. The skill now owns exactly three stacks: WEBFLOW, REACT, GO. Anything else returns UNKNOWN.

- Deleted `references/{nodejs,react-native,swift}/` and `assets/{nodejs,react-native,swift}/` folders entirely (placeholder skeletons that pointed at retired sibling content)
- Stack detection block (SKILL.md §2 + `references/router/stack_detection.md`): removed SWIFT, REACT_NATIVE, NODEJS branches; only WEBFLOW / GO / REACT detection remains
- `LIVE_STACKS = {"WEBFLOW", "REACT", "GO"}`; `PLACEHOLDER_STACKS` removed from the codebase entirely
- `STACK_VERIFICATION_COMMANDS` shrunk to 3 entries (WEBFLOW / REACT / GO)
- Performance / Verification Targets table reduced to REACT + GO entries
- §6 External Resources reorganized: WEBFLOW + REACT (vanilla-extract, motion) + GO (gin, sqlc, pgx) only
- §7 Navigation Guide: live-stack-only language; UNKNOWN explicitly noted as "not owned by this skill"
- description.json + graph-metadata.json: dropped `react-native`, `swift`, `swiftui`, `nodejs`, `expo` from keywords / trigger_phrases / key_topics / domains; `causal_summary` rewritten; `supported_stacks: ["WEBFLOW", "REACT", "GO"]` field added
- README.md: Stack Detection table reduced to WEBFLOW / REACT / GO + UNKNOWN; Structure Inventory drops placeholder stack folders

### Rationale

The prior placeholder pattern (point at retired canonical content + maintain stub folders) added cognitive overhead for the user without serving real workflows — this skill is used for Webflow + the kerkmeester-style React/Go fullstack pairing, nothing else. Cleaner ownership: detection returns UNKNOWN for unsupported stacks, surfacing a disambiguation prompt instead of pretending to route.

### Note

Skill advisor TOKEN_BOOSTS for `nodejs`, `swift`, `swiftui`, `expo` (added in 1.0.0) remain in `lib/scorer/lanes/explicit.ts` but are now dead routes — they still nominally point at sk-code, but UNKNOWN detection will surface disambiguation rather than load resources. Cleanup of the dead boosts is a follow-on (low impact).

---

## [1.1.0] — 2026-04-30

### Added — REACT and GO promoted to LIVE_STACKS

Builds on `054-sk-code-merger` (single live branch) and `055-cli-skill-removal-sk-code-merger-deprecated` (legacy skill removal). Promotes two placeholder stacks to live so `sk-code` now demonstrates a modern fullstack pairing alongside Webflow.

#### REACT — kerkmeester-style Next.js 14 (live)

Modeled on the production `kerkmeester.com` codebase. Stack: Next.js 14 App Router + React 18 + TypeScript ES2023 strict + vanilla-extract (zero-runtime CSS-in-TS) + motion v12 (the new motion library, not framer-motion) + react-hook-form + zod + Untitled UI (vendored) + react-aria-components + Sonner + next-themes + optional TinaCMS.

- `references/react/README.md` — branch overview, status: live, populated: true
- `references/react/implementation/implementation_workflows.md` — Phase-1 entry doc (~330 lines)
- `references/react/implementation/{app_router_patterns,vanilla_extract_styling,motion_animation,forms_validation,accessibility_aria,api_integration,content_tinacms}.md` — deep-reference patterns (skeletons; populate as needed)
- `references/react/{debugging,verification,deployment,standards}/` — Phase 2/3 + standards
- `assets/react/{checklists,patterns,integrations}/` — P0/P1/P2 checklists, .tsx/.ts patterns, vanilla-extract / Untitled UI / TinaCMS integration notes

#### GO — gin + sqlc + Postgres backend (live)

Paired with the React frontend. Stack: Go 1.22+ + gin HTTP framework + pgx v5 Postgres driver + sqlc (compile-time SQL safety) + go-playground/validator + golang-jwt/v5 + golang-migrate + slog + golangci-lint.

- `references/go/README.md` — branch overview, framework alternatives (Echo / Chi / Fiber)
- `references/go/implementation/implementation_workflows.md` — Phase-1 entry doc (~280 lines)
- `references/go/implementation/{gin_handler_patterns,service_layer,database_sqlc_postgres,validation_patterns,auth_jwt,error_envelopes,api_design}.md`
- `references/go/{debugging,verification,deployment,standards}/`
- `assets/go/{checklists,patterns}/` — P0/P1/P2 checklists + 5 runnable Go pattern files

#### Cross-stack pairing

- `references/router/cross_stack_pairing.md` (~470 lines) — canonical React↔Go contract: API shape (REST + JSON envelope, cursor pagination), error envelope `{error: {code, message, details?}}` mirrored on both sides, JWT handoff (Go issues, React via Auth.js or in-memory + refresh, golang-jwt validates), CORS allowlist with Vercel preview regex, deploy topology (Vercel + Railway/Fly.io/DigitalOcean), drift-detection table

### Changed — SKILL.md routing

- `LIVE_STACKS = {"WEBFLOW", "REACT", "GO"}` (was `{"WEBFLOW"}`)
- `PLACEHOLDER_STACKS = {"NODEJS", "REACT_NATIVE", "SWIFT"}` (was 5; now 3)
- `resource_map_for(REACT)` — populated with full intent → file map (IMPLEMENTATION / CODE_QUALITY / DEBUGGING / VERIFICATION / ANIMATION / FORMS / API / DEPLOYMENT / TESTING) — see SKILL.md §2
- `resource_map_for(GO)` — populated with full intent → file map (IMPLEMENTATION / CODE_QUALITY / DEBUGGING / VERIFICATION / DATABASE / API / FORMS / DEPLOYMENT / TESTING)
- TASK_SIGNALS keyword extensions: ~30 fullstack-specific keywords (vanilla-extract, motion v12, server action, server component, hydration, app router, untitled ui, kerkmeester, gin, sqlc, pgx, golang-jwt, golangci-lint, etc.)
- Stack detection unchanged (existing precedence: `next.config.*` → REACT, `go.mod` → GO)
- Phase 2 (Debugging) and Phase 3 (Verification) sections now route REACT and GO to live deep-reference docs alongside WEBFLOW

### Changed — metadata + advisor scoring

- `description.json` — keywords (+30) and trigger_examples (+8 fullstack examples) extended; version bumped to `1.1.0`
- `graph-metadata.json` — `derived.trigger_phrases` extended (+40); `derived.key_topics` extended (+15); `derived.key_files` extended (+8); `causal_summary` rewritten; `fullstack_branch_packet` field added
- Skill advisor `lib/scorer/lanes/explicit.ts`:
  - TOKEN_BOOSTS: ~30 new entries for kerkmeester-style React tokens (vanilla-extract, untitled-ui, hydration, tinacms, sonner, next-themes, react-aria, react-hook-form, kerkmeester, etc.) and Go tokens (gin, sqlc, pgx, golang-migrate, golang-jwt, dlv, pprof, golangci-lint, slog, etc.)
  - PHRASE_BOOSTS: ~25 new multi-word phrases (`app router`, `server component`, `server action`, `kerkmeester pattern`, `motion v12`, `vanilla-extract recipe`, `gin handler`, `sqlc query`, `react go pairing`, `cross-stack pairing`, `jwt handoff`, etc.)

### Spec Folder

Full spec docs: `.opencode/specs/skilled-agent-orchestration/056-sk-code-fullstack-branch/` (Level 2)
- `spec.md` (REQ-001..REQ-021 P0/P1/P2 requirements; SC-001..SC-007 success criteria)
- `plan.md` (5-phase implementation plan)
- `tasks.md` (T001..T102 task breakdown)
- `checklist.md` (32 P0 + 14 P1 + 1 P2 verification items)
- `description.json` + `graph-metadata.json`

### Three Placeholder Stacks Remain

`NODEJS`, `REACT_NATIVE`, `SWIFT` continue to surface `_placeholder.md` pointers (canonical content retired in `055-cli-skill-removal-sk-code-merger-deprecated`).

---

## [1.0.1] — 2026-04-30

### Removed

- The two predecessor sibling skills retired by packet `054-sk-code-merger` (a Webflow-focused skill and a multi-stack reference skill) were hard-deleted in packet `055-cli-skill-removal-sk-code-merger-deprecated`.
- The 10 `_placeholder.md` stubs under `references/<stack>/` and `assets/<stack>/` (react, nodejs, go, swift, react-native) were neutralized: `canonical_source: null`, `populated: false`, body now points at git history rather than the retired sibling.

### Changed

- `description.json`, `graph-metadata.json`, `SKILL.md`, `README.md` — all retired-sibling mentions stripped; cross-skill sibling adjacency edges removed.
- Cross-skill READMEs (sk-code-review, sk-code-opencode, mcp-chrome-devtools, cli-* orchestrators), root README/AGENTS.md/CLAUDE.md, install guides, four runtime deep-review agent definitions, and SQLite skill-graph / code-graph / voyage context-index databases were all swept (full file list in `055-cli-skill-removal-sk-code-merger-deprecated/implementation-summary.md`).

---

## [1.0.0] — 2026-04-30

### Added

This is the **baseline release** of the umbrella `sk-code` skill, created by merging two earlier predecessor sibling skills (a Webflow-focused frontend skill, ~50 files; and a multi-stack reference skill bundling React, Node.js, Go, Swift, React Native, ~35 docs across 5 stacks). Both predecessors were soft-deprecated by the merger and hard-deleted in [1.0.1] above.

#### New Architecture

- **Smart router** with stack-detection-first ordering (`SKILL.md §2`)
- Marker-file precedence: WEB → GO → SWIFT → REACT_NATIVE → REACT → NODEJS → UNKNOWN
- Merged TASK_SIGNALS scoring (12 intents) combining high-resolution web signals with TESTING/DATABASE/API additions
- 4 load levels (MINIMAL / DEBUGGING / FOCUSED / STANDARD)
- Stack-aware verification commands per stack

#### New Files

- `SKILL.md` — merged routing pseudocode, ~700 lines
- `README.md` — setup, troubleshooting, structure inventory, migration notes
- `references/router/stack_detection.md` — marker-file precedence reference
- `references/router/intent_classification.md` — TASK_SIGNALS scoring reference
- `references/router/resource_loading.md` — load level + path resolution reference
- `references/router/phase_lifecycle.md` — 5-phase lifecycle reference
- `references/universal/error_recovery.md` — stack-agnostic recovery decision tree
- `references/universal/code_quality_standards.md` — P0/P1/P2 severity model
- `references/universal/code_style_guide.md` — language-agnostic style principles
- `references/universal/multi_agent_research.md` — 10-agent methodology
- `assets/universal/checklists/debugging_checklist.md` — 4-phase debugging flow
- `assets/universal/checklists/verification_checklist.md` — 8-step gate function
- `assets/universal/patterns/validation_patterns.js`, `assets/universal/patterns/wait_patterns.js`
- 10 placeholder pointers (`references/<stack>/_placeholder.md` × 5 + `assets/<stack>/_placeholder.md` × 5)

#### Web Content (verbatim)

- `references/webflow/implementation/` — 12 files
- `references/webflow/debugging/debugging_workflows.md` + `error_recovery.md`
- `references/webflow/verification/verification_workflows.md` + `performance_checklist.md`
- `references/webflow/deployment/minification_guide.md` + `cdn_deployment.md`
- `references/webflow/performance/` — 5 files (cwv_remediation, interaction_gated_loading, resource_loading, third_party, webflow_constraints)
- `references/webflow/standards/` — 5 files
- `assets/webflow/checklists/` — 4 files (code_quality, debugging, performance_loading, verification)
- `assets/webflow/patterns/` — 4 JS files (interaction_gate, performance, validation, wait)
- `assets/webflow/integrations/` — hls_patterns.js, lenis_patterns.js
- `scripts/` — minify-webflow.mjs, verify-minification.mjs, test-minified-runtime.mjs (CWD-relative)

#### Non-Web Stacks (placeholder route)

- `references/{react,nodejs,go,react-native,swift}/_placeholder.md` and `assets/{react,nodejs,go,react-native,swift}/_placeholder.md` — placeholder stubs (canonical content retired in [1.0.1])

### Routing Changes

- Skill advisor `skill_advisor.py` updated: PHRASE_BOOSTS / TOKEN_BOOSTS retargeted (3 + 17 entries) to map to `sk-code`
- Skill advisor `lib/scorer/lanes/explicit.ts` updated: 18 lane mappings retargeted
- 8 `graph-metadata.json` files updated for cross-skill consistency

### Cross-Repo Reference Updates

- 7 sister SKILL.md cross-refs updated (sk-code-review, sk-code-opencode, mcp-chrome-devtools, cli-claude-code, cli-codex, cli-gemini, sk-improve-prompt)
- 4 root instruction files updated (AGENTS.md, CLAUDE.md, AGENTS_example_fs_enterprises.md, AGENTS_Barter.md)
- 3 deep-review agent definitions updated (.opencode/agent/, .claude/agents/, .gemini/agents/)
- ~10 README/doc files updated (.opencode/skill/README.md, mcp-chrome-devtools READMEs, top-level README.md, observability reports)

### Migration Decisions

5 architectural decisions documented in `.opencode/specs/skilled-agent-orchestration/054-sk-code-merger/decision-record.md`:

- **ADR-001**: Stack-detection-first routing (vs. intent-first) — accepted; ensures correct verification commands per stack
- **ADR-002**: Bare `sk-code` name (vs. `sk-code-stack` or other suffix) — user-directed
- **ADR-003**: Empty templated stubs for non-Webflow stacks — user-directed; preserves "reference for other users" intent
- **ADR-004**: Code-level deprecation exclusion list (vs. SKILL.md rename) — non-invasive, reversible
- **ADR-005**: Tightly-scoped `universal/` namespace — debugging_workflows.md and verification_workflows.md stay in `web/` (browser-coupled per Plan-agent critique)

### Spec Folder

Full spec docs: `.opencode/specs/skilled-agent-orchestration/054-sk-code-merger/`
- `spec.md` (Level 3, complexity 64/100)
- `plan.md` (7-phase implementation plan with critical path)
- `tasks.md` (130+ tasks across 7 phases)
- `checklist.md` (35 P0 / 34 P1 / 6 P2 verification items)
- `decision-record.md` (5 ADRs)

---

## See Also

- `README.md` — setup and troubleshooting
- `SKILL.md` — full routing pseudocode
- Approved planning artifact: `~/.claude/plans/merge-users-michelkerkmeester-mega-devel-crispy-rabin.md`
