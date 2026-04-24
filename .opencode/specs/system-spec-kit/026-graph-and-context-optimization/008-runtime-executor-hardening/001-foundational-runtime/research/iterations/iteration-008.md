# Iteration 8 — Post-insert status truthfulness (8/10)

## Investigation Thread
I shifted from the hook/code-graph startup seam into the save-time enrichment controller in `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts`, then traced how its status object is consumed by `memory-save` result building and what the direct post-insert tests currently lock in. The focus was whether planner-first and degraded enrichment states stay truthful once they leave the pipeline.

## Findings

### Finding R8-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts`
- **Lines:** `86-213, 223-238`
- **Severity:** P1
- **Description:** `EnrichmentStatus` is documented as tracking which enrichment steps succeeded, but the implementation uses `true` for four different outcomes: actual success, feature-disabled skip, "nothing to do" skip, and full planner-first deferral. Because the save response only warns when some status flag is `false`, a save where no enrichment ran is serialized as fully healthy.
- **Evidence:** `post-insert.ts:86-92` initializes every step flag to `false`, but the non-run branches flip them to `true` at `110-113`, `130-133`, `152-155`, `178-181`, and `205-208`. The deferred wrapper returns all-`true` enrichment status again at `223-238` even though `executionStatus.status` is `'deferred'`. Downstream, `response-builder.ts:315-322` only emits a partial-enrichment warning when a flag remains `false`, and the direct regression test codifies the misleading contract by expecting all five booleans to be `true` in planner-first defer mode (`tests/post-insert-deferred.vitest.ts:11-47`).
- **Downstream Impact:** `handlers/memory-save.ts:2362-2383` forwards this status into the indexed save result, so planner-first saves and feature-disabled saves can look fully enriched even though causal links, summaries, entity linking, and graph lifecycle never ran. That suppresses the runtime's only generic warning surface for skipped freshness work and makes deferred saves observationally similar to completed saves.

### Finding R8-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts`
- **Lines:** `116-129, 157-181`
- **Severity:** P1
- **Description:** Entity linking is gated only by feature flags, not by successful entity extraction. If `extractEntities()`, `filterEntities()`, or `refreshAutoEntitiesForMemory()` throws, the catch block only logs a warning and the pipeline still calls `runEntityLinkingForMemory()` as long as the flags remain enabled.
- **Evidence:** `post-insert.ts:116-129` wraps extraction and auto-entity refresh in a try/catch and leaves the pipeline alive after failure. The later entity-linking branch at `159-177` checks only `isEntityLinkingEnabled() && isAutoEntitiesEnabled()`, not whether extraction actually succeeded. The refresh helper is the step that deletes and replaces existing auto-entities for the memory (`lib/extraction/entity-extractor.ts:198-224`), while `runEntityLinkingForMemory()` immediately queries persisted entities for that memory and builds links from those matches (`lib/search/entity-linker.ts:1096-1133`). There is no direct regression test for the failure path; the dedicated post-insert suite only covers planner-first deferral (`tests/post-insert-deferred.vitest.ts:11-47`).
- **Downstream Impact:** On update paths, stale auto-entities from the prior version of a memory can survive an extraction failure and still drive new cross-document links. That contaminates entity-link and graph-adjacent search state with relationships derived from outdated content while the save itself continues as if enrichment merely "best-effort succeeded."

## Novel Insights
Phase 015 already found that planner follow-up payloads advertise `runEnrichmentBackfill` as if it were an invocable tool (`review/015-deep-review-and-remediation/iterations/iteration-029.md:53-58`), but this pass found a deeper problem one layer earlier: the post-insert controller itself collapses "ran," "skipped," and "deferred" into success-shaped status. The direct tests are not just missing the issue; `tests/post-insert-deferred.vitest.ts` currently locks the all-`true` deferred contract in place.

## Next Investigation Angle
Stay on the save-path truthfulness seam and inspect `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` plus `startup-brief.ts` to see whether the same collapse happens in payload-level trust state, especially around `missing` vs `empty` vs `stale` structural context.
