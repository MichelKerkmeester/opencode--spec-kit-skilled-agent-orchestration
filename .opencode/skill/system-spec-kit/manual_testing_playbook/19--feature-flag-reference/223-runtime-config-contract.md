---
title: "223 -- Runtime Config Contract"
description: "This scenario validates Runtime Config Contract for `223`. It focuses on confirming the runtime loader consumes only the active Section 1 keys, validates and normalizes configured values, and leaves documentation-only sections non-binding."
---

# 223 -- Runtime Config Contract

## 1. OVERVIEW

This scenario validates Runtime Config Contract for `223`. It focuses on confirming the runtime loader consumes only the active Section 1 keys, validates and normalizes configured values, and leaves documentation-only sections non-binding.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `223` and confirm the expected signals without contradicting evidence.

- Objective: confirming the runtime loader consumes only the active Section 1 keys, validates and normalizes configured values, and leaves documentation-only sections non-binding
- Prompt: `Validate the runtime config contract for config.jsonc in a disposable copy of the file. Prove that Section 1 keys flow into the loaded runtime constants, invalid values warn and fall back or normalize safely, and deeper documentation-only sections do not become binding runtime controls through the core loader.`
- Expected signals: valid Section 1 keys such as `maxResultPreview` and `timezoneOffsetHours` appear in the loaded runtime config; invalid numeric values fall back with warnings; legacy `qualityAbortThreshold` values on the `1..100` scale normalize into `0.0..1.0`; empty, missing, or invalid JSONC does not crash the loader; documentation-only sections remain descriptive and do not show up as newly bound core runtime controls
- Pass/fail: PASS if the loader only binds the active top-level workflow keys, safely validates or normalizes bad input, and treats the deeper JSONC sections as reference-only metadata

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 223 | Runtime Config Contract | Confirm the runtime loader consumes only the active Section 1 keys, validates and normalizes configured values, and leaves documentation-only sections non-binding | `Validate the runtime config contract for config.jsonc in a disposable copy of the file. Prove that Section 1 keys flow into the loaded runtime constants, invalid values warn and fall back or normalize safely, and deeper documentation-only sections do not become binding runtime controls through the core loader.` | 1) Copy `config/config.jsonc` into a disposable sandbox and set distinctive Section 1 overrides such as `maxResultPreview` and `timezoneOffsetHours`, while also flipping booleans in documentation-only sections like `semanticSearch.enabled` or `constitutionalTier.enabled`. 2) Load the runtime config through the script-side loader and capture the resulting `CONFIG` or `STATIC_CONFIG` values to confirm the Section 1 overrides are reflected in the exported runtime constants. 3) Change Section 1 values to invalid inputs such as `timezoneOffsetHours: 99` and a legacy `qualityAbortThreshold: 75`, reload the config, and capture the warning logs plus the normalized or defaulted runtime values. 4) Replace the sandbox file with malformed or unreadable JSONC, reload again, and confirm the loader logs a warning and falls back to defaults instead of throwing. 5) Compare the resulting runtime surface across runs and confirm the flipped documentation-only sections did not become newly bound core loader outputs or override the Section 1 contract. | valid Section 1 keys such as `maxResultPreview` and `timezoneOffsetHours` appear in the loaded runtime config; invalid numeric values fall back with warnings; legacy `qualityAbortThreshold` values on the `1..100` scale normalize into `0.0..1.0`; empty, missing, or invalid JSONC does not crash the loader; documentation-only sections remain descriptive and do not show up as newly bound core runtime controls | sandbox copies of `config.jsonc`, captured runtime config output for each load, warning logs for invalid or malformed config, and a short before or after comparison showing which keys actually changed | PASS if the loader only binds the active top-level workflow keys, safely validates or normalizes bad input, and treats the deeper JSONC sections as reference-only metadata | Inspect `scripts/core/config.ts` merge and validation flow, confirm the test run is loading the intended sandbox file, and verify any observed behavior change is not coming from a different runtime path outside the core config loader |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [19--feature-flag-reference/09-runtime-config-contract.md](../../feature_catalog/19--feature-flag-reference/09-runtime-config-contract.md)

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: 223
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `19--feature-flag-reference/223-runtime-config-contract.md`
