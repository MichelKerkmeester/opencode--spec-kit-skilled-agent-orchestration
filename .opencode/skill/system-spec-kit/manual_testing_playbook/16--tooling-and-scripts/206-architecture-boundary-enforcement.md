---
title: "206 -- Architecture boundary enforcement"
description: "This scenario validates architecture boundary enforcement for `206`. It focuses on confirming shared neutrality and thin-wrapper-only enforcement."
---

# 206 -- Architecture boundary enforcement

## 1. OVERVIEW

This scenario validates architecture boundary enforcement for `206`. It focuses on confirming shared neutrality and thin-wrapper-only enforcement.

---

## 2. CURRENT REALITY

Operators run the architecture boundary checks and confirm both boundary rules fail on seeded violations while clean controls pass without false positives.

- Objective: Confirm shared neutrality and thin-wrapper-only enforcement
- Prompt: `Validate architecture boundary enforcement. Capture the evidence needed to prove shared/ imports into mcp_server/ or scripts/ are rejected across supported import syntaxes; top-level mcp_server/scripts wrappers fail when they exceed 50 substantive lines, omit child_process spawn/exec usage, or skip scripts/dist/ delegation; and compliant wrappers plus allowed shared imports pass cleanly. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: shared/ imports into mcp_server/ or scripts/ are flagged across supported import syntaxes; wrappers over 50 substantive lines are rejected; wrappers missing child_process import or spawn/exec usage are rejected; wrappers missing scripts/dist/ delegation are rejected; compliant wrappers and allowed cross-module imports pass
- Pass/fail: PASS if both GAP A and GAP B violations are detected and clean controls pass without false positives

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 206 | Architecture boundary enforcement | Confirm shared neutrality and thin-wrapper-only enforcement | `Validate architecture boundary enforcement. Capture the evidence needed to prove shared/ imports into mcp_server/ or scripts/ are rejected across supported import syntaxes; top-level mcp_server/scripts wrappers fail when they exceed 50 substantive lines, omit child_process spawn/exec usage, or skip scripts/dist/ delegation; and compliant wrappers plus allowed shared imports pass cleanly. Return a concise user-facing pass/fail verdict with the main reason.` | 1) run the architecture-boundary Vitest suite covering T39-T45 2) capture the GAP A cases for import/export/require/dynamic-import violations from shared/ 3) capture the GAP B wrapper failures for over-50-line wrappers, missing child_process usage, and missing scripts/dist/ references 4) capture the clean-pass evidence for a legitimate thin wrapper and allowed shared imports 5) confirm the CLI path reports a passing architecture check when the fixture root is compliant | shared/ imports into mcp_server/ or scripts/ are flagged across supported import syntaxes; wrappers over 50 substantive lines are rejected; wrappers missing child_process import or spawn/exec usage are rejected; wrappers missing scripts/dist/ delegation are rejected; compliant wrappers and allowed cross-module imports pass | Vitest output for T39-T45 + CLI pass output showing "Architecture boundary check passed" on the clean fixture path | PASS if both GAP A and GAP B violations are detected and clean controls pass without false positives | Inspect `scripts/evals/check-architecture-boundaries.ts` import parsing, wrapper signal detection, and package-root resolution if violations are missed or false positives appear |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/02-architecture-boundary-enforcement.md](../../feature_catalog/16--tooling-and-scripts/02-architecture-boundary-enforcement.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 206
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/206-architecture-boundary-enforcement.md`
