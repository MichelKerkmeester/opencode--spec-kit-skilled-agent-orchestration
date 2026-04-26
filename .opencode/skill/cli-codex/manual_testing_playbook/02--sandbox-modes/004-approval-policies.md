---
title: "CX-008 -- --full-auto vs explicit approval policies"
description: "This scenario validates the four documented approval policies for `CX-008` (--full-auto, --ask-for-approval untrusted/on-request/never). It focuses on confirming each variant behaves as documented."
---

# CX-008 -- --full-auto vs explicit approval policies

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-008`.

---

## 1. OVERVIEW

This scenario validates the four documented approval-policy variants for `CX-008`. It focuses on confirming `--full-auto` (workspace-write + on-request approval) runs unattended without escalating and that explicit `--ask-for-approval` values (`untrusted`, `on-request`, `never`) behave as documented in `references/cli_reference.md` §4.

### Why This Matters

`--full-auto` is the documented unattended-orchestration default (`references/cli_reference.md` §4 + SKILL.md §3). The three explicit `--ask-for-approval` values control how aggressively Codex pauses for human input. Operators MUST be able to map each flag to observed runtime behavior to pick the right mode for unattended vs interactive workflows.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-008` and confirm the expected signals without contradictory evidence.

- Objective: Verify `--full-auto` runs unattended without escalating and that the three explicit approval values (`untrusted`, `on-request`, `never`) behave as documented.
- Real user request: `Show me how the four approval modes actually behave when I dispatch the same trivial task four times.`
- Prompt: `As a cross-AI orchestrator validating approval-policy variants, dispatch the same small generation task four times: (1) --full-auto, (2) --ask-for-approval untrusted with --sandbox workspace-write, (3) --ask-for-approval on-request with --sandbox workspace-write, (4) --ask-for-approval never with --sandbox workspace-write. All invocations use --model gpt-5.5 -c service_tier="fast". Verify each invocation exits 0, --full-auto needs no human input, and approval prompts surface only in the untrusted/on-request paths. Return a verdict mapping each variant to its observed approval behavior.`
- Expected execution process: Operator pre-creates four target temp files -> dispatches each variant in sequence -> records whether Codex prompted for approval at runtime -> compiles a 4-row mapping table.
- Expected signals: All four invocations exit 0 (or document specific approval prompts in untrusted/on-request modes). `--full-auto` produces no approval prompts. `--ask-for-approval never` produces no approval prompts. Dispatch lines for all four invocations explicitly include the documented flag combinations.
- Desired user-visible outcome: A verified mapping of approval-policy flags to observed runtime behavior so operators can pick the right mode for unattended vs interactive scenarios.
- Pass/fail: PASS if all four variants are dispatched, all exit 0 (with documented prompts handled in interactive modes), AND a 4-row mapping is produced. FAIL if any variant fails to dispatch, any unexpected approval prompts appear in `--full-auto` or `never` or the mapping is missing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pre-create four target temp files (one per variant).
2. Dispatch each variant in sequence. In interactive variants, the operator approves on-screen.
3. Record whether Codex prompted at runtime in each case.
4. Compile a 4-row mapping table: variant -> observed prompt behavior -> exit code.
5. Return a verdict naming the four variants and their behavior.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-008 | --full-auto vs explicit approval policies | Verify each approval policy behaves as documented | `As a cross-AI orchestrator validating approval-policy variants, dispatch the same small generation task four times: (1) --full-auto, (2) --ask-for-approval untrusted with --sandbox workspace-write, (3) --ask-for-approval on-request with --sandbox workspace-write, (4) --ask-for-approval never with --sandbox workspace-write. All invocations use --model gpt-5.5 -c service_tier="fast". Verify each invocation exits 0, --full-auto needs no human input, and approval prompts surface only in the untrusted/on-request paths. Return a verdict mapping each variant to its observed approval behavior.` | 1. `bash: rm -rf /tmp/cli-codex-cx008 && mkdir -p /tmp/cli-codex-cx008` -> 2. `codex exec --model gpt-5.5 -c model_reasoning_effort="low" -c service_tier="fast" --full-auto "Write 'variant-1-fullauto' to /tmp/cli-codex-cx008/v1.txt." > /tmp/cli-codex-cx008-v1.log 2>&1` -> 3. `codex exec --model gpt-5.5 -c model_reasoning_effort="low" -c service_tier="fast" --sandbox workspace-write --ask-for-approval untrusted "Write 'variant-2-untrusted' to /tmp/cli-codex-cx008/v2.txt." > /tmp/cli-codex-cx008-v2.log 2>&1` -> 4. `codex exec --model gpt-5.5 -c model_reasoning_effort="low" -c service_tier="fast" --sandbox workspace-write --ask-for-approval on-request "Write 'variant-3-onrequest' to /tmp/cli-codex-cx008/v3.txt." > /tmp/cli-codex-cx008-v3.log 2>&1` -> 5. `codex exec --model gpt-5.5 -c model_reasoning_effort="low" -c service_tier="fast" --sandbox workspace-write --ask-for-approval never "Write 'variant-4-never' to /tmp/cli-codex-cx008/v4.txt." > /tmp/cli-codex-cx008-v4.log 2>&1` -> 6. `bash: for i in 1 2 3 4; do printf 'v%s exit: ?; file: ' "$i"; ls /tmp/cli-codex-cx008/v$i.txt 2>/dev/null && cat /tmp/cli-codex-cx008/v$i.txt; done > /tmp/cli-codex-cx008-summary.txt` | Step 1: temp dir empty; Steps 2-5: each invocation exits 0 (approval handled inline by operator in steps 3-4 if Codex pauses); Step 6: summary shows all four files exist with the expected variant strings | Four log files (v1-v4), the summary file, four dispatched command lines, exit codes | PASS if all four variants dispatched, all four files written, AND the mapping table matches documented behavior (--full-auto and never run unattended; untrusted/on-request may pause for approval); FAIL if any variant fails to write its file or unexpected prompts appear | (1) Re-run with `2>&1 \| tee` for stderr inline; (2) confirm operator handled any approval prompts in steps 3-4; (3) check exit codes via `echo $?` after each invocation |

### Optional Supplemental Checks

- Inject a deliberately approval-triggering action (e.g., touching a sensitive-looking path) in variant 3 (`on-request`) and confirm Codex requests approval before proceeding.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§3 Default Invocation, §4 ALWAYS rule 3) | Documents `--full-auto` as the unattended default |
| `../../references/cli_reference.md` (§4 Approval Mode Values) | Documents the three `--ask-for-approval` values |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | §4 Approval Mode Values + Sandbox Mode Values |
| `../../references/codex_tools.md` | §5 Approval Modes table |

---

## 5. SOURCE METADATA

- Group: Sandbox Modes
- Playbook ID: CX-008
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--sandbox-modes/004-approval-policies.md`
