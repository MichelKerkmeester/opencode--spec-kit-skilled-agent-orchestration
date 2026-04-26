---
title: "CC-012 -- Debug agent fresh-perspective root cause"
description: "This scenario validates Debug agent fresh-perspective root cause for `CC-012`. It focuses on confirming `--agent debug` accepts a 'what I tried' context block and returns ranked root causes with diagnostic next steps."
---

# CC-012 -- Debug agent fresh-perspective root cause

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-012`.

---

## 1. OVERVIEW

This scenario validates Debug agent fresh-perspective root cause for `CC-012`. It focuses on confirming `--agent debug` accepts a 'what I tried' context block and returns ranked root causes with diagnostic next steps.

### Why This Matters

The `debug` agent is positioned as the fresh-perspective debugger when the calling AI's local debugging attempts have failed. If the debug agent simply re-derives the same hypotheses the calling AI already tried (because it was not given the "already tried" context), the cross-AI debugging value collapses. This scenario validates that the agent honors the prior-attempts context.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CC-012` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--agent debug` accepts a "what I tried" context block plus relevant file references and returns ranked root causes with at least 2 concrete diagnostic steps per cause, distinct from the prior attempts.
- Real user request: `I've been debugging intermittent JWT auth failures - I've already checked token expiry, secret rotation, and middleware order. The bug persists. Get Claude Code to give me a fresh perspective.`
- Prompt: `As an external-AI conductor stuck on a debugging task after multiple local attempts, dispatch claude -p --agent debug with the prior debugging analysis embedded in the prompt and the relevant files referenced via @./path. Verify the response ranks possible root causes by likelihood, suggests at least 2 concrete diagnostic steps per cause, and does not recycle the analysis the conductor already tried. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: External-AI orchestrator constructs a prompt with explicit "I've tried X, Y, Z" prior-attempts block and a code reference, dispatches with `--agent debug`, then verifies the response ranks causes and suggests diagnostic steps that are NOT in the prior-attempts list.
- Expected signals: Response lists at least 2 distinct ranked root causes. For each cause provides at least 2 concrete diagnostic steps. Explicitly distinguishes itself from the "already tried" set provided in the prompt.
- Desired user-visible outcome: Verdict naming the top-ranked root cause and the count of distinct diagnostic steps surfaced.
- Pass/fail: PASS if response surfaces >=2 ranked causes AND >=2 diagnostic steps per cause AND avoids the "already tried" hypotheses. FAIL if any condition fails or the response merely restates what was already tried.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Construct a prompt with an explicit "Already tried:" block listing prior hypotheses.
3. Reference 1-2 files via `@./path` so the agent has concrete code to inspect.
4. Dispatch with `--agent debug`.
5. Parse the response for ranked causes and diagnostic steps.
6. Return a verdict naming the top-ranked cause and step count.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-012 | Debug agent fresh-perspective root cause | Confirm `--agent debug` returns ranked causes and diagnostic steps distinct from prior attempts | `As an external-AI conductor stuck on a debugging task after multiple local attempts, dispatch claude -p --agent debug with the prior debugging analysis embedded in the prompt and the relevant files referenced via @./path. Verify the response ranks possible root causes by likelihood, suggests at least 2 concrete diagnostic steps per cause, and does not recycle the analysis the conductor already tried. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: mkdir -p /tmp/cli-claude-code-playbook && printf "function verifyJWT(token, secret) {\n  try {\n    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });\n    return { ok: true, user: decoded };\n  } catch (e) {\n    return { ok: false, error: e.message };\n  }\n}\n" > /tmp/cli-claude-code-playbook/jwt-handler.ts` -> 2. `bash: claude -p "Debugging intermittent JWT auth failures (about 2-3 per hour under normal load). Already tried: (1) checked token expiry windows look correct, (2) verified secret rotation aligned with new token issuance, (3) confirmed middleware order is correct. The bug persists. Fresh perspective needed. Code: @/tmp/cli-claude-code-playbook/jwt-handler.ts. Rank possible NEW root causes by likelihood and give at least 2 concrete diagnostic steps for each. Do not repeat what I already tried." --agent debug --permission-mode plan --output-format text 2>&1 \| tee /tmp/cc-012-output.txt` -> 3. `bash: grep -iE '(root cause\|cause [0-9]\|likely\|likelihood)' /tmp/cc-012-output.txt \| head -10` -> 4. `bash: grep -ciE '(diagnostic\|check\|verify\|test)' /tmp/cc-012-output.txt` -> 5. `bash: grep -ciE '(token expir\|secret rotat\|middleware order)' /tmp/cc-012-output.txt` | Step 1: sandbox JWT handler written; Step 2: dispatch completes; Step 3: response surfaces at least 2 ranked causes; Step 4: count of diagnostic-language verbs >= 4 (i.e., at least 2 per cause); Step 5: count of "already tried" keyword reuses is 0 OR the response explicitly addresses why those are NOT the cause | `/tmp/cli-claude-code-playbook/jwt-handler.ts`, `/tmp/cc-012-output.txt`, terminal transcript with grep counts | PASS if >=2 ranked causes AND >=2 diagnostic steps per cause AND avoids "already tried" set; FAIL if response restates prior hypotheses or surfaces fewer than 2 causes | 1. If response repeats prior hypotheses, the prompt's "Do not repeat" clause may have been ignored - re-run with stronger framing; 2. If `--agent debug` is rejected as "not found", run `claude agents list`; 3. If only 1 cause surfaces, the agent may have converged early - inspect for explicit confidence language and re-run with "rank at least 3 causes" |

### Optional Supplemental Checks

If the response surfaces causes that match the "already tried" list, examine whether the agent acknowledged them as ruled out vs blindly suggested them again. Acknowledging-and-deprioritizing is acceptable. Blind repetition is not.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` | Debug agent details (section 4) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../assets/prompt_templates.md` | Fresh-Perspective Debug template (section 5) |
| `../../references/agent_delegation.md` | Routing decision guide (section 5) |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CC-012
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--agent-routing/002-debug-agent-fresh-perspective-root-cause.md`
