---
title: "CX-009 -- low / minimal / none reasoning baseline"
description: "This scenario validates the low-end reasoning levels for `CX-009`. It focuses on confirming none/minimal/low produce successful, low-latency responses for trivial tasks."
---

# CX-009 -- low / minimal / none reasoning baseline

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-009`.

---

## 1. OVERVIEW

This scenario validates the low-end reasoning levels for `CX-009`. It focuses on confirming the lower reasoning-effort levels (`none`, `minimal`, `low`) are accepted via `-c model_reasoning_effort="<level>"` and produce successful, lower-latency responses for trivial tasks.

### Why This Matters

`references/cli_reference.md` §5 documents `none`, `minimal` and `low` as supported reasoning levels for cost/latency-sensitive lookups. If these levels silently reject or produce empty output, every "trivial lookup" routing recommendation in SKILL.md §3 and `integration_patterns.md` §5 collapses.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CX-009` and confirm the expected signals without contradictory evidence.

- Objective: Verify the lower reasoning-effort levels (`none`, `minimal`, `low`) are accepted and produce successful, lower-latency responses for trivial tasks.
- Real user request: `Try Codex on a trivial lookup at the cheapest reasoning level — confirm it still works.`
- Prompt: `As a cross-AI orchestrator running a trivial lookup, dispatch the prompt "List the three primary colors as JSON" three times against --model gpt-5.5 -c service_tier="fast" with reasoning effort none, minimal, and low respectively. Verify all three exit 0, all three return valid JSON containing red/green/blue (or red/yellow/blue for the artistic primary set), and the dispatched command lines explicitly carry the documented effort flag. Return a verdict mapping each effort level to the exit code and validity of the returned JSON.`
- Expected execution process: Operator dispatches the same trivial prompt three times with deltas only on the effort flag -> captures stdout for each -> validates each is parseable JSON -> compiles a 3-row mapping.
- Expected signals: All three invocations exit 0. All three responses contain a JSON array or object with three primary colors. Dispatched command lines include the documented `-c model_reasoning_effort="<level>"` flag verbatim for each level.
- Desired user-visible outcome: Confirmation that low-end reasoning levels are real, supported and useful for trivial tasks where latency and cost matter more than depth.
- Pass/fail: PASS if all three invocations exit 0, all three return parseable JSON with three primary colors, AND the effort flag is visible in each dispatched command line. FAIL if any level rejects, returns empty or omits the flag.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Dispatch the same trivial prompt three times with `-c model_reasoning_effort="none"`, `="minimal"` and `="low"` respectively.
2. Capture each stdout to a separate temp file.
3. Validate each is parseable JSON containing 3 primary colors.
4. Compile a 3-row mapping table: level -> exit code -> JSON validity.
5. Return a verdict naming the three levels.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-009 | low / minimal / none reasoning baseline | Verify none/minimal/low reasoning levels return valid JSON for trivial lookups | `As a cross-AI orchestrator running a trivial lookup, dispatch the prompt "List the three primary colors as JSON" three times against --model gpt-5.5 -c service_tier="fast" with reasoning effort none, minimal, and low respectively. Verify all three exit 0, all three return valid JSON containing red/green/blue (or red/yellow/blue for the artistic primary set), and the dispatched command lines explicitly carry the documented effort flag. Return a verdict mapping each effort level to the exit code and validity of the returned JSON.` | 1. `codex exec --model gpt-5.5 -c model_reasoning_effort="none" -c service_tier="fast" --sandbox read-only "Return ONLY raw JSON (no code fences, no explanation): a JSON array of the three primary colors as lowercase strings." > /tmp/cli-codex-cx009-none.json 2>&1` -> 2. `codex exec --model gpt-5.5 -c model_reasoning_effort="minimal" -c service_tier="fast" --sandbox read-only "Return ONLY raw JSON (no code fences, no explanation): a JSON array of the three primary colors as lowercase strings." > /tmp/cli-codex-cx009-minimal.json 2>&1` -> 3. `codex exec --model gpt-5.5 -c model_reasoning_effort="low" -c service_tier="fast" --sandbox read-only "Return ONLY raw JSON (no code fences, no explanation): a JSON array of the three primary colors as lowercase strings." > /tmp/cli-codex-cx009-low.json 2>&1` -> 4. `bash: for level in none minimal low; do printf '%s: ' "$level"; jq -r '.[]' /tmp/cli-codex-cx009-$level.json 2>/dev/null | tr '\n' ',' || cat /tmp/cli-codex-cx009-$level.json | head -3; printf '\n'; done > /tmp/cli-codex-cx009-summary.txt` | Steps 1-3: each invocation exits 0; Step 4: each response parses as JSON (or contains 3 primary-color strings even if jq fails on a slight syntax variation) | Three captured stdout files, the summary file, three dispatched command lines, exit codes | PASS if all three exit 0 AND all three responses contain 3 primary-color strings AND each dispatched command includes `-c model_reasoning_effort="<level>"`; FAIL if any level rejects, exits non-zero, or returns garbage | (1) Confirm `references/cli_reference.md` §5 still lists none/minimal/low as supported; (2) re-run with `2>&1 | tee` for stderr inline; (3) check `/tmp/cli-codex-cx009-*.json` for code-fence-wrapped JSON and strip if needed |

### Optional Supplemental Checks

- Time each invocation with `bash: time codex exec ...` and confirm `none` < `low` < `minimal` < `medium` in observed wall-clock latency (depth ladder check).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§3 Reasoning Effort Levels) | Documents the six effort levels |
| `../../references/cli_reference.md` (§5 Reasoning Effort Configuration) | Authoritative effort-level reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | §5 Valid values table for `model_reasoning_effort` |
| `../../references/integration_patterns.md` | §5 Decision Matrix - trivial lookup row |

---

## 5. SOURCE METADATA

- Group: Reasoning Effort
- Playbook ID: CX-009
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--reasoning-effort/001-low-minimal-none-baseline.md`
