---
title: "CG-010 -- @context agent for codebase exploration"
description: "This scenario validates routing a read-only exploration task to the Gemini `@context` agent for `CG-010`. It focuses on confirming the `As @context agent:` prefix produces a structured, evidence-backed exploration that names real files without modifying anything."
---

# CG-010 -- @context agent for codebase exploration

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CG-010`.

---

## 1. OVERVIEW

This scenario validates the `@context` agent routing for `CG-010`. It focuses on confirming the documented `As @context agent: ...` prefix produces an evidence-backed read-only exploration that names real files from the targeted area, with no file mutations and no shell commands executed against the project.

### Why This Matters

`@context` is cli-gemini's first-line delegation for unfamiliar codebase exploration. It is intended to be strictly read-only (per `references/agent_delegation.md` §3, Modifies files: Never). If the routing prefix silently degrades into a generic Gemini call that uses write tools, the orchestrator loses the safety contract that justifies using `@context` at all.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CG-010` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `As @context agent: ...` produces a structured exploration that names at least three real files in the targeted area AND no file modifications occur in the project tree
- Real user request: `Have Gemini's @context agent map the references folder of the cli-gemini skill so I know what each reference doc actually covers — read-only, don't change anything.`
- Prompt: `As a cross-AI orchestrator using Gemini agent routing, dispatch the @context agent against the cli-gemini skill in this repository to produce a structured map of the references/ folder. Verify the answer names at least three real reference files with a one-line purpose for each, and that the working tree is unchanged after the call. Return a concise pass/fail verdict with the main reason and the names of the files Gemini cited.`
- Expected execution process: orchestrator runs a `git status` tripwire, dispatches the `@context` call with `--include-directories` scoped to the references folder and verifies the response cites real file names while the working tree is unchanged
- Expected signals: command exits 0. Response names at least three of the cli-gemini reference files (`cli_reference.md`, `integration_patterns.md`, `gemini_tools.md`, `agent_delegation.md`), each named file has a one-line purpose and `git status --porcelain` diff is empty
- Desired user-visible outcome: PASS verdict + a 3-5 line summary listing the cited reference files and their purposes
- Pass/fail: PASS if at least three real reference filenames appear in the response AND the working tree is unchanged. FAIL if the response names fewer than three real files, the working tree is mutated or filenames are hallucinated

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the request as "verify @context routing produces evidence-backed read-only exploration".
2. Stay local. This is a direct CLI dispatch with `@<agent>` routing handled by Gemini's agent system.
3. Tripwire `git status --porcelain` before and after the call so any unexpected mutation is caught.
4. Use `--include-directories` to constrain Gemini to the references folder so context is focused and verification is straightforward.
5. Surface the cited filenames in the verdict so the operator can compare against the actual folder contents.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-010 | @context agent for codebase exploration | Confirm `As @context agent:` produces a read-only exploration that names real reference files without mutating the working tree | `As a cross-AI orchestrator using Gemini agent routing, dispatch the @context agent against the cli-gemini skill in this repository to produce a structured map of the references/ folder. Verify the answer names at least three real reference files with a one-line purpose for each, and that the working tree is unchanged after the call. Return a concise pass/fail verdict with the main reason and the names of the files Gemini cited.` | 1. `bash: git -C "$PWD" status --porcelain > /tmp/cg-010-before.txt` -> 2. `bash: gemini "As @context agent: Map the .opencode/skill/cli-gemini/references/ folder. Name each markdown file you find and give a one-line purpose for each based on its title and overview." --include-directories .opencode/skill/cli-gemini/references -m gemini-3.1-pro-preview -o text 2>&1 > /tmp/cg-010.txt; echo EXIT=$?` -> 3. `bash: cat /tmp/cg-010.txt` -> 4. `bash: grep -cE 'cli_reference\.md\|integration_patterns\.md\|gemini_tools\.md\|agent_delegation\.md' /tmp/cg-010.txt` -> 5. `bash: git -C "$PWD" status --porcelain > /tmp/cg-010-after.txt && diff /tmp/cg-010-before.txt /tmp/cg-010-after.txt` | Step 2: `EXIT=0`; Step 3: prints a multi-line response; Step 4: grep count >= 3; Step 5: diff is empty | `/tmp/cg-010.txt` saved + outputs from Steps 3, 4, and 5 | PASS if Step 4 grep count >= 3 AND Step 5 diff is empty AND the response gives a one-line purpose per cited file; FAIL if grep count < 3, diff shows mutations, or filenames are hallucinated | 1. If grep count < 3, re-run with stricter scoping: add `Read each file's frontmatter title before naming it`; 2. If diff shows mutations, the agent prefix did not bind — check for typos in `As @context agent:`; 3. If the response is vague, escalate to `@context` via stronger prompt with explicit `Return a markdown table` formatting hint |

### Optional Supplemental Checks

If you want belt-and-braces, also confirm `.toolCalls` (re-run with `-o json`) shows only read-side tools (`read_file`, `list_directory`, `glob`, `search_file_content`) and no `write_file` or `replace` invocations.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-gemini skill surface (agent routing table in §3 HOW IT WORKS) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/agent_delegation.md` | §3 AGENT CATALOG → @context (read-only contract, tools, max turns) |
| `../../references/cli_reference.md` | §4 COMMAND-LINE FLAGS documents `--include-directories` scoping |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CG-010
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--agent-routing/001-context-agent-exploration.md`
