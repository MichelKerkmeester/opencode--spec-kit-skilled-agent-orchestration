---
title: "CG-007 -- Codebase investigator architecture analysis"
description: "This scenario validates the `codebase_investigator` built-in tool for `CG-007`. It focuses on confirming Gemini CLI runs a comprehensive architectural analysis against a local skill folder and returns structured findings (modules, dependencies, entry points)."
---

# CG-007 -- Codebase investigator architecture analysis

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CG-007`.

---

## 1. OVERVIEW

This scenario validates the `codebase_investigator` built-in tool for `CG-007`. It focuses on confirming the tool actually fires when explicitly requested, returns a structured architectural summary that names real files and modules and that the JSON envelope records the tool call so the orchestrator can audit the analysis.

### Why This Matters

`codebase_investigator` is one of cli-gemini's primary delegation reasons. It lets the calling AI offload broad architecture mapping to Gemini's larger context window. If the tool silently degrades to scattered `read_file` calls, the orchestrator pays Gemini's CLI overhead without getting the broad architectural analysis it routed to Gemini for.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CG-007` and confirm the expected signals without contradictory evidence.

- Objective: Confirm an explicit `Use codebase_investigator to ...` prompt against the local cli-gemini skill folder returns a structured analysis that names at least three real files from the skill AND records the tool invocation in the JSON envelope
- Real user request: `Have Gemini map out how the cli-gemini skill is structured — what's the entry point, which references it ships with, how do the assets fit in?`
- RCAF Prompt: `As a cross-AI orchestrator onboarding to an unfamiliar skill, invoke Gemini CLI against the cli-gemini skill in this repository and explicitly request the codebase_investigator built-in tool. Verify it returns a structured architectural summary naming the SKILL.md entry point and at least two real files from references/ or assets/, and that the JSON toolCalls array records codebase_investigator. Return a concise pass/fail verdict with the main reason and the named module list.`
- Expected execution process: orchestrator dispatches the JSON-mode call with `--include-directories` scoped to the cli-gemini folder, then verifies `.response` contains specific file paths and `.toolCalls` contains `codebase_investigator`.
- Expected signals: command exits 0, `.response` mentions `SKILL.md` and at least two real files under `references/` or `assets/`, `.toolCalls` contains an entry whose `name` equals `codebase_investigator` and the analysis is more than a single sentence
- Desired user-visible outcome: PASS verdict + a 3-5 line summary identifying SKILL.md as the entry point, the references catalog and the assets catalog
- Pass/fail: PASS if `.response` names SKILL.md plus two real files AND `codebase_investigator` is recorded in `.toolCalls`. FAIL if file names are hallucinated, the tool was not invoked or the response is too thin to qualify as architectural analysis

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the request as "verify codebase_investigator runs and returns evidence-backed architectural analysis".
2. Stay local. cli-gemini orchestrators dispatch directly to the binary.
3. Use `--include-directories .opencode/skill/cli-gemini` so Gemini does not waste context on the rest of the repo.
4. Validate with `jq` that `.toolCalls[].name` includes `codebase_investigator` AND grep `.response` for real file paths to detect hallucinated module names.
5. Surface the named module list in the verdict so the operator can quickly sanity-check the analysis.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-007 | Codebase investigator | Confirm `codebase_investigator` fires for a scoped architecture prompt and the response names real local files | `As a cross-AI orchestrator onboarding to an unfamiliar skill, invoke Gemini CLI against the cli-gemini skill in this repository and explicitly request the codebase_investigator built-in tool. Verify it returns a structured architectural summary naming the SKILL.md entry point and at least two real files from references/ or assets/, and that the JSON toolCalls array records codebase_investigator. Return a concise pass/fail verdict with the main reason and the named module list.` | 1. `bash: gemini "Use codebase_investigator to map the structure of the cli-gemini skill at .opencode/skill/cli-gemini/. Identify the entry-point markdown file, the references catalog, and the assets catalog. Name the actual files you saw." --include-directories .opencode/skill/cli-gemini -m gemini-3.1-pro-preview -o json 2>&1 > /tmp/cg-007.json; echo EXIT=$?` -> 2. `bash: jq -r '.response' /tmp/cg-007.json` -> 3. `bash: jq -r '.toolCalls[] \| .name' /tmp/cg-007.json \| sort -u` -> 4. `bash: jq -r '.response' /tmp/cg-007.json \| grep -cE 'SKILL\.md\|cli_reference\.md\|integration_patterns\.md\|gemini_tools\.md\|agent_delegation\.md\|prompt_templates\.md\|prompt_quality_card\.md'` | Step 1: `EXIT=0`; Step 2: response is multi-paragraph and mentions `SKILL.md`; Step 3: includes `codebase_investigator`; Step 4: grep count >= 3 (i.e. at least 3 real cli-gemini files named) | `/tmp/cg-007.json` saved + outputs from Steps 2, 3, and 4 | PASS if Step 3 includes `codebase_investigator` AND Step 4 reports a count >= 3 AND Step 2 is more than a single sentence; FAIL if any of those checks miss | 1. If grep count is 0, the tool may have hallucinated paths — re-run with explicit `Read SKILL.md first` instruction; 2. If `codebase_investigator` is missing from `.toolCalls`, inspect what tool fired instead (likely `read_file`+`glob`) and adjust the prompt to be more explicit; 3. If the call exceeds the Gemini context window, narrow `--include-directories` further |

### Optional Supplemental Checks

If you want extra signal, also confirm `.stats.toolCallCount` is at least 2. `codebase_investigator` typically pairs with `read_file` follow-ups for accurate analysis.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-gemini skill surface (`codebase_investigator` listed as Unique Gemini Capability in §3) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/gemini_tools.md` | §2 UNIQUE TOOLS → codebase_investigator documents capability and invocation pattern |
| `../../references/cli_reference.md` | §4 COMMAND-LINE FLAGS documents `--include-directories` scoping |

---

## 5. SOURCE METADATA

- Group: Built-in Tools
- Playbook ID: CG-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--built-in-tools/002-codebase-investigator.md`
