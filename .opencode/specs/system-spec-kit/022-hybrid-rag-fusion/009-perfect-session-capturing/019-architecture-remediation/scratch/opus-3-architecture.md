# OPUS-3: Architecture Boundary Analysis Report

## Summary: 14 findings (0 CRITICAL, 5 HIGH, 5 MEDIUM, 4 LOW)

## ARCHITECTURE DEPENDENCY DIAGRAM

```
EXPECTED (clean): memory/ → core/ → extractors/ → lib/ → utils/ → types/

ACTUAL VIOLATIONS:
  utils/memory-frontmatter → lib/trigger-extractor     (OPUS3-001)
  utils/phase-classifier   → lib/semantic-signal        (OPUS3-002)
  extractors/ ←→ spec-folder/ (CIRCULAR)                (OPUS3-005)
  extractors/quality-scorer → core/quality-scorer        (OPUS3-004)
  core/workflow → memory/validate-memory-quality         (OPUS3-007)
  memory/generate-context → extractors/collect-session   (OPUS3-008)
  7 extractors import CONFIG from core/ barrel           (OPUS3-006)
```

## HIGH FINDINGS

### OPUS3-001 — utils/ imports from lib/ (memory-frontmatter)
`memory-frontmatter.ts:6` imports `extractTriggerPhrases` from `../lib/trigger-extractor`. Violates leaf-layer contract.

### OPUS3-002 — utils/ imports from lib/ (phase-classifier)
`phase-classifier.ts:9` imports `SemanticSignalExtractor` from `../lib/semantic-signal-extractor`. Violates leaf-layer contract.

### OPUS3-004 — extractors/ imports core/ types
`extractors/quality-scorer.ts:14` imports `QualityDimensionScore`, `QualityFlag`, `QualityScoreResult` from `../core/quality-scorer`. Should be in `types/`.

### OPUS3-005 — CIRCULAR: extractors/ ←→ spec-folder/
- `collect-session-data.ts:20` imports `detectSpecFolder` from `../spec-folder`
- `folder-detector.ts:32` imports `buildSessionActivitySignal` from `../extractors/session-activity-signal`

### OPUS3-009 — heal-ledger-mismatch.sh references deleted script
Line 104: `node dist/evals/run-quality-legacy-remediation.js` — source deleted. Runtime failure.

## MEDIUM FINDINGS

### OPUS3-003 — utils/ type-only imports from types/
3 utils files import types from `../types/session-types`. Acceptable but noted.

### OPUS3-006 — 7 extractors import CONFIG from core/ barrel
Creates dependency from extractors upward to core.

### OPUS3-007 — core/ ←→ memory/ near-circular
`core/workflow.ts` imports from `memory/validate-memory-quality`. `memory/generate-context.ts` imports from `core/workflow`.

### OPUS3-008 — memory/ imports from extractors/
`generate-context.ts:27` imports `collectSessionData` from `../extractors/collect-session-data`. Recovery-mode path.

### OPUS3-014 — 5 heavily-used utils modules missing from barrel
slug-utils, memory-frontmatter, task-enrichment, phase-classifier, source-capabilities all imported by direct path.

## LOW FINDINGS

### OPUS3-010/011 — READMEs reference deleted files
### OPUS3-012/013 — Orphaned build artifacts (.js, .js.map, .d.ts.map) in source tree
