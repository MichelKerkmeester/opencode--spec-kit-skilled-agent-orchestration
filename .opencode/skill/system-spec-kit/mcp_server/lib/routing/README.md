---
title: "Routing: Content Save Targets"
description: "Content-router logic that maps continuity chunks to canonical spec-document targets."
trigger_phrases:
  - "content router"
  - "canonical routing"
---

# Routing: Content Save Targets

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

`lib/routing/` owns routing decisions for canonical continuity saves. It takes normalized save chunks plus packet context, assigns a routing category, then returns the target document, anchor and merge mode used by downstream writers.

Current state:

- Classifies chunks into `narrative_progress`, `narrative_delivery`, `decision`, `handover_state`, `research_finding`, `task_update`, `metadata_only` or `drop`.
- Combines rule matches, prototype similarity and optional Tier 3 classification.
- Produces routing metadata only. It does not edit spec documents.

## 2. ARCHITECTURE

```text
save payload
    │
    ▼
content-router.ts
    │
    +--> rule and session hints
    +--> routing-prototypes.json
    +--> optional Tier 3 classifier
    │
    ▼
RoutingDecision
    │
    ▼
merge layer writes the selected doc and anchor
```

## 3. DIRECTORY TREE

```text
routing/
+-- content-router.ts        # Routing categories, thresholds, targets and decision logic
+-- routing-prototypes.json  # Prototype chunks for similarity-based routing
`-- README.md                # Folder orientation
```

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `content-router.ts` | Defines routing categories, thresholds, target selection, confidence bands, cache keys and exported router types. |
| `routing-prototypes.json` | Stores labeled examples that support Tier 2 prototype matching. |

## 5. BOUNDARIES AND FLOW

Allowed inputs are chunk text, source metadata, packet context and existing anchor hints. Allowed outputs are `RoutingDecision` objects and audit metadata.

This folder may import parsing and validation helpers. It should not write files, mutate spec documents or own merge transforms.

Main flow:

```text
ContentChunk + RouterContext
    -> tier 1 rules
    -> tier 2 prototype match
    -> tier 3 classifier when confidence needs review
    -> RoutingDecision
```

## 6. ENTRYPOINTS

| Export | File | Purpose |
|---|---|---|
| `ROUTING_CATEGORIES` | `content-router.ts` | Canonical category list shared with callers. |
| `RoutingDecision` | `content-router.ts` | Result shape consumed by save and merge flows. |
| Router functions in `content-router.ts` | `content-router.ts` | Classify chunks and build target metadata. |

## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/lib/routing/README.md
```

## 8. RELATED

- `../merge/README.md`
- `../continuity/README.md`
