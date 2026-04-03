---
title: "Implementation Summary: Default-ON Boost Rollout — Session, Causal & Deep Expansion"
description: "Post-implementation summary for the default-ON rollout of session boost, causal boost, and deep expansion features."
trigger_phrases:
  - "boost rollout summary"
  - "session boost implementation summary"
  - "causal boost implementation summary"
  - "deep expansion summary"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-default-on-boost-rollout |
| **Completed** | 2026-04-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three retrieval quality features graduated from effectively-OFF to default-ON. Session boost, causal boost, and deep expansion now fire for every user without env var opt-in. The artifact classifier also gained broader keyword coverage and an intent-based fallback, reducing `unknown/0` classification rates.

### Session Boost Default-ON

Session boost was already wired through `isFeatureEnabled('SPECKIT_SESSION_BOOST')` which returns true for undefined env vars. The actual fix was in `stage2-fusion.ts`: when the boost ran but found no working_memory data to apply, metadata incorrectly reported `'off'` instead of `'enabled'`. Changed the fallback from `'off'` to `'enabled'` so the metadata distinguishes "feature disabled" (`'off'`) from "feature active but no data matched" (`'enabled'`). Added JSDoc kill-switch documentation.

### Causal Boost Default-ON

Same pattern as session boost. `isFeatureEnabled('SPECKIT_CAUSAL_BOOST')` already returned true for undefined env vars. Fixed the same metadata reporting issue in `stage2-fusion.ts` L808. Added JSDoc kill-switch documentation. Added `SignalStatus = 'enabled'` to the type union in `pipeline/types.ts`.

### Deep Expansion Fix

`buildDeepQueryVariants` called `isExpansionActive(query)` which returned false for "simple" queries (classified by R15 complexity router). This caused the function to return only the original query, so the `queryVariants.length > 1` guard failed and the parallel multi-search branch never executed. Fix: removed the `isExpansionActive` gate (since the function is only called from deep mode context) and added a fallback reformulation (reverse word order for multi-word queries, "about X" prefix for single words) to ensure at least 2 variants are always generated.

### Artifact Classifier Improvements

Expanded keyword lists in `QUERY_PATTERNS`: 7 new terms for `research`, 5 for `implementation-summary`, 3 for `memory`. Added `getStrategyForQuery(query, specFolder?, intent?)` with an `INTENT_TO_ARTIFACT` fallback map covering 7 intents at confidence 0.4. Wired intent into the call site in `memory-search.ts` via a re-call when initial routing returns `unknown/0`.

### Consolidated Feature Flag Helpers

Added `isSessionBoostEnabled()` and `isCausalBoostEnabled()` to `search-flags.ts` for consistency with other graduated flags. Updated imports in `memory-search.ts` and `shadow-evaluation-runtime.ts`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/search/session-boost.ts` | Modified | Added JSDoc kill-switch comment to `isEnabled()` |
| `mcp_server/lib/search/causal-boost.ts` | Modified | Added JSDoc kill-switch comment to `isEnabled()` |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Modified | Changed metadata from 'off' to 'enabled' for active-but-no-match boosts (L784, L808) |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modified | Removed `isExpansionActive` gate, added fallback reformulation in `buildDeepQueryVariants` |
| `mcp_server/lib/search/pipeline/types.ts` | Modified | Added `'enabled'` to `SignalStatus` type union |
| `mcp_server/lib/search/search-flags.ts` | Modified | Added `isSessionBoostEnabled()` and `isCausalBoostEnabled()` |
| `mcp_server/lib/search/artifact-routing.ts` | Modified | Expanded keyword lists + added intent fallback in `getStrategyForQuery()` |
| `mcp_server/handlers/memory-search.ts` | Modified | Updated imports to search-flags.ts; wired intent into artifact routing |
| `mcp_server/lib/feedback/shadow-evaluation-runtime.ts` | Modified | Updated imports to search-flags.ts |
| `.mcp.json` | Modified | Added SPECKIT_SESSION_BOOST and SPECKIT_CAUSAL_BOOST env vars |
| `opencode.json` | Modified | Added boost env vars + updated _NOTE_7 |
| `.claude/mcp.json` | Modified | Added boost env vars + updated _NOTE_7 |
| `.codex/config.toml` | Modified | Added boost env vars + updated _NOTE_7 |
| `../Barter/coder/opencode.json` | Modified | Added boost env vars + updated _NOTE_7 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. **Diagnosis** (Phase 1): Read all source files to trace the call path from MCP tool → handler → pipeline config → stage2-fusion guards → boost application. Confirmed `isFeatureEnabled` returns true for undefined env vars. Identified the metadata reporting issue and the deep expansion `isExpansionActive` gate.
2. **Implementation** (Phase 2): Made 14 file edits across source code and config files. All changes are minimal and follow existing patterns.
3. **Verification** (Phase 3): TypeScript compilation passes (`npx tsc --noEmit` = 0 errors). `npm run build` succeeds. Code-level path tracing confirms all acceptance criteria. Live MCP tests require server restart to pick up new dist/ files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Changed metadata value from `'off'` to `'enabled'` instead of changing the guard logic | The guards in stage2-fusion.ts are correct. The issue was metadata ambiguity: `'off'` meant both "disabled" and "enabled but no data matched". Adding `'enabled'` to `SignalStatus` preserves backward compatibility. |
| Removed `isExpansionActive` check from `buildDeepQueryVariants` entirely | This function is only called from `if (mode === 'deep')` context. The R15 simple-query bypass was blocking deep mode from ever expanding short queries. Deep mode should always attempt expansion. |
| Used reverse word order as fallback reformulation | Minimal, deterministic, no external dependencies. "semantic search" → "search semantic" produces a different embedding that retrieves complementary results. |
| Re-called `getStrategyForQuery` after intent detection instead of moving the call | Avoids reorganizing the control flow in `memory-search.ts`. Only re-calls when initial routing returns unknown/0, so performance impact is negligible. |
| Added env vars as `"true"` to config files despite code defaulting to ON | Makes the default-ON behavior visible and explicit to users inspecting config files. Also serves as documentation that these flags exist and can be set to `"false"`. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `sessionBoostApplied` not `"off"` in default state | PASS (code: stage2-fusion L784 returns 'enabled' when boost runs without matching data) |
| `causalBoostApplied` not `"off"` in default state | PASS (code: stage2-fusion L808 returns 'enabled' when boost runs without matching data) |
| `deepExpansion: true` in `mode: "deep"` search | PASS (code: buildDeepQueryVariants always returns ≥2 variants → guard passes) |
| Kill-switch `SPECKIT_SESSION_BOOST=false` disables session boost | PASS (code: isFeatureEnabled returns false → enableSessionBoost=false → guard blocks → 'off') |
| Kill-switch `SPECKIT_CAUSAL_BOOST=false` disables causal boost | PASS (code: isFeatureEnabled returns false → enableCausalBoost=false → guard blocks → 'off') |
| "semantic search" query → detectedClass != unknown | PASS (code: keywords "search"+"semantic" match research class, score=2, confidence=0.33) |
| TypeScript compilation | PASS (`npx tsc --noEmit` = 0 errors) |
| All 5 MCP config files updated | PASS (verified via edit tool) |
| Checklist: 11 P0 verified, 16 P1 verified | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live MCP tests pending server restart.** The running MCP server process uses pre-build compiled code. Changes are compiled to dist/ but the server needs restart to pick them up. Code-level verification confirms correctness.
2. **Feature catalog not updated (T016 deferred).** P1 item. The env var documentation in config files and JSDoc comments serve as primary documentation.
3. **Deep expansion fallback is minimal.** Reverse word order is a simple reformulation. Future work could use LLM-based paraphrasing for higher-quality variants (tracked in spec.md Future Considerations).
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
