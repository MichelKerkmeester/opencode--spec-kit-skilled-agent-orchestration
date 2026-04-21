# Iteration 009 - Correctness Adversarial Recheck

## Prior State Read

Read state, registry, and iterations 001-008. Active findings entering this pass: P1=7, P2=3.

## Verification

- Re-ran scoped vitest: 19 files, 155 tests passed.
- Rechecked correctness findings against the current production line references after all prior audit reads.

## Findings

No new correctness findings survived the strict evidence rules in this iteration.

## Adversarial Recheck

- P1-COR-001: Still valid. `Number.isNaN` at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts:116` and `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts:119` does not reject `Infinity`.
- P1-COR-002: Still valid. Valid settings JSON maps to `live` at `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:222`, and the wrapper suppresses fallback at `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:118`.
- P1-COR-003: Still valid. `partial` is a declared policy state at `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:16`, but the wrapper does not branch on it.

## Ruled Out

- `shared-payload.ts` advisor metadata validation does reject out-of-range finite confidence/uncertainty values, so the non-finite issue remains scoped to subprocess parsing and diagnostic telemetry rather than shared-payload envelope coercion.
- `normalize-adapter-output.ts` normalization of empty JSON outputs remains aligned with tests and did not produce a separate correctness finding.

## Churn

Net-new findings this iteration: none. Severity-weighted new-findings ratio: 0.00.
