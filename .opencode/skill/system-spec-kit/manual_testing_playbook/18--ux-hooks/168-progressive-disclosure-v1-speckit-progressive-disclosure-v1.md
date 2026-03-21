---
title: "168 -- Progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE_V1)"
description: "This scenario validates progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE_V1) for `168`. It focuses on enabling the flag and verifying cursor pagination in response."
---

# 168 -- Progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE_V1)

## 1. OVERVIEW

This scenario validates progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE_V1) for `168`. It focuses on enabling the flag and verifying cursor pagination in response.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `168` and confirm the expected signals without contradicting evidence.

- Objective: Verify cursor pagination replaces hard tail-truncation
- Prompt: `Test SPECKIT_PROGRESSIVE_DISCLOSURE_V1=true. Run a search returning > 5 results and verify the response contains a summaryLayer (count + digest), snippet previews (max 100 chars with detailAvailable flags), and a continuation cursor for pagination. Then use the cursor to retrieve the next page and verify remaining results are returned. Capture the evidence needed to prove ProgressiveResponse shape with summaryLayer, snippets, and continuation cursor. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: ProgressiveResponse with summaryLayer (count and digest); results as Snippet[] with snippet (max 100 chars), detailAvailable, resultId; continuation cursor with remainingCount; cursor expiry at DEFAULT_CURSOR_TTL_MS (5 min); page size DEFAULT_PAGE_SIZE (5)
- Pass/fail: PASS if response includes summaryLayer, snippets with pagination cursor, and next page retrieval works; FAIL if hard truncation occurs instead of cursor pagination or snippets exceed 100 chars

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 168 | Progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE_V1) | Verify cursor pagination in response | `Test SPECKIT_PROGRESSIVE_DISCLOSURE_V1=true. Search with > 5 results, verify summaryLayer + snippet previews + continuation cursor. Use cursor for next page. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_PROGRESSIVE_DISCLOSURE_V1=true` 2) `memory_search({ query: "broad query", limit: 20 })` 3) Verify ProgressiveResponse shape 4) Extract continuation cursor 5) Re-request with cursor for next page 6) `npx vitest run tests/progressive-disclosure.vitest.ts` | summaryLayer with count + digest; Snippet[] with snippet <= 100 chars, detailAvailable, resultId; continuation cursor; page size = 5; cursor TTL = 5 min | ProgressiveResponse JSON + pagination test with cursor + test transcript | PASS if summaryLayer + snippets + cursor pagination work; FAIL if hard truncation or snippets > 100 chars | Verify SPECKIT_PROGRESSIVE_DISCLOSURE_V1 env → Check DEFAULT_PAGE_SIZE (5) → Inspect SNIPPET_MAX_LENGTH (100) → Verify hashQuery() cursor key → Check DEFAULT_CURSOR_TTL_MS (300000) → Inspect cursorStore map |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../19--feature-flag-reference/028-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/progressive-disclosure.ts`

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 168
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/168-progressive-disclosure-v1-speckit-progressive-disclosure-v1.md`
