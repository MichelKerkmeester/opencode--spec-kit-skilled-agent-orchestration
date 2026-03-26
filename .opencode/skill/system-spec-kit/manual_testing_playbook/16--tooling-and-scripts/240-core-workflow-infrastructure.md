---
title: "240 -- Core Workflow Infrastructure"
description: "This scenario validates core workflow infrastructure for `240`. It focuses on confirming the shared indexing, post-save review, scoring, and workflow helper modules through targeted regression suites."
---

# 240 -- Core Workflow Infrastructure

## 1. OVERVIEW

This scenario validates core workflow infrastructure for `240`. It focuses on confirming the shared indexing, post-save review, scoring, and workflow helper modules through targeted regression suites.

---

## 2. CURRENT REALITY

Operators validate the internal workflow layer through the regression suites that cover weighting, post-save review, quality scoring, and end-to-end workflow behavior, rather than trying to probe those modules one at a time through ad hoc shell calls.

- Objective: Confirm the shared workflow layer remains stable across indexing, review, scoring, and end-to-end workflow tests
- Prompt: `Validate the core workflow infrastructure. Capture the evidence needed to prove the memory-indexer weighting, post-save review, quality-scorer calibration, generate-context authority, and workflow end-to-end suites all pass together. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: all targeted Vitest suites pass; post-save review assertions stay intact; indexing/scoring regressions do not fail
- Pass/fail: PASS if the shared workflow module suites pass together without unexpected skips or failures

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 240 | Core Workflow Infrastructure | Confirm the shared workflow layer remains stable across indexing, review, scoring, and end-to-end workflow tests | `Validate the core workflow infrastructure. Capture the evidence needed to prove the memory-indexer weighting, post-save review, quality-scorer calibration, generate-context authority, and workflow end-to-end suites all pass together. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-indexer-weighting.vitest.ts tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/workflow-e2e.vitest.ts` | All targeted Vitest suites pass with no failing assertions across weighting, review, scoring, authority, or workflow seams | Vitest transcript showing passing suite counts and file names | PASS if the targeted suites pass together without failures; FAIL if any shared workflow seam regresses | Inspect `scripts/core/memory-indexer.ts`, `post-save-review.ts`, `quality-scorer.ts`, `config.ts`, and workflow entrypoints if any targeted suite fails |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/26-core-workflow-infrastructure.md](../../feature_catalog/16--tooling-and-scripts/26-core-workflow-infrastructure.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 240
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/240-core-workflow-infrastructure.md`
