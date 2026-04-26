---
title: "CP-007 -- Reasoning-effort tuning via `~/.copilot/config.json` (DESTRUCTIVE — sandboxed `HOME`)"
description: "This scenario validates GPT-5.x reasoning-effort tuning via the documented config-file surface for `CP-007`. It focuses on confirming `\"reasoning_effort\": \"xhigh\"` in `~/.copilot/config.json` (sandboxed `HOME`) is honoured by `--model gpt-5.4` and produces a meaningfully longer response than `\"low\"`."
---

# CP-007 -- Reasoning-effort tuning via `~/.copilot/config.json` (DESTRUCTIVE, sandboxed `HOME`)

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

1. Restate the user request as "validate the documented config-file surface actually tunes reasoning effort end-to-end, with strict HOME sandboxing".
2. Stay local: this is a direct CLI dispatch from the calling AI. No sub-agent delegation needed. Sandbox `HOME` to `/tmp/cp-007-home/` for the entire scenario.
3. Capture a tripwire SHA256 of the operator's real `~/.copilot/config.json` (or note its absence).
4. Write `"reasoning_effort": "xhigh"` to the sandbox config and dispatch the prompt.
5. Rewrite to `"low"` and dispatch the same prompt. Compare lengths and re-check the tripwire.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-007 | Reasoning-effort tuning via `~/.copilot/config.json` | Confirm `"reasoning_effort": "xhigh"` vs `"low"` in sandboxed config produces a meaningfully different response length, without touching the operator's real config | `As a cross-AI orchestrator tuning GPT-5.x reasoning depth for the same prompt, invoke Copilot CLI twice against the cli-copilot skill in this repository with HOME pointed at a disposable sandbox directory. First call: write "reasoning_effort": "xhigh" to the sandbox ~/.copilot/config.json and dispatch a complex reasoning prompt. Second call: rewrite the same field to "low" and re-dispatch the same prompt. Verify the xhigh response is meaningfully longer or more detailed than the low response, both calls exit 0, and the operator's real ~/.copilot/config.json is unchanged. Return a concise pass/fail verdict with the main reason and the response-length comparison (xhigh chars vs low chars).` | 1. `bash: REAL_CFG="$HOME/.copilot/config.json"; if [ -f "$REAL_CFG" ]; then shasum -a 256 "$REAL_CFG" > /tmp/cp-007-real-pre.sha; else echo "ABSENT" > /tmp/cp-007-real-pre.sha; fi` -> 2. `bash: rm -rf /tmp/cp-007-home && mkdir -p /tmp/cp-007-home/.copilot && printf '{"reasoning_effort":"xhigh"}' > /tmp/cp-007-home/.copilot/config.json` -> 3. `bash: HOME=/tmp/cp-007-home copilot -p "Walk through, step by step, how to design a fault-tolerant distributed counter that survives network partitions. Enumerate at least the data model, partition handling, conflict resolution, and verification approach." --model gpt-5.4 2>&1 > /tmp/cp-007-xhigh.txt; echo "EXIT_XHIGH=$?"; XHIGH_LEN=$(wc -c < /tmp/cp-007-xhigh.txt)` -> 4. `bash: printf '{"reasoning_effort":"low"}' > /tmp/cp-007-home/.copilot/config.json` -> 5. `bash: HOME=/tmp/cp-007-home copilot -p "Walk through, step by step, how to design a fault-tolerant distributed counter that survives network partitions. Enumerate at least the data model, partition handling, conflict resolution, and verification approach." --model gpt-5.4 2>&1 > /tmp/cp-007-low.txt; echo "EXIT_LOW=$?"; LOW_LEN=$(wc -c < /tmp/cp-007-low.txt); echo "XHIGH=$XHIGH_LEN LOW=$LOW_LEN RATIO=$(awk -v x=$XHIGH_LEN -v l=$LOW_LEN 'BEGIN{ if(l>0) print x/l; else print "NA" }')"` -> 6. `bash: if [ -f "$REAL_CFG" ]; then shasum -a 256 "$REAL_CFG" > /tmp/cp-007-real-post.sha; else echo "ABSENT" > /tmp/cp-007-real-post.sha; fi && diff /tmp/cp-007-real-pre.sha /tmp/cp-007-real-post.sha` | Step 1: real-config SHA captured (or ABSENT marker); Steps 2-5: both EXIT codes are 0, both transcripts non-empty, RATIO >= 1.3 (xhigh is at least 30% longer); Step 6: real-config tripwire diff is empty | `/tmp/cp-007-xhigh.txt` (xhigh transcript) + `/tmp/cp-007-low.txt` (low transcript) + `/tmp/cp-007-real-pre.sha` and `/tmp/cp-007-real-post.sha` (tripwire pair) + the printed `XHIGH=... LOW=... RATIO=...` line | PASS if EXIT_XHIGH=0 AND EXIT_LOW=0 AND RATIO >= 1.3 AND real-config SHA unchanged; FAIL if either EXIT != 0, RATIO < 1.1 (effectively no difference), or real-config SHA changes | 1. If RATIO is too low, verify `reasoning_effort` is the documented JSON key in cli_reference.md §6 (not e.g. `reasoningEffort` or a model-specific override); 2. If real-config SHA changes, this is a SECURITY-grade defect — Copilot wrote outside the sandboxed HOME; halt the wave and file an issue; 3. If the JSON key is correct but the responses look identical, verify the active GPT-5.4 model supports `xhigh` per SKILL.md §3 Per-model support table (gpt-5.4 supports `xhigh`) |

### Optional Supplemental Checks

After PASS, additionally compare the *content* of both responses: the xhigh response should typically include more enumerated steps or sub-bullets per section. A length difference driven solely by verbose prose without additional reasoning depth weakens the PASS evidence, note this in the report even if the numeric ratio threshold is met.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
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
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--multi-model/004-reasoning-effort-config-tuning.md`
