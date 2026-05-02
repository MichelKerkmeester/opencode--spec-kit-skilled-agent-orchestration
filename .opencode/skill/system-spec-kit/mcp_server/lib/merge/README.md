---
title: "Merge: Anchor-Scoped Writes"
description: "Pure anchor-scoped merge transforms for canonical spec-document updates."
trigger_phrases:
  - "anchor merge"
  - "spec doc merge"
---

# Merge: Anchor-Scoped Writes

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. DIRECTORY TREE](#3--directory-tree)
- [4. KEY FILES](#4--key-files)
- [5. BOUNDARIES AND FLOW](#5--boundaries-and-flow)
- [6. ENTRYPOINTS](#6--entrypoints)
- [7. VALIDATION](#7--validation)
- [8. RELATED](#8--related)

## 1. OVERVIEW

`lib/merge/` owns pure document transforms for routed canonical spec-document updates. It receives document text, an anchor, a merge mode and a dedupe fingerprint, then returns updated document text plus merge metadata.

Current state:

- Supports paragraph append, ADR insertion, table row append, in-place checklist updates and section append.
- Validates anchor markers, conflict markers and merge invariants before returning output.
- Does not read or write files. Callers own filesystem IO.

## 2. ARCHITECTURE

```text
caller-owned file read
    │
    ▼
AnchorMergeRequest
    │
    ▼
anchorMergeOperation
    │
    +--> split frontmatter and body
    +--> locate target anchor
    +--> dispatch merge mode
    +--> validate rebuilt anchor graph
    │
    ▼
AnchorMergeResult
```

## 3. DIRECTORY TREE

```text
merge/
+-- anchor-merge-operation.ts  # Pure merge engine and typed payload contracts
`-- README.md                  # Folder orientation
```

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `anchor-merge-operation.ts` | Exports merge types, `anchorMergeOperation`, error codes and mode-specific transforms. |

## 5. BOUNDARIES AND FLOW

Allowed inputs are in-memory document content and typed merge payloads. Allowed outputs are updated content, changed status, dedupe metadata and typed merge errors.

This folder should stay side-effect free. It should not choose routing targets, load files, save files or index memory.

Main flow:

```text
AnchorMergeRequest
    -> document split
    -> anchor lookup or ADR append path
    -> merge-mode transform
    -> anchor graph validation
    -> AnchorMergeResult
```

## 6. ENTRYPOINTS

| Export | File | Purpose |
|---|---|---|
| `anchorMergeOperation` | `anchor-merge-operation.ts` | Applies one typed merge request to one document string. |
| `AnchorMergeRequest` | `anchor-merge-operation.ts` | Input contract for callers. |
| `AnchorMergeResult` | `anchor-merge-operation.ts` | Output contract for changed content and metadata. |
| `AnchorMergeOperationError` | `anchor-merge-operation.ts` | Typed failure surface for invalid anchors or unsafe content. |

## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/lib/merge/README.md
```

## 8. RELATED

- `../routing/README.md`
- `../continuity/README.md`
