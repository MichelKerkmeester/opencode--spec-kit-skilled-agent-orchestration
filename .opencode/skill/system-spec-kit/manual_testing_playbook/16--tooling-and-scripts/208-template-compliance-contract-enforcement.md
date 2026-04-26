---
title: "208 -- Template Compliance Contract Enforcement"
description: "This scenario validates Template Compliance Contract Enforcement for `208`. It focuses on confirming the 3-layer contract prevents non-compliant spec documents from passing strict validation."
---

# 208 -- Template Compliance Contract Enforcement

## 1. OVERVIEW

This scenario validates Template Compliance Contract Enforcement for `208`. It focuses on confirming the 3-layer contract prevents non-compliant spec documents from passing strict validation.

---

## 2. SCENARIO CONTRACT

Operators verify the shared contract reference and embedded spec-authoring runtime contracts are in sync, then run strict validation against compliant and non-compliant fixtures to confirm structural violations and content-minimum guardrails are caught with actionable output.

- Objective: Confirm the 3-layer template compliance contract blocks non-compliant spec documents
- Prompt: `As a tooling validation operator, validate Template Compliance Contract Enforcement against references/validation/template_compliance_contract.md. Verify the 3-layer template compliance contract blocks non-compliant spec documents. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: the canonical contract exists in the shared reference and embedded spec-authoring runtime definitions; compliant fixtures pass `validate.sh --strict`; warning-only template drift fails in strict mode; missing or reordered required sections fail with targeted validator output; section-count minimum checks are present in the enforcement surface
- Pass/fail: PASS if contract presence is confirmed, compliant fixtures pass strict validation, and non-compliant fixtures fail for the expected structural reasons

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, confirm the 3-layer template compliance contract blocks non-compliant spec documents against references/validation/template_compliance_contract.md. Verify the canonical contract exists in the shared reference and embedded spec-authoring runtime definitions; compliant fixtures pass validate.sh --strict; warning-only template drift fails in strict mode; missing or reordered required sections fail with targeted validator output; section-count minimum checks are present in the enforcement surface. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. inspect `references/validation/template_compliance_contract.md` and the five CLI `distributed-governance spec authoring` agent definitions to confirm the compact contract is embedded
2. run strict validation on the compliant fixture path and capture exit code 0
3. run strict validation on the extra-header fixture and confirm warning-only drift is promoted to failure in strict mode
4. run strict validation on the missing-header and reordered-anchor fixtures and capture the targeted failure output
5. run the extended validation coverage and confirm SECTION_COUNTS remains part of the validator surface

### Expected

the canonical contract exists in the shared reference and embedded spec-authoring runtime definitions; compliant fixtures pass `validate.sh --strict`; warning-only template drift fails in strict mode; missing or reordered required sections fail with targeted validator output; section-count minimum checks are present in the enforcement surface

### Evidence

Contract-reference excerpts + agent-definition excerpts + strict-validation outputs for compliant and failing fixtures + extended validation output showing SECTION_COUNTS coverage

### Pass / Fail

- **Pass**: contract presence is confirmed, compliant fixtures pass strict validation, and non-compliant fixtures fail for the expected structural reasons
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `references/validation/template_compliance_contract.md`, `.codex/agents/speckit.toml`, `scripts/spec/validate.sh`, and `scripts/tests/test-validation-extended.sh` if strict validation passes broken fixtures or misses contract drift

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/18-template-compliance-contract-enforcement.md](../../feature_catalog/16--tooling-and-scripts/18-template-compliance-contract-enforcement.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 208
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/208-template-compliance-contract-enforcement.md`
