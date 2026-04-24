# Iteration 19 — Domain 1: Silent Fail-Open Patterns (9/10)

## Investigation Thread
I re-read the requested runtime seams after Iterations 011-017 and the Phase 015 review, but shifted the angle to residual sub-branches that earlier passes had not named directly: transitive code-graph traversal and the assistive reconsolidation advisory lane. The previously documented `session-stop.ts`, `graph-metadata-parser.ts`, and `post-insert.ts` fail-open paths still held on recheck, but they did not produce additive non-duplicate findings this round.

## Findings

### Finding R19-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
- **Lines:** `127-166, 417-436`
- **Severity:** P2
- **Description:** Transitive graph queries silently degrade dangling graph edges into successful-looking traversal nodes. Trigger: `transitiveTraversal()` follows an edge whose source/target node row no longer exists. Caller perception: `code_graph_query` found a real transitive dependency chain with sparse metadata. Reality: the code graph is internally inconsistent, but the handler serializes the orphaned symbol with `fqName`, `filePath`, and `line` set to `null` and still returns `status: "ok"`.
- **Evidence:** `transitiveTraversal()` pushes result rows with `targetNode?.fqName ?? null`, `targetNode?.filePath ?? null`, and `targetNode?.startLine ?? null` (and the symmetric `sourceNode` fallbacks) at `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:127-166`. The DB layer explicitly permits those null joins by returning `{ edge, targetNode: null }` / `{ edge, sourceNode: null }` when the node lookup misses at `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:503-507,521-525`. The transitive branch then returns that payload unchanged inside `status: "ok"` at `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:417-436`. Direct coverage only locks the happy path where the traversed node exists: `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:87-107`.
- **Downstream Impact:** Agents and operators doing transitive caller/import tracing can treat orphaned symbol IDs as authoritative dependencies instead of as graph corruption or reindex debt, which pollutes structural debugging and blast-radius reasoning.

### Finding R19-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- **Lines:** `453-511, 514-518`
- **Severity:** P2
- **Description:** Assistive reconsolidation failures fail open into an ordinary save with no machine-readable signal that the advisory lane broke. Trigger: assistive `vectorSearch()`, scope matching, or recommendation construction throws. Caller perception: there simply was no assistive reconsolidation hint for this save. Reality: the advisory lane errored and was discarded; the bridge logs a warning, returns `earlyReturn: null`, leaves `assistiveRecommendation` as `null`, and does not add a caller-visible warning entry.
- **Evidence:** The assistive branch wraps the whole advisory flow in a `try/catch` at `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:453-511`. The catch only emits `console.warn('[reconsolidation-bridge] assistive reconsolidation error (proceeding with normal save): ...')` at lines `505-509`; it never appends that failure to `reconWarnings`. The function then falls through to the default return shape at lines `514-518`, so callers see `earlyReturn: null`, `warnings: reconWarnings`, and `assistiveRecommendation: null` as if no advisory candidate existed. Coverage only exercises helper defaults and positive advisory tiers, not a thrown assistive-path branch: `.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:17-52` and `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-reconsolidation.vitest.ts:123-195`.
- **Downstream Impact:** `memory_save` responses can lose near-duplicate review guidance without surfacing that the assistive mechanism failed, so operators and automation see “no recommendation” instead of “recommendation path degraded.”

## Novel Insights
- The requested slices are close to exhausted: after rechecking the actual source and prior writeups, I did **not** find a distinct new fail-open path in `session-stop.ts:85-101,199-218`, `graph-metadata-parser.ts:223-255`, `reconsolidation-bridge.ts:283-294`, or the already-cataloged `post-insert.ts` status-collapse branches.
- The remaining additive risk is now mostly in **sub-branches behind success-shaped wrappers**: transitive graph traversal inherits the one-hop dangling-edge problem, and assistive reconsolidation inherits the main save lane’s “warning-only degradation” pattern.
- Test coverage is still strongest on happy-path proof and weakest exactly where these residual truth-loss seams live: valid transitive queries and successful assistive recommendations are covered, but degraded internal-state branches are not.

## Next Investigation Angle
Trace the first consumer layer above these residual seams: which `code_graph_context` or MCP callers trust transitive nodes with null provenance fields, and which `memory_save` response builders or follow-up APIs distinguish “no assistive recommendation” from “assistive recommendation path failed.”
