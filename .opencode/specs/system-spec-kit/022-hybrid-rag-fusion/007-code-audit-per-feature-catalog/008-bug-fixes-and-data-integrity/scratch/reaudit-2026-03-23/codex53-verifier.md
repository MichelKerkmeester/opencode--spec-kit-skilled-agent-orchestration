Directory listing first:
```text
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/
  01-graph-channel-id-fix.md
  02-chunk-collapse-deduplication.md
  03-co-activation-fan-effect-divisor.md
  04-sha-256-content-hash-deduplication.md
  05-database-and-schema-safety.md
  06-guards-and-edge-cases.md
  07-canonical-id-dedup-hardening.md
  08-mathmax-min-stack-overflow-elimination.md
  09-session-manager-transaction-gap-fixes.md
  10-chunking-orchestrator-safe-swap.md
  11-working-memory-timestamp-fix.md
```

Prior audit file read:
- `specs/system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/008-bug-fixes-and-data-integrity/implementation-summary.md:34-46`
- Prior finding baseline confirmed: 9 MATCH, 2 PARTIAL (features 8 and 9).

## Per-feature verification

1. Feature 01 — Graph channel ID fix  
- File verification: 13/13 referenced files exist (see matrix below).  
- Function verification:
  - `queryCausalEdgesFTS5(database, query, limit)` exists: `mcp_server/lib/search/graph-search-fn.ts:133`.
  - Numeric ID extraction exists at both points: `Number(row.source_id)` and `Number(row.target_id)`: `graph-search-fn.ts:170,185`.
  - Factory signature exists: `createUnifiedGraphSearchFn(database, _legacyArg?): GraphSearchFn`: `graph-search-fn.ts:461-464`.
  - `GraphSearchFn` signature exists: `search-types.ts:7-10`.
- Flag defaults check:
  - `isGraphUnifiedEnabled()` delegates to default-on rollout policy: `graph-flags.ts:16-18`, `rollout-policy.ts:53-63`.
  - Tests assert undefined flag => enabled: `tests/graph-flags.vitest.ts:23-26`.
- Unreferenced files found: None.
- Behavioral accuracy:
  - No `mem:` IDs returned; tests enforce numeric IDs and reject `mem:`: `tests/graph-search-fn.vitest.ts:44-77`.
- Verdict: MATCH.

2. Feature 02 — Chunk collapse deduplication  
- File verification: 8/8 referenced files exist.  
- Function verification:
  - Handler signature exists: `handleMemorySearch(args: SearchArgs): Promise<MCPResponse>`: `handlers/memory-search.ts:396`.
  - `includeContent` default is false: `memory-search.ts:416`.
  - Stage-3 collapse function exists: `collapseAndReassembleChunkResults(results)` in pipeline: `stage3-rerank.ts:443-445`.
  - Dedup by `id` is unconditional inside Stage 3 path: `stage3-rerank.ts:500-509`.
- Flag defaults check:
  - Documented default (`includeContent=false`) is correct: `memory-search.ts:416`.
- Unreferenced files found:
  - `mcp_server/lib/search/chunk-reassembly.ts` (compat/test collapse implementation, not listed in feature entry): `chunk-reassembly.ts:73`.
- Behavioral accuracy:
  - Dedup behavior identical for `includeContent=false` and `true`: `tests/handler-memory-search.vitest.ts:194-222`.
- Verdict: MATCH.

3. Feature 03 — Co-activation fan-effect divisor  
- File verification: 5/5 referenced files exist.  
- Function verification:
  - `boostScore(baseScore, relatedCount, avgSimilarity)` exists: `co-activation.ts:90-94`.
  - Fan divisor implemented: `Math.sqrt(Math.max(1, relatedCount))`: `co-activation.ts:101-102`.
  - Stage-2 hot path also applies fan divisor: `stage2-fusion.ts:654-656`.
- Flag/default check:
  - `DEFAULT_COACTIVATION_STRENGTH = 0.25`: `co-activation.ts:22`.
  - Config defaulting and clamp: `co-activation.ts:24-29`.
  - Tests confirm default 0.25: `tests/rrf-degree-channel.vitest.ts:337-352`.
- Unreferenced files found: None.
- Behavioral accuracy: matches documented `1/sqrt(neighbor_count)` dampening.
- Verdict: MATCH.

4. Feature 04 — SHA-256 content-hash deduplication  
- File verification: 27/27 referenced files exist.  
- Function verification:
  - `checkExistingRow(...)` exists: `handlers/save/dedup.ts:79-87`.
  - Same-path unchanged short-circuit uses `content_hash` + eligible statuses + metadata equivalence + `!force`: `dedup.ts:129-136`.
  - `checkContentHashDedup(...)` exists: `dedup.ts:151-158`.
  - O(1)-style indexed lookup criteria: `spec_folder`, `content_hash`, `embedding_status IN ('success','partial')`: `dedup.ts:168-171`, `184-187`.
- Flag/default check:
  - `force=false` path enables dedup checks: `dedup.ts:159`.
  - No dedicated feature flag documented in catalog entry; `force` behavior is correct.
- Unreferenced files found:
  - `mcp_server/handlers/memory-save.ts` orchestrates both dedup checks but is not listed: `memory-save.ts:281`, `373`, `408`.
- Behavioral accuracy:
  - Pending excluded from duplicate fast-path: `tests/content-hash-dedup.vitest.ts:207-219`.
  - Different content bypasses dedup: `tests/content-hash-dedup.vitest.ts:184-205`.
- Verdict: MATCH.

5. Feature 05 — Database and schema safety  
- File verification: 9/9 referenced files exist.  
- Function verification:
  - B1: `executeMerge(...)` uses `importance_weight` boost `Math.min(1.0, currentWeight + 0.1)`: `reconsolidation.ts:187`, `199-201`.
  - B2: `ensureWorkingMemorySchema(...)` exists and DDL runs before restore transaction: `checkpoints.ts:805`, `1340-1345`, transaction starts `1352`.
  - B3: `deleteEdgesForMemory(memoryId)` uses `source_id = ? OR target_id = ?`: `causal-edges.ts:552-558`.
  - B4: `reinforceExistingMemory(...)` and `markMemorySuperseded(...)` check `changes===0`: `pe-gating.ts:108`, `149-151`, `170`, `181-183`.
- Flag/default check: N/A (no documented flag defaults for this feature entry).
- Unreferenced files found: None.
- Behavioral accuracy:
  - Reconsolidation test verifies 0.5 -> 0.6 weight boost: `tests/reconsolidation.vitest.ts:342-378`.
  - Edge deletion regression tests DM1/DM2: `tests/causal-edges-unit.vitest.ts:628-651`.
  - Zero-row reinforcement update handled as error: `tests/memory-save-extended.vitest.ts:486-517`.
- Verdict: MATCH.

6. Feature 06 — Guards and edge cases  
- File verification: 4/4 referenced files exist.  
- Function verification:
  - E1 pair loop avoids mirrored double-counting: `for (let j = i + 1; ...)`: `temporal-contiguity.ts:76-77`.
  - E2 resolver signature and null-on-failure: `resolveMemoryIdFromText(sourceText): number | null`: `extraction-adapter.ts:188`; returns null: `224`.
  - Skip-on-unresolved behavior in insert path: `extraction-adapter.ts:258-262`.
- Flag/default check: N/A.
- Unreferenced files found: None.
- Behavioral accuracy:
  - T035a/T035b/T035c confirms skip insert when unresolved: `tests/extraction-adapter.vitest.ts:101-127`.
- Verdict: MATCH.

7. Feature 07 — Canonical ID dedup hardening  
- File verification: 26/26 referenced files exist.  
- Function verification:
  - `combinedLexicalSearch(...)` exists: `hybrid-search.ts:432`.
  - `hybridSearch(...)` exists: `hybrid-search.ts:468`.
  - Canonicalization function exists: `canonicalResultId(id: number | string): string`: `hybrid-search.ts:1294`.
  - Handles `mem:42` and numeric strings: `hybrid-search.ts:1300-1307`.
  - Dedup uses canonical key in both lexical and hybrid flows: `hybrid-search.ts:445`, `449`, `575-576`.
- Flag/default check: N/A.
- Unreferenced files found: None.
- Behavioral accuracy:
  - T031-LEX-05 canonical dedup passes: `tests/hybrid-search.vitest.ts:281-288`.
  - T031-BASIC-04 canonical dedup across channels passes: `tests/hybrid-search.vitest.ts:475-492`.
- Verdict: MATCH.

8. Feature 08 — Math.max/min stack overflow elimination  
- File verification: 27/27 referenced files exist.  
- Function verification:
  - Example safe replacement present in listed code: loop-based min/max in `normalizeCompositeScores`: `composite-scoring.ts:860-871`.
  - Example safe replacement present in listed shared file with explicit AI-WHY: `shared/scoring/folder-scoring.ts:203-210`, `272-274`.
- Flag/default check: N/A.
- Unreferenced files found (implementing this feature intent but not listed):
  - `mcp_server/lib/search/rsf-fusion.ts:129-132,240-241`
  - `mcp_server/lib/search/causal-boost.ts:566`
  - `mcp_server/lib/search/evidence-gap-detector.ts:163`
  - `mcp_server/lib/cognitive/prediction-error-gate.ts:508-509`
  - `mcp_server/lib/telemetry/retrieval-telemetry.ts:292`
  - `mcp_server/lib/eval/reporting-dashboard.ts:291-292`
- Behavioral accuracy:
  - Catalog says all spread-pattern risks replaced; but residual production spread patterns still exist:
    - `mcp_server/lib/eval/k-value-analysis.ts:297-298`
    - `mcp_server/lib/search/graph-lifecycle.ts:271`
  - Also, many listed files appear unrelated to this specific fix surface.
- Verdict: PARTIAL.

9. Feature 09 — Session-manager transaction gap fixes  
- File verification: 22/22 referenced files exist.  
- Function verification:
  - `shouldSendMemoriesBatch(...)` exists: `session-manager.ts:343`.
  - `markMemorySent(...)` exists: `session-manager.ts:442`.
  - `markMemoriesSentBatch(...)` exists: `session-manager.ts:474`.
  - `enforceEntryLimit(...)` exists: `session-manager.ts:516`.
  - Transactional call sites for `enforceEntryLimit`:
    - `shouldSendMemoriesBatch(markAsSent)` path inside explicit transaction: `session-manager.ts:400-414`
    - `markMemorySent` transaction: `session-manager.ts:460-464`
    - `markMemoriesSentBatch` transaction: `session-manager.ts:490-500`
- Flag/default check: N/A.
- Unreferenced files found: None.
- Behavioral accuracy:
  - Catalog text says “two instances” moved inside transaction, but code now has three transactional pathways.
- Verdict: PARTIAL.

10. Feature 10 — Chunking Orchestrator Safe Swap  
- File verification: 2/2 referenced files exist.  
- Function verification:
  - `indexChunkedMemoryFile(...)` exists: `chunking-orchestrator.ts:129`.
  - Safe-swap staging path exists (`useSafeSwap`): `chunking-orchestrator.ts:242`, staged children no parent_id `324-327`.
  - Finalize swap transaction exists: `chunking-orchestrator.ts:455-511`.
- Flag/default check: N/A.
- Unreferenced files found: None.
- Behavioral accuracy:
  - Success case: old children removed, new children linked, no staged leftovers: `tests/chunking-orchestrator-swap.vitest.ts:325-363`.
  - Failure case: old children preserved, staged cleaned: `380-417`.
  - Partial embedding failures still safe-swap successfully: `427-469`.
- Verdict: MATCH.

11. Feature 11 — Working Memory Session Cleanup Timestamp Fix  
- File verification: 3/3 referenced files exist.  
- Function verification:
  - `cleanupOldSessions(): number` exists: `working-memory.ts:251`.
  - SQLite datetime-native comparison used for select+delete: `working-memory.ts:259-263`.
- Flag/default check:
  - `WORKING_MEMORY_CONFIG.sessionTimeoutMs` default 30m (1800000): `working-memory.ts:27-31`.
  - Catalog does not define a specific flag default for this feature; implementation aligns with described behavior.
- Unreferenced files found: None.
- Behavioral accuracy:
  - Regression test confirms expired session removed, active + `CURRENT_TIMESTAMP` session retained: `tests/session-manager-stress.vitest.ts:81-121`.
- Verdict: MATCH.

## File reference existence matrix (every catalog file reference checked)

```text
01-graph-channel-id-fix.md
30 mcp_server/lib/cognitive/rollout-policy.ts OK
31 mcp_server/lib/parsing/content-normalizer.ts OK
32 mcp_server/lib/search/bm25-index.ts OK
33 mcp_server/lib/search/graph-flags.ts OK
34 mcp_server/lib/search/graph-search-fn.ts OK
35 mcp_server/lib/search/search-types.ts OK
36 mcp_server/lib/search/spec-folder-hierarchy.ts OK
42 mcp_server/tests/bm25-index.vitest.ts OK
43 mcp_server/tests/content-normalizer.vitest.ts OK
44 mcp_server/tests/graph-flags.vitest.ts OK
45 mcp_server/tests/graph-search-fn.vitest.ts OK
46 mcp_server/tests/rollout-policy.vitest.ts OK
47 mcp_server/tests/spec-folder-hierarchy.vitest.ts OK

02-chunk-collapse-deduplication.md
28 mcp_server/lib/chunking/anchor-chunker.ts OK
29 mcp_server/lib/chunking/chunk-thinning.ts OK
30 mcp_server/lib/scoring/mpab-aggregation.ts OK
31 mcp_server/handlers/memory-search.ts OK
32 mcp_server/lib/search/pipeline/stage3-rerank.ts OK
38 mcp_server/tests/chunk-thinning.vitest.ts OK
39 mcp_server/tests/mpab-aggregation.vitest.ts OK
40 mcp_server/tests/handler-memory-search.vitest.ts OK

03-co-activation-fan-effect-divisor.md
30 mcp_server/lib/cognitive/co-activation.ts OK
31 mcp_server/lib/search/pipeline/stage2-fusion.ts OK
37 mcp_server/tests/co-activation.vitest.ts OK
38 mcp_server/tests/rrf-degree-channel.vitest.ts OK
39 mcp_server/tests/stage2-fusion.vitest.ts OK

04-sha-256-content-hash-deduplication.md
30 mcp_server/handlers/memory-crud-types.ts OK
31 mcp_server/handlers/save/dedup.ts OK
32 mcp_server/handlers/save/types.ts OK
33 mcp_server/hooks/mutation-feedback.ts OK
34 mcp_server/lib/config/memory-types.ts OK
35 mcp_server/lib/config/type-inference.ts OK
36 mcp_server/lib/parsing/memory-parser.ts OK
37 mcp_server/lib/scoring/importance-tiers.ts OK
38 mcp_server/lib/storage/incremental-index.ts OK
39 mcp_server/lib/utils/canonical-path.ts OK
40 mcp_server/lib/utils/path-security.ts OK
41 shared/parsing/quality-extractors.ts OK
42 shared/utils/path-security.ts OK
48 mcp_server/tests/content-hash-dedup.vitest.ts OK
49 mcp_server/tests/importance-tiers.vitest.ts OK
50 mcp_server/tests/incremental-index-v2.vitest.ts OK
51 mcp_server/tests/incremental-index.vitest.ts OK
52 mcp_server/tests/integration-session-dedup.vitest.ts OK
53 mcp_server/tests/memory-parser-extended.vitest.ts OK
54 mcp_server/tests/memory-parser.vitest.ts OK
55 mcp_server/tests/memory-types.vitest.ts OK
56 mcp_server/tests/unit-composite-scoring-types.vitest.ts OK
57 mcp_server/tests/unit-folder-scoring-types.vitest.ts OK
58 mcp_server/tests/unit-path-security.vitest.ts OK
59 mcp_server/tests/unit-tier-classifier-types.vitest.ts OK
60 mcp_server/tests/unit-transaction-metrics-types.vitest.ts OK
61 shared/parsing/quality-extractors.test.ts OK

05-database-and-schema-safety.md
36 mcp_server/handlers/save/reconsolidation-bridge.ts OK
37 mcp_server/lib/storage/reconsolidation.ts OK
38 mcp_server/lib/storage/checkpoints.ts OK
39 mcp_server/lib/storage/causal-edges.ts OK
40 mcp_server/handlers/pe-gating.ts OK
46 mcp_server/tests/reconsolidation.vitest.ts OK
47 mcp_server/tests/checkpoint-working-memory.vitest.ts OK
48 mcp_server/tests/causal-edges-unit.vitest.ts OK
49 mcp_server/tests/memory-save-extended.vitest.ts OK

06-guards-and-edge-cases.md
32 mcp_server/lib/cognitive/temporal-contiguity.ts OK
33 mcp_server/lib/extraction/extraction-adapter.ts OK
39 mcp_server/tests/temporal-contiguity.vitest.ts OK
40 mcp_server/tests/extraction-adapter.vitest.ts OK

07-canonical-id-dedup-hardening.md
28 mcp_server/lib/search/hybrid-search.ts OK
29 mcp_server/handlers/memory-crud-types.ts OK
30 mcp_server/handlers/save/dedup.ts OK
31 mcp_server/handlers/save/types.ts OK
32 mcp_server/hooks/mutation-feedback.ts OK
33 mcp_server/lib/config/memory-types.ts OK
34 mcp_server/lib/config/type-inference.ts OK
35 mcp_server/lib/parsing/memory-parser.ts OK
36 mcp_server/lib/scoring/importance-tiers.ts OK
37 mcp_server/lib/utils/canonical-path.ts OK
38 mcp_server/lib/utils/path-security.ts OK
39 shared/parsing/quality-extractors.ts OK
40 shared/utils/path-security.ts OK
46 mcp_server/tests/hybrid-search.vitest.ts OK
47 mcp_server/tests/content-hash-dedup.vitest.ts OK
48 mcp_server/tests/importance-tiers.vitest.ts OK
49 mcp_server/tests/integration-session-dedup.vitest.ts OK
50 mcp_server/tests/memory-parser-extended.vitest.ts OK
51 mcp_server/tests/memory-parser.vitest.ts OK
52 mcp_server/tests/memory-types.vitest.ts OK
53 mcp_server/tests/unit-composite-scoring-types.vitest.ts OK
54 mcp_server/tests/unit-folder-scoring-types.vitest.ts OK
55 mcp_server/tests/unit-path-security.vitest.ts OK
56 mcp_server/tests/unit-tier-classifier-types.vitest.ts OK
57 mcp_server/tests/unit-transaction-metrics-types.vitest.ts OK
58 shared/parsing/quality-extractors.test.ts OK

08-mathmax-min-stack-overflow-elimination.md
37 mcp_server/lib/scoring/composite-scoring.ts OK
38 mcp_server/lib/scoring/folder-scoring.ts OK
39 mcp_server/lib/scoring/importance-tiers.ts OK
40 mcp_server/lib/scoring/interference-scoring.ts OK
41 mcp_server/lib/scoring/mpab-aggregation.ts OK
42 mcp_server/lib/storage/access-tracker.ts OK
43 mcp_server/lib/telemetry/scoring-observability.ts OK
44 shared/normalization.ts OK
45 shared/scoring/folder-scoring.ts OK
46 shared/types.ts OK
52 mcp_server/tests/access-tracker-extended.vitest.ts OK
53 mcp_server/tests/access-tracker.vitest.ts OK
54 mcp_server/tests/composite-scoring.vitest.ts OK
55 mcp_server/tests/folder-scoring.vitest.ts OK
56 mcp_server/tests/importance-tiers.vitest.ts OK
57 mcp_server/tests/interference.vitest.ts OK
58 mcp_server/tests/memory-types.vitest.ts OK
59 mcp_server/tests/mpab-aggregation.vitest.ts OK
60 mcp_server/tests/score-normalization.vitest.ts OK
61 mcp_server/tests/scoring-observability.vitest.ts OK
62 mcp_server/tests/scoring.vitest.ts OK
63 mcp_server/tests/unit-composite-scoring-types.vitest.ts OK
64 mcp_server/tests/unit-folder-scoring-types.vitest.ts OK
65 mcp_server/tests/unit-normalization-roundtrip.vitest.ts OK
66 mcp_server/tests/unit-normalization.vitest.ts OK
67 mcp_server/tests/unit-tier-classifier-types.vitest.ts OK
68 mcp_server/tests/unit-transaction-metrics-types.vitest.ts OK

09-session-manager-transaction-gap-fixes.md
28 mcp_server/lib/cognitive/rollout-policy.ts OK
29 mcp_server/lib/cognitive/working-memory.ts OK
30 mcp_server/lib/session/session-manager.ts OK
31 mcp_server/lib/storage/transaction-manager.ts OK
32 shared/normalization.ts OK
33 shared/types.ts OK
39 mcp_server/tests/checkpoint-working-memory.vitest.ts OK
40 mcp_server/tests/memory-types.vitest.ts OK
41 mcp_server/tests/rollout-policy.vitest.ts OK
42 mcp_server/tests/score-normalization.vitest.ts OK
43 mcp_server/tests/session-manager-extended.vitest.ts OK
44 mcp_server/tests/session-manager.vitest.ts OK
45 mcp_server/tests/transaction-manager-extended.vitest.ts OK
46 mcp_server/tests/transaction-manager.vitest.ts OK
47 mcp_server/tests/unit-composite-scoring-types.vitest.ts OK
48 mcp_server/tests/unit-folder-scoring-types.vitest.ts OK
49 mcp_server/tests/unit-normalization-roundtrip.vitest.ts OK
50 mcp_server/tests/unit-normalization.vitest.ts OK
51 mcp_server/tests/unit-tier-classifier-types.vitest.ts OK
52 mcp_server/tests/unit-transaction-metrics-types.vitest.ts OK
53 mcp_server/tests/working-memory-event-decay.vitest.ts OK
54 mcp_server/tests/working-memory.vitest.ts OK

10-chunking-orchestrator-safe-swap.md
28 mcp_server/handlers/chunking-orchestrator.ts OK
34 mcp_server/tests/chunking-orchestrator-swap.vitest.ts OK

11-working-memory-timestamp-fix.md
28 mcp_server/lib/cognitive/working-memory.ts OK
34 mcp_server/tests/working-memory.vitest.ts OK
35 mcp_server/tests/session-manager-stress.vitest.ts OK
```

## Summary table

| # | Feature | Files OK? | Functions OK? | Flags OK? | Unreferenced? | Verdict |
|---|---|---|---|---|---|---|
| 1 | Graph channel ID fix | Yes (13/13) | Yes | Yes | No | MATCH |
| 2 | Chunk collapse deduplication | Yes (8/8) | Yes | Yes (`includeContent=false`) | Yes (`lib/search/chunk-reassembly.ts`) | MATCH |
| 3 | Co-activation fan-effect divisor | Yes (5/5) | Yes | Yes (0.25 default + fan divisor) | No | MATCH |
| 4 | SHA-256 content-hash deduplication | Yes (27/27) | Yes | N/A documented; runtime `force` behavior correct | Yes (`handlers/memory-save.ts`) | MATCH |
| 5 | Database and schema safety | Yes (9/9) | Yes | N/A | No | MATCH |
| 6 | Guards and edge cases | Yes (4/4) | Yes | N/A | No | MATCH |
| 7 | Canonical ID dedup hardening | Yes (26/26) | Yes | N/A | No | MATCH |
| 8 | Math.max/min stack overflow elimination | Yes (27/27) | Partial | N/A | Yes (6 implementing files not listed; 2 residual spread sites) | PARTIAL |
| 9 | Session-manager transaction gap fixes | Yes (22/22) | Partial (3 transactional pathways vs documented 2) | N/A | No | PARTIAL |
| 10 | Chunking Orchestrator Safe Swap | Yes (2/2) | Yes | N/A | No | MATCH |
| 11 | Working Memory Session Cleanup Timestamp Fix | Yes (3/3) | Yes | N/A documented; timeout default consistent | No | MATCH |