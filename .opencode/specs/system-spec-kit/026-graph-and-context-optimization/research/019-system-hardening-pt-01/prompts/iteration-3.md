# Deep-Research Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Proceed.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 3 of 12
Last 2 ratios: 0.76 -> 0.41 | Stuck count: 0
Iter 1: field catalogue + regen logic mapped. Iter 2: rich file audit + strategy comparison matrix. Read both iteration files.

Iteration: 3 of 12
Focus Area: Q4 (018 R4 interaction) + Q5 (concrete implementation). Three sub-tasks:

**1. Q4 — 018 R4 interaction**:
Read `description-repair-helper.ts` (or equivalent) from phase 018 R4. How does merge-preserving repair for schema-invalid files interact with the recommended preservation strategy from iter 2? Does it duplicate work? Conflict on field policy? Unify into one merge mechanism?

**2. Q5 — Concrete implementation spec**:
For the recommended strategy (from iter 2's comparison matrix), produce implementation spec:
- Schema changes (TS types + Zod updates)
- Migration path for 86 existing files (automated vs manual)
- Validation fixtures that prevent regression (test case list)
- File-touch list (generate-description.ts, description-repair-helper.ts, schema, new modules)

**3. Q5 — Migration compatibility**:
Ensure the 4 "real" problematic packets identified in sub-packet 001 (007/008/009/010 missing spec.md) don't break under the new strategy. Edge case: packets with description.json but no spec.md — does regen still work? Is there a degenerate flow?

Remaining Key Questions:
- Q1-Q3: substantive answers
- Q4 (active): 018 R4 interaction
- Q5 (active): concrete implementation

## STATE FILES

- Prior: iterations/iteration-001.md, iteration-002.md (read first)
- Write findings to: iterations/iteration-003.md
- ALSO write `deltas/iter-003.jsonl`

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- APPEND JSONL delta.
- Write `deltas/iter-003.jsonl`.

## OUTPUT CONTRACT

1. iterations/iteration-003.md with Focus, Actions, 018 R4 Integration, Implementation Spec, Migration Compatibility, Next Focus.
2. JSONL delta APPENDED.
3. deltas/iter-003.jsonl.
