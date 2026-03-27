---
title: "Memory roadmap baseline snapshot"
description: "Describes the Phase 1 readiness baseline snapshot that captures retrieval-volume and isolation/schema metrics from eval and context databases for memory-roadmap rollout gating."
---

# Memory roadmap baseline snapshot

## 1. OVERVIEW

Describes the Phase 1 readiness baseline snapshot that captures retrieval-volume and isolation/schema metrics from eval and context databases for memory-roadmap rollout gating.

Before rolling out a big upgrade, you want to take a "before" photo so you can compare it with the "after." This feature captures a snapshot of how the memory system is performing right now, including how many searches are happening and whether the storage is set up correctly. That snapshot becomes the baseline you measure progress against during the rollout.

---

## 2. CURRENT REALITY

`captureMemoryStateBaselineSnapshot()` records a small Phase 1 readiness baseline for the memory-roadmap rollout slice. It reads retrieval-volume metrics from the eval database (`eval_queries`, `eval_channel_results`, `eval_final_results`) and isolation/schema metrics from the target context database (`memory_index`, `schema_version`), then returns a single snapshot with timestamp, eval run ID, metrics map and metadata.

When `persist: true`, every metric is written into `eval_metric_snapshots` with `channel = 'memory-state-baseline'`. The metadata attached to each persisted row includes the resolved memory-roadmap phase, the compatibility-supported roadmap capability flags, `scopeDimensionsTracked` and the resolved `contextDbPath`. Missing or unreadable context databases are non-fatal: retrieval metrics still record and context-backed metrics fall back to zero.

The baseline path now initializes the eval database beside the context database under test instead of silently writing to the default eval location. That keeps ad-hoc migration and rollout checks scoped to the database actually being evaluated. The path switch is also wrapped in `try/finally`, so even if `initEvalDb()` fails after closing the previous singleton, the prior eval DB handle is restored instead of leaving global eval state clobbered for later calls.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/memory-state-baseline.ts` | Lib | Baseline metric capture and optional persistence |
| `mcp_server/lib/eval/eval-db.ts` | Lib | Eval DB initialization and schema support for persisted snapshots |
| `mcp_server/lib/config/capability-flags.ts` | Lib | Memory-roadmap phase/capability metadata snapshot |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/memory-state-baseline.vitest.ts` | Snapshot capture, persistence path selection, and missing-DB fallbacks |

---

## 4. SOURCE METADATA

- Group: Evaluation and measurement
- Source feature title: Memory roadmap baseline snapshot
- Current reality source: direct implementation audit of `memory-state-baseline.ts`, `eval-db.ts`, `capability-flags.ts`, and `mcp_server/tests/memory-state-baseline.vitest.ts`

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 126
