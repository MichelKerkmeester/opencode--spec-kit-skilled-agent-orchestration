# OPUS-4: Git Diff Deep Analysis Report

## Summary: 26 findings (5 CRITICAL, 6 HIGH, 8 MEDIUM, 7 LOW)

## CRITICAL FINDINGS (Test Breakage)

### OPUS4-001 through OPUS4-005 — test-scripts-modules.js NOT UPDATED
20+ test assertions will fail because exports were removed from:
- `memory-indexer.ts` (updateMetadataWithEmbedding) → Tests T-024d, T-024i
- `anchor-generator.ts` (generateSemanticSlug, generateShortHash, extractKeywords, getCurrentDate, STOP_WORDS, ACTION_VERBS) → Tests T-009 series, T-030 series
- `simulation-factory.ts` (createFullSimulation, formatTimestamp, generateSessionId, addSimulationWarning, markAsSimulated) → Tests T-014 series, T-029 series
- `content-filter.ts` (filterContent, getFilterStats, resetStats, generateContentHash, calculateSimilarity, stripNoiseWrappers, meetsMinimumRequirements, calculateQualityScore) → Tests T-012, T-028 series
- `prompt-utils.ts` (requireInteractiveMode) → Test T-033a
- `validation-utils.ts` (logAnchorValidation) → Tests T-035h, T-035i

## HIGH FINDINGS

### OPUS4-006 — heal-ledger-mismatch.sh references deleted script
Line 104 calls `node dist/evals/run-quality-legacy-remediation.js` — source deleted. Runtime failure.

### OPUS4-007/008 — Vitest files mock deleted function
task-enrichment.vitest.ts and memory-render-fixture.vitest.ts mock `updateMetadataWithEmbedding` (deleted).

### OPUS4-009 — Incomplete snake_case alias cleanup
folder-detector.ts still exports `detect_spec_folder`, `filter_archive_folders` despite barrel removal.

### OPUS4-010 — trigger-extractor.ts re-export removal
Removed `SemanticSignalExtractor` re-export. Need verification no consumers rely on it.

### OPUS4-011 — memory-frontmatter barrel removal
All memory-frontmatter re-exports removed from utils/index.ts. Direct imports still work.

## MEDIUM FINDINGS

### OPUS4-012/013 — READMEs reference deleted files
lib/README.md lists structure-aware-chunker.ts. evals/README.md lists run-quality-legacy-remediation.ts.

### OPUS4-014/015 — Orphaned .d.ts.map files
tree-thinning.d.ts.map and check-architecture-boundaries.d.ts.map not deleted.

### OPUS4-016/017 — Contamination filter regex loosened
"Now" removed from step-narration. "tool" made required in path pattern. May miss contamination.

### OPUS4-018 — RELEVANCE_CONTENT_STOPWORDS deleted
Removed ~100 stopwords. Changes keyword relevance behavior.

## CATEGORIZATION

| Category | Count |
|----------|-------|
| SAFE refactoring | 14 changes |
| RISKY (needs verification) | 4 changes |
| INCOMPLETE (missing related changes) | 9 changes |
| BREAKING (definitely fails) | 1 change (ops script) |

## PRIORITY REMEDIATION ORDER
1. Update test-scripts-modules.js (20+ assertion failures)
2. Fix heal-ledger-mismatch.sh (ops runtime failure)
3. Remove stale mocks from vitest files
4. Complete snake_case alias cleanup
5. Delete orphaned .d.ts.map files
6. Update READMEs
7. Confirm contamination filter changes
