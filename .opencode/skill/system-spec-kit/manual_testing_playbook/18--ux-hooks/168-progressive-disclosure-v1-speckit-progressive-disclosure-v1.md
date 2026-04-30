---
title: "168 -- Progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE_V1)"
description: "This scenario validates progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE_V1) for `168`. It focuses on verifying the additive disclosure payload and cursor pagination in response."
---

# 168 -- Progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE_V1)

## 1. OVERVIEW

This scenario validates progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE_V1) for `168`. It focuses on verifying the additive disclosure payload and cursor pagination in response.

---

## 2. SCENARIO CONTRACT


- Objective: Verify full results are preserved while additive disclosure metadata and cursor pagination are exposed.
- Real user request: `` Please validate Progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE_V1) against memory_search({ query: "broad query", limit: 20 }) and tell me whether the expected signals are present: `data.results` remains present; `data.progressiveDisclosure.summaryLayer` with count and digest; `data.progressiveDisclosure.results` as Snippet[] with snippet (max 100 chars), detailAvailable, resultId; continuation cursor with remainingCount; cursor expiry at DEFAULT_CURSOR_TTL_MS (5 min); page size DEFAULT_PAGE_SIZE (5). ``
- RCAF Prompt: `As a runtime-hook validation operator, validate Progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE_V1) against memory_search({ query: "broad query", limit: 20 }). Verify full results are preserved while additive disclosure metadata and cursor pagination are exposed. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `data.results` remains present; `data.progressiveDisclosure.summaryLayer` with count and digest; `data.progressiveDisclosure.results` as Snippet[] with snippet (max 100 chars), detailAvailable, resultId; continuation cursor with remainingCount; cursor expiry at DEFAULT_CURSOR_TTL_MS (5 min); page size DEFAULT_PAGE_SIZE (5)
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if response preserves full results, adds disclosure metadata, and next-page retrieval works via cursor; FAIL if hard truncation replaces results or disclosure metadata is missing

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, verify additive disclosure payload and cursor pagination against memory_search({ query: "broad query", limit: 20 }). Verify full data.results; summaryLayer with count + digest; Snippet[] with snippet <= 100 chars, detailAvailable, resultId; continuation cursor; page size = 5; cursor TTL = 5 min. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `memory_search({ query: "broad query", limit: 20 })`
2. Verify full `data.results` remains present
3. Verify `data.progressiveDisclosure` shape
4. Extract continuation cursor
5. Re-request with `memory_search({ cursor })` for next page
6. `npx vitest run tests/progressive-disclosure.vitest.ts tests/memory-search-ux-hooks.vitest.ts`

### Expected

full `data.results`; summaryLayer with count + digest; Snippet[] with snippet <= 100 chars, detailAvailable, resultId; continuation cursor; page size = 5; cursor TTL = 5 min

### Evidence

Response JSON + pagination test with cursor + test transcript

### Pass / Fail

- **Pass**: full results are preserved and disclosure metadata + cursor pagination work
- **Fail**: results are replaced by snippets or disclosure metadata is missing

### Failure Triage

Verify SPECKIT_PROGRESSIVE_DISCLOSURE_V1 env → Check DEFAULT_PAGE_SIZE (5) → Inspect SNIPPET_MAX_LENGTH (100) → Verify hashQuery() cursor key → Check DEFAULT_CURSOR_TTL_MS (300000) → Inspect cursorStore map

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [18--ux-hooks/16-progressive-disclosure.md](../../feature_catalog/18--ux-hooks/16-progressive-disclosure.md)
- Feature flag reference: [01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/progressive-disclosure.ts`

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 168
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/168-progressive-disclosure-v1-speckit-progressive-disclosure-v1.md`
- audited_post_018: true
