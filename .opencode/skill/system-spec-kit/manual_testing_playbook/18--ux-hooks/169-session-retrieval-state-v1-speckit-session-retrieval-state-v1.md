---
title: "169 -- Session retrieval state v1 (SPECKIT_SESSION_RETRIEVAL_STATE_V1)"
description: "This scenario validates session retrieval state v1 (SPECKIT_SESSION_RETRIEVAL_STATE_V1) for `169`. It focuses on running session-aware searches and verifying additive session-state metadata."
---

# 169 -- Session retrieval state v1 (SPECKIT_SESSION_RETRIEVAL_STATE_V1)

## 1. OVERVIEW

This scenario validates session retrieval state v1 (SPECKIT_SESSION_RETRIEVAL_STATE_V1) for `169`. It focuses on running session-aware searches and verifying additive session-state metadata.

---

## 2. SCENARIO CONTRACT


- Objective: Verify additive session-state metadata and goal refinement are emitted on session-aware searches.
- Real user request: `` Please validate Session retrieval state v1 (SPECKIT_SESSION_RETRIEVAL_STATE_V1) against memory_search({ query: "first search", sessionId: "test-session", anchors: ["state", "next-steps"] }) and tell me whether the expected signals are present: `data.sessionState` includes activeGoal, seenResultIds, openQuestions, preferredAnchors; `data.goalRefinement` includes activeGoal and applied status; follow-up search in same session can deprioritize seen results (score * 0.3 fallback path); session expires after SESSION_TTL_MS (30 min); LRU eviction at MAX_SESSIONS (100). ``
- RCAF Prompt: `As a runtime-hook validation operator, validate Session retrieval state v1 (SPECKIT_SESSION_RETRIEVAL_STATE_V1) against memory_search({ query: "first search", sessionId: "test-session", anchors: ["state", "next-steps"] }). Verify additive session-state metadata and goal refinement are emitted on session-aware searches. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `data.sessionState` includes activeGoal, seenResultIds, openQuestions, preferredAnchors; `data.goalRefinement` includes activeGoal and applied status; follow-up search in same session can deprioritize seen results (score * 0.3 fallback path); session expires after SESSION_TTL_MS (30 min); LRU eviction at MAX_SESSIONS (100)
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if additive session metadata is present and session-aware follow-up behavior is visible; FAIL if session metadata is missing or follow-up behavior is absent

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, verify additive session metadata on session-aware searches against memory_search({ query: "first search", sessionId: "test-session", anchors: ["state", "next-steps"] }). Verify data.sessionState with activeGoal/seenResultIds/preferredAnchors; data.goalRefinement with activeGoal/applied; follow-up search can deprioritize seen results; session TTL 30 min; LRU at 100 sessions. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `memory_search({ query: "first search", sessionId: "test-session", anchors: ["state", "next-steps"] })`
2. Inspect `data.sessionState` and `data.goalRefinement`
3. `memory_search({ query: "related second search", sessionId: "test-session" })`
4. Verify session metadata persists and follow-up behavior is visible
5. `npx vitest run tests/session-state.vitest.ts tests/memory-search-ux-hooks.vitest.ts`

### Expected

`data.sessionState` with activeGoal/seenResultIds/preferredAnchors; `data.goalRefinement` with activeGoal/applied; follow-up search can deprioritize seen results; session TTL 30 min; LRU at 100 sessions

### Evidence

Response JSON before/after follow-up + test transcript

### Pass / Fail

- **Pass**: session metadata is present and follow-up behavior is visible
- **Fail**: metadata is missing or session context is ignored

### Failure Triage

Verify isSessionRetrievalStateEnabled() → Check SessionStateManager.getOrCreate() → Inspect SEEN_DEDUP_FACTOR (0.3) → Verify seenResultIds tracking → Check SESSION_TTL_MS (1800000) → Verify MAX_SESSIONS (100) LRU

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [18--ux-hooks/17-retrieval-session-state.md](../../feature_catalog/18--ux-hooks/17-retrieval-session-state.md)
- Feature flag reference: [01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/session-state.ts`

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 169
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/169-session-retrieval-state-v1-speckit-session-retrieval-state-v1.md`
- audited_post_018: true
