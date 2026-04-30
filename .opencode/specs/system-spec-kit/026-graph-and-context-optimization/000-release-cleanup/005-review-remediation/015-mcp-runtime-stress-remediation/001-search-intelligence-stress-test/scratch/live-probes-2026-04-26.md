# Live MCP probes — 2026-04-26 18:49

Captured during the 006 sweep dispatch phase via direct MCP tool calls. **Note for the findings synthesis: these are out-of-band observations that the dispatched cli-codex / cli-copilot / cli-opencode runs can't capture, but are critical context for interpreting the playbook results.**

## Critical: 005 P0 fixes are NOT live in the running MCP runtime

The parallel Opus agent that ran earlier today reported Cluster 1-3 P0 fixes landed (see 005/implementation-summary.md "Cluster 1-3 Remediation"). Live probes captured during the 006 sweep show the runtime still serves pre-fix behavior:

| Cluster | REQ | Pre-fix bug | Live probe (2026-04-26 18:49) | Status |
|---------|-----|-------------|--------------------------------|--------|
| 1 | REQ-002 | Truncation drops to count=0 at 2% budget | actualTokens:65 / 3500, returnedResultCount:3, but data.content shows count:0,results:[] | ❌ STILL BROKEN |
| 2 | REQ-001 | "Semantic Search" → fix_bug intent (0.098) | Same: meta.intent.type="fix_bug", confidence=0.098 | ❌ STILL BROKEN |
| 2 | REQ-004 | Dual-classifier dissonance | Still live: meta.intent ≠ data.queryIntentRouting | ❌ STILL BROKEN |

**Likely cause:** source patches were authored against `mcp_server/lib/` and `mcp_server/handlers/`, but `mcp_server/dist/` wasn't rebuilt OR the MCP daemon wasn't restarted to pick up the new dist. The remediation agent's "inline node probe" verification likely tested a freshly-built dist/ that doesn't match the daemon process.

**Implication for the playbook scoring:** all cli-opencode cells (which use the spec-kit MCP) are operating against the BUGGY runtime, not the fixed runtime. Findings should NOT credit cli-opencode for P0 fixes that don't actually exist in the live system. Cells that intersect with REQ-001/002/003/004 (Cluster 1-3 surface) reflect pre-fix behavior.

## Working surface: direct memory_search bypasses the broken wrapper

`memory_search({query:"CocoIndex semantic vector search hybrid retrieval"})` correctly:
- intent="understand" (confidence 1.0)
- top hit: `skilled-agent-orchestration/022-mcp-coco-integration` (sim 79.76%) — the actual CocoIndex spec
- triggered: 022-hybrid-rag-fusion, 023-hybrid-rag-fusion-refinement
- constitutional: TOOL ROUTING - Search & Retrieval Decision Tree

So the underlying index and search is intact. The bug is in the `memory_context` wrapper layer that all `/memory:search` invocations route through.

## NEW defect candidates (NOT in 005's REQ-001..017)

### REQ-018 candidate: cocoindex returns mirrored-folder duplicates
Query: "semantic search vector embedding implementation" (limit 10)
- All 10 results: same `research-06.md` chunk (lines 279-303)
- Found in: `.gemini/specs/`, `.agents/specs/`, `.claude/specs/`, `.codex/specs/`, `specs/`, `.opencode/specs/` mirrors
- All scored identical 0.6811
- **Effective unique-result rate: 10%**
- Severity: P1 — silently degrades retrieval recall
- Fix surface: cocoindex indexer (cross-mirror dedup) OR query-time post-processing (group by content hash)

### REQ-019 candidate: research markdown outranks implementation source on technical queries
Query: "code graph traversal callers query"
- Results 1-9: duplicates of `024-compact-code-graph/research/iterations/iteration-040.md` (markdown SQL examples)
- Result 10: `mcp_server/handlers/code-graph/query.ts` (actual implementation) at score 0.6648

Query: "semantic search vector embedding implementation"
- Results 1-10: all `research-06.md` (vector probe research notes)
- Actual implementation source: not surfaced at all

- Severity: P1 — agents asking "how is X implemented" get research speculation instead of code
- Fix surface: ranking weight tuning (boost source-code file types over markdown when query has implementation/code intent), OR add file-type signal to ranking

## Implication for `findings.md` Recommendations section

These two candidates (REQ-018, REQ-019) and the verification failure are **net-new insights** the playbook surfaced — exactly what `006/spec.md` SC-003 asks for ("at least one actionable insight not already in 005"). Recommend the synthesis includes:

1. **Recommend explicit pipeline-rebuild step in remediation workflow** — agents that patch `mcp_server/` MUST run `npm run build` and trigger MCP daemon restart, otherwise fixes are phantom
2. **Add cross-mirror dedup to cocoindex** — likely the highest-leverage retrieval improvement available
3. **Tune cocoindex ranking** to surface implementation source above research markdown when query intent matches implementation patterns
