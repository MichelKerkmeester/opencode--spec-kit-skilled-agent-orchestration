# Review Summary: Phase 009

## Scope

- `.opencode/skill/system-spec-kit/**` (excluding `node_modules/` and `dist/`)
- `.opencode/skill/system-spec-kit/mcp_server/**` (excluding `node_modules/` and `dist/`)
- `.opencode/skill/sk-code--opencode/**` for standards propagation

## Findings Consolidated

- Archive/create script paths were vulnerable to path confusion/traversal-style misuse due to weak containment checks.
- Checkpoint flows could emit rollback guidance even when checkpoint creation returned `null`.
- `checkpoint_restore` handler always returned success even when restore reported errors.
- Hybrid search `contextType` filtering missed snake_case rows (`context_type`).
- Node 18 compatibility risk in recursive directory scan due to `readdirSync(..., { recursive: true })`.
- JSON output from `check-prerequisites.sh` could become invalid without escaping.

## Implemented Remediation

- Hardened archive and restore path containment in `scripts/spec/archive.sh`.
- Hardened `--subfolder` and `--parent` path validation in `scripts/spec/create.sh`.
- Added JSON escaping in `scripts/setup/check-prerequisites.sh`.
- Upgraded canonical path sanitization in `scripts/utils/path-utils.ts`.
- Added Node 18-safe recursive fallback in `mcp_server/lib/storage/transaction-manager.ts`.
- Converted checkpoint create/restore handler failures to MCP error responses in `mcp_server/handlers/checkpoints.ts`.
- Enforced truthful checkpoint behavior in:
  - `mcp_server/handlers/memory-bulk-delete.ts`
  - `mcp_server/handlers/memory-crud-delete.ts`
- Fixed hybrid search context type filtering in `mcp_server/handlers/memory-search.ts`.
- Added/updated tests:
  - `mcp_server/tests/handler-checkpoints.vitest.ts`
  - `mcp_server/tests/memory-search-quality-filter.vitest.ts`
- Propagated standards updates in:
  - `.opencode/skill/sk-code--opencode/SKILL.md`
  - `.opencode/skill/sk-code--opencode/references/shared/universal_patterns.md`
  - `.opencode/skill/sk-code--opencode/assets/checklists/universal_checklist.md`

## Follow-Up Remediation (User-Requested)

- Updated partial-restore semantics in `mcp_server/handlers/checkpoints.ts`:
  - Full restore failure (no restored rows) => MCP error response.
  - Partial restore with warnings (restored rows + errors) => MCP success-with-warning response.
- Added checkpoint restore partial-warning regression:
  - `mcp_server/tests/handler-checkpoints.vitest.ts` (`T521-R5`)
- Added explicit null-checkpoint defensive branch regressions:
  - `mcp_server/tests/regression-010-index-large-files.vitest.ts`
    - Non-critical tier continues without rollback metadata when checkpoint returns `null`.
    - Critical tier aborts when checkpoint returns `null`.
  - `mcp_server/tests/memory-crud-extended.vitest.ts`
    - Bulk delete omits checkpoint/restore metadata when checkpoint returns `null`.
- Added explicit shell path-containment regressions:
  - `scripts/tests/test-phase-validation.js`
    - Reject outside `--subfolder` path.
    - Reject symlink escape in `--subfolder`.
    - Reject archive input outside specs root.
    - Reject restore input outside archive root.

## README Audit Result

- Full README audit ran across repo and reported:
  - template invalid: `0`
  - blocking errors: `0`
  - warnings: `0`
  - broken references: `0`
- Artifacts:
  - `scratch/readme-audit.json`
  - `scratch/readme-audit.md`
