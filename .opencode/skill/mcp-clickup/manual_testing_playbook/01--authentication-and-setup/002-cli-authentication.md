---
title: "CLU-002 -- CLI authentication"
description: "This scenario validates that `cu auth` can reach ClickUp with the configured token and workspace."
---

# CLU-002 -- CLI authentication

This document captures the realistic user-testing contract, execution flow, source anchors, and metadata for `CLU-002`.

---

## 1. OVERVIEW

This scenario validates the ClickUp CLI authentication path after installation. It proves the configured token and workspace are usable before read or write scenarios run.

### Why This Matters

Read and mutation failures are noisy when auth is broken. This scenario isolates token and workspace setup first.

---

## 2. SCENARIO CONTRACT

- Objective: Verify `cu auth` exits cleanly and does not expose secrets.
- Real user request: `Check whether my ClickUp token works before listing or changing tasks.`
- RCAF Prompt: `As a ClickUp manual-testing orchestrator, verify the configured ClickUp CLI credentials by running cu auth and safe config inspection. Redact any token-like values, capture the exit status, and return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: Run `cu auth`, inspect safe config path, and confirm no token value is printed in evidence.
- Expected signals: `cu auth` exits 0; output names authenticated state or workspace/user; no `401`, `unauthorized`, or missing config error appears.
- Desired user-visible outcome: A short PASS/FAIL report confirming CLI auth readiness.
- Pass/fail: PASS if auth exits 0 and evidence is redacted; FAIL if credentials are missing or invalid.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm CLU-001 passed.
2. Run `cu auth` and capture stderr.
3. Redact any token-like content before saving evidence.
4. Return verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CLU-002 | CLI authentication | Confirm ClickUp CLI token/workspace are valid | `As a ClickUp manual-testing orchestrator, verify the configured ClickUp CLI credentials by running cu auth and safe config inspection. Redact any token-like values, capture the exit status, and return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: cu auth 2>&1 \| tee /tmp/clu-002-auth.txt` -> 2. `bash: echo "Exit: ${PIPESTATUS[0]}"` -> 3. `bash: cu config path 2>&1 \| tee /tmp/clu-002-config-path.txt` -> 4. `bash: grep -Eiq "(401|unauthorized|missing|invalid)" /tmp/clu-002-auth.txt; echo "AuthErrorSignal: $?"` | Step 1 exits 0; Step 2 prints `Exit: 0`; Step 3 returns a config path; Step 4 prints non-zero grep status | Redacted `/tmp/clu-002-auth.txt`, config path output, transcript | PASS if `cu auth` exits 0 and no auth-error signal appears; FAIL if exit non-zero or evidence exposes a token | 1. Re-run `cu init`; 2. Verify the token in ClickUp Settings > Apps > API Token; 3. Verify configured team/workspace ID is numeric and belongs to the token |

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `git show 7cead37e64c9fa25bf5b734d0549bddb416e84b2:.opencode/skill/mcp-clickup/SKILL.md` | Historical skill source for auth setup |
| `git show 7cead37e64c9fa25bf5b734d0549bddb416e84b2:.opencode/skill/mcp-clickup/references/cli_reference.md` | Historical CLI auth/config reference |

---

## 5. SOURCE METADATA

- Group: AUTHENTICATION AND SETUP
- Playbook ID: CLU-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--authentication-and-setup/002-cli-authentication.md`

