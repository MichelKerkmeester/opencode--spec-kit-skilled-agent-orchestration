---
title: "CX-001 -- Default invocation (gpt-5.5 medium fast)"
description: "This scenario validates the canonical zero-input default dispatch (gpt-5.5 + medium reasoning + service_tier=fast) for `CX-001`. It focuses on confirming the documented skill default produces a working code-generation answer with exit code 0."
---

# CX-001 -- Default invocation (gpt-5.5 medium fast)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-001`.

---

## 1. OVERVIEW

This scenario validates the canonical zero-input default dispatch for `CX-001`. It focuses on confirming the documented skill default (`gpt-5.5` + `medium` reasoning + `service_tier="fast"`) produces a working code-generation answer with exit code 0.

### Why This Matters

The default invocation is the single most important contract in this skill. SKILL.md §3 mandates `--model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast"` as the zero-input baseline. If this baseline regresses, every other scenario built on top of it inherits the failure. This scenario is on the critical-path list (§5 of the root playbook).

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify the documented zero-input default dispatch returns a usable code-generation answer with exit code 0.
- Real user request: `Generate a tiny TypeScript fizzbuzz function for me using whatever the cli-codex default is.`
- Prompt: `As a cross-AI orchestrator dispatching from a non-Codex runtime, generate a single TypeScript function fizzbuzz(n: number): string[] using the cli-codex default invocation. Verify the function compiles, has correct fizzbuzz semantics, and Codex returned exit code 0 with the function body printed to stdout. Return a concise pass/fail verdict naming the model, reasoning effort, and service tier actually used.`
- Expected execution process: Operator confirms preconditions (codex installed, authenticated, non-Codex runtime) -> dispatches the documented default invocation -> captures stdout to a temp file -> inspects the captured TypeScript for fizzbuzz semantics -> records the dispatched command line as evidence.
- Expected signals: `codex exec` exits 0. Stdout contains a TypeScript function named `fizzbuzz`. Output references `n`, `Fizz`, `Buzz` and `FizzBuzz` semantics. The dispatched command line includes `--model gpt-5.5`, `-c model_reasoning_effort="medium"` and `-c service_tier="fast"`.
- Desired user-visible outcome: A working `fizzbuzz` function with operator-readable evidence that the documented default invocation pattern was used verbatim.
- Pass/fail: PASS if exit code is 0 AND the TypeScript output contains valid fizzbuzz semantics AND the dispatched command line includes all three documented default flags. FAIL if any of these checks miss.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain language: "Generate a tiny TypeScript fizzbuzz using the documented default."
2. Confirm runtime is non-Codex (Claude Code, OpenCode, Copilot, Gemini or shell).
3. Execute the dispatch verbatim with all three default flags.
4. Inspect the captured stdout for valid TypeScript and fizzbuzz semantics.
5. Return a one-paragraph PASS/FAIL verdict naming the model, effort and service tier observed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-001 | Default invocation (gpt-5.5 medium fast) | Verify the canonical zero-input default dispatch returns a usable code-generation answer with exit 0 | `As a cross-AI orchestrator dispatching from a non-Codex runtime, generate a single TypeScript function fizzbuzz(n: number): string[] using the cli-codex default invocation. Verify the function compiles, has correct fizzbuzz semantics, and Codex returned exit code 0 with the function body printed to stdout. Return a concise pass/fail verdict naming the model, reasoning effort, and service tier actually used.` | 1. `bash: command -v codex` -> 2. `bash: env | grep -i codex_` (must be empty) -> 3. `codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox workspace-write "Generate a single TypeScript function fizzbuzz(n: number): string[] that returns the fizzbuzz sequence from 1 to n. Output only the function body and its signature, no explanation." > /tmp/cli-codex-cx001.ts 2>&1` -> 4. `bash: cat /tmp/cli-codex-cx001.ts` -> 5. `bash: grep -E "fizzbuzz|Fizz|Buzz|FizzBuzz" /tmp/cli-codex-cx001.ts` | Step 1: codex path printed; Step 2: empty (no Codex env vars); Step 3: exit 0; Step 4: stdout contains TypeScript function `fizzbuzz`; Step 5: at least 4 fizzbuzz-keyword matches | Captured stdout file `/tmp/cli-codex-cx001.ts`, full dispatched command line, exit code, terminal transcript | PASS if Steps 1-5 all match expected signals AND the dispatched command includes `--model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast"`; FAIL if exit code is non-zero, stdout lacks the function, OR any of the three default flags is missing | (1) Re-run `command -v codex` to confirm install; (2) re-run `codex login` if auth expired; (3) inspect `/tmp/cli-codex-cx001.ts` for partial output; (4) reproduce dispatch with `2>&1 | tee` to capture stderr inline |

### Optional Supplemental Checks

- Compile the captured TypeScript with `bash: npx tsc --noEmit --target ES2020 /tmp/cli-codex-cx001.ts` to confirm syntactic validity.
- Re-run the dispatch with the SAME flags and confirm consistent behavior across two consecutive invocations.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§3 Default Invocation) | Documents the canonical default `--model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast"` |
| `../../references/cli_reference.md` (§4 Command-Line Flags, §5 Model Selection) | Authoritative flag and model reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill default-invocation contract (§3) and ALWAYS rule 7 (§4) |
| `../../references/cli_reference.md` | CLI flag reference for `--model`, `-c model_reasoning_effort` and `-c service_tier` |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CX-001
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--cli-invocation/001-default-invocation.md`
