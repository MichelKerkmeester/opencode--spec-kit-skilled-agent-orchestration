---
title: "CC-011 -- Context agent codebase exploration"
description: "This scenario validates Context agent codebase exploration for `CC-011`. It focuses on confirming `--agent context --permission-mode plan` produces a structured architecture map in read-only mode."
---

# CC-011 -- Context agent codebase exploration

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-011`.

---

## 1. OVERVIEW

This scenario validates Context agent codebase exploration for `CC-011`. It focuses on confirming `--agent context --permission-mode plan` produces a structured architecture map in read-only mode.

### Why This Matters

The `context` agent is the canonical read-only explorer for the cli-claude-code skill. ALWAYS rule 8 in SKILL.md routes "understand code" intents to `--agent context`. If the agent dispatch silently falls back to a generic prompt or fails to enforce read-only behavior, every "explain this codebase" cross-AI workflow loses its safety story.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-011` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--agent context --permission-mode plan` produces a structured architecture map of a target directory in read-only mode.
- Real user request: `Use Claude Code to give me an architecture map of the auth services - I'm new to this codebase and want entry points, dependencies, and key patterns. Read-only.`
- Prompt: `As an external-AI conductor needing to understand an unfamiliar module before implementing a change, dispatch claude -p --agent context --permission-mode plan against @./src/services/ (or any non-trivial source directory) and capture the architecture map. Verify the response identifies entry points, key modules, dependency flow, and notable patterns, and that no file writes occur. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: External-AI orchestrator picks a real source directory in the repo (e.g., `.opencode/skill/cli-claude-code/`), captures all file mtimes as a baseline, dispatches with `--agent context --permission-mode plan`, then verifies mtimes are unchanged and the response is structured.
- Expected signals: Response identifies entry points and key modules by name. Describes dependency flow or import relationships. Mentions notable patterns or conventions. Target directory's file mtimes are unchanged after the run.
- Desired user-visible outcome: Verdict naming the captured architecture summary plus mtime-unchanged confirmation.
- Pass/fail: PASS if response includes entry points, dependency flow and patterns AND no mtimes changed. FAIL if response is generic or any mtime advanced.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Pick a target directory and snapshot mtimes of all files.
3. Dispatch with `--agent context --permission-mode plan`.
4. Re-snapshot mtimes and diff.
5. Return a verdict naming the structural elements found and the mtime status.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-011 | Context agent codebase exploration | Confirm `--agent context --permission-mode plan` produces a read-only architecture map | `As an external-AI conductor needing to understand an unfamiliar module before implementing a change, dispatch claude -p --agent context --permission-mode plan against @./src/services/ (or any non-trivial source directory) and capture the architecture map. Verify the response identifies entry points, key modules, dependency flow, and notable patterns, and that no file writes occur. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: find .opencode/skill/cli-claude-code -type f -name '*.md' -exec stat -f '%m %N' {} \; \| sort > /tmp/cc-011-mtimes-before.txt` -> 2. `bash: claude -p "Analyze the architecture of @./.opencode/skill/cli-claude-code/. Identify entry points, key modules, dependency flow between SKILL.md, references/, and assets/, and notable conventions or patterns." --agent context --permission-mode plan --output-format text 2>&1 \| tee /tmp/cc-011-output.txt` -> 3. `bash: find .opencode/skill/cli-claude-code -type f -name '*.md' -exec stat -f '%m %N' {} \; \| sort > /tmp/cc-011-mtimes-after.txt` -> 4. `bash: diff /tmp/cc-011-mtimes-before.txt /tmp/cc-011-mtimes-after.txt && echo OK_UNCHANGED` -> 5. `bash: grep -iE '(entry point\|dependency\|pattern\|module)' /tmp/cc-011-output.txt \| wc -l` | Step 1: mtime baseline captured; Step 2: response identifies SKILL.md as the entry, references and assets as supporting docs; Step 3: mtime after captured; Step 4: `OK_UNCHANGED` printed (no diffs); Step 5: count of structural keyword mentions >= 3 | `/tmp/cc-011-output.txt`, `/tmp/cc-011-mtimes-before.txt`, `/tmp/cc-011-mtimes-after.txt` | PASS if response identifies entry points, dependencies, and patterns AND no mtime changes; FAIL if response is generic or any mtime advances | 1. If response is too generic, try a smaller, more targeted directory (e.g., `references/` only) and re-run; 2. If mtime changes, immediately verify which file changed and why - this is a critical safety regression; 3. If `--agent context` is rejected with "agent not found", run `claude agents list` to confirm the agent is registered |

### Optional Supplemental Checks

If the structural keyword count is low but the response is otherwise good, the prompt may be too vague. Re-run with the explicit "identify entry points, dependencies and patterns" structure from the example in `references/agent_delegation.md` section 4.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` | Context agent details (section 4) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | ALWAYS rule 8 (route to appropriate agent) and Agent Routing Table in section 3 |
| `../../references/agent_delegation.md` | Routing decision guide (section 5) |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CC-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--agent-routing/001-context-agent-codebase-exploration.md`
