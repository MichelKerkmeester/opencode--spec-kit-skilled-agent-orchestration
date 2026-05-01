# Deep-Research Iteration Prompt Pack

Per-iteration context for the deep-research LEAF agent (cli-codex executor: `gpt-5.5` / reasoning=high / service-tier=fast).

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 9 of 10
Last 8 ratios: 0.82 -> 0.76 -> 0.68 -> 0.61 -> 0.52 -> 0.44 -> 0.36 -> 0.28 | Stuck count: 0
Recommendation: **PARTIAL** (stable across iter 3-8)
Synthesis outline + risk register + LOC deltas READY. Only gaps: README policy wording + per-level vs Phase-4 deletion-budget distinction.

Research Topic: Template system consolidation. Output recommendation (CONSOLIDATE / PARTIAL / STATUS QUO) with refactor steps, risk mitigations, file/LOC deltas, generator design choice, backward-compat path.

Iteration: 9 of 10

Focus Area: **Close synthesis gaps + write the canonical research.md draft.** Three sub-tasks:

1. **Close gap A — README policy**: decide what happens to `templates/level_1/README.md`, `level_2/README.md`, `level_3/README.md`, `level_3+/README.md` (the helper docs that explain each level — these leaked into my packet during scaffold and I deleted them; they're inside the template tree, not spec folders). Options: (a) keep as orphan helper docs, (b) consolidate into `templates/README.md` master doc with per-level subsections, (c) delete entirely (info already in CLAUDE.md). Pick one with rationale.

2. **Close gap B — per-level vs Phase-4 deletion-budget distinction**: in iter 8 finding f-iter008-004, the deletion budget was approximate ("about 60 .md files, ~7K LOC"). Run actual `find .opencode/skill/system-spec-kit/templates/level_1 .opencode/skill/system-spec-kit/templates/level_2 .opencode/skill/system-spec-kit/templates/level_3 .opencode/skill/system-spec-kit/templates/level_3+ -type f -name '*.md' | wc -l` and `wc -l` on those files to get the EXACT deletion budget. Replace approximate numbers with measured ones.

3. **Write the canonical research.md draft** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/research.md`. Use the 17-section outline from iter 8. Populate every section with iter-001 through iter-008 findings. This is the headline deliverable; iter 10 will polish.

This iteration may produce a high-volume narrative; that is expected.

Remaining Key Questions: ALL 10 answered. Synthesis-only work.

Last 3 Iterations Summary:
- Iter 6 (0.44): 868 markers, Phase 1 punch list ready
- Iter 7 (0.36): resolver API contract + perf budget closed
- Iter 8 (0.28, status: synthesis-outline-ready): 17-section synthesis outline; ranked risk register; file/LOC deltas with 2 scenarios (Phase 4 deferred: 83→84 files / ~13K→13.3K LOC; Phase 4 ships: 83→~24 files / ~13K→~6K LOC); only gaps are README policy + measured deletion budget.

## STATE FILES

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/findings-registry.json
- Prior iterations: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-001.md through iteration-008.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-009.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deltas/iter-009.jsonl
- **Write canonical synthesis to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/research.md** (this is THE headline deliverable)

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Read iteration-008.md FIRST for the 17-section outline + ranked risk register + LOC deltas.
- DO NOT use `.../` ellipsis paths. Always full repo-relative paths.
- Stay within `010-template-levels/001-template-consolidation-investigation/research/` for writes; templates folder reads only.

## OUTPUT CONTRACT

FOUR artifacts this iteration (extra: research.md):
1. `iteration-009.md` narrative (Focus / Actions Taken / Findings / Questions Answered / Questions Remaining / Next Focus)
2. State log JSONL append: `{"type":"iteration","iteration":9,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/*optional*/]}`
3. `iter-009.jsonl` delta file
4. **`research.md` canonical synthesis** populated from the 17-section outline; every section filled with iter-1-through-iter-8 evidence

## RESEARCH GUIDANCE FOR ITERATION 9

1. **README policy decision**: 1-paragraph rationale + chosen option (a/b/c).
2. **Measured deletion budget**: run `find` + `wc -l` and capture EXACT numbers. Update Phase-4 file/LOC deltas to match.
3. **research.md draft**: write all 17 sections. TL;DR first (3-5 bullets). Recommendation (PARTIAL with reasoning). Background (cite spec.md). Methodology (8 iterations, externalized state). Findings per Q1-Q10. Generator design (compose.sh + thin resolver, justified). 4-Phase plan (with mechanical punch list ref). Backward-compat (tolerant pattern matching, 868 folders). Risk register (8-12 row table). Performance budget (430ms compose + low resolver overhead). Validator migration (template-structure.js first). Consumer migration map (PATH/CONTENT/DELETION-safe classes). Test suite design (golden parity + behavioral). File/LOC deltas (2 scenarios). Open Items (any). Appendix A (graph from iter 1-7 nodes/edges). Appendix B (commands run).

Emit findings as `{"type":"finding","id":"f-iter009-NNN",...}` records.
