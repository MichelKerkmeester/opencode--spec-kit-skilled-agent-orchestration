# README Audit Summary (Phase 14)

**Date**: 2026-03-08
**Agents dispatched**: 25 (5 waves of 5)
**Total folders audited**: 64+ (14 missing READMEs + 50+ existing READMEs)

---

## 1. MISSING README CREATION (14 folders)

All 14 folders now have README.md files following sk-doc format.

| # | Folder | Agent | Files | Status |
|---|--------|-------|-------|--------|
| 1 | `mcp_server/lib/graph/` | A01 | 2 TS | CREATED |
| 2 | `mcp_server/lib/chunking/` | A01 | 2 TS | CREATED |
| 3 | `mcp_server/lib/ops/` | A02 | 2 TS | CREATED |
| 4 | `mcp_server/lib/search/pipeline/` | A02 | 7 TS | CREATED |
| 5 | `mcp_server/lib/cache/scoring/` | A03 | 1 TS | CREATED |
| 6 | `mcp_server/handlers/save/` | A03 | 10 TS | CREATED |
| 7 | `mcp_server/schemas/` | A04 | 1 TS | CREATED |
| 8 | `shared/algorithms/` | A05 | 4 TS | CREATED |
| 9 | `shared/contracts/` | A05 | 1 TS | CREATED |
| 10 | `shared/lib/` | A05 | 1 TS | CREATED |
| 11 | `shared/parsing/` | A06 | 2 TS | CREATED |
| 12 | `shared/embeddings/providers/` | A06 | 3 TS | CREATED |
| 13 | `shared/mcp_server/database/` | A06 | 0 (metadata) | CREATED |
| 14 | `scripts/kpi/` | A07 | 1 SH | CREATED |

---

## 2. EXISTING README VERIFICATION (50+ folders)

### Results by status

| Status | Count | Description |
|--------|-------|-------------|
| **PASS** | 25 | README aligned with actual contents, no changes needed |
| **UPDATED** | 26 | README had drift, now corrected |

### PASS folders (no changes needed)

| Folder | Agent | Notes |
|--------|-------|-------|
| `mcp_server/lib/cognitive/` | A08 | All 10 files listed correctly |
| `mcp_server/lib/session/` | A08 | Single module matches |
| `mcp_server/lib/interfaces/` | A09 | Relocated files documented |
| `mcp_server/lib/extraction/` | A11 | All 4 files accurate |
| `mcp_server/lib/manage/` | A12 | Single file matches |
| `mcp_server/lib/learning/` | A12 | Both files accurate |
| `mcp_server/lib/providers/` | A13 | All files documented |
| `mcp_server/lib/response/` | A13 | All files documented |
| `mcp_server/lib/architecture/` | A14 | Both files accurate |
| `mcp_server/formatters/` | A16 | All 3 files listed |
| `mcp_server/hooks/` | A16 | All 4 files documented |
| `mcp_server/core/` | A15 | All 3 files accurate |
| `mcp_server/scripts/` | A24 | Single-file wrapper correct |
| `mcp_server/` (root) | A23 | Structural accuracy confirmed (cosmetic tree drift noted) |
| `scripts/spec-folder/` | A20 | All 5 files correct |
| `scripts/extractors/` | A19 | All 11 files listed |
| `scripts/loaders/` | A19 | Both files accurate |
| `scripts/renderers/` | A19 | Both files accurate |
| `scripts/ops/` | A21 | All 6 scripts listed |
| `scripts/setup/` | A21 | All 4 scripts listed |
| `scripts/templates/` | A21 | Single script correct |
| `scripts/types/` | A21 | Single file correct |
| `shared/scoring/` | A22 | Fully aligned |
| `system-spec-kit/README.md` | A25 | Zone model accurate |
| `ARCHITECTURE.md` | A25 | Boundary docs match |

### UPDATED folders (drift corrected)

| Folder | Agent | Issue | Fix |
|--------|-------|-------|-----|
| `mcp_server/lib/eval/` | A08 | Banned word "Curated" (2x), missing data subfolder | Replaced with "Hand-verified", added subfolder |
| `mcp_server/lib/storage/` | A09 | 4 files missing (consolidation, learned-triggers-schema, reconsolidation, schema-downgrade) | Added all 4, fixed count |
| `mcp_server/lib/validation/` | A09 | 1 file missing (save-quality-gate.ts) | Added with full section |
| `mcp_server/lib/cache/` | A10 | scoring/ described as symlink (it's a real dir) | Fixed tree description |
| `mcp_server/lib/config/` | A10 | Broken TOC link, phantom table row | Fixed both |
| `mcp_server/lib/telemetry/` | A10 | 3 of 4 files undocumented, wrong feature flag default | Full rewrite |
| `mcp_server/lib/scoring/` | A11 | 2 files missing (mpab-aggregation, negative-feedback), wrong count, TOC error | Fixed all |
| `mcp_server/lib/parsing/` | A11 | 1 file missing (content-normalizer.ts), wrong count | Added with features section |
| `mcp_server/lib/errors/` | A12 | Error code count wrong (49 vs 50), tool hint count wrong (5 vs 6) | Corrected counts |
| `mcp_server/lib/utils/` | A13 | Phantom file (retry.ts listed but doesn't exist), missing file (canonical-path.ts) | Swapped entries |
| `mcp_server/lib/contracts/` | A14 | Source relocated to shared/, wrong interface fields, wrong signatures | Full rewrite as proxy pointer |
| `mcp_server/lib/search/` | A14 | 3 relocated files still listed as local, 16 files missing, count wrong (34 vs 54) | Updated listing and count |
| `mcp_server/api/` | A15 | No frontmatter, non-standard sections, banned word, shallow descriptions | Full rewrite |
| `mcp_server/database/` | A15 | 2 DB files missing, stale single-database policy | Added files, fixed policy |
| `mcp_server/handlers/` | A16 | 9 modules missing from listing | Added all 9 |
| `mcp_server/tools/` | A17 | Tool count wrong (23 vs 28) | Corrected |
| `mcp_server/utils/` | A17 | 1 file missing (tool-input-schema.ts) | Added |
| `mcp_server/configs/` | A17 | 1 file missing (cognitive.ts), stale dead-config refs, wrong counts | Fixed all |
| `scripts/core/` | A18 | 1 file missing (tree-thinning.ts) | Added |
| `scripts/memory/` | A18 | Unnumbered H2 heading broke convention | Folded into OVERVIEW |
| `scripts/evals/` | A18 | No frontmatter, no standard sections, 5 scripts missing | Full rewrite |
| `scripts/lib/` | A19 | 2 files missing (topic-keywords.ts, frontmatter-migration.ts) | Added both |
| `scripts/spec/` | A20 | 1 file missing (progressive-validate.sh) | Added |
| `scripts/rules/` | A20 | 1 script missing, rule count wrong (17 vs 18) | Fixed both |
| `scripts/utils/` | A21 | Stale file count in code block (10 vs 12) | Corrected |
| `scripts/` (root) | A24 | 3 missing files, 5 missing dirs, wrong counts in 3 subsections, 7 missing related READMEs | Fixed all |
| `shared/` (root) | A22 | Unnumbered H2, missing entries in tree | Fixed format, added entries |
| `shared/embeddings/` | A22 | Missing providers/README.md in tree | Added |
| `shared/utils/` | A22 | 1 file undocumented (token-estimate.ts) | Added with new section |

---

## 3. AUTOMATED VERIFICATION RESULTS

| Check | Result |
|-------|--------|
| Source folders without README | **0** (all covered) |
| HVR-banned words in our READMEs | **0** (only node_modules hits) |
| YAML frontmatter coverage | **83/83** READMEs have frontmatter |

---

## 4. NOTABLE FINDINGS

### Full rewrites needed (4 READMEs)
- `mcp_server/api/README.md` -- non-standard format, no frontmatter
- `mcp_server/lib/telemetry/README.md` -- 3 of 4 files undocumented
- `mcp_server/lib/contracts/README.md` -- source relocated, all signatures wrong
- `scripts/evals/README.md` -- no frontmatter, no standard sections, 5 scripts missing

### Phantom/stale entries removed (2 cases)
- `mcp_server/lib/utils/README.md` listed `retry.ts` which doesn't exist
- `mcp_server/lib/search/README.md` listed 3 files relocated to `shared/algorithms/`

### Significant file count corrections
- `mcp_server/lib/search/`: 34 → 54 files
- `mcp_server/tools/`: 23 → 28 tools
- `mcp_server/lib/storage/`: 8 → 12 modules

### Cross-reference gaps (noted, not fixed)
- Root README doesn't link to ARCHITECTURE.md (A25 finding)
- ARCHITECTURE.md lacks YAML frontmatter (A25 finding)
- mcp_server root README tree has cosmetic drift from new directories (A23 finding)
