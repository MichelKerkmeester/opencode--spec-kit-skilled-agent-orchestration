# Iteration 20 — Domain 1: Silent Fail-Open Patterns (10/10)

## Investigation Thread
I re-read the five requested seams against Iterations 011-017 and the Phase 015 review, then only kept residual fail-open paths that were still additive. This pass focused on second-order truth loss: places where the runtime still returns a healthy-looking object, but the metadata inside that object can silently drift away from the underlying reality.

## Findings

### Finding R20-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- **Lines:** `199-218, 248-268`
- **Severity:** P1
- **Description:** Producer metadata can silently describe a different transcript state than the one that was actually parsed. Trigger: the transcript file is appended to or touched after `parseTranscript(...)` finishes but before `buildProducerMetadata(...)` runs. Caller perception: `producerMetadataWritten === true` means the stored transcript fingerprint, `lastClaudeTurnAt`, and cache-token evidence describe the same stop-event snapshot as the parsed token totals and offset. Reality: `usage` / `newOffset` come from the earlier parse, while `buildProducerMetadata()` re-stats the live file and stamps `lastClaudeTurnAt`, `sizeBytes`, `modifiedAt`, and `fingerprint` from the later filesystem state.
- **Evidence:** `processStopHook()` parses the transcript first (`session-stop.ts:248-252`), then writes `lastTranscriptOffset: newOffset` and `producerMetadata: buildProducerMetadata(...)` in the same patch (`session-stop.ts:261-268`). `buildProducerMetadata()` does a fresh `statSync(transcriptPath)` and derives both `lastClaudeTurnAt` and the fingerprint from `transcriptStat.mtimeMs` / `transcriptStat.size` (`session-stop.ts:199-206`). Downstream, `session-resume` treats `producerMetadata.lastClaudeTurnAt` and the transcript fingerprint as hard freshness/fidelity gates (`handlers/session-resume.ts:231-298`). Coverage only exercises stable replay fixtures and synthetic happy-path metadata; it never mutates the transcript between parse and metadata capture (`tests/hook-session-stop-replay.vitest.ts:14-56`, `tests/session-resume.vitest.ts:163-202`).
- **Downstream Impact:** A valid cached summary can be rejected as `summary_precedes_producer_turn` or `transcript_identity_mismatch`, and analytics consumers can ingest a producer snapshot whose identity no longer matches the token/cursor state that was actually parsed. The blast radius is the entire Claude stop-hook continuity lane plus any analytics or resume flow that trusts `producerMetadata` as a coherent snapshot.

### Finding R20-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- **Lines:** `167-205, 223-233`
- **Severity:** P2
- **Description:** Legacy fallback silently re-dates obsolete graph metadata as freshly saved current metadata. Trigger: modern JSON validation fails, but `parseLegacyGraphMetadataContent(...)` succeeds. Caller perception: `validateGraphMetadataContent()` returned a normal current-schema payload, so the packet's derived timestamps reflect real packet history. Reality: the legacy parser fabricates `created_at` and `last_save_at` from `new Date().toISOString()` at validation time, then `validateGraphMetadataContent()` returns `{ ok: true, metadata, errors: [] }` with no migration marker.
- **Evidence:** `parseLegacyGraphMetadataContent()` creates `nowIso` and assigns it to both `derived.created_at` and `derived.last_save_at` (`graph-metadata-parser.ts:167-205`). The validator then returns that migrated object as a clean success result when the legacy parse passes (`graph-metadata-parser.ts:223-233`). `memory-parser` immediately trusts that success path for `graph_metadata` documents and indexes the returned metadata without any legacy/freshness caveat (`lib/parsing/memory-parser.ts:293-320`). The direct schema suite only asserts that legacy content is accepted and checks packet/link fields; it does not assert or constrain the fabricated timestamps (`tests/graph-metadata-schema.vitest.ts:223-245`).
- **Downstream Impact:** Stale legacy packets can be surfaced as if they were freshly saved today, which distorts packet recency signals and erases the original age of the metadata during indexing, review triage, and any tooling that treats validated graph metadata as an authoritative freshness surface.

### Finding R20-003
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
- **Lines:** `94-105, 551-564`
- **Severity:** P2
- **Description:** Payload-level detector provenance silently overstates how trustworthy a specific query result is. Trigger: any query result is wrapped by `buildGraphQueryPayload(...)` after the graph DB's global `last_detector_provenance` was set by a previous scan, including empty, dangling-edge, or otherwise degraded results. Caller perception: `data.graphMetadata.detectorProvenance` describes the provenance of the returned outline/edge set. Reality: the handler injects a global database-level provenance marker, not result-specific provenance, so a degraded or empty query can still advertise `structured` or `ast`.
- **Evidence:** `buildGraphQueryPayload()` always injects `graphMetadata.detectorProvenance: graphDb.getLastDetectorProvenance() ?? 'unknown'` before serializing the payload (`code-graph/query.ts:94-99`), and every success payload is built through that helper (`code-graph/query.ts:551-564`). The backing DB function simply returns the single metadata key `last_detector_provenance` from the last graph scan, not anything tied to the current result rows (`lib/code-graph/code-graph-db.ts:213-219`). The handler test suite currently codifies that optimistic surface by mocking `getLastDetectorProvenance()` to `'structured'` and asserting the payload exposes that value; it never probes empty or degraded-result cases (`tests/code-graph-query-handler.vitest.ts:63, 109-145`).
- **Downstream Impact:** Agents and tooling can over-trust `code_graph_query` responses because the top-level provenance field looks stronger and more specific than it really is. The blast radius is every consumer that reads payload-level graph provenance without re-checking per-edge metadata or graph-integrity hints.

## Novel Insights
- The previously documented warning-only branches in `session-stop.ts`, `graph-metadata-parser.ts`, `reconsolidation-bridge.ts`, and `post-insert.ts` are mostly exhausted. The residual risk is now more subtle: the system often preserves a *successful-looking envelope* while silently mutating the meaning of the metadata inside it.
- The strongest new pattern was **fabricated freshness**. Both the stop-hook and legacy graph-metadata paths can emit metadata that looks precise and current, but that precision is partly synthetic: one derives from a later filesystem snapshot than the parsed event, and the other is freshly minted during migration.
- Re-checking `reconsolidation-bridge.ts:283-294` and `post-insert.ts` against Iterations 011-017 did not surface additional non-duplicate fail-open paths worth rewording; those seams appear exhausted for this domain unless the next pass moves up into their first caller-visible consumers.

## Next Investigation Angle
Close Domain 1 by tracing these fabricated-freshness signals into first consumers: which resume/analytics callers trust `lastClaudeTurnAt` as a real producer-turn timestamp, and which packet-ranking or review surfaces treat migrated `graph-metadata` timestamps as authoritative recency evidence.
