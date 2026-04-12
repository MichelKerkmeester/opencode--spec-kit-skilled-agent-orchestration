---
title: "Plan — Phase 013 Dead Code & Architecture Audit"
status: "planned"
level: 3
parent: "006-canonical-continuity-refactor"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 013 — Dead Code & Architecture Audit

---

## Implementation Phases

### Phase 1 — Automated Scanning (~2 hours)
**Parallel sub-agents: 4**

1. **Dead imports scanner** — `tsc --noUnusedLocals --noUnusedParameters` on both workspaces + custom grep for imports of deleted modules
2. **Dead concept scanner** — grep for `shadow_only`, `shared_space_id` (active paths, not schema), `archived_hit_rate`, `dual_write`, `observation_window` in active code
3. **Console.log scanner** — grep for `console.log`, `console.error`, `console.warn` in `mcp_server/handlers/`, `mcp_server/lib/`, `scripts/core/` (not tests)
4. **Circular dependency scanner** — build import graph, detect cycles

### Phase 2 — Fix Pass (~3 hours)
**Parallel sub-agents: 6 (one per module area)**

1. `mcp_server/handlers/` — fix imports, dead branches, console usage
2. `mcp_server/lib/search/` — fix imports, dead branches, console usage
3. `mcp_server/lib/storage/` + `lib/cognitive/` — fix imports, dead branches
4. `mcp_server/lib/graph/` + `lib/merge/` + `lib/routing/` + `lib/resume/` — verify new modules clean
5. `scripts/core/` + `scripts/memory/` — fix imports, dead branches
6. `mcp_server/tools/` + `mcp_server/schemas/` — verify tool catalog matches reality

### Phase 3 — ARCHITECTURE.md + READMEs (~2 hours)
**Serial (ARCHITECTURE.md) + Parallel (READMEs)**

1. Read `mcp_server/ARCHITECTURE.md` (if exists) or top-level architecture docs
2. Diff against actual module layout: `ls -R mcp_server/lib/ mcp_server/handlers/`
3. Update or create ARCHITECTURE.md with current truth
4. Walk every directory under `mcp_server/`, check README.md exists + is accurate
5. Create missing READMEs, update stale ones

### Phase 4 — Resource Map Refresh (~1 hour)
1. Read `006-canonical-continuity-refactor/resource-map.md`
2. Add rows for new files from phases 010-012
3. Remove rows for deleted files (shared-memory, legacy memory)
4. Update verb/effort columns for modified files

### Phase 5 — Verification (~1 hour)
1. `npm run --workspace=@spec-kit/mcp-server typecheck`
2. `npm run --workspace=@spec-kit/scripts typecheck`
3. Full vitest suite on touched test files
4. `validate.sh --strict` on phase 013 packet

---

## Critical Files

| Area | Key files |
|---|---|
| Architecture | `mcp_server/ARCHITECTURE.md` or equivalent |
| Tool catalog | `mcp_server/tools/lifecycle-tools.ts`, `tool-schemas.ts` |
| Resource map | `006-canonical-continuity-refactor/resource-map.md` |
| sk-code-opencode | `.opencode/skill/sk-code-opencode/SKILL.md` (reference) |
| New modules | `lib/graph/`, `lib/resume/`, `lib/merge/`, `lib/routing/` |

---

## Dependencies
- Phase 011 (graph-metadata) must be complete (it is)
- Phase 010 (shared-memory removal) must be complete (it is)
- Re-index must be complete before resource map refresh
