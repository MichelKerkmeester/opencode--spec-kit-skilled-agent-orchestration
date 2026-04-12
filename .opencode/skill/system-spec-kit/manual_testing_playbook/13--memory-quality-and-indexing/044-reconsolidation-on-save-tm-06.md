---
title: "044 -- Reconsolidation-on-save (TM-06)"
description: "This scenario validates Reconsolidation-on-save (TM-06) for `044`. It focuses on Confirm merge/deprecate thresholds."
audited_post_018: true
---

# 044 -- Reconsolidation-on-save (TM-06)

## 1. OVERVIEW

This scenario validates Reconsolidation-on-save (TM-06) for `044`. It focuses on confirming merge/deprecate thresholds plus the stale-predecessor and BM25-repair safety paths.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `044` and confirm the expected signals without contradicting evidence.

- Objective: Confirm merge/deprecate thresholds plus stale-merge abort and BM25 repair-flag persistence
- Prompt: `As a memory-quality validation operator, validate Reconsolidation-on-save (TM-06) against the documented validation surface. Verify merge/deprecate thresholds plus stale-merge abort and BM25 repair-flag persistence. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Similarity >=0.88 triggers merge; 0.75-0.88 triggers supersede/deprecate; below 0.75 saves independently; stale predecessor changes abort merge instead of archiving/inserting; BM25 repair failure leaves merged lineage committed and sets `bm25_repair_needed=1`
- Pass/fail: PASS: Threshold behavior is correct, stale predecessor writes return `predecessor_changed` or `predecessor_gone` without destructive merge side effects, and failed BM25 repair persists `bm25_repair_needed=1`; FAIL: Wrong threshold action, stale merge still commits, or BM25 repair debt is not recorded

---

## 3. TEST EXECUTION

### Prompt

```
As a memory-quality validation operator, confirm merge/deprecate thresholds against the documented validation surface. Verify similarity >=0.88 triggers merge; 0.75-0.88 triggers supersede/deprecate; below 0.75 saves independently; thresholds documented in output. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Save near neighbors
2. verify >=0.88 merge
3. verify 0.75-0.88 supersede

### Expected

Similarity >=0.88 triggers merge; 0.75-0.88 triggers supersede/deprecate; below 0.75 saves independently; thresholds documented in output

### Evidence

Save output with similarity scores + merge/supersede/independent action taken

### Pass / Fail

- **Pass**: Merge at >=0.88, supersede at 0.75-0.88, independent below 0.75
- **Fail**: Wrong action for similarity range or threshold miscalibrated

### Failure Triage

Verify similarity computation → Check threshold configuration → Inspect merge vs supersede logic

---

### Prompt

```
As a memory-quality validation operator, validate Abort stale merge when predecessor changes before commit against content_hash. Verify merge returns action: complement with status: predecessor_changed or status: predecessor_gone; no stale merged row is inserted; predecessor row reflects only the concurrent writer change. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Seed a merge-eligible predecessor with known `content_hash` and `updated_at`
2. start merge with async embedding generation
3. mutate, archive, or delete the predecessor before the transaction body resumes
4. verify complement-style abort with `predecessor_changed` or `predecessor_gone`
5. verify no merged row was inserted and predecessor lineage stayed intact
6. `npx vitest run .opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts -t \"Aborts merge when predecessor changes during embedding generation\"`

### Expected

Merge returns `action: complement` with `status: predecessor_changed` or `status: predecessor_gone`; no stale merged row is inserted; predecessor row reflects only the concurrent writer change

### Evidence

Targeted vitest output plus `memory_index` row dump showing the predecessor remained active and no new merged row was created

### Pass / Fail

- **Pass**: Stale predecessor detection blocks the merge and preserves the current predecessor state
- **Fail**: Merge still archives/inserts despite predecessor mutation or deletion

### Failure Triage

Verify predecessor snapshot capture (`content_hash`, `updated_at`) → Check in-transaction reload → Inspect `hasPredecessorChanged()` branch → Confirm archive/delete handling

---

### Prompt

```
As a memory-quality validation operator, validate Persist BM25 repair debt when post-commit repair fails against memory_index. Verify merge commits, warning is emitted, and the merged row persists bm25_repair_needed=1; predecessor is archived and lineage remains committed. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Seed a merge-eligible predecessor with BM25 enabled
2. force the initial BM25 update and repair retry to fail after the merge commit
3. verify the merged row is still inserted and predecessor archived
4. query `memory_index` for `bm25_repair_needed` on the merged row
5. verify warning text names the failed repair
6. `npx vitest run .opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts -t \"Persists bm25_repair_needed after BM25 repair fails post-merge\"`

### Expected

Merge commits, warning is emitted, and the merged row persists `bm25_repair_needed=1`; predecessor is archived and lineage remains committed

### Evidence

Targeted vitest output plus SQL evidence for merged row `bm25_repair_needed=1` and warning text

### Pass / Fail

- **Pass**: Merge completes and records `bm25_repair_needed=1` for later retry
- **Fail**: Merge rolls back unnecessarily or the repair debt flag is missing

### Failure Triage

Verify BM25 error path after commit → Check `setBm25RepairNeededFlag()` execution → Confirm merged row ID is updated instead of predecessor row

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/06-reconsolidation-on-save.md](../../feature_catalog/13--memory-quality-and-indexing/06-reconsolidation-on-save.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 044
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/044-reconsolidation-on-save-tm-06.md`
