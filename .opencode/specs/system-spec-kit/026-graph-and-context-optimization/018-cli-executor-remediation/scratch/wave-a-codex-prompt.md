# Phase 020 Wave A — Shared Deep-Loop Provenance (R1 + R2)

## GATE 3 ALREADY RESOLVED — DO NOT ASK

**Spec folder**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-cli-executor-remediation/`
**Phase 018/019 state**: Shipped. 54/54 deep-loop tests green. Executor-selection infrastructure live for native + cli-codex + cli-copilot + cli-gemini + cli-claude-code.
**Your role**: Implement R1 (first-write executor provenance) + R2 (dispatch_failure event) across shared modules + 4 YAML dispatch files. No ask about spec folder.

**First line**: `GATE_3_ACKNOWLEDGED: proceeding with packet 020 Wave A`

**Working dir**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`

---

## Context

Research.md §5 F4+F5 identified: non-native executor identity is appended AFTER validation as the LAST JSONL record. If the dispatch crashed or produced a malformed file, no audit attribution survives. Fix: write executor identity on the FIRST JSONL record of each non-native iteration, and emit a typed `dispatch_failure` event that preserves identity when no valid iteration record exists.

Research.md §10 R1+R2 define the remediations.
Decision-record.md ADR-010 chose: enrich `schema_mismatch` with `executor` field AND add new `dispatch_failure` sibling event.

## Do these tasks

### T-AUD-01 — First-write executor helper

**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts`

Add new exported function:

```typescript
export function writeFirstRecordExecutor(
  stateLogPath: string,
  executor: ExecutorConfig,
  iteration: number
): void {
  // Idempotent: if the iteration record already exists with executor field, no-op
  // If the iteration record exists without executor, merge-patch it
  // If no record for this iteration yet, append a sentinel {type:'iteration_start', iteration, executor, timestamp}
}
```

Keep existing `appendExecutorAuditToLastRecord` exported; it remains the success-path merge if the final iteration record lacks the field.

Skip for `executor.kind === 'native'` (no audit needed).

### T-AUD-02 — Dispatch-failure emitter

Same file. Add:

```typescript
export function emitDispatchFailure(
  stateLogPath: string,
  executor: ExecutorConfig,
  reason: 'timeout' | 'crash' | 'missing_output' | 'invalid_output' | 'other',
  iteration: number,
  detail?: string
): void {
  // Append a {type:'event', event:'dispatch_failure', executor, reason, iteration, detail, timestamp} record
  // Idempotent: if the last event for this iteration is already dispatch_failure, no-op
}
```

Even for native runs, emit if a failure occurs (skip the executor field when kind=='native').

### T-VAL-01 — Post-dispatch validation requires provenance on non-native

**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`

Update `validateIterationOutputs` to:
1. Add a new param `executorKind` (optional, defaults to undefined for back-compat).
2. If `executorKind && executorKind !== 'native'`, the parsed iteration record MUST have an `executor` field; missing → return `{ok: false, reason: 'executor_missing', details: ...}`.
3. Extend the `PostDispatchValidateResult` reason union to include `'executor_missing'`.

### T-VAL-02 — Tolerate dispatch_failure records during validation

Same file. If the LAST JSONL line is `{type:'event', event:'dispatch_failure', ...}`, treat it as a pre-existing failure event and return `{ok: false, reason: 'dispatch_failure_logged', details: ...}` WITHOUT emitting an additional `schema_mismatch`. This prevents double-signalling.

Also update `schema_mismatch` emit path (if this module does it) to include the executor identity.

### T-YML-01/02/03/04 — Reorder YAML dispatch in 4 YAMLs

For each of:
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`

Find `step_dispatch_iteration`. BEFORE the `branch_on: "config.executor.kind"` selector, insert a new pre-step:

```yaml
        pre_dispatch_audit:
          skip_when: "config.executor.kind == 'native'"
          call: ".opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts#writeFirstRecordExecutor"
          args:
            stateLogPath: "{state_paths.state_log}"
            executor: "{config.executor}"
            iteration: "{current_iteration}"
```

Keep the existing `record_executor_audit` step AFTER `post_dispatch_validate` — it now functions as an idempotent merge for the final record shape.

### T-TST-01/02/03 — Tests

**Extend** `tests/deep-loop/executor-audit.vitest.ts`:
- writeFirstRecordExecutor: appends sentinel when no iteration record exists
- writeFirstRecordExecutor: merges when iteration record exists without executor
- writeFirstRecordExecutor: no-op when iteration record has executor
- writeFirstRecordExecutor: skips native
- emitDispatchFailure: writes typed event with executor
- emitDispatchFailure: idempotent on repeat call
- emitDispatchFailure: native kind produces event without executor block

**Extend** `tests/deep-loop/post-dispatch-validate.vitest.ts`:
- validateIterationOutputs with executorKind='cli-codex' + iteration record missing executor → reason 'executor_missing'
- validateIterationOutputs with executorKind='native' + iteration record without executor → ok (back-compat)
- validateIterationOutputs when last line is dispatch_failure event → reason 'dispatch_failure_logged'

**New** `tests/deep-loop/dispatch-failure.vitest.ts`:
- End-to-end: simulate crash before iteration write → emitDispatchFailure → validateIterationOutputs returns dispatch_failure_logged
- Provenance preserved across crash

## Invariants

- Preserve Phase 018/019 exports.
- `appendExecutorAuditToLastRecord` stays usable for the success path.
- Native-path behavior unchanged: no pre_dispatch_audit for native kind, no executor requirement in validator for native.
- Zero changes to reducer or graph-upsert steps.

## Verification

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server
npx tsc --noEmit --composite false -p tsconfig.json 2>&1 | tail -5
npx vitest run tests/deep-loop/ 2>&1 | tail -8
```

Expected: tsc clean; test count grows from 54 to ~65 with new cases.

## Output format

```
WAVE_A_STATUS: [OK | FAIL]
FILES_TOUCHED: <list>
NEW_EXPORTS: [writeFirstRecordExecutor, emitDispatchFailure]
YAML_EDITS: [4 YAMLs]
VITEST_RESULT: [<n>/<m> passed]
TSC_RESULT: [pass | fail]
```
</content>
</invoke>
