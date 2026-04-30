---
title: "CP-006 -- Claude Opus 4.6 for architectural reasoning"
description: "This scenario validates architectural-reasoning routing to `--model claude-opus-4.7` for `CP-006`. It focuses on confirming the model returns a multi-option architectural comparison naming distinct approaches with trade-offs."
---

# CP-006 -- Claude Opus 4.6 for architectural reasoning

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-006`.

---

## 1. OVERVIEW

This scenario validates the documented architectural-reasoning routing for `CP-006`. It focuses on confirming `--model claude-opus-4.7` returns a multi-option architectural comparison naming at least two distinct approaches with trade-offs, validating the model selection actually changes Copilot's behaviour toward deep-reasoning output.

### Why This Matters

cli-copilot's documented multi-model strategy in `references/integration_patterns.md` §5 routes "Deep Architecture/Refactor" to `claude-opus-4.7`. If the Opus route silently degrades to a single-option recommendation (or routes to a faster model that skips trade-off analysis), every architectural-planning prompt template inherits the same defect. Verifying multi-option output with explicit trade-offs is the cheapest objective check.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-006` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--model claude-opus-4.7` returns a structured comparison naming at least two distinct architectural approaches with trade-offs
- Real user request: `Ask Copilot's deepest reasoning model to compare two architectural approaches for a small system and verify the answer actually weighs trade-offs.`
- RCAF Prompt: `As a cross-AI orchestrator routing deep architectural reasoning to Claude Opus, invoke Copilot CLI with --model claude-opus-4.7 against the cli-copilot skill in this repository. Verify the model returns a structured comparison naming at least two distinct architectural approaches with trade-offs. Return a concise pass/fail verdict with the main reason and the names of the compared approaches.`
- Expected execution process: orchestrator dispatches `copilot -p "..." --model claude-opus-4.7 2>&1` for an architectural-comparison prompt, then verifies the response names at least 2 distinct approaches and includes trade-off bullets
- Expected signals: `EXIT=0`. Response names at least 2 distinct architectural approaches (e.g. "monolith", "microservices", "modular monolith", "event-driven", etc.). Each named approach has at least one trade-off bullet. Tripwire diff is empty
- Desired user-visible outcome: PASS verdict + a 2-3 line summary listing the compared approaches and the recommended one
- Pass/fail: PASS if EXIT=0 AND >= 2 distinct approaches named AND each has a trade-off bullet AND tripwire diff is empty. FAIL if only one approach is presented, no trade-offs are listed or the project tree is mutated

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate that pinning to claude-opus-4.7 yields a multi-option comparison with explicit trade-offs".
2. Stay local: this is a direct CLI dispatch from the calling AI. No sub-agent delegation needed.
3. Dispatch the Opus-pinned reasoning call.
4. Parse the response for distinct approach names and trade-off markers.
5. Return a one-line verdict listing the compared approaches.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-006 | Claude Opus 4.6 for architectural reasoning | Confirm `--model claude-opus-4.7` returns a multi-option architectural comparison naming distinct approaches with trade-offs | `As a cross-AI orchestrator routing deep architectural reasoning to Claude Opus, invoke Copilot CLI with --model claude-opus-4.7 against the cli-copilot skill in this repository. Verify the model returns a structured comparison naming at least two distinct architectural approaches with trade-offs. Return a concise pass/fail verdict with the main reason and the names of the compared approaches.` | 1. `bash: git status --porcelain > /tmp/cp-006-pre.txt` -> 2. `bash: copilot -p "Compare exactly two architectural approaches for a small notification service that fans out to 5 downstream consumers (target: ~100 events/sec). Name each approach explicitly. For each, list at least one pro and one con. Recommend one and justify in one sentence." --model claude-opus-4.7 2>&1 \| tee /tmp/cp-006-out.txt` -> 3. `bash: git status --porcelain > /tmp/cp-006-post.txt && diff /tmp/cp-006-pre.txt /tmp/cp-006-post.txt && grep -ciE '(pro\|con\|trade.?off\|advantage\|disadvantage\|recommend)' /tmp/cp-006-out.txt` | Step 1: pre-tripwire captured; Step 2: exits 0, stdout names 2 distinct architectural approaches and includes pro/con bullets per approach; Step 3: tripwire diff empty, grep count >= 4 (at least 2 pros + 2 cons or equivalent trade-off markers) | `/tmp/cp-006-out.txt` (transcript) + `/tmp/cp-006-pre.txt` and `/tmp/cp-006-post.txt` (tripwire pair) + grep count | PASS if EXIT=0 AND >= 2 distinct approaches named AND >= 4 trade-off markers found AND tripwire diff is empty; FAIL if only 1 approach is presented, < 2 trade-off markers, or project tree is mutated | 1. If only 1 approach is presented, re-check the Opus model is actually responding (look for Anthropic-style markers in the response) and verify subscription includes Opus access; 2. If trade-offs are missing, tighten the prompt to "list pros AND cons explicitly" and re-run; 3. If response is unexpectedly short, verify the active model is Opus and not a smaller fallback |

### Optional Supplemental Checks

After PASS, look for whether Copilot framed its recommendation against the specific scale signal in the prompt (~100 events/sec). A recommendation that ignores the operating scale suggests the model glossed the prompt, flag for re-review even if the numeric checks all pass.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, Model Selection table in §3 includes `claude-opus-4.7` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | Documents `claude-opus-4.7` in §6 MODELS table (Best For: Architecture & complex logic) |
| `../../references/integration_patterns.md` | §5 Multi-Model Strategy routes "Deep Architecture/Refactor" to `claude-opus-4.7` |

---

## 5. SOURCE METADATA

- Group: Multi-Model
- Playbook ID: CP-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--multi-model/003-claude-opus-architectural-reasoning.md`
