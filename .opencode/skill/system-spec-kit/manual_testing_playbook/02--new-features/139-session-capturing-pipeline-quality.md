---
title: "NEW-139 -- Session capturing pipeline quality"
description: "This scenario validates Session capturing pipeline quality for `NEW-139`. It focuses on Canonical coverage sourced from M-007 session-capturing closure verification."
---

# NEW-139 -- Session capturing pipeline quality

## 1. OVERVIEW

This scenario validates Session capturing pipeline quality for `NEW-139`. It focuses on Canonical coverage sourced from M-007 session-capturing closure verification.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-139` and confirm the expected signals without contradicting evidence.

- Objective: Canonical coverage sourced from M-007 session-capturing closure verification
- Canonical shared scenario: `M-007`
- Prompt: `Run the canonical M-007 session-capturing closure verification scenario.`
- Expected signals: Coverage is sourced from the M-007 closure suite, including JSON authority, stateless enrichment, runtime fallback ordering, Phase 017 stateless quality-gate behavior, insufficiency rejection, and indexing readiness.
- Pass/fail: PASS if the M-007 closure matrix passes and covers the session-capturing quality contract; FAIL if the canonical M-007 coverage is incomplete or contradictory.

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-139 | Session capturing pipeline quality | Canonical coverage sourced from M-007 session-capturing closure verification | `Run the canonical M-007 session-capturing closure verification scenario.` | See the canonical M-007 snippet for the full automated, standards, and manual execution matrix. | Coverage is sourced from the M-007 closure suite, including JSON authority, stateless enrichment, runtime fallback ordering, Phase 017 stateless quality-gate behavior, insufficiency rejection, and indexing readiness. | M-007 execution evidence plus the linked session-capturing feature catalog entry. | PASS if the M-007 closure matrix passes and covers the session-capturing quality contract; FAIL if the canonical M-007 coverage is incomplete or contradictory. | Inspect the M-007 snippet, the session-capturing catalog entry, and the related closure evidence before introducing any alternative scenario wording. |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/12-session-capturing-pipeline-quality.md](../../feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md)
- Canonical memory/spec scenario: [M-007](../04--memory-and-spec-kit-scenarios/007-session-capturing-pipeline-quality.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-139
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/139-session-capturing-pipeline-quality.md`
