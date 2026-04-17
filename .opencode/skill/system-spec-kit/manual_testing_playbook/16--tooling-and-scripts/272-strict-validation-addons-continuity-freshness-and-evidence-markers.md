---
title: "272 -- Strict validation add-ons: continuity freshness and evidence markers"
description: "This scenario validates the Phase 017 strict-validation add-ons for `272`. It focuses on proving strict validation now enforces continuity freshness, evidence-marker lint, and the normalizer guardrail."
---

# 272 -- Strict validation add-ons: continuity freshness and evidence markers

## 1. OVERVIEW

This scenario validates the Phase 017 strict-validation add-ons for `272`. It focuses on proving strict validation now enforces continuity freshness, evidence-marker lint, and the normalizer guardrail.

---

## 2. CURRENT REALITY

- Objective: Verify `validate.sh --strict` now runs continuity-freshness, evidence-marker lint, and the normalizer lint guardrail, while the audit script remains the repair sweep
- Prompt: `As a tooling validation operator, validate Strict validation add-ons: continuity freshness and evidence markers against validate.sh --strict. Verify stale _memory.continuity timestamps surface through the continuity-freshness script, malformed evidence markers fail through the strict lint wrapper, duplicate normalizeScope helpers fail through the normalizer lint rule, and the standalone audit script remains available for repair sweeps. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: strict validation fails or warns for stale continuity and malformed evidence markers; duplicate normalizers are rejected; the audit script reports structural marker findings without pretending to be the strict gate
- Pass/fail: PASS if the new strict add-ons enforce the documented failure surfaces and the audit script still behaves like the repair tool

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, validate the strict-validation add-ons against validate.sh --strict. Verify stale _memory.continuity timestamps surface through continuity-freshness, malformed evidence markers fail through the strict lint wrapper, duplicate normalizeScope helpers fail through the normalizer lint rule, and the standalone audit script remains available for repair sweeps. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Run a fixture or packet case that triggers continuity-freshness
2. Run a malformed evidence-marker case through `validate.sh --strict`
3. Run a duplicate-normalizer fixture through the normalizer lint path
4. Run `scripts/validation/evidence-marker-audit.ts` on the same malformed evidence case and capture its report behavior

### Expected

Strict validation surfaces the continuity, evidence-marker, and duplicate-normalizer failures; the audit script reports marker issues for repair use

### Evidence

Strict validation transcripts plus the standalone audit script output

### Pass / Fail

- **Pass**: the strict add-ons enforce the documented failure surfaces and the audit script still behaves like the repair tool
- **Fail**: one of the strict checks is missing or the audit script is incorrectly treated as the gate

### Failure Triage

Inspect `scripts/spec/validate.sh`, `scripts/validation/continuity-freshness.ts`, `scripts/validation/evidence-marker-lint.ts`, `scripts/validation/evidence-marker-audit.ts`, and `scripts/rules/check-normalizer-lint.sh`

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/35-strict-validation-addons-continuity-freshness-and-evidence-markers.md](../../feature_catalog/16--tooling-and-scripts/35-strict-validation-addons-continuity-freshness-and-evidence-markers.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 272
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/272-strict-validation-addons-continuity-freshness-and-evidence-markers.md`
