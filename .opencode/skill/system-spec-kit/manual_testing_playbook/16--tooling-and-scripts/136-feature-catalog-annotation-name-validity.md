---
title: "136 -- Feature catalog annotation name validity"
description: "This scenario validates Feature catalog annotation name validity for `136`. It focuses on Verify all annotation names cross-reference against catalog H3 headings with 0 invalid."
---

# 136 -- Feature catalog annotation name validity

## 1. OVERVIEW

This scenario validates Feature catalog annotation name validity for `136`. It focuses on Verify all annotation names cross-reference against catalog H3 headings with 0 invalid.

---

## 2. SCENARIO CONTRACT


- Objective: Verify all annotation names cross-reference against catalog H3 headings with 0 invalid.
- Real user request: `` Please validate Feature catalog annotation name validity against the documented validation surface and tell me whether the expected signals are present: sort -u` 2) Extract all H3 headings from `feature_catalog/FEATURE_CATALOG.md`: `grep "^### " FEATURE_CATALOG.md` 3) Cross-reference: every annotation name must match an H3 heading exactly 4) Report any mismatches. ``
- RCAF Prompt: `As a tooling validation operator, validate Feature catalog annotation name validity against the documented validation surface. Verify all annotation names cross-reference against catalog H3 headings with 0 invalid. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: sort -u` 2) Extract all H3 headings from `feature_catalog/FEATURE_CATALOG.md`: `grep "^### " FEATURE_CATALOG.md` 3) Cross-reference: every annotation name must match an H3 heading exactly 4) Report any mismatches
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: Sorted annotation list + H3 heading list + diff showing 0 invalid entries

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, verify all annotation names cross-reference against catalog H3 headings with 0 invalid against the documented validation surface. Extract the annotation names, compare them with the H3 headings from `feature_catalog/FEATURE_CATALOG.md`, report any mismatches, and return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Extract all unique annotation names: `grep -rho "// Feature catalog: .*" .opencode/skill/system-spec-kit/mcp_server/ .opencode/skill/system-spec-kit/shared/ | sort -u`
2. Extract all H3 headings from `feature_catalog/FEATURE_CATALOG.md`: `grep "^### " FEATURE_CATALOG.md`
3. Cross-reference: every annotation name must match an H3 heading exactly
4. Report any mismatches

### Expected

0 invalid annotation names; every `// Feature catalog:` value matches an H3 heading in the catalog.

### Evidence

Sorted annotation list + H3 heading list + diff showing 0 invalid entries.

### Pass / Fail

- **Pass**: cross-reference produces 0 mismatches
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect the extracted annotation comments and the catalog H3 headings if any names fail to match exactly.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/11-feature-catalog-code-references.md](../../feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 136
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/136-feature-catalog-annotation-name-validity.md`
