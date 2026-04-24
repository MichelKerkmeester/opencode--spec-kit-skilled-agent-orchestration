# Vitest Triage Phase 3: Save, Session, and Runtime Contracts

## Fixed Tests

- `mcp_server/tests/cli.vitest.ts`: isolated the unavailable DB-path test from the sandbox `MEMORY_DB_PATH` override while keeping bulk-delete on the seeded test DB.
- `mcp_server/tests/context-server-error-envelope.vitest.ts`: aligned unmatched error assertions with the sanitizer contract.
- `mcp_server/tests/memory-save-integration.vitest.ts` and `mcp_server/tests/memory-save-ux-regressions.vitest.ts`: threaded `force` options into planner-only canonical saves so forced plan-only and full-auto paths agree.
- `scripts/tests/memory-quality-phase2-pr3.test.ts`: kept frontmatter migration from downgrading explicit non-default metadata to `normal`.
- `scripts/tests/post-save-review.vitest.ts`: promoted missing manual trigger phrases to high severity.
- `mcp_server/tests/gate-d-resume-perf.vitest.ts` and `mcp_server/tests/gate-d-benchmark-session-resume.vitest.ts`: updated resume fixtures and mocks for workspace-rooted resume resolution and `loadMatchingStates`.
- `scripts/tests/session-cached-consumer.vitest.ts.test.ts`: aligned schema-version failure reason with current `schema_mismatch` contract.
- `mcp_server/tests/stdio-logging-safety.vitest.ts`: excluded Codex transport hooks and benchmark CLIs from runtime stdio scanning, matching other hook transports.
- `scripts/tests/task-enrichment.vitest.ts`: added the new spec-folder mock export and skipped the obsolete legacy rendered-memory contract test with citation to `8dd4406c77`.

## Files Modified

- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/context-server-error-envelope.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts`
- `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-resume-perf.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-benchmark-session-resume.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/stdio-logging-safety.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts`

## Verification

- `vitest run tests/cli.vitest.ts tests/context-server-error-envelope.vitest.ts tests/memory-save-integration.vitest.ts tests/memory-save-ux-regressions.vitest.ts --reporter=default` passed after the final `force` threading fix.
- `vitest run tests/gate-d-resume-perf.vitest.ts tests/gate-d-benchmark-session-resume.vitest.ts ../scripts/tests/task-enrichment.vitest.ts ../scripts/tests/session-cached-consumer.vitest.ts.test.ts tests/stdio-logging-safety.vitest.ts --reporter=default` passed: 50 passed, 10 skipped.

## Proposed Commit Message

`fix(system-spec-kit): align save and session vitest contracts`
