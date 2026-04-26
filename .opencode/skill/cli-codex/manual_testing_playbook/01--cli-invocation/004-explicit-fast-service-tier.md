---
title: "CX-004 -- Explicit fast service tier"
description: "This scenario validates the explicit fast service tier rule for `CX-004`. It focuses on enforcing the auto-memory rule that -c service_tier=fast must be passed explicitly on every codex exec invocation."
---

# CX-004 -- Explicit fast service tier

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-004`.

---

## 1. OVERVIEW

This scenario validates the explicit fast service tier rule for `CX-004`. It focuses on enforcing the auto-memory rule "Codex CLI fast mode must be explicit" by dispatching the same task once WITH and once WITHOUT `-c service_tier="fast"`, recording the second invocation as a contract-violation control sample that operators must reject during review.

### Why This Matters

The user's auto-memory feedback explicitly says: "always pass `-c service_tier="fast"` in `codex exec` invocations. Never rely on global config default." If this discipline slips, dispatches silently fall back to a slower tier whenever a different operator's `~/.codex/config.toml` lacks the default. Treating the missing flag as an operator-detectable contract violation is the only durable enforcement mechanism.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-004` and confirm the expected signals without contradictory evidence.

- Objective: Verify `-c service_tier="fast"` is passed explicitly on every `codex exec` invocation per the auto-memory rule and that omitting it (negative case) is detected as a contract violation in operator review.
- Real user request: `Make sure the codex calls always pass the fast tier flag explicitly — don't let it slip into using the global default.`
- Prompt: `As a cross-AI orchestrator enforcing the cli-codex auto-memory rule "Codex CLI fast mode must be explicit", dispatch the same trivial generation prompt twice: first WITH -c service_tier="fast", then WITHOUT it. Verify the explicit-fast invocation succeeds with the documented flag visible in the dispatched command, and document the second invocation as a contract violation that operators must reject during review. Return a verdict identifying both invocations and naming the missing flag in the negative case.`
- Expected execution process: Operator runs the same prompt twice with the only delta being presence/absence of the fast-tier flag -> captures both dispatched command lines -> records the second invocation as a contract-violation control sample -> writes a one-line review note rejecting the second invocation.
- Expected signals: First invocation includes `-c service_tier="fast"` in the dispatched command and exits 0. Second invocation omits the flag (operator records this as the contract-violation control sample). The operator's review output explicitly flags the second invocation as non-conforming.
- Desired user-visible outcome: Evidence that the playbook enforces the auto-memory rule and that operators can detect and reject invocations that drop the explicit fast-tier flag.
- Pass/fail: PASS if both invocations are captured, the explicit-fast variant exits 0 with the flag visible, AND the operator review output explicitly rejects the second variant by name. FAIL if the second variant is silently accepted as conforming.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the same trivial prompt twice with deltas only on the fast-tier flag.
2. Capture both dispatched command lines verbatim.
3. Diff the two command lines and document the missing flag.
4. Write a review note explicitly rejecting the second invocation as non-conforming.
5. Return a verdict identifying both invocations.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-004 | Explicit fast service tier | Verify -c service_tier="fast" is passed explicitly and that omitting it is detected as a contract violation during review | `As a cross-AI orchestrator enforcing the cli-codex auto-memory rule "Codex CLI fast mode must be explicit", dispatch the same trivial generation prompt twice: first the conforming invocation WITH -c service_tier="fast", then a deliberately quarantined INTENTIONAL VIOLATION invocation WITHOUT it. Verify the conforming invocation succeeds with the documented flag visible in the dispatched command, and document the second invocation as the assertion-only contract-violation control sample that operators must reject during review. Return a verdict identifying both invocations and naming the missing flag in the negative case.` | 1. CONFORMING INVOCATION (positive path): `codex exec --model gpt-5.5 -c model_reasoning_effort="low" -c service_tier="fast" --sandbox read-only "Return the integer 42 and nothing else." > /tmp/cli-codex-cx004-with.txt 2>&1` -> 2. INTENTIONAL VIOLATION (assertion-only negative control; do NOT use as a real dispatch pattern): `codex exec --model gpt-5.5 -c model_reasoning_effort="low" --sandbox read-only "Return the integer 42 and nothing else." > /tmp/cli-codex-cx004-without.txt 2>&1` -> 3. `bash: printf 'WITH:\n%s\n\nWITHOUT:\n%s\n' "$(cat /tmp/cli-codex-cx004-with.txt)" "$(cat /tmp/cli-codex-cx004-without.txt)" > /tmp/cli-codex-cx004-diff.txt` -> 4. `bash: printf 'CONTRACT VIOLATION: invocation #2 omitted -c service_tier="fast"; reject and re-run with the explicit flag per cli-codex SKILL.md ALWAYS rule 6.\n' > /tmp/cli-codex-cx004-review.txt` | Step 1: exit 0, response contains `42`, dispatched command line includes `-c service_tier="fast"`; Step 2: dispatched command line OMITS `-c service_tier="fast"` (this is the INTENTIONAL VIOLATION the scenario asserts must be detected); Step 3: diff file shows both invocations side-by-side; Step 4: review note rejects invocation #2 by name | Both captured stdout files, the diff file, the review note, both dispatched command lines | PASS = the violation is detected by the scenario: both invocations are captured, invocation #1 includes the flag, invocation #2 omits it, AND the review note explicitly rejects invocation #2 by name; FAIL if either invocation is missing OR the review note silently accepts invocation #2 | (1) Verify `~/.codex/config.toml` is not silently injecting `service_tier`; (2) re-confirm SKILL.md §4 ALWAYS rule 6 still mandates explicit fast-tier; (3) re-run with `2>&1 \| tee` to capture stderr inline |

### Optional Supplemental Checks

- Run a third invocation with `-c service_tier="default"` (or any non-fast value) and confirm the operator review note also rejects it as non-conforming relative to the documented contract.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§4 ALWAYS rule 6) | Mandates explicit model + effort + service tier on every invocation |
| `../../references/cli_reference.md` (§4 Command-Line Flags) | Documents the `-c` config-override mechanism |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Default Invocation block + §4 ALWAYS rule 6 |
| `../../SKILL.md` (line 205 `-c service_tier="fast"` flag table, line 218 Fast-mode REQUIRED note, §4 rule 6 line 317) | Documents the always-explicit fast-tier contract enforced by this scenario |
| `../../references/cli_reference.md` (§4 Command-Line Flags, §5 Model Selection) | CLI flag and config-override reference for `-c service_tier` |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CX-004
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--cli-invocation/004-explicit-fast-service-tier.md`
