# Implementation Deep Review Report

## 1. Executive summary

Verdict: CONDITIONAL.

Counts: P0 = 0, P1 = 5, P2 = 1.

Confidence: high for the cited implementation issues. The audit focused on actual production and test code, not spec-doc drift.

The scoped vitest command passed on all 10 iterations: `2 files / 11 tests`.

## 2. Scope

Code files audited:

| File | Role |
|------|------|
| `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts` | Static corpus measurement and route prediction |
| `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts` | Observe-only live runtime wrapper |
| `.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts` | Compliance JSONL analyzer |
| `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-measurement.vitest.ts` | Measurement tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-analyze.vitest.ts` | Analyzer tests |

Spec docs were read only to identify scope. Findings below cite code files.

## 3. Method

Actions performed:

- Read `implementation-summary.md` and `graph-metadata.json` to derive the production-code scope.
- Read all five code files with line numbers.
- Checked git history for implementation commits: `d1a17353ee`, `9e982f366a`, `1146faeecc`.
- Used exact grep/glob checks for code layout and missing tests.
- Ran the scoped vitest command once per iteration:
  `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/smart-router-measurement.vitest.ts tests/smart-router-analyze.vitest.ts --reporter=default`
- Attempted memory/CocoIndex context retrieval; the tool layer cancelled those MCP calls, so the audit used direct file evidence and command output.

## 4. Findings by severity

### P0

No P0 findings.

### P1

| ID | Dimension | Finding | Code evidence |
|----|-----------|---------|---------------|
| F-001 | correctness | Static router parser marks shipped router styles as unknown | `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:285`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:477`, `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-measurement.vitest.ts:60` |
| F-002 | security | Skill names are joined into filesystem paths without containment validation | `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:475`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:418`, `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:125` |
| F-003 | robustness | Observe-only wrapper can throw during configure | `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:118`, `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:125`, `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:156` |
| F-004 | correctness | Analyzer collapses records by promptId alone | `.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:123`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:154`, `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-analyze.vitest.ts:75` |
| F-005 | testing | Live-session wrapper has no direct test coverage | `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:102`, `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:209`, `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:217` |

### P2

| ID | Dimension | Finding | Code evidence |
|----|-----------|---------|---------------|
| F-006 | robustness | CLI limit parsing accepts NaN and negative values silently | `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:597`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:755` |

## 5. Findings by dimension

Correctness:

- F-001: static router prediction returns `UNKNOWN` for shipped router styles, distorting route metrics.
- F-004: analyzer merges records solely by `promptId`, losing cross-session or cross-skill records.

Security:

- F-002: selected skill values are used as filesystem path segments without containment checks.

Robustness:

- F-003: configure path can throw even though the integration is intended to be observe-only.
- F-006: CLI `--limit` has weak validation.

Testing:

- F-005: live wrapper path lacks direct tests.
- F-001 and F-004 also need regression tests for the reproduced misses.

## 6. Adversarial self-check for P0

No P0 finding was registered.

P1 reproduction checks:

- F-001: read-only execution of `predictSmartRouterRoute()` for `sk-code-opencode` returned `variant: "unknown"`, `unknown: true`, and `allowedResourceCount: 0`.
- F-003: read-only execution of `configureSmartRouterSession()` with malformed `selectedSkill` threw a Node path type error.
- F-004: read-only execution of `analyzeTelemetryRecords()` with two records sharing `promptId` but different `selectedSkill` returned `totalRecords: 1` and attributed the row to only the first skill.

## 7. Remediation order

1. Fix F-002 and F-003 together: validate selected skill names as safe skill identifiers, constrain resolved paths under `.opencode/skill`, and make configure observe-only with a caught fallback record.
2. Fix F-001: support the shipped router styles currently classified as unknown, especially language-keyword routers and `INTENT_MODEL` routers without `LOAD_LEVELS`.
3. Fix F-004: collapse telemetry on a stable key that includes at least prompt id plus selected skill, and preferably session/run identity if available.
4. Add F-005 regression coverage for live wrapper configure/onToolCall/finalize behavior.
5. Fix F-006 with explicit finite positive integer validation and a clear CLI error.

## 8. Test additions needed

- `live-session-wrapper.vitest.ts`: configure with explicit route metadata, predicted route fallback, read normalization, cross-skill extra classification, finalize behavior, and malformed input not throwing.
- Measurement variant tests: `LANGUAGE_KEYWORDS`, `INTENT_MODEL` without `LOAD_LEVELS`, and unknown fallback.
- Analyzer collision tests: same prompt id with different selected skills, and same prompt id across simulated sessions if a session id is introduced.
- CLI limit test: reject `NaN`, decimals if unsupported, zero, and negative values.

## 9. Appendix: iteration list and churn

| Iteration | Dimension | New findings | Churn | Vitest |
|-----------|-----------|--------------|-------|--------|
| 001 | correctness | F-001 | 0.20 | PASS |
| 002 | security | F-002 | 0.20 | PASS |
| 003 | robustness | F-003 | 0.20 | PASS |
| 004 | testing | F-005 | 0.20 | PASS |
| 005 | correctness | F-004 | 0.20 | PASS |
| 006 | security | none | 0.00 | PASS |
| 007 | robustness | F-006 | 0.05 | PASS |
| 008 | testing | none | 0.00 | PASS |
| 009 | correctness | none | 0.00 | PASS |
| 010 | security | none | 0.00 | PASS |

Convergence note: all four requested dimensions were covered at least twice. The final three iterations had severity-weighted churn at or below 0.05, and no P0 findings were found.
