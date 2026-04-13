---
title: "Deep Review Remediation — Execution Plan"
status: planned
parent_spec: 016-deep-review-remediation/spec.md
---

# Execution Plan

## Approach

Fix all 22 findings in 3 waves, ordered by dependency and risk:

### Wave 1: Quick Doc Fixes (P1-1 through P1-12, P2-3, P2-4)
14 documentation-only changes. No code logic changes. No migration risk.

| # | Finding | File(s) | Change |
|---|---------|---------|--------|
| 1 | P1-1 | `templates/handover.md`, `templates/debug-delegation.md` | Replace memory-file language with `generate-context.js` + `_memory.continuity` guidance |
| 2 | P1-2 | `002-gate-b-foundation/spec.md` | Remove archived_hit_rate and archive-ranking requirements |
| 3 | P1-3 | `system-spec-kit/SKILL.md` | Allow direct `_memory.continuity` edits per ADR-004 |
| 4 | P1-4 | `AGENTS.md`, `CLAUDE.md`, `command/memory/save.md` | Narrow "any spec doc" to "implementation-summary.md" |
| 5 | P1-5 | `002-cache-warning-hooks/spec.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Describe autosave as intended stop-hook behavior |
| 6 | P1-6 | `003-memory-quality-remediation/spec.md` + child specs | Update status fields Draft→complete where implementation-summary confirms shipped |
| 7 | P1-7 | `command/memory/save.md` | Add graph-metadata.json refresh to save output description |
| 8 | P1-8 | `command/memory/manage.md` | Add graphMetadataFiles as 4th scan source |
| 9 | P1-9 | `mcp_server/lib/graph/README.md` | Add graph-metadata-parser.ts + graph-metadata-schema.ts |
| 10 | P1-10 | `mcp_server/lib/config/README.md` | Update to 10 spec types, remove memory/ examples |
| 11 | P1-11 | `001-research/research/archive/research-v1-iter-8.md` | Add note that v1 snapshot predates folder normalization |
| 12 | P1-12 | sk-deep-review, sk-deep-research, system-spec-kit playbooks | Finish prose conversion (### Prompt, ### Commands, ### Expected, etc.) |
| 13 | P2-3 | `005/scratch/test-prompts-all-clis.md` | Fix detector provenance to reference code_graph_scan |
| 14 | P2-4 | `system-spec-kit/SKILL.md` | Add graph-metadata refresh note to context-preservation section |

### Wave 2: Code Fixes (P1-13 through P1-16)
4 code changes requiring typecheck verification.

| # | Finding | File(s) | Change |
|---|---------|---------|--------|
| 1 | P1-13 | `lib/storage/causal-edges.ts:267`, `lib/search/vector-index-schema.ts:621` | Extend edge identity to include anchor columns in dedup logic |
| 2 | P1-14 | `handlers/memory-save.ts:997`, `lib/routing/content-router.ts:938` | Derive phase anchor from context instead of hardcoding phase-1 |
| 3 | P1-15 | `lib/search/vector-index-schema.ts:1444-1450,2299-2305` | Remove shared_space_id column definitions or document as explicit exception |
| 4 | P1-16 | `.gemini/settings.json:31` | Replace absolute path with repo-relative convention |

### Wave 3: Test + Packet Fixes (P1-17, P1-18, P2-1, P2-2)
4 changes to test coverage and packet framing.

| # | Finding | File(s) | Change |
|---|---------|---------|--------|
| 1 | P1-17 | `015/scratch/manual-playbook-results/manual-playbook-results.json` | Reclassify PASS entries with unresolved required signals as FAIL |
| 2 | P1-18 | `015/spec.md`, `implementation-summary.md`, `tasks.md` | Reframe from "full execution" to "coverage accounting" |
| 3 | P2-1 | `tests/content-router.vitest.ts`, `tests/handler-memory-save.vitest.ts` | Add phase-2/phase-3 routing test cases |
| 4 | P2-2 | `tests/memory-context.resume-gate-d.vitest.ts` | Expand fixtures to cover broader continuity sources |

## Verification

After all 3 waves:
1. `npx tsc --noEmit` in mcp-server → pass
2. `npx tsc --noEmit` in scripts → pass
3. `npx vitest run` on affected test files → pass
4. Grep for stale patterns: no `memory/*.md` in templates, no `shared_space_id` in schema (or documented exception), no absolute paths in .gemini
