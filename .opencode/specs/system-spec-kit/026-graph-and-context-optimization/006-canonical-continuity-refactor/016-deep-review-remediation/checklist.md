---
title: "Deep Review Remediation — Checklist"
status: complete
---

# Verification Checklist

## P0 (Blocking)

- [x] P0-1: All 18 P1 findings have corresponding fixes with evidence. All tasks T-01 through T-29 complete.
- [x] P0-2: `npx tsc --noEmit` passes in mcp-server workspace. Evidence: current `npx tsc --noEmit` passed in `.opencode/skill/system-spec-kit/mcp_server`.
- [x] P0-3: `npx tsc --noEmit` passes in scripts workspace. Evidence: current `npx tsc --noEmit` passed in `.opencode/skill/system-spec-kit/scripts`.
- [x] P0-4: No new typecheck errors introduced by code changes. Evidence: both current typechecks passed, plus the targeted Vitest verification run passed cleanly.

## P1 (Should Fix)

- [x] P1-1: `templates/handover.md` no longer references standalone `memory/*.md` files. Evidence: `templates/handover.md` now points to `generate-context.js` and `_memory.continuity` in `implementation-summary.md`.
- [x] P1-2: `templates/debug-delegation.md` no longer references standalone `memory/*.md` files. Evidence: `templates/debug-delegation.md` now uses the same `generate-context.js` plus `implementation-summary.md` continuity guidance.
- [x] P1-3: `002-gate-b-foundation/spec.md` no longer requires archived_hit_rate or archive-ranking. Evidence: 4 stale requirements struck through with DELETE-not-archive note.
- [x] P1-4: `system-spec-kit/SKILL.md` allows direct `_memory.continuity` edits. Evidence: `SKILL.md` explicitly allows direct continuity edits in `implementation-summary.md`.
- [x] P1-5: AGENTS.md, CLAUDE.md, save.md specify `implementation-summary.md` for continuity edits. Evidence: all three docs now scope direct continuity edits to `implementation-summary.md`.
- [x] P1-6: Stop-hook packet docs describe autosave as intended behavior. Evidence: packet `002-implement-cache-warning-hooks` now describes `runContextAutosave()` as the intended producer boundary in `spec.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.
- [x] P1-7: `003-memory-quality-issues` parent + child status fields match shipped state. Evidence: graph-metadata.json shows status "complete" via checklist-aware deriveStatus().
- [x] P1-8: `command/memory/save.md` mentions graph-metadata.json refresh. Evidence: `save.md` now calls out `graph-metadata.json` refresh in the primary save workflow and output contract.
- [x] P1-9: `command/memory/manage.md` documents 4 scan sources including graphMetadataFiles. Evidence: `manage.md` now lists `graphMetadataFiles` as scan source 4.
- [x] P1-10: `lib/graph/README.md` lists graph-metadata-parser.ts and graph-metadata-schema.ts. Evidence: `mcp_server/lib/graph/README.md` names both files in the module inventory table.
- [x] P1-11: `lib/config/README.md` reflects 10 spec types without memory/ examples. Evidence: `mcp_server/lib/config/README.md` now lists 10 spec document types and uses canonical spec-doc examples instead of `memory/` paths.
- [x] P1-12: Archive v1 snapshot has normalization note. Evidence: `001-research-graph-context-systems/research/archive/research-v1-iter-8.md` now starts with an archive normalization note.
- [x] P1-13: Playbook prose conversion complete across all 3 skill roots. Evidence: the three manual testing playbooks now use `###` scenario sections instead of the old wide scenario tables.
- [x] P1-14: `causal-edges.ts` dedup includes anchor columns. Evidence: `causal-edges.ts` now keys dedup and lookup on `source_anchor` plus `target_anchor`.
- [x] P1-15: `memory-save.ts` derives phase anchor from context, not hardcoded phase-1. Evidence: `memory-save.ts` now computes `likelyPhaseAnchor`, and routing tests cover phase-2 and phase-3 task updates.
- [x] P1-16: `shared_space_id` removed from schema or documented as explicit exception. Evidence: `vector-index-schema.ts` now retains `shared_space_id` with an explicit backward-compatibility exception comment in both migration and schema definitions.
- [x] P1-17: `.gemini/settings.json` uses repo-relative path. Evidence: `.gemini/settings.json` uses `cwd: "."` with repo-relative command paths.
- [x] P1-18: 015 PASS entries with unresolved signals reclassified. Evidence: `015-full-playbook-execution/tasks.md` and `implementation-summary.md` record `EX-001` as `PARTIAL` and `EX-006` as `FAIL`.
- [x] P1-19: 015 packet reframed as coverage accounting. Evidence: the `015-full-playbook-execution` `spec.md`, `tasks.md`, and `implementation-summary.md` now describe the run as coverage accounting rather than full execution.
- [x] P1-20: `npx vitest run` on affected test files passes. Evidence: current targeted `npx vitest run` passed with 15 files and 363 tests.

## P2 (Advisory)

- [x] P2-1: Phase-2/phase-3 routing tests added. Evidence: `content-router.vitest.ts` and `handler-memory-save.vitest.ts` both cover phase-2 and phase-3 routing cases.
- [x] P2-2: Gate D regression fixtures expanded. Evidence: `memory-context.resume-gate-d.vitest.ts` now exercises handover, continuity, malformed continuity, and spec-doc fallback fixtures.
- [x] P2-3: Scratch prompts reference code_graph_scan for detector provenance. Evidence: `005-code-graph-upgrades/scratch/test-prompts-all-clis.md` now points detector-provenance checks at `code_graph_scan`.
- [x] P2-4: SKILL.md notes graph-metadata refresh in context-preservation section. Evidence: `system-spec-kit/SKILL.md` now states that canonical saves refresh `graph-metadata.json`.
