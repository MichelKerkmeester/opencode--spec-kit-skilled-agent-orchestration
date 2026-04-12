---
title: "Merge"
description: "Anchor-scoped merge transforms for canonical spec-document writes."
trigger_phrases:
  - "anchor merge"
  - "spec doc merge"
---

# Merge

## 1. OVERVIEW

`lib/merge/` currently contains `anchor-merge-operation.ts`, the canonical anchor-scoped merge engine for spec-document updates.

Supported merge modes include paragraph append, ADR insertion, table-row append, in-place update, and section append. The module is used by routed save flows that target spec docs instead of generated memory files.

## 2. RELATED

- `../routing/README.md`
- `../continuity/README.md`
