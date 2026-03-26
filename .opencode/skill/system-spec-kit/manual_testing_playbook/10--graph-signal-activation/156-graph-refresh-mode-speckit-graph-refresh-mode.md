---
title: "156 -- Graph refresh mode (SPECKIT_GRAPH_REFRESH_MODE)"
description: "This scenario validates graph refresh mode (SPECKIT_GRAPH_REFRESH_MODE) for `156`. It focuses on enabling write_local mode, saving a memory, and verifying dirty-node tracking fires."
---

# 156 -- Graph refresh mode (SPECKIT_GRAPH_REFRESH_MODE)

## 1. OVERVIEW

This scenario validates graph refresh mode (SPECKIT_GRAPH_REFRESH_MODE) for `156`. It focuses on enabling write_local mode, saving a memory, and verifying dirty-node tracking fires.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `156` and confirm the expected signals without contradicting evidence.

- Objective: Verify dirty-node tracking fires in write_local mode
- Prompt: `Test SPECKIT_GRAPH_REFRESH_MODE=write_local. Save a memory with entity edges, then verify dirty-node tracking and local recompute execute. Capture the evidence needed to prove markDirty() populates the dirty-node set and recomputeLocal() runs for small components. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: markDirty() populates dirty-node set; onWrite() returns localRecomputed=true and skipped=false; component size estimation runs; dirty nodes cleared after local recompute
- Pass/fail: PASS if onWrite() returns mode='write_local', localRecomputed=true, dirtyNodes >= 1, and skipped=false; FAIL if dirty-node set remains empty or localRecomputed=false

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 156 | Graph refresh mode (SPECKIT_GRAPH_REFRESH_MODE) | Verify dirty-node tracking fires in write_local mode | `Test SPECKIT_GRAPH_REFRESH_MODE=write_local. Save a memory with entity edges, then verify dirty-node tracking and local recompute execute. Capture the evidence needed to prove markDirty() populates the dirty-node set and recomputeLocal() runs for small components. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_GRAPH_REFRESH_MODE=write_local` 2) `memory_save({ ... })` with content containing entity relationships 3) Verify `onWrite()` return shape 4) `npx vitest run tests/graph-lifecycle.vitest.ts` | markDirty() populates dirty-node set; onWrite() returns localRecomputed=true and skipped=false; component size estimation runs; dirty nodes cleared after local recompute | GraphRefreshResult output with mode='write_local', dirtyNodes >= 1, localRecomputed=true + test transcript | PASS if onWrite() returns mode='write_local', localRecomputed=true, dirtyNodes >= 1, and skipped=false; FAIL if dirty-node set remains empty or localRecomputed=false | Check resolveGraphRefreshMode() → Verify SPECKIT_GRAPH_REFRESH_MODE env is set → Inspect markDirty() input nodeIds → Check estimateComponentSize() threshold (default 50) |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [10--graph-signal-activation/13-graph-lifecycle-refresh.md](../../feature_catalog/10--graph-signal-activation/13-graph-lifecycle-refresh.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../19--feature-flag-reference/028-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/graph-lifecycle.ts`

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 156
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `10--graph-signal-activation/156-graph-refresh-mode-speckit-graph-refresh-mode.md`
