---
title: "244 -- Template Composition System"
description: "This scenario validates template composition system for `244`. It focuses on confirming verify mode, dry-run previewing, targeted composition, and post-compose drift checks."
---

# 244 -- Template Composition System

## 1. OVERVIEW

This scenario validates template composition system for `244`. It focuses on confirming verify mode, dry-run previewing, targeted composition, and post-compose drift checks.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm verify mode, dry-run previewing, targeted composition, and post-compose drift checks.
- Real user request: `Please validate Template Composition System against bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh --verify and tell me whether the expected signals are present: verify mode returns stable drift status; dry-run previews changes without writing; targeted compose completes; follow-up verify succeeds for the targeted level.`
- RCAF Prompt: `As a tooling validation operator, validate Template Composition System against bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh --verify. Verify verify mode, dry-run previewing, targeted composition, and post-compose drift checks. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: verify mode returns stable drift status; dry-run previews changes without writing; targeted compose completes; follow-up verify succeeds for the targeted level
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the composer exposes stable verify and dry-run behavior and can successfully recompose the requested level

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, confirm verify mode, dry-run previewing, targeted composition, and post-compose drift checks against bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh --verify. Verify verify mode returns a clear drift or clean status; dry-run previews without writing; targeted Level 2 composition succeeds; targeted verify completes after composition. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh --verify`
2. `bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh --dry-run --verbose 2 3`
3. `bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh 2`
4. `bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh --verify 2`

### Expected

Verify mode returns a clear drift or clean status; dry-run previews without writing; targeted Level 2 composition succeeds; targeted verify completes after composition

### Evidence

Composer stdout/stderr for verify, dry-run, targeted compose, and post-compose verify

### Pass / Fail

- **Pass**: the composer behaves deterministically across verify, preview, write, and re-verify modes
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `scripts/templates/compose.sh`, required addendum file checks, and generated `templates/level_*` outputs if drift detection or targeted composition fails

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/30-template-composition-system.md](../../feature_catalog/16--tooling-and-scripts/30-template-composition-system.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 244
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/244-template-composition-system.md`
