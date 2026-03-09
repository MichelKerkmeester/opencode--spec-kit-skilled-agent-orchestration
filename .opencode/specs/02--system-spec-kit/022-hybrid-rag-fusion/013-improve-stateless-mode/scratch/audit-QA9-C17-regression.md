## Audit QA9-C17: Regression Risk — Copilot Cross-Cutting
### P0 Blockers: 0 — none

### P1 Required: 0 — none

### P2 Suggestions: 1 — workflow.ts:582-583, 583-607, 657-660, 729-730 classify "stateless" as `!activeDataFile && !preloadedData`, so a caller that supplies file-backed JSON through `loadDataFn` instead of `dataFile` is still routed through stateless-only alignment checks and the stateless TOOL_COUNT patch before `_source === 'file'` can short-circuit enrichment at workflow.ts:438-439. Standard spec 012 JSON mode remains safe when invoked via `dataFile` (the normal CLI path), and the shared extractors keep backward compatibility for stateful payloads (`collect-session-data.ts:791-830` still returns the same SessionData shape and `file-extractor.ts:166-220` still accepts both `FILES` and legacy `filesModified`), but this mode-detection edge is worth covering with a regression test or by basing `isStatelessMode` on the loaded data source.

### Score: 95
