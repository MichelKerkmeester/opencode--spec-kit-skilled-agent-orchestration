# Iteration 003 - Robustness

## Scope

Reviewed failure containment, file-write behavior, and cleanup paths in the graph metadata parser and backfill script.

## Verification

- Vitest: PASS, 2 files and 25 tests.
- Git log checked for scoped parser/backfill files.
- Grep/read checks focused on write, rename, load, and refresh error paths.

## Findings

### IMPL-P2-003 - Atomic graph-metadata writes can leave temp files behind when rename fails

Severity: P2

Dimension: robustness

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1145` constructs a unique temp path.
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1148` writes the temp file.
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1149` renames it into place without a cleanup guard.

The unique temp suffix protects same-process collision, but there is no `try/finally` or best-effort unlink around the temp file. If `renameSync` fails after `writeFileSync` succeeds, the failed write leaves a `.tmp-<pid>-...` file next to graph metadata. This is not data loss because the original file remains, but repeated filesystem or permission failures can accumulate stale temp files and confuse later corpus scans or manual inspection.

## Carried Findings

- IMPL-P1-001 remains open.
- IMPL-P2-002 remains open.

## Delta

- New findings: 1
- Carried findings: 2
- Severity-weighted new findings ratio: 0.13
- Churn: 0.33
