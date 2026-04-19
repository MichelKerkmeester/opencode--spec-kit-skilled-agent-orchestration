# Iteration 11 — Domain 1: Silent Fail-Open Patterns (1/10)

## Investigation Thread
I revisited the runtime seams already flagged in the packet scratch notes, but only kept paths that were still novel after checking iterations 001-008 and the Phase 015 review. This pass focused on warning-only downgrade branches and success-shaped outputs that hide skipped or degraded work in `session-stop.ts`, `graph-metadata-parser.ts`, `code-graph/query.ts`, `reconsolidation-bridge.ts`, and `post-insert.ts`.

## Findings

### Finding R11-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- **Lines:** `199-218, 248-276`
- **Severity:** P1
- **Description:** If transcript stat/parsing or producer-metadata construction fails after a `transcript_path` is present, the stop hook degrades to a warning-only path and still completes the stop flow. Caller perception: the session stop hook finished normally and may still auto-save summary/spec-folder state. Reality: the hook never persisted `producerMetadata`, so transcript fingerprint, last turn timestamp, and cache-token evidence silently disappear for that session.
- **Evidence:** `buildProducerMetadata()` depends on `statSync(transcriptPath)` and packages transcript/cache metadata (`session-stop.ts:199-218`), but the surrounding transcript block catches every exception and only logs `Transcript parsing failed` (`session-stop.ts:248-276`). `producerMetadataWritten` stays `false` unless the happy path reaches `recordStateUpdate(... producerMetadata ...)` (`session-stop.ts:261-269`). Direct coverage is success-only: `tests/hook-session-stop-replay.vitest.ts:14-40` asserts `producerMetadataWritten === true`, and `tests/hook-session-stop.vitest.ts:17-88` only exercises spec-folder detection.
- **Downstream Impact:** Startup/resume continuity and analytics consumers lose the metadata they need to verify transcript freshness and cache-token provenance, but operators only see a warning in hook logs. The session remains observationally similar to an ordinary stop event instead of an incomplete continuity capture.

### Finding R11-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- **Lines:** `223-233`
- **Severity:** P2
- **Description:** `validateGraphMetadataContent()` fail-opens legacy line-based payloads into `ok: true` results with no migration or downgrade marker. Caller perception: the file is current-schema-valid graph metadata. Reality: the parser accepted an obsolete fallback format and returned fully trusted metadata without telling the caller that it came through the legacy path.
- **Evidence:** On any primary-parse failure, the validator calls `parseLegacyGraphMetadataContent(content)` and, if that succeeds, immediately returns `{ ok: true, metadata, errors: [] }` (`graph-metadata-parser.ts:223-233`). There is no `migrated`, `legacy`, or warning field in the result. The direct schema suite explicitly normalizes this behavior: `tests/graph-metadata-schema.vitest.ts:223-245` expects legacy line-based content to pass as `ok === true`.
- **Downstream Impact:** Tooling that relies on `validateGraphMetadataContent()` or `loadGraphMetadata()` cannot distinguish first-class metadata from fallback-migrated legacy content. That makes stale packet metadata formats look healthy, which raises the chance of silent drift surviving save/merge/index workflows.

### Finding R11-003
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
- **Lines:** `367-385`
- **Severity:** P1
- **Description:** `blast_radius` silently degrades unresolved subjects into seed file paths. Trigger: `resolveSubjectFilePath(candidate)` returns `null` for a symbol ID, fqName, or typo. Caller perception: the handler successfully computed a blast radius and found no dependents beyond the seed. Reality: the subject never resolved; the handler just reused the raw input string as a file path and returned an `ok` payload.
- **Evidence:** The blast-radius path builds `sourceFiles` with `graphDb.resolveSubjectFilePath(candidate) ?? candidate` (`query.ts:371-373`) and only errors when the filtered array is empty (`query.ts:375-381`). Any non-empty unresolved string therefore survives as a seed and flows into `computeBlastRadius(...)` (`query.ts:384-400`). The direct handler tests only cover resolvable file-path inputs (`tests/code-graph-query-handler.vitest.ts:148-239`) and never assert behavior for unresolved blast-radius subjects.
- **Downstream Impact:** Change-impact and refactor workflows can get false-negative dependency sets when they ask for blast radius by symbol name or stale file path. The result stays `status: "ok"`, so downstream automation has no built-in signal that the structural seed was never valid.

### Finding R11-004
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- **Lines:** `283-295`
- **Severity:** P2
- **Description:** Scope-filtered reconsolidation candidates vanish silently. Trigger: `vectorSearch()` finds similar memories, but `candidateMatchesRequestedScope(...)` filters them all out. Caller perception: the save had no actionable reconsolidation candidate, so the normal create path is the correct outcome. Reality: there were high-similarity candidates, but the bridge dropped them after governance filtering and emitted no warning that dedup/review evidence existed but was suppressed.
- **Evidence:** `findSimilar` intentionally over-fetches search results, then applies `results.filter(...candidateMatchesRequestedScope...)` and returns only the sliced `scopeFiltered` set (`reconsolidation-bridge.ts:283-295`). If that array is empty, the bridge emits no warning before reconsolidation falls through to the normal create path. The dedicated regression test codifies the silent behavior: `tests/reconsolidation-bridge.vitest.ts:255-330` expects `earlyReturn === null` when cross-scope candidates are rejected, but it does not expect any surfaced warning or advisory payload.
- **Downstream Impact:** Governed saves can accumulate duplicate or near-duplicate rows with no operator hint that reconsolidation was suppressed by scope metadata. When scope fields drift or are missing, the save path looks indistinguishable from a genuine "no similar memories found" result.

### Finding R11-005
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts`
- **Lines:** `136-147, 187-200`
- **Severity:** P2
- **Description:** Post-insert status booleans also collapse helper-return no-ops into success, not just deferred/disabled branches. Caller perception: summary generation and graph lifecycle enrichment completed cleanly. Reality: the helpers can report "nothing stored" or "skipped" while `post-insert.ts` still flips `summaries` / `graphLifecycle` to `true`, which suppresses the save pipeline's only generic partial-enrichment warning.
- **Evidence:** `generateAndStoreSummary(...)` is called and `enrichmentStatus.summaries = true` is set unconditionally after the await, without checking `summaryResult.stored` (`post-insert.ts:136-147`). Likewise, `onIndex(...)` can return `skipped: true`, but `post-insert.ts` still sets `enrichmentStatus.graphLifecycle = true` after the call (`post-insert.ts:187-200`). `response-builder.ts:315-321` only warns when an enrichment flag is `false`. The helper test suites prove the ignored no-op states exist: `tests/memory-summaries.vitest.ts:371-382` expects `stored=false` for empty content, and `tests/graph-lifecycle.vitest.ts:658-668` expects `skipped=true` when graph refresh does not actually run. The post-insert coverage does not exercise those branches; `tests/post-insert-deferred.vitest.ts:11-48` only locks in planner-first deferral.
- **Downstream Impact:** Save responses can look fully enriched even when no summary row was written or graph-lifecycle indexing decided to skip work. That makes retrieval freshness gaps and graph-update misses much harder to diagnose from normal `memory_save` output.

## Novel Insights
- The remaining silent-degrade seams are mostly not "hard errors swallowed into success" so much as **truth-contract erosion**: old formats are treated as current, unresolved blast-radius subjects are treated as valid seeds, and governed reconsolidation suppression is treated as ordinary absence.
- `post-insert.ts` still has a second layer of status collapse beyond the already-documented deferred path from Iteration 8: even helper-return no-ops are normalized into success. That means the save pipeline has fewer truthful warning surfaces than the earlier pass showed.
- The direct tests are asymmetric: they are strong on positive replay/schema/happy-path flows, but the missing branches are exactly the ones that would let operators distinguish "work completed" from "work silently downgraded."

## Next Investigation Angle
Stay in Domain 1 and trace the response-shaping layers that consume these degraded contracts: `memory-save`/`response-builder.ts`, startup/resume continuity readers, and any graph-query callers that turn `status: "ok"` plus empty data into routing decisions. The next pass should focus on which higher-level APIs preserve, collapse, or erase these low-level degradation signals.
