---
title: "168 -- Progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE_V1)"
description: "This scenario validates progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE_V1) for `168`. It focuses on verifying the additive disclosure payload and cursor pagination in response."
---

# 168 -- Progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE_V1)

## 1. OVERVIEW

This scenario validates progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE_V1) for `168`. It focuses on verifying the additive disclosure payload and cursor pagination in response.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `168` and confirm the expected signals without contradicting evidence.

- Objective: Verify full results are preserved while additive disclosure metadata and cursor pagination are exposed
- Prompt: `Run a search returning > 5 results and verify the response preserves full data.results while adding data.progressiveDisclosure with summaryLayer (count + digest), snippet previews (max 100 chars with detailAvailable flags), and a continuation cursor. Then use memory_search({ cursor }) to retrieve the next page and verify remaining results are returned. Capture the evidence needed to prove the additive disclosure contract. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: `data.results` remains present; `data.progressiveDisclosure.summaryLayer` with count and digest; `data.progressiveDisclosure.results` as Snippet[] with snippet (max 100 chars), detailAvailable, resultId; continuation cursor with remainingCount; cursor expiry at DEFAULT_CURSOR_TTL_MS (5 min); page size DEFAULT_PAGE_SIZE (5)
- Pass/fail: PASS if response preserves full results, adds disclosure metadata, and next-page retrieval works via cursor; FAIL if hard truncation replaces results or disclosure metadata is missing

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 168 | Progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE_V1) | Verify additive disclosure payload and cursor pagination | `Search with > 5 results, verify full results remain present plus data.progressiveDisclosure, then use cursor for next page. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_search({ query: "broad query", limit: 20 })` 2) Verify full `data.results` remains present 3) Verify `data.progressiveDisclosure` shape 4) Extract continuation cursor 5) Re-request with `memory_search({ cursor })` for next page 6) `npx vitest run tests/progressive-disclosure.vitest.ts tests/memory-search-ux-hooks.vitest.ts` | full `data.results`; summaryLayer with count + digest; Snippet[] with snippet <= 100 chars, detailAvailable, resultId; continuation cursor; page size = 5; cursor TTL = 5 min | Response JSON + pagination test with cursor + test transcript | PASS if full results are preserved and disclosure metadata + cursor pagination work; FAIL if results are replaced by snippets or disclosure metadata is missing | Verify SPECKIT_PROGRESSIVE_DISCLOSURE_V1 env → Check DEFAULT_PAGE_SIZE (5) → Inspect SNIPPET_MAX_LENGTH (100) → Verify hashQuery() cursor key → Check DEFAULT_CURSOR_TTL_MS (300000) → Inspect cursorStore map |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [18--ux-hooks/16-progressive-disclosure.md](../../feature_catalog/18--ux-hooks/16-progressive-disclosure.md)
- Feature flag reference: [01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/progressive-disclosure.ts`

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 168
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `18--ux-hooks/168-progressive-disclosure-v1-speckit-progressive-disclosure-v1.md`
