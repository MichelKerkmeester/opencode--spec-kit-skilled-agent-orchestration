---
title: "Deep Review Remediation — Fix All 50-Iteration Findings"
status: planned
level: 3
type: implementation
parent: 006-canonical-continuity-refactor
branch: main
created: 2026-04-12
---

# Deep Review Remediation

Fix all 22 findings (18 P1, 4 P2) surfaced by the 50-iteration deep review across all phases of 026-graph-and-context-optimization.

## Scope

Every finding from the gpt-5.4 xhigh deep review must be resolved:
- 18 P1 findings: documentation drift, code defects, config issues
- 4 P2 findings: test coverage gaps, advisory guidance

## Requirements

### REQ-001: Documentation/Contract Drift (12 P1 fixes)
- P1-1: Rewrite `templates/handover.md:81` and `templates/debug-delegation.md:127` to remove deprecated standalone memory file references
- P1-2: Strip stale archive-ranking/`archived_hit_rate` requirements from `002-gate-b-foundation/spec.md:81`
- P1-3: Update `system-spec-kit/SKILL.md:508` to allow direct `_memory.continuity` edits per ADR-004
- P1-4: Narrow AGENTS.md:52, CLAUDE.md:35, save.md:69 from "any spec doc" to "implementation-summary.md" for continuity edits
- P1-5: Update `002-implement-cache-warning-hooks` packet docs to describe autosave as intended stop-hook behavior
- P1-6: Batch-update `003-memory-quality-issues` parent phase map and child status fields to match shipped state
- P1-7: Add graph-metadata.json refresh mention to `command/memory/save.md`
- P1-8: Update `command/memory/manage.md:242` to document 4th scan source (graphMetadataFiles)
- P1-9: Add `graph-metadata-parser.ts` and `graph-metadata-schema.ts` to `lib/graph/README.md`
- P1-10: Update `lib/config/README.md` to reflect 10 spec types, remove `memory/` examples
- P1-11: Add archive note to `001-research/research/archive/research-v1-iter-8.md`
- P1-12: Finish playbook prose conversion in sk-deep-review, sk-deep-research, system-spec-kit playbooks

### REQ-002: Code Defects (6 P1 fixes)
- P1-13: Fix causal edge identity — extend unique constraint or add anchor-aware dedup in `causal-edges.ts:267`
- P1-14: Fix content-router `phase-1` hardcoding in `memory-save.ts:997` — derive from actual context
- P1-15: Remove `shared_space_id` column from `vector-index-schema.ts:1444-1450,2299-2305` or document as explicit exception
- P1-16: Replace hardcoded absolute path in `.gemini/settings.json:31` with repo-relative convention
- P1-17: Tighten PASS threshold in `015/scratch/manual-playbook-results.json` — unresolved required signals = FAIL
- P1-18: Reframe 015 packet from "full execution" to "coverage accounting" given 273/297 UNAUTOMATABLE

### REQ-003: Advisory Fixes (4 P2 fixes)
- P2-1: Add phase-2/phase-3 routing tests in `content-router.vitest.ts` and `handler-memory-save.vitest.ts`
- P2-2: Expand Gate D regression fixtures to cover broader spec-doc continuity
- P2-3: Fix scratch prompts in `005/scratch/test-prompts-all-clis.md` — detector provenance is on `code_graph_scan`
- P2-4: Add graph-metadata refresh note to `system-spec-kit/SKILL.md` context-preservation section

## Exit Criteria

- All 22 findings resolved with evidence
- `npx tsc --noEmit` passes for mcp-server and scripts workspaces
- No new P0/P1 findings on re-review
