# Deep-Research Iteration Prompt Pack

Per-iteration context for the deep-research LEAF agent (cli-codex executor: `gpt-5.5` / reasoning=high / service-tier=fast).

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 8 of 10
Last 7 ratios: 0.82 -> 0.76 -> 0.68 -> 0.61 -> 0.52 -> 0.44 -> 0.36 | Stuck count: 0
Recommendation: **PARTIAL** (stable across iter 3-7)
All 10 key questions either ANSWERED or NEARLY ANSWERED. Remaining work: synthesis preparation.

Research Topic: Template system consolidation. Output recommendation (CONSOLIDATE / PARTIAL / STATUS QUO) with refactor steps, risk mitigations, file/LOC deltas, generator design choice, backward-compat path.

Iteration: 8 of 10

Focus Area: **Synthesis outline + final risk + LOC delta numbers.** Three sub-tasks:

1. **Synthesis outline** — produce a 17-section outline for `research/research.md` (the canonical synthesis document the workflow will populate). Sections should cover: TL;DR, Recommendation (PARTIAL), Background, Methodology, Findings (Q1-Q10), Generator Design (compose.sh + resolver), 4-Phase Refactor Plan, Backward-Compat Strategy, Risk Register, Performance Budget, Validator Migration, Consumer Migration Map, Test Suite Design, File/LOC Deltas, Open Items / Future Work, Appendix A (graph), Appendix B (commands run).

2. **Final risk-register language** — consolidate iter-3, iter-4, iter-5, iter-6 risk findings into a single ranked table. Format: Risk ID, Description, Impact (H/M/L), Likelihood (H/M/L), Mitigation, Owner. Cover: ANCHOR drift, validator silent break, generator drift, cache invalidation, path-contract breakage, marker variance, CI false positives, rollback ordering, level_3+ test fixture hardcoding.

3. **File/LOC delta numbers** — concrete numbers for the recommendation. Today: 83 .md files / ~13K LOC. After Phase 1 (byte-parity repair): same file count, same LOC. After Phase 2 (resolver introduction): +1 resolver file (~200 LOC TS + 50 LOC shell wrapper), no removals. After Phase 3 (consumer migration): no file count change, ~50-100 lines modified across consumer call sites. After Phase 4 (optional deletion, if all parity gates green): delete 4 level dirs (~60 .md files, ~7K LOC), keep core/+addendum/+resolver+manifests. Net: 83 → ~24 files (~6K LOC) IF Phase 4 ships; 83 → 84 files (~13.3K LOC) if Phase 4 deferred. Document both scenarios.

Begin synthesis preparation; iter 9 will draft research.md outline content; iter 10 will finalize.

Remaining Key Questions: ALL 10 answered. Synthesis-only work remaining.

Last 3 Iterations Summary:
- Iter 5 (0.52): consumer migration map + golden parity test design
- Iter 6 (0.44): 868 markers counted; Phase 1 mechanical punch list ready
- Iter 7 (0.36, status: contract-performance-closed): Resolver API contract finalized (path/content/metadata modes); compose.sh + thin resolver wrapper picked; NFR-P01 confirmed (<500ms with 430ms compose + low resolver overhead); per-file shell hash checks excluded from create.sh hot path; consumer migration sequence: runtime helpers → validators → command YAMLs → docs.

## STATE FILES

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/findings-registry.json
- Prior iterations: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-001.md through iteration-007.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-008.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deltas/iter-008.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Read iteration-006.md AND iteration-007.md FIRST (Phase 1 punch list, resolver contract, performance numbers).
- DO NOT use `.../` ellipsis paths. Always full repo-relative paths.
- Stay within `010-template-levels/001-template-consolidation-investigation/research/` for writes.

## OUTPUT CONTRACT

THREE artifacts:
1. `iteration-008.md` narrative
2. State log JSONL append: `{"type":"iteration","iteration":8,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/*optional*/]}`
3. `iter-008.jsonl` delta file

## RESEARCH GUIDANCE FOR ITERATION 8

1. **Synthesis outline**: write the 17-section outline as a markdown skeleton in iteration-008.md. Each section gets a 1-2 sentence purpose + 3-5 bullet content sketch.
2. **Final risk register**: consolidate prior iter findings into a single 8-12 row table. Use H/M/L scales.
3. **LOC delta arithmetic**: do the file count math with concrete numbers (83 today; 84 after Phase 2 / +1; 24 after Phase 4 / -60). Show your work. Compute LOC delta similarly: ~13K → ~13.3K after Phase 2 → ~6K after Phase 4.
4. **Coverage check**: confirm all 10 Q's have evidence-backed answers somewhere in iter-001 through iter-007. Flag any gaps for iter 9-10 to close.

Emit findings as `{"type":"finding","id":"f-iter008-NNN",...}` records.
