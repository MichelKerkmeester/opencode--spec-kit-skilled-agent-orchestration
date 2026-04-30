---
title: "206 -- Architecture boundary enforcement"
description: "This scenario validates architecture boundary enforcement for `206`. It focuses on confirming shared neutrality and thin-wrapper-only enforcement."
---

# 206 -- Architecture boundary enforcement

## 1. OVERVIEW

This scenario validates architecture boundary enforcement for `206`. It focuses on confirming shared neutrality and thin-wrapper-only enforcement.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm shared neutrality and thin-wrapper-only enforcement.
- Real user request: `Please validate Architecture boundary enforcement against the documented validation surface and tell me whether the expected signals are present: shared/ imports into mcp_server/ or scripts/ are flagged across supported import syntaxes; wrappers over 50 substantive lines are rejected; wrappers missing child_process import or spawn/exec usage are rejected; wrappers missing scripts/dist/ delegation are rejected; compliant wrappers and allowed cross-module imports pass.`
- RCAF Prompt: `As a tooling validation operator, validate Architecture boundary enforcement against the documented validation surface. Verify shared/ imports into mcp_server/ or scripts/ are flagged across supported import syntaxes; wrappers over 50 substantive lines are rejected; wrappers missing child_process import or spawn/exec usage are rejected; wrappers missing scripts/dist/ delegation are rejected; compliant wrappers and allowed cross-module imports pass. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: shared/ imports into mcp_server/ or scripts/ are flagged across supported import syntaxes; wrappers over 50 substantive lines are rejected; wrappers missing child_process import or spawn/exec usage are rejected; wrappers missing scripts/dist/ delegation are rejected; compliant wrappers and allowed cross-module imports pass
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if both GAP A and GAP B violations are detected and clean controls pass without false positives

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, confirm shared neutrality and thin-wrapper-only enforcement against the documented validation surface. Verify shared/ imports into mcp_server/ or scripts/ are flagged across supported import syntaxes; wrappers over 50 substantive lines are rejected; wrappers missing child_process import or spawn/exec usage are rejected; wrappers missing scripts/dist/ delegation are rejected; compliant wrappers and allowed cross-module imports pass. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. run the architecture-boundary Vitest suite covering T39-T45
2. capture the GAP A cases for import/export/require/dynamic-import violations from shared/
3. capture the GAP B wrapper failures for over-50-line wrappers, missing child_process usage, and missing scripts/dist/ references
4. capture the clean-pass evidence for a legitimate thin wrapper and allowed shared imports
5. confirm the CLI path reports a passing architecture check when the fixture root is compliant

### Expected

shared/ imports into mcp_server/ or scripts/ are flagged across supported import syntaxes; wrappers over 50 substantive lines are rejected; wrappers missing child_process import or spawn/exec usage are rejected; wrappers missing scripts/dist/ delegation are rejected; compliant wrappers and allowed cross-module imports pass

### Evidence

Vitest output for T39-T45 + CLI pass output showing "Architecture boundary check passed" on the clean fixture path

### Pass / Fail

- **Pass**: both GAP A and GAP B violations are detected and clean controls pass without false positives
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `scripts/evals/check-architecture-boundaries.ts` import parsing, wrapper signal detection, and package-root resolution if violations are missed or false positives appear

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/02-architecture-boundary-enforcement.md](../../feature_catalog/16--tooling-and-scripts/02-architecture-boundary-enforcement.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 206
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/206-architecture-boundary-enforcement.md`
