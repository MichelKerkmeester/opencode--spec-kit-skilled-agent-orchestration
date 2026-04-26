---
title: "CP-007 -- Reasoning-effort tuning via `--effort` CLI flag "
description: "This scenario validates GPT-5.x reasoning-effort tuning via the documented config-file surface for `CP-007`. It focuses on confirming `\"reasoning_effort\": \"xhigh\"` in `~/.copilot/config.json` (sandboxed `HOME`) is honoured by `--model gpt-5.4` and produces a meaningfully longer response than `\"low\"`."
---

# CP-007 -- Reasoning-effort tuning via `--effort` CLI flag 

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-007`.

---

## 1. OVERVIEW

This scenario validates the GPT-5.x reasoning-effort tuning surface for `CP-007`. It focuses on confirming `"reasoning_effort": "xhigh"` written to `~/.copilot/config.json` (sandboxed `HOME` only) is read by `copilot -p --model gpt-5.4` and a paired call with `"low"` produces a faster but shorter response, all without touching the operator's real config file.

### Why This Matters

Per SKILL.md §3 Reasoning Effort, GPT-5.x models support 4 reasoning levels (low / medium / high / xhigh) but **no CLI flag exists**, `~/.copilot/config.json` is the only non-interactive mechanism. If the config-file surface silently fails to honour the setting (or if the documented JSON key changes), every scripted reasoning-effort orchestration loses determinism. Sandboxing `HOME` is mandatory: writing the operator's real `~/.copilot/config.json` would mutate persistent operator state.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-007` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `"reasoning_effort": "xhigh"` in sandboxed `~/.copilot/config.json` is read by `--model gpt-5.4` and produces a meaningfully longer response than `"low"`, without touching the operator's real config
- Real user request: `Show me Copilot's reasoning-effort tuning actually works — same prompt, gpt-5.4, but xhigh vs low. Don't touch my real ~/.copilot/config.json.`
- Prompt: `As a cross-AI orchestrator tuning GPT-5.x reasoning depth for the same prompt, invoke Copilot CLI twice against the cli-copilot skill in this repository with HOME pointed at a disposable sandbox directory. First call: write "reasoning_effort": "xhigh" to the sandbox ~/.copilot/config.json and dispatch a complex reasoning prompt. Second call: rewrite the same field to "low" and re-dispatch the same prompt. Verify the xhigh response is meaningfully longer or more detailed than the low response, both calls exit 0, and the operator's real ~/.copilot/config.json is unchanged. Return a concise pass/fail verdict with the main reason and the response-length comparison (xhigh chars vs low chars).`
- Expected execution process: orchestrator captures a SHA256 of the operator's real `~/.copilot/config.json` (if present), creates a sandbox `HOME=/tmp/cp-007-home/` with `.copilot/config.json` containing `"reasoning_effort": "xhigh"`, dispatches the reasoning prompt with `HOME=/tmp/cp-007-home/ copilot -p "..." --model gpt-5.4`, captures the response length, then rewrites the field to `"low"`, re-dispatches the same prompt, captures the second length and finally re-checks the operator's real config SHA256 to confirm it is unchanged
- Expected signals: `EXIT_XHIGH=0`. Sandbox config contains the documented field after each write. Xhigh response is meaningfully longer than low (e.g. >= 1.3x character count) OR contains more enumerated steps. Tripwire SHA256 of the operator's real `~/.copilot/config.json` is unchanged
- Desired user-visible outcome: PASS verdict + the character-count comparison + a one-line note that no CLI flag exists for reasoning effort (config-file is the only non-interactive surface)
- Pass/fail: PASS if both calls exit 0 AND xhigh response is >= 1.3x the low response length OR contains >= 1 more enumerated step AND operator's real `~/.copilot/config.json` is unchanged. FAIL if either call errors, response lengths are within 10% of each other or the operator's real config SHA changes

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate the `--effort` CLI flag actually tunes reasoning effort end-to-end".
2. Stay local: this is a direct CLI dispatch from the calling AI. No sub-agent delegation needed.
3. Dispatch the same prompt twice with `--effort xhigh` and `--effort low`, compare response lengths.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-007 | Reasoning-effort tuning via `--effort` CLI flag | Confirm `--effort xhigh` vs `--effort low` produces a meaningfully different response length on the same prompt | `As a cross-AI orchestrator tuning GPT-5.x reasoning depth for the same prompt, invoke Copilot CLI twice with the same complex reasoning prompt: once with --effort xhigh and once with --effort low. Verify both calls exit 0 and the xhigh response is meaningfully longer or more detailed than the low response. Return a concise pass/fail verdict with the main reason and the response-length comparison (xhigh chars vs low chars).` | 1. `bash: copilot -p "Walk through, step by step, how to design a fault-tolerant distributed counter that survives network partitions. Enumerate at least the data model, partition handling, conflict resolution, and verification approach." --model gpt-5.4 --effort xhigh --allow-all-tools --no-ask-user 2>&1 > /tmp/cp-007-xhigh.txt; echo "EXIT_XHIGH=$?"; XHIGH_LEN=$(wc -c < /tmp/cp-007-xhigh.txt)` -> 2. `bash: copilot -p "Walk through, step by step, how to design a fault-tolerant distributed counter that survives network partitions. Enumerate at least the data model, partition handling, conflict resolution, and verification approach." --model gpt-5.4 --effort low --allow-all-tools --no-ask-user 2>&1 > /tmp/cp-007-low.txt; echo "EXIT_LOW=$?"; LOW_LEN=$(wc -c < /tmp/cp-007-low.txt); echo "XHIGH=$XHIGH_LEN LOW=$LOW_LEN RATIO=$(awk -v x=$XHIGH_LEN -v l=$LOW_LEN 'BEGIN{ if(l>0) print x/l; else print "NA" }')"` | Both EXIT codes 0; both transcripts non-empty; RATIO >= 1.3 (xhigh is at least 30% longer than low) | `/tmp/cp-007-xhigh.txt` (xhigh transcript) + `/tmp/cp-007-low.txt` (low transcript) + the printed `XHIGH=... LOW=... RATIO=...` line | PASS if EXIT_XHIGH=0 AND EXIT_LOW=0 AND RATIO >= 1.3; FAIL if either EXIT != 0 or RATIO < 1.1 (effectively no difference) | 1. If RATIO is too low, verify gpt-5.4 honors `--effort xhigh` (run `copilot -p --help` to confirm flag still exists); 2. If `--effort` flag is rejected with `unknown option`, copilot version may be < 1.0.36 — upgrade or fall back to the legacy `~/.copilot/config.json` path (DEPRECATED but may still work on older builds); 3. If the responses look identical despite RATIO check passing, verify with content sampling that xhigh actually has more enumerated steps |

### Optional Supplemental Checks

After PASS, additionally compare the *content* of both responses: the xhigh response should typically include more enumerated steps or sub-bullets per section. A length difference driven solely by verbose prose without additional reasoning depth weakens the PASS evidence, note this in the report even if the numeric ratio threshold is met.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, §3 Reasoning Effort table and per-model defaults. Documents that no CLI flag exists |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | Documents `reasoning_effort` config key in §6 MODELS Reasoning Effort subsection |
| `../../references/copilot_tools.md` | Multi-Provider Models §2 capability description |

---

## 5. SOURCE METADATA

- Group: Multi-Model
- Playbook ID: CP-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--multi-model/004-reasoning-effort-config-tuning.md`
