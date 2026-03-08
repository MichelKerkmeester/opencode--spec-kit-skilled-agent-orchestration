# Fix F21

- Updated `.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts`.
- Replaced every placeholder crash-recovery stub in the file with `it.todo(...)` and added fixture-specific follow-up notes for real assertions.
- Added one real smoke test that verifies the `session-manager` module imports successfully and exposes callable crash-recovery exports.
- Validation run:
  - `npx vitest run tests/crash-recovery.vitest.ts`
  - `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/mcp_server/tests`

Note: the current file contained 27 explicit `expect(true).toBe(true)` stubs plus 1 additional placeholder schema test, so the fix converted the placeholder coverage present in the file as-is.
