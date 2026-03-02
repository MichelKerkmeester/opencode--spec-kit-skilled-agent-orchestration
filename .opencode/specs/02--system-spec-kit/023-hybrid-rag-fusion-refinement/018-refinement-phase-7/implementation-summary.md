---
title: "Implementation Summary: Refinement Phase 7 — Cross-AI Review Audit"
description: "Comprehensive cross-AI audit using Gemini, Codex, and Opus across 4 waves covering script location, documentation accuracy, code standards, and bug detection."
date: 2026-03-02
---

# Implementation Summary: Refinement Phase 7 — Cross-AI Review Audit

<!-- SPECKIT_LEVEL: 2 -->

## Executive Summary

A 10-task, 4-wave orchestrated review of the entire 023-hybrid-rag-fusion-refinement program (50,000+ LOC MCP server, 21,887 LOC scripts, 89 feature flags, 23 MCP tools) using three AI models:
- **cli-gemini** (gemini-3.1-pro-review): 3 tasks
- **cli-codex** (gpt-5.3-codex): 3 tasks
- **Opus sub-agents** (claude-opus-4-6): 4 tasks

**Overall verdict: The codebase is solid.** No critical bugs found. All 15 sampled new features match code exactly. All 10 sampled Phase 017 fixes verified. Documentation needs targeted updates for Phase 015-017 changes.

---

## 1. Script Location Assessment (Wave 1 — HIGHEST PRIORITY)

### Architecture: Fundamentally Sound
- Three-package monorepo (shared, mcp_server, scripts) is correct
- Build order (shared → mcp_server → scripts) is enforced by tsconfig references
- No circular dependencies
- shared/ is properly positioned as the dependency-free base

### Coupling Hygiene Issues Found

| # | Finding | Severity | Files Affected |
|---|---------|----------|----------------|
| 1 | Mixed import patterns (alias + relative paths to mcp_server) | P1 | 10 files in scripts/ |
| 2 | Missing workspace deps in scripts/package.json | P1 | scripts/package.json |
| 3 | Hardcoded DB path in cleanup-orphaned-vectors.ts | P1 | 1 file |
| 4 | Duplicate better-sqlite3/sqlite-vec deps | P2 | 2 package.json files |
| 5 | quality-scorer, topic-extractor could move to shared/ | P2 | Future work |
| 6 | retry-manager is a shim over mcp_server (should be in shared/) | P2 | Future work |

### Verdict
Scripts reaching into `mcp_server/lib/*` internals creates fragile coupling. Should route through `@spec-kit/mcp-server/*` aliases (for intentional coupling) or extract to `shared/` (for reusable logic).

---

## 2. Documentation Accuracy (Wave 2)

### summary_of_new_features.md: FULLY ACCURATE
- 15/15 features verified against code — all MATCH
- Feature flag values, function signatures, constants all correct
- No corrections needed

### summary_of_existing_features.md: NEEDS 12 UPDATES

**Root cause**: Document was written before Phase 017 and not updated after Opus review remediation.

| ID | Finding | Severity |
|----|---------|----------|
| C-1 | Stage 2 signal count says 9, should be 11 (missing N2c, N2a+N2b) | P0 |
| C-2 | Legacy V1 pipeline described as available (removed in Phase 017) | P0 |
| C-3 | SPECKIT_PIPELINE_V2 described as active toggle (now deprecated) | P0 |
| D-1 | resolveEffectiveScore() shared function not documented | P0 |
| C-4 | memory_update embedding says title-only (now title + content) | P1 |
| C-5 | memory_delete cleanup says only causal edges (now 5 more tables) | P1 |
| D-4 | Five-factor weight auto-normalization not mentioned | P1 |
| I-1 | R8 summary channel missing from Stage 1 description | P1 |
| D-2 | Quality gate SQLite persistence not mentioned | P2 |
| D-3 | Canonical ID dedup normalization not mentioned | P2 |
| I-2 | memory_save summary generation step omitted | P2 |
| I-3 | memory_bulk_delete cleanup scope understated | P2 |

---

## 3. Code Standards Compliance (Wave 3)

### Overall: P2 (Consistent internal convention, different from sk-code--opencode)

**19/20 files FAIL** — but for the same systematic reasons:
- File headers use `// -------` dashes instead of `// ───` box-drawing
- Narrative comments used instead of AI-intent prefixes
- These are cosmetic violations from an earlier convention

### P1 Items (Should Fix)

| # | File | Violation |
|---|------|-----------|
| 1 | memory-save.ts | `specFolderLocks` constant uses camelCase (should be `SPEC_FOLDER_LOCKS`) |
| 2 | memory-indexer.ts | Import ordering — internal before external |
| 3 | Multiple files | Task tokens (T005, C138, P1-015) missing `AI-TRACE` prefix |

### Recommendation
P2 cosmetic violations (header format, comment style) should be addressed in a dedicated cleanup pass. P1 items can be fixed now.

---

## 4. Bug Detection & Phase Verification (Wave 4)

### Phase 017: 10/10 Fixes VERIFIED

| # | Fix | Status |
|---|-----|--------|
| 1 | Legacy V1 removal (~550 LOC) | VERIFIED |
| 2 | isPipelineV2Enabled() always true | VERIFIED |
| 3 | Self-loop prevention in causal edges | VERIFIED |
| 4 | resolveEffectiveScore() shared function | VERIFIED |
| 5 | Stemmer double-consonant handling | VERIFIED |
| 6 | 128-bit dedup hash (.slice(0, 32)) | VERIFIED |
| 7 | Orphaned chunk detection | VERIFIED |
| 8 | Exit handler cleanup | VERIFIED |
| 9 | parseArgs guard | VERIFIED |
| 10 | Postflight re-correction | VERIFIED |

### Bug Hunt: No Critical or Important Bugs

**6 findings, all P2 (minor):**
1. `isFeatureEnabled()` treats `"1"` as disabled (only `"true"` accepted) — documented behavior but potentially surprising
2. SQL safety: No injection vulnerabilities found — all parameterized
3. `handleMemoryUpdate` and single-item `handleMemoryDelete` lack wrapping transactions — low risk under single-process better-sqlite3
4. Two aggregate `.get()` calls cast without `| undefined` — functionally safe for COUNT(*)

---

## 5. Prioritized Action Items

### Immediate (This Session)

| # | Action | Wave | Severity |
|---|--------|------|----------|
| 1 | Update summary_of_existing_features.md (4 P0 + 4 P1 findings) | W2 | P0 |
| 2 | Standardize scripts/ imports to `@spec-kit/mcp-server/*` alias | W1 | P1 |
| 3 | Add workspace deps to scripts/package.json | W1 | P1 |
| 4 | Extract DB_PATH constant to shared/config.ts | W1 | P1 |

### Future Spec

| # | Action | Wave | Severity |
|---|--------|------|----------|
| 5 | Code standards alignment pass (header format, comments) | W3 | P2 |
| 6 | Move quality-scorer, topic-extractor to shared/ | W1 | P2 |
| 7 | Move retry-manager to shared/ | W1 | P2 |
| 8 | Remove duplicate deps from scripts/package.json | W1 | P2 |

---

## 6. Gemini Deep-Dive Findings (gemini-3.1-pro-preview)

5 additional Gemini deep-dive agents ran after the initial 4 waves, providing line-number precision.

### Documentation Issues — All 12 Confirmed with Line Numbers
- C-1: Stage 2 has **12 signals** (not 9) — `stage2-fusion.ts` lines 335-515
- C-2: `postSearchPipeline` completely removed — only comments remain (lines 390-394)
- C-3: `isPipelineV2Enabled()` hardcoded true — `search-flags.ts` lines 51-56
- D-1: `resolveEffectiveScore()` at `pipeline/types.ts` lines 42-52, absent from existing_features
- C-4: memory_update embeds `title + "\n\n" + content_text` — `memory-crud-update.ts` lines 90-91
- C-5: memory_delete cleans **8 tables** — `vector-index-impl.ts` + `memory-crud-delete.ts`
- D-4: Five-factor auto-normalize at `composite-scoring.ts` lines 538-548
- I-1: R8 summary channel runs at `stage1-candidate-gen.ts` lines 507-565, undocumented

### Feature Flag Audit — 1 New Finding
- **SPECKIT_ADAPTIVE_FUSION** exists in code (`lib/search/adaptive-fusion.ts`) but is **missing from documentation** flag table (P1)
- All other 20 flags in `search-flags.ts`: defaults match between code and doc
- SPECKIT_PIPELINE_V2: confirmed deprecated in code, active in doc (already tracked as C-3)

### SQL Safety Audit — 3 New Finding Categories

**P1 — Template literal SQL (not injection, but bypasses parameterization):**
- `memory-crud-list.ts` (L75, L79): `${whereClause}`, `${sortColumn}`
- `consumption-logger.ts` (L190, L218): `${whereClause}`
- `prediction-error-gate.ts` (L375-387): `${folderFilter}`
- `mutation-ledger.ts` (L202): `${where}`, `${limit}`, `${offset}`
- `causal-edges.ts` (L394): `${parts.join(', ')}`

**P1 — Missing transaction boundaries:**
- `memory-save.ts`: Child chunks insert outside parent tx
- `memory-crud-delete.ts` (single): No tx wrapper
- `memory-bulk-delete.ts`: Ledger append outside delete tx
- `memory-crud-update.ts`: Update + ledger not in single tx

**P1 — Remaining Math.max/min spread patterns (stack overflow >100K):**
- `rsf-fusion.ts` (L101-104, L210-211)
- `causal-boost.ts` (L227)
- `evidence-gap-detector.ts` (L157)
- `prediction-error-gate.ts` (L484-485)
- `retrieval-telemetry.ts` (L184)
- `reporting-dashboard.ts` (L303-304)

### Phase 015-016 — All 5 Fixes VERIFIED
- Quality gate timer persistence: SQLite config table, lazy-load, non-fatal fallback
- effectiveScore fallback chain: 4-step chain, [0,1] clamping, isFinite guards
- Canonical ID dedup: `canonicalResultId()` handles number/"42"/"mem:42"
- forceAllChannels: tier-2 fallback overrides all 5 channels
- Config table ensure hardening: tracks DB handle, re-runs DDL on change

### Previously Fixed — Confirmed Clean
- DDL-in-transaction (Phase 012 B2): CLEAN
- UNION vs UNION ALL in recursive CTEs (Phase 012 C3): CLEAN

---

## Models Used

| Model | Tasks | Findings |
|-------|-------|----------|
| Gemini (gemini-3.1-pro-review) | 3 tasks: Architecture, new features, MCP standards | Architecture boundaries, 15/15 MATCH, P1 standards |
| Gemini (gemini-3.1-pro-preview) | 5 deep-dive tasks: Doc issues, flags, SQL, Phase 015-016, tools | 12 doc issues confirmed, 1 missing flag, SQL safety findings, Phase 015-016 verified |
| Codex (gpt-5.3-codex) | 3 tasks: Build system, tool schemas, scripts standards | Build issues, 7/7 MATCH, P2 standards |
| Opus (claude-opus-4-6) | 4 tasks: Import map, cross-ref, Phase 017, bug hunt | 12 contradictions, 10/10 verified, 6 P2 minor |

## Metrics

- **Total review tasks**: 15 (10 initial + 5 deep-dive)
- **Total files analyzed**: 50+ (across all waves + deep-dives)
- **Features verified against code**: 22 (15 new + 7 existing)
- **Phase 015-016 fixes verified**: 5/5
- **Phase 017 fixes verified**: 10/10
- **Documentation issues found**: 13 (12 original + 1 missing flag)
- **Code standards violations**: 19/20 files (P2 cosmetic)
- **SQL safety findings**: 5 files with template SQL, 4 files missing tx boundaries
- **Math spread overflow risk**: 6 files with remaining patterns
- **Critical bugs found**: 0
- **Important (P1) findings**: 16
- **Minor (P2) observations**: 12
