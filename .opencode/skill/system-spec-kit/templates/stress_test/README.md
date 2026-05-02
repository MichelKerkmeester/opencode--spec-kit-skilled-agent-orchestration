---
title: "Stress Test Template Pack"
description: "Findings rubric and report templates for the system-spec-kit stress-test cycle."
---

# Stress Test Template Pack

> Report and rubric templates for packet-local stress-test evidence.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. USAGE](#3--usage)
- [4. KEY FILES](#4--key-files)
- [5. BOUNDARIES](#5--boundaries)
- [6. ENTRYPOINTS](#6--entrypoints)
- [7. VALIDATION](#7--validation)
- [8. RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW

`templates/stress_test/` owns the reusable report and rubric files copied during a stress-test cycle. The templates support the manual playbook in `manual_testing_playbook/14--stress-testing/`.

Use this pack when creating packet-local stress-test evidence. The template files define the report shape, rubric schema and JSON starter data, while the manual playbook owns execution steps.

Current state:

- `findings.template.md` provides the report scaffold.
- `findings-rubric.template.json` provides the JSON rubric scaffold.
- `findings-rubric.schema.md` explains the rubric fields and severity model.

## 2. DIRECTORY TREE

```text
stress_test/
+-- findings-rubric.schema.md      # Rubric field contract
+-- findings-rubric.template.json  # Rubric JSON scaffold
+-- findings.template.md           # Findings report scaffold
`-- README.md
```

## 3. USAGE

1. Copy `findings.template.md` to the active stress-test packet as `findings.md`.
2. Copy `findings-rubric.template.json` to the packet as `findings-rubric.json`.
3. Fill the copied rubric from `findings-rubric.schema.md` and the active test scope.

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `findings.template.md` | Markdown report scaffold for stress-test findings, evidence and follow-up actions. |
| `findings-rubric.template.json` | JSON starter file for scoring categories and verdict fields. |
| `findings-rubric.schema.md` | Human-readable contract for rubric fields, severity levels and scoring notes. |
| `README.md` | Folder contract for template usage and validation. |

## 5. BOUNDARIES

| Boundary | Rule |
|---|---|
| Ownership | Store stress-test report templates here. |
| Execution | Keep operator steps in `manual_testing_playbook/14--stress-testing/01-run-stress-cycle.md`. |
| Scope | Do not use this pack for unrelated review or findings reports. |
| Packet output | Copy templates into the active packet before adding run-specific results. |

## 6. ENTRYPOINTS

- Start with `findings.template.md` when the packet needs a human-readable stress-test report.
- Start with `findings-rubric.template.json` when the packet needs machine-readable scoring input.
- Read `findings-rubric.schema.md` before changing rubric field names or severity meanings.
- Use the stress-testing playbook for execution order, evidence capture and operator prompts.

## 7. VALIDATION

Run from the repository root after README edits:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/templates/stress_test/README.md
python3 .opencode/skill/sk-doc/scripts/extract_structure.py .opencode/skill/system-spec-kit/templates/stress_test/README.md
```

Expected result: validation exits `0`, reports no HVR violations and DQI is `good` or better.

## 8. RELATED

- [Stress testing manual playbook](../../manual_testing_playbook/14--stress-testing/README.md)
- [Run stress cycle](../../manual_testing_playbook/14--stress-testing/01-run-stress-cycle.md)
