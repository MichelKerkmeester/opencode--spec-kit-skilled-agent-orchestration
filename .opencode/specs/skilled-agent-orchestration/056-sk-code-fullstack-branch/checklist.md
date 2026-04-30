---
title: "Verification Checklist: sk-code react/ + go/ live promotion"
description: "P0/P1/P2 verification items for 056. Verification Date: TBD."
trigger_phrases: ["056 checklist", "sk-code fullstack checklist"]
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/056-sk-code-fullstack-branch"
    last_updated_at: "2026-04-30T13:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Checklist authored"
    next_safe_action: "Mark items [x] with evidence as work completes"
    blockers: []
    completion_pct: 5
---
# Verification Checklist: sk-code react/ + go/ live promotion

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-021) [File: spec.md §4]
- [x] CHK-002 [P0] Plan authored with 5-phase structure [File: plan.md §4 — Phase 1 react/, Phase 2 go/, Phase 3 cross-stack, Phase 4 routing, Phase 5 validate]
- [x] CHK-003 [P0] kerkmeester README + manifests read; stack confirmed [Source: kerkmeester.com README] [File: spec.md §1 Technical Context]
- [x] CHK-004 [P1] User-resolved decisions captured (placement: existing placeholders; backend: gin + Postgres; spec slot: 056) [File: spec.md §1] [Source: ~/.claude/plans/merge-users-michelkerkmeester-mega-devel-crispy-rabin.md "Confirmed by user" section]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:react-content -->
## React/ Content (kerkmeester-style frontend)

- [ ] CHK-010 [P0] `references/react/README.md` exists with populated:true frontmatter (replaces _placeholder.md)
- [ ] CHK-011 [P0] `references/react/implementation/implementation_workflows.md` exists with substantive content (>100 lines)
- [ ] CHK-012 [P0] `references/react/implementation/{app_router_patterns,vanilla_extract_styling,motion_animation,forms_validation,accessibility_aria,api_integration}.md` authored
- [ ] CHK-013 [P1] `references/react/implementation/content_tinacms.md` authored
- [ ] CHK-014 [P0] `references/react/debugging/{debugging_workflows,hydration_errors}.md` authored
- [ ] CHK-015 [P1] `references/react/debugging/network_inspection.md` authored
- [ ] CHK-016 [P0] `references/react/verification/verification_workflows.md` authored
- [ ] CHK-017 [P0] `references/react/standards/{code_style,file_organization}.md` authored
- [ ] CHK-018 [P1] `references/react/deployment/vercel_deploy.md` authored
- [ ] CHK-019 [P0] `assets/react/README.md` + 3 checklists + 5 patterns authored
- [ ] CHK-020 [P1] `assets/react/integrations/{vanilla_extract,untitled_ui,tinacms}.md` authored
- [ ] CHK-021 [P0] `assets/react/patterns/*.{ts,tsx}` lint clean (`tsc --noEmit`)
- [ ] CHK-022 [P0] No `_placeholder.md` remaining in `references/react/` or `assets/react/`
<!-- /ANCHOR:react-content -->

---

<!-- ANCHOR:go-content -->
## Go/ Content (gin + sqlc + Postgres backend)

- [ ] CHK-030 [P0] `references/go/README.md` exists with populated:true frontmatter
- [ ] CHK-031 [P0] `references/go/implementation/implementation_workflows.md` substantive (>100 lines)
- [ ] CHK-032 [P0] `references/go/implementation/{gin_handler_patterns,service_layer,database_sqlc_postgres,validation_patterns,auth_jwt,error_envelopes,api_design}.md` authored
- [ ] CHK-033 [P0] `references/go/debugging/debugging_workflows.md` authored
- [ ] CHK-034 [P2] `references/go/debugging/pprof_profiling.md` authored
- [ ] CHK-035 [P0] `references/go/verification/verification_workflows.md` authored
- [ ] CHK-036 [P0] `references/go/standards/{code_style,file_organization}.md` authored
- [ ] CHK-037 [P1] `references/go/deployment/docker_railway.md` authored
- [ ] CHK-038 [P0] `assets/go/README.md` + 3 checklists + 5 .go patterns authored
- [ ] CHK-039 [P0] `assets/go/patterns/*.go` `gofmt -d` empty (formatted clean)
- [ ] CHK-040 [P0] No `_placeholder.md` remaining in `references/go/` or `assets/go/`
<!-- /ANCHOR:go-content -->

---

<!-- ANCHOR:cross-stack -->
## Cross-stack pairing

- [ ] CHK-050 [P0] `references/router/cross_stack_pairing.md` authored (~150 lines)
- [ ] CHK-051 [P1] Cross-linked from `references/react/implementation/api_integration.md` and `references/go/implementation/api_design.md`
<!-- /ANCHOR:cross-stack -->

---

<!-- ANCHOR:routing-updates -->
## SKILL.md routing + metadata updates

- [ ] CHK-060 [P0] `LIVE_STACKS = {WEBFLOW, REACT, GO}` and `PLACEHOLDER_STACKS = {NODEJS, REACT_NATIVE, SWIFT}` in SKILL.md
- [ ] CHK-061 [P0] `resource_map_for(REACT)` populated with intent → file maps mirroring WEBFLOW shape
- [ ] CHK-062 [P0] `resource_map_for(GO)` populated similarly
- [ ] CHK-063 [P0] ~25 fullstack-specific keywords added to TASK_SIGNALS (vanilla-extract, motion v12, server action, gin, sqlc, etc.)
- [ ] CHK-064 [P1] `references/router/stack_detection.md` precedence table updated
- [ ] CHK-065 [P1] `references/router/main_router.md` pseudocode extended
- [ ] CHK-066 [P0] `graph-metadata.json` key_files += new paths; trigger_phrases extended
- [ ] CHK-067 [P1] `description.json` keywords + trigger_examples extended
- [ ] CHK-068 [P1] `README.md` structure inventory updated
- [ ] CHK-069 [P1] `CHANGELOG.md` `[1.1.0]` entry authored
- [ ] CHK-070 [P0] Advisor `lib/scorer/lanes/explicit.ts` TOKEN_BOOSTS gain ~12 stack-specific tokens
- [ ] CHK-071 [P0] `cd mcp_server && npm run build` clean
- [ ] CHK-072 [P0] `advisor_rebuild` MCP tool refreshes SQLite without errors
<!-- /ANCHOR:routing-updates -->

---

<!-- ANCHOR:routing-tests -->
## Trigger Tests

- [ ] CHK-080 [P0] "fix Webflow animation flicker" → sk-code WEBFLOW (no regression)
- [ ] CHK-081 [P0] "implement Next.js App Router page with vanilla-extract" → sk-code REACT
- [ ] CHK-082 [P0] "add a Server Action with zod validation" → sk-code REACT
- [ ] CHK-083 [P0] "build a gin handler with sqlc" → sk-code GO
- [ ] CHK-084 [P0] "set up JWT auth between Next.js and Go" → sk-code (REACT or GO)
- [ ] CHK-085 [P0] "Audit OpenCode plugin loader" → sk-code-opencode (no regression)
- [ ] CHK-086 [P0] "review this PR" → sk-code-review (no regression)
- [ ] CHK-087 [P0] `npx vitest run lane-attribution.test.ts` green
<!-- /ANCHOR:routing-tests -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-088 [P0] All authored markdown passes existing linters (no broken links inside packet)
- [ ] CHK-089 [P0] React assets/patterns/*.{ts,tsx} compile under `tsc --noEmit` from a clean fixture
- [ ] CHK-090 [P0] Go assets/patterns/*.go pass `gofmt -d` (no diff)
- [ ] CHK-091 [P1] All new docs include YAML frontmatter (`title`, `description`, `keywords`)
- [ ] CHK-092 [P1] No commented-out code in pattern files; no dead imports
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-093 [P0] 7-prompt trigger battery exits 0 (5 packet-new + 2 regression)
- [ ] CHK-094 [P0] `npx vitest run lane-attribution.test.ts` green
- [ ] CHK-095 [P1] Skill advisor `--threshold 0.5` returns sk-code as top hit on each REACT/GO trigger prompt
- [ ] CHK-096 [P2] Manual smoke: spot-check pattern code in a real Next.js + Go fixture
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-097 [P0] Cross-stack pairing doc `auth_jwt` patterns load HS256 secret from env, not hardcoded
- [ ] CHK-098 [P0] CORS guidance never combines `AllowOrigins: ["*"]` with `AllowCredentials: true`
- [ ] CHK-099 [P0] React-side JWT storage guidance excludes `localStorage` / `sessionStorage` (XSS exposure)
- [ ] CHK-100 [P1] Validator / zod schema mirroring section flags drift-detection items as P0
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-101 [P0] `references/router/cross_stack_pairing.md` referenced from BOTH `references/react/implementation/api_integration.md` AND `references/go/implementation/api_design.md`
- [ ] CHK-102 [P0] `CHANGELOG.md` `[1.1.0]` entry covers REACT + GO promotion + pairing doc + advisor scoring updates
- [ ] CHK-103 [P0] `README.md` structure inventory reflects live REACT + GO branches
- [ ] CHK-104 [P0] `description.json` and `graph-metadata.json` keywords/trigger_phrases extended with fullstack tokens
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-105 [P0] No new top-level folders under `sk-code/` (only existing `references/` + `assets/` + `scripts/` + spec metadata)
- [ ] CHK-106 [P0] `references/react/` and `references/go/` mirror the `references/webflow/` shape (implementation/debugging/verification/deployment/standards/)
- [ ] CHK-107 [P1] `assets/react/{checklists,patterns,integrations}/` and `assets/go/{checklists,patterns}/` match the same convention as `assets/webflow/`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 49 | [ ]/49 |
| P1 Items | 17 | [ ]/17 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: TBD
<!-- /ANCHOR:summary -->
