---
title: "CG-019 -- @debug agent fresh-perspective root cause"
description: "This scenario validates the @debug agent for `CG-019`. It focuses on confirming the As @debug: prefix produces a ranked root-cause analysis with diagnostic next steps after prior debug attempts failed."
---

# CG-019 -- @debug agent fresh-perspective root cause

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CG-019`.

---

## 1. OVERVIEW

This scenario validates the `As @debug:` prompt-prefix routing for `CG-019`. It focuses on confirming Gemini's `@debug` agent accepts a "what I tried" context block plus a paste of the failing snippet and returns a ranked list of root-cause hypotheses with at least 2 concrete diagnostic next steps per hypothesis, demonstrating the documented Observe -> Analyze -> Hypothesize -> Fix methodology.

### Why This Matters

`agent_delegation.md` §3 defines `@debug` as the fresh-perspective debugger to dispatch via the calling AI's Task tool after 3+ failed local attempts. The cli-gemini playbook previously documented the routing contract under CG-013 but did not exercise an inline `As @debug:` dispatch to verify the agent surface works end to end. If `As @debug:` collapses to generic analysis or recycles the "already tried" set, the fresh-perspective methodology contract is broken and operators cannot trust the agent for hard bugs.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CG-019` and confirm the expected signals without contradictory evidence.

- Objective: Verify `As @debug agent:` produces a ranked root-cause analysis with at least 2 root-cause hypotheses, at least 2 diagnostic next steps per hypothesis and explicit acknowledgment of the prior-attempts context, AND the working tree remains unchanged.
- Real user request: `Use Gemini debug for an off-by-one I cannot pin down. Here is what I tried. Give me ranked root causes and concrete next steps.`
- RCAF Prompt: `As a cross-AI orchestrator handing off a stuck bug after 3+ failed attempts, FIRST create /tmp/cg-019-snippet.py with a deliberate off-by-one bug, THEN dispatch gemini "As @debug agent: Investigate the off-by-one bug in @./tmp/cg-019-snippet.py. Prior attempts: verified loop bounds twice, checked input data type, confirmed environment. Provide ranked root-cause hypotheses with at least 2 diagnostic next steps each. Distinguish your analysis from the prior attempts." -m gemini-3.1-pro-preview -o text. Verify the response ranks at least 2 root-cause hypotheses, names at least 2 concrete diagnostic next steps per hypothesis, and explicitly distinguishes from the "already tried" set. Return a verdict naming the highest-ranked hypothesis and the diagnostic next-step count.`
- Expected execution process: Cross-AI orchestrator pre-creates the snippet with a deliberate off-by-one bug, dispatches `As @debug agent:` with prior-attempts context, then validates the response ranks hypotheses and provides diagnostic next steps without recycling prior attempts.
- Expected signals: Pre-step writes a `.py` file with an off-by-one error. Gemini dispatch exits 0. Response ranks at least 2 root-cause hypotheses (numbered or labeled). Each hypothesis carries at least 2 diagnostic next steps. Response references "prior attempts" or equivalent and distinguishes from them. Working tree mtime for the project is unchanged (only `/tmp/` was touched).
- Desired user-visible outcome: A ranked diagnostic plan the operator can hand to a follow-up local debugging session.
- Pass/fail: PASS if exit 0 AND >= 2 ranked hypotheses AND >= 2 diagnostic steps per hypothesis AND prior-attempts acknowledgment AND working tree clean. FAIL if any check misses.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pre-create `/tmp/cg-019-snippet.py` with a deliberate off-by-one bug (e.g., `for i in range(0, len(arr) + 1):`).
2. Capture the prior-attempts context block.
3. Dispatch `As @debug agent:` with the snippet and prior-attempts context.
4. Verify the response ranks >= 2 hypotheses with >= 2 diagnostic steps each.
5. Confirm prior-attempts acknowledgment.
6. Verify the working tree status is unchanged.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CG-019 | @debug agent fresh-perspective root cause | Verify `As @debug agent:` produces a ranked root-cause analysis with diagnostic next steps after 3+ failed attempts | `Spec folder: /tmp/cg-019-sandbox (pre-approved, skip Gate 3). As a cross-AI orchestrator handing off a stuck bug after 3+ failed attempts, FIRST create /tmp/cg-019-snippet.py with a deliberate off-by-one bug, THEN dispatch gemini "As @debug agent: Investigate the off-by-one bug in @./tmp/cg-019-snippet.py. Prior attempts: verified loop bounds twice, checked input data type, confirmed environment. Provide ranked root-cause hypotheses with at least 2 diagnostic next steps each. Distinguish your analysis from the prior attempts." -m gemini-3.1-pro-preview -o text. Verify the response ranks at least 2 root-cause hypotheses, names at least 2 concrete diagnostic next steps per hypothesis, and explicitly distinguishes from the "already tried" set. Return a verdict naming the highest-ranked hypothesis and the diagnostic next-step count.` | 1. `bash: rm -rf /tmp/cg-019-sandbox && mkdir -p /tmp/cg-019-sandbox && printf 'def sum_array(arr):\n    total = 0\n    for i in range(0, len(arr) + 1):\n        total += arr[i]\n    return total\n' > /tmp/cg-019-snippet.py` -> 2. `bash: git status --porcelain > /tmp/cg-019-pre.txt` -> 3. `bash: gemini "As @debug agent: Investigate the off-by-one bug in @./tmp/cg-019-snippet.py. Prior attempts: verified loop bounds twice, checked input data type, confirmed environment. Provide ranked root-cause hypotheses with at least 2 diagnostic next steps each. Distinguish your analysis from the prior attempts." -m gemini-3.1-pro-preview -o text > /tmp/cg-019-output.txt 2>&1` -> 4. `bash: echo "Exit: $?"` -> 5. `bash: grep -ciE '(hypothesis\|root cause\|cause [0-9]\|^[0-9]+\.\s)' /tmp/cg-019-output.txt` -> 6. `bash: grep -ciE '(next step\|diagnostic\|verify\|reproduce\|inspect)' /tmp/cg-019-output.txt` -> 7. `bash: grep -ciE '(prior attempt\|already tried\|distinct from\|different from your)' /tmp/cg-019-output.txt` -> 8. `bash: git status --porcelain > /tmp/cg-019-post.txt && diff /tmp/cg-019-pre.txt /tmp/cg-019-post.txt && echo OK_TREE_CLEAN` | Step 1: snippet created with off-by-one; Step 2: pre-snapshot captured; Step 3: dispatch captured; Step 4: exit 0; Step 5: hypothesis-marker count >= 2; Step 6: diagnostic-step count >= 4 (2 per hypothesis); Step 7: prior-attempts acknowledgment count >= 1; Step 8: `OK_TREE_CLEAN` printed | `/tmp/cg-019-output.txt`, `/tmp/cg-019-snippet.py`, pre and post tree-status diff | PASS if exit 0 AND >= 2 hypotheses AND >= 4 diagnostic steps total AND prior-attempts acknowledgment present AND working tree clean; FAIL if any check misses | (1) If the response collapses to a single hypothesis, refine the prompt to require numbered ranked hypotheses and re-dispatch; (2) if diagnostic steps are missing, prompt for "at least 2 concrete next steps per hypothesis" explicitly; (3) if `As @debug agent:` is rejected, verify the agent definition lives in `.gemini/agents/debug.md`; (4) if working tree changed, the agent wrote outside `/tmp/`, file a high-severity bug |

### Optional Supplemental Checks

For full methodology validation, ask Gemini to label the response phases as Observe, Analyze, Hypothesize, Fix per the documented 4-phase methodology in agent_delegation.md §3. The labels should appear verbatim or as direct synonyms.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` (§3 @debug) | Documents the debug agent contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` (line 194) | Documents `@debug` dispatch via Task tool |
| `../../references/agent_delegation.md` | §3 @debug, Fresh Perspective Debugger |
| `.gemini/agents/debug.md` | Agent definition file |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CG-019
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--agent-routing/005-debug-agent-root-cause.md`
