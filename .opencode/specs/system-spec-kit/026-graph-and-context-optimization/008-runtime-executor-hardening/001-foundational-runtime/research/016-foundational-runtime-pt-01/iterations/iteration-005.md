# Iteration 5 — Ensure-ready contract honesty (5/10)

## Investigation Thread
I followed Iteration 3's next step and audited the readiness primitive behind structural graph lookups: `lib/code-graph/ensure-ready.ts`, its persistence path in `lib/code-graph/code-graph-db.ts`, and the direct tests that define the current contract. The focus was whether inline refreshes are reported truthfully to downstream `code_graph_query` / `code_graph_context` consumers.

## Findings

### Finding R5-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts`
- **Lines:** `283-317`
- **Severity:** P1
- **Description:** A successful inline refresh still reports the graph's *pre-refresh* freshness. Both the full-scan and selective-reindex success branches set `inlineIndexPerformed: true` but keep `freshness: state.freshness`, so a graph that was just repaired continues to be labeled `stale` or `empty` in the returned `ReadyResult`.
- **Evidence:** `ensure-ready.ts:283-317` sets `inlineIndexPerformed: true` while preserving `freshness: state.freshness`. The direct tests lock this in: `tests/ensure-ready.vitest.ts:184-189` and `206-214` both expect `freshness` to remain `'stale'` even after successful inline reindex. Downstream, `handlers/code-graph/query.ts:61-82,328-361,423-433` converts `fresh` into confirmed/live trust but downgrades `stale` to probable/stale and `empty` to unknown; `handlers/code-graph/context.ts:96-105,169-194` also forwards the same readiness object in successful payloads.
- **Downstream Impact:** Structural queries can return freshly reindexed caller/import graphs while simultaneously branding them as stale/unknown, which makes agents and operators discount graph results that were actually repaired moments earlier. This also pollutes any bootstrap or routing flow that recommends `code_graph_query` as the structural authority but trusts the readiness metadata to judge freshness.

### Finding R5-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts`
- **Lines:** `183-217`
- **Severity:** P1
- **Description:** Partial persistence failures are silently treated as a successful refresh path. `indexWithTimeout()` swallows per-file persistence exceptions, while `upsertFile()` has already stamped `file_mtime_ms` and `indexed_at` before `replaceNodes()` / `replaceEdges()` run. The outer success path can then advance Git head state and report `inlineIndexPerformed: true`, even though one or more files never finished indexing.
- **Evidence:** `code-graph-db.ts:262-291` updates `file_mtime_ms` and `indexed_at` in `upsertFile()` before `replaceNodes()` / `replaceEdges()` mutate graph contents (`295-347`). `ensure-ready.ts:199-212` catches persistence errors per result item and merely comments `Best-effort: skip files that fail to persist`; it does not surface a count or fail the refresh. The outer success branches at `283-317` still call `setLastGitHead()` and return `inlineIndexPerformed: true`. Subsequent stale detection compares only stored vs current mtimes (`code-graph-db.ts:361-385`), so a file whose metadata row was updated before node/edge failure can now look fresh and avoid reindex. The direct tests cover only all-success cases (`tests/ensure-ready.vitest.ts:173-214`) and never simulate `upsertFile`, `replaceNodes`, or `replaceEdges` throwing.
- **Downstream Impact:** A structurally broken file can be dropped from the graph while the runtime records the refresh as completed, suppressing automatic retry until the file changes again or an operator forces a broader scan. That yields silent false negatives in caller/import/blast-radius results for exactly the files that failed to persist.

## Novel Insights
Iteration 3 showed that `code_graph_query` fails open at the handler layer, but this pass found the deeper source: `ensureCodeGraphReady()` itself reports success with misleading state. The tests are not merely missing the bug; they currently codify one half of it by asserting `freshness: 'stale'` after successful inline reindex, which makes the contract drift stable and review-resistant.

## Next Investigation Angle
Stay on the code-graph runtime seam and inspect whether `ensure-ready`'s debounce/cache behavior can replay stale readiness across successive calls, especially when `code_graph_query` and `code_graph_context` hit the primitive back-to-back with different graph states.
