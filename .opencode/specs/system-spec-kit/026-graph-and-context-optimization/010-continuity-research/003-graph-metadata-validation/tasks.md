---
title: "Research: Graph Metadata Quality & Relationship Validation - Tasks"
status: complete
---

# Tasks

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

- [x] F11: Tighten `key_files` filter in `graph-metadata-parser.ts` to catch remaining 59 command-shaped strings (backtick-wrapped commands, pipe chains, flag-heavy strings). [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`; `npx vitest run tests/graph-metadata-schema.vitest.ts`; post-backfill corpus scan `command-shaped key_files = 0`]
- [x] F12: Fix backfill test (`graph-metadata-backfill.vitest.ts`) - update assertions to match new inclusive default (currently 2/3 failing). [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts`; `NODE_PATH=./mcp_server/node_modules ./mcp_server/node_modules/.bin/vitest run scripts/tests/graph-metadata-backfill.vitest.ts`]
- [x] F13: Close out root 003 and sub-phases 001-004: update status, check completed items, create the missing phase 004 plan and checklist docs. [EVIDENCE: refreshed `003/spec.md`, new `003/plan.md`, new `003/implementation-summary.md`, refreshed 001-004 packet docs]
- [x] F14: Scope entity path matching in `deriveEntities()` to current spec folder and direct parents only - prevent cross-packet mis-attribution. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`; `npx vitest run tests/graph-metadata-schema.vitest.ts`]
- [x] F15: Add status normalization map: done/completed -> complete, active/in-progress -> in_progress (6 outliers remain). [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`; post-backfill corpus scan `status outliers = 0`]
