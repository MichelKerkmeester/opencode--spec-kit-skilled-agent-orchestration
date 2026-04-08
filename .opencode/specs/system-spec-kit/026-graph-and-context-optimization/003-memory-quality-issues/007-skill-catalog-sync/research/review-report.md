---
title: "Phase 7 Review Report: Skill + Catalog Sync"
description: "Synthesized output of 10 sequential review iterations auditing downstream artifacts for drift against the post-Phase-6 memory pipeline baseline"
trigger_phrases:
  - "phase 7 review report"
  - "skill catalog sync"
  - "downstream drift audit"
importance_tier: important
contextType: "research"
---

# Phase 7 Review Report: Skill + Catalog Sync

## 1. Executive Summary

**Total findings**: 13 across 10 review surfaces
- **P0 (must-fix)**: 4 findings -> Sub-PR-14
- **P1 (should-fix)**: 8 findings -> Sub-PR-15
- **P2 (deferred)**: 1 finding -> Deferred only

**Confirmed-current surfaces**:
- Iteration 001: sk-doc feature catalog
- Iteration 002: manual testing playbook
- Iteration 005: system-spec-kit assets
- Iteration 006: system-spec-kit level templates

**Top drift themes**:
1. `generate-context.ts` still appears as the save entrypoint in inventory/reference docs that should now describe `scripts/dist/memory/generate-context.js`.
2. Operator-facing save examples were shortened past the point of being safely runnable and now omit the structured JSON payload or full runtime path.
3. MCP save fixtures still mirror the retired HTML-id plus `summary`-anchor contract instead of the current comment-only `overview` anchor contract.

## 2. Unified Update Matrix

| ID | Surface | Severity | Location | Required Update | Sub-PR |
|----|---------|----------|----------|-----------------|--------|
| F004.1 | system-spec-kit references | P0 | `.opencode/skill/system-spec-kit/references/templates/template_guide.md:600-626` | Replace `generate-context.ts` save instructions with the canonical `generate-context.js` runtime wording | Sub-PR-14 |
| F007.1 | memory commands | P0 | `.opencode/command/memory/save.md:303-305` | Replace the incomplete Step 5 table command with a full repo-relative JSON-mode command | Sub-PR-14 |
| F008.1 | memory MCP server | P0 | `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:138-169` | Remove `<a id>` fixtures and rename the overview anchor from `summary` to `overview` | Sub-PR-14 |
| F008.2 | memory MCP server | P0 | `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:64-95` | Remove `<a id>` fixtures and rename the overview anchor from `summary` to `overview` | Sub-PR-14 |
| F003.1 | system-spec-kit SKILL.md | P1 | `.opencode/skill/system-spec-kit/SKILL.md:964-969` | Rewrite the memory-generation inventory row to name the runtime `.js` entrypoint | Sub-PR-15 |
| F004.2 | system-spec-kit references | P1 | `.opencode/skill/system-spec-kit/references/templates/level_specifications.md:762-769` | Rename the `memory/` creation method from `generate-context.ts` to the runtime save script | Sub-PR-15 |
| F004.3 | system-spec-kit references | P1 | `.opencode/skill/system-spec-kit/references/memory/memory_system.md:23-26,687-688` | Update the memory system inventory and scripts list to point at `generate-context.js` | Sub-PR-15 |
| F004.4 | system-spec-kit references | P1 | `.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:77-90` | Rename the save-workflow heading so it matches the `.js` commands it documents | Sub-PR-15 |
| F007.2 | memory commands | P1 | `.opencode/command/memory/save.md:279-280` | Update the example tool-call transcript so it no longer describes `generate-context.ts` as the CLI entry point | Sub-PR-15 |
| F009.1 | agent definitions | P1 | `.opencode/agent/orchestrate.md:574-577` | Replace the bare script-plus-path handover shorthand with the canonical JSON-mode save flow | Sub-PR-15 |
| F009.2 | agent definitions | P1 | `.claude/agents/orchestrate.md:563-566` | Replace the bare script-plus-path handover shorthand with the canonical JSON-mode save flow | Sub-PR-15 |
| F010.1 | README and install guides | P1 | `.opencode/skill/system-spec-kit/README.md:548-562` | Rename the memory-scripts table entry so it distinguishes the runtime `.js` path from the TypeScript source | Sub-PR-15 |
| F004.5 | system-spec-kit references | P2 | `.opencode/skill/system-spec-kit/references/config/environment_variables.md:106-108` | Rephrase the `DEBUG` variable description to reference the save workflow instead of the source filename | Deferred |

## 3. Sub-PR-14 Rollup (P0 — must-fix)

All four P0 findings should land before the parent packet closes:

1. F004.1 — template guide still instructs operators to use `generate-context.ts`.
2. F007.1 — `memory/save.md` shows an incomplete JSON-file command in the Step 5 summary table.
3. F008.1 — pipeline-enforcement fixture still encodes removed HTML ids and the retired `summary` anchor.
4. F008.2 — UX regression fixture still snapshots the same obsolete anchor scaffold.

## 4. Sub-PR-15 Rollup (P1 — should-fix, deferrable per-row with rationale)

The P1 set is bounded and documentation-heavy:

1. F003.1 — SKILL inventory row still points at `generate-context.ts`.
2. F004.2 — level specifications table still says `generate-context.ts`.
3. F004.3 — memory system inventory/scripts list still say `generate-context.ts`.
4. F004.4 — execution methods heading still says `generate-context.ts`.
5. F007.2 — `memory/save.md` transcript example still treats `generate-context.ts` as the CLI entry point.
6. F009.1 — OpenCode orchestrate agent still gives a bare script-plus-path save command.
7. F009.2 — Claude orchestrate agent repeats the same bare save command.
8. F010.1 — README memory-scripts table still labels `generate-context.ts` as the primary workflow.

## 5. Deferred P2 Items

The following item is documented but not applied in this cycle:

- F004.5 — `environment_variables.md` still describes `DEBUG` as logging for `generate-context.ts`; this is terminology drift with low operator risk and can be cleaned up in a later pass if needed.

## 6. Cross-Surface Patterns

Three cross-surface themes appeared in multiple iterations:

- **Theme A — runtime-entrypoint fossil**: SKILL, references, command examples, and README inventory rows still name `generate-context.ts` even though the canonical executable is `scripts/dist/memory/generate-context.js`.
- **Theme B — over-shortened save examples**: command and agent handover docs were compressed into shorthand that drops the structured JSON payload or the full script path.
- **Theme C — stale anchor contract in save fixtures**: MCP regression fixtures still expect `<a id>` scaffolding and `ANCHOR:summary` around the overview block even though the live template now uses comment-only anchors and `overview`.

## 7. Verification Plan

Each Sub-PR-14 and Sub-PR-15 row is verified by:

1. Grep before-and-after: the stale string no longer appears.
2. Grep positive: the new string appears at the expected owner file.
3. The full memory-quality regression suite passes.
4. `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/007-skill-catalog-sync --strict` exits 0.
