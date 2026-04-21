# Iteration 001 - Correctness

## Scope Read

Audited the production TypeScript files claimed by `implementation-summary.md`, with current-path mapping for advisor files migrated by `1146faeecc`:

- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/generation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/normalize-adapter-output.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts`

## Verification

- Git history checked for the scoped files. Relevant commits include `c131f4cf2` (Phase 022 alignment), `1146faeecc` (advisor lib migration), `106d394ca` (self-contained skill-advisor consolidation), and `9810ad65d5` (hook-parity remediation).
- Scoped vitest command passed: 19 files, 155 tests.
- CocoIndex semantic search was attempted via CLI and MCP; CLI failed on sandboxed daemon log access, MCP call was unavailable/cancelled. Direct `rg`, `nl`, and test reads were used for this iteration.

## Findings

### P1-COR-001 - Subprocess recommendation parser accepts non-finite scores despite declaring a finite-number contract

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts:116` checks `confidence` with `Number.isNaN(item.confidence)` rather than `Number.isFinite`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts:119` applies the same `Number.isNaN` check to `uncertainty`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts:125` and `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts:126` then persist those unchecked numeric values into the recommendation.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-subprocess.vitest.ts:101` only covers a string-valued confidence schema failure, not `Infinity`, `-Infinity`, or out-of-range finite values.

Expected: subprocess stdout values for `confidence` and `uncertainty` should be finite unit-interval numbers before downstream threshold decisions or rendering.

Actual: `Infinity` passes the current validator because it is a number and `Number.isNaN(Infinity)` is false. This can make a malformed child process recommendation pass confidence gates in downstream code that compares `recommendation.confidence >= 0.8`.

Severity: P1 correctness. The Python subprocess is a boundary; malformed numeric output can change routing semantics instead of failing open.

### P1-COR-002 - Codex prompt wrapper suppresses fallback injection whenever any valid settings JSON exists

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:219` resolves the settings path.
- `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:220` treats parseable JSON as `settingsValid`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:222` maps any parseable settings file to `hooks: 'live'`.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:116` to `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:119` returns `{}` whenever `policy.hooks !== 'unavailable'`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/codex-hook-policy.vitest.ts:86` explicitly preserves the behavior that a version success plus valid settings means `live` even if a hypothetical hooks-list probe would fail.

Expected: the wrapper fallback should only suppress wrapping when native Codex user-prompt hooks are actually registered and usable.

Actual: any valid `.codex/settings.json`, including `{}`, makes the policy `live`; the prompt wrapper then exits without injecting advisor context. A repo with Codex settings unrelated to hooks can silently lose advisor guidance.

Severity: P1 correctness. This is wrong branch selection in the fallback path and can disable the intended primary behavior under common configuration.

## Ruled Out

- `generation.ts` malformed-counter recovery is intentionally mutating on read and is covered by freshness tests; no correctness finding in this pass.
- `normalize-adapter-output.ts` preserves empty JSON hook outputs as no context; that matches adapter parity tests and is not a correctness defect by itself.

## Churn

Net-new findings this iteration: P1=2. Severity-weighted new-findings ratio: 1.00.
