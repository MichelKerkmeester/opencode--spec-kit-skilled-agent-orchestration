---
title: "Contracts"
description: "Proxy README for retrieval pipeline contracts. Source of truth is @spec-kit/shared/contracts/retrieval-trace.ts."
trigger_phrases:
  - "retrieval contracts"
  - "context envelope"
  - "retrieval trace"
---

# Contracts

> Proxy README for retrieval pipeline contracts. The canonical source is `@spec-kit/shared/contracts/retrieval-trace.ts`.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1-overview)
- [2. STRUCTURE](#2-structure)
- [3. FEATURES](#3-features)
- [4. STRUCTURAL TRUST CONTRACT (006)](#4-structural-trust-contract-006)
- [5. USAGE EXAMPLES](#5-usage-examples)
- [6. RELATED RESOURCES](#6-related-resources)
- [8. GRAPH PAYLOAD VALIDATOR AND TRUST PRESERVATION (011)](#8-graph-payload-validator-and-trust-preservation-011)
- [9. AUDITABLE SAVINGS PUBLICATION CONTRACT (009)](#9-auditable-savings-publication-contract-009)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The canonical location for retrieval-trace is `shared/contracts/retrieval-trace.ts` (importable as `@spec-kit/shared/contracts/retrieval-trace`). This README is retained as a pointer so that existing documentation links remain valid.

Gate E keeps continuity canonical at the packet level: `/spec_kit:resume` restores context from `handover.md` -> `_memory.continuity` -> spec docs, while generated memory artifacts remain supporting only. These contracts describe retrieval around that flow rather than replacing it.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Local Modules | 0 | All code relocated to `shared/contracts/` |
| Canonical Source | 1 | `shared/contracts/retrieval-trace.ts` |
| Retrieval Stages | 6 | candidate, filter, fusion, rerank, fallback, final-rank |
| Factory Functions | 4 | createTrace, addTraceEntry, createDegradedContract, createEnvelope |

### Key Features

| Feature | Description |
|---------|-------------|
| **ContextEnvelope\<T\>** | Generic typed wrapper for pipeline results with trace and degraded-mode metadata |
| **RetrievalTrace** | Full pipeline trace capturing stages, timing, query, and intent |
| **TraceEntry** | Per-stage metrics (stage name, timestamp, duration, candidate counts) |
| **DegradedModeContract** | Failure description with confidence impact, retry recommendation, and affected stages |
| **RetrievalStage type** | Union type of canonical stage identifiers used across the pipeline |
| **EnvelopeMetadata** | Version and timestamp metadata attached to every envelope |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
contracts/
 README.md                          # This file (proxy pointer)

shared/contracts/
 retrieval-trace.ts                 # Canonical source: types, interfaces, and factory functions
```

### Key Files

| File | Location | Purpose |
|------|----------|---------|
| `retrieval-trace.ts` | `shared/contracts/` | Defines all retrieval pipeline contracts: ContextEnvelope\<T\>, RetrievalTrace, TraceEntry, DegradedModeContract, EnvelopeMetadata, and the RetrievalStage union type |

<!-- /ANCHOR:structure -->

---

## 3. FEATURES
<!-- ANCHOR:features -->

### ContextEnvelope\<T\>

**Purpose**: Generic typed wrapper for pipeline results with trace and degraded-mode metadata.

| Field | Type | Description |
|-------|------|-------------|
| `data` | `T` | The result payload from the pipeline |
| `trace` | `RetrievalTrace` | Full pipeline trace attached to this retrieval |
| `degradedMode` | `DegradedModeContract?` | Optional degraded mode contract if any stage failed |
| `metadata` | `EnvelopeMetadata` | Version, timestamp, and optional server version |

### RetrievalTrace

**Purpose**: Capture the full pipeline execution record.

| Field | Type | Description |
|-------|------|-------------|
| `traceId` | `string` | Unique identifier for this retrieval run (auto-generated `tr_` prefix) |
| `sessionId` | `string?` | Optional session identifier |
| `query` | `string` | The search query string |
| `intent` | `string?` | Optional classified intent |
| `stages` | `TraceEntry[]` | Per-stage execution records |
| `totalDurationMs` | `number` | Wall-clock time for the full pipeline |
| `finalResultCount` | `number` | Results exiting the pipeline |

### TraceEntry

**Purpose**: Record per-stage metrics within a retrieval trace.

| Field | Type | Description |
|-------|------|-------------|
| `stage` | `RetrievalStage` | Pipeline stage identifier |
| `timestamp` | `number` | Wall-clock timestamp when the stage executed |
| `inputCount` | `number` | Candidates entering the stage |
| `outputCount` | `number` | Candidates exiting the stage |
| `durationMs` | `number` | Time spent in this stage |
| `metadata` | `Record<string, unknown>?` | Optional per-stage metadata |

### DegradedModeContract

**Purpose**: Describe a pipeline failure with recovery guidance.

| Field | Type | Description |
|-------|------|-------------|
| `failure_mode` | `string` | Type of failure that occurred |
| `fallback_mode` | `string` | Fallback strategy applied |
| `confidence_impact` | `number` | Confidence factor (0 = total loss, 1 = no impact), clamped to [0, 1] |
| `retry_recommendation` | `'immediate' \| 'delayed' \| 'none'` | Retry strategy recommendation |
| `degradedStages` | `RetrievalStage[]` | Stages affected by the degradation |

### EnvelopeMetadata

**Purpose**: Version and timestamp metadata for every envelope.

| Field | Type | Description |
|-------|------|-------------|
| `version` | `string` | Envelope format version (currently `1.0.0`) |
| `generatedAt` | `string` | ISO 8601 timestamp of envelope creation |
| `serverVersion` | `string?` | Optional server version string |

### RetrievalStage Type

| Value | Description |
|-------|-------------|
| `candidate` | Initial candidate generation |
| `filter` | Pre-fusion filtering |
| `fusion` | RRF score fusion |
| `rerank` | Cross-encoder reranking |
| `fallback` | Fallback path (degraded mode) |
| `final-rank` | Final ordering before output |

### Factory Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `createTrace(query, sessionId?, intent?)` | `RetrievalTrace` | New trace with auto-generated traceId |
| `addTraceEntry(trace, stage, inputCount, outputCount, durationMs, metadata?)` | `RetrievalTrace` | Append a stage entry to an existing trace (mutates in place, returns trace for chaining) |
| `createDegradedContract(failure_mode, fallback_mode, confidence_impact, retry_recommendation, degradedStages)` | `DegradedModeContract` | New degraded-mode record with clamped confidence |
| `createEnvelope(data, trace, degradedMode?, serverVersion?)` | `ContextEnvelope<T>` | New envelope wrapping results + trace + metadata |

<!-- /ANCHOR:features -->

---

## 4. STRUCTURAL TRUST CONTRACT (006)
<!-- ANCHOR:structural-trust-contract -->

Packet `006-structural-trust-axis-contract` adds a separate structural trust contract for structural payload sections. The contract lives in `lib/context/shared-payload.ts` and must be imported rather than redefined by follow-on packets.

### Structural Trust Axes

| Field | Allowed Values | Meaning |
|-------|----------------|---------|
| `parserProvenance` | `ast`, `regex`, `heuristic`, `unknown` | Which parser or extraction family produced the structural signal |
| `evidenceStatus` | `confirmed`, `probable`, `unverified`, `unknown` | How strong the structural evidence is |
| `freshnessAuthority` | `live`, `cached`, `stale`, `unknown` | Whether the structural signal is current and authoritative |

### Contract Rules

- Keep `parserProvenance`, `evidenceStatus`, and `freshnessAuthority` as three separate fields inside `StructuralTrust`.
- Do not replace those axes with a single scalar such as `trust`, `confidence`, `authorityScore`, or `freshnessScore`.
- Ranking confidence from `lib/search/confidence-scoring.ts` is retrieval-ordering metadata only and must not be reused as `StructuralTrust`.
- Packet `007`, packet `008`, and packet `011` must import the shared contract from `lib/context/shared-payload.ts` instead of redefining local trust enums or wrappers.

### Current Authority Surfaces

Bootstrap and resume remain the authority surfaces for structural context. Packet `006` only adds the shared trust contract beside packet `005`'s certainty contract; it does not create a new graph-only owner surface.

<!-- /ANCHOR:structural-trust-contract -->

---

## 5. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Create a Trace and Record Stages

```typescript
import {
  createTrace,
  addTraceEntry,
  createEnvelope,
} from '@spec-kit/shared/contracts/retrieval-trace';
import type { RetrievalStage } from '@spec-kit/shared/contracts/retrieval-trace';

// Start a new trace
const trace = createTrace('authentication flow', 'session-xyz');

// Record a fusion stage entry
addTraceEntry(trace, 'fusion', 50, 30, 12);

// Wrap results in an envelope
const envelope = createEnvelope(results, trace);
```

### Example 2: Signal a Degraded Stage

```typescript
import {
  createDegradedContract,
} from '@spec-kit/shared/contracts/retrieval-trace';

// Reranker timed out -- signal degraded mode
const degraded = createDegradedContract(
  'timeout',
  'skip_rerank',
  0.15,
  'delayed',
  ['rerank']
);

console.log(`Failure: ${degraded.failure_mode}, confidence impact: ${degraded.confidence_impact}`);
// Failure: timeout, confidence impact: 0.15
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Start trace | `createTrace(query, sessionId?)` | Beginning of a retrieval call |
| Record stage | `addTraceEntry(trace, stage, in, out, ms)` | After each pipeline stage completes |
| Signal failure | `createDegradedContract(failure, fallback, impact, retry, stages)` | When a stage falls back or fails |
| Wrap output | `createEnvelope(data, trace, degraded?)` | Before returning from retrieval handler |

<!-- /ANCHOR:usage-examples -->

---

## 6. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [lib/README.md](../README.md) | Parent library overview |
| [lib/telemetry/README.md](../telemetry/README.md) | Retrieval telemetry (observability, governance) |
| [lib/search/README.md](../search/README.md) | Hybrid search pipeline |

### Related Modules

| Module | Purpose |
|--------|---------|
| `shared/contracts/retrieval-trace.ts` | Canonical source for all contract types |
| `handlers/memory-search.ts` | Primary consumer of `ContextEnvelope` |
| `handlers/memory-context.ts` | Secondary consumer of `ContextEnvelope` |
| `lib/telemetry/trace-schema.ts` | Trace schema definitions |

<!-- /ANCHOR:related -->

---

## 7. DETECTOR PROVENANCE AND REGRESSION FLOOR (007)

Packet `007-detector-provenance-and-regression-floor` treats frozen detector fixtures as a regression-integrity floor only. The acceptance criterion from research recommendation R6 is the governing boundary: Public must land frozen detector fixtures that fail on structural regressions, while follow-on task corpora for user-visible structural quality are defined separately.

### Boundary Rules

- Fixture success proves detector integrity for the covered regex or heuristic lanes only; it does not prove user-visible structural quality, routing quality, or graph-context usefulness.
- Successor packets must keep floor tests separate from outcome evaluation. Do not cite detector-floor passes as evidence that broader structural context is now trustworthy.
- Weak detector lanes should stay visible in packet closeouts and follow-on planning even when the frozen fixture floor passes.

### Current Packet 007 Scope

Packet `007` adds honest provenance markers for audited detector modules and a reusable frozen Vitest floor under `scripts/tests/detector-regression-floor.vitest.ts.test.ts`. Future packets may extend that floor, but they must pair any quality claims with separate outcome-oriented evaluation.

---

**Version**: 2.0.0
**Last Updated**: 2026-03-08

---

## 8. GRAPH PAYLOAD VALIDATOR AND TRUST PRESERVATION (011)

Packet `011-graph-payload-validator-and-trust-preservation` hardens emission boundaries that surface structural trust. The implementation remains additive to packet `006`: import `ParserProvenance`, `EvidenceStatus`, `FreshnessAuthority`, and the shared validation helpers from `lib/context/shared-payload.ts` instead of defining a graph-local contract.

### Enforcement Rules

- Emit code-graph or bridge-facing payloads only after validating that `parserProvenance`, `evidenceStatus`, and `freshnessAuthority` are all present as separate fields.
- Fail closed when any axis is missing, malformed, or collapsed into scalar stand-ins such as `trust`, `trustScore`, `confidence`, `confidenceScore`, or `authorityScore`.
- Preserve the three axes distinctly through bootstrap or resume-facing payloads. Do not merge them into a single "graph trust" label during transport.

### Authority Boundary

- Packet `011` does not introduce a parallel graph-only trust contract family.
- Current owner surfaces remain authoritative: shared payload sections, session bootstrap or resume consumers, and bridge-facing graph payloads.
- Ranking confidence and other retrieval-ordering metadata stay separate from `StructuralTrust`.

---

## 9. AUDITABLE SAVINGS PUBLICATION CONTRACT (009)

Packet `009-auditable-savings-publication-contract` adds a fail-closed publication gate for row-level reporting exports. The current aggregate dashboard reader remains a read-only analytics surface, so row eligibility is enforced through `lib/context/publication-gate.ts` rather than by inventing a second reporting subsystem.

### Row Eligibility Rules

- Rows are publishable only when they use packet `005`'s certainty vocabulary from `lib/context/shared-payload.ts`.
- Rows must include a supported `methodologyStatus`, a non-empty `schemaVersion`, and at least one normalized provenance entry before they can be published.
- Multiplier rows must reuse packet `005`'s `canPublishMultiplier()` helper. Do not restate the provider-counted authority rule in packet-local code.

### Exclusion Reasons

| Reason | Meaning |
|--------|---------|
| `missing_methodology` | The row is missing a supported publication methodology status. |
| `missing_schema_version` | The row omits the measurement or reporting schema version. |
| `missing_provenance` | The row omits normalized reader or telemetry provenance. |
| `unsupported_certainty` | The row uses a certainty value outside packet `005`, or a multiplier row fails the shared multiplier-publish gate. |

### Dependency Boundary

- Packet `009` consumes packet `005`'s certainty and multiplier contracts. It does not define a dashboard-local certainty enum.
- The analytics reader remains the substrate for future publication surfaces. Packet `009` only establishes the row contract that those readers must honor.
