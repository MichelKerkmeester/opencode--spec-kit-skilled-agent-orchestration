# Deep-Research Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Writes confined to `026/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/`.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 9 of 15
Last 3 ratios: 0.43 -> 0.24 -> 0.16 | Stuck count: 0 | Rolling avg last 3: 0.277
Iter 8 drafted research.md (186 lines, 8 sections). Iter 9 is a final polish pass before synthesis.

Iteration: 9 of 15
Focus Area: Polish research.md to near-final quality. Three polish targets:

**1. Validator assertion table completeness**:
Verify the §Proposed Validator Assertions section has all 5 (or 6+) rules with consistent columns: rule name (UPPER_SNAKE), trigger expression (pseudocode), severity (ERROR/WARNING), grandfathering logic (cutoff date or packet marker), migration path (1-sentence action). Make sure no rule overlaps existing rules (`CONTINUITY_FRESHNESS`, `POST_SAVE_FINGERPRINT`, `SPEC_DOC_INTEGRITY`, `GRAPH_METADATA_PRESENT`) — note the non-overlap explicitly.

**2. Remediation plan scope clarity**:
§Remediation Plan should clearly scope a sibling implementation child (`019/002-*`). Include:
- Name proposal (e.g., `002-canonical-save-hardening`)
- Wave structure (Wave A: save_lineage dist fix; Wave B: packet-root remediation 007/008/009/010; Wave C: validator rollout with grandfathering)
- Dependencies (does Wave A need Wave B first? etc.)
- Estimated effort per wave (in days)
- Success criteria (validator assertions pass; save_lineage persists on fresh saves)

**3. Executive Summary tightness**:
Rewrite §Executive Summary to be 250-350 words with:
- One paragraph on the research scope (what was asked, what was found)
- One paragraph on the 2 P0s (concrete defects + fix direction)
- One paragraph on the validator proposals (what they catch + migration path)
- One paragraph on the recommended handoff (implementation child + waves + estimated effort)

**4. Minor gap-fill if surfaced**:
Any small gaps found during polish that genuinely add information (not just restatement) count as newInfoRatio contribution. If nothing new surfaces, ratio should be low (< 0.10) — that's convergence confirmation.

Remaining Key Questions:
- Q1-Q5 all answered. Polish is the active work.
- After iter 9, if ratio is low (<0.10), ready for workflow synthesis + save phases.

Last 3 Iterations Summary: iter 6 cross-validation (0.43), iter 7 finalize (0.24), iter 8 synthesis draft (0.16)

## STATE FILES

- research.md (written in iter 8, 186 lines) — EDIT to polish
- Prior iterations: iteration-001.md through iteration-008.md
- Write iter 9 delta to: `.../iterations/iteration-009.md`

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- research.md polish is editing, not rewriting. Preserve structure.
- If you genuinely find NO new info worth adding, record newInfoRatio as low (< 0.10) — that confirms convergence.
- IMPORTANT: After writing iteration-009.md, also APPEND the JSONL delta to the state log using the Write tool's ability to append (or Edit on the file to add the line). Iter 8 printed the JSONL but didn't append — don't repeat that mistake.

## OUTPUT CONTRACT

1. Polished `research.md` (edit in place, preserve section structure)
2. `.../iterations/iteration-009.md` with Focus, Polish Summary, Any Gaps Found, Synthesis Readiness, Next Focus
3. JSONL delta APPENDED to `.../deep-research-state.jsonl`:
```json
{"type":"iteration","iteration":9,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[...]}
```
Use Bash: `echo '<json>' >> <path-to-state.jsonl>` or equivalent to append.
