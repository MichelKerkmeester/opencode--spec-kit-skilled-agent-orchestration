---
title: "237 -- Spec Lifecycle Automation"
description: "This scenario validates spec lifecycle automation for `237`. It focuses on confirming the lifecycle toolchain exposes recommendation, upgrade, completeness, completion, and archival entrypoints."
---

# 237 -- Spec Lifecycle Automation

## 1. OVERVIEW

This scenario validates spec lifecycle automation for `237`. It focuses on confirming the lifecycle toolchain exposes recommendation, upgrade, completeness, completion, and archival entrypoints.

---

## 2. CURRENT REALITY

Operators verify that the lifecycle surface behaves like a coordinated toolkit: recommendation and archival CLIs expose the documented contract, upgrade tests pass, and completeness plus completion status can be read directly from a known-good fixture.

- Objective: Confirm lifecycle tool availability across recommendation, upgrade, completeness, completion, and archival surfaces
- Prompt: `Validate the spec lifecycle automation toolchain. Capture the evidence needed to prove recommend-level and archive expose their CLI contracts, upgrade-level regression coverage passes, calculate-completeness emits structured output, and check-completion reports the current completion state for a compliant fixture. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: help output available for lifecycle entrypoints; upgrade regression suite passes; completeness JSON is emitted; completion gate returns a stable status
- Pass/fail: PASS if the lifecycle scripts collectively expose the documented workflow and the known-good fixture behaves consistently

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 237 | Spec Lifecycle Automation | Confirm lifecycle tool availability across recommendation, upgrade, completeness, completion, and archival surfaces | `Validate the spec lifecycle automation toolchain. Capture the evidence needed to prove recommend-level and archive expose their CLI contracts, upgrade-level regression coverage passes, calculate-completeness emits structured output, and check-completion reports the current completion state for a compliant fixture. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `bash .opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh --help` 2) `bash .opencode/skill/system-spec-kit/scripts/tests/test-upgrade-level.sh` 3) `bash .opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3 --json` 4) `bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3 --json` 5) `bash .opencode/skill/system-spec-kit/scripts/spec/archive.sh --help` | Recommendation and archive help text is available; upgrade-level regression suite passes; completeness JSON emits percentage-style data; completion status is returned for the fixture | Help output, upgrade test transcript, completeness JSON, and completion JSON | PASS if the lifecycle entrypoints are reachable and the upgrade/completion signals match the documented toolchain behavior | Inspect `scripts/spec/recommend-level.sh`, `scripts/tests/test-upgrade-level.sh`, `scripts/spec/calculate-completeness.sh`, and `scripts/spec/archive.sh` if a lifecycle stage is missing or inconsistent |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/23-spec-lifecycle-automation.md](../../feature_catalog/16--tooling-and-scripts/23-spec-lifecycle-automation.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 237
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/237-spec-lifecycle-automation.md`
