# Iteration 001 — A1: Daemon concurrency edge cases

## Focus
Audited the skill-advisor daemon lease, lifecycle, watcher, and freshness generation paths for races, ordering bugs, missing serialization, TOCTOU windows, and lease lifecycle asymmetries. The strongest issues are in watcher flush reentrancy and lifecycle/generation publication ordering rather than the SQLite lease reservation transaction.

## Actions Taken
- Enumerated target files with `rg --files` under `lib/daemon/` and `lib/freshness/`.
- Read fully with line numbers: `lease.ts`, `lifecycle.ts`, `watcher.ts`, `generation.ts`, `trust-state.ts`, and `cache-invalidation.ts`.
- Read supporting daemon mutation helper `state-mutation.ts` to verify watcher quarantine writes use SQLite retry wrapping.
- Searched call sites for `publishSkillGraphGeneration`, `publishAfterCommit`, `onCacheInvalidation`, `createSkillGraphWatcher`, `acquireSkillGraphLease`, and `readSkillGraphGeneration`.
- Traced paths where timers, file-system event handlers, shutdown, generation writes, and cache invalidation can interleave without an enforced happens-before edge.

## Findings

| ID | Priority | File:Line | Description | Recommendation |
|----|----------|-----------|-------------|----------------|
| F-001-A1-01 | P1 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:361-368` | `enqueue()` schedules `flushPending()` with no in-flight guard. `flushPending()` clears `pending` before awaiting `processSkill()` at `watcher.ts:419-424`, so a second timer or `close()` can start another flush while the first reindex is still running. That allows concurrent `processSkill()` calls for the same skill, racing `fileHashes`, `lastReindexAt`, SQLite reindex work, and generation publication. | Add a watcher-local mutex or `flushPromise` and drain loop: only one flush may run at a time, and events enqueued during a flush should be processed by the same serialized drain after the current batch completes. Make `close()` await the active flush instead of starting a competing one. |
| F-001-A1-02 | P1 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts:85-94` | `shutdown()` publishes the daemon generation as `unavailable` before closing the watcher. `watcher.close()` then sets `closed = true` but still calls `flushPending()` at `watcher.ts:461-468`; any pending skill processed during that flush publishes `state: 'live'` at `watcher.ts:408-414`. A shutdown with queued events can therefore leave the generation file saying `live` after the daemon has stopped. | Reverse or guard the ordering: stop/flush the watcher before publishing terminal unavailable state, or make watcher close suppress reindex generation publication during shutdown and publish one final unavailable generation after all pending work is quiesced. |
| F-001-A1-03 | P1 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts:71-80` | `acquireGenerationLock()` uses a lock file with stale deletion, but the release closure unconditionally removes `lockPath` and the stale path unconditionally removes an existing lock. If publisher A pauses longer than `GENERATION_LOCK_STALE_MS`, publisher B can delete A's lock and acquire a new one; when A resumes, A's release can delete B's lock, allowing a third writer to enter while B still believes it owns the lock. | Store a unique lock token and have release remove only if the token still matches. For stale reclamation, use an owner-checked compare step or a lock primitive with ownership semantics; do not let an old holder delete a newer holder's lock. |
| F-001-A1-04 | P2 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts:123-127` | `publishSkillGraphGeneration()` releases the generation lock before calling `invalidateSkillGraphCaches()`. Another publisher can write generation N+1 and invalidate it before generation N's invalidation fan-out runs; `cache-invalidation.ts:31-37` then overwrites `lastInvalidation` and notifies listeners with an older generation after the newer one. | Either emit invalidation while still holding the generation publication lock, or make invalidation listeners/state monotonic by ignoring events whose `generation` is older than the last observed generation. |

## Questions Answered
- Lease acquisition itself is transaction-wrapped and owner-checked for heartbeat/release, so the basic reservation path has a SQLite-backed happens-before edge.
- The freshness generation lock is not owner-safe under stale-lock reclamation.
- Watcher file-system event handling is debounced but not serialized across async flushes.
- Lifecycle shutdown has a concrete ordering bug with pending watcher flush publication.
- Cache invalidation fan-out is best-effort and can be observed out of order relative to generation file writes.

## Questions Remaining
- Whether `indexSkillMetadata(skillsRoot)` is idempotent enough to tolerate concurrent same-skill reindexing should be audited in a follow-on pass.
- Whether callers of `getLastCacheInvalidation()` or `onCacheInvalidation()` assume monotonic generation order needs a targeted consumer audit.
- Signal-handler behavior may need a separate pass: `process.exit(0)` after `shutdown().finally()` gives async cleanup a chance, but only if shutdown itself cannot hang.

## Next Focus
Follow-on iteration should audit skill graph indexing and cache consumers: trace `indexSkillMetadata`, memoized brief invalidation, and any readers that combine generation metadata with cached advisor outputs.
