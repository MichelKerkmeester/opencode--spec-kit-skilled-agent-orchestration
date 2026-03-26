---
title: "199 -- Content-aware memory filename generation"
description: "This scenario validates Content-aware memory filename generation for `199`. It focuses on verifying that saved memory filenames and headings derive from task/session context instead of collapsing to the spec-folder slug."
---

# 199 -- Content-aware memory filename generation

## 1. OVERVIEW

This scenario validates Content-aware memory filename generation for `199`. It focuses on verifying that saved memory filenames and headings derive from task/session context instead of collapsing to the spec-folder slug.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `199` and confirm the expected signals without contradicting evidence.

- Objective: Verify content-aware slug selection prefers task/session context over folder fallback and keeps same-folder saves distinguishable
- Prompt: `Validate content-aware memory filename generation. Capture the evidence needed to prove filename slugs prefer task/session context before folder fallback; the resulting slug is normalized/truncated into a meaningful filename; the H1 heading matches the derived slug title; and multiple pathless inputs in one batch remain distinct instead of collapsing onto one key. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Preferred slug source order is task -> spec title -> session candidates -> folder base; saved filenames in the same folder differ when task context differs; slug normalization lowercases and hyphenates content-aware names; H1 heading matches `slugToTitle()` output; pathless batch inputs receive distinct synthetic keys
- Pass/fail: PASS if same-folder saves produce distinct content-aware filenames and matching headings without falling back to the folder slug unnecessarily; FAIL if filenames collapse to the folder slug, headings diverge from filenames, or pathless batch items overwrite one another

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 199 | Content-aware memory filename generation | Verify content-aware slug selection prefers task/session context over folder fallback and keeps same-folder saves distinguishable | `Validate content-aware memory filename generation. Capture the evidence needed to prove filename slugs prefer task/session context before folder fallback; the resulting slug is normalized/truncated into a meaningful filename; the H1 heading matches the derived slug title; and multiple pathless inputs in one batch remain distinct instead of collapsing onto one key. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Use one spec folder and perform two memory-save flows with clearly different task/session summaries 2) Confirm the saved filenames are different and reflect the task/session wording rather than repeating the folder slug 3) Open each saved file and verify the H1 heading matches the derived filename title 4) Exercise a batch/pathless save case with multiple inputs lacking file paths and verify each item gets a unique synthetic key and distinct slug decision 5) Capture one long task name and confirm the slug is lowercased, hyphenated, and truncated at a word boundary | Preferred slug source order is task -> spec title -> session candidates -> folder base; saved filenames in the same folder differ when task context differs; slug normalization lowercases and hyphenates content-aware names; H1 heading matches `slugToTitle()` output; pathless batch inputs receive distinct synthetic keys | Saved filenames + opened file headings + batch/pathless save output + normalization example | PASS if same-folder saves produce distinct content-aware filenames and matching headings without falling back to the folder slug unnecessarily; FAIL if filenames collapse to the folder slug, headings diverge from filenames, or pathless batch items overwrite one another | Inspect `preferredMemoryTask` selection in workflow orchestration; verify session candidate precedence; review `generateContentSlug()` normalization/truncation rules; check pathless batch key assignment before slug generation |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/11-content-aware-memory-filename-generation.md](../../feature_catalog/13--memory-quality-and-indexing/11-content-aware-memory-filename-generation.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 199
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/199-content-aware-memory-filename-generation.md`
