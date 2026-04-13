## Summary
This iteration focused on Q4 (compiler validation robustness) and Q9 (edge weight inconsistencies) in `.opencode/skill/scripts/skill_graph_compiler.py`. I read the compiler end to end, ran the validator, and audited the 20 skill-level metadata files under `.opencode/skill/*/graph-metadata.json` that the compiler actually scans.

Validation command output:

```text
$ python3 .opencode/skill/scripts/skill_graph_compiler.py --validate-only
Discovered 20 skill graph-metadata.json files
VALIDATION PASSED: all metadata files are valid
```

## Findings
1. The validator passes cleanly, but its hard checks are limited to schema/shape validation plus target existence and weight range checks. `validate_skill_metadata()` enforces `schema_version`, `skill_id`, `family`, `category`, edge object shape, known targets, numeric weights in `[0.0, 1.0]`, and presence of `context`, `domains`, and `intent_signals`, but nothing more structural (`.opencode/skill/scripts/skill_graph_compiler.py:80-154`).

2. There is no circular dependency detection. The only cross-file validation is `validate_edge_symmetry()`, and that function checks just `depends_on -> prerequisite_for` presence and `siblings -> siblings` presence (`.opencode/skill/scripts/skill_graph_compiler.py:157-204`). I manually audited the current graph and found no `depends_on` cycles, but the compiler would accept one without error or warning.

3. There is no self-reference validation. A self-edge would currently pass as long as the target name matches a known skill, because `validate_skill_metadata()` checks only that the target exists in `all_skill_ids` (`.opencode/skill/scripts/skill_graph_compiler.py:128-141`). The current dataset has zero self-referencing edges, so this gap is latent rather than active.

4. There is no orphan-skill or no-edge validation. Four of the 20 scanned skill metadata files currently declare zero edges at all: `mcp-coco-index`, `sk-doc`, `sk-git`, and `system-spec-kit`. The compiler does not report that condition anywhere, even though the packet is trying to model skill relationships explicitly.

5. The current 20-file graph contains 38 total edges: 4 `depends_on`, 4 `prerequisite_for`, 22 `siblings`, 8 `enhances`, and 0 `conflicts_with`. The reciprocal audit is clean for `depends_on <-> prerequisite_for` and for `siblings`: every reverse relationship exists and the weights match. Example: `mcp-figma -> mcp-code-mode` is `depends_on 0.9`, and `mcp-code-mode -> mcp-figma` is `prerequisite_for 0.9` (`.opencode/skill/mcp-figma/graph-metadata.json:7-12`, `.opencode/skill/mcp-code-mode/graph-metadata.json:11-15`).

6. All observed weight asymmetries are in `enhances`, and the validator does not surface any of them. Two `enhances` edges have no reverse edge at all: `mcp-chrome-devtools -> sk-code-web (0.5)` and `mcp-figma -> sk-code-web (0.4)` (`.opencode/skill/mcp-chrome-devtools/graph-metadata.json:7-12`, `.opencode/skill/mcp-figma/graph-metadata.json:10-12`). Six more `enhances` edges are bidirectional but weight-mismatched: `sk-code-review -> sk-code-opencode/sk-code-web/sk-code-full-stack` uses `0.7`, while each reverse edge is `0.3` (`.opencode/skill/sk-code-review/graph-metadata.json:8-17`, `.opencode/skill/sk-code-opencode/graph-metadata.json:8-14`, `.opencode/skill/sk-code-web/graph-metadata.json:8-14`, `.opencode/skill/sk-code-full-stack/graph-metadata.json:8-14`).

7. Q9 answer: the compiler currently treats those `enhances` asymmetries as fully valid. `validate_edge_symmetry()` never checks `enhances`, never compares reverse weights, and never warns on asymmetric weight pairs. That is why `--validate-only` reports a clean pass even though the metadata contains 2 missing reverse `enhances` edges and 6 reverse-weight mismatches.

8. `hub_skills` is correct for the current implementation, but the implementation is narrower than its docstring suggests. `compile_graph()` builds `adjacency` from only `depends_on`, `enhances`, and `siblings`, explicitly excluding `prerequisite_for` and handling `conflicts_with` separately (`.opencode/skill/scripts/skill_graph_compiler.py:233-291`). `compute_hub_skills()` then counts inbound edges from that compiled adjacency and returns skills whose inbound count is strictly above the median (`.opencode/skill/scripts/skill_graph_compiler.py:211-230`). Manual recomputation matches the generated graph exactly: inbound counts are `sk-code-web=5`, `sk-code-review=4`, seven skills at `3`, four skills at `1`, and the median is `3`, so the emitted hubs `["sk-code-review", "sk-code-web"]` are correct for this algorithm. The caveat is that the docstring says "across all types", but the function only sees the subset of edge types that survived compilation.

## New Questions
1. Should `enhances` be allowed to remain intentionally directional, or should the compiler start validating reverse presence and/or reverse weight ranges for that edge type too?
2. Should orphan skills with zero edges remain legal, or would a warning-level check help catch missing graph modeling work for high-value skills like `system-spec-kit`?
3. Should circular dependency detection be limited to `depends_on`, or should the compiler also flag strongly connected components across `enhances` and `siblings` when those relationships become too dense?
4. Is the current `hub_skills` definition the right one for downstream routing, or would weighted inbound centrality be more meaningful than a raw above-median edge count?

## Metrics
- `newInfoRatio`: `0.76`
