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

> Deterministic remediation helpers for operational failure drills and recovery runs.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. FAILURE CLASSES](#3--failure-classes)
- [4. SCRIPT MAP](#4--script-map)
- [5. RETRY AND ESCALATION CONTRACT](#5--retry-and-escalation-contract)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. RELATED RESOURCES](#8--related-resources)

<!-- /ANCHOR:table-of-contents -->
---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

These scripts automate bounded remediation steps for known failure classes in the spec-kit memory system. Every handler follows deterministic retry behavior. If retries are exhausted, the script emits one escalation JSON line and exits non-zero.

### What You Get

| Capability | Description |
| --- | --- |
| Deterministic retries | Repeatable retry limits per step |
| Scenario control | `success` and `escalate` modes for drills |
| Unified escalation format | Single-line JSON payload with owner and next action |
| Runbook helper | Class listing, details, and drill orchestration |

<!-- /ANCHOR:overview -->
---

## 2. QUICK START
<!-- ANCHOR:quick-start -->

### List Supported Classes

```bash
.opencode/skill/system-spec-kit/scripts/ops/runbook.sh list
```

### Show One Class Runbook

```bash
.opencode/skill/system-spec-kit/scripts/ops/runbook.sh show index-drift
```

### Run a Success Drill Across All Classes

```bash
.opencode/skill/system-spec-kit/scripts/ops/runbook.sh drill all --scenario success --max-attempts 3
```

<!-- /ANCHOR:quick-start -->
---

## 3. FAILURE CLASSES
<!-- ANCHOR:failure-classes -->

The current deterministic classes are:

1. `index-drift`
2. `session-ambiguity`
3. `ledger-mismatch`
4. `telemetry-drift`

Each class has a dedicated healer script with the same control interface.

<!-- /ANCHOR:failure-classes -->
---

## 4. SCRIPT MAP
<!-- ANCHOR:script-map -->

| File | Purpose |
| --- | --- |
| `ops-common.sh` | Shared retry, logging, and escalation helpers |
| `heal-index-drift.sh` | Run index-drift remediation workflow |
| `heal-session-ambiguity.sh` | Run session-ambiguity remediation workflow |
| `heal-ledger-mismatch.sh` | Run ledger-mismatch remediation workflow |
| `heal-telemetry-drift.sh` | Run telemetry-drift remediation workflow |
| `runbook.sh` | List classes, show runbook detail, execute drills |

<!-- /ANCHOR:script-map -->
---

## 5. RETRY AND ESCALATION CONTRACT
<!-- ANCHOR:retry-and-escalation-contract -->

- Retries are deterministic and configured per step.
- `--max-attempts` sets the hard upper bound.
- `--scenario success` uses a bounded-success path.
- `--scenario escalate` forces retry exhaustion for drill validation.

Escalation payload example:

```json
{"event":"ESCALATION","failure_class":"telemetry-drift","step":"verify-release-gate","attempts":2,"owner":"Operations Lead","reason":"bounded-retry-exhausted","next_action":"operator-ack-required","command":"node ...","timestamp":"2026-02-22T00:00:00Z"}
```

<!-- /ANCHOR:retry-and-escalation-contract -->
---

## 6. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Escalation Drill for One Class

```bash
.opencode/skill/system-spec-kit/scripts/ops/runbook.sh drill telemetry-drift --scenario escalate --max-attempts 2
```

### Common Handler Options

Each healer script supports:

- `--scenario <success|escalate>`
- `--max-attempts <n>`
- `--backoff-seconds <n>`
- `--detect-failures <n>`
- `--repair-failures <n>`
- `--verify-failures <n>`

<!-- /ANCHOR:usage-examples -->
---

## 7. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

| Issue | Cause | Fix |
| --- | --- | --- |
| Script exits non-zero | Retry budget exhausted | Read emitted escalation payload, then route to named owner |
| Unknown class in runbook | Invalid class key | Run `runbook.sh list` and retry with a supported class |
| No escalation in test | Scenario not set to escalate | Re-run with `--scenario escalate` |

<!-- /ANCHOR:troubleshooting -->
---

## 8. RELATED RESOURCES
<!-- ANCHOR:related-resources -->

- `.opencode/skill/system-spec-kit/scripts/README.md`
- `.opencode/skill/system-spec-kit/scripts/spec/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/README.md`

<!-- /ANCHOR:related-resources -->
