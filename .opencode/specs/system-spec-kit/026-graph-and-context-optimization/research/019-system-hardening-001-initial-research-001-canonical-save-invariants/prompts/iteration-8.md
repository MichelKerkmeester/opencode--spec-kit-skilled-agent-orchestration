# Deep-Research Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Writes confined to `026/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/`.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 8 of 15
Last 3 ratios: 0.71 -> 0.43 -> 0.24 | Stuck count: 0 | Rolling avg last 3: 0.46
**Convergence approaching.** Q1-Q5 all substantively answered. Research has produced: Q1 field catalogue, Q2 cross-layer invariants, Q3 H-56-1 verification, Q4 divergence classification (+ 2 P0s), Q5 validator assertions (finalized rollout-ready).

Iteration: 8 of 15
Focus Area: Synthesis draft. Compile all findings from iterations 1-7 into a near-final `research.md` structure. This is a consolidation iteration, not a new-discovery iteration — newInfoRatio should be low (~0.10-0.20).

**Write research.md as a draft** at `026/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/research.md` with these sections:

1. **Executive Summary** (200-300 words): topic, approach, 2 P0 findings, validator proposals summary, recommended next steps for implementation child.

2. **Invariant Catalogue** (Q2 output): 5+ cross-layer invariants with source-code citations.

3. **Observed Divergences** (Q4 output): table of packet samples × invariant hold/violate with expected/benign/latent/real classification.

4. **P0 Findings** (2 critical defects):
   - P0 #1: Four packets (007/008/009/010) missing spec.md despite having description.json + graph-metadata.json. Reproduction + severity + proposed remediation.
   - P0 #2: save_lineage writeback bug (dist/source mismatch). Reproduction + proposed fix.

5. **H-56-1 Scope Verification** (Q3 output): what H-56-1 addressed, what gaps remain (including the save_lineage bug it didn't close).

6. **Proposed Validator Assertions** (Q5 output): 5 concrete rules with name, trigger expression, severity, grandfathering logic, migration path.

7. **Remediation Plan**: scope hand-off to sibling implementation child (`019/002-canonical-save-hardening` or similar). Dependencies and wave structure.

8. **Open Questions / Out of Scope**: any residual questions too broad for this research's budget; mark out-of-scope items that surfaced.

**Also**: Append a small "Iteration 8 delta" section to `iterations/iteration-008.md` summarizing what was consolidated and any tiny gaps discovered during synthesis (which would still count as newInfoRatio contribution).

Remaining Key Questions:
- Q1-Q5 all substantively answered. Iter 8 consolidates. Iter 9-10 (if used) would polish.

Last 3 Iterations Summary: iter 5 dist/runtime root cause (0.71), iter 6 cross-validation (0.43), iter 7 audit finalized (0.24)

## STATE FILES

- Prior iterations: iteration-001.md through iteration-007.md (READ ALL for synthesis)
- Strategy: `026/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/deep-research-strategy.md`
- Registry: `026/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/findings-registry.json`
- Write synthesis draft to: `026/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/research.md`
- Write iter 8 delta to: `026/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/iterations/iteration-008.md`

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- research.md is workflow-owned (editable on re-run). This is a DRAFT — later iterations or the synthesis phase can refine.
- iteration-008.md is write-once.
- If truly no new info surfaces during synthesis, newInfoRatio should be low (<0.20). If synthesis reveals a gap, capture it.

## OUTPUT CONTRACT

1. `.../research.md` (new, synthesis draft) with 8 sections above.
2. `.../iterations/iteration-008.md` (iteration narrative with Focus, Actions, Synthesis Summary, Gaps Discovered, Next Focus).
3. JSONL delta:
```json
{"type":"iteration","iteration":8,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[...]}
```
