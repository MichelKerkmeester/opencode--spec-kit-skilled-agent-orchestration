# Deep-Research Iteration Prompt Pack

Per-iteration context for the deep-research LEAF agent (cli-codex executor: `gpt-5.5` / reasoning=high / service-tier=fast).

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 3 of 10
Last 2 ratios: 0.82 -> 0.76 | Stuck count: 0
resource-map.md emit on synthesis enabled.
Next focus: Deterministic output experiment + latency benchmark + compatibility cache design.

Research Topic: Investigate consolidating the system-spec-kit templates folder: can we remove the per-level output directories (level_1, level_2, level_3, level_3+) and replace them with on-demand generation from core/ + addendum/ manifests, while preserving the validator (check-files.sh), ~800 existing spec folders that contain SPECKIT_TEMPLATE_SOURCE markers, the phase_parent lean trio, ANCHOR-tag semantics consumed by memory-frontmatter parsers, and cross-cutting templates (handover.md, debug-delegation.md, research.md, resource-map.md, context-index.md). Output a concrete recommendation (CONSOLIDATE / PARTIAL / STATUS QUO) with refactor steps, risk mitigations, file-count and LOC deltas, generator design choice (extend compose.sh / TS rewrite / JSON-driven), and a backward-compatibility path.

Iteration: 3 of 10

Focus Area: **Deterministic output experiment + latency benchmark + compatibility cache design.** Generate the level outputs into a temp cache from `core/` + `addendum/` (use existing `compose.sh` if it can target an alternate output directory, OR run a quick experiment by copying CORE+ADDENDUM and applying composition steps). Compare bytes vs checked-in `templates/level_N/`. Measure latency: time `compose.sh` end-to-end and time per-level generation. Document gaps where on-demand generation would NOT be byte-identical (formatting, ordering, frontmatter normalization). Then trace exactly which lines in `create.sh` and `template-utils.sh::copy_template` would change for an on-demand generator. Begin answering Q3 (generator implementation), Q6 (hash determinism), Q7 (performance budget).

Remaining Key Questions:
- Q1. Can level_1 … level_3+ directories be eliminated? (Iter 1 mapped consumers; Iter 2 traced validator/anchor semantics. Iter 3+ needs to validate elimination feasibility.)
- Q2. Minimum source-of-truth file set?
- Q3. Generator implementation: extend compose.sh / TS rewrite / JSON-driven? **PRIMARY THIS ITER**
- Q4. Validator hooks (partially answered iter 2)
- Q5. Backward compatibility for ~800 spec folders
- Q6. Hash determinism + ANCHOR preservation **PRIMARY THIS ITER**
- Q7. Performance budget (<500ms) **PRIMARY THIS ITER**
- Q8. Risk surface inventory
- Q9. Final recommendation
- Q10. Concrete refactor plan

Last 3 Iterations Summary:
- Iter 1 (newInfoRatio 0.82, status: insight): Inventoried templates folder (83 .md files / ~13K LOC). Mapped consumer chain create.sh → template-utils.sh::copy_template → level_N dirs. Identified compose.sh, wrap-all-templates.ts, check-files.sh.
- Iter 2 (newInfoRatio 0.76, status: insight): Traced validator + anchor + provenance parsing. Found scripts/utils/template-structure.js, check-template-headers.sh, check-template-staleness.sh, anchor-generator.ts, wrap-all-templates.ts. Mapped delegation: check-template-headers → template-structure.js for rendered contract comparison.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/findings-registry.json
- Prior iterations: .../iterations/iteration-001.md, iteration-002.md
- Write iteration narrative to: .../research/iterations/iteration-003.md
- Write per-iteration delta file to: .../research/deltas/iter-003.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- Read iteration-001.md AND iteration-002.md FIRST to avoid re-investigating known facts.
- Repo root is the current working directory. Use absolute or repo-relative paths; do NOT modify files outside the spec folder's `research/` packet AND a temp dir under `/tmp/template-experiment/` if you run the deterministic experiment.
- DO NOT modify files in `.opencode/skill/system-spec-kit/templates/` itself. The deterministic experiment writes to a temp dir.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. Missing/malformed artifacts cause schema_mismatch failure.

1. **Iteration narrative markdown** at `.../research/iterations/iteration-003.md`. Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.../research/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY. Required schema:

```json
{"type":"iteration","iteration":3,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */]}
```

3. **Per-iteration delta file** at `.../research/deltas/iter-003.jsonl`. One `{"type":"iteration",...}` record + per-event structured records.

All three artifacts are REQUIRED.

## RESEARCH GUIDANCE FOR ITERATION 3

Specifically:
1. **Read** `.opencode/skill/system-spec-kit/scripts/templates/compose.sh` end-to-end. Understand the exact composition algorithm: which file fragments combine, in what order, with what normalization.
2. **Run a deterministic experiment**: `mkdir -p /tmp/template-experiment` then re-run `compose.sh` (if it has an output-dir parameter) OR manually compose 1-2 level files and `diff` them against checked-in `templates/level_N/`. Document any drift.
3. **Measure latency**: `time bash scripts/templates/compose.sh` to get total composition time. Estimate per-level generation latency for the on-demand path.
4. **Trace consumer hot paths**: in `scripts/spec/create.sh` lines 538-661 and `scripts/lib/template-utils.sh::copy_template`, identify the exact `cp` calls or template-resolution functions that would be replaced by a generator call.
5. **Score the three generator design options** (extend compose.sh / TS rewrite / JSON-driven) on: complexity, performance, determinism, maintainability, CI integration. Use a 1-5 scoring rubric and emit findings.

Write findings to iteration-003.md and emit them as `{"type":"finding","id":"f-iter003-NNN",...}` records in iter-003.jsonl.
