# Document 2: Actionable Recommendations for System-Speckit and System-Speckit Memory MCP

## Executive Summary
Priority direction:

1. **Implement a two-lane retrieval architecture** (`fast` lexical lane + `deep` hybrid lane).  
2. **Add lifecycle and observability tools** (`memory_status`, `memory_list`, `memory_delete`, `memory_prune`, `index_status`).  
3. **Introduce session continuity primitives** (`memory_continue`, state anchors, decision/evidence extraction).  
4. **Adopt daemon/shared transport + warm caches** for predictable latency.  
5. **Stage rollout with measurable SLOs** (latency, relevance, token efficiency, continuity success).

[Assumes: system-speckit memory MCP currently supports basic save/search but not full hybrid ranking, explicit lifecycle APIs, or persistent daemonized retrieval serving.]

---

## 1) Applicable Patterns for Your Use Case

## 1.1 Pattern: Fast lane + deep lane query modes
From `qmd`, separate retrieval modes reduce unnecessary heavy processing.

**Adopt**
- `memory_search_fast`: lexical (BM25/FTS) + exact anchors.
- `memory_search_deep`: expansion + vector + rerank + fusion.
- `memory_search_auto`: route based on query complexity.

**Concrete example**
```ts
// pseudo-tool contract
memory_search({
  query: "what decision did we make about gate 3?",
  mode: "fast" | "deep" | "auto",
  scope: ["state", "next-steps", "decisions", "evidence"]
})
```

## 1.2 Pattern: Ranked fusion with top-rank preservation
From `qmd`’s RRF + top-rank bonus + position-aware blending.

**Adopt**
- Retrieval fusion score with explicit `k`.
- Preserve exact-match winners with small rank bonus.
- Blend reranker influence by rank tier (don’t let reranker destroy exact hits).

## 1.3 Pattern: Memory lifecycle APIs as first-class
From `cognee` tool design.

**Adopt**
- `memory_list_data`, `memory_delete`, `memory_prune`, `memory_status`.
- Soft/hard deletion semantics.
- Dataset/spec-folder-aware filtering.

## 1.4 Pattern: Async indexing/cognification + status tools
From `cognee` background jobs and status polling.

**Adopt**
- `memory_index_start` returns job id.
- `memory_index_status(job_id)` for progress.
- Non-blocking ingestion for large specs/history.

## 1.5 Pattern: Doc handles for deterministic follow-up
From `qmd`’s short `docid`.

**Adopt**
- Generate stable `memid` for each memory unit.
- Retrieval returns `memid`, score, source, timestamp, anchor type.
- Follow-up tools (`memory_get(memid)`, `memory_patch(memid)`).

---

## 2) Integration Opportunities

## 2.1 MCP tool contract redesign
Group tools by phase:
- `ingest/*`: save, bulk-save, index-start
- `retrieve/*`: fast, deep, get, continue
- `ops/*`: status, list, delete, prune
- `explain/*`: why-hit, provenance, score-breakdown

This mirrors `qmd` clarity and `cognee` lifecycle maturity.

## 2.2 Multi-transport serving
Use:
- stdio for local single-client runs
- HTTP/SSE for shared service across agents/IDEs

Add health endpoint and startup checks like `qmd`’s `/health`.

## 2.3 Shared memory backend across agents
From `cognee` “single source for multiple LLMs” idea:
- Keep memory server independent from model provider.
- Let Claude/OpenAI/local agents query same memory endpoint.

---

## 3) Architecture Improvements to Adopt

## 3.1 Memory schema upgrade
Add typed memory records:
- `state`
- `decision`
- `next_step`
- `risk`
- `evidence`
- `handover`

This directly supports speckit workflows and improves retrieval precision.

## 3.2 Hierarchical context graph
Borrow from `qmd` context-tree and `cognee` graph thinking:
- `workspace -> spec folder -> phase -> artifact -> memory entry`
- Include link edges (`depends_on`, `supersedes`, `validated_by`)

## 3.3 Retrieval scoring transparency
Return score components:
- lexical score
- semantic score
- rerank score
- fusion score
- reason codes (`exact-anchor`, `recent-decision`, `high-entity-overlap`)

This makes debugging and trust better.

## 3.4 Warm cache and lifecycle policy
From `qmd` daemon behavior:
- Keep heavy contexts warm.
- Idle-dispose strategy with transparent rehydrate.
- Emit “cold-start penalty” telemetry.

---

## 4) Prioritized Implementation Strategies (Impact/Effort)

1. **P1: Add `fast/deep/auto` query modes + simple fusion**
- Impact: High
- Effort: Medium
- Why: Immediate UX gain and token reduction.

2. **P1: Add lifecycle tools (`list/delete/prune/status`)**
- Impact: High
- Effort: Low-Medium
- Why: Operational control and safer long-term memory hygiene.

3. **P1: Add `memory_continue` anchored summary**
- Impact: High
- Effort: Medium
- Why: Solves session-reset pain highlighted by Artem signal.

4. **P2: Introduce async indexing + job status**
- Impact: Medium-High
- Effort: Medium
- Why: Prevents blocking on large histories/specs.

5. **P2: Add score explainability and provenance fields**
- Impact: Medium
- Effort: Medium
- Why: Improves auditability and debugging.

6. **P3: Add graph-style relation layer between memory entries**
- Impact: High (long-term)
- Effort: High
- Why: Enables richer reasoning but larger migration scope.

---

## 5) Risks and Considerations

- **Complexity creep**: Hybrid retrieval can become hard to tune.
- **Latency regressions**: Deep path may degrade UX if overused.
- **Schema lock-in**: Overly rigid memory types can hinder evolution.
- **Deletion semantics**: Hard delete can break traceability if not versioned.
- **Maintenance burden**: More modes/tools means higher test matrix.
- **Model/runtime coupling**: Keep embeddings/rerank pluggable to avoid dependency fragility.

Mitigations:
- Start with feature flags.
- Default to `fast` for simple queries.
- Add offline eval set before enabling deep path globally.
- Keep append-only event log for memory mutations.

---

## 6) Specific Code Patterns/Techniques to Leverage

## 6.1 Retrieval fusion skeleton
```python
# pseudo-code
results_lex = lexical_search(q)
results_sem = vector_search(q_expanded)
rrf = reciprocal_rank_fusion([results_lex, results_sem], k=60)
rrf = apply_top_rank_bonus(rrf)
candidates = top_k(rrf, 30)
reranked = rerank(candidates, q)
final = position_aware_blend(rrf, reranked)
return final
```

## 6.2 Tool surface design
```json
{
  "tools": [
    "memory_search_fast",
    "memory_search_deep",
    "memory_continue",
    "memory_get",
    "memory_list_data",
    "memory_delete",
    "memory_prune",
    "memory_index_start",
    "memory_index_status",
    "memory_health"
  ]
}
```

## 6.3 Continuity snapshot payload
```json
{
  "spec_folder": "specs/123-example",
  "state": "...",
  "decisions": ["..."],
  "next_steps": ["..."],
  "open_risks": ["..."],
  "evidence_refs": ["mem_01ab23", "mem_9fd210"],
  "generated_at": "2026-03-03T10:15:00Z"
}
```

---

## 7) Migration / Adoption Pathways

1. **Phase 0 (1-2 weeks): Baseline + telemetry**
- Add query timing and retrieval diagnostics.
- Build small golden set of real speckit memory queries.

2. **Phase 1 (2-3 weeks): Fast lane + lifecycle ops**
- Implement lexical retrieval and ops tools.
- Add `memory_continue` using existing memory content.

3. **Phase 2 (3-4 weeks): Deep lane + fusion**
- Add vector retrieval and reranking.
- Gate with flag; compare against baseline metrics.

4. **Phase 3 (2-4 weeks): Async pipelines + daemon mode**
- Index jobs, status polling, warm cache service mode.
- Add HTTP health checks and client connection docs.

5. **Phase 4 (ongoing): Relation graph + advanced reasoning**
- Introduce memory edge types.
- Add query modes by intent (decision/risk/evidence focus).

---

## Sources
- `qmd` repository + README architecture and pipeline details: https://github.com/tobi/qmd  
- `qmd` package dependencies/scripts: https://github.com/tobi/qmd/blob/main/package.json  
- `cognee` repository + quickstart pipeline: https://github.com/topoteretes/cognee  
- Cognee MCP article: https://www.cognee.ai/blog/cognee-news/introducing-cognee-mcp  
- Cognee MCP directory snapshot (tools/transports): https://mcpindex.net/en/mcpserver/topoteretes-cognee  
- Cognee pyproject dependency snapshot: https://glama.ai/mcp/servers/%40topoteretes/cognee/blob/18dcab3caccbd4e18c2b50bbef244ab2d3749853/pyproject.toml  
- Referenced X post URL: https://x.com/artemxtech/status/2028330693659332615?s=46  
- Mirror used when X content was inaccessible: https://www.linkedin.com/posts/artemxtech_every-conversation-with-claude-code-starts-activity-7433332745063374848-5i-8
