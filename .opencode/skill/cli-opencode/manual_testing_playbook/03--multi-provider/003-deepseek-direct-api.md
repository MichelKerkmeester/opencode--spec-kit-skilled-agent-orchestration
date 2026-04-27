---
title: "CO-011 -- deepseek direct API (deepseek-v4-pro)"
description: "This scenario validates the deepseek direct API provider for `CO-011`. It focuses on confirming `--model deepseek/deepseek-v4-pro --variant high` runs successfully via the direct deepseek provider (bypasses opencode-go) and produces a coherent response."
---

# CO-011 -- deepseek direct API (deepseek-v4-pro)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-011`.

---

## 1. OVERVIEW

This scenario validates the deepseek direct API for `CO-011`. It focuses on confirming `--model deepseek/deepseek-v4-pro --variant high` runs successfully through the direct DeepSeek provider — bypassing the opencode-go gateway — and produces a coherent response. The direct deepseek provider is the third surface alongside `github-copilot` and `opencode-go` in the cli-opencode skill model selection table.

### Why This Matters

The cli-opencode skill supports three providers: `github-copilot` (default), `opencode-go` (gateway routing for DeepSeek and other open models), and `deepseek` (direct DeepSeek API). The direct path matters when the operator wants the DeepSeek model without the opencode-go middleware (different latency, different rate limits, separate credentials). If `--model deepseek/deepseek-v4-pro` silently falls back to opencode-go's `opencode-go/deepseek-v4-pro` or fails resolution, the documented direct-API surface is broken and operators cannot bypass the gateway.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-011` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--model deepseek/deepseek-v4-pro --variant high` resolves correctly via the direct deepseek provider and produces a coherent response, validating the provider is registered and reachable independent of opencode-go.
- Real user request: `Run opencode run with the direct DeepSeek API (deepseek/deepseek-v4-pro, not the opencode-go gateway) and have it answer a small implementation-planning question. Confirm the model id in the JSON event stream is deepseek-v4-pro and the response is coherent.`
- Prompt: `As an external-AI conductor exercising the direct deepseek provider, dispatch --model deepseek/deepseek-v4-pro --variant high with a small implementation-planning prompt. Verify the dispatch exits 0, the JSON event stream identifies the model as deepseek-v4-pro, and the response is a coherent paragraph (not empty, not an error). Return a concise pass/fail verdict naming the resolved model id and one quoted sentence from the response.`
- Expected execution process: External-AI orchestrator dispatches with `--model deepseek/deepseek-v4-pro --variant high` plus a planning prompt, captures the JSON event stream, parses the session.completed event for the model identifier and inspects the response for coherence.
- Expected signals: Dispatch exits 0. Session.completed references `deepseek-v4-pro`. Response is non-empty and coherent. Runtime under 180 seconds.
- Desired user-visible outcome: Verdict naming the resolved model id and one quoted sentence from the response.
- Pass/fail: PASS if exit 0 AND model is `deepseek-v4-pro` AND response is non-empty and coherent. FAIL if model resolves differently, response is empty/an error, or dispatch fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Dispatch with `--model deepseek/deepseek-v4-pro --variant high` plus a planning prompt.
3. Parse the JSON event stream and extract the model identifier from session.completed.
4. Confirm the response is non-empty and coherent.
5. Return a verdict naming model id with a quoted excerpt.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-011 | deepseek direct API (deepseek-v4-pro) | Confirm `--model deepseek/deepseek-v4-pro --variant high` resolves via the direct deepseek provider and produces a coherent response | `As an external-AI conductor exercising the direct deepseek provider, dispatch --model deepseek/deepseek-v4-pro --variant high with a small implementation-planning prompt. Verify the dispatch exits 0, the JSON event stream identifies the model as deepseek-v4-pro, and the response is a coherent paragraph (not empty, not an error). Return a concise pass/fail verdict naming the resolved model id and one quoted sentence from the response.` | 1. `bash: opencode run --model deepseek/deepseek-v4-pro --agent general --variant high --format json --dir "$(pwd)" "Plan a three-step migration sequence for adding a NOT NULL column with a default value to a 1M-row PostgreSQL table without taking the table offline. Be concise but specific about each step." > /tmp/co-011-events.jsonl 2>&1` -> 2. `bash: echo "Exit: $?"` -> 3. `bash: jq -r 'select(.type == "session.completed") \| .payload' /tmp/co-011-events.jsonl \| grep -ciE 'deepseek-v4-pro'` -> 4. `bash: jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-011-events.jsonl \| wc -c` | Step 1: events captured non-empty; Step 2: exit 0; Step 3: deepseek-v4-pro identified in session.completed (count >= 1); Step 4: response byte count > 400 (coherent paragraph, not empty / error) | `/tmp/co-011-events.jsonl`, terminal grep counts | PASS if exit 0 AND model id is deepseek-v4-pro AND response > 400 bytes; FAIL if any check fails | 1. If dispatch fails with `provider/model not found`, run `opencode providers` to confirm direct `deepseek` is registered (separate from `opencode-go`) and authenticated (`opencode providers login deepseek`); 2. If `DEEPSEEK_API_KEY` is missing, the direct provider fails at session start — set the env var and retry; 3. If model id is missing from JSON, fall back to `--print-logs --log-level DEBUG` and look for the resolution event to confirm the dispatch went through `deepseek/` and not `opencode-go/`; 4. If response is empty or an error, re-run with `--print-logs --log-level DEBUG` to capture the upstream error |

### Optional Supplemental Checks

For provider-isolation validation, also dispatch the same prompt against `--model opencode-go/deepseek-v4-pro` and confirm the resolved provider differs (deepseek vs opencode-go) even though both touch the same DeepSeek model id. This proves the two providers are independent surfaces, not aliases.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§5 MODEL SELECTION) | Provider table includes deepseek direct API alongside opencode-go and github-copilot |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 user override table — deepseek direct API as third provider surface |
| `../../references/cli_reference.md` | §5 deepseek model ids (`deepseek-v4-pro`, `deepseek-v4-flash`) and reasoning-effort variant range |

---

## 5. SOURCE METADATA

- Group: Multi-Provider
- Playbook ID: CO-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--multi-provider/003-deepseek-direct-api.md`
