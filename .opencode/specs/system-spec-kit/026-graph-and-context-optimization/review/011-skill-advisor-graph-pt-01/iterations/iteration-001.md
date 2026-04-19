# Iteration 1: Correctness re-review of graph fix remediations

## Focus
D1 Correctness review of `.opencode/skill/skill-advisor/scripts/skill_advisor.py`, `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`, and the live `graph-metadata.json` pair for `skill-advisor` / `mcp-coco-index` after the F001/F040/F041/F080/F081 remediation set.

## Findings
### P0 - Blocker
- None.

### P1 - Required
- None.

### P2 - Suggestion
- None.

## Remediation Status
- **F001**: The shipped default-path defect is no longer reproducible. `analyze_request()` now computes `passes_threshold` before `_apply_graph_conflict_penalty()` runs, and `filter_recommendations()` recomputes the threshold against the penalized `uncertainty` before default output is emitted. A narrower pre-filter ordering nuance still exists on the documented `--show-rejections` / raw `analyze_request()` surface, but this pass did not keep F001 open as a default routing defect. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1585-1612] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1783-1802] [SOURCE: .opencode/skill/skill-advisor/README.md:181-187]
- **F040 / F041**: Compiler-side semantic validation is now present. `validate_weight_bands()` and `validate_weight_parity()` encode the per-edge-type band checks and reciprocal parity checks, and the CLI validation path emits those warning classes after symmetry validation. The current corpus passed without weight-band or weight-parity warnings in this review run. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:309-397] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:624-634]
- **F080 / F081**: The live metadata drift is gone. `skill-advisor/graph-metadata.json` now serializes its `depends_on` edge to `mcp-coco-index` at `0.7` and its `enhances` edges at `0.7`, while `mcp-coco-index/graph-metadata.json` serializes the reciprocal `prerequisite_for` edge at `0.7`; this pass found no lingering `0.8` or `0.4` values in either file. [SOURCE: .opencode/skill/skill-advisor/graph-metadata.json:7-30] [SOURCE: .opencode/skill/mcp-coco-index/graph-metadata.json:17-22]
- `_load_skill_graph_sqlite()` currently reconstructs the same compiled-equivalent graph shape that `compile_graph()` exports: `schema_version`, `skill_count`, `families`, `adjacency`, `signals`, `conflicts`, and `hub_skills`. A live comparison during this pass matched all of those fields, and `--health` loaded the graph from SQLite successfully. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:105-189] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:488-555]
- The lazy auto-init contract is consistent with Phase 007 as currently written: SQLite first, JSON fallback second, auto-compile last when graph artifacts are absent, with manual setup documented for degraded `skill_graph_loaded:false` states. This pass did not record a new correctness finding on that surface. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/007-skill-graph-auto-setup/spec.md:116-117] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/007-skill-graph-auto-setup/spec.md:193-195] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:203-247] [SOURCE: .opencode/skill/skill-advisor/SET-UP_GUIDE.md:240-246]

## Ruled Out
- F040/F041-style validator regressions are not reproducible on the live corpus after remediation; the validation pipeline still reports only the two pre-existing zero-edge warnings.
- `_load_skill_graph_sqlite()` shape drift relative to compiled JSON is ruled out on the reviewed fields; the SQLite loader and compiler export remain in parity for current runtime data.

## Dead Ends
- Re-checking the documented `--show-rejections` path surfaced a narrower ordering nuance because ranking is fixed in `analyze_request()` before `filter_recommendations()` recomputes penalized pass/fail state. With no shipped `conflicts_with` edges today and correct default filtering still in place, that nuance did not justify reopening F001 in this pass. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1585-1612] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1792-1802] [SOURCE: .opencode/skill/skill-advisor/feature_catalog/01--routing-pipeline/06-result-filtering.md:18-20]

## Recommended Next Focus
D3 Traceability - verify the restarted gen2 review packet rebuilt live strategy / registry artifacts consistently and that the remediation docs now mark F001/F040/F041/F080/F081 as closed or narrowed to the current runtime reality.
