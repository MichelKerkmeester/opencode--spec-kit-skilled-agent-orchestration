# Deep-Research Iteration Prompt Pack

This prompt pack renders the per-iteration context for the deep-research LEAF agent (cli-codex executor: `gpt-5.5` / reasoning=high / service-tier=fast).

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 10
Questions: 0/10 answered | Last focus: (none — first iteration)
Last 2 ratios: n/a -> n/a | Stuck count: 0
resource-map.md not present at session start; emit on synthesis is enabled.
Next focus: Inventory the current template system and map consumer chain.

Research Topic: Investigate consolidating the system-spec-kit templates folder: can we remove the per-level output directories (level_1, level_2, level_3, level_3+) and replace them with on-demand generation from core/ + addendum/ manifests, while preserving the validator (check-files.sh), ~800 existing spec folders that contain SPECKIT_TEMPLATE_SOURCE markers, the phase_parent lean trio, ANCHOR-tag semantics consumed by memory-frontmatter parsers, and cross-cutting templates (handover.md, debug-delegation.md, research.md, resource-map.md, context-index.md). Output a concrete recommendation (CONSOLIDATE / PARTIAL / STATUS QUO) with refactor steps, risk mitigations, file-count and LOC deltas, generator design choice (extend compose.sh / TS rewrite / JSON-driven), and a backward-compatibility path.

Iteration: 1 of 10

Focus Area: **Inventory the current template system.** Catalog every file in `.opencode/skill/system-spec-kit/templates/` with size and purpose. Map the consumer chain: `create.sh` → `template-utils.sh::copy_template` → which level directory. Identify all files in `.opencode/skill/system-spec-kit/scripts/` that read template paths. Produce a baseline file/LOC count to anchor later delta calculations. Begin answering Q1 (dependencies) and Q2 (minimum source-of-truth set).

Remaining Key Questions:
- Q1. Can level_1 … level_3+ directories be eliminated entirely? Exhaustive list of dependencies?
- Q2. Minimum source-of-truth file set after consolidation?
- Q3. Generator implementation: extend compose.sh / TS rewrite / JSON-driven?
- Q4. How does check-files.sh validator know required files per level once levels are no longer materialized?
- Q5. Backward compatibility for ~800 existing spec folders with SPECKIT_TEMPLATE_SOURCE markers?
- Q6. Hash determinism + ANCHOR-tag preservation: byte-identical output achievable?
- Q7. Performance budget: latency added to create.sh (<500ms target)?
- Q8. Risk surface: all configs/scripts hardcoding templates/level_N/ paths?
- Q9. Final recommendation: CONSOLIDATE / PARTIAL / STATUS QUO with scoring?
- Q10. Concrete refactor plan with phases, CI gates, rollback?

Last 3 Iterations Summary: None — first iteration.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/findings-registry.json
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.
- Repo root is the current working directory. Use absolute or repo-relative paths; do NOT modify files outside the spec folder's `research/` packet.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-001.md`. Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. Required schema:

```json
{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */]}
```

Append via single-line JSON with newline terminator. Do NOT pretty-print.

3. **Per-iteration delta file** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deltas/iter-001.jsonl`. One `{"type":"iteration",...}` record (same content as state-log append) + per-event structured records (one per finding, observation, edge, ruled_out direction). Each record on its own JSON line.

Example delta file contents:
```json
{"type":"iteration","iteration":1,"newInfoRatio":0.85,"status":"insight","focus":"Inventory template system"}
{"type":"finding","id":"f-iter001-001","severity":"P1","label":"...","iteration":1}
{"type":"observation","id":"obs-iter001-001","packet":"010-template-levels","classification":"real","iteration":1}
```

All three artifacts are REQUIRED.

## RESEARCH GUIDANCE

For iteration 1 specifically, prioritize:
1. **File inventory:** `find .opencode/skill/system-spec-kit/templates -type f | wc -l` ; `find .opencode/skill/system-spec-kit/templates -type f -name "*.md" | xargs wc -l | tail -1` ; per-subdirectory file counts.
2. **Consumer map:** `grep -rn "templates/level_" .opencode/skill/system-spec-kit/scripts/ .opencode/command/ .opencode/agent/ .opencode/skill/ AGENTS.md CLAUDE.md`
3. **Composition logic:** read `.opencode/skill/system-spec-kit/scripts/templates/compose.sh` and `.opencode/skill/system-spec-kit/scripts/templates/wrap-all-templates.ts` end-to-end; document the exact algorithm.
4. **Validator hooks:** read `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh` and identify how required-file-per-level rules are encoded.
5. **Marker prevalence:** `grep -rn "SPECKIT_TEMPLATE_SOURCE" .opencode/specs/ | wc -l` to validate the "~800 existing spec folders" claim.

Document baseline numbers in `iteration-001.md` so subsequent iterations can compute deltas.
