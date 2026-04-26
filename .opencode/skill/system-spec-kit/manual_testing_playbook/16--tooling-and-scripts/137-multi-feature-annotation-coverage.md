---
title: "137 -- Multi-feature annotation coverage"
description: "This scenario validates Multi-feature annotation coverage for `137`. It focuses on Verify known multi-feature files have annotation count >= 2."
---

# 137 -- Multi-feature annotation coverage

## 1. OVERVIEW

This scenario validates Multi-feature annotation coverage for `137`. It focuses on Verify known multi-feature files have annotation count >= 2.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `137` and confirm the expected signals without contradicting evidence.

- Objective: Verify known multi-feature files have annotation count >= 2
- Prompt: `As a tooling validation operator, validate Multi-feature annotation coverage against handlers/memory-save.ts. Verify known multi-feature files have annotation count >= 2. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: All known multi-feature files carry >= 2 annotations; annotations are semantically appropriate
- Pass/fail: PASS if all checked multi-feature files have >= 2 annotations and no obviously-missing features

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, verify known multi-feature files have annotation count >= 2 against handlers/memory-save.ts. Verify all known multi-feature files carry >= 2 annotations; annotations are semantically appropriate. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Identify files known to implement 2+ features (e.g., `handlers/memory-save.ts`, `handlers/memory-search.ts`, `handlers/memory-crud-delete.ts`)
2. For each: count `// Feature catalog:` lines
3. Verify count >= 2 for each multi-feature file
4. Spot-check that listed features are semantically correct for the file's implementation

### Expected

All known multi-feature files carry >= 2 annotations; annotations are semantically appropriate

### Evidence

File list with annotation counts + sample content verification

### Pass / Fail

- **Pass**: all checked multi-feature files have >= 2 annotations and no obviously-missing features
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Review file implementation scope → Compare against catalog feature boundaries → Add missing annotations

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/11-feature-catalog-code-references.md](../../feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 137
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/137-multi-feature-annotation-coverage.md`
