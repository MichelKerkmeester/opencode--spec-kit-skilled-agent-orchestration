---
title: "024 -- Cold-start novelty boost (N4)"
description: "Archived copy of the Cold-start novelty boost (N4) scenario. It validates that novelty is removed from the hot path."
audited_post_018: true
deprecated_at: 2026-04-11
deprecated_by: phase-006-canonical-continuity-refactor
deprecated_reason: "The novelty boost scenario is no longer part of the live playbook; it was moved out of the active category into _deprecated/."
---

# 024 -- Cold-start novelty boost (N4)

## 1. OVERVIEW

This scenario validates Cold-start novelty boost (N4) for `024`. It focuses on Confirm novelty removed from hot path.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `024` and confirm the expected signals without contradicting evidence.

- Objective: Confirm novelty removed from hot path
- Prompt: `As a scoring validation operator, validate Cold-start novelty boost (N4) against the documented validation surface. Verify novelty boost contribution is zero in telemetry; code path shows novelty removed from hot scoring path. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Novelty boost contribution is zero in telemetry; code path shows novelty removed from hot scoring path
- Pass/fail: PASS: Novelty contribution fixed to 0 in all search results; no hot-path novelty computation; FAIL: Non-zero novelty in telemetry or hot-path code still active

---

## 3. TEST EXECUTION

### Prompt

```
As a scoring validation operator, confirm novelty removed from hot path against the documented validation surface. Verify novelty boost contribution is zero in telemetry; code path shows novelty removed from hot scoring path. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Inspect code path
2. Run search
3. Verify telemetry fixed to zero

### Expected

Novelty boost contribution is zero in telemetry; code path shows novelty removed from hot scoring path

### Evidence

Search telemetry output showing novelty=0 + code path inspection confirming removal

### Pass / Fail

- **Pass**: Novelty contribution fixed to 0 in all search results; no hot-path novelty computation
- **Fail**: Non-zero novelty in telemetry or hot-path code still active

### Failure Triage

Verify novelty removal commit → Check telemetry field mapping → Inspect feature flag state for novelty

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [11--scoring-and-calibration/_deprecated/02-cold-start-novelty-boost.md](../../feature_catalog/11--scoring-and-calibration/_deprecated/02-cold-start-novelty-boost.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 024
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/_deprecated/024-cold-start-novelty-boost-n4.md`
