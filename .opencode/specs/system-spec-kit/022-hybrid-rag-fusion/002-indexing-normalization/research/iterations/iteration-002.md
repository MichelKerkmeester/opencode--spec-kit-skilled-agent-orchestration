# Iteration 002: Architecture & Performance — Embedding Pipeline, Parser, Session Data, Cross-Skill

**Focus**: workflow.ts decomposition, embedding pipeline/cache analysis, spec-affinity intelligence, memory parser pipeline, session data collection, cross-skill alignment.

## Synthesized Findings

### Architecture (from A1, iter 1 A2)

| ID | Impact | Issue |
|----|--------|-------|
| ARCH-001 | HIGH | `runWorkflow()` has cyclomatic complexity **198** — textbook God Function spanning loading, alignment, scrubbing, enrichment, extraction, summarization, thinning, rendering, quality gates, writing, indexing, retry. |
| ARCH-002 | MEDIUM | workflow.ts already has Step 1-12 log sections but monolithic implementation. Natural pipeline stages exist but aren't extracted. |
| SRP-001 | HIGH | input-normalizer.ts has 4 distinct concerns: manual normalization, schema validation, capture transformation, spec-relevance heuristics. |
| SRP-002 | HIGH | Concrete decomposition: extract `normalizers/manual-input.ts`, `validators/input-schema.ts`, `transformers/opencode-capture.ts`, `policies/capture-relevance.ts`, keep thin barrel. |
| TYPES-001 | HIGH | session-types.ts is flat schema dump: 40 interfaces, 5 type aliases, no composition. Mixes ingestion, extractor, render, and analytics types. |
| TYPES-002 | MEDIUM | 4 redundant file-related interfaces: FileChange, CollectedFileEntry, FileEntry, SpecFileEntry. input-normalizer.ts redeclares types instead of using canonical ones. |
| COUPLING-001 | MEDIUM | input-normalizer → spec-affinity coupling warranted but over-intimate. Should collapse behind single policy API. |
| DEP-001 | LOW | No circular dependencies found. |

### Embedding Pipeline & Cache (from A2)

| ID | Impact | Issue |
|----|--------|-------|
| PERF-CACHE-SPLIT | HIGH | MCP save path uses SQLite-backed persistent embedding cache. Script-side memory-indexer uses in-memory-only cache. Same content can be embedded twice through different paths. |
| PERF-RETRY-CONSISTENCY | MEDIUM | Retry path normalizes content before embedding (BUG-1 fix), but sync save path may use weighted section text. Cache keys may not align. |
| PERF-WEIGHTING | MEDIUM | Importance weighting formula uses magic numbers. `recencyFactor` is hardcoded 0.2, not timestamp-derived. No literature citation for weight distribution. |

### Spec-Affinity Intelligence (from C1)

| ID | Priority | Issue |
|----|----------|-------|
| AFFINITY-001 | P0 | Generic trigger phrases (e.g., "feature", "specification") are promoted to exactPhrases, causing 27% false positive rate on cross-spec matching. 84% of false hits come from phrase matches. |
| AFFINITY-002 | P0 | Substring token matching should be replaced with token-boundary matching. |
| AFFINITY-003 | P1 | Stopword list missing high-frequency terms. 226/350 specs have generic single-word triggers. |
| AFFINITY-004 | P2 | Semantic affinity feasible — `generateDocumentEmbedding`/`generateQueryEmbedding` already exported in shared package. But spec-affinity used in sync hot paths, so full replacement needs async plumbing. |
| AFFINITY-005 | P1 | Lightweight TF-IDF/BM25-style scorer is best next step — downweight corpus-common terms without forcing async. |

### Memory Parser & Indexing Pipeline (from C2)

| ID | Severity | Issue |
|----|----------|-------|
| PIPELINE-001 | MEDIUM | Canonical dedup works via `realpathSync()` with `path.resolve()` fallback. Symlinks/dot-segments collapse correctly. |
| PIPELINE-002 | LOW | Tier precedence is deterministic but weakly documented. Not strict frontmatter — scans content for uncommented tier strings. |
| PIPELINE-003 | MEDIUM | Scan concurrency partially mitigated. `processBatches()` runs concurrent `Promise.all` (batch=5). Pre-lock TOCTOU window exists before spec-folder mutex. |
| PIPELINE-004 | MEDIUM | Rename/move = eventual cleanup, not atomic relocation. Moves create new row, old row deleted next scan cycle. |
| PIPELINE-005 | MEDIUM | Incremental indexing is mtime-fast-path only (<1000ms delta). `content_hash` stored but not consulted during categorization. |
| PIPELINE-006 | LOW-MEDIUM | Alias conflict detection only normalizes `.opencode/specs/` ↔ `specs/` text variants. Misses broader alias forms. |

### Session Data Collection (from C3)

| ID | Priority | Issue |
|----|----------|-------|
| SESSION-001 | P2 | Capture-source handling mostly consistent after normalization. Only Claude flagged for "tool title with path" capability. |
| SESSION-002 | P1 | Capture failure ends in hard failure, not simulation. Simulation branch is defensive leftover. |
| SESSION-003 | P1 | Intentional data-loss points: 20 exchanges cap, 15 observations cap, 10 files cap, 10 outcomes cap, 160-char tool preview truncation. Not all logged/surfaced. |
| SESSION-004 | P1 | Native capture paths skip schema validation. Malformed-but-nonempty data can reach extraction. Post-render gating is strong but pre-capture ingress is weak. |
| SESSION-005 | P2 | Type hierarchy serviceable but over-complicated. CollectedDataFull adds no structure. [key: string]: unknown on CollectedDataBase weakens type safety. |
| SESSION-006 | P3 | Observation cap was raised from 3 to 15. Stale test comments still reference old cap. Even 15 can drop data in long sessions. |

### Cross-Skill Alignment (A3 — partial, still completing)
- HVR enforcement gap identified (sk-doc HVR not enforced on spec documents)
- Tier naming comparison in progress
- Exit code semantics analysis in progress

## Questions Coverage Update

| Q# | Status | Evidence |
|----|--------|----------|
| 1 | ANSWERED | EDGE-001, PIPELINE-001 |
| 2 | ANSWERED | SRP-001, SRP-002, ARCH-001, STD-010 |
| 3 | ANSWERED | ERR-001 |
| 4 | ANSWERED | BUG-001, BUG-003 |
| 5 | PARTIAL | PERF-CACHE-SPLIT (split-brain confirmed, unification path unclear) |
| 6 | ANSWERED | BUG-005, STD-014, PERF-WEIGHTING |
| 7 | PARTIAL | Batch delay details still pending |
| 8 | ANSWERED | AFFINITY-001 through AFFINITY-005 |
| 9 | ANSWERED | UX-001 |
| 10 | ANSWERED | AUTO-001 |
| 11 | ANSWERED | UX-002 |
| 12 | PARTIAL | A3 working |
| 13 | PARTIAL | A3 working |
| 14 | PARTIAL | HVR gap identified, enforcement details pending |
| 15 | PARTIAL | Document-type scoring multipliers partially mapped |
| 16 | PARTIAL | Memory save trigger analysis pending |
| 17 | OPEN | Smart Router ambiguity_delta analysis pending |

## newInfoRatio

Estimated: **0.65** — significant new findings in architecture, pipeline, session data, and spec-affinity.
Questions coverage: 11 answered + 5 partial + 1 open = ~76%
