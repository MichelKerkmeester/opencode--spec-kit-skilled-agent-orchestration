---
title: "Resume"
description: "Resume ladder logic for packet recovery and continuity resolution."
trigger_phrases:
  - "resume ladder"
  - "session resume"
---

# Resume

## 1. OVERVIEW

`lib/resume/` owns the packet recovery ladder used by session-resume flows.

- `resume-ladder.ts` resolves the active spec folder and rebuilds packet continuity from `handover.md`, then `_memory.continuity`, then the canonical spec docs.

## 2. RELATED

- `../continuity/README.md`
- `../../handlers/README.md`
