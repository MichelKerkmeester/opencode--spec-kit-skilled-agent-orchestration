# Iteration 13 — Domain 1: Silent Fail-Open Patterns (3/10)

## Investigation Thread
I stayed in the same five runtime seams from Iteration 11, but filtered out the already-documented timeout, legacy-fallback, blast-radius, scope-filter, and summary/graph no-op cases. This pass focused on *silent absence* branches: paths that quietly treat missing prerequisites, unreadable inputs, or internal exceptions as ordinary "no-op" or success-shaped outcomes.

## Findings

### Finding R13-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- **Lines:** `60-67, 308-312`
- **Severity:** P1
- **Description:** Claude stop-hook autosave silently skips the entire `generate-context` call when the temp-state record lacks either `lastSpecFolder` or `sessionSummary`. Caller perception: stop processing completed normally, so continuity capture was attempted if autosave was enabled. Reality: `runContextAutosave()` returns before logging anything, and `processStopHook()` still logs `Session ... stop processing complete`.
- **Evidence:** `runContextAutosave()` loads hook state, trims `lastSpecFolder` / `sessionSummary.text`, and immediately `return`s on either missing value (`session-stop.ts:61-67`). The caller invokes it whenever `autosaveMode === 'enabled'` (`session-stop.ts:308-310`) and then unconditionally logs completion (`session-stop.ts:312`). Existing coverage never exercises live autosave branches: `tests/hook-session-stop.vitest.ts:7-89` only covers `detectSpecFolder()`, and `tests/hook-session-stop-replay.vitest.ts:14-56` hard-disables autosave.
- **Downstream Impact:** Any earlier ambiguity or state-write miss that leaves `lastSpecFolder` / `sessionSummary` unset turns into silent continuity loss at session end. Resume and memory-search consumers keep relying on stale prior saves, but the hook surface looks indistinguishable from a healthy stop event.

### Finding R13-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- **Lines:** `280-285, 457-475, 831-860`
- **Severity:** P1
- **Description:** Graph-metadata derivation fail-opens unreadable canonical docs into "doc missing" semantics. Caller perception: the packet legitimately lacks certain canonical docs, so derived status/key-topics/key-files reflect repository truth. Reality: `readDoc()` collapses I/O failure into `null`, `collectPacketDocs()` silently drops the document, and `deriveStatus()` then reinterprets the reduced doc set as `planned` (missing `implementation-summary.md`) or `complete` (implementation summary present but checklist absent).
- **Evidence:** `readDoc()` catches every read failure and returns `null` (`graph-metadata-parser.ts:280-285`); `collectPacketDocs()` simply `continue`s on falsy content (`graph-metadata-parser.ts:457-475`). `deriveStatus()` then treats a missing implementation summary as `planned` and a missing checklist as `complete` (`graph-metadata-parser.ts:849-860`). The direct schema suite only covers readable temp-packet fixtures and a happy-path `children_ids: []` merge case (`tests/graph-metadata-schema.vitest.ts:168-245`); there is no unreadable-doc regression.
- **Downstream Impact:** A permission error, transient read failure, or broken canonical doc can silently rewrite packet status and derived metadata without surfacing corruption. That poisons `graph-metadata.json`, search/routing status buckets, and any packet graph view that trusts the derived status as authoritative.

### Finding R13-003
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
- **Lines:** `340-364`
- **Severity:** P2
- **Description:** `outline` queries silently degrade unknown or path-mismatched files into an `ok` payload with `nodeCount: 0`. Caller perception: the requested file exists in the graph and simply contains no symbols. Reality: the handler never resolves or validates the subject path; it forwards the raw string to `queryOutline()` and serializes whatever empty array comes back as a successful outline.
- **Evidence:** The outline branch directly calls `graphDb.queryOutline(subject)`, slices the result, and always returns `status: 'ok'` with the original `subject` echoed as `filePath` (`query.ts:340-364`). Unlike symbol-based operations, there is no resolution error path before the response. Coverage is outline-happy-path only: `tests/graph-payload-validator.vitest.ts:48-86` asserts a valid outline payload, while `tests/code-graph-query-handler.vitest.ts:66-239` exercises imports/calls/blast-radius but not missing-outline subjects.
- **Downstream Impact:** Structural priming and file-outline tooling can misread a typo, absolute/relative mismatch, or not-yet-indexed file as an intentionally empty source file. That suppresses retries or reindex decisions and makes graph incompleteness look benign.

### Finding R13-004
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- **Lines:** `261-270, 438-442`
- **Severity:** P1
- **Description:** Save-time reconsolidation fails open on internal exceptions. Caller perception: the save genuinely had no reconsolidation outcome, so a normal create/index path is correct. Reality: once `allowSaveTimeReconsolidation` is active, any thrown error from checkpoint lookup, `reconsolidate(...)`, similarity callbacks, or conflict-store helpers is caught, reduced to a console warning, and the handler falls through to the normal create path without surfacing a structured warning.
- **Evidence:** The reconsolidation lane wraps the full branch in a single `try` (`reconsolidation-bridge.ts:261-392`) and catches every thrown error at `438-442`, logging `Reconsolidation error (proceeding with normal save)` but not appending that message to `reconWarnings`. The function then returns `earlyReturn: null` at the bottom of the file (`reconsolidation-bridge.ts:514-518`). Direct tests cover checkpoint gating and cross-scope candidate rejection (`tests/reconsolidation-bridge.vitest.ts:255-330`), but there is no regression that forces `reconsolidate()` or its callbacks to throw and verifies caller-visible degradation.
- **Downstream Impact:** Near-duplicate memories can be indexed as brand-new rows exactly when the dedup/merge subsystem is broken. Operators get, at best, a console warning, while the persisted save result loses the evidence that reconsolidation was attempted and failed.

### Finding R13-005
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts`
- **Lines:** `96-109, 210-214`
- **Severity:** P2
- **Description:** Causal-link enrichment treats partially unresolved link sets as a successful run. Caller perception: causal-link enrichment completed normally because `executionStatus.status === 'ran'` and `enrichmentStatus.causalLinks === true`. Reality: `processCausalLinks()` can return unresolved references, `post-insert.ts` only logs a warning, and the save-response warning layer never classifies that as partial enrichment failure.
- **Evidence:** After `processCausalLinks(...)`, the handler sets `enrichmentStatus.causalLinks = true` before only warning on `unresolved.length > 0` (`post-insert.ts:97-105`). The function still returns `executionStatus: { status: 'ran' }` (`post-insert.ts:210-214`). `response-builder.ts:300-321` exposes only `unresolved_count` and emits a generic partial-enrichment warning *only* when some enrichment flag is `false`. The unresolved branch is real and tested at the processor layer (`tests/handler-helpers.vitest.ts:680-710`), but there is no post-insert regression that checks caller-visible warning behavior for unresolved causal refs.
- **Downstream Impact:** Saves with missing causal edges present as successful enrichment runs even though part of the declared lineage was dropped. Consumers that watch only `postInsertEnrichment` or generic warning arrays will miss causal incompleteness and over-trust the resulting dependency graph.

## Novel Insights
- The remaining gaps in this domain are less about explicit warning branches and more about **absence being reinterpreted as truth**: absent autosave inputs become "nothing to do," unreadable docs become "packet has no doc," unresolved outline subjects become "file has no symbols," and thrown reconsolidation errors become "normal create path."
- `graph-metadata-parser.ts` and `session-stop.ts` both hide prerequisite loss behind successful top-level completion, but in opposite directions: one silently *drops input* before deriving state, while the other silently *drops output* before persisting continuity.
- The test suites are strongest at helper-layer behavior (`processCausalLinks`, entity density guard, graph-metadata happy paths) and weakest at the integration points where those helper outcomes are collapsed into success-shaped envelopes.

## Next Investigation Angle
Trace the caller-visible envelopes that consume these branches: `memory-save` result building, any session-stop autosave telemetry/health surface, and graph-query callers that treat `status: "ok"` plus empty payloads as authoritative. The next pass should map exactly where these low-level degradations are preserved, downgraded to hints, or erased entirely.
