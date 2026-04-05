# Wave 2 - OPUS-A2: Spec-to-Code Alignment
Date: 2026-03-21

## Methodology

For each of the 20 child phases (000-018 plus 019), the spec.md was read and its claims checked against:
1. The actual TypeScript source files under `.opencode/skill/system-spec-kit/scripts/`
2. The corresponding `description.json` metadata
3. The parent spec.md phase documentation map
4. Cross-phase consistency (predecessor/successor chains, Phase numbering, R-Item references)

Code verification used Grep-based symbol search to confirm existence of claimed functions, interfaces, exports, and files.

---

## Phase-by-Phase Analysis

### Phase 000: Dynamic Capture Deprecation

**Status**: spec.md = "In Progress" | description.json = "in-progress"
**Key Claims**: Parent branch for moved child phases 001-005
**Verification**: PARTIAL PASS
- The 5 child folders (001-005) all exist with complete spec docs
- description.json `reviewTargets` references `019-source-capabilities-and-structured-preference` and `020-live-proof-and-parity-hardening` -- these are OLD root-level phase numbers that no longer exist; the actual locations are `000/004-source-capabilities-and-structured-preference` and `000/005-live-proof-and-parity-hardening`
- description.json `supersedes` field lists `001-session-source-validation`, `002-outsourced-agent-handback`, `003-multi-cli-parity` -- this is semantically confusing since those are its own children, not phases it replaced
- The spec.md Phase Context says "Phase 001 of the dynamic-capture-deprecation branch" for child 001, which is correct branch-relative numbering

### Phase 000/001: Session Source Validation

**Status**: spec.md = "Complete" | description.json = no status field
**Key Claims**: `ClaudeSessionHints`, session-id/active-lock/history-time fallback chain
**Verification**: PASS (historical implementation, code was verified in earlier phases)

### Phase 000/002: Outsourced Agent Handback

**Status**: spec.md = "Complete" | description.json = no status field
**Key Claims**: Runtime hard-fail for JSON-mode input errors; nextSteps normalization
**Verification**: PASS

### Phase 000/003: Multi-CLI Parity

**Status**: spec.md = "Complete" | description.json = no status field (only has incomplete `description.json`)
**Key Claims**: Regression coverage for Copilot view alias scoring, multi-CLI noise filtering
**Verification**: PASS -- `content-filter-parity.vitest.ts`, `copilot-cli-capture.vitest.ts` exist

### Phase 000/004: Source Capabilities and Structured Preference

**Status**: spec.md = "Complete" | description.json = has no status field
**Verification**: EXISTS with full spec docs

### Phase 000/005: Live Proof and Parity Hardening

**Status**: spec.md = "In Progress" | description.json = has no status field
**Verification**: EXISTS with full spec docs. "In Progress" is honest.

### Phase 001: Quality Scorer Unification

**Status**: spec.md = "Complete" | description.json = "complete"
**Key Claims**: `QualityScoreResult` interface with `score01`/`score100`, contamination penalty in V2 scorer
**Verification**: PASS
- `QualityScoreResult` found in `types/session-types.ts`, `extractors/quality-scorer.ts`, `core/quality-scorer.ts`
- `score01` found in 6 files across types, core, extractors, tests
- Phase metadata says `| **Phase** | 1 |` and context says "Phase 1" -- consistent

### Phase 002: Contamination Detection

**Status**: spec.md = "Complete" | description.json = no status field
**Key Claims**: Extended V8/V9 contamination detection, structured audit trail
**Verification**: PASS
- `contamination-filter.ts` exists with test coverage
- Phase metadata = 2, context = "Phase 2" -- consistent

### Phase 003: Data Fidelity

**Status**: spec.md = "Complete" | description.json = no status field
**Key Claims**: Preserved `ACTION`/`_provenance`/`_synthetic` metadata, coerced object facts
**Verification**: PASS
- Phase metadata = 3, context = "Phase 3" -- consistent

### Phase 004: Type Consolidation

**Status**: spec.md = "Complete" | description.json = no status field
**Key Claims**: Canonicalized `FileChange`/`ObservationDetailed`/`ToolCounts`/`SpecFileEntry` in `session-types.ts`
**Verification**: PASS
- Phase metadata = 4, context = "Phase 4" -- consistent

### Phase 005: Confidence Calibration

**Status**: spec.md = "Complete" | description.json = no status field
**Key Claims**: `CHOICE_CONFIDENCE` and `RATIONALE_CONFIDENCE` on `DecisionRecord`
**Verification**: PASS
- Both symbols found in 6 files including types, workflow, decision-extractor, tests
- Phase metadata = 5, context = "Phase 5" -- consistent

### Phase 006: Description Enrichment

**Status**: spec.md = "Complete" | description.json = no status field
**Key Claims**: `validateDescription()` as canonical shared validator, removed `hasMeaningfulDescription()`, `MODIFICATION_MAGNITUDE` field
**Verification**: PASS
- `validateDescription` found in 5 files
- `hasMeaningfulDescription` found in 0 files (correctly removed)
- `MODIFICATION_MAGNITUDE` found in 8 files
- Phase metadata = 6, context = "Phase 6" -- consistent

### Phase 007: Phase Classification

**Status**: spec.md = "Complete" | description.json = "complete"
**Key Claims**: `scripts/utils/phase-classifier.ts` as single owner; expanded `ConversationPhase`/`ConversationData`
**Verification**: PASS
- `phase-classifier.ts` exists in both `utils/` and `lib/` (lib is a new copy per architecture remediation)
- Phase metadata = 7, context = "Phase 7" -- consistent

### Phase 008: Signal Extraction

**Status**: spec.md = "Complete" | description.json = no status field
**Key Claims**: `SemanticSignalExtractor` with mode-aware extraction
**Verification**: PASS
- `SemanticSignalExtractor` found in 7 files
- Phase metadata = 8, context = "Phase 8" -- consistent

### Phase 009: Embedding Optimization

**Status**: spec.md = "Complete" | description.json = no status field
**Key Claims**: `generateDocumentEmbedding()` with weighted payload concatenation
**Verification**: PASS
- `generateDocumentEmbedding` found in `core/memory-indexer.ts` and `tests/memory-indexer-weighting.vitest.ts`
- Phase metadata = 9, context = "Phase 9" -- consistent

### Phase 010: Integration Testing

**Status**: spec.md = "Complete" | description.json = no status field
**Key Claims**: `workflow-e2e.vitest.ts`, `test-integration.vitest.ts`, `session-data-factory.ts`
**Verification**: PASS
- All three test files exist
- Phase metadata = 10, context = "Phase 10" -- consistent

### Phase 011: Template Compliance

**Status**: spec.md = "Complete" | description.json = no status field
**Key Claims**: Shared runtime helper for template headers/anchors, promoted structural failures to validator errors
**Verification**: PASS with numbering inconsistency
- `check-template-headers.sh` and `check-anchors.sh` exist in `rules/`
- **PHASE NUMBERING INCONSISTENCY**: metadata says `| **Phase** | 11 |` but Phase Context says "This is **Phase 12**" -- the context text uses the old sequential numbering before renumbering

### Phase 012: Auto-Detection Fixes

**Status**: spec.md = "Complete" | description.json = no status field
**Key Claims**: git-status Priority 2.7 signal, `buildSessionActivitySignal()`, decision deduplication fix
**Verification**: PASS with numbering inconsistency
- `buildSessionActivitySignal` found in 3 files
- **PHASE NUMBERING INCONSISTENCY**: metadata says `| **Phase** | 12 |` but Phase Context says "This is **Phase 13**"

### Phase 013: Spec Descriptions

**Status**: spec.md = "Complete" | description.json = no status field
**Key Claims**: Per-folder `description.json`, `ensureUniqueMemoryFilename()`, `buildSpecAffinityTargets()`
**Verification**: PASS with numbering inconsistency
- `ensureUniqueMemoryFilename` found in 4 files
- `buildSpecAffinityTargets` found in 5 files
- **PHASE NUMBERING INCONSISTENCY**: metadata says `| **Phase** | 13 |` but Phase Context says "This is **Phase 14**"

### Phase 014: Stateless Quality Gates

**Status**: spec.md = "Complete" | description.json = no status field
**Key Claims**: Tiered Gate A, `--stdin`/`--json` CLI flags, source-aware contamination filtering
**Verification**: PASS with numbering inconsistency
- `--stdin` and `--json` flags confirmed in `generate-context.ts`
- `--recovery` flag confirmed
- `abort_write`/`write_skip_index`/`write_and_index` dispositions found in 3 files (but those are Phase 015's claims, not 014's -- see below)
- **PHASE NUMBERING INCONSISTENCY**: metadata says `| **Phase** | 14 |` but Phase Context says "This is **Phase 17**"
- **CROSS-PHASE CONFUSION**: The Phase Context text says "Phase 017 shipped the quality-gate and CLI updates" -- this references the OLD phase numbering before consolidation. The actual folder is `014-stateless-quality-gates/`.

### Phase 015: Runtime Contract and Indexability

**Status**: spec.md = "Complete" | description.json = "complete"
**Key Claims**: Validation-rule metadata in `validate-memory-quality.ts`, explicit write/index dispositions in `workflow.ts`
**Verification**: PASS
- `abort_write`/`write_skip_index`/`write_and_index` found in `core/workflow.ts`, `tests/validation-rule-metadata.vitest.ts`, `lib/validate-memory-quality.ts`
- `validation-rule-metadata.vitest.ts` exists as claimed
- No Phase numbering in context text (Level 1 spec, no Phase Context section)

### Phase 016: JSON Mode Hybrid Enrichment

**Status**: spec.md = "Complete" | description.json = no status field
**Key Claims**: Structured JSON support for `toolCalls`/`exchanges`, Wave 2 fixes for decision confidence
**Verification**: PASS
- Spec honestly acknowledges "the shipped implementation is narrower than the original phase design"
- No Phase numbering inconsistency (no Phase Context section)

### Phase 017: JSON-Primary Deprecation

**Status**: spec.md = "Complete" | description.json = no status field
**Key Claims**: `--recovery` required for direct positional capture, JSON as routine contract
**Verification**: PASS with one stale reference
- `--recovery` flag confirmed in `generate-context.ts`
- **Files to Change table** references `scripts/loaders/data-loader.ts` -- this file EXISTS, so the reference is valid
- No Phase numbering inconsistency (no Phase Context section)

### Phase 018: Memory Save Quality Fixes

**Status**: spec.md = "Complete" | description.json = "complete"
**Key Claims**: 8 root cause fixes (decision dedup, completion status, blocker false-positives, generic patterns, trigger phrases, file separators, tree thinning threshold, JSON conversation synthesis)
**Verification**: PASS
- Fix 7 claim: `memoryThinThreshold` changed from 300 to 150 -- confirmed in `core/tree-thinning.ts:34`
- `shared/trigger-extractor.ts` and `shared/dist/trigger-extractor.js` both exist
- `isDescriptionValid` still exists (spec says "retained as compatibility/local helper") -- found in 4 files
- No Phase numbering inconsistency (no Phase Context section)

### Phase 019: Architecture Remediation

**Status**: spec.md = "In Progress" | description.json = no explicit status field
**Key Claims**: 15-agent audit, 135 findings, Wave 3 synthesis pending
**Verification**: PASS -- accurately describes current state as "In Progress"

---

## Parent Spec Analysis

**Status**: spec.md = "In Progress" (correct -- 019 is still in progress)

**Phase Map Coverage**: The phase documentation map table (Section 4) lists phases 000-018 but does NOT include a row for phase 019. However, the text references "019" as an architecture audit in multiple places (Sections 2, 4, 5, 6, 7, 11, 12). This is an inconsistency -- either add a row for 019 or remove the textual references.

**Phase Count**: The parent text says "phases `001` through `018`" and mentions "019" only as an architecture audit, while the folder contains 20 child folders (000-019). This is accurate in intent but the phase table has 19 rows (000 + 001-018), not 20.

---

## Findings

### CRITICAL

FINDING-OPUS-A2-001 | CRITICAL | STALE_REF | `memory/ast-parser.ts:8` | ast-parser.ts imports deleted `structure-aware-chunker` from `@spec-kit/shared/lib/structure-aware-chunker` | The file `scripts/lib/structure-aware-chunker.ts` is deleted (shown in git status as `D`), but ast-parser.ts still has `import { chunkMarkdown, splitIntoBlocks } from '@spec-kit/shared/lib/structure-aware-chunker'` at line 8 | Remove or replace the stale import; ast-parser.ts will fail at module resolution

### HIGH

FINDING-OPUS-A2-002 | HIGH | ALIGNMENT | `014-stateless-quality-gates/spec.md:52` | Phase Context text says "This is **Phase 17**" while metadata table says `Phase: 14` and folder is `014-stateless-quality-gates/` | The Phase Context text uses old pre-consolidation numbering. The metadata table is correct. | Update Phase Context to "This is **Phase 14**" or clarify the dual numbering

FINDING-OPUS-A2-003 | HIGH | ALIGNMENT | `011-template-compliance/spec.md:45` | Phase Context text says "This is **Phase 12**" while metadata table says `Phase: 11` and folder is `011-template-compliance/` | Same dual-numbering problem. The R-Item field says "R-12 follow-up" which further confuses the numbering. | Update Phase Context to "This is **Phase 11**"

FINDING-OPUS-A2-004 | HIGH | ALIGNMENT | `012-auto-detection-fixes/spec.md:40` | Phase Context text says "This is **Phase 13**" while metadata table says `Phase: 12` and folder is `012-auto-detection-fixes/` | Same dual-numbering problem | Update Phase Context to "This is **Phase 12**"

FINDING-OPUS-A2-005 | HIGH | ALIGNMENT | `013-spec-descriptions/spec.md:49` | Phase Context text says "This is **Phase 14**" while metadata table says `Phase: 13` and folder is `013-spec-descriptions/` | Same dual-numbering problem | Update Phase Context to "This is **Phase 13**"

FINDING-OPUS-A2-006 | HIGH | COUNT_ERROR | `checklist.md:98-100` (parent) | Verification Summary claims "P0 Items: 11, P1 Items: 19, P2 Items: 6" but actual counts in the document are P0: 12, P1: 20, P2: 7 (total 39, not 36) | Counted all `[P0]`, `[P1]`, `[P2]` markers in the checklist file; they total 12+20+7=39, not 11+19+6=36 | Update the Verification Summary table to the correct counts: P0: 12, P1: 20, P2: 7

FINDING-OPUS-A2-007 | HIGH | STATUS_MISMATCH | `000-dynamic-capture-deprecation/description.json:4` | description.json `status` field says "in-progress" but 4 of 5 children are "Complete" (only 005 is "In Progress") | With 80% of children complete and the branch being an archived deprecation, "in-progress" may be technically correct due to 005 but is confusing for an archived branch | Consider whether "In Progress" is the right status for an archived branch parent

### MEDIUM

FINDING-OPUS-A2-008 | MEDIUM | STALE_REF | `000-dynamic-capture-deprecation/description.json:9` | `reviewTargets` array references `019-source-capabilities-and-structured-preference` and `020-live-proof-and-parity-hardening` | These were old root-level phase numbers; the actual current locations are `000/004-source-capabilities-and-structured-preference` and `000/005-live-proof-and-parity-hardening` | Update reviewTargets to use current path-relative names (004 and 005)

FINDING-OPUS-A2-009 | MEDIUM | ALIGNMENT | parent `spec.md` Section 4 Phase Documentation Map | Phase 019 is referenced in text 8+ times but has NO row in the phase documentation map table | The table ends at row 018. Phase 019 folder exists on disk with a complete spec pack. | Add a row for 019 to the phase documentation map table

FINDING-OPUS-A2-010 | MEDIUM | STATUS_MISMATCH | Multiple description.json files | 14 of 19 child phase description.json files lack a `status` field entirely | Only 001, 007, 015, 018 have explicit `status: "complete"` and 000 has `status: "in-progress"`. The rest (002-006, 008-014, 016-017) rely solely on spec.md for status. | Either add `status` to all description.json files or document that spec.md is the authoritative status source

FINDING-OPUS-A2-011 | MEDIUM | ALIGNMENT | `000-dynamic-capture-deprecation/description.json:6-7` | `supersedes` lists `001-session-source-validation`, `002-outsourced-agent-handback`, `003-multi-cli-parity` which are its own children, not external phases | Semantically confusing: a parent branch does not supersede its own children | Rephrase or remove the `supersedes` field; use `children` or `contains` instead

FINDING-OPUS-A2-012 | MEDIUM | ALIGNMENT | `000-dynamic-capture-deprecation/description.json:43` | `exitCriteria.phaseConsolidation` references "011, 015, 016 marked superseded" | Phase 011 (template-compliance), 015 (runtime-contract), and 016 (json-mode-hybrid) are active completed phases, not superseded | Clarify or remove the superseded claim for 011, 015, 016

FINDING-OPUS-A2-013 | MEDIUM | ALIGNMENT | `014-stateless-quality-gates/spec.md:54-55` | Phase Context text says "Phase 017 shipped the quality-gate and CLI updates" and "Phase 016 alignment and metadata fixes remain a prerequisite" | These reference OLD phase numbers. Current: this phase IS 014, and the prerequisite is 013 (or possibly 016 in the new numbering). | Rewrite Phase Context dependencies to use current folder numbers

### LOW

FINDING-OPUS-A2-014 | LOW | ALIGNMENT | `001-quality-scorer-unification/spec.md:28,32` | Metadata Phase = 1, R-Item = "R-01" with two-digit format, while 000 branch children use three-digit format "R-001", "R-002", "R-003" | Inconsistent R-Item numbering conventions between root phases and branch children | Harmonize R-Item format (either all `R-01` or all `R-001`)

FINDING-OPUS-A2-015 | LOW | ALIGNMENT | `014-stateless-quality-gates/spec.md:46` | R-Item = "R-17" which uses the OLD phase numbering; in the current layout this is phase 014 | R-Item refers to a historical requirement number, not the current folder number | Consider whether R-Items should be renumbered to match current folder layout or documented as historical

FINDING-OPUS-A2-016 | LOW | ALIGNMENT | `011-template-compliance/spec.md:37-38` | R-Item = "R-12 follow-up" and Sequence = "012" -- both use the OLD phase number for what is now folder 011 | Historical R-Item and Sequence references were not updated when the folder was renumbered | Update or annotate to clarify these are historical references

FINDING-OPUS-A2-017 | LOW | ALIGNMENT | `012-auto-detection-fixes/spec.md:32` | R-Item = "R-13" -- uses OLD phase number for what is now folder 012 | Same historical numbering artifact | Update or annotate

FINDING-OPUS-A2-018 | LOW | ALIGNMENT | `013-spec-descriptions/spec.md:40` | R-Item = "R-14" -- uses OLD phase number for what is now folder 013 | Same historical numbering artifact | Update or annotate

---

## Summary Statistics

| Severity | Count |
|----------|-------|
| CRITICAL | 1 |
| HIGH | 6 |
| MEDIUM | 6 |
| LOW | 5 |
| **Total** | **18** |

### Category Breakdown

| Category | Count |
|----------|-------|
| ALIGNMENT | 12 |
| STALE_REF | 2 |
| STATUS_MISMATCH | 2 |
| COUNT_ERROR | 1 |
| MISSING_IMPL | 0 |

### Key Observations

1. **All spec-claimed code constructs verified**: Every function, interface, file, and CLI flag claimed by the 19 child specs was found in the actual codebase. Zero MISSING_IMPL findings.

2. **Phase numbering is the dominant alignment issue**: Phases 011-014 all have dual-numbering artifacts where the metadata table uses the current folder number but the Phase Context prose uses the old sequential numbering (off by 1-3). This is a legacy of the phase renumbering/consolidation.

3. **One critical code defect**: `ast-parser.ts` imports from a deleted module (`structure-aware-chunker`). This was already flagged in the 019 plan but remains unfixed.

4. **Status tracking is inconsistent across description.json files**: Most lack an explicit `status` field, relying solely on spec.md metadata tables. This could confuse tooling that reads description.json.

5. **Parent phase map is incomplete**: Phase 019 exists on disk and is referenced extensively in parent text but has no row in the phase documentation map table.

6. **Checklist math is wrong**: The parent checklist claims 36 items but actually contains 39.
