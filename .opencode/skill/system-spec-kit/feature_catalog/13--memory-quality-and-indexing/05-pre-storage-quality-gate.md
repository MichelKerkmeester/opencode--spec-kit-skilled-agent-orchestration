---
title: "Pre-storage quality gate"
description: "The pre-storage quality gate validates structural integrity, content quality and semantic deduplication before a memory enters the index."
---

# Pre-storage quality gate

## 1. OVERVIEW

The pre-storage quality gate validates structural integrity, content quality and semantic deduplication before a memory enters the index.

This is the bouncer at the door before a memory enters the system. It checks three things: is the memory properly structured, is the content actually useful and is it different enough from what is already stored? If a memory fails any of these checks, it gets turned away. Without this gate, the system would fill up with junk and near-duplicates that pollute future search results.

---

## 2. CURRENT REALITY

The pre-storage quality gate still validates structure, content quality, and semantic deduplication before a memory enters the index, but it is no longer the first semantic stop in the save pipeline.

Current save ordering is:

1. parse and validate
2. quality-loop auto-fixes for recoverable formatting issues
3. shared semantic sufficiency gate
4. rendered-memory template contract validation
5. pre-storage quality gate
6. embedding, deduplication, and persistence

The shared sufficiency gate is now the earlier hard-block for memories that do not contain enough durable evidence to stand alone later. Those saves fail with `INSUFFICIENT_CONTEXT_ABORT` and do not depend on the older warn-only behavior of this gate.

The rendered-memory template contract is the next hard-block. It rejects malformed outputs before storage when required frontmatter keys, mandatory section anchors/HTML ids, or cleanup invariants are missing, or when raw Mustache/template artifacts leak into the rendered file.

The three-layer pre-storage quality gate then handles the memories that are already semantically sufficient:

- Layer 1: structural validity
- Layer 2: content quality scoring across five dimensions
- Layer 3: semantic deduplication against existing memories in the same spec folder

The gate still supports its existing warn-only rollout behavior for threshold tuning, but that warn-only mode does not override insufficiency rejection.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/validation/save-quality-gate.ts` | Lib | Pre-storage quality gate |
| `mcp_server/handlers/memory-save.ts` | Handler | Orders quality-loop, insufficiency, template-contract, and quality-gate evaluation before persistence |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/save-quality-gate.vitest.ts` | Quality gate tests |
| `mcp_server/tests/handler-memory-save.vitest.ts` | Save handler ordering and insufficiency hard-block coverage |

---

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Pre-storage quality gate
- Current reality source: FEATURE_CATALOG.md
