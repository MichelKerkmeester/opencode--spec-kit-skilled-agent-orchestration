# Iteration 18 — Domain 1: Silent Fail-Open Patterns (8/10)

## Investigation Thread
I re-ran the requested seams after deduplicating against Iterations 003, 007, 008, and 011-017 plus the Phase 015 review. The obvious success-shaped branches in `session-stop.ts`, `reconsolidation-bridge.ts`, and `post-insert.ts` now look exhausted for new non-duplicate findings, so this pass narrowed to two residual truth-loss angles that earlier iterations had not called out: query-level provenance drift in `code-graph/query.ts`, and validation-diagnostic drift in `graph-metadata-parser.ts`.

## Findings

### Finding R18-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
- **Lines:** `94-99, 551-565`
- **Severity:** P2
- **Description:** Query-level detector provenance silently degrades from per-result truth into a global last-index snapshot. Trigger: the code graph contains mixed detector provenance, or the last indexing run used a different detector mix than the specific edges returned for this query. Caller perception: `data.graphMetadata.detectorProvenance` describes the provenance of the current query result. Reality: `buildGraphQueryPayload()` pulls a singleton `last_detector_provenance` value from graph metadata, so the top-level payload can advertise `structured` or `ast` even when the returned edges themselves are marked `heuristic`.
- **Evidence:** `buildGraphQueryPayload()` always injects `graphMetadata.detectorProvenance: graphDb.getLastDetectorProvenance() ?? 'unknown'` before serializing the final query payload [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:94-99,551-565`]. The underlying DB helper reads that from a single metadata key, not from the returned edges or nodes [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:213-223`]. The direct handler test already encodes the mismatch: it expects top-level `graphMetadata.detectorProvenance` to be `structured` while the returned edge itself carries `detectorProvenance: 'heuristic'` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:109-145`].
- **Downstream Impact:** Any UI, agent, or routing logic that reads only the top-level query metadata can over-trust heuristic or inferred edges as if the whole result set came from a higher-confidence detector. The blast radius is every `code_graph_query` consumer that uses payload-level provenance to decide whether structural evidence is safe to trust without inspecting every returned edge.

### Finding R18-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- **Lines:** `228-242`
- **Severity:** P2
- **Description:** Legacy fallback also silently degrades validation diagnostics. Trigger: current-schema validation fails, `parseLegacyGraphMetadataContent(content)` still extracts enough `Packet:` / `Spec Folder:` style fields to build a legacy candidate, and that legacy candidate then fails schema validation. Caller perception: the returned errors explain why the checked-in `graph-metadata.json` is invalid. Reality: the parser discards the original current-schema failure details and returns only the legacy-path Zod errors, so a broken modern JSON payload can be misdiagnosed as a legacy-shape problem.
- **Evidence:** After any primary parse/validation failure, `validateGraphMetadataContent()` immediately tries `parseLegacyGraphMetadataContent(content)` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:223-233`]. If the legacy candidate exists but fails schema validation, the function returns only `formatZodError(legacyError)` and never includes the original `error` details from the current-schema parse [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:234-242`]. The direct tests cover the two end states separately - modern malformed payload rejection and fully accepted legacy content - but do not cover this mixed fallback path where the diagnostic payload itself becomes misleading [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:208-245`].
- **Downstream Impact:** Repair tooling and operators can chase the wrong validation failure, treating a broken modern `graph-metadata.json` as if it were merely a bad legacy payload. That increases mean-time-to-repair for invalid packet metadata and can leave stale or corrupt graph metadata in circulation longer than the raw parser failure warranted.

## Novel Insights
- The remaining additive risk in this domain is now mostly **diagnostic truth loss**, not new warning-only happy-path branches. Earlier iterations already exhausted the main "work failed but payload says ok" seams; the new gaps are places where the runtime still returns a structured answer, but the explanation attached to that answer is no longer about the actual thing that failed.
- `code-graph/query.ts` still has one unreported split-brain contract: per-edge provenance can be truthful while the payload-level provenance remains a global stale summary. That is adjacent to Iteration 3's first-edge trust collapse, but it is a different authority bug.
- Re-checking the other requested slices did not produce new non-duplicate findings: `session-stop.ts:85-101,199-218`, `reconsolidation-bridge.ts:283-294`, and `post-insert.ts` continue to reconfirm earlier Iterations 007, 008, and 011-017 rather than yielding new fail-open branches.

## Next Investigation Angle
Stay in Domain 1, but shift from the low-level seams to their first consumer layers: which callers of `code_graph_query` actually read `data.graphMetadata.detectorProvenance` instead of per-edge provenance, and which graph-metadata repair/export paths rely on `validateGraphMetadataContent()` error text when deciding whether a packet is broken, stale, or merely legacy.
