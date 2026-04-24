---
title: "Deep Research: Indexing-Normalization [system-spec-kit/022-hybrid-rag-fusion/002-indexing-normalization/research]"
description: "Comprehensive audit of indexing-normalization subsystem covering bugs, architecture, automation, UX, test coverage, and cross-skill alignment. 3 iterations, 14 agent runs, 70+ findings."
trigger_phrases:
  - "indexing normalization audit"
  - "002-indexing-normalization"
  - "improvement audit"
  - "deep research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/002-indexing-normalization/research"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["research.md"]
created: "2026-03-20"
level: 3
SPECKIT_TEMPLATE_SOURCE: "research | v2.2"
status: "complete"
updated: "2026-03-20"
---
# Deep Research: Indexing-Normalization Improvement Audit

> **Spec:** `002-indexing-normalization`
> **Purpose:** Identify improvements to logic, structure, architecture, automation, UX, bugs, and cross-skill alignment
> **Created:** 2026-03-20
> **Iterations:** 3 (converged at weighted vote 0.72 > 0.60)
> **Agents:** 14 runs across Codex CLI (GPT-5.4) and Copilot CLI (GPT-5.4)

---

<!-- ANCHOR:executive-summary -->
## 1. EXECUTIVE SUMMARY

This audit examined the indexing-normalization subsystem across 8,384 lines of core code, 1,845 lines of MCP server indexing, and 3 cross-skill SKILL.md definitions. Three iterations dispatched 14 parallel agent investigations, producing 70+ findings across 6 categories: bugs (7), architecture (9), standards (16), test coverage (11), automation/UX (5), and cross-skill alignment (6).

**Critical findings requiring immediate action:**
- `normalizeFileEntryLike()` accepts non-string values through unchecked type casts (BUG-001)
- No test coverage for `normalizeFileEntryLike()` or `memory-indexer.ts` failure paths (TCOV-001, TCOV-005)
- Spec-affinity has 27% false positive rate from generic trigger phrases (AFFINITY-001)
- P0 completion not consistently enforceable between spec-kit and sk-code-opencode (ALIGN-001)

**High-impact architectural improvements:**
- `runWorkflow()` has cyclomatic complexity 198 and should be decomposed into pipeline stages (ARCH-001)
- `input-normalizer.ts` has 4 distinct responsibilities and should be split into focused modules (SRP-001)
- CLI lacks exposure of MCP-layer controls like dryRun, asyncEmbedding, force (UX-002)
- Embedding cache is split-brain: MCP uses SQLite, scripts use in-memory only (PERF-CACHE-SPLIT)
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:methodology -->
## 2. METHODOLOGY

### Agent Configuration
| Agent ID | Runtime | Model | Focus |
|----------|---------|-------|-------|
| A1 | Codex CLI | GPT-5.4 high | Code analysis, bugs, edge cases |
| A2 | Codex CLI | GPT-5.4 high | Architecture, structure, modularity |
| A3 | Codex CLI | GPT-5.4 high | Cross-skill alignment |
| C1 | Copilot CLI | GPT-5.4 high | Improvements, automation, UX |
| C2 | Copilot CLI | GPT-5.4 high | Standards compliance |
| C3 | Copilot CLI | GPT-5.4 high | Test coverage gaps |

### Iteration Summary
| Iter | Focus | Agents | Findings | newInfoRatio | Coverage |
|------|-------|--------|----------|-------------|----------|
| 1 | Code Quality: input-normalizer, memory-indexer, spec-affinity | 6 | 35 | 0.85 | 41% |
| 2 | Architecture: workflow, embedding pipeline, parser, session data, cross-skill | 6 | 32 | 0.65 | 94% |
| 3 | Remaining gaps: batch delay, cross-skill confirmation | 2 | 5 | 0.15 | 97% |

### Convergence
Convergence achieved at iteration 3 with weighted vote 0.72 > 0.60 threshold. Question coverage at 97% (16.5/17 questions answered). Rolling average of newInfoRatio dropped from 0.85 to 0.55 across 3 iterations.
<!-- /ANCHOR:methodology -->

---

<!-- ANCHOR:bugs -->
## 3. BUGS AND EDGE CASES

### BUG-001: Unchecked Type Casts in normalizeFileEntryLike() [CRITICAL]
**File:** `input-normalizer.ts:351-378`
**Issue:** Uses `as string` casts on FILE_PATH and DESCRIPTION without verifying they are strings. A payload like `{ FILE_PATH: 42 }` passes `validateInputData()` and becomes a runtime number typed as string.
**Fix:** Add `typeof === 'string'` guards and either reject or coerce with `String()`.

### BUG-002: Unvalidated Array Elements in transformOpencodeCapture() [HIGH]
**File:** `input-normalizer.ts:709-986`
**Issue:** Validates top-level capture object but not array element shapes. `buildToolObservationTitle()` calls `.split('/')` on filePath without checking it's a string.
**Fix:** Add per-element guards for exchanges and toolCalls. Skip malformed records with warning.

### BUG-003: ACTION Not Normalized, MAGNITUDE Silently Dropped [MEDIUM]
**File:** `input-normalizer.ts:351-378`
**Issue:** ACTION is copied verbatim without normalization to a closed set. Unknown MODIFICATION_MAGNITUDE values become `undefined` instead of `'unknown'`.
**Fix:** Normalize ACTION through shared map. Coerce invalid magnitude to `'unknown'`.

### BUG-004: SPEC_ID_REGEX False Positives and Missing Patterns [MEDIUM]
**File:** `spec-affinity.ts:16`
**Issue:** Regex `/\b\d{3}-[a-z0-9][a-z0-9-]*\b/g` doesn't match namespace patterns like `02--domain`. False-positives on prose tokens like `123-foo`.
**Fix:** Split into path-context and free-text regexes. Support `NN--slug` forms.

### BUG-005: recencyFactor Is Not Recency-Based [LOW]
**File:** `memory-indexer.ts:117-123`
**Issue:** `recencyFactor` is hardcoded to 0.2, not derived from timestamps. Formula always produces [0.4, 1.0].
**Fix:** Derive from actual timestamps or rename to `baselineBonus`.

### BUG-006: importanceTier Validated But Not Carried Forward [P1]
**File:** `input-normalizer.ts:72-95, 386-452, 662-667`
**Issue:** `normalizeInputData()` validates `importanceTier`/`importance_tier` field presence and format, but does not carry it into the normalized output structure. The tier value is validated then silently lost. *(Found by ultra-think review cross-check.)*
**Fix:** Propagate validated importanceTier into NormalizedData output.

### ERR-001: No Error Handling Around Embedding/Vector Writes [MEDIUM]
**File:** `memory-indexer.ts:64-145`
**Issue:** No try/catch around `generateDocumentEmbedding()` or `vectorIndex.indexMemory()`. Exceptions propagate unhandled.
**Fix:** Wrap in try/catch, log structured details, return typed failure result.

### EDGE-001: Incomplete Canonical Path Deduplication [MEDIUM]
**File:** `input-normalizer.ts:1153-1166`, `spec-affinity.ts:93-102`
**Issue:** Raw capture dedup uses exact string equality in `seenPaths`. Dot-segments, relative-vs-absolute forms not unified in input-normalizer (though memory-index.ts does use `realpathSync` correctly).
**Fix:** Use shared canonical-path helper for file identity. Platform-aware normalization.
<!-- /ANCHOR:bugs -->

---

<!-- ANCHOR:architecture -->
## 4. ARCHITECTURE AND DECOMPOSITION

### ARCH-001: God Function — runWorkflow() [HIGH]
**File:** `workflow.ts` (2,482 lines)
**Evidence:** Cyclomatic complexity **198**. 43 imports, 71 named bindings. Spans 12 logical stages in one control flow: loading, alignment, contamination scrubbing, enrichment, parallel extraction, semantic summarization, tree thinning, template population, quality gates, writing, indexing, retry processing.
**Recommendation:** Extract pipeline stages: `load`, `align`, `enrich`, `extract`, `summarize`, `render`, `validate`, `persist`, `index`. Use `WorkflowContext` plus strategy interfaces for `EnrichmentStrategy`, `AlignmentPolicy`, `IndexPolicy`.

### SRP-001/002: input-normalizer.ts Has 4 Distinct Responsibilities [HIGH]
**File:** `input-normalizer.ts` (1,217 lines)
**Evidence:** Functions cluster into: manual payload normalization (`normalizeInputData`, 180 lines), schema validation (`validateInputData`, 126 lines), capture transformation (`transformOpencodeCapture`, 337 lines), spec-relevance heuristics (`buildSpecRelevanceKeywords`, `isSafeSpecFallback`).
**Decomposition Plan:**
1. `normalizers/manual-input.ts` — normalizeInputData and file-entry helpers
2. `validators/input-schema.ts` — validateInputData
3. `transformers/opencode-capture.ts` — transformOpencodeCapture and buildToolObservationTitle
4. `policies/capture-relevance.ts` — fallback/relevance helpers
5. `input-normalizer.ts` — thin compatibility barrel

### TYPES-001/002: session-types.ts Is a Flat Schema Dump [HIGH]
**File:** `session-types.ts` (534 lines)
**Evidence:** 40 interfaces, 5 type aliases, no composition. Mixes ingestion (CollectedDataBase), extractor (DecisionData), render (SessionData), and analytics (TopicCluster) types. 4 redundant file interfaces: FileChange, CollectedFileEntry, FileEntry, SpecFileEntry.
**Recommendation:** Split by bounded context. Define one canonical domain shape per concept.

### COUPLING-001: input-normalizer ↔ spec-affinity [MEDIUM]
**Evidence:** Coupling warranted but over-intimate. 5 low-level affinity helpers imported directly.
**Recommendation:** Collapse behind `filterCaptureToSpec(capture, specFolderHint)` policy API.

### DEP-001: No Circular Dependencies [LOW]
**Evidence:** Graph verified via AST traversal across scripts/ tree. Acyclic.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:performance -->
## 5. PERFORMANCE AND CACHING

### PERF-CACHE-SPLIT: Embedding Cache Split-Brain [HIGH]
**Evidence:** MCP save path uses SQLite-backed persistent cache (`embedding-cache.ts`, 226 lines). Script-side `memory-indexer.ts` uses shared in-memory cache only (`shared/embeddings.ts`). Same content can be embedded twice through different paths.
**Recommendation:** Unify on SQLite cache. Pass database reference to script-side indexer.

### PERF-RETRY-CONSISTENCY: Cache Key Divergence [MEDIUM]
**Evidence:** Retry path normalizes content before embedding (BUG-1 fix in `retry-manager.ts:254-257`). Sync save uses weighted section text. Cache keys may not align for same logical content.
**Recommendation:** Ensure both paths use identical content normalization before hashing.

### PERF-WEIGHTING: Importance Weights Lack Research Backing [MEDIUM]
**Evidence:** Formula `length*0.3 + anchor*0.3 + recency*0.2 + baseline*0.2` uses unnamed magic numbers. No literature citation. `recencyFactor` is static, not timestamp-derived.
**Recommendation:** Extract to named constants. Add actual recency computation. Consider adaptive weights from `memory_validate` feedback.

### PIPELINE-003: Scan Concurrency TOCTOU Window [MEDIUM]
**Evidence:** `processBatches()` uses `Promise.all` with batch size 5. Pre-lock TOCTOU window before spec-folder mutex acquisition.
**Recommendation:** Acceptable for current single-server deployment. Document the constraint.

### PIPELINE-005: Incremental Index Misses Content Changes [MEDIUM]
**Evidence:** Only mtime-fast-path (<1000ms delta). `content_hash` stored but not consulted during categorization. Clock skew or preserved mtimes can miss real changes.
**Recommendation:** Add `content_hash` comparison as secondary reindex signal.
<!-- /ANCHOR:performance -->

---

<!-- ANCHOR:spec-affinity -->
## 6. SPEC-AFFINITY INTELLIGENCE

### AFFINITY-001: Generic Trigger Phrases Cause 27% False Positive Rate [P0]
**Evidence:** Synthetic benchmark across `specs/` tree: 33,512 / 122,150 negative cross-spec pairs matched. 84% of false hits from phrase matches (e.g., "feature", "specification" in exactPhrases). 226/350 specs have generic single-word triggers.
**Fix:** Never let single-word triggers become exact anchors. Filter through stopword/frequency analysis.

### AFFINITY-002: Substring Token Matching Should Use Boundaries [P0]
**Evidence:** Current matching can hit mid-word substrings.
**Fix:** Use word-boundary matching (`\b` anchoring) for keyword tokens.

### AFFINITY-003: Stopword List Under-Calibrated [P1]
**Evidence:** Missing high-frequency terms like "specification". Corpus analysis shows widespread overlap.
**Fix:** Expand stopword list based on corpus TF-IDF analysis.

### AFFINITY-004: Semantic Affinity Feasible but Needs Async Plumbing [P2]
**Evidence:** `generateDocumentEmbedding`/`generateQueryEmbedding` already exported in shared package. But spec-affinity used in sync hot paths in workflow.ts and input-normalizer.ts.
**Recommendation:** Keep as optional reranker, not primary filter. TF-IDF/BM25 scorer as intermediate step.

### AFFINITY-005: TF-IDF/BM25 Scorer as Next Step [P1]
**Evidence:** Would downweight corpus-common terms without forcing async. Fits sync filter pattern.
**Recommendation:** Build lightweight term-frequency scorer for spec-affinity target construction.
<!-- /ANCHOR:spec-affinity -->

---

<!-- ANCHOR:automation-ux -->
## 7. AUTOMATION AND UX

### UX-001: CLI Interface Overloaded and Confusing [HIGH]
**File:** `generate-context.ts:51-157`
**Issue:** One positional arg is both JSON file and spec folder. Plus --stdin, --json, --session-id. Buried precedence rules.
**Fix:** Explicit subcommands: `save`, `save-json`, `save-stdin`.

### UX-002: MCP Controls Not Exposed to CLI [HIGH]
**File:** `generate-context.ts` vs `tool-input-schemas.ts:162-168`
**Issue:** dryRun, asyncEmbedding, force, includeSpecDocs, incremental, verbose, json-output all exist in MCP but not CLI.
**Fix:** Add operator-facing flags mirroring MCP capabilities.

### AUTO-001: Stale Index Auto-Repair [HIGH]
**Issue:** System detects stale indexes but doesn't auto-repair on startup.
**Fix:** Wire `memory_health` repair hooks to startup/scan lifecycle.

### SESSION-003: Intentional Data-Loss Points Not Surfaced [P1]
**Evidence:** 20 exchanges cap, 15 observations cap, 10 files cap, 10 outcomes cap, 160-char tool preview truncation.
**Fix:** Surface truncation events as user-visible warnings.

### SESSION-004: Native Capture Paths Skip Schema Validation [P1]
**Evidence:** File/JSON input gets `validateInputData()`. Native capture paths are accepted if "usable" without schema validation.
**Fix:** Add lightweight structural validation for native capture data.
<!-- /ANCHOR:automation-ux -->

---

<!-- ANCHOR:standards -->
## 8. STANDARDS COMPLIANCE

### Type Safety
- **STD-004:** Unsafe assertions (`JSON.parse(...) as T`, double-casting) in input-normalizer.ts
- **STD-005:** Bare `catch {}` blocks in spec-affinity.ts:147,156,250

### Logging
- **STD-007/008/009:** Mixed console.log/structuredLog across input-normalizer, memory-indexer, collect-session-data

### Function Size
- **STD-010:** `transformOpencodeCapture` (337 lines), `normalizeInputData` (180 lines), `validateInputData` (126 lines), `runWorkflow` (1000+ lines)
- **STD-011:** `indexMemory` (94 lines) combines 5 concerns
- **STD-013:** `collectSessionData` (313 lines)

### Documentation
- **STD-014:** Magic numbers in importance weighting (10000, 10, 0.3, 0.3, 0.2, 0.2, 500)
- **STD-015/016:** Missing JSDoc on exported public functions in spec-affinity.ts and collect-session-data.ts

### File Structure
- **STD-001/002/003:** Section marker inconsistencies, import ordering deviations
<!-- /ANCHOR:standards -->

---

<!-- ANCHOR:test-coverage -->
## 9. TEST COVERAGE GAPS

### Critical Gaps
| ID | Module | Gap |
|----|--------|-----|
| TCOV-001 | normalizeFileEntryLike() | No focused tests. Empty objects, missing fields, wrong types untested. |
| TCOV-005 | memory-indexer.ts | No tests for embedding null, trigger failure, vectorIndex throw, malformed metadata. |

### High Gaps
| ID | Module | Gap |
|----|--------|-----|
| TCOV-002 | validateInputData() | Validation branch coverage missing for FILES-not-array, wrong-type triggerPhrases, etc. |
| TCOV-003 | Relevance helpers | No direct tests for buildSpecRelevanceKeywords, extractSpecIds, getCurrentSpecId. |
| EDGE-001 | Path canonicalization | Mixed-separator and `..` paths only in legacy JS tests, not Vitest suite. |
| INTG-001 | Integration | 63:37 unit/integration ratio. Real e2e save/index shallow. |

### Medium Gaps
| ID | Module | Gap |
|----|--------|-----|
| TCOV-004 | Observation helpers | transformKeyDecision, buildSessionSummaryObservation untested. |
| TCOV-006 | Importance tiers | No boundary tests for NaN/Infinity/negative in applyTierBoost. |
| TCOV-007 | Memory parser | Missing UTF-16 BOM, invalid anchor-id, duplicate trigger dedup. |

### Test Infrastructure
| ID | Issue |
|----|-------|
| TEST-CONFIG | Script-side *.vitest.ts not in default Vitest include pattern. Coverage exists but doesn't run. |
| APAT-001 | Over-mocking in handler-memory-index-cooldown.vitest.ts. |
<!-- /ANCHOR:test-coverage -->

---

<!-- ANCHOR:cross-skill -->
## 10. CROSS-SKILL ALIGNMENT

### ALIGN-001: P0 Enforcement Gap [BREAKING]
**Skills:** system-spec-kit, sk-code-opencode
**Issue:** Spec checklist P0 items are narrow. sk-code-opencode P0 gate set is broader (headers, naming, filesystem safety). Verifier only treats COMMON/JSON/JSONC as ERROR; JS/TS/PY/SH headers are WARN. Tasks can pass scripted checks while violating documented P0 rules.

### ALIGN-002: Tier Taxonomy Partially Documented [INCONSISTENT]
**Issue:** 6-tier system (constitutional/critical/important/normal/temporary/deprecated) only documented in system-spec-kit. sk-code-opencode and sk-doc don't mention it.

### ALIGN-003: HVR Not Enforced on Spec Documents [INCONSISTENT]
**Issue:** sk-doc says HVR applies to all documentation output. But template_rules.json gives spec no required sections, validate_document.py skips style pipeline for spec type.

### ALIGN-004: Document-Type Scoring Not Aligned [INCONSISTENT]
**Issue:** system-spec-kit has 10 indexed document types with retrieval multipliers. sk-doc has no corresponding model. Plan, decision_record, implementation_summary not first-class sk-doc types.

### ALIGN-005: Validator Exit Codes Differ [INCONSISTENT]
**Issue:** validate.sh uses 0/1/2 (pass/warnings/errors). verify_alignment_drift.py uses 0/1 (warnings return 0 unless --fail-on-warn).

### ALIGN-006: Smart Router Ambiguity Delta Differs [COSMETIC]
**Issue:** system-spec-kit and sk-doc use ambiguity_delta=1.0. sk-code-opencode uses hardcoded 0.8 threshold with different parameter name.
<!-- /ANCHOR:cross-skill -->

---

<!-- ANCHOR:session-data -->
## 11. SESSION DATA COLLECTION

### SESSION-001: Capture Source Asymmetry [P2]
Only Claude flagged for "tool title with path" capability, affecting downstream contamination behavior.

### SESSION-002: Failure Chain Ends Hard, Not Graceful [P1]
Capture failure chain: JSON file → preferred/native capture → hard failure. Simulation branch is defensive leftover.

### SESSION-005: Type Hierarchy Over-Complicated [P2]
CollectedDataFull adds no structure. CollectedDataBase uses `[key: string]: unknown`, weakening type safety.

### SESSION-006: Observation Cap Stale Documentation [P3]
Cap raised from 3 to 15 but stale test comments still reference 3.
<!-- /ANCHOR:session-data -->

---

<!-- ANCHOR:pipeline -->
## 12. MEMORY PARSER AND INDEXING PIPELINE

### PIPELINE-001: Canonical Dedup Works Correctly [CONFIRMED]
`getCanonicalPathKey()` uses `realpathSync()` with `path.resolve()` fallback. Symlinks/dot-segments collapse.

### PIPELINE-002: Tier Precedence Weakly Documented [LOW]
Not strict frontmatter parsing. Scans content for uncommented tier strings, then inline markers, then document-type default.

### PIPELINE-004: Rename/Move Is Eventual Cleanup [MEDIUM]
Moves create new row. Old row deleted next scan cycle. Not atomic relocation.

### PIPELINE-006: Alias Detection Narrowly Scoped [LOW-MEDIUM]
Only normalizes `.opencode/specs/` ↔ `specs/` text variants.
<!-- /ANCHOR:pipeline -->

---

<!-- ANCHOR:recommendations -->
## 13. PRIORITIZED RECOMMENDATIONS

### P0 — Immediate Action
1. **Fix BUG-001**: Add type guards in normalizeFileEntryLike() for string fields
2. **Fix AFFINITY-001**: Remove generic single-word triggers from exactPhrases
3. **Add TCOV-001**: Focused test suite for normalizeFileEntryLike()
4. **Add TCOV-005**: Failure path tests for memory-indexer.ts
5. **Fix ALIGN-001**: Align P0 enforcement between spec-kit verifier and sk-code-opencode

### P1 — Next Sprint
6. **UX-002**: Expose MCP controls (dryRun, force, asyncEmbedding) to CLI
7. **ARCH-001**: Begin runWorkflow() decomposition into pipeline stages
8. **SRP-001/002**: Decompose input-normalizer.ts into 4 focused modules
9. **AFFINITY-005**: Build TF-IDF/BM25 scorer for spec-affinity
10. **PERF-CACHE-SPLIT**: Unify embedding caches on SQLite

### P2 — Planned
11. **UX-001**: Restructure CLI into explicit subcommands
12. **AUTO-001**: Wire stale index auto-repair to startup
13. **TYPES-001/002**: Split session-types.ts by bounded context
14. **PIPELINE-005**: Add content_hash comparison to incremental index
15. **ALIGN-003**: Enforce HVR on spec documents via sk-doc pipeline
16. **ALIGN-005**: Standardize validator exit codes across tools

### P3 — Backlog
17. **STD-014**: Extract magic numbers to named constants
18. **STD-007/008/009**: Standardize on structuredLog
19. **BUG-005**: Make recencyFactor timestamp-derived or rename
20. **AFFINITY-004**: Semantic affinity as optional reranker
<!-- /ANCHOR:recommendations -->

---

<!-- ANCHOR:convergence -->
## 14. CONVERGENCE REPORT

| Metric | Value |
|--------|-------|
| **Total Iterations** | 3 |
| **Total Agent Runs** | 14 |
| **Total Findings** | 72 |
| **Questions Answered** | 16.5/17 (97%) |
| **newInfoRatio Trend** | 0.85 → 0.65 → 0.15 |
| **Rolling Avg (3)** | 0.55 |
| **Weighted Convergence Score** | 0.72 (threshold: 0.60) |
| **Convergence Method** | Question coverage (97%) + declining newInfoRatio |

### Files Examined (by agent count)
| File | Agents |
|------|--------|
| input-normalizer.ts (1,217 lines) | 10 |
| workflow.ts (2,482 lines) | 8 |
| memory-indexer.ts (205 lines) | 8 |
| spec-affinity.ts (546 lines) | 8 |
| session-types.ts (534 lines) | 6 |
| memory-parser.ts (969 lines) | 4 |
| memory-index.ts (647 lines) | 4 |
| generate-context.ts (612 lines) | 4 |
| collect-session-data.ts (1,005 lines) | 4 |
| importance-tiers.ts (229 lines) | 6 |
| SKILL.md (3 files) | 4 |
<!-- /ANCHOR:convergence -->

---

<!-- ANCHOR:remaining-gaps -->
## 15. REMAINING GAPS

1. **Q7 partial**: Exact embedding batch delay configuration needs confirmation from iter 3 C1 output.
2. **Q16 partial**: Memory save trigger ambiguity when sk-doc creates spec folder documentation not fully explored.
3. **No eval set**: Spec-affinity false positive rate measured synthetically, not with labeled real-world data. Adversarial test cases for spec-affinity are missing (AFFINITY-006, flagged by ultra-think review).
4. **runWorkflow decomposition**: Concrete module extraction plan outlined but not validated against all call paths. Rollout order (characterization tests first, then helper extraction, then module boundaries) not specified.
5. **Embedding cache unification**: Feasibility confirmed but migration path not specified.
6. **Cyclomatic complexity precision**: ARCH-001 cites 198 (full function AST), later agent refined hotspot as inner callback at 158. Both evidence-backed; method differs.
7. **PIPELINE-001 vs EDGE-001**: PIPELINE-001 says MCP canonical dedup works (realpathSync). EDGE-001 says input-normalizer dedup is incomplete (raw strings). Different code paths, not contradictory.
<!-- /ANCHOR:remaining-gaps -->

---

<!-- ANCHOR:evidence-sources -->
## 16. EVIDENCE SOURCES

### Agent Outputs (in scratch/)
- `scratch/agent-output-iter-001-codex-A1.md` (70KB) — Bug hunting
- `scratch/agent-output-iter-001-codex-A2.md` (110KB) — Architecture review with AST analysis
- `scratch/agent-output-iter-001-codex-A3.md` (95KB) — Cross-skill alignment
- `scratch/agent-output-iter-001-copilot-C1.md` (17KB) — Improvement proposals
- `scratch/agent-output-iter-001-copilot-C2.md` (12KB) — Standards compliance
- `scratch/agent-output-iter-001-copilot-C3.md` (24KB) — Test coverage gaps
- `scratch/agent-output-iter-002-codex-A1.md` (67KB) — workflow.ts decomposition
- `scratch/agent-output-iter-002-codex-A2.md` (92KB) — Embedding pipeline
- `scratch/agent-output-iter-002-codex-A3.md` (70KB) — Cross-skill deep dive
- `scratch/agent-output-iter-002-copilot-C1.md` (13KB) — Spec-affinity intelligence
- `scratch/agent-output-iter-002-copilot-C2.md` (13KB) — Memory parser pipeline
- `scratch/agent-output-iter-002-copilot-C3.md` (15KB) — Session data collection
- `scratch/agent-output-iter-003-codex-A1.md` — Cross-skill gaps
- `scratch/agent-output-iter-003-copilot-C1.md` — Embedding perf details

### Iteration Synthesis
- `research/iterations/iteration-001.md` — Code quality findings
- `research/iterations/iteration-002.md` — Architecture and performance findings
<!-- /ANCHOR:evidence-sources -->

---

<!-- ANCHOR:related -->
## 17. RELATED RESOURCES

- **Spec folder**: `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/002-indexing-normalization/`
- **Implementation**: `.opencode/skill/system-spec-kit/scripts/` and `mcp_server/`
- **Skills**: `system-spec-kit`, `sk-code-opencode`, `sk-doc`
- **Test suites**: `mcp_server/tests/` (181 tests passing), `scripts/tests/` (37/38 passing)
<!-- /ANCHOR:related -->
