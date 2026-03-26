---
title: "244 -- Template Composition System"
description: "This scenario validates template composition system for `244`. It focuses on confirming verify mode, dry-run previewing, targeted composition, and post-compose drift checks."
---

# 244 -- Template Composition System

## 1. OVERVIEW

This scenario validates template composition system for `244`. It focuses on confirming verify mode, dry-run previewing, targeted composition, and post-compose drift checks.

---

## 2. CURRENT REALITY

Operators exercise the template composer in its three main modes and confirm it can detect drift, preview changes, recompose a targeted level, and then verify the outputs again.

- Objective: Confirm verify mode, dry-run previewing, targeted composition, and post-compose drift checks
- Prompt: `Validate the template composition system. Capture the evidence needed to prove compose.sh can verify the current outputs, preview Level 2 and 3 changes in dry-run mode, compose a targeted level, and then re-run verify mode against the updated output. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: verify mode returns stable drift status; dry-run previews changes without writing; targeted compose completes; follow-up verify succeeds for the targeted level
- Pass/fail: PASS if the composer exposes stable verify and dry-run behavior and can successfully recompose the requested level

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 244 | Template Composition System | Confirm verify mode, dry-run previewing, targeted composition, and post-compose drift checks | `Validate the template composition system. Capture the evidence needed to prove compose.sh can verify the current outputs, preview Level 2 and 3 changes in dry-run mode, compose a targeted level, and then re-run verify mode against the updated output. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh --verify` 2) `bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh --dry-run --verbose 2 3` 3) `bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh 2` 4) `bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh --verify 2` | Verify mode returns a clear drift or clean status; dry-run previews without writing; targeted Level 2 composition succeeds; targeted verify completes after composition | Composer stdout/stderr for verify, dry-run, targeted compose, and post-compose verify | PASS if the composer behaves deterministically across verify, preview, write, and re-verify modes | Inspect `scripts/templates/compose.sh`, required addendum file checks, and generated `templates/level_*` outputs if drift detection or targeted composition fails |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/30-template-composition-system.md](../../feature_catalog/16--tooling-and-scripts/30-template-composition-system.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 244
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/244-template-composition-system.md`
