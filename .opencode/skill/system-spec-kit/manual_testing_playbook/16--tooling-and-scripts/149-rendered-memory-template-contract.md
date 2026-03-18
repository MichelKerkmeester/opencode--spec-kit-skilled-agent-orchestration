---
title: "NEW-149 -- Rendered memory template contract"
description: "This scenario validates Rendered memory template contract for `NEW-149`. It focuses on Confirm malformed rendered memories fail before write/index and active corpus stays structurally clean."
---

# NEW-149 -- Rendered memory template contract

## 1. OVERVIEW

This scenario validates Rendered memory template contract for `NEW-149`. It focuses on Confirm malformed rendered memories fail before write/index and active corpus stays structurally clean.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-149` and confirm the expected signals without contradicting evidence.

- Objective: Confirm malformed rendered memories fail before write/index and active corpus stays structurally clean
- Prompt: `Validate the rendered-memory template contract for memory_save, generate-context, and historical remediation.`
- Expected signals: Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; remediation leaves active files validator-clean; apply-mode reports distinguish pre-apply evidence from final post-apply state
- Pass/fail: PASS if malformed files are rejected before write/index, apply-mode final reports are validator-clean for repairable sandbox cases, and the active audit reports no remaining structural violations

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-149 | Rendered memory template contract | Confirm malformed rendered memories fail before write/index and active corpus stays structurally clean | `Validate the rendered-memory template contract for memory_save, generate-context, and historical remediation.` | 1) Create a sandbox memory missing mandatory anchors or required frontmatter keys 2) `memory_save({ filePath:"<sandbox-file>", dryRun:true })` and verify contract-violation details 3) `memory_save({ filePath:"<sandbox-file>", force:true })` and verify rejection before indexing 4) Run the historical remediation audit on a sandbox root and verify repair/quarantine output is validator-clean 5) If using `historical-memory-remediation.js --apply`, verify the final canonical `manifest.json` / `summary.md` or rerun a dry audit after apply; treat `manifest.pre-apply.json` / `summary.pre-apply.md` as preserved pre-apply evidence only 6) Run the active corpus audit manifest and verify `0` active violations | Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; remediation leaves active files validator-clean; apply-mode reports distinguish pre-apply evidence from final post-apply state | Dry-run/save rejection output + remediation manifest + active corpus manifest | PASS if malformed files are rejected before write/index, apply-mode final reports are validator-clean for repairable sandbox cases, and the active audit reports no remaining structural violations | Inspect `shared/parsing/memory-template-contract.ts`, `scripts/memory/historical-memory-remediation.ts`, `scripts/core/workflow.ts`, and `mcp_server/handlers/memory-save.ts` |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/12-session-capturing-pipeline-quality.md](../../feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: NEW-149
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/149-rendered-memory-template-contract.md`
