---
title: "Resource Map: End-User Scope Default Implementation"
description: "Implementation-scoped file ledger for packet 009. Lists planned created, modified, deleted, and intentionally untouched files across the three implementation phases."
template_source: "SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1"
trigger_phrases:
  - "009 resource map"
  - "end user scope resource map"
  - "code graph indexing blast radius"
importance_tier: "high"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default"
    last_updated_at: "2026-05-02T11:41:37Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Plan tasks checklist resource-map authored"
    next_safe_action: "Begin Phase 1 implementation"
    blockers: []
    key_files:
      - "scan.ts"
      - "indexer-types.ts"
      - "index-scope.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-02-13-04-009-end-user-scope-default"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
# Resource Map: End-User Scope Default Implementation

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total implementation references**: 25
- **Planned created files**: 1
- **Planned modified files**: 24
- **Planned deleted files**: 0 source files; SQLite rows may be deleted by full-scan pruning
- **Missing on disk**: 0
- **Scope**: implementation blast radius for packet 009, derived from `research/research.md` and `research/resource-map.md`
- **Generated**: 2026-05-02T11:41:37Z

Action vocabulary: `Created`, `Modified`, `Deleted`, `Untouched`, `Cited`.
Status vocabulary: `OK` exists now, `PLANNED` may be created, `N/A` does not apply.

## §1. ADDED FILES

This packet should stay mostly additive in behavior, not file count. Create a helper file only if it prevents an import cycle or keeps policy resolution out of unrelated modules.

| Path | Action | Status | Phase | Reason |
|------|--------|--------|-------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts` | Created | PLANNED | 1 | Optional shared resolver for env plus scan override. Needed only if `indexer-types.ts` and `index-scope.ts` cannot share policy cleanly without a cycle. |

## §2. MODIFIED FILES

This section matches the current implementation diff for the packet's in-scope `mcp_server` files. The Phase 2 handler rows that were not touched by the diff were removed.

- .opencode/skill/system-spec-kit/mcp_server/code_graph/README.md
- .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/README.md
- .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/README.md
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts
- .opencode/skill/system-spec-kit/mcp_server/schemas/README.md
- .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/README.md
- .opencode/skill/system-spec-kit/mcp_server/tests/_support/README.md
- .opencode/skill/system-spec-kit/mcp_server/tests/_support/hooks/README.md
- .opencode/skill/system-spec-kit/mcp_server/tests/adversarial/README.md
- .opencode/skill/system-spec-kit/mcp_server/tests/fixtures/README.md
- .opencode/skill/system-spec-kit/mcp_server/tests/fixtures/hooks/README.md
- .opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts

Additional packet docs outside the Gate E path filter were also updated: `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` and packet-local `plan.md`, `decision-record.md`, `checklist.md`, `implementation-summary.md`, and `resource-map.md`.

## §3. DELETED FILES

| Path | Action | Status | Phase | Reason |
|------|--------|--------|-------|--------|
| None | Deleted | N/A | N/A | No source files should be deleted. Existing stale graph rows are deleted by full-scan pruning through `removeFile()`, per `research/research.md:57`. |

## §4. UNTOUCHED FILES

These files were investigated during research or are adjacent to the behavior, but implementation should leave them unchanged unless a failing test proves otherwise.

| Path | Action | Status | Reason |
|------|--------|--------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts` | Untouched | OK | Separate `skill-graph.sqlite` path; research found no structural graph dependency. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts` | Untouched | OK | Advisor status scans skill metadata separately. |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Untouched | OK | Skill graph indexing path stays separate; change only if imports reveal a direct structural graph dependency. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-reindex.ts` | Untouched | OK | CocoIndex uses its own binary and index; follow-up only. |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-status.ts` | Untouched | OK | CocoIndex readiness is separate and not part of this packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/decision-record.md` | Cited | OK | ADR-005 workflow invariance source; no edit. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/` | Cited | OK | Regression validation target; no edit. |
| `opencode.json` | Untouched | OK | Env var can be documented without changing local runtime config in this packet. |

## §5. PHASE-BY-PHASE FILE COUNT SUMMARY

| Phase | Created | Modified | Deleted | Net change |
|-------|---------|----------|---------|------------|
| Phase 1: scope helpers + tests | 0-1 | 6-7 | 0 | +0 to +1 |
| Phase 2: migration + readiness | 0 | 6-8 | 0 | 0 |
| Phase 3: docs + verification | 0 | 2-3 | 0 | 0 |
| **Total** | **0-1** | **10-15** | **0** | **+0 to +1 source files** |

## §6. ROLLBACK BLAST RADIUS

A single revert of the future implementation change should restore all source behavior. The optional helper file, if created, disappears on revert; modified TypeScript, tests, README, and env docs return to previous content.

SQLite graph rows are intentionally outside git rollback. If a default full scan prunes old skill rows and a maintainer needs those rows again, set `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` or pass `includeSkills:true`, then run `code_graph_scan({ incremental:false })`. That recreates graph rows from source files. Do not archive old rows or create shadow copies.

Before a future commit, run a revert dry-run in a throwaway worktree or branch and then run the focused Vitest plus strict spec validation commands from `plan.md`.
