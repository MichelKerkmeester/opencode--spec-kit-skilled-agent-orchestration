---
title: "136 -- Feature catalog annotation name validity"
description: "This scenario validates Feature catalog annotation name validity for `136`. It focuses on Verify all annotation names cross-reference against catalog H3 headings with 0 invalid."
---

# 136 -- Feature catalog annotation name validity

## 1. OVERVIEW

This scenario validates Feature catalog annotation name validity for `136`. It focuses on Verify all annotation names cross-reference against catalog H3 headings with 0 invalid.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `136` and confirm the expected signals without contradicting evidence.

- Objective: Verify all annotation names cross-reference against catalog H3 headings with 0 invalid
- Prompt: `Validate all Feature catalog annotation names against catalog. Capture the evidence needed to prove sort -u 2) Extract all H3 headings from feature_catalog/FEATURE_CATALOG.md: grep "^### " FEATURE_CATALOG.md 3) Cross-reference: every annotation name must match an H3 heading exactly 4) Report any mismatches. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: sort -u` 2) Extract all H3 headings from `feature_catalog/FEATURE_CATALOG.md`: `grep "^### " FEATURE_CATALOG.md` 3) Cross-reference: every annotation name must match an H3 heading exactly 4) Report any mismatches
- Pass/fail: Sorted annotation list + H3 heading list + diff showing 0 invalid entries

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 136 | Feature catalog annotation name validity | Verify all annotation names cross-reference against catalog H3 headings with 0 invalid | `Validate all Feature catalog annotation names against catalog. Capture the evidence needed to prove sort -u 2) Extract all H3 headings from feature_catalog/FEATURE_CATALOG.md: grep "^### " FEATURE_CATALOG.md 3) Cross-reference: every annotation name must match an H3 heading exactly 4) Report any mismatches. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Extract all unique annotation names: `grep -rho "// Feature catalog: .*" .opencode/skill/system-spec-kit/mcp_server/ .opencode/skill/system-spec-kit/shared/ \ | sort -u` 2) Extract all H3 headings from `feature_catalog/FEATURE_CATALOG.md`: `grep "^### " FEATURE_CATALOG.md` 3) Cross-reference: every annotation name must match an H3 heading exactly 4) Report any mismatches | 0 invalid annotation names; every `// Feature catalog:` value matches an H3 heading in the catalog | Sorted annotation list + H3 heading list + diff showing 0 invalid entries | PASS if cross-reference produces 0 mismatches |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/11-feature-catalog-code-references.md](../../feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 136
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/136-feature-catalog-annotation-name-validity.md`
