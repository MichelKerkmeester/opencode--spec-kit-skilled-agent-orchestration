---
title: "Implementation [02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/004-type-consolidation/plan]"
description: "title: \"Implementation Plan: Type Consolidation\""
trigger_phrases:
  - "implementation"
  - "plan"
  - "004"
  - "type"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Type Consolidation

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | generate-context.js pipeline type system |
| **Storage** | None (type definitions only) |
| **Testing** | TypeScript compiler (`tsc --noEmit`), Vitest |

### Overview

This phase closed the remaining live type-consolidation work after `003-data-fidelity` had already moved the four leaked canonical types and tightened `SessionData`. The final pass standardized the remaining collected-data subset seams on a shared `CollectedDataSubset` helper, added the missing explicit `SUMMARY` field on `CollectedDataBase`, re-verified `ACTIVITIES` as required everywhere it is constructed, and reran targeted compilation plus extractor/spec-affinity regression coverage.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (`003-data-fidelity` already complete)

### Definition of Done

- [x] All acceptance criteria met (REQ-001 through REQ-006)
- [x] `tsc --noEmit` passes with zero errors
- [x] Approved targeted regression stack passes for this phase scope
- [x] Docs updated (spec/plan/checklist/tasks/implementation summary in this folder)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

7-step type migration -- canonicalize, expand, tighten, consolidate, remove escape hatch, compile, test.

### Key Components

- **`session-types.ts`**: Canonical home for `FileChange`, `ObservationDetailed`, `ToolCounts`, `SpecFileEntry`, and the expanded `SessionData` interface
- **Extractor files**: Become consumers (importers) of canonical types, no longer owners
- **`CollectedDataFor*` subsets**: Replaced with `Pick<SessionData, ...>` or `Omit<SessionData, ...>` derivations
- **`SessionData` index signature**: Removed after all 15+ real fields are explicitly typed

### Data Flow

1. `session-types.ts` defines all canonical types
2. Extractor files import types from `session-types.ts` and re-export for backward compatibility
3. `collect-session-data.ts` uses `Pick`/`Omit` subsets derived from `SessionData`
4. `workflow.ts` imports directly from `session-types.ts`
5. TypeScript compiler enforces type safety across all consumers
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Canonicalize Leaked Types

- [x] Confirm `FileChange`, `ObservationDetailed`, `ToolCounts`, and `SpecFileEntry` already live canonically in `session-types.ts`
- [x] Confirm extractor/session re-export paths remain backward-compatible

### Phase 2: Expand SessionData

- [x] Re-audit `SessionData` field accesses across the codebase
- [x] Confirm explicit typed fields for implementation-guide, pre/postflight, continue-session, and related live fields are already present
- [x] Confirm `[key: string]: unknown` is no longer present on `SessionData`

### Phase 3: Make ACTIVITIES Required

- [x] Confirm `PhaseEntry.ACTIVITIES` is required
- [x] Audit all `PhaseEntry` construction sites to ensure they populate `ACTIVITIES`
- [x] Confirm no additional construction-site fixes are required

### Phase 4: Consolidate CollectedDataFor* Subsets

- [x] Inventory the remaining collected-data subset aliases across extractors, spec-folder utilities, and spec-affinity helpers
- [x] Replace the remaining ad hoc subset declarations with `CollectedDataSubset<...>` derived from canonical `CollectedDataBase`
- [x] Reduce named subset aliases to the two justified seams (`AlignmentCollectedData`, `SpecAffinityCollectedData`) with no field redeclaration drift

### Phase 5: Remove Index Signature

- [x] Confirm `[key: string]: unknown` is already absent from `SessionData`
- [x] Add the remaining explicit `CollectedDataBase.SUMMARY` field needed by spec-affinity consumers
- [x] Re-run compilation to confirm no masked field access errors remain in scope

### Phase 6: Full Recompile

- [x] Run `npm run typecheck`
- [x] Ensure zero type errors
- [x] Keep the pass free of new `as any`/`as unknown` escape hatches

### Phase 7: Full Retest

- [x] Run `node scripts/tests/test-extractors-loaders.js`
- [x] Run `vitest tests/spec-affinity.vitest.ts`
- [x] Run strict phase validation/completion checks after documentation alignment
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Full package typecheck plus scripts build after canonical type cleanup | TypeScript compiler |
| Regression | Extractor/loaders runtime coverage across shared canonical type consumers | Node.js test runner |
| Focused unit | Spec-affinity coverage for the new canonical subset helper path | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `003-data-fidelity` completion state | Internal | Green | This closeout assumes the earlier canonical type ownership and explicit `SessionData` work from phase `003` is already in place |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Compilation errors cascade beyond manageable scope, or runtime behavior changes due to type narrowing
- **Procedure**: Revert the `CollectedDataSubset` consumer cleanup and explicit `CollectedDataBase.SUMMARY` field while preserving the already-shipped canonical type ownership and re-export compatibility
<!-- /ANCHOR:rollback -->
