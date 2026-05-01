# Deep-Research Iteration Prompt Pack

Per-iteration context for the deep-research LEAF agent (cli-codex executor: `gpt-5.5` / reasoning=high / service-tier=fast).

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 6 of 10
Last 5 ratios: 0.82 -> 0.76 -> 0.68 -> 0.61 -> 0.52 | Stuck count: 0
Recommendation: **PARTIAL** (stable across iter 3, 4, 5)
4-phase plan crystallized: Phase 1 (byte parity tests + composer repair) → Phase 2 (resolver API) → Phase 3 (consumer migration) → Phase 4 (optional level_N deletion, gated)

Research Topic: Template system consolidation. Output recommendation (CONSOLIDATE / PARTIAL / STATUS QUO) with refactor steps, risk mitigations, file/LOC deltas, generator design choice, backward-compat path.

Iteration: 6 of 10

Focus Area: **Phase 1 implementation pre-flight + ~800-folder marker validation.** Two sub-tasks:

1. **Phase 1 implementability check** — for each of the byte-equivalence drift categories identified iter 3-4, write the EXACT change needed to either source files (`core/`, `addendum/`) or the composer (`compose.sh`, `wrap-all-templates.ts`). For each repair, estimate diff size (lines added/removed) and risk class (cosmetic vs semantic). Output a Phase 1 "ready-to-implement" punch list that a follow-on packet can execute mechanically.

2. **Validate the "~800 spec folders with SPECKIT_TEMPLATE_SOURCE markers" claim**: run `grep -rln "SPECKIT_TEMPLATE_SOURCE" .opencode/specs/ | wc -l` and `grep -rln "template_source:" .opencode/specs/ | wc -l`. Get the actual count. Then sample 3-5 random spec folders from different parents (00--barter, system-spec-kit, skilled-agent-orchestration) and document marker variance: spacing, addendum ordering, version suffix. This determines whether the backward-compat strategy needs a migration script or can rely on tolerant pattern matching.

Begin closing Q5 (backward-compat strategy with concrete numbers) and finalizing Q10 (refactor plan with implementable Phase 1 punch list).

Remaining Key Questions:
- Q1. Eliminate level_N? (ANSWERED: not in this packet, deferred to Phase 4)
- Q2. Minimum source-of-truth set (NEARLY ANSWERED iter 4: core/+addendum/+compose.sh+resolver+README policy)
- Q3. Generator implementation (ANSWERED iter 4: extend compose.sh + thin resolver wrapper, NOT TS rewrite or JSON-driven)
- Q4. Validator migration (ANSWERED iter 5: target `scripts/utils/template-structure.js` first, then `check-files.sh`)
- Q5. Backward compat for ~800 spec folders **PRIMARY THIS ITER** — actual count + marker variance survey
- Q6. Hash determinism (ANSWERED iter 3: needs byte-equivalence repair via Phase 1)
- Q7. Performance budget (PARTIALLY: 0.07-0.15s per level raw recompose; resolver overhead TBD)
- Q8. Risk surface (ANSWERED iter 5: PATH callers / CONTENT callers / deletion-safe / CI false positives / rollback order)
- Q9. Recommendation: PARTIAL (stable, defended)
- Q10. Refactor plan with Phase 1 ready-to-implement punch list **PRIMARY THIS ITER**

Last 3 Iterations Summary:
- Iter 3 (0.68): determinism experiment — recompose 433ms, deterministic-against-self but NOT byte-equiv to checked-in level_N
- Iter 4 (0.61): byte-equivalence repair plan + resolver API design + 4-phase ordering
- Iter 5 (0.52, status: partial-consumer-map): consumer migration map + golden parity test design. Confirmed PARTIAL recommendation. Validator migration targets `template-structure.js` first. Risk classes finalized.

## STATE FILES

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/findings-registry.json
- Prior iterations: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-001.md ... iteration-005.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-006.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deltas/iter-006.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Read iteration-005.md FIRST for the consumer migration map and risk classification.
- Stay within `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/` for writes; use `/tmp/template-experiment/` for any byte-diff probes.
- DO NOT use `.../` ellipsis paths. Always full repo-relative paths.

## OUTPUT CONTRACT

THREE artifacts:
1. `iteration-006.md` narrative at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-006.md`
2. State log JSONL append: `{"type":"iteration","iteration":6,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/*optional*/]}`
3. `iter-006.jsonl` delta file at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deltas/iter-006.jsonl`

## RESEARCH GUIDANCE FOR ITERATION 6

1. **Run Phase 1 drift categorization**: pick 1 file per level (e.g. `level_1/spec.md`, `level_2/spec.md`, `level_3/spec.md`, `level_3+/spec.md`). For each, regenerate via `compose.sh` to a temp dir, `diff -u` against committed file, and categorize each hunk (frontmatter normalization / anchor injection / ordering / blank-line / other). For each category, write the SPECIFIC repair (file + line + change).
2. **Validate marker count**: run `grep -rln "SPECKIT_TEMPLATE_SOURCE" .opencode/specs/ | wc -l` and `grep -rln "template_source:" .opencode/specs/ | wc -l`. Get actual numbers (the "~800" claim is from spec.md hypothesis, not a measurement).
3. **Marker variance survey**: sample 3-5 spec folders, capture exact marker text. Document: do all use the same `| v2.2` suffix? Does ordering of "spec-core + level2-verify + level3-arch" vary?
4. **Phase 1 punch list**: produce an implementable punch list (file paths, line ranges, before/after snippets, estimated effort).
5. **Backward-compat strategy decision**: based on marker variance, choose: (a) zero-migration (markers stay as descriptive comments), (b) tolerant pattern matching, or (c) batch-rewrite script. Justify with the variance numbers.

Emit findings as `{"type":"finding","id":"f-iter006-NNN",...}` records.
