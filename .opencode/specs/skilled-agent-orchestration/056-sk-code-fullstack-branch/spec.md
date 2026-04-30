---
title: "Feature Specification: Promote sk-code react/ + go/ placeholders to live branches"
description: "Populate the existing react/ and go/ placeholder stacks in sk-code with kerkmeester-style frontend (Next.js 14 App Router + vanilla-extract + motion v12 + Untitled UI) and a paired Go backend (gin + sqlc + Postgres). Promote both from PLACEHOLDER_STACKS to LIVE_STACKS. No new branch added; uses existing detection precedent."
trigger_phrases: ["sk-code react live", "sk-code go live", "kerkmeester pattern", "fullstack branch", "056 sk-code"]
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/056-sk-code-fullstack-branch"
    last_updated_at: "2026-04-30T13:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Spec authored"
    next_safe_action: "Author react/ + go/ content"
    blockers: []
    completion_pct: 5
---
# Feature Specification: Promote sk-code react/ + go/ placeholders to live branches

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-30 |
| **Branch** | `main` (no feature branch — per-user policy) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-code` currently has one live branch (`webflow/`) and five placeholders (`react/`, `nodejs/`, `go/`, `react-native/`, `swift/`) whose canonical content was retired in packet 055. The user wants TWO of those placeholders promoted to live so `sk-code` immediately serves a modern full-stack project alongside Webflow work — modeled on `kerkmeester.com` (frontend) paired with a recommended Go backend.

### Purpose
Populate `references/react/` + `assets/react/` with kerkmeester-style frontend content (Next.js 14 App Router + vanilla-extract + motion v12 + react-hook-form/zod + Untitled UI + react-aria). Populate `references/go/` + `assets/go/` with a Go-microservice backend (gin + sqlc + Postgres + go-playground/validator + JWT). Add a one-page cross-stack pairing doc. Promote both stacks from `PLACEHOLDER_STACKS` to `LIVE_STACKS`. Stack detection already routes Next.js → REACT and `go.mod` → GO; no detection-block edits needed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace `references/react/_placeholder.md` and `assets/react/_placeholder.md` with `README.md` describing the now-live branch
- Replace `references/go/_placeholder.md` and `assets/go/_placeholder.md` with `README.md`
- Author `references/react/{implementation,debugging,verification,deployment,standards}/` content (~16 markdown files)
- Author `references/go/{implementation,debugging,verification,deployment,standards}/` content (~14 markdown files)
- Author `references/router/cross_stack_pairing.md` (React↔Go canonical contract)
- Author `assets/react/{checklists,patterns,integrations}/` (3 + 5 + 3 files)
- Author `assets/go/{checklists,patterns}/` (3 + 5 files; .go pattern files)
- Update `SKILL.md`: `LIVE_STACKS = {WEBFLOW, REACT, GO}`, `PLACEHOLDER_STACKS = {NODEJS, REACT_NATIVE, SWIFT}`, `resource_map_for(REACT)` + `resource_map_for(GO)` filled with intent → file maps mirroring `WEBFLOW` shape
- Add ~25 fullstack-specific keywords to `TASK_SIGNALS` (vanilla-extract, motion v12, server action, server component, hydration, app router, untitled ui, gin, sqlc, pgx, go-playground/validator, golang-jwt, dlv, etc.)
- Update `graph-metadata.json` `key_files` + `trigger_phrases` + `intent_signals`
- Update `description.json` keywords + trigger_examples
- Update `references/router/stack_detection.md` precedence table (REACT + GO marked LIVE)
- Update `references/router/main_router.md` pseudocode reference (REACT + GO blocks added)
- Update `README.md` structure inventory + stack-detection table
- Update `CHANGELOG.md` with `[1.1.0]` entry
- Update skill advisor `lib/scorer/lanes/explicit.ts` TOKEN_BOOSTS (~12 stack-specific tokens → `sk-code`)
- Validation: spec validate, advisor TS rebuild, advisor_rebuild MCP, 7 trigger-test prompts, lane-attribution test

### Out of Scope
- Touching the `kerkmeester.com` repo itself (read-only reference)
- Populating `nodejs/`, `react-native/`, `swift/` placeholders (remain as-is, canonical content retired notice)
- Adding new placeholder stacks
- Changing stack-detection bash (Next.js → REACT and `go.mod` → GO already work)
- Adding a new "fullstack" or "kerkmeester" stack label (user chose to populate existing placeholders)

### Files to Change

| Path Class | Action | Count |
|------------|--------|-------|
| `.opencode/skill/sk-code/references/react/**` | Create | ~17 (README + 16 docs across 5 subdirs) |
| `.opencode/skill/sk-code/references/go/**` | Create | ~15 (README + 14 docs across 5 subdirs) |
| `.opencode/skill/sk-code/references/router/cross_stack_pairing.md` | Create | 1 |
| `.opencode/skill/sk-code/assets/react/**` | Create | ~12 (3 checklists + 5 patterns + 3 integrations + README) |
| `.opencode/skill/sk-code/assets/go/**` | Create | ~9 (3 checklists + 5 patterns + README) |
| `.opencode/skill/sk-code/SKILL.md` | Modify | 1 |
| `.opencode/skill/sk-code/{README,CHANGELOG,graph-metadata.json,description.json}` | Modify | 4 |
| `.opencode/skill/sk-code/references/router/{stack_detection,main_router}.md` | Modify | 2 |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | Modify | 1 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `references/react/` and `assets/react/` populated with substantive content (not stubs) | At least implementation_workflows.md, app_router_patterns.md, vanilla_extract_styling.md, motion_animation.md, forms_validation.md, accessibility_aria.md, api_integration.md exist with >100 lines each. Asset checklists have P0/P1/P2 items. Patterns are working TS code. |
| REQ-002 | `references/go/` and `assets/go/` populated with substantive content | At least implementation_workflows.md, gin_handler_patterns.md, database_sqlc_postgres.md, validation_patterns.md, auth_jwt.md, error_envelopes.md, api_design.md exist with >100 lines each. Patterns are working Go code (gofmt clean). |
| REQ-003 | `references/router/cross_stack_pairing.md` exists | ~150 lines covering API contract, error envelope, JWT handoff, CORS, deploy topology |
| REQ-004 | `SKILL.md` LIVE_STACKS, PLACEHOLDER_STACKS, resource_map_for(REACT), resource_map_for(GO) updated | Pseudocode reflects two new live stacks; intent → file maps populated for REACT and GO mirroring WEBFLOW shape |
| REQ-005 | Stack detection still routes correctly: Next.js → REACT, `go.mod` → GO, Webflow markers → WEBFLOW | Trigger tests pass: "implement Next.js page with vanilla-extract" → sk-code (REACT), "build gin handler with sqlc" → sk-code (GO), "fix Webflow animation flicker" → sk-code (WEBFLOW) |
| REQ-006 | Advisor scoring updated: ~12 fullstack-specific tokens added to explicit.ts; TS compiles; advisor_rebuild succeeds | `npm run build` clean; SQLite refreshed; trigger tests confirm routing |
| REQ-007 | `_placeholder.md` files in `references/react/`, `references/go/`, `assets/react/`, `assets/go/` REPLACED by `README.md` describing live content | No `_placeholder.md` remains in those four folders |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Each new doc explicitly notes "kerkmeester-style" pattern provenance where applicable | Doc-level note in implementation_workflows.md and similar; cross-stack pairing doc names kerkmeester as the canonical example |
| REQ-011 | Go content notes gin as primary with Echo/Chi as alternatives | gin_handler_patterns.md includes a "Migrating from Echo / Chi" section |
| REQ-012 | Asset patterns are functional code samples | `tsc --noEmit` clean for .ts/.tsx; `gofmt -d` empty for .go |
| REQ-013 | graph-metadata.json key_files updated for all new paths | regrep returns the new paths in graph-metadata.json |
| REQ-014 | description.json keywords + trigger_examples extended | Includes nextjs, vanilla-extract, motion, gin, sqlc, server-action keywords |
| REQ-015 | README.md structure inventory updated | Stack-detection table marks REACT and GO as Live; structure tree reflects populated subdirs |
| REQ-016 | CHANGELOG.md `[1.1.0]` entry authored | Lists the new branches, files added, routing changes |

### P2 - Optional (defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-020 | TinaCMS doc covers MDX rendering recipe | content_tinacms.md describes minimum @next/mdx integration |
| REQ-021 | Go pprof/profiling doc included | references/go/debugging/pprof_profiling.md authored |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Trigger test "implement a Next.js App Router page with vanilla-extract styling" returns `sk-code` (REACT route, content loads from `references/react/implementation/`)
- **SC-002**: Trigger test "build a gin handler with sqlc and Postgres" returns `sk-code` (GO route)
- **SC-003**: Trigger test "fix Webflow animation flicker" still returns `sk-code` WEBFLOW (no regression)
- **SC-004**: Trigger test "Audit OpenCode plugin loader" still returns `sk-code-opencode` (no regression)
- **SC-005**: `bash validate.sh --strict` on this packet exits 0
- **SC-006**: `npx vitest run lane-attribution.test.ts` green
- **SC-007**: No `_placeholder.md` files remain in `references/react/`, `references/go/`, `assets/react/`, `assets/go/`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | REACT detection too broad: any Next.js project routes to kerkmeester-flavored content even if it uses Tailwind / framer-motion | Wrong-pattern guidance | Each new doc opens with "kerkmeester-style" note; `references/react/implementation/implementation_workflows.md` explicitly says "If you're not on vanilla-extract / motion v12 / Untitled UI, treat the patterns here as one example variant; the universal core principles still apply." |
| Risk | GO content too tied to gin (some users prefer Echo / Chi / Fiber) | Limited reusability | gin_handler_patterns.md and standards/file_organization.md include "Migrating from Echo / Chi" sections |
| Risk | Cross-stack pairing doc becomes stale if either side changes JWT or error-envelope shape | Drift | Pairing doc kept short (~150 lines) and references the actual `assets/{react,go}/patterns/` code samples; drift detectable by reviewing pattern timestamps |
| Risk | Advisor scoring shifts: kerkmeester-flavored prompts may now beat sk-code-opencode for TS/Go work that's actually about the OpenCode harness | Wrong-skill routing | Regression tests for "Audit OpenCode plugin loader"; if regression, narrow new tokens to require pairing keywords (e.g. "react+vanilla-extract" or "go+gin") rather than single tokens |
| Dependency | Skill advisor TS rebuild + SQLite advisor_rebuild | Routing won't update without both | Verification step §7 includes both rebuild + trigger tests |
| Dependency | kerkmeester.com README + manifests | Content authoring source | Read at session start; pinned reference |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Trigger-test pass rate stays at 7/7 after all changes (3 existing + 4 new)
- **NFR-R02**: `bash validate.sh --strict` exits 0 on the packet folder

### Performance
- **NFR-P01**: Skill advisor scoring round-trip stays under 100ms per prompt (no regression)

---

## 8. EDGE CASES

### Detection edge cases
- React project without Next.js (Vite + React) — still detected as REACT via `package.json` grep; loads kerkmeester content with the "If you're not on vanilla-extract..." note
- Go project without gin — detected as GO; gin content references Echo/Chi alternatives explicitly
- Project that has BOTH `package.json` (React/Next) and `go.mod` (a monorepo) — current first-match-wins ordering picks GO before REACT (Go check at line 105 vs React at line 115); this is acceptable for kerkmeester-style monorepo where backend is the "core" stack

### Content edge cases
- User wants to populate `nodejs/`, `react-native/`, or `swift/` later — the pattern this packet establishes (placeholder → README + populated content + LIVE_STACKS promotion + resource_map_for filling) is the template

---

## 9. VERIFICATION

End-to-end verification flow (Phase 5 of the plan):

```bash
# 1. Spec validate
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/skilled-agent-orchestration/056-sk-code-fullstack-branch --strict

# 2. Advisor TS rebuild
cd .opencode/skill/system-spec-kit/mcp_server && npm run build

# 3. Advisor SQLite rebuild
node --input-type=module -e "
import { advisorTools } from './.opencode/skill/system-spec-kit/mcp_server/dist/tools/index.js';
const result = await advisorTools.handleTool('advisor_rebuild', { force: true, workspaceRoot: process.cwd() });
console.log(JSON.parse(result.content[0].text));
"

# 4. Trigger tests (7 prompts)
for prompt in \
  "fix Webflow animation flicker" \
  "implement Next.js App Router page with vanilla-extract" \
  "add a Server Action with zod validation" \
  "build a gin handler with sqlc" \
  "set up JWT auth between Next.js and Go" \
  "Audit OpenCode plugin loader" \
  "review this PR"
do
  python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "$prompt" --threshold 0.5
done

# 5. Lane-attribution test
cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run lane-attribution.test.ts

# 6. Pattern code lints clean
cd .opencode/skill/sk-code/assets/react/patterns && npx tsc --noEmit *.ts *.tsx
cd .opencode/skill/sk-code/assets/go/patterns && gofmt -d *.go
```

---

<!-- ANCHOR:questions -->

## 10. OPEN QUESTIONS

None outstanding. All user-resolvable decisions captured pre-implementation:

- **Branch placement** — populate existing `react/` and `go/` placeholders (not a new `fullstack/` branch). Resolved.
- **Backend stack** — Go + gin + Postgres (separate microservice). Resolved.
- **Spec slot** — `056-sk-code-fullstack-branch` (slot 055 was already taken by the legacy-skill-removal packet). Resolved.

If kerkmeester.com later adds its own backend, this packet's React content can be retargeted at that real backend without breaking the routing — only the cross-stack pairing doc needs updating to match the new contract.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Approved planning artifact**: `~/.claude/plans/merge-users-michelkerkmeester-mega-devel-crispy-rabin.md`
- **Frontend reference source**: `/Users/michelkerkmeester/MEGA/Development/Websites/kerkmeester.com/README.md`
- **Predecessor packets**: 054-sk-code-merger (created sk-code), 055-cli-skill-removal-sk-code-merger-deprecated (removed legacy skills)
