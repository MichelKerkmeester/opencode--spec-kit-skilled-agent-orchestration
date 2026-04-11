---
title: "201 -- Spec-doc structure validator and continuity frontmatter"
description: "This scenario validates the phase 018 spec-doc structure validator for `201`. It focuses on the five fail-closed rules and the thin `_memory.continuity` block."
audited_post_018: true
---

# 201 -- Spec-doc structure validator and continuity frontmatter

## 1. OVERVIEW

This scenario validates the phase 018 spec-doc structure validator for `201`. It focuses on the five fail-closed rules and the thin `_memory.continuity` block.

## 2. CURRENT REALITY

Operators run the validator against a real spec doc and confirm the phase-018 rule surface rejects malformed continuity/frontmatter state before the doc can be accepted.

- Objective: Verify the five-rule validator bridge and continuity block enforcement
- Prompt: `Validate spec-doc structure validator behavior. Capture evidence that validate.sh --strict runs FRONTMATTER_MEMORY_BLOCK, MERGE_LEGALITY, SPEC_DOC_SUFFICIENCY, CROSS_ANCHOR_CONTAMINATION, and POST_SAVE_FINGERPRINT in the documented order; malformed _memory.continuity blocks fail closed; and valid spec docs pass cleanly. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: five named rules execute in order; malformed `_memory.continuity` fails closed; valid docs pass cleanly
- Pass/fail: PASS if the five rules run in order and malformed continuity/frontmatter state fails closed; FAIL if a rule is skipped or invalid continuity state is accepted

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 201 | Spec-doc structure validator and continuity frontmatter | Verify the five-rule validator bridge and continuity block enforcement | `Validate spec-doc structure validator behavior. Capture evidence that validate.sh --strict runs FRONTMATTER_MEMORY_BLOCK, MERGE_LEGALITY, SPEC_DOC_SUFFICIENCY, CROSS_ANCHOR_CONTAMINATION, and POST_SAVE_FINGERPRINT in the documented order; malformed _memory.continuity blocks fail closed; and valid spec docs pass cleanly. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create or pick a spec doc with a deliberately malformed `_memory.continuity` block 2) Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict <target-spec>` 3) Confirm the five rules appear in the expected order 4) Repair the continuity block and rerun 5) Confirm the document passes cleanly | Five named rules execute in order; malformed `_memory.continuity` fails closed; valid docs pass cleanly | Validator output from the malformed and repaired runs | PASS if the five rules run in order and malformed continuity/frontmatter state fails closed; FAIL if a rule is skipped or invalid continuity state is accepted | Inspect `mcp_server/lib/validation/spec-doc-structure.ts` rule dispatch, validate.sh aliases, and the continuity block renderer |

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/26-spec-doc-structure-validator.md](../../feature_catalog/13--memory-quality-and-indexing/26-spec-doc-structure-validator.md)
- Source files: `mcp_server/lib/validation/spec-doc-structure.ts`, `scripts/spec/validate.sh`

## 5. SOURCE METADATA

- Group: Memory quality and indexing
- Playbook ID: 201
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/201-spec-doc-structure-validator-and-continuity-frontmatter.md`
