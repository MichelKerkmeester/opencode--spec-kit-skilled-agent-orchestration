---
title: "CX-010 -- medium reasoning (skill default)"
description: "This scenario validates the medium reasoning level as the documented skill default for `CX-010`. It focuses on confirming explicit medium dispatches succeed and align with SKILL.md §3."
---

# CX-010 -- medium reasoning (skill default)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-010`.

---

## 1. OVERVIEW

This scenario validates the `medium` reasoning level as the documented skill default for `CX-010`. It focuses on confirming `medium` is the documented default and that two explicit-medium dispatches produce equivalent behavior on a standard code-generation task.

### Why This Matters

SKILL.md §4 ALWAYS rule 7 mandates that the model + effort + service tier be passed explicitly on every invocation. `medium` is the documented default. This scenario keeps the explicit-effort discipline honest by requiring the operator to dispatch with `-c model_reasoning_effort="medium"` even when the result would be the same as omitting it.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-010` and confirm the expected signals without contradictory evidence.

- Objective: Verify `medium` is the documented skill default reasoning effort and that two explicit-medium dispatches produce equivalent code-generation output.
- Real user request: `Run the documented default reasoning level twice on the same prompt and confirm consistency.`
- RCAF Prompt: `As a cross-AI orchestrator confirming the skill default, dispatch the same generation prompt twice with --model gpt-5.5 -c service_tier="fast": once with -c model_reasoning_effort="medium" explicit, once relying on the documented skill default (still pass medium per the SKILL.md §3 default-invocation rule because the skill mandates explicit effort). Verify both exit 0 and produce comparable code-quality output for a small TypeScript utility. Return a verdict confirming both invocations match the documented default contract.`
- Expected execution process: Operator dispatches the same prompt twice with `-c model_reasoning_effort="medium"` explicit on both -> captures both outputs -> compares them at a high level (same function signature, similar behavior) -> records a brief equivalence note.
- Expected signals: Both invocations exit 0. Both produce a small TypeScript utility (e.g., a `clamp(n, min, max)` function). Both dispatched command lines include `-c model_reasoning_effort="medium"` explicitly per SKILL.md §4 ALWAYS rule 7. Outputs are functionally equivalent.
- Desired user-visible outcome: Confirmation that `medium` is the load-bearing default and that the operator's explicit-effort discipline matches the documented contract.
- Pass/fail: PASS if both invocations exit 0, both produce a TypeScript `clamp` function, both dispatched command lines include the explicit `-c model_reasoning_effort="medium"` flag, AND the operator records an equivalence note. FAIL if either invocation fails or omits the explicit flag.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Dispatch the prompt twice with explicit `-c model_reasoning_effort="medium"` on both invocations.
2. Capture each stdout to a separate temp file.
3. Compare function signatures and behavior via grep.
4. Record an equivalence note.
5. Return a verdict confirming the documented default.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-010 | medium reasoning (skill default) | Verify medium reasoning is the documented skill default and produces consistent output | `As a cross-AI orchestrator confirming the skill default, dispatch the same generation prompt twice with --model gpt-5.5 -c service_tier="fast": once with -c model_reasoning_effort="medium" explicit, once relying on the documented skill default (still pass medium per the SKILL.md §3 default-invocation rule because the skill mandates explicit effort). Verify both exit 0 and produce comparable code-quality output for a small TypeScript utility. Return a verdict confirming both invocations match the documented default contract.` | 1. `codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox read-only "Output ONLY a TypeScript function: clamp(n: number, min: number, max: number): number that returns n clamped to the [min, max] range. No explanation." > /tmp/cli-codex-cx010-run1.ts 2>&1` -> 2. `codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox read-only "Output ONLY a TypeScript function: clamp(n: number, min: number, max: number): number that returns n clamped to the [min, max] range. No explanation." > /tmp/cli-codex-cx010-run2.ts 2>&1` -> 3. `bash: grep -E "function clamp\|clamp.*=.*\(\|clamp\(" /tmp/cli-codex-cx010-run1.ts /tmp/cli-codex-cx010-run2.ts > /tmp/cli-codex-cx010-grep.txt` -> 4. `bash: printf 'EQUIVALENCE: both runs produced a clamp function with the documented signature; both invocations passed -c model_reasoning_effort="medium" explicitly per SKILL.md §4 ALWAYS rule 7.\n' > /tmp/cli-codex-cx010-note.txt` | Steps 1-2: both exit 0, both stdout files contain a TypeScript `clamp` function; Step 3: grep finds `clamp` in both files with the expected signature; Step 4: equivalence note created | Two captured TypeScript files, the grep output, the equivalence note, two dispatched command lines, exit codes | PASS if both exit 0, both contain `clamp` with the right signature, both command lines have the explicit `-c model_reasoning_effort="medium"` flag, AND the equivalence note exists; FAIL if any check misses | (1) Confirm SKILL.md §3 still names `medium` as the default; (2) re-run with `2>&1 \| tee` for stderr inline; (3) inspect both `.ts` files manually for divergent semantics |

### Optional Supplemental Checks

- Compile both with `bash: npx tsc --noEmit /tmp/cli-codex-cx010-run1.ts /tmp/cli-codex-cx010-run2.ts` to confirm syntactic validity.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§3 Default Invocation, §4 ALWAYS rule 7) | Documents `medium` as the default and mandates explicit effort |
| `../../references/cli_reference.md` (§5 Reasoning Effort Configuration) | Authoritative effort-level reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Default Invocation table |
| `../../references/cli_reference.md` | §5 Selection Strategy - default row |

---

## 5. SOURCE METADATA

- Group: Reasoning Effort
- Playbook ID: CX-010
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--reasoning-effort/002-medium-skill-default.md`
