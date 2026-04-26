---
title: "BDG-004 -- Session stop"
description: "This scenario validates bdg session termination for `BDG-004`. It focuses on confirming `bdg stop` cleanly terminates an active session and no Chrome processes leak."
---

# BDG-004 -- Session stop

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-004`.

---

## 1. OVERVIEW

This scenario validates bdg session termination for `BDG-004`. It focuses on confirming `bdg stop` cleanly terminates an active session, that subsequent `bdg status` reports no active session, and that no Chrome browser processes leak.

### Why This Matters

Without proper cleanup, repeated bdg sessions leak browser processes that consume RAM and may interfere with new sessions. This scenario establishes the cleanup contract; BDG-022 (cleanup leak detection) confirms the destructive consequence of skipping it.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BDG-004` and confirm the expected signals without contradictory evidence.

- Objective: Verify `bdg stop` exits 0; subsequent `bdg status` shows no active session; no leaked Chrome processes attributable to bdg.
- Real user request: `"Stop my debug session and clean up."`
- Prompt: `As a manual-testing orchestrator, stop the active bdg session through the bdg CLI against an active session. Verify subsequent bdg status reports no active session. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: assumes active session from BDG-002; run stop; verify status; check for leaked processes.
- Expected signals: stop exits 0; status shows no active session; `pgrep -fl chrome` does not show bdg-launched Chrome processes (or count returns to baseline).
- Desired user-visible outcome: A short report confirming cleanup with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if stop errors or session persists or leaked processes detected.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, stop the active bdg session through the bdg CLI against an active session. Verify subsequent bdg status reports no active session. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. Precondition: BDG-002 has started a session
2. `bash: pgrep -fl chrome | wc -l` — baseline post-session Chrome process count
3. `bash: bdg stop`
4. `bash: bdg status 2>&1`
5. `bash: pgrep -fl chrome | wc -l` — post-stop count

### Expected

- Step 3: exits 0; may print confirmation
- Step 4: status output indicates no active session
- Step 5: count <= step 2 count (no new processes leaked; ideally count decreases)

### Evidence

Capture all command outputs and process counts.

### Pass / Fail

- **Pass**: stop exit 0 AND no active session reported AND process count not increased.
- **Fail**: stop errors (session may have been stale already — check BDG-021); active session persists; process count grew (something failed to clean up).

### Failure Triage

1. If stop errors with "no active session": cross-reference BDG-021 (dead session); session may have already terminated externally.
2. If `bdg status` still shows active after stop: the state file may be stale — check `~/.bdg/` or equivalent and remove manually if needed.
3. If process count grew despite stop: identify the leaked Chrome process via `pgrep -fl chrome` output; kill manually with `pkill -f "chrome.*--remote-debugging"` (cross-reference BDG-022).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | bdg stop semantics + cleanup |

---

## 5. SOURCE METADATA

- Group: CLI BDG LIFECYCLE
- Playbook ID: BDG-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cli-bdg-lifecycle/004-session-stop.md`
