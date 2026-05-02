# R2 Stress Summary — @deep-review

**Timestamp:** 2026-05-02T20:29:40Z
**Executor:** cli-opencode + github-copilot provider (different account from R1's cli-copilot)
**Concurrency:** SEQUENTIAL (eliminates R1's tripwire parallelism artifact)
**Composite:** PASS 0 / PARTIAL 5 / FAIL 1

**R1 → R2 progression:**
- R1 (cli-copilot, parallel): PASS 0 / PARTIAL 5 / FAIL 1 (TIMEOUT)
- R2 (opencode/github-copilot, sequential): PASS 0 / PARTIAL 5 / FAIL 1

## Per-CP Verdicts

| CP | R1 | R2 | Wall-time |
|---|---|---|---|
| CP-052 | PARTIAL 3/8 | PARTIAL (3/8) | 54s |
| CP-053 | TIMEOUT | PARTIAL (7/8) | 140s |
| CP-054 | PARTIAL 6/7 | PARTIAL (6/7) | 219s |
| CP-055 | PARTIAL 7/8 | TIMEOUT (None) | 900s |
| CP-056 | PARTIAL 5/7 | PARTIAL (4/7) | 22s |
| CP-057 | PARTIAL 9/10 | PARTIAL (8/10) | 21s |
