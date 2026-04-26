---
title: "CO-008 -- Self-invocation guard refusal (ADR-001)"
description: "This scenario validates the self-invocation guard for `CO-008`. It focuses on confirming the cli-opencode skill refuses a circular dispatch when the originating runtime IS OpenCode and the prompt does NOT include explicit parallel-session keywords."
---

# CO-008 -- Self-invocation guard refusal (ADR-001)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-008`.

---

## 1. OVERVIEW

This scenario validates the Self-invocation guard refusal for `CO-008`. It focuses on confirming the ADR-001 layered detection signal (env var lookup + process ancestry + state lock-file probe) refuses a self-dispatch when the originating runtime IS OpenCode AND the prompt does NOT include the documented parallel-session keywords ("parallel detached", "ablation suite", "worker farm", "share URL").

### Why This Matters

The self-invocation guard is the single most important safety contract in cli-opencode. Without it, an in-OpenCode operator asking "use cli-opencode to delegate this prompt to OpenCode" would create a circular dispatch that burns tokens for no value (per SKILL.md §1 "When NOT to Use" and ADR-001). The guard MUST trip when the originating runtime is OpenCode, MUST surface the documented refusal message, AND MUST NOT trip on legitimate parallel detached requests. This test validates the refusal path. CO-026 validates the parallel-session exception path.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CO-008` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the cli-opencode self-invocation guard refuses a dispatch when ANY of the three detection layers trips AND the prompt does NOT include parallel-session keywords and that the refusal message includes the three documented remediation options.
- Real user request: `Simulate being inside OpenCode by exporting OPENCODE_CONFIG_DIR. Then ask cli-opencode to delegate a prompt to OpenCode without any parallel-session keywords. Verify it refuses with the documented error message.`
- Prompt: `As an in-OpenCode operator simulating a self-dispatch attempt, export OPENCODE_CONFIG_DIR=/tmp/co-008-fake to trip the layer 1 detection signal, then attempt to invoke cli-opencode for a generic dispatch (no "parallel detached", "ablation suite", "worker farm", or "share URL" keywords). Verify the skill refuses with the documented refusal message including all three remediation options. Return a concise pass/fail verdict naming the detection layer that tripped and confirming all three remediation options were surfaced.`
- Expected execution process: External-AI orchestrator (or shell operator) exports `OPENCODE_CONFIG_DIR` to simulate being inside OpenCode, then either calls a stand-in router script that mirrors the SKILL.md §2 self-invocation guard logic OR documents the expected refusal behavior of the skill if the dispatch were attempted from a real in-OpenCode session. The validation is that the documented refusal logic exists and is reachable.
- Expected signals: Layer 1 (env var) detection trips on `OPENCODE_CONFIG_DIR`. The documented refusal message in `references/integration_patterns.md` §5 surfaces with all three remediation options (sibling cli-* skill, fresh shell, parallel-session keywords). No actual `opencode run` dispatch is constructed.
- Desired user-visible outcome: Verdict naming the detection layer (`env`) that tripped and confirming all three remediation options were surfaced.
- Pass/fail: PASS if `OPENCODE_CONFIG_DIR` triggers a refusal AND refusal message includes all three remediation options AND no real `opencode run` is dispatched. FAIL if the guard does not trip, the refusal message is missing remediation options or a real dispatch is attempted anyway.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Export `OPENCODE_CONFIG_DIR=/tmp/co-008-fake` in a subshell to trip layer 1 detection.
3. Run the SKILL.md §2 self-invocation guard logic (verbatim shell from the skill) and inspect the output.
4. Confirm the refusal message text in `references/integration_patterns.md` §5 includes all three remediation options.
5. Confirm no actual `opencode run` invocation is constructed.
6. Return a verdict naming the tripped layer and the three remediation options.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-008 | Self-invocation guard refusal (ADR-001) | Confirm the self-invocation guard refuses dispatch when originating runtime is OpenCode and no parallel-session keyword is present | `As an in-OpenCode operator simulating a self-dispatch attempt, export OPENCODE_CONFIG_DIR=/tmp/co-008-fake to trip the layer 1 detection signal, then attempt to invoke cli-opencode for a generic dispatch (no "parallel detached", "ablation suite", "worker farm", or "share URL" keywords). Verify the skill refuses with the documented refusal message including all three remediation options. Return a concise pass/fail verdict naming the detection layer that tripped and confirming all three remediation options were surfaced.` | 1. `bash: (export OPENCODE_CONFIG_DIR=/tmp/co-008-fake; env \| grep -q '^OPENCODE_' && echo "LAYER_1_TRIPPED: env var detected" \|\| echo "LAYER_1_OK")` -> 2. `bash: grep -nE '(self-invocation refused\|circular dispatch)' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/cli-opencode/references/integration_patterns.md` -> 3. `bash: grep -nE '(sibling cli-\*\|fresh shell\|parallel detached)' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/cli-opencode/references/integration_patterns.md \| head -5` -> 4. `bash: grep -nE 'has_parallel_session_keywords' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/cli-opencode/SKILL.md` -> 5. `bash: ls /tmp/co-008-fake 2>&1 \| head -1; echo "no actual opencode run was attempted"` | Step 1: prints `LAYER_1_TRIPPED: env var detected`; Step 2: matches the canonical refusal phrasing in integration_patterns.md §5; Step 3: lists 3+ matches covering sibling cli-*, fresh shell, and parallel detached options; Step 4: shows the SKILL.md exception clause for parallel-session keywords; Step 5: confirms no real dispatch occurred | Terminal transcripts for each step, evidence of layer 1 trip, grep output showing refusal message and remediation options | PASS if layer 1 trips on OPENCODE_CONFIG_DIR AND refusal message exists in references AND all three remediation options are documented AND no real opencode run was dispatched; FAIL if any check fails | 1. If layer 1 does not trip, verify the env var is exported in the right subshell scope; 2. If the refusal message is missing from references, the skill documentation has regressed — file a P0 bug; 3. If only some remediation options are present, list the missing ones in the failure report; 4. NEVER actually dispatch `opencode run` in this test — that would create the circular loop the guard exists to prevent |

### Optional Supplemental Checks

For layer 2 (process ancestry) and layer 3 (state lock-file) testing, document the simulation approach: layer 2 requires running cli-opencode from inside an actual `opencode` parent (which is the live in-OpenCode case) and layer 3 requires creating a stub lockfile at `~/.opencode/state/<id>/lock`. These can be exercised in dedicated follow-ups but are out-of-scope for this fast functional test, which validates the layer 1 trip path that operators most commonly hit.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/integration_patterns.md` (§5 SMART-ROUTER DECISION TREE + REFUSAL MESSAGE) | Documents the layered detection and exact refusal text |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §1 "When NOT to Use" + §2 self-invocation guard pseudocode (ADR-001) + ALWAYS rule 2 |
| `../../references/integration_patterns.md` | §5 decision tree + refusal message body |

---

## 5. SOURCE METADATA

- Group: External Dispatch
- Playbook ID: CO-008
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--external-dispatch/003-self-invocation-refusal.md`
