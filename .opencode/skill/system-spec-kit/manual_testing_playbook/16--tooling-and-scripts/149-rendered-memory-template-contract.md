---
title: "149 -- Rendered memory template contract"
description: "This scenario validates Rendered memory template contract for `149`. It focuses on Confirm malformed rendered memories fail before write/index and active corpus stays structurally clean."
---

# 149 -- Rendered memory template contract

## 1. OVERVIEW

This scenario validates Rendered memory template contract for `149`. It focuses on Confirm malformed rendered memories fail before write/index and active corpus stays structurally clean.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `149` and confirm the expected signals without contradicting evidence.

- Objective: Confirm malformed rendered memories fail before write/index and active corpus stays structurally clean
- Prompt: `Validate the rendered-memory template contract for memory_save and generate-context. Capture the evidence needed to prove Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean
- Pass/fail: PASS if malformed files are rejected before write/index and valid rendered output remains validator-clean

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 149 | Rendered memory template contract | Confirm malformed rendered memories fail before write/index and valid rendered output remains validator-clean | `Validate the rendered-memory template contract for memory_save and generate-context. Capture the evidence needed to prove Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create a sandbox memory missing mandatory anchors or required frontmatter keys 2) `memory_save({ filePath:"<sandbox-file>", dryRun:true })` and verify contract-violation details 3) `memory_save({ filePath:"<sandbox-file>", force:true })` and verify rejection before indexing 4) Run `generate-context.js` with a valid rich JSON payload and verify the rendered output remains validator-clean | Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean | Dry-run/save rejection output + successful render validation evidence | PASS if malformed files are rejected before write/index and valid rendered output remains validator-clean | Inspect `shared/parsing/memory-template-contract.ts`, `scripts/core/workflow.ts`, and `mcp_server/handlers/memory-save.ts` |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/12-session-capturing-pipeline-quality.md](../../feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 149
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/149-rendered-memory-template-contract.md`
