# Hydra baseline snapshot

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. PLAYBOOK COVERAGE](#5--playbook-coverage)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Hydra baseline snapshot.

## 2. CURRENT REALITY

`captureHydraBaselineSnapshot()` records a small Phase 1 readiness baseline for the Hydra-inspired rollout slice. It reads retrieval-volume metrics from the eval database (`eval_queries`, `eval_channel_results`, `eval_final_results`) and isolation/schema metrics from the target context database (`memory_index`, `schema_version`), then returns a single snapshot with timestamp, eval run ID, metrics map, and metadata.

When `persist: true`, every metric is written into `eval_metric_snapshots` with `channel = 'hydra-baseline'`. The metadata attached to each persisted row includes the resolved Hydra phase, the prefixed Hydra capability flags, `scopeDimensionsTracked`, and the resolved `contextDbPath`. Missing or unreadable context databases are non-fatal: retrieval metrics still record and context-backed metrics fall back to zero.

The baseline path now initializes the eval database beside the context database under test instead of silently writing to the default eval location. That keeps ad-hoc migration and rollout checks scoped to the database actually being evaluated.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/hydra-baseline.ts` | Lib | Baseline metric capture and optional persistence |
| `mcp_server/lib/eval/eval-db.ts` | Lib | Eval DB initialization and schema support for persisted snapshots |
| `mcp_server/lib/config/capability-flags.ts` | Lib | Hydra roadmap phase/capability metadata snapshot |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hydra-baseline.vitest.ts` | Snapshot capture, persistence path selection, and missing-DB fallbacks |

## 4. SOURCE METADATA

- Group: Evaluation and measurement
- Source feature title: Hydra baseline snapshot
- Current reality source: feature_catalog.md

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario NEW-126
