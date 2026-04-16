# Iteration 23 — Domain 2: State Contract Honesty (3/10)

## Investigation Thread
I re-checked the requested state-collapse seams against Iterations 003, 004, 009, 011-020 and the Phase 015 review, then moved one layer downstream into their first consumers. The post-insert booleans themselves now look exhausted for new non-duplicate findings, so this pass focused on where already-known collapses still mutate caller-visible behavior: direct structural query readiness, packet-oriented graph-metadata retrieval, and compact-cache recovery.

## Findings

### Finding R23-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
- **Lines:** `319-361`
- **Severity:** P1
- **Description:** `code_graph_query` still exposes a non-canonical readiness shape after failures. It seeds `readiness` with `freshness: 'empty'`, swallows `ensureCodeGraphReady(...)` exceptions, and then returns a normal `status: 'ok'` payload. Elsewhere in the same runtime, the canonical structural contract already treats unusable graph states as `missing`, not `empty`, so direct query payloads can contradict bootstrap/resume guidance about whether structural context is absent or merely stale.
- **Evidence:** `handleCodeGraphQuery()` initializes `readiness` as `{ freshness: 'empty', action: 'none', inlineIndexPerformed: false, reason: 'readiness check not run' }` and ignores any thrown readiness error in the empty `catch` block (`handlers/code-graph/query.ts:319-334`), then serializes that object into successful outline payloads (`handlers/code-graph/query.ts:340-361`). By contrast, the shared structural contract maps every non-`fresh`/non-`stale` graph state to `status = 'missing'` (`lib/session/session-snapshot.ts:210-222`), and the hardening layer normalizes both `empty` and `error` into canonical readiness `missing` (`lib/code-graph/ops-hardening.ts:52-60`; `tests/code-graph-ops-hardening.vitest.ts:9-14`). Direct query coverage only asserts the happy-path `fresh` readiness payload and never exercises the thrown-readiness branch (`tests/code-graph-query-handler.vitest.ts:12-18, 66-85`).
- **Downstream Impact:** A caller that combines `session_bootstrap` with later `code_graph_query` reads can receive conflicting machine guidance for the same broken graph: bootstrap says the graph is structurally `missing`, while the query surface reports an `empty` readiness object inside a successful response. That breaks the "repair vs refresh" decision boundary for agents that rely on readiness metadata to decide whether to fall back, retry, or trust an empty result set.

### Finding R23-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- **Lines:** `223-233`
- **Severity:** P1
- **Description:** The schema-invalid-as-legacy fallback does not stop at validation. Once `validateGraphMetadataContent()` accepts the legacy reconstruction, the malformed modern file is indexed as first-class `graph_metadata`, and packet-oriented search explicitly boosts that document type above unboosted spec docs. This turns a validation downgrade into a retrieval-priority upgrade.
- **Evidence:** After any primary parse failure, the validator retries `parseLegacyGraphMetadataContent(content)` and returns `{ ok: true, metadata, errors: [] }` on success (`lib/graph/graph-metadata-parser.ts:223-233`). `memory-parser` then trusts that result and emits a `graph_metadata` document row for indexing (`lib/parsing/memory-parser.ts:293-320`). Stage 1 candidate generation adds a +0.12 score boost to every `graph_metadata` row for packet-oriented queries (`lib/search/pipeline/stage1-candidate-gen.ts:261-286`), and the direct integration suite locks that boost in place (`tests/graph-metadata-integration.vitest.ts:139-150`).
- **Downstream Impact:** A malformed current-schema `graph-metadata.json` that happens to look legacy-enough can surface as a boosted packet authority during searches like "resume packet dependencies and key files." That means downstream recovery, review, and planning flows can preferentially consume fallback-migrated metadata over the packet's unboosted spec/plan docs, even though the file only reached the index through a degraded validation path.

### Finding R23-003
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- **Lines:** `83-87`
- **Severity:** P2
- **Description:** Unvalidated hook state lets stale compact-cache metadata survive as normal state, and the first consumer collapses "cache exists but is expired or malformed" into the same user-facing outcome as "no cache exists." The persistence layer accepts any `pendingCompactPrime.cachedAt` value, then `session-prime` makes a late TTL decision and falls back to the generic recovery message without distinguishing why the cached context was discarded.
- **Evidence:** `loadState()` returns `JSON.parse(raw) as HookState` with no runtime validation (`hooks/claude/hook-state.ts:83-87`). The edge-case suite proves that an obviously expired cache timestamp is persisted and loaded unchanged (`tests/edge-cases.vitest.ts:130-145`). `handleCompact()` then returns the exact same fallback recovery block for both `!pendingCompactPrime` and `Number.isNaN(cachedAtMs) || cacheAgeMs >= CACHE_TTL_MS` (`hooks/claude/session-prime.ts:45-63`). Existing hook-session-start coverage only validates the standalone wrapper and a no-payload helper path; it never executes the stale-cache rejection branch in `handleCompact()` (`tests/hook-session-start.vitest.ts:78-107`).
- **Downstream Impact:** Post-compaction recovery can silently degrade from "auto-recovered from cached context" to "manual resume required" because of stale or malformed persisted state, but operators and higher-level automation cannot tell whether the failure came from cache absence, cache expiry, or state corruption. That makes hook-state quality bugs look like ordinary cold-start behavior and hides when the cache contract itself has drifted.

## Novel Insights
- Domain 2's remaining risk is no longer mostly inside the original boolean/status seams. The more interesting breakage now happens when adjacent consumers treat those degraded states as authoritative and then amplify them: `code_graph_query` diverges from the runtime's canonical readiness contract, `graph_metadata` fallback content gets a search boost, and compact-cache expiry becomes observationally identical to cache absence.
- The runtime already contains a better vocabulary for some of these states. `buildStructuralBootstrapContract()` and `normalizeStructuralReadiness()` preserve `missing` as distinct from `stale`, but the direct query and startup trust surfaces still flatten that distinction in caller-visible payloads.
- Re-checking the requested `post-insert.ts` boolean-collapse slice did not produce a new non-duplicate finding this iteration. The base collapse is already well documented in Iterations 008, 011-017; the remaining work in this domain is tracing which save/retry consumers still key off the collapsed surface.

## Next Investigation Angle
Stay in Domain 2, but keep following first consumers rather than the already-documented seam itself: trace which save/backfill callers trust `postInsertEnrichment.status` over warnings/per-step booleans, and map whether startup/bootstrap transport layers ever surface a machine-readable distinction between `missing` structural context and merely `stale` context.
