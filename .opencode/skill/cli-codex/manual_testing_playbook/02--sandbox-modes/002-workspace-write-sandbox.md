---
title: "CX-006 -- workspace-write sandbox (generation)"
description: "This scenario validates the workspace-write sandbox mode for `CX-006`. It focuses on confirming --sandbox workspace-write actually writes the requested file during a code-generation run."
---

# CX-006 -- workspace-write sandbox (generation)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-006`.

---

## 1. OVERVIEW

This scenario validates the workspace-write sandbox mode for `CX-006`. It focuses on confirming `--sandbox workspace-write` permits file creation inside the workspace and that a code-generation prompt actually writes the requested file with exit code 0.

### Why This Matters

Workspace-write is the load-bearing sandbox for every code-generation, refactoring and test-generation flow in the skill (SKILL.md §4 ALWAYS rule 3, `references/cli_reference.md` §10). Without it, the documented "workspace-write for generation" pattern silently produces zero file changes.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-006` and confirm the expected signals without contradictory evidence.

- Objective: Verify `--sandbox workspace-write` permits file creation inside the workspace and that a code-generation prompt actually writes the requested file with exit code 0.
- Real user request: `Have Codex generate a small TypeScript hello-world for me into a temp folder.`
- Prompt: `As a cross-AI orchestrator generating a small utility, dispatch a workspace-write task that creates /tmp/cli-codex-playbook-cx006/hello.ts with --sandbox workspace-write --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast". Verify the file is written, contains a TypeScript hello-world function, Codex exits 0, and no files outside /tmp/cli-codex-playbook-cx006/ are touched. Return a verdict naming the created path and confirming workspace-write succeeded.`
- Expected execution process: Operator pre-creates the temp directory -> snapshots `git status --porcelain` for the workspace -> dispatches a workspace-write generation -> verifies the file exists and has the expected content -> re-snapshots git status and confirms no unrelated files moved.
- Expected signals: `codex exec` exits 0. `bash: ls /tmp/cli-codex-playbook-cx006/hello.ts` succeeds and the file contains a TypeScript hello-world function. `bash: git status --porcelain` shows no unintended modifications to the working tree (the temp dir is outside git). Dispatch line includes `--sandbox workspace-write`.
- Desired user-visible outcome: A real generated file the operator can inspect and run, demonstrating that workspace-write is the correct sandbox for code-generation tasks.
- Pass/fail: PASS if exit 0 AND `/tmp/cli-codex-playbook-cx006/hello.ts` exists with a TypeScript hello-world function AND no unintended changes appear in `git status --porcelain` AND `--sandbox workspace-write` appears in the dispatched command. FAIL if any check misses.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pre-create the temp directory.
2. Snapshot `git status --porcelain` for the workspace.
3. Dispatch a workspace-write generation prompt that names the target file.
4. Verify the file exists and contains a TypeScript hello-world function.
5. Re-snapshot `git status --porcelain` and confirm no unrelated files moved.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-006 | workspace-write sandbox (generation) | Verify --sandbox workspace-write writes a generated file successfully | `As a cross-AI orchestrator generating a small utility, dispatch a workspace-write task that creates /tmp/cli-codex-playbook-cx006/hello.ts with --sandbox workspace-write --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast". Verify the file is written, contains a TypeScript hello-world function, Codex exits 0, and no files outside /tmp/cli-codex-playbook-cx006/ are touched. Return a verdict naming the created path and confirming workspace-write succeeded.` | 1. `bash: rm -rf /tmp/cli-codex-playbook-cx006 && mkdir -p /tmp/cli-codex-playbook-cx006` -> 2. `bash: git status --porcelain > /tmp/cli-codex-cx006-pre.txt` -> 3. `codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox workspace-write "Write a TypeScript hello-world function to /tmp/cli-codex-playbook-cx006/hello.ts. Function name: hello(name: string): string. Body: returns 'Hello, ' + name + '!'. Output only the saved file path on success." > /tmp/cli-codex-cx006-stdout.txt 2>&1` -> 4. `bash: ls /tmp/cli-codex-playbook-cx006/hello.ts && cat /tmp/cli-codex-playbook-cx006/hello.ts` -> 5. `bash: git status --porcelain > /tmp/cli-codex-cx006-post.txt && diff /tmp/cli-codex-cx006-pre.txt /tmp/cli-codex-cx006-post.txt` | Step 1: temp dir exists; Step 2: pre-snapshot captured; Step 3: exit 0; Step 4: file exists and contains a TypeScript `hello(name: string): string` function; Step 5: pre/post snapshots match (no unrelated changes) | Captured stdout, listing/content of `/tmp/cli-codex-playbook-cx006/hello.ts`, pre/post git status snapshots, dispatched command line, exit code | PASS if all 5 steps match expected signals; FAIL if file is missing, contains wrong shape, exit non-zero, or git status diff is non-empty | (1) Confirm temp dir is writable; (2) re-run with `2>&1 | tee`; (3) check stdout for "permission denied" or sandbox errors; (4) verify Codex actually used the path you requested |

### Optional Supplemental Checks

- Compile the generated file with `bash: npx tsc --noEmit /tmp/cli-codex-playbook-cx006/hello.ts` to confirm syntactic validity.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§4 ALWAYS rule 3) | Mandates `--sandbox workspace-write` for generation/modification |
| `../../references/cli_reference.md` (§10 Sandbox Modes) | Documents workspace-write semantics |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | §10 Sandbox Mode Values |
| `../../references/codex_tools.md` | §5 Sandbox Modes capability matrix |

---

## 5. SOURCE METADATA

- Group: Sandbox Modes
- Playbook ID: CX-006
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--sandbox-modes/002-workspace-write-sandbox.md`
