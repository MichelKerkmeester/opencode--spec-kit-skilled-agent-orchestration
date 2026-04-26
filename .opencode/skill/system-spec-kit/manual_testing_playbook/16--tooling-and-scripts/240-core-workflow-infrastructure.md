---
title: "240 -- Core Workflow Infrastructure"
description: "This scenario validates core workflow infrastructure for `240`. It focuses on confirming the shared indexing, post-save review, scoring, and workflow helper modules through targeted regression suites."
---

# 240 -- Core Workflow Infrastructure

## 1. OVERVIEW

This scenario validates core workflow infrastructure for `240`. It focuses on confirming the shared indexing, post-save review, scoring, and workflow helper modules through targeted regression suites.

---

## 2. SCENARIO CONTRACT

Operators validate the internal workflow layer through the regression suites that cover weighting, post-save review, quality scoring, and end-to-end workflow behavior, rather than trying to probe those modules one at a time through ad hoc shell calls.

- Objective: Confirm the shared workflow layer remains stable across indexing, review, scoring, and end-to-end workflow tests
- Prompt: `As a tooling validation operator, validate Core Workflow Infrastructure against cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-indexer-weighting.vitest.ts tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/workflow-e2e.vitest.ts. Verify the shared workflow layer remains stable across indexing, review, scoring, and end-to-end workflow tests. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: all targeted Vitest suites pass; post-save review assertions stay intact; indexing/scoring regressions do not fail
- Pass/fail: PASS if the shared workflow module suites pass together without unexpected skips or failures

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, confirm the shared workflow layer remains stable across indexing, review, scoring, and end-to-end workflow tests against cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-indexer-weighting.vitest.ts tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/workflow-e2e.vitest.ts. Verify all targeted Vitest suites pass with no failing assertions across weighting, review, scoring, authority, or workflow seams. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-indexer-weighting.vitest.ts tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/workflow-e2e.vitest.ts`

### Expected

All targeted Vitest suites pass with no failing assertions across weighting, review, scoring, authority, or workflow seams

### Evidence

Vitest transcript showing passing suite counts and file names

### Pass / Fail

- **Pass**: the targeted suites pass together without failures
- **Fail**: any shared workflow seam regresses

### Failure Triage

Inspect `scripts/core/memory-indexer.ts`, `post-save-review.ts`, `quality-scorer.ts`, `config.ts`, and workflow entrypoints if any targeted suite fails

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/26-core-workflow-infrastructure.md](../../feature_catalog/16--tooling-and-scripts/26-core-workflow-infrastructure.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 240
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/240-core-workflow-infrastructure.md`
