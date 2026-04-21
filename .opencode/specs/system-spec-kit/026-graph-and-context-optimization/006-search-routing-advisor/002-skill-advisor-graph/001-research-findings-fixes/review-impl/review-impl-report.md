# Implementation Review Report

## 1. Executive Summary

Verdict: CONDITIONAL.

No P0 findings were found. The implementation has 3 P1 findings and 2 P2 findings. Confidence is high for the reported issues because each was checked against the current code and the scoped Vitest wrapper passed repeatedly.

Counts:

| Severity | Count |
| --- | ---: |
| P0 | 0 |
| P1 | 3 |
| P2 | 2 |

## 2. Scope

This review audited production/test code, not spec-document drift.

Primary packet code files audited:

| File | Role |
| --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py` | Python advisor CLI/fallback scorer |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py` | Graph metadata compiler/validator |

Supporting code/test files audited:

| File | Role |
| --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_runtime.py` | Python discovery/cache runtime |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py` | Regression harness |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_bench.py` | Benchmark harness |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py` | Python compatibility test suite |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/python-compat.vitest.ts` | Vitest wrapper |

Additional current-path context was read from TypeScript native scorer and handler files to avoid false positives.

## 3. Method

Verification used the requested scoped Vitest command:

```sh
cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run skill-advisor/tests/compat/python-compat.vitest.ts --reporter=default
```

Result: passed on each iteration run.

History checked:

| Commit | Reason |
| --- | --- |
| `a663cbe78f fix(027): scan-findings Themes 2-7 - 34 findings closed` | Shows the current implementation edits to advisor/compiler/tests. |
| `106d394ca0 refactor: consolidate skill-advisor into self-contained mcp_server/skill-advisor/` | Explains why the packet's historical `.opencode/skill/skill-advisor` paths now resolve under `system-spec-kit/mcp_server/skill-advisor`. |

Other checks:
- `rg --files` and targeted `rg -n` for current path resolution.
- Current `skill_graph_compiler.py --validate-only` behavior.
- Reproduction of `--semantic-hits` non-finite score handling.

## 4. Findings By Severity

### P0

None.

### P1

| ID | Dimension | Evidence | Finding |
| --- | --- | --- | --- |
| DR-IMPL-001 | correctness | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_runtime.py:153`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2708`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2754`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2957` | Python fallback graph signals for nested `skill-advisor` are dead because discovery only loads top-level `SKILL.md` files. Health currently degrades with `missing_in_discovery: ["skill-advisor"]`, and prompts matching `skill-advisor` graph signals cannot return `skill-advisor` from the Python fallback. |
| DR-IMPL-002 | security | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2096`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2105`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:3165` | `--semantic-hits` accepts caller-supplied non-finite scores. `score: "1e309"` becomes infinity and can force an unrelated skill to high-confidence/pass-threshold output. |
| DR-IMPL-003 | robustness | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:782`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:786`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:3158`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py:1179` | The shipped strict validation path currently exits 2 on zero-edge skills, so the claimed validation command is not passing in the current checkout. |

### P2

| ID | Dimension | Evidence | Finding |
| --- | --- | --- | --- |
| DR-IMPL-004 | testing | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/python-compat.vitest.ts:12`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:3165`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:3246` | Regression coverage does not exercise `--semantic-hits` score validation even though that path can alter routing confidence. |
| DR-IMPL-005 | security | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:123`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:171`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:649` | Compiler numeric validation accepts JSON booleans as schema versions and weights because Python `bool` is an `int` subclass. |

## 5. Findings By Dimension

Correctness:
- DR-IMPL-001: Python fallback cannot recommend the nested `skill-advisor` graph node.

Security:
- DR-IMPL-002: non-finite semantic-hit score injection can force routing.
- DR-IMPL-005: boolean numeric values pass compiler validation.

Robustness:
- DR-IMPL-003: current strict validation exits non-zero in the current checkout.

Testing:
- DR-IMPL-004: missing semantic-hit validation regression coverage.

## 6. Adversarial Self-Check For P0

No P0 findings were raised.

Potential P0 candidate considered:
- Non-finite `--semantic-hits` score injection. It can force a wrong route, but this path requires caller-provided precomputed hits or explicit semantic-hit CLI usage, so it is classified P1 rather than P0.

Potential P0 candidate considered:
- Current `--validate-only` failure. It blocks verification/release readiness but does not directly cause data loss, auth bypass, or runtime crash in normal routing, so it is P1.

## 7. Remediation Order

| Order | Finding | Recommended fix |
| ---: | --- | --- |
| 1 | DR-IMPL-002 | Validate `--semantic-hits` entries as objects with repo-resolvable path strings and finite numeric scores in `[0, 1]`; reject or clamp invalid rows before scoring. |
| 2 | DR-IMPL-003 | Decide whether zero-edge skills are invalid or allowed. If invalid, add/fix the current missing edges so `--validate-only` passes. If allowed, change the compiler/test contract so zero-edge remains advisory. |
| 3 | DR-IMPL-001 | Either remove `skill-advisor` as a routable graph node or teach Python discovery to load the nested advisor record consistently with the graph projection. |
| 4 | DR-IMPL-005 | Replace `isinstance(..., (int, float))` numeric checks with strict type and finite checks. |
| 5 | DR-IMPL-004 | Add regression rows/tests for malformed semantic-hit inputs. |

## 8. Test Additions Needed

Add tests for:
- `--semantic-hits` rejects `NaN`, `Infinity`, negative, greater-than-one, string, and non-object rows.
- Python fallback health is not degraded in the intended production state, or explicitly documents that `skill-advisor` is graph-only and non-routable.
- `skill_graph_compiler.py --validate-only` passes against the current repository metadata.
- Compiler rejects JSON boolean `schema_version` and boolean `weight`.

## 9. Appendix: Iteration List And Churn

| Iteration | Dimension | New findings | Churn |
| ---: | --- | --- | ---: |
| 001 | correctness | DR-IMPL-001 | 0.33 |
| 002 | security | DR-IMPL-002 | 0.33 |
| 003 | robustness | DR-IMPL-003 | 0.33 |
| 004 | testing | DR-IMPL-004 | 0.20 |
| 005 | correctness | none | 0.00 |
| 006 | security | DR-IMPL-005 | 0.20 |
| 007 | robustness | none | 0.00 |
| 008 | testing | none | 0.00 |
| 009 | correctness | none | 0.00 |
| 010 | security | none | 0.00 |

Convergence: all four dimensions covered, no P0 findings, and the final three iterations had churn 0.00.
