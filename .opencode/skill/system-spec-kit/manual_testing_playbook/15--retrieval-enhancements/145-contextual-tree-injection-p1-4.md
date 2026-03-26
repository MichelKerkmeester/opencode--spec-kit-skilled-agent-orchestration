---
title: "145 -- Contextual tree injection (P1-4)"
description: "This scenario validates Contextual tree injection (P1-4) for `145`. It focuses on Verify hierarchical spec-folder headers are injected into search results when `SPECKIT_CONTEXT_HEADERS=true` and suppressed when disabled."
---

# 145 -- Contextual tree injection (P1-4)

## 1. OVERVIEW

This scenario validates Contextual tree injection (P1-4) for `145`. It focuses on Verify hierarchical spec-folder headers are injected into search results when `SPECKIT_CONTEXT_HEADERS=true` and suppressed when disabled.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `145` and confirm the expected signals without contradicting evidence.

- Objective: Verify hierarchical spec-folder headers are injected into search results when `SPECKIT_CONTEXT_HEADERS=true` and suppressed when disabled
- Prompt: `Validate contextual tree injection header format and flag toggle. Capture the evidence needed to prove Enabled: results with spec-folder paths have [parent > child — description] headers prepended, truncated at 100 chars; Disabled: no headers injected, content unchanged. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Enabled: results with spec-folder paths have `[parent > child — description]` headers prepended, truncated at 100 chars; Disabled: no headers injected, content unchanged
- Pass/fail: PASS if enabled mode injects correctly formatted headers and disabled mode skips injection entirely

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 145 | Contextual tree injection (P1-4) | Verify hierarchical spec-folder headers are injected into search results when `SPECKIT_CONTEXT_HEADERS=true` and suppressed when disabled | `Validate contextual tree injection header format and flag toggle. Capture the evidence needed to prove Enabled: results with spec-folder paths have [parent > child — description] headers prepended, truncated at 100 chars; Disabled: no headers injected, content unchanged. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_search({ query:"spec folder context headers", includeContent:true, includeTrace:true, limit:5 })` with `SPECKIT_CONTEXT_HEADERS=true` (default) 2) Verify results with spec-folder file paths have a `[parent > child — desc]` header prepended to content 3) Verify header is truncated at 100 characters 4) Restart with `SPECKIT_CONTEXT_HEADERS=false` and repeat search 5) Verify no contextual headers are prepended | Enabled: results with spec-folder paths have `[parent > child — description]` headers prepended, truncated at 100 chars; Disabled: no headers injected, content unchanged | Search outputs with and without flag + header format verification | PASS if enabled mode injects correctly formatted headers and disabled mode skips injection entirely | Inspect `lib/search/hybrid-search.ts` `injectContextualTree`, `lib/search/search-flags.ts` `isContextHeadersEnabled`, and description cache population |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [15--retrieval-enhancements/09-contextual-tree-injection.md](../../feature_catalog/15--retrieval-enhancements/09-contextual-tree-injection.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 145
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `15--retrieval-enhancements/145-contextual-tree-injection-p1-4.md`
