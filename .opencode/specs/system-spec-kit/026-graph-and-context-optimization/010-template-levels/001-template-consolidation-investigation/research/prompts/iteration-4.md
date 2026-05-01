# Deep-Research Iteration Prompt Pack

Per-iteration context for the deep-research LEAF agent (cli-codex executor: `gpt-5.5` / reasoning=high / service-tier=fast).

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 4 of 10
Last 3 ratios: 0.82 -> 0.76 -> 0.68 | Stuck count: 0
Recommendation trending: PARTIAL (not full CONSOLIDATE) per iter 3 finding.
Next focus: Repair-path design — minimum source/addendum changes for byte-equivalent generation; resolver API for shell+JS consumers.

Research Topic: Investigate consolidating the system-spec-kit templates folder. Output a concrete recommendation (CONSOLIDATE / PARTIAL / STATUS QUO) with refactor steps, risk mitigations, file/LOC deltas, generator design choice, backward-compatibility path.

Iteration: 4 of 10

Focus Area: **Repair-path design.** Two sub-tasks:
1. **Byte-equivalence repair plan**: Identify the minimum set of changes to `core/`, `addendum/`, or the composer (`compose.sh` / `wrap-all-templates.ts`) so that `compose.sh` produces output byte-identical to the checked-in `templates/level_N/`. Iter 3 proved the current generator is deterministic against itself BUT NOT against the committed rendered contract. Document the diff: what fields drift, what frontmatter normalization is missing, what ordering is non-canonical.
2. **Resolver API design**: Sketch the API for a single resolver function consumed by both shell (`create.sh::copy_template`) AND JS/TS (`mcp_server`, validators). Signature, inputs (level + template name), outputs (path or stream), caching semantics. Pseudo-code is fine.

Begin closing Q3 (generator implementation choice), Q5 (backward-compat strategy), Q10 (refactor plan ordering).

Remaining Key Questions:
- Q1. Eliminate level_N entirely? (Current answer trending: NOT YET — need byte-equivalence repair first)
- Q2. Minimum source-of-truth set?
- Q3. Generator implementation **PRIMARY** — extend compose.sh vs TS rewrite vs JSON-driven
- Q5. Backward compatibility for ~800 spec folders **PRIMARY** — including legacy `_memory.continuity` blocks in old generated templates
- Q6. Hash determinism (partially answered: deterministic against self, NOT against committed contract)
- Q7. Performance budget (partially answered: 433ms full recompose; per-level path TBD)
- Q8. Risk surface (extended in iter 3: generator drift, silent empty files, cache invalidation, path-contract breakage)
- Q9. Final recommendation (trending PARTIAL)
- Q10. Concrete refactor plan **PRIMARY** — start: byte-equivalence repair → cache resolver → consumer migration

Last 3 Iterations Summary:
- Iter 1 (0.82): Inventoried templates folder + mapped consumer chain
- Iter 2 (0.76): Traced validator + anchor + provenance semantics; found delegation chains
- Iter 3 (0.68): Determinism experiment (433ms recompose, deterministic-against-self but NOT byte-equiv to checked-in level_N). Designed compatibility cache concept. Recommendation trending PARTIAL.

## STATE FILES

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/findings-registry.json
- Prior iterations: iteration-001.md, iteration-002.md, iteration-003.md
- Write iteration narrative to: .../research/iterations/iteration-004.md
- Write per-iteration delta file to: .../research/deltas/iter-004.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Write findings to files. Do not hold in context.
- Read iteration-003.md FIRST (it has the determinism experiment results and PARTIAL recommendation rationale).
- Repo root is the cwd. Stay within `research/` for writes; use `/tmp/template-experiment/` for any byte-diff probes.

## OUTPUT CONTRACT

THREE artifacts required:
1. `iteration-004.md` — narrative with Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus
2. State log JSONL append: `{"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/*optional*/]}`
3. `iter-004.jsonl` delta file with iteration record + per-finding/observation/edge records

## RESEARCH GUIDANCE FOR ITERATION 4

1. **Run a finer-grained byte-diff** between fresh `compose.sh` output and committed `level_N/`: pick 1-2 files (e.g. `level_2/spec.md`, `level_3/spec.md`), regenerate, `diff -u` them, capture the exact lines that drift. Categorize the drift (frontmatter normalization, anchor injection, ordering, blank-line handling).
2. **Propose source repairs**: for each drift category, decide whether to (a) update the source `core/`/`addendum/` to match committed output, OR (b) add a normalization step in `compose.sh`/`wrap-all-templates.ts` to make output match committed. Pick whichever requires fewer changes.
3. **Design the resolver API**: write a markdown spec for `resolveTemplate(level, templateName) → string` with caching semantics (in-memory LRU? on-disk cache? pure recompute?). Include the shell wrapper signature (`bash get_template <level> <name>`) and TS signature (`function getTemplate(level, name): Promise<string>`).
4. **Define refactor phase ordering** in plan-stub form: Phase 1 = byte-equivalence repair, Phase 2 = resolver API, Phase 3 = consumer migration, Phase 4 = level-dir deletion (optional, gated on parity proof).
5. **Update risk register** with the iter-3 additions: generator drift, silent empty files, cache invalidation, path-contract breakage. Score each on impact/likelihood.

Emit findings as `{"type":"finding","id":"f-iter004-NNN",...}` records in iter-004.jsonl.
