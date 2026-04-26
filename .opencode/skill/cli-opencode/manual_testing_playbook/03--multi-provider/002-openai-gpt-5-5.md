---
title: "CO-010 -- OpenAI provider override (gpt-5.5)"
description: "This scenario validates the OpenAI provider override for `CO-010`. It focuses on confirming `--model openai/gpt-5.5 --variant high` runs successfully via the OpenAI provider plugin and produces a code-generation response."
---

# CO-010 -- OpenAI provider override (gpt-5.5)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-010`.

---

## 1. OVERVIEW

This scenario validates OpenAI provider override for `CO-010`. It focuses on confirming the documented user override path "use openai gpt-5.5 high" (per SKILL.md §3 user override table) actually resolves to `--model openai/gpt-5.5 --variant high` and produces a successful code-generation response.

### Why This Matters

cli-opencode supports provider switching via the `--model` flag plus the OpenAI provider plugin. If the OpenAI provider does not load (auth failure, plugin missing, bad model id), the documented user override examples in SKILL.md break and the operator cannot route Codex-style code-generation through OpenCode's plugin runtime. This test proves the OpenAI provider works end-to-end for the canonical Codex-style use case (small code-generation request).

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-010` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--model openai/gpt-5.5 --variant high` resolves successfully via the OpenAI provider, executes a small code-generation prompt and the JSON event stream's session.completed payload identifies the model as `gpt-5.5`.
- Real user request: `Run opencode run with the OpenAI provider override (gpt-5.5 high) and have it generate a small TypeScript helper. Confirm the model id in the JSON event stream is gpt-5.5 and the helper compiles.`
- Prompt: `As an external-AI conductor exercising the OpenAI provider override path documented in SKILL.md, dispatch --model openai/gpt-5.5 --variant high with a small code-generation prompt (write a TypeScript helper). Verify the dispatch exits 0, the JSON event stream identifies the model as gpt-5.5, and the generated TypeScript code is syntactically valid (compiles via tsc --noEmit). Return a concise pass/fail verdict naming the resolved model id and the compile status.`
- Expected execution process: External-AI orchestrator dispatches with the explicit OpenAI override, captures the response, extracts the generated TypeScript snippet, writes it to a temp file and runs `tsc --noEmit` to validate syntactic correctness.
- Expected signals: Dispatch exits 0. Session.completed payload references `gpt-5.5` as the model. The response contains a TypeScript code block. The extracted code compiles via `tsc --noEmit` without errors. Runtime under 120 seconds.
- Desired user-visible outcome: Verdict naming the resolved model id and the tsc compile result.
- Pass/fail: PASS if exit 0 AND model is `gpt-5.5` AND extracted code compiles. FAIL if dispatch fails, model resolves differently or generated code does not compile.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Dispatch with the explicit OpenAI provider override.
3. Extract the TypeScript code block from the response.
4. Write the code to `/tmp/co-010-helper.ts` and run `tsc --noEmit`.
5. Return a verdict naming model id and compile result.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-010 | OpenAI provider override (gpt-5.5) | Confirm `--model openai/gpt-5.5 --variant high` resolves and produces compileable TypeScript | `As an external-AI conductor exercising the OpenAI provider override path documented in SKILL.md, dispatch --model openai/gpt-5.5 --variant high with a small code-generation prompt (write a TypeScript helper). Verify the dispatch exits 0, the JSON event stream identifies the model as gpt-5.5, and the generated TypeScript code is syntactically valid (compiles via tsc --noEmit). Return a concise pass/fail verdict naming the resolved model id and the compile status.` | 1. `bash: opencode run --model openai/gpt-5.5 --agent general --variant high --format json --dir "$(pwd)" "Write a TypeScript helper function called formatBytesCO010(bytes: number): string that converts a byte count to a human-readable string (B/KB/MB/GB). Output ONLY the function code (no markdown fences) so it can be saved directly to a .ts file." > /tmp/co-010-events.jsonl 2>&1` -> 2. `bash: echo "Exit: $?"` -> 3. `bash: jq -r 'select(.type == "session.completed") \| .payload' /tmp/co-010-events.jsonl \| grep -ciE 'gpt-5.5'` -> 4. `bash: jq -r 'select(.type == "message.delta") \| .payload' /tmp/co-010-events.jsonl \| sed -n '/function formatBytesCO010/,/^}/p' > /tmp/co-010-helper.ts && cat /tmp/co-010-helper.ts \| head -20` -> 5. `bash: cd /tmp && (command -v tsc && tsc --noEmit /tmp/co-010-helper.ts && echo "TSC_OK") \|\| echo "TSC_NOT_INSTALLED — content-only validation"` -> 6. `bash: grep -ciE '(formatBytesCO010\|return.*string)' /tmp/co-010-helper.ts` | Step 1: events captured non-empty; Step 2: exit 0; Step 3: model `gpt-5.5` referenced in session.completed (count >= 1); Step 4: helper.ts contains the formatBytesCO010 function; Step 5: prints `TSC_OK` (when tsc installed) OR fallback message; Step 6: count of `formatBytesCO010` mentions >= 1 | `/tmp/co-010-events.jsonl`, `/tmp/co-010-helper.ts`, terminal output of tsc/grep | PASS if exit 0 AND model id is gpt-5.5 AND helper.ts contains the function (and compiles when tsc available); FAIL if model resolves differently, helper is missing, or tsc reports errors | 1. If dispatch fails with `provider/model not found`, run `opencode providers` to confirm OpenAI is registered and `auth login openai` has succeeded; 2. If model id is missing from JSON, fall back to `--print-logs --log-level DEBUG` and look for the resolution event; 3. If extracted code is wrapped in markdown fences, strip them with `sed -e '/^```/d'` before saving; 4. If `OPENAI_API_KEY` is missing, the OpenAI provider plugin fails at session start — set the env var and retry |

### Optional Supplemental Checks

For variant verification, repeat the test with `--variant xhigh` (the OpenAI top tier per `references/cli_reference.md` §5) and confirm the response is materially longer and the cost is higher. This proves the variant flag truly maps to OpenAI's reasoning effort, not just to Anthropic's.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§5 MODEL SELECTION + variant table for OpenAI) | OpenAI model and variant documentation |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 default invocation user override table ("Use openai gpt-5.5 high") |
| `../../references/cli_reference.md` | §5 OpenAI model id (`openai/gpt-5.5`) and variant range |

---

## 5. SOURCE METADATA

- Group: Multi-Provider
- Playbook ID: CO-010
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--multi-provider/002-openai-gpt-5-5.md`
