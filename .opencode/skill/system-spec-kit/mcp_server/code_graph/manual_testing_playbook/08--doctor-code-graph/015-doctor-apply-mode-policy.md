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

- **Goal**: Verify doctor-code-graph separates read-only diagnostic mode from explicit apply-mode mutation and verification policy.
- **Prerequisites**:
  - Working directory is the repository root.
  - MCP server build is available: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`.
  - Use a disposable workspace copy for scenarios that modify files or graph state.
- **Prompt**: `As a code_graph validation operator, execute scenario 015 (doctor apply mode policy), capture commands, JSON excerpts, and return PASS/FAIL with the main evidence.`

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

