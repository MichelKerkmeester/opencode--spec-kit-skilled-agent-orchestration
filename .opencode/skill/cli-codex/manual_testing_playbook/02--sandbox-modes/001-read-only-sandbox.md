---
title: "CX-005 -- read-only sandbox (analysis)"
description: "This scenario validates the read-only sandbox mode for `CX-005`. It focuses on confirming --sandbox read-only blocks all writes during a Codex analysis run."
---

# CX-005 -- read-only sandbox (analysis)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-005`.

---

## 1. OVERVIEW

This scenario validates the read-only sandbox mode for `CX-005`. It focuses on confirming `--sandbox read-only` permits file reads but blocks writes and that an analysis prompt completes successfully with no filesystem mutations.

### Why This Matters

Read-only is the safety baseline for analysis, review and exploration tasks (SKILL.md §4 ALWAYS rule 2 + `references/cli_reference.md` §10). It is on the critical-path list because a read-only escape would invalidate every review-style scenario in this playbook.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CX-005` and confirm the expected signals without contradictory evidence.

- Objective: Verify `--sandbox read-only` permits file reads but blocks writes and that an analysis prompt completes successfully with no filesystem mutations.
- Real user request: `Have Codex summarize the cli-codex skill for me without changing anything.`
- Prompt: `As a cross-AI orchestrator running a safe code review, dispatch a read-only analysis of @./.opencode/skill/cli-codex/SKILL.md with --sandbox read-only --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast". Verify Codex returns a structured summary, makes no file modifications (git status clean for that path), and exits 0. Return a verdict naming the sandbox mode and confirming git status remains clean.`
- Expected execution process: Operator snapshots `git status --porcelain .opencode/skill/cli-codex/` before dispatch -> dispatches read-only analysis of SKILL.md -> captures stdout -> re-snapshots git status -> diffs the two snapshots.
- Expected signals: `codex exec` exits 0. Stdout contains a structured analysis of SKILL.md (sections, anchors, key rules). `bash: git status --porcelain` shows no modifications to SKILL.md. The dispatch line includes `--sandbox read-only`.
- Desired user-visible outcome: An analysis output with provable safety: the operator can show that read-only sandbox prevented all writes during a Codex inspection.
- Pass/fail: PASS if exit 0 AND stdout contains structured analysis AND pre/post git status snapshots are identical AND `--sandbox read-only` appears in the dispatched command line. FAIL if any of these miss.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Snapshot `git status --porcelain` for the cli-codex skill folder.
2. Dispatch a read-only analysis of SKILL.md.
3. Capture stdout to a temp file.
4. Re-snapshot `git status --porcelain` and diff against the pre-snapshot.
5. Return a verdict naming the sandbox mode.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-005 | read-only sandbox (analysis) | Verify --sandbox read-only blocks writes during analysis | `As a cross-AI orchestrator running a safe code review, dispatch a read-only analysis of @./.opencode/skill/cli-codex/SKILL.md with --sandbox read-only --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast". Verify Codex returns a structured summary, makes no file modifications (git status clean for that path), and exits 0. Return a verdict naming the sandbox mode and confirming git status remains clean.` | 1. `bash: git status --porcelain .opencode/skill/cli-codex/ > /tmp/cli-codex-cx005-pre.txt` -> 2. `codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox read-only "@./.opencode/skill/cli-codex/SKILL.md Summarize this skill in three bullet points: (1) primary purpose, (2) the most critical ALWAYS rule, (3) the most critical NEVER rule." > /tmp/cli-codex-cx005.txt 2>&1` -> 3. `bash: cat /tmp/cli-codex-cx005.txt` -> 4. `bash: git status --porcelain .opencode/skill/cli-codex/ > /tmp/cli-codex-cx005-post.txt && diff /tmp/cli-codex-cx005-pre.txt /tmp/cli-codex-cx005-post.txt` | Step 1: pre-snapshot captured; Step 2: exit 0; Step 3: stdout contains 3 bullets covering purpose + ALWAYS rule + NEVER rule; Step 4: pre/post snapshots are identical (no diff output) | Pre-snapshot, post-snapshot, captured stdout, dispatched command line, exit code | PASS if exit 0 AND structured 3-bullet summary present AND pre/post snapshots match AND `--sandbox read-only` is in the dispatched command; FAIL if any check misses or pre/post diff is non-empty | (1) Confirm SKILL.md path resolves; (2) re-run with `2>&1 | tee` for stderr inline; (3) inspect `/tmp/cli-codex-cx005.txt` for any "permission denied" message |

### Optional Supplemental Checks

- Add a deliberately injected write attempt to the prompt (e.g., "Also write a marker file at /tmp/cli-codex-cx005-marker.txt") and confirm Codex either refuses or fails to create the file under read-only sandbox.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§4 ALWAYS rule 2) | Mandates `--sandbox read-only` for analysis tasks |
| `../../references/cli_reference.md` (§10 Sandbox Modes) | Documents the three sandbox modes |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | §10 Sandbox Mode Values + §10 Mode Selection Heuristic |
| `../../references/codex_tools.md` | §5 Sandbox Modes - capability matrix |

---

## 5. SOURCE METADATA

- Group: Sandbox Modes
- Playbook ID: CX-005
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--sandbox-modes/001-read-only-sandbox.md`
