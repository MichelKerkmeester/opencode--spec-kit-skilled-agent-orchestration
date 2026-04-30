---
title: "Code-graph readiness contract"
description: "Shared readiness contract for code-graph handlers that emits canonicalReadiness and trustState through one module while downstream handlers layer richer blocked-read payloads on top."
---

# Code-graph readiness contract

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 1. OVERVIEW

Code-graph handlers emit the same `canonicalReadiness` and `trustState` fields through one shared readiness-contract module.

This is the shared structural context contract for the code-graph family. It replaced inline readiness helpers in `query.ts` and propagated the same vocabulary to the other read and maintenance handlers that previously exposed inconsistent or missing readiness blocks.

That shared block now sits underneath richer operator-facing payloads. In particular, `code_graph_context` uses the same readiness contract on both success and blocked full-scan responses, then layers blocked-read fields such as `blocked`, `degraded`, `graphAnswersOmitted`, `requiredAction`, `blockReason`, and `lastPersistedAt` on top so callers can tell both why graph answers were withheld and what to do next.

---

## 2. CURRENT REALITY

Commit `4a154c555` introduced `mcp_server/code_graph/lib/readiness-contract.ts` with four shared helpers:

- `canonicalReadinessFromFreshness()`
- `queryTrustStateFromFreshness()`
- `buildQueryGraphMetadata()`
- `buildReadinessBlock()`

Commit `f253194bf` then propagated that contract to the six sibling handlers: `query.ts`, `scan.ts`, `status.ts`, `context.ts`, `ccc-status.ts`, `ccc-reindex.ts`, and `ccc-feedback.ts`.

The contract projects freshness-aware code-graph state onto the canonical `SharedPayloadTrustState` vocabulary from `lib/context/shared-payload.ts` instead of inventing a new local enum. Handlers that operate on adjacent infrastructure rather than direct structural readiness, such as the CCC trio, now still emit the same public fields but use `trustState: 'unavailable'` with `reason: 'readiness_not_applicable'` where a full readiness semantic does not fit.

The result is **shared vocabulary, handler-local payload shape**: callers can rely on `canonicalReadiness` and `trustState` being projected by the same helper module instead of reconstructing per-handler differences, BUT the exact payload fields layered on top of that shared block vary between `code_graph_query`, `code_graph_context`, and `code_graph_status`. There is no single universal "degraded response" type — each handler returns its own surface, with the shared readiness block embedded inside.

Concrete shape per handler:

- **`code_graph_query`** — blocked-read path returns `status: "blocked"`, `operation`, `subject`, `blocked`, `degraded`, `graphAnswersOmitted`, `requiredAction`, `blockReason`, `fallbackDecision: { nextTool, reason, retryAfter? }`, and `lastPersistedAt`, embedding the shared readiness block under `data.readiness` and echoing `canonicalReadiness` and `trustState` at the top level.
- **`code_graph_context`** — blocked-read path mirrors the query shape but preserves `queryMode` instead of `operation`/`subject`. On a readiness-crash (`freshness === 'error'`), context preserves the same structured envelope, `readiness`, `canonicalReadiness`, `trustState`, `graphAnswersOmitted: true`, plus an `rg` recovery signal, before attempting any `buildContext()` call, so a downstream `buildContext()` failure cannot strip the degraded metadata.
- **`code_graph_status`** — diagnostic-only handler. Does NOT return blocked-read fields; reports `readiness.action`, `freshness`, `graphQualitySummary`, and the canonical readiness block via `getGraphReadinessSnapshot()` (the non-mutating sibling of `ensureCodeGraphReady`). The snapshot is preserved even when `graphDb.getStats()` throws (e.g., DB locked or corrupt) so the action-level surface survives DB-unavailable states.

Operator-facing rule of thumb: every code-graph handler exposes the same `readiness` / `canonicalReadiness` / `trustState` keys (the **vocabulary**), but the surrounding **payload fields** are read in the handler's own contract page. Do not infer the shape of one handler's degraded response from another's. Where the recovery routing field name for `code_graph_context` readiness-crash diverges from `code_graph_query`'s `fallbackDecision`, treat this page and `mcp_server/code_graph/handlers/context.ts` as the current contract.

The readiness module also now exposes a non-mutating `getGraphReadinessSnapshot()` for status reporting. It returns the same `{action, freshness, reason}` triplet as `ensureCodeGraphReady` but never triggers cache mutation, deleted-file cleanup, or inline indexing — used by `code_graph_status` for diagnostic reads where the caller wants observability without side effects.

Code graph freshness is a read-path/manual contract: callers use `code_graph_status` for diagnostics, `code_graph_scan` for explicit refresh, and `code_graph_query` / `code_graph_context` for reads that may perform bounded selective self-heal through `ensure-ready.ts` when inline indexing is allowed. There is no background watcher. `code_graph_verify` uses the same readiness helper with `allowInlineFullScan: false` and blocks when the graph is not fresh.

Matrix status treats the code-graph cells as native/local validation surfaces rather than external CLI adapter cells. External CLI matrix adapters live separately under `mcp_server/matrix_runners/`; the code-graph readiness contract here remains manual/read-path driven.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/code_graph/lib/readiness-contract.ts` | Lib | Canonical readiness helper surface for code-graph handlers |
| `mcp_server/code_graph/lib/ensure-ready.ts:141-225` | Lib | Detects empty, stale, full-scan, and selective-reindex states without a watcher |
| `mcp_server/code_graph/lib/ensure-ready.ts:329-360` | Lib | Applies read-path readiness debounce and selective self-heal gating |
| `mcp_server/code_graph/handlers/query.ts` | Handler | Query-time readiness projection and graph metadata envelope |
| `mcp_server/code_graph/handlers/scan.ts` | Handler | Scan result readiness block |
| `mcp_server/code_graph/handlers/scan.ts:177-180` | Handler | Manual `code_graph_scan` entry point for explicit refresh |
| `mcp_server/code_graph/handlers/status.ts:158-180` | Handler | Diagnostic `code_graph_status` snapshot that does not mutate readiness state |
| `mcp_server/code_graph/handlers/context.ts` | Handler | Context success and blocked-read payloads built on top of the shared readiness block |
| `mcp_server/code_graph/handlers/verify.ts:141-188` | Handler | `code_graph_verify` runs the gold-query battery only after fresh readiness |
| `mcp_server/code_graph/tools/code-graph-tools.ts:20-31` | Dispatcher | Registers `code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`, and `code_graph_verify` |
| `mcp_server/code_graph/README.md:137-149` | Docs | Public status/readiness surface matrix for status, context, and query reads |
| `mcp_server/code_graph/handlers/ccc-status.ts` | Handler | CCC status stub readiness block |
| `mcp_server/code_graph/handlers/ccc-reindex.ts` | Handler | CCC reindex stub readiness block |
| `mcp_server/code_graph/handlers/ccc-feedback.ts` | Handler | CCC feedback stub readiness block |

### Validation And Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/readiness-contract.vitest.ts` | Shared readiness helper behavior and trust-state projection |
| `mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts` | Sibling-handler readiness propagation and top-level readiness field parity |
| `mcp_server/code_graph/tests/code-graph-context-handler.vitest.ts` | Blocked full-scan payload fields, readiness crash fallback, and structured context metadata |
| `mcp_server/tests/m8-trust-state-vocabulary.vitest.ts` | Shared payload trust-state vocabulary alignment |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md`

- Current implementation commits: `4a154c555`, `f253194bf`
