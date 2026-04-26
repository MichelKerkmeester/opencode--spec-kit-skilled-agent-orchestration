---
title: "CC-009 -- Sonnet balanced default"
description: "This scenario validates Sonnet balanced default for `CC-009`. It focuses on confirming Sonnet handles a routine security review with reasonable depth, runtime, and cost."
---

# CC-009 -- Sonnet balanced default

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-009`.

---

## 1. OVERVIEW

This scenario validates Sonnet balanced default for `CC-009`. It focuses on confirming Sonnet handles a routine security review with reasonable depth, runtime and cost.

### Why This Matters

Sonnet is the documented default model for general-purpose dispatches. If Sonnet either misses obvious issues in a small auth file or balloons cost/runtime to Opus levels, the model selection guidance in cli_reference.md and integration_patterns.md is broken. This scenario is the primary check on Sonnet's routine workload behavior.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-009` and confirm the expected signals without contradictory evidence.

- Objective: Confirm Sonnet (`claude-sonnet-4-6`) handles a standard code review prompt with reasonable depth and cost without requiring `--effort high`.
- Real user request: `Use Claude Code at the default model tier to review one of our auth handlers for security issues - keep it fast, I just want a sanity check.`
- Prompt: `As an external-AI conductor running a routine security review on a single auth handler file, dispatch claude -p --model claude-sonnet-4-6 --permission-mode plan against @./src/auth/handler.ts (or any small auth file in the repository) and capture the response. Verify the response identifies at least one concrete issue or confirms the file is clean with stated reasoning, completes within 90 seconds, and stays within a sub-dollar cost budget. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: External-AI orchestrator picks an auth-related file in the repo (or uses a deliberately seeded sandbox file with a known pattern), dispatches Sonnet review with plan mode, then summarizes findings, runtime and cost.
- Expected signals: Response either flags concrete issues with line references OR explicitly states the file is clean with reasoning. Runtime under 90 seconds. Cost (when JSON output captured) under USD 0.50 for a small file.
- Desired user-visible outcome: Verdict naming any flagged issues (or clean attestation) plus runtime and cost.
- Pass/fail: PASS if review either identifies issues with line refs OR cleanly attests with reasoning AND runtime under 90s AND cost under USD 0.50. FAIL if any condition fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Identify a target auth-related file or seed a small sandbox auth handler with known patterns.
3. Time the dispatch with `time` to confirm runtime budget.
4. Capture cost from JSON output.
5. Return a verdict naming findings, runtime and cost.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-009 | Sonnet balanced default | Confirm Sonnet handles a standard security review with reasonable depth, runtime, and cost | `As an external-AI conductor running a routine security review on a single auth handler file, dispatch claude -p --model claude-sonnet-4-6 --permission-mode plan against @./src/auth/handler.ts (or any small auth file in the repository) and capture the response. Verify the response identifies at least one concrete issue or confirms the file is clean with stated reasoning, completes within 90 seconds, and stays within a sub-dollar cost budget. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: mkdir -p /tmp/cli-claude-code-playbook && printf "function login(username, password) {\n  const sql = \"SELECT * FROM users WHERE username = '\" + username + \"' AND password = '\" + password + \"'\";\n  return db.exec(sql);\n}\n" > /tmp/cli-claude-code-playbook/auth-sample.ts` -> 2. `bash: time claude -p "Security review of @/tmp/cli-claude-code-playbook/auth-sample.ts. Check for: SQL injection, auth bypass, hardcoded secrets, XSS. Rate each finding by severity (critical/high/medium/low) with line references." --model claude-sonnet-4-6 --permission-mode plan --output-format json 2>&1 > /tmp/cc-009-output.json` -> 3. `bash: jq -r '.result' /tmp/cc-009-output.json` -> 4. `bash: jq -r '.cost' /tmp/cc-009-output.json` -> 5. `bash: jq -r '.duration' /tmp/cc-009-output.json` | Step 1: sandbox file written with obvious SQL injection pattern; Step 2: dispatch completes; Step 3: review identifies the SQL injection issue with severity tag and line reference; Step 4: cost reported under 0.50; Step 5: duration reported under 90000 (ms) | `/tmp/cli-claude-code-playbook/auth-sample.ts`, `/tmp/cc-009-output.json`, terminal `time` output | PASS if review identifies the SQL injection AND cost < 0.50 AND duration < 90000 ms; FAIL if review misses the issue or cost/runtime exceed budget | 1. If review misses the SQL injection, the file pattern may need to be more obvious - check the prompt asks for SQL injection by name; 2. If runtime exceeds 90s, capture `--verbose` log to identify slow steps; 3. If cost exceeds 0.50, confirm the model id in JSON is actually Sonnet (not a fallback to a more expensive tier) |

### Optional Supplemental Checks

If the chosen target file is too small or trivially clean to produce findings, swap to a deliberately defective sandbox file with a known SQL injection or hardcoded secret to verify Sonnet flags it. Document the file substitution in evidence.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` | Models table and selection guide (section 6) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../assets/prompt_templates.md` | Security Review template (section 3) |
| `../../references/integration_patterns.md` | Model Selection Strategy (section 6) |

---

## 5. SOURCE METADATA

- Group: Reasoning And Models
- Playbook ID: CC-009
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--reasoning-and-models/002-sonnet-balanced-default.md`
