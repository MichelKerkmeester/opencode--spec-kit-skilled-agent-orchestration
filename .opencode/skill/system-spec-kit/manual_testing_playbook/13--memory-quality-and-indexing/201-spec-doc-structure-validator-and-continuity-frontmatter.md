---
title: "201 -- Spec-doc structure validator and continuity frontmatter"
description: "This scenario validates the phase 018 spec-doc structure validator for `201`. It focuses on the five fail-closed rules and the thin `_memory.continuity` block."
audited_post_018: true
---

# 201 -- Spec-doc structure validator and continuity frontmatter

## 1. OVERVIEW

This scenario validates the phase 018 spec-doc structure validator for `201`. It focuses on the five fail-closed rules and the thin `_memory.continuity` block.

## 2. SCENARIO CONTRACT


- Objective: Verify the five-rule validator bridge and continuity block enforcement.
- Real user request: `` Please validate Spec-doc structure validator and continuity frontmatter against _memory.continuity and tell me whether the expected signals are present: five named rules execute in order; malformed `_memory.continuity` fails closed; valid docs pass cleanly. ``
- RCAF Prompt: `As a spec-doc record-quality validation operator, validate Spec-doc structure validator and continuity frontmatter against _memory.continuity. Verify the five-rule validator bridge and continuity block enforcement. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: five named rules execute in order; malformed `_memory.continuity` fails closed; valid docs pass cleanly
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the five rules run in order and malformed continuity/frontmatter state fails closed; FAIL if a rule is skipped or invalid continuity state is accepted

---

## 3. TEST EXECUTION

### Prompt

```
As a spec-doc record-quality validation operator, verify the five-rule validator bridge and continuity block enforcement against _memory.continuity. Verify five named rules execute in order; malformed _memory.continuity fails closed; valid docs pass cleanly. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Create or pick a spec doc with a deliberately malformed `_memory.continuity` block
2. Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict <target-spec>`
3. Confirm the five rules appear in the expected order
4. Repair the continuity block and rerun
5. Confirm the document passes cleanly

### Expected

Five named rules execute in order; malformed `_memory.continuity` fails closed; valid docs pass cleanly

### Evidence

Validator output from the malformed and repaired runs

### Pass / Fail

- **Pass**: the five rules run in order and malformed continuity/frontmatter state fails closed
- **Fail**: a rule is skipped or invalid continuity state is accepted

### Failure Triage

Inspect `mcp_server/lib/validation/spec-doc-structure.ts` rule dispatch, validate.sh aliases, and the continuity block renderer

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [13--memory-quality-and-indexing/26-spec-doc-structure-validator.md](../../feature_catalog/13--memory-quality-and-indexing/26-spec-doc-structure-validator.md)
- Source files: `mcp_server/lib/validation/spec-doc-structure.ts`, `scripts/spec/validate.sh`

## 5. SOURCE METADATA

- Group: Memory quality and indexing
- Playbook ID: 201
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `13--memory-quality-and-indexing/201-spec-doc-structure-validator-and-continuity-frontmatter.md`
