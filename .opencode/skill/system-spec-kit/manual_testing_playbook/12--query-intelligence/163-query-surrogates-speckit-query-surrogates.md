---
title: "163 -- Query surrogates (SPECKIT_QUERY_SURROGATES)"
description: "This scenario validates query surrogates (SPECKIT_QUERY_SURROGATES) for `163`. It focuses on enabling the flag, saving a spec-doc record, and verifying surrogates are generated at index time."
audited_post_018: true
---

# 163 -- Query surrogates (SPECKIT_QUERY_SURROGATES)

## 1. OVERVIEW

This scenario validates query surrogates (SPECKIT_QUERY_SURROGATES) for `163`. It focuses on enabling the flag, saving a spec-doc record, and verifying surrogates are generated at index time.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `163` and confirm the expected signals without contradicting evidence.

- Objective: Verify surrogate metadata generated at index time and matched at query time
- Prompt: `As a query-intelligence validation operator, validate Query surrogates (SPECKIT_QUERY_SURROGATES) against SPECKIT_QUERY_SURROGATES=true. Verify surrogate metadata generated at index time and matched at query time. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: SurrogateMetadata contains aliases (from parenthetical abbreviations), headings, summary (max 200 chars), and surrogateQuestions (2-5 entries); query-time matching produces SurrogateMatchResult with score in [0,1] and matchedSurrogates list; no LLM calls on the default path
- Pass/fail: PASS if surrogates generated at save time and query matching returns boost scores with MIN_MATCH_THRESHOLD (0.15) enforced; FAIL if surrogates empty or matching produces zero scores for known-matching terms

---

## 3. TEST EXECUTION

### Prompt

```
As a query-intelligence validation operator, verify surrogates generated and matched against SPECKIT_QUERY_SURROGATES=true. Verify surrogateMetadata with aliases, headings, summary, surrogateQuestions; query matching returns score > MIN_MATCH_THRESHOLD; no LLM calls. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `SPECKIT_QUERY_SURROGATES=true`
2. `memory_save({ ... })` with content containing abbreviations and headings
3. Inspect stored SurrogateMetadata
4. `memory_search({ query: "abbreviation term" })`
5. Verify SurrogateMatchResult
6. `npx vitest run tests/query-surrogates.vitest.ts`

### Expected

SurrogateMetadata with aliases, headings, summary, surrogateQuestions; query matching returns score > MIN_MATCH_THRESHOLD; no LLM calls

### Evidence

SurrogateMetadata output + SurrogateMatchResult + test transcript

### Pass / Fail

- **Pass**: surrogates generated and matching returns boost scores
- **Fail**: surrogates empty or matching returns zero for known terms

### Failure Triage

Verify isQuerySurrogatesEnabled() → Check extractAliases() for parenthetical patterns → Inspect MAX_SURROGATE_QUESTIONS (5) → Verify MIN_MATCH_THRESHOLD (0.15) → Check MAX_SUMMARY_LENGTH (200)

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [12--query-intelligence/09-index-time-query-surrogates.md](../../feature_catalog/12--query-intelligence/09-index-time-query-surrogates.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/query-surrogates.ts`

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 163
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `12--query-intelligence/163-query-surrogates-speckit-query-surrogates.md`
