# Implementation Deep Review Report

## 1. Executive summary

Verdict: changes are mostly sound, but not clean to ship without follow-up. The audit found 0 P0, 1 P1, and 3 P2 implementation findings across 5 audited code/test files. Confidence is high for the P1 and testing P2, medium for the two hardening P2s.

The main implementation risk is corpus backfill failure containment: one malformed existing `graph-metadata.json` aborts the whole backfill loop before later packets are processed.

## 2. Scope

Code and test files audited:

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts`

Spec docs, `description.json`, and `graph-metadata.json` were used only to identify the claimed implementation surface. Findings below cite production code or packet-owned test files, not spec-doc drift.

## 3. Method

Ran 10 implementation-audit iterations rotating correctness, security, robustness, and testing. Each iteration ran:

`cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/graph-metadata-schema.vitest.ts ../scripts/tests/graph-metadata-backfill.vitest.ts --reporter=default`

All 10 runs passed with 2 test files and 25 tests. Git history was checked each iteration against the scoped files. Grep/Glob/read passes covered parser derivation, schema validation, backfill traversal, write paths, and packet-owned tests.

## 4. Findings by severity

### P0

| ID | Finding | Evidence |
| --- | --- | --- |
| None | No P0 findings. | N/A |

### P1

| ID | Finding | Evidence |
| --- | --- | --- |
| IMPL-P1-001 | Backfill aborts the entire corpus when one existing `graph-metadata.json` is invalid. | `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:206`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:208`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:214`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:397`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:401` |

### P2

| ID | Finding | Evidence |
| --- | --- | --- |
| IMPL-P2-002 | Backfill accepts any `--root` and recursively scans it without a traversal budget. | `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:89`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:90`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:121`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:137`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:144` |
| IMPL-P2-003 | Atomic graph-metadata writes can leave temp files behind when rename fails. | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1145`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1148`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1149` |
| IMPL-P2-004 | Backfill tests name `z_future` coverage but only create `z_archive` fixtures. | `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:27`, `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:60`, `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:61`, `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:78`, `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:117` |

## 5. Findings by dimension

Correctness:

- IMPL-P1-001: corpus backfill has wrong failure semantics for invalid existing metadata.

Security:

- IMPL-P2-002: misconfigured `--root` can cause an unbounded synchronous filesystem traversal.

Robustness:

- IMPL-P2-003: failed rename after temp write leaks temp artifacts.

Testing:

- IMPL-P2-004: `z_future` behavior is claimed by code/test names but not fixture-covered.

## 6. Adversarial self-check for P0

No P0 findings were identified. The nearest candidate was IMPL-P1-001. Expected behavior for a repo-wide backfill is to continue processing later packets and report the bad packet. Actual code calls `loadGraphMetadata` inside the per-folder loop and allows its validation throw to escape before the loop can continue.

## 7. Remediation order

1. Fix IMPL-P1-001 by catching per-packet load/refresh failures in `runBackfill`, adding an `errors` or `failed` summary bucket, and continuing with later folders.
2. Add the regression test for malformed existing graph metadata during backfill.
3. Add `z_future` fixtures to the backfill traversal tests.
4. Add best-effort temp cleanup around failed `renameSync`.
5. Add `--root` validation and/or traversal budget safeguards.

## 8. Test additions needed

- A backfill test where one packet has invalid existing `graph-metadata.json` and a later packet still gets processed.
- A `z_future` packet in `createSpecTree()` with assertions for default inclusion and `activeOnly` exclusion.
- A write-path test that forces `renameSync` to throw and asserts the temp file is removed or reported.
- A CLI/root parser test for missing `--root` value and over-broad root rejection or warning.

## 9. Appendix: iteration list + churn

| Iteration | Dimension | New findings | Churn | Notes |
| --- | --- | ---: | ---: | --- |
| 001 | correctness | 1 | 1.00 | Found IMPL-P1-001 |
| 002 | security | 1 | 0.50 | Found IMPL-P2-002 |
| 003 | robustness | 1 | 0.33 | Found IMPL-P2-003 |
| 004 | testing | 1 | 0.25 | Found IMPL-P2-004 |
| 005 | correctness | 0 | 0.00 | No new findings |
| 006 | security | 0 | 0.00 | No new findings |
| 007 | robustness | 0 | 0.00 | Convergence eligible |
| 008 | testing | 0 | 0.00 | Continued for requested artifacts |
| 009 | correctness | 0 | 0.00 | No new findings |
| 010 | security | 0 | 0.00 | Final pass |
