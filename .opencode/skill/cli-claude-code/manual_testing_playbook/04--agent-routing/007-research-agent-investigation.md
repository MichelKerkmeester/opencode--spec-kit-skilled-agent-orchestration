---
title: "CC-023 -- Research agent deep investigation"
description: "This scenario validates Research agent deep investigation for `CC-023`. It focuses on confirming `--agent research` produces an evidence-backed feasibility analysis with comparative trade-offs."
---

# CC-023 -- Research agent deep investigation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-023`.

---

## 1. OVERVIEW

This scenario validates Research agent deep investigation for `CC-023`. It focuses on confirming `--agent research` produces an evidence-backed comparative analysis between two or more candidate approaches with explicit trade-offs and a recommendation.

### Why This Matters

The `research` agent is the documented evidence-gathering specialist per SKILL.md §3 Agent Routing Table. When the calling AI needs to compare technologies or assess feasibility before architecture decisions, routing through `research` yields a structured trade-off analysis instead of an opinion. If research output collapses into a single-option pitch, downstream architecture decisions lose their evidence base and the trade-off contract is broken.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-023` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--agent research` produces a comparative analysis of at least 2 candidate approaches across at least 3 trade-off dimensions and surfaces an explicit recommendation with rationale.
- Real user request: `Compare Redis vs Memcached for our session storage needs. I need trade-offs across performance, clustering, persistence, and a recommendation we can defend in the architecture review.`
- Prompt: `As an external-AI conductor facing an architecture decision that requires evidence-backed comparison, dispatch claude -p --agent research and ask for a comparative analysis of two named candidates across at least 3 trade-off dimensions. Verify the response surfaces explicit pros and cons per candidate and ends with a recommendation plus rationale. Return a verdict naming the candidates, dimensions, and recommendation.`
- Expected execution process: External-AI orchestrator picks a real architecture trade-off question with two candidates, dispatches with `--agent research`, captures the analysis, then validates the structure covers comparison across multiple dimensions plus a recommendation.
- Expected signals: Response names both candidates explicitly. Compares them across at least 3 dimensions (e.g., performance, clustering, persistence). Surfaces pros and cons per candidate. Ends with an explicit recommendation. Provides rationale tied to the evidence.
- Desired user-visible outcome: A comparison brief the operator can paste into an architecture review.
- Pass/fail: PASS if response compares >= 2 candidates across >= 3 dimensions AND ends with a recommendation plus rationale. FAIL if comparison is one-sided or recommendation is missing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Identify the two candidates and the trade-off dimensions.
3. Dispatch with `--agent research` and a prompt asking for comparative analysis.
4. Verify the response covers >= 3 dimensions and ends with a recommendation.
5. Return a verdict naming the candidates, dimensions covered and the recommendation.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-023 | Research agent deep investigation | Confirm `--agent research` produces a comparative analysis with explicit trade-offs and a recommendation | `As an external-AI conductor facing an architecture decision between Redis and Memcached for session storage, dispatch claude -p --agent research and ask for a comparative analysis across performance, clustering, persistence, and operational complexity. Verify the response surfaces explicit pros and cons per candidate and ends with a recommendation plus rationale. Return a verdict naming the candidates, dimensions, and recommendation.` | 1. `bash: claude -p "Compare Redis and Memcached for session storage. Cover at least 4 dimensions: read and write performance, clustering and high availability, persistence options, operational complexity. Surface pros and cons per candidate. End with a recommendation plus rationale tied to the evidence." --agent research --output-format text 2>&1 \| tee /tmp/cc-023-output.txt` -> 2. `bash: grep -ciE '(redis\|memcached)' /tmp/cc-023-output.txt` -> 3. `bash: grep -ciE '(performance\|clustering\|persistence\|operational)' /tmp/cc-023-output.txt` -> 4. `bash: grep -ciE '(recommend\|recommendation)' /tmp/cc-023-output.txt` | Step 1: response captured; Step 2: count of candidate mentions >= 4 (each candidate >= 2 times); Step 3: count of dimension mentions >= 4; Step 4: count of recommendation mentions >= 1 | `/tmp/cc-023-output.txt`, terminal grep counts | PASS if response compares >= 2 candidates across >= 3 dimensions AND ends with a recommendation plus rationale; FAIL if comparison is one-sided or recommendation is missing | 1. If the response is one-sided, re-prompt with explicit "treat both candidates equally and surface trade-offs against each other"; 2. If the recommendation is absent, refine the prompt to require an explicit "Recommendation:" section; 3. If `--agent research` is rejected, run `claude agents list` to confirm the agent is registered |

### Optional Supplemental Checks

For deeper validation, ask for a citation table mapping each claim back to a primary source. The `research` agent should be able to enumerate sources when prompted, even though the cli-claude-code skill does not surface a `--search` flag.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` | Research agent role per the documented roster |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` (line 214) | Documents the research agent in the §3 Agent Routing Table |
| `../../references/agent_delegation.md` | Agent contract for evidence-backed investigation |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CC-023
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--agent-routing/007-research-agent-investigation.md`
