# Phase D Implementation — Review YAML Dispatch Branch Mirror (2 tasks)

## GATE 3 ALREADY RESOLVED — DO NOT ASK

**Spec folder**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/001-executor-feature/`
**Phases A+B+C COMPLETE**: 40/40 tests green. YAML research auto+confirm already have two-branch dispatch.
**Your role**: Mirror Phase C changes into `sk-deep-review` YAMLs (T-YMV-01/02). Do NOT ask about spec folder. Proceed directly.

**First line of output**: `GATE_3_ACKNOWLEDGED: proceeding with packet 018 Phase D`

**Working dir**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`

---

## Reference: what Phase C produced

Phase C's two-branch structure in `spec_kit_deep-research_auto.yaml` (around lines 494-530) has:
- `branch_on: "config.executor.kind"`
- `if_native` (dispatches `@deep-research` agent with `model: opus`)
- `if_cli_codex` (runs `codex exec` with stdin-piped prompt)
- `post_dispatch_validate` invoking `validateIterationOutputs`
- `record_executor_audit` (skipped for native)

Read `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` around those lines to see the exact structure.

## Task D: Mirror into sk-deep-review

### T-YMV-01 — Refactor spec_kit_deep-review_auto.yaml step_dispatch_iteration

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
**Current block**: lines 575-609 (the `step_dispatch_iteration` for review).

Replace with the SAME two-branch structure as Phase C's research auto YAML, with these substitutions:

1. `if_native` dispatches `agent: deep-review` (not deep-research) with `model: opus`.
2. `render_prompt_pack`:
   - `template_path: ".opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl"` (review template, not research).
   - `variables` includes the review-specific fields:
     - `state_summary: "{state_summary}"`
     - `current_iteration: "{current_iteration}"`
     - `max_iterations: "{max_iterations}"`
     - `next_dimension: "{next_dimension}"`
     - `review_target: "{review_target}"`
     - `review_scope_files: "{review_scope_files}"`
     - `p0_count: "{p0_count}"`, `p1_count: "{p1_count}"`, `p2_count: "{p2_count}"`
     - `state_paths_config: "{state_paths.config}"`
     - `state_paths_state_log: "{state_paths.state_log}"`
     - `state_paths_findings_registry: "{state_paths.findings_registry}"`
     - `state_paths_strategy: "{state_paths.strategy}"`
     - `state_paths_iteration_pattern: "{state_paths.iteration_pattern}"`
3. `assert_jsonl_fields: [type, iteration, dimensions, filesReviewed, findingsSummary, newFindingsRatio]` (review's JSONL schema differs — see the template's output contract).
4. `post_dispatch_validate.validator` path is the same (`.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts#validateIterationOutputs`).
5. `record_executor_audit` is identical to research (same target state_log + same 4-field value).
6. `resolve_executor` pointer is identical (uses the same shared executor-config.ts).

Preserve all surrounding YAML (before line 575 and after line 609). Do not touch the review-specific pre-existing steps (gate_pre_synthesis, reducer, etc.).

### T-YMV-02 — Mirror into confirm YAML

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`

Find the `step_dispatch_iteration` block in that file. Replace with the IDENTICAL structure from T-YMV-01, preserving any confirm-mode pauses intact.

## Invariants

- Native-path bit-identical: `if_native` must dispatch `agent: deep-review` with `model: opus` exactly as before.
- Shared modules (post-dispatch-validate.ts, executor-audit.ts, executor-config.ts, prompt-pack.ts) are REUSED — do not create duplicates.
- No new test files needed (existing vitest suites already cover the shared modules; the YAMLs aren't unit-testable directly).

## Verification

After editing both YAMLs:

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server
npx tsc --noEmit --composite false -p tsconfig.json 2>&1 | tail -10
npx vitest run tests/deep-loop/ 2>&1 | tail -8
grep -n "if_native\|if_cli_codex\|branch_on\|post_dispatch_validate\|record_executor_audit" ../../../command/spec_kit/assets/spec_kit_deep-review_auto.yaml ../../../command/spec_kit/assets/spec_kit_deep-review_confirm.yaml | head -15
```

Expected: 40/40 tests still pass; grep shows the 5 new YAML sections in both review files.

## Output format (final line)

```
PHASE_D_STATUS: [OK | FAIL]
FILES_TOUCHED: <list>
REVIEW_YAML_EDITS: [auto.yaml: block replaced | confirm.yaml: block replaced]
TSC_RESULT: [pass | fail]
VITEST_RESULT: [<n>/<m> passed]
SYMMETRY_CHECK: [research-confirm-auto vs review-confirm-auto structurally equivalent: yes | no + detail]
NEXT_STEPS: <follow-ups>
```
