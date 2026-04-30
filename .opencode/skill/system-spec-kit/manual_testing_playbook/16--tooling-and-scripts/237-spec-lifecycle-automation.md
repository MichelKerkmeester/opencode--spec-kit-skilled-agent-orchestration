---
title: "237 -- Spec Lifecycle Automation"
description: "This scenario validates spec lifecycle automation for `237`. It focuses on confirming the lifecycle toolchain exposes recommendation, upgrade, completeness, completion, and archival entrypoints."
---

# 237 -- Spec Lifecycle Automation

## 1. OVERVIEW

This scenario validates spec lifecycle automation for `237`. It focuses on confirming the lifecycle toolchain exposes recommendation, upgrade, completeness, completion, and archival entrypoints.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm lifecycle tool availability across recommendation, upgrade, completeness, completion, and archival surfaces.
- Real user request: `Please validate Spec Lifecycle Automation against bash .opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh --help and tell me whether the expected signals are present: help output available for lifecycle entrypoints; upgrade regression suite passes; completeness JSON is emitted; completion gate returns a stable status.`
- RCAF Prompt: `As a tooling validation operator, validate Spec Lifecycle Automation against bash .opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh --help. Verify lifecycle tool availability across recommendation, upgrade, completeness, completion, and archival surfaces. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: help output available for lifecycle entrypoints; upgrade regression suite passes; completeness JSON is emitted; completion gate returns a stable status
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the lifecycle scripts collectively expose the documented workflow and the known-good fixture behaves consistently

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, confirm lifecycle tool availability across recommendation, upgrade, completeness, completion, and archival surfaces against bash .opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh --help. Verify recommendation and archive help text is available; upgrade-level regression suite passes; completeness JSON emits percentage-style data; completion status is returned for the fixture. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `bash .opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh --help`
2. `bash .opencode/skill/system-spec-kit/scripts/tests/test-upgrade-level.sh`
3. `bash .opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3 --json`
4. `bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3 --json`
5. `bash .opencode/skill/system-spec-kit/scripts/spec/archive.sh --help`

### Expected

Recommendation and archive help text is available; upgrade-level regression suite passes; completeness JSON emits percentage-style data; completion status is returned for the fixture

### Evidence

Help output, upgrade test transcript, completeness JSON, and completion JSON

### Pass / Fail

- **Pass**: the lifecycle entrypoints are reachable and the upgrade/completion signals match the documented toolchain behavior
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `scripts/spec/recommend-level.sh`, `scripts/tests/test-upgrade-level.sh`, `scripts/spec/calculate-completeness.sh`, and `scripts/spec/archive.sh` if a lifecycle stage is missing or inconsistent

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/23-spec-lifecycle-automation.md](../../feature_catalog/16--tooling-and-scripts/23-spec-lifecycle-automation.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 237
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/237-spec-lifecycle-automation.md`
