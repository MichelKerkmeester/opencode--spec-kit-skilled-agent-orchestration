---
title: "Save Handler: Memory Save Pipeline"
description: "Code-folder guide for the memory_save handler modules that validate, arbitrate, persist, enrich and format memory saves."
trigger_phrases:
  - "save handler"
  - "memory save pipeline"
  - "memory_save handler"
  - "atomic memory save"
---

# Save Handler: Memory Save Pipeline

> Runtime stages for validating, arbitrating, persisting, enriching and formatting `memory_save` requests.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. ARCHITECTURE](#2-architecture)
- [3. PACKAGE TOPOLOGY](#3-package-topology)
- [4. DIRECTORY TREE](#4-directory-tree)
- [5. KEY FILES](#5-key-files)
- [6. BOUNDARIES AND FLOW](#6-boundaries-and-flow)
- [7. ENTRYPOINTS](#7-entrypoints)
- [8. VALIDATION](#8-validation)
- [9. RELATED](#9-related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`handlers/save/` owns the decomposed runtime path behind the `memory_save` MCP handler. The folder keeps save orchestration split into small stages for validation, duplicate detection, embedding, prediction-error arbitration, record creation, enrichment, atomic file promotion and response formatting.

Current responsibilities:

- Keep save-stage code below the top-level MCP tool handler and above storage/search adapters.
- Preserve same-folder save ordering through `withSpecFolderLock()`.
- Build rejection, dry-run, planner and success responses without leaking storage internals into callers.
- Route persistence through `createMemoryRecord()` and storage/search helpers rather than direct SQL scattered across the handler.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         HANDLERS / SAVE                          │
╰──────────────────────────────────────────────────────────────────╯

┌─────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ MCP save tool   │ ───▶ │ save modules     │ ───▶ │ create-record.ts │
│ memory_save     │      │ validation + PE  │      │ vector + BM25    │
└────────┬────────┘      └────────┬─────────┘      └────────┬─────────┘
         │                        │                         │
         │                        ▼                         ▼
         │              ┌──────────────────┐      ┌──────────────────┐
         └──────────▶   │ atomic wrapper   │ ───▶ │ storage/search   │
                        │ file promotion   │      │ adapters         │
                        └────────┬─────────┘      └──────────────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │ response builder │
                        └──────────────────┘

Dependency direction:
MCP tool handler ───▶ handlers/save ───▶ lib/storage + lib/search + lib/cognitive
handlers/save does not import from MCP transport or spec-folder docs.
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
handlers/save/
+-- index.ts                    # Test-facing export barrel
+-- types.ts                    # Shared contracts for save stages
+-- dedup.ts                    # Existing row and content-hash checks
+-- embedding-pipeline.ts       # Embedding cache and provider path
+-- pe-orchestration.ts         # Prediction-error decision routing
+-- reconsolidation-bridge.ts   # Optional reconsolidation pass
+-- create-record.ts            # Memory row creation and indexing
+-- db-helpers.ts               # Local metadata and checkpoint helpers
+-- post-insert.ts              # Entity, summary and causal enrichment
+-- response-builder.ts         # MCP result envelopes
+-- atomic-index-memory.ts      # Pending-file promotion and rollback wrapper
+-- markdown-evidence-builder.ts # Markdown evidence extraction for validation
+-- spec-folder-mutex.ts        # In-process and interprocess save lock
+-- validation-responses.ts     # Rejection, dry-run and planner builders
`-- README.md
```

Allowed dependency direction:

```text
handler entrypoint → handlers/save → lib/storage
handler entrypoint → handlers/save → lib/search
handler entrypoint → handlers/save → lib/cognitive
handlers/save → handlers shared utilities
```

Disallowed dependency direction:

```text
lib/storage → handlers/save
lib/search → handlers/save
handlers/save → spec packet files
handlers/save → MCP transport internals
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
handlers/save/
+-- atomic-index-memory.ts
+-- create-record.ts
+-- db-helpers.ts
+-- dedup.ts
+-- embedding-pipeline.ts
+-- index.ts
+-- markdown-evidence-builder.ts
+-- pe-orchestration.ts
+-- post-insert.ts
+-- reconsolidation-bridge.ts
+-- response-builder.ts
+-- spec-folder-mutex.ts
+-- types.ts
+-- validation-responses.ts
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|---|---|
| `types.ts` | Shared interfaces for parsed memory, save arguments, PE decisions, planner payloads, atomic saves and post-insert metadata. |
| `index.ts` | Export barrel for tests and controlled consumers. Production imports usually target concrete modules. |
| `dedup.ts` | Detects unchanged paths and duplicate content hashes before heavier save work runs. |
| `embedding-pipeline.ts` | Reads and writes embedding cache entries, calls the embedding provider when needed and supports pending embedding status. |
| `pe-orchestration.ts` | Finds similar memories, runs prediction-error gating and applies create, update, reinforce, supersede or linked-create actions. |
| `reconsolidation-bridge.ts` | Runs optional checkpoint-gated reconsolidation before normal record creation. |
| `create-record.ts` | Inserts memory rows, records lineage/history, writes vector/BM25 data and applies post-insert metadata. |
| `db-helpers.ts` | Applies guarded metadata updates and checks reconsolidation checkpoint prerequisites. |
| `post-insert.ts` | Runs feature-flagged enrichment for causal links, entities, summaries and cross-document entity links. |
| `response-builder.ts` | Converts save results and planner payloads into MCP success or error envelopes. |
| `atomic-index-memory.ts` | Coordinates pending-file writes, file promotion, rollback, retry and save-result mapping for atomic save paths. |
| `markdown-evidence-builder.ts` | Extracts headings, lists, tables and summary evidence from markdown for memory sufficiency checks. |
| `spec-folder-mutex.ts` | Serializes saves per spec folder across local async chains and temporary interprocess lock directories. |
| `validation-responses.ts` | Builds insufficiency rejections, template-contract rejections, dry-run summaries and planner diagnostics. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Save modules may call handler utilities plus `lib/storage`, `lib/search`, `lib/cognitive`, parsing and provider modules. |
| Exports | `index.ts` exposes stable test and helper exports. Runtime code should prefer direct module imports when it owns a specific stage. |
| Storage | Record persistence belongs in `create-record.ts`, `db-helpers.ts` or `lib/storage/*`, not in validation or response modules. |
| Validation | Rejection builders stay pure. They receive parsed validation results and return `IndexResult` or planner objects without DB writes. |
| Concurrency | Any atomic file save must run through `withSpecFolderLock()` before promotion and indexing. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ memory_save request                      │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ parse and validate memory file            │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ dedup and embedding pipeline              │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ prediction-error and reconsolidation      │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ create record and post-insert enrichment  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ response builder and mutation hooks       │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ MCP response envelope                     │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `createMemoryRecord()` | Function | Inserts a parsed memory and related index metadata after validation and PE routing. |
| `generateOrCacheEmbedding()` | Function | Resolves the embedding vector or pending status for save/index flows. |
| `evaluateAndApplyPeDecision()` | Function | Applies prediction-error decisions against similar memories. |
| `runPostInsertEnrichment()` | Function | Runs optional enrichment steps after a row exists. |
| `buildSaveResponse()` | Function | Produces the final MCP success payload for a save result. |
| `withSpecFolderLock()` | Function | Wraps critical save sections with a per-spec-folder mutex. |
| `atomicIndexMemory()` | Function | Coordinates pending file promotion and indexing for atomic file-save callers. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 8. VALIDATION

Run from the repository root unless noted.

```bash
python3 .opencode/skill/sk-doc/scripts/extract_structure.py .opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md
```

Expected result: the document is detected as a README and the extracted structure has no critical section or HVR issues.

Focused code checks for this folder normally run through the package test suite that covers `handlers/save/*` exports.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 9. RELATED

- [`../README.md`](../README.md)
- [`../../lib/storage/README.md`](../../lib/storage/README.md)
- [`../../lib/search/README.md`](../../lib/search/README.md)
- [`../../database/README.md`](../../database/README.md)

<!-- /ANCHOR:related -->
