# Iteration 001 - Correctness

Focus dimension: correctness

Files reviewed:
- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `implementation-summary.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`

## Findings

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| F001 | P1 | Regression command in the packet omits required `--dataset`, so the documented REQ-003/T001/T020 command does not execute against the current harness. | `skill_advisor_regression.py:8`, `skill_advisor_regression.py:242`, `spec.md:122`, `tasks.md:54`, `tasks.md:80` |
| F002 | P1 | REQ-001 verification evidence scans stale line ranges and does not include the current `INTENT_BOOSTERS` block. | `spec.md:120`, `plan.md:85`, `plan.md:120`, `scratch/phrase-boost-delta.md:102`, `skill_advisor.py:1154`, `skill_advisor.py:1418` |
| F003 | P1 | REQ-010/CHK-032 claims five uplift-style validations, but four measured rows are high-confidence holds with `+0.00`, not uplifts or NONE-to-match recoveries. | `spec.md:130`, `tasks.md:82`, `checklist.md:84`, `scratch/phrase-boost-delta.md:88-92` |

## Adjudication

- F001: Confirmed. Counterevidence sought: current harness invocation with explicit `--dataset`; it exits 0, so the implementation is healthy but the documented command is stale. Final severity P1.
- F002: Confirmed. Counterevidence sought: AST inspection of the current dicts; it shows zero whitespace/hyphen keys, so this is evidence invalidity rather than implementation failure. Final severity P1.
- F003: Confirmed. Alternative explanation: the spec may have intended "meet threshold" rather than "uplift"; checklist wording uses uplift/NONE-to-match. Final severity P1.

newFindingsRatio: 0.58
