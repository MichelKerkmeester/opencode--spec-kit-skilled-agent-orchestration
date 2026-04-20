---
title: "Code-graph readiness contract"
description: "Phase 017 extracted a shared readiness contract so code-graph handlers emit the same canonicalReadiness, trustState, and lastPersistedAt fields through one module."
---

# Code-graph readiness contract

## 1. OVERVIEW

Phase 017 extracted a shared readiness contract so code-graph handlers emit the same `canonicalReadiness`, `trustState`, and `lastPersistedAt` fields through one module.

This is the shared structural context contract for the code-graph family. It replaced inline readiness helpers in `query.ts` and propagated the same vocabulary to the other read and maintenance handlers that previously exposed inconsistent or missing readiness blocks.

---

## 2. CURRENT REALITY

Commit `4a154c555` introduced `mcp_server/code-graph/lib/readiness-contract.ts` with four shared helpers:

- `canonicalReadinessFromFreshness()`
- `queryTrustStateFromFreshness()`
- `buildQueryGraphMetadata()`
- `buildReadinessBlock()`

Commit `f253194bf` then propagated that contract to the six sibling handlers: `query.ts`, `scan.ts`, `status.ts`, `context.ts`, `ccc-status.ts`, `ccc-reindex.ts`, and `ccc-feedback.ts`.

The contract projects freshness-aware code-graph state onto the canonical `SharedPayloadTrustState` vocabulary from `lib/context/shared-payload.ts` instead of inventing a new local enum. Handlers that operate on adjacent infrastructure rather than direct structural readiness, such as the CCC trio, now still emit the same public fields but use `trustState: 'unavailable'` with `reason: 'readiness_not_applicable'` where a full readiness semantic does not fit.

The result is a single readiness surface across the code-graph family: callers can rely on `canonicalReadiness`, `trustState`, and `lastPersistedAt` being shaped by the same helper module instead of reconstructing per-handler differences.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/code-graph/lib/readiness-contract.ts` | Lib | Canonical readiness helper surface for code-graph handlers |
| `mcp_server/code-graph/handlers/query.ts` | Handler | Query-time readiness projection and graph metadata envelope |
| `mcp_server/code-graph/handlers/scan.ts` | Handler | Scan result readiness block |
| `mcp_server/code-graph/handlers/status.ts` | Handler | Status result readiness block |
| `mcp_server/code-graph/handlers/context.ts` | Handler | Context result readiness block |
| `mcp_server/code-graph/handlers/ccc-status.ts` | Handler | CCC status stub readiness block |
| `mcp_server/code-graph/handlers/ccc-reindex.ts` | Handler | CCC reindex stub readiness block |
| `mcp_server/code-graph/handlers/ccc-feedback.ts` | Handler | CCC feedback stub readiness block |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/readiness-contract.vitest.ts` | Shared readiness helper behavior and trust-state projection |
| `mcp_server/tests/code-graph-siblings-readiness.vitest.ts` | Sibling-handler readiness propagation |
| `mcp_server/tests/m8-trust-state-vocabulary.vitest.ts` | Shared payload trust-state vocabulary alignment |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Code-graph readiness contract
- Phase 017 commits: `4a154c555`, `f253194bf`
- Current reality source: `026-graph-and-context-optimization/016-foundational-runtime/002-infrastructure-primitives/implementation-summary.md` and `002-cluster-consumers/implementation-summary.md`
