---
title: "127 -- Migration checkpoint scripts"
description: "This scenario validates Migration checkpoint scripts for `127`. It focuses on Verify raw SQLite migration checkpoint create/restore helpers produce sidecar metadata and safe restore backups."
---

# 127 -- Migration checkpoint scripts

## 1. OVERVIEW

This scenario validates Migration checkpoint scripts for `127`. It focuses on Verify raw SQLite migration checkpoint create/restore helpers produce sidecar metadata and safe restore backups.

---

## 2. SCENARIO CONTRACT


- Objective: Verify raw SQLite migration checkpoint create/restore helpers produce sidecar metadata and safe restore backups.
- Real user request: `Please validate Migration checkpoint scripts against cd .opencode/skill/system-spec-kit/mcp_server and tell me whether the expected signals are present: Targeted suite passes; transcript shows checkpoint sidecar creation, restore success, and pre-restore backup coverage.`
- RCAF Prompt: `As a tooling validation operator, validate Migration checkpoint scripts against cd .opencode/skill/system-spec-kit/mcp_server. Verify raw SQLite migration checkpoint create/restore helpers produce sidecar metadata and safe restore backups. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Targeted suite passes; transcript shows checkpoint sidecar creation, restore success, and pre-restore backup coverage
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if `migration-checkpoint-scripts.vitest.ts` completes with all tests passing and no failures

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, verify raw SQLite migration checkpoint create/restore helpers produce sidecar metadata and safe restore backups against cd .opencode/skill/system-spec-kit/mcp_server. Verify targeted suite passes; transcript shows checkpoint sidecar creation, restore success, and pre-restore backup coverage. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skill/system-spec-kit/mcp_server`
2. `npm test -- --run tests/migration-checkpoint-scripts.vitest.ts`

### Expected

Targeted suite passes; transcript shows checkpoint sidecar creation, restore success, and pre-restore backup coverage

### Evidence

Test transcript + suite summary

### Pass / Fail

- **Pass**: `migration-checkpoint-scripts.vitest.ts` completes with all tests passing and no failures
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Re-run `npm test -- --run tests/migration-checkpoint-scripts.vitest.ts -t restore`; inspect `scripts/migrations/create-checkpoint.ts` and `scripts/migrations/restore-checkpoint.ts` if assertions drift

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/09-migration-checkpoint-scripts.md](../../feature_catalog/16--tooling-and-scripts/09-migration-checkpoint-scripts.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 127
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/127-migration-checkpoint-scripts.md`
