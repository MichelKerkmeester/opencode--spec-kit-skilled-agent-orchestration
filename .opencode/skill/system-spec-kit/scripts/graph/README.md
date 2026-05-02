---
title: "Graph Scripts: Metadata Backfill"
description: "CLI helper for refreshing spec-folder graph-metadata files across the specs tree."
trigger_phrases:
  - "graph metadata backfill"
  - "backfill graph metadata"
  - "spec graph metadata"
---

# Graph Scripts: Metadata Backfill

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. ENTRYPOINTS](#4--entrypoints)
- [5. BOUNDARIES](#5--boundaries)
- [6. RELATED](#6--related)

## 1. OVERVIEW

`scripts/graph/` contains the CLI entrypoint that refreshes `graph-metadata.json` files for spec folders. It discovers packet folders, derives current metadata, and reports low-confidence fields that may need review.

Current state:

- Defaults to an inclusive scan of active, archived, and future spec trees.
- Supports `--active-only` when archived paths should be skipped.
- Supports `--dry-run` for previewing created, refreshed, and flagged packets.

## 2. DIRECTORY TREE

```text
graph/
`-- backfill-graph-metadata.ts
```

## 3. KEY FILES

| File | Role |
|---|---|
| `backfill-graph-metadata.ts` | Collects spec folders and calls graph metadata derivation or refresh APIs. |

## 4. ENTRYPOINTS

Run the built script from the repository root:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js --dry-run
node .opencode/skill/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js --active-only
```

Use `--root <specs-dir>` to target a specific specs directory.

## 5. BOUNDARIES

The script owns graph metadata refresh only. It should not edit authored spec documents such as `spec.md`, `plan.md`, or `implementation-summary.md`.

## 6. RELATED

- `../config/README.md`
- `../../mcp_server/api/`
