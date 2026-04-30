---
title: "CP-012 -- Mid-session model switch via per-call `--model`"
description: "This scenario validates the documented mid-session model-switching pattern for `CP-012`. It focuses on confirming two sequential `copilot -p` calls with different `--model` values each return answers consistent with the requested model's strengths."
---

# CP-012 -- Mid-session model switch via per-call `--model`

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-012`.

---

## 1. OVERVIEW

This scenario validates the documented mid-session model-switching pattern for `CP-012`. It focuses on confirming two sequential `copilot -p` calls in the same operator session can target different models via `--model`, with each model producing answers consistent with its documented strengths (Opus for deep reasoning, Sonnet for fast review).

### Why This Matters

cli-copilot's documented multi-model strategy in `references/integration_patterns.md` §5 explicitly assigns different tasks to different models. `references/copilot_tools.md` §2 documents "Multi-Provider Models" as a unique capability. The orchestrator-grade pattern is "pick the right model per call, mid-session", not "stick to one model for the whole session". If `--model` does not actually switch between calls (e.g. session state pins the first model and ignores subsequent flags), the entire multi-model orchestration story breaks. Verifying both models respond and respond differently in style/depth is the cheapest objective check.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-012` and confirm the expected signals without contradictory evidence.

- Objective: Confirm two sequential `copilot -p` calls with different `--model` values each return answers consistent with the requested model's strengths (Opus deep reasoning vs Sonnet fast review)
- Real user request: `Show me Copilot really switches models per call — Opus for a deep architectural question, then Sonnet for a quick code-style review, both in the same operator session.`
- RCAF Prompt: `As a cross-AI orchestrator switching models per task within one operator session, invoke Copilot CLI twice in sequence against the cli-copilot skill in this repository: first --model claude-opus-4.7 for a deep architectural question, then --model claude-sonnet-4.6 for a quick code-style review of a tiny snippet. Verify both calls exit 0, both return non-empty answers consistent with the requested model strength, and the working tree is unchanged. Return a concise pass/fail verdict with the main reason and a one-line summary per model call.`
- Expected execution process: orchestrator captures pre-call tripwire, dispatches the Opus call for an architectural question, then dispatches the Sonnet call for a code-style review of a tiny inline snippet, then verifies both responses are non-empty, consistent with the requested model strength and the project tree is unchanged
- Expected signals: both calls exit 0. Opus response covers >= 2 architectural trade-offs. Sonnet response returns >= 1 specific style finding. Tripwire diff is empty
- Desired user-visible outcome: PASS verdict + a one-line summary per model call (Opus: trade-off summary, Sonnet: style finding)
- Pass/fail: PASS if both calls exit 0 AND Opus has >= 2 trade-offs AND Sonnet has >= 1 style finding AND tripwire diff is empty. FAIL if either call errors, Opus returns < 2 trade-offs, Sonnet returns no style findings or project tree mutated

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate per-call --model actually switches behaviour mid-session, not just on the first call".
2. Stay local: two sequential CLI dispatches from the calling AI. No sub-agent delegation needed.
3. Capture a pre-call tripwire.
4. Dispatch the Opus architectural call.
5. Dispatch the Sonnet style-review call with a tiny snippet (passed via prompt body, not a file).
6. Compare both responses against the model strengths and return a one-line per-call verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-012 | Mid-session model switch via per-call `--model` | Confirm two sequential `copilot -p` calls with different `--model` values each return answers consistent with the requested model's strengths | `As a cross-AI orchestrator switching models per task within one operator session, invoke Copilot CLI twice in sequence against the cli-copilot skill in this repository: first --model claude-opus-4.7 for a deep architectural question, then --model claude-sonnet-4.6 for a quick code-style review of a tiny snippet. Verify both calls exit 0, both return non-empty answers consistent with the requested model strength, and the working tree is unchanged. Return a concise pass/fail verdict with the main reason and a one-line summary per model call.` | 1. `bash: git status --porcelain > /tmp/cp-012-pre.txt` -> 2. `bash: copilot -p "Briefly compare two database write strategies for a high-write event store: append-only log vs in-place update. List at least one pro and one con for each, and recommend one." --model claude-opus-4.7 2>&1 \| tee /tmp/cp-012-opus.txt; echo "EXIT_OPUS=$?"` -> 3. `bash: copilot -p "Quick code-style review of this Python snippet: 'def f(x):\n  if x==None: return 0\n  else: return x+1'. List style issues you would fix." --model claude-sonnet-4.6 2>&1 \| tee /tmp/cp-012-sonnet.txt; echo "EXIT_SONNET=$?"` -> 4. `bash: git status --porcelain > /tmp/cp-012-post.txt && diff /tmp/cp-012-pre.txt /tmp/cp-012-post.txt && grep -ciE '(pro\|con\|trade.?off\|advantage\|disadvantage\|recommend)' /tmp/cp-012-opus.txt && grep -ciE '(==.?none\|is none\|pep8\|naming\|f.string\|return type)' /tmp/cp-012-sonnet.txt` | Step 1: pre-tripwire captured; Step 2: EXIT_OPUS=0, transcript covers 2 strategies with pros/cons; Step 3: EXIT_SONNET=0, transcript identifies at least 1 style issue from the snippet (e.g. `==None` should be `is None`); Step 4: tripwire diff empty, Opus grep count >= 4, Sonnet grep count >= 1 | `/tmp/cp-012-opus.txt` (Opus transcript) + `/tmp/cp-012-sonnet.txt` (Sonnet transcript) + `/tmp/cp-012-pre.txt` and `/tmp/cp-012-post.txt` (tripwire pair) + grep counts | PASS if both EXITs = 0 AND Opus grep >= 4 AND Sonnet grep >= 1 AND tripwire empty; FAIL if either EXIT != 0, Opus < 4 trade-off markers, Sonnet returns no specific style finding, or tripwire diff non-empty | 1. If Opus output is unexpectedly short, verify the active subscription includes Opus access; 2. If Sonnet misses the obvious `== None` style issue, the model may have been substituted — confirm the response style is Anthropic-flavored; 3. If both responses look identical in style, suspect that one of the two `--model` flags was silently ignored — re-run each independently to bisect |

### Optional Supplemental Checks

After PASS, look for stylistic differences between the two responses (Opus typically structured with explicit trade-off framing, Sonnet typically faster and more concise). A wildly similar style suggests one model is being substituted under the hood, flag for follow-up review.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, Model Selection table in §3 includes both Opus and Sonnet |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/integration_patterns.md` | §5 Multi-Model Strategy decision matrix routes "Deep Architecture" to Opus and "Fast Coding/Review" to Sonnet |
| `../../references/copilot_tools.md` | §2 Multi-Provider Models capability documentation |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CP-012
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--agent-routing/003-mid-session-model-switch.md`
