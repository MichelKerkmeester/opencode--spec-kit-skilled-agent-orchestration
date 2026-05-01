# Deep-Research Iteration Prompt Pack

Per-iteration context for the deep-research LEAF agent (cli-codex executor: `gpt-5.5` / reasoning=high / service-tier=fast).

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 5 of 10
Last 4 ratios: 0.82 -> 0.76 -> 0.68 -> 0.61 | Stuck count: 0
Recommendation: PARTIAL (stable across iter 3 + iter 4)
Next focus: Consumer migration map + golden parity test design.

Research Topic: Template system consolidation. Output recommendation (CONSOLIDATE / PARTIAL / STATUS QUO) with refactor steps, risk mitigations, file/LOC deltas, generator design choice, backward-compat path.

Iteration: 5 of 10

Focus Area: **Consumer migration map + parity test design.** Two sub-tasks:
1. **Consumer migration map**: enumerate EVERY caller that currently reads `templates/level_N` directly (scripts, MCP server modules, validators, tests, CI configs, IDE configs, docs). For each, classify: (a) PATH-resolver needed (caller wants a file path) vs (b) CONTENT-resolver needed (caller wants the template body) vs (c) DELETION-safe (caller can be removed entirely). Produce the map as a markdown table with file path, current behavior, classification, and migration step.
2. **Golden parity test suite design**: define the test gate that Phase 1 (byte-equivalence repair) must pass before Phase 2 starts. Include: (a) per-level byte-diff against checked-in `templates/level_N/`, (b) reducer/validator behavioral parity for sample spec folders, (c) ANCHOR-tag presence + ordering invariants, (d) frontmatter normalization checks. Specify where the tests live (`scripts/tests/` likely), what assertion library, and the CI hook.

Begin closing Q4 (validator migration), Q8 (full risk surface), Q10 (refactor plan with phases + CI gates).

Remaining Key Questions:
- Q1. Eliminate level_N? (ANSWER trending: not in this packet; PARTIAL keeps level_N as committed artifacts; deletion is Phase 4, gated on parity proof)
- Q2. Minimum source-of-truth set (NEARLY ANSWERED iter 4: core/ + addendum/ + compose.sh + resolver/cache + README policy still TBD)
- Q3. Generator implementation (PARTIALLY ANSWERED iter 4: extend compose.sh + resolver wrapper preferred)
- Q4. Validator migration map **PRIMARY THIS ITER**
- Q5. Backward compat for ~800 spec folders (legacy `_memory.continuity` blocks identified iter 4)
- Q6. Hash determinism (RESOLVED: not against committed contract; needs byte-equivalence repair)
- Q7. Performance budget (PARTIALLY: 0.07-0.15s per level raw; resolver caching overhead TBD)
- Q8. Risk surface **PRIMARY THIS ITER**
- Q9. Recommendation: PARTIAL (stable)
- Q10. Refactor plan with CI gates **PRIMARY THIS ITER**

Last 3 Iterations Summary:
- Iter 2 (0.76): validator + anchor + provenance semantics
- Iter 3 (0.68): determinism experiment 433ms; deterministic-against-self but NOT byte-equiv to checked-in level_N; PARTIAL recommendation emerges
- Iter 4 (0.61): byte-equivalence repair plan + resolver API design + 4-phase ordering: byte-equiv repair → resolver → consumer migration → optional level-dir deletion. Found legacy `_memory.continuity` frontmatter in some rendered templates.

## STATE FILES

- Config / State Log / Strategy / Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/{deep-research-config.json,deep-research-state.jsonl,deep-research-strategy.md,findings-registry.json}`
- Prior iterations: iteration-001.md, iteration-002.md, iteration-003.md, iteration-004.md
- Write iteration narrative to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-005.md`
- Write per-iteration delta file to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deltas/iter-005.jsonl`

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Read iteration-004.md FIRST for the 4-phase plan + resolver API sketch.
- Stay within `research/` for writes; use `/tmp/template-experiment/` for any probes.

## OUTPUT CONTRACT

THREE artifacts:
1. `iteration-005.md` narrative
2. State log JSONL append: `{"type":"iteration","iteration":5,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/*optional*/]}`
3. `iter-005.jsonl` delta file

## RESEARCH GUIDANCE FOR ITERATION 5

1. **Grep for `templates/level_` usage** in `mcp_server/`, `scripts/`, `command/`, `agent/`, `skill/`, root `*.md` configs. Capture line numbers + caller intent.
2. **Classify each caller** as PATH/CONTENT/DELETION-safe per spec above.
3. **Produce the consumer migration map table** in `iteration-005.md`.
4. **Specify the golden parity test suite**: file locations, assertion shape, CI hook (where in `.github/workflows` or `scripts/ci/` it runs).
5. **Extend the risk register**: add specific risks per migration class (PATH callers vs CONTENT callers), specific risks per CI gate failure mode, rollback ordering.

Emit findings as `{"type":"finding","id":"f-iter005-NNN",...}` records.
