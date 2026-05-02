---
title: "Ops Self-Healing Scripts"
description: "Deterministic runbook helpers for spec-kit operational failure classes with bounded retry and escalation output."
trigger_phrases:
  - "ops runbook"
  - "self-healing scripts"
  - "index drift remediation"
  - "telemetry drift drill"
---

# Ops Self-Healing Scripts

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. SCRIPT IO](#2-script-io)
- [3. ENTRYPOINTS](#3-entrypoints)
- [4. VALIDATION FROM REPO ROOT](#4-validation-from-repo-root)
- [5. KEY FILES](#5-key-files)
- [6. BOUNDARIES](#6-boundaries)
- [7. RELATED](#7-related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`scripts/ops/` contains deterministic shell runbooks for known spec-kit operational failure classes. Each healer runs detect, repair, and verify steps with bounded retry behavior and emits a structured escalation payload when retry budget is exhausted.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:script-io -->
## 2. SCRIPT IO

| Flow | Input | Output |
| --- | --- | --- |
| Class listing | `runbook.sh list` | Supported failure class keys |
| Runbook detail | `runbook.sh show <class>` | Human-readable runbook for one class |
| Drill execution | `runbook.sh drill <class|all> --scenario <success|escalate>` | Success output or escalation JSON |
| Healer execution | Failure class plus retry options | Deterministic detect, repair, and verify sequence |

Supported classes are `index-drift`, `session-ambiguity`, `ledger-mismatch`, and `telemetry-drift`.

<!-- /ANCHOR:script-io -->
<!-- ANCHOR:entrypoints -->
## 3. ENTRYPOINTS

- `runbook.sh list` prints supported failure classes.
- `runbook.sh show <class>` prints one class runbook.
- `runbook.sh drill <class|all> --scenario <success|escalate> --max-attempts <n>` runs bounded remediation drills.
- `heal-*.sh` scripts run class-specific detect, repair, and verify flows.
- `ops-common.sh` provides shared retry, logging, and escalation helpers.

<!-- /ANCHOR:entrypoints -->
<!-- ANCHOR:validation-from-repo-root -->
## 4. VALIDATION FROM REPO ROOT

Run ops validation from the repository root:

```bash
bash .opencode/skill/system-spec-kit/scripts/ops/runbook.sh list
bash .opencode/skill/system-spec-kit/scripts/ops/runbook.sh show index-drift
bash .opencode/skill/system-spec-kit/scripts/ops/runbook.sh drill all --scenario success --max-attempts 1
python3 .opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/scripts/ops
```

<!-- /ANCHOR:validation-from-repo-root -->
<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Purpose |
| --- | --- |
| `ops-common.sh` | Shared retry, logging, option parsing, and escalation helpers |
| `heal-index-drift.sh` | Remediation workflow for index drift failures |
| `heal-session-ambiguity.sh` | Remediation workflow for session ambiguity failures |
| `heal-ledger-mismatch.sh` | Remediation workflow for ledger mismatch failures |
| `heal-telemetry-drift.sh` | Remediation workflow for telemetry drift failures |
| `runbook.sh` | Class listing, runbook display, and drill orchestration |

<!-- /ANCHOR:key-files -->
<!-- ANCHOR:boundaries -->
## 6. BOUNDARIES

- Ops scripts model known failure classes; they are not a general incident-management system.
- Healers must keep bounded retries and emit one escalation JSON line on retry exhaustion.
- Scripts should remain deterministic so drills and release gates are repeatable.

<!-- /ANCHOR:boundaries -->
<!-- ANCHOR:related -->
## 7. RELATED

- `../README.md`
- `../spec/README.md`
- `../../mcp_server/README.md`

<!-- /ANCHOR:related -->
