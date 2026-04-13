---
title: "Research: Graph Metadata Quality & Relationship Validation - Tasks"
status: planned
---

# Tasks

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

- [ ] F11: Tighten `key_files` filter in `graph-metadata-parser.ts` to catch remaining 59 command-shaped strings (backtick-wrapped commands, pipe chains, flag-heavy strings)
- [ ] F12: Fix backfill test (`graph-metadata-backfill.vitest.ts`) - update assertions to match new inclusive default (currently 2/3 failing)
- [ ] F13: Close out root 019 and sub-phases 001-004: update status, check completed items, create the missing phase 004 plan and checklist docs
- [ ] F14: Scope entity path matching in `deriveEntities()` to current spec folder and direct parents only - prevent cross-packet mis-attribution
- [ ] F15: Add status normalization map: done/completed -> complete, active/in-progress -> in_progress (6 outliers remain)
