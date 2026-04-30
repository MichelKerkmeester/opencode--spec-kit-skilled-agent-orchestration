---
title: "CP-017 -- Shell-wrapper same-invocation context injection (DESTRUCTIVE — sandboxed instructions file)"
description: "This scenario validates the documented `cpx()` shell wrapper and `SPECKIT_COPILOT_INSTRUCTIONS_PATH` override for `CP-017`. It focuses on confirming the wrapper prepends a managed `SPEC-KIT-COPILOT-CONTEXT` block to a `copilot -p` call without touching the operator's real `~/.copilot/copilot-instructions.md`."
---

# CP-017 -- Shell-wrapper same-invocation context injection (DESTRUCTIVE, sandboxed instructions file)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-017`.

---

## 1. OVERVIEW

This scenario validates the documented `cpx()` shell wrapper for `CP-017`. It focuses on confirming the wrapper prepends a managed `SPEC-KIT-COPILOT-CONTEXT` block from a sandboxed instructions file (via `SPECKIT_COPILOT_INSTRUCTIONS_PATH`) into a `copilot -p` invocation, with Copilot recalling the unique marker, all without touching the operator's real `~/.copilot/copilot-instructions.md`.

### Why This Matters

Per SKILL.md §3 Spec Kit Context Parity, Copilot CLI does not receive Spec Kit's startup context through hook stdout the way Claude Code does, the documented workaround is the file-based custom-instructions path plus the `cpx()` wrapper from `assets/shell_wrapper.md` for same-invocation context; if the wrapper silently fails (does not prepend the managed block or worse, writes to the operator's real instructions file), every scripted Copilot dispatch loses its Spec Kit context surface. The `SPECKIT_COPILOT_INSTRUCTIONS_PATH` env override exists precisely so this scenario can be tested without mutating operator state.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-017` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the `cpx()` wrapper prepends a managed `SPEC-KIT-COPILOT-CONTEXT` block from a sandboxed instructions file into a `copilot -p` call, Copilot recalls the unique marker and the operator's real `~/.copilot/copilot-instructions.md` is unchanged
- Real user request: `Source the cpx() wrapper from assets/shell_wrapper.md, point it at a sandbox instructions file with a unique marker, and confirm Copilot picks up the marker in the same invocation. Don't touch my real ~/.copilot/copilot-instructions.md.`
- RCAF Prompt: `As a cross-AI orchestrator validating same-invocation context injection per assets/shell_wrapper.md, source the documented cpx() function, point SPECKIT_COPILOT_INSTRUCTIONS_PATH at /tmp/cp-017-sandbox/copilot-instructions.md containing a documented SPEC-KIT-COPILOT-CONTEXT:BEGIN/END managed block with a unique marker 'CP-017-WRAPPER-MARKER', and dispatch a copilot -p prompt that asks Copilot to repeat any unique markers it sees in its custom instructions. Verify the wrapper prepends the marker into the prompt body, Copilot's answer surfaces the marker, and the operator's real ~/.copilot/copilot-instructions.md is unchanged. Return a concise pass/fail verdict with the main reason and the recalled marker text.`
- Expected execution process: orchestrator captures the operator's real instructions file SHA256 (or notes absence), creates the sandbox instructions file with the documented `SPEC-KIT-COPILOT-CONTEXT:BEGIN/END` markers and the unique marker line, sources the `cpx()` wrapper from the documented path, runs `cpx "..."` with `SPECKIT_COPILOT_INSTRUCTIONS_PATH` overridden to the sandbox file, then verifies the marker appears in Copilot's response and the operator's real file is unchanged
- Expected signals: `EXIT=0`. Sandbox instructions file is unchanged after the call (wrapper only reads). Response surfaces `CP-017-WRAPPER-MARKER`. Tripwire SHA256 of the operator's real `~/.copilot/copilot-instructions.md` is unchanged
- Desired user-visible outcome: PASS verdict + the recalled marker text + a one-line note that the wrapper succeeded without mutating real instructions
- Pass/fail: PASS if EXIT=0 AND response contains `CP-017-WRAPPER-MARKER` AND sandbox instructions file SHA unchanged AND real-instructions file SHA unchanged. FAIL if call errors, marker missing in response, sandbox file mutated or real-instructions SHA changes

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate cpx() wrapper actually injects the sandbox marker into the prompt and Copilot sees it".
2. Stay local: a single CLI dispatch via the wrapper, but with strict env-var sandboxing.
3. Capture tripwire SHAs for both the operator's real instructions file and the sandbox instructions file.
4. Define the sandbox instructions file with the documented marker block, source the wrapper, run `cpx`.
5. Verify the marker surfaces in the response, then re-check both tripwire SHAs.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-017 | Shell-wrapper same-invocation context injection | Confirm `cpx()` from `assets/shell_wrapper.md` prepends a sandboxed `SPEC-KIT-COPILOT-CONTEXT` marker into a `copilot -p` call without touching the operator's real instructions file | `As a cross-AI orchestrator validating same-invocation context injection per assets/shell_wrapper.md, source the documented cpx() function, point SPECKIT_COPILOT_INSTRUCTIONS_PATH at /tmp/cp-017-sandbox/copilot-instructions.md containing a documented SPEC-KIT-COPILOT-CONTEXT:BEGIN/END managed block with a unique marker 'CP-017-WRAPPER-MARKER', and dispatch a copilot -p prompt that asks Copilot to repeat any unique markers it sees in its custom instructions. Verify the wrapper prepends the marker into the prompt body, Copilot's answer surfaces the marker, and the operator's real ~/.copilot/copilot-instructions.md is unchanged. Return a concise pass/fail verdict with the main reason and the recalled marker text.` | 1. `bash: REAL_INSTR="$HOME/.copilot/copilot-instructions.md"; if [ -f "$REAL_INSTR" ]; then shasum -a 256 "$REAL_INSTR" > /tmp/cp-017-real-pre.sha; else echo "ABSENT" > /tmp/cp-017-real-pre.sha; fi` -> 2. `bash: rm -rf /tmp/cp-017-sandbox && mkdir -p /tmp/cp-017-sandbox && printf '%s\n' '# Test instructions' '' '<!-- SPEC-KIT-COPILOT-CONTEXT:BEGIN -->' 'Project test marker: CP-017-WRAPPER-MARKER (spec 048 wave 2)' '<!-- SPEC-KIT-COPILOT-CONTEXT:END -->' '' 'End.' > /tmp/cp-017-sandbox/copilot-instructions.md && shasum -a 256 /tmp/cp-017-sandbox/copilot-instructions.md > /tmp/cp-017-sandbox-pre.sha` -> 3. `bash: cpx() { local prompt="${1:-}"; local instructions_file; local context_block; shift \|\| true; instructions_file="${SPECKIT_COPILOT_INSTRUCTIONS_PATH:-$HOME/.copilot/copilot-instructions.md}"; if [ -f "$instructions_file" ]; then context_block="$(awk '/SPEC-KIT-COPILOT-CONTEXT:BEGIN/{flag=1} flag{print} /SPEC-KIT-COPILOT-CONTEXT:END/{flag=0}' "$instructions_file")"; fi; if [ -n "$context_block" ]; then copilot -p "$context_block\n\n$prompt" "$@"; else copilot -p "$prompt" "$@"; fi; }; export -f cpx; SPECKIT_COPILOT_INSTRUCTIONS_PATH=/tmp/cp-017-sandbox/copilot-instructions.md cpx "Look at any custom instructions or context provided to you; if you see any markers tagged with the prefix 'CP-017-' or any unique alphanumeric markers, quote them back exactly. Be precise, quote any matching marker verbatim." --allow-all-tools 2>&1 \| tee /tmp/cp-017-out.txt; echo "EXIT=$?"` -> 4. `bash: grep -F "CP-017-WRAPPER-MARKER" /tmp/cp-017-out.txt && echo "MARKER_FOUND" \|\| echo "MARKER_MISSING"; shasum -a 256 /tmp/cp-017-sandbox/copilot-instructions.md > /tmp/cp-017-sandbox-post.sha; diff /tmp/cp-017-sandbox-pre.sha /tmp/cp-017-sandbox-post.sha; if [ -f "$REAL_INSTR" ]; then shasum -a 256 "$REAL_INSTR" > /tmp/cp-017-real-post.sha; else echo "ABSENT" > /tmp/cp-017-real-post.sha; fi; diff /tmp/cp-017-real-pre.sha /tmp/cp-017-real-post.sha` | Step 1: real-instructions SHA captured (or ABSENT); Step 2: sandbox instructions written with marker block, sandbox SHA captured; Step 3: EXIT=0, transcript surfaces context block; Step 4: `MARKER_FOUND` printed, sandbox SHA unchanged, real-instructions SHA unchanged | `/tmp/cp-017-out.txt` (cpx transcript) + `/tmp/cp-017-sandbox-pre.sha` and `/tmp/cp-017-sandbox-post.sha` (sandbox tripwire) + `/tmp/cp-017-real-pre.sha` and `/tmp/cp-017-real-post.sha` (operator-state tripwire) | PASS if EXIT=0 AND `MARKER_FOUND` AND sandbox SHA unchanged AND real-instructions SHA unchanged; FAIL if EXIT != 0, marker missing, sandbox file mutated, or real-instructions SHA changes | 1; if marker is missing, verify the awk extraction in cpx() correctly captured the BEGIN/END block from the sandbox file (echo `$context_block` for debugging). 2; if real-instructions SHA changes, this is a SECURITY-grade defect, the wrapper wrote outside the sandboxed env override. Halt the wave. 3; if sandbox file mutated, the wrapper inadvertently writes when it should only read |

### Optional Supplemental Checks

After PASS, dump the constructed prompt body before dispatch (echo `$context_block` and `$prompt` separately) to confirm the wrapper actually prepended the marker block as documented in `assets/shell_wrapper.md`. A passing scenario where Copilot sees the marker but the prompt body looks empty suggests Copilot is using cached repo memory rather than reading the wrapper's injection.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, §3 Spec Kit Context Parity references the shell wrapper for same-invocation context |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../assets/shell_wrapper.md` | Documents the `cpx()` function, `SPECKIT_COPILOT_INSTRUCTIONS_PATH` override and the `SPEC-KIT-COPILOT-CONTEXT:BEGIN/END` marker contract |
| `../../references/cli_reference.md` | §8 CONTEXT & REPO MEMORY documents Copilot's instruction-file surface |

---

## 5. SOURCE METADATA

- Group: Integration Patterns
- Playbook ID: CP-017
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--integration-patterns/003-shell-wrapper-context-injection.md`
