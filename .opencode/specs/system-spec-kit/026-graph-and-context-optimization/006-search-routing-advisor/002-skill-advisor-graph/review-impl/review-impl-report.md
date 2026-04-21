# Implementation Deep Review Report

## 1. Executive summary

Verdict: CONDITIONAL.

Counts: P0=0, P1=4, P2=2. Confidence: high.

The scoped vitest suite passed on all 10 iteration checkpoints, but the implementation still has production correctness and test-contract issues: advisor health is degraded in the current repo because the graph contains the internal `skill-advisor` node, and compiler validation exits 2 because zero-edge skills are treated as fatal. No P0 crash path, data-loss path, or security hole was found.

## 2. Scope

Audited code files only, not spec-doc drift.

Primary production files audited:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`

Scoped test files audited:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/skill-graph-db.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-status.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/scorer/native-scorer.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-corpus-parity.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-runtime-parity.vitest.ts`

Code-file count audited: 10.

## 3. Method

Read packet `implementation-summary.md` and `graph-metadata.json` only to identify claimed implementation scope. Findings below cite code files only.

Commands run:
- `git log --oneline --decorate --all -- <advisor files>` to understand implementation history.
- `rg --files` and `rg -n` across the advisor scripts/tests to verify code layout and assumptions.
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --health`.
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --validate-only`.
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py --validate-only`.
- 10 scoped vitest runs. Each run passed 7 files and 47 tests.

## 4. Findings by severity

### P0

None.

### P1

| ID | Dimension | Finding | Required code evidence |
| --- | --- | --- | --- |
| F-IMPL-001 | correctness | Health check degrades the current valid graph because `skill-advisor` is graph-only. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2957`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2958`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2966` |
| F-IMPL-002 | correctness | Compiler hard-fails zero-edge skills and currently rejects the repository graph. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:468`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:782`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:786` |
| F-IMPL-005 | testing | Tests do not cover healthy 20 routable skills plus one internal graph node. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py:144`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py:148`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py:151` |
| F-IMPL-006 | testing | Regression tests lock in orphan-skill fatal behavior that conflicts with current metadata. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py:1179`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py:1184`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py:1185` |

### P2

| ID | Dimension | Finding | Required code evidence |
| --- | --- | --- | --- |
| F-IMPL-003 | security | Local advisor output leaks internal graph scoring metadata (`_graph_boost_count`). | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2817`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2862`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2869` |
| F-IMPL-004 | robustness | Advisor read path can auto-write a generated JSON graph. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:744`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:746`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:750` |

## 5. Findings by dimension

Correctness:
- F-IMPL-001 [P1]
- F-IMPL-002 [P1]

Security:
- F-IMPL-003 [P2]
- No P0/P1 security issue found.

Robustness:
- F-IMPL-004 [P2]

Testing:
- F-IMPL-005 [P1]
- F-IMPL-006 [P1]

## 6. Adversarial self-check for P0

No P0 findings were opened.

Potential P0 candidates were checked and rejected:
- The degraded health result is a release/health-gate correctness issue, not a direct crash or data-loss path.
- The compiler exit 2 blocks validation but does not corrupt data.
- `_graph_boost_count` is internal metadata leakage, but I found no prompt text, secrets, or auth material in that field.

## 7. Remediation order

1. Fix F-IMPL-001: decide whether `skill-advisor` should be excluded from inventory parity or represented as an allowed internal graph node. Then make `--health` return `ok` for the intended 20+1 topology.
2. Fix F-IMPL-002 and F-IMPL-006 together: either add meaningful edges for `sk-deep-research` and `sk-git`, or change the compiler/test policy so intentional isolated skills do not fail validation.
3. Fix F-IMPL-005: add a health test for the real topology so F-IMPL-001 cannot regress.
4. Fix F-IMPL-003: remove `_graph_boost_count` from public local Python output, or explicitly move debug metadata behind a debug flag.
5. Fix F-IMPL-004: remove source-tree writes from `_load_skill_graph()` or gate auto-compile behind an explicit opt-in setup path.

## 8. Test additions needed

- Python health test: current 20 routable SKILL.md records plus graph-only `skill-advisor` should be accepted if that is the intended graph contract.
- Compiler validation test: assert the intended zero-edge policy against a fixture that represents intentionally standalone skills.
- Python local output shape test: assert no keys beginning with `_` are emitted by `analyze_prompt()` or CLI output.
- Loader side-effect test: simulate missing SQLite/JSON graph artifacts and assert ordinary advisor reads do not write to the source tree unless an opt-in flag is set.

## 9. Appendix: iteration list + churn

| Iteration | Dimension | New findings | Churn | Vitest |
| --- | --- | --- | --- | --- |
| 001 | correctness | F-IMPL-001, F-IMPL-002 | 0.46 | pass |
| 002 | security | F-IMPL-003 | 0.08 | pass |
| 003 | robustness | F-IMPL-004 | 0.11 | pass |
| 004 | testing | F-IMPL-005 | 0.18 | pass |
| 005 | correctness | F-IMPL-006 | 0.16 | pass |
| 006 | security | none | 0.00 | pass |
| 007 | robustness | none | 0.00 | pass |
| 008 | testing | none | 0.00 | pass |
| 009 | correctness | none | 0.00 | pass |
| 010 | security | none | 0.00 | pass |

Stop reason: max iterations reached with all four dimensions covered.
