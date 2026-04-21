# Iteration 13 — Per-iter report

## Method
- Inventoried the shipped `.opencode/` tree, centered on `skill/`, `system-spec-kit/`, `mcp_server/`, `mcp-coco-index/`, `agent/`, `command/`, and `specs/`.
- Re-scored Public's capability-matrix column against direct local-source evidence instead of the lighter iter-4 baseline.
- Re-checked all 28 Q-C candidates against actual Public prerequisites: hooks, DB substrate, and MCP tool surfaces. [SOURCE: research/iterations/q-c-composition-risk.md:18-49]

## Inventory totals
- `.opencode/skill/`: 21 top-level skill bundles, `2691` files total; `system-spec-kit/` alone holds `2178`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:60-72]
- `.opencode/agent/`: 12 agent definitions spanning orchestration, context, debug, review, research, handover, and writing.
- `.opencode/command/`: 4 command groups plus root routing docs (`create`, `improve`, `memory`, `spec_kit`). [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/README.txt:33-44]
- `mcp_server/handlers/`: 58 handler files; `mcp_server/tests/`: 380 test files; `mcp_server/lib/`: 229 internal modules.
- `.opencode/specs/`: 24,690 files total, heavily dominated by `system-spec-kit/` history (`22948`) and `skilled-agent-orchestration/` (`1090`).

## Delta summary
| Capability | Direction | Magnitude |
|---|---|---:|
| Code AST coverage | steady, rationale stronger | 0 |
| Multimodal support | steady | 0 |
| Structural query | steady | 0 |
| Semantic query | steady | 0 |
| Memory / continuity | steady, rationale stronger | 0 |
| Observability | steady, rationale stronger | 0 |
| Hook integration | steady, rationale stronger | 0 |
| License compatibility | steady | 0 |
| Runtime portability | steady | 0 |

## Top 3 surprises
- Public already ships more substrate than iter-6 implicitly credited: FTS5 tables, shared-memory tables, eval DB tables, community detection, and cross-runtime hooks are all live. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/README.md:28-35] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:10-25]
- The biggest missing pieces are not basic primitives but cross-surface unification contracts: one scan artifact, one confidence contract, one invalidation ledger, and one durable interchange artifact. [SOURCE: research/iterations/q-c-composition-risk.md:133-142]
- Iter-4 was numerically conservative but directionally right: the main correction is narrative precision, not a score flip. Public's AST, continuity, observability, and hook surfaces are more source-proven than the old writeup made them sound. [SOURCE: research/iterations/iteration-4.md:4-6] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:35-46] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:112-217]

## Handoff to iter-14
- Reality-check S/M/L effort against the new substrate facts: many Q-C ideas are no longer "greenfield."
- Separate **substrate-ready** candidates from **contract-missing** candidates before re-estimating.
- Carry forward a new recommendation lens: preserve Public's moats, do not just import external-system patterns into a weaker architecture.
