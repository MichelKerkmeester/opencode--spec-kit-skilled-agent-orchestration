---
title: "147 -- Constitutional memory manager command"
description: "This scenario validates Constitutional memory manager command for `147`. It focuses on Verify `/memory:learn` flows and active docs all reflect the constitutional-only workflow."
---

# 147 -- Constitutional memory manager command

## 1. OVERVIEW

This scenario validates Constitutional memory manager command for `147`. It focuses on Verify `/memory:learn` flows and active docs all reflect the constitutional-only workflow.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `147` and confirm the expected signals without contradicting evidence.

- Objective: Verify `/memory:learn` flows and active docs all reflect the constitutional-only workflow
- Prompt: `Validate /memory:learn constitutional manager flow and documentation consistency. Capture the evidence needed to prove Constitutional memory manager. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Constitutional memory manager
- Pass/fail: PASS: Default flow shows overview, list/budget expose constitutional inventory, edit/remove guard with file discovery, active docs describe constitutional memory management; FAIL: `/memory:learn` missing-arg prompts instead of overview, active docs still describe legacy learning/corrections workflow

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 147 | Constitutional memory manager command | Verify `/memory:learn` flows and active docs all reflect the constitutional-only workflow | `Validate /memory:learn constitutional manager flow and documentation consistency. Capture the evidence needed to prove Constitutional memory manager. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Invoke `/memory:learn` with no arguments and verify it shows the overview dashboard with action hints instead of prompting for missing input 2) Invoke `/memory:learn list` and verify constitutional files plus aggregate budget are shown 3) Invoke `/memory:learn budget` and verify per-file and total budget usage are shown against the shared `~2000` token limit 4) Invoke `/memory:learn edit` with no filename and verify available constitutional files are listed before the command waits for a selection 5) Invoke `/memory:learn remove` with no filename and verify the same guarded selection flow occurs before destructive confirmation 6) Run `rg -n "/memory:learn | Constitutional memory manager | constitutional memories" .opencode/command/README.txt .opencode/command/memory/README.txt .opencode/command/memory/search.md .opencode/command/spec_kit/debug.md .opencode/command/spec_kit/complete.md README.md .opencode/README.md .opencode/agent/speckit.md` and confirm no active doc describes `/memory:learn` as the retired learning/corrections command | Default flow shows overview instead of a missing-argument prompt; list and budget flows expose constitutional inventory and shared-budget data; edit/remove missing-arg flows guard with file discovery; active docs consistently describe constitutional memory management rather than legacy explicit-learning capture |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/13-constitutional-memory-manager-command.md](../../feature_catalog/16--tooling-and-scripts/13-constitutional-memory-manager-command.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 147
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/147-constitutional-memory-manager-command.md`
