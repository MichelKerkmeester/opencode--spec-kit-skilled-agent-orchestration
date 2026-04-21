# Implementation Deep Review Report

## 1. Executive Summary

Verdict: CONDITIONAL.

The implementation is not blocked by P0 issues, but it has five P1 findings that should be fixed before treating the key-file sanitizer as complete. The audit found 0 P0, 5 P1, and 1 P2 findings across 10 iterations. Confidence: high for the parser-path findings, medium-high for the testing gaps because they are based on direct test assertions and missing end-to-end coverage.

## 2. Scope

Code files audited from `implementation-summary.md` and `graph-metadata.json.derived.key_files`:

| File | Role |
| --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Production parser and graph metadata writer |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` | Packet-listed regression test |

Adjacent code files checked for downstream impact:

| File | Reason |
| --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/tests/path-boundary.vitest.ts` | Existing absolute path boundary coverage |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/watcher.ts` | Consumer of derived key files as watch targets |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/provenance.ts` | Workspace containment helper used by consumers |

Spec docs, `description.json`, and `graph-metadata.json` drift were intentionally excluded as findings.

## 3. Method

- Ran the scoped command in every iteration: `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/graph-metadata-schema.vitest.ts --reporter=default`.
- Result each time: PASS, 22 tests.
- Checked git history each iteration with `git log --oneline --max-count=12 -- <parser> <test>`.
- Used `rg`, `find`, and numbered file reads to inspect parser logic, tests, and downstream key-file consumers.
- Attempted MCP memory/CocoIndex lookups first; both calls were cancelled by the runtime, so direct repo evidence was used.

## 4. Findings by Severity

### P0

| ID | Finding | Evidence | Recommendation |
| --- | --- | --- | --- |
| None | No P0 findings identified | N/A | N/A |

### P1

| ID | Finding | Evidence | Recommendation |
| --- | --- | --- | --- |
| P1-CORR-001 | Interior traversal segments can still be accepted as key-file references | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:557`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:581`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:782` | Reject `..` and empty path segments after slash normalization, and return only canonicalized display paths. |
| P1-ROB-001 | Legacy graph-metadata migration bypasses the new key-file sanitizer | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:293`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:350`, `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:225` | Run legacy `Key Files:` values through the same sanitizer and normalize/resolve them before returning migrated metadata. |
| P1-TEST-001 | Sanitizer coverage is mostly helper-level and misses production bypass paths | `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:386`, `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:237`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:929`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:293` | Add end-to-end tests for `deriveGraphMetadata()` and noisy legacy `validateGraphMetadataContent()` inputs. |
| P1-CORR-002 | Canonical packet docs can still be evicted by the key-file cap | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:938`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:942`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:32`, `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:516` | Reserve cap space for canonical docs or append canonical docs after capping non-canonical references. |
| P1-TEST-002 | No test locks canonical-doc survival when `key_files` hits the cap | `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:514`, `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:521`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:938`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:942` | Add a high-volume fixture asserting canonical docs remain in `derived.key_files`. |

### P2

| ID | Finding | Evidence | Recommendation |
| --- | --- | --- | --- |
| P2-ROB-002 | Graph metadata writer leaves temp files behind on rename failure | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1148`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1149`, `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:540` | Remove the temp file in a catch/finally path if rename fails after the temp write succeeds. |

## 5. Findings by Dimension

| Dimension | Findings |
| --- | --- |
| Correctness | P1-CORR-001, P1-CORR-002 |
| Security | No distinct security finding beyond the path-boundary risk already captured by P1-CORR-001. Downstream watch-target consumers perform containment checks. |
| Robustness | P1-ROB-001, P2-ROB-002 |
| Testing | P1-TEST-001, P1-TEST-002 |

## 6. Adversarial Self-Check for P0

No P0 findings were identified, so there is no P0 reproduction to add.

The highest-impact candidate was `P1-CORR-001`. It is not classified as P0 because the reviewed code stores path strings in graph metadata and indexable text; adjacent watch-target usage checked in `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/provenance.ts:56` performs realpath containment before accepting existing files.

## 7. Remediation Order

1. Fix `P1-CORR-001`: normalize candidate segments and reject any `..` or empty segment before resolution and before returning display paths.
2. Fix `P1-ROB-001`: apply the same sanitizer to legacy `Key Files:` migration output.
3. Fix `P1-CORR-002`: ensure canonical packet docs survive the final cap.
4. Add tests for `P1-TEST-001` and `P1-TEST-002` in the same change as the parser fixes.
5. Address `P2-ROB-002` with temp-file cleanup in the writer.

## 8. Test Additions Needed

| Test | Purpose |
| --- | --- |
| `deriveGraphMetadata()` with valid reference plus `a/../b.ts` | Proves traversal-shaped display paths do not enter `derived.key_files`. |
| `validateGraphMetadataContent()` with legacy `Key Files: node scripts/build.js, application/json, spec.md` | Proves legacy migration cannot reintroduce noisy key files. |
| `deriveGraphMetadata()` with more than 20 valid implementation refs plus canonical docs | Proves canonical packet docs survive the cap. |
| `writeGraphMetadataFile()` with forced `renameSync` failure after temp write | Proves temp files are cleaned up on failed atomic swap. |

## 9. Appendix: Iteration List and Churn

| Iteration | Dimension | New Findings | Churn |
| --- | --- | --- | --- |
| 001 | correctness | P1-CORR-001 | 0.50 |
| 002 | security | none | 0.00 |
| 003 | robustness | P1-ROB-001 | 0.33 |
| 004 | testing | P1-TEST-001 | 0.25 |
| 005 | correctness | P1-CORR-002 | 0.20 |
| 006 | security | none | 0.00 |
| 007 | robustness | P2-ROB-002 | 0.05 |
| 008 | testing | P1-TEST-002 | 0.17 |
| 009 | correctness | none | 0.00 |
| 010 | security | none | 0.00 |

Stop reason: max iterations reached. All four dimensions were covered at least twice, and the final two iterations found no new issues.
