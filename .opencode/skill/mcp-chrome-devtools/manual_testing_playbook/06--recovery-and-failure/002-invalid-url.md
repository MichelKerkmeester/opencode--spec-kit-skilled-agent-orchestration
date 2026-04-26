---
title: "BDG-020 -- Invalid URL"
description: "This scenario validates the invalid-URL error path for `BDG-020`. It focuses on confirming `bdg <bad-url>` exits non-zero and stderr names the URL parse failure."
---

# BDG-020 -- Invalid URL

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-020`.

---

## 1. OVERVIEW

This scenario validates the invalid-URL error path for `BDG-020`. It focuses on confirming `bdg not-a-url` (a string that does not parse as a URL) exits non-zero and stderr indicates a URL parse failure or invalid input — rather than silently spawning a browser that navigates nowhere.

### Why This Matters

A typo or shell-escaping mistake (`bdg https//example.com` missing a colon, `bdg "fake url"` with a space) is one of the most common bdg invocations to fail. If bdg accepts the bad input and starts a session against an opaque target, operators don't realize their command was wrong. Failing fast with a parse-error message is the contract that lets operators recover in seconds rather than minutes.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `BDG-020` and confirm the expected signals without contradictory evidence.

- Objective: Verify `bdg not-a-url 2>&1` exits non-zero and stderr contains a URL parse / invalid input indication.
- Real user request: `"What happens if I typo the URL when starting bdg?"`
- Prompt: `As a manual-testing orchestrator, attempt to start bdg with an invalid URL (e.g., not-a-url) through the bdg CLI against an installed Chrome. Verify the error names the URL parse failure. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: run a single CLI command with a guaranteed-invalid URL; capture exit code and stderr; assert non-zero exit and parse-error message.
- Expected signals: exit code != 0; stderr contains "url" / "invalid" / "parse" / "scheme" or names the bad input.
- Desired user-visible outcome: A short report quoting the error message and exit code with a PASS verdict.
- Pass/fail: PASS if both signals hold; FAIL if exit code is 0 (bad URL silently accepted), or stderr is empty / generic.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, attempt to start bdg with an invalid URL (e.g., not-a-url) through the bdg CLI against an installed Chrome. Verify the error names the URL parse failure. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. Precondition: a real browser is installed (otherwise this would conflate with BDG-019); confirm with `bash: which google-chrome chromium-browser chromium 2>&1`
2. `bash: bdg not-a-url 2>&1; echo "EXIT=$?"`
3. `bash: bdg not-a-url 2>&1 | grep -iE "(url|invalid|parse|scheme|not.a.url)"`

### Expected

- Step 2: exit code != 0
- Step 3: at least one match for the parse-error pattern; exit code 0 (the grep)

### Evidence

Capture full stderr, exit code, and the grep match.

### Pass / Fail

- **Pass**: exit code != 0 AND stderr contains a URL parse / invalid input indication.
- **Fail**: exit code 0 (bad URL silently accepted, browser may have launched against a misinterpreted target); stderr empty or generic stack trace.

### Failure Triage

1. If exit code 0: bdg may be passing the raw string to Chrome which interprets it as a search query — confirm by running `bash: bdg status 2>&1` after the bad invocation; if a session is active, bdg silently accepted the input. Always run `bdg stop` after this scenario to avoid leaking a session (cross-reference BDG-022).
2. If exit code != 0 but stderr is opaque: capture for bug report; verify with a clearly-bad fixture like `bash: bdg "" 2>&1` (empty) and `bash: bdg "ftp://" 2>&1` (incomplete URL) — comparing all three failure modes pinpoints whether the validator is missing or just produces poor messages.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | bdg URL parsing + error path |

---

## 5. SOURCE METADATA

- Group: RECOVERY AND FAILURE
- Playbook ID: BDG-020
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--recovery-and-failure/002-invalid-url.md`
