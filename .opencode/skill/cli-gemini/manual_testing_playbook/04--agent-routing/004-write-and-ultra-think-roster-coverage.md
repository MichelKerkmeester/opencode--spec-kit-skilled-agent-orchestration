---
title: "CG-013 -- @write and @ultra-think agent roster coverage"
description: "This scenario validates the remaining Gemini agent roster (`@write`, `@ultra-think`, plus a documentation note about `@debug`) for `CG-013`. It focuses on confirming both prefixes route correctly with appropriate output shapes — a documentation draft and a multi-strategy plan."
---

# CG-013 -- @write and @ultra-think agent roster coverage

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CG-013`.

---

## 1. OVERVIEW

This scenario validates the remaining Gemini agent roster for `CG-013`. It focuses on confirming `As @write agent: ...` produces a documentation-shaped output (markdown headings, README-style structure) AND `As @ultra-think agent: ...` produces a multi-strategy plan that names more than one approach. The `@debug` agent is documented but routed via the calling AI's Task tool per `references/agent_delegation.md` §3, so it is intentionally covered by reference rather than by an inline dispatch in this scenario.

### Why This Matters

The orchestrator's agent routing table promises six addressable Gemini agents (`@review`, `@context`, `@deep-research`, `@write`, `@debug`, `@ultra-think`). CG-010 through CG-012 cover three of them. This scenario covers the remaining two that are dispatched via the standard `As @<agent>:` prefix, plus explicitly documents the `@debug` Task-tool routing path so the playbook's coverage of the agent roster is complete.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CG-013` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `As @write agent:` returns a markdown documentation draft (>= 2 headings, >= 5 lines) AND `As @ultra-think agent:` returns a plan that names >= 2 distinct strategies, both with no file mutations to the working tree
- Real user request: `Hit Gemini's @write and @ultra-think agents back-to-back: have @write draft a tiny README skeleton for a fictional sample-app folder, and have @ultra-think give me two competing strategies for caching API responses. Don't actually write anything to disk, just print the drafts.`
- Prompt: `As a cross-AI orchestrator covering the Gemini agent roster, dispatch two calls against the cli-gemini skill in this repository: first @write agent for a small README skeleton, then @ultra-think agent for two competing API caching strategies. Verify the @write output contains at least two markdown headings and the @ultra-think output names at least two distinct caching approaches. Constrain both to read-only operation. Return a concise pass/fail verdict with the main reason and a one-line summary per agent.`
- Expected execution process: orchestrator runs a `git status` tripwire, dispatches `@write` and `@ultra-think` back-to-back, then verifies the documentation/plan shape via grep and the working tree is unchanged
- Expected signals: both calls exit 0. `@write` response contains >= 2 markdown headings (`^## `) and >= 5 non-empty lines. `@ultra-think` response names >= 2 distinct strategies (e.g. `Redis`, `in-memory`, `CDN`, `client-side`). `git status --porcelain` diff is empty
- Desired user-visible outcome: PASS verdict + a one-line summary per agent (e.g. `@write produced a README with Setup/Usage headings; @ultra-think compared Redis vs in-memory caching`)
- Pass/fail: PASS if both responses meet the shape requirements AND the working tree is unchanged. FAIL if either response is malformed, the agent prefix did not bind or the working tree is mutated

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the request as "cover the rest of the Gemini agent roster with deterministic shape checks".
2. Stay local. Both are direct CLI dispatches with Gemini-internal agent routing.
3. Block file writes by using `--allowed-tools read_file,search_file_content,glob,list_directory` so neither agent can mutate disk even if the prompt accidentally invites it.
4. Tripwire `git status --porcelain` so any rogue mutation is caught.
5. Surface a one-line summary per agent in the verdict so the operator can sanity-check the shape.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-013 | @write and @ultra-think roster coverage | Confirm `@write` returns documentation-shaped output and `@ultra-think` returns a multi-strategy plan, both read-only | `As a cross-AI orchestrator covering the Gemini agent roster, dispatch two calls against the cli-gemini skill in this repository: first @write agent for a small README skeleton, then @ultra-think agent for two competing API caching strategies. Verify the @write output contains at least two markdown headings and the @ultra-think output names at least two distinct caching approaches. Constrain both to read-only operation. Return a concise pass/fail verdict with the main reason and a one-line summary per agent.` | 1. `bash: git -C "$PWD" status --porcelain > /tmp/cg-013-before.txt` -> 2. `bash: gemini "As @write agent: Draft a tiny README skeleton (markdown only, do NOT write to disk) for a fictional sample-app/ folder. Include at least Setup and Usage H2 headings and a one-line description under each." --allowed-tools read_file,search_file_content,glob,list_directory -m gemini-3.1-pro-preview -o text 2>&1 > /tmp/cg-013-write.txt; echo EXIT_WRITE=$?` -> 3. `bash: gemini "As @ultra-think agent: Compare two distinct strategies for caching API responses in a Node.js service. Name each strategy explicitly and give one tradeoff per strategy. Do NOT write any files." --allowed-tools read_file,search_file_content,glob,list_directory -m gemini-3.1-pro-preview -o text 2>&1 > /tmp/cg-013-think.txt; echo EXIT_THINK=$?` -> 4. `bash: grep -cE '^## ' /tmp/cg-013-write.txt` -> 5. `bash: grep -ciE 'redis\|in-memory\|cdn\|client-side\|memcached\|edge cache\|http cache' /tmp/cg-013-think.txt` -> 6. `bash: git -C "$PWD" status --porcelain > /tmp/cg-013-after.txt && diff /tmp/cg-013-before.txt /tmp/cg-013-after.txt` | Step 2: `EXIT_WRITE=0`; Step 3: `EXIT_THINK=0`; Step 4: grep count >= 2 (>= 2 H2 headings in @write output); Step 5: grep count >= 2 (>= 2 distinct caching strategies named); Step 6: diff is empty | `/tmp/cg-013-write.txt`, `/tmp/cg-013-think.txt`, the two echoed exit codes, the diff output | PASS if Steps 4 and 5 both meet thresholds AND Step 6 diff is empty; FAIL if either grep count is below threshold, either call errors, or the diff shows mutations | 1. If Step 4 < 2 headings, the @write agent likely returned prose — re-run with explicit `Use H2 markdown headings: ## Setup and ## Usage`; 2. If Step 5 < 2 strategies, re-run @ultra-think with explicit `Name strategy A and strategy B in your answer`; 3. If diff shows mutations, the `--allowed-tools` allowlist did not bind — escalate |

### Optional Supplemental Checks

For `@debug` coverage: `references/agent_delegation.md` §3 routes `@debug` through the calling AI's Task tool rather than a direct CLI prefix. Document that during execution by noting `@debug coverage: routed via Task tool per agent_delegation.md §3 — not validated by inline dispatch`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-gemini skill surface (agent routing table in §3 HOW IT WORKS, including the Task-tool note for @debug) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/agent_delegation.md` | §3 AGENT CATALOG → @write, @ultra-think, @debug (Task-tool routing note) |
| `../../references/cli_reference.md` | §4 COMMAND-LINE FLAGS documents `--allowed-tools` allowlist |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CG-013
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--agent-routing/004-write-and-ultra-think-roster-coverage.md`
