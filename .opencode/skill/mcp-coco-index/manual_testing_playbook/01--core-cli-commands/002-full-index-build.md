---
title: "CCC-002 -- Full index build"
description: "This scenario validates Full index build for `CCC-002`. It focuses on Verify `ccc index` reports file count and chunk count."
---

# CCC-002 -- Full index build

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. SCENARIO CONTRACT](#2--scenario-contract)
- [3. TEST EXECUTION](#3--test-execution)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW

This scenario validates Full index build for `CCC-002`. It focuses on Verify `ccc index` reports file count and chunk count.


---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CCC-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify `ccc index` reports file count and chunk count
- Real user request: `Please verify ccc index reports file count and chunk count.`
- RCAF Prompt: `As a manual-testing orchestrator, build the full semantic index for this project against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Output contains numeric file and chunk counts (for example Files: and Chunks: or similar metric lines). Return a concise user-visible pass/fail verdict with the main reason.`
- Expected execution process: Run the TEST EXECUTION command sequence for `CCC-002`, capture the listed evidence, compare observed output with the expected signals, and return the verdict to the user.
- Expected signals: Output contains numeric file and chunk counts (for example `Files:` and `Chunks:` or similar metric lines)
- Desired user-visible outcome: A concise user-visible PASS/FAIL verdict naming whether the scenario satisfied the objective and the main reason.
- Pass/fail: PASS if output contains non-zero file count AND non-zero chunk count; FAIL if either count is zero or missing


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CCC-002 | Full index build | Verify `ccc index` reports file count and chunk count | `As a manual-testing orchestrator, build the full semantic index for this project against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Output contains numeric file and chunk counts (for example Files: and Chunks: or similar metric lines). Return a concise user-visible pass/fail verdict with the main reason.` | 1. `bash: ccc index` -> 2. Capture output containing file count and chunk count | Output contains numeric file and chunk counts (for example `Files:` and `Chunks:` or similar metric lines) | Index build transcript with file/chunk counts highlighted | PASS if output contains non-zero file count AND non-zero chunk count; FAIL if either count is zero or missing | Check `.cocoindex_code/settings.yml` include_patterns; verify project has indexable source files; check daemon connectivity |


---

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)


---

## 5. SOURCE METADATA

- Group: Core CLI Commands
- Playbook ID: CCC-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--core-cli-commands/002-full-index-build.md`
