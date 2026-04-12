---
title: "242 -- Spec-Folder Detection and Description Metadata"
description: "This scenario validates spec-folder detection and description metadata for `242`. It focuses on confirming folder detection, alignment validation, subfolder resolution, and description generation."
---

# 242 -- Spec-Folder Detection and Description Metadata

## 1. OVERVIEW

This scenario validates spec-folder detection and description metadata for `242`. It focuses on confirming folder detection, alignment validation, subfolder resolution, and description generation.

---

## 2. CURRENT REALITY

Operators validate the folder-selection and metadata surface through the functional detector tests, alignment tests, subfolder resolution coverage, and one explicit description-generation refresh against a live spec path.

- Objective: Confirm folder detection, alignment safety, subfolder resolution, and description generation
- Prompt: `As a tooling validation operator, validate Spec-Folder Detection and Description Metadata against cd .opencode/skill/system-spec-kit/scripts && node tests/test-folder-detector-functional.js. Verify folder detection, alignment safety, subfolder resolution, and description generation. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: folder-detector and alignment tests pass; subfolder resolution test passes; description generation completes without path-safety errors
- Pass/fail: PASS if the detection, alignment, and description-refresh surfaces all behave as documented

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, confirm folder detection, alignment safety, subfolder resolution, and description generation against cd .opencode/skill/system-spec-kit/scripts && node tests/test-folder-detector-functional.js. Verify functional tests pass; subfolder resolution stays green; description generation completes for the explicit spec path without traversal or alignment failure. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skill/system-spec-kit/scripts && node tests/test-folder-detector-functional.js`
2. `cd .opencode/skill/system-spec-kit/scripts && node tests/test-alignment-validator.js`
3. `cd .opencode/skill/system-spec-kit/scripts && node tests/test-subfolder-resolution.js`
4. `npx tsx .opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts .opencode/specs/system-spec-kit/022-hybrid-rag-fusion .opencode/specs --description "Manual scenario description"`

### Expected

Functional tests pass; subfolder resolution stays green; description generation completes for the explicit spec path without traversal or alignment failure

### Evidence

JS test transcripts and the updated `description.json` output or timestamp under the target spec folder

### Pass / Fail

- **Pass**: all three test scripts pass and the explicit description refresh succeeds
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `scripts/spec-folder/folder-detector.ts`, `alignment-validator.ts`, `directory-setup.ts`, and `generate-description.ts` if a path cannot be resolved or description generation fails

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/28-spec-folder-detection-and-description.md](../../feature_catalog/16--tooling-and-scripts/28-spec-folder-detection-and-description.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 242
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/242-spec-folder-detection-and-description.md`
