---
title: "CO-011 -- Google provider (gemini-2.5-pro)"
description: "This scenario validates the Google provider for `CO-011`. It focuses on confirming `--model google/gemini-2.5-pro --variant high` runs successfully via the Google provider plugin and supports a long-context summarization task."
---

# CO-011 -- Google provider (gemini-2.5-pro)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-011`.

---

## 1. OVERVIEW

This scenario validates Google provider for `CO-011`. It focuses on confirming `--model google/gemini-2.5-pro --variant high` runs successfully through the Google provider plugin and supports the long-context summarization use case documented in `references/cli_reference.md` §5 (model selection table).

### Why This Matters

The Google provider is the third documented provider in the cli-opencode skill (alongside Anthropic and OpenAI). Its primary use case is long-context tasks (web research, multi-file summarization). If the Google provider plugin does not load or the model id is not resolved correctly, operators lose access to Gemini's long-context advantage from inside an OpenCode dispatch. This test proves the Google provider works for a representative summarization request.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-011` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--model google/gemini-2.5-pro --variant high` resolves correctly via the Google provider and produces a coherent summarization response.
- Real user request: `Run opencode run with Google Gemini 2.5 pro and have it summarize a small attached markdown file. Confirm the model id in the JSON event stream is gemini-2.5-pro and the summary is coherent.`
- Prompt: `As an external-AI conductor exercising the Google provider, dispatch --model google/gemini-2.5-pro --variant high with -f attached to a short markdown file and ask the session to summarize it in one paragraph. Verify the dispatch exits 0, the JSON event stream identifies the model as gemini-2.5-pro, and the summary references content from the attachment. Return a concise pass/fail verdict naming the resolved model id and one quoted phrase from the summary.`
- Expected execution process: External-AI orchestrator writes a small markdown file with a unique phrase, dispatches with the Google provider override and -f attachment, captures the response, validates the summary references the unique phrase and validates the model id in session.completed.
- Expected signals: Dispatch exits 0. Session.completed references `gemini-2.5-pro`. Summary mentions the unique phrase from the attachment. Runtime under 120 seconds.
- Desired user-visible outcome: Verdict naming the model id, the unique phrase and the summary length.
- Pass/fail: PASS if exit 0 AND model is `gemini-2.5-pro` AND summary references the unique attachment phrase. FAIL if model resolves differently, summary is generic or dispatch fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Write a small markdown file with a uniquely-named technical concept.
3. Dispatch with the explicit Google provider override and -f attachment.
4. Validate the response references the unique phrase and the model id.
5. Return a verdict naming the model id and one quoted phrase.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-011 | Google provider (gemini-2.5-pro) | Confirm `--model google/gemini-2.5-pro --variant high` resolves and produces a summary referencing attached content | `As an external-AI conductor exercising the Google provider, dispatch --model google/gemini-2.5-pro --variant high with -f attached to a short markdown file and ask the session to summarize it in one paragraph. Verify the dispatch exits 0, the JSON event stream identifies the model as gemini-2.5-pro, and the summary references content from the attachment. Return a concise pass/fail verdict naming the resolved model id and one quoted phrase from the summary.` | 1. `bash: printf '# Quantum Snowflake Algorithm CO011\n\nThe quantum snowflake algorithm is a fictional sorting strategy that uses superposition over six branches. Its key invariant is the snowflake symmetry property which guarantees O(log n) collisions per branch.\n' > /tmp/co-011-doc.md && cat /tmp/co-011-doc.md` -> 2. `bash: opencode run --model google/gemini-2.5-pro --agent general --variant high --format json --dir "$(pwd)" -f /tmp/co-011-doc.md "Summarize the attached markdown file in one short paragraph. Mention the algorithm name explicitly." > /tmp/co-011-events.jsonl 2>&1` -> 3. `bash: echo "Exit: $?"` -> 4. `bash: jq -r 'select(.type == "session.completed") \| .payload' /tmp/co-011-events.jsonl \| grep -ciE 'gemini-2.5-pro'` -> 5. `bash: jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-011-events.jsonl \| grep -ciE '(quantum snowflake\|snowflake algorithm\|CO011)'` | Step 1: doc.md written and confirmed via cat; Step 2: events captured non-empty; Step 3: exit 0; Step 4: gemini-2.5-pro identified in session.completed; Step 5: summary mentions the unique phrase (count >= 1) | `/tmp/co-011-doc.md`, `/tmp/co-011-events.jsonl`, terminal grep output | PASS if exit 0 AND model id is gemini-2.5-pro AND summary references the unique phrase; FAIL if any check fails | 1. If dispatch fails with `provider/model not found`, run `opencode providers` to confirm Google is registered and authenticated (`auth login google`); 2. If summary is generic, the attachment may have been silently dropped — verify with `--print-logs --log-level DEBUG` and look for an attachment confirmation event; 3. If model id is missing from JSON, fall back to `opencode models google` to confirm `gemini-2.5-pro` is the correct slug; 4. If `GOOGLE_API_KEY` (or equivalent) is missing, the Google provider fails at session start |

### Optional Supplemental Checks

For long-context validation, swap the small attachment for a large multi-paragraph file (e.g., a copy of a SKILL.md) and confirm the summary still captures the unique phrase. This stress-tests the long-context value prop the Google provider is documented for.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§5 MODEL SELECTION, Google row) | Google model id and variant range |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 model selection table (Google row) |
| `../../references/cli_reference.md` | §5 Google variant values, model use case (Web research, long context) |

---

## 5. SOURCE METADATA

- Group: Multi-Provider
- Playbook ID: CO-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--multi-provider/003-google-gemini-2-5-pro.md`
