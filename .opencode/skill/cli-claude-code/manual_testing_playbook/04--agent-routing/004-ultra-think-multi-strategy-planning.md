---
title: "CC-014 -- Ultra-think multi-strategy planning"
description: "This scenario validates Ultra-think multi-strategy planning for `CC-014`. It focuses on confirming `--agent ultra-think --model claude-opus-4-6 --permission-mode plan` produces multiple distinct scored strategies."
---

# CC-014 -- Ultra-think multi-strategy planning

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-014`.

---

## 1. OVERVIEW

This scenario validates Ultra-think multi-strategy planning for `CC-014`. It focuses on confirming `--agent ultra-think --model claude-opus-4-6 --permission-mode plan` produces multiple distinct scored strategies.

### Why This Matters

The `ultra-think` agent is the cli-claude-code skill's heaviest planner - it pairs Opus's extended thinking with multi-strategy generation and rubric scoring. The agent_delegation.md routing guide explicitly maps "PLAN ARCHITECTURE" intents to ultra-think + Opus. If the agent collapses to a single recommendation without multi-strategy scoring, the cross-AI deep-planning workflow loses its differentiating value.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-014` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--agent ultra-think --model claude-opus-4-6 --permission-mode plan` generates at least 3 distinct strategies, scores each across at least 3 dimensions and recommends one with rationale.
- Real user request: `Use Claude Code's ultra-think agent to plan a MongoDB-to-PostgreSQL migration - give me at least 3 distinct strategies, score each on risk/effort/timeline/rollback, and recommend one with reasoning.`
- Prompt: `As an external-AI conductor planning a complex migration (for example MongoDB to PostgreSQL) and wanting multiple strategies evaluated by rubric, dispatch claude -p --agent ultra-think --model claude-opus-4-6 --permission-mode plan and capture the structured plan. Verify the response generates at least 3 distinct strategies (for example big-bang, gradual, dual-write), scores each across risk/effort/timeline/rollback, and recommends one with rationale. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: External-AI orchestrator dispatches with explicit "generate 3 strategies, score each on N dimensions" structure in the prompt, applies a budget cap (`--max-budget-usd 1.50`), then parses the response for distinct strategies, dimensional scores and recommendation clarity.
- Expected signals: Response presents at least 3 distinct strategies. Each strategy scored across at least 3 dimensions (risk/effort/timeline/rollback). Explicit recommendation with rationale. Uses `--effort high` style depth (multi-paragraph reasoning per strategy).
- Desired user-visible outcome: Verdict naming the recommended strategy, the scoring dimensions used and the rationale summary.
- Pass/fail: PASS if >=3 distinct strategies AND each scored on >=3 dimensions AND explicit recommendation with rationale. FAIL if fewer than 3 strategies or scoring dimensions missing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Apply `--max-budget-usd 1.50` cost cap (Opus + ultra-think is expensive).
3. Frame the prompt to explicitly request N strategies and named scoring dimensions.
4. Parse the response for distinct strategies and dimensional scores.
5. Return a verdict naming the recommendation and rationale.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-014 | Ultra-think multi-strategy planning | Confirm `--agent ultra-think --model claude-opus-4-6 --permission-mode plan` generates >=3 distinct scored strategies | `As an external-AI conductor planning a complex migration (for example MongoDB to PostgreSQL) and wanting multiple strategies evaluated by rubric, dispatch claude -p --agent ultra-think --model claude-opus-4-6 --permission-mode plan and capture the structured plan. Verify the response generates at least 3 distinct strategies (for example big-bang, gradual, dual-write), scores each across risk/effort/timeline/rollback, and recommends one with rationale. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: claude -p "Plan a MongoDB-to-PostgreSQL migration for a production e-commerce platform with 50M documents. Generate exactly 3 distinct strategies (for example big-bang, gradual, dual-write). For each strategy, score 1-10 across risk, effort, timeline, and rollback ability. Then recommend one with explicit rationale. Use markdown tables for the score matrix." --agent ultra-think --model claude-opus-4-6 --permission-mode plan --max-budget-usd 1.50 --output-format text 2>&1 \| tee /tmp/cc-014-output.txt` -> 2. `bash: grep -cE '(Strategy [0-9]\|## Strategy\|^### )' /tmp/cc-014-output.txt` -> 3. `bash: grep -ciE '(risk\|effort\|timeline\|rollback)' /tmp/cc-014-output.txt` -> 4. `bash: grep -iE '(recommend\|conclusion)' /tmp/cc-014-output.txt \| head -3` -> 5. `bash: wc -w /tmp/cc-014-output.txt` | Step 1: dispatch completes; Step 2: count of strategy-section markers >= 3; Step 3: count of dimension-keyword mentions >= 8 (i.e., 4 dimensions x 3 strategies, with some give); Step 4: explicit recommendation appears; Step 5: total word count > 800 (Opus + ultra-think depth) | `/tmp/cc-014-output.txt`, terminal grep counts | PASS if >=3 strategies AND >=3 dimensions scored per strategy AND explicit recommendation; FAIL if fewer than 3 strategies, scoring incomplete, or recommendation missing | 1. If strategy count is < 3, re-run with "MUST generate exactly 3 strategies" stronger framing; 2. If scoring dimensions are missing, the prompt may have been interpreted as prose - request "markdown table with rows per strategy and columns per dimension"; 3. If `--agent ultra-think` is rejected, run `claude agents list`; 4. If runtime is excessive, lower `--max-budget-usd` and accept shallower depth |

### Optional Supplemental Checks

For comparison with the `--effort high` baseline (CC-008), note that `--agent ultra-think` already implies extended reasoning - some agent definitions inject `--effort high` automatically, others require it explicitly. Document the observed token usage for future calibration.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` | Ultra-think agent details (section 4) and routing decision guide (section 5) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../assets/prompt_templates.md` | Multi-Strategy Planning template (section 10) |
| `../../references/agent_delegation.md` | Model + Agent Combinations table |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CC-014
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--agent-routing/004-ultra-think-multi-strategy-planning.md`
