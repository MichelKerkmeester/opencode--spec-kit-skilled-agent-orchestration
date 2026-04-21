# Implementation Deep Review Report

## 1. Executive Summary

Verdict: CONDITIONAL.

Counts: P0: 0, P1: 1, P2: 3.

Confidence: medium-high. The scoped production code was small and directly audited, the compiled runtime matched the TypeScript source, and the packet-specific vitest file passed in all ten iteration verification runs. The main caveat is that current production docs elsewhere describe archive-inclusive default behavior, while this packet's implementation summary describes active-only default behavior. The P1 therefore requires a product/contract decision before code changes.

## 2. Scope

Code files audited:

| File | Scope reason |
| --- | --- |
| `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` | Listed by packet implementation summary and graph metadata |
| `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts` | Listed by graph metadata as packet test code |
| `.opencode/skill/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js` | Runtime parity check for the shipped CLI entrypoint |

Spec docs and metadata were not reviewed for drift except as inputs to identify the production code scope.

## 3. Method

Verification:
- Ran `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run ../scripts/tests/graph-metadata-backfill.vitest.ts --reporter=default`: PASS, `1` file and `3` tests.
- Repeated the scoped vitest command for iterations 001 through 010: PASS each run.
- Checked git history with `git log`, `git blame`, and `git show --stat` for the implementation files and referenced commit `2958485d9f`.
- Used `rg` over scripts, MCP server, command docs, and feature catalog for `activeOnly`, `active-only`, `include-archive`, `z_archive`, `z_future`, `collectSpecFolders`, and `runBackfill`.
- CocoIndex semantic search was attempted twice and returned user-cancelled tool results, so the audit fell back to direct code reads plus exact search.

## 4. Findings By Severity

### P0

None.

### P1

| ID | Dimension | Finding | Evidence |
| --- | --- | --- | --- |
| IMPL-COR-001 | correctness | Backfill still defaults to archive-inclusive traversal. If active-only default is the intended packet behavior, the shipped implementation has wrong default semantics. | `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:70`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:73`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:85`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:193`, `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:78`, `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:84` |

### P2

| ID | Dimension | Finding | Evidence |
| --- | --- | --- | --- |
| IMPL-ROB-001 | robustness | Active-only archive detection uses the absolute path instead of a root-relative path. | `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:103`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:104`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:121`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:122` |
| IMPL-ROB-002 | robustness | CLI argument parsing silently accepts missing values and unknown flags. | `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:75`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:89`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:90`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:91` |
| IMPL-TST-001 | testing | Tests cover direct API options but not the CLI flag contract. | `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:78`, `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:95`, `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:117`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:70` |

## 5. Findings By Dimension

Correctness:
- IMPL-COR-001: default traversal semantics remain archive-inclusive in source, runtime dist, and tests.

Security:
- No security findings. No injection, secret exposure, auth bypass, unsafe deserialization, or symlink traversal issue was found in the scoped code.

Robustness:
- IMPL-ROB-001: active-only filtering checks absolute paths.
- IMPL-ROB-002: CLI parsing does not fail fast for malformed input.

Testing:
- IMPL-TST-001: tests miss CLI argument contract coverage.

## 6. Adversarial Self-Check For P0

No P0 findings were raised.

Self-check:
- The only wrong-semantics candidate, IMPL-COR-001, is P1 rather than P0 because current production docs and history also support archive-inclusive behavior. It is release-significant only if this packet's intended contract is active-only default.
- The filesystem root handling issues require operator error or unusual path placement, so they remain P2 robustness findings.

## 7. Remediation Order

1. Resolve the traversal default contract for IMPL-COR-001. If active-only is intended, flip the source default, update dist via build, and invert tests.
2. Add root-relative archive filtering for IMPL-ROB-001.
3. Add fail-fast CLI parsing for IMPL-ROB-002.
4. Add CLI-level tests for `--active-only`, `--include-archive`, missing `--root`, and unknown flags for IMPL-TST-001.

## 8. Test Additions Needed

- Default CLI run excludes `z_archive` and `z_future` when active-only default is confirmed.
- `--include-archive` includes archived and future packets when active-only default is confirmed.
- `--root` without a path exits non-zero with a usage message.
- Unknown flags exit non-zero with a usage message.
- Active-only filtering is evaluated relative to the specs root, not parent directories above it.

## 9. Appendix: Iteration List And Churn

| Iteration | Dimension | New findings | Churn |
| --- | --- | ---: | ---: |
| 001 | correctness | 1 | 0.50 |
| 002 | security | 0 | 0.00 |
| 003 | robustness | 2 | 0.17 |
| 004 | testing | 1 | 0.08 |
| 005 | correctness | 0 | 0.00 |
| 006 | security | 0 | 0.00 |
| 007 | robustness | 0 | 0.00 |
| 008 | testing | 0 | 0.00 |
| 009 | correctness | 0 | 0.00 |
| 010 | security | 0 | 0.00 |

Stop reason: max iterations reached. Dimension coverage completed by iteration 004, and iterations 005-010 served as stabilization passes.
