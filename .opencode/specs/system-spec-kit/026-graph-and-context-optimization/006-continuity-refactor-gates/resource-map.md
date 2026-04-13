---
title: "Phase 006 Resource Map"
version: 3
created: 2026-04-11T18:50:00Z
updated: 2026-04-12T00:00:00Z
authors:
  - codex gpt-5.4
notes:
  - Current-reality map for packet 006 and follow-on audits
  - Replaces older phase-018 migration framing with the live canonical continuity surfaces
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["resource-map.md"]

---

# Phase 006 Canonical Continuity Refactor - Resource Map

This resource map is the quick-reference index for the live packet-006 implementation surface. It focuses on the files and directories that now define canonical continuity behavior, not the older rollout staging language.

## 1. Core Runtime Surfaces

| Surface | Key Files | Purpose |
|---|---|---|
| Resume ladder | `mcp_server/lib/resume/resume-ladder.ts`, `mcp_server/lib/continuity/thin-continuity-record.ts`, `mcp_server/handlers/session-resume.ts`, `mcp_server/handlers/session-bootstrap.ts` | Rebuild packet continuity from `handover.md`, `_memory.continuity`, and spec docs |
| Canonical save routing | `mcp_server/handlers/memory-save.ts`, `mcp_server/lib/routing/content-router.ts`, `mcp_server/lib/merge/anchor-merge-operation.ts` | Route save input into canonical spec-doc or continuity targets |
| Search and supporting recall | `mcp_server/handlers/memory-context.ts`, `mcp_server/handlers/memory-search.ts`, `mcp_server/lib/search/` | Supporting retrieval after the canonical continuity chain is known |
| Startup and hook surfaces | `mcp_server/hooks/claude/`, `mcp_server/hooks/gemini/`, `mcp_server/hooks/copilot/` | Surface startup or compaction hints without replacing `/spec_kit:resume` |
| Coverage graph | `mcp_server/handlers/coverage-graph/`, `mcp_server/lib/coverage-graph/` | Research and review loop coverage tracking and convergence signals |
| Feedback and shadow evaluation | `mcp_server/lib/feedback/` | Learned-signal logging and shadow-only evaluation helpers |

## 2. Authoring and Validation Surfaces

| Surface | Key Files | Purpose |
|---|---|---|
| CLI generation and save support | `scripts/memory/generate-context.ts`, `scripts/core/workflow.ts`, `scripts/core/post-save-review.ts`, `scripts/core/memory-indexer.ts` | Generate supporting artifacts and enforce save quality |
| Validation | `scripts/spec/validate.sh`, `mcp_server/lib/validation/`, `scripts/evals/` | Packet validation, boundary checks, and architecture enforcement |
| Public import boundary | `mcp_server/api/` | Stable runtime surface for non-runtime callers |
| Shared modules | `shared/` | Neutral code used by both scripts and runtime |

## 3. Documentation Surfaces

| Surface | Key Files | Purpose |
|---|---|---|
| Package architecture | `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | Current-reality architecture across scripts, runtime, and shared modules |
| Runtime overview | `.opencode/skill/system-spec-kit/README.md`, `.opencode/skill/system-spec-kit/ARCHITECTURE.md`, `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md`, `.opencode/skill/system-spec-kit/nodes/phase-system.md` | Human-readable orientation for the active runtime tree |
| Subdirectory READMEs | `mcp_server/**/README.md` | Directory-level ownership, purpose, and related-module pointers |
| Packet docs | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` under packet 006 and phase subfolders | Packet-local execution truth |

## 4. Verification Surfaces

| Check | Command | Purpose |
|---|---|---|
| Runtime typecheck | `npm run --workspace=@spec-kit/mcp-server typecheck` | Validate MCP runtime TypeScript |
| Scripts typecheck | `npm run --workspace=@spec-kit/scripts typecheck` | Validate generation and validation tooling |
| Handler cycles | `node .opencode/skill/system-spec-kit/scripts/dist/evals/check-handler-cycles-ast.js` | Detect circular imports in `mcp_server/handlers/` |
| Boundary enforcement | `node .opencode/skill/system-spec-kit/scripts/dist/evals/check-architecture-boundaries.js` | Enforce package boundary rules |
| Packet validation | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict <phase-folder>` | Enforce packet completeness and markdown contracts |

## 5. Current-Reality Notes

- Canonical continuity now centers on `/spec_kit:resume`, not a memory-first recovery path.
- `_memory.continuity` is the compact continuity record, not a replacement for spec docs.
- Generated memory files remain supporting context for retrieval and evidence, not the operator-facing continuity backbone.
- The runtime tree now includes dedicated `lib/continuity/`, `lib/resume/`, `lib/routing/`, `lib/merge/`, `lib/coverage-graph/`, and `lib/feedback/` surfaces that must stay documented together.

## 6. Related

- `013-dead-code-and-architecture-audit/`
- `.opencode/skill/system-spec-kit/ARCHITECTURE.md`
- `.opencode/skill/system-spec-kit/ARCHITECTURE.md`
