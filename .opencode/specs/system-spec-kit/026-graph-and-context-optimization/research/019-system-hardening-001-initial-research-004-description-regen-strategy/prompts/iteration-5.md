# Deep-Research Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E**. Proceed.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 5 of 12
Last 3 ratios: 0.41 -> 0.37 -> 0.24 | Stuck count: 0 | Rolling avg: 0.34
research.md written (300 lines). All 5 questions substantively answered. Iter 5 is polish + final readiness check.

Iteration: 5 of 12
Focus Area: Polish pass on research.md. Targets:

**1. Executive Summary tightness** (200-300 words):
- Scope and approach
- Recommendation (field-level merge unified with 018 R4)
- Rollout order (schema → merge helper → regen/audit → 007-010 remediation separately)
- Handoff target (019/003 or similar implementation child)

**2. Implementation Spec completeness**:
Ensure the spec has:
- Schema changes (exact TS type names + Zod updates)
- Migration path (script name, file count, atomicity guarantees)
- Validation fixtures (test file name + case list)
- File-touch list
- Backward compat section (what happens to the 86 existing files)

**3. Interaction table with sub-packet 001 (SSK-RR-2)**:
Both find the 007/008/009/010 missing-spec issue. Cross-reference 001's recommended remediation with 004's strategy. Confirm there's no conflict.

**4. Minor gaps** (if discovered during polish):
Any small gaps should be captured. If nothing new → newInfoRatio < 0.15 = convergence signal.

Remaining Key Questions:
- Q1-Q5 all answered. Polish remaining.

## STATE FILES

- research.md (edit in place for polish)
- Write iter delta to: iterations/iteration-005.md
- APPEND `"type":"iteration"` to state log
- Write deltas/iter-005.jsonl

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- Use `"type":"iteration"` exactly in state log.

## OUTPUT CONTRACT

1. Polished research.md
2. iterations/iteration-005.md
3. JSONL appended to state log
4. deltas/iter-005.jsonl
