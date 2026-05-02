# Wave 2 - OPUS-A5: Duplicate Code & Technical Debt

Date: 2026-03-21
Scope: `.opencode/skill/system-spec-kit/scripts/` (lib/, utils/, renderers/, spec-folder/, cross-subsystem)

---

## Duplicate Pairs Inventory

| # | File A | File B | Similarity | Canonical | Action |
|---|--------|--------|------------|-----------|--------|
| 1 | `utils/memory-frontmatter.ts` | `lib/memory-frontmatter.ts` | Re-export shim | `lib/` | Migrate importers, remove shim |
| 2 | `core/quality-scorer.ts` | `extractors/quality-scorer.ts` | Diverged (legacy vs v2) | `extractors/` | Migrate 2 test importers, remove core/ |
| 3 | `utils/phase-classifier.ts` | `lib/phase-classifier.ts` | Re-export shim | `lib/` | Migrate importers, remove shim |
| 4 | `extractors/session-activity-signal.ts` | `lib/session-activity-signal.ts` | Re-export shim | `lib/` | Migrate importers, remove shim |
| 5 | `memory/validate-memory-quality.ts` | `lib/validate-memory-quality.ts` | Re-export shim + CLI | `lib/` (logic), `memory/` (CLI entry) | Keep CLI entry, migrate logic importers |
| 6 | `lib/cli-capture-shared.ts` | 4 extractor captures | Dead code (never imported) | `lib/` (intended) | Wire in or delete |
| 7 | `utils/slug-utils.ts:slugify` | `lib/anchor-generator.ts:slugify` | Diverged signatures | Both (different domains) | Rename anchor-generator's to avoid collision |
| 8 | `core/quality-scorer.ts:clamp01` | `extractors/quality-scorer.ts:clamp01` | Identical | Extract to utils | Consolidate |
| 9 | `utils/message-utils.ts:formatTimestamp` | `lib/simulation-factory.ts:formatTimestamp` | ~80% similar (timezone diff) | Both (documented intentional) | No action (documented) |
| 10 | `extractors/session-extractor.ts:generateSessionId` | `lib/simulation-factory.ts:generateSessionId` | ~90% similar | Both (different entropy) | Low priority; consolidate if feasible |

---

## Findings

### FINDING-OPUS-A5-001 | CRITICAL | DUPLICATE | `lib/cli-capture-shared.ts` vs 4 CLI capture modules | Shared helpers extracted but never wired in | 5 functions duplicated x4 files = 20 dead copies | Wire shared imports into capture modules

**Evidence:** `lib/cli-capture-shared.ts` exports `transcriptTimestamp`, `readJsonl`, `normalizeToolName`, `extractTextContent`, `buildSessionTitle`, `sortAndSliceExchanges`, `drainPendingPrompts`, `countResponses`, `parseToolArguments`, and `MAX_EXCHANGES_DEFAULT`.

Zero files import from `../lib/cli-capture-shared`. Meanwhile:
- `transcriptTimestamp` is defined locally in all 4 CLI captures (claude-code, codex-cli, copilot-cli, gemini-cli)
- `readJsonl` is defined locally in 3 captures (claude-code, codex-cli, copilot-cli)
- `normalizeToolName` is defined locally in all 4 captures
- `extractTextContent` is defined locally in 3 captures (claude-code, codex-cli, gemini-cli)
- `buildSessionTitle` is defined locally in all 4 captures

This is the largest source of true copy-paste duplication in the scripts directory. The shared module was created as part of "CODEX2-006 deduplication" but the follow-up wiring step was never completed.

**Impact:** Any bug fix to these shared functions must be applied in 4-5 places. Behavioral drift risk is high.

---

### FINDING-OPUS-A5-002 | HIGH | DIVERGED | `core/quality-scorer.ts` vs `extractors/quality-scorer.ts` | Two quality scorers with same function name, incompatible signatures | Both export `scoreMemoryQuality` | Deprecate core/, migrate 2 test files to extractors/

**Evidence:**
- `core/quality-scorer.ts`: Legacy 8-parameter scorer (`content, triggerPhrases, keyTopics, files, observations, sufficiency, hadContamination, contaminationSeverity`). Has explicit `@deprecated` JSDoc pointing to `extractors/quality-scorer.ts`.
- `extractors/quality-scorer.ts`: V2 scorer accepting single `QualityInputs` object, uses validation-rule-based scoring (V1-V12).
- `core/workflow.ts` imports from `extractors/quality-scorer.ts` (canonical).
- Only 2 test files (`quality-scorer-calibration.vitest.ts`, `description-enrichment.vitest.ts`) still import from `core/quality-scorer.ts`.

**Impact:** Maintaining two scoring algorithms creates confusion about which score is authoritative. The legacy scorer's 8-parameter signature makes it fragile to extend.

---

### FINDING-OPUS-A5-003 | MEDIUM | DUPLICATE | `utils/memory-frontmatter.ts` shim | Pure re-export shim with 1 active importer | `core/workflow.ts` imports via shim instead of canonical `lib/` | Update import, remove shim

**Evidence:**
- `utils/memory-frontmatter.ts`: 16-line file that only re-exports from `../lib/memory-frontmatter`.
- Only 1 file imports via the shim: `core/workflow.ts` (`from '../utils/memory-frontmatter'`).
- The canonical implementation in `lib/memory-frontmatter.ts` is 167 lines with real logic.

**Impact:** Extra indirection layer; trivial to fix by updating 1 import path.

---

### FINDING-OPUS-A5-004 | MEDIUM | DUPLICATE | `utils/phase-classifier.ts` shim | Pure re-export shim with 2 active importers | `extractors/conversation-extractor.ts` and `tests/phase-classification.vitest.ts` import via shim | Update imports, remove shim

**Evidence:**
- `utils/phase-classifier.ts`: 16-line re-export shim pointing to `../lib/phase-classifier`.
- 2 files import via the shim.
- The canonical implementation in `lib/phase-classifier.ts` is 535 lines.

**Impact:** Same indirection pattern as OPUS-A5-003.

---

### FINDING-OPUS-A5-005 | MEDIUM | DUPLICATE | `extractors/session-activity-signal.ts` shim | Single-line `export * from '../lib/session-activity-signal'` with 1 direct importer | Migrate `tests/auto-detection-fixes.vitest.ts`, remove shim

**Evidence:**
- `extractors/session-activity-signal.ts`: 11-line file, single re-export.
- `extractors/index.ts` also re-exports from `../lib/session-activity-signal` directly.
- Only `tests/auto-detection-fixes.vitest.ts` imports via the extractor shim.
- `spec-folder/folder-detector.ts` already imports from the canonical `../lib/session-activity-signal`.

**Impact:** The re-export in `extractors/index.ts` makes the shim file entirely redundant.

---

### FINDING-OPUS-A5-006 | LOW | DUPLICATE | `memory/validate-memory-quality.ts` shim + CLI entry | Re-export shim that also serves as CLI entry point (`node validate-memory-quality.js <path>`) | Keep as CLI entry but document clearly

**Evidence:**
- `memory/validate-memory-quality.ts`: 66 lines. Re-exports all types and functions from `../lib/validate-memory-quality`. Also contains a `main()` function for CLI usage.
- 3 test files import via `../memory/validate-memory-quality`.
- `extractors/quality-scorer.ts` and `core/workflow.ts` import from `../lib/validate-memory-quality` directly.

**Impact:** Unlike other shims, this one has a dual role (re-export + CLI entry point). Cannot be simply deleted. Tests should import from `lib/` directly; the `memory/` file should be reduced to CLI entry only.

---

### FINDING-OPUS-A5-007 | MEDIUM | NAMING_COLLISION | `slugify` function defined in two files | `utils/slug-utils.ts:slugify(text: string): string` vs `lib/anchor-generator.ts:slugify(keywords: string[]): string` | Rename anchor-generator version to `slugifyKeywords`

**Evidence:**
- `utils/slug-utils.ts` line 104: `export function slugify(text: string)` -- Unicode-safe slug from text.
- `lib/anchor-generator.ts` line 144: `function slugify(keywords: string[])` -- joins keywords into hyphen slug. Not exported, but shares the name.

**Impact:** While the anchor-generator version is not exported, having two `slugify` functions with different signatures creates confusion during code review and search. If anchor-generator is ever refactored to export it, a collision arises.

---

### FINDING-OPUS-A5-008 | LOW | DUPLICATE | `clamp01` utility defined in 2 quality scorer files | Identical 3-line function | Extract to `utils/math-utils.ts` or inline

**Evidence:**
- `core/quality-scorer.ts` line 54: `function clamp01(value: number): number { return Math.max(0, Math.min(1, value)); }`
- `extractors/quality-scorer.ts` line 54: Identical implementation.

**Impact:** Trivial duplication. Would be resolved naturally when OPUS-A5-002 removes the legacy scorer.

---

### FINDING-OPUS-A5-009 | LOW | TECH_DEBT | `formatTimestamp` near-duplicate with documented divergence | `utils/message-utils.ts` (timezone-aware) vs `lib/simulation-factory.ts` (raw UTC) | No action needed (intentionally divergent, documented)

**Evidence:**
- Both files contain NOTE comments explaining the intentional differences:
  - `message-utils.ts`: Applies `CONFIG.TIMEZONE_OFFSET_HOURS`, logs warnings via `structuredLog`.
  - `simulation-factory.ts`: Uses raw UTC, silently falls back for invalid dates.
- Both share the same format strings and switch/case structure (~80% textually similar).

**Impact:** Documented and intentional. No action required unless a shared core is extracted with timezone as a parameter.

---

### FINDING-OPUS-A5-010 | LOW | DUPLICATE | `generateSessionId` defined in 2 files | `extractors/session-extractor.ts` (6 bytes = 12 hex chars) vs `lib/simulation-factory.ts` (9 base64 chars via `secureRandomString`) | Low priority consolidation

**Evidence:**
- `session-extractor.ts` line 87: `session-${Date.now()}-${crypto.randomBytes(6).toString('hex')}` (12 hex chars, 48 bits)
- `simulation-factory.ts` line 135: `session-${Date.now()}-${secureRandomString(9)}` (9 base64 chars, ~54 bits)
- Simulation-factory has an inline NOTE acknowledging the similarity.

**Impact:** Low -- different entropy levels serve different contexts. Could consolidate with an entropy parameter.

---

### FINDING-OPUS-A5-011 | MEDIUM | CONSOLIDATION | Content-filter vs contamination-filter serve complementary but non-overlapping roles | No duplication, but architectural boundary is unclear to newcomers | Add cross-reference comments

**Evidence:**
- `lib/content-filter.ts`: Prompt-level noise filtering pipeline (noise patterns, deduplication, quality scoring). Operates on `PromptItem[]`. Focuses on CLI/system noise removal.
- `extractors/contamination-filter.ts`: Text-level AI-chatter scrubbing with severity-ranked denylist. Operates on raw `string`. Focuses on orchestration/self-reference removal.
- **No overlapping patterns** -- content-filter catches CLI tags (`<command-name>`, `<system-reminder>`), contamination-filter catches AI phrases ("Let me analyze", "As an AI").
- Both export `ContaminationAuditRecord` (content-filter defines the type, contamination-filter and validate-memory-quality import it).

**Impact:** Not duplicated, but the two-filter architecture should be documented more explicitly. A developer might mistakenly add AI-phrase patterns to content-filter or CLI-noise patterns to contamination-filter.

---

### FINDING-OPUS-A5-012 | LOW | NAMING_COLLISION | `CollectedDataBase` naming | `simulation-factory.ts` defines `SimCollectedData extends Partial<CollectedDataBase>` | No collision, but `Base` suffix is misleading

**Evidence:**
- `types/session-types.ts` defines `CollectedDataBase` as the canonical interface.
- `simulation-factory.ts` defines `SimCollectedData extends Partial<CollectedDataBase>`.
- No `CollectedData` (without `Base`) exists -- the `Base` suffix implies there should be a derived type, but there is not.

**Impact:** Minor naming clarity issue. The `Base` suffix is a historical artifact from when there were multiple collected-data variants. Could be renamed to `CollectedData` but would require broad import updates.

---

## Summary Statistics

| Severity | Count |
|----------|-------|
| CRITICAL | 1 |
| HIGH | 1 |
| MEDIUM | 4 |
| LOW | 6 |

### Top Priority Actions (by impact)

1. **OPUS-A5-001 (CRITICAL):** Wire `lib/cli-capture-shared.ts` into all 4 CLI capture modules. This eliminates ~20 duplicate function definitions across ~200 lines of redundant code. Alternatively, if shared module design is not approved, delete the dead `lib/cli-capture-shared.ts` file.

2. **OPUS-A5-002 (HIGH):** Delete `core/quality-scorer.ts` and migrate its 2 test importers to `extractors/quality-scorer.ts`. The legacy scorer is explicitly `@deprecated`.

3. **OPUS-A5-003/004/005 (MEDIUM batch):** Remove 3 re-export shim files (`utils/memory-frontmatter.ts`, `utils/phase-classifier.ts`, `extractors/session-activity-signal.ts`) by updating their 4 importers to use canonical `lib/` paths directly.

4. **OPUS-A5-007 (MEDIUM):** Rename `anchor-generator.ts`'s internal `slugify` to `slugifyKeywords` to prevent future naming collision with the exported `slugify` in `slug-utils.ts`.

### Estimated Remediation Effort

- OPUS-A5-001: ~2 hours (careful per-module wiring with test verification)
- OPUS-A5-002: ~30 minutes (delete file, update 2 imports)
- OPUS-A5-003/004/005: ~20 minutes (update 4 imports, delete 3 files)
- OPUS-A5-007: ~10 minutes (rename internal function)
- Total: ~3 hours
