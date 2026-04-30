---
title: "M-009 -- Runtime Family Count Census"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-009`."
---

# M-009 -- Runtime Family Count Census

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-009`.

---

## 2. SCENARIO CONTRACT


- Objective: This snippet preserves the canonical memory/spec-kit operator workflow for `M-009`.
- Real user request: `` Please validate Runtime Family Count Census against the documented validation surface and tell me whether the expected signals are present: all four commands return `9`. ``
- RCAF Prompt: `As a tooling validation operator, validate Runtime Family Count Census against the documented validation surface. Verify all four commands return 9. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: all four commands return `9`
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: every family count is `9`.

---

## 3. TEST EXECUTION

### Prompt

`As a tooling validation operator, validate Runtime Family Count Census against the documented validation surface. Verify all four commands return 9. Return a concise pass/fail verdict with the main reason and cited evidence.`
### Commands

```bash
  find .opencode/agent -maxdepth 1 -type f -name '*.md' | wc -l
  find .claude/agents -maxdepth 1 -type f -name '*.md' | wc -l
  find .codex/agents -maxdepth 1 -type f -name '*.toml' | wc -l
  find -L .gemini/agents -maxdepth 1 -type f -name '*.md' | wc -l
  ```
### Expected

all four commands return `9`.
### Evidence

command output showing each family count.
### Pass/Fail

every family count is `9`.
### Failure Triage

any family missing files or has extras; collect counts and identify discrepancy.

---

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/14-source-dist-alignment-enforcement.md](../../feature_catalog/16--tooling-and-scripts/14-source-dist-alignment-enforcement.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: M-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/182-runtime-family-count-census.md`
