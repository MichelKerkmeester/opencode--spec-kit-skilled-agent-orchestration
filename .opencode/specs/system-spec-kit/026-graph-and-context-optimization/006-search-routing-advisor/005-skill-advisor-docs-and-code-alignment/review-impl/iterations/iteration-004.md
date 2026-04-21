# Iteration 004 - Testing

## Prior State Read

Read state, registry, and iterations 001-003. Dimension coverage before this pass: correctness, security, robustness covered; testing open.

## Verification

- Re-ran scoped vitest: 19 files, 155 tests passed.
- Read the scoped tests for subprocess parsing, Codex hook policy, Codex prompt wrapper, Copilot hook output, shared payload advisor metadata, and advisor observability.

## Findings

### P1-TST-001 - Codex hook policy tests encode the fallback-suppression bug instead of guarding hook registration

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/tests/codex-hook-policy.vitest.ts:86` defines a test named `returns live when version is valid even if a hooks-list probe would fail`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/codex-hook-policy.vitest.ts:90` to `.opencode/skill/system-spec-kit/mcp_server/tests/codex-hook-policy.vitest.ts:98` exercises `detectCodexHookPolicy` with a version-only success path.
- `.opencode/skill/system-spec-kit/mcp_server/tests/codex-hook-policy.vitest.ts:101` asserts `policy.hooks` is `live`.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:116` to `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:119` rely on that policy to suppress wrapper fallback for anything other than `unavailable`.

Expected: tests should prove that prompt-wrapper fallback remains active unless native hook registration is actually present and usable.

Actual: the regression test locks in `live` for valid settings plus version success, even when another hook probe would fail. That test would reject the remediation needed for P1-COR-002.

Severity: P1 testing. The test suite is not just missing an edge case; it asserts the wrong production branch.

### P1-TST-002 - Numeric-boundary tests do not cover non-finite subprocess scores or diagnostic telemetry

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-subprocess.vitest.ts:101` to `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-subprocess.vitest.ts:112` cover string-valued `confidence`, but not `Infinity`, `-Infinity`, or unit-interval violations.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-observability.vitest.ts:66` to `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-observability.vitest.ts:89` assert a normal diagnostic JSONL round trip, but do not parse a non-finite serialized record or assert finite telemetry.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts:116` and `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts:119` are the uncovered parser checks.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:245` and `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:250` are the uncovered diagnostic checks.

Expected: boundary parsers and JSONL telemetry serializers should have explicit tests for `NaN`, `Infinity`, `-Infinity`, and out-of-range finite values.

Actual: the current scoped suite passes while both numeric-boundary implementation defects remain present.

Severity: P1 testing. These are boundary contracts in prompt-time hook code, and the missing tests allow malformed runtime data to become routing or telemetry defects.

## Ruled Out

- The scoped suite is broader than the implementation summary's recorded "118 tests"; current run reports 155 tests. That historical count drift was not treated as a code finding.

## Churn

Net-new findings this iteration: P1=2. Severity-weighted new-findings ratio: 0.29.
