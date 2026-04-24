# Implementation Deep Review Report

## 1. Executive Summary

Verdict: PASS WITH P1 REMEDIATION REQUIRED.

This implementation-focused pass audited the actual code claimed by the packet, not the spec docs. The packet mostly changed documentation surfaces; the only claimed production code file is the graph metadata backfill script. The review found no P0 issues, 3 P1 issues, and 2 P2 issues.

Counts:

| Severity | Count |
|---|---:|
| P0 | 0 |
| P1 | 3 |
| P2 | 2 |
| Total | 5 |

Confidence: Medium-high. The audited implementation surface is small and directly testable. Confidence is reduced only because CocoIndex and memory MCP calls returned as cancelled in this environment, so the pass relied on direct file reads, `rg`, git history, dry-run reproduction, and scoped vitest.

## 2. Scope

Code files audited:

| File | Why Included |
|---|---|
| `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` | The only `.ts` production code file listed by the packet implementation summary and `graph-metadata.json.derived.key_files`. |

Supporting test file:

| File | Why Included |
|---|---|
| `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts` | Directly imports and tests the audited backfill script. |

Spec docs were read only to establish scope. Findings that cite only `.md`, `description.json`, or `graph-metadata.json` were intentionally excluded.

## 3. Method

Vitest command run for each iteration:

```sh
cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run ../scripts/tests/graph-metadata-backfill.vitest.ts --reporter=default
```

Result: PASS in all 10 iterations. Each run reported `scripts/tests/graph-metadata-backfill.vitest.ts` with 3/3 passing tests.

Git history checked:

| Commit | Relevant Observation |
|---|---|
| `22c1c33a94` | Added `--active-only` and backfill tests while keeping default traversal inclusive. |
| `254461c386` | Added inline usage guidance for inclusive backfill and `--active-only`. |

Dry-run reproductions:

| Command | Observed Result |
|---|---|
| `node .opencode/skill/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js --dry-run --root /tmp/speckit-missing-root-for-review` | Exit 0, `totalSpecFolders: 0`. |
| `node .opencode/skill/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js --dry-run --root --active-only` | Exit 0, `root` became `<repo>/--active-only`, `totalSpecFolders: 0`. |

## 4. Findings By Severity

### P0

None.

### P1

| ID | Dimension | Finding | Evidence |
|---|---|---|---|
| DRIMPL-P1-001 | correctness | Unreadable or missing roots produce a successful zero-work backfill. | `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:126`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:129`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:148`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:239` |
| DRIMPL-P1-002 | robustness | One malformed graph-metadata file aborts the entire batch. | `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:206`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:208`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:214`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:397`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:401` |
| DRIMPL-P1-003 | testing | Regression tests cover happy-path backfill but not failure paths. | `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:89`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:126`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:208`, `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:77`, `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:126` |

### P2

| ID | Dimension | Finding | Evidence |
|---|---|---|---|
| DRIMPL-P2-004 | correctness | `--root` consumes the next flag when its value is missing. | `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:89`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:90`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:91` |
| DRIMPL-P2-005 | security | Traversal is synchronous and unbounded for operator-supplied roots. | `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:121`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:137`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:144`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:148` |

## 5. Findings By Dimension

Correctness:

- DRIMPL-P1-001: missing/unreadable roots silently become a successful zero-packet run.
- DRIMPL-P2-004: malformed `--root` usage consumes a following flag as a path.

Security:

- DRIMPL-P2-005: broad roots can trigger unbounded synchronous local traversal.
- No command injection, secret handling, auth bypass, or non-dry-run write escape was found.

Robustness:

- DRIMPL-P1-002: one corrupt existing metadata file can abort the entire batch.

Testing:

- DRIMPL-P1-003: scoped tests cover happy paths but not invalid root, bad CLI args, or malformed metadata.

## 6. Adversarial Self-Check For P0

No P0 finding was identified.

Potential P0 candidates checked and rejected:

| Candidate | Evidence | Why Not P0 |
|---|---|---|
| Write traversal outside specs root | `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:214`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1171`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1140` | Non-dry-run writes delegate to graph metadata parser helpers that classify the target path before writing. |
| Command injection | `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:12`, `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:240` | The script uses Node filesystem APIs and does not shell out with user-controlled input. |
| Data loss from dry-run | `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:214`, `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:90` | Dry-run uses derivation only and the scoped test asserts no `graph-metadata.json` files are written. |

## 7. Remediation Order

1. Fix DRIMPL-P1-001: validate `root` before traversal. Missing/unreadable root should fail loudly and set a nonzero CLI exit.
2. Fix DRIMPL-P1-002: add per-folder error collection in `runBackfill`; report failures alongside created/refreshed counts and choose explicit fail-fast or partial-success exit semantics.
3. Fix DRIMPL-P1-003: add regression tests for invalid root, malformed metadata, and CLI parse edge cases.
4. Fix DRIMPL-P2-004: validate `--root` requires a non-flag value; reject missing values instead of resolving the next option as a path.
5. Consider DRIMPL-P2-005 guardrails: add max-depth/max-folder limits, or at least a preflight warning when root is broader than a canonical specs directory.

## 8. Test Additions Needed

Add scoped tests in `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts` or a nearby CLI-focused test file:

| Test | Expected Assertion |
|---|---|
| Invalid root dry-run | Returns or throws a distinct failure instead of `{ totalSpecFolders: 0 }` success. |
| `--root --active-only` CLI parse | Rejects missing root value and preserves option parsing semantics. |
| Corrupt existing `graph-metadata.json` in one folder | Either records a per-folder failure and continues, or fails with a clear batch error before claiming success. |
| Broad root guard | Warns or limits traversal when root is outside the expected specs root shape. |

## 9. Appendix: Iteration List And Churn

| Iteration | Dimension | New Findings | Churn |
|---:|---|---|---:|
| 001 | correctness | DRIMPL-P1-001, DRIMPL-P2-004 | 0.40 |
| 002 | security | DRIMPL-P2-005 | 0.20 |
| 003 | robustness | DRIMPL-P1-002 | 0.20 |
| 004 | testing | DRIMPL-P1-003 | 0.20 |
| 005 | correctness | none | 0.00 |
| 006 | security | none | 0.00 |
| 007 | robustness | none | 0.00 |
| 008 | testing | none | 0.00 |
| 009 | correctness | none | 0.00 |
| 010 | security | none | 0.00 |

Convergence became eligible at iteration 007 after all dimensions were covered and churn stayed at or below 0.05 for three consecutive iterations. The loop continued to 010 to satisfy the requested artifact contract.
