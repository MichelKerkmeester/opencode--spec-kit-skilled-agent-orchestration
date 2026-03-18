---
title: "CCC-002 -- Full index build"
description: "This scenario validates Full index build for `CCC-002`. It focuses on Verify `ccc index` reports file count, chunk count, and detected languages."
---

# CCC-002 -- Full index build

## 1. OVERVIEW

This scenario validates Full index build for `CCC-002`. It focuses on Verify `ccc index` reports file count, chunk count, and detected languages.


---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CCC-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify `ccc index` reports file count, chunk count, and detected languages
- Prompt: `Build the full semantic index for this project`
- Expected signals: Output contains numeric counts (e.g., "Files:", "Chunks:", or similar metric lines); output mentions at least one language (e.g., "python", "typescript")
- Pass/fail: PASS if output contains non-zero file count AND non-zero chunk count; FAIL if either count is zero or missing


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CCC-002 | Full index build | Verify `ccc index` reports file count, chunk count, and detected languages | `Build the full semantic index for this project` | 1. `bash: ccc index` -> 2. Capture output containing file count, chunk count, language detection | Output contains numeric counts (e.g., "Files:", "Chunks:", or similar metric lines); output mentions at least one language (e.g., "python", "typescript") | Index build transcript with file/chunk counts highlighted | PASS if output contains non-zero file count AND non-zero chunk count; FAIL if either count is zero or missing | Check `.cocoindex_code/settings.yml` include_patterns; verify project has indexable source files; check daemon connectivity |


---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)


---

## 5. SOURCE METADATA

- Group: Core CLI Commands
- Playbook ID: CCC-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--core-cli-commands/002-full-index-build.md`
