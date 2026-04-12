---
title: "Migration Scripts"
description: "Checkpoint helpers used around SQLite migration work."
trigger_phrases:
  - "migration checkpoint"
  - "restore checkpoint"
---

# Migration Scripts

## 1. OVERVIEW

`scripts/migrations/` holds CLI helpers for protecting the database around schema changes.

- `create-checkpoint.ts` - creates a point-in-time SQLite checkpoint and metadata sidecar.
- `restore-checkpoint.ts` - restores a previously captured checkpoint.

## 2. RELATED

- `../README.md`
- `../../database/README.md`
