---
title: "CX-003 -- codex exec review subcommand"
description: "This scenario validates the codex exec review subcommand for `CX-003`. It focuses on confirming diff-aware review of the current uncommitted git changes produces structured findings with exit 0."
---

# CX-003 -- codex exec review subcommand

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-003`.

---

## 1. OVERVIEW

This scenario validates the `codex exec review` subcommand for `CX-003`. It focuses on confirming diff-aware review of the current uncommitted git changes produces structured findings categorized by domain (security, bugs, style, performance) with exit code 0 and no file modifications.

### Why This Matters

`codex exec review` is one of the documented Codex-exclusive features (`references/cli_reference.md` §4 Profile & Review Flags, `references/codex_tools.md` §2 /review). Validating that the diff-aware subcommand actually produces categorized findings is essential for any operator using Codex as a pre-commit gate.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify `codex exec review` performs diff-aware review of the current git working tree (e.g., `--uncommitted`) and produces structured findings.
- Real user request: `Run a Codex review on what I have uncommitted right now and tell me whether to commit it.`
- Prompt: `As a cross-AI orchestrator preparing a pre-commit review, run codex exec review against the current uncommitted diff with --model gpt-5.5 and -c service_tier="fast". Verify Codex returns categorized findings (security/bugs/style/performance) referencing actual changed lines, exits 0, and produces no file modifications. Return a concise verdict noting the number of findings and whether at least one finding cites a real changed line.`
- Expected execution process: Operator stages or maintains a small uncommitted diff (e.g., a one-line README edit) -> dispatches `codex exec review --uncommitted` -> captures stdout -> verifies categorized findings -> confirms no files were modified.
- Expected signals: `codex exec review --uncommitted` exits 0. Stdout contains categorized findings (at minimum: a "security" or "correctness" or "style" or "performance" section). At least one finding references a line number that maps to a real change in the working tree. No files are modified.
- Desired user-visible outcome: A reviewer-quality summary of the staged or uncommitted diff that the operator can hand to a human reviewer or use as a pre-commit gate.
- Pass/fail: PASS if exit code 0 AND output has at least one category heading AND at least one finding cites a real changed line AND `git status --porcelain` shows no new modifications attributable to Codex. FAIL if exit non-zero, no categories present or files modified.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Stage or maintain a small uncommitted diff (e.g., add a marker line to a throwaway scratch file under git tracking).
2. Snapshot `git status --porcelain` before dispatch.
3. Run `codex exec review --uncommitted` with the model and fast-tier flags.
4. Inspect stdout for categorized findings and a real line reference.
5. Re-snapshot `git status --porcelain` and confirm no Codex-attributable changes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-003 | codex exec review subcommand | Verify diff-aware review of uncommitted changes returns structured findings with exit 0 | `As a cross-AI orchestrator preparing a pre-commit review, run codex exec review against the current uncommitted diff with --model gpt-5.5 and -c service_tier="fast". Verify Codex returns categorized findings (security/bugs/style/performance) referencing actual changed lines, exits 0, and produces no file modifications. Return a concise verdict noting the number of findings and whether at least one finding cites a real changed line.` | 1. `bash: mkdir -p /tmp/cli-codex-cx003 && cd /tmp/cli-codex-cx003 && git init -q && printf 'initial\n' > scratch.md && git add scratch.md && git commit -q -m init && printf 'initial\nadded line that may need review\n' > scratch.md` -> 2. `bash: cd /tmp/cli-codex-cx003 && git status --porcelain > /tmp/cli-codex-cx003-status-pre.txt` -> 3. `bash: cd /tmp/cli-codex-cx003 && codex exec review --uncommitted --model gpt-5.5 -c service_tier="fast" "Focus on style and clarity." > /tmp/cli-codex-cx003.txt 2>&1` -> 4. `bash: cat /tmp/cli-codex-cx003.txt` -> 5. `bash: cd /tmp/cli-codex-cx003 && git status --porcelain > /tmp/cli-codex-cx003-status-post.txt && diff /tmp/cli-codex-cx003-status-pre.txt /tmp/cli-codex-cx003-status-post.txt` | Step 1: throwaway repo created with one-line uncommitted change; Step 2: pre-snapshot captured; Step 3: exit 0; Step 4: stdout includes at least one of `security|bugs|style|performance|correctness` headings AND a reference to the added line; Step 5: pre/post snapshots are identical | Captured stdout `/tmp/cli-codex-cx003.txt`, pre-status, post-status, dispatched command line, exit code | PASS if Steps 1-5 succeed AND categorized findings reference a real changed line AND post-status is identical to pre-status; FAIL if exit non-zero, no categories present, or unexpected files appear in post-status | (1) Confirm `codex exec review --help` lists `--uncommitted`; (2) verify the throwaway repo has a real uncommitted diff (`git diff` should be non-empty); (3) re-run with `2>&1 | tee` to inline stderr |

### Optional Supplemental Checks

- Repeat with `--commit HEAD~1` (commit-comparison mode) once Step 1 has at least 2 commits and confirm the same categorical structure.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§4 Profile & Review Flags) | Documents the `exec review` subcommand and supported flags |
| `../../references/codex_tools.md` (§2 /review Command) | Documents diff-aware review semantics |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | `exec review` subcommand reference |
| `../../references/codex_tools.md` | Built-in /review capability documentation |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CX-003
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--cli-invocation/003-codex-exec-review.md`
