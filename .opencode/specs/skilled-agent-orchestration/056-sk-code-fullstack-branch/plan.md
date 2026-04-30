---
title: "Implementation Plan: sk-code react/ + go/ live promotion (kerkmeester-style + Go pairing)"
description: "5-phase plan promoting react/ and go/ from placeholder to live in sk-code, with kerkmeester.com as frontend reference and gin+sqlc+Postgres as backend pairing."
trigger_phrases: ["056 plan", "sk-code fullstack plan", "react go promotion plan"]
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/056-sk-code-fullstack-branch"
    last_updated_at: "2026-04-30T13:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan authored with 5-phase structure"
    next_safe_action: "Begin Phase 1: author react/ implementation core"
    blockers: []
    completion_pct: 5
---
# Implementation Plan: sk-code react/ + go/ live promotion

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

> Authoritative plan source: `~/.claude/plans/merge-users-michelkerkmeester-mega-devel-crispy-rabin.md`. This file mirrors structure with packet-local anchors.

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack (frontend example)** | Next.js 14 + React 18 + TypeScript (ES2023, strict) + vanilla-extract + motion v12 + react-hook-form + zod + react-aria + Untitled UI |
| **Language/Stack (backend example)** | Go 1.22+ + gin + Postgres (pgx driver) + sqlc + go-playground/validator + golang-jwt |
| **Storage** | Filesystem only (skill markdown + assets); Postgres referenced in backend content but no DB created here |
| **Testing** | `bash validate.sh --strict` for spec; `npm run build` + `npx vitest` for advisor; manual trigger tests for routing |
| **Source reference** | `/Users/michelkerkmeester/MEGA/Development/Websites/kerkmeester.com/README.md` (frontend) |

### Overview
Populate the existing react/ and go/ placeholder folders in sk-code with substantive content modeled on kerkmeester.com (frontend) and a gin+sqlc+Postgres backend pairing. Promote both stacks from PLACEHOLDER_STACKS to LIVE_STACKS in SKILL.md routing. Add a cross-stack pairing reference doc that documents the React↔Go contract (API envelope shape, JWT handoff, CORS, deploy topology). No new branch label or detection edits — uses existing Next.js → REACT and `go.mod` → GO precedent.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] kerkmeester.com README + manifests read; stack confirmed
- [x] User-resolved decisions captured (placement: existing placeholders; backend: gin + Postgres; spec slot: 056)
- [x] sk-code current structure mapped
- [x] Plan reviewed against existing webflow/ branch shape

### Definition of Done
- [ ] All P0 acceptance criteria met (REQ-001..REQ-007)
- [ ] `bash validate.sh --strict` exits 0
- [ ] 7 trigger-test prompts route correctly
- [ ] `npx vitest run lane-attribution.test.ts` passes
- [ ] No `_placeholder.md` remains in react/ or go/ folders
- [ ] checklist.md items marked `[x]` with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Stack table after change

| Stack | Status | Detection | Content |
|---|---|---|---|
| WEBFLOW | LIVE (existing) | Webflow markers + motion.dev / GSAP / Lenis / HLS / Swiper / FilePond signals | Carried from packet 054 |
| REACT | LIVE (this packet) | `next.config.*` / `package.json`+react/next | Kerkmeester-style: Next.js 14 App Router + vanilla-extract + motion v12 + react-hook-form/zod + react-aria + Untitled UI + next-themes + optional TinaCMS |
| GO | LIVE (this packet) | `go.mod` | gin + sqlc + pgx + Postgres + go-playground/validator + golang-jwt; pairs with REACT |
| NODEJS | placeholder | `package.json` (fallback) | unchanged → `_placeholder.md` |
| REACT_NATIVE | placeholder | `app.json`+expo OR `package.json`+react-native | unchanged → `_placeholder.md` |
| SWIFT | placeholder | `Package.swift` / `*.xcodeproj` | unchanged → `_placeholder.md` |

### Routing model

- `LIVE_STACKS = {"WEBFLOW", "REACT", "GO"}` — full intent → file maps via `resource_map_for(stack)` in SKILL.md §2
- `PLACEHOLDER_STACKS = {"NODEJS", "REACT_NATIVE", "SWIFT"}` — `_placeholder.md` pointer for every intent
- Stack detection unchanged (existing precedence), no new branch labels

### Cross-stack pairing surface

`references/router/cross_stack_pairing.md` is read from BOTH stacks: `references/react/implementation/api_integration.md` and `references/go/implementation/api_design.md` link to it as their canonical source for API contract, JWT handoff, error envelope, CORS, and deploy topology. Drift detection table in the pairing doc enumerates "when both stacks must update in the same PR" (field rename, error code change, JWT claim addition, etc.).

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: react/ content (kerkmeester-style frontend)
- [ ] Create `references/react/README.md` (replaces _placeholder.md; populated:true)
- [ ] Author `references/react/implementation/{implementation_workflows,app_router_patterns,vanilla_extract_styling,motion_animation,forms_validation,accessibility_aria,api_integration,content_tinacms}.md`
- [ ] Author `references/react/debugging/{debugging_workflows,hydration_errors,network_inspection}.md`
- [ ] Author `references/react/verification/verification_workflows.md`
- [ ] Author `references/react/deployment/vercel_deploy.md`
- [ ] Author `references/react/standards/{code_style,file_organization}.md`
- [ ] Create `assets/react/README.md`
- [ ] Author `assets/react/checklists/{code_quality,debugging,verification}_checklist.md`
- [ ] Author `assets/react/patterns/{server_action_pattern.tsx,api_call_pattern.ts,form_pattern.tsx,motion_pattern.tsx,vanilla_extract_recipe.css.ts}`
- [ ] Author `assets/react/integrations/{vanilla_extract,untitled_ui,tinacms}.md`

### Phase 2: go/ content (gin + sqlc + Postgres backend)
- [ ] Create `references/go/README.md` (replaces _placeholder.md)
- [ ] Author `references/go/implementation/{implementation_workflows,gin_handler_patterns,service_layer,database_sqlc_postgres,validation_patterns,auth_jwt,error_envelopes,api_design}.md`
- [ ] Author `references/go/debugging/{debugging_workflows,pprof_profiling}.md`
- [ ] Author `references/go/verification/verification_workflows.md`
- [ ] Author `references/go/deployment/docker_railway.md`
- [ ] Author `references/go/standards/{code_style,file_organization}.md`
- [ ] Create `assets/go/README.md`
- [ ] Author `assets/go/checklists/{code_quality,debugging,verification}_checklist.md`
- [ ] Author `assets/go/patterns/{handler_pattern,service_pattern,repository_sqlc,jwt_middleware,table_test_pattern_test}.go`

### Phase 3: Cross-stack pairing doc
- [ ] Author `references/router/cross_stack_pairing.md` (~150 lines: API envelope, JWT handoff, CORS, deploy)
- [ ] Cross-link from `references/react/implementation/api_integration.md` and `references/go/implementation/api_design.md`

### Phase 4: SKILL.md routing + metadata
- [ ] Update `LIVE_STACKS` and `PLACEHOLDER_STACKS` in `SKILL.md`
- [ ] Populate `resource_map_for(REACT)` with intent → file maps
- [ ] Populate `resource_map_for(GO)` with intent → file maps
- [ ] Add ~25 fullstack-specific keywords to `TASK_SIGNALS`
- [ ] Update `references/router/stack_detection.md` (precedence table marks REACT + GO LIVE)
- [ ] Update `references/router/main_router.md` (extended pseudocode)
- [ ] Update `graph-metadata.json` (key_files += ~30 paths; trigger_phrases += keywords)
- [ ] Update `description.json` (keywords + trigger_examples)
- [ ] Update `README.md` (structure inventory + stack-detection table)
- [ ] Update `CHANGELOG.md` ([1.1.0] entry)
- [ ] Update advisor `lib/scorer/lanes/explicit.ts` (~12 TOKEN_BOOSTS additions)

### Phase 5: Validate
- [ ] `bash validate.sh --strict` on packet folder
- [ ] `npm run build` advisor TS clean
- [ ] `advisor_rebuild` MCP tool refreshes SQLite
- [ ] 7 trigger-test prompts route as expected
- [ ] `npx vitest run lane-attribution.test.ts` green
- [ ] Pattern code lints clean (`tsc --noEmit` + `gofmt -d`)
- [ ] Spot-check fullstack patterns against actual kerkmeester.com code
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | Spec packet structure | `bash validate.sh --strict` |
| Unit | Lane scorer attribution | `npx vitest run lane-attribution.test.ts` |
| Manual routing | 7 representative prompts → expected skill+stack | Direct skill_advisor.py invocation |
| Pattern lint | Asset code samples | `tsc --noEmit` (TS); `gofmt -d` (Go) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| kerkmeester.com README + manifests | External (read-only) | Green | Content authoring blocked; no fallback |
| Skill advisor TS build | Internal | Green | Routing won't update without TS rebuild |
| advisor_rebuild MCP | Internal | Green | SQLite stale |
| Existing `references/webflow/` shape | Internal | Green | Used as layout template; no changes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: trigger tests regress (Webflow flicker no longer routes to WEBFLOW; OpenCode plugin no longer routes to opencode)
- **Procedure**:
  1. `git checkout HEAD -- .opencode/skill/sk-code/SKILL.md` (revert routing changes)
  2. `git checkout HEAD -- .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` (revert advisor edits)
  3. Re-run `npm run build` + `advisor_rebuild` to restore prior state
  4. New content under `references/react/`, `references/go/`, `assets/react/`, `assets/go/` can stay on disk (harmless without routing changes); placeholders re-emerge if SKILL.md reverted
<!-- /ANCHOR:rollback -->
