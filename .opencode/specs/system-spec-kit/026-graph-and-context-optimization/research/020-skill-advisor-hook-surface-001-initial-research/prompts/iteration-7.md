# Deep-Research Iteration 7 — 020 Skill-Advisor Hook Surface

**Gate 3 pre-answered**: Option **E**. Autonomous run, no gates.

## STATE

Iteration: 7 of 10.

Focus Area (iter 7): **Implementation cluster decomposition (Q9) + shared-payload extension check (Q10).**

Part A — Cluster decomposition:
- Parent 020 spec proposes 7 children: 002-advisor-brief-producer, 003-claude-hook-wiring, 004-gemini-hook-wiring, 005-copilot-hook-wiring, 006-codex-integration, 007-freshness-signal, 008-documentation
- Based on findings in iter 1-6, refine: merge, split, reorder, add, remove children
- Critical path + dependencies between children
- Effort estimate per child (hours, days)
- Ordering — what ships first and unblocks others?

Part B — Shared-payload extension (Q10):
- Does phase 018 R4 shared-payload envelope need a new section kind for skill-advisor?
- `kind: 'skill-advisor'` vs reusing `kind: 'startup'` with a new section
- What new fields the envelope must carry that aren't already there

## STATE FILES

Standard. REQUIRED canonical JSONL + delta file.

## OUTPUT CONTRACT

1. `iterations/iteration-007.md`: final cluster decomposition with ordering + effort + dependencies; shared-payload extension decision.
2. Canonical JSONL.
3. `deltas/iter-007.jsonl`.
