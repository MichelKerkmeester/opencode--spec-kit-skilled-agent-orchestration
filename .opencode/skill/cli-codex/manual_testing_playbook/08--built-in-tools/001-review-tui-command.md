---
title: "CX-023 -- /review TUI command"
description: "This scenario validates the /review interactive TUI command for `CX-023`. It focuses on confirming /review surfaces categorized findings against staged git changes."
---

# CX-023 -- /review TUI command

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-023`.

---

## 1. OVERVIEW

This scenario validates the `/review` interactive TUI command for `CX-023`. It focuses on confirming `/review` runs inside the Codex TUI against staged git changes and produces categorized review findings without modifying files.

### Why This Matters

`/review` is the TUI-only complement to `codex exec review` (validated separately in CX-003). `references/codex_tools.md` §2 documents `/review` as one of the unique Codex capabilities. Operators who prefer the interactive TUI for pre-commit review need confidence that the slash command surface still works.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CX-023` and confirm the expected signals without contradictory evidence.

- Objective: Verify the `/review` interactive command runs inside the Codex TUI against staged git changes and produces categorized review findings.
- Real user request: `Try the /review slash command in the Codex TUI on my staged changes and tell me what it flags.`
- Prompt: `As a cross-AI orchestrator preparing a pre-commit review, FIRST stage a small change (e.g., a one-line edit to /tmp/cli-codex-playbook-cx023/scratch.md inside a throwaway git repo), THEN launch codex (no exec subcommand) and run /review interactively. Verify Codex enters the TUI, /review surfaces categorized findings (security/bugs/style/performance) referencing the staged change, the operator can exit cleanly, and no files are modified. Return a verdict naming the categories present and the line referenced.`
- Expected execution process: Operator pre-creates a throwaway git repo with a staged change -> launches Codex TUI (no `exec` subcommand) -> types `/review` interactively -> captures the categorized findings (screenshot or copy-paste) -> exits the TUI -> confirms no files modified.
- Expected signals: Codex TUI launches. `/review` slash command executes against staged changes. Output contains at least one category heading (security/bugs/style/performance). A finding references the staged line. No file modifications.
- Desired user-visible outcome: A pre-commit review summary the operator can quote in a PR description.
- Pass/fail: PASS if TUI launches, `/review` executes, at least one category heading appears, a finding references the staged line, AND no file modifications occur. FAIL if TUI doesn't launch, /review errors or no categorized findings appear.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pre-create a throwaway git repo with one initial commit and one staged change.
2. Snapshot `git status --porcelain` and `git diff --cached`.
3. Launch `codex` (no exec) in the throwaway repo.
4. Type `/review` interactively, capture the output via copy-paste or screenshot.
5. Exit cleanly and re-snapshot `git status --porcelain` to confirm no Codex modifications.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-023 | /review TUI command | Verify /review interactive command surfaces categorized findings against staged changes | `As a cross-AI orchestrator preparing a pre-commit review, FIRST stage a small change (e.g., a one-line edit to /tmp/cli-codex-playbook-cx023/scratch.md inside a throwaway git repo), THEN launch codex (no exec subcommand) and run /review interactively. Verify Codex enters the TUI, /review surfaces categorized findings (security/bugs/style/performance) referencing the staged change, the operator can exit cleanly, and no files are modified. Return a verdict naming the categories present and the line referenced.` | 1. `bash: rm -rf /tmp/cli-codex-playbook-cx023 && mkdir -p /tmp/cli-codex-playbook-cx023 && cd /tmp/cli-codex-playbook-cx023 && git init -q && printf 'initial\n' > scratch.md && git add scratch.md && git commit -q -m init && printf 'initial\nadded line for /review TUI manual check\n' > scratch.md && git add scratch.md` -> 2. `bash: cd /tmp/cli-codex-playbook-cx023 && git status --porcelain > /tmp/cli-codex-cx023-pre.txt && git diff --cached > /tmp/cli-codex-cx023-diff.txt` -> 3. (interactive) `bash: cd /tmp/cli-codex-playbook-cx023 && codex` -> 4. (inside TUI) type `/review`, observe categorized output, copy-paste to `/tmp/cli-codex-cx023-tui-output.txt`, then quit the TUI -> 5. `bash: cd /tmp/cli-codex-playbook-cx023 && git status --porcelain > /tmp/cli-codex-cx023-post.txt && diff /tmp/cli-codex-cx023-pre.txt /tmp/cli-codex-cx023-post.txt` | Step 1: throwaway repo created with one staged change; Step 2: pre-snapshot + diff captured; Step 3: TUI launches; Step 4: /review output captured includes at least one category heading and references the added line; Step 5: pre/post snapshots match | Throwaway repo state, pre/post snapshots, captured TUI output, dispatched command, observed exit | PASS if TUI launches, /review executes, at least one category heading appears in the captured output, a finding references the added line, AND post-snapshot equals pre-snapshot; FAIL if TUI doesn't launch, /review errors, or any check misses | (1) Confirm Codex CLI version supports `/review` slash command (`codex --version`); (2) verify `git diff --cached` is non-empty before launching TUI; (3) if TUI input is unavailable in the operator's environment, fall back to `codex exec review --uncommitted` (CX-003 surface) and document as "TUI environment unavailable" |

### Optional Supplemental Checks

- Repeat with `/review HEAD~1` (commit-comparison mode) and confirm the same shape (categorized findings against the named commit).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/codex_tools.md` (§2 /review Command) | Authoritative /review documentation |
| `../../references/cli_reference.md` (§7 Interactive Commands) | Documents TUI slash commands |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/codex_tools.md` | §2 Unique Capabilities - /review |
| `../../references/cli_reference.md` | §7 Interactive Commands |

---

## 5. SOURCE METADATA

- Group: Built-in Tools
- Playbook ID: CX-023
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `08--built-in-tools/001-review-tui-command.md`
