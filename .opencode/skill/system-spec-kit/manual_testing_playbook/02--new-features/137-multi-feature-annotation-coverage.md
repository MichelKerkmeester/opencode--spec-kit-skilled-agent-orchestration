---
title: "NEW-137 -- Multi-feature annotation coverage"
description: "This scenario validates Multi-feature annotation coverage for `NEW-137`. It focuses on Verify known multi-feature files have annotation count >= 2."
---

# NEW-137 -- Multi-feature annotation coverage

## 1. OVERVIEW

This scenario validates Multi-feature annotation coverage for `NEW-137`. It focuses on Verify known multi-feature files have annotation count >= 2.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-137` and confirm the expected signals without contradicting evidence.

- Objective: Verify known multi-feature files have annotation count >= 2
- Prompt: `Validate multi-feature files carry all applicable annotations.`
- Expected signals: All known multi-feature files carry >= 2 annotations; annotations are semantically appropriate
- Pass/fail: PASS if all checked multi-feature files have >= 2 annotations and no obviously-missing features

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-137 | Multi-feature annotation coverage | Verify known multi-feature files have annotation count >= 2 | `Validate multi-feature files carry all applicable annotations.` | 1) Identify files known to implement 2+ features (e.g., `handlers/memory-save.ts`, `handlers/memory-search.ts`, `handlers/memory-crud-delete.ts`) 2) For each: count `// Feature catalog:` lines 3) Verify count >= 2 for each multi-feature file 4) Spot-check that listed features are semantically correct for the file's implementation | All known multi-feature files carry >= 2 annotations; annotations are semantically appropriate | File list with annotation counts + sample content verification | PASS if all checked multi-feature files have >= 2 annotations and no obviously-missing features | Review file implementation scope → Compare against catalog feature boundaries → Add missing annotations |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/11-feature-catalog-code-references.md](../../feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-137
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/137-multi-feature-annotation-coverage.md`
