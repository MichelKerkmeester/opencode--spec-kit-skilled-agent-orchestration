---
title: "169 -- Session retrieval state v1 (SPECKIT_SESSION_RETRIEVAL_STATE_V1)"
description: "This scenario validates session retrieval state v1 (SPECKIT_SESSION_RETRIEVAL_STATE_V1) for `169`. It focuses on enabling the flag, running 2 searches, and verifying dedup on the second."
---

# 169 -- Session retrieval state v1 (SPECKIT_SESSION_RETRIEVAL_STATE_V1)

## 1. OVERVIEW

This scenario validates session retrieval state v1 (SPECKIT_SESSION_RETRIEVAL_STATE_V1) for `169`. It focuses on enabling the flag, running 2 searches, and verifying dedup on the second.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `169` and confirm the expected signals without contradicting evidence.

- Objective: Verify cross-turn deduplication deprioritizes already-seen results
- Prompt: `Test SPECKIT_SESSION_RETRIEVAL_STATE_V1=true. Run a search within a session, note the returned result IDs, then run a second search in the same session and verify previously-seen results are deprioritized (score multiplied by SEEN_DEDUP_FACTOR of 0.3). Capture the evidence needed to prove the session state tracks seenResultIds and the dedup metadata shows deprioritizedCount > 0. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: First search returns results with original scores; second search in same session deprioritizes seen results (score * 0.3); DedupMetadata with deduplicated=true, seenCount, deprioritizedCount > 0; session expires after SESSION_TTL_MS (30 min); LRU eviction at MAX_SESSIONS (100)
- Pass/fail: PASS if seen results deprioritized by 0.3 factor on second search and DedupMetadata shows correct counts; FAIL if seen results retain original scores or dedup not applied

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 169 | Session retrieval state v1 (SPECKIT_SESSION_RETRIEVAL_STATE_V1) | Verify dedup on second search | `Test SPECKIT_SESSION_RETRIEVAL_STATE_V1=true. Run 2 searches in the same session, verify seen results deprioritized by 0.3 factor on second search. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_SESSION_RETRIEVAL_STATE_V1=true` 2) `memory_search({ query: "first search", sessionId: "test-session" })` 3) Note result IDs and scores 4) `memory_search({ query: "related second search", sessionId: "test-session" })` 5) Verify seen results have score * 0.3 6) `npx vitest run tests/session-state.vitest.ts` | Second search deprioritizes seen results (score * 0.3); DedupMetadata with deduplicated=true, deprioritizedCount > 0; session TTL 30 min; LRU at 100 sessions | Result scores before/after dedup + DedupMetadata + test transcript | PASS if seen results deprioritized by 0.3 and DedupMetadata correct; FAIL if original scores retained or dedup not applied | Verify isSessionRetrievalStateEnabled() → Check SessionStateManager.getOrCreate() → Inspect SEEN_DEDUP_FACTOR (0.3) → Verify seenResultIds tracking → Check SESSION_TTL_MS (1800000) → Verify MAX_SESSIONS (100) LRU |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../19--feature-flag-reference/028-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/session-state.ts`

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 169
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/169-session-retrieval-state-v1-speckit-session-retrieval-state-v1.md`
