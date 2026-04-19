# Deep-Research Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E**. Proceed.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 4 of 12
Last 3 ratios: 0.76 -> 0.41 -> 0.37 | Stuck count: 0 | Rolling avg: 0.51
Iter 1-3 completed. Recommended strategy: field-level merge policy unified with 018 R4. 007/008/009/010 missing-spec is separate defect.

Iteration: 4 of 12
Focus Area: Converge on final implementation. Two tasks:

**1. Resolve the 2 remaining implementation-policy choices from iter 3 next-focus**:
- Unknown extension keys: top-level passthrough permanently, OR migrate into named authored metadata bag later? Decide with tradeoff analysis.
- Smallest testable rollout sequence: (a) shared schema first, (b) unified merge helper second, (c) targeted regen/audit pass third, (d) 007/008/009/010 root-doc remediation tracked separately. Verify this order.

**2. Synthesis draft**:
Write a 200-300 line `research.md` synthesis draft at `.../research.md` with sections:
- Executive Summary (250 words)
- Field Catalogue (derived vs authored)
- Rich File Audit (29 files patterns)
- Strategy Comparison Matrix (4 options)
- Recommended Strategy (with rationale)
- 018 R4 Integration Plan
- Implementation Spec (schema, migration, fixtures, file list)
- Open Questions / Out of Scope

**IMPORTANT CONTRACT FIX**: Iter 3 wrote `"type":"iteration_delta"` to the delta file but did NOT append `"type":"iteration"` to the state log. For iter 4, MUST:
1. Append `{"type":"iteration","iteration":4,"newInfoRatio":X,"status":Y,"focus":Z,"graphEvents":[...]}` to `.../deep-research-state.jsonl` (use `echo '...' >> ...jsonl`)
2. Write `deltas/iter-004.jsonl` with structured delta records (iteration, finding, ruled_out, etc.)

## STATE FILES

- Prior: iter 1-3 (READ especially iter-003.md for Q4 R4 integration analysis)
- Write findings to: iterations/iteration-004.md
- Write synthesis to: research.md (NEW, canonical synthesis)
- Write per-iter delta: deltas/iter-004.jsonl
- APPEND to: deep-research-state.jsonl (canonical `"type":"iteration"` record)

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.

## OUTPUT CONTRACT

1. iterations/iteration-004.md
2. research.md (synthesis draft)
3. JSONL delta APPENDED to state log (canonical type)
4. deltas/iter-004.jsonl
