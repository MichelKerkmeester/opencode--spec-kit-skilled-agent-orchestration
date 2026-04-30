---
title: "Tasks: sk-code react/ + go/ live promotion"
description: "Task tracking for 056 packet. 5 phases. Mirrors plan.md."
trigger_phrases: ["056 tasks", "sk-code fullstack tasks"]
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/056-sk-code-fullstack-branch"
    last_updated_at: "2026-04-30T13:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Task list authored"
    next_safe_action: "Execute Phase 1 — author react/ content"
    blockers: []
    completion_pct: 5
---
# Tasks: sk-code react/ + go/ live promotion

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Format**: `T### [P?] Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Spec packet bootstrap.

- [x] T001 Create spec folder `056-sk-code-fullstack-branch/`
- [x] T002 Author spec.md (problem, scope, requirements P0/P1/P2)
- [x] T003 Author plan.md (5-phase plan)
- [x] T004 Author tasks.md (this file)
- [ ] T005 Author checklist.md
- [ ] T006 Generate description.json + graph-metadata.json
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Author react/ + go/ content + cross-stack pairing + SKILL.md routing updates.

### Phase 2.a: react/ content (kerkmeester-style)
- [ ] T010 Create `references/react/README.md` (replaces _placeholder.md)
- [ ] T011 Author `references/react/implementation/implementation_workflows.md` (Phase 1 entry)
- [ ] T012 [P] Author `references/react/implementation/app_router_patterns.md`
- [ ] T013 [P] Author `references/react/implementation/vanilla_extract_styling.md`
- [ ] T014 [P] Author `references/react/implementation/motion_animation.md`
- [ ] T015 [P] Author `references/react/implementation/forms_validation.md`
- [ ] T016 [P] Author `references/react/implementation/accessibility_aria.md`
- [ ] T017 [P] Author `references/react/implementation/api_integration.md`
- [ ] T018 [P] Author `references/react/implementation/content_tinacms.md`
- [ ] T019 [P] Author `references/react/debugging/debugging_workflows.md`
- [ ] T020 [P] Author `references/react/debugging/hydration_errors.md`
- [ ] T021 [P] Author `references/react/debugging/network_inspection.md`
- [ ] T022 [P] Author `references/react/verification/verification_workflows.md`
- [ ] T023 [P] Author `references/react/deployment/vercel_deploy.md`
- [ ] T024 [P] Author `references/react/standards/code_style.md`
- [ ] T025 [P] Author `references/react/standards/file_organization.md`
- [ ] T026 Author `assets/react/README.md`
- [ ] T027 [P] Author `assets/react/checklists/code_quality_checklist.md` (P0/P1/P2)
- [ ] T028 [P] Author `assets/react/checklists/debugging_checklist.md`
- [ ] T029 [P] Author `assets/react/checklists/verification_checklist.md`
- [ ] T030 [P] Author `assets/react/patterns/server_action_pattern.tsx`
- [ ] T031 [P] Author `assets/react/patterns/api_call_pattern.ts`
- [ ] T032 [P] Author `assets/react/patterns/form_pattern.tsx`
- [ ] T033 [P] Author `assets/react/patterns/motion_pattern.tsx`
- [ ] T034 [P] Author `assets/react/patterns/vanilla_extract_recipe.css.ts`
- [ ] T035 [P] Author `assets/react/integrations/vanilla_extract.md`
- [ ] T036 [P] Author `assets/react/integrations/untitled_ui.md`
- [ ] T037 [P] Author `assets/react/integrations/tinacms.md`
- [ ] T038 Delete `references/react/_placeholder.md` and `assets/react/_placeholder.md`

### Phase 2.b: go/ content (gin + sqlc + Postgres)
- [ ] T040 Create `references/go/README.md` (replaces _placeholder.md)
- [ ] T041 Author `references/go/implementation/implementation_workflows.md`
- [ ] T042 [P] Author `references/go/implementation/gin_handler_patterns.md`
- [ ] T043 [P] Author `references/go/implementation/service_layer.md`
- [ ] T044 [P] Author `references/go/implementation/database_sqlc_postgres.md`
- [ ] T045 [P] Author `references/go/implementation/validation_patterns.md`
- [ ] T046 [P] Author `references/go/implementation/auth_jwt.md`
- [ ] T047 [P] Author `references/go/implementation/error_envelopes.md`
- [ ] T048 [P] Author `references/go/implementation/api_design.md`
- [ ] T049 [P] Author `references/go/debugging/debugging_workflows.md`
- [ ] T050 [P] Author `references/go/debugging/pprof_profiling.md`
- [ ] T051 [P] Author `references/go/verification/verification_workflows.md`
- [ ] T052 [P] Author `references/go/deployment/docker_railway.md`
- [ ] T053 [P] Author `references/go/standards/code_style.md`
- [ ] T054 [P] Author `references/go/standards/file_organization.md`
- [ ] T055 Author `assets/go/README.md`
- [ ] T056 [P] Author `assets/go/checklists/code_quality_checklist.md`
- [ ] T057 [P] Author `assets/go/checklists/debugging_checklist.md`
- [ ] T058 [P] Author `assets/go/checklists/verification_checklist.md`
- [ ] T059 [P] Author `assets/go/patterns/handler_pattern.go`
- [ ] T060 [P] Author `assets/go/patterns/service_pattern.go`
- [ ] T061 [P] Author `assets/go/patterns/repository_sqlc.go`
- [ ] T062 [P] Author `assets/go/patterns/jwt_middleware.go`
- [ ] T063 [P] Author `assets/go/patterns/table_test_pattern_test.go`
- [ ] T064 Delete `references/go/_placeholder.md` and `assets/go/_placeholder.md`

### Phase 2.c: Cross-stack pairing
- [ ] T070 Author `references/router/cross_stack_pairing.md` (~150 lines)
- [ ] T071 Cross-link from react/implementation/api_integration.md and go/implementation/api_design.md

### Phase 2.d: SKILL.md routing + metadata
- [ ] T080 Update `SKILL.md` LIVE_STACKS, PLACEHOLDER_STACKS, resource_map_for(REACT), resource_map_for(GO), TASK_SIGNALS keywords
- [ ] T081 Update `references/router/stack_detection.md` precedence table
- [ ] T082 Update `references/router/main_router.md` pseudocode reference
- [ ] T083 Update `graph-metadata.json` key_files + trigger_phrases + intent_signals
- [ ] T084 Update `description.json` keywords + trigger_examples
- [ ] T085 Update `README.md` structure inventory + stack-detection table
- [ ] T086 Update `CHANGELOG.md` [1.1.0] entry
- [ ] T087 Update advisor `lib/scorer/lanes/explicit.ts` TOKEN_BOOSTS (~12 tokens)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T090 `bash validate.sh --strict` on `056-sk-code-fullstack-branch` exits 0
- [ ] T091 `cd mcp_server && npm run build` clean
- [ ] T092 `advisor_rebuild` MCP tool refreshes SQLite (skillCount unchanged; indexedNodes reflects updated paths)
- [ ] T093 Trigger test: "fix Webflow animation flicker" → sk-code WEBFLOW (regression check)
- [ ] T094 [P] Trigger test: "implement Next.js App Router page with vanilla-extract" → sk-code REACT
- [ ] T095 [P] Trigger test: "add a Server Action with zod validation" → sk-code REACT
- [ ] T096 [P] Trigger test: "build a gin handler with sqlc" → sk-code GO
- [ ] T097 [P] Trigger test: "set up JWT auth between Next.js and Go" → sk-code (REACT or GO)
- [ ] T098 [P] Trigger test: "Audit OpenCode plugin loader" → sk-code-opencode (regression)
- [ ] T099 [P] Trigger test: "review this PR" → sk-code-review (regression)
- [ ] T100 `npx vitest run lane-attribution.test.ts` green
- [ ] T101 Pattern code lints clean (`tsc --noEmit` + `gofmt -d`)
- [ ] T102 Cross-repo regrep `_placeholder.md` returns only nodejs/, react-native/, swift/ entries
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks (T001..T087, T090..T102) complete
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification (T093..T099) passed: 7/7 routing
- [ ] `tsc --noEmit` and `gofmt -d` clean on patterns
- [ ] checklist.md verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Approved planning artifact**: `~/.claude/plans/merge-users-michelkerkmeester-mega-devel-crispy-rabin.md`
- **Frontend reference source**: `/Users/michelkerkmeester/MEGA/Development/Websites/kerkmeester.com/README.md`
<!-- /ANCHOR:cross-refs -->
