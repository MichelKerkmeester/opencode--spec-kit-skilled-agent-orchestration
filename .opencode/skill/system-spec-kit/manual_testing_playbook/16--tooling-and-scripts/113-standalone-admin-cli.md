---
title: "113 -- Standalone admin CLI"
description: "This scenario validates Standalone admin CLI for `113`. It focuses on Confirm 4 CLI commands execute correctly."
---

# 113 -- Standalone admin CLI

## 1. OVERVIEW

This scenario validates Standalone admin CLI for `113`. It focuses on Confirm 4 CLI commands execute correctly.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `113` and confirm the expected signals without contradicting evidence.

- Objective: Confirm 4 CLI commands execute correctly
- Prompt: `Validate standalone admin CLI commands. Capture the evidence needed to prove stats shows tier distribution and schema version; dry-run shows plan without executing deletions; reindex completes with summary; schema-downgrade without --confirm shows safety prompt; destructive bulk-delete attempts a pre-delete checkpoint and warns rather than aborting if checkpoint persistence fails. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: stats shows tier distribution and schema version; dry-run shows plan without executing deletions; reindex completes with summary; schema-downgrade without `--confirm` shows safety prompt; destructive bulk-delete attempts a pre-delete checkpoint and warns rather than aborting if checkpoint persistence fails
- Pass/fail: PASS if all 4 CLI commands execute correctly with expected output and safety features work (dry-run, safety prompt, best-effort checkpoint attempt)

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 113 | Standalone admin CLI | Confirm 4 CLI commands execute correctly | `Validate standalone admin CLI commands. Capture the evidence needed to prove stats shows tier distribution and schema version; dry-run shows plan without executing deletions; reindex completes with summary; schema-downgrade without --confirm shows safety prompt; destructive bulk-delete attempts a pre-delete checkpoint and warns rather than aborting if checkpoint persistence fails. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `node cli.js stats` → verify tier distribution, top folders, schema version displayed 2) `node cli.js bulk-delete --tier temporary --folder specs/test-sandbox --dry-run` → verify dry-run shows deletion plan without executing 3) `node cli.js reindex --force` → verify full reindex completes 4) `node cli.js schema-downgrade --to 15` (without `--confirm`) → verify safety prompt 5) `node cli.js bulk-delete --tier temporary --folder specs/test-sandbox --older-than 365` → verify checkpoint creation is attempted when `--skip-checkpoint` is absent, and a checkpoint failure degrades to a warning instead of blocking deletion | stats shows tier distribution and schema version; dry-run shows plan without executing deletions; reindex completes with summary; schema-downgrade without `--confirm` shows safety prompt; destructive bulk-delete attempts a pre-delete checkpoint and warns rather than aborting if checkpoint persistence fails | CLI command outputs for all 4 commands + checkpoint attempt evidence | PASS if all 4 CLI commands execute correctly with expected output and safety features work (dry-run, safety prompt, best-effort checkpoint attempt) | Verify cli.js entry point and command routing; check each command handler for expected output format; inspect best-effort checkpoint logic in bulk-delete path |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/07-standalone-admin-cli.md](../../feature_catalog/16--tooling-and-scripts/07-standalone-admin-cli.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 113
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/113-standalone-admin-cli.md`
