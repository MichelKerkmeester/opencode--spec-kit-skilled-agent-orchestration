---
title: "151 -- MODULE_MAP.md accuracy validation"
description: "This scenario validates MODULE_MAP.md content accuracy by spot-checking module entries against actual code structure. It focuses on verifying listed files exist and consumers are correct."
---

# 151 -- MODULE_MAP.md accuracy validation

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. TEST EXECUTION](#3--test-execution)
- [4. REFERENCES](#4--references)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW

This scenario validates MODULE_MAP.md content accuracy for `151`. It focuses on verifying that the module inventory, file listings, and consumer mappings match the actual codebase.

---

## 2. CURRENT REALITY

Operators spot-check 5 representative modules from MODULE_MAP.md and verify their entries are accurate against the live codebase.

- Objective: Verify MODULE_MAP.md entries match actual code structure for 5 sampled modules
- Prompt: `Validate MODULE_MAP.md accuracy by spot-checking 5 modules (config, cognitive, search, storage, scoring). For each: verify listed key files exist, verify primary consumers are accurate via grep. Return a pass/fail verdict per module.`
- Expected signals: All 5 sampled modules have accurate file lists and consumer mappings
- Pass/fail: PASS if all 5 sampled modules are accurate

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 151 | MODULE_MAP.md accuracy | Verify 5 module entries match actual code | `Validate MODULE_MAP.md accuracy by spot-checking 5 modules (config, cognitive, search, storage, scoring). For each: verify listed key files exist, verify primary consumers are accurate via grep. Return a pass/fail verdict per module.` | 1) `cd .opencode/skill/system-spec-kit` 2) Read MODULE_MAP.md entries for config, cognitive, search, storage, scoring 3) For each module: `ls mcp_server/lib/{module}/` to verify key files exist 4) For each module: `grep -r "from.*/{module}/" mcp_server/ --include="*.ts" -l` to verify consumers 5) Compare against MODULE_MAP.md listings | All 5 modules have accurate file lists and consumer mappings | ls output + grep output per module vs MODULE_MAP.md entries | PASS if all 5 sampled modules are accurate | Identify stale entry -> update MODULE_MAP.md -> re-verify |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/15-module-boundary-map.md](../../feature_catalog/16--tooling-and-scripts/15-module-boundary-map.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 151
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/151-module-map-accuracy.md`
