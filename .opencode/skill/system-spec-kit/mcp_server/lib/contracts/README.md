---
title: "Contracts"
description: "Typed contracts for the retrieval pipeline. Defines envelopes, traces, and degraded-mode handling for structured, observable retrieval."
trigger_phrases:
  - "retrieval contracts"
  - "context envelope"
  - "retrieval trace"
---

# Contracts

> Typed contracts for the retrieval pipeline. Defines envelopes, traces, and degraded-mode handling for structured, observable retrieval.

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

The contracts module provides typed contracts for the retrieval pipeline. All retrieval results, pipeline traces, per-stage metrics, and failure-handling structures are defined here. Consumers depend on these types to interact with retrieval outputs in a consistent, traceable way.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 1 | `retrieval-trace.ts` |
| Retrieval Stages | 6 | candidate, filter, fusion, rerank, fallback, final-rank |
| Factory Functions | 4 | createTrace, createEntry, createDegradedContract, createEnvelope |

### Key Features

| Feature | Description |
|---------|-------------|
| **ContextEnvelope** | Wraps retrieval results with trace metadata for end-to-end observability |
| **RetrievalTrace** | Full pipeline trace capturing stages, timing, and result counts |
| **TraceEntry** | Per-stage metrics (stage name, duration, candidate count, filtered count) |
| **DegradedModeContract** | Failure handling with confidence impact and retry recommendation |
| **RetrievalStage enum** | Canonical stage identifiers used across the pipeline |
| **Factory Functions** | Constructors with safe defaults for all contract types |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
contracts/
 retrieval-trace.ts    # Typed contracts, enums, and factory functions for the retrieval pipeline
 README.md             # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `retrieval-trace.ts` | Defines all retrieval pipeline contracts: envelopes, traces, per-stage entries, degraded-mode structs, and the `RetrievalStage` enum |

<!-- /ANCHOR:structure -->

---

## 3. FEATURES
<!-- ANCHOR:features -->

### ContextEnvelope

**Purpose**: Wrap retrieval results with trace and metadata for structured output.

| Field | Type | Description |
|-------|------|-------------|
| `results` | `unknown[]` | Retrieved items from the pipeline |
| `trace` | `RetrievalTrace` | Full pipeline trace attached to this retrieval |
| `metadata` | `Record<string, unknown>` | Arbitrary metadata (e.g., query, specFolder, timestamp) |

### RetrievalTrace

**Purpose**: Capture the full pipeline execution record.

| Field | Type | Description |
|-------|------|-------------|
| `traceId` | `string` | Unique identifier for this retrieval run |
| `stages` | `TraceEntry[]` | Per-stage execution records |
| `totalDurationMs` | `number` | Wall-clock time for the full pipeline |
| `inputCount` | `number` | Candidates entering the pipeline |
| `outputCount` | `number` | Results exiting the pipeline |
| `degraded` | `boolean` | Whether any stage entered degraded mode |

### TraceEntry

**Purpose**: Record per-stage metrics within a retrieval trace.

| Field | Type | Description |
|-------|------|-------------|
| `stage` | `RetrievalStage` | Pipeline stage identifier |
| `durationMs` | `number` | Time spent in this stage |
| `inputCount` | `number` | Candidates entering the stage |
| `outputCount` | `number` | Candidates exiting the stage |

### DegradedModeContract

**Purpose**: Describe a pipeline failure with recovery guidance.

| Field | Type | Description |
|-------|------|-------------|
| `stage` | `RetrievalStage` | Stage where degradation occurred |
| `reason` | `string` | Human-readable failure reason |
| `confidenceImpact` | `number` | Score penalty applied (0–1) |
| `retryRecommended` | `boolean` | Whether a retry is advisable |

### RetrievalStage Enum

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
| `createTrace(traceId, inputCount)` | `RetrievalTrace` | New trace with safe defaults |
| `createEntry(stage, durationMs, inputCount, outputCount)` | `TraceEntry` | New stage entry |
| `createDegradedContract(stage, reason, confidenceImpact, retryRecommended)` | `DegradedModeContract` | New degraded-mode record |
| `createEnvelope(results, trace, metadata?)` | `ContextEnvelope` | New envelope wrapping results + trace |

<!-- /ANCHOR:features -->

---

## 4. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Create a Trace and Record Stages

```typescript
import {
  createTrace,
  createEntry,
  createEnvelope,
  RetrievalStage,
} from './retrieval-trace';

// Start a new trace
const trace = createTrace('trace-abc-123', 50);

// Record a fusion stage entry
const fusionEntry = createEntry(RetrievalStage.fusion, 12, 50, 30);
trace.stages.push(fusionEntry);

trace.totalDurationMs = 45;
trace.outputCount = 10;

// Wrap results in an envelope
const envelope = createEnvelope(results, trace, { query: 'authentication flow' });
```

### Example 2: Signal a Degraded Stage

```typescript
import {
  createDegradedContract,
  RetrievalStage,
} from './retrieval-trace';

// Reranker timed out — signal degraded mode
const degraded = createDegradedContract(
  RetrievalStage.rerank,
  'Cross-encoder P95 threshold exceeded (512ms)',
  0.15,
  true
);

console.log(`Stage: ${degraded.stage}, confidence impact: -${degraded.confidenceImpact}`);
// Stage: rerank, confidence impact: -0.15
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Start trace | `createTrace(traceId, inputCount)` | Beginning of a retrieval call |
| Record stage | `createEntry(stage, durationMs, in, out)` | After each pipeline stage completes |
| Signal failure | `createDegradedContract(stage, reason, impact, retry)` | When a stage falls back or fails |
| Wrap output | `createEnvelope(results, trace, metadata)` | Before returning from retrieval handler |

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
| `handlers/memory-search.ts` | Primary consumer of `ContextEnvelope` |
| `handlers/memory-context.ts` | Secondary consumer of `ContextEnvelope` |
| `lib/telemetry/retrieval-telemetry.ts` | Uses trace data for quality metrics |

<!-- /ANCHOR:related -->

---

**Version**: 1.7.2
**Last Updated**: 2026-02-19
