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

## TABLE OF CONTENTS

- [1. SUMMARY](#1--summary)
- [2. OVERVIEW](#2--overview)
- [3. QUALITY GATES](#3--quality-gates)
- [4. ARCHITECTURE](#4--architecture)
- [5. IMPLEMENTATION PHASES](#5--implementation-phases)
- [6. TESTING STRATEGY](#6--testing-strategy)
- [7. DEPENDENCIES](#7--dependencies)
- [8. ROLLBACK PLAN](#8--rollback-plan)
- [L2: PHASE DEPENDENCIES](#l2-phase-dependencies)
- [L2: EFFORT ESTIMATION](#l2-effort-estimation)
- [L2: ENHANCED ROLLBACK](#l2-enhanced-rollback)

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
This plan finalizes Discovery audit artifacts against current on-disk implementation reality. It synchronizes all five phase docs to landed runtime handler fixes, new regression tests, related documentation corrections, and focused verification evidence (`tsc` clean + targeted `95/95` tests).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:overview -->
## 2. OVERVIEW

The plan captures a packet-sync workflow: verify landed Discovery runtime and doc changes, update only the five packet docs, then validate evidence and cross-file consistency.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quality-gates -->
## 3. QUALITY GATES

### Definition of Ready
- [x] Source-of-truth files identified (`handlers`, `schemas`, `tests`, `manual_testing_playbook`, merged `feature_catalog`, scoring `README`)
- [x] Stale claims explicitly listed for removal
- [x] Scope locked to five Discovery phase docs

### Definition of Done
- [x] All five target docs updated and synchronized
- [x] Behavior statements match current code, schema, and related doc reality
- [x] Verification evidence updated to `npx tsc --noEmit` clean and targeted `95/95` tests
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 4. ARCHITECTURE

### Pattern
Evidence-driven documentation alignment for Discovery handlers, schemas, tests, and related system docs.

### Key Components
- **Handlers**: `memory-crud-list.ts`, `memory-crud-stats.ts`, `memory-crud-health.ts`
- **Schema surface**: `mcp_server/schemas/tool-input-schemas.ts`, `mcp_server/tool-schemas.ts`
- **Regression tests**: `handler-memory-list-edge`, `handler-memory-stats-edge`, `handler-memory-health-edge` (pre-query refresh failure coverage)
- **Related docs**: `manual_testing_playbook/manual_testing_playbook.md`, merged `feature_catalog/feature_catalog.md`, `shared/scoring/README.md`
- **Focused verification suite**: `handler-memory-list-edge`, `handler-memory-stats-edge`, `handler-memory-health-edge`, `handler-memory-crud`, `tool-input-schema`

### Data Flow
On-disk implementation behavior and test outcomes feed requirements/checklist evidence, which then propagate into synchronized spec, plan, tasks, and implementation summary artifacts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-read current Discovery phase docs and identify stale statements
- [x] Re-verify current on-disk handler/schema/test behavior
- [x] Confirm scope lock to the five requested files

### Phase 2: Core Implementation
- [x] Update docs to capture pre-query `checkDatabaseUpdated()` failure handling (`E021` + `requestId`) for all three Discovery handlers
- [x] Update docs to capture new regression tests in Discovery edge suites for the pre-query failure path
- [x] Update requirements to current `memory_list`/`memory_stats` validation-envelope behavior
- [x] Update docs for `memory_list` resolved `sortBy` and `memory_stats` response `limit`
- [x] Update docs for `memory_health` public-schema support for `confirmed`
- [x] Document related doc corrections in playbook, merged catalog, and scoring README
- [x] Remove stale wording (`documentation-only phase`, stale targeted test totals, outdated Discovery inconsistency limitation)

### Phase 3: Verification
- [x] Record clean `npx tsc --noEmit` result
- [x] Record targeted 5-file suite result: `95/95` passing
- [x] Validate `spec.md` and `implementation-summary.md` with `validate_document.py`
- [x] Perform cross-file consistency pass across all five docs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static type check | TypeScript compile check for MCP server | `npx tsc --noEmit` |
| Focused automated verification | Discovery handlers + schema coverage across 5 files | `npx vitest run --no-file-parallelism tests/handler-memory-list-edge.vitest.ts tests/handler-memory-stats-edge.vitest.ts tests/handler-memory-health-edge.vitest.ts tests/handler-memory-crud.vitest.ts tests/tool-input-schema.vitest.ts` |
| sk-doc validation | Ensure packet docs satisfy required markdown structure | `python3 .opencode/skill/sk-doc/scripts/validate_document.py <doc-path>` |
| Documentation consistency | Cross-file sync validation among five updated docs | Manual doc review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Discovery handlers (`mcp_server/handlers/*`) | Internal | Green | Behavior claims cannot be verified |
| Public/runtime schemas (`tool-schemas.ts`, `tool-input-schemas.ts`) | Internal | Green | `confirmed` flow documentation can become inaccurate |
| Related docs (playbook, merged catalog, scoring README) | Internal | Green | Packet misses documented alignment outcomes |
| Focused test files (`mcp_server/tests/*`) | Internal | Green | Verification evidence cannot be updated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

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
