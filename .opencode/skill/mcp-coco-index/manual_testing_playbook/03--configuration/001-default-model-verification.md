---
title: "CFG-001 -- Default model verification"
description: "This scenario validates Default model verification for `CFG-001`. It focuses on Verify global settings contain the documented default embedding model."
---

# CFG-001 -- Default model verification

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. SCENARIO CONTRACT](#2--scenario-contract)
- [3. TEST EXECUTION](#3--test-execution)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW

This scenario validates Default model verification for `CFG-001`. It focuses on Verify global settings contain the documented default embedding model.


---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CFG-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify global settings contain the documented default embedding model
- Real user request: `Please verify global settings contain the documented default embedding model.`
- RCAF Prompt: `As a manual-testing orchestrator, check the CocoIndex Code global settings for the embedding model against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Settings file exists; embedding.model matches a documented model such as sentence-transformers/all-MiniLM-L6-v2 or voyage/voyage-code-3. Return a concise user-visible pass/fail verdict with the main reason.`
- Expected execution process: Run the TEST EXECUTION command sequence for `CFG-001`, capture the listed evidence, compare observed output with the expected signals, and return the verdict to the user.
- Expected signals: Settings file exists; `embedding.model` matches a documented model such as `sentence-transformers/all-MiniLM-L6-v2` or `voyage/voyage-code-3`
- Desired user-visible outcome: A concise user-visible PASS/FAIL verdict naming whether the scenario satisfied the objective and the main reason.
- Pass/fail: PASS if embedding model field exists and matches a documented model; FAIL if file missing or model field absent


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CFG-001 | Default model verification | Verify global settings contain the documented default embedding model | `As a manual-testing orchestrator, check the CocoIndex Code global settings for the embedding model against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Settings file exists; embedding.model matches a documented model such as sentence-transformers/all-MiniLM-L6-v2 or voyage/voyage-code-3. Return a concise user-visible pass/fail verdict with the main reason.` | 1. `bash: cat ~/.cocoindex_code/global_settings.yml` -> 2. Locate `embedding.provider` and `embedding.model` fields | Settings file exists; `embedding.model` matches a documented model such as `sentence-transformers/all-MiniLM-L6-v2` or `voyage/voyage-code-3` | Contents of `global_settings.yml` with embedding fields highlighted | PASS if embedding model field exists and matches a documented model; FAIL if file missing or model field absent | Check `COCOINDEX_CODE_DIR` env var; verify `~/.cocoindex_code/` directory exists; run `ccc init` if needed |


---

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)


---

## 5. SOURCE METADATA

- Group: Configuration
- Playbook ID: CFG-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--configuration/001-default-model-verification.md`
