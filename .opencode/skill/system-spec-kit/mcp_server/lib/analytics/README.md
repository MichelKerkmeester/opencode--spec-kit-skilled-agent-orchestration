---
title: "Analytics"
description: "Session analytics storage and replay helpers for hook-produced metadata."
trigger_phrases:
  - "session analytics"
  - "analytics db"
---

# Analytics

## 1. OVERVIEW

`lib/analytics/` currently centers on `session-analytics-db.ts`, a reader-owned SQLite store for replaying stop-hook transcript metadata into queryable session and turn tables.

The module seeds pricing metadata, normalizes transcript turns, and keeps analytics persistence separate from the primary memory index.

## 2. RELATED

- `../session/README.md`
- `../../hooks/claude/README.md`
