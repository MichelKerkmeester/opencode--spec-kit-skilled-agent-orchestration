# Cross-AI Review Report

Date: 2026-03-07
Spec Folder: `specs/02--system-spec-kit/022-hybrid-rag-fusion/008-combined-bug-fixes`

## Confirmed Findings Applied

- Fixed the `community-detection.ts` lint blocker caused by unused debounce state.
- Fixed `memory_health` divergent-alias reporting so it:
  - preserves `.opencode/specs/...` vs `specs/...` distinctions,
  - redacts canonical group paths,
  - avoids double-redacting variant paths,
  - handles Windows-style separators.
- Fixed checkpoint scoping so folder-scoped checkpoints no longer snapshot the entire causal edge table, and scoped restore converges touched graph edges instead of leaving stale edges behind.
- Fixed the workflow/config path so `runWorkflow()` passes explicit `specFolderArg` through the call chain instead of mutating `CONFIG.DATA_FILE` / `CONFIG.SPEC_FOLDER_ARG`.
- Fixed adaptive fusion partial-rollout behavior to fail closed when no rollout identity is available.

## Documentation Follow-Up Required

- Update packet docs so verification status reflects the current post-fix state:
  - `npm run check` now passes.
  - `npm run check:full` now also passes after follow-up fixes and contract alignment.
- Normalize merged-source provenance tables and stale references to prior packet IDs.
- Correct any claims about missing artifacts, deferred checks, or completion status that no longer match the tree.

## Notes

- This report was created as scratch evidence for the combined bug-fix packet update.
- Documentation and verification follow-up is complete once the canonical packet markdown reflects the final green verification state captured in `scratch/verification-logs/2026-03-07-mcp-check-full.md`.
