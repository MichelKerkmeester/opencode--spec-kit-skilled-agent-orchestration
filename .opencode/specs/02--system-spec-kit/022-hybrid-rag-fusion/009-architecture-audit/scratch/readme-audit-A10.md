# README Audit A10 — cache, config, telemetry

**Auditor**: Claude Opus 4.6
**Date**: 2026-03-08
**Base path**: `.opencode/skill/system-spec-kit/mcp_server/lib/`

---

## 1. `cache/` — UPDATED

**Status**: UPDATED (minor)

**Actual contents**:
- `tool-cache.ts`
- `embedding-cache.ts`
- `scoring/composite-scoring.ts`
- `scoring/README.md`
- `cognitive -> ../cognitive` (symlink)
- `README.md`

**Issues found**:
1. Structure tree described `scoring/` as "Cache-aware composite scoring (symlink to ../cognitive)" — misleading. `scoring/` is a real directory containing `composite-scoring.ts` (a barrel re-export) and its own `README.md`. The `cognitive` symlink is a separate entry.

**Actions taken**:
- Updated structure tree to show `scoring/` as a directory with its two files (`composite-scoring.ts`, `README.md`) and corrected the description from "symlink to ../cognitive" to "Barrel re-export of composite scoring into cache namespace".

**Other checks**:
- YAML frontmatter: present
- Numbered ALL CAPS H2 sections: yes (1. OVERVIEW through 5. RELATED RESOURCES)
- HVR banned words: none found
- File descriptions: accurate (tool-cache.ts, embedding-cache.ts match code)

---

## 2. `config/` — UPDATED

**Status**: UPDATED (minor)

**Actual contents**:
- `memory-types.ts`
- `type-inference.ts`
- `README.md`

**Issues found**:
1. TOC Markdown syntax error on line 20: `[2. KEY CONCEPTS]](#2--key-concepts)` — extra closing bracket `]` before `(`. Renders as broken link.
2. Key Files table included a phantom row `| Feature flags | 16 primary flags control subsystem behavior (see env configuration) |` — this is not a file in the directory and does not belong in the structure section.

**Actions taken**:
1. Fixed TOC link: `[2. KEY CONCEPTS](#2--key-concepts)` (removed extra `]`).
2. Removed phantom "Feature flags" row from Key Files table.

**Other checks**:
- YAML frontmatter: present
- Numbered ALL CAPS H2 sections: yes (1. OVERVIEW through 5. RELATED RESOURCES)
- HVR banned words: none found
- File listing: `memory-types.ts` and `type-inference.ts` both listed and described accurately
- Code examples match actual exports

---

## 3. `telemetry/` — UPDATED (major)

**Status**: UPDATED

**Actual contents**:
- `retrieval-telemetry.ts`
- `scoring-observability.ts`
- `trace-schema.ts`
- `consumption-logger.ts`
- `README.md`

**Issues found**:
1. **Missing files (critical)**: README listed only 1 module (`retrieval-telemetry.ts`). Three files were entirely absent from documentation:
   - `scoring-observability.ts` — Sampled (5%) scoring observation logging for N4 cold-start boost and TM-01 interference penalty
   - `trace-schema.ts` — Canonical schema and runtime validation for `TelemetryTracePayload`
   - `consumption-logger.ts` — Agent consumption event logging with pattern detection (deprecated/disabled after Sprint 7)
2. **Feature flag default wrong**: README stated `SPECKIT_EXTENDED_TELEMETRY` default is `true`. Code shows default is `false` (`process.env.SPECKIT_EXTENDED_TELEMETRY === 'true'` — opt-in, not opt-out).
3. **Module count wrong**: Key Statistics table said "Modules: 1" — actual count is 4.
4. **Structure tree incomplete**: Only showed `retrieval-telemetry.ts` and `README.md`.

**Actions taken**:
- Rewrote README to document all 4 source files with accurate descriptions
- Corrected feature flag default from `true` to `false`
- Updated module count from 1 to 4
- Added feature flags table covering all 3 relevant flags plus the deprecated `SPECKIT_CONSUMPTION_LOG`
- Added sections for Scoring Observability, Trace Schema, and Consumption Logger in FEATURES
- Added usage examples for scoring observability (Example 3) and trace validation (Example 4)
- Updated Related Resources to include `lib/scoring/README.md`
- Bumped version to 1.8.0 and date to 2026-03-08

**Other checks**:
- YAML frontmatter: present (updated trigger phrases to cover new modules)
- Numbered ALL CAPS H2 sections: yes (1. OVERVIEW through 5. RELATED RESOURCES)
- HVR banned words: none found

---

## Summary

| Folder | Status | Issues | Severity |
|--------|--------|--------|----------|
| `cache/` | UPDATED | 1 (misleading scoring/ description in tree) | Low |
| `config/` | UPDATED | 2 (broken TOC link, phantom table row) | Low |
| `telemetry/` | UPDATED | 4 (3 missing files, wrong feature flag default) | High |
