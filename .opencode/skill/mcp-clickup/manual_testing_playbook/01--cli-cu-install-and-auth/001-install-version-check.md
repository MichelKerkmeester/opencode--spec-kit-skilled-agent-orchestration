---
title: "CU-001 -- Install + version check (verify ClickUp, not UUCP)"
description: "This scenario validates ClickUp CLI install for `CU-001`. It focuses on confirming `cu --version` shows ClickUp and NOT 'Taylor UUCP', which is the most common install pitfall on macOS/Linux."
---

# CU-001 -- Install + version check (verify ClickUp, not UUCP)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-001`.

---

## 1. OVERVIEW

This scenario validates the ClickUp CLI install for `CU-001`. It focuses on confirming `cu --version` returns the ClickUp CLI version and that the resolved binary is the one shipped by `@krodak/clickup-cli`, not the system UUCP utility.

### Why This Matters

On macOS/Linux a system `cu` (Taylor UUCP, the Unix-to-Unix Copy utility) frequently shadows the ClickUp CLI on `PATH`. If the wrong binary resolves first, every subsequent `cu` scenario in this playbook silently routes to UUCP, producing confusing errors and false negatives. This scenario is the entry-point smoke test for the entire CU playbook and gates Wave 1; a FAIL here blocks every later scenario.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify `command -v cu` returns a non-empty path; `cu --version 2>&1 | head -1` returns a string mentioning ClickUp; the resolved path is under `$(npm config get prefix)/bin`.
- Real user request: `"Is the ClickUp CLI installed and ready to use?"`
- Prompt: `As a manual-testing orchestrator, confirm cu is installed and reports its version through the cu CLI against the local install. Verify command -v cu returns a path under the npm prefix and cu --version 2>&1 | head -1 shows ClickUp, not Taylor UUCP. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: invoke `command -v cu`, then `cu --version 2>&1 | head -1`, then compare the resolved path with the npm prefix; do not delegate.
- Expected signals: non-empty path; version string contains "ClickUp" (or is a clearly-ClickUp semver tag from `@krodak/clickup-cli`); does NOT contain "Taylor UUCP".
- Desired user-visible outcome: A short report listing the resolved path, the version string, and a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if no path resolves, the version string mentions UUCP, or the path is not under the npm prefix.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, confirm cu is installed and reports its version through the cu CLI against the local install. Verify command -v cu returns a path under the npm prefix and cu --version 2>&1 | head -1 shows ClickUp, not Taylor UUCP. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: command -v cu` — capture the resolved binary path
2. `bash: cu --version 2>&1 | head -1` — capture the first line of the version output
3. `bash: npm config get prefix` — capture the npm prefix for comparison
4. Compare: the path from step 1 should start with the prefix from step 3 followed by `/bin/`

### Expected

- Step 1: returns a non-empty path
- Step 2: returns a version string mentioning ClickUp; does NOT contain the substring "Taylor UUCP"
- Step 3: returns the npm install prefix path
- Step 4: the binary path lives under the npm prefix

### Evidence

Capture the verbatim output of `command -v cu`, `cu --version 2>&1 | head -1`, and `npm config get prefix`, and the verdict for the path-comparison check.

### Pass / Fail

- **Pass**: All three signals hold — non-empty path, ClickUp-shaped version string, path under npm prefix.
- **Fail**: `command -v cu` returns nothing (CLI not installed), version string contains "Taylor UUCP" (system-cu shadowing), or path is not under the npm prefix (different install method that may break documented flows).

### Failure Triage

1. If `command -v cu` returns nothing: install via `npm install -g @krodak/clickup-cli`; verify Node `node --version` returns >= 22 (required by the package); re-run step 1.
2. If version string contains "Taylor UUCP": route to CU-002 (system-cu conflict + PATH fix) — the npm-installed CLI is present but shadowed by `/usr/bin/cu` or similar.
3. If path is not under the npm prefix: check `which -a cu` for multiple resolutions; verify which install path was used; if a Homebrew or other package manager installed a different `cu`, prefer the npm one per the install guide at `.opencode/skill/mcp-clickup/INSTALL_GUIDE.md`.

### Optional Supplemental Checks

- If `cu --version` is slow (> 2 seconds): note timing in evidence; not a fail but a regression signal.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | Skill identity and CLI primary stance |
| `.opencode/skill/mcp-clickup/INSTALL_GUIDE.md` | Full install steps including UUCP guard |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (mcp-clickup) |

---

## 5. SOURCE METADATA

- Group: CLI CU INSTALL AND AUTH
- Playbook ID: CU-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cli-cu-install-and-auth/001-install-version-check.md`
