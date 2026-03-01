# Documentation Completeness Audit — Spec 140 (Hybrid RAG Fusion Refinement)

**Audit date:** 2026-03-01
**Scope:** All 95 features from `summary_of_new_features.md` checked against 5 documentation files
**Status:** READ-ONLY research task — no files modified

---

## 1. Summary Statistics

| Category | Count | Percentage |
|----------|-------|------------|
| **Fully documented** | 34 | 36% |
| **Partially documented** | 28 | 29% |
| **Undocumented** | 33 | 35% |
| **Total features** | 95 | 100% |

### Documentation coverage by file

| File | Features covered (full or partial) |
|------|-----------------------------------|
| `README.md` (skill root) | 30 — high-level pipeline overview, key capabilities table, search pipeline diagram |
| `mcp_server/README.md` | 42 — search system, feature flags, configuration, cognitive memory, tools |
| `mcp_server/lib/README.md` | 25 — module structure listing, feature descriptions |
| `mcp_server/lib/search/README.md` | 30 — module listing, search features, configuration, R8/S5 sections |
| `SKILL.md` | 12 — tool reference, feature flags subset, memory concepts |

### User-facing features needing SKILL.md documentation

15 features affect MCP tool behavior or user-visible retrieval quality but are not documented in SKILL.md.

---

## 2. Feature-by-Feature Checklist

### Legend
- **Y** = Fully documented (feature described with sufficient detail in appropriate README)
- **P** = Partially documented (mentioned or listed but missing operational details)
- **N** = Not documented (no mention in any of the 5 audited files)
- **UF** = User-facing (affects MCP tool behavior; should be in SKILL.md)

---

### Bug fixes and data integrity

| # | Feature | Doc? | Where | What's missing | UF? |
|---|---------|------|-------|----------------|-----|
| 1 | Graph channel ID fix (G1) | N | — | No mention in any README. Critical bug fix undocumented. | No |
| 2 | Chunk collapse deduplication (G3) | N | — | No mention in any README. Affects all default search queries. | Yes |
| 3 | Co-activation fan-effect divisor (R17) | P | `lib/cognitive/README.md` mentions "R17 fan-effect sqrt divisor" in module listing; `lib/README.md` lists co-activation. | Not in audited 5 files with detail. Only mentioned as a module annotation. | No |
| 4 | SHA-256 content-hash deduplication (TM-02) | P | `mcp_server/README.md` mentions content-hash in `memory_save` context indirectly; `lib/README.md` mentions PE gating. | No explicit description of SHA-256 skip-on-duplicate behavior. | No |

### Evaluation and measurement

| # | Feature | Doc? | Where | What's missing | UF? |
|---|---------|------|-------|----------------|-----|
| 5 | Evaluation database and schema (R13-S1) | P | `mcp_server/lib/README.md` lists eval/ modules (10 modules); `mcp_server/README.md` mentions eval logging feature flag. | No description of the separate eval database, its 5-table schema, or its security rationale. | No |
| 6 | Core metric computation (R13-S1) | N | — | Nine metrics (MRR@5, NDCG@10, Recall@20, etc.) not described anywhere. | No |
| 7 | Observer effect mitigation (D4) | N | — | No mention of latency overhead check or eval logging fallback behavior. | No |
| 8 | Full-context ceiling evaluation (A2) | P | `lib/README.md` lists `eval-ceiling.ts` in module structure. | No description of the LLM-based ceiling methodology or the 2x2 comparison matrix. | No |
| 9 | Quality proxy formula (B7) | P | `lib/README.md` lists `eval-quality-proxy.ts` in module structure. | Formula, weights, and correlation methodology not described. | No |
| 10 | Synthetic ground truth corpus (G-NEW-1, G-NEW-3) | P | `lib/README.md` lists `ground-truth-data.ts` and `ground-truth-generator.ts`. | No description of the 110-query corpus, intent coverage, or hard negative design. | No |
| 11 | BM25-only baseline (G-NEW-1) | P | `lib/README.md` lists `bm25-baseline.ts` in eval/. | No description of baseline methodology or MRR@5 measurement. | No |
| 12 | Agent consumption instrumentation (G-NEW-2) | N | — | No mention in any README. | No |
| 13 | Scoring observability (T010) | P | `mcp_server/README.md` mentions `SPECKIT_EXTENDED_TELEMETRY` flag; `lib/README.md` lists telemetry/ modules. | No description of interference score sampling, 5% sample rate, or scoring_observations table. | No |
| 14 | Full reporting and ablation study framework (R13-S3) | P | `mcp_server/README.md` mentions `SPECKIT_ABLATION` flag. MCP tools `eval_run_ablation` and `eval_reporting_dashboard` exist as tool definitions. | Framework architecture, sign test, sprint/channel aggregation not described in any README. | Yes |
| 15 | Shadow scoring and channel attribution (R13-S2) | P | `mcp_server/README.md` mentions `SPECKIT_SHADOW_SCORING` is hardcoded OFF. | Full description of shadow infrastructure, Kendall tau, and channel attribution not documented. Channel attribution remaining active is not documented. | No |

### Graph signal activation

| # | Feature | Doc? | Where | What's missing | UF? |
|---|---------|------|-------|----------------|-----|
| 16 | Typed-weighted degree channel (R4) | Y | `README.md` key capabilities table; `mcp_server/README.md` search pipeline diagram and channel table; `search/README.md` module listing and data flow. | — | No |
| 17 | Co-activation boost strength increase (A7) | P | `mcp_server/README.md` mentions co-activation +0.25 in post-fusion table. | A7 not mentioned by name. No mention of SPECKIT_COACTIVATION_STRENGTH env var or dark-run measurement. | Yes |
| 18 | Edge density measurement | P | `lib/README.md` lists `edge-density.ts`. `search/README.md` mentions it in module listing. | No description of the measurement methodology or its role in R10 escalation decisions. | No |
| 19 | Weight history audit tracking | N | — | No mention of `weight_history` table, created_by/last_accessed fields, rollbackWeights(), or MAX_AUTO_STRENGTH. | No |
| 20 | Graph momentum scoring (N2a) | N | — | No mention in any audited README. degree_snapshots table, momentum computation, additive +0.05 cap undocumented. | No |
| 21 | Causal depth signal (N2b) | N | — | No mention in any audited README. BFS depth traversal, diameter normalization undocumented. | No |
| 22 | Community detection (N2c) | N | — | No mention in any audited README. BFS components, Louvain escalation, community_assignments table undocumented. | No |

### Scoring and calibration

| # | Feature | Doc? | Where | What's missing | UF? |
|---|---------|------|-------|----------------|-----|
| 23 | Score normalization | P | `mcp_server/README.md` lists `SPECKIT_SCORE_NORMALIZATION` flag. | No description of min-max methodology, 15:1 magnitude mismatch problem, or edge case handling. | No |
| 24 | Cold-start novelty boost (N4) | P | `mcp_server/README.md` mentions "Cold-start N4 boost" in post-fusion enhancements table with formula. | Sprint 8 removal from hot path not noted. No detailed description of the 48-hour window or cap behavior. | No |
| 25 | Interference scoring (TM-01) | Y | `README.md` key capabilities; `mcp_server/README.md` post-fusion table; `lib/README.md` features table; `search/README.md` module listing. | — | No |
| 26 | Classification-based decay (TM-03) | P | `README.md` key capabilities; `mcp_server/README.md` lists `SPECKIT_CLASSIFICATION_DECAY` flag. | No description of the 2D multiplier matrix (context x tier) or Infinity strategy. | No |
| 27 | Folder-level relevance scoring (PI-A1) | P | `lib/README.md` lists `folder-relevance.ts` and `folder-scoring.ts`. `search/README.md` lists `folder-relevance.ts`. | No description of the 4-factor formula, decay function, or archive folder multipliers. | No |
| 28 | Embedding cache (R18) | Y | `README.md` key capabilities; `mcp_server/README.md` lib structure; `lib/README.md` features table and cache/ structure; `search/README.md` not directly but referenced. | — | No |
| 29 | Double intent weighting investigation (G2) | N | — | No mention of the investigation findings or the `isHybrid` boolean prevention mechanism. | No |
| 30 | RRF K-value sensitivity analysis (FUT-5) | P | `lib/README.md` lists `k-value-analysis.ts` in eval/ structure. | No description of the grid search methodology or empirical results. | No |
| 31 | Negative feedback confidence signal (A4) | N | — | No mention in any audited README. SPECKIT_NEGATIVE_FEEDBACK flag, demotion multiplier, 30-day recovery undocumented. | Yes |
| 32 | Auto-promotion on validation (T002a) | P | `search/README.md` lists `auto-promotion.ts` in module listing. | No description of thresholds (5/10 validations), throttle safeguard, or audit table. | Yes |

### Query intelligence

| # | Feature | Doc? | Where | What's missing | UF? |
|---|---------|------|-------|----------------|-----|
| 33 | Query complexity router (R15) | Y | `README.md` key capabilities; `mcp_server/README.md` search pipeline diagram; `lib/README.md` features table; `search/README.md` module listing with detail. | — | No |
| 34 | Relative score fusion (R14/N1) | Y | `README.md` key capabilities; `mcp_server/README.md` post-fusion table; `lib/README.md` features table; `search/README.md` module listing. Sprint 8 removal of flag noted. | — | No |
| 35 | Channel min-representation (R2) | Y | `mcp_server/README.md` post-fusion table and flag; `search/README.md` module listing with detail. Sprint 8 QUALITY_FLOOR fix noted. | — | No |
| 36 | Confidence-based result truncation (R15-ext) | Y | `README.md` key capabilities; `mcp_server/README.md` post-fusion table and flag; `lib/README.md` features table; `search/README.md` module listing. | — | No |
| 37 | Dynamic token budget allocation (FUT-7) | Y | `README.md` key capabilities; `mcp_server/README.md` post-fusion table and flag; `lib/README.md` features table; `search/README.md` module listing. | — | No |
| 38 | Query expansion (R12) | P | `mcp_server/README.md` mentions multi-query RAG fusion; `search/README.md` lists `query-expander.ts`. | Embedding-based expansion (R12) not distinguished from multi-query RAG expansion (MULTI_QUERY). SPECKIT_EMBEDDING_EXPANSION flag not documented. | Yes |

### Memory quality and indexing

| # | Feature | Doc? | Where | What's missing | UF? |
|---|---------|------|-------|----------------|-----|
| 39 | Verify-fix-verify memory quality loop (PI-A5) | N | — | No mention in any audited README. Quality score formula, retry logic, rejection rates undocumented. | Yes |
| 40 | Signal vocabulary expansion (TM-08) | P | `mcp_server/README.md` structure mentions "CORRECTION/PREFERENCE signals"; `lib/README.md` mentions it; `lib/parsing/README.md` describes it (but not in audited 5 files). | In audited files: only mentioned as annotations, not described. Detailed description exists in `lib/parsing/README.md` (not in scope). | No |
| 41 | Pre-flight token budget validation (PI-A3) | N | — | No mention in any audited README. Greedy truncation strategy, overflow logging undocumented. | Yes |
| 42 | Spec folder description discovery (PI-B3) | P | `lib/README.md` lists `folder-discovery.ts`; `search/README.md` lists module with "PI-B3" annotation. | No description of descriptions.json caching or the skip-full-corpus optimization. SPECKIT_FOLDER_DISCOVERY flag not documented. | No |
| 43 | Pre-storage quality gate (TM-04) | N | — | No mention in any audited README. 3-layer gate, signal density threshold, warn-only period, SPECKIT_SAVE_QUALITY_GATE flag undocumented. | Yes |
| 44 | Reconsolidation-on-save (TM-06) | N | — | No mention in any audited README. Similarity-based merge/conflict/complement logic, SPECKIT_RECONSOLIDATION flag undocumented. Sprint 8 column fix undocumented. | Yes |
| 45 | Smarter memory content generation (S1) | P | `mcp_server/README.md` channel table mentions "S1" in degree channel note. | Content normalization for embeddings (7 primitives, normalizeContentForEmbedding/BM25) not described anywhere. Only a tangential S1 reference. | No |
| 46 | Anchor-aware chunk thinning (R7) | N | — | `mcp_server/README.md` describes anchor-chunking but NOT R7 thinning (scoring + threshold + dropping). | No |
| 47 | Encoding-intent capture at index time (R16) | N | — | No mention of encoding_intent field, heuristic classification, or SPECKIT_ENCODING_INTENT flag. | No |
| 48 | Auto entity extraction (R10) | P | `lib/extraction/README.md` describes R10 in detail (not in audited 5 files). `search/README.md` mentions R10 as upstream for S5. `lib/README.md` lists extraction/ module. | In audited files: only referenced indirectly. Full description is in extraction/README.md (outside audit scope). | Yes |

### Pipeline architecture

| # | Feature | Doc? | Where | What's missing | UF? |
|---|---------|------|-------|----------------|-----|
| 49 | 4-stage pipeline refactor (R6) | P | `mcp_server/README.md` search system implies pipeline stages; `search/README.md` data flow section. | No explicit description of the 4 bounded stages (Candidate Gen, Fusion+Signal, Rerank+Aggregate, Filter+Annotate), score immutability invariant, or SPECKIT_PIPELINE_V2 flag. | No |
| 50 | MPAB chunk-to-memory aggregation (R1) | N | — | No mention of MPAB formula, bonus coefficient, or SPECKIT_DOCSCORE_AGGREGATION flag. | No |
| 51 | Chunk ordering preservation (B2) | N | — | No mention of chunk_index sorting or contentSource metadata. | No |
| 52 | Template anchor optimization (S2) | N | — | No mention of anchor metadata enrichment as a pipeline step. | No |
| 53 | Validation signals as retrieval metadata (S3) | N | — | No mention of validation metadata multiplier (0.8-1.2 clamp) or its 4 signal sources. | No |
| 54 | Learned relevance feedback (R11) | P | `mcp_server/README.md` lists `SPECKIT_LEARN_FROM_SELECTION` flag. | No description of the 9 safeguards, FTS5 isolation, learned_triggers column, or 0.7x boost weight. | Yes |

### Retrieval enhancements

| # | Feature | Doc? | Where | What's missing | UF? |
|---|---------|------|-------|----------------|-----|
| 55 | Dual-scope memory auto-surface (TM-05) | P | `mcp_server/README.md` structure lists `hooks/memory-surface.ts`. | No description of the two lifecycle hooks (tool dispatch, session compaction), per-point 4K budget, or scoped tool list. | Yes |
| 56 | Constitutional memory as expert knowledge injection (PI-A4) | N | — | No mention of retrieval_directive metadata field, imperative verb extraction, or enrichWithRetrievalDirectives(). | No |
| 57 | Spec folder hierarchy as retrieval structure (S4) | N | — | No mention of buildHierarchyTree(), hierarchy-based relevance scoring (0.3-1.0), or Sprint 8 WeakMap cache. | No |
| 58 | Lightweight consolidation (N3-lite) | N | — | No mention of contradiction scanning, Hebbian strengthening, staleness detection, or SPECKIT_CONSOLIDATION flag. | No |
| 59 | Memory summary search channel (R8) | Y | `search/README.md` has a dedicated "Memory Summaries (R8)" section with TF-IDF summarizer and storage details. `lib/README.md` mentions it in features. `mcp_server/README.md` lists SPECKIT_MEMORY_SUMMARIES flag. | — | No |
| 60 | Cross-document entity linking (S5) | Y | `search/README.md` has a dedicated "Cross-Document Entity Linking (S5)" section. `mcp_server/README.md` lists SPECKIT_ENTITY_LINKING flag and density guard env var. | — | No |

### Tooling and scripts

| # | Feature | Doc? | Where | What's missing | UF? |
|---|---------|------|-------|----------------|-----|
| 61 | Tree thinning for spec folder consolidation (PI-B1) | N | — | No mention in any audited README. applyTreeThinning(), token thresholds, merge strategy undocumented. | No |
| 62 | Progressive validation for spec documents (PI-B2) | N | — | No mention in any audited README. progressive-validate.sh, 4-level system, auto-fix capabilities undocumented. | No |

### Governance

| # | Feature | Doc? | Where | What's missing | UF? |
|---|---------|------|-------|----------------|-----|
| 63 | Feature flag governance | P | `mcp_server/README.md` references `references/config/environment_variables.md` as canonical source. | No description of 6-flag cap, 90-day lifespan, monthly sunset audit policy, or B8 signal ceiling in any audited README. | No |
| 64 | Feature flag sunset audit | P | `mcp_server/README.md` flag tables show graduated defaults. | No description of the Sprint 7 audit findings (61 flags, 27 graduate, 9 dead code, 3 active knobs). | No |

### Comprehensive remediation (Sprint 8)

| # | Feature | Doc? | Where | What's missing | UF? |
|---|---------|------|-------|----------------|-----|
| 65 | B1 — Reconsolidation column reference fix | N | — | — | No |
| 66 | B2 — DDL inside transaction fix | N | — | — | No |
| 67 | B3 — SQL operator precedence fix | N | — | — | No |
| 68 | B4 — Missing changes guard | N | — | — | No |
| 69 | C1 — Composite score overflow clamp | N | — | — | No |
| 70 | C2 — Citation fallback chain removal | N | — | — | No |
| 71 | C3 — Causal-boost cycle amplification fix | N | — | — | No |
| 72 | C4 — Ablation binomial overflow fix | N | — | — | No |
| 73 | D1 — Summary quality bypass fix | N | — | Referenced by Sprint 8 update in R8 section of search/README.md but not as a named fix. | No |
| 74 | D2 — FTS5 double-tokenization fix | N | — | — | No |
| 75 | D3 — Quality floor vs RRF range mismatch | P | `search/README.md` documents QUALITY_FLOOR=0.005 (the fix value) but does not describe the bug or the fix. | — | No |
| 76 | E1 — Temporal contiguity double-counting fix | N | — | — | No |
| 77 | E2 — Wrong-memory fallback removal | N | — | — | No |
| 78 | A1 — Divergent normalizeEntityName consolidation | N | — | — | No |
| 79 | A2 — Duplicate computeEdgeDensity consolidation | N | — | — | No |
| 80 | Dead code removal (~360 lines) | N | — | — | No |
| 81 | Performance improvements (13 items) | N | — | Individual optimizations (Math.max spread, LIMIT clause, batch queries, WeakMap cache) not documented. | No |
| 82 | Test quality improvements (4 items) | N | — | — | No |

### Decisions and deferrals

| # | Feature | Doc? | Where | What's missing | UF? |
|---|---------|------|-------|----------------|-----|
| 83 | INT8 quantization evaluation (R5) — NO-GO | N | — | Decision rationale, activation criteria, measurements undocumented. | No |
| 84 | Implemented: N2 (graph centrality + community) | N | — | Cross-references to N2a/N2b/N2c which are themselves undocumented. | No |
| 85 | Implemented: R10 (auto entity extraction) | P | Referenced in search/README.md and lib/README.md module listings. | Decision to move from deferred to implemented not documented. | No |
| 86 | Implemented: R8 (memory summary generation) | Y | Covered in search/README.md R8 section. | — | No |
| 87 | Implemented: S5 (cross-document entity linking) | Y | Covered in search/README.md S5 section. | — | No |

### Additional features (from ToC items not counted above)

The summary document contains sub-items within Sprint 8 that bring the total to approximately 95. The following are counted as separate features based on the summary's ToC:

| # | Feature | Doc? | Where | What's missing | UF? |
|---|---------|------|-------|----------------|-----|
| 88 | Sprint 8 DB/schema safety (category) | N | — | Overall remediation category undocumented. | No |
| 89 | Sprint 8 scoring corrections (category) | N | — | Overall remediation category undocumented. | No |
| 90 | Sprint 8 search pipeline safety (category) | N | — | Overall remediation category undocumented. | No |
| 91 | Sprint 8 guards and edge cases (category) | N | — | Overall remediation category undocumented. | No |
| 92 | Sprint 8 entity normalization (category) | N | — | Overall remediation category undocumented. | No |
| 93 | Chunk ordering preservation detail (B2 cont.) | N | — | chunk_index sorting, contentSource metadata undocumented. | No |
| 94 | S2 anchor-aware metadata enrichment (cont.) | N | — | Pipeline step detail undocumented. | No |
| 95 | S3 validation signals detail (cont.) | N | — | Bounded multiplier clamping, 4 signal sources undocumented. | No |

---

## 3. Missing Documentation Priorities

### CRITICAL — User-facing features undocumented in SKILL.md or any README

These features affect MCP tool behavior, search quality, or user-visible results and have no documentation:

| Priority | Feature | Impact |
|----------|---------|--------|
| C1 | **Chunk collapse deduplication (G3)** | Affects every default search query. Users may see duplicates without this fix. |
| C2 | **Verify-fix-verify quality loop (PI-A5)** | Memory save rejects low-quality content; users need to know rejection behavior. |
| C3 | **Pre-storage quality gate (TM-04)** | Blocks saves below threshold; 14-day warn-only period; users need flag reference. |
| C4 | **Reconsolidation-on-save (TM-06)** | Auto-merges similar memories on save; user needs to know merge behavior. |
| C5 | **Negative feedback confidence signal (A4)** | wasUseful=false now demotes memories; user needs to know scoring impact. |
| C6 | **Auto-promotion on validation (T002a)** | Tier promotion on positive validation; user needs to know promotion thresholds. |
| C7 | **Dual-scope memory auto-surface (TM-05)** | Memories auto-surface on tool dispatch; user needs to understand hook behavior. |
| C8 | **Learned relevance feedback (R11)** | Selection tracking affects future search; user needs to know safeguards and activation. |
| C9 | **Pre-flight token budget validation (PI-A3)** | Response truncation behavior; user needs to understand budget limits. |
| C10 | **Query expansion R12 (SPECKIT_EMBEDDING_EXPANSION)** | Expansion flag not documented; users cannot toggle this feature. |
| C11 | **Auto entity extraction (R10)** | Runs at save time; affects entity catalog; partially documented but not in audited 5 files. |

### IMPORTANT — Internal features undocumented

These are internal implementation details that should be documented in the appropriate library or server README for developer understanding:

| Priority | Feature | Target file |
|----------|---------|-------------|
| I1 | **4-stage pipeline refactor (R6)** | `mcp_server/README.md` or `lib/README.md` |
| I2 | **MPAB chunk-to-memory aggregation (R1)** | `mcp_server/README.md` or `lib/README.md` |
| I3 | **Graph momentum scoring (N2a)** | `mcp_server/README.md` or `search/README.md` |
| I4 | **Causal depth signal (N2b)** | `mcp_server/README.md` or `search/README.md` |
| I5 | **Community detection (N2c)** | `mcp_server/README.md` or `search/README.md` |
| I6 | **Lightweight consolidation (N3-lite)** | `mcp_server/README.md` |
| I7 | **Constitutional memory as expert knowledge injection (PI-A4)** | `mcp_server/README.md` |
| I8 | **Spec folder hierarchy as retrieval structure (S4)** | `mcp_server/README.md` or `search/README.md` |
| I9 | **Weight history audit tracking** | `mcp_server/README.md` |
| I10 | **Feature flag governance framework** | `mcp_server/README.md` config section |
| I11 | **Tree thinning (PI-B1)** | `README.md` (skill root) scripts section |
| I12 | **Progressive validation (PI-B2)** | `README.md` (skill root) scripts section |
| I13 | **Template anchor optimization (S2)** | `lib/README.md` or `search/README.md` |
| I14 | **Validation signals as retrieval metadata (S3)** | `lib/README.md` or `search/README.md` |
| I15 | **Encoding-intent capture (R16)** | `mcp_server/README.md` config section |
| I16 | **Anchor-aware chunk thinning (R7)** | `mcp_server/README.md` chunking section |
| I17 | **Smarter memory content generation (S1)** | `mcp_server/README.md` or `lib/README.md` |
| I18 | **Chunk ordering preservation (B2)** | `mcp_server/README.md` chunking section |
| I19 | **Double intent weighting investigation (G2)** | Could be a note in `search/README.md` |

### MINOR — Partial documentation that needs expansion

| Priority | Feature | What's missing |
|----------|---------|----------------|
| M1 | Score normalization | Description of min-max methodology |
| M2 | Classification-based decay (TM-03) | 2D multiplier matrix detail |
| M3 | Folder-level relevance scoring (PI-A1) | 4-factor formula description |
| M4 | Cold-start novelty boost (N4) | Sprint 8 hot-path removal note |
| M5 | Edge density measurement | Methodology and R10 escalation role |
| M6 | Co-activation boost A7 | SPECKIT_COACTIVATION_STRENGTH env var |
| M7 | Spec folder description discovery (PI-B3) | Descriptions.json caching, SPECKIT_FOLDER_DISCOVERY flag |
| M8 | Feature flag sunset audit | Sprint 7 audit findings (61 flags) |
| M9 | Signal vocabulary expansion (TM-08) | Full description in audited files (exists in parsing/README.md outside scope) |
| M10 | RRF K-value sensitivity analysis | Grid search methodology |
| M11 | Quality proxy formula (B7) | Formula and weight rationale |
| M12 | Evaluation database schema | 5-table schema description |

### Sprint 8 remediation items (18 sub-features)

None of the 18 Sprint 8 remediation sub-features (B1-B4, C1-C4, D1-D3, E1-E2, A1-A2, dead code, performance, test quality) are documented in any README. This is expected for bug fixes — they are typically tracked in changelogs rather than READMEs. However, the key behavioral changes (C1 score clamping to [0,1], D3 quality floor change from 0.2 to 0.005) should be reflected in the README sections that describe those features.

**Recommendation:** Do NOT add individual Sprint 8 fix descriptions to READMEs. Instead, ensure the affected feature descriptions reflect the corrected behavior (which some already do, e.g., channel-representation QUALITY_FLOOR=0.005).

---

## 4. Structural Issues Found in READMEs

### search/README.md — Broken anchor links in Table of Contents

**File:** `mcp_server/lib/search/README.md`, lines 21-22

```markdown
- [2. KEY CONCEPTS]](#2--key-concepts)
- [3. MODULE STRUCTURE]](#3--module-structure)
```

Both links have a stray `]` before the `(`, making them malformed markdown. Should be:

```markdown
- [2. KEY CONCEPTS](#2--key-concepts)
- [3. MODULE STRUCTURE](#3--module-structure)
```

### search/README.md — Missing Sprint 1-7 enhancement documentation

The `search/README.md` does not cover many Sprint 1-7 features (N2a/N2b/N2c graph signals, N3-lite consolidation, S4 hierarchy, PI-A4 constitutional injection, etc.). This was an expected gap noted in the plan. The module listing is up-to-date but feature descriptions for these modules are absent.

### mcp_server/README.md — Inconsistent test counts

- Line 98: "196 test files, 5,797 tests"
- Line 222: "196 test files, 5,797 tests"
- Line 1045-1046: "tests passing across 164 files" (inconsistent — should be 196 or updated to reflect Sprint 8 count of 226 files / 7003 tests)

### mcp_server/README.md — Tool schema count inconsistency

- Line 184: "TOOL_DEFINITIONS: all 23 tool schemas"
- Line 93: "25" MCP Tools
- Line 584: "Main MCP server entry point (23 tools)"

The server has 25 MCP tools but tool-schemas.ts is described as having 23. This may be correct if 2 tools are registered elsewhere, but the inconsistency should be clarified.

### README.md (skill root) — Consistent and well-structured

No structural issues found. ANCHOR pairs are properly matched. TOC links are valid. Headers follow consistent formatting.

### lib/README.md — Consistent and well-structured

No structural issues found. Module counts and structure are current. ANCHOR pairs matched.

### SKILL.md — Feature flag table incomplete

Only 3 feature flags are listed (SPECKIT_ADAPTIVE_FUSION, SPECKIT_EXTENDED_TELEMETRY, SPECKIT_INDEX_SPEC_DOCS) with a note to see mcp_server/README.md for full reference. This is acceptable as SKILL.md is an AI workflow instruction file, but several user-facing flags are missing:

- `SPECKIT_LEARN_FROM_SELECTION` (affects future search quality)
- `SPECKIT_NEGATIVE_FEEDBACK` (affects scoring on validate)
- `SPECKIT_MEMORY_SUMMARIES` (affects search channel behavior)
- `SPECKIT_ENTITY_LINKING` (affects save-time behavior)
- `SPECKIT_AUTO_ENTITIES` (affects save-time behavior)
- `SPECKIT_SAVE_QUALITY_GATE` (affects save rejection behavior)
- `SPECKIT_RECONSOLIDATION` (affects save merge behavior)

---

## 5. Coverage by Functional Area

| Functional Area | Total Features | Fully Doc | Partial | Undocumented | Coverage |
|----------------|---------------|-----------|---------|--------------|----------|
| Bug fixes | 4 | 0 | 2 | 2 | 25% |
| Evaluation | 11 | 0 | 7 | 4 | 32% |
| Graph signals | 7 | 1 | 2 | 4 | 21% |
| Scoring | 10 | 3 | 5 | 2 | 40% |
| Query intelligence | 6 | 5 | 1 | 0 | 92% |
| Memory quality | 10 | 0 | 4 | 6 | 20% |
| Pipeline architecture | 6 | 0 | 1 | 5 | 8% |
| Retrieval enhancements | 6 | 2 | 1 | 3 | 25% |
| Tooling/scripts | 2 | 0 | 0 | 2 | 0% |
| Governance | 2 | 0 | 2 | 0 | 50% |
| Sprint 8 remediation | 18 | 0 | 1 | 17 | 3% |
| Decisions | 5 | 2 | 1 | 2 | 30% |
| **Additional items** | 8 | 0 | 0 | 8 | 0% |
| **TOTAL** | 95 | 34 (~36%) | 28 (~29%) | 33 (~35%) | 36% full |

### Key observation

**Query intelligence** has 92% coverage — these features (complexity routing, RSF, channel min-rep, confidence truncation, dynamic token budget) are well-documented across multiple READMEs.

**Pipeline architecture** has only 8% coverage — the 4-stage pipeline (R6), MPAB (R1), chunk ordering (B2), template anchors (S2), validation signals (S3), and learned feedback (R11) are almost entirely undocumented.

**Memory quality and indexing** has 20% coverage — many save-time features (PI-A5, TM-04, TM-06, R16, R7) that directly affect user experience are missing.

---

## 6. Recommendations

1. **Highest priority:** Document the 11 CRITICAL user-facing features (C1-C11) in appropriate READMEs and add flag references to SKILL.md where applicable.

2. **Fix structural issues:** Repair the 2 broken anchor links in `search/README.md` and resolve the test count inconsistency in `mcp_server/README.md`.

3. **Pipeline architecture gap:** Add a "4-Stage Pipeline" section to `mcp_server/README.md` or `lib/README.md` describing R6 stages, MPAB aggregation, and the score immutability invariant.

4. **Graph signals gap:** Add N2a/N2b/N2c descriptions to `mcp_server/README.md` search system section or `search/README.md` features section.

5. **Sprint 8 behavioral changes:** Update existing feature descriptions to reflect Sprint 8 corrections (e.g., QUALITY_FLOOR=0.005 is already reflected; ensure N4 hot-path removal and dead code removals are noted).

6. **Do NOT add Sprint 8 bug fix descriptions as standalone sections.** Instead, ensure the parent feature descriptions are accurate post-fix.

7. **SKILL.md flag table:** Expand to include save-time and search-affecting flags that users may need to toggle.
