---
title: "CCC-002 -- Full index build"
description: "This scenario validates Full index build for `CCC-002`. It focuses on Verify `ccc index` reports file count and chunk count."
---

# CCC-002 -- Full index build

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. TEST EXECUTION](#3--test-execution)
- [4. REFERENCES](#4--references)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW

This scenario validates Full index build for `CCC-002`. It focuses on Verify `ccc index` reports file count and chunk count.


---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CCC-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify `ccc index` reports file count and chunk count
- Prompt: `As a manual-testing orchestrator, build the full semantic index for this project against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Output contains numeric file and chunk counts (for example "Files:" and "Chunks:" or similar metric lines). Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Output contains numeric file and chunk counts (for example `Files:` and `Chunks:` or similar metric lines)
- Pass/fail: PASS if output contains non-zero file count AND non-zero chunk count; FAIL if either count is zero or missing


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CCC-002 | Full index build | Verify `ccc index` reports file count and chunk count | `As a manual-testing orchestrator, build the full semantic index for this project against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Output contains numeric file and chunk counts (for example "Files:" and "Chunks:" or similar metric lines). Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: ccc index` -> 2. Capture output containing file count and chunk count | Output contains numeric file and chunk counts (for example `Files:` and `Chunks:` or similar metric lines) | Index build transcript with file/chunk counts highlighted | PASS if output contains non-zero file count AND non-zero chunk count; FAIL if either count is zero or missing | Check `.cocoindex_code/settings.yml` include_patterns; verify project has indexable source files; check daemon connectivity |


---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)


---

## 5. SOURCE METADATA

- Group: Core CLI Commands
- Playbook ID: CCC-002
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--core-cli-commands/002-full-index-build.md`
