# README Audit A12 — lib/errors, lib/manage, lib/learning

**Date**: 2026-03-08
**Auditor**: Claude Opus 4.6
**Base path**: `.opencode/skill/system-spec-kit/mcp_server/lib/`

---

## 1. lib/errors/

**Status**: UPDATED

**Actual files**:
- `core.ts` — MemoryError class, timeout wrapper, error utilities, response builder
- `recovery-hints.ts` — 50 error codes with recovery guidance, tool-specific hints for 6 tools
- `index.ts` — Barrel re-export of core.ts and recovery-hints.ts
- `README.md`

**Issues found (2)**:

| # | Issue | Severity | Resolution |
|---|-------|----------|------------|
| 1 | Key Statistics table stated "49" error codes; actual count in `ERROR_CODES` is **50** (E001-E004, E010-E014, E020-E025, E030-E033, E040-E044, E050-E053, E060-E063, E070-E072, E080-E084, E090-E093, E100-E103, E429, E503) | Minor | Updated to 50 |
| 2 | Tool-Specific Hints stated "5 tools" listing memory_search, checkpoint_restore, memory_save, memory_index_scan, memory_drift_why; actual `TOOL_SPECIFIC_HINTS` object has **6 tools** (missing `memory_causal_link`) | Minor | Updated to 6 tools, added memory_causal_link |

**Checks passed**:
- [x] README lists ALL files currently in the folder
- [x] File descriptions accurate (core.ts, recovery-hints.ts, index.ts)
- [x] Module structure reflects actual code
- [x] YAML frontmatter present (title, description, trigger_phrases)
- [x] Numbered ALL CAPS H2 sections (1. OVERVIEW through 5. RELATED RESOURCES)
- [x] No HVR-banned words
- [x] Exports reference matches actual exports from both source files

**Actions taken**: Updated error code count from 49 to 50 and tool-specific hints count from 5 to 6 (added `memory_causal_link`).

---

## 2. lib/manage/

**Status**: PASS

**Actual files**:
- `pagerank.ts` — Iterative PageRank algorithm (computePageRank, GraphNode, PageRankResult)
- `README.md`

**Issues found**: None

**Checks passed**:
- [x] README lists ALL files currently in the folder (pagerank.ts only)
- [x] File descriptions accurate — purpose, exports, spec reference all match code
- [x] Module structure reflects actual code (types, constants, algorithm sections all verified)
- [x] YAML frontmatter present (title, description, trigger_phrases)
- [x] Numbered ALL CAPS H2 sections (1. OVERVIEW through 5. RELATED)
- [x] No HVR-banned words
- [x] Algorithm description matches implementation (damping 0.85, default 10 iterations, convergence 1e-6)
- [x] Type definitions in README match actual TypeScript interfaces
- [x] Usage examples reference correct function signatures

---

## 3. lib/learning/

**Status**: PASS

**Actual files**:
- `corrections.ts` — Correction tracking, stability adjustments, query functions, batch operations
- `index.ts` — Barrel re-export of corrections.ts
- `README.md`

**Issues found**: None

**Checks passed**:
- [x] README lists ALL files currently in the folder (corrections.ts, index.ts)
- [x] File descriptions accurate — correction types, stability multipliers, core/convenience functions all match code
- [x] Module structure reflects actual code
- [x] YAML frontmatter present (title, description, trigger_phrases)
- [x] Numbered ALL CAPS H2 sections (1. OVERVIEW through 5. RELATED RESOURCES)
- [x] No HVR-banned words
- [x] Correction types (superseded, deprecated, refined, merged) match CORRECTION_TYPES constant
- [x] Stability multipliers (0.5x penalty, 1.2x boost) match CORRECTION_STABILITY_PENALTY and REPLACEMENT_STABILITY_BOOST
- [x] All listed functions verified in source (record_correction, undo_correction, get_corrections_for_memory, get_correction_chain, get_corrections_stats, deprecate_memory, supersede_memory, refine_memory, merge_memories)

---

## Summary

| Folder | Status | Issues | Actions |
|--------|--------|--------|---------|
| `lib/errors/` | UPDATED | 2 (stale counts) | Fixed error code count 49->50, tool count 5->6 |
| `lib/manage/` | PASS | 0 | None |
| `lib/learning/` | PASS | 0 | None |
