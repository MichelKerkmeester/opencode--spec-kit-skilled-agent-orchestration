---
title: "150 -- Source-dist alignment validation"
description: "This scenario validates the check-source-dist-alignment.ts script detects no orphaned dist files. It focuses on verifying every dist/lib/*.js maps to a source .ts file."
---

# 150 -- Source-dist alignment validation

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. TEST EXECUTION](#3--test-execution)
- [4. REFERENCES](#4--references)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW

This scenario validates the check-source-dist-alignment.ts script for `150`. It focuses on verifying every `.js` file in `mcp_server/dist/lib/` has a corresponding `.ts` source file.

---

## 2. CURRENT REALITY

Operators run the alignment script and confirm zero violations. The script scans all `.js` files under `dist/lib/`, maps each to its expected `.ts` source, and reports orphans.

- Objective: Verify source-dist alignment passes with 0 violations
- Prompt: `Run the source-dist alignment check and confirm no orphaned dist files exist. Capture the summary output as evidence. Return a concise pass/fail verdict.`
- Expected signals: 0 violations, all dist files aligned
- Pass/fail: PASS if 0 violations reported and exit code is 0

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 150 | Source-dist alignment validation | Verify check-source-dist-alignment.ts reports 0 violations | `Run the source-dist alignment check and confirm no orphaned dist files exist. Capture the summary output as evidence. Return a concise pass/fail verdict.` | 1) `cd .opencode/skill/system-spec-kit` 2) `npx ts-node --transpile-only scripts/evals/check-source-dist-alignment.ts` 3) Check exit code is 0 4) Verify "violations: 0" in output | 0 violations, all dist files aligned, exit code 0 | Script summary output showing scanned count, aligned count, violations count | PASS if 0 violations and exit 0 | Identify orphaned dist file -> check if source was deleted/renamed -> either restore source, remove dist artifact, or add time-bounded allowlist entry |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/14-source-dist-alignment-enforcement.md](../../feature_catalog/16--tooling-and-scripts/14-source-dist-alignment-enforcement.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 150
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/150-source-dist-alignment-validation.md`
