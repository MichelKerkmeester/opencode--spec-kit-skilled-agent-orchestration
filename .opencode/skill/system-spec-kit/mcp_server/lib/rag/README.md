---
title: "RAG Library: Trust Tree"
description: "Builds answer-level trust summaries from memory, graph, advisor, CocoIndex and causal signals."
trigger_phrases:
  - "rag trust tree"
  - "answer trust signals"
---

# RAG Library: Trust Tree

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. ENTRYPOINTS](#4--entrypoints)
- [5. BOUNDARIES](#5--boundaries)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

## 1. OVERVIEW

This folder contains answer-level trust composition for retrieval-augmented responses. It converts independent provenance signals into a single decision with citations, reasons and grouped causal edges.

## 2. DIRECTORY TREE

```text
rag/
+-- trust-tree.ts  # Trust-signal composition and exported types
`-- README.md      # Folder orientation
```

## 3. KEY FILES

| File | Role |
|---|---|
| `trust-tree.ts` | Normalizes trust states, groups causal edges and returns `trusted`, `mixed`, `degraded` or `unavailable` decisions. |

## 4. ENTRYPOINTS

- `buildTrustTree(input)` composes response policy, code graph, advisor, CocoIndex and causal inputs.
- Exported types include `TrustTree`, `TrustSignal`, `TrustSignalState`, `TrustTreeDecision`, `CausalRelation`, `CausalTrustEdge` and `BuildTrustTreeInput`.

## 5. BOUNDARIES

- This folder composes trust metadata only.
- It does not run retrieval, classify prompts or query external indexes.
- Callers should pass citations and raw signal details when available.

## 6. VALIDATION

Run from the repository root:

```bash
npm test -- --runInBand
```

## 7. RELATED

- `../memory/`
- `../code-graph/`
- `../advisor/`
