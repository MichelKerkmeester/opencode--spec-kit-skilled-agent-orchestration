---
title: "235 -- Eval Runner CLI"
description: "This scenario validates eval runner CLI for `235`. It focuses on confirming flag gating, channel parsing, report output, and artifact persistence for ablation runs."
---

# 235 -- Eval Runner CLI

## 1. OVERVIEW

This scenario validates eval runner CLI for `235`. It focuses on confirming flag gating, channel parsing, report output, and artifact persistence for ablation runs.

---

## 2. CURRENT REALITY

Operators verify that the ablation CLI refuses to run without explicit enablement, accepts supported channel lists, warns on invalid channels, writes the final JSON artifact after a successful run against the production evaluation surface, and is paired with the read-only ground-truth mapping preview before trusting cross-run comparisons.

- Objective: Confirm ablation flag gating, provenance preview, channel handling, report output, and artifact persistence
- Prompt: `Validate the eval runner CLI. Capture the evidence needed to prove map-ground-truth-ids.ts previews the active parent-memory DB mapping, run-ablation.ts blocks execution unless SPECKIT_ABLATION=true is set, warns or recovers cleanly when invalid channel names are provided, prints a formatted report on success, and writes /tmp/ablation-result.json with script metadata. Flag any token-budget-overflow run that collapses below recallK as investigation-only rather than a clean benchmark. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: mapping preview logs the production DB path and parent-memory count; flag-disabled run exits non-zero with usage guidance; enabled run initializes production and eval DBs; formatted report prints; `/tmp/ablation-result.json` is written
- Pass/fail: PASS if the mapping preview and CLI contract both behave as documented, with truncation clearly called out when present

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 235 | Eval Runner CLI | Confirm ablation flag gating, provenance preview, channel handling, report output, and artifact persistence | `Validate the eval runner CLI. Capture the evidence needed to prove map-ground-truth-ids.ts previews the active parent-memory DB mapping, run-ablation.ts blocks execution unless SPECKIT_ABLATION=true is set, warns or recovers cleanly when invalid channel names are provided, prints a formatted report on success, and writes /tmp/ablation-result.json with script metadata. Flag any token-budget-overflow run that collapses below recallK as investigation-only rather than a clean benchmark. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `npx tsx .opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts --dry-run` 2) `npx tsx .opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts --channels vector || true` 3) `SPECKIT_ABLATION=true npx tsx .opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts --channels vector,fts5,invalid --verbose` 4) `node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync('/tmp/ablation-result.json','utf8')); console.log(data.productionMemoryCount, data.scriptVersion)"` | Mapping preview logs the production DB path and parent-memory count; disabled run exits non-zero with enablement error; enabled run initializes the production DB and eval DB; invalid channel input does not silently crash; JSON artifact contains `productionMemoryCount` and `scriptVersion` | CLI transcript for preview and both runs, plus the contents of `/tmp/ablation-result.json` | PASS if the preview and CLI contract behave as documented and any truncation-driven invalid benchmark is explicitly called out | Inspect `scripts/evals/map-ground-truth-ids.ts`, `scripts/evals/run-ablation.ts`, ground-truth/eval DB initialization, and channel parsing if provenance, gating, or artifact persistence regresses |

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
