# Iteration 001 - Correctness

## Scope

- Dimension: correctness
- Files audited:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`
- Verification:
  - `../scripts/node_modules/.bin/vitest run tests/graph-metadata-schema.vitest.ts --reporter=default` PASS, 22 tests
  - `git log --oneline --max-count=20 -- .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts .opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` checked

## Findings

### P1-CORR-001 [P1] Interior traversal segments can still be accepted as key-file references

- File: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:557`
- Additional evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:581`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:782`
- Evidence: `keepKeyFile()` rejects only candidates that start with `../`, while slash-containing candidates only need a dotted last segment to survive the predicate. `resolveKeyFileCandidate()` then feeds the unnormalized display path into lookup paths and returns that display path if any resolved filesystem path exists.
- Impact: A reference like `mcp_server/lib/graph/../../package.json` can pass the predicate shape and be validated by `path.resolve(...)` if the target exists, leaving a non-normalized traversal string in `derived.key_files`. That violates the "repo-relative paths only" contract and can mislead downstream consumers that treat key files as clean path surfaces.
- Recommendation: Normalize path segments before returning a display path and reject any candidate with `..` or empty segments after slash normalization.

## Ruled Out

- Absolute POSIX and Windows paths are explicitly rejected before resolution.
- Bare non-canonical filenames are rejected by `BARE_FILE_RE` unless they are canonical packet docs.

## Churn

- New findings this iteration: P0=0, P1=1, P2=0
- Severity-weighted new findings ratio: 0.50
