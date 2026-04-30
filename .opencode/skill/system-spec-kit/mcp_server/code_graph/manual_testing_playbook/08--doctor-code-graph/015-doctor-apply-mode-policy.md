---
title: "015 doctor apply mode policy"
description: "Verify doctor-code-graph separates read-only diagnostic mode from explicit apply-mode mutation and verification policy."
trigger_phrases:
  - "015"
  - "doctor apply mode policy"
  - "code_graph manual testing"
importance_tier: "normal"
---
# 015 doctor apply mode policy

## 1. OVERVIEW

Verify doctor-code-graph separates read-only diagnostic mode from explicit apply-mode mutation and verification policy.

---

## 2. SCENARIO CONTRACT

- Objective: Verify doctor-code-graph separates read-only diagnostic mode from explicit apply-mode mutation and verification policy.
- Real user request: `Review doctor-code-graph auto and apply workflows to confirm diagnostics are read-only and apply mode has explicit verification and rollback policy.`
- RCAF Prompt: `As a doctor-code-graph policy reviewer, inspect diagnostic and apply workflow definitions against doctor-code-graph command files. Verify read-only mode forbids mutation and apply mode limits writes before scan/query verification and rollback policy. Return PASS/FAIL with source anchors and evidence excerpts.`
- Expected execution process: Read the documented command and YAML line ranges, and run only diagnostic mode unless using a disposable workspace for apply-mode checks.
- Expected signals: Diagnostic auto/confirm forbids source mutation and scan; apply/apply-confirm explicitly limits writes to config/scratch, then verifies with scan/query and rollback policy.
- Desired user-visible outcome: A concise verdict explaining whether doctor-code-graph keeps diagnostic and apply policies separate.
- Pass/fail: PASS if diagnostic paths stay read-only and apply paths document limited writes plus verification/rollback; FAIL if diagnostic mode mutates, apply mode lacks verification policy, or medium/low tiers bypass interactive gating.

---

## 3. TEST EXECUTION

### Commands

1. Read `.opencode/command/doctor/code-graph.md:13-32`.
2. Read `doctor_code-graph_auto.yaml:19-24` and `:191-204`.
3. Read `doctor_code-graph_apply.yaml:24-30` and `:135-156`.
4. Run only diagnostic mode unless using disposable workspace.

### Expected Output / Verification

Diagnostic auto/confirm forbids source mutation and scan. Apply/apply-confirm explicitly limits writes to config/scratch, then verifies with scan/query and rollback policy.

### Cleanup

Remove scratch/apply artifacts from disposable copy.

### Variant Scenarios

In apply-confirm, verify medium/low tiers require interactive gating.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 015
- Canonical root source: `manual_testing_playbook.md`
