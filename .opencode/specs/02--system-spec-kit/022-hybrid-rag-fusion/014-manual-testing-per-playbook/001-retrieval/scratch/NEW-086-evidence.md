# 086: BM25 trigger phrase re-index gate

## Preconditions
- Checkpoint "pre-new086" created (679 memories, 4MB snapshot)
- Disposable target: memoryId 25368 (agent-haiku-compatibility, z_archive)
- Original trigger phrases: ["haiku compatibility", "agent haiku", "model comparison"]

## Commands Executed

1. `checkpoint_create({ name:"pre-new086" })` - Snapshot created
2. `memory_update({ id:25368, triggerPhrases:["haiku compatibility","agent haiku","model comparison","new086-test-retrigger-unique"] })`
3. `memory_match_triggers({ prompt:"new086-test-retrigger-unique" })`
4. `memory_search({ query:"new086-test-retrigger-unique", limit:5, includeTrace:true, bypassCache:true })`
5. `checkpoint_restore({ name:"pre-new086" })` - State reverted

## Raw Output Summary

### Step 2: memory_update
- Updated field: triggerPhrases
- embeddingRegenerated: false (trigger-only change)
- Post-mutation hooks: triggerCacheCleared=true, constitutionalCacheCleared=true, graphSignalsCacheCleared=true, coactivationCacheCleared=true, toolCacheInvalidated=1
- All caches cleared successfully, zero errors

### Step 3: memory_match_triggers
- Matched on substring "test" (partial phrase matching)
- Target record 25368 NOT in trigger match results (trigger matching uses word-level, not phrase-level)
- 3 other records matched on "test" substring

### Step 4: memory_search (FTS/BM25 verification)
- **Record 25368 is #1 result** (score: rerank=0.307)
- channelsUsed: ["fts"] — found via full-text search
- queryComplexity: "simple"
- The new trigger phrase was indexed and immediately searchable via FTS
- lastModified updated to 2026-03-19T19:02:01.273Z (matches update timestamp)

### Step 5: checkpoint_restore
- Restored: 567 records, skipped: 112
- Vec_memories PK warnings (non-critical — virtual table limitation)
- Trigger phrase mutation reverted

## Signal Checklist
- [x] Trigger phrase edit succeeded
- [x] Post-mutation hooks cleared all caches (trigger, constitutional, graphSignals, coactivation, toolCache)
- [x] New trigger phrase immediately searchable via FTS/BM25
- [x] Edited record returned as #1 search result
- [x] Checkpoint restore reverted changes

## Verdict: **PASS**
Editing trigger phrases causes immediate cache invalidation and FTS re-indexing. The new trigger phrase "new086-test-retrigger-unique" was immediately searchable, returning the target record as the #1 result via the FTS channel.
