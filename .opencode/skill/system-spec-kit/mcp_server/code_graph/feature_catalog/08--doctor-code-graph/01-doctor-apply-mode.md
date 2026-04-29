---
title: "Doctor apply mode"
description: "Doctor-code-graph command policy separating read-only diagnostic mode from explicit apply/apply-confirm config mutation and gold-battery verification."
trigger_phrases:
  - "doctor code graph apply"
  - "code_graph runtime catalog"
  - "doctor apply mode"
importance_tier: "important"
---
# Doctor apply mode

## 1. OVERVIEW

`/doctor:code-graph` is a command-owned diagnostic and repair policy surface. Diagnostic modes are read-only; apply modes explicitly mutate `.opencode/code-graph.config.json` and verify with scan/query battery behavior.

## 2. SURFACE

- `.opencode/command/doctor/code-graph.md:13-32` selects YAML modes and states diagnostic/apply mutation boundaries.
- `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml:19-24` states Phase A is diagnostic-only.
- `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml:191-204` forbids source mutations and `code_graph_scan` in Phase A.
- `.opencode/command/doctor/assets/doctor_code-graph_apply.yaml:24-30` defines apply-mode snapshot and rollback invariants.
- `.opencode/command/doctor/assets/doctor_code-graph_apply.yaml:135-156` defines scan plus gold-query verification.

## 3. TRIGGER / AUTO-FIRE PATH

Manual slash command: `/doctor:code-graph:auto|confirm|apply|apply-confirm`.

## 4. CLASS

manual. Packet 012 classifies code-graph doctor repair claims as manual/diagnostic; apply mode remains explicitly operator-triggered rather than ambient automation.

## 5. CAVEATS / FALLBACK

Apply mode writes config, not source code. The YAML itself notes scanner-config read-path limitations at `.opencode/command/doctor/assets/doctor_code-graph_apply.yaml:194-197`.

## 6. CROSS-REFS

- [../02--manual-scan-verify-status/02-code-graph-verify.md](../02--manual-scan-verify-status/02-code-graph-verify.md)
- [../../manual_testing_playbook/08--doctor-code-graph/015-doctor-apply-mode-policy.md](../../manual_testing_playbook/08--doctor-code-graph/015-doctor-apply-mode-policy.md)


