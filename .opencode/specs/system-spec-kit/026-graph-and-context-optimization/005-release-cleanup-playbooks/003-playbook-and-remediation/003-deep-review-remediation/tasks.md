---
title: "Deep Review Remediation — Tasks"
status: complete
---

# Tasks

## Wave 1: Documentation Fixes

- [x] T-01: Rewrite `templates/handover.md:81` — remove standalone memory file instructions, add `generate-context.js` + `_memory.continuity` guidance
- [x] T-02: Rewrite `templates/debug-delegation.md:127` — same as T-01
- [x] T-03: Strip `002-gate-b-foundation/spec.md:81` — remove archived_hit_rate and archive-ranking requirements
- [x] T-04: Update `system-spec-kit/SKILL.md:508` — allow direct `_memory.continuity` edits per ADR-004
- [x] T-05: Narrow continuity edit scope in `AGENTS.md:52`, `CLAUDE.md:35`, `command/memory/save.md:69` — "any spec doc" → "implementation-summary.md"
- [x] T-06: Update `002-cache-warning-hooks` packet docs (`spec.md:124`, `tasks.md:69`, `checklist.md:61`, `implementation-summary.md:63`) — describe autosave as intended
- [x] T-07: Update `003-memory-quality-remediation/spec.md:99-109` and child specs — status updated via graph-metadata backfill (deriveStatus now checklist-aware)
- [x] T-08: Add graph-metadata.json refresh to `command/memory/save.md:67-81`
- [x] T-09: Add 4th scan source (graphMetadataFiles) to `command/memory/manage.md:242-248`
- [x] T-10: Add graph-metadata-parser.ts + graph-metadata-schema.ts to `mcp_server/lib/graph/README.md:65-89`
- [x] T-11: Update `mcp_server/lib/config/README.md:41-42,53,107-108,189-194` — 10 spec types, remove memory/ examples
- [x] T-12: Add archive note to `001-research/research/archive/research-v1-iter-8.md:18`
- [x] T-13: Finish playbook prose conversion in sk-deep-review scenarios (replace 9-column tables with ### sections)
- [x] T-14: Finish playbook prose conversion in sk-deep-research scenarios
- [x] T-15: Finish playbook prose conversion in system-spec-kit scenarios
- [x] T-16: Fix `005/scratch/test-prompts-all-clis.md:11,13,28,30` — detector provenance → code_graph_scan
- [x] T-17: Add graph-metadata refresh note to `system-spec-kit/SKILL.md` context-preservation section

## Wave 2: Code Fixes

- [x] T-18: Fix causal edge identity in `lib/storage/causal-edges.ts:267` — include source_anchor/target_anchor in dedup logic
- [x] T-19: Fix phase-1 hardcoding in `handlers/memory-save.ts:997` — derive phase anchor from actual context via content-router
- [x] T-20: Handle `shared_space_id` in `lib/search/vector-index-schema.ts:1444-1450,2299-2305` — remove or document as explicit migration exception
- [x] T-21: Fix `.gemini/settings.json:31` — replace absolute path with repo-relative convention matching other 4 configs

## Wave 3: Test + Packet Fixes

- [x] T-22: Reclassify PASS entries with unresolved required signals in `015/scratch/manual-playbook-results.json`
- [x] T-23: Reframe `015/spec.md`, `implementation-summary.md`, `tasks.md` from "full execution" to "coverage accounting"
- [x] T-24: Add phase-2/phase-3 routing tests in `tests/content-router.vitest.ts` and `tests/handler-memory-save.vitest.ts`
- [x] T-25: Expand Gate D regression fixtures in `tests/memory-context.resume-gate-d.vitest.ts`

## Verification

- [x] T-26: `npx tsc --noEmit` in mcp-server → pass
- [x] T-27: `npx tsc --noEmit` in scripts → pass
- [x] T-28: `npx vitest run` on affected test files → pass
- [x] T-29: Grep verification — no stale patterns remain (memory/ in templates: 0, additive-only in 002: 0, absolute paths in gemini: 0, archived_hit_rate requirements struck through)
