# Implementation Deep Review Report

## 1. Executive summary

Verdict: CONDITIONAL.

Counts: P0=0, P1=4, P2=2. Confidence: high. The production implementation is broadly test-backed, and the scoped advisor suite passed 10/10 runs, but four P1 implementation issues remain in routing correctness, freshness detection, and regression coverage.

No P0 crash, data-loss, or direct injection path was found.

## 2. Scope

This pass audited production/test code, not spec docs. The packet has no `implementation-summary.md`; `graph-metadata.json` listed stale paths under `.opencode/skill/skill-advisor/`, so the review followed git history and the current relocated package under `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/`.

Code files audited:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_runtime.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/python-compat.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/skill-graph-db.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-status.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/daemon-freshness-foundation.vitest.ts`

Runtime config audited:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill-graph.json`

## 3. Method

Iterations rotated dimensions as requested: correctness, security, robustness, testing, then repeat.

Vitest command run at each iteration:
`cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run skill-advisor/tests/compat/shim.vitest.ts skill-advisor/tests/compat/python-compat.vitest.ts skill-advisor/tests/parity/python-ts-parity.vitest.ts skill-advisor/tests/skill-graph-db.vitest.ts skill-advisor/tests/handlers/advisor-recommend.vitest.ts skill-advisor/tests/handlers/advisor-status.vitest.ts skill-advisor/tests/handlers/advisor-validate.vitest.ts skill-advisor/tests/daemon-freshness-foundation.vitest.ts --reporter=default`

Result: 10/10 runs passed. Each run reported 8 test files and 54 tests passed.

Git log checked for implementation history, including:
- `106d394ca0 refactor: consolidate skill-advisor into self-contained mcp_server/skill-advisor/`
- `90be50b9e test(skill-advisor): execute all 47 scenarios - 47/47 PASS`
- `d7d338c0a2 feat: prevent skill-owned workflow bypass`

## 4. Findings by severity

| Severity | ID | Finding | Required code evidence |
| --- | --- | --- | --- |
| P1 | IMPL-F001 | Semantic-hit attribution maps nested skill-advisor paths to system-spec-kit. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1846`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1967`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2084` |
| P1 | IMPL-F002 | Iteration-loop tiebreaker misses the actual deep-review command bridge. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1670`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2624`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2849` |
| P1 | IMPL-F003 | Freshness probe does not fingerprint nested skill-advisor graph metadata. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts:103`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts:156`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:82` |
| P1 | IMPL-F006 | Tests do not pin local fallback semantic attribution for nested package paths. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1967`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts:89`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts:74` |
| P2 | IMPL-F004 | Fallback graph load can write `skill-graph.json` during a read-only advisor call. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:744`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:746`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:815` |
| P2 | IMPL-F005 | Optional semantic lookup executes PATH-resolved `ccc` without provenance checks. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1994`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2015`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2117` |

## 5. Findings by dimension

Correctness:
- IMPL-F001: nested package semantic attribution is wrong.
- IMPL-F002: deep-review loop tiebreaker misses the actual command bridge and can leave a CLI executor ranked first.

Security:
- IMPL-F005: no direct command injection found, but PATH-resolved `ccc` provenance is weak for hook-time execution.

Robustness:
- IMPL-F003: freshness can be falsely live for nested skill-advisor graph metadata changes.
- IMPL-F004: read-path graph fallback can write to the repo.

Testing:
- IMPL-F006: current tests miss the local fallback semantic-hit nested path case.

## 6. Adversarial self-check for P0

No P0 findings were retained.

Potential P0 candidates considered and rejected:
- Shell injection through `ccc search`: rejected because subprocess invocation uses argv arrays, not shell expansion, and has a timeout at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2015`.
- Prompt injection through native labels: rejected because `_sanitize_native_label` strips instruction-shaped labels before legacy output at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:204`.
- Native bridge prompt leakage: scoped tests assert no prompt leakage in `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts:57`.

Reproduced non-P0 correctness bug:
`python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py "advisor route me" --force-local --semantic-hits '[{"path":".opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py","score":0.95}]' --threshold 0.5 --show-rejections` returned `system-spec-kit`, but expected `skill-advisor`.

## 7. Remediation order

1. Fix semantic path resolution for nested skill packages. Add explicit mapping for `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/` to `skill-advisor`, and keep ordinary `.opencode/skill/<skill>/` behavior.
2. Fix the iteration-loop tiebreaker to recognize `command-spec-kit-deep-review` and `command-spec-kit-deep-research`, and apply ordering in a way that survives kind-priority sorting.
3. Include nested skill-advisor `graph-metadata.json` in freshness fingerprints and mtime checks.
4. Replace prompt-time `--export-json` auto-compile with explicit setup guidance or an in-memory compile fallback.
5. Harden `ccc` discovery by defaulting to repo-local only in hook contexts, or record/validate the external binary provenance.

## 8. Test additions needed

Add tests for:
- `--force-local --semantic-hits` with a nested skill-advisor path, expecting `skill-advisor`.
- `use cli-copilot for 10 iterations of deep-review`, expecting the skill-owned deep-review path to beat the CLI executor.
- Freshness status when `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/graph-metadata.json` is newer than SQLite.
- Missing SQLite/JSON graph artifacts in read-only mode, verifying no file write is attempted by a normal advisor call.
- PATH fallback behavior for `ccc`, at least asserting provenance metadata or disabled behavior when repo-local `ccc` is absent.

## 9. Appendix: iteration list + churn

| Iteration | Dimension | New findings | Churn | Vitest |
| --- | --- | --- | --- | --- |
| 001 | correctness | IMPL-F001 | 1.00 | passed |
| 002 | security | IMPL-F005 | 0.1667 | passed |
| 003 | robustness | IMPL-F003 | 0.4545 | passed |
| 004 | testing | IMPL-F006 | 0.3125 | passed |
| 005 | correctness | IMPL-F002 | 0.2381 | passed |
| 006 | security | none | 0.06 | passed |
| 007 | robustness | IMPL-F004 | 0.06 | passed |
| 008 | testing | none | 0.06 | passed |
| 009 | correctness | none | 0.06 | passed |
| 010 | security | none | 0.04 | passed |

Stop reason: max iterations reached.
