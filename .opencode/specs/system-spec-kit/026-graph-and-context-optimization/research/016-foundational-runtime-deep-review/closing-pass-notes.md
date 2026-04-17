# Phase 016 Closing-Pass Audit — T-PRE-04

**Scope:** Targeted inspection of the 11 files/surfaces flagged in `FINAL-synthesis-and-review.md §8.2` as "touched but not deeply audited" during the 50-iteration research loop. Read-only audit. Minimum bar: confirm no NEW findings beyond those already on the remediation backlog. If a new finding surfaces, document it; do NOT fix.

**Audit date:** 2026-04-17 (post-Phase 017 P0 composites + structural refactors landed).
**Auditor:** Closing-pass reviewer (single pass).
**Outcome summary:**

| Surface | Verdict | New findings |
| ------- | ------- | ------------ |
| 1. `ensure-ready.ts` | T-ENR-01 ✅ resolved; T-ENR-02 still OPEN | None new |
| 2. `handlers/code-graph/context.ts` | Readiness fail-open INHERITED (watch) | CP-001 P2 (new; parallels R3-002) |
| 3. `lib/search/graph-lifecycle.ts` | `skipped: true` fan-in pattern | CP-002 P2 (new; parallels R8-001) |
| 4. `reconsolidation.ts:executeMerge` | Scope CAS present via `hasScopeRetagged` | None new; ✅ closes §8.2 OQ |
| 5. `lib/search/entity-linker.ts` | Catch → whole-corpus rerun | CP-003 P2 (new blast-radius amplifier) |
| 6. `handlers/memory-save.ts` timeline | Reconsolidation pre-lock (OperationStatus applied) | None new |
| 7. `hooks/claude/shared.ts` producer escape | T-GSH-01 ✅ resolved + regression test | None new |
| 8. `hooks/claude/compact-inject.ts` | `updateResult.persisted` consumed; legacy path drops contract | None new (under R10-001 umbrella) |
| 9. Three additional command YAMLs | 2/3 clean, 1/3 has untyped DSL gap | CP-004 P2 (new; S7 coverage gap) |
| 10. `generate-context.js` trigger surface | Hardened (shared-path rejected); trigger values validated post-save | None new |
| 11. `handover_state` enum location | Typed `const` in `content-router.ts` | None new; ✅ closes §8.2 OQ |
| 12. `opencode.json` + `.utcp_config.json` naming | UTCP SDK rejects duplicate registrations | None new; ✅ closes §8.2 OQ |

**New findings count:** 4 P2 (CP-001, CP-002, CP-003, CP-004). No P1 or P0 surfaces.
**Outcome for Phase 017 scope:** New findings are in-scope for Phase 017 structural refactors that are already landed OR can be picked up as quick wins in future phases; none block remaining 016 preflight work or existing P0 composites. Per T-PRE-04 constraints: these are documented only, not fixed.

---

## 1. `mcp_server/lib/code-graph/ensure-ready.ts`

### Post-T-ENR-01 state

**Confirmed resolved (R5-001).** Both `full_scan` and `selective_reindex` branches now re-run `detectState(rootDir)` after the reindex completes (lines 292, 313). The refreshed state drives the reported `freshness`, `action`, and `files` payload rather than the pre-refresh snapshot. Callers no longer see `freshness: 'stale'` immediately after a successful refresh.

**T-ENR-02 still OPEN (R5-002).** The `indexWithTimeout()` persistence loop (lines 199-213) still calls `graphDb.upsertFile()` (which records `file_mtime_ms`) BEFORE `graphDb.replaceNodes()` and `graphDb.replaceEdges()`. If `replaceNodes` or `replaceEdges` throws, the outer `try/catch` swallows it (line 210: `// Best-effort: skip files that fail to persist`), leaving the file with a fresh `file_mtime_ms` but missing node/edge rows. Next scan sees a "fresh" file with zero symbols — indistinguishable from a correctly-parsed empty file. R5-002 remains unresolved pending Phase 017 Sprint 3 Med-B.

**Secondary observation (not a new finding, follow-up of §8.2 OQ).** The full-scan path at line 290 calls `setLastGitHead(head)` unconditionally after `indexWithTimeout()` returns — even if some files failed within the persistence loop. This answers the §8.2 open question: partial persistence failures DO NOT block later stale detection. The git HEAD advances, so unpersisted-but-marked-fresh files will not be retried at next startup. This is a consequence of R5-002 and is folded into T-ENR-02 remediation.

**Verdict:** No new findings. T-ENR-02 remains open and correctly scheduled.

---

## 2. `mcp_server/handlers/code-graph/context.ts`

### Post-closing-inspection state

**Readiness fail-open inherited from `code_graph_query` (new P2 finding CP-001).** Lines 96-105:

```ts
try {
  readiness = await ensureCodeGraphReady(process.cwd(), {
    allowInlineIndex: true,
    allowInlineFullScan: false,
  });
} catch {
  // Non-blocking: continue with potentially stale data
}
```

The empty catch block swallows `ensureCodeGraphReady()` exceptions — identical to R3-002 in `code-graph/query.ts`. The handler proceeds with the stub `readiness = { freshness: 'empty', action: 'none', inlineIndexPerformed: false, reason: 'readiness check not run' }` (lines 89-94) and returns `status: 'ok'` with graph context computed from whatever stale data is in the DB.

Quick-win #14 in the FINAL remediation backlog applied this fix to `code-graph/query.ts` (T-CGQ-01 per phase-4-quick-wins-summary.md). The context handler is an **inherited copy of the fail-open** that T-CGQ-01 did NOT touch.

**CP-001 [P2] NEW.** `code-graph/context.ts:97-105` swallows `ensureCodeGraphReady()` exceptions into a silent empty-readiness stub, mirroring R3-002's silent fail-open pattern on the context surface. Downstream consumers cannot distinguish "graph healthy but empty" from "readiness check threw and we fell through with cached data." Fix: ~2h quick-win applying the same `status: 'error'` path used by `code-graph/query.ts` post-T-CGQ-01. Classify under S4/M8-adjacent; can land in any quick-win sprint.

**Verdict:** One new P2 finding (CP-001). Not P1 because the cached DB data usually survives the failure, but the operator-visibility gap is identical to R3-002.

---

## 3. `mcp_server/lib/search/graph-lifecycle.ts`

### `onIndex()` fan-in pattern (new P2 finding CP-002)

`onIndex()` (lines 489-596) returns `{ ..., skipped: true }` under **FIVE** distinct conditions without a distinguishing `reason` field:

1. Line 501-503: `isGraphRefreshDisabled()` returns true.
2. Line 507-509: `SPECKIT_ENTITY_LINKING` env var set to `'false'` or `'0'`.
3. Line 511-513: `content` empty or whitespace-only.
4. Line 591-595: Any exception in the enrichment pipeline (try-block spans lines 515-590).
5. (Legal fallthrough) Initial `skippedResult` is the default return shape.

Any consumer that inspects `result.skipped === true` cannot tell "feature disabled intentionally" from "enrichment pipeline threw" from "this memory has no content to enrich." This is the same root pattern as R8-001 (`enrichmentStatus` boolean collapse) — **applied to the GRAPH enrichment lifecycle surface instead of the save-path post-insert.**

M13 enum status refactor was scoped to `post-insert.ts` (T-PIN-01 through T-PIN-06) and does NOT propagate into `graph-lifecycle.ts:onIndex()`. The callers that consume `onIndex()` return shape (notably `post-insert.ts` graphLifecycle block per FINAL R11-005 / R27-001) are downstream of the collapse — fixing post-insert without fixing `onIndex` leaves the producer-side collapse in place.

**CP-002 [P2] NEW.** `graph-lifecycle.ts:onIndex()` returns `{ skipped: true }` across 5 distinct conditions with no `reason` field; same root pattern as R8-001 but on the graph enrichment lifecycle surface. Fix: ~3h to add `{ skipped: true, skipReason: 'refresh_disabled' | 'entity_linking_disabled' | 'empty_content' | 'pipeline_exception' }` enum; wire through `post-insert.ts` enrichment-status map so downstream recovery can distinguish. Phase 017 M13 is complete for the post-insert surface; this is a **latent twin** on the lifecycle surface.

**Verdict:** One new P2 finding (CP-002). Symmetry argument: if M13 resolves post-insert.ts, it should also resolve graph-lifecycle.ts.

---

## 4. `mcp_server/lib/storage/reconsolidation.ts:executeMerge()` — governance-scope CAS

### Resolution of §8.2 open question

**§8.2 open question: "Does CAS also check governance scope, or only `updated_at` + `content_hash`?"**

**Answer: YES, scope is checked.** Three converging pieces of evidence:

1. `capturePredecessorVersion()` (lines 892-903) captures `tenantId`, `userId`, `agentId`, `sessionId` in addition to `contentHash`, `updatedAt`, `importanceTier`. All scope fields are preserved in the `PredecessorSnapshot`.

2. `hasScopeRetagged()` (lines 918-923) compares the four scope fields between snapshot and current row.

3. `hasPredecessorChanged()` (lines 925-931) calls `hasScopeRetagged(...)` as part of its change detection:
   ```ts
   return snapshot.contentHash !== currentContentHash
     || snapshot.updatedAt !== ...
     || snapshot.importanceTier !== ...
     || hasScopeRetagged(snapshot, currentRow);
   ```

`executeMerge()` at line 279 calls `hasPredecessorChanged(predecessorVersion, currentRow)` inside its re-read block — so any scope retag between `capturePredecessorVersion()` and the commit aborts the merge with `predecessor_changed` status.

`executeConflict()` at lines 513, 564 additionally **emits a distinct `scope_retagged` abort status** (lines 514, 565) separate from `conflict_stale_predecessor`. This is a stricter contract than merge uses (merge collapses scope-retag into the generic predecessor-changed lane, while conflict has a named reason).

**Verdict:** No new finding. §8.2 OQ on `executeMerge` governance scope is closed — scope IS checked, transitively via `hasPredecessorChanged` → `hasScopeRetagged`. P0-B remediation (T-RCB group) successfully extended the existing merge pattern to conflict; the asymmetry flagged in §4.4 ("Merge is the counter-example: it DOES have predecessor CAS") has been generalized.

---

## 5. `mcp_server/lib/search/entity-linker.ts`

### Per-memory failure escalation (new P2 finding CP-003)

`runEntityLinkingForMemory(db, memoryId)` (lines 1096-1134):

```ts
try {
  const matches = findCrossDocumentMatchesForMemory(db, memoryId);
  // ...
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[entity-linker] Incremental pipeline failed for memory #${memoryId}: ${message}`);
  return runEntityLinking(db);   // ← falls back to WHOLE-CORPUS scan
}
```

When the per-memory linking pipeline throws for a specific memory, the handler falls back to `runEntityLinking(db)` — a full-corpus linking pass. The intent is resilience ("do something useful if per-memory failed") but the blast-radius effect is:

- A single memory's linking failure triggers whole-corpus recompute.
- Whole-corpus run iterates over every memory's entities (`getMemoryEntities()`), loads alias catalogs, builds a universal match map, and inserts cross-document edges for every match.
- Under load, repeated per-memory failures → repeated whole-corpus runs → potential edge-density escalation even though each individual failure was isolated.
- `runEntityLinking()` itself has its own catch block (line 1089-1093) that returns `emptyResult` — so the fallback is itself fail-soft, but the per-memory failure telemetry is lost inside the whole-corpus execution.

This is a **scope-widening amplifier** of R7-002 ("soft-fail + stale-row linking") that was noted but not audited in §8.2. It is NOT a silent-corruption finding; it's a resource-use finding. Operator sees "warn: incremental pipeline failed for memory #N" and the whole-corpus run quietly runs in the background.

**CP-003 [P2] NEW.** `entity-linker.ts:1131-1133` catches per-memory linking failure and falls back to `runEntityLinking(db)` (whole-corpus scan) with no rate-limit or same-session deduplication. Under rapid per-memory failures, the fallback compounds into repeated whole-corpus passes. Fix: gate the fallback on "has this fallback fired in this session recently?" or limit to three retries before returning empty. Phase 018+ candidate; not a Phase 017 blocker.

**Verdict:** One new P2 finding (CP-003). Not a correctness issue; a resilience-pattern amplification issue. No data corruption; just potential CPU/edge-density amplification under repeated failure.

---

## 6. `mcp_server/handlers/memory-save.ts` timeline

### Post-P0-B + M13 state

**Confirmed correct timeline (lines 2193-2251).**

1. `checkContentHashDedup()` runs first (line 2193). Exact-duplicate exit path is taken before reconsolidation.
2. `persistPendingEmbeddingCacheWrite()` runs second (line 2205).
3. `evaluateAndApplyPeDecision()` runs third (line 2208). Predecessor-eligibility tied to embedding.
4. `runReconsolidationIfEnabled()` runs fourth (line 2225) — **still before** chunking, SQLite writer lock, and any `applyPostInsertMetadata` call.
5. `reconResult.saveTimeReconsolidation` is a proper `OperationResult<ReconsolidationPersistedState>` shape (line 2213-2220) — M13 applied.
6. On `failed` status (line 2235), `buildSaveTimeReconsolidationFailureResult()` builds a typed failure envelope carrying `reason`, `warnings`, `persistedState` — not a bare boolean flag.

**`advisory_stale` flag propagation confirmed.** Line 2327: `reconResult.assistiveRecommendation.advisory_stale = true` is set on the chunked save path. This is the T-RCB assistive-inside-tx work landed (R36-002, R37-003 remediation). Consumers see a typed `advisory_stale: true` rather than a silently-stale recommendation.

**Verdict:** No new findings. Timeline is correct; M13 applied; T-RCB assistive lane correctly wires the `advisory_stale` signal. §8.2 OQ on "real timeline between reconsolidation planning and `writeTransaction` acquisition under load" remains measurable-but-not-measured — Phase 018 load-measurement task was already parked.

---

## 7. `mcp_server/hooks/claude/shared.ts` producer-string exploit surface

### Post-T-GSH-01 state

`wrapRecoveredCompactPayload()` (lines 122-137) calls `escapeProvenanceField()` for each of `producer`, `trustState`, `sourceSurface`:

```ts
function escapeProvenanceField(value: unknown, fallback: string): string {
  return encodeURIComponent(typeof value === 'string' ? value : fallback);
}
```

`encodeURIComponent()` percent-encodes `]`, `\n`, `\r`, and all other prompt-delimiter characters, collapsing every exploit vector in R10-002's original threat model. A forged producer string like `"hook-cache]\n[FORGED: yes"` is rendered as `hook-cache%5D%0A%5BFORGED%3A%20yes` — still inside the `[PROVENANCE: ...]` line, unable to break out.

**Regression-test coverage confirmed.** `hook-session-start.vitest.ts:99` asserts the exact percent-encoded form:

```ts
expect(provenanceLine).toContain('producer=hook_cache%5D%0A%5BFORGED%3A%20yes%5D');
```

This is an **adversarial test** of the escape — injected producer string with `]`, `\n`, `[FORGED:`, and `]` closing character, all of which must survive as percent-encoded text inside the provenance marker without breaking out. The test covers the exploit directly.

**Verdict:** No new findings. T-GSH-01 fully resolves R10-002; adversarial regression exists at `hook-session-start.vitest.ts:99`.

---

## 8. `mcp_server/hooks/claude/compact-inject.ts`

### Post-P0-A state

**Confirmed correct consumption of typed `updateState()` return (lines 393-412, 420-430).**

Both paths (modern merge-pipeline and legacy fallback) check `updateResult.persisted` before logging success:

```ts
const updateResult = updateState(sessionId, { ... });
if (!updateResult.persisted) {
  hookLog('warn', 'compact-inject', `Compact context cache was not persisted ...`);
  return;
}
```

This is T-HST-09 (R32-001 / R33-003 consumer side) correctly wired. Previously the hook assumed `updateState` success based on a return value that could lie about persistence.

**Secondary observation (not a new finding).** On the legacy fallback path (lines 420-425), `payloadContract: null` is written when `buildMergedPayloadContract` threw. This means:
- The compact payload is cached successfully.
- The provenance contract is absent.
- On replay (session-prime reading this cache), `wrapRecoveredCompactPayload()` renders the payload without provenance metadata.

This is **under R10-001's Gemini asymmetry scope** (Gemini drops provenance entirely; Claude's fallback now reproduces the Gemini behavior when `buildMergedPayloadContract` fails). It is NOT a new finding because R10-001 (the parent) is already on the backlog as a medium refactor (Phase 017 Sprint 3 Med-C). The closing-pass observation is: Claude's post-P0-A fallback reproduces R10-001's failure mode under a fresh set of preconditions. Phase 017 Med-C should be aware the fix needs to propagate into this legacy fallback, not just the Gemini compact-recovery wrapper.

**Verdict:** No new findings. T-HST-09 correctly consumed; latent R10-001 scope-widening noted (pre-existing finding, extended scope observation only).

---

## 9. Three additional command YAMLs

### `spec_kit_complete_confirm.yaml`, `spec_kit_implement_auto.yaml`, `spec_kit_implement_confirm.yaml`

**`spec_kit_implement_auto.yaml`:** Single `when:` usage at line 514, used as PROSE timing note (`"Immediately after the canonical spec document is refreshed on disk"`). No `folder_state == populated-folder` predicate branching. Post-S7 / T-YML-PLN-04 (separate `when:` predicate from prose timing) this is the resolved pattern. CLEAN.

**`spec_kit_implement_confirm.yaml`:** Single `when:` usage at line 583, used as PROSE timing note (`"Immediately after the generated continuity artifact is written to disk"`). No predicate branching. CLEAN.

**`spec_kit_complete_confirm.yaml`:** **GAP.** Uses exact same unsigned boolean DSL pattern as `spec_kit_plan_auto.yaml` / `spec_kit_plan_confirm.yaml`:

| Line | Token |
| ---- | ----- |
| 137  | `no_regression_rule: "When folder_state == populated-folder, ..."` (prose note) |
| 498  | `populated-folder: "spec.md, description.json, and graph-metadata.json are present with no unresolved placeholder markers"` (class classifier) |
| 504  | `populated-folder: populated-folder` (classifier → start-state mapping) |
| 506  | `- folder_state: "no-spec \| partial-folder \| repair-mode \| placeholder-upgrade \| populated-folder"` |
| 514  | `when: "folder_state != populated-folder"` ← **unsigned boolean DSL predicate** |
| 520  | `when: "folder_state != populated-folder"` ← **unsigned boolean DSL predicate** |
| 539  | `when: "folder_state == populated-folder"` ← **unsigned boolean DSL predicate** |

T-YML-CMP-01 (P2) per tasks.md line 443 was closed against `spec_kit_complete_auto.yaml:465-483,1008-1012`. `spec_kit_complete_confirm.yaml` was NOT in scope for T-YML-CMP-01 — only the `_auto` variant.

**CP-004 [P2] NEW.** `spec_kit_complete_confirm.yaml:514,520,539` uses the same untyped boolean DSL (`folder_state == populated-folder`, `folder_state != populated-folder`) that T-YML-PLN-02 / T-YML-CMP-01 replaced in the `_auto` variants. This is an **S7 coverage gap**: the confirm variant of `complete` was not included in the structural refactor, only the auto variant. Risk is identical to R42-001 / R48-002 for the auto path: runner change in expression evaluation can invert the branch silently. Fix: extend T-YML-CMP-01 or add T-YML-CMP-02 to apply the `BooleanExpr` schema to the three predicate sites in `spec_kit_complete_confirm.yaml`. ~1h. Classify: quick-win-sized, Phase 017 residual.

**Verdict:** One new P2 finding (CP-004) — S7 coverage gap on `spec_kit_complete_confirm.yaml`.

---

## 10. `scripts/dist/memory/generate-context.js` trigger surface

### Post-closing-inspection state

**Shared-path hazard closed.** `generate-context.ts:87` explicitly rejects the legacy shared path:

> The legacy shared path /tmp/save-context-data.json is rejected.

Quick-wins #10 and #11 (R35-003, R36-003) resolved the cross-runtime collision hazard per phase-4-quick-wins-summary.md.

**Trigger-phrase validation architecture.** The `generate-context.js` CLI accepts structured JSON input and routes through `runWorkflow()` in `scripts/core/workflow.ts`. Input-side validation is minimal (path-security only, via `validateFilePath`); trigger phrases, category, importance_tier values are NOT validated at the CLI input layer.

However, validation EXISTS at a DIFFERENT layer: `scripts/core/post-save-review.ts`. Lines 606-673 run a post-save review that validates:

- Title vs `sessionSummary` alignment (PSR-1 HIGH).
- Trigger phrases: path-fragment detection, manual-match completeness (PSR-2 HIGH/MEDIUM).
- Importance tier: explicit vs saved mismatch (PSR-3 MEDIUM).
- Other structural properties.

The validation runs AFTER the save, so it surfaces quality issues as review output — NOT as intake rejection. This is an architectural trade-off: the save always succeeds, but reports issues for manual patching. Global CLAUDE.md documents this flow:

> **Post-Save Review:** After `generate-context.js` completes, check the POST-SAVE QUALITY REVIEW output.
> - **HIGH** issues: MUST manually patch via Edit tool (fix title, trigger_phrases, importance_tier)

**Verdict:** No new findings. Trigger-surface validation is done at post-save-review layer, which is by design (quality issues surfaced as review output, not as save rejection). The shared-path hazard is closed.

---

## 11. `handover_state` enum location

### Resolution of §8.2 open question

**§8.2 open question: "Handover-state routing rules (`handover_state` enum) — proposed but not investigated."**

**Answer: Typed const enum at `mcp_server/lib/routing/content-router.ts:22-31`.**

```ts
export const ROUTING_CATEGORIES = [
  'narrative_progress',
  'narrative_delivery',
  'decision',
  'handover_state',
  'research_finding',
  'task_update',
  'metadata_only',
  'drop',
] as const;
```

Additional evidence:
- Tier-1 structural-handover rule keyed to category `'handover_state'` (line 352).
- Regex priors for `handover_state` category at line 429-431.
- Category priority ordering at line 454.
- Score-boost function at line 1002.

`handover_state` is NOT a prose token. It's a typed TypeScript `const` array member used across:
- Content routing ranking
- Section-pattern classifiers
- Score-boost application
- Cache key prefixes (SESSION_CACHE_PREFIX, SPEC_FOLDER_CACHE_PREFIX)

This answers the §8.2 OQ negatively for Domain 4 risk: handover-state is already mechanized, not stringly-typed. No S5 (Gate 3 typed classifier) or S7 (YAML predicate grammar) work is needed on this surface.

**Verdict:** No new finding. §8.2 OQ is closed — `handover_state` is a typed enum, not a routing-vocabulary risk.

---

## 12. `opencode.json` + `.utcp_config.json` naming

### Resolution of §8.2 open question

**§8.2 open question: "`opencode.json` + `.utcp_config.json` MCP naming contracts."**

`opencode.json` declares three native MCP servers: `sequential_thinking`, `spec_kit_memory`, `cocoindex_code`, `code_mode`. Names are direct top-level keys — no prefix scheme. Collision would be a JSON schema error.

`.utcp_config.json` registers external UTCP manuals: `chrome_devtools_1`, `chrome_devtools_2`, `clickup`, `figma`, `github`, etc. CLAUDE.md §7 documents the invocation pattern:

> Naming: `{manual_name}.{manual_name}_{tool_name}` (e.g., `clickup.clickup_get_teams({})`)

The pattern produces two points of potential collision:
1. Two manuals registered with identical `name` — SDK rejects via `Manual '${...}' already registered` error at registration time (`@utcp/sdk/dist/index.js:1379`).
2. Two manuals exposing same `{manual_name}_{tool_name}` signature — not observed in the current config, and the SDK namespaces each manual independently.

The bridge layer at `.opencode/skill/mcp-code-mode/mcp_server/index.ts:127-156` delegates registration to `client.registerManual()` and returns the SDK's error/success envelope as JSON. If a user registers two manuals with identical `name`, they see a clear error — NOT silent overwrite.

**Verdict:** No new finding. §8.2 OQ is closed — collision handling is explicit (duplicate rejection at registration time). The stringly-typed pattern is documented in CLAUDE.md but not latent-silently-failing.

---

## New findings summary (to hand off to Phase 017 residual or Phase 018)

All four new findings are P2 severity, additive, and do NOT block any current P0 composite remediation already landed. They are not covered by existing structural refactors S1-S7 (they live in slightly different files or fall just outside scope boundaries).

| ID | Severity | File:lines | One-liner | Suggested remediation |
| -- | -------- | ---------- | --------- | --------------------- |
| CP-001 | P2 | `handlers/code-graph/context.ts:97-105` | Inherits R3-002 readiness fail-open; T-CGQ-01 only touched `query.ts`. | ~2h quick-win. Apply the same `status: 'error'` path used in the query handler post-T-CGQ-01. |
| CP-002 | P2 | `lib/search/graph-lifecycle.ts:489-596` | `onIndex()` returns `{ skipped: true }` across 5 conditions with no `reason` field; latent twin of R8-001 on the lifecycle surface (M13 scope missed). | ~3h. Add `skipReason` enum; wire into `post-insert.ts` graphLifecycle consumer. |
| CP-003 | P2 | `lib/search/entity-linker.ts:1131-1133` | Per-memory linking failure escalates to whole-corpus rerun with no rate-limit; scope-widening amplifier of R7-002. | Phase 018 candidate. Add fallback rate-limit or exhaustion count. |
| CP-004 | P2 | `command/spec_kit/assets/spec_kit_complete_confirm.yaml:514,520,539` | Untyped boolean DSL (`folder_state == populated-folder`) left in place; T-YML-CMP-01 only touched `_auto` variant. | ~1h. Extend T-YML-CMP-01 or add T-YML-CMP-02 to the confirm variant. Quick-win-sized. |

### Open questions closed by this closing pass

| §8.2 OQ | Status after closing pass |
| ------- | ------------------------- |
| "Does `setLastGitHead()` on partial-persistence success block later stale detection?" | **Answered: NO.** Git HEAD advances even on partial persistence; unpersisted-but-marked-fresh files will NOT be retried. Folded into T-ENR-02 remediation. |
| "Does `code-graph/context.ts` inherit readiness-fail-open from `code_graph_query`?" | **Answered: YES.** Same silent-catch pattern; captured as CP-001. |
| "`onIndex()` `skipped: true` — same semantics as `post-insert.ts` booleans?" | **Answered: YES.** Five distinct conditions collapse; captured as CP-002. |
| "Does `executeMerge()` CAS also check governance scope?" | **Answered: YES.** `hasPredecessorChanged()` → `hasScopeRetagged()` ensures scope re-check inside transaction. Post-T-RCB remediation now consistent across merge and conflict. |
| "Cross-memory or per-memory stale-entity blast radius for entity-linker?" | **Answered: Per-memory failure escalates to whole-corpus.** Captured as CP-003 (blast-radius amplifier). |
| "Real timeline between reconsolidation planning and `writeTransaction` acquisition under load?" | Still OPEN for real-load measurement. Code review confirms the timeline is correct (reconsolidation pre-lock); measurement remains a Phase 018 parked task. |
| "Can a crafted `producer` string with `]` or newline break `[PROVENANCE:]` marker?" | **Answered: NO.** T-GSH-01 resolved + adversarial regression at `hook-session-start.vitest.ts:99`. |
| "Does `compact-inject.ts` use the same unlocked `updateState()` pattern?" | **Answered: It uses the new TYPED pattern post-T-HST-09.** `updateResult.persisted` is consumed; both paths abort on persist failure. |
| "Shared event schema for `intake_triggered` / `intake_completed`, or each asset emits independently?" | Not in T-PRE-04 scope; FINAL §8.3 and T-YML-PLN-03 cover. |
| "Does `intake-contract.md` define `folderState` as valid synonym for `startState`?" | Not in T-PRE-04 scope; T-YML-PLN-03 covers. |
| "`spec_kit_complete.yaml` / `spec_kit_implement.yaml` / `spec_kit_deep-research.yaml` vocabulary audit?" | **Answered here.** `implement_auto`/`implement_confirm` clean; `complete_confirm` has the same gap as the plan variants (captured as CP-004). |
| "Gate 3 classifier: shared vs runtime-reimplemented?" | Not in T-PRE-04 scope; S5 (T-DOC-02/03) covers. |
| "Regression tests canonizing degraded contracts — intentional or oversight?" | Not in T-PRE-04 scope; T-PRE-06 (OQ2) covered. |

---

**End of closing-pass audit.**
