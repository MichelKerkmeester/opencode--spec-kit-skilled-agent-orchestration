# Implementation Deep Review Report

## 1. Executive summary

Verdict: CONDITIONAL.

The implementation audit found no P0 blockers, but it did find 7 P1 required fixes and 3 P2 advisories in the production hook/advisor code and scoped tests. Confidence is high for the Codex fallback and numeric-boundary findings because they are line-evident in production code and the current scoped vitest suite passes while preserving the risky behavior.

Counts:

| Severity | Count |
|---|---:|
| P0 | 0 |
| P1 | 7 |
| P2 | 3 |

## 2. Scope

Audited production code files claimed by `implementation-summary.md`; spec docs were read only to derive scope and were not reviewed for doc drift.

| Code file audited | Note |
|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` | Current scoped file |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/generation.ts` | Moved from old `lib/skill-advisor/generation.ts` path |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts` | Moved from old `lib/skill-advisor/subprocess.ts` path |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts` | Moved from old `lib/skill-advisor/metrics.ts` path |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/normalize-adapter-output.ts` | Moved from old `lib/skill-advisor/normalize-adapter-output.ts` path |
| `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts` | Current scoped file |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts` | Current scoped file |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts` | Current scoped file |

Production code files audited: 8. Test files used as code evidence where relevant: 7.

## 3. Method

- Ran 10 iterations rotating correctness, security, robustness, testing, then repeating through iteration 010.
- Re-ran the scoped vitest command each iteration; all 10 runs passed with 19 files and 155 tests.
- Checked git history for implementation context; relevant commits include `c131f4cf2`, `1146faeecc`, `106d394ca`, and `9810ad65d5`.
- Used `rg`, `rg --files`, `git log`, and line-numbered file reads to verify code layout and line evidence.
- Attempted CocoIndex semantic search via CLI and MCP. CLI was blocked by sandbox access to `~/.cocoindex_code/daemon.log`; MCP invocation was unavailable/cancelled, so direct code search was used.

## 4. Findings by severity

### P0

None.

### P1

| ID | Dimension | Finding | Required code evidence |
|---|---|---|---|
| P1-COR-001 | correctness | Subprocess recommendation parser accepts non-finite scores despite declaring a finite-number contract. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts:116`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts:119` |
| P1-COR-002 | correctness | Codex prompt wrapper suppresses fallback injection whenever any valid settings JSON exists. | `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:220`, `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:222`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:118` |
| P1-COR-003 | correctness | Codex prompt wrapper also suppresses fallback when hook policy is `partial`. | `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:16`, `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:222`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:118` |
| P1-SEC-001 | security | Codex fallback wraps advisor text inside an HTML comment without escaping comment terminators. | `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:104`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:178` |
| P1-ROB-001 | robustness | Diagnostic serialization accepts non-finite duration/generation values that JSON converts to `null`. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:223`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:245`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:254` |
| P1-TST-001 | testing | Codex hook policy tests encode the fallback-suppression bug instead of guarding hook registration. | `.opencode/skill/system-spec-kit/mcp_server/tests/codex-hook-policy.vitest.ts:86`, `.opencode/skill/system-spec-kit/mcp_server/tests/codex-hook-policy.vitest.ts:101`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:116` |
| P1-TST-002 | testing | Numeric-boundary tests do not cover non-finite subprocess scores or diagnostic telemetry. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-subprocess.vitest.ts:101`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-observability.vitest.ts:66`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts:116`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:245` |

### P2

| ID | Dimension | Finding | Required code evidence |
|---|---|---|---|
| P2-SEC-002 | security | Hook diagnostics accept unsanitized skill labels into stderr JSONL. | `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:126`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:227`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:249` |
| P2-ROB-002 | robustness | Subprocess stdin write/end failures are outside the fail-open result path. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts:167`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts:168`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts:182` |
| P2-TST-003 | testing | Codex prompt-wrapper tests cover live/unavailable policy states but omit `partial`. | `.opencode/skill/system-spec-kit/mcp_server/tests/codex-prompt-wrapper.vitest.ts:18`, `.opencode/skill/system-spec-kit/mcp_server/tests/codex-prompt-wrapper.vitest.ts:29`, `.opencode/skill/system-spec-kit/mcp_server/tests/codex-prompt-wrapper.vitest.ts:68`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:118` |

## 5. Findings by dimension

| Dimension | Findings |
|---|---|
| correctness | P1-COR-001, P1-COR-002, P1-COR-003 |
| security | P1-SEC-001, P2-SEC-002 |
| robustness | P1-ROB-001, P2-ROB-002 |
| testing | P1-TST-001, P1-TST-002, P2-TST-003 |

## 6. Adversarial self-check for P0

No P0 findings were raised.

P0 challenge checks:

| Candidate area | Why not P0 |
|---|---|
| Subprocess non-finite scores | Wrong routing semantics are possible, but the Python subprocess is local and malformed output is required. Classified P1. |
| Codex fallback suppression | Advisor guidance can be omitted in valid configurations, but this does not directly cause crash, data loss, or auth bypass. Classified P1. |
| Codex HTML comment boundary | Prompt-boundary injection risk exists if advisor text contains a comment terminator, but no direct secret exfiltration or tool execution path was proven. Classified P1. |
| Diagnostic telemetry non-finite values | Can corrupt diagnostics JSONL but not production data. Classified P1. |

## 7. Remediation order

1. Fix Codex fallback policy semantics: validate actual native hook registration and decide explicitly how `partial` should behave before suppressing prompt-wrapper fallback.
2. Replace `Number.isNaN` numeric boundary checks with finite unit-interval validation in subprocess recommendation parsing.
3. Escape or replace the Codex wrapper HTML-comment delimiter so advisor text cannot close its boundary.
4. Enforce finite telemetry in `createAdvisorHookDiagnosticRecord` and `validateAdvisorHookDiagnosticRecord`.
5. Sanitize or omit diagnostic `skillLabel` values using the same label guard as model-visible rendering.
6. Wrap child stdin write/end in the subprocess fail-open path.
7. Update tests after each fix, especially the tests currently encoding the wrong Codex policy behavior.

## 8. Test additions needed

| Test file | Additions |
|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/tests/codex-hook-policy.vitest.ts` | Assert hook registration shape, not just parseable settings JSON; remove the expectation that hook-list failure can still be `live`. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/codex-prompt-wrapper.vitest.ts` | Add `partial` policy fixture; assert fallback behavior; add advisor brief containing `-->` or equivalent delimiter attack. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-subprocess.vitest.ts` | Add `Infinity`, `-Infinity`, out-of-range confidence, and out-of-range uncertainty cases. Add stdin write/end failure case. |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-observability.vitest.ts` | Add finite validation for `durationMs` and `generation`, and assert serialized JSON parses back into a valid diagnostic record. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts` | Add diagnostic label sanitization/omission coverage for instruction-shaped labels. |

## 9. Appendix: iteration list and churn

| Iteration | Dimension | New findings | Ratio | Churn |
|---:|---|---|---:|---:|
| 001 | correctness | P1=2 | 1.00 | 1.00 |
| 002 | security | P1=1, P2=1 | 0.60 | 0.60 |
| 003 | robustness | P1=1, P2=1 | 0.38 | 0.38 |
| 004 | testing | P1=2 | 0.29 | 0.29 |
| 005 | correctness | P1=1 | 0.13 | 0.13 |
| 006 | security | none | 0.00 | 0.00 |
| 007 | robustness | none | 0.00 | 0.00 |
| 008 | testing | P2=1 | 0.02 | 0.02 |
| 009 | correctness | none | 0.00 | 0.00 |
| 010 | security | none | 0.00 | 0.00 |

Artifact set:

- `review-impl/deep-review-impl-config.json`
- `review-impl/deep-review-impl-state.jsonl`
- `review-impl/deep-review-impl-findings-registry.json`
- `review-impl/iterations/iteration-001.md` through `iteration-010.md`
- `review-impl/deltas/iter-001.jsonl` through `iter-010.jsonl`
- `review-impl/review-impl-report.md`
