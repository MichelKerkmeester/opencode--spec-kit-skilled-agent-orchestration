---
title: "BDG-002 -- Session start"
description: "This scenario validates bdg session startup for `BDG-002`. It focuses on confirming `bdg <url>` starts a CDP session against the given URL and bdg status reports active state."
---

# BDG-002 -- Session start

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-002`.

---

## 1. OVERVIEW

This scenario validates bdg session startup for `BDG-002`. It focuses on confirming `bdg https://example.com` starts a Chrome DevTools Protocol session against the URL and `bdg status` reports an active session.

### Why This Matters

Session start is the gate every other CLI scenario (BDG-003..BDG-013) depends on. If session start silently fails or `bdg status` doesn't reflect the new state, downstream scenarios produce confusing failures.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BDG-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify `bdg https://example.com` exits 0 AND `bdg status` reports active state.
- Real user request: `"Open example.com in a debug session."`
- RCAF Prompt: `As a manual-testing orchestrator, start a bdg session against https://example.com through the bdg CLI against a real Chrome/Chromium browser. Verify session reports active state. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: run two bash commands; do not delegate.
- Expected signals: `bdg https://example.com` exits 0; `bdg status` reports active session with the URL.
- Desired user-visible outcome: A short report quoting the status JSON's `state` and `url` fields with a PASS verdict.
- Pass/fail: PASS if both signals hold; FAIL if session start errors (browser missing, port conflict) or status doesn't reflect active state.

---

## 3. TEST EXECUTION

### Prompt

- RCAF Prompt: `As a manual-testing orchestrator, start a bdg session against https://example.com through the bdg CLI against a real Chrome/Chromium browser. Verify session reports active state. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: bdg https://example.com`
2. `bash: bdg status 2>&1`

### Expected

- Step 1: exits 0; may print a session id or status line
- Step 2: output indicates active state and contains the URL `example.com`

### Evidence

Capture both command outputs.

### Pass / Fail

- **Pass**: Session start exit 0 AND status reflects active session.
- **Fail**: Session start errors (cross-check BDG-019 for missing browser); status reports no active session (state desync).

### Failure Triage

1. If session start errors with browser-related message: cross-reference BDG-019; check `which google-chrome chromium-browser`; set `CHROME_PATH` env var if needed.
2. If session start succeeds but status shows no active session: there may be a state file path mismatch — check the bdg state directory location (often `~/.bdg/` or `$XDG_RUNTIME_DIR/bdg/`).
3. If session start hangs: Chrome may be prompting (e.g., for network permissions); try `bdg --headless https://example.com` if available.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | bdg CLI session lifecycle |

---

## 5. SOURCE METADATA

- Group: CLI BDG LIFECYCLE
- Playbook ID: BDG-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cli-bdg-lifecycle/002-session-start.md`
