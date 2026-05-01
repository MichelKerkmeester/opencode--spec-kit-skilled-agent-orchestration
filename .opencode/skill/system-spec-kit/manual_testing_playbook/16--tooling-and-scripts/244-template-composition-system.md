---
title: "244 -- Template Composition System"
description: "This scenario validates Level-based packet generation and vocabulary invariance for the current template flow."
---

# 244 -- Template Composition System

## 1. OVERVIEW

This scenario validates template composition system for `244`. It focuses on confirming that the current Level-based generation path creates valid packets and that public surfaces keep Level vocabulary.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm Level 1, Level 2, Level 3, Level 3+, and phase-parent packet generation plus strict validation.
- Real user request: `Please validate the Template Composition System by scaffolding one packet for each supported Level, validating each packet strictly, and running the workflow-invariance test. Tell me whether every generated packet is valid and whether public docs stayed on Level vocabulary.`
- RCAF Prompt: `As a tooling validation operator, scaffold one packet for each supported Level, validate each packet with strict mode, run the workflow-invariance test, and return a concise pass/fail verdict with cited command evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: every scaffold command exits 0, every strict validation exits 0, and the workflow-invariance test exits 0
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all generated packets validate and the vocabulary-invariance test is green.

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, scaffold one packet for each supported Level, validate each packet with strict mode, run the workflow-invariance test, and return a concise pass/fail verdict with cited command evidence.
```

### Commands

1. `TMPDIR=$(mktemp -d)`
2. `bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --level 1 --path "$TMPDIR/test-1" --name "test-1"`
3. `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "$TMPDIR/test-1" --strict`
4. `bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --level 2 --path "$TMPDIR/test-2" --name "test-2"`
5. `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "$TMPDIR/test-2" --strict`
6. `bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --level 3 --path "$TMPDIR/test-3" --name "test-3"`
7. `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "$TMPDIR/test-3" --strict`
8. `bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --level 3+ --path "$TMPDIR/test-3-plus" --name "test-3-plus"`
9. `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "$TMPDIR/test-3-plus" --strict`
10. `bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --level phase-parent --path "$TMPDIR/test-phase-parent" --name "test-phase-parent"`
11. `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "$TMPDIR/test-phase-parent" --strict`
12. `pnpm vitest run .opencode/skill/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts`
13. `rm -rf "$TMPDIR"`

### Expected

Every create and validate command exits 0, and the workflow-invariance test exits 0.

### Evidence

Command transcript for each scaffold, strict validation, and invariance run.

### Pass / Fail

- **Pass**: all generated Level packets validate and public vocabulary invariance remains green
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect the Level contract resolver, inline gate renderer, scaffolder output, and the first failing validator message.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/30-template-composition-system.md](../../feature_catalog/16--tooling-and-scripts/30-template-composition-system.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 244
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/244-template-composition-system.md`
