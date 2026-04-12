---
title: "Gemini Hooks"
description: "Gemini CLI startup, compaction, and stop-hook support."
trigger_phrases:
  - "gemini hooks"
  - "gemini session prime"
---

# Gemini Hooks

## 1. OVERVIEW

`hooks/gemini/` implements the Gemini CLI hook surface used by the package.

- `session-prime.ts` formats startup, resume, clear, and compact recovery context.
- `compact-inject.ts` prepares compaction-time recovery payloads.
- `session-stop.ts` persists stop-hook session state.
- `compact-cache.ts` stores the short-lived compaction cache.
- `shared.ts` holds Gemini-specific stdin/stdout formatting helpers.

These hooks keep the canonical recovery chain aligned with `handover.md`, `_memory.continuity`, and packet docs.

## 2. RELATED

- `../README.md`
- `../claude/README.md`
