---
title: "CX-015 -- @ultra-think profile (multi-strategy planning)"
description: "This scenario validates the codex exec -p ultra-think profile for `CX-015`. It focuses on confirming the ultra-think profile produces at least 3 distinct strategies for an architecture decision."
---

# CX-015 -- @ultra-think profile (multi-strategy planning)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-015`.

---

## 1. OVERVIEW

This scenario validates the `codex exec -p ultra-think` profile for `CX-015`. It focuses on confirming the `ultra-think` profile routes to the read-only multi-strategy planning profile and returns at least 3 distinct strategies for an architecture decision with explicit scoring and a single recommendation.

### Why This Matters

`agent_delegation.md` §3 defines `ultra-think` as the multi-strategy planner with diverse thinking lenses (Analytical, Creative, Critical, Pragmatic, Integrated). It is the canonical Codex-side complement to the calling AI's planning step. If the profile fails to produce multiple strategies with scoring, the planning routing in `integration_patterns.md` §4 (Routing Table - architecture planning row) loses its second-perspective edge.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-015` and confirm the expected signals without contradictory evidence.

- Objective: Verify `codex exec -p ultra-think` returns at least 3 distinct strategies with scoring and a single recommendation for an architecture decision.
- Real user request: `Get the Codex ultra-think profile to plan three caching strategies for a small Express API and recommend one.`
- Prompt: `As a cross-AI orchestrator running an architecture review, dispatch codex exec -p ultra-think "Plan three caching strategies for a small Express API: in-memory, Redis, and CDN edge. Score each on correctness, maintainability, and performance, then recommend one." with --model gpt-5.5 -c model_reasoning_effort="xhigh" --sandbox read-only -c service_tier="fast". Verify the dispatch routes via -p ultra-think, exits 0, returns at least three distinct labeled strategies with scores and a final recommendation, makes no file modifications, and the dispatched command line includes -p ultra-think. Return a verdict naming the recommended strategy and the score breakdown.`
- Expected execution process: Operator confirms `.codex/config.toml` has a `[profiles.ultra-think]` section -> snapshots `git status --porcelain` -> dispatches `-p ultra-think` with xhigh reasoning -> captures stdout -> verifies 3 strategies + scores + recommendation -> re-snapshots and confirms no diffs.
- Expected signals: `codex exec -p ultra-think` exits 0. Stdout names at least 3 strategies (in-memory, Redis, CDN). Each strategy carries a score on the three axes (correctness, maintainability, performance). A single recommendation is named. No file modifications. Dispatch line includes `-p ultra-think`.
- Desired user-visible outcome: A planning brief the operator can hand to an architect or paste into a spec folder's `decision-record.md`.
- Pass/fail: PASS if exit 0, all 3 strategies present, all 3 axes scored for each strategy, a single recommendation is named, pre/post snapshots match, AND `-p ultra-think` is in the dispatched command. FAIL if any check misses.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm `.codex/config.toml` has a `[profiles.ultra-think]` section.
2. Snapshot `git status --porcelain`.
3. Dispatch `-p ultra-think` with xhigh reasoning and read-only sandbox.
4. Verify 3 strategies, scoring on 3 axes and a single recommendation.
5. Re-snapshot `git status --porcelain` and confirm no diffs.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-015 | @ultra-think profile (multi-strategy planning) | Verify -p ultra-think returns 3 strategies with scores and a recommendation | `As a cross-AI orchestrator running an architecture review, dispatch codex exec -p ultra-think "Plan three caching strategies for a small Express API: in-memory, Redis, and CDN edge. Score each on correctness, maintainability, and performance, then recommend one." with --model gpt-5.5 -c model_reasoning_effort="xhigh" --sandbox read-only -c service_tier="fast". Verify the dispatch routes via -p ultra-think, exits 0, returns at least three distinct labeled strategies with scores and a final recommendation, makes no file modifications, and the dispatched command line includes -p ultra-think. Return a verdict naming the recommended strategy and the score breakdown.` | 1. `bash: grep -A 3 "\[profiles.ultra-think\]" .codex/config.toml ~/.codex/config.toml 2>/dev/null` -> 2. `bash: git status --porcelain > /tmp/cli-codex-cx015-pre.txt` -> 3. `codex exec -p ultra-think --model gpt-5.5 -c model_reasoning_effort="xhigh" --sandbox read-only -c service_tier="fast" "Plan three caching strategies for a small Express API: in-memory, Redis, and CDN edge. Score each on correctness, maintainability, and performance using a 1-5 scale. Recommend one strategy with a one-paragraph rationale. Output as a markdown table for the scores plus a final RECOMMENDATION section." > /tmp/cli-codex-cx015.txt 2>&1` -> 4. `bash: for s in "in-memory" "Redis" "CDN"; do printf '%s: ' "$s"; grep -ic "$s" /tmp/cli-codex-cx015.txt; done > /tmp/cli-codex-cx015-coverage.txt && grep -i "RECOMMENDATION" /tmp/cli-codex-cx015.txt` -> 5. `bash: git status --porcelain > /tmp/cli-codex-cx015-post.txt && diff /tmp/cli-codex-cx015-pre.txt /tmp/cli-codex-cx015-post.txt` | Step 1: profile section found; Step 2: pre-snapshot captured; Step 3: exit 0; Step 4: each of in-memory/Redis/CDN has count >= 1, AND a RECOMMENDATION section exists; Step 5: pre/post snapshots match | Profile grep, pre/post snapshots, captured stdout, coverage file, dispatched command line, exit code | PASS if exit 0, all 3 strategies named, scores on 3 axes visible, RECOMMENDATION present, pre/post snapshots match, AND `-p ultra-think` is in the dispatched command; FAIL if any check misses | (1) Define `[profiles.ultra-think]` in config.toml if missing per agent_delegation.md §2; (2) re-run with `2>&1 | tee`; (3) inspect output for missing strategies and re-prompt explicitly listing the three options |

### Optional Supplemental Checks

- Repeat with a different decision (e.g., "auth strategy: session cookie vs JWT vs OAuth2 PKCE") and confirm the same shape (3 options, 3 axes, 1 recommendation).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` (§3 @ultra-think) | Documents the ultra-think profile contract |
| `../../references/cli_reference.md` (§9 Configuration Files) | Profile config syntax |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/agent_delegation.md` | §3 @ultra-think - Multi-Strategy Planner |
| `../../references/integration_patterns.md` | §4 Routing Table - architecture planning row |
| `.codex/config.toml` (or `~/.codex/config.toml`) | `[profiles.ultra-think]` section |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CX-015
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--agent-routing/004-ultra-think-profile.md`
