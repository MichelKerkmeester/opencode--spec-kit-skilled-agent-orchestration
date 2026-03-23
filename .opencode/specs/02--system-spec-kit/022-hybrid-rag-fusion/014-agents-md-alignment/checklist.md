---
title: "Checklist: 014-agents-md-alignment"
description: "Level 2 verification checklist for AGENTS.md Quick Reference alignment."
trigger_phrases:
  - "013 checklist"
importance_tier: "important"
contextType: "checklist"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Checklist: 014-agents-md-alignment

<!-- ANCHOR:protocol -->
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

<!-- /ANCHOR:protocol -->
## Refinement Pass (2026-03-16)

### P0 — Must Pass

- [x] G-01: FS Resume prior work row has `/memory:continue` + `memory_search()`
  - Evidence: Grep `memory:continue` → 4/4 (AGENTS.md, FS, Barter, CLAUDE.md)
- [x] G-02: FS Save context row has `/memory:save`
  - Evidence: Grep `memory:save` → 4/4 (AGENTS.md, FS, Barter, CLAUDE.md)
- [x] G-06: File modification row shows `Gate 3 → Gate 1 → Gate 2` in all 4 files
  - Evidence: Grep `Gate 3.*ask spec folder.*Gate 1.*Gate 2` → 4/4; old ordering → 0 matches

### P1 — Should Pass

- [x] G-03/G-04: No trailing extra pipe on Claim completion rows
  - Evidence: Grep `Claim completion.*\|  \|` → 0 matches
- [x] G-05: FS Documentation row has `validate_document.py`
  - Evidence: Grep `validate_document.py` in Quick Reference → 4/4
- [x] GPT-5.4 ultra-think cross-AI review completed (Analytical 88, Critical 92, Holistic 88)
- [x] Universal skill section references `sk-code--opencode` with system-spec-kit + memory system
- [x] FS skill section references `sk-code--full-stack` with 3-phase lifecycle + stack verification
- [x] Both files reference `sk-git` with full workflow (Worktree / Commit / Finish)
- [x] Changelog `v2.2.0.0.md` created
