# Deep-Research Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Writes confined to `026/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/`.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 7 of 15
Last 3 ratios: 0.62 -> 0.73 -> 0.71 -> 0.43 | Stuck count: 0 | Rolling avg last 3: 0.623 (approaching convergence signal)
Findings state: All Q1-Q5 questions have substantive answers. 2 P0s confirmed. 5 validator assertions drafted. Cross-validation complete (no new anomalies).

Iteration: 7 of 15
Focus Area: Tighten loose ends toward synthesis. Three targeted tasks:

**1. Final metadata field writeback audit**:
- Iter 6 flagged other metadata fields to check for writeback gaps. Complete that audit: `description.json` fields (memorySequence progression, memoryNameHistory 20-item cap, keywords stability), `graph-metadata.json.derived.*` fields (trigger_phrases, key_topics, importance_tier, status, entities, causal_summary) — verify each either (a) always-written, (b) sometimes-null legitimately, or (c) writeback gap candidate.
- Confirm whether the workflow passes the relevant options for each field path.

**2. Validator assertion finalization**:
- The 5 drafted validator assertions should now have clean names, rule-file placement, trigger expressions, and grandfathering logic. Finalize them into a form that could be directly added to `scripts/spec/rules/`.
- Include their interaction with existing rules (`CONTINUITY_FRESHNESS`, `POST_SAVE_FINGERPRINT`, `SPEC_DOC_INTEGRITY`) — avoid duplication.

**3. P0 #1 remediation scope**:
- For packets 007, 008, 009, 010 — what's the recommended fix? Options: (a) create stub spec.md, (b) archive to z_archive/, (c) mark packet as coordination-only with a minimal README. Recommend one per packet based on their actual role in the 026 tree.

Remaining Key Questions:
- Q1-Q5 all have substantive answers. Iter 7 tightens the residual details.
- Iter 8 candidate focus: synthesis draft start.
- Iter 9-10 candidate: final synthesis passes + convergence.

Last 3 Iterations Summary: iter 4 P0 scope + validator draft (0.73), iter 5 dist/runtime root cause (0.71), iter 6 cross-validation (0.43)

## STATE FILES

Same as prior iterations. Write to `iterations/iteration-007.md`.

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- If nothing genuinely new surfaces in this iteration, newInfoRatio should drop further (< 0.30). That's a strong convergence signal, not a failure.

## OUTPUT CONTRACT

1. `.../iterations/iteration-007.md` with Focus, Actions, Metadata Field Audit Results, Finalized Validator Assertions, P0 #1 Remediation Recommendations, Synthesis Readiness, Next Focus.
2. JSONL delta:
```json
{"type":"iteration","iteration":7,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[...]}
```
