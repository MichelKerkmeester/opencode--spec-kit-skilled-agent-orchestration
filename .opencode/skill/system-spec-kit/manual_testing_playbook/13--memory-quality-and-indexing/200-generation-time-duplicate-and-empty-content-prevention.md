---
title: "200 -- Generation-time duplicate and empty content prevention"
description: "This scenario validates Generation-time duplicate and empty content prevention for `200`. It focuses on verifying that template-only and exact-duplicate memories are rejected before the atomic write step."
---

# 200 -- Generation-time duplicate and empty content prevention

## 1. OVERVIEW

This scenario validates Generation-time duplicate and empty content prevention for `200`. It focuses on verifying that template-only and exact-duplicate memories are rejected before the atomic write step.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `200` and confirm the expected signals without contradicting evidence.

- Objective: Verify pre-write gates reject template-only content and exact duplicate content before any final memory file is written
- Prompt: `Validate generation-time duplicate and empty content prevention. Capture the evidence needed to prove template-only or insubstantial content is rejected before atomic write; exact duplicate content is rejected by content hash before write promotion; descriptive validation errors identify the failing gate; and no final memory file is created for either rejected case. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Empty-content validation strips frontmatter/comments/empty structure before measuring substance; insubstantial content below threshold is rejected; SHA-256 duplicate detection rejects exact-match content in the target memory directory; failures stop the save before atomic write/promotion; descriptive errors identify the specific gate
- Pass/fail: PASS if both insubstantial and duplicate saves fail before final write with the expected reason; FAIL if blank/template content is persisted, duplicates are saved, or rejection happens only after the write step

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 200 | Generation-time duplicate and empty content prevention | Verify pre-write gates reject template-only content and exact duplicate content before any final memory file is written | `Validate generation-time duplicate and empty content prevention. Capture the evidence needed to prove template-only or insubstantial content is rejected before atomic write; exact duplicate content is rejected by content hash before write promotion; descriptive validation errors identify the failing gate; and no final memory file is created for either rejected case. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Attempt a memory save whose body contains mostly template/frontmatter/comments with little or no substantive content 2) Confirm the save is rejected with an empty-content or substance-validation error and that no final memory file appears 3) Save one valid memory successfully 4) Immediately repeat the save with byte-for-byte identical content in the same target memory directory 5) Confirm the duplicate attempt is rejected before promotion and that the original file remains the only persisted copy | Empty-content validation strips frontmatter/comments/empty structure before measuring substance; insubstantial content below threshold is rejected; SHA-256 duplicate detection rejects exact-match content in the target memory directory; failures stop the save before atomic write/promotion; descriptive errors identify the specific gate | Rejection messages + target directory listing before/after each attempt + transcript of valid first save and rejected duplicate retry | PASS if both insubstantial and duplicate saves fail before final write with the expected reason; FAIL if blank/template content is persisted, duplicates are saved, or rejection happens only after the write step | Inspect `validateContentSubstance` filtering rules; verify minimum-substance threshold; review duplicate hash comparison scope in target directory; confirm `writeFilesAtomically()` aborts before final rename/promotion |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/12-generation-time-duplicate-and-empty-content-prevention.md](../../feature_catalog/13--memory-quality-and-indexing/12-generation-time-duplicate-and-empty-content-prevention.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 200
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/200-generation-time-duplicate-and-empty-content-prevention.md`
