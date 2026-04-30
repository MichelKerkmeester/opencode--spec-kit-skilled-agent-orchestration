---
title: "BDG-021 -- Dead session (DESTRUCTIVE)"
description: "This scenario validates dead-session recovery for `BDG-021`. It focuses on confirming that killing the underlying Chrome process produces a clear bdg error and that a fresh session restart fully recovers. DESTRUCTIVE: kills the active Chrome process."
---

# BDG-021 -- Dead session (DESTRUCTIVE)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-021`.

> **DESTRUCTIVE WARNING**: This scenario deliberately kills the active Chrome process owned by bdg. Run only against a throwaway session — never against a long-running browser session that holds important state. Always confirm the active session is the one started for this test (`bdg status`) before killing.

---

## 1. OVERVIEW

This scenario validates dead-session recovery for `BDG-021`. It focuses on confirming the full failure-and-recovery cycle: start a session, kill the underlying Chrome process out-of-band, attempt a CDP operation (expect a clear error), then restart with a fresh `bdg <url>` and confirm a follow-up screenshot succeeds.

### Why This Matters

Browser processes die for many reasons: OOM, OS sleep + wake, manual `pkill`, OS-level resource limits. If bdg returns confusing errors after a dead session — or worse, blocks indefinitely — operators lose work and don't know how to recover. This scenario locks in the contract that (a) post-kill operations fail loudly with an actionable message, and (b) a clean restart works without manual state cleanup. BDG-022 covers the related cleanup-leak path.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BDG-021` and confirm the expected signals without contradictory evidence.

- Objective: Verify post-kill `bdg dom screenshot` exits non-zero with a session-error message; verify a subsequent `bdg https://example.com` succeeds; verify a follow-up screenshot succeeds.
- Real user request: `"Simulate Chrome crashing while I'm using bdg, then recover."`
- RCAF Prompt: `As a manual-testing orchestrator, deliberately kill the active Chrome process, attempt a bdg dom screenshot, then restart with a new session through the bdg CLI against an active-then-killed-then-restarted session. Verify the kill produces a clear error and restart recovers. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: start session; confirm it; identify and kill the bdg-owned Chrome process; attempt a CDP operation (expect failure); restart; confirm recovery.
- Expected signals: post-kill screenshot exits non-zero with a session/disconnected message; restart `bdg <url>` exits 0; post-restart screenshot exits 0 and writes a valid PNG.
- Desired user-visible outcome: A short report walking through "session started -> killed -> error captured -> restarted -> screenshot OK" with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if post-kill screenshot hangs or returns success (state lying); restart fails; post-restart screenshot fails.

---

## 3. TEST EXECUTION

### Prompt

- RCAF Prompt: `As a manual-testing orchestrator, deliberately kill the active Chrome process, attempt a bdg dom screenshot, then restart with a new session through the bdg CLI against an active-then-killed-then-restarted session. Verify the kill produces a clear error and restart recovers. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: bdg https://example.com 2>&1; echo "EXIT=$?"` — start a fresh throwaway session
2. `bash: bdg status 2>&1` — confirm session is active and points at example.com
3. `bash: pkill -9 -f "chrome.*--remote-debugging" 2>&1; echo "EXIT=$?"` — kill the bdg-owned Chrome process
4. `bash: bdg dom screenshot /tmp/bdg-dead.png 2>&1; echo "EXIT=$?"` — expect non-zero with session-error message
5. `bash: bdg https://example.com 2>&1; echo "EXIT=$?"` — restart with new session
6. `bash: bdg dom screenshot /tmp/bdg-recovered.png 2>&1; echo "EXIT=$?"` — confirm recovery
7. `bash: ls -la /tmp/bdg-recovered.png && xxd /tmp/bdg-recovered.png | head -1`

### Expected

- Step 1: exit 0; session active
- Step 2: status reports `https://example.com` as the URL
- Step 3: exit 0 (pkill found and killed at least one process)
- Step 4: exit != 0; stderr contains "session" / "disconnected" / "target closed" / "browser closed"
- Step 5: exit 0
- Step 6: exit 0
- Step 7: file exists with PNG magic `89 50 4e 47`

### Evidence

Capture all command outputs, exit codes, the post-kill error message verbatim, and the recovered PNG magic bytes.

### Pass / Fail

- **Pass**: post-kill screenshot exits non-zero with session-error message AND restart exits 0 AND post-restart PNG has valid magic bytes.
- **Fail**: post-kill screenshot returns success (state machine lying about a dead session); post-kill screenshot hangs (no timeout — should fail fast); restart errors; post-restart screenshot is empty / wrong magic.

### Failure Triage

1. If `pkill` returns exit 1 (no matching process): the bdg-owned Chrome may have a different argv pattern — list with `bash: pgrep -fl chrome` and adjust the kill pattern; cross-reference BDG-002 to confirm a session was actually started.
2. If post-kill screenshot returns success or hangs: bdg's state file may be stale — clean up manually with `bash: rm -rf ~/.bdg/ 2>/dev/null; bdg status 2>&1` and re-run from step 5; cross-reference BDG-022 for cleanup-leak detection on the previous session.

### Optional Supplemental Checks

- After step 6, run `bash: bdg stop` to release the recovered session cleanly (don't leak a Chrome process from this destructive test).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | bdg session lifecycle + error handling |

---

## 5. SOURCE METADATA

- Group: RECOVERY AND FAILURE
- Playbook ID: BDG-021
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--recovery-and-failure/003-dead-session.md`
