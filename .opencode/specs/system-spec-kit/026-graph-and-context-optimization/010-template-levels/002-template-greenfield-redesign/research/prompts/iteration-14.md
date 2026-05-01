# Deep-Research Iteration Prompt Pack

cli-codex / gpt-5.5 / reasoning=high / service-tier=fast.

## STATE

Segment: 1 | Iteration: **14 of 14 (FINAL SYNTHESIS — workflow-invariant pass)**
Last 13 ratios: 0.78 -> 0.82 -> 0.74 -> 0.67 -> 0.58 -> 0.47 -> 0.41 -> 0.38 -> 0.06 (CONVERGED iter 9) -> 0.64 -> 0.57 -> 0.52 -> 0.46
Status iter 13: `complete-ai-transcript-dry-run`. All 5 user-conversation scenarios PASS workflow-invariance. ADR-005 + revised diffs + leak fixes ready.

Iteration: 14 of 14 — **FINAL SYNTHESIS**

Focus Area: **Write `research.md` ADDENDUM consolidating iters 10-13. Declare convergence. Update recommendation language. Append ADR-005.**

## YOUR TASK

Five sub-tasks:

1. **Append `research.md` Addendum**:
   Path: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md`
   Append a new section `## §18. WORKFLOW-INVARIANCE ADDENDUM (iters 10-13)` to the existing 17-section synthesis. Cover:
   - Why the loop reopened (user constraint 2026-05-01)
   - Recommendation language correction: "levels disappear" → "the on-disk `templates/level_N/` folders disappear; the `--level N` user-facing API stays"
   - The key insight: levels are PUBLIC contract, kind/capabilities/preset are PRIVATE implementation
   - Iter 10 audit findings: Gate 3 classifier unchanged, all AI-facing skill text unchanged, level vocabulary preserved across all surfaces
   - Iter 11 ADR-005 summary + the resolveLevelContract API
   - Iter 12 11-surface audit findings (preserve level vocabulary on every public surface, 2 minor leaks identified)
   - Iter 13 5-scenario dry-run findings (all 5 PASS workflow-invariance)
   - The 2 leak fixes (`[capability]` placeholder text, "Sub-phase manifest" wording) with replacement strings
   - Workflow-invariance CI test design (single test under `scripts/tests/`)

2. **Update `research.md` §1 TL;DR + §2 Recommendation language**:
   - Replace any "levels disappear" / "level system eliminated" wording with workflow-invariant framing
   - Add explicit statement: "AI behavior + user conversation flow stays byte-identical"
   - Add explicit statement: "`--level N` flag stays public; preset/capability/kind names live ONLY in the private manifest"

3. **Append ADR-005 in research.md §X (or reference decision-record.md ADR-005)**:
   - Embed the full ADR-005 text (or summarize + link)
   - Note that ADR-005 narrows ADR-001 without superseding it

4. **Update `resource-map.md`** to add the new artifacts (iteration-010.md through iteration-013.md, prompt files, etc.)

5. **Declare convergence**:
   - newInfoRatio for iter 14 should be ≤ 0.10
   - Status: `converged` if synthesis stays additive (no new design directions)
   - Final recommendation crisp: "C+F hybrid manifest-driven greenfield — levels remain the public/AI-facing contract; on-disk level dirs disappear; manifest-driven internally; 86 → 15 source files; workflow byte-identical to today."

## CARRY-OVER FACTS

From iter 10: workflow-invariant constraint identified; design survives with explicit mitigations
From iter 11: ADR-005 drafted with full ban list (preset/capability/kind/manifest words ONLY in private manifest); resolveLevelContract API spec'd
From iter 12: 11-surface ground-truth audit; level vocabulary preserved on all public surfaces; 2 leak fixes identified
From iter 13: 5 AI-conversation transcripts (routine-impl / arch / phase-parent / validator-failure-remediation / resume) all PASS workflow-invariance
Iter 13 also resolved: workflow-invariance CI test = single test (not two); existing fixtures rewritten immediately (not deferred)

## STATE FILES

- Config / State Log / Strategy / Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/{deep-research-config.json,deep-research-state.jsonl,deep-research-strategy.md,findings-registry.json}`
- Prior iterations: iteration-001.md through iteration-013.md
- **Synthesis target (APPEND, do not rewrite):** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md`
- **Resource map (UPDATE):** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/resource-map.md`
- Write iteration narrative to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-014.md`
- Write per-iteration delta file to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-014.jsonl`

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Read iter-009 research.md FIRST (the existing synthesis) and iter-010 through iter-013 narratives.
- Use full repo-relative paths. NO `.../`.
- Stay within `011-template-greenfield-redesign/research/` for writes.
- Use Edit (not Write) on research.md so existing 17 sections stay intact. APPEND addendum + targeted §1/§2 wording fixes.
- DO NOT introduce new design directions in synthesis. Consolidate, don't redesign.

## OUTPUT CONTRACT

FOUR artifacts:
1. `iteration-014.md` narrative (1-3 KB) with convergence declaration + final recommendation crisp + pointer to research.md addendum
2. State log JSONL append: `{"type":"iteration","iteration":14,"newInfoRatio":<0..1>,"status":"converged","focus":"<string>","graphEvents":[/*optional*/]}`
3. `iter-014.jsonl` delta file
4. **`research.md` UPDATED** — §1/§2 language fixes + new §18 addendum + ADR-005 reference
5. **`resource-map.md` UPDATED** — adds iter-10-through-14 artifacts

## RESEARCH GUIDANCE FOR ITERATION 14

1. **Be additive on research.md**: don't rewrite existing sections, just append §18 + targeted edits to §1/§2 wording.
2. **Final recommendation crisp** at the bottom of iteration-014.md:
   > "C+F hybrid manifest-driven greenfield. Public surface: today's `--level N`, Gate 3 classifier, AI conversation flow — all UNCHANGED. Private surface: 86 → 15 source files; level→preset→capabilities resolver inside scaffolder + validator; level dirs deleted. ADR-001 chooses C+F hybrid. ADR-005 locks in workflow invariance."
3. **Convergence**: newInfoRatio ≤ 0.10 expected (synthesis is additive).
4. **No new design directions**: if iter 14 surfaces a new question, document it in §18 Open Items, don't redesign.

Emit findings as `{"type":"finding","id":"f-iter014-NNN",...}`. Keep iter-014.jsonl small.
