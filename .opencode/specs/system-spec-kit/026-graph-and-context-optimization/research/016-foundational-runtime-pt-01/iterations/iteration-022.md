# Iteration 22 — Domain 2: State Contract Honesty (2/10)

## Investigation Thread
I re-checked the five requested seams against Iterations 001-020 and the Phase 015 review, then kept only additive consumer-level findings. This pass focused on where already-known state collapse is amplified downstream: ambiguous graph-readiness state being promoted into contradictory query payloads, and graph-metadata fallback being promoted into pristine quality/ranking signals.

## Findings

### Finding R22-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
- **Lines:** `61-83, 94-99, 319-364, 551-564`
- **Severity:** P1
- **Description:** `code_graph_query` can emit a self-contradictory success payload when readiness preflight fails or is indistinguishable from a truly empty graph. The handler seeds `readiness` with `freshness: 'empty'` / `reason: 'readiness check not run'`, swallows every `ensureCodeGraphReady(...)` exception, and still serializes `status: "ok"` payloads. At the same time, `buildGraphQueryPayload(...)` injects the DB-global `last_detector_provenance`, so the same payload can simultaneously say "empty / preflight not run" and `graphMetadata.detectorProvenance = "structured"`.
- **Evidence:** `handleCodeGraphQuery()` initializes `readiness` to `{ freshness: 'empty', action: 'none', inlineIndexPerformed: false, reason: 'readiness check not run' }` and discards thrown readiness errors in an empty `catch` (`handlers/code-graph/query.ts:319-334`). Success responses for outline/edge queries still flow through `buildGraphQueryPayload(...)` (`handlers/code-graph/query.ts:343-364,551-564`), which unconditionally adds `graphMetadata.detectorProvenance: graphDb.getLastDetectorProvenance() ?? 'unknown'` (`handlers/code-graph/query.ts:94-99`). The structural-trust mapper only has explicit `fresh` and `stale` branches, so this failure/empty path drops into the same generic `unknown` trust triple (`handlers/code-graph/query.ts:61-83`). `ensureCodeGraphReady()` itself uses `empty` as the canonical "graph absent" state (`lib/code-graph/ensure-ready.ts:106-123`), so the handler's failure default is observationally aligned with a real empty graph. Existing tests only pin the fresh happy path with `getLastDetectorProvenance() === 'structured'` and never exercise thrown readiness or the mixed-state response (`tests/code-graph-query-handler.vitest.ts:63-84`, `tests/graph-payload-validator.vitest.ts:48-86`).
- **Downstream Impact:** Query consumers cannot reliably distinguish "run an initial/full scan" from "readiness preflight failed before query execution," and they can over-trust the result as AST/structured output because the top-level provenance field still advertises the last successful detector. That makes the MCP payload dishonest on exactly the boundary agents use to decide whether structural evidence is usable or whether they need to repair the graph first.

### Finding R22-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`
- **Lines:** `293-330`
- **Severity:** P1
- **Description:** Once `graph-metadata` content survives `validateGraphMetadataContent(...)` — including via the already-documented legacy/schema-recovery path — `memory-parser` upgrades it to a perfect-quality artifact with `qualityScore: 1` and `qualityFlags: []`. Downstream save, ranking, and graph-lifecycle code then treats that recovered metadata as high-confidence evidence rather than as migrated or degraded state.
- **Evidence:** The graph-metadata parse branch trusts any successful validator output and returns a parsed document with `qualityScore: 1` and `qualityFlags: []` (`lib/parsing/memory-parser.ts:293-330`). The validator success path still includes the fallback acceptance seam already documented in earlier iterations (`lib/graph/graph-metadata-parser.ts:223-233`), and the direct schema suite only asserts that legacy content is accepted — not that it should carry any downgrade marker (`tests/graph-metadata-schema.vitest.ts:223-245`). That "perfect" quality is then persisted into save/index state (`handlers/save/create-record.ts:316-360`), multiplied into fusion scoring (`lib/search/pipeline/stage2-fusion.ts:232-246`), and used as the gate for LLM graph backfill scheduling (`lib/search/graph-lifecycle.ts:577-583`).
- **Downstream Impact:** Fallback-migrated or partially recovered `graph-metadata.json` files are not merely accepted; they can receive a quality bonus in search ranking and qualify for expensive graph-enrichment work as if they were pristine current-schema artifacts. That turns a state-recovery seam into a state-promotion seam: recovered metadata is surfaced more confidently than its provenance warrants.

## Novel Insights
The additive risk in this domain is no longer the raw collapse itself; those core seams were already captured in Iterations 001-010 and 018-020. The still-under-reviewed problem is **state promotion**: downstream layers take ambiguous or recovered state and strengthen it into authoritative-looking signals (`structured` detector provenance on ambiguous query payloads, `qualityScore: 1` on recovered graph metadata).

Re-checking the prompt-targeted `post-insert.ts`, `shared-payload.ts`, and `hook-state.ts` slices did not surface a new non-duplicate defect beyond earlier iterations. Their main value in this pass was as upstream context that explains why these two consumer layers are still able to lie more confidently than their inputs deserve.

## Next Investigation Angle
Stay on consumer promotion surfaces. The next pass should trace where bootstrap/resume/OpenCode transport code prefers top-level provenance and quality signals over lower-level trust axes or migration context, especially around `session-bootstrap.ts`, `session-resume.ts`, `opencode-transport.ts`, and search-result explainability.
