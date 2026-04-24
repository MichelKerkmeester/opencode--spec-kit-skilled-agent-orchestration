# Implementation Deep Review Report

## 1. Executive Summary

Verdict: CONDITIONAL PASS WITH P1 REMEDIATION NEEDED.

The implementation is mostly localized and the scoped test suite passes, but the production key-file resolver still has two meaningful gaps: legacy metadata imports bypass the new sanitizer/resolver, and embedded `..` traversal segments can be preserved as key-file display paths. Counts: P0=0, P1=3, P2=1. Confidence: high for the cited code paths, medium for blast radius because downstream consumers may vary in how they treat stored `key_files`.

## 2. Scope

Code files audited:

| File | Role |
|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Production parser/resolver |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` | Focused regression tests |

Spec docs and metadata were used only to identify scope. Findings cite production/test code files, not spec-doc drift.

## 3. Method

Verification performed:

| Check | Result |
|---|---|
| Scoped vitest command, iterations 001-010 | PASS each run, 22 tests |
| `cd .opencode/skill/system-spec-kit/mcp_server && npm run typecheck` | PASS |
| Git log for audited files | Checked; implementation file pair appears in `29624f3a71`, with later follow-up touches |
| Grep/read/code inspection | Parser resolver, legacy fallback, tests, write path, merge path |

## 4. Findings by Severity

### P0

None.

### P1

| ID | Dimension | Finding | Evidence |
|---|---|---|---|
| DRI-001 | correctness | Legacy fallback imports raw `Key Files:` values without the cleanup/resolution path. | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:293`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:350` |
| DRI-002 | security | Embedded traversal segments can pass filtering, resolve through `path.resolve`, and be returned as stored display paths. | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:557`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:727`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:785` |
| DRI-004 | testing | Tests cover leading `../` and current derived cleanup, but not embedded traversal or legacy fallback parity. | `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:225`; `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:400`; `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:425` |

### P2

| ID | Dimension | Finding | Evidence |
|---|---|---|---|
| DRI-003 | robustness | Candidate resolution is unbounded before the 20-item output cap, so large docs can force unnecessary synchronous filesystem probes. | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:938`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:940`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:942` |

## 5. Findings by Dimension

| Dimension | Findings |
|---|---|
| correctness | DRI-001 |
| security | DRI-002 |
| robustness | DRI-003 |
| testing | DRI-004 |

## 6. Adversarial Self-Check for P0

No P0 findings were identified.

P0 challenge applied to DRI-002: the traversal issue stores a misleading/escaped path string but does not by itself prove data loss, direct arbitrary file read, crash, or auth bypass in the audited code. Severity remains P1.

Observed behavior for DRI-002: a runtime probe against the built parser showed `keepKeyFile(...)` returned `true` and `resolveKeyFileCandidate(...)` returned the traversal-containing candidate when the resolved file existed.

Observed behavior for DRI-001: a runtime probe against `validateGraphMetadataContent(...)` preserved `memory/metadata.json` and `scripts/missing-does-not-exist.ts` from legacy `Key Files:`.

## 7. Remediation Order

1. Fix DRI-002 first: reject any `..` path segment after normalization, not only values starting with `../`; add a resolver-level guard before `path.resolve` lookups.
2. Fix DRI-001: route legacy `Key Files:` through the same cleanup policy, or deliberately clear legacy key files and let refresh regenerate them.
3. Add DRI-004 regression tests for both fixes.
4. Consider DRI-003 if large-doc refresh cost matters: cap candidate probes before filesystem resolution or add a bounded candidate budget.

## 8. Test Additions Needed

| Test | Expected assertion |
|---|---|
| `keepKeyFile('subdir/../target.ts')` and a multi-level variant | Returns false, or resolver returns null before filesystem probing |
| `resolveKeyFileCandidate(...)` with embedded traversal and an existing escaped target | Returns null |
| `validateGraphMetadataContent(...)` with legacy `Key Files: memory/metadata.json, scripts/missing.ts, spec.md` | Does not preserve obsolete or nonexistent key files |
| Large candidate list fixture | Resolver does not probe an unbounded number of candidates before output cap |

## 9. Appendix: Iteration List + Churn

| Iteration | Dimension | New findings | Churn |
|---|---|---:|---:|
| 001 | correctness | 1 | 1.0000 |
| 002 | security | 1 | 0.5000 |
| 003 | robustness | 1 | 0.1429 |
| 004 | testing | 1 | 0.3000 |
| 005 | correctness | 0 | 0.0000 |
| 006 | security | 0 | 0.0000 |
| 007 | robustness | 0 | 0.0000 |
| 008 | testing | 0 | 0.0000 |
| 009 | correctness | 0 | 0.0000 |
| 010 | security | 0 | 0.0000 |

Artifacts:

- `review-impl/deep-review-impl-config.json`
- `review-impl/deep-review-impl-state.jsonl`
- `review-impl/deep-review-impl-findings-registry.json`
- `review-impl/iterations/iteration-001.md` through `iteration-010.md`
- `review-impl/deltas/iter-001.jsonl` through `iter-010.jsonl`
