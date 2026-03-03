# Document 2: Actionable Recommendations for System-SpecKit and the Spec-Kit Memory MCP Server

## Executive Summary
The highest-value roadmap is to combine:

- QMD’s typed retrieval and performance-aware hybrid search patterns,
- Cognee’s long-running pipeline and multi-transport MCP strategy,
- [Assumes: ArtemXTech’s context-discipline mindset] for just-in-time memory loading.

Recommended direction: evolve Spec-Kit Memory MCP into a **contract-driven, hierarchical-memory retrieval service** with **typed query plans**, **warm server mode**, and **explicit async ingestion/status workflows**.

---

## 1. Applicable Patterns for Your Use Case

### 1.1 Typed query plan (`lex`, `vec`, `hyde`) for memory retrieval
Adopt a query-document contract similar to QMD:

- `lex`: exact identifiers (`spec folder`, `task id`, filenames).
- `vec`: semantic retrieval for vague natural-language asks.
- `hyde`: hypothetical-answer expansion for sparse knowledge.

Concrete example (MCP tool input):
```json
{
  "searches": [
    { "type": "lex", "query": "\"Gate 3\" checklist spec folder" },
    { "type": "vec", "query": "how does spec kit handle continuation memory" }
  ],
  "scope": ["specs/"]
}
```

Why:
- Prevents ambiguous “search” behavior.
- Gives the orchestrating model deterministic control.

Reference inspiration:
- [qmd MCP query tool](https://github.com/tobi/qmd/blob/main/src/mcp.ts)
- [qmd query grammar](https://github.com/tobi/qmd/blob/main/docs/SYNTAX.md)

### 1.2 Split tool surface by intent
Implement distinct MCP tools:

- `memory_query` (ranked retrieval)
- `memory_get` (single item/document retrieval)
- `memory_multi_get` (batch retrieval with guardrails)
- `memory_status` (index health, stale data, pending jobs)

This mirrors qmd and dramatically improves model tool routing.

### 1.3 Async memory ingestion with status checks
Borrow cognee’s background-task pattern:

- `memory_ingest_start` returns job id quickly.
- `memory_ingest_status(job_id)` exposes progress/errors.
- `memory_ingest_cancel(job_id)` for control and safety.

Why:
- Avoids MCP timeout failures on large saves/re-indexing.
- Enables reliable UX in IDE/agent workflows.

Reference inspiration:
- [cognee-mcp async cognify pattern](https://github.com/topoteretes/cognee/blob/main/cognee-mcp/src/server.py)

---

## 2. Integration Opportunities

### 2.1 Introduce hierarchical context inheritance
Model your context like qmd collections/paths:

- Global context (org-wide rules).
- Spec-level context (`specs/NNN-*`).
- Phase-level context (`001-phase`).
- File-level context overrides.

At query time, aggregate nearest-to-root or nearest-to-leaf based on retrieval objective.

### 2.2 Add warm HTTP MCP mode
Keep index and embedding/reranker components warm in a long-lived process.

- `stdio` mode for local ephemeral use.
- `http` mode for shared daemon usage in team/dev tooling.

This reduces repeat startup costs and improves consistent latency.

### 2.3 Dual mode: direct vs API-backed memory provider
Follow cognee’s “direct mode vs API mode” concept.

- Direct mode for local quick iteration.
- API mode for centralized audited memory infrastructure.
- Explicitly document feature parity gaps if any.

---

## 3. Architecture Improvements to Adopt

### 3.1 Retrieval cost governor (high impact, low-medium effort)
Implement a staged policy:

1. Fast lexical probe.
2. If confidence high, skip expansion/rerank.
3. Else run semantic + expansion path.
4. Candidate cap before reranking.

Benefits:
- Lower latency and token/compute costs.
- Better predictability.

### 3.2 Memory schema contracts (high impact, medium effort)
Standardize returned structure:
```json
{
  "id": "mem_abc123",
  "spec_path": "specs/012-feature/plan.md",
  "kind": "decision|task|state|rule",
  "score": 0.87,
  "context": "phase-001",
  "excerpt": "...",
  "line_start": 42
}
```
This allows downstream agents to reason over fields, not only prose blobs.

### 3.3 Deterministic retrieval traces (medium impact, low effort)
Return a compact trace:

- which retrieval types ran,
- which were skipped,
- why item was ranked (feature contributions),
- stale/index warnings.

This improves debugging and operator trust.

---

## 4. Prioritized Implementation Strategy (Impact/Effort)

### Phase 1 (2-3 weeks): Core MCP contract hardening
1. Add tool split (`query/get/multi_get/status`).
2. Add typed query schema (`lex/vec/hyde`).
3. Add structured result payload with stable IDs.
4. Add basic health/status output.

Expected impact: immediate reliability and model-tool usability boost.

### Phase 2 (3-5 weeks): Retrieval quality + latency controls
1. Implement lexical strong-signal short-circuit.
2. Add candidate caps and blending strategy.
3. Add path-context inheritance merge.
4. Add warning tips (stale index, missing metadata).

Expected impact: better speed/quality tradeoff and fewer irrelevant recalls.

### Phase 3 (4-6 weeks): Operational resilience
1. Background ingestion job system.
2. Job status/cancel tools.
3. HTTP daemon mode with warm caches/models.
4. Direct/API mode abstraction layer.

Expected impact: production-grade behavior under load and long-running usage.

---

## 5. Risks and Considerations

1. **Complexity creep from over-adopting Cognee-like breadth**  
Mitigation: keep MVP narrow (spec memory only), add providers incrementally.

2. **Schema churn and compatibility issues**  
Mitigation: version MCP tool contracts (`v1`, `v1.1`) and preserve aliases during transition.

3. **Relevance regressions with hybrid ranking tweaks**  
Mitigation: build evaluation set from real spec-kit queries; track hit@k and “time-to-correct-context.”

4. **Operational drift between stdio and HTTP modes**  
Mitigation: force both transports through one shared retrieval pipeline module.

5. **Assumption risk from unavailable X post details**  
Mitigation: treat Artem-derived items as optional until the exact post is validated.

---

## 6. Concrete Code Patterns to Leverage

### 6.1 Dynamic server instructions at initialization
Generate concise memory index overview at MCP initialize time (counts, scopes, stale flags).  
Inspiration: qmd `buildInstructions(...)` in MCP server.

### 6.2 Query grammar parser
Use strict parsing for query documents so retrieval routing is deterministic and testable.

### 6.3 “Small safe batch” retrieval defaults
For `multi_get`, enforce default max bytes/line constraints and explicit truncation notices.

### 6.4 Structured status endpoint/tool
Expose:

- item counts by scope,
- last update timestamp,
- pending ingestion jobs,
- missing metadata/coverage.

---

## 7. Migration / Adoption Pathway

1. **Introduce new tools in parallel**  
Keep legacy `search` while adding `memory_query` etc.

2. **Add compatibility shim**  
Map old search input to typed query internally (`legacy -> vec` default).

3. **Instrument and compare**  
Log old vs new retrieval precision, latency, and follow-up correction rate.

4. **Flip default gradually**  
After quality threshold met, route default calls to typed pipeline; keep old alias for one release cycle.

5. **Deprecate legacy endpoint**  
Emit explicit warnings and migration hints.

---

## 8. Assumptions Register
- [Assumes: Current system-spec-kit memory MCP server uses a primarily untyped search interface.]
- [Assumes: Spec folders and phase paths are stable enough to serve as retrieval hierarchy anchors.]
- [Assumes: The referenced ArtemXTech post advocates context discipline/on-demand loading; exact content was not retrievable in this environment.]

---

## 9. References
- https://github.com/topoteretes/cognee
- https://github.com/topoteretes/cognee/blob/main/cognee-mcp/src/server.py
- https://github.com/topoteretes/cognee/blob/main/cognee-mcp/README.md
- https://github.com/topoteretes/cognee/blob/main/pyproject.toml
- https://github.com/tobi/qmd
- https://github.com/tobi/qmd/blob/main/src/mcp.ts
- https://github.com/tobi/qmd/blob/main/src/store.ts
- https://github.com/tobi/qmd/blob/main/src/qmd.ts
- https://github.com/tobi/qmd/blob/main/docs/SYNTAX.md
- https://github.com/tobi/qmd/blob/main/CHANGELOG.md
- https://github.com/tobi/qmd/blob/main/package.json
- https://x.com/artemxtech/status/2028330693659332615?s=46

If you want, I can convert these recommendations into a concrete implementation backlog for your repo format (`spec.md`, `plan.md`, `tasks.md`) with milestone-level acceptance criteria.
