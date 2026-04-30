---
title: "Reconsolidation conflict transaction helper"
description: "the implementation extracted a shared conflict-transaction helper so reconsolidation conflict paths reuse one atomic transaction envelope instead of two near-duplicate blocks."
---

# Reconsolidation conflict transaction helper

## 1. OVERVIEW

The implementation extracted a shared conflict-transaction helper so reconsolidation conflict paths reuse one atomic transaction envelope instead of two near-duplicate blocks.

This is a mutation-safety feature, not just a cleanup. The reconsolidation conflict path now runs both the distinct-ID deprecate branch and the legacy content-update branch through the same transaction wrapper, which keeps rollback behavior, stale-predecessor guards, and abort handling aligned.

---

## 2. CURRENT REALITY

Commit `0ac9cdcba` introduced `executeAtomicReconsolidationTxn()` inside `mcp_server/lib/storage/reconsolidation.ts` and rewired `executeConflict()` to call it for both conflict branches.

Before this extract, `executeConflict()` carried duplicated transaction blocks with the same high-risk steps: `BEGIN IMMEDIATE`, stale-predecessor checks, deprecate-or-update writes, supersede edge handling, and rollback/commit transitions. The implementation collapsed those blocks into one helper so both branches now share identical transaction semantics and abort-status handling. That keeps reconsolidation failures from drifting into branch-specific partial-write behavior.

The helper ships as part of the broader Wave D maintainability pass, but it materially affects mutation correctness because reconsolidation is still a save-time write path. Tests in the reconsolidation suites now exercise the shared helper through both conflict modes instead of pinning two separate inline implementations.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/storage/reconsolidation.ts` | Lib | Defines `executeAtomicReconsolidationTxn()` and routes `executeConflict()` through the shared atomic helper |

### Validation And Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/reconsolidation.vitest.ts` | Conflict-path regression coverage for both transaction branches |
| `mcp_server/tests/p0-b-reconsolidation-composite.vitest.ts` | Composite reconsolidation behavior across repeated conflict runs |

---

## 4. SOURCE METADATA
- Group: Mutation
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--mutation/11-reconsolidation-conflict-transaction-helper.md`
