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

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`/doctor:code-graph` is a command-owned diagnostic and repair policy surface. Diagnostic modes are read-only; apply modes explicitly mutate `.opencode/code-graph.config.json` and verify with scan/query battery behavior.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

### Trigger / Auto-Fire Path

Manual slash command: `/doctor:code-graph:auto|confirm|apply|apply-confirm`.

### Class

manual. Code-graph doctor repair claims are manual/diagnostic; apply mode remains explicitly operator-triggered rather than ambient automation.

### Caveats / Fallback

Apply mode writes config, not source code. The YAML itself notes scanner-config read-path limitations at `.opencode/command/doctor/assets/doctor_code-graph_apply.yaml:194-197`.
<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/command/doctor/code-graph.md:13-32` | Implementation | selects YAML modes and states diagnostic/apply mutation boundaries |
| `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml:19-24` | Implementation | states Phase A is diagnostic-only |
| `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml:191-204` | Implementation | forbids source mutations and `code_graph_scan` in Phase A |
| `.opencode/command/doctor/assets/doctor_code-graph_apply.yaml:24-30` | Implementation | defines apply-mode snapshot and rollback invariants |
| `.opencode/command/doctor/assets/doctor_code-graph_apply.yaml:135-156` | Implementation | defines scan plus gold-query verification |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/08--doctor-code-graph/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Doctor code graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `08--doctor-code-graph/01-doctor-apply-mode.md`

Related references:

- [../02--manual-scan-verify-status/02-code-graph-verify.md](../02--manual-scan-verify-status/02-code-graph-verify.md)
- [../../manual_testing_playbook/08--doctor-code-graph/015-doctor-apply-mode-policy.md](../../manual_testing_playbook/08--doctor-code-graph/015-doctor-apply-mode-policy.md)
<!-- /ANCHOR:source-metadata -->
