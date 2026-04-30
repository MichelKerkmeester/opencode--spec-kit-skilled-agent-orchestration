---
title: "CP-010 -- `@Explore` read-only codebase mapping"
description: "This scenario validates the `@Explore` built-in agent's read-only codebase exploration for `CP-010`. It focuses on confirming the agent prefix produces a structured map of real reference files without mutating the working tree."
---

# CP-010 -- `@Explore` read-only codebase mapping

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-010`.

---

## 1. OVERVIEW

This scenario validates the `@Explore` built-in agent for `CP-010`. It focuses on confirming `As @Explore: ...` produces a read-only architectural summary that names real local reference files without mutating the working tree.

### Why This Matters

`@Explore` is the documented read-only agent in `references/agent_delegation.md` §3, it is the default route for "UNDERSTAND CODE" tasks per the routing decision guide. If the agent prefix is silently ignored (e.g. Copilot treats it as plain text and proceeds with general-purpose generation that might write files), every onboarding/discovery delegation breaks the read-only contract. Verifying the agent names real cli-copilot reference files (not invented file names) is the cheapest objective check.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-010` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `As @Explore: ...` produces a read-only exploration that names real reference files from `references/` without mutating the working tree
- Real user request: `Use Copilot's @Explore agent to map the cli-copilot references/ folder so I can see what's in it without opening every file myself.`
- RCAF Prompt: `As a cross-AI orchestrator using Copilot agent routing, dispatch the @Explore agent against the cli-copilot skill in this repository to produce a structured map of the references/ folder. Verify the answer names at least three real reference files with a one-line purpose for each, and that the working tree is unchanged after the call. Return a concise pass/fail verdict with the main reason and the names of the files Copilot cited.`
- Expected execution process: orchestrator captures pre-call tripwire, dispatches the `@Explore` prompt with `--allow-all-tools` (read-only access still benefits from disabling approval prompts for read tools), then verifies the response cites real files and the working tree is unchanged
- Expected signals: `EXIT=0`. Response names at least 3 of (`cli_reference.md`, `copilot_tools.md`, `agent_delegation.md`, `integration_patterns.md`). `git status --porcelain` diff is empty
- Desired user-visible outcome: PASS verdict + a 3-5 line summary listing the cited reference files and their purposes
- Pass/fail: PASS if EXIT=0 AND >= 3 real reference filenames cited AND tripwire diff is empty. FAIL if Copilot invents file names, cites < 3 real files or mutates the project tree

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate @Explore actually reads the real references/ folder and returns a structured map".
2. Stay local: this is a direct CLI dispatch with the `@Explore` agent prefix. Read-only access is implied by the agent role.
3. Capture a pre-call tripwire.
4. Dispatch the `@Explore` prompt with `--allow-all-tools` so Copilot can read files without approval prompts.
5. Verify cited filenames are real (cross-check against the actual references/ folder), confirm tripwire diff is empty, return a one-line verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-010 | `@Explore` read-only codebase mapping | Confirm `As @Explore: ...` produces a read-only exploration naming >= 3 real reference files without mutating the working tree | `As a cross-AI orchestrator using Copilot agent routing, dispatch the @Explore agent against the cli-copilot skill in this repository to produce a structured map of the references/ folder. Verify the answer names at least three real reference files with a one-line purpose for each, and that the working tree is unchanged after the call. Return a concise pass/fail verdict with the main reason and the names of the files Copilot cited.` | 1. `bash: git status --porcelain > /tmp/cp-010-pre.txt && ls .opencode/skill/cli-copilot/references/ > /tmp/cp-010-real-files.txt` -> 2. `bash: copilot -p "As @Explore: examine .opencode/skill/cli-copilot/references/ and produce a structured map listing every file in that folder with a one-sentence purpose for each. Read-only — do not write or modify any files." --allow-all-tools 2>&1 \| tee /tmp/cp-010-out.txt` -> 3. `bash: git status --porcelain > /tmp/cp-010-post.txt && diff /tmp/cp-010-pre.txt /tmp/cp-010-post.txt && for f in cli_reference.md copilot_tools.md agent_delegation.md integration_patterns.md; do grep -c "$f" /tmp/cp-010-out.txt; done` | Step 1: pre-tripwire captured, real file list snapshotted; Step 2: EXIT=0, transcript names reference files; Step 3: tripwire diff empty, grep counts show >= 3 of the 4 expected reference filenames appear at least once | `/tmp/cp-010-out.txt` (transcript) + `/tmp/cp-010-real-files.txt` (ground-truth file list) + `/tmp/cp-010-pre.txt` and `/tmp/cp-010-post.txt` (tripwire pair) + per-file grep counts | PASS if EXIT=0 AND >= 3 of the 4 expected filenames have grep count >= 1 AND tripwire diff is empty; FAIL if < 3 real files cited (Copilot invented names), tripwire diff non-empty, or call errors | 1. If Copilot invents file names, verify the active model can read the local filesystem (older agent versions may hallucinate without explicit `read_file` tool access); 2. If tripwire diff non-empty, this is a SECURITY-grade defect — `@Explore` should be read-only by definition; halt and file an issue; 3. If grep count is 0 across all expected files, verify the agent prefix syntax is `As @Explore:` (not `@Explore` alone) per agent_delegation.md §2 |

### Optional Supplemental Checks

After PASS, sanity-check that Copilot's per-file purposes actually match the documented role (e.g. `cli_reference.md` should be described as a flag/command reference, not as a tutorial). A wildly mismatched purpose suggests the agent skimmed file names without reading content, flag for follow-up review.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, §3 Copilot CLI Agent Delegation row "Codebase Exploration: @Explore" |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/agent_delegation.md` | §3 Copilot CLI Agent Catalog and §4 @Explore details |
| `../../references/copilot_tools.md` | §3 four-way comparison documents Copilot agent surface |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CP-010
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--agent-routing/001-explore-agent-codebase-mapping.md`
