---
title: "Implementation Plan: Reindex Validator False Positives [02--system-spec-kit/023-esm-module-compliance/009-reindex-validator-false-positives/plan]"
description: "Plan to remediate false-positive batch indexing behavior while preserving guardrail intent."
trigger_phrases:
  - "reindex validator plan"
  - "cross-spec contamination plan"
  - "topical coherence plan"
importance_tier: "normal"
contextType: "planning"
---
# Implementation Plan: Reindex Validator False Positives

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript + Node.js |
| **Framework** | Spec Kit Memory MCP server + scripts workspace |
| **Storage** | SQLite vector index + migration tooling |
| **Testing** | Vitest + script-level verification |

### Overview
This phase repairs false-positive validation behavior that blocked valid files during bulk reindex. The plan focuses on context propagation, rule tuning, canonical context typing, and deterministic dedup behavior while keeping existing interactive save behavior stable.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause isolated for V8 and V12 index-path behavior.
- [x] Affected files identified across scripts and MCP runtime.
- [x] Canonical context-type contract defined.

### Definition of Done
- [ ] Structural validator reports zero errors for Phase 009 docs.
- [ ] Batch reindex no longer hard-blocks valid same-scope content.
- [ ] Canonical context type handling is synchronized across migration/schema/runtime.
- [ ] Follow-up runtime verification captured in checklist evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Incremental remediation over existing validation and indexing pipeline.

### Key Components
- **Validation layer (`validate-memory-quality.ts`)**: Rule behavior and context interpretation.
- **Index handlers (`memory-index.ts`, `memory-save.ts`)**: Batch-mode parameter threading.
- **Schema/migration layer**: Canonical context type enforcement and upgrade safety.

### Data Flow
File path and spec-scope signals flow from index orchestration into validation. Validation outcomes drive index writes and logging. Canonical context values are normalized before persistence and enforced at schema boundary.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Identify failing rule paths and reproduction conditions.
- [x] Capture affected modules and configuration contracts.
- [x] Define canonical context type mapping boundaries.

### Phase 2: Core Implementation
- [x] Update V8/V12 behavior for legitimate batch indexing scenarios.
- [x] Thread file path and scope data through validation bridge/handlers.
- [x] Align context type normalization and schema enforcement.
- [x] Apply dedup safeguards for forced reindex mode.

### Phase 3: Verification
- [ ] Re-run recursive strict validator and capture before/after.
- [ ] Re-run targeted runtime checks for batch indexing behavior.
- [ ] Confirm documentation reflects implemented behavior without overstated claims.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Validation and parser behavior | Vitest |
| Integration | Batch indexing + migration path | Node scripts + DB inspection |
| Manual | Recursive strict structural validation | `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Local scripts build outputs | Internal | Green | Validation/runtime checks cannot execute |
| SQLite index database state | Internal | Yellow | Runtime confidence delayed if stale/locked |
| Canonical context type mapping | Internal | Green | Misalignment causes downstream scoring/index issues |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Regression in contamination checks or index integrity after remediation.
- **Procedure**: Revert affected validation/schema commits, rebuild dist artifacts, and restore prior DB snapshot if needed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1-2h |
| Core Implementation | High | 4-8h |
| Verification | Medium | 1-3h |
| **Total** |  | **6-13h** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline validator output captured.
- [x] Scope-limited files identified.
- [ ] Runtime validation snapshot refreshed after structural remediation.

### Rollback Procedure
1. Restore previous markdown versions for this phase folder.
2. Re-run recursive strict validation for confirmation.
3. Reapply remediation incrementally if needed.

### Data Reversal
- **Has data migrations?** Yes
- **Reversal procedure**: Keep schema rollback scripts in sync when canonical context constraints are modified.
<!-- /ANCHOR:enhanced-rollback -->
