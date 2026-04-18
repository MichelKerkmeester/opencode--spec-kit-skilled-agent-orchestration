# Phase A Implementation — Deep-Loop Executor Config (4 tasks)

## GATE 3 ALREADY RESOLVED — DO NOT ASK

**Spec folder**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-deep-loop-cli-executor/`
**Spec packet status**: Already scaffolded with spec.md, plan.md, tasks.md, checklist.md, decision-record.md, description.json, graph-metadata.json — validation passes with 0 errors.
**Your role**: Execute Phase A Sub-wave A tasks (T-CFG-01/02/03, T-TST-01) directly. Do NOT ask about spec folder choice. Do NOT ask A/B/C/D/E. Proceed immediately with the file changes below.

**Acknowledgment phrase to emit as your FIRST line of output**: `GATE_3_ACKNOWLEDGED: proceeding with packet 018-deep-loop-cli-executor`

---

You are implementing Phase 018 Sub-wave A for the system-spec-kit mcp_server codebase. The goal is to add executor-selection config for two iterative skills (sk-deep-research + sk-deep-review) plus a shared TypeScript loader/validator module plus unit tests.

## Repository context

- Working dir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- mcp_server root: `.opencode/skill/system-spec-kit/mcp_server/`
- TypeScript: type: "module", strict, Zod v4 already imported elsewhere
- Vitest: `vitest run` config already established. Tests under `mcp_server/tests/`.
- Existing Zod pattern reference: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` (lines 5-57 use standard `z.object`, `z.literal`, `z.enum`, `z.infer`).
- Existing test pattern reference: `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts` (lines 1-35 show vitest import + describe/it/expect).

## Do these four tasks in order

### T-CFG-01 — Add `executor` block to deep_research_config.json

**File**: `.opencode/skill/sk-deep-research/assets/deep_research_config.json`

After the line `"executionMode": "auto",` (around line 13) insert a new field:

```json
  "executor": {
    "kind": "native",
    "model": null,
    "reasoningEffort": null,
    "serviceTier": null,
    "sandboxMode": null,
    "timeoutSeconds": 900
  },
```

Preserve all other fields and their order. Preserve JSON formatting (2-space indent, trailing newline). Do not touch the `_optimizerManaged` block.

### T-CFG-02 — Mirror `executor` block to deep_review_config.json

**File**: `.opencode/skill/sk-deep-review/assets/deep_review_config.json`

After the line `"executionMode": "auto",` (around line 20) insert the IDENTICAL `executor` block shown above. Same 6 fields, same defaults, same JSON formatting. Do not touch any other field.

### T-CFG-03 — Create executor-config.ts module

**File to create**: `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`

Write a TypeScript module that:

1. Imports `z` from `'zod'` (Zod is already available).
2. Declares the executor kind enum:
   ```ts
   export const EXECUTOR_KINDS = ['native', 'cli-codex', 'cli-copilot', 'cli-gemini', 'cli-claude-code'] as const;
   export type ExecutorKind = typeof EXECUTOR_KINDS[number];
   ```
3. Declares reasoning-effort and service-tier enums:
   ```ts
   export const REASONING_EFFORTS = ['none', 'minimal', 'low', 'medium', 'high', 'xhigh'] as const;
   export type ReasoningEffort = typeof REASONING_EFFORTS[number];

   export const SERVICE_TIERS = ['priority', 'standard', 'fast'] as const;
   export type ServiceTier = typeof SERVICE_TIERS[number];
   ```
4. Declares the Zod schema `executorConfigSchema`:
   - `kind: z.enum(EXECUTOR_KINDS).default('native')`
   - `model: z.string().min(1).nullable().default(null)`
   - `reasoningEffort: z.enum(REASONING_EFFORTS).nullable().default(null)`
   - `serviceTier: z.enum(SERVICE_TIERS).nullable().default(null)`
   - `sandboxMode: z.enum(['read-only', 'workspace-write', 'danger-full-access']).nullable().default(null)`
   - `timeoutSeconds: z.number().int().positive().default(900)`
5. Exports `ExecutorConfig = z.infer<typeof executorConfigSchema>`.
6. Defines a custom error class `ExecutorNotWiredError` with fields `kind` and `message`. Message format: `"Executor kind '<kind>' is reserved in the schema but not yet wired. Awaiting future spec for <kind> integration."`
7. Defines a custom error class `ExecutorConfigError` for schema violations with field `issues`.
8. Exports `parseExecutorConfig(raw: unknown): ExecutorConfig`:
   - Parses `raw` with `executorConfigSchema.safeParse`.
   - On parse failure throws `ExecutorConfigError` with Zod issues.
   - After parse: if `kind === 'cli-codex'` and `model === null`, throws `ExecutorConfigError({ issues: [{ path: ['model'], message: 'model is required when kind is cli-codex' }] })`.
   - After parse: if `kind` is one of `cli-copilot`, `cli-gemini`, `cli-claude-code`, throws `ExecutorNotWiredError(kind)`.
   - `kind === 'native'` succeeds without any model.
9. Exports `resolveExecutorConfig(sources: { cli?: Partial<ExecutorConfig>; file?: Partial<ExecutorConfig> }): ExecutorConfig`:
   - Merges: cli > file > defaults. CLI flag keys override file keys; file keys override schema defaults.
   - Calls `parseExecutorConfig` on the merged object.
   - Returns the validated ExecutorConfig.
10. Module-level comment block at top with the standard `MODULE: Deep-Loop Executor Config` marker (see `graph-metadata-schema.ts` for the pattern).

Use the existing module pattern from `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`. Do not add any runtime dependencies beyond Zod.

### T-TST-01 — Write executor-config.vitest.ts

**File to create**: `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/executor-config.vitest.ts`

Write Vitest unit tests covering every behavior in T-CFG-03. Required test cases (each as a separate `it()`):

1. `parseExecutorConfig({ kind: 'native' })` returns a config with all defaults.
2. `parseExecutorConfig({})` (empty object) defaults to `kind: 'native'`.
3. `parseExecutorConfig({ kind: 'cli-codex', model: 'gpt-5.4' })` succeeds.
4. `parseExecutorConfig({ kind: 'cli-codex', model: null })` throws `ExecutorConfigError` with path `['model']`.
5. `parseExecutorConfig({ kind: 'cli-copilot', model: 'copilot-x' })` throws `ExecutorNotWiredError`.
6. `parseExecutorConfig({ kind: 'cli-gemini', model: 'gemini-pro' })` throws `ExecutorNotWiredError`.
7. `parseExecutorConfig({ kind: 'cli-claude-code', model: 'opus-4.7' })` throws `ExecutorNotWiredError`.
8. `parseExecutorConfig({ kind: 'mystery-cli', model: 'x' })` throws `ExecutorConfigError` (unknown enum value).
9. `parseExecutorConfig({ kind: 'cli-codex', model: 'gpt-5.4', reasoningEffort: 'super' })` throws `ExecutorConfigError`.
10. `parseExecutorConfig({ kind: 'cli-codex', model: 'gpt-5.4', serviceTier: 'slow' })` throws `ExecutorConfigError`.
11. `parseExecutorConfig({ kind: 'cli-codex', model: 'gpt-5.4', timeoutSeconds: 0 })` throws `ExecutorConfigError`.
12. Default `timeoutSeconds` is `900` when not specified.
13. `resolveExecutorConfig({ cli: { kind: 'cli-codex', model: 'gpt-5.4' }, file: { kind: 'native' } })` yields `kind: 'cli-codex'` (CLI wins).
14. `resolveExecutorConfig({ cli: {}, file: { kind: 'cli-codex', model: 'gpt-5.4' } })` yields `kind: 'cli-codex'` (file used when CLI absent).
15. `resolveExecutorConfig({ cli: { model: 'x' } })` with kind defaulting to native but model set — after merge kind is 'native', model is 'x'; since kind is native, model is ignored (accepted but not required). NOTE: clarify in test — the test just validates the merge, not whether native ignores model.
16. `resolveExecutorConfig({ cli: { kind: 'cli-codex' } })` (no model anywhere) throws `ExecutorConfigError`.

Each `it()` block asserts on the expected return value or the thrown error's type/message. Use `expect(() => ...).toThrow(ExecutorNotWiredError)` for error-class assertions.

Use standard vitest imports: `import { describe, it, expect } from 'vitest';`. Import from the relative path `'../../lib/deep-loop/executor-config'`.

## Invariants you MUST respect

- Do not modify any file outside the four listed above.
- Do not add dependencies. Zod is already in `package.json`.
- Do not add `any` or `unknown as` casts. Use proper Zod-inferred types.
- The two config JSON files must remain valid JSON; validate syntax before writing.
- Preserve trailing newlines in JSON files.
- The TypeScript file must compile under the project's existing tsconfig (module: "esnext", target: "es2022", strict: true). Use `import { z } from 'zod';` (already importable).
- Tests must be self-contained; do not mock Zod.

## Verification after writing

After you finish writing all 4 files, run these commands and report results:

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server
npx tsc --noEmit --composite false -p tsconfig.json 2>&1 | tail -20
npx vitest run tests/deep-loop/executor-config.vitest.ts 2>&1 | tail -30
```

If type-check errors exist in your newly-created files, FIX them before reporting done. Report the exact file contents of executor-config.ts and executor-config.vitest.ts in your final output so the orchestrator can verify.

## Output format

At the end of your run, emit a summary in this format (plain text, no code fences):

```
PHASE_A_STATUS: [OK | FAIL]
FILES_TOUCHED: <list>
TSC_RESULT: [pass | fail: <summary>]
VITEST_RESULT: [<n>/<m> passed]
NEXT_STEPS: <any follow-ups the orchestrator should handle>
```
</content>
</invoke>
