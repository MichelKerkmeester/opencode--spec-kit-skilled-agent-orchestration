---
title: "EX-013 -- Health diagnostics (memory_health)"
description: "This scenario validates Health diagnostics (memory_health) for `EX-013`. It focuses on Index/FTS integrity check."
---

# EX-013 -- Health diagnostics (memory_health)

## 1. OVERVIEW

This scenario validates Health diagnostics (memory_health) for `EX-013`. It focuses on Index/FTS integrity check.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `EX-013` and confirm the expected signals without contradicting evidence.

- Objective: Index/FTS integrity check
- Prompt: `As a discovery validation operator, validate Health diagnostics (memory_health) against memory_health(reportMode:full). Verify healthy/degraded status and diagnostics. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: healthy/degraded status and diagnostics
- Pass/fail: PASS if report completes with actionable diagnostics

---

## 3. TEST EXECUTION

### Prompt

```
As a discovery validation operator, validate Index/FTS integrity check against memory_health(reportMode:full). Verify healthy/degraded status and diagnostics. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. memory_health(reportMode:full)
2. memory_health(reportMode:divergent_aliases)

### Expected

healthy/degraded status and diagnostics

### Evidence

Health outputs

### Pass / Fail

- **Pass**: report completes with actionable diagnostics
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Run index_scan(force) if FTS mismatch

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [03--discovery/03-health-diagnostics-memoryhealth.md](../../feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md)

---

## 5. SOURCE METADATA

- Group: Discovery
- Playbook ID: EX-013
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--discovery/013-health-diagnostics-memory-health.md`
- audited_post_018: true
