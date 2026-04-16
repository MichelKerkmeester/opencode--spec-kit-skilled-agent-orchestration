# Iteration 25 — Domain 2: State Contract Honesty (5/10)

## Investigation Thread
I re-read the five target seams, then shifted from first-hop runtime consumers to the places where those collapsed states are now being **canonized**: direct tests, transport payloads, and cross-runtime hook reuse. This pass kept only findings that were not already covered in Iterations 021-023.

## Findings

### Finding R25-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts`
- **Lines:** `223-237`
- **Severity:** P2
- **Description:** The deferred-enrichment branch is no longer just a source-local boolean collapse; the repo now treats that success-shaped state as the expected contract. When planner-first mode skips enrichment, `post-insert.ts` returns all five `enrichmentStatus` booleans as `true`, even though no enrichment work ran. `response-builder.ts` only emits a warning when any boolean is `false`, so the deferred path becomes observationally identical to a fully successful run unless a caller separately inspects `executionStatus`.
- **Evidence:** `handlers/save/post-insert.ts:223-237` returns `enrichmentStatus = { causalLinks: true, entityExtraction: true, summaries: true, entityLinking: true, graphLifecycle: true }` together with `executionStatus.status = 'deferred'`. `handlers/save/response-builder.ts:311-321` only surfaces warnings from `Object.values(enrichmentStatus).some(v => !v)`. The direct regression suite locks that contract in: `tests/post-insert-deferred.vitest.ts:35-47` explicitly expects all booleans to be `true` for a deferred run, and `tests/handler-memory-save.vitest.ts:2590-2607` reuses the same all-true result as the default post-insert stub in save-path coverage.
- **Downstream Impact:** Save-path consumers and regressions are now built around “all booleans true means good enough,” so a future attempt to distinguish **completed**, **skipped**, and **deferred** enrichment would require undoing both runtime and test-level assumptions. Until then, internal callers that key off booleans or warning presence can misread “backfill still required” as “work already done.”

### Finding R25-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
- **Lines:** `319-334`
- **Severity:** P2
- **Description:** The ambiguous readiness branch remains effectively unguarded because the direct query suites are written around a hardcoded happy-state tuple: `fresh` readiness plus `structured` detector provenance. That means the already-known “readiness failure vs empty graph” dishonesty path is not just under-tested; the default regression surface actively normalizes the misleading state combination that hides it.
- **Evidence:** `handlers/code-graph/query.ts:319-334` seeds `readiness` as `freshness: 'empty'` and swallows `ensureCodeGraphReady(...)` failures before continuing. But `tests/code-graph-query-handler.vitest.ts:3-18` hoists `ensureCodeGraphReady` to return `{ freshness: 'fresh', action: 'none', inlineIndexPerformed: false, reason: 'ok' }` for the whole suite, and `tests/code-graph-query-handler.vitest.ts:53-64` also defaults `getLastDetectorProvenance()` to `'structured'`. The trust-emission suite reinforces the same success tuple: `tests/graph-payload-validator.vitest.ts:48-86` only asserts the `fresh`/`structured` payload, while the fail-closed branch there checks validation rejection, not the handler’s swallowed-readiness path.
- **Downstream Impact:** The main regression surface for `code_graph_query` will not catch cases where the tool returns `status: "ok"` after readiness failed or was never meaningfully established. That leaves the structural tool most routing surfaces recommend vulnerable to shipping ambiguous “empty-or-failed” payloads without CI pressure against the dishonest branch.

### Finding R25-003
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- **Lines:** `223-233`
- **Severity:** P2
- **Description:** The schema-invalid-as-legacy fallback is now codified as a **clean success contract**, not just an implementation fallback. `validateGraphMetadataContent(...)` returns `ok: true` with no degraded or migrated marker when legacy parsing succeeds, and the direct schema test asserts exactly that outcome. Downstream callers therefore have no test-protected place to surface that recovery provenance.
- **Evidence:** `lib/graph/graph-metadata-parser.ts:223-233` retries primary-parse failures through `parseLegacyGraphMetadataContent(...)` and returns `{ ok: true, metadata, errors: [] }` on success. `tests/graph-metadata-schema.vitest.ts:223-245` explicitly treats legacy line-based content as ordinary validator success and asserts only the parsed fields, not any migration/degradation marker. `lib/parsing/memory-parser.ts:293-330` then consumes any validator success as first-class `graph_metadata` and assigns `qualityScore: 1` with `qualityFlags: []`; that perfect-quality document type is later boosted for packet-oriented retrieval in `lib/search/pipeline/stage1-candidate-gen.ts:261-286`.
- **Downstream Impact:** Fallback-recovered graph metadata still enters indexing and search as if it were pristine current-schema content, and the validator’s own contract makes it hard to add an honest recovery signal without changing expected behavior. The result is that malformed modern metadata can keep looking authoritative long after the original parse failure has been laundered away.

### Finding R25-004
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- **Lines:** `83-87`
- **Severity:** P1
- **Description:** The unvalidated `JSON.parse(raw) as HookState` seam now fans out across multiple runtimes, not just Claude. The same persisted state file is consumed by Gemini startup and compaction hooks, so a syntactically valid but schema-drifted state blob can misstate the active spec folder, inject stale or malformed compact payloads, or suppress recovery context in a second runtime with no additional validation layer.
- **Evidence:** `hooks/claude/hook-state.ts:83-87` trusts any parseable JSON as `HookState`. Gemini startup immediately consumes that state via `loadState()`/`readCompactPrime()` in `hooks/gemini/session-prime.ts:45-84,155-168`, and Gemini one-shot compaction reuse does the same in `hooks/gemini/compact-inject.ts:37-75`. Existing tests stay on the Claude/raw-state side: `tests/hook-state.vitest.ts:91-111,135-186` verifies happy-path persistence and fail-closed scope behavior, `tests/hook-session-start.vitest.ts:27-107` manually parses saved JSON and exercises Claude compact helpers, and `tests/edge-cases.vitest.ts:131-145` even confirms an expired `pendingCompactPrime` remains readable. There is no Gemini-specific adversarial coverage for malformed-but-parseable state.
- **Downstream Impact:** A single corrupted temp-state file is a cross-runtime control-plane problem: it can mislead both Claude and Gemini recovery flows while the current tests still pass. That widens the blast radius of the original validation gap from one hook lane to the shared session-priming substrate.

## Novel Insights
This iteration’s net-new result is that the remaining honesty problem is increasingly **governance-shaped, not just code-shaped**. Several of the targeted collapses are no longer accidental edge behavior; they are being reinforced by tests, fixtures, and transport-facing contracts that normalize degraded states as ordinary success.

Re-checking `shared-payload.ts` and the already-documented `code-graph/query.ts` / `graph-metadata-parser.ts` runtime consumers did not surface a stronger non-duplicate bug than Iterations 021-023. The new value here was proving which collapses are now **specified by regression behavior**, which raises the cost of making those surfaces honest later.

## Next Investigation Angle
Trace the transport and bootstrap layers that consume these canonized states: `session-bootstrap.ts`, `session-resume.ts`, `session-health.ts`, `lib/context/opencode-transport.ts`, and startup-hook surfaces. Focus on where machine-readable provenance (`trustState`, readiness, payload summaries) still flattens **missing vs empty vs stale** even when richer state is available elsewhere in the same payload.
