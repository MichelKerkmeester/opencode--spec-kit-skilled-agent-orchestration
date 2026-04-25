# Iteration 17: F41 prompt-cache stale-after-rebuild race deep-dive

## Focus

Resolve the last deferred item (F41): characterize the stale-after-rebuild race window for `advisorPromptCache`, the concurrent-session edge case, the per-process secret-rotation interaction (extends F50), and propose a concrete patch.

## Findings

### F77 — There is NO classic stale-after-rebuild race; the cache is gated on freshness `live`, which requires `generation.sourceSignature === snapshot.sourceSignature`

The presumed race ("during a scan, advisor sees OLD sourceSignature until generation is published") does not exist as framed. The freshness derivation in `lib/freshness.ts:242-296` does NOT use the *snapshot's* sourceSignature in isolation:

- `deriveFreshness()` reads BOTH the on-disk `generation.sourceSignature` (the published value, written atomically via `publishSkillGraphGeneration` after each scan completes) AND the freshly-computed `snapshot.sourceSignature` (hashed from current source files at probe time).
- Branch at `lib/freshness.ts:274-283`: when `generation.sourceSignature` exists, freshness is `live` **only if** `generation.sourceSignature === snapshot.sourceSignature`. Mismatch yields `stale` with reason `SOURCE_NEWER_THAN_SKILL_GRAPH`.
- The cache is only populated on the `ok`/`live` path (`skill-advisor-brief.ts:523, isCacheable()` → status==='ok'; non-live freshness exits via `nonLiveResult()` at `:419-438` BEFORE the cache key is even constructed).
- Cache lookups themselves always pass through `cache.invalidateSourceSignatureChange(freshness.sourceSignature)` at `skill-advisor-brief.ts:442` BEFORE `cache.get()` at `:450`.

Therefore the live-state cache always corresponds to a `(snapshot==generation)` agreement. **The race is closed at `live`-state granularity, not via the cache itself.** This RETRACTS the working hypothesis stated in this iteration's dispatch context.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts:242-296]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:418-468]

### F78 — The actual race window is during a `live → live'` transition (concurrent rebuild between two `live` generations), and it is bounded to a single `cache.get()` call after `invalidateSourceSignatureChange()`

While freshness gating prevents stale-while-rebuilding leaks, there is a narrow window when generation N is `live` and a daemon scan publishes generation N+1 mid-request:

1. T0 (request A starts): freshness probe reads `generation=N, sourceSignature=Sn`; snapshot computes `Sn`; freshness=`live`.
2. T1 (daemon writes N+1): `publishSkillGraphGeneration()` runs `writeJsonAtomic(generationPath, ...)` (`generation.ts:44-60`, fsync + rename) and emits `invalidateSkillGraphCaches()`.
3. T2 (request A continues): runs `cache.invalidateSourceSignatureChange(Sn)` then `cache.get(key with Sn)`. If the cached entry exists from a prior request's N-state, it is returned. The TTL still claims it is fresh.

The brief returned at T2 is "stale relative to N+1" but "live relative to N" — i.e., the user sees a brief consistent with the published-just-before-T1 graph state. This is a **read-skew of one generation**, not a stale-content bug. It is bounded by:
- Single in-flight request granularity (no multi-second hold).
- The next request after T1 will recompute `snapshot.sourceSignature` → `Sn+1`, mismatch the prior generation's cached `Sn`, and `invalidateSourceSignatureChange(Sn+1)` will drop the N-keyed entries.

**Severity: P2 (acceptable read-skew, self-healing within one request).** Not a correctness bug; documenting it explicitly to close the F41 question.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:441-450]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/generation.ts:110-133]

### F79 — Concurrent-session edge case: the `advisorPromptCache` is process-local (`new AdvisorPromptCache<unknown>()` at `prompt-cache.ts:180`); cross-session entries cannot outlive each other because they live in disjoint processes

Each MCP server / hook subprocess holds its own module-level `advisorPromptCache` instance and its own `DEFAULT_SECRET` (`prompt-cache.ts:41-43`, derived from `process.pid + SESSION_LAUNCH_TIME + Math.random()`). Therefore:

- **No shared state** between session A and session B. Session B's cache entry CANNOT outlive session A's graph rebuild because session B has its own cache.
- **No mutex needed** between sessions: the rebuild signal flows through the on-disk `skill-graph-generation.json` file (atomic rename via `writeJsonAtomic` at `generation.ts:44-60`). Both sessions read this file on each freshness probe.
- **The mutex that DOES exist** is `acquireGenerationLock()` at `generation.ts:62-92` — but this guards the *publisher* (write side), not the consumers. Multiple consumers can coexist freely; they each read the post-rename file content atomically.

The remaining concurrency surface is: two hook processes both probing freshness around T1 (the rename moment). On POSIX, `rename()` is atomic — readers see either the old `Sn` content or the new `Sn+1` content, never partial. So the worst-case pair is `(reader sees Sn, reader' sees Sn+1)`, both internally consistent, both `live` from their own vantage point. No race.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts:40-43,180]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/generation.ts:44-92]

### F80 — F50 extension: per-process secret rotation is a FEATURE, not a bug

F50 noted that each host process generates its own HMAC secret at module load (`prompt-cache.ts:41-43`). This bounds the stale window to `5min TTL × single host process` and prevents cross-process cache sharing. Resolving the question:

**This is a deliberate isolation feature, not a missed optimization.** Three reasons:

1. **Cache-poisoning resistance:** A compromised process cannot inject cache entries into another process. Since the HMAC key is the entry's identity, an attacker would need both processes' secrets to forge a replay.
2. **Process restart semantics:** When a daemon restarts, the cache is empty. This is correct: post-restart, the daemon may have a different code version, different scorer weights, different freshness state. A persistent cache would risk serving entries computed by the previous binary.
3. **Cost-benefit:** The cache is a 5-min TTL exact-prompt match — hit rate is dominated by within-session repeats (e.g., user resubmitting a similar prompt twice in 5min). Cross-process hits would be vanishingly rare in practice (each session has its own user, own prompt context). The engineering cost of cross-process synchronization (file-based or daemon-mediated) far outweighs the benefit.

**Decision:** Document this as an architectural invariant (`INV-PROMPT-CACHE-PROCESS-LOCAL`) in the spec; no patch needed.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts:40-43]
[SOURCE: iter-9 F50 notes on stale window bounds]

### F81 — `onCacheInvalidation` listener is wired only in tests, not in production; `advisorPromptCache` does NOT subscribe to generation bumps

This is the actual structural finding worth a P2 patch. `cache-invalidation.ts:14-22` exposes `onCacheInvalidation(listener)` for cache modules to subscribe. Production grep:

```
grep onCacheInvalidation in mcp_server/**/*.ts (excluding /dist/, *.d.ts):
- tests/daemon-freshness-foundation.vitest.ts:18,374,377  (test-only)
- lib/freshness/cache-invalidation.ts:17                  (definition)
```

**No production module calls `onCacheInvalidation` to clear `advisorPromptCache`.** Cache invalidation today relies entirely on the per-request `invalidateSourceSignatureChange()` path at `skill-advisor-brief.ts:442`, which is REACTIVE (each new request prunes stale entries). There is no PROACTIVE invalidation when `publishSkillGraphGeneration()` fires.

The pragmatic consequence: the worst-case stale entry survives in the cache for `min(TTL=5min, time-to-next-request)` even after the daemon publishes a newer generation. Request load typically prunes within seconds, but on idle systems an entry can persist up to 5 minutes longer than necessary.

**Patch is a 1-LOC addition + 1 module-load wire-up:**

Add a module-level subscription in `lib/prompt-cache.ts` (after the singleton export at line 180):

```ts
// Subscribe the singleton to generation bumps so proactive invalidation
// pairs with the existing reactive invalidateSourceSignatureChange() path.
import { onCacheInvalidation } from './freshness/cache-invalidation.js';
onCacheInvalidation(() => {
  advisorPromptCache.clear();
});
```

This makes `publishSkillGraphGeneration()` (which calls `invalidateSkillGraphCaches()` at `generation.ts:127-131`) flush the prompt cache promptly on every scan completion. Cost: ~5 LOC added; no structural changes; existing tests at `daemon-freshness-foundation.vitest.ts` already exercise the listener fanout.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/cache-invalidation.ts:14-22]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts:180]
[SOURCE: grep production search confirming zero callers of onCacheInvalidation]

### F82 — Should the cache key include `generation`? NO — it would over-invalidate without correctness benefit

The dispatch context asked whether the cache key should include `generation`. Analysis says NO:

- `sourceSignature` is the content-hash of all skill source files; `generation` is a monotonic counter incremented on every publish.
- Two consecutive publishes with **identical** source content (e.g., daemon flushing on a no-op rename, or fsevents fanout from a metadata-only touch) would produce different generations but identical sourceSignatures.
- Including `generation` in the key would force a full cache bust on every publish even when content is unchanged → unnecessary subprocess invocations → loss of the cache's value proposition.
- Including only `sourceSignature` (current behavior) is correct: same content = same key = legitimate cache hit; different content = different signature = different key = automatic miss + invalidateSourceSignatureChange() prune.

**Decision: keep current key composition; the F81 listener wire-up is the right fix, not key extension.**

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts:67-80 (key construction)]

## Ruled Out

- **Cache key includes `generation`** — over-invalidates without correctness benefit (F82).
- **Cross-process cache sharing** — per-process isolation is an intentional security/cost-benefit choice (F80).
- **Mutex/lock between concurrent sessions** — sessions are disjoint processes; on-disk atomic rename handles cross-process consistency (F79).
- **The race characterization in dispatch context** ("during a scan, advisor sees OLD sourceSignature until generation is published") — falsified by `deriveFreshness()` requiring `generation.sourceSignature === snapshot.sourceSignature` for `live` (F77).

## Dead Ends

- **Pre-iteration hypothesis that `cache.get()` returns pre-scan answers when underlying graph has changed** — definitively eliminated by the freshness gating at `lib/freshness.ts:274-283` and by `invalidateSourceSignatureChange()` running at `skill-advisor-brief.ts:442` *before* every cache lookup. Promote to strategy.md "Exhausted Approaches" — do not re-investigate.

## Sources Consulted

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts` (181 lines, full file)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:350-546` (cache read/write surface)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts:220-310` (deriveFreshness + sourceSignature binding)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/generation.ts` (publishSkillGraphGeneration full file)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/cache-invalidation.ts` (listener registry)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/watcher.ts:400-425` (production publisher)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/lifecycle.ts:51-86` (lifecycle publishers)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:42` (scan handler publisher)
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1484` (context-server publisher)
- grep: `advisorPromptCache` production call sites (3 files: prompt-cache.ts, skill-advisor-brief.ts, handlers/advisor-recommend.ts)
- grep: `onCacheInvalidation` production call sites (zero — test-only consumer)

## Assessment

- New information ratio: 0.55
- Questions addressed: F41 (race characterization), F50 extension (per-process secret semantics), proposed-fix concreteness
- Questions answered: F41 fully closed with retraction of the dispatch hypothesis + identification of the actual P2 issue (no production listener wiring) + concrete 5-LOC patch

## Reflection

- **What worked and why:** Reading the full freshness derivation chain (`deriveFreshness`) before assuming the dispatch hypothesis was correct exposed that the gating happens at `live`-state granularity, not via cache TTL. This converted a presumed P0/P1 race into a closed-by-design invariant + an unrelated P2 listener-wiring gap.
- **What did not work and why:** Initial framing in dispatch context anchored on "cache returns pre-scan answers" — searching directly for cache key composition would have missed the real issue (listener not wired). Following the *control flow* into freshness.ts was the unlocking move.
- **What I would do differently:** When a hypothesis frames a race in terms of one component (the cache), always trace the *guard* that prevents stale entry creation, not just the lookup path. The publication side (`generation.ts`) and the gate (`deriveFreshness`) are co-equal evidence sources to the cache itself.

## Recommended Next Focus

F41 is closed. All deferred items from prior iterations are resolved. Iteration 18 should:

1. **Synthesis pass on F77-F82** — fold the F81 patch into the F37-v2 / F59 consolidated remediation table as a new P2 row (estimated effort: 5-LOC + 1 vitest assertion).
2. **Cross-check convergence:** with F70 (delete plan), F71 (vocabulary unification), F43 (instrumentation), F81 (cache-listener wire-up) all having concrete PR-ready patches, confirm STOP_READY signal holds and assemble final convergence dossier.
3. **Consider declaring convergence at iter-18** if no new questions emerge during synthesis pass.
