---
title: "Contracts"
description: "Typed contracts for the retrieval pipeline, providing trace stages, degraded-mode handling and context envelope wrappers for end-to-end type safety."
trigger_phrases:
  - "retrieval trace"
  - "pipeline trace"
  - "context envelope"
  - "degraded mode contract"
  - "trace entry"
---

# Contracts

> Typed contracts for the retrieval pipeline that enforce end-to-end type safety. Defines trace stages, degraded-mode fallback handling and generic context envelopes for wrapping pipeline results with observability metadata.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. KEY EXPORTS](#3--key-exports)
- [4. RELATED DOCUMENTS](#4--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This folder contains the typed contract definitions that the retrieval pipeline uses for instrumentation and error handling. The contracts serve two purposes:

1. **Observability** -- Every retrieval request produces a `RetrievalTrace` capturing each pipeline stage (candidate, filter, fusion, rerank, fallback, final-rank) with timing, input/output counts and optional metadata. Traces are wrapped in a generic `ContextEnvelope<T>` for transport.

2. **Degraded-mode handling** -- When a pipeline stage fails, a `DegradedModeContract` records what failed, what fallback was used, the confidence impact and a retry recommendation. This lets callers make informed decisions about result quality.

Factory functions (`createTrace`, `addTraceEntry`, `createEnvelope`, `createDegradedContract`) provide validated construction with clamped confidence values and auto-generated trace IDs.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:structure -->
## 2. STRUCTURE

```
contracts/
├── README.md              # This file
└── retrieval-trace.ts     # All trace types, envelope types and factory functions
```

| File                  | LOC  | Description                                                          |
| --------------------- | ---- | -------------------------------------------------------------------- |
| `retrieval-trace.ts`  | 197  | Pipeline trace types, context envelope, degraded-mode contract, factories |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:key-exports -->
## 3. KEY EXPORTS

### Types and Interfaces

| Export                  | Kind       | Description                                                    |
| ----------------------- | ---------- | -------------------------------------------------------------- |
| `RetrievalStage`        | Type       | Union of pipeline stages: candidate, filter, fusion, rerank, fallback, final-rank |
| `TraceEntry`            | Interface  | Single stage record with timing, counts and metadata           |
| `RetrievalTrace`        | Interface  | Full trace with traceId, query, stages array and total duration |
| `DegradedModeContract`  | Interface  | Failure description with fallback mode, confidence impact and retry guidance |
| `EnvelopeMetadata`      | Interface  | Version string, generation timestamp and optional server version |
| `ContextEnvelope<T>`    | Interface  | Generic wrapper: data payload + trace + optional degraded mode |

### Factory Functions

| Export                   | Signature                                              | Description                                      |
| ------------------------ | ------------------------------------------------------ | ------------------------------------------------ |
| `createTrace`            | `(query, sessionId?, intent?) => RetrievalTrace`       | Initialize a new trace with auto-generated ID    |
| `addTraceEntry`          | `(trace, stage, in, out, ms, meta?) => RetrievalTrace` | Append a stage entry, update totals (mutates)    |
| `createEnvelope`         | `(data, trace, degraded?, version?) => ContextEnvelope<T>` | Wrap results with trace and metadata         |
| `createDegradedContract` | `(failure, fallback, confidence, retry, stages) => DegradedModeContract` | Build a clamped degraded-mode record |

### Constants

| Export              | Value    | Description                        |
| ------------------- | -------- | ---------------------------------- |
| `ENVELOPE_VERSION`  | `1.0.0`  | Current context envelope version   |

<!-- /ANCHOR:key-exports -->

---

<!-- ANCHOR:related -->
## 4. RELATED DOCUMENTS

- **Algorithms**: `../algorithms/` consumes `DegradedModeContract` pattern in adaptive fusion fallback paths
- **MCP Server**: `../mcp_server/` uses `ContextEnvelope` and `RetrievalTrace` for instrumented responses
- **Types**: `../types.ts` defines shared memory and scoring types used alongside trace contracts

<!-- /ANCHOR:related -->

---
