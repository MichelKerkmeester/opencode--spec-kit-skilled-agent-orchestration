---
title: "Implementation Plan: Type Consolidation"
---
# Implementation Plan: Type Consolidation

<!-- SPECKIT_LEVEL: 1 -->
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

This plan implements a 7-step type migration: canonicalize leaked types in `session-types.ts`, expand `SessionData` with explicit fields, make `ACTIVITIES` required, consolidate `CollectedDataFor*` subsets using `Pick`/`Omit`, remove the `[key: string]: unknown` index signature, recompile to catch masked errors, and retest. The migration follows a safe ordering where types are canonical before consumers are updated, and the index signature is removed only after all fields are explicitly modeled.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (none -- foundational)

### Definition of Done

- [ ] All acceptance criteria met (REQ-001 through REQ-005)
- [ ] `tsc --noEmit` passes with zero errors
- [ ] Full test suite passes
- [ ] Docs updated (spec/plan in this folder)
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

- [ ] Move `FileChange` from `file-extractor.ts` to `session-types.ts`
- [ ] Move `ObservationDetailed` from `session-extractor.ts` to `session-types.ts`
- [ ] Move `ToolCounts` from its current owner to `session-types.ts`
- [ ] Move `SpecFileEntry` from its current owner to `session-types.ts`
- [ ] Add re-exports in original files for backward compatibility

### Phase 2: Expand SessionData

- [ ] Audit all `SessionData` field accesses across the codebase (grep for `sessionData.` and `sessionData[`)
- [ ] Add explicit typed fields for: `implementation-guide`, `preflight`, `postflight`, `continue-session`, and other discovered real fields
- [ ] Keep `[key: string]: unknown` temporarily for safety during transition

### Phase 3: Make ACTIVITIES Required

- [ ] Change `PhaseEntry.ACTIVITIES` from optional (`?`) to required
- [ ] Audit all `PhaseEntry` construction sites to ensure they always populate ACTIVITIES
- [ ] Fix any construction sites that omit ACTIVITIES (add default empty array if needed)

### Phase 4: Consolidate CollectedDataFor* Subsets

- [ ] Inventory all `CollectedDataFor*` interfaces across extractor files
- [ ] Replace each with `Pick<SessionData, 'field1' | 'field2' | ...>` or `Omit<SessionData, ...>`
- [ ] Verify no subset redeclares fields with different types than canonical

### Phase 5: Remove Index Signature

- [ ] Remove `[key: string]: unknown` from `SessionData`
- [ ] Run `tsc --noEmit` to surface all masked field access errors
- [ ] Fix each compilation error by adding the missing field to `SessionData` or fixing the access

### Phase 6: Full Recompile

- [ ] Run `tsc --noEmit` on the entire project
- [ ] Ensure zero type errors
- [ ] Review any `as any` or `as unknown` casts introduced during fixes -- minimize them

### Phase 7: Full Retest

- [ ] Run complete Vitest suite
- [ ] Run `test-bug-fixes.js` and `test-integration.js`
- [ ] Verify test count matches expected baseline
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Full TypeScript compilation with `tsc --noEmit` | TypeScript compiler |
| Unit | All existing extractor and workflow tests pass with canonical imports | Vitest |
| Integration | `test-bug-fixes.js` and `test-integration.js` pass with zero failures | Node.js test runner |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | N/A | Green | This is the first phase in the A-sequence (A1) and has no upstream dependencies |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Compilation errors cascade beyond manageable scope, or runtime behavior changes due to type narrowing
- **Procedure**: Restore `[key: string]: unknown` to `SessionData` and revert type moves; re-exports ensure backward compatibility is preserved even during partial rollback
<!-- /ANCHOR:rollback -->
