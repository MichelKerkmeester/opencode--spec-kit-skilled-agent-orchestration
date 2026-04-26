---
title: "CU-002 -- system-cu (UUCP) conflict detection + PATH fix"
description: "This scenario validates UUCP conflict detection for `CU-002`. It focuses on detecting when system `cu` shadows the ClickUp CLI and applying the documented npm-bin-first PATH fix."
---

# CU-002 -- system-cu (UUCP) conflict detection + PATH fix

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-002`.

---

## 1. OVERVIEW

This scenario validates the UUCP conflict detection and PATH-fix recovery for `CU-002`. It focuses on the operator-facing recovery flow when `which -a cu` reveals a system UUCP binary ahead of the ClickUp CLI on `PATH`.

### Why This Matters

UUCP shadowing is the most common install bug for `mcp-clickup` on macOS/Linux. Without a deterministic detection + fix recipe, operators waste time chasing auth errors (`cu auth` against UUCP returns nonsense) and conclude "the CLI is broken" when the install is actually fine. This scenario codifies the documented fix from `INSTALL_GUIDE.md` and verifies it works end-to-end.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CU-002` and confirm the expected signals without contradictory evidence.

- Objective: Detect the UUCP conflict via `which -a cu` and apply the npm-bin-first PATH fix; verify a fresh shell sees the ClickUp version.
- Real user request: `"Why does cu --version say Taylor UUCP instead of ClickUp?"`
- Prompt: `As a manual-testing orchestrator, detect a system-cu (UUCP) conflict and apply the npm-bin-first PATH fix through the shell environment against the local install. Verify the PATH change moves the ClickUp cu ahead of UUCP and a fresh shell sees the ClickUp version. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: list every `cu` on `PATH`, identify UUCP if first, prepend the npm bin to `PATH` in a new shell, re-verify.
- Expected signals: `which -a cu` lists multiple entries; the first one is UUCP; after the PATH fix, `cu --version` returns the ClickUp version string.
- Desired user-visible outcome: A report enumerating the original PATH order, the fix applied, and the resolved version after the fix.
- Pass/fail: PASS if PATH fix moves ClickUp ahead of UUCP and the fresh shell shows ClickUp; FAIL if no UUCP exists (skip, not fail) or if the fix does not change the resolution.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, detect a system-cu (UUCP) conflict and apply the npm-bin-first PATH fix through the shell environment against the local install. Verify the PATH change moves the ClickUp cu ahead of UUCP and a fresh shell sees the ClickUp version. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: which -a cu` — list every `cu` resolution on `PATH`
2. `bash: cu --version 2>&1 | head -1` — capture which version resolves first
3. If step 2 contains "Taylor UUCP", run: `bash: export PATH="$(npm config get prefix)/bin:$PATH" && cu --version 2>&1 | head -1` in a fresh subshell
4. `bash: which cu` — verify the first resolution is now under the npm prefix

### Expected

- Step 1: returns at least one path; if UUCP is installed it appears in the list
- Step 2: identifies whether the current default is UUCP or ClickUp
- Step 3 (if conflict): returns ClickUp version string after the PATH prepend
- Step 4: returns a path under `$(npm config get prefix)/bin`

### Evidence

Capture the verbatim outputs of `which -a cu`, the pre-fix `cu --version`, the PATH-fix command, the post-fix `cu --version`, and the post-fix `which cu`. If no UUCP exists on the system, mark scenario SKIP with the `which -a cu` output as evidence.

### Pass / Fail

- **Pass**: UUCP existed and shadowed ClickUp; PATH fix moved ClickUp to first; fresh `cu --version` reports ClickUp.
- **Fail**: PATH fix did not change resolution (e.g., shadowing alias overrides PATH), OR UUCP was first AFTER the fix.
- **Skip**: No UUCP exists on the system — record `which -a cu` output as evidence and proceed.

### Failure Triage

1. If PATH fix does not change resolution: check for a shell alias `alias | grep cu` and `type cu`; an alias overrides `PATH` lookups regardless of order.
2. If `npm config get prefix` returns an unwritable path: re-install with `npm config set prefix ~/.npm-global` and re-install `@krodak/clickup-cli`; then re-run step 3.
3. If a fresh shell does NOT see the new `PATH`: persist the export to the shell profile per `INSTALL_GUIDE.md` (e.g., `echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.zshrc`) and start a new shell.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/INSTALL_GUIDE.md` | UUCP conflict + PATH fix recipe |
| `.opencode/skill/mcp-clickup/SKILL.md` | Skill identity and CLI primary stance |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (UUCP critical install conflict) |

---

## 5. SOURCE METADATA

- Group: CLI CU INSTALL AND AUTH
- Playbook ID: CU-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cli-cu-install-and-auth/002-system-cu-uucp-conflict.md`
