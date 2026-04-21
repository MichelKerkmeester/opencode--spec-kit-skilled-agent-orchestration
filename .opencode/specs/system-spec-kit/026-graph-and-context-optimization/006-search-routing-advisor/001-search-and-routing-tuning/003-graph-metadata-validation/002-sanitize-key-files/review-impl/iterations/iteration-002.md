# Iteration 002 - Security

## Scope

- Dimension: security
- Files audited:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`
- Adjacent security consumers checked:
  - `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/watcher.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/provenance.ts`
- Verification:
  - `../scripts/node_modules/.bin/vitest run tests/graph-metadata-schema.vitest.ts --reporter=default` PASS, 22 tests
  - Git history for parser and packet test checked

## Findings

No new distinct security findings.

The traversal/canonicalization issue from iteration 001 has a security flavor, but I am not duplicating it as a separate finding because the same parser lines and same remediation close both the correctness and boundary-risk aspects. I also checked the dynamic watch-target consumer: it maps `derived.key_files` through `workspaceRelativeFilePath()` before watching, and that helper rejects absolute, escaping, and symlinked-out paths using `realpathSync`.

## Evidence Checked

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:680` uses `statSync().isFile()` for candidate existence.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/watcher.ts:152` maps graph metadata key files through `workspaceRelativeFilePath()`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/provenance.ts:56` compares `realpathSync(root)` and `realpathSync(absolutePath)` before accepting existing files.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/daemon-freshness-foundation.vitest.ts:253` covers absolute, escaping, and symlinked-out derived key-file watch targets.

## Churn

- New findings this iteration: P0=0, P1=0, P2=0
- Severity-weighted new findings ratio: 0.00
