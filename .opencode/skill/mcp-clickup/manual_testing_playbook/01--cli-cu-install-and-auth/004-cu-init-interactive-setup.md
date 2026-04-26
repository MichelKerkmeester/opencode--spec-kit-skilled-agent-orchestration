---
title: "CU-004 -- cu init interactive setup walkthrough"
description: "This scenario validates `cu init` for `CU-004`. It focuses on the interactive token + team-ID configuration flow that produces a usable CLI config."
---

# CU-004 -- cu init interactive setup walkthrough

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-004`.

---

## 1. OVERVIEW

This scenario validates `cu init` for `CU-004`. It focuses on the operator-facing interactive setup path that captures a ClickUp API token and team ID and writes a usable CLI config.

### Why This Matters

`cu init` is the on-ramp for first-time users and the recovery path when CU-003 (auth) fails. If the interactive walkthrough does not collect both the API token and the team ID, or writes the config to a path the CLI does not later read, every downstream scenario fails with auth errors. This scenario locks the contract that `cu init` followed by `cu spaces` should immediately succeed.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-004` and confirm the expected signals without contradictory evidence.

- Objective: Walk through `cu init` against a fresh / blank config slot and confirm the result allows `cu spaces` to succeed without further configuration.
- Real user request: `"How do I set up the ClickUp CLI from scratch?"`
- Prompt: `As a manual-testing orchestrator, walk through cu init with a fresh config slot through the cu CLI against the local config directory. Verify the resulting config lets a follow-up cu spaces succeed. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: back up any existing config, invoke `cu init`, supply token (`pk_xxx`) and team ID (numeric), confirm `cu spaces` exits 0 immediately after.
- Expected signals: `cu init` prompts for both token and team ID; the resulting config file exists; `cu spaces` returns at least one space.
- Desired user-visible outcome: A short report capturing the prompts asked, the config-file path written, and a PASS verdict.
- Pass/fail: PASS if `cu init` collects both inputs AND `cu spaces` exits 0 immediately after; FAIL if any prompt is missing, the config does not persist, or `cu spaces` fails.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, walk through cu init with a fresh config slot through the cu CLI against the local config directory. Verify the resulting config lets a follow-up cu spaces succeed. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: ls -la ~/.cu* 2>/dev/null || echo "no existing cu config"` — inventory existing CLI config (path is CLI-specific; consult `cu init --help` for the canonical location)
2. `bash: mv ~/.cu_config ~/.cu_config.bak 2>/dev/null || true` — back up any existing config (adjust filename to actual config path)
3. `cu init` — interactive: supply throwaway test token (`pk_xxx`) and team ID
4. `bash: cu spaces 2>&1 | head -5` — verify the new config works
5. `bash: mv ~/.cu_config.bak ~/.cu_config 2>/dev/null || true` — restore original config (adjust filename)

### Expected

- Step 1: lists existing config (if any)
- Step 3: `cu init` prompts for at least token and team ID; writes a config file the CLI subsequently reads
- Step 4: `cu spaces` exits 0 and returns at least one space row
- Step 5: original config restored

### Evidence

Capture the existing-config inventory, the verbatim prompts asked by `cu init` (REDACT the token), the config-file path written, the verbatim `cu spaces` output, and the restore confirmation.

### Pass / Fail

- **Pass**: `cu init` collected both inputs, wrote the config, and `cu spaces` succeeded immediately after.
- **Fail**: Any prompt missing, config not persisted to a path `cu` reads, `cu spaces` failed, OR original config not restored at the end.

### Failure Triage

1. If `cu init` does not prompt for team ID: check the installed CLI version `cu --version`; the prompt set may differ across releases; consult `.opencode/skill/mcp-clickup/INSTALL_GUIDE.md` for the documented prompt set.
2. If `cu spaces` fails after `cu init`: re-check the team ID is numeric (from ClickUp Settings > Workspaces) and the token starts with `pk_` (from ClickUp Settings > Apps > API Token); rerun `cu init` with the corrected values.
3. If `cu init` cannot find a writable config directory: check the user's home dir is writable (`ls -ld ~`) and that the documented config path is not a symlink to a read-only mount.

### Optional Supplemental Checks

- Run `cu auth` (CU-003) immediately after `cu init` to double-confirm the token is valid against the live API.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | CLI primary stance and config flow |
| `.opencode/skill/mcp-clickup/INSTALL_GUIDE.md` | `cu init` walkthrough and config path |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (Setup / preflight) |

---

## 5. SOURCE METADATA

- Group: CLI CU INSTALL AND AUTH
- Playbook ID: CU-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cli-cu-install-and-auth/004-cu-init-interactive-setup.md`
