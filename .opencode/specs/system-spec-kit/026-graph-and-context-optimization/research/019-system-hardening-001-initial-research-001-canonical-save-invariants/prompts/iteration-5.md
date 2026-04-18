# Deep-Research Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Writes confined to `026/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/`.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 5 of 15
Last 2 ratios: 0.62 -> 0.73 | Stuck count: 0
Cumulative findings: Q1 catalogue + Q2 invariants + Q3 H-56-1 verification + Q4 P0 scope (4 packets missing spec.md) + save_lineage writeback bug (P0) + 5 validator assertions drafted.

Iteration: 5 of 15
Focus Area: Three targeted sub-questions from iter 4's "Next Focus":

**Part A — save_lineage writeback root cause**:
Inspect the BUILT/RUNTIME module surface (not just source) used by `codex exec`. Iter 4 found workflow.ts source passes `saveLineage: 'same_pass'` but persisted files show `null`. The gap must be in the built/dist layer or an API wrapper that strips the field. Specifically:
- Read `.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js` (built) around the save_lineage pass-through.
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` and any `.js` built variant for the writeback path.
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` for the Zod schema — does save_lineage have a `.optional().nullable().default(null)` that silently drops non-null values?
- Test: does the schema allow `'same_pass'` as a value, or does validation coerce it to null?

**Part B — 008 and 009 disposition**:
Packets 008-cleanup-and-audit and 009-playbook-and-remediation have description.json + graph-metadata.json but no spec.md. They may be:
- Archived (should be in z_archive/)
- In-progress with spec.md deleted accidentally
- Root-level coordination packets that legitimately don't need spec.md (like 007, 010)
- Early-stage packets that never got spec.md
Read the parent 026/spec.md phase map for each, check git log for spec.md history (`git log -- 008-cleanup-and-audit/spec.md`), decide remediation category. Are they in the same P0 bucket as 007/010 or do they need different treatment?

**Part C — Validator implementation points with grandfathering**:
Convert iter 4's 5 validator assertions to concrete implementation:
1. For each assertion: precise rule name (fits the validator rule convention), file path in `scripts/spec/rules/`, trigger expression (JS/TS pseudocode), severity enum value, migration strategy for EXISTING packet-local drift.
2. Grandfathering cutoff logic: timestamps older than when? file-age marker? Packet-level opt-out?
3. Backward compatibility: would these assertions break the 96 existing packets? How many would fail?

Remaining Key Questions:
- Q1-Q4 largely answered. Q5 (validator proposals) is the active finalization focus.

Last 3 Iterations Summary: iter 2 Q2+Q3 (0.57), iter 3 Q4 P0 (0.62), iter 4 P0 scope + writeback bug + validator draft (0.73)

## STATE FILES

Same as prior iterations. Write to `iterations/iteration-005.md`.

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- Part A findings MUST cite built-layer file:line. If schema is the culprit, quote the Zod definition.
- Part B decisions MUST be per-packet (007, 008, 009, 010) with evidence.
- Part C validator names: follow the convention `CANONICAL_SAVE_*` or similar uppercase-snake to match `CONTINUITY_FRESHNESS` / `POST_SAVE_FINGERPRINT` style.

## OUTPUT CONTRACT

1. `.../iterations/iteration-005.md` with Focus, Actions, save_lineage Root Cause, 008/009 Disposition, Validator Implementation Points, Next Focus.
2. JSONL delta:
```json
{"type":"iteration","iteration":5,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[...]}
```
