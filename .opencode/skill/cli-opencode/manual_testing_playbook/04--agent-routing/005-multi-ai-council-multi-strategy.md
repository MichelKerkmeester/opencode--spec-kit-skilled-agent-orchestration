---
title: "CO-017 -- Ultra-think multi-strategy planning"
description: "This scenario validates the multi-ai-council planning-only agent for `CO-017`. It focuses on confirming `--agent multi-ai-council` produces multiple distinct strategies scored across a rubric and respects the planning-only constraint (no file modifications)."
---

# CO-017 -- Ultra-think multi-strategy planning

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-017`.

---

## 1. OVERVIEW

This scenario validates the Ultra-think multi-strategy planning agent for `CO-017`. It focuses on confirming `--agent multi-ai-council` generates at least 3 distinct solution strategies, scores each across a multi-dimension rubric, recommends one with rationale, AND respects the planning-only constraint documented in `references/agent_delegation.md` §7 (no file modifications).

### Why This Matters

`multi-ai-council` is the canonical multi-strategy planning architect. Its value depends on two contracts: produce diverse, well-scored strategies (not a single linear plan). Never write files (planning-only LEAF constraint). If either contract breaks, the agent loses its differentiator from `general` and its safety story for use in pre-implementation planning. This test validates both contracts simultaneously.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-017` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--agent multi-ai-council` produces at least 3 distinct strategies scored on at least 3 dimensions with an explicit recommendation, AND no file modifications occur.
- Real user request: `Use opencode run with --agent multi-ai-council to compare 3 strategies for migrating a small JS module from CommonJS to ESM. Confirm the response has 3 strategies, each scored on at least 3 dimensions, an explicit recommendation, AND no files were modified.`
- RCAF Prompt: `As an external-AI conductor planning a CommonJS-to-ESM migration of a single hypothetical module, dispatch --agent multi-ai-council to compare three strategies (big-bang rewrite, incremental wrapper, dual-build). Verify the response presents three distinct strategies, scores each across risk/effort/timeline/reversibility, recommends one with rationale, and does NOT modify any files in the repo. Return a concise pass/fail verdict naming the recommended strategy and the dimension count per strategy.`
- Expected execution process: External-AI orchestrator snapshots a few sentinel file mtimes, dispatches with `--agent multi-ai-council`, validates the response presents three distinct strategies with scoring across at least three dimensions and an explicit recommendation and confirms the sentinel mtimes are unchanged.
- Expected signals: Dispatch exits 0. Response contains exactly or close to 3 distinct strategies. Each strategy has at least 3 dimension scores. An explicit recommendation appears with rationale. Sentinel file mtimes are unchanged. No Edit/Write tool.calls appear in the JSON event stream.
- Desired user-visible outcome: Verdict naming the recommended strategy, the dimension count and the safety status.
- Pass/fail: PASS if exit 0 AND >= 3 distinct strategies AND >= 3 dimensions per strategy AND explicit recommendation AND no Edit/Write tool.calls AND sentinel mtimes unchanged. FAIL if any check fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Snapshot mtimes of a few sentinel files.
3. Dispatch with `--agent multi-ai-council` and the multi-strategy planning prompt.
4. Validate response has 3 strategies, dimensions and recommendation.
5. Re-snapshot sentinel mtimes and confirm unchanged.
6. Validate no Edit/Write tool.calls in the JSON event stream.
7. Return a verdict naming recommendation, dimension count and safety status.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-017 | Ultra-think multi-strategy planning | Confirm `--agent multi-ai-council` produces 3+ distinct strategies scored across 3+ dimensions with no file writes | `As an external-AI conductor planning a CommonJS-to-ESM migration of a single hypothetical module, dispatch --agent multi-ai-council to compare three strategies (big-bang rewrite, incremental wrapper, dual-build). Verify the response presents three distinct strategies, scores each across risk/effort/timeline/reversibility, recommends one with rationale, and does NOT modify any files in the repo. Return a concise pass/fail verdict naming the recommended strategy and the dimension count per strategy.` | 1. `bash: stat -f '%m %N' .opencode/skill/cli-opencode/SKILL.md .opencode/skill/cli-opencode/references/cli_reference.md > /tmp/co-017-mtimes-before.txt && cat /tmp/co-017-mtimes-before.txt` -> 2. `bash: opencode run --model opencode-go/deepseek-v4-pro --agent multi-ai-council --variant high --format json --dir "$(pwd)" "Compare three strategies for migrating a single CommonJS Node module to ESM: (1) big-bang rewrite, (2) incremental wrapper, (3) dual-build. Score each across risk, effort, timeline, and reversibility. Recommend one with rationale. PLANNING-ONLY — do not modify any files." > /tmp/co-017-events.jsonl 2>&1` -> 3. `bash: echo "Exit: $?"` -> 4. `bash: stat -f '%m %N' .opencode/skill/cli-opencode/SKILL.md .opencode/skill/cli-opencode/references/cli_reference.md > /tmp/co-017-mtimes-after.txt && diff /tmp/co-017-mtimes-before.txt /tmp/co-017-mtimes-after.txt && echo SENTINEL_MTIMES_OK` -> 5. `bash: jq -r 'select(.type == "tool.call") \| .payload.name' /tmp/co-017-events.jsonl \| grep -ciE '(Edit\|Write)'` -> 6. `bash: jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-017-events.jsonl \| grep -ciE '(big-bang\|incremental wrapper\|dual-build)'` -> 7. `bash: jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-017-events.jsonl \| grep -ciE '(risk\|effort\|timeline\|reversibility)'` -> 8. `bash: jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-017-events.jsonl \| grep -ciE '(recommend\|prefer\|choose)'` | Step 1: sentinel mtimes captured; Step 2: events captured; Step 3: exit 0; Step 4: SENTINEL_MTIMES_OK printed; Step 5: count of Edit/Write tool.calls = 0; Step 6: count of strategy mentions >= 3; Step 7: count of dimension mentions >= 4; Step 8: at least one explicit recommendation phrase | `/tmp/co-017-events.jsonl`, `/tmp/co-017-mtimes-{before,after}.txt`, terminal grep counts | PASS if exit 0 AND SENTINEL_MTIMES_OK AND zero Edit/Write tool.calls AND >= 3 strategies AND >= 4 dimensions AND explicit recommendation; FAIL if any check fails | 1. If a sentinel mtime changed, the planning-only contract is violated — file a P0 LEAF safety regression; 2. If only 1-2 strategies appear, the agent collapsed to a linear plan — re-prompt with stronger "produce 3 distinct strategies" wording; 3. If dimensions are missing, add explicit "score each on risk/effort/timeline/reversibility" instructions; 4. If `--agent multi-ai-council` is not found, run `opencode agent list` |

### Optional Supplemental Checks

For rubric depth, ask the agent to produce a 5x5 markdown table with strategies as rows and dimensions as columns. Confirm every cell has a non-empty score. This is the "ideal output shape" for multi-ai-council dispatches and stresses the agent's ability to produce structured output.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` (§3 multi-ai-council property table + §7 LEAF constraints) | Ultra-think planning-only contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 agent routing table (`multi-ai-council` row) |
| `../../assets/prompt_templates.md` (TEMPLATE 10: Multi-strategy planning via @MULTI-AI COUNCIL) | Canonical multi-ai-council prompt shape |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CO-017
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--agent-routing/005-multi-ai-council-multi-strategy.md`
