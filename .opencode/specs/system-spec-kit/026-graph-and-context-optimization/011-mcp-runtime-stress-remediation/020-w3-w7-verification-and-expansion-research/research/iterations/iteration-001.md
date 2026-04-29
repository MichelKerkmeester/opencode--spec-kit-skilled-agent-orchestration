---
iteration: 1
focus: RQ1 - W3 trust tree wiring audit
newInfoRatio: 0.92
status: complete
---

# Iteration 001 - W3 Trust Tree Wiring

## Focus

Verify whether the W3 composed RAG trust tree is wired into production MCP runtime paths or only exists as an additive helper plus tests.

## Evidence Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:25` defines optional inputs for response policy, code graph, advisor, CocoIndex, and causal signals.
- `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:65` builds the composed trust tree from those signals.
- `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:205` decides `unavailable`, `mixed`, `degraded`, or `trusted`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:253` exports `buildTrustTree`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w3-trust-tree.vitest.ts:3` imports `buildTrustTree`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w3-trust-tree.vitest.ts:7` exercises composed signals and causal contradiction handling.
- `rg "import .*trust-tree|from .*trust-tree|buildTrustTree" .opencode/skill/system-spec-kit/mcp_server` returned only the trust-tree module export/function and `tests/search-quality/w3-trust-tree.vitest.ts`.

## Findings

### F-W3-001 - P1 - Trust tree has zero production consumers

Hunter: the helper is implemented, exported, and tested, but the caller audit found no production import or runtime invocation outside the module itself.

Skeptic: the absence could be intentional because Phase E marked W3 as an "additive helper" rather than behavior-changing runtime logic.

Referee: still actionable as P1 for this research charter. The user explicitly asked whether there are zero production consumers; the answer is yes. The helper cannot influence `memory_search`, `memory_context`, `code_graph_query`, or advisor routing until a production surface calls it.

## Wiring Verdict

W3 is a measured and tested composition primitive, not a live RAG trust decision path.

## Opportunities

- Feed W3 from `memory_search` response policy, code graph readiness, advisor `trustState`, CocoIndex telemetry, and causal relations.
- Emit trust-tree decisions into search/advisor audit metadata before using them to alter ranking or refusal behavior.

## Next Focus

Iteration 002 should verify W4 default-on rerank wiring and whether the actual query-plan signals reach Stage 3.
