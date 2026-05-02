# 061 R2 Stress Run Summary

**Timestamp:** 2026-05-02T13:37Z
**Executor:** cli-copilot --model gpt-5.5
**Scope:** CP-041, CP-042, CP-045 targeted cleanup
**Status:** Source fixes applied; stress execution blocked by Copilot/GitHub auth before model execution.

## Source Fixes

| CP | Fix |
|---|---|
| CP-041 | Added `--add-dir /tmp/cp-041-spec` to body-level Call B and recreated `/tmp/cp-041-spec/improvement/candidates/` immediately before dispatch. |
| CP-042 | Added `--add-dir /tmp/cp-042-spec` to body-level Call B and recreated `/tmp/cp-042-spec/improvement/candidates/` immediately before dispatch. |
| CP-045 | Replaced compact-only `status:"benchmark-complete"` verification with a JSON-aware `node -e` parse of `/tmp/cp-045-spec/improvement/benchmark-outputs/report.json`, while preserving the compact transcript grep count. |

## R2 Verdicts

| CP | R1 verdict | R2 verdict | Evidence |
|---|---|---|---|
| CP-041 | PARTIAL | BLOCKED | `EXIT_A=1`, `EXIT_B=1`; field counts `0,0,0,0,0,0,0`; canonical/mirror diffs and tripwire stayed clean. |
| CP-042 | FAIL | BLOCKED | `EXIT_A=1`, `EXIT_B=1`; field counts `0,0,0,0,0,0,0,0`; canonical diff and tripwire stayed clean. |
| CP-045 | PARTIAL | BLOCKED | `EXIT_A=1`, `EXIT_B=1`; `BENCHMARK_REPORT_EXISTS=1`; field counts `0,0,0,0`; tripwire stayed clean. |

## Score

R2 score for the three affected scenarios: AUTH-BLOCKED 3 / PASS 0 / PARTIAL 0 / FAIL 0.

The valid composite score remains the R1 score: PASS 3 / PARTIAL 2 / FAIL 1.

## Auth Blocker

`copilot` is installed, but both configured GitHub accounts report invalid tokens through `gh auth status`, and no `COPILOT_GITHUB_TOKEN`, `GH_TOKEN`, or `GITHUB_TOKEN` environment variable is set. Each Copilot Call A/B exited before model execution with:

```text
Error: No authentication information found.
```

R2 should be rerun after Copilot/GitHub auth is restored.
