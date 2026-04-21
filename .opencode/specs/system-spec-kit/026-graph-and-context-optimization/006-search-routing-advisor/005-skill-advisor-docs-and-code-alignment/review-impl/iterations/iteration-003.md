# Iteration 003 - Robustness

## Prior State Read

Read state, registry, and iterations 001-002. Active findings entering this pass: P1=3, P2=1.

## Verification

- Re-ran scoped vitest: 19 files, 155 tests passed.
- Grep checked non-finite numeric handling across `metrics.ts`, `subprocess.ts`, tests, and related renderer code.
- Git log was rechecked for the current production paths.

## Findings

### P1-ROB-001 - Diagnostic serialization accepts non-finite duration/generation values that JSON converts to `null`

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:223` builds `durationMs` with `Math.max(0, Math.round(input.durationMs))`, which leaves `Infinity` as `Infinity`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:228` includes any numeric `generation`, including `Infinity`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:245` and `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:250` validate only `typeof === 'number'`, not `Number.isFinite`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:254` to `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:260` serialize the validated record with `JSON.stringify`.

Expected: diagnostic records should reject or clamp non-finite numeric telemetry before serialization.

Actual: a record with `durationMs: Infinity` passes validation, then `JSON.stringify` emits `"durationMs":null`. A consumer parsing the JSONL line receives a payload that fails the same validator and corrupts health telemetry.

Severity: P1 robustness. Bad runtime timing data can create self-invalid diagnostics while the serializer claims the record is valid.

### P2-ROB-002 - Subprocess stdin write/end failures are outside the fail-open result path

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts:167` writes the prompt to child stdin after spawn.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts:168` ends stdin.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts:182` handles child `error` events, but that does not cover synchronous exceptions from a destroyed or unsuitable stdin stream.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-subprocess.vitest.ts:201` covers child-process `error` events, not stdin write/end throws.

Expected: all child I/O failures should resolve to an `AdvisorSubprocessResult` with a fail-open error code.

Actual: a synchronous stdin stream error would reject/throw out of `runSpawnAttempt` instead of resolving through the established fail-open shape.

Severity: P2 robustness. It is an edge condition, but this hook path is explicitly designed to fail open instead of throwing through caller hooks.

## Ruled Out

- `metrics.ts` environment threshold parsing uses `Number.isFinite`, so non-finite alert env values fall back safely.
- `generation.ts` temp-file cleanup is best-effort but preserves the original write error, which is acceptable.

## Churn

Net-new findings this iteration: P1=1, P2=1. Severity-weighted new-findings ratio: 0.38.
