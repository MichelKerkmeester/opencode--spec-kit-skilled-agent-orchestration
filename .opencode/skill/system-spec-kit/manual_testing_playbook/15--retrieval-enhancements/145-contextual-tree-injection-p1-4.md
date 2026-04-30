---
title: "145 -- Contextual tree injection (P1-4)"
description: "This scenario validates Contextual tree injection (P1-4) for `145`. It focuses on Verify hierarchical spec-folder headers are injected into search results when `SPECKIT_CONTEXT_HEADERS=true` and suppressed when disabled."
audited_post_018: true
---

# 145 -- Contextual tree injection (P1-4)

## 1. OVERVIEW

This scenario validates Contextual tree injection (P1-4) for `145`. It focuses on Verify hierarchical spec-folder headers are injected into search results when `SPECKIT_CONTEXT_HEADERS=true` and suppressed when disabled.

---

## 2. SCENARIO CONTRACT


- Objective: Verify hierarchical spec-folder headers are injected into search results when `SPECKIT_CONTEXT_HEADERS=true` and suppressed when disabled.
- Real user request: `` Please validate Contextual tree injection (P1-4) against memory_search({ query:"spec folder context headers", includeContent:true, includeTrace:true, limit:5 }) and tell me whether the expected signals are present: Enabled: results with spec-folder paths have `[parent > child — description]` headers prepended, truncated at 100 chars; Disabled: no headers injected, content unchanged. ``
- RCAF Prompt: `As a retrieval-enhancement validation operator, validate Contextual tree injection (P1-4) against memory_search({ query:"spec folder context headers", includeContent:true, includeTrace:true, limit:5 }). Verify hierarchical spec-folder headers are injected into search results when SPECKIT_CONTEXT_HEADERS=true and suppressed when disabled. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Enabled: results with spec-folder paths have `[parent > child — description]` headers prepended, truncated at 100 chars; Disabled: no headers injected, content unchanged
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if enabled mode injects correctly formatted headers and disabled mode skips injection entirely

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval-enhancement validation operator, verify hierarchical spec-folder headers are injected into search results when SPECKIT_CONTEXT_HEADERS=true and suppressed when disabled against memory_search({ query:"spec folder context headers", includeContent:true, includeTrace:true, limit:5 }). Verify enabled: results with spec-folder paths have [parent > child — description] headers prepended, truncated at 100 chars; Disabled: no headers injected, content unchanged. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `memory_search({ query:"spec folder context headers", includeContent:true, includeTrace:true, limit:5 })` with `SPECKIT_CONTEXT_HEADERS=true` (default)
2. Verify results with spec-folder file paths have a `[parent > child — desc]` header prepended to content
3. Verify header is truncated at 100 characters
4. Restart with `SPECKIT_CONTEXT_HEADERS=false` and repeat search
5. Verify no contextual headers are prepended

### Expected

Enabled: results with spec-folder paths have `[parent > child — description]` headers prepended, truncated at 100 chars; Disabled: no headers injected, content unchanged

### Evidence

Search outputs with and without flag + header format verification

### Pass / Fail

- **Pass**: enabled mode injects correctly formatted headers and disabled mode skips injection entirely
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `lib/search/hybrid-search.ts` `injectContextualTree`, `lib/search/search-flags.ts` `isContextHeadersEnabled`, and description cache population

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [15--retrieval-enhancements/09-contextual-tree-injection.md](../../feature_catalog/15--retrieval-enhancements/09-contextual-tree-injection.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 145
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `15--retrieval-enhancements/145-contextual-tree-injection-p1-4.md`
