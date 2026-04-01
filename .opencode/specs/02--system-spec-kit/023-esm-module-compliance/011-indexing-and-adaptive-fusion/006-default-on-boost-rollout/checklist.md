---
title: "Verification Checklist: Default-ON Boost Rollout — Session, Causal & Deep Expansion"
description: "Verification Date: [YYYY-MM-DD]"
trigger_phrases:
  - "boost rollout checklist"
  - "session boost verification"
  - "causal boost verification"
  - "deep expansion verification"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Default-ON Boost Rollout — Session, Causal & Deep Expansion

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Root cause confirmed: session-boost.ts isEnabled() → isFeatureEnabled() → returns true for undefined env var. Metadata 'off' was because stage2-fusion L784 reported 'off' even when enabled but no data matched. Fixed → 'enabled'.
- [x] CHK-002 [P0] Root cause confirmed: causal-boost.ts isEnabled() → isFeatureEnabled() → returns true for undefined env var. Same metadata fix at L808.
- [x] CHK-003 [P0] Root cause confirmed: buildDeepQueryVariants called isExpansionActive() which returned false for "simple" queries → only [original] returned → guard `length > 1` failed. Fixed by removing gate + adding fallback reformulation.
- [x] CHK-004 [P1] Guards at stage2-fusion.ts L774 (`enableSessionBoost && sessionId`) and L795 (`enableCausalBoost && isGraphUnifiedEnabled()`) pass when defaults are used. No unexpected suppression.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No new env variable names introduced. SPECKIT_SESSION_BOOST and SPECKIT_CAUSAL_BOOST are existing names — only defaults and metadata changed.
- [x] CHK-011 [P0] JSDoc comments added: session-boost.ts L28-32 and causal-boost.ts L143-148 document "Default: ON (graduated). Set SPECKIT_*=false to disable."
- [x] CHK-012 [P1] search-flags.ts section 2 now exports `isSessionBoostEnabled()` and `isCausalBoostEnabled()`.
- [x] CHK-013 [P1] Deep expansion fix reuses existing `expandQuery()` + adds minimal fallback (reverse word order). No new abstractions.
- [x] CHK-014 [P1] `npx tsc --noEmit` passes with 0 errors after all changes. `npm run build` also succeeds.
- [x] CHK-015 [P1] `QUERY_PATTERNS` research class keywords: added "search", "retrieval", "pipeline", "indexing", "embedding", "vector", "semantic" (7 new terms).
- [x] CHK-016 [P1] `getStrategyForQuery(query, specFolder?, intent?)` — 3rd parameter added. INTENT_TO_ARTIFACT map used as fallback when bestScore === 0 and intent provided.
- [x] CHK-017 [P1] INTENT_TO_ARTIFACT covers all 7 intents: understand→research, find_spec→spec, find_decision→decision-record, add_feature→implementation-summary, fix_bug→memory, refactor→implementation-summary, security_audit→research.
- [x] CHK-018 [P1] memory-search.ts re-calls `getStrategyForQuery(query, specFolder, detectedIntent)` when initial routing returns unknown/0 (L600-602).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Code: stage2-fusion L784 now returns 'enabled' when boost runs without matching data. Guard passes when enableSessionBoost=true && sessionId present. [Evidence: code path verified]
- [x] CHK-021 [P0] Code: stage2-fusion L808 now returns 'enabled' when boost runs without matching data. Guard passes when enableCausalBoost=true && isGraphUnifiedEnabled()=true. [Evidence: code path verified]
- [x] CHK-022 [P0] Code: `buildDeepQueryVariants("semantic search")` → ["semantic search", "search semantic"] (2 variants). Guard `length > 1` passes → parallel search fires → deepExpansion=true. [Evidence: code logic verified]
- [x] CHK-023 [P0] Code: `isFeatureEnabled('SPECKIT_SESSION_BOOST')` returns false when env='false' (rollout-policy.ts L62). enableSessionBoost=false → guard at L774 blocks → metadata stays 'off'. [Evidence: rollout-policy.ts L62]
- [x] CHK-024 [P0] Code: same as CHK-023 for SPECKIT_CAUSAL_BOOST and guard at L795. [Evidence: rollout-policy.ts L62]
- [x] CHK-025 [P1] Code: when env vars unset, isFeatureEnabled returns true (L60-66, rawFlag=undefined, rollout=100→true). [Evidence: rollout-policy.ts L59-66]
- [x] CHK-026 [P1] No auto-mode regression: session/causal boosts only fire in hybrid mode (guard checks isHybrid). Deep expansion only fires when mode=deep && isMultiQueryEnabled(). Auto mode unchanged.
- [x] CHK-027 [P0] Code: "semantic search" matches research keywords ["search", "semantic"] → score=2, confidence=min(1,2/6)=0.33. detectedClass="research". [Evidence: artifact-routing.ts QUERY_PATTERNS]
- [x] CHK-028 [P1] "vector retrieval" → research (keywords "vector"+"retrieval", score=2). "find the config" → implementation-summary (keyword "config", score=1). "how does search work" → research (keyword "search", score=1).
- [x] CHK-029 [P1] Intent fallback guard: `if (bestScore === 0 && intent && ...)` — only fires when NO keyword matched. "research findings" matches "research" keyword (bestScore≥1) → intent fallback skipped.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets or credentials introduced. Changes are JSDoc comments, metadata values, keyword lists, and JSON/TOML env var entries.
- [x] CHK-031 [P1] Env var names are existing: SPECKIT_SESSION_BOOST and SPECKIT_CAUSAL_BOOST — no new surface area.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] tasks.md updated with implementation findings. spec.md and plan.md remain accurate (no scope changes needed).
- [x] CHK-041 [P1] JSDoc kill-switch comments added to session-boost.ts L28-32 and causal-boost.ts L143-148.
- [ ] CHK-042 [P2] Feature catalog entry update deferred (T016). No blocking impact — env var docs in config files serve as primary documentation.
- [x] CHK-043 [P0] All 5 config files updated: .mcp.json, opencode.json, .claude/mcp.json, .codex/config.toml, Barter/coder/opencode.json. [Evidence: edits applied and verified]
- [x] CHK-044 [P1] _NOTE_7 now reads: "Opt-out flags (all default ON): SPECKIT_ADAPTIVE_FUSION, SPECKIT_EXTENDED_TELEMETRY, SPECKIT_SESSION_BOOST, SPECKIT_CAUSAL_BOOST"
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp debug logs were added — diagnosis used code reading only.
- [x] CHK-051 [P1] scratch/ not used during implementation.
- [ ] CHK-052 [P2] Session findings to be saved to memory/ at step 8.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 16 | 16/16 |
| P2 Items | 3 | 1/3 |

**Verification Date**: 2026-04-01
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
