---
title: "235 -- Eval Runner CLI"
description: "This scenario validates eval runner CLI for `235`. It focuses on confirming flag gating, channel parsing, report output, and artifact persistence for ablation runs."
---

# 235 -- Eval Runner CLI

## 1. OVERVIEW

This scenario validates eval runner CLI for `235`. It focuses on confirming flag gating, channel parsing, report output, and artifact persistence for ablation runs.

---

## 2. CURRENT REALITY

Operators verify that the ablation CLI refuses to run without explicit enablement, accepts supported channel lists, warns on invalid channels, and writes the final JSON artifact after a successful run against the production evaluation surface.

- Objective: Confirm ablation flag gating, channel handling, report output, and artifact persistence
- Prompt: `Validate the eval runner CLI. Capture the evidence needed to prove run-ablation.ts blocks execution unless SPECKIT_ABLATION=true is set, warns or recovers cleanly when invalid channel names are provided, prints a formatted report on success, and writes /tmp/ablation-result.json with script metadata. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: flag-disabled run exits non-zero with usage guidance; enabled run initializes production and eval DBs; formatted report prints; `/tmp/ablation-result.json` is written
- Pass/fail: PASS if the gating, run path, and artifact-writing behavior match the documented CLI contract

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 235 | Eval Runner CLI | Confirm ablation flag gating, channel handling, report output, and artifact persistence | `Validate the eval runner CLI. Capture the evidence needed to prove run-ablation.ts blocks execution unless SPECKIT_ABLATION=true is set, warns or recovers cleanly when invalid channel names are provided, prints a formatted report on success, and writes /tmp/ablation-result.json with script metadata. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `npx tsx .opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts --channels vector || true` 2) `SPECKIT_ABLATION=true npx tsx .opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts --channels vector,fts5,invalid --verbose` 3) `node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync('/tmp/ablation-result.json','utf8')); console.log(data.productionMemoryCount, data.scriptVersion)"` | Disabled run exits non-zero with enablement error; enabled run initializes the production DB and eval DB; invalid channel input does not silently crash; JSON artifact contains `productionMemoryCount` and `scriptVersion` | CLI transcript for both runs and the contents of `/tmp/ablation-result.json` | PASS if the first run is correctly blocked and the second run completes with a persisted JSON artifact and printed report | Inspect `scripts/evals/run-ablation.ts`, ground-truth/eval DB initialization, and channel parsing if the CLI bypasses flag gating or fails to persist the artifact |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/21-eval-runner-cli.md](../../feature_catalog/16--tooling-and-scripts/21-eval-runner-cli.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 235
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/235-eval-runner-cli.md`
