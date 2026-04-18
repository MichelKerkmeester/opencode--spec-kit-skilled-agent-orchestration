# Deep-Research Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Writes confined to `026/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/`.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 6 of 15
Last 2 ratios: 0.73 -> 0.71 | Stuck count: 0
Cumulative findings: Q1 catalogue; Q2 invariants (5); Q3 H-56-1 verification; **P0 #1 (4 packets missing spec.md: 007/008/009/010)**; **P0 #2 save_lineage writeback bug (dist/source mismatch: built workflow.js calls refreshGraphMetadata without options)**; 5 validator assertions drafted with grandfathering rollout plan.

Iteration: 6 of 15
Focus Area: Cross-validation + synthesis prep. Five sub-tasks:

**1. Cross-validate P0 #1 dispatched against other similar patterns**:
- Are there packets with spec.md but no description.json or graph-metadata.json (inverse problem)?
- Are there nested packets (inside `research/` or `review/`) with similar missing canonical docs?
- Use `find` across the full 026 tree to surface any other structural anomalies.

**2. Validate P0 #2 fix would actually work**:
- Read the `refreshGraphMetadata` function signature in built dist and source — is the `options` param well-defined? Would passing `{saveLineage: 'same_pass'}` from workflow.js actually persist the field?
- Check if there's an existing test for refreshGraphMetadata that could add a regression: `.opencode/skill/system-spec-kit/mcp_server/tests/` or similar.

**3. Identify any missed Q2 invariants**:
- Now that P0 #1 and P0 #2 surfaced, are there additional invariants that would have caught them earlier? E.g., "spec.md must exist when description.json is non-empty" or "graph-metadata.derived.save_lineage must be non-null when last_save_at is set and workflow is not in plan-only mode".
- Add to the invariant catalogue.

**4. Check other metadata fields for similar writeback gaps**:
- If `save_lineage` is dropped, are OTHER optional fields also dropped? Test `description.json.keywords`, `description.json.memoryNameHistory`, `graph-metadata.derived.importance_tier`, `graph-metadata.derived.key_topics` to see if they're always-written or sometimes-null across sampled packets.

**5. Research.md synthesis preparation**:
- The research.md will be written in phase_synthesis. Iter 6 can pre-stage the structure by outlining sections:
  - Invariant Catalogue (Q2 output from iter 2 + any new from iter 6)
  - Observed Divergences (Q4 table from iter 3+4, expanded)
  - P0 Findings (2 critical defects with reproduction + fix direction)
  - H-56-1 Verification (Q3 output)
  - Proposed Validator Assertions (5 concrete rules with grandfathering from iter 4+5)
  - Migration Notes (from iter 4+5)
- Draft the Proposed Validator Assertions section to near-final form.

Remaining Key Questions:
- Q1-Q3 ✓
- Q4 (largely answered, extend if new anomalies found in task #1)
- Q5 (iter 4+5 drafted, iter 6 to finalize + cross-validate)

Last 3 Iterations Summary: iter 3 P0 surfaced (0.62), iter 4 P0 scope + validator draft (0.73), iter 5 dist/runtime root cause + rollout (0.71)

## STATE FILES

Same as prior iterations. Write to `iterations/iteration-006.md`.

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- Cross-validation should find EITHER confirmation OR new anomalies. Both are valid outputs.
- If no new anomalies surface, this iteration's newInfoRatio may drop (signal of approaching convergence).

## OUTPUT CONTRACT

1. `.../iterations/iteration-006.md` with Focus, Actions, Cross-Validation Results, New Invariants (if any), Synthesis Outline, Near-Final Validator Set, Next Focus.
2. JSONL delta:
```json
{"type":"iteration","iteration":6,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[...]}
```
