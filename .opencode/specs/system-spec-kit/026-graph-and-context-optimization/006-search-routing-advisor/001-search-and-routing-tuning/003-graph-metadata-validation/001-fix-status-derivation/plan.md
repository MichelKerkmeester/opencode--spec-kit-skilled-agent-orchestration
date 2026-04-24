---
title: "...06-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation/plan]"
description: 'title: "Fix Graph Metadata Status Derivation - Execution Plan"'
trigger_phrases:
  - "search"
  - "routing"
  - "advisor"
  - "001"
  - "plan"
  - "fix"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
parent_spec: 001-fix-status-derivation/spec.md
status: complete
---
# Execution Plan
## Approach
This phase updates `deriveStatus()` with the safer checklist-aware fallback rather than the one-line "implementation-summary means complete" shortcut. The research showed the shortcut would incorrectly promote folders that still have incomplete checklists, so the fix should preserve frontmatter precedence and only use `implementation-summary.md` as a completion signal when the checklist is absent or already complete.

The implementation should stay inside `graph-metadata-parser.ts` and its verification surface. No metadata schema rewrite is needed for this phase, and the adjacent trigger-cap cleanup should remain out of scope unless the parser tests make that dependency unavoidable.

## Steps
1. Preserve the override and ranked frontmatter path in `mcp_server/lib/graph/graph-metadata-parser.ts:986-1013`, then add the checklist-aware fallback in `mcp_server/lib/graph/graph-metadata-parser.ts:1019-1040`.
2. Add a checklist-evaluation helper adjacent to `deriveStatus()` so `implementation-summary.md` only promotes to `complete` when `checklist.md` is absent or evaluates as complete, matching `mcp_server/lib/graph/graph-metadata-parser.ts:1024-1040`.
3. Add parser or integration coverage for the three researched cases: `implementation-summary + COMPLETE checklist`, `implementation-summary + incomplete checklist`, and `implementation-summary + no checklist`.
4. Re-run graph-metadata verification so the phase proves status derivation without auto-promoting incomplete-checklist folders; `mcp_server/tests/graph-metadata-schema.vitest.ts` is the replayable evidence surface.

## Verification
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`.
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-metadata-integration.vitest.ts tests/graph-metadata-schema.vitest.ts`.
- Confirm the status derivation still honors explicit frontmatter before falling back to checklist and implementation-summary signals.

## Risks
- Using the one-line shortcut instead of the safer fallback would recreate the false-positive risk the research quantified.
- Adding the helper in the wrong place could bypass the override or ranked frontmatter logic already in `deriveStatus()`.
- Verifying only corpus totals without scenario tests would make it hard to prove the 63 incomplete-checklist folders stay protected.
