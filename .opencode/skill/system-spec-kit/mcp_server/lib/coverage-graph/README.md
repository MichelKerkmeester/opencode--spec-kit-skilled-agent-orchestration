---
title: "Coverage Graph: Deep-Loop Graph Library"
description: "Storage, query and signal helpers for session-scoped deep-loop coverage graphs."
trigger_phrases:
  - "coverage graph"
  - "deep loop coverage"
---

# Coverage Graph: Deep-Loop Graph Library

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. PACKAGE TOPOLOGY](#3--package-topology)
- [4. DIRECTORY TREE](#4--directory-tree)
- [5. KEY FILES](#5--key-files)
- [6. BOUNDARIES AND FLOW](#6--boundaries-and-flow)
- [7. ENTRYPOINTS](#7--entrypoints)
- [8. VALIDATION](#8--validation)
- [9. RELATED](#9--related)

---

## 1. OVERVIEW

`lib/coverage-graph/` owns the library layer for deep-loop research and review coverage graphs. It stores graph nodes, edges and convergence snapshots in `deep-loop-graph.sqlite`.

Current state:

- Graph rows are isolated by `specFolder`, `loopType` and `sessionId`.
- Research and review loops use different node kinds, relation names and convergence signals.
- The library is separate from the causal memory graph in `lib/graph/`.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                 lib/coverage-graph/                              │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────────────────┐
│ handlers/coverage-graph/*  │
└──────────────┬─────────────┘
               ▼
┌────────────────────────────┐      ┌────────────────────────────┐
│ coverage-graph-query.ts    │ ───▶ │ coverage-graph-db.ts       │
│ coverage-graph-signals.ts  │      │ SQLite schema and writes   │
└──────────────┬─────────────┘      └──────────────┬─────────────┘
               │                                   ▼
               │                    ┌────────────────────────────┐
               └──────────────────▶ │ deep-loop-graph.sqlite     │
                                    └────────────────────────────┘

Dependency direction: handlers ───▶ lib/coverage-graph ───▶ core config and SQLite
```

---

## 3. PACKAGE TOPOLOGY

```text
lib/coverage-graph/
+-- coverage-graph-db.ts       # SQLite schema, namespace model and write primitives
+-- coverage-graph-query.ts    # Gap, contradiction, provenance and hot-node queries
`-- coverage-graph-signals.ts  # Signal computation, snapshots and convergence metrics
```

Allowed direction:

- `coverage-graph-query.ts` may read through `coverage-graph-db.ts`.
- `coverage-graph-signals.ts` may read graph rows and create snapshots through `coverage-graph-db.ts`.
- Handlers may import this library, but this library must not import handlers.

---

## 4. DIRECTORY TREE

```text
coverage-graph/
+-- README.md
+-- coverage-graph-db.ts
+-- coverage-graph-query.ts
`-- coverage-graph-signals.ts
```

---

## 5. KEY FILES

| File | Role |
|---|---|
| `coverage-graph-db.ts` | Defines graph types, valid kinds, relation names, schema setup, namespace-scoped CRUD and batch upsert. |
| `coverage-graph-query.ts` | Answers coverage gaps, unverified claims, contradiction pairs, provenance chains and hot-node ranking. |
| `coverage-graph-signals.ts` | Computes node signals, research signals, review signals, snapshots, stats and momentum inputs. |

---

## 6. BOUNDARIES AND FLOW

Library boundary:

- Owns graph persistence and read models for deep-loop coverage only.
- Does not own MCP input validation or JSON response formatting.
- Does not replace memory causal edges or code graph storage.

Main flow:

```text
╭────────────────────────────╮
│ Coverage graph handler     │
╰──────────────┬─────────────╯
               ▼
┌────────────────────────────┐
│ Namespace is supplied      │
│ specFolder, loopType, sid  │
└──────────────┬─────────────┘
               ▼
┌────────────────────────────┐
│ DB, query or signal helper │
└──────────────┬─────────────┘
               ▼
┌────────────────────────────┐
│ Scoped SQLite operation    │
└──────────────┬─────────────┘
               ▼
╭────────────────────────────╮
│ Typed result for handler   │
╰────────────────────────────╯
```

---

## 7. ENTRYPOINTS

| Export | File | Purpose |
|---|---|---|
| `batchUpsert` | `coverage-graph-db.ts` | Idempotently writes nodes and edges for one namespace. |
| `getNodes`, `getEdges`, `getStats` | `coverage-graph-db.ts` | Reads graph state for handlers and signal code. |
| `findCoverageGaps`, `findContradictions`, `findProvenanceChain` | `coverage-graph-query.ts` | Provides structured graph analysis. |
| `computeSignals`, `computeNodeSignals` | `coverage-graph-signals.ts` | Computes convergence input values. |

---

## 8. VALIDATION

Run from the repository root after README edits:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/README.md
python3 .opencode/skill/sk-doc/scripts/extract_structure.py .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/README.md
```

Expected result: `validate_document.py` exits `0` and `extract_structure.py` reports README structure without critical issues.

---

## 9. RELATED

- `../../handlers/coverage-graph/README.md`
- `../graph/README.md`
