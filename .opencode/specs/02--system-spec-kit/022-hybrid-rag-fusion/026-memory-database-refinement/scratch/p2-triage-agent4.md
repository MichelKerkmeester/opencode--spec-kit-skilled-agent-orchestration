## P2-017: Interference scoring counts archived/deprecated memories
- **Decision**: FIX
- **Reason**: The current interference scorer and folder refresh path still count same-folder siblings that are no longer retrievable, which can over-penalize live memories after reconsolidation or deprecation. I restricted scoring to active/retrievable rows and covered archived/deprecated exclusions with tests.
- **Evidence**: `lib/scoring/interference-scoring.ts`, `lib/search/vector-index-store.ts`, `tests/interference.vitest.ts`
- **Impact**: medium

## P2-020: BM25 indexing failure swallowed during reconsolidation
- **Decision**: DEFER
- **Reason**: The live code still logs and continues on BM25 update failures in reconsolidation paths, but a safe fix needs a shared contract across reconsolidation, normal save, and chunking BM25 writers so we do not make one path atomic while others remain best-effort. That broader contract crosses this ownership slice.
- **Evidence**: `handlers/save/reconsolidation-bridge.ts:248-260`, `lib/storage/reconsolidation.ts:324-337`
- **Impact**: medium

## P2-021: Scan batch concurrency effectively unbounded
- **Decision**: FIX
- **Reason**: `processBatches()` accepted arbitrarily large `batchSize` values, so an oversized `SPEC_KIT_BATCH_SIZE` could still fan out a large `Promise.all()` batch during scans. I added a hard clamp in the batch processor and tests that prove oversized inputs are bounded.
- **Evidence**: `utils/batch-processor.ts`, `tests/batch-processor.vitest.ts`
- **Impact**: medium

## P2-022: Ingest accepts duplicate paths as duplicate work
- **Decision**: FIX
- **Reason**: The ingest handler normalized paths but still queued duplicate real paths as separate work items. I deduplicated normalized paths before job creation and surfaced the dedup in the response payload/hints.
- **Evidence**: `handlers/memory-ingest.ts`, `tests/handler-memory-ingest.vitest.ts`
- **Impact**: low

## P2-023: Missing token-usage data persisted as measured zero
- **Decision**: FIX
- **Reason**: The ablation report still emitted `token_usage` entries as `0/0/0`, and persistence stored those rows as if they were real measurements. I kept the in-memory report shape stable but stopped persisting synthetic token-usage snapshot rows until real measurements exist.
- **Evidence**: `lib/eval/ablation-framework.ts`, `tests/ablation-framework.vitest.ts`
- **Impact**: low

## P2-024: Sprint ordering based on first-seen not most recent
- **Decision**: FIX
- **Reason**: Dashboard limiting used sprint start time, which can drop an older-starting sprint that was actually updated most recently. I changed selection to rank by `lastSeen`, while keeping the returned sprint list chronologically ordered for trends and summary output.
- **Evidence**: `lib/eval/reporting-dashboard.ts`, `tests/reporting-dashboard.vitest.ts`
- **Impact**: medium

## P2-025: groundTruthQueryIds silently drops unknown IDs
- **Decision**: FIX
- **Reason**: Requested ablation query IDs that do not exist in the static dataset were silently ignored, making operator intent easy to misread. I now warn on missing IDs and record requested, resolved, and missing sets in the report and persisted metadata.
- **Evidence**: `lib/eval/ablation-framework.ts`, `tests/ablation-framework.vitest.ts`
- **Impact**: medium

## P2-034: Unicode handling only Latin-1-aware, normalization paths differ
- **Decision**: DEFER
- **Reason**: The finding is credible from the current trigger matcher code, but the required Unicode-aware tokenization and normalization unification lives in read-only files outside this ownership slice. Fixing it safely needs a broader trigger-matching change and regression pass.
- **Evidence**: `lib/parsing/trigger-matcher.ts:160-180`, `lib/parsing/trigger-matcher.ts:243-250`, `lib/parsing/trigger-matcher.ts:525-555`
- **Impact**: medium

## P2-035: Proactive surfacing full-cache regex scan degrades with trigger growth
- **Decision**: DEFER
- **Reason**: The current matcher still scans the full trigger cache on the hot path, and `memory-surface` calls it directly for auto-surfacing. Building an indexed candidate path would be a larger trigger/cache design change outside the owned files for this pass.
- **Evidence**: `lib/parsing/trigger-matcher.ts:511-567`, `hooks/memory-surface.ts:188-223`
- **Impact**: medium
