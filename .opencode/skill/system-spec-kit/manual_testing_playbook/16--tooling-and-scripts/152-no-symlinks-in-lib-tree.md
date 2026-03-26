---
title: "152 -- No symlinks in lib/ tree"
description: "This scenario validates the no-symlinks policy by confirming zero symlinks exist under mcp_server/lib/. It enforces the ARCHITECTURE.md 'No Symlinks in lib/ Tree' policy."
---

# 152 -- No symlinks in lib/ tree

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. TEST EXECUTION](#3--test-execution)
- [4. REFERENCES](#4--references)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW

This scenario validates the no-symlinks-in-lib policy for `152`. It focuses on confirming that `find mcp_server/lib -type l` returns zero results, enforcing the ARCHITECTURE.md policy.

---

## 2. CURRENT REALITY

Operators run a symlink scan and confirm the lib/ tree contains no symlinks. The policy was established in Phase 15 after discovering that `lib/cache/cognitive -> ../cognitive` caused invisible path aliasing that broke dead-code analysis and import tooling.

- Objective: Verify zero symlinks exist under mcp_server/lib/
- Prompt: `Check for symlinks in the lib/ tree. Run find mcp_server/lib -type l and confirm zero results. Return a pass/fail verdict.`
- Expected signals: Zero symlinks found
- Pass/fail: PASS if find returns no output

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 152 | No symlinks in lib/ tree | Verify zero symlinks under mcp_server/lib/ | `Check for symlinks in the lib/ tree. Run find mcp_server/lib -type l and confirm zero results. Return a pass/fail verdict.` | 1) `cd .opencode/skill/system-spec-kit` 2) `find mcp_server/lib -type l` 3) Verify output is empty 4) `echo $?` to confirm exit 0 | Zero symlinks found | find command output (should be empty) | PASS if find returns no output | Identify symlink -> determine if intentional -> replace with canonical import path -> remove symlink -> update imports -> re-verify |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/15-module-boundary-map.md](../../feature_catalog/16--tooling-and-scripts/15-module-boundary-map.md)
- Policy: [ARCHITECTURE.md](../../ARCHITECTURE.md) -- "No Symlinks in lib/ Tree" subsection

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 152
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/152-no-symlinks-in-lib-tree.md`
