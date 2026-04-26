---
title: "CP-013 -- Repository memory recall (DESTRUCTIVE — sandboxed `HOME`)"
description: "This scenario validates Copilot's documented repository-memory persistence for `CP-013`. It focuses on confirming a project convention saved in one `-p` invocation can be recalled in a follow-up call inside a sandboxed `HOME`, without touching the operator's real `~/.copilot/` state."
---

# CP-013 -- Repository memory recall (DESTRUCTIVE, sandboxed `HOME`)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-013`.

---

## 1. OVERVIEW

This scenario validates Copilot's documented repository-memory persistence for `CP-013`. It focuses on confirming a project convention or test marker saved by one `copilot -p` invocation in a sandboxed `HOME` is later recalled by a follow-up invocation, while the operator's real `~/.copilot/` state remains unchanged.

### Why This Matters

"Repository Memory" is one of the four cli-copilot unique capabilities documented in `references/copilot_tools.md` §2, it is the difference between Copilot and stateless CLIs (Gemini, Codex, Claude Code). If memory persistence silently fails (the second call cannot recall what the first call wrote, or memory writes go to the wrong path), every cross-session orchestration loses its continuity story. Sandboxing `HOME` is mandatory: writing the operator's real `~/.copilot/` would mutate persistent operator state across other tools.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-013` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a marker saved in one `copilot -p` invocation (sandboxed `HOME`) is recalled by a follow-up invocation in the same sandboxed `HOME`, without touching the operator's real `~/.copilot/`
- Real user request: `Show me Copilot's repo memory really persists across calls — save a unique test marker, then in a follow-up call ask Copilot to recall it. Don't touch my real ~/.copilot.`
- Prompt: `As a cross-AI orchestrator running an isolated repo-memory persistence test, invoke Copilot CLI against the cli-copilot skill in this repository with HOME pointed at a disposable sandbox directory. First call: ask Copilot to remember the project convention 'cli-copilot test marker is CP-013-MARKER for spec 048 wave 2'. Second call (in the same sandbox HOME): ask Copilot to recall any project conventions it knows about and report whether the marker is present. Verify the sandbox ~/.copilot/ directory contains memory artifacts after call 1 and call 2 surfaces the marker. Return a concise pass/fail verdict with the main reason and the recalled marker text.`
- Expected execution process: orchestrator captures a SHA256 of the operator's real `~/.copilot/` state (or notes its absence), creates a sandbox `HOME=/tmp/cp-013-home/`, dispatches the save call, captures the resulting sandbox `~/.copilot/` artifacts, dispatches the recall call, then re-checks the operator's real `~/.copilot/` to confirm it is unchanged
- Expected signals: `EXIT_SAVE=0`. Sandbox `~/.copilot/` contains memory artifacts after call 1 (any of `state/`, `memory.json`, `*.db` or equivalent persistence file). `EXIT_RECALL=0`. Recall response surfaces `CP-013-MARKER`. Tripwire SHA256 of the operator's real `~/.copilot/` state is unchanged
- Desired user-visible outcome: PASS verdict reporting the marker was both written and recalled inside the sandbox + the recalled marker text
- Pass/fail: PASS if both calls exit 0 AND sandbox `~/.copilot/` contains artifacts after save AND recall response contains `CP-013-MARKER` AND operator's real `~/.copilot/` SHA is unchanged. FAIL if either call errors, sandbox is empty after save, recall does not surface the marker or the operator's real `~/.copilot/` SHA changes

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate Copilot's repo memory persists across two -p invocations in a sandboxed HOME, with strict tripwire on the operator's real state".
2. Stay local: two sequential CLI dispatches with `HOME` overridden to a sandbox directory.
3. Capture a tripwire SHA256 of the operator's real `~/.copilot/` directory tree (or note absence).
4. Dispatch the save call with the unique marker.
5. Capture sandbox state, dispatch the recall call, verify the marker surfaces, then re-check the operator's real state SHA.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-013 | Repository memory recall | Confirm a marker saved in one `copilot -p` invocation (sandboxed `HOME`) is recalled by a follow-up invocation, without touching the operator's real `~/.copilot/` | `As a cross-AI orchestrator running an isolated repo-memory persistence test, invoke Copilot CLI against the cli-copilot skill in this repository with HOME pointed at a disposable sandbox directory. First call: ask Copilot to remember the project convention 'cli-copilot test marker is CP-013-MARKER for spec 048 wave 2'. Second call (in the same sandbox HOME): ask Copilot to recall any project conventions it knows about and report whether the marker is present. Verify the sandbox ~/.copilot/ directory contains memory artifacts after call 1 and call 2 surfaces the marker. Return a concise pass/fail verdict with the main reason and the recalled marker text.` | 1. `bash: REAL_HOME_DOT="$HOME/.copilot"; if [ -d "$REAL_HOME_DOT" ]; then find "$REAL_HOME_DOT" -type f -exec shasum -a 256 {} + 2>/dev/null \| sort > /tmp/cp-013-real-pre.sha; else echo "ABSENT" > /tmp/cp-013-real-pre.sha; fi` -> 2. `bash: rm -rf /tmp/cp-013-home && mkdir -p /tmp/cp-013-home` -> 3. `bash: HOME=/tmp/cp-013-home copilot -p "Please remember this project convention going forward: cli-copilot test marker is CP-013-MARKER for spec 048 wave 2. Save it to your repository memory so a future call can recall it." --allow-all-tools 2>&1 \| tee /tmp/cp-013-save.txt; echo "EXIT_SAVE=$?"; find /tmp/cp-013-home -type f 2>/dev/null \| head -50 > /tmp/cp-013-sandbox-files.txt; cat /tmp/cp-013-sandbox-files.txt \| wc -l` -> 4. `bash: HOME=/tmp/cp-013-home copilot -p "Recall any project conventions or test markers you have stored in your repository memory and report them verbatim. If a CP-013 marker is present, quote it exactly." --allow-all-tools 2>&1 \| tee /tmp/cp-013-recall.txt; echo "EXIT_RECALL=$?"; grep -F "CP-013-MARKER" /tmp/cp-013-recall.txt && echo "MARKER_FOUND" \|\| echo "MARKER_MISSING"` -> 5. `bash: if [ -d "$REAL_HOME_DOT" ]; then find "$REAL_HOME_DOT" -type f -exec shasum -a 256 {} + 2>/dev/null \| sort > /tmp/cp-013-real-post.sha; else echo "ABSENT" > /tmp/cp-013-real-post.sha; fi && diff /tmp/cp-013-real-pre.sha /tmp/cp-013-real-post.sha` | Step 1: real `~/.copilot/` SHA captured (or ABSENT marker); Step 3: EXIT_SAVE=0, sandbox file count > 0; Step 4: EXIT_RECALL=0, `MARKER_FOUND` printed; Step 5: real `~/.copilot/` tripwire diff is empty | `/tmp/cp-013-save.txt` (save transcript) + `/tmp/cp-013-recall.txt` (recall transcript) + `/tmp/cp-013-sandbox-files.txt` (sandbox file inventory) + `/tmp/cp-013-real-pre.sha` and `/tmp/cp-013-real-post.sha` (operator-state tripwire) | PASS if EXIT_SAVE=0 AND EXIT_RECALL=0 AND sandbox file count > 0 AND `MARKER_FOUND` AND real-`~/.copilot/` SHA unchanged; FAIL if either EXIT != 0, sandbox empty after save, marker missing in recall, or real-state SHA changes | 1. If sandbox is empty after save, verify Copilot's memory-write path actually honours `HOME` overrides (some tools hardcode `~/.copilot`); 2. If recall does not surface the marker but sandbox has files, the memory format may have changed — inspect the file contents manually; 3. If real-`~/.copilot/` SHA changes, this is a SECURITY-grade defect — Copilot wrote outside the sandboxed HOME; halt the wave and file an issue |

### Optional Supplemental Checks

After PASS, additionally verify the recall call accurately quotes the **full** marker text including the spec context (`for spec 048 wave 2`), not just the bare `CP-013-MARKER` token. Partial recall suggests Copilot is using a fuzzy similarity match rather than verbatim memory storage.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, §3 Unique Copilot Capabilities row "Repo Memory" |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/copilot_tools.md` | §2 Repository Memory unique capability documentation |
| `../../references/cli_reference.md` | §8 CONTEXT & REPO MEMORY section documents the persistence surface |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: CP-013
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `05--session-continuity/001-repository-memory-recall.md`
