---
title: "CX-013 -- @context profile (architecture mapping)"
description: "This scenario validates the codex exec -p context profile for `CX-013`. It focuses on confirming the context profile produces a structural map without modifying files."
---

# CX-013 -- @context profile (architecture mapping)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-013`.

---

## 1. OVERVIEW

This scenario validates the `codex exec -p context` profile for `CX-013`. It focuses on confirming the `context` profile routes to the read-only context-exploration profile and produces a structural map of a small subtree.

### Why This Matters

`agent_delegation.md` §3 (Agent Catalog) defines the `context` profile as the canonical read-only architecture-mapping surface. It is the second perspective the orchestrator delegates to before drafting an implementation plan or onboarding a teammate. Validating that it produces an enumerated structural map keeps the architecture-analysis routing table in `integration_patterns.md` honest.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-013` and confirm the expected signals without contradictory evidence.

- Objective: Verify `codex exec -p context` routes to the read-only context-exploration profile and produces an enumerated map of a small subtree.
- Real user request: `Have the Codex context agent map out what the cli-codex references folder contains so I can plan a doc refresh.`
- RCAF Prompt: `As a cross-AI orchestrator gathering architecture context, dispatch codex exec -p context against the .opencode/skill/cli-codex/references/ folder with --model gpt-5.5 -c model_reasoning_effort="high" -c service_tier="fast". Verify the dispatch routes via -p context, exits 0, returns a dependency or anchor map naming each reference file, makes no file modifications, and the dispatched command line includes -p context. Return a verdict naming the profile and confirming the map enumerates all 5 reference files.`
- Expected execution process: Operator confirms `.codex/config.toml` has a `[profiles.context]` section -> snapshots `git status --porcelain` -> dispatches `-p context` against the references folder -> captures stdout -> verifies all five reference files are enumerated -> re-snapshots and confirms no diffs.
- Expected signals: `codex exec -p context` exits 0. Stdout enumerates the five reference files (`cli_reference.md`, `integration_patterns.md`, `codex_tools.md`, `hook_contract.md`, `agent_delegation.md`). No file modifications. Dispatch line includes `-p context`.
- Desired user-visible outcome: A structural map the operator can use to onboard a teammate or feed into a planning step.
- Pass/fail: PASS if exit 0, all five reference files named in the output, pre/post git snapshots identical, AND `-p context` is in the dispatched command. FAIL if any check misses.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm `.codex/config.toml` has a `[profiles.context]` section.
2. Snapshot `git status --porcelain`.
3. Dispatch `codex exec -p context` against the references folder.
4. Capture stdout and confirm all five reference filenames are enumerated.
5. Re-snapshot `git status --porcelain` and confirm no diffs.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-013 | @context profile (architecture mapping) | Verify -p context returns an enumerated map of the references subtree | `As a cross-AI orchestrator gathering architecture context, dispatch codex exec -p context against the .opencode/skill/cli-codex/references/ folder with --model gpt-5.5 -c model_reasoning_effort="high" -c service_tier="fast". Verify the dispatch routes via -p context, exits 0, returns a dependency or anchor map naming each reference file, makes no file modifications, and the dispatched command line includes -p context. Return a verdict naming the profile and confirming the map enumerates all 5 reference files.` | 1. `bash: grep -A 3 "\[profiles.context\]" .codex/config.toml ~/.codex/config.toml 2>/dev/null` -> 2. `bash: git status --porcelain > /tmp/cli-codex-cx013-pre.txt` -> 3. `codex exec -p context --model gpt-5.5 -c model_reasoning_effort="high" -c service_tier="fast" "Map every markdown file under .opencode/skill/cli-codex/references/. For each file, list its filename and a one-sentence description of its purpose based on its first paragraph or frontmatter description. Output as a markdown bullet list." > /tmp/cli-codex-cx013.txt 2>&1` -> 4. `bash: for f in cli_reference integration_patterns codex_tools hook_contract agent_delegation; do printf '%s: ' "$f"; grep -c "$f" /tmp/cli-codex-cx013.txt; done > /tmp/cli-codex-cx013-coverage.txt` -> 5. `bash: git status --porcelain > /tmp/cli-codex-cx013-post.txt && diff /tmp/cli-codex-cx013-pre.txt /tmp/cli-codex-cx013-post.txt` | Step 1: profile section found; Step 2: pre-snapshot captured; Step 3: exit 0; Step 4: each of the 5 filenames has count >= 1 in the coverage report; Step 5: pre/post snapshots match | Profile grep, pre/post snapshots, captured stdout, coverage file, dispatched command line, exit code | PASS if exit 0, all 5 reference filenames are present in the output, pre/post snapshots match, AND `-p context` is in the dispatched command; FAIL if any reference file is missing or any check fails | (1) Define `[profiles.context]` in config.toml if missing per agent_delegation.md §2; (2) re-run with `2>&1 \| tee`; (3) verify the references folder still has all 5 files: `ls .opencode/skill/cli-codex/references/` |

### Optional Supplemental Checks

- Run a follow-up `-p context` query asking for cross-file dependencies or anchor relationships and confirm the response references at least one cross-file link (e.g., `cli_reference.md` cited from `codex_tools.md`).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` (§3 @context) | Documents the context profile contract |
| `../../references/cli_reference.md` (§9 Configuration Files) | Documents profile config syntax |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/agent_delegation.md` | §3 @context - Codebase Explorer |
| `.codex/config.toml` (or `~/.codex/config.toml`) | `[profiles.context]` section |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CX-013
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--agent-routing/002-context-profile.md`
