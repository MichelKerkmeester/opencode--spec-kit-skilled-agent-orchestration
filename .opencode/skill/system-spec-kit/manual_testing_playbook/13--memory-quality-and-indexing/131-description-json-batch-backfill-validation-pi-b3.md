---
title: "131 -- Description.json batch backfill validation (PI-B3)"
description: "This scenario validates Description.json batch backfill validation (PI-B3) for `131`. It focuses on Confirm batch-generated folder descriptions exist and conform to schema."
---

# 131 -- Description.json batch backfill validation (PI-B3)

## 1. OVERVIEW

This scenario validates Description.json batch backfill validation (PI-B3) for `131`. It focuses on Confirm batch-generated folder descriptions exist and conform to schema.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `131` and confirm the expected signals without contradicting evidence.

- Objective: Confirm batch-generated folder descriptions exist and conform to schema
- Prompt: `Validate PI-B3 batch backfill results. Capture the evidence needed to prove Description.json coverage stays in parity with the current active spec inventory; all JSON files parse without syntax errors; C1 field-type checks pass with specId string, parentChain array of strings, and memorySequence number; schema fields are present at varying depths; per-folder files preferred over spec.md fallback. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Description.json coverage stays in parity with the current active spec inventory; all JSON files parse without syntax errors; C1 field-type checks pass with `specId` string, `parentChain` array of strings, and `memorySequence` number; schema fields are present at varying depths; per-folder files preferred over spec.md fallback
- Pass/fail: PASS if description.json coverage matches the active spec inventory, every description.json is valid JSON, C1 field-type checks pass, and per-folder generation is preferred over spec.md fallback

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 131 | Description.json batch backfill validation (PI-B3) | Confirm batch-generated folder descriptions exist and conform to schema | `Validate PI-B3 batch backfill results. Capture the evidence needed to prove Description.json coverage stays in parity with the current active spec inventory; all JSON files parse without syntax errors; C1 field-type checks pass with specId string, parentChain array of strings, and memorySequence number; schema fields are present at varying depths; per-folder files preferred over spec.md fallback. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Count spec folders with spec.md 2) Count description.json files — expect parity with the current active spec inventory 3) Validate JSON syntax of all files 4) Run explicit C1 conformance checks: `specId` is string, `parentChain` is array of strings, and `memorySequence` is number 5) Spot-check schema fields at depth 1, 3, 5+ 6) Run generateFolderDescriptions → verify per-folder files preferred over spec.md | Description.json coverage stays in parity with the current active spec inventory; all JSON files parse without syntax errors; C1 field-type checks pass with `specId` string, `parentChain` array of strings, and `memorySequence` number; schema fields are present at varying depths; per-folder files preferred over spec.md fallback | Folder count comparison showing `spec.md`/`description.json` parity + JSON syntax validation results + explicit C1 schema checklist evidence + schema field spot-check evidence | PASS if description.json coverage matches the active spec inventory, every description.json is valid JSON, C1 field-type checks pass, and per-folder generation is preferred over spec.md fallback | Verify generateFolderDescriptions covers the current spec inventory → Check JSON schema validation and C1 field-type rules → Inspect per-folder vs spec.md preference logic |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/04-spec-folder-description-discovery.md](../../feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 131
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/131-description-json-batch-backfill-validation-pi-b3.md`
