---
title: "BDG-001 -- Install + version"
description: "This scenario validates the bdg CLI install + version surface for `BDG-001`. It focuses on confirming bdg is on PATH and reports a version string."
---

# BDG-001 -- Install + version

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-001`.

---

## 1. OVERVIEW

This scenario validates the bdg CLI install + version surface for `BDG-001`. It focuses on confirming the `bdg` binary is on the operator's `PATH` and that `bdg --version` returns a non-empty version string.

### Why This Matters

This is the bdg playbook's smoke test. If bdg isn't installed, every other bdg-CLI scenario (BDG-002..BDG-013) fails identically with "command not found." Establishing the version surface up front means the rest of the playbook can assume bdg works.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BDG-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify `command -v bdg` returns a path AND `bdg --version` returns a non-empty version string.
- Real user request: `"Confirm bdg is installed."`
- Prompt: `As a manual-testing orchestrator, confirm bdg is installed and reports its version through the bdg CLI against the local install. Verify command -v bdg returns a path and bdg --version returns a non-empty string. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: run two bash commands; do not delegate.
- Expected signals: `command -v bdg` returns non-empty path; `bdg --version 2>&1` returns version string (semver-like or named version).
- Desired user-visible outcome: A short report quoting the path and version with a PASS verdict.
- Pass/fail: PASS if both signals hold; FAIL if `command -v` returns nothing (not installed) or `--version` errors.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, confirm bdg is installed and reports its version through the bdg CLI against the local install. Verify command -v bdg returns a path and bdg --version returns a non-empty string. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: command -v bdg`
2. `bash: bdg --version 2>&1`

### Expected

- Step 1: returns path (e.g., `/usr/local/bin/bdg` or `/opt/homebrew/bin/bdg`); exit code 0
- Step 2: returns non-empty version string; exit code 0

### Evidence

Capture both command outputs and exit codes.

### Pass / Fail

- **Pass**: bdg path returned AND version string returned.
- **Fail**: `command -v` returns nothing (not installed); `--version` errors (binary corrupted).

### Failure Triage

1. If `command -v bdg` is empty: install with `npm install -g browser-debugger-cli@alpha`; verify Node `node --version` >= 18; check `npm config get prefix` and ensure that path is in `PATH`.
2. If `--version` errors: check `which bdg` — if multiple paths, there may be a stale install; remove with `npm uninstall -g browser-debugger-cli` and reinstall.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | bdg CLI catalog + install reference |

---

## 5. SOURCE METADATA

- Group: CLI BDG LIFECYCLE
- Playbook ID: BDG-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cli-bdg-lifecycle/001-install-version.md`
