---
title: "Fix Graph Metadata Status Derivation - Tasks"
status: complete
---
# Tasks
- [x] T-01: Preserve the override path in `mcp_server/lib/graph/graph-metadata-parser.ts` and the ranked frontmatter selection before the new fallback logic runs.
- [x] T-02: Add the checklist-aware fallback logic adjacent to `deriveStatus()` so `implementation-summary.md` promotes to `complete` only when `checklist.md` is absent or fully checked, and otherwise returns `in_progress`.
- [x] T-03: Add parser coverage for `implementation-summary + COMPLETE checklist`, `implementation-summary + incomplete checklist`, `implementation-summary + no checklist`, and explicit frontmatter precedence in `mcp_server/tests/graph-metadata-schema.vitest.ts`.
- [x] T-04: Re-run graph-metadata verification with focused typecheck and Vitest coverage before the repo-wide backfill verification pass.
- [x] T-05: Keep the status fallback localized to `deriveStatus()` and its checklist helper while leaving schema behavior unchanged.
## Verification
- [x] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [x] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-metadata-integration.vitest.ts tests/graph-metadata-schema.vitest.ts`
