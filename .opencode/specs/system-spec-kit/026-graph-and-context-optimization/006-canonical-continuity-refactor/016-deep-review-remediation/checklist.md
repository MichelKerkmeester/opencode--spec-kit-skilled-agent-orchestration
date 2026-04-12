---
title: "Deep Review Remediation — Checklist"
status: planned
---

# Verification Checklist

## P0 (Blocking)

- [ ] P0-1: All 18 P1 findings have corresponding fixes with evidence
- [ ] P0-2: `npx tsc --noEmit` passes in mcp-server workspace
- [ ] P0-3: `npx tsc --noEmit` passes in scripts workspace
- [ ] P0-4: No new typecheck errors introduced by code changes

## P1 (Should Fix)

- [ ] P1-1: `templates/handover.md` no longer references standalone `memory/*.md` files
- [ ] P1-2: `templates/debug-delegation.md` no longer references standalone `memory/*.md` files
- [ ] P1-3: `002-gate-b-foundation/spec.md` no longer requires archived_hit_rate or archive-ranking
- [ ] P1-4: `system-spec-kit/SKILL.md` allows direct `_memory.continuity` edits
- [ ] P1-5: AGENTS.md, CLAUDE.md, save.md specify `implementation-summary.md` for continuity edits
- [ ] P1-6: Stop-hook packet docs describe autosave as intended behavior
- [ ] P1-7: `003-memory-quality-issues` parent + child status fields match shipped state
- [ ] P1-8: `command/memory/save.md` mentions graph-metadata.json refresh
- [ ] P1-9: `command/memory/manage.md` documents 4 scan sources including graphMetadataFiles
- [ ] P1-10: `lib/graph/README.md` lists graph-metadata-parser.ts and graph-metadata-schema.ts
- [ ] P1-11: `lib/config/README.md` reflects 10 spec types without memory/ examples
- [ ] P1-12: Archive v1 snapshot has normalization note
- [ ] P1-13: Playbook prose conversion complete across all 3 skill roots
- [ ] P1-14: `causal-edges.ts` dedup includes anchor columns
- [ ] P1-15: `memory-save.ts` derives phase anchor from context, not hardcoded phase-1
- [ ] P1-16: `shared_space_id` removed from schema or documented as explicit exception
- [ ] P1-17: `.gemini/settings.json` uses repo-relative path
- [ ] P1-18: 015 PASS entries with unresolved signals reclassified
- [ ] P1-19: 015 packet reframed as coverage accounting
- [ ] P1-20: `npx vitest run` on affected test files passes

## P2 (Advisory)

- [ ] P2-1: Phase-2/phase-3 routing tests added
- [ ] P2-2: Gate D regression fixtures expanded
- [ ] P2-3: Scratch prompts reference code_graph_scan for detector provenance
- [ ] P2-4: SKILL.md notes graph-metadata refresh in context-preservation section
