---
title: "169 -- Session retrieval state v1 (SPECKIT_SESSION_RETRIEVAL_STATE_V1)"
description: "This scenario validates session retrieval state v1 (SPECKIT_SESSION_RETRIEVAL_STATE_V1) for `169`. It focuses on running session-aware searches and verifying additive session-state metadata."
---

# 169 -- Session retrieval state v1 (SPECKIT_SESSION_RETRIEVAL_STATE_V1)

## 1. OVERVIEW

This scenario validates session retrieval state v1 (SPECKIT_SESSION_RETRIEVAL_STATE_V1) for `169`. It focuses on running session-aware searches and verifying additive session-state metadata.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `169` and confirm the expected signals without contradicting evidence.

- Objective: Verify additive session-state metadata and goal refinement are emitted on session-aware searches
- Prompt: `Run a search within a session, note the returned session metadata, then run a second search in the same session and verify data.sessionState and data.goalRefinement remain present while previously-seen results can be deprioritized by the session-state path. Capture the evidence needed to prove the session state tracks seenResultIds, preferredAnchors, activeGoal, and goalRefinement metadata. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: `data.sessionState` includes activeGoal, seenResultIds, openQuestions, preferredAnchors; `data.goalRefinement` includes activeGoal and applied status; follow-up search in same session can deprioritize seen results (score * 0.3 fallback path); session expires after SESSION_TTL_MS (30 min); LRU eviction at MAX_SESSIONS (100)
- Pass/fail: PASS if additive session metadata is present and session-aware follow-up behavior is visible; FAIL if session metadata is missing or follow-up behavior is absent

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 169 | Session retrieval state v1 (SPECKIT_SESSION_RETRIEVAL_STATE_V1) | Verify additive session metadata on session-aware searches | `Run 2 searches in the same session, verify data.sessionState and data.goalRefinement are returned, and check follow-up behavior. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_search({ query: "first search", sessionId: "test-session", anchors: ["state", "next-steps"] })` 2) Inspect `data.sessionState` and `data.goalRefinement` 3) `memory_search({ query: "related second search", sessionId: "test-session" })` 4) Verify session metadata persists and follow-up behavior is visible 5) `npx vitest run tests/session-state.vitest.ts tests/memory-search-ux-hooks.vitest.ts` | `data.sessionState` with activeGoal/seenResultIds/preferredAnchors; `data.goalRefinement` with activeGoal/applied; follow-up search can deprioritize seen results; session TTL 30 min; LRU at 100 sessions | Response JSON before/after follow-up + test transcript | PASS if session metadata is present and follow-up behavior is visible; FAIL if metadata is missing or session context is ignored | Verify isSessionRetrievalStateEnabled() → Check SessionStateManager.getOrCreate() → Inspect SEEN_DEDUP_FACTOR (0.3) → Verify seenResultIds tracking → Check SESSION_TTL_MS (1800000) → Verify MAX_SESSIONS (100) LRU |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [18--ux-hooks/17-retrieval-session-state.md](../../feature_catalog/18--ux-hooks/17-retrieval-session-state.md)
- Feature flag reference: [01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/session-state.ts`

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 169
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `18--ux-hooks/169-session-retrieval-state-v1-speckit-session-retrieval-state-v1.md`
