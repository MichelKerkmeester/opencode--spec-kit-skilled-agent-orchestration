# Iteration 004: D4 Maintainability review

## Focus
D4 Maintainability - review graph helper structure, compiler organization, and sampled `graph-metadata.json` files for ease of safe follow-on changes.

## Verified claims
- Sampled metadata files are structurally consistent with each other: all three use `schema_version: 2`, the same `derived` shape, skill-relative `source_docs`, and repo-relative `key_files` / `entities[].path`. The maintainability concern in this iteration is therefore the shared contract design, not one malformed sample file. [SOURCE: .opencode/skill/skill-advisor/graph-metadata.json:2] [SOURCE: .opencode/skill/skill-advisor/graph-metadata.json:48] [SOURCE: .opencode/skill/skill-advisor/graph-metadata.json:58] [SOURCE: .opencode/skill/skill-advisor/graph-metadata.json:66] [SOURCE: .opencode/skill/system-spec-kit/graph-metadata.json:2] [SOURCE: .opencode/skill/system-spec-kit/graph-metadata.json:71] [SOURCE: .opencode/skill/system-spec-kit/graph-metadata.json:85] [SOURCE: .opencode/skill/system-spec-kit/graph-metadata.json:160] [SOURCE: .opencode/skill/sk-code-review/graph-metadata.json:2] [SOURCE: .opencode/skill/sk-code-review/graph-metadata.json:77] [SOURCE: .opencode/skill/sk-code-review/graph-metadata.json:87] [SOURCE: .opencode/skill/sk-code-review/graph-metadata.json:138]
- The graph-specific routing changes are still isolated to the dedicated helper section in `skill_advisor.py`; this iteration did not find maintainability problems spilling out into unrelated discovery or corpus-matching code. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:70] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:131] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:154]

## Findings

### P1 - Required
- **F030**: The relation contract is duplicated across multiple hand-maintained code paths instead of one source of truth. `skill_graph_compiler.py` defines five supported edge types in `EDGE_TYPES`, but `validate_edge_symmetry()` hardcodes reciprocity checks for only `depends_on` and `siblings`, `compile_graph()` hardcodes a different four-edge export set, and `skill_advisor.py` hardcodes a third mapping of relation names to routing weights and reason strings. Any future relation rename or schema extension must be updated in several places, and missing one site will still leave the graph load/compile path running with silently divergent behavior. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:41] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:250] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:409] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:83]

### P2 - Advisory
- **F031**: The derived-metadata schema uses mixed path conventions inside the same object: `source_docs` is validated as skill-relative, while `key_files` and `entities[].path` are validated as repo-relative. That asymmetry is baked into `validate_derived_metadata()` and repeated across the sampled metadata files, so maintainers editing or regenerating the 21 `graph-metadata.json` files have to remember field-specific path rules instead of one convention. The data is consistent today, but the authoring contract is harder to extend safely than it needs to be. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:205] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:216] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:224] [SOURCE: .opencode/skill/skill-advisor/graph-metadata.json:48] [SOURCE: .opencode/skill/skill-advisor/graph-metadata.json:58] [SOURCE: .opencode/skill/skill-advisor/graph-metadata.json:66] [SOURCE: .opencode/skill/system-spec-kit/graph-metadata.json:71] [SOURCE: .opencode/skill/system-spec-kit/graph-metadata.json:85] [SOURCE: .opencode/skill/system-spec-kit/graph-metadata.json:160]

## Ruled Out
- I did not find sample-to-sample schema drift in the metadata files reviewed this iteration; the maintainability hazard comes from the shared compiler/schema contract, not from one outlier skill packet. [SOURCE: .opencode/skill/skill-advisor/graph-metadata.json:2] [SOURCE: .opencode/skill/system-spec-kit/graph-metadata.json:2] [SOURCE: .opencode/skill/sk-code-review/graph-metadata.json:2]

## Dead Ends
- None. The maintainability issues were directly observable from the helper implementations and the sampled metadata contracts.

## Recommended Next Focus
D1 Correctness - determine whether the graph's extra `skill-advisor` node and current graph-derived adjustments only create packet drift or also change actual ranking, hub semantics, or diagnostics behavior.
