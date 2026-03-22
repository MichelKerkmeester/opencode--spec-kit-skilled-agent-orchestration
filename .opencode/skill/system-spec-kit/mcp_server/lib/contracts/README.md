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

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. FEATURES](#3--features)
- [4. USAGE EXAMPLES](#4--usage-examples)
- [5. RELATED RESOURCES](#5--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The canonical location for retrieval-trace is `shared/contracts/retrieval-trace.ts` (importable as `@spec-kit/shared/contracts/retrieval-trace`). This README is retained as a pointer so that existing documentation links remain valid.

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

## 4. USAGE EXAMPLES
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

## 5. RELATED RESOURCES
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

**Version**: 2.0.0
**Last Updated**: 2026-03-08
