---
title: "Review Iteration 010: README and install guides"
description: "Phase 7 drift audit of README and root guidance against the post-Phase-6 memory-save baseline"
trigger_phrases:
  - "phase 7 review iteration 010"
  - "readme drift"
  - "generate-context readme audit"
importance_tier: important
contextType: "research"
---

# Review Iteration 010: README and install guides

## Surface Audited
- `.opencode/skill/system-spec-kit/README.md`
- `AGENTS.md`
- `CLAUDE.md`
- `.claude/CLAUDE.md`

## Findings

### P1 — should update; defer only with rationale
- **F010.1** — README memory-scripts table still labels `generate-context.ts` as the primary save workflow
  - **Location**: `.opencode/skill/system-spec-kit/README.md:548-562`
  - **Stale content**: ``| `generate-context.ts` | Primary workflow for saving session context to memory files |``
  - **Why stale**: The sentence immediately below already states that the runtime entry point is `scripts/dist/memory/generate-context.js`, so the table now contradicts the README’s own current-reality explanation.
  - **Required update**: Rename the table entry to the runtime `.js` path or explicitly distinguish the source file from the executable entrypoint.

## Negative Cases (confirmed still accurate)
- `AGENTS.md:70-71` already defines `generate-context.js` plus structured JSON as the canonical save path.
- `CLAUDE.md:35-36` mirrors the same canonical `generate-context.js --json` save workflow correctly.

## Confidence
**0.96** — Audited the highest-signal root guidance files. The root guardrail docs are current; the only drift in this surface is the README’s contradictory memory-scripts inventory row.

## Cross-Surface Notes
- This README finding is the same `generate-context.ts` inventory fossil already seen in the SKILL and references surfaces.
