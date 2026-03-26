---
title: "133 -- Dry-run preflight for memory_save"
description: "This scenario validates Dry-run preflight for memory_save for `133`. It focuses on Confirm dry-run previews preflight plus semantic insufficiency without indexing side effects."
---

# 133 -- Dry-run preflight for memory_save

## 1. OVERVIEW

This scenario validates Dry-run preflight for memory_save for `133`. It focuses on Confirm dry-run previews preflight plus semantic insufficiency without indexing side effects.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `133` and confirm the expected signals without contradicting evidence.

- Objective: Confirm dry-run previews preflight plus semantic insufficiency without indexing side effects
- Prompt: `Validate memory_save dryRun preview behavior, including insufficiency detection. Capture the evidence needed to prove Dry-run returns preflight plus quality-loop and sufficiency payloads; thin memories report INSUFFICIENT_CONTEXT_ABORT without indexing/database mutation; force:true does not bypass insufficiency; rich non-dry-run save indexes the same file. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Dry-run returns preflight plus quality-loop and sufficiency payloads; thin memories report `INSUFFICIENT_CONTEXT_ABORT` without indexing/database mutation; `force:true` does not bypass insufficiency; rich non-dry-run save indexes the same file
- Pass/fail: PASS if dry-run surfaces sufficiency explicitly with no index mutation, forced thin save still rejects, and rich non-dry-run save makes the record searchable

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 133 | Dry-run preflight for memory_save | Confirm dry-run previews preflight plus semantic insufficiency without indexing side effects | `Validate memory_save dryRun preview behavior, including insufficiency detection. Capture the evidence needed to prove Dry-run returns preflight plus quality-loop and sufficiency payloads; thin memories report INSUFFICIENT_CONTEXT_ABORT without indexing/database mutation; force:true does not bypass insufficiency; rich non-dry-run save indexes the same file. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create a rich sandbox memory file and a thin sandbox memory file 2) `memory_stats()` and capture baseline totals 3) `memory_save({filePath:"<thin-sandbox-file>", dryRun:true})` and verify preflight details, `qualityLoop`, `sufficiency`, and `rejectionCode:"INSUFFICIENT_CONTEXT_ABORT"` 4) `memory_stats()` and `memory_search({query:"<thin title>"})` to verify no new indexed record from dry-run 5) `memory_save({filePath:"<thin-sandbox-file>", force:true})` and verify it still rejects before indexing 6) `memory_save({filePath:"<rich-sandbox-file>", dryRun:true})` and verify `would_pass:true` with no side effects 7) `memory_save({filePath:"<rich-sandbox-file>", dryRun:false})` and verify the memory becomes searchable | Dry-run returns preflight plus quality-loop and sufficiency payloads; thin memories report `INSUFFICIENT_CONTEXT_ABORT` without indexing/database mutation; `force:true` does not bypass insufficiency; rich non-dry-run save indexes the same file | Dry-run responses for thin and rich files + before/after stats + search outputs + non-dry-run save output | PASS if dry-run surfaces sufficiency explicitly with no index mutation, forced thin save still rejects, and rich non-dry-run save makes the record searchable | Inspect `handlers/memory-save.ts` dryRun and insufficiency branches, `shared/parsing/memory-sufficiency.ts`, `handlers/quality-loop.ts`, and `lib/validation/preflight.ts` |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md](../../feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 133
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/133-dry-run-preflight-for-memory-save.md`
