---
title: "CC-024 -- Speckit agent spec folder workflow"
description: "This scenario validates Speckit agent spec folder workflow for `CC-024`. It focuses on confirming `--agent speckit` produces a Level 1 spec folder scaffolding plan."
---

# CC-024 -- Speckit agent spec folder workflow

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CC-024`.

---

## 1. OVERVIEW

This scenario validates Speckit agent spec folder workflow for `CC-024`. It focuses on confirming `--agent speckit` produces a Level 1 spec folder scaffolding plan that names the canonical files (spec.md, plan.md, tasks.md, implementation-summary.md) and the documentation level appropriate for the requested feature scope.

### Why This Matters

The `speckit` agent is the documented spec-folder specialist on the Claude Code side per SKILL.md §3 Agent Routing Table. When an external orchestrator delegates spec-folder creation to Claude Code, the speckit agent's output must include the canonical Level-N file list and a level recommendation. If the output omits required files or recommends the wrong level for the scope, downstream Gate-3 governance breaks because the spec folder lacks its mandatory artifacts.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-024` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--agent speckit` produces a spec-folder scaffolding plan that names the appropriate documentation level and lists the required canonical files for that level.
- Real user request: `Help me scaffold a spec folder for a tiny CLI flag addition. Less than 100 lines of code change. Pick the right level and tell me which files I need.`
- Prompt: `As an external-AI conductor preparing a spec folder for a small feature, dispatch claude -p --agent speckit and ask for a Level recommendation plus a file list. Verify the response names a documentation level (1, 2, or 3), lists the required canonical files for that level (spec.md, plan.md, tasks.md, implementation-summary.md at minimum), and explains the level choice in one sentence. Return a verdict naming the level, the files, and the rationale.`
- Expected execution process: External-AI orchestrator describes a small feature (under 100 LOC), dispatches with `--agent speckit`, captures the recommendation, then validates the level choice plus canonical file list.
- Expected signals: Response names a documentation level explicitly (Level 1, 2, or 3). Lists at least 4 canonical files (spec.md, plan.md, tasks.md, implementation-summary.md). Provides level rationale tied to LOC or risk. Surfaces the spec-folder path convention (`.opencode/specs/[###-short-name]/`).
- Desired user-visible outcome: A scaffolding plan the operator can hand to a follow-up dispatch that creates the actual spec folder.
- Pass/fail: PASS if response names a level, lists >= 4 canonical files, and provides rationale. FAIL if level is missing or fewer than 4 files are named.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Define the synthetic feature scope (e.g., "add --verbose flag, under 50 LOC").
3. Dispatch with `--agent speckit` and a prompt asking for level plus file list.
4. Verify the response names a level, lists required files, and provides rationale.
5. Return a verdict naming the level, files, and rationale.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-024 | Speckit agent spec folder workflow | Confirm `--agent speckit` produces a spec-folder scaffolding plan with level plus canonical file list | `As an external-AI conductor preparing a spec folder for a small feature (add a --verbose flag, under 50 LOC), dispatch claude -p --agent speckit and ask for a Level recommendation plus the canonical file list for that level. Verify the response names a documentation level (1, 2, or 3), lists at least 4 canonical files (spec.md, plan.md, tasks.md, implementation-summary.md), and explains the level choice in one sentence. Return a verdict naming the level, the files, and the rationale.` | 1. `bash: claude -p "Scaffold a spec folder for a small feature: add a --verbose flag to a CLI tool, under 50 lines of code change. Recommend a documentation level (1, 2, or 3), list the canonical files for that level, and explain the level choice in one sentence." --agent speckit --output-format text 2>&1 \| tee /tmp/cc-024-output.txt` -> 2. `bash: grep -ciE 'level [123]\|level-1\|level-2\|level-3' /tmp/cc-024-output.txt` -> 3. `bash: grep -ciE '(spec\.md\|plan\.md\|tasks\.md\|implementation-summary\.md)' /tmp/cc-024-output.txt` -> 4. `bash: grep -ciE '(loc\|lines of code\|risk\|complexity)' /tmp/cc-024-output.txt` | Step 1: response captured; Step 2: count of level mentions >= 1; Step 3: count of canonical-file mentions >= 4; Step 4: count of rationale-keyword mentions >= 1 | `/tmp/cc-024-output.txt`, terminal grep counts | PASS if response names a level, lists >= 4 canonical files, and provides rationale; FAIL if level is missing or fewer than 4 files are named or rationale is absent | 1. If the level is missing, refine the prompt to require an explicit "Level: N" line and re-dispatch; 2. If fewer than 4 files are named, prompt for the canonical Level 1 minimum file list; 3. If `--agent speckit` is rejected, run `claude agents list` to confirm the agent is registered |

### Optional Supplemental Checks

If the rationale is too thin, ask for an explicit decision table mapping the feature scope (LOC, risk) to the recommended level. The system-spec-kit reference contains the canonical Level-N decision table and `speckit` should be able to reproduce it.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` | Speckit agent role per the documented roster |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` (line 216) | Documents the speckit agent in the §3 Agent Routing Table |
| `../../references/agent_delegation.md` | Agent contract for spec-folder workflows |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CC-024
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--agent-routing/008-speckit-agent-spec-folder.md`
