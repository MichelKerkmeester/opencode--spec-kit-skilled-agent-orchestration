# Iteration 3 — Code-Graph Query Truthfulness (3/10)

## Investigation Thread
Candidate **M3**: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`, with focus on whether the runtime truthfully reports subject resolution, readiness state, and aggregate edge trust to downstream callers.

## Findings

### Finding R3-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
- **Lines:** `42-58`
- **Severity:** P1
- **Description:** `resolveSubject()` silently picks the first `fq_name` or `name` match with `LIMIT 1`, but the backing `code_nodes` schema does not enforce uniqueness on either column. Any caller that passes a human-readable name instead of a stable `symbol_id` can therefore query an arbitrary symbol with no ambiguity signal.
- **Evidence:** The handler resolves `fq_name` and then `name` via `SELECT symbol_id FROM code_nodes WHERE fq_name = ? LIMIT 1` / `... WHERE name = ? LIMIT 1` (`query.ts:50-56`). The schema only declares `symbol_id` as unique; `fq_name` and `name` are plain indexed text columns (`lib/code-graph/code-graph-db.ts:68-84,105-109`). The dedicated test suite stubs a single synthetic match and never exercises multi-match resolution (`tests/code-graph-query-handler.vitest.ts:37-50,66-107`).
- **Downstream Impact:** `code_graph_query` can return callers/importers for the wrong symbol when agents ask about a common function or class name, which contaminates structural context, blast-radius reasoning, and any follow-on MCP workflow that trusts the returned `symbolId`.

### Finding R3-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
- **Lines:** `319-334`
- **Severity:** P1
- **Description:** The readiness gate fails open: any `ensureCodeGraphReady()` exception is swallowed, and the handler continues with a default `readiness` object that looks like a benign empty graph state rather than a failed precondition.
- **Evidence:** `handleCodeGraphQuery()` initializes `readiness` to `{ freshness: 'empty', action: 'none', inlineIndexPerformed: false, reason: 'readiness check not run' }` and then discards every thrown readiness error in an empty `catch` block (`query.ts:319-334`). The returned payload still reports `status: 'ok'` for outline/edge queries (`query.ts:343-364,420-437,551-567`). The only direct readiness assertion in tests is the successful path; no case checks thrown readiness errors or degraded payload signaling (`tests/code-graph-query-handler.vitest.ts:12-18,74-84`).
- **Downstream Impact:** Callers cannot distinguish "graph unavailable or readiness check failed" from "graph is empty/stale but usable," so recovery logic and operators may treat infrastructure faults as genuine no-result answers.

### Finding R3-003
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
- **Lines:** `551-564`
- **Severity:** P2
- **Description:** Response-level edge trust is derived exclusively from `result.edges[0]`, so heterogeneous edge sets are summarized using the first edge's `edgeEvidenceClass` and `numericConfidence` even when later edges carry different provenance or confidence.
- **Evidence:** The final payload builder passes only `result.edges[0]` into `buildGraphQueryPayload(..., graphEdgeEnrichment)` (`query.ts:551-564`). That top-level enrichment becomes the payload's aggregate `edgeEvidenceClass` / `numericConfidence`, while individual edges may differ (`query.ts:447-459,474-486,501-512,527-538`). The test suite validates only a single-edge happy path and therefore never exposes mixed-edge summaries (`tests/code-graph-query-handler.vitest.ts:109-146`).
- **Downstream Impact:** UIs and agents that read only the payload-level trust metadata can over-trust or misclassify an entire result set, especially when direct-call and inferred/heuristic edges are returned together.

## Novel Insights
- Packet 015 hit `context-server` and coverage-graph trust/reporting seams, but it did not directly audit `handlers/code-graph/query.ts`; this iteration shows that the live structural-query surface has its own truthfulness gaps around symbol identity, readiness failure signaling, and aggregate edge metadata.
- The dedicated handler test file exists, but it is narrowly shaped around single-match, ready-state, single-edge fixtures. That means this surface is under-protected specifically at the ambiguity and mixed-result seams that agents are most likely to hit in real repositories.

## Next Investigation Angle
Stay on the code-graph runtime seam and audit `lib/code-graph/ensure-ready.ts` plus `lib/code-graph/code-graph-db.ts` for whether readiness/status contracts and large-graph query helpers give callers any way to distinguish stale, missing, failed, and partially indexed graph states.
