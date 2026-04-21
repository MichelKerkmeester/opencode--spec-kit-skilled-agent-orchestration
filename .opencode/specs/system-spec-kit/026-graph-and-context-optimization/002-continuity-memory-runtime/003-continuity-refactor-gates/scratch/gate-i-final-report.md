# Gate I Final Report

## Automated Suite

| Suite | Files | Tests | Pass | Fail | Skip | Todo | Pass Rate |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| mcp_server vitest | 411 | 9555 | 9424 | 114 | 15 | 2 | 98.63% |
| scripts vitest | 102 | 963 | 907 | 1 | 55 | 0 | 94.19% |
| Total | 513 | 10518 | 10331 | 115 | 70 | 2 | 98.22% |

- The numeric automated pass-rate threshold is met at 98.22%.
- The automated suite is not release-clean because 115 failures remain across the combined runs.

## Manual Playbook Scenarios Table

| Category | Total | PASS | FAIL | SKIP | UNAUTOMATABLE |
| --- | ---: | ---: | ---: | ---: | ---: |
| 01--retrieval | 16 | 3 | 0 | 0 | 13 |
| 02--mutation | 11 | 5 | 0 | 0 | 6 |
| 03--discovery | 3 | 3 | 0 | 0 | 0 |
| 04--maintenance | 2 | 1 | 0 | 0 | 1 |
| 05--lifecycle | 10 | 3 | 0 | 0 | 7 |
| 06--analysis | 7 | 6 | 0 | 0 | 1 |
| 07--evaluation | 2 | 0 | 0 | 0 | 2 |
| 08--bug-fixes-and-data-integrity | 12 | 0 | 0 | 0 | 12 |
| 09--evaluation-and-measurement | 15 | 0 | 0 | 0 | 15 |
| 10--graph-signal-activation | 17 | 0 | 0 | 0 | 17 |
| 11--scoring-and-calibration | 23 | 0 | 0 | 0 | 23 |
| 12--query-intelligence | 9 | 0 | 0 | 0 | 9 |
| 13--memory-quality-and-indexing | 29 | 0 | 0 | 0 | 29 |
| 14--pipeline-architecture | 23 | 0 | 0 | 0 | 23 |
| 15--retrieval-enhancements | 11 | 0 | 0 | 0 | 11 |
| 16--tooling-and-scripts | 51 | 0 | 0 | 0 | 51 |
| 17--governance | 7 | 0 | 0 | 0 | 7 |
| 18--ux-hooks | 19 | 0 | 0 | 0 | 19 |
| 19--feature-flag-reference | 10 | 0 | 0 | 0 | 10 |
| 20--remediation-revalidation | 3 | 0 | 0 | 0 | 3 |
| 21--implement-and-remove-deprecated-features | 5 | 0 | 0 | 0 | 5 |
| 22--context-preservation-and-code-graph | 20 | 3 | 0 | 0 | 17 |

| Overall | Total | PASS | FAIL | SKIP | UNAUTOMATABLE | PASS Rate | PASS+UNAUTOMATABLE Coverage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Manual playbook | 305 | 24 | 0 | 0 | 281 | 7.87% | 100.00% |

- Manual FAIL count is zero.
- The manual acceptance bar is met only because 281 scenarios were classified UNAUTOMATABLE in this direct-handler runner.
- The PASS+UNAUTOMATABLE coverage rate is 100.00%, while direct PASS coverage is 7.87%.

## Failures Triaged

The automated failures cluster into the following representative themes:

- causal_edges schema mismatch: `source_anchor` column missing
- shared payload certainty drift: estimated vs defaulted
- stdio logging safety offender in `validation/spec-doc-structure.ts`
- progressive validation date drift: `2026-04-11` vs `2026-04-12`
- sqlite-fts archived filtering regression
- vector index store remediation cache expectations
- memory-search eval channel logging gap
- memory-save dedup ordering issue
- reconsolidation/archive cleanup failures

These themes explain why the automated gate is numerically above threshold but still blocked from a release-clean verdict.

## UNAUTOMATABLE Scenarios

- 281 of 305 manual scenarios were classified UNAUTOMATABLE by the direct-handler runner.
- The dominant reasons in the JSON artifacts are shell-command execution requirements, source-inspection requirements, validation against narrative/prose output, and cross-file operator workflow checks that are not reducible to a direct MCP handler call.
- Category-level scenario details are documented in the per-category markdown audits under `scratch/gate-i-execution-report/`.
