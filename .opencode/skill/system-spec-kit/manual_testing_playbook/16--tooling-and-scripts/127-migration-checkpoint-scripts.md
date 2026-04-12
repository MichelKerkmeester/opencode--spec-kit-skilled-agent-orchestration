---
title: "127 -- Migration checkpoint scripts"
description: "This scenario validates Migration checkpoint scripts for `127`. It focuses on Verify raw SQLite migration checkpoint create/restore helpers produce sidecar metadata and safe restore backups."
---

# 127 -- Migration checkpoint scripts

## 1. OVERVIEW

This scenario validates Migration checkpoint scripts for `127`. It focuses on Verify raw SQLite migration checkpoint create/restore helpers produce sidecar metadata and safe restore backups.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `127` and confirm the expected signals without contradicting evidence.

- Objective: Verify raw SQLite migration checkpoint create/restore helpers produce sidecar metadata and safe restore backups
- Prompt: `As a tooling validation operator, validate Migration checkpoint scripts against cd .opencode/skill/system-spec-kit/mcp_server. Verify raw SQLite migration checkpoint create/restore helpers produce sidecar metadata and safe restore backups. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Targeted suite passes; transcript shows checkpoint sidecar creation, restore success, and pre-restore backup coverage
- Pass/fail: PASS if `migration-checkpoint-scripts.vitest.ts` completes with all tests passing and no failures

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 127 | Migration checkpoint scripts | Verify raw SQLite migration checkpoint create/restore helpers produce sidecar metadata and safe restore backups | `As a tooling validation operator, verify raw SQLite migration checkpoint create/restore helpers produce sidecar metadata and safe restore backups against cd .opencode/skill/system-spec-kit/mcp_server. Verify targeted suite passes; transcript shows checkpoint sidecar creation, restore success, and pre-restore backup coverage. Return a concise pass/fail verdict with the main reason and cited evidence.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server` 2) `npm test -- --run tests/migration-checkpoint-scripts.vitest.ts` | Targeted suite passes; transcript shows checkpoint sidecar creation, restore success, and pre-restore backup coverage | Test transcript + suite summary | PASS if `migration-checkpoint-scripts.vitest.ts` completes with all tests passing and no failures | Re-run `npm test -- --run tests/migration-checkpoint-scripts.vitest.ts -t restore`; inspect `scripts/migrations/create-checkpoint.ts` and `scripts/migrations/restore-checkpoint.ts` if assertions drift |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/09-migration-checkpoint-scripts.md](../../feature_catalog/16--tooling-and-scripts/09-migration-checkpoint-scripts.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 127
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/127-migration-checkpoint-scripts.md`
