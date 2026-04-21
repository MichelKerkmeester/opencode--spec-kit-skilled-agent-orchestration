# Iteration 009: D2 Security deep pass

## Focus
D2 Security (deep pass) - audit live `graph-metadata.json` integrity across the skill corpus, with emphasis on required fields, edge-target validity, dependency-cycle safety, and documented weight-band compliance.

## Verified checks
- A repo-wide JSON sweep across all 21 skill metadata files found no missing required top-level/derived fields, no invalid targets, no self-referencing edges, no sibling / prerequisite symmetry mismatches, and no `depends_on` cycles. `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only` still passes with only the two pre-existing zero-edge warnings for `sk-deep-research` and `sk-git`.
- The sampled corpus is not broadly malformed: CLI peer links still sit at the documented sibling midpoint (`0.5`), Code Mode prerequisites remain inside the hard-dependency band, and `system-spec-kit`'s overlay edges stay inside the documented enhances band. [SOURCE: .opencode/skill/cli-copilot/graph-metadata.json:9] [SOURCE: .opencode/skill/mcp-code-mode/graph-metadata.json:11] [SOURCE: .opencode/skill/system-spec-kit/graph-metadata.json:8]

## Findings

### P1 - Required
- **F080**: `skill-advisor/graph-metadata.json` ships twenty `enhances` edges at `0.8`, but the packet defines `enhances` weights as `0.3-0.7`. Because the compiler still accepts any numeric weight inside `[0.0, 1.0]`, the live routing graph is already outside its documented contract and can apply stronger-than-promised overlay boosts to every routed companion skill. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/spec.md:115] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/spec.md:118] [SOURCE: .opencode/skill/skill-advisor/graph-metadata.json:10] [SOURCE: .opencode/skill/skill-advisor/graph-metadata.json:30] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:142]
- **F081**: The `skill-advisor` <-> `mcp-coco-index` hard-dependency pair is encoded at `0.4` in both directions even though `depends_on` / `prerequisite_for` are documented as `0.7-1.0`. That means the shipped graph labels the relationship as "cannot function without target" while serializing it with a soft-hint strength, which can underweight a dependency that the packet claims is foundational to routing. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/spec.md:115] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/spec.md:117] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/spec.md:121] [SOURCE: .opencode/skill/skill-advisor/graph-metadata.json:7] [SOURCE: .opencode/skill/mcp-coco-index/graph-metadata.json:17]

## Ruled Out
- This is not a broad JSON-corruption event. Sampled files from the CLI, MCP, system, review, code-quality, and utility families all retain the required schema-v2 structure and valid repo-local edge targets; the present integrity problem is weight-band drift, not broken object shape. [SOURCE: .opencode/skill/cli-copilot/graph-metadata.json:2] [SOURCE: .opencode/skill/mcp-code-mode/graph-metadata.json:2] [SOURCE: .opencode/skill/sk-git/graph-metadata.json:2] [SOURCE: .opencode/skill/sk-code-review/graph-metadata.json:2] [SOURCE: .opencode/skill/sk-improve-agent/graph-metadata.json:2] [SOURCE: .opencode/skill/sk-improve-prompt/graph-metadata.json:2]
- The current corpus does not contain a live dependency cycle or dangling target; the deep pass stayed grounded in present metadata rather than reporting hypothetical corruption paths.

## Dead Ends
- None. Once the packet's edge-type weight table was re-checked, the broad corpus sweep collapsed quickly to two concrete live contract violations in `skill-advisor` / `mcp-coco-index`.

## Recommended Next Focus
Stabilization / convergence - all four review dimensions are already covered, so the next pass should decide whether the active registry is now complete enough to synthesize, with special attention to the combination of packet traceability drift (F060/F061) and the new live metadata weight-band violations (F080/F081).
