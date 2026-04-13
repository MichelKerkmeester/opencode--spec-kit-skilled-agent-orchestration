---
title: "Canonical continuity save substrate"
description: "Canonical continuity save substrate routes canonical saves through contentRouter, anchorMergeOperation, atomicIndexMemory and the thin _memory.continuity block while preserving the resume ladder."
audited_post_018: true
---

# Canonical continuity save substrate

## 1. OVERVIEW

Canonical continuity save substrate routes canonical saves through contentRouter, anchorMergeOperation, atomicIndexMemory and the thin `_memory.continuity` block while preserving the resume ladder.

This is the writer-side substrate that replaced the old memory-file assumption. It classifies incoming content, merges only into legal anchors, writes atomically, and keeps the continuity payload compact enough to live inside the spec doc instead of a separate file.

## 2. CURRENT REALITY

The phase-018 writer path is split across four core modules and one supporting resume helper.

- `contentRouter` classifies incoming session content into the correct routing tier.
- `anchorMergeOperation` applies the requested merge mode inside the existing `withSpecFolderLock` envelope.
- `atomicIndexMemory` replaces the old atomic save helper and promotes the canonical spec-doc result.
- `thinContinuityRecord` keeps `_memory.continuity` as a compact frontmatter sub-block rather than a separate persistence layer.
- `resumeLadder` resolves the recovery chain in the order `handover.md -> _memory.continuity -> spec docs`.

Together these modules make spec-doc writes canonical while leaving the continuity payload as thin supporting state instead of a separate memory-file feature.

The same canonical save pass also refreshes `graph-metadata.json` for the packet. That derived surface is now checklist-aware and normalized: `status` falls back to `implementation-summary.md` presence plus checklist completion when explicit status is absent, stored values are lowercase, `trigger_phrases` are deduplicated and capped at 12, `key_files` are sanitized before storage, and entity rows are deduplicated with canonical-path preference.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/routing/content-router.ts` | Lib | Three-tier routing classifier for canonical continuity saves |
| `mcp_server/lib/merge/anchor-merge-operation.ts` | Lib | Five-mode anchor-aware merge engine |
| `mcp_server/handlers/save/atomic-index-memory.ts` | Handler | Atomic canonical save helper |
| `mcp_server/lib/continuity/thin-continuity-record.ts` | Lib | Thin `_memory.continuity` frontmatter reader/writer |
| `mcp_server/lib/resume/resume-ladder.ts` | Lib | `handover.md -> _memory.continuity -> spec docs` recovery ladder |
| `mcp_server/handlers/memory-save.ts` | Handler | Save pipeline that wires the substrate together |
| `scripts/memory/generate-context.ts` | Script | CLI save entrypoint that feeds canonical continuity writes |
| `mcp_server/lib/graph/graph-metadata-parser.ts` | Lib | Derives refreshed packet metadata from canonical docs during save/backfill |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/content-router.vitest.ts` | Routing classification coverage |
| `mcp_server/tests/anchor-merge-operation.vitest.ts` | Anchor merge mode coverage |
| `mcp_server/tests/atomic-index-memory.vitest.ts` | Atomic canonical save coverage |
| `mcp_server/tests/thin-continuity-record.vitest.ts` | `_memory.continuity` serialization coverage |
| `mcp_server/tests/resume-ladder.vitest.ts` | Recovery ladder coverage |

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Canonical continuity save substrate
- Current reality source: phase 018 canonical-continuity-refactor gate C and gate D decision records
