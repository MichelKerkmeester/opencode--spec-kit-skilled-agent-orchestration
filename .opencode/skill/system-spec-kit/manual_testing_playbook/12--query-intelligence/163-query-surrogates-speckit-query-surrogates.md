---
title: "163 -- Query surrogates (SPECKIT_QUERY_SURROGATES)"
description: "This scenario validates query surrogates (SPECKIT_QUERY_SURROGATES) for `163`. It focuses on enabling the flag, saving a memory, and verifying surrogates are generated at index time."
---

# 163 -- Query surrogates (SPECKIT_QUERY_SURROGATES)

## 1. OVERVIEW

This scenario validates query surrogates (SPECKIT_QUERY_SURROGATES) for `163`. It focuses on enabling the flag, saving a memory, and verifying surrogates are generated at index time.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `163` and confirm the expected signals without contradicting evidence.

- Objective: Verify surrogate metadata generated at index time and matched at query time
- Prompt: `Test SPECKIT_QUERY_SURROGATES=true. Save a memory with rich content, then verify surrogates (aliases, headings, summary, surrogate questions) are generated at index time. Run a search using alias/question terms and verify surrogate matching produces boost scores. Capture the evidence needed to prove SurrogateMetadata is populated and SurrogateMatchResult returns matching scores. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: SurrogateMetadata contains aliases (from parenthetical abbreviations), headings, summary (max 200 chars), and surrogateQuestions (2-5 entries); query-time matching produces SurrogateMatchResult with score in [0,1] and matchedSurrogates list; no LLM calls on the default path
- Pass/fail: PASS if surrogates generated at save time and query matching returns boost scores with MIN_MATCH_THRESHOLD (0.15) enforced; FAIL if surrogates empty or matching produces zero scores for known-matching terms

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 163 | Query surrogates (SPECKIT_QUERY_SURROGATES) | Verify surrogates generated and matched | `Test SPECKIT_QUERY_SURROGATES=true. Save a memory, verify surrogates generated at index time, then search using alias terms and verify matching boost scores. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_QUERY_SURROGATES=true` 2) `memory_save({ ... })` with content containing abbreviations and headings 3) Inspect stored SurrogateMetadata 4) `memory_search({ query: "abbreviation term" })` 5) Verify SurrogateMatchResult 6) `npx vitest run tests/query-surrogates.vitest.ts` | SurrogateMetadata with aliases, headings, summary, surrogateQuestions; query matching returns score > MIN_MATCH_THRESHOLD; no LLM calls | SurrogateMetadata output + SurrogateMatchResult + test transcript | PASS if surrogates generated and matching returns boost scores; FAIL if surrogates empty or matching returns zero for known terms | Verify isQuerySurrogatesEnabled() → Check extractAliases() for parenthetical patterns → Inspect MAX_SURROGATE_QUESTIONS (5) → Verify MIN_MATCH_THRESHOLD (0.15) → Check MAX_SUMMARY_LENGTH (200) |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [12--query-intelligence/09-index-time-query-surrogates.md](../../feature_catalog/12--query-intelligence/09-index-time-query-surrogates.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../19--feature-flag-reference/028-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/query-surrogates.ts`

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 163
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `12--query-intelligence/163-query-surrogates-speckit-query-surrogates.md`
