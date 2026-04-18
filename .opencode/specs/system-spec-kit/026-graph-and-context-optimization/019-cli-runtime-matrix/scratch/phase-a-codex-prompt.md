# Phase 019-A: Per-kind flag validation in executor-config.ts (5 tasks)

## GATE 3 ALREADY RESOLVED — DO NOT ASK

**Spec folder**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/019-cli-runtime-matrix/`
**Previous phase (Phase 018) state**: Shipped 2026-04-18. 40/40 tests green. Executor-config.ts rejects cli-copilot/cli-gemini/cli-claude-code with `ExecutorNotWiredError`.
**Your role**: Execute Phase 019-A tasks (T-CFG-04/05/06/07/08). Do NOT ask about spec folder.

**First line of output**: `GATE_3_ACKNOWLEDGED: proceeding with packet 019 Phase A`

**Working dir**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`

---

## Context

Phase 018 reserved three executor kinds in the enum but threw `ExecutorNotWiredError` at config load. Phase 019 wires them. Each CLI has a different supported-flag surface so the schema grows per-kind validation.

## Canonical per-CLI supported-flag matrix (from research)

| Kind | model | reasoningEffort | serviceTier | sandboxMode | timeoutSeconds |
|------|-------|-----------------|-------------|-------------|----------------|
| `native` | ✗ | ✗ | ✗ | ✗ | ✗ |
| `cli-codex` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `cli-copilot` | ✓ | ✗ (config.json only) | ✗ | ✗ | ✓ |
| `cli-gemini` | ✓ (whitelist) | ✗ | ✗ | ✓ | ✓ |
| `cli-claude-code` | ✓ | ✓ | ✗ | ✓ | ✓ |

cli-gemini model whitelist (phase 019): `['gemini-3.1-pro-preview']` as `const`.

## Do these five tasks in order

### T-CFG-04 — Remove ExecutorNotWiredError rejection for the 3 kinds

**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`

Currently in `parseExecutorConfig`, after the Zod parse there is a block that throws `ExecutorNotWiredError` when `config.kind` is one of `cli-copilot`, `cli-gemini`, or `cli-claude-code`. Remove that block. The three kinds now proceed to the remaining validation.

DO NOT delete the `ExecutorNotWiredError` class itself — it stays as a type. It just stops being thrown.

### T-CFG-05 — Add EXECUTOR_KIND_FLAG_SUPPORT map

Same file. Add a new exported constant:

```typescript
export const EXECUTOR_KIND_FLAG_SUPPORT: Record<ExecutorKind, readonly (keyof ExecutorConfig)[]> = {
  native: [],
  'cli-codex': ['model', 'reasoningEffort', 'serviceTier', 'sandboxMode', 'timeoutSeconds'],
  'cli-copilot': ['model', 'timeoutSeconds'],
  'cli-gemini': ['model', 'sandboxMode', 'timeoutSeconds'],
  'cli-claude-code': ['model', 'reasoningEffort', 'sandboxMode', 'timeoutSeconds'],
};
```

Place it after the `executorConfigSchema` declaration but before the `parseExecutorConfig` function.

### T-CFG-06 — Add per-kind flag compatibility validator

Inside `parseExecutorConfig`, after the Zod parse and after the existing "cli-codex requires model" check, add a new validator block:

```typescript
const supportedFlags = EXECUTOR_KIND_FLAG_SUPPORT[config.kind];
const unsupportedFields: string[] = [];
const allOptionalFields: (keyof ExecutorConfig)[] = ['model', 'reasoningEffort', 'serviceTier', 'sandboxMode', 'timeoutSeconds'];
for (const field of allOptionalFields) {
  if (!supportedFlags.includes(field) && config[field] !== null && !(field === 'timeoutSeconds' && config[field] === 900)) {
    unsupportedFields.push(field);
  }
}
if (unsupportedFields.length > 0) {
  throw new ExecutorConfigError({
    issues: unsupportedFields.map((field) => ({
      path: [field],
      message: `field '${field}' is not supported by executor kind '${config.kind}'. Supported fields for ${config.kind}: ${supportedFlags.length ? supportedFlags.join(', ') : 'none'}.`,
    })),
  });
}
```

Notes:
- The `timeoutSeconds === 900` check preserves the default (900) as "not explicitly set" so users don't trip the validator just by letting the default flow through.
- For `native`, every non-null non-default field is unsupported. Users passing `kind: native, model: 'foo'` will get a clear rejection.

### T-CFG-07 — Add cli-gemini model whitelist

Same file. Add the constant:

```typescript
export const GEMINI_SUPPORTED_MODELS = ['gemini-3.1-pro-preview'] as const;
export type GeminiSupportedModel = typeof GEMINI_SUPPORTED_MODELS[number];
```

In `parseExecutorConfig`, after the flag-compatibility validator, add:

```typescript
if (config.kind === 'cli-gemini' && config.model !== null && !GEMINI_SUPPORTED_MODELS.includes(config.model as GeminiSupportedModel)) {
  throw new ExecutorConfigError({
    issues: [{
      path: ['model'],
      message: `model '${config.model}' is not a supported cli-gemini model. Supported: ${GEMINI_SUPPORTED_MODELS.join(', ')}.`,
    }],
  });
}
```

### T-CFG-08 — Update executor-config.vitest.ts

**File**: `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/executor-config.vitest.ts`

Changes required:

1. **Remove** assertions that cli-copilot, cli-gemini, cli-claude-code throw `ExecutorNotWiredError`. Those tests currently say: `expect(() => parseExecutorConfig({ kind: 'cli-copilot', model: 'copilot-x' })).toThrow(ExecutorNotWiredError);`. Replace each with an acceptance test.

2. **Add** acceptance cases (each its own `it()`):
   - `parseExecutorConfig({ kind: 'cli-copilot', model: 'gpt-5.4' })` returns a valid config with kind 'cli-copilot'.
   - `parseExecutorConfig({ kind: 'cli-gemini', model: 'gemini-3.1-pro-preview' })` returns a valid config.
   - `parseExecutorConfig({ kind: 'cli-claude-code', model: 'claude-opus-4-6' })` returns a valid config.
   - `parseExecutorConfig({ kind: 'cli-claude-code', model: 'claude-opus-4-6', reasoningEffort: 'high' })` returns a valid config (claude-code supports reasoningEffort).

3. **Add** rejection cases for unsupported-flag-for-kind combinations:
   - `{ kind: 'cli-gemini', model: 'gemini-3.1-pro-preview', serviceTier: 'fast' }` → throws `ExecutorConfigError` naming `serviceTier` as unsupported for `cli-gemini`.
   - `{ kind: 'cli-copilot', model: 'gpt-5.4', reasoningEffort: 'high' }` → throws `ExecutorConfigError` naming `reasoningEffort` as unsupported for `cli-copilot`.
   - `{ kind: 'cli-copilot', model: 'gpt-5.4', serviceTier: 'fast' }` → throws for `serviceTier`.
   - `{ kind: 'cli-claude-code', model: 'claude-opus-4-6', serviceTier: 'fast' }` → throws for `serviceTier`.
   - `{ kind: 'native', model: 'foo' }` → throws naming `model` as unsupported for `native`.

4. **Add** gemini model whitelist rejection:
   - `{ kind: 'cli-gemini', model: 'gemini-ultra-foo' }` → throws `ExecutorConfigError` naming `model` and listing supported models.
   - `{ kind: 'cli-gemini', model: 'gemini-3.1-pro-preview' }` → accepts (sanity).

5. **Keep** all existing tests that don't reference the 3-kinds-not-wired behavior. The native / cli-codex / missing-model / unknown-enum / invalid-reasoningEffort / invalid-serviceTier / invalid-timeout / default / resolveExecutorConfig tests all remain.

Expected total after changes: ~28 tests (16 original minus 3 removed plus ~15 new).

## Invariants

- Do NOT modify any file outside `executor-config.ts` and `executor-config.vitest.ts`.
- Preserve all Phase 018 exports (`ExecutorKind`, `ExecutorConfig`, `parseExecutorConfig`, `resolveExecutorConfig`, `ExecutorNotWiredError`, `ExecutorConfigError`, `executorConfigSchema`, `EXECUTOR_KINDS`, `REASONING_EFFORTS`, `SERVICE_TIERS`). The `ExecutorNotWiredError` class is preserved as a type even though it's no longer thrown in this file.
- New exports: `EXECUTOR_KIND_FLAG_SUPPORT`, `GEMINI_SUPPORTED_MODELS`, `GeminiSupportedModel`.
- Do not use `any` or `unknown as X` casts.

## Verification

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server
npx tsc --noEmit --composite false -p tsconfig.json 2>&1 | tail -15
npx vitest run tests/deep-loop/ 2>&1 | tail -10
```

Expected: tsc clean; all 4 vitest files green; total test count should go from 40 to ~52 (16→~28 in executor-config.vitest.ts; other 3 files unchanged at 11+8+5=24).

Fix any type errors before reporting done.

## Output format (final line)

```
PHASE_019A_STATUS: [OK | FAIL]
FILES_TOUCHED: <list>
TSC_RESULT: [pass | fail]
VITEST_RESULT: [<n>/<m> passed]
EXECUTOR_NOT_WIRED_USAGE: [still exported as type | removed entirely]
NEXT_STEPS: <any follow-ups>
```
