# Phase C Implementation — Research YAML Dispatch Branch (4 tasks)

## GATE 3 ALREADY RESOLVED — DO NOT ASK

**Spec folder**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/017-cli-runtime-executors/001-executor-feature/`
**Previous phases (A + B) status**: COMPLETE. 27/27 tests green, tsc clean. Files: executor-config.ts, prompt-pack.ts, 2 .tmpl templates, 2 JSON config updates, 2 vitest suites.
**Your role**: Execute Phase C Sub-wave C tasks (T-YMR-01/02/03/04). Do NOT ask about spec folder. Proceed directly.

**First line of output**: `GATE_3_ACKNOWLEDGED: proceeding with packet 018 Phase C`

**Sandbox note**: Your writes must cover BOTH `.opencode/command/spec_kit/assets/` (for YAML edits) AND `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/` (for the new validator module). Work from repo root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`.

---

## Context

Phase A shipped `executor-config.ts` with `parseExecutorConfig` + `resolveExecutorConfig`. Phase B shipped `prompt-pack.ts` with `renderPromptPack` + the two `.tmpl` templates. Phase C wires both into the YAML dispatch:

1. YAML's `step_dispatch_iteration` branches on `config.executor.kind`:
   - `if_native` (default): preserves existing `@deep-research` agent dispatch with `model: opus` EXACTLY as before.
   - `if_cli_codex` (new): invokes `codex exec` via stdin-piped rendered template.
2. Both branches share a `pre_dispatch` step that calls `renderPromptPack` to produce the iteration prompt.
3. Both branches share a `post_dispatch_validate` step that asserts iteration file + JSONL delta invariants.
4. A new `record_executor_audit` step appends `executor: {...}` to the iteration's JSONL delta when non-native.

## CRITICAL INVARIANT

Native-path bit-identical behavior MUST be preserved. Any deep-research user invoking `/spec_kit:deep-research :auto` WITHOUT `--executor=` flags must see identical iteration files + identical JSONL records to pre-feature behavior. This is REQ-002 in spec.md §4.

## Do these four tasks

### T-YMR-01 — Refactor spec_kit_deep-research_auto.yaml step_dispatch_iteration

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
**Lines**: 465-498 (current `step_dispatch_iteration` block)

Replace the existing block with this structure (preserving YAML formatting, indentation, and surrounding context):

```yaml
      step_dispatch_iteration:
        action: "Dispatch one iteration via the selected executor"
        resolve_executor:
          source: "config.executor"
          loader: ".opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts#parseExecutorConfig"
        pre_dispatch:
          generate_summary: |
            STATE SUMMARY (auto-generated):
            Segment: {current_segment} | Iteration: {current_iteration} of {max_iterations}
            Questions: {answered_count}/{total_questions} answered | Last focus: {last_focus}
            Last 2 ratios: {ratio_prev} -> {ratio_latest} | Stuck count: {stuck_count}
            Next focus: {next_focus}
          render_prompt_pack:
            template_path: ".opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl"
            renderer: ".opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/prompt-pack.ts#renderPromptPack"
            output_path: "{spec_folder}/research/prompts/iteration-{current_iteration}.md"
            variables:
              state_summary: "{state_summary}"
              research_topic: "{research_topic}"
              current_iteration: "{current_iteration}"
              max_iterations: "{max_iterations}"
              next_focus: "{next_focus}"
              remaining_questions_list: "{remaining_questions_list}"
              last_3_summaries: "{last_3_summaries}"
              state_paths_config: "{state_paths.config}"
              state_paths_state_log: "{state_paths.state_log}"
              state_paths_strategy: "{state_paths.strategy}"
              state_paths_registry: "{state_paths.registry}"
              state_paths_iteration_pattern: "{state_paths.iteration_pattern}"
        branch_on: "config.executor.kind"
        if_native:
          dispatch:
            agent: deep-research
            model: opus
            context_source: "rendered_prompt_pack"
          wait_for_completion: true
        if_cli_codex:
          command: |
            codex exec \
              --model "{config.executor.model}" \
              -c model_reasoning_effort="{config.executor.reasoningEffort}" \
              -c service_tier="{config.executor.serviceTier}" \
              -c approval_policy=never \
              --sandbox workspace-write \
              - < "{spec_folder}/research/prompts/iteration-{current_iteration}.md"
          working_directory: "{repo_root}"
          timeout_seconds: "{config.executor.timeoutSeconds}"
          wait_for_completion: true
        post_dispatch_validate:
          validator: ".opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts#validateIterationOutputs"
          assert_exists: "{state_paths.iteration_pattern}"
          assert_appended: "{state_paths.state_log}"
          assert_jsonl_fields: [type, iteration, newInfoRatio, status, focus]
          on_failure:
            action: "emit schema_mismatch canonical conflict event"
            escalation: "After 3 consecutive failures, trigger stuck_recovery event with diagnostic context"
        record_executor_audit:
          skip_when: "config.executor.kind == 'native'"
          target: "{state_paths.state_log}"
          field: "executor"
          value:
            kind: "{config.executor.kind}"
            model: "{config.executor.model}"
            reasoningEffort: "{config.executor.reasoningEffort}"
            serviceTier: "{config.executor.serviceTier}"
```

Preserve all surrounding YAML (before line 465 and after line 498 of the original file). The output of this step must remain input to `step_reduce_state` unchanged.

### T-YMR-02 — Mirror into confirm YAML

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
**Lines**: 527-560 (current `step_dispatch_iteration` block)

Replace with the IDENTICAL block structure from T-YMR-01. Preserve confirm-mode pauses (`on_A/on_B/on_C/on_D` gate handlers near line 522) intact.

### T-YMR-03 — Create post-dispatch-validate.ts

**File to create**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`

TypeScript module:

1. Imports: `import { readFileSync, existsSync, statSync } from 'node:fs';`
2. Exports type `PostDispatchValidateInput`:
   ```ts
   export type PostDispatchValidateInput = {
     iterationFile: string;
     stateLogPath: string;
     previousStateLogSize: number;
     requiredJsonlFields: string[];
   };
   ```
3. Exports type `PostDispatchValidateResult`:
   ```ts
   export type PostDispatchValidateResult =
     | { ok: true }
     | { ok: false; reason: 'iteration_file_missing' | 'iteration_file_empty' | 'jsonl_not_appended' | 'jsonl_missing_fields' | 'jsonl_parse_error'; details: string };
   ```
4. Exports function `validateIterationOutputs(input: PostDispatchValidateInput): PostDispatchValidateResult`:
   - If `!existsSync(input.iterationFile)`: return `{ ok: false, reason: 'iteration_file_missing', details: input.iterationFile }`.
   - If `statSync(input.iterationFile).size === 0`: return `{ ok: false, reason: 'iteration_file_empty', details: input.iterationFile }`.
   - If `statSync(input.stateLogPath).size <= input.previousStateLogSize`: return `{ ok: false, reason: 'jsonl_not_appended', details: 'no new records since ' + input.previousStateLogSize + ' bytes' }`.
   - Otherwise, read stateLogPath, find the last non-empty line, JSON.parse it; if parse fails return `{ ok: false, reason: 'jsonl_parse_error', details: <error message> }`.
   - If any of `input.requiredJsonlFields` is missing from the parsed record, return `{ ok: false, reason: 'jsonl_missing_fields', details: 'missing: ' + <list>.join(',') }`.
   - Otherwise return `{ ok: true }`.
5. Exports error class `PostDispatchValidationError extends Error` with fields `result: PostDispatchValidateResult`.
6. Exports helper `validateOrThrow(input: PostDispatchValidateInput): void` that calls `validateIterationOutputs` and throws `PostDispatchValidationError` if `!ok`.
7. Module-level comment `// MODULE: Deep-Loop Post-Dispatch Validator`.

Reject: no `any`, no `unknown as`, no async. Standard Node.js built-ins only.

### T-YMR-04 — Wire record_executor_audit behavior + tests

**File to create**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts`

TypeScript module:

1. Imports: `readFileSync`, `appendFileSync` from `node:fs`, `ExecutorConfig` from `./executor-config`.
2. Exports function `buildExecutorAuditRecord(executor: ExecutorConfig): Record<string, unknown>`:
   - Returns `{ kind: executor.kind, model: executor.model, reasoningEffort: executor.reasoningEffort, serviceTier: executor.serviceTier }`.
   - Does NOT include null fields? Actually: include them all, since null means "not set". Consumers parse the JSON.
3. Exports function `appendExecutorAuditToLastRecord(stateLogPath: string, executor: ExecutorConfig): void`:
   - Skip (early return) if `executor.kind === 'native'`.
   - Read the state log. Find the last non-empty line.
   - Parse that line as JSON (throw if unparseable).
   - Merge the executor audit block as `.executor` field. Write the merged line BACK as the last line (replacing the previous last line).
   - This requires reading the full file, replacing the final line, writing the file back. Use `readFileSync` + `writeFileSync`.
   - Emit nothing on success.
4. Module-level comment.

**Also create test file**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts`

Test cases:
1. Valid iteration file + appended JSONL with all required fields → `{ ok: true }`.
2. Missing iteration file → `{ ok: false, reason: 'iteration_file_missing' }`.
3. Empty iteration file → `{ ok: false, reason: 'iteration_file_empty' }`.
4. JSONL not appended (size unchanged) → `{ ok: false, reason: 'jsonl_not_appended' }`.
5. Last JSONL line has missing required field → `{ ok: false, reason: 'jsonl_missing_fields' }`.
6. Last JSONL line is malformed JSON → `{ ok: false, reason: 'jsonl_parse_error' }`.
7. `validateOrThrow` throws `PostDispatchValidationError` on bad result.
8. `validateOrThrow` returns void on ok.

**Also create test file**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/executor-audit.vitest.ts`

Test cases:
1. `buildExecutorAuditRecord` returns all 4 fields for cli-codex config.
2. `appendExecutorAuditToLastRecord` is a no-op when executor.kind === 'native'.
3. `appendExecutorAuditToLastRecord` merges audit into the last JSONL line when non-native.
4. Subsequent reads of the state log show the updated last line with executor field.
5. Malformed last line throws an error (doesn't silently corrupt).

Tests should use tempdir (`mkdtempSync` from `node:fs`) for state log fixtures.

## Invariants

- Do NOT modify any file outside the ones listed. The YAML structure outside `step_dispatch_iteration` stays untouched.
- Native-path bit-identical: `if_native` branch's dispatch block must contain EXACTLY `agent: deep-research` and `model: opus`. No whitespace or key changes that would alter agent dispatch output.
- The `context_source: "rendered_prompt_pack"` hint tells the workflow executor to use the rendered content (from pre_dispatch.render_prompt_pack) as the agent's context string. The native path preserves this because the rendered template contains the same content the old inline `context: |` block had.
- NO runtime dependencies beyond what was added in Phases A+B.

## Verification

Run from repo root:

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server
npx tsc --noEmit --composite false -p tsconfig.json 2>&1 | tail -15
npx vitest run tests/deep-loop/ 2>&1 | tail -15
```

Expected: 27 existing tests still pass + your new tests added (aim for 35+ total).

Fix any type errors before reporting done.

## Output format (final line)

```
PHASE_C_STATUS: [OK | FAIL]
FILES_TOUCHED: <list>
YAML_EDITS: [auto.yaml: block replaced | confirm.yaml: block replaced]
NEW_MODULES: [post-dispatch-validate.ts, executor-audit.ts]
TSC_RESULT: [pass | fail]
VITEST_RESULT: [<n>/<m> passed]
NATIVE_PATH_PRESERVATION: [verified via visual diff | requires post-hoc test]
NEXT_STEPS: <follow-ups>
```
