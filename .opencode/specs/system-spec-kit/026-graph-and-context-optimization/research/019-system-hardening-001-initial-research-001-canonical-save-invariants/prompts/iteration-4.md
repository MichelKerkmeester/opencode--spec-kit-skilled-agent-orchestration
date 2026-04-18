# Deep-Research Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Writes confined to `026/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/`. Proceed without asking.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 4 of 15
Last 2 ratios: 0.57 -> 0.62 | Stuck count: 0
**P0 surfaced in iter 3**: packets 007 + 010 have metadata files without spec.md (real state divergence); save_lineage=null universal violation across 8 sampled packets including freshest (019).

Research Topic: Canonical-save pipeline invariant research. Iter 1 drafted Q1 field catalogue; iter 2 derived Q2 invariants + verified Q3 H-56-1 scope; iter 3 surfaced P0 real divergence (packets 007+010 + save_lineage universally violated).

Iteration: 4 of 15
Focus Area: Two-part focus:

**Part A — P0 depth (quantify scope)**:
1. Scan all 26 active 026-tree packets (use `find` or `ls` across the full `026-graph-and-context-optimization/` tree) to identify every packet that has `description.json` AND/OR `graph-metadata.json` WITHOUT a matching `spec.md`. Build the full list (likely more than just 007 + 010).
2. For save_lineage=null: check if ANY packet has save_lineage set (non-null). Grep `graph-metadata.json` files for `"save_lineage":` to quantify. Is the field ever written, or is it a dead code path?
3. Read `scripts/core/workflow.ts` around `:1434-1450` (where iter 1 found `saveLineage: 'same_pass'` is passed) to confirm whether the writeback path actually persists the field. Also check `mcp_server/lib/graph/graph-metadata-parser.ts` or `graph-metadata-schema.ts` for save_lineage handling.

**Part B — Q5 validator proposals (start drafting)**:
Draft 3-5 validator assertions that would catch:
- Missing spec.md when description.json + graph-metadata.json exist (the 007/010 pattern)
- save_lineage=null when last_save_at is recent (the universal violation)
- description.specFolder ≠ continuity packet_pointer (the 013 drift pattern)
- description.lastUpdated significantly newer than graph.last_save_at (the 012 asymmetry pattern)
- Each assertion: name, trigger condition, severity, proposed migration path for existing packet-local drift.

Remaining Key Questions:
- Q1 ✓ (iter 1) — field catalogue drafted
- Q2 ✓ (iter 2) — invariants derived (at least 5)
- Q3 ✓ (iter 2) — H-56-1 scope verified
- Q4 (in progress): broader divergence classification + quantify P0 scope
- Q5 (new focus): validator assertions + migration path

Last 3 Iterations Summary: iter 1 Q1 catalogue (0.68), iter 2 Q2+Q3 (0.57), iter 3 Q4 P0 surfaced (0.62)

## STATE FILES

- Config/State/Strategy/Registry: same folder as prior iterations (see iter 3 prompt)
- Prior iterations to read: iteration-001.md, iteration-002.md, iteration-003.md
- Write findings to: `026/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/iterations/iteration-004.md`

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- For P0 scope quantification: count TOTAL active packets with missing spec.md across the whole 026 tree (not just root children).
- For save_lineage: confirm whether workflow.ts writes the field or if it's a dead code path. This flips classification from "universal violation" to either "writeback bug" (P0) or "spec-documentation mismatch" (P1).
- For validator draft: each assertion MUST include: rule name, trigger, severity, migration path.
- graphEvents array: include PROPOSAL nodes for each validator assertion + REFINES edges from findings to proposals.

## OUTPUT CONTRACT

1. `.../iterations/iteration-004.md` with Focus, Actions, P0 Scope Quantified, Validator Draft, Questions Answered, Next Focus.
2. JSONL delta:
```json
{"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[...]}
```
