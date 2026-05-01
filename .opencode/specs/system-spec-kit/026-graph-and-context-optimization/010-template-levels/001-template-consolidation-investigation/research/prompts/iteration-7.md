# Deep-Research Iteration Prompt Pack

Per-iteration context for the deep-research LEAF agent (cli-codex executor: `gpt-5.5` / reasoning=high / service-tier=fast).

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 7 of 10
Last 6 ratios: 0.82 -> 0.76 -> 0.68 -> 0.61 -> 0.52 -> 0.44 | Stuck count: 0
Recommendation: **PARTIAL** (stable across iter 3-6)
~800 spec folder claim validated: actual count 868 marker-bearing directories
Phase 1 mechanical punch list READY for implementation.

Research Topic: Template system consolidation. Output recommendation (CONSOLIDATE / PARTIAL / STATUS QUO) with refactor steps, risk mitigations, file/LOC deltas, generator design choice, backward-compat path.

Iteration: 7 of 10

Focus Area: **Resolver API contract finalization + performance budget closure.** Two sub-tasks:

1. **Resolver API contract finalization**: write the COMPLETE TypeScript signature for `resolveTemplate(level, templateName, options?)` plus the shell wrapper signature. Include: error semantics (template not found, level invalid, malformed source), caching behavior (in-memory LRU vs cold compute), invalidation triggers (file mtime check, hash check, explicit purge), thread-safety (single-process mtime check is enough; no lock needed), and the consumer-facing migration helper for `template-utils.sh::copy_template`. Document the EXACT function-by-function migration: which existing call sites (from iter 5 consumer map) move from `cp templates/level_N/X` to `bash get_template <level> <X> > <dest>` (shell) or `await getTemplate(level, X)` (TS).

2. **Performance budget closure**: extend iter 3's 0.07-0.15s per-level recompose with: (a) resolver overhead (cold cache miss vs warm hit), (b) `create.sh` end-to-end latency before vs after generator integration. Use simple bench: `time bash compose.sh` (got 433ms iter 3) vs hypothetical resolver path. Verify <500ms NFR-P01.

Begin closing Q3 (final generator implementation pick — should be "extend compose.sh + thin resolver wrapper" with full justification), Q7 (performance numbers), and prepare for iter 8-10 synthesis.

Remaining Key Questions:
- Q1. Eliminate level_N? (ANSWERED: not in this packet, deferred to Phase 4 with parity gate)
- Q2. Minimum source-of-truth set (ANSWERED: core/ + addendum/ + compose.sh + resolver + level-rules manifest; level READMEs handled separately)
- Q3. Generator implementation **FINALIZE THIS ITER**
- Q4. Validator migration (ANSWERED iter 5: target template-structure.js first)
- Q5. Backward compat (ANSWERED iter 6: 868 spec folders; tolerant pattern matching, no migration script needed)
- Q6. Hash determinism (ANSWERED iter 3: needs Phase 1 byte-equivalence repair, plan ready iter 6)
- Q7. Performance budget **FINALIZE THIS ITER**
- Q8. Risk surface (ANSWERED iter 5)
- Q9. Recommendation: PARTIAL (stable, defended)
- Q10. Refactor plan (ANSWERED iter 6: mechanical punch list ready)

Last 3 Iterations Summary:
- Iter 4 (0.61): byte-equivalence repair plan + resolver API design + 4-phase ordering
- Iter 5 (0.52): consumer migration map + golden parity test design; PARTIAL confirmed
- Iter 6 (0.44, status: compat-counted-phase1-ready): 868 markers counted (~800 claim validated); Phase 1 mechanical punch list ready with files, line areas, diff sizes, risk classes; tolerant pattern matching beats batch-rewrite for backward-compat

## STATE FILES

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/findings-registry.json
- Prior iterations: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-001.md through iteration-006.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-007.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deltas/iter-007.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Read iteration-006.md FIRST for the Phase 1 punch list and 868-folder count.
- Stay within `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/` for writes; use `/tmp/template-experiment/` for benchmarks.
- DO NOT use `.../` ellipsis paths. Always full repo-relative paths.

## OUTPUT CONTRACT

THREE artifacts:
1. `iteration-007.md` narrative
2. State log JSONL append: `{"type":"iteration","iteration":7,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/*optional*/]}`
3. `iter-007.jsonl` delta file

## RESEARCH GUIDANCE FOR ITERATION 7

1. **Write the resolver TS signature** in `iteration-007.md` as a code block (TypeScript). Include JSDoc comments with error semantics. Sketch the shell wrapper as a `bash get_template` function.
2. **Migration mapping**: take 5-10 call sites from the iter 5 consumer map and write the EXACT before/after diff for each (current `cp templates/level_N/X` → resolver call).
3. **Bench resolver overhead**: re-time `compose.sh` (333ms or thereabouts), then estimate per-call resolver overhead (file read + cache lookup + hash check) on the order of 1-5ms.
4. **Prove or disprove the <500ms NFR-P01**: end-to-end `create.sh --level 3` latency budget = current `cp` time + resolver overhead. Show numbers.
5. **Finalize Q3 generator pick** with a 2-3 sentence rationale: extend compose.sh + thin resolver wrapper IS the answer (not TS rewrite, not JSON-driven), because composer already exists, ANCHOR semantics already encoded in shell, JSON-driven adds complexity without benefit when level rules are 4 simple manifests.

Emit findings as `{"type":"finding","id":"f-iter007-NNN",...}` records.
