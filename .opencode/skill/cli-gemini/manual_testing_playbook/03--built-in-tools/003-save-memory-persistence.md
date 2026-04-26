---
title: "CG-008 -- save_memory persistence"
description: "This scenario validates the `save_memory` built-in tool for `CG-008` against a sandboxed memory store. It focuses on confirming Gemini CLI persists a key fact via save_memory and surfaces it again in a follow-up invocation, all isolated from any global memory file."
---

# CG-008 -- save_memory persistence

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CG-008`.

> **DESTRUCTIVE / SANDBOXED SCENARIO**: `save_memory` writes to `.gemini/memory.json`. This scenario isolates that write inside `/tmp/cg-008-sandbox/` (used as `HOME` for the run) so the operator's real `~/.gemini/memory.json` is never modified.

---

## 1. OVERVIEW

This scenario validates the `save_memory` built-in tool for `CG-008`. It focuses on confirming Gemini persists a fact when explicitly told to remember it AND that the same persisted fact is recallable in a follow-up invocation, with the entire test scoped to a disposable `HOME` so production memory is never touched.

### Why This Matters

cli-gemini documents `save_memory` as one of three Gemini-only capabilities. Operators need to verify the tool actually persists data across invocations (rather than acknowledging the request without writing) before they trust it for cross-session decision capture. Sandboxing the memory file prevents test runs from polluting real operator memory.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CG-008` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `save_memory` writes a key fact to a sandboxed memory store AND a follow-up invocation in the same sandbox can recall the persisted fact
- Real user request: `Have Gemini remember a one-line architectural decision and prove it can recall it on the next invocation, but isolate the memory write so it doesn't pollute my actual Gemini memory file.`
- Prompt: `As a cross-AI orchestrator running an isolated memory-persistence test, invoke Gemini CLI against the cli-gemini skill in this repository with HOME pointed at a disposable sandbox directory. First call: ask Gemini to save_memory the fact 'cli-gemini test marker is CG-008-MARKER'. Second call: ask Gemini to read its saved memory and report whether the marker is present. Verify the sandbox memory file exists after call 1 and call 2 surfaces the marker. Return a concise pass/fail verdict with the main reason and the recalled marker text.`
- Expected execution process: orchestrator creates `/tmp/cg-008-sandbox/` as a fake `$HOME`, dispatches a save call, verifies the memory file exists, dispatches a recall call and verifies the marker text appears in the recall response
- Expected signals: save call exits 0. `/tmp/cg-008-sandbox/.gemini/memory.json` exists and contains the marker string. Recall call exits 0 and the response contains `CG-008-MARKER`. The operator's real `~/.gemini/memory.json` is not modified during the test
- Desired user-visible outcome: PASS verdict reporting the marker was both written and recalled inside the sandbox, plus the recalled marker text
- Pass/fail: PASS if the sandbox memory file exists with the marker AND the recall response includes the marker text AND the operator's real memory file is unchanged. FAIL if the file is missing, the marker is absent, the recall response does not surface it or the production memory file is mutated

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the request as "prove save_memory writes and recalls inside a disposable HOME without touching production memory".
2. Stay local. This is a direct CLI dispatch.
3. Snapshot the operator's real `~/.gemini/memory.json` (size + checksum) before the test as a tripwire.
4. Override `HOME` to the sandbox so `save_memory` writes to `/tmp/cg-008-sandbox/.gemini/memory.json` instead of production.
5. Re-snapshot after the test and confirm the production file is unchanged.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-008 | save_memory persistence | Confirm `save_memory` persists a marker in a sandboxed `HOME` and a follow-up invocation recalls it without touching the operator's real memory file | `As a cross-AI orchestrator running an isolated memory-persistence test, invoke Gemini CLI against the cli-gemini skill in this repository with HOME pointed at a disposable sandbox directory. First call: ask Gemini to save_memory the fact 'cli-gemini test marker is CG-008-MARKER'. Second call: ask Gemini to read its saved memory and report whether the marker is present. Verify the sandbox memory file exists after call 1 and call 2 surfaces the marker. Return a concise pass/fail verdict with the main reason and the recalled marker text.` | 1. `bash: rm -rf /tmp/cg-008-sandbox && mkdir -p /tmp/cg-008-sandbox/.gemini && (test -d $HOME/.gemini && rsync -a --exclude="memory.json" "$HOME/.gemini/" /tmp/cg-008-sandbox/.gemini/ 2>/dev/null; true) && (test -f $HOME/.gemini/memory.json && shasum $HOME/.gemini/memory.json > /tmp/cg-008-real-before.txt \|\| echo "no-prod-memory" > /tmp/cg-008-real-before.txt)` -> 2. `bash: HOME=/tmp/cg-008-sandbox gemini "Use save_memory to record this fact exactly: 'cli-gemini test marker is CG-008-MARKER'. Confirm in one sentence that you saved it." --yolo -m gemini-3.1-pro-preview -o text 2>&1 > /tmp/cg-008-save.txt; echo EXIT_SAVE=$?` -> 3. `bash: ls -l /tmp/cg-008-sandbox/.gemini/memory.json && grep -c 'CG-008-MARKER' /tmp/cg-008-sandbox/.gemini/memory.json` -> 4. `bash: HOME=/tmp/cg-008-sandbox gemini "Read your saved memory and tell me whether the cli-gemini test marker is present. Quote the exact marker text if you find it." -m gemini-3.1-pro-preview -o text 2>&1 > /tmp/cg-008-recall.txt; echo EXIT_RECALL=$?` -> 5. `bash: grep -c 'CG-008-MARKER' /tmp/cg-008-recall.txt` -> 6. `bash: (test -f $HOME/.gemini/memory.json && shasum $HOME/.gemini/memory.json > /tmp/cg-008-real-after.txt \|\| echo "no-prod-memory" > /tmp/cg-008-real-after.txt) && diff /tmp/cg-008-real-before.txt /tmp/cg-008-real-after.txt` | Step 2: `EXIT_SAVE=0`; Step 3: file exists, grep count >= 1; Step 4: `EXIT_RECALL=0`; Step 5: grep count >= 1; Step 6: `diff` produces no output | `/tmp/cg-008-save.txt`, `/tmp/cg-008-sandbox/.gemini/memory.json`, `/tmp/cg-008-recall.txt`, the two echoed exit codes, and the diff output | PASS if Steps 3 and 5 both find `CG-008-MARKER` AND Step 6 diff is empty; FAIL if the sandbox file is missing, the marker is absent at either checkpoint, the recall response does not surface it, or the production memory file changed | 1. If `/tmp/cg-008-sandbox/.gemini/memory.json` is missing, re-run Step 2 with `--debug` to see whether `save_memory` was actually invoked (look for the tool name in the debug stream); 2. If the recall response misses the marker but the file contains it, the model declined to surface saved memory — re-prompt with `Use /memory show first`; 3. If the production memory file changed, the `HOME` override did not bind — escalate immediately |

### Optional Supplemental Checks

If you want belt-and-braces, run `find /tmp/cg-008-sandbox -type f` and confirm only the expected `.gemini/memory.json` (and possibly a logs directory) was created.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary (destructive scenario isolation rule) |
| `../../SKILL.md` | cli-gemini skill surface (`save_memory` listed as Unique Gemini Capability in §3) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/gemini_tools.md` | §2 UNIQUE TOOLS → save_memory documents storage location and invocation pattern |
| `../../references/cli_reference.md` | §9 CONFIGURATION FILES documents the `~/.gemini/` directory used by save_memory |

---

## 5. SOURCE METADATA

- Group: Built-in Tools
- Playbook ID: CG-008
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--built-in-tools/003-save-memory-persistence.md`
