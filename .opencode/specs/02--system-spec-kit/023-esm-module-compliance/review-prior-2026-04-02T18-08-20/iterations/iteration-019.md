# Iteration 019

## Scope
Runtime architecture (shared + mcp_server ESM alignment and boundaries).

## Verdict
findings

## Findings

### P1
1. DB update marker path mismatch across package boundary.
- Evidence:
  - ../../../../skill/system-spec-kit/shared/config.ts:24
  - ../../../../skill/system-spec-kit/shared/config.ts:38
  - ../../../../skill/system-spec-kit/scripts/core/memory-indexer.ts:18
  - ../../../../skill/system-spec-kit/scripts/core/memory-indexer.ts:41
  - ../../../../skill/system-spec-kit/mcp_server/core/config.ts:82
  - ../../../../skill/system-spec-kit/mcp_server/core/db-state.ts:185
  - ../../../../skill/system-spec-kit/mcp_server/context-server.ts:754

2. 023 interop contract drift: scripts still use direct CJS `require()` on ESM siblings rather than explicit dynamic boundary.
- Evidence:
  - ../spec.md:116
  - ../spec.md:144
  - ../../../../skill/system-spec-kit/scripts/package.json:5
  - ../../../../skill/system-spec-kit/scripts/core/memory-indexer.ts:17
  - ../../../../skill/system-spec-kit/scripts/spec-folder/generate-description.ts:22
  - ../../../../skill/system-spec-kit/scripts/dist/core/memory-indexer.js:51
  - ../../../../skill/system-spec-kit/scripts/dist/core/workflow.js:164

3. Startup-path tests are partially broken due stale mock exports.
- Evidence:
  - ../../../../skill/system-spec-kit/mcp_server/context-server.ts:1374
  - ../../../../skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:579
  - ../../../../skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1280
  - ../../../../skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1294

### P2
1. Modularization thresholds stale relative to current module size.
- Evidence:
  - ../../../../skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:21
  - ../../../../skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:31
  - ../../../../skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:137

2. Import-policy checker includes test fixtures and reports fixture strings as violations.
- Evidence:
  - ../../../../skill/system-spec-kit/scripts/evals/check-no-mcp-lib-imports.ts:327
  - ../../../../skill/system-spec-kit/scripts/evals/check-no-mcp-lib-imports.ts:337
  - ../../../../skill/system-spec-kit/scripts/evals/check-no-mcp-lib-imports.ts:349
  - ../../../../skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:248
  - ../../../../skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts:253
