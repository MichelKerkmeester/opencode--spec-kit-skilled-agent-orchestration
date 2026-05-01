# Deep-Research Iteration Prompt Pack

Per-iteration context for the deep-research LEAF agent (cli-codex executor: `gpt-5.5` / reasoning=high / service-tier=fast).

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 2 of 10
Questions: 0/10 answered | Last focus: Inventory current template system + map consumer chain
Last 1 ratio: 0.82 | Stuck count: 0
resource-map.md emit on synthesis enabled.
Next focus: Trace validator + header + anchor semantics + provenance parsing.

Research Topic: Investigate consolidating the system-spec-kit templates folder: can we remove the per-level output directories (level_1, level_2, level_3, level_3+) and replace them with on-demand generation from core/ + addendum/ manifests, while preserving the validator (check-files.sh), ~800 existing spec folders that contain SPECKIT_TEMPLATE_SOURCE markers, the phase_parent lean trio, ANCHOR-tag semantics consumed by memory-frontmatter parsers, and cross-cutting templates (handover.md, debug-delegation.md, research.md, resource-map.md, context-index.md). Output a concrete recommendation (CONSOLIDATE / PARTIAL / STATUS QUO) with refactor steps, risk mitigations, file-count and LOC deltas, generator design choice (extend compose.sh / TS rewrite / JSON-driven), and a backward-compatibility path.

Iteration: 2 of 10

Focus Area: **Trace validator + header + anchor semantics + provenance parsing.** Read `scripts/utils/template-structure.js`, `check-template-staleness.sh`, `shared/parsing/spec-doc-health.ts`, the anchor generator (`scripts/lib/anchor-generator.ts`), and tests under `mcp_server/tests/` and `scripts/tests/` that treat `templates/level_N/` as canonical. Document: (a) which scripts read template paths and what they expect, (b) ANCHOR-tag invariants the memory-frontmatter parser depends on, (c) provenance markers the validator relies on (SPECKIT_TEMPLATE_SOURCE), (d) test fixtures that hardcode `level_N/` paths. Begin answering Q4 (validator hooks) and Q6 (anchor preservation).

Remaining Key Questions:
- Q1. Can level_1 … level_3+ directories be eliminated entirely? (Iteration 1 mapped consumer chain; iteration 2 deepens dependency trace.)
- Q2. Minimum source-of-truth file set after consolidation?
- Q3. Generator implementation: extend compose.sh / TS rewrite / JSON-driven?
- Q4. How does check-files.sh validator know required files per level once levels are no longer materialized? **PRIMARY**
- Q5. Backward compatibility for ~800 existing spec folders with SPECKIT_TEMPLATE_SOURCE markers?
- Q6. Hash determinism + ANCHOR-tag preservation: byte-identical output achievable? **PRIMARY**
- Q7. Performance budget: latency added to create.sh (<500ms target)?
- Q8. Risk surface: all configs/scripts hardcoding templates/level_N/ paths?
- Q9. Final recommendation: CONSOLIDATE / PARTIAL / STATUS QUO with scoring?
- Q10. Concrete refactor plan with phases, CI gates, rollback?

Last 3 Iterations Summary:
- Iter 1 (newInfoRatio 0.82, status: insight): Inventoried templates folder (83 .md files / ~13K LOC). Mapped consumer chain create.sh → template-utils.sh::copy_template → level_N dirs. Identified compose.sh as composer, wrap-all-templates.ts as anchor wrapper, check-files.sh as validator. Found graph nodes: template-root, create-sh, template-utils, compose-sh, validator-check-files. Edges: sources, copies-from, writes, validates. Recommended next focus: validator/header/anchor semantics + provenance parsing.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/findings-registry.json
- Prior iteration narrative: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-001.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-002.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deltas/iter-002.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- Read iteration-001.md FIRST to avoid re-investigating what's already known.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- Repo root is the current working directory. Use absolute or repo-relative paths; do NOT modify files outside the spec folder's `research/` packet.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. Missing/malformed artifacts cause schema_mismatch failure.

1. **Iteration narrative markdown** at `.../research/iterations/iteration-002.md`. Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.../research/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY. Required schema:

```json
{"type":"iteration","iteration":2,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */]}
```

Append via single-line JSON with newline terminator. Do NOT pretty-print.

3. **Per-iteration delta file** at `.../research/deltas/iter-002.jsonl`. One `{"type":"iteration",...}` record + per-event structured records (one per finding, observation, edge, ruled_out direction). Each record on its own JSON line.

All three artifacts are REQUIRED.

## RESEARCH GUIDANCE FOR ITERATION 2

Specifically:
1. **Read** `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js` and `.opencode/skill/system-spec-kit/scripts/rules/check-template-staleness.sh` end-to-end. Document what they expect from the templates folder.
2. **Read** `.opencode/skill/system-spec-kit/shared/parsing/spec-doc-health.ts` and `.opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts`. Map ANCHOR invariants.
3. **Grep** for `templates/level_` references across `mcp_server/tests/` and `scripts/tests/`. List every test fixture that depends on level dirs.
4. **Grep** for `SPECKIT_TEMPLATE_SOURCE` to count occurrences and validate the "~800 spec folders" claim. (Already partially done in iter 1; refine.)
5. **Document** the exact ANCHOR-tag injection algorithm in `wrap-all-templates.ts`: regex, ordering, normalization rules. This is critical for proving hash determinism in a future generator.

Update findings-registry.json (via reducer; you don't write it directly) by emitting findings/observations/edges in `iter-002.jsonl`.
