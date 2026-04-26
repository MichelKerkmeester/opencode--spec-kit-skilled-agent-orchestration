---
title: "CP-014 -- Mid-session model switch persistence"
description: "This scenario validates per-call model selection persistence across sequential `copilot -p` invocations for `CP-014`. It focuses on confirming each invocation honours its `--model` flag independently and identifies the correct model in the response."
---

# CP-014 -- Mid-session model switch persistence

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-014`.

---

## 1. OVERVIEW

This scenario validates the per-call model-selection persistence surface for `CP-014`. It focuses on confirming sequential `copilot -p` invocations targeting different models each honour their `--model` flag independently, Anthropic Claude Opus 4.6 for the first call, OpenAI GPT-5.3-Codex for the second, with each response correctly identifying the responding model family.

### Why This Matters

CP-012 covers the per-call model switch within an agent-routing context (Opus for architecture, Sonnet for review). CP-014 covers it as a continuity contract, does the model selection stay scoped to one call or does session state leak between calls? The documented interactive `/model` flow in `references/cli_reference.md` §6 writes back to `~/.copilot/config.json`, but per-call `--model` should override that for a single invocation. If model state leaks across sequential `-p` calls, every multi-model orchestration loses its predictability.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-014` and confirm the expected signals without contradictory evidence.

- Objective: Confirm sequential `copilot -p` invocations each honour their `--model` flag independently in a sandboxed `HOME`, with each response identifying the correct model family
- Real user request: `Run two copilot calls back-to-back, switch the model between them, and confirm each call really used the model I asked for. Don't touch my real ~/.copilot/config.`
- Prompt: `As a cross-AI orchestrator validating mid-session model-switch persistence, invoke Copilot CLI twice in sequence against the cli-copilot skill in this repository with HOME pointed at a disposable sandbox directory. First call: --model claude-opus-4.7 with a prompt asking which model is responding. Second call: --model gpt-5.3-codex with the same prompt. Verify each response identifies the correct model (Anthropic Claude Opus 4.6 for the first, OpenAI GPT-5.3-Codex for the second) and the sandbox ~/.copilot/config.json reflects the most recent model after each call (when written). Return a concise pass/fail verdict with the main reason and a one-line model-identification summary per call.`
- Expected execution process: orchestrator captures a SHA256 of the operator's real `~/.copilot/`, creates a sandbox `HOME`, dispatches the Opus call, captures the sandbox config state, dispatches the Codex call, captures the second sandbox config state, then re-checks the operator's real state
- Expected signals: both calls exit 0. First response identifies Claude/Anthropic model family (e.g. "Claude", "Anthropic", "Opus"). Second response identifies GPT/OpenAI/Codex model family (e.g. "GPT", "OpenAI", "Codex"). Tripwire SHA against operator's real `~/.copilot/` state is unchanged
- Desired user-visible outcome: PASS verdict + a one-line per-call model identification (e.g. "Call 1: Anthropic Claude Opus 4.6 confirmed. Call 2: OpenAI GPT-5.3-Codex confirmed")
- Pass/fail: PASS if both calls exit 0 AND each response correctly identifies its requested model family AND operator's real `~/.copilot/` SHA unchanged. FAIL if either call errors, model-identification mismatch (e.g. second response still claims Claude) or real-state SHA changes

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate per-call --model is honoured independently across sequential invocations".
2. Stay local: two sequential CLI dispatches with sandboxed `HOME`.
3. Capture a tripwire SHA of the operator's real `~/.copilot/`.
4. Dispatch the Opus call asking for self-identification.
5. Dispatch the Codex call with the same prompt. Verify each response names the correct model family and the operator's real state is unchanged.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-014 | Mid-session model switch persistence | Confirm sequential `copilot -p` invocations each honour their `--model` flag independently with correct per-call model-family identification, in a sandboxed `HOME` | `As a cross-AI orchestrator validating mid-session model-switch persistence, invoke Copilot CLI twice in sequence against the cli-copilot skill in this repository with HOME pointed at a disposable sandbox directory. First call: --model claude-opus-4.7 with a prompt asking which model is responding. Second call: --model gpt-5.3-codex with the same prompt. Verify each response identifies the correct model (Anthropic Claude Opus 4.6 for the first, OpenAI GPT-5.3-Codex for the second) and the sandbox ~/.copilot/config.json reflects the most recent model after each call (when written). Return a concise pass/fail verdict with the main reason and a one-line model-identification summary per call.` | 1. `bash: REAL_HOME_DOT="$HOME/.copilot"; if [ -d "$REAL_HOME_DOT" ]; then find "$REAL_HOME_DOT" -type f -exec shasum -a 256 {} + 2>/dev/null \| sort > /tmp/cp-014-real-pre.sha; else echo "ABSENT" > /tmp/cp-014-real-pre.sha; fi` -> 2. `bash: rm -rf /tmp/cp-014-home && mkdir -p /tmp/cp-014-home` -> 3. `bash: HOME=/tmp/cp-014-home copilot -p "Identify yourself precisely: what model are you (provider name and exact model identifier), and which model family (Anthropic / OpenAI / Google) do you belong to? Answer in 1-2 sentences." --model claude-opus-4.7 2>&1 \| tee /tmp/cp-014-opus.txt; echo "EXIT_OPUS=$?"` -> 4. `bash: HOME=/tmp/cp-014-home copilot -p "Identify yourself precisely: what model are you (provider name and exact model identifier), and which model family (Anthropic / OpenAI / Google) do you belong to? Answer in 1-2 sentences." --model gpt-5.3-codex 2>&1 \| tee /tmp/cp-014-codex.txt; echo "EXIT_CODEX=$?"` -> 5. `bash: grep -ciE '(claude\|anthropic\|opus)' /tmp/cp-014-opus.txt && grep -ciE '(gpt\|openai\|codex)' /tmp/cp-014-codex.txt && if [ -d "$REAL_HOME_DOT" ]; then find "$REAL_HOME_DOT" -type f -exec shasum -a 256 {} + 2>/dev/null \| sort > /tmp/cp-014-real-post.sha; else echo "ABSENT" > /tmp/cp-014-real-post.sha; fi && diff /tmp/cp-014-real-pre.sha /tmp/cp-014-real-post.sha` | Step 1: real-state SHA captured; Steps 3-4: both EXITs = 0; Step 5: Opus transcript has Claude/Anthropic markers (grep >= 1), Codex transcript has GPT/OpenAI/Codex markers (grep >= 1), real-state SHA tripwire diff empty | `/tmp/cp-014-opus.txt` (Opus transcript) + `/tmp/cp-014-codex.txt` (Codex transcript) + `/tmp/cp-014-real-pre.sha` and `/tmp/cp-014-real-post.sha` (operator-state tripwire) | PASS if EXIT_OPUS=0 AND EXIT_CODEX=0 AND Opus transcript has Anthropic markers AND Codex transcript has GPT/OpenAI markers AND real-state SHA unchanged; FAIL if either EXIT != 0, model-family identification mismatched, or real-state SHA changes | 1. If the second call still identifies as Claude, suspect that `--model` is not being applied per-call — check whether `~/.copilot/config.json` from a prior interactive selection is overriding the flag; 2. If neither call identifies a model family confidently, refine the prompt to extract a stronger self-identification signal; 3. If real-state SHA changes, this is a SECURITY-grade defect — halt the wave |

### Optional Supplemental Checks

After PASS, look at the sandbox `~/.copilot/config.json` content (if Copilot wrote one) to see whether per-call `--model` was persisted to config or just used in-flight. Either behaviour is acceptable as long as the per-call flag was honoured. Persistence to config is a useful debugging signal.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, Model Selection table in §3 |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | §6 MODELS Model Switching subsection documents `/model` interactive flow and `--model` non-interactive flag |
| `../../references/copilot_tools.md` | §2 Multi-Provider Models capability description |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: CP-014
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--session-continuity/002-mid-session-model-switch-persistence.md`
