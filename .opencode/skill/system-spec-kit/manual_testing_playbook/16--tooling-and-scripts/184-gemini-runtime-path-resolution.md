---
title: "M-011 -- Gemini Runtime Path Resolution"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-011`."
---

# M-011 -- Gemini Runtime Path Resolution

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-011`.

---

## 2. SCENARIO CONTRACT


- Objective: This snippet preserves the canonical memory/spec-kit operator workflow for `M-011`.
- Real user request: `` Please validate Gemini Runtime Path Resolution against the documented validation surface and tell me whether the expected signals are present: `ls -d .gemini` returns `.agents`; basename diff is empty; resolved count is `9`. ``
- RCAF Prompt: `As a tooling validation operator, validate Gemini Runtime Path Resolution against the documented validation surface. Verify ls -d .gemini returns .agents; basename diff is empty; resolved count is 9. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `ls -d .gemini` returns `.agents`; basename diff is empty; resolved count is `9`
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: symlink target, resolved file set, and count all match.

---

## 3. TEST EXECUTION

### Prompt

`As a tooling validation operator, validate Gemini Runtime Path Resolution against the documented validation surface. Verify ls -d .gemini returns .agents; basename diff is empty; resolved count is 9. Return a concise pass/fail verdict with the main reason and cited evidence.`
### Commands

```bash
  test -d .gemini
  ls -d .gemini
  diff -u <(find -L .gemini/agents -maxdepth 1 -type f -name '*.md' -exec basename {} \; | sort) <(find .agents/agents -maxdepth 1 -type f -name '*.md' -exec basename {} \; | sort)
  find -L .gemini/agents -maxdepth 1 -type f -name '*.md' | wc -l
  ```
### Expected

`ls -d .gemini` returns `.agents`; basename diff is empty; resolved count is `9`.
### Evidence

readlink output, diff output (empty on pass), and file count.
### Pass/Fail

symlink target, resolved file set, and count all match.
### Failure Triage

symlink missing, target mismatch, or file set divergence; collect evidence and identify root cause.

---

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/14-source-dist-alignment-enforcement.md](../../feature_catalog/16--tooling-and-scripts/14-source-dist-alignment-enforcement.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: M-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/184-gemini-runtime-path-resolution.md`
