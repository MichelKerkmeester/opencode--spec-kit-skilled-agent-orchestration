---
title: "Memory Management Library"
description: "Reserved code folder for future batch-management utilities. No live TypeScript modules are present."
trigger_phrases:
  - "memory management"
  - "batch maintenance"
  - "reserved folder"
---

# Memory Management Library

`lib/manage/` is a documented reserved folder. It has no runtime modules today. Keep new code out of this folder unless it is batch-oriented maintenance code rather than live retrieval code.

## Table of Contents

- [1. OVERVIEW](#1--overview)
- [2. TOPOLOGY](#2--topology)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

## 1. OVERVIEW

The former graph-authority helper was removed after dead-code review. Active graph scoring now lives in search and graph modules. This folder remains only to record that no management library is wired into production.

Runtime role:

- None. No live request path imports from this folder.

Maintenance role:

- Reserved for future batch utilities if they are separate from retrieval execution.
- Documents the absence of current batch-management code.

## 2. TOPOLOGY

```text
┌────────────┐
│ lib/manage │
└─────┬──────┘
      ▼
┌────────────┐
│ README.md  │
└────────────┘
```

## 3. KEY FILES

| File | Role |
| --- | --- |
| `README.md` | Documents the reserved state and points readers to active graph and search modules. |

## 4. BOUNDARIES

Owns:

- Documentation for the reserved folder state.
- Future batch-management utilities only if they do not run in live retrieval.

Does not own:

- Graph scoring.
- Retrieval ranking.
- Memory indexing.
- Handler or tool registration.

## 5. ENTRYPOINTS

There are no exported entrypoints in this folder.

If future code is added, it should document:

- The caller that starts the maintenance action.
- Whether it writes to SQLite, files, or both.
- The tests that prove it cannot affect live retrieval requests by accident.

## 6. VALIDATION

Run this check after README edits:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/lib/manage/README.md
```

If TypeScript files are added later, add focused tests before listing the folder as active.

## 7. RELATED

- `../search/graph-search-fn.ts` contains typed-weighted degree scoring for the live retrieval path.
- `../graph/graph-signals.ts` contains active graph signal aggregation.
- `../README.md` lists top-level library folders.
