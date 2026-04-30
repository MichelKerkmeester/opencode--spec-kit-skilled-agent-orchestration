---
title: "BDG-019 -- Missing browser"
description: "This scenario validates the missing-browser error path for `BDG-019`. It focuses on confirming bdg returns a clear, actionable error when no Chrome / Chromium / Edge is resolvable."
---

# BDG-019 -- Missing browser

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-019`.

---

## 1. OVERVIEW

This scenario validates the missing-browser error path for `BDG-019`. It focuses on confirming that when the resolved browser binary does not exist (simulated by setting `CHROME_PATH=/nonexistent/chrome`), `bdg <url>` exits non-zero and the stderr message names the missing binary or says "browser not found" — i.e., the operator gets an actionable error rather than a confusing crash.

### Why This Matters

Missing-browser is the most common cold-start failure: a fresh machine without Chrome installed, a CI sandbox without Chromium, a misconfigured `CHROME_PATH`. If the error is opaque ("ENOENT" with no context), operators waste time debugging bdg when the fix is "install Chrome". This scenario locks in the contract that the error message points at the actual problem; cross-references the install verification in BDG-001.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BDG-019` and confirm the expected signals without contradictory evidence.

- Objective: Verify `CHROME_PATH=/nonexistent/chrome bdg https://example.com 2>&1` exits non-zero and stderr names the missing binary or contains "browser not found".
- Real user request: `"Try to start bdg with no Chrome installed and confirm the error is clear."`
- RCAF Prompt: `As a manual-testing orchestrator, simulate a missing-browser scenario by setting CHROME_PATH to a non-existent binary and starting bdg through the bdg CLI against the missing-browser path. Verify the error names the missing binary. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: run a single CLI command with `CHROME_PATH` overridden to a guaranteed-missing path; capture exit code and stderr; assert non-zero exit and informative message.
- Expected signals: exit code != 0; stderr contains the missing path string OR a phrase like "browser not found" / "executable not found" / "no such file".
- Desired user-visible outcome: A short report quoting the actual error message and exit code with a PASS verdict.
- Pass/fail: PASS if both signals hold; FAIL if exit code is 0 (silent failure), or stderr is empty / cryptic / generic stack trace with no operator-actionable info.

---

## 3. TEST EXECUTION

### Prompt

- RCAF Prompt: `As a manual-testing orchestrator, simulate a missing-browser scenario by setting CHROME_PATH to a non-existent binary and starting bdg through the bdg CLI against the missing-browser path. Verify the error names the missing binary. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. Precondition: capture the operator's currently-installed browser path so this scenario doesn't accidentally use it: `bash: which google-chrome chromium-browser chromium 2>&1`
2. `bash: CHROME_PATH=/nonexistent/chrome bdg https://example.com 2>&1; echo "EXIT=$?"`
3. `bash: CHROME_PATH=/nonexistent/chrome bdg https://example.com 2>&1 | grep -iE "(not found|nonexistent|no such file|cannot find|enoent)"`

### Expected

- Step 2: exit code != 0 (printed at the end of the line)
- Step 3: at least one match for the actionable error pattern; exit code 0 (the grep)

### Evidence

Capture the operator's normal browser path (step 1), the full stderr from step 2, the exit code, and the grep match.

### Pass / Fail

- **Pass**: exit code != 0 AND stderr contains an operator-actionable string identifying the missing browser.
- **Fail**: exit code 0 (silent — bdg started against the wrong browser); stderr empty; stderr is a raw stack trace with no human-readable cause.

### Failure Triage

1. If exit code is 0 despite the bad `CHROME_PATH`: bdg may be ignoring `CHROME_PATH` and falling back to PATH discovery — re-run with PATH cleared: `bash: env -i PATH=/nonexistent CHROME_PATH=/nonexistent/chrome bdg https://example.com 2>&1; echo "EXIT=$?"`. If still 0, file a bug in the bdg launcher.
2. If exit code != 0 but stderr is opaque: capture the full output for a bug report; cross-reference BDG-001 (install) — confirm bdg itself is healthy by running `bdg --version` and confirm a real browser is normally resolvable via `which google-chrome chromium-browser chromium`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | bdg browser discovery + error path |

---

## 5. SOURCE METADATA

- Group: RECOVERY AND FAILURE
- Playbook ID: BDG-019
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--recovery-and-failure/001-missing-browser.md`
