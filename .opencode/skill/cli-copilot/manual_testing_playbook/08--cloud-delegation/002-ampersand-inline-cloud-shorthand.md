---
title: "CP-021 -- `&prompt` inline cloud shorthand (DESTRUCTIVE — cloud write)"
description: "This scenario validates the inline `&prompt` cloud-delegation shorthand for `CP-021`. It focuses on confirming the `&<task>` syntax produces equivalent cloud-agent routing to `/delegate` and the response surfaces cloud-agent context."
---

# CP-021 -- `&prompt` inline cloud shorthand (DESTRUCTIVE, cloud write)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-021`.

---

## 1. OVERVIEW

This scenario validates the inline `&prompt` cloud-delegation shorthand for `CP-021`. It focuses on confirming the `&<task>` syntax inside a `copilot -p` prompt body produces equivalent cloud-agent routing to `/delegate` (per `references/copilot_tools.md` §2 Cloud Delegation), with the response naturally surfacing the cloud-agent context.

### Why This Matters

`&prompt` is the inline shorthand documented alongside `/delegate` in `references/copilot_tools.md` §2, it is intended as a fluent alternative for cases where the operator wants cloud delegation without breaking out into the explicit slash-command form. CP-020 covers the explicit form. CP-021 covers the shorthand. If the shorthand silently behaves like a local prompt (the `&` prefix is discarded as plain text), the documented dual-form delegation surface is misaligned with reality. Verifying functional equivalence with CP-020 is the cheapest objective check.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CP-021` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `&<task>` inline shorthand inside the prompt body produces equivalent cloud-agent routing to `/delegate` and the response provides the requested 2-3 sentence summary plus cloud-agent context markers
- Real user request: `Use the &prompt shorthand to push a small task to Copilot's cloud agent and verify it behaves the same as /delegate.`
- Prompt: `As a cross-AI orchestrator validating the inline cloud-delegation shorthand, invoke Copilot CLI in non-interactive mode against the cli-copilot skill in this repository and use the &prompt shorthand inside the prompt body to push a small read-only analysis task to GitHub's cloud agent: '&summarise the role of the cli-copilot skill in 2-3 sentences and confirm you are running on a cloud agent'. Verify the call completes, the response provides the requested 2-3 sentence summary, and the response indicates cloud-agent context (e.g. mentions cloud, remote, GitHub agent, or returns a delegation receipt). Compare behaviour against /delegate (CP-020) and confirm the shorthand is functionally equivalent. Return a concise pass/fail verdict with the main reason and a one-line note comparing the &prompt vs /delegate routing.`
- Expected execution process: orchestrator captures pre-call tripwire and timestamp, dispatches the prompt with `&<task>` inline, allows extra time for the cloud round-trip, then verifies the response provides the requested summary plus cloud-routing markers
- Expected signals: `EXIT=0`. Response contains a 2-3 sentence cli-copilot summary. Response mentions cloud / remote / GitHub agent context. Behaviour is functionally equivalent to CP-020 (both produce cloud-routed responses). Tripwire diff is empty
- Desired user-visible outcome: PASS verdict + the 2-3 sentence summary + a one-line note that `&prompt` and `/delegate` behave equivalently
- Pass/fail: PASS if EXIT=0 AND response has 2-3 sentence summary AND cloud-routing markers present AND tripwire diff is empty. FAIL if response is purely local (no cloud markers), summary missing, project tree mutated or call times out

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate &prompt shorthand routes to the cloud agent equivalently to /delegate".
2. Stay local for orchestration. The heavy lifting goes to the cloud agent.
3. Capture pre-call tripwire and a wall-clock timestamp.
4. Dispatch the prompt with `&<task>` inline.
5. Verify the summary, cloud-routing markers, tripwire empty and compare against the CP-020 baseline.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-021 | `&prompt` inline cloud shorthand | Confirm `&<task>` inline shorthand routes to GitHub's cloud agent equivalently to `/delegate` and the response surfaces cloud-agent context | `As a cross-AI orchestrator validating the inline cloud-delegation shorthand, invoke Copilot CLI in non-interactive mode against the cli-copilot skill in this repository and use the &prompt shorthand inside the prompt body to push a small read-only analysis task to GitHub's cloud agent: '&summarise the role of the cli-copilot skill in 2-3 sentences and confirm you are running on a cloud agent'. Verify the call completes, the response provides the requested 2-3 sentence summary, and the response indicates cloud-agent context (e.g. mentions cloud, remote, GitHub agent, or returns a delegation receipt). Compare behaviour against /delegate (CP-020) and confirm the shorthand is functionally equivalent. Return a concise pass/fail verdict with the main reason and a one-line note comparing the &prompt vs /delegate routing.` | 1. `bash: git status --porcelain > /tmp/cp-021-pre.txt; START_TS=$(date +%s); echo "START_TS=$START_TS"` -> 2. `bash: copilot -p "&Summarise the role of the cli-copilot skill in this repository in 2-3 sentences and confirm whether you are running on a cloud agent or locally. Read-only — do not modify any files." --allow-all-tools 2>&1 | tee /tmp/cp-021-out.txt; echo "EXIT=$?"; END_TS=$(date +%s); echo "END_TS=$END_TS DURATION_SEC=$((END_TS - START_TS))"` -> 3. `bash: git status --porcelain > /tmp/cp-021-post.txt && diff /tmp/cp-021-pre.txt /tmp/cp-021-post.txt && wc -l /tmp/cp-021-out.txt && grep -ciE '(cli-copilot|copilot CLI|orchestrator|GitHub Copilot)' /tmp/cp-021-out.txt && grep -ciE '(cloud|remote|GitHub agent|delegation|copilot agent|cloud-hosted)' /tmp/cp-021-out.txt` | Step 1: pre-tripwire captured, start timestamp recorded; Step 2: EXIT=0, transcript contains cli-copilot summary, end timestamp + duration recorded; Step 3: tripwire diff empty, summary grep count >= 1, cloud-routing grep count >= 1 | `/tmp/cp-021-out.txt` (transcript) + `/tmp/cp-021-pre.txt` and `/tmp/cp-021-post.txt` (tripwire pair) + summary/cloud grep counts + start/end timestamps | PASS if EXIT=0 AND summary grep >= 1 AND cloud-routing grep >= 1 AND tripwire diff empty; FAIL if EXIT != 0, no summary content, no cloud-routing markers (response is purely local), or tripwire diff non-empty | 1. If response shows no cloud-routing markers, the `&` prefix may have been treated as plain text — verify the binary version supports `&prompt` per copilot_tools.md §2; 2. If timeout, retry once after a brief wait (cloud quota may be temporarily exhausted); 3. If summary missing entirely but cloud routing succeeded, re-issue with stronger summary framing |

### Optional Supplemental Checks

After PASS, compare the response duration against CP-020's duration. The two should be within ~2x of each other if both are routing to the same cloud agent class. A wildly faster `&prompt` response (e.g. 5s vs 60s for `/delegate`) suggests the shorthand bypassed the cloud routing, flag for re-review even if the markers all check out.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, §3 Copilot CLI Agent Delegation row "Cloud Delegation" includes `&prompt` shorthand |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/copilot_tools.md` | §2 Cloud Delegation documents both `/delegate` and `&prompt` invocation forms |
| `../../references/agent_delegation.md` | §4 Cloud Delegation Remote Agent shows `&Refactor ...` example |
| `../../references/integration_patterns.md` | §3 Cloud Delegation pattern documentation |

---

## 5. SOURCE METADATA

- Group: Cloud Delegation
- Playbook ID: CP-021
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `08--cloud-delegation/002-ampersand-inline-cloud-shorthand.md`
