# Iteration 002 - Security

## Scope

Audited the backfill CLI and graph metadata parser for untrusted path handling, traversal widening, injection surfaces, and denial-of-service shapes. Evidence remains limited to production code and packet-owned tests.

## Verification

- Vitest: PASS, 2 files and 25 tests.
- Git log checked for scoped parser/backfill files.
- Grep reviewed `--root`, traversal, archive filtering, and throw paths.

## Findings

### IMPL-P2-002 - Backfill accepts any --root and recursively scans it without a traversal budget

Severity: P2

Dimension: security

Evidence:

- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:89` accepts `--root`.
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:90` resolves the next argument as the traversal root without validating that an argument was supplied or that it is a specs root.
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:121` starts recursive traversal.
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:137` iterates every child directory.
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:144` recurses without a depth, folder-count, or elapsed-time guard.

This is a local operator CLI, so the severity is P2 rather than a remote security hole. Still, an accidental `--root /` or similarly broad path can force a large synchronous filesystem walk before any graph-metadata validation boundary is reached. A bounded specs-root check or traversal budget would reduce denial-of-service risk from misconfiguration.

## Delta

- New findings: 1
- Carried findings: 1
- Severity-weighted new findings ratio: 0.17
- Churn: 0.50
