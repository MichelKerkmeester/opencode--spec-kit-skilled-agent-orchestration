---
title: "Research: Content Routing Classification Accuracy - Tasks"
status: complete
---

# Tasks

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

- [x] F7: Force `metadata_only` saves to always target the implementation summary doc - `resolveMetadataHostDocPath()` now prefers `implementation-summary.md` and only falls back to `spec.md` when the summary doc is missing. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`; targeted handler regression coverage in `handler-memory-save.vitest.ts`.
- [x] F8: Replace all remaining `SPECKIT_TIER3_ROUTING` conditional language in the save command docs, save workflow docs, system-spec-kit skill docs, playbook 202, and phase 004 docs - Tier 3 is always on now. Evidence: targeted doc sweep now reflects the always-on Tier 3 contract and removed-flag wording.
- [x] F9: Add missing template anchors, frontmatter blocks, and template-source headers to sub-phases 001-003 so they pass strict validation. Evidence: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .../001-gate-a-prework`, `.../002-gate-b-foundation`, and `.../003-gate-c-writer-ready` all exited `0` with `RESULT: PASSED`.
- [x] F10: Already covered by F8 (doc verification gap). Evidence: phase 004 packet docs now include the removed-flag verification sweep and always-on Tier 3 wording.
