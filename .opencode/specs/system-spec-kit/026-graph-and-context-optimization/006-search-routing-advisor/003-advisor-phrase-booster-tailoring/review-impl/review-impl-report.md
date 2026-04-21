# Implementation Review Report

## 1. Executive Summary

Verdict: CONDITIONAL.

Counts: P0=0, P1=5, P2=1. Confidence: high for the reproduced routing failures and coverage gaps. The production code passes existing scoped tests, but the phrase-booster implementation still has several user-visible routing defects that current tests do not lock down.

## 2. Scope

Audited live code corresponding to the packet's claimed files. The packet references the old `.opencode/skill/skill-advisor/...` paths; git history shows commit `106d394ca0` moved them into `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/...`.

Code and test files audited:

| File | Role |
| --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py` | Live advisor implementation |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Packet fixture data |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py` | Regression harness |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-corpus-parity.vitest.ts` | Scoped Vitest parity |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts` | Scoped Vitest parity |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py` | Adjacent Python test context |

Not reviewed: spec-doc or metadata drift from the prior `review/` pass.

## 3. Method

Ran git history checks:

- `git log --oneline -- .opencode/skill/skill-advisor/scripts/skill_advisor.py ...`
- `git show --stat --oneline 678bd9bf52`
- `git show --name-status --find-renames 106d394ca0`

Ran verification:

- Scoped Vitest command ran once per iteration, 10/10 green. Each run passed 2 files / 3 tests.
- Python regression harness passed: 104/104 evaluations, pass_rate=1.0, p0_pass_rate=1.0, top1_accuracy=1.0.
- Python syntax check passed with `PYTHONPYCACHEPREFIX=/tmp/codex-pycache`.

Used `rg`, `git show`, line-numbered reads, and direct advisor invocations to reproduce routing behavior.

## 4. Findings By Severity

### P0

| ID | Finding | Evidence |
| --- | --- | --- |
| None | No P0 findings. | N/A |

### P1

| ID | Dimension | Finding | Required code evidence |
| --- | --- | --- | --- |
| F-001 | correctness | Deep-review phrase boosters still lose primary rank to sk-code-review on several review-loop prompts. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1536`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1541`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2524`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2849` |
| F-002 | correctness | `proposal-only` remains below the default threshold and returns no normal recommendation. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1623`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1635`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:3021` |
| F-003 | robustness | Raw substring matching makes short phrase boosters fire inside unrelated words. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1509`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1510`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2701` |
| F-004 | robustness | Regex-looking phrase keys are treated literally and miss common how-is/how-does prompts. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1524`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1525`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2701` |
| F-005 | testing | New coverage is happy-path only and does not lock failing ranking/boundary/threshold cases. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py:148`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py:154`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2701` |

### P2

| ID | Dimension | Finding | Required code evidence |
| --- | --- | --- | --- |
| F-006 | testing | Scoped Vitest parity tests do not consume the packet-local JSONL fixture. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-corpus-parity.vitest.ts:35`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts:33` |

## 5. Findings By Dimension

Correctness: F-001, F-002.

Security: no findings. Phrase matching changes do not add command execution, path traversal, auth, secret, or deserialization exposure.

Robustness: F-003, F-004.

Testing: F-005, F-006.

## 6. Adversarial Self-Check For P0

No P0 findings were identified.

P0 challenge attempts:

- Injection: phrase table values are static tuples and do not execute user prompt text.
- Traversal: the phrase matcher does not open user-controlled paths.
- Crash path: tested target prompts did not crash advisor; failures are wrong/no recommendation, not exceptions.
- Wrong semantics: several P1 wrong-routing paths are reproducible, but they do not rise to P0 data-loss/security/crash severity.

## 7. Remediation Order

1. Fix F-001 by extending deep-review disambiguation or ranking so explicit `auto review audit`, `auto review security audit`, `release readiness review`, and `review convergence` route to sk-deep-review as primary.
2. Fix F-003 by replacing raw substring phrase checks with token-boundary or phrase-boundary matching, with explicit exceptions for slash/path-like markers.
3. Fix F-004 by replacing regex-looking phrase keys with actual supported matching semantics or concrete phrase variants.
4. Fix F-002 by raising `proposal-only` weight or adding stronger natural phrase variants so the normal default threshold passes.
5. Add tests for F-001 through F-004.
6. Decide whether Vitest should wrap `skill_advisor_regression_cases.jsonl` directly, or document Python regression as the authoritative fixture runner.

## 8. Test Additions Needed

Add regression rows or tests for:

- `auto review audit` -> sk-deep-review top-1.
- `auto review security audit` -> sk-deep-review top-1.
- `release readiness review` -> sk-deep-review top-1.
- `review convergence` -> sk-deep-review top-1.
- `proposal-only candidate evaluation` -> sk-improve-agent passes default threshold.
- `barcode search issue`, `decode search behavior`, `precode search cleanup` -> no mcp-coco-index phrase false positive.
- `how is auth implemented`, `how does router work` -> mcp-coco-index passes default threshold.

## 9. Appendix: Iteration List And Churn

| Iteration | Dimension | New findings | Churn | Vitest |
| --- | --- | --- | --- | --- |
| 001 | correctness | F-001, F-002 | 0.50 | passed |
| 002 | security | none | 0.00 | passed |
| 003 | robustness | F-003, F-004 | 0.33 | passed |
| 004 | testing | F-005, F-006 | 0.25 | passed |
| 005 | correctness | none | 0.08 | passed |
| 006 | security | none | 0.06 | passed |
| 007 | robustness | none | 0.06 | passed |
| 008 | testing | none | 0.04 | passed |
| 009 | correctness | none | 0.03 | passed |
| 010 | security | none | 0.02 | passed |

Artifact index:

- `review-impl/deep-review-impl-config.json`
- `review-impl/deep-review-impl-state.jsonl`
- `review-impl/deep-review-impl-findings-registry.json`
- `review-impl/iterations/iteration-001.md` through `iteration-010.md`
- `review-impl/deltas/iter-001.jsonl` through `iter-010.jsonl`
- `review-impl/review-impl-report.md`
