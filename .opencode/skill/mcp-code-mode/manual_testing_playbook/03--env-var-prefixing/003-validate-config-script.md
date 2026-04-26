---
title: "CM-010 -- validate_config script"
description: "This scenario validates the validate_config.py preflight script for `CM-010`. It focuses on confirming the script reports missing required env vars and exits non-zero."
---

# CM-010 -- validate_config script

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-010`.

---

## 1. OVERVIEW

This scenario validates the `validate_config.py` preflight script for `CM-010`. It focuses on confirming the script (a) detects missing required env vars (using the prefixed names defined in `.utcp_config.json`), (b) exits non-zero when violations are found, and (c) exits 0 after fixes are applied.

### Why This Matters

This script is the operator's "is my install ready?" check before running any other scenario. If it produces false positives, false negatives, or doesn't fail loudly, the playbook's other smoke tests become unreliable. This is also the script referenced by deployment / setup docs.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CM-010` and confirm the expected signals without contradictory evidence.

- Objective: Verify `python3 .opencode/skill/mcp-code-mode/scripts/validate_config.py .utcp_config.json --check-env .env` reports missing required env vars and exits non-zero.
- Real user request: `"Run a preflight to confirm my Code Mode setup is correct."`
- Prompt: `As a manual-testing orchestrator, run the validation script with a .env missing one required prefixed key against the current .utcp_config.json. Verify the script exits non-zero and names the missing key. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: temporarily remove a required env var line from `.env`; run validator; observe exit code and output; restore.
- Expected signals: script exits non-zero when key missing; stderr/stdout names the missing key by its prefixed name; restore + re-run gives exit 0.
- Desired user-visible outcome: A short report quoting the script's missing-key message and a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if script silently passes when key missing (false negative) or exits non-zero with no key name (unhelpful failure mode).

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, run the validation script with a .env missing one required prefixed key against the current .utcp_config.json. Verify the script exits non-zero and names the missing key. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: cp .env .env.bak` — back up
2. `bash: sed -i.tmp '/^clickup_CLICKUP_API_KEY=/d' .env` — remove the required prefixed key
3. `bash: python3 .opencode/skill/mcp-code-mode/scripts/validate_config.py .utcp_config.json --check-env .env; echo "exit=$?"`
4. `bash: mv .env.bak .env` — restore
5. `bash: python3 .opencode/skill/mcp-code-mode/scripts/validate_config.py .utcp_config.json --check-env .env; echo "exit=$?"`

### Expected

- Step 3: script exits non-zero (e.g., `exit=1`); output contains `clickup_CLICKUP_API_KEY` (the missing prefixed key name)
- Step 5: script exits 0 after restore

### Evidence

Capture both runs' stdout + stderr + exit code.

### Pass / Fail

- **Pass**: Step 3 exits non-zero AND names the missing key; Step 5 exits 0.
- **Fail**: Step 3 exits 0 when key is missing (false negative — script broken); Step 3 exits non-zero but doesn't name the key (operator can't self-correct).

### Failure Triage

1. If Step 3 exits 0: check the script source for the env-presence check; verify `--check-env` flag is actually wired; confirm the script is reading `.env` not the shell environment.
2. If Step 3 exits non-zero but doesn't name the key: enhancement target — file an issue, but not a hard fail.
3. If Step 5 also exits non-zero: restore failed or other env vars are missing; cross-check `.env` against `.utcp_config.json` `env` blocks.

### Optional Supplemental Checks

- Try removing 2 keys at once; confirm both are named in output (verifies the validator iterates all keys).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-code-mode/scripts/validate_config.py` | Validator implementation |
| `.opencode/skill/mcp-code-mode/SKILL.md` | Validator usage doc |

---

## 5. SOURCE METADATA

- Group: ENV VAR PREFIXING
- Playbook ID: CM-010
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--env-var-prefixing/003-validate-config-script.md`
