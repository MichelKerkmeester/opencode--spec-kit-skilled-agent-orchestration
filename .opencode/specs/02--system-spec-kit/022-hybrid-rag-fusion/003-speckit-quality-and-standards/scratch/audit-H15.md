# Audit H-15: scripts/evals/ + .mjs files

**Auditor:** Claude Opus 4.6 (leaf agent)
**Date:** 2026-03-08
**Scope:** 18 files in scripts/evals/ + .mjs files

## Per-File Results

| File | P0 | P1 | Issues |
|------|----|----|--------|
| check-allowlist-expiry.ts | FAIL (P0-1: 5-line header) | PASS | 1 |
| check-architecture-boundaries.ts | FAIL (P0-1: 7-line header) | PASS | 1 |
| check-handler-cycles-ast.ts | FAIL (P0-1: 4-line header) | PASS | 1 |
| check-no-mcp-lib-imports-ast.ts | FAIL (P0-1: 5-line header) | PASS | 1 |
| check-no-mcp-lib-imports.ts | FAIL (P0-1: 5-line header) | PASS | 1 |
| collect-redaction-calibration-inputs.ts | PASS | FAIL (P1-1: missing void on main()) | 1 |
| import-policy-rules.ts | PASS | FAIL (P1-4: exported fn lacks TSDoc) | 1 |
| map-ground-truth-ids.ts | FAIL (P0-1: 15-line header) | FAIL (P1-1: main() no type; P1-5: 4x bare catch) | 6 |
| run-ablation.ts | FAIL (P0-1: 15-line header) | FAIL (P1-5: catch without unknown) | 2 |
| run-bm25-baseline.ts | FAIL (P0-1: 16-line header) | FAIL (P1-5: catch without unknown) | 2 |
| run-chk210-quality-backfill.ts | FAIL (P0-1: 4-line SCRIPT header) | FAIL (P1-1: parseArgs/main no type; P1-2: inline anon type) | 4 |
| run-performance-benchmarks.ts | FAIL (P0-1: dual header blocks) | PASS | 1 |
| run-phase1-5-shadow-eval.ts | PASS | PASS | 0 |
| run-phase3-telemetry-dashboard.ts | PASS | PASS | 0 |
| run-quality-legacy-remediation.ts | FAIL (P0-1: 4-line SCRIPT header) | PASS | 1 |
| run-redaction-calibration.ts | PASS | PASS | 0 |
| run-phase2-closure-metrics.mjs | FAIL (P0-1: SCRIPT instead of MODULE) | N/A (plain JS) | 1 |
| eslint.config.mjs | FAIL (P0-1: no header) | N/A (config file) | 1 |

## Detailed File-by-File Audit Results

---

### 1. `check-allowlist-expiry.ts`

| Check | ID | Status | Detail |
|-------|----|--------|--------|
| P0-1 | File header | FAIL | Header is 5 lines (lines 1-5) instead of exact 3-line block. Lines 3-4 contain description inside the header block. |
| P0-2 | No `any` exports | PASS | No `any` in exported functions/interfaces/types. |
| P0-3 | PascalCase | PASS | `AllowlistException`, `Allowlist`, `ExpiryFinding`, `InvalidExpiry` all PascalCase. |
| P0-4 | Commented-out code | PASS | No consecutive commented-out code blocks. |
| P0-5 | WHY comments | PASS | No WHY-style comments present. |
| P1-1 | Explicit return types | PASS | All functions have explicit return types. |
| P1-2 | Named interfaces | PASS | Object params use named interfaces. |
| P1-3 | Non-null assertions | PASS | No `!` assertions found. |
| P1-4 | TSDoc on exports | N/A | No exported functions (all module-internal, runs via `main()`). |
| P1-5 | catch `unknown` | PASS | Line 89: `catch (err: unknown)` with `instanceof Error` narrowing. |

**Metric correctness:** Date arithmetic uses UTC-normalized day boundaries with `MS_PER_DAY`. Correct.

---

### 2. `check-architecture-boundaries.ts`

| Check | ID | Status | Detail |
|-------|----|--------|--------|
| P0-1 | File header | FAIL | Header is 7 lines (lines 1-7) including multi-line description. Should be exact 3-line block. |
| P0-2 | No `any` exports | PASS | No `any` usage. |
| P0-3 | PascalCase | PASS | `GapAViolation`, `GapBViolation` are PascalCase. |
| P0-4 | Commented-out code | PASS | No commented-out code blocks. |
| P0-5 | WHY comments | PASS | Lines 37, 46-47, 169 use `AI-WHY` prefix correctly. |
| P1-1 | Explicit return types | PASS | All functions have explicit return types. |
| P1-2 | Named interfaces | PASS | Uses named interfaces for all object params. |
| P1-3 | Non-null assertions | PASS | No `!` assertions. |
| P1-4 | TSDoc on exports | N/A | No exported functions. |
| P1-5 | catch blocks | N/A | No try/catch blocks. |

**Metric correctness:** `countSubstantiveLines` correctly skips blanks, single-line comments, and block comments. Threshold of 50 is clearly documented.

---

### 3. `check-handler-cycles-ast.ts`

| Check | ID | Status | Detail |
|-------|----|--------|--------|
| P0-1 | File header | FAIL | Header is 4 lines (lines 1-4). Line 3 contains description text inside the header block. |
| P0-2 | No `any` exports | PASS | No `any` usage. |
| P0-3 | PascalCase | PASS | `CycleRecord` is PascalCase. |
| P0-4 | Commented-out code | PASS | No commented-out code blocks. |
| P0-5 | WHY comments | PASS | No WHY-style comments present. |
| P1-1 | Explicit return types | PASS | All functions have explicit return types. |
| P1-2 | Named interfaces | PASS | Uses named interfaces. |
| P1-3 | Non-null assertions | PASS | No `!` assertions. |
| P1-4 | TSDoc on exports | N/A | No exported functions. |
| P1-5 | catch blocks | N/A | No try/catch blocks. |

**Metric correctness:** DFS-based cycle detection with normalized cycle keys (rotation to min-node) to avoid duplicate reporting. Correct approach.

---

### 4. `check-no-mcp-lib-imports-ast.ts`

| Check | ID | Status | Detail |
|-------|----|--------|--------|
| P0-1 | File header | FAIL | Header is 5 lines (lines 1-5). Lines 3-4 contain multi-line description. |
| P0-2 | No `any` exports | PASS | No `any` usage. |
| P0-3 | PascalCase | PASS | All interfaces (`AllowlistException`, `Allowlist`, `Violation`, `LocalImport`, `ReExportHit`, `ParsedFileResult`, `ReExportTrace`) are PascalCase. |
| P0-4 | Commented-out code | PASS | No commented-out code blocks. |
| P0-5 | WHY comments | PASS | No WHY-style comments present. |
| P1-1 | Explicit return types | PASS | All functions have explicit return types. |
| P1-2 | Named interfaces | PASS | Uses named interfaces for all object params. |
| P1-3 | Non-null assertions | PASS | No `!` assertions. |
| P1-4 | TSDoc on exports | N/A | No exported functions (only imports from `import-policy-rules`). |
| P1-5 | catch `unknown` | PASS | Line 89: `catch (err: unknown)` with `instanceof Error` narrowing. |

**Metric correctness:** Transitive re-export traversal with deduplication and cycle protection (`visiting` set). Correct.

---

### 5. `check-no-mcp-lib-imports.ts`

| Check | ID | Status | Detail |
|-------|----|--------|--------|
| P0-1 | File header | FAIL | Header is 5 lines (lines 1-5). Lines 3-4 contain description text. |
| P0-2 | No `any` exports | PASS | No `any` usage. |
| P0-3 | PascalCase | PASS | All interfaces (`AllowlistException`, `Allowlist`, `Violation`, `LocalImport`, `ReExportHit`, `ScanFileResult`) are PascalCase. |
| P0-4 | Commented-out code | PASS | No commented-out code blocks. |
| P0-5 | WHY comments | PASS | No WHY-style comments present. |
| P1-1 | Explicit return types | PASS | All functions have explicit return types (including `void`). |
| P1-2 | Named interfaces | PASS | Uses named interfaces. |
| P1-3 | Non-null assertions | PASS | No `!` assertions. |
| P1-4 | TSDoc on exports | N/A | No exported functions. Has JSDoc on `extractImportPath` (line 110), which is good but it's not exported. |
| P1-5 | catch `unknown` | PASS | Line 81: `catch (err: unknown)` with `instanceof Error` narrowing. |

**Metric correctness:** Regex-based import scanning with block comment tracking. Re-export detection is single-level (no transitive traversal unlike the AST variant). Acceptable for its stated purpose.

---

### 6. `collect-redaction-calibration-inputs.ts`

| Check | ID | Status | Detail |
|-------|----|--------|--------|
| P0-1 | File header | PASS | Exact 3-line header block (lines 1-3). |
| P0-2 | No `any` exports | PASS | No `any` usage. |
| P0-3 | PascalCase | PASS | `CommandSpec` is PascalCase. |
| P0-4 | Commented-out code | PASS | No commented-out code blocks. |
| P0-5 | WHY comments | PASS | No WHY-style comments present. |
| P1-1 | Explicit return types | FAIL | `parseArgs()` at line 15 returns `{ specFolder: string }` inline -- this is acceptable as it's a named shape. However, `main()` at line 63 lacks return type annotation (should be `: void`). |
| P1-2 | Named interfaces | PASS | `CommandSpec` is named. |
| P1-3 | Non-null assertions | PASS | No `!` assertions. |
| P1-4 | TSDoc on exports | N/A | No exported functions. |
| P1-5 | catch blocks | N/A | No try/catch blocks. |

**Metric correctness:** Collects command outputs in a loop (5 repetitions of 10 commands, capped at 50). Simple collection script, metrics N/A.

---

### 7. `import-policy-rules.ts`

| Check | ID | Status | Detail |
|-------|----|--------|--------|
| P0-1 | File header | PASS | 3-line header block (lines 1-3). Line 4 is a description comment outside the block, which is fine. |
| P0-2 | No `any` exports | PASS | No `any` usage. |
| P0-3 | PascalCase | N/A | No interfaces/types/enums defined. |
| P0-4 | Commented-out code | PASS | No commented-out code blocks. |
| P0-5 | WHY comments | PASS | No WHY-style comments present. |
| P1-1 | Explicit return types | PASS | `normalizeRelativeImportPath` returns `string`, `isProhibitedImportPath` returns `boolean`. |
| P1-2 | Named interfaces | N/A | No object params. |
| P1-3 | Non-null assertions | PASS | No `!` assertions. |
| P1-4 | TSDoc on exports | FAIL | `isProhibitedImportPath` (line 34) is exported but has no TSDoc. |
| P1-5 | catch blocks | N/A | No try/catch blocks. |

---

### 8. `map-ground-truth-ids.ts`

| Check | ID | Status | Detail |
|-------|----|--------|--------|
| P0-1 | File header | FAIL | Header spans lines 2-16 (15 lines). Far exceeds the 3-line block requirement. Contains extensive usage documentation inside header. |
| P0-2 | No `any` exports | PASS | No `any` usage. |
| P0-3 | PascalCase | PASS | `GroundTruthQuery`, `MemoryCandidate`, `RelevanceMapping`, `CandidateRow`, `CountRow` all PascalCase. |
| P0-4 | Commented-out code | PASS | No consecutive commented-out code blocks (comments are descriptive, not code). |
| P0-5 | WHY comments | PASS | No WHY-style comments present. |
| P1-1 | Explicit return types | FAIL | `main()` at line 523 lacks return type (should be `: void`). `loadGroundTruthQueries()` at line 85 has return type. `extractKeywords`, `extractSpecificTerms`, `buildFTS5Query`, `mapQueryToMemories` all have return types. |
| P1-2 | Named interfaces | PASS | Uses named interfaces throughout. |
| P1-3 | Non-null assertions | PASS | No `!` assertions. |
| P1-4 | TSDoc on exports | N/A | No exported functions. |
| P1-5 | catch blocks | FAIL | Lines 318, 353, 383, 443: catch blocks use bare `catch (_e)` without `unknown` type annotation. Should be `catch (_e: unknown)`. |

**Metric correctness:** BM25 + FTS5 search with tier boosts (constitutional 3x, critical 2x, important 1.5x). Relevance scoring (3/2/1) based on score ratios (>50% for rel=2, >30% for rel=1). Confidence capped at 1.0 via `Math.min(1.0, score/20)`. **Potential issue:** Hard-coded boosting factors and thresholds lack configurability but are consistent within the script.

---

### 9. `run-ablation.ts`

| Check | ID | Status | Detail |
|-------|----|--------|--------|
| P0-1 | File header | FAIL | Header spans lines 2-16 (15 lines). Contains extensive usage docs inside header. |
| P0-2 | No `any` exports | PASS | No `any` usage. |
| P0-3 | PascalCase | N/A | No local interfaces/types defined (uses imported types). |
| P0-4 | Commented-out code | PASS | No commented-out code blocks. |
| P0-5 | WHY comments | PASS | No WHY-style comments present. |
| P1-1 | Explicit return types | PASS | `parseChannels()` returns `AblationChannel[]`, `log/verbose/divider` return `void`, `main()` returns `Promise<void>`. |
| P1-2 | Named interfaces | PASS | Uses imported named types. |
| P1-3 | Non-null assertions | PASS | No `!` assertions. |
| P1-4 | TSDoc on exports | N/A | No exported functions. |
| P1-5 | catch blocks | FAIL | Line 173: `.catch(err => {` -- `err` lacks `unknown` type annotation. Should be `.catch((err: unknown) => {`. |

**Metric correctness:** Recall@20 delta measured by disabling one channel at a time. Uses `toHybridSearchFlags` to convert disabled set to boolean flags. Results stored in `eval_metric_snapshots`. Consistent approach.

---

### 10. `run-bm25-baseline.ts`

| Check | ID | Status | Detail |
|-------|----|--------|--------|
| P0-1 | File header | FAIL | Header spans lines 2-17 (16 lines). Contains extensive usage docs inside header. |
| P0-2 | No `any` exports | PASS | No `any` usage. |
| P0-3 | PascalCase | N/A | No local interfaces/types (uses imported types). |
| P0-4 | Commented-out code | PASS | No commented-out code blocks. |
| P0-5 | WHY comments | PASS | No WHY-style comments present. |
| P1-1 | Explicit return types | PASS | `log/verbose/divider` return `void`, `main()` returns `Promise<void>`. |
| P1-2 | Named interfaces | PASS | Uses imported named types. |
| P1-3 | Non-null assertions | PASS | No `!` assertions. |
| P1-4 | TSDoc on exports | N/A | No exported functions. |
| P1-5 | catch blocks | FAIL | Line 178: `.catch(err => {` -- `err` lacks `unknown` type annotation. |

**Metric correctness:** MRR@5, NDCG@10, Recall@20, HitRate@1 computed via imported `runBM25Baseline`. Bootstrap 95% CI for statistical significance. Contingency decision (PAUSE/RATIONALIZE/PROCEED) based on MRR threshold. Consistent pipeline.

---

### 11. `run-chk210-quality-backfill.ts`

| Check | ID | Status | Detail |
|-------|----|--------|--------|
| P0-1 | File header | FAIL | Header is 4 lines (lines 1-4). Line 3 contains `SCRIPT:` which is non-standard. Should be exact 3-line block. |
| P0-2 | No `any` exports | PASS | No `any` in exports. |
| P0-3 | PascalCase | FAIL | `type DbRow` and `type QualityScoreResult` are PascalCase (PASS). But `rule` parameter at line 55 uses inline type `{ ruleId: string; passed: boolean }` which is acceptable. No violations. Actually PASS. |
| P0-4 | Commented-out code | PASS | No commented-out code blocks. |
| P0-5 | WHY comments | PASS | No WHY-style comments. |
| P1-1 | Explicit return types | FAIL | `parseArgs()` at line 15 lacks explicit return type. `main()` at line 74 lacks explicit return type. `computeQuality` at line 53 has return type. |
| P1-2 | Named interfaces | FAIL | Line 55: `rule: { ruleId: string; passed: boolean }` uses anonymous inline type rather than a named interface. |
| P1-3 | Non-null assertions | PASS | No `!` assertions. |
| P1-4 | TSDoc on exports | N/A | No exported functions. |
| P1-5 | catch blocks | N/A | No try/catch blocks (errors propagate). |
| **EXTRA** | `require` imports | WARN | Lines 7-9 use `require()` (CommonJS) style imports including `@spec-kit/mcp-server/lib/parsing/memory-parser` -- this is a prohibited internal runtime import per the project's own import policy. |

**Metric correctness:** Quality score computed via `scoreMemoryQuality` with validator signals, message/tool/decision counts. Injected into YAML frontmatter. Correct approach but uses prohibited imports.

---

### 12. `run-performance-benchmarks.ts`

| Check | ID | Status | Detail |
|-------|----|--------|--------|
| P0-1 | File header | FAIL | Header block is 4 lines (lines 1-4). Line 3 is blank. Second comment block (lines 5-10) contains usage docs. Non-standard dual-block format. |
| P0-2 | No `any` exports | PASS | No `any` usage. |
| P0-3 | PascalCase | PASS | `LatencyStats`, `PerfReport` are PascalCase. |
| P0-4 | Commented-out code | PASS | No commented-out code blocks. |
| P0-5 | WHY comments | PASS | No WHY-style comments present. |
| P1-1 | Explicit return types | PASS | All functions have explicit return types. |
| P1-2 | Named interfaces | PASS | `LatencyStats`, `PerfReport` used throughout. |
| P1-3 | Non-null assertions | PASS | No `!` assertions. |
| P1-4 | TSDoc on exports | N/A | No exported functions. |
| P1-5 | catch blocks | PASS | Line 486: `.catch((error: unknown) => {` with `instanceof Error` narrowing. |
| **EXTRA** | Prohibited imports | FAIL | Lines 16-24 import directly from `@spec-kit/mcp-server/lib/search/session-boost`, `@spec-kit/mcp-server/lib/search/causal-boost`, `@spec-kit/mcp-server/lib/cache/cognitive/working-memory`, `@spec-kit/mcp-server/lib/extraction/extraction-adapter`. These are prohibited internal runtime imports per import policy. |

**Metric correctness:** p50/p95/p99 percentile calculation via linear interpolation on sorted samples. CHK-110 through CHK-114 gate thresholds (10ms, 20ms, 5ms) clearly documented. Load test uses `setImmediate` for concurrency simulation. Metrics are consistent and well-structured.

---

### 13. `run-phase1-5-shadow-eval.ts`

| Check | ID | Status | Detail |
|-------|----|--------|--------|
| P0-1 | File header | PASS | Exact 3-line header block (lines 1-3). |
| P0-2 | No `any` exports | PASS | No `any` usage. |
| P0-3 | PascalCase | PASS | `EvalRow`, `RetrievalMode` (type alias), `ContextErrorTelemetry` are PascalCase. |
| P0-4 | Commented-out code | PASS | No commented-out code blocks. |
| P0-5 | WHY comments | PASS | No WHY-style comments present. |
| P1-1 | Explicit return types | PASS | All functions have explicit return types. |
| P1-2 | Named interfaces | PASS | Uses named interfaces. |
| P1-3 | Non-null assertions | PASS | No `!` assertions. |
| P1-4 | TSDoc on exports | N/A | No exported functions. |
| P1-5 | catch blocks | N/A | No try/catch blocks. |

**Metric correctness:** Spearman rho computed with standard formula `1 - 6*sum(d^2) / (n*(n^2-1))`. Context error telemetry tracks baseline vs boosted across 10 pressure steps. SC-002 gate at <=25% of baseline. Consistent.

---

### 14. `run-phase3-telemetry-dashboard.ts`

| Check | ID | Status | Detail |
|-------|----|--------|--------|
| P0-1 | File header | PASS | Exact 3-line header block (lines 1-3). |
| P0-2 | No `any` exports | PASS | No `any` usage. |
| P0-3 | PascalCase | PASS | `EvalRow`, `Phase2Metrics`, `RetrievalMode`, `TelemetrySnapshot` all PascalCase. |
| P0-4 | Commented-out code | PASS | No commented-out code blocks. |
| P0-5 | WHY comments | PASS | No WHY-style comments. |
| P1-1 | Explicit return types | PASS | All functions have explicit return types. |
| P1-2 | Named interfaces | PASS | Uses named interfaces throughout. |
| P1-3 | Non-null assertions | PASS | No `!` assertions. |
| P1-4 | TSDoc on exports | N/A | No exported functions. |
| P1-5 | catch blocks | N/A | No try/catch blocks. |

**Metric correctness:** Session boost and causal boost rates computed via deterministic formulas (modular arithmetic). Pressure activation rate tracked. Alert thresholds (25%, 15%, 10-60%) are clearly documented. Extraction metrics sourced from phase2. Consistent.

---

### 15. `run-quality-legacy-remediation.ts`

| Check | ID | Status | Detail |
|-------|----|--------|--------|
| P0-1 | File header | FAIL | Header is 4 lines (lines 1-4). Line 3 contains `SCRIPT:` label which is non-standard. Should be exact 3-line block. |
| P0-2 | No `any` exports | PASS | No `any` usage. |
| P0-3 | PascalCase | PASS | `MemoryFileRecord`, `RetrievalEntry`, `RetrievalSnapshot` are PascalCase. |
| P0-4 | Commented-out code | PASS | No commented-out code blocks. |
| P0-5 | WHY comments | PASS | No WHY-style comments. |
| P1-1 | Explicit return types | PASS | All functions have explicit return types. `writeJson` uses `unknown` for payload parameter -- acceptable. |
| P1-2 | Named interfaces | PASS | Uses named interfaces. |
| P1-3 | Non-null assertions | PASS | No `!` assertions. |
| P1-4 | TSDoc on exports | N/A | No exported functions. |
| P1-5 | catch blocks | N/A | No try/catch blocks. |
| **EXTRA** | `__filename` usage | WARN | Line 14 uses `__filename` (not `__dirname`). This is `SCRIPT_DIR = path.dirname(__filename)`. Should likely be `__dirname` directly. Likely a typo/bug. |

**Metric correctness:** Shadow retrieval uses token-overlap scoring. MRR ratio gate at >=0.98. Reciprocal rank is binary (1 if top result has score>0, else 0) which is a simplified MRR rather than true MRR@k. This is a potential metric accuracy concern -- the reciprocal rank calculation at line 132 does not compute actual rank position, only whether the top result scored > 0.

---

### 16. `run-redaction-calibration.ts`

| Check | ID | Status | Detail |
|-------|----|--------|--------|
| P0-1 | File header | PASS | Exact 3-line header block (lines 1-3). |
| P0-2 | No `any` exports | PASS | No `any` usage. |
| P0-3 | PascalCase | PASS | `RedactionGateFn` (type), `CalibrationCase` are PascalCase. |
| P0-4 | Commented-out code | PASS | No commented-out code blocks. |
| P0-5 | WHY comments | PASS | No WHY-style comments. |
| P1-1 | Explicit return types | PASS | All functions have explicit return types. |
| P1-2 | Named interfaces | PASS | Uses named interfaces. |
| P1-3 | Non-null assertions | PASS | No `!` non-null assertions used. (Note: `cachedRedactionGate` return at line 76 relies on the `require` result having `applyRedactionGate`, but no `!` operator is present.) |
| P1-4 | TSDoc on exports | N/A | No exported functions. |
| P1-5 | catch blocks | N/A | No try/catch blocks. |

**Metric correctness:** FP rate = falsePositives / totalTokens * 100. Hard gate <= 15%. False positive detection via known non-secret patterns (SHA-1, UUID, semver). Consistent.

---

### 17. `run-phase2-closure-metrics.mjs`

| Check | ID | Status | Detail |
|-------|----|--------|--------|
| P0-1 | File header | FAIL | Header is NOT the 3-line `MODULE:` format. Line 2 says `SCRIPT:` instead of `MODULE:`. Should use exact 3-line block with `MODULE:`. |
| P0-2 | No `any` exports | N/A | `.mjs` file -- no TypeScript type system. |
| P0-3 | PascalCase | N/A | `.mjs` file -- no TypeScript types. |
| P0-4 | Commented-out code | PASS | No commented-out code blocks. |
| P0-5 | WHY comments | PASS | No WHY-style comments. |
| P1-1 | Explicit return types | N/A | `.mjs` file -- no TypeScript. |
| P1-2 | Named interfaces | N/A | `.mjs` file. |
| P1-3 | Non-null assertions | N/A | `.mjs` file. |
| P1-4 | TSDoc on exports | N/A | `.mjs` file. |
| P1-5 | catch blocks | N/A | No try/catch blocks. |

**Metric correctness:** Precision = TP / (TP + FP), Recall = TP / (TP + FN). Gates: precision >= 85%, recall >= 70%. Manual save reduction = 1 - (missedSessions / totalSessions). MRR computed with true reciprocal rank positions (1/rank). MRR ratio gate >= 0.95x. Consistent and correct.

---

### 18. `mcp_server/eslint.config.mjs`

| Check | ID | Status | Detail |
|-------|----|--------|--------|
| P0-1 | File header | FAIL | No file header at all. Missing the 3-line `MODULE:` header block. |
| P0-2 | No `any` exports | PASS | `no-explicit-any` is `off` only for `tests/**/*.ts` files (line 33). Production code still enforces it via `tseslint.configs.recommended`. |
| P0-3 | PascalCase | N/A | No types defined. |
| P0-4 | Commented-out code | PASS | No commented-out code blocks. |
| P0-5 | WHY comments | PASS | No WHY-style comments. |
| P1-1 | Explicit return types | N/A | Config file, no functions. |
| P1-2 | Named interfaces | N/A | Config file. |
| P1-3 | Non-null assertions | N/A | Config file. |
| P1-4 | TSDoc on exports | N/A | Config file. |
| P1-5 | catch blocks | N/A | Config file. |

**Note:** The ESLint config disables several strict rules for test files (`ban-ts-comment`, `no-explicit-any`, `no-require-imports`, `no-unsafe-function-type`, `no-unused-vars`). This is a common and acceptable pattern for test files.

---

## Eval Metric Correctness Cross-Check

| Script | Metric | Correctness | Notes |
|--------|--------|-------------|-------|
| `run-bm25-baseline.ts` | MRR@5, NDCG@10, Recall@20, HitRate@1 | CORRECT | Delegates to well-tested `runBM25Baseline` function. Bootstrap CI included. |
| `run-ablation.ts` | Recall@20 delta | CORRECT | Disables channels one-at-a-time, measures delta. Standard ablation methodology. |
| `run-phase1-5-shadow-eval.ts` | Spearman rho | CORRECT | Standard formula: `1 - 6*sum(d^2)/(n*(n^2-1))`. |
| `run-phase1-5-shadow-eval.ts` | Context error telemetry | CORRECT | Dual-lane comparison across 10 pressure steps. |
| `run-phase2-closure-metrics.mjs` | Precision/Recall | CORRECT | Standard confusion matrix computation. |
| `run-phase2-closure-metrics.mjs` | MRR | CORRECT | True reciprocal rank positions used. |
| `run-phase3-telemetry-dashboard.ts` | Boost rates, pressure rates | CORRECT | Deterministic simulation with documented thresholds. |
| `run-quality-legacy-remediation.ts` | MRR ratio | WARN | Simplified reciprocal rank (binary: 1 if top score > 0, else 0). Not true MRR -- always yields 0 or 1 per query. See line 132. |
| `run-performance-benchmarks.ts` | p50/p95/p99 latency | CORRECT | Linear interpolation on sorted samples. Standard approach. |
| `run-redaction-calibration.ts` | FP rate | CORRECT | falsePositives / totalTokens * 100. |
| `map-ground-truth-ids.ts` | Relevance scoring (3/2/1) | CORRECT | Score ratio thresholds (>50%, >30%) with tier boosts. |
| `run-chk210-quality-backfill.ts` | Quality score | CORRECT | Delegates to `scoreMemoryQuality` with validator signals. |

---

## Summary

| Metric | Count |
|--------|-------|
| **Files scanned** | **18** |
| **P0 issues** | **13** |
| **P1 issues** | **8** |
| **Warnings (non-P0/P1)** | **3** |

### P0 Issue Breakdown

| P0 Check | Files Affected | Count |
|----------|----------------|-------|
| P0-1: File header format | 13 files | 13 |
| P0-2: No `any` exports | 0 files | 0 |
| P0-3: PascalCase | 0 files | 0 |
| P0-4: Commented-out code | 0 files | 0 |
| P0-5: WHY comment prefix | 0 files | 0 |

### P1 Issue Breakdown

| P1 Check | Files Affected | Distinct Violations |
|----------|----------------|---------------------|
| P1-1: Explicit return types | 3 files | 3 (4 missing annotations) |
| P1-2: Named interfaces | 1 file | 1 |
| P1-3: Non-null assertions | 0 files | 0 |
| P1-4: TSDoc on exports | 1 file | 1 |
| P1-5: catch `unknown` | 3 files | 3 (6 catch sites) |

### Top 3 Worst Files

1. **`map-ground-truth-ids.ts`** (6 issues) -- P0-1 (15-line header), P1-1 (missing return type on `main()`), P1-5 (4 bare catch blocks without `unknown` annotation)
2. **`run-chk210-quality-backfill.ts`** (4 issues) -- P0-1 (4-line header with `SCRIPT:` label), P1-1 (missing return types on `parseArgs()` and `main()`), P1-2 (inline anonymous type), plus prohibited `require()` imports from `@spec-kit/mcp-server/lib/`
3. **`run-ablation.ts`** / **`run-bm25-baseline.ts`** (2 issues each) -- P0-1 (15-16 line headers), P1-5 (catch without `unknown` type)

### Key Observations

1. **P0-1 is the dominant issue.** 13 of 18 files fail the exact 3-line header requirement. Most files have multi-line descriptions embedded in the header block, or use `SCRIPT:` instead of `MODULE:`, or have no header at all. Only 5 files (`collect-redaction-calibration-inputs.ts`, `import-policy-rules.ts`, `run-phase1-5-shadow-eval.ts`, `run-phase3-telemetry-dashboard.ts`, `run-redaction-calibration.ts`) have conformant headers.

2. **Metric correctness is generally strong.** The one concern is `run-quality-legacy-remediation.ts` which uses a binary reciprocal rank (line 132) rather than true MRR with position-based scoring. This may understate retrieval quality differences.

3. **Two files import from prohibited internal paths** (`run-chk210-quality-backfill.ts` via `require()`, `run-performance-benchmarks.ts` via `import`). These would be flagged by the project's own `check-no-mcp-lib-imports-ast.ts` tool.
