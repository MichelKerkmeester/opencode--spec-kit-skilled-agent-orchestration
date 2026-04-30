---
title: "CX-012 -- @review profile (read-only)"
description: "This scenario validates the codex exec -p review profile for `CX-012`. It focuses on confirming the review profile produces categorized findings without modifying files."
---

# CX-012 -- @review profile (read-only)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-012`.

---

## 1. OVERVIEW

This scenario validates the `codex exec -p review` profile for `CX-012`. It focuses on confirming the `review` profile routes to read-only mode by configuration and produces categorized findings without modifying files.

### Why This Matters

`agent_delegation.md` §3 (Agent Catalog) defines the `review` profile as the canonical second-opinion code-review surface (read-only, high reasoning). If the profile fails to dispatch or silently downgrades to writes, the entire cross-AI generate-review-fix loop in `integration_patterns.md` §2 collapses.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-012` and confirm the expected signals without contradictory evidence.

- Objective: Verify `codex exec -p review` routes to the read-only review profile and produces categorized findings without modifying files.
- Real user request: `Have the Codex review profile look at the cli-codex CLI reference and tell me what could be improved.`
- RCAF Prompt: `As a cross-AI orchestrator delegating a code review, dispatch codex exec -p review against @./.opencode/skill/cli-codex/references/cli_reference.md with --model gpt-5.5 -c model_reasoning_effort="high" -c service_tier="fast". Verify the dispatch routes via -p review, exits 0, returns categorized findings (style/correctness/clarity), makes no file modifications, and the dispatched command line includes -p review explicitly. Return a verdict naming the profile and the finding-category count.`
- Expected execution process: Operator confirms `.codex/config.toml` has a `[profiles.review]` section -> snapshots `git status --porcelain` -> dispatches with `-p review` -> captures stdout -> verifies categorized findings -> re-snapshots and confirms no diffs.
- Expected signals: `codex exec -p review` exits 0. Stdout contains categorized findings (at least one of style/correctness/clarity/security/performance). `bash: git status --porcelain` shows no modifications. Dispatch line includes `-p review`.
- Desired user-visible outcome: A reviewer-quality output that demonstrates the `review` profile keeps Codex in read-only mode by configuration, freeing the operator from passing `--sandbox read-only` manually when the profile is set up correctly.
- Pass/fail: PASS if exit 0, categorized findings present, pre/post git snapshots identical, AND `-p review` is in the dispatched command. FAIL if any check misses.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm `.codex/config.toml` has a `[profiles.review]` section (or note that the profile must be created per `agent_delegation.md` §2 Profile Setup).
2. Snapshot `git status --porcelain` for the workspace.
3. Dispatch `codex exec -p review @./...cli_reference.md` with the documented flags.
4. Capture stdout to a temp file.
5. Re-snapshot `git status --porcelain` and confirm no diffs.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-012 | @review profile (read-only) | Verify -p review routes to read-only review and returns categorized findings | `As a cross-AI orchestrator delegating a code review, dispatch codex exec -p review against @./.opencode/skill/cli-codex/references/cli_reference.md with --model gpt-5.5 -c model_reasoning_effort="high" -c service_tier="fast". Verify the dispatch routes via -p review, exits 0, returns categorized findings (style/correctness/clarity), makes no file modifications, and the dispatched command line includes -p review explicitly. Return a verdict naming the profile and the finding-category count.` | 1. `bash: grep -A 3 "\[profiles.review\]" .codex/config.toml ~/.codex/config.toml 2>/dev/null` -> 2. `bash: git status --porcelain > /tmp/cli-codex-cx012-pre.txt` -> 3. `codex exec -p review --model gpt-5.5 -c model_reasoning_effort="high" -c service_tier="fast" "@./.opencode/skill/cli-codex/references/cli_reference.md Review this CLI reference document for clarity, correctness of flag descriptions, and any style inconsistencies. Categorize findings under headings: STYLE, CORRECTNESS, CLARITY." > /tmp/cli-codex-cx012.txt 2>&1` -> 4. `bash: cat /tmp/cli-codex-cx012.txt` -> 5. `bash: git status --porcelain > /tmp/cli-codex-cx012-post.txt && diff /tmp/cli-codex-cx012-pre.txt /tmp/cli-codex-cx012-post.txt` | Step 1: profile section found (or operator notes profile setup needed); Step 2: pre-snapshot captured; Step 3: exit 0; Step 4: stdout includes at least one of STYLE/CORRECTNESS/CLARITY headings; Step 5: pre/post snapshots match | Profile config grep, pre/post snapshots, captured stdout, dispatched command line, exit code | PASS if exit 0, at least one category heading present, pre/post snapshots match, AND `-p review` is in the dispatched command; FAIL if profile missing, exit non-zero, no categories present, or files modified | (1) Per agent_delegation.md §2, define `[profiles.review]` in config.toml if missing; (2) re-run with `2>&1 \| tee` for stderr inline; (3) inspect output for "profile not found" errors |

### Optional Supplemental Checks

- Confirm the profile's documented `sandbox_mode = "read-only"` actually takes effect by attempting a write in the prompt and observing the refusal.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` (§3 @review) | Documents the review profile contract |
| `../../references/cli_reference.md` (§9 Configuration Files) | Documents profile config syntax |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/agent_delegation.md` | §3 @review - Code Quality Guardian |
| `../../references/integration_patterns.md` | §10 Cross-Validation strategies (review-then-fix) |
| `.codex/config.toml` (or `~/.codex/config.toml`) | `[profiles.review]` section that backs `-p review` |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CX-012
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--agent-routing/001-review-profile.md`
