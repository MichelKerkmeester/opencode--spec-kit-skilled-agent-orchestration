---
title: "Checklist: 018-agents-md-alignment"
description: "Level 2 verification checklist for AGENTS.md Quick Reference alignment."
trigger_phrases:
  - "018 checklist"
importance_tier: "important"
contextType: "checklist"
---
# Checklist: 018-agents-md-alignment

## P0 — Must Pass

- [x] Constitutional memory row updated in all 3 files — shows `list | edit | remove | budget` subcommands
  - Evidence: Grep `list.*edit.*remove.*budget` → 3 matches (AGENTS.md:53, FS:80, Barter:89)
- [x] Database maintenance row includes `ingest` in all 3 files
  - Evidence: Grep `ingest operations` → 3 matches (AGENTS.md:55, FS:82, Barter:91)
- [x] Analysis/evaluation row (`/memory:analyze`) present in all 3 files
  - Evidence: Grep `/memory:analyze` → 3 matches (AGENTS.md:56, FS:83, Barter:92)
- [x] Shared memory row (`/memory:shared`) present in all 3 files
  - Evidence: Grep `/memory:shared` → 3 matches (AGENTS.md:57, FS:84, Barter:93)
- [x] Barter READ-ONLY git policy preserved
  - Evidence: Grep `GIT POLICY: READ-ONLY` → 1 match (Barter:63)

## P1 — Should Pass

- [x] FS-Enterprises Research/exploration row includes `memory_context()` unified alternative
  - Evidence: Grep `memory_context.*unified` → 1 match (FS:64)
- [x] FS-Enterprises stack detection table preserved (lines 11-19 unchanged)
- [x] Quick Reference table row order consistent across all 3 files
- [x] No accidental removal of variant-specific rows (Go/Angular/Swift verification, Git analysis)

## P2 — Nice to Have

- [x] Table column alignment visually consistent within each file
- [x] Spec documentation (Level 2) complete: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md
