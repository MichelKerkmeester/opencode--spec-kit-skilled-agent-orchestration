---
title: "149 -- Rendered spec-doc record template contract"
description: "This scenario validates Rendered spec-doc record template contract for `149`. It focuses on Confirm malformed rendered spec-doc records fail before write/index and active corpus stays structurally clean."
---

# 149 -- Rendered spec-doc record template contract

## 1. OVERVIEW

This scenario validates Rendered spec-doc record template contract for `149`. It focuses on Confirm malformed rendered spec-doc records fail before write/index and active corpus stays structurally clean.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm malformed rendered spec-doc records fail before write/index and active corpus stays structurally clean.
- Real user request: `Please validate Rendered spec-doc record template contract against memory_save({ filePath:"<sandbox-file>", dryRun:true }) and tell me whether the expected signals are present: Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean.`
- RCAF Prompt: `As a tooling validation operator, validate Rendered spec-doc record template contract against memory_save({ filePath:"<sandbox-file>", dryRun:true }). Verify malformed rendered spec-doc records fail before write/index and active corpus stays structurally clean. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if malformed files are rejected before write/index and valid rendered output remains validator-clean

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, confirm malformed rendered spec-doc records fail before write/index and valid rendered output remains validator-clean against memory_save({ filePath:"<sandbox-file>", dryRun:true }). Verify dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Create a sandbox memory missing mandatory anchors or required frontmatter keys
2. `memory_save({ filePath:"<sandbox-file>", dryRun:true })` and verify contract-violation details
3. `memory_save({ filePath:"<sandbox-file>", force:true })` and verify rejection before indexing
4. Run `generate-context.js` with a valid rich JSON payload and verify the rendered output remains validator-clean

### Expected

Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean

### Evidence

Dry-run/save rejection output + successful render validation evidence

### Pass / Fail

- **Pass**: malformed files are rejected before write/index and valid rendered output remains validator-clean
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `shared/parsing/memory-template-contract.ts`, `scripts/core/workflow.ts`, and `mcp_server/handlers/memory-save.ts`

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/12-session-capturing-pipeline-quality.md](../../feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 149
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/149-rendered-memory-template-contract.md`
