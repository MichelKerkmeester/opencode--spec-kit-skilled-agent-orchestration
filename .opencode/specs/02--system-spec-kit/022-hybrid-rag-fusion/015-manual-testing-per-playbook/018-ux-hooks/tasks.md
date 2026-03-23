---
title: "Tasks: manual-testing-per-playbook ux-hooks phase [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description"
trigger_phrases:
  - "ux hooks tasks"
  - "phase 018 tasks"
  - "ux hooks test execution tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: manual-testing-per-playbook ux-hooks phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Open and verify playbook source: `../../manual_testing_playbook/manual_testing_playbook.md`
- [x] T002 Load review protocol from playbook §4
- [x] T003 Confirm feature catalog links for all 11 UX-hooks scenarios: `../../feature_catalog/18--ux-hooks/`
- [x] T004 Confirm vitest test files exist: `hooks-ux-feedback.vitest.ts`, `memory-save-ux-regressions.vitest.ts`, `context-server.vitest.ts`, `handler-checkpoints.vitest.ts`, `tool-input-schema.vitest.ts`, `mcp-input-validation.vitest.ts` — all 6 confirmed present in `mcp_server/tests/`
- [x] T005 Confirm `rg` (ripgrep) available; verified at runtime
- [x] T006 [P] Confirm feature flag support — all 6 flags wired in `lib/search/search-flags.ts` (lines 410, 420, 455, 463, 487, 495); all default ON (graduated) except SPECKIT_SESSION_RETRIEVAL_STATE_V1 which is default ON via `isFeatureEnabled`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Execute 103 — static analysis of `hooks/mutation-feedback.ts` and `hooks/response-hints.ts` confirms `errors: string[]`, latency/cache-clear booleans, and finalized hint payload. Test file `hooks-ux-feedback.vitest.ts` present. VERDICT: PASS
- [x] T008 Execute 104 — no-op save path fully verified from source: `dedup.ts:146–157` returns `status:'unchanged'` without DB write (FSRS fields untouched); `dedup.ts:248–261` returns `status:'duplicate'` without DB write; `memory-save.ts:1011` and `response-builder.ts:254` gate `shouldEmitPostMutationFeedback` on `status !== 'duplicate' && status !== 'unchanged'`; `memory-save.ts:1049`/`response-builder.ts:360` emit "caches were left unchanged" hint; atomic-save parity at `memory-save.ts:1062`; `memory-save-ux-regressions.vitest.ts` has 8 tests covering all paths. VERDICT: PASS
- [x] T009 Execute 105 — static analysis of `hooks/response-hints.ts` confirms `appendAutoSurfaceHints()` injects hints before `syncEnvelopeTokenCount()` (serialization), and `autoSurface` meta is preserved. `context-server.vitest.ts` present. VERDICT: PASS
- [x] T010 Execute 107 step 1 — `checkpoints.ts:290–294` rejects missing/mismatched confirmName; `safetyConfirmationUsed: true` at line 308. Schema files `tool-schemas.ts:344,349` and `tool-input-schemas.ts:293,498` enforce confirmName. Test files `handler-checkpoints.vitest.ts`, `tool-input-schema.vitest.ts`, `mcp-input-validation.vitest.ts` all present. VERDICT: PASS
- [x] T011 Execute 107 step 2 — `context-server.vitest.ts` Group 13b (T103–T106) at lines 1792–1821 confirmed: T103 checks schema, T104 checks missing-confirmName rejection, T105 checks mismatch, T106 checks correct proceed path. VERDICT: PASS
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Execute 106 step 1 — `hooks/index.ts:13` exports `buildMutationHookFeedback` from `./mutation-feedback`; line 18 exports from `./response-hints`. Both module names confirmed present.
- [x] T013 Execute 106 step 2 — `hooks/README.md:30` references `mutation-feedback.ts`; line 31 references `response-hints.ts`; line 56 references `MutationHookResult`; line 58 references `postMutationHooks`. All 4 terms confirmed. VERDICT: PASS
- [x] T014 Execute 166 step 1 — `result-explainability.ts:51–53` defines `WhySlim { summary; topSignals }` always present when flag ON. `attachExplainabilityToResults` at line 344 applies to all results. `isResultExplainEnabled` wired at `search-flags.ts:487`.
- [x] T015 Execute 166 step 2 — `result-explainability.ts:57–58` defines `WhyFull extends WhySlim { channelContribution? }` added only when `debugEnabled=true` (line 326). Flag OFF → `attachExplainabilityToResults` returns original array (line 350). VERDICT: PASS
- [x] T016 Execute 167 step 1 — `profile-formatters.ts:64–73` defines `QuickProfile { topResult; oneLineWhy; omittedCount; tokenReduction { savingsPercent } }`. `formatQuick` returns this shape when `profile=quick`.
- [x] T017 Execute 167 step 2 — `ResearchProfile` (line 76–81): results + evidenceDigest + followUps. `ResumeProfile` (line 83–89): state + nextSteps + blockers. `DebugProfile` (line 92–102): passthrough + tokenStats. Flag OFF → `applyResponseProfile` returns null (line 397), caller falls through to original response. VERDICT: PASS
- [x] T018 Execute 168 step 1 — `progressive-disclosure.ts:19,22,25` confirms `DEFAULT_PAGE_SIZE=5`, `DEFAULT_CURSOR_TTL_MS=300000`, `SNIPPET_MAX_LENGTH=100`. `buildProgressiveResponse` (line 342) paginates first page and creates cursor when `results.length > pageSize`. Handler wiring at `memory-search.ts:793–806` adds `data.progressiveDisclosure` as a SEPARATE field alongside existing `data.results` (additive, not replacing).
- [x] T019 Execute 168 step 2 — `resolveCursor` (line 279) retrieves next page; `continuation` is null on final page (line 314–325). Flag OFF → `buildProgressiveResponse` returns all snippets with no cursor (lines 355–362). Integration test `memory-search-ux-hooks.vitest.ts:145–158` confirms `data.results` has 7 items AND `data.progressiveDisclosure` is a separate object with summaryLayer, snippets, and continuation cursor. VERDICT: PASS
- [x] T020 Execute 169 step 1 — `session-state.ts:82` provides `getOrCreate(sessionId)`. `deduplicateResults` (line 246) applies `SEEN_DEDUP_FACTOR=0.3` to seen result IDs. `manager.markSeen()` accumulates across calls (line 130).
- [x] T021 Execute 169 step 2 — Session `clear(sessionId)` at line 167 removes a session; new session starts fresh. Flag OFF → `deduplicateResults` returns unmodified results (line 256). Envelope wiring confirmed: `memory-search.ts:927` sets `data.sessionState = buildSessionStatePayload(sessionId)` returning `{activeGoal, seenResultIds, openQuestions, preferredAnchors}` (lines 314–322); `memory-search.ts:928–929` sets `data.goalRefinement = goalRefinementPayload` with `{activeGoal, applied, boostedCount}` (lines 683–687). Integration test `memory-search-ux-hooks.vitest.ts:150–161` confirms both fields present. VERDICT: PASS
- [x] T022 Execute 179 step 1 — `recovery-payload.ts:23–29` defines all 3 statuses, 3 reasons, 4 actions. `buildRecoveryPayload` (line 176) classifies status, reason, suggestedQueries, recommendedAction. `DEFAULT_LOW_CONFIDENCE_THRESHOLD=0.4` (line 55), `PARTIAL_RESULT_MIN=3` (line 58).
- [x] T023 Execute 179 step 2 — `shouldTriggerRecovery` (line 200) returns false when resultCount >= 3 and avgConfidence >= 0.4 (healthy result). Flag wired at `search-flags.ts:455` default-on. VERDICT: PASS
- [x] T024 Execute 180 step 1 — `confidence-scoring.ts:30–33` defines weights: `WEIGHT_MARGIN=0.35`, `WEIGHT_CHANNEL_AGREEMENT=0.30`, `WEIGHT_RERANKER=0.20`, `WEIGHT_ANCHOR_DENSITY=0.15`. `computeResultConfidence` (line 197) applies 4-factor formula with `label` and `drivers` per result.
- [x] T025 Execute 180 step 2 — `assessRequestQuality` (line 267) computes `requestQuality: good|weak|gap`. No LLM calls anywhere in module. Flag wired at `search-flags.ts:463` default-on. Flag OFF → `isResultConfidenceEnabled` returns false, caller skips confidence attachment. VERDICT: PASS
- [x] T026 Evidence bundle 103: `mutation-feedback.ts` exports `buildMutationHookFeedback` with all required fields; `hooks-ux-feedback.vitest.ts` present. VERDICT: PASS
- [x] T027 Evidence bundle 104: No-op save paths (`dedup.ts:146–157` unchanged, `dedup.ts:248–261` duplicate) return early without DB writes; FSRS fields preserved; `shouldEmitPostMutationFeedback` gated (`memory-save.ts:1011`, `response-builder.ts:254`); atomic-save parity confirmed (`memory-save.ts:1062`); 8 vitest cases in `memory-save-ux-regressions.vitest.ts`. VERDICT: PASS
- [x] T028 Evidence bundle 105: `response-hints.ts` confirms `appendAutoSurfaceHints` + `syncEnvelopeTokenCount` chain; `context-server.vitest.ts` present. VERDICT: PASS
- [x] T029 Evidence bundle 106: All 4 terms (`mutation-feedback`, `response-hints`, `MutationHookResult`, `postMutationHooks`) confirmed in both `hooks/index.ts` and `hooks/README.md`. VERDICT: PASS
- [x] T030 Evidence bundle 107: Handler lines 290–308 + schema lines 344,349 + Group 13b test lines 1792–1821 all confirm full enforcement chain. VERDICT: PASS
- [x] T031 Evidence bundle 166: Two-tier explainability implemented in `result-explainability.ts`; flag ON/OFF behavior confirmed. VERDICT: PASS
- [x] T032 Evidence bundle 167: All 4 profile shapes defined and routed in `profile-formatters.ts`; flag fallback confirmed. VERDICT: PASS
- [x] T033 Evidence bundle 168: Cursor/snippet pagination implemented; flag OFF path confirmed; handler wiring at `memory-search.ts:793–806` adds `data.progressiveDisclosure` additively alongside `data.results`; integration test `memory-search-ux-hooks.vitest.ts:145–158` confirms. VERDICT: PASS
- [x] T034 Evidence bundle 169: Session dedup/goal-boost logic confirmed; envelope wiring at `memory-search.ts:927–929` sets `data.sessionState` and `data.goalRefinement`; integration test `memory-search-ux-hooks.vitest.ts:150–161` confirms. VERDICT: PASS
- [x] T035 Evidence bundle 179: All 3 recovery statuses, 3 reasons, 4 actions, thresholds confirmed in `recovery-payload.ts`. VERDICT: PASS
- [x] T036 Evidence bundle 180: 4-factor weights, labels, drivers, requestQuality confirmed in `confidence-scoring.ts`; no LLM calls. VERDICT: PASS
- [x] T037 Phase coverage: 11/11 scenarios assessed. Verdicts: 11 PASS, 0 PARTIAL, 0 FAIL.
- [x] T038 `implementation-summary.md` updated with verdict table and pass rate.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 11 scenarios have verdicts (PASS/PARTIAL/FAIL)
- [x] Phase coverage reported as 11/11
- [x] All feature flags reset to OFF after execution (static-analysis mode — no flags were mutated at runtime)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---
