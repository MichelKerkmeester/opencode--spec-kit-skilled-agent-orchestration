---
title: "Tasks: 013-agents-md-alignment"
description: "Task breakdown for AGENTS.md Quick Reference alignment."
trigger_phrases:
  - "013 tasks"
importance_tier: "important"
contextType: "tasks"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 013-agents-md-alignment

<!-- ANCHOR:notation -->
## Task List

- [x] **T1: Read and verify gaps** — Read all 3 AGENTS.md files, confirm 5 gaps exist
- [x] **T2: Update Universal AGENTS.md** — Gap 1 (constitutional row), Gap 2 (database row + ingest), Gap 3 (analyze row), Gap 4 (shared row)
- [x] **T3: Update FS-Enterprises AGENTS.md** — Gap 1-4 same as T2, plus Gap 5 (research/exploration row fix)
- [x] **T4: Update Barter AGENTS.md** — Gap 1-4 same as T2
- [x] **T5: Verification greps** — Run 6 grep checks, confirm all pass
- [x] **T6: Create spec documentation** — spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md

### Refinement Pass 1 (2026-03-16)

- [x] **T7: Fix G-01/G-02** — FS-Enterprises Resume prior work + Save context rows aligned with Universal/Barter
- [x] **T8: Fix G-03/G-04** — Remove trailing pipe artifacts from Universal + Barter Claim completion rows
- [x] **T9: GPT-5.4 ultra-think cross-AI review** — Validated G-01–G-04, surfaced G-05/G-06
- [x] **T10: Fix G-05/G-06** — FS Documentation row `validate_document.py`; Gate 3 priority ordering in all 4 files

### Refinement Pass 2 (2026-03-16)

- [x] **T11: Add Quick Reference skill rows** — Web code, OpenCode system code, Git workflow rows to Universal
- [x] **T12: Skill section overhaul (Universal)** — Replace Barter `sk-code` with `sk-code--opencode` + system-spec-kit/memory references; replace read-only `sk-git` with full workflow
- [x] **T13: Skill section overhaul (FS)** — Replace Barter `sk-code` with `sk-code--full-stack` + stack verification table; replace read-only `sk-git` with full workflow
- [x] **T14: Create changelog** — `v2.2.0.0.md` in `.opencode/changelog/02--agents-md/`

<!-- /ANCHOR:notation -->
## Summary

| Metric | Value |
|--------|-------|
| Total tasks | 14 |
| Completed | 14 |
| Files modified | 5 |
| Gaps fixed | 6 + skill overhaul |
