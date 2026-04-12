---
title: "README: Phase 6 — Memory Duplication Reduction"
description: "Quick orientation for the Phase 6 packet that investigates and reduces duplication across current recent memory stores."
trigger_phrases:
  - "phase 6 readme"
  - "memory duplication reduction"
  - "recent memory dedupe phase"
importance_tier: normal
contextType: "general"
---
# README: Phase 6 — Memory Duplication Reduction

Phase 6 is the first follow-on packet after the original five-phase remediation train. It assumes the current memory-save pipeline is stable enough to measure residual duplication across recent memory stores, then reduce that duplication without reopening the Phase 1-5 defect fixes.

## What Lives Here

- `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` define the approved Phase 6 scope and delivery rules.
- `research/iterations/` is reserved for the five parallel deep-research iteration outputs.
- `scratch/` is the working area for corpus inventories, diff notes, and synthesis artifacts.
- `memory/` is reserved for saved phase-local findings and handoff context.

## Research Focus

- Trigger phrase duplication across generated continuity artifacts.
- Observations and decisions duplication across files.
- `key_topics` and `FILES` table duplication.
- `OVERVIEW` and `SUMMARY` boilerplate duplication.
- Structural duplication between anchors, frontmatter, metadata blocks, and index entries.

## Validation Surface

- Inventory the target stores before running iteration work.
- Validate this phase folder with `validate.sh --strict`.
- Re-run the parent packet validator after Phase 6 docs are synchronized.

## Related Docs

- `./spec.md`
- `./plan.md`
- `./tasks.md`
- `./checklist.md`
- `../spec.md`
- `../research/research.md`
