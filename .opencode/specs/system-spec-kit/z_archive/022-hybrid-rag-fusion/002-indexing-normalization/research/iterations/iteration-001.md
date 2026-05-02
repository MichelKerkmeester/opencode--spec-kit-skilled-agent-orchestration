# Iteration 001: Code Quality — Input Normalization & Indexing

**Focus**: Bug hunting, architecture, standards compliance, test coverage gaps in input-normalizer.ts, memory-indexer.ts, spec-affinity.ts, and related files.

**Agents**: A1 (Codex, bugs), A2 (Codex, architecture), A3 (Codex, cross-skill), C1 (Copilot, improvements), C2 (Copilot, standards), C3 (Copilot, test coverage)

## Synthesized Findings

### Critical (Must Fix)

| ID | Source | File | Issue |
|----|--------|------|-------|
| BUG-001 | A1 | input-normalizer.ts:351-378 | `normalizeFileEntryLike()` uses unchecked casts for FILE_PATH/DESCRIPTION. Non-string values pass validation and crash string operations downstream. |
| TCOV-001 | C3 | input-normalizer.ts | No focused test coverage for `normalizeFileEntryLike()` — empty objects, missing fields, wrong types all untested. |
| TCOV-005 | C3 | memory-indexer.ts | No tests for failure paths: embedding null return, trigger extraction failure, vectorIndex throw, malformed metadata.json. |

### High (Should Fix)

| ID | Source | File | Issue |
|----|--------|------|-------|
| BUG-002 | A1 | input-normalizer.ts:709-986 | `transformOpencodeCapture()` doesn't validate array element shapes. Corrupt capture data (non-string filePath, non-object exchanges) crashes at runtime. |
| UX-001 | C1 | generate-context.ts | CLI overloads one positional arg as either JSON file or spec folder, plus --stdin/--json modes with buried precedence rules. Should use explicit subcommands. |
| UX-002 | C1 | generate-context.ts / tool-schemas.ts | MCP layer supports dryRun, asyncEmbedding, force, includeSpecDocs, incremental — none exposed to CLI operators. |
| AUTO-001 | C1 | memory-index.ts / incremental-index.ts | System detects stale indexes but doesn't auto-repair. Could auto-detect and auto-migrate on startup. |
| TCOV-002 | C3 | input-normalizer.ts | `validateInputData()` branches for FILES-not-array, FILES[i]-non-object, wrong-type triggerPhrases etc. all untested. |
| TCOV-003 | C3 | input-normalizer.ts | No direct tests for `buildSpecRelevanceKeywords`, `containsRelevantKeyword`, `extractSpecIds`, `getCurrentSpecId`, `isSafeSpecFallback`. |
| EDGE-001 | C3 | memory-parser.ts / handler-memory-index.ts | Mixed-separator paths and `..` normalization not tested in Vitest suite (only in legacy JS tests). |
| INTG-001 | C3 | Multiple | Integration coverage ratio is 63:37 unit/integration. Real e2e save/index coverage is shallow. |

### Medium (Address)

| ID | Source | File | Issue |
|----|--------|------|-------|
| EDGE-001 | A1 | input-normalizer.ts / spec-affinity.ts | Canonical path dedup incomplete: symlink aliases, dot-segments, relative-vs-absolute forms not unified. Raw string equality used in seenPaths. |
| BUG-003 | A1 | input-normalizer.ts:351-378 | ACTION not normalized to a closed set. Unknown MODIFICATION_MAGNITUDE silently dropped instead of defaulting to 'unknown'. |
| ERR-001 | A1 | memory-indexer.ts:64-145 | No try/catch around embedding generation or vector-index writes. Exceptions propagate unhandled. |
| BUG-004 | A1 | spec-affinity.ts:16 | SPEC_ID_REGEX `/\b\d{3}-[a-z0-9][a-z0-9-]*\b/g` doesn't match namespace patterns like `02--domain`. False positives on prose tokens like `123-foo`. |
| STD-004 | C2 | input-normalizer.ts:348+ | Unsafe type assertions: `JSON.parse(...) as T`, double-casting `as unknown as Record<...>`. |
| STD-005 | C2 | spec-affinity.ts:147,156,250 | Bare `catch {}` blocks discard errors silently, violating unknown-typed catch convention. |
| STD-007/008/009 | C2 | Multiple | Mixed console.log/structuredLog usage across input-normalizer, memory-indexer, collect-session-data. |
| STD-010 | C2 | input-normalizer.ts | `transformOpencodeCapture` is 337 lines — far exceeds 50-line guideline. Should decompose. |
| STD-014 | C2 | memory-indexer.ts:119 | Magic numbers in importance weighting (10000, 10, 0.3, 0.3, 0.2, 0.2, 500). Should be named constants. |
| STD-015/016 | C2 | spec-affinity.ts / collect-session-data.ts | Missing JSDoc on exported public functions. |
| TCOV-004 | C3 | input-normalizer.ts | No tests for transformKeyDecision, buildSessionSummaryObservation, buildTechnicalContextObservation, cloneInputData. |
| TCOV-006 | C3 | importance-tiers.ts / memory-indexer.ts | No boundary tests for applyTierBoost(NaN/Infinity/0/negative), no formula tests at min/max length/anchor counts. |
| TCOV-007 | C3 | memory-parser.ts | Missing UTF-16 BOM, invalid anchor-id, duplicate trigger-phrase dedup coverage. |

### Low (Consider)

| ID | Source | File | Issue |
|----|--------|------|-------|
| BUG-005 | A1 | memory-indexer.ts:117-123 | `recencyFactor` is hardcoded 0.2 — not actually recency-based. Formula always produces [0.4, 1.0]. Misleading name. |
| STD-001/002/003 | C2 | Multiple | Section marker inconsistencies, import ordering not stdlib→external→internal. |
| APAT-001 | C3 | Multiple test files | Over-mocking in handler-memory-index-cooldown.vitest.ts, shallow integration tests. |

### Cross-System Insights

| ID | Source | Issue |
|----|--------|-------|
| CACHE-SPLIT | C1 | MCP save path uses SQLite-backed embedding cache; script-side workflow/indexer uses in-memory cache only. Split-brain caching. |
| FEEDBACK-GAP | C1 | `memory_validate` records usefulness/rank/query feedback but it's not connected to importance weight recalibration. Adaptive weighting is architecturally possible but not wired. |
| TEST-CONFIG | C3 | Script-side *.vitest.ts files for input-normalizer aren't picked up by scripts workspace's default Vitest include pattern. Some coverage exists but doesn't run in default suite. |

## New Questions Raised

1. How does workflow.ts (2,482 lines) decompose? What are SRP violations? (A2 still analyzing)
2. Are there circular dependencies between input-normalizer ↔ spec-affinity ↔ session-types?
3. What are the exact cross-skill alignment issues between tier names, P0/P1/P2 semantics, and export patterns? (A3 still analyzing)
4. Can the embedding cache split-brain be unified?
5. Should normalizeFileEntryLike() have a strict mode vs permissive mode?

## newInfoRatio

Estimated: **0.85** (very high — first iteration, all findings are novel)
Questions partially/fully addressed: 1, 2, 3, 4, 5, 6, 7 (7/17 = 41%)
