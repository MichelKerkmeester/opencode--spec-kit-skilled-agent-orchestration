---
title: "Implementation Plan: discovery [template:level_2/plan.md]"
description: "Finalize Discovery phase docs so they match current handler, schema, feature-catalog, and test reality with updated verification evidence."
trigger_phrases:
  - "implementation"
  - "plan"
  - "discovery"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: discovery
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | MCP |
| **Storage** | SQLite |
| **Testing** | Vitest |

### Overview
This plan finalizes Discovery audit documentation against current on-disk implementation reality. It updates all five phase documents to reflect latest handler behavior, public schema behavior, tightened feature-catalog wording, and focused verification evidence (`tsc` clean + targeted `89/89` tests).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Source-of-truth files identified (`handlers`, `schemas`, `feature_catalog`, `tests`)
- [x] Stale claims explicitly listed for removal
- [x] Scope locked to five Discovery phase docs

### Definition of Done
- [x] All five target docs updated and synchronized
- [x] Behavior statements match current code and schema reality
- [x] Verification evidence updated to `npx tsc --noEmit` clean and targeted `89/89` tests
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-driven documentation alignment for Discovery handlers and schemas.

### Key Components
- **Handlers**: `memory-crud-list.ts`, `memory-crud-stats.ts`, `memory-crud-health.ts`
- **Schema surface**: `mcp_server/schemas/tool-input-schemas.ts`, `mcp_server/tool-schemas.ts`
- **Feature catalog**: `feature_catalog/03--discovery/*.md` (rewritten for focused accuracy)
- **Focused verification suite**: `handler-memory-list-edge`, `handler-memory-stats-edge`, `handler-memory-health-edge`, `handler-memory-crud`, `tool-input-schema`

### Data Flow
On-disk implementation behavior and test outcomes feed requirements/checklist evidence, which then propagate into synchronized spec, plan, tasks, and implementation summary artifacts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-read current Discovery phase docs and identify stale statements
- [x] Re-verify current on-disk handler/schema/test behavior
- [x] Confirm scope lock to the five requested files

### Phase 2: Core Implementation
- [x] Update requirements to current `memory_list`/`memory_stats` validation-envelope behavior
- [x] Update docs for `memory_list` resolved `sortBy` and `memory_stats` response `limit`
- [x] Update docs for `memory_health` public-schema support for `confirmed`
- [x] Remove stale wording (`documentation phase`, `48/48`, old `computeFolderScores`-limit narrative, outdated Discovery inconsistency limitation)

### Phase 3: Verification
- [x] Record clean `npx tsc --noEmit` result
- [x] Record targeted 5-file suite result: `89/89` passing
- [x] Perform cross-file consistency pass across all five docs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static type check | TypeScript compile check for MCP server | `npx tsc --noEmit` |
| Focused automated verification | Discovery handlers + schema coverage across 5 files | `npx vitest run --no-file-parallelism tests/handler-memory-list-edge.vitest.ts tests/handler-memory-stats-edge.vitest.ts tests/handler-memory-health-edge.vitest.ts tests/handler-memory-crud.vitest.ts tests/tool-input-schema.vitest.ts` |
| Documentation consistency | Cross-file sync validation among five updated docs | Manual doc review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Discovery handlers (`mcp_server/handlers/*`) | Internal | Green | Behavior claims cannot be verified |
| Public/runtime schemas (`tool-schemas.ts`, `tool-input-schemas.ts`) | Internal | Green | `confirmed` flow documentation can become inaccurate |
| Discovery feature catalog (`feature_catalog/03--discovery/*`) | Internal | Green | Cross-reference accuracy degrades |
| Focused test files (`mcp_server/tests/*`) | Internal | Green | Verification evidence cannot be updated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any newly updated Discovery doc is found inconsistent with current source behavior.
- **Procedure**: Restore only the affected `003-discovery` doc(s) from git history, then re-run source verification and re-apply corrected statements.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core Updates) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core Updates |
| Core Updates | Setup | Verification |
| Verification | Core Updates | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5-1 hour |
| Core Updates | Medium | 1-2 hours |
| Verification | Medium | 0.5-1 hour |
| **Total** | | **2-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Scope locked to five files
- [x] Stale claims identified before edits
- [x] Verification commands defined before completion claim

### Rollback Procedure
1. Restore the affected Discovery doc file(s).
2. Re-verify handler/schema/test behavior from on-disk sources.
3. Re-apply minimal wording corrections.
4. Re-check cross-file consistency across all five docs.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
