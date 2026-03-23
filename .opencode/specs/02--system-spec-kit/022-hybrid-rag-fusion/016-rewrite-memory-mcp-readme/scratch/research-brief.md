# Research Brief: MCP README Rewrite (D1)

> Investigation artifact for spec 016-rewrite-memory-mcp-readme. Provides the drafting agent with a complete inventory of tools, features, architecture details, current README gaps and target structure.

---

## 1. TOOL INVENTORY (32 Tools)

All 32 tools extracted from `mcp_server/tool-schemas.ts` (TOOL_DEFINITIONS array, lines 537-577).

### L1: Orchestration (Token Budget: 2000) -- 1 tool

| # | Tool Name | Description | Key Parameters |
|---|-----------|-------------|----------------|
| 1 | `memory_context` | Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. Auto-detects task intent and routes to optimal retrieval strategy. | `input` (required), `mode` (auto/quick/deep/focused/resume), `intent` (7 types), `specFolder`, `limit`, `sessionId`, `enableDedup`, `includeContent`, `includeTrace`, `tokenUsage` (0.0-1.0), `anchors` |

### L2: Core (Token Budget: 1500) -- 3 tools

| # | Tool Name | Description | Key Parameters |
|---|-----------|-------------|----------------|
| 2 | `memory_search` | Semantic search using vector similarity. Returns ranked results with scores. Constitutional tier always included at top. Supports intent-aware retrieval with task-specific weight adjustments. | `query` OR `concepts` (2-5 strings for AND search), `specFolder`, `limit` (1-100), `sessionId`, `enableDedup`, `tier`, `contextType`, `useDecay`, `includeContent`, `anchors`, `rerank`, `applyLengthPenalty`, `minState` (HOT-ARCHIVED), `intent`, `includeTrace`, `trackAccess`, `mode` (auto/deep), `min_quality_score`, `bypassCache`, governance fields (tenantId, userId, agentId, sharedSpaceId) |
| 3 | `memory_match_triggers` | Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), co-activation. | `prompt` (required), `limit`, `session_id`, `turnNumber`, `include_cognitive` |
| 4 | `memory_save` | Index a memory file into the database. Reads file, extracts metadata, generates embedding, stores in index. Includes pre-flight validation for anchor format, duplicate detection, token budget estimation. | `filePath` (required), `force`, `dryRun`, `skipPreflight`, `asyncEmbedding`, governance fields (tenantId, userId, agentId, sessionId, sharedSpaceId, provenanceSource, provenanceActor), `retentionPolicy` (keep/ephemeral/shared), `deleteAfter` |

### L3: Discovery (Token Budget: 800) -- 3 tools

| # | Tool Name | Description | Key Parameters |
|---|-----------|-------------|----------------|
| 5 | `memory_list` | Browse stored memories with pagination. Use to discover what is remembered and find IDs for delete/update. | `limit` (max 100), `offset`, `specFolder`, `sortBy` (created_at/updated_at/importance_weight), `includeChunks` |
| 6 | `memory_stats` | Statistics about the memory system. Counts, dates, status breakdown, top folders. Supports multiple ranking modes including composite scoring. | `folderRanking` (count/recency/importance/composite), `excludePatterns`, `includeScores`, `includeArchived`, `limit` |
| 7 | `memory_health` | Check health status. Full diagnostics or compact divergent-alias triage output. | `reportMode` (full/divergent_aliases), `limit`, `specFolder`, `autoRepair`, `confirmed` |

### L4: Mutation (Token Budget: 500) -- 4 tools

| # | Tool Name | Description | Key Parameters |
|---|-----------|-------------|----------------|
| 8 | `memory_delete` | Delete a memory by ID or all memories in a spec folder. | `id` OR (`specFolder` + `confirm: true`) |
| 9 | `memory_update` | Update existing memory with corrections. Re-generates embedding if content changes. | `id` (required), `title`, `triggerPhrases`, `importanceWeight`, `importanceTier` (6 tiers), `allowPartialUpdate` |
| 10 | `memory_validate` | Record validation feedback. Tracks whether memories are useful, updating confidence scores. High confidence may promote to critical tier. | `id` (required), `wasUseful` (required), `queryId`, `queryTerms`, `resultRank`, `totalResultsShown`, `searchMode`, `intent`, `sessionId`, `notes` |
| 11 | `memory_bulk_delete` | Bulk delete by importance tier. Auto-creates checkpoint before deletion. Refuses unscoped constitutional/critical. | `tier` (required), `confirm: true` (required), `specFolder`, `olderThanDays`, `skipCheckpoint` |

### L5: Lifecycle (Token Budget: 600) -- 8 tools

| # | Tool Name | Description | Key Parameters |
|---|-----------|-------------|----------------|
| 12 | `checkpoint_create` | Create named checkpoint of current memory state. | `name` (required), `specFolder`, `metadata` |
| 13 | `checkpoint_list` | List all available checkpoints. | `specFolder`, `limit` |
| 14 | `checkpoint_restore` | Restore memory state from a checkpoint. | `name` (required), `clearExisting` |
| 15 | `checkpoint_delete` | Delete a checkpoint. Safety confirmation required. | `name` (required), `confirmName` (required, must match name) |
| 16 | `shared_space_upsert` | Create or update a shared-memory space. Deny-by-default until memberships added. | `spaceId` (required), `tenantId` (required), `name` (required), `rolloutEnabled`, `rolloutCohort`, `killSwitch` |
| 17 | `shared_space_membership_set` | Set deny-by-default membership for a user or agent. | `spaceId` (required), `subjectType` (user/agent, required), `subjectId` (required), `role` (owner/editor/viewer, required) |
| 18 | `shared_memory_status` | Inspect shared-memory rollout and accessible spaces. | `tenantId`, `userId`, `agentId` |
| 19 | `shared_memory_enable` | Enable the shared-memory subsystem. First-run setup: creates infrastructure tables and README. Idempotent. | _(none required)_ |

### L6: Analysis (Token Budget: 1200) -- 8 tools

| # | Tool Name | Description | Key Parameters |
|---|-----------|-------------|----------------|
| 20 | `task_preflight` | Capture epistemic baseline before task execution. Records knowledge, uncertainty and context scores for learning measurement. | `specFolder` (required), `taskId` (required), `knowledgeScore` (0-100, required), `uncertaintyScore` (0-100, required), `contextScore` (0-100, required), `knowledgeGaps`, `sessionId` |
| 21 | `task_postflight` | Capture epistemic state after task and calculate learning delta. LI = (KnowledgeDelta x 0.4) + (UncertaintyReduction x 0.35) + (ContextImprovement x 0.25). | `specFolder` (required), `taskId` (required), `knowledgeScore` (required), `uncertaintyScore` (required), `contextScore` (required), `gapsClosed`, `newGapsDiscovered` |
| 22 | `memory_drift_why` | Trace causal chain for a memory. Answers "why was this decision made?" Traverses causal edges up to maxDepth hops, groups by relationship type. | `memoryId` (required), `maxDepth` (default 3, max 10), `direction` (outgoing/incoming/both), `relations` (filter to specific types), `includeMemoryDetails` |
| 23 | `memory_causal_link` | Create a causal relationship between two memories. 6 relationship types. | `sourceId` (required), `targetId` (required), `relation` (required: caused/enabled/supersedes/contradicts/derived_from/supports), `strength` (0.0-1.0), `evidence` |
| 24 | `memory_causal_stats` | Statistics about the causal memory graph. Total edges, coverage percentage, breakdown by relationship type. Target: 60% of memories linked. | _(none required)_ |
| 25 | `memory_causal_unlink` | Remove a causal relationship by edge ID. | `edgeId` (required) |
| 26 | `eval_run_ablation` | Run controlled channel ablation study. Requires SPECKIT_ABLATION=true. Optionally persists Recall@20 deltas to eval_metric_snapshots. | `channels` (vector/bm25/fts5/graph/trigger), `groundTruthQueryIds`, `recallK`, `storeResults`, `includeFormattedReport` |
| 27 | `eval_reporting_dashboard` | Generate reporting dashboard with sprint/channel trend aggregation from eval DB metrics. | `sprintFilter`, `channelFilter`, `metricFilter`, `limit`, `format` (text/json) |

### L7: Maintenance (Token Budget: 1000) -- 5 tools

| # | Tool Name | Description | Key Parameters |
|---|-----------|-------------|----------------|
| 28 | `memory_index_scan` | Scan workspace for new/changed memory files and index them. Bulk indexing across 3 source families. | `specFolder`, `force`, `includeConstitutional`, `includeSpecDocs`, `incremental` |
| 29 | `memory_get_learning_history` | Get learning history (PREFLIGHT/POSTFLIGHT records) for a spec folder. Shows Learning Index trends. | `specFolder` (required), `sessionId`, `limit`, `onlyComplete`, `includeSummary` |
| 30 | `memory_ingest_start` | Start async ingestion job for multiple markdown files. Returns immediately with jobId. | `paths` (required, 1-N), `specFolder` |
| 31 | `memory_ingest_status` | Get current state and progress for an async ingestion job. | `jobId` (required) |
| 32 | `memory_ingest_cancel` | Cancel a running async ingestion job. Cancellation checked between files. | `jobId` (required) |

---

## 2. FEATURE CATEGORY MAP

All 22 categories from `feature_catalog/feature_catalog.md` (TOC, lines 12-33) mapped to recommended README sections.

| # | Feature Catalog Category | Features (count) | README Section Mapping |
|---|--------------------------|------------------|----------------------|
| 1 | **Overview** | System overview | 1. OVERVIEW |
| 2 | **Contents** | Table of contents / index | TABLE OF CONTENTS |
| 3 | **Retrieval** | 9 features (memory_context, memory_search, memory_match_triggers, hybrid search pipeline, 4-stage pipeline, BM25 re-index gate, AST section retrieval, 3-tier fallback, tool-result extraction) | 5. SEARCH SYSTEM |
| 4 | **Mutation** | 10 features (memory_save, memory_update, memory_delete, memory_bulk_delete, memory_validate, transaction wrappers, namespace CRUD, PE save arbitration, correction tracking, per-memory history) | 4. MCP TOOLS (CRUD Tools subsection) + 6. COGNITIVE MEMORY (PE gating) |
| 5 | **Discovery** | 3 features (memory_list, memory_stats, memory_health) | 4. MCP TOOLS (Discovery subsection) |
| 6 | **Maintenance** | 2 features (memory_index_scan, startup guards) | 4. MCP TOOLS (Maintenance subsection) |
| 7 | **Lifecycle** | 6 features (checkpoint CRUD, async ingestion lifecycle, pending-file recovery, automatic archival) | 4. MCP TOOLS (Checkpoint + Lifecycle subsections) |
| 8 | **Analysis** | 7 features (causal CRUD, drift_why, task_preflight, task_postflight, learning history) | 4. MCP TOOLS (Causal + Learning subsections) |
| 9 | **Evaluation** | 2 features (eval_run_ablation, eval_reporting_dashboard) | 4. MCP TOOLS (Evaluation subsection) |
| 10 | **Bug Fixes and Data Integrity** | 11 features (graph channel ID fix, chunk collapse dedup, co-activation fan-effect, SHA-256 dedup, DB safety, guards, canonical ID dedup, Math.max overflow, session-manager gaps, chunking safe swap, working memory cleanup) | Not a standalone README section. Integrate relevant fixes into Troubleshooting and Cognitive Memory sections |
| 11 | **Evaluation and Measurement** | 16 features (eval DB, core metrics, observer effect, ceiling eval, quality proxy, synthetic corpus, BM25 baseline, consumption instrumentation, scoring observability, reporting framework, shadow scoring, test quality, eval fixes, cross-AI validation, roadmap baseline, INT8 quantization) | Brief mention in 4. MCP TOOLS (Evaluation subsection). Details too granular for README |
| 12 | **Graph Signal Activation** | 12 features (typed-weighted degree, co-activation boost, edge density, weight history, graph momentum, causal depth, community detection, graph fixes, ANCHOR as graph nodes, causal neighbor boost, temporal contiguity, unified graph retrieval) | 5. SEARCH SYSTEM (post-fusion enhancements) + 6. COGNITIVE MEMORY |
| 13 | **Scoring and Calibration** | 18 features (score normalization, cold-start boost, interference scoring, classification decay, folder scoring, embedding cache, double intent investigation, RRF K-value, negative feedback, auto-promotion, scoring corrections, Stage 3 fallback, fusion corrections, local GGUF reranker, tool-level TTL cache, access-driven popularity, temporal-structural coherence, adaptive shadow ranking) | 5. SEARCH SYSTEM (scoring subsections) + 8. CONFIGURATION (feature flags) |
| 14 | **Query Intelligence** | 6 features (query complexity router, RSF shadow, channel min-rep, confidence truncation, dynamic token budget, query expansion) | 5. SEARCH SYSTEM (query pipeline subsections) |
| 15 | **Memory Quality and Indexing** | 18 features (verify-fix-verify, signal vocab, pre-flight token budget, spec folder discovery, pre-storage quality gate, reconsolidation, smarter generation, anchor-aware chunk thinning, encoding-intent capture, auto entity extraction, content-aware filenames, generation-time dedup, entity normalization, quality gate timer, deferred lexical indexing, dry-run preflight, outsourced agent capture, stateless enrichment) | 6. COGNITIVE MEMORY (PE gating, quality gates) + 4. MCP TOOLS (memory_save details) |
| 16 | **Pipeline Architecture** | 21 features (4-stage refactor, MPAB aggregation, chunk ordering, template anchor optimization, validation signals, learned feedback, pipeline safety, performance, activation window, V1 removal, pipeline hardening, DB_PATH standardization, strict Zod schemas, dynamic init, warm server, backend adapter, cross-process rebinding, atomic write-then-index, embedding retry, 7-layer metadata, atomic pending recovery, lineage state) | 3. ARCHITECTURE + 5. SEARCH SYSTEM (4-stage pipeline) |
| 17 | **Retrieval Enhancements** | 8 features (dual-scope auto-surface, constitutional expert injection, spec folder hierarchy, lightweight consolidation, memory summary channel, cross-document entity linking, tier-2 fallback forcing, provenance envelopes, contextual tree injection) | 5. SEARCH SYSTEM + 6. COGNITIVE MEMORY |
| 18 | **Tooling and Scripts** | 12 features (tree thinning, boundary enforcement, progressive validation, dead code removal, code standards, chokidar watcher, admin CLI, constitutional manager, migration checkpoints, schema compatibility, watcher cleanup, feature catalog code references, session capturing) | 10. TROUBLESHOOTING (CLI section) + 3. ARCHITECTURE (structure) |
| 19 | **Governance** | 4 features (feature flag governance, sunset audit, hierarchical scope governance, shared-memory rollout) | 8. CONFIGURATION (governance subsection) + 4. MCP TOOLS (shared memory tools) |
| 20 | **UX Hooks** | 12 features (post-mutation wiring, health autoRepair, checkpoint confirmName, schema sync, dedicated hook modules, mutation result expansion, mutation UX payload, context-server hint append, duplicate-save hardening, atomic-save parity, final token metadata, hooks alignment, success-envelope verification) | Not a standalone README section. UX improvements are embedded throughout tool descriptions |
| 21 | **Phase System** | 4 features (phase detection, phase creation, recursive validation, phase link validation) | Not relevant to MCP server README. Belongs to spec-kit skill documentation |
| 22 | **Feature Flag Reference** | 7 sub-categories (search pipeline, session/cache, MCP config, memory/storage, embedding/API, debug/telemetry, CI/build) | 8. CONFIGURATION (feature flags tables) |

---

## 3. ARCHITECTURE SUMMARY

### 3.1 Hybrid Search Pipeline (BM25 + Vector Fusion)

[SOURCE: mcp_server/README.md:361-443, feature_catalog/feature_catalog.md lines 329-347]

**5-channel retrieval pipeline:**

| Channel | Technology | Base Weight | Purpose |
|---------|-----------|-------------|---------|
| Vector | sqlite-vec 1024d embeddings | 1.0x | Semantic similarity |
| FTS5 | SQLite full-text search | 1.0x | Lexical matching |
| BM25 | In-memory BM25 (gated: ENABLE_BM25) | 1.0x | Keyword relevance scoring |
| Skill Graph | Causal edge graph traversal | 1.5x | Graph-aware relevance |
| Degree | Typed-weighted graph degree | 1.0x | Hub importance |

**Query flow:**
1. Query Classification (simple/moderate/complex) + Intent Detection (7 types) + Artifact Routing (9 classes)
2. Channel selection based on complexity tier (simple=Vector+FTS, moderate=+BM25, complex=all 5)
3. Adaptive RRF Fusion (k=60, intent-weighted profiles)
4. Post-fusion enhancements: Co-activation (+0.25), Session/Recency Boost (cap 0.20), Causal 2-hop boost, Interference penalty (-0.08), Cold-start N4 boost, Channel min-rep (floor 0.005)
5. MMR diversity reranking (intent-specific lambda)
6. Confidence truncation (2x median gap cutoff)
7. Evidence gap detection (TRM Z-score)
8. Dynamic token budget (1500/2500/4000 tokens by complexity)

**4-stage pipeline architecture:**
- Stage 1: Candidate Generation (channels, constitutional injection, quality/tier filters)
- Stage 2: Fusion + Signal Integration (session boost, causal boost, co-activation, community co-retrieval, graph signals, FSRS, intent weights, artifact routing, feedback signals, anchor annotation, validation enrichment)
- Stage 3: Rerank + Aggregate (cross-encoder reranking, MPAB chunk-to-memory aggregation)
- Stage 4: Filter + Annotate (score immutability invariant, state filtering, TRM evidence gaps, feature flag annotation)

### 3.2 FSRS Decay Model

[SOURCE: mcp_server/README.md:543-551]

Formula: `R(t, S) = (1 + (19/81) * t/S)^(-0.5)` where `R(S,S) = 0.9`

- Power-law decay validated on 100M+ Anki users
- Tier-based decay modulation: higher importance tiers receive stability multipliers, slowing decay independent of access patterns
- Type-specific half-lives from "Never" (constitutional) down to "Session" (scratch)
- Attention decay in cognitive path: `0.98^(turn-1)` exponential per turn

### 3.3 6-Tier Importance System

[SOURCE: mcp_server/README.md:262-263, tool-schemas.ts:261]

| Tier | Weight | Description |
|------|--------|-------------|
| `constitutional` | 1.0 | Always surfaces at top of results. Rules that never change. |
| `critical` | High | High-priority memories with slow decay |
| `important` | Medium-high | Significant decisions and context |
| `normal` | 0.5 | Standard memories (default) |
| `temporary` | Low | Short-lived context |
| `deprecated` | Low | Marked for eventual cleanup |

**Auto-weighting by document type:**
- Constitutional files: 1.0
- Spec documents: 0.8
- Plans: 0.7
- Memory files: 0.5
- Scratch files: 0.25

### 3.4 5-State Lifecycle Model

[SOURCE: mcp_server/README.md:554-560]

| State | Retrievability Range | Content Returned | Max Items | Behavior |
|-------|---------------------|------------------|-----------|----------|
| HOT | R >= 0.80 | Full content | 5 | Active working memory |
| WARM | 0.25 <= R < 0.80 | Summary only | 10 | Accessible background |
| COLD | 0.05 <= R < 0.25 | None | N/A | Inactive but retrievable |
| DORMANT | 0.02 <= R < 0.05 | None | N/A | Needs explicit revival |
| ARCHIVED | R < 0.02 or 90d+ | None | N/A | Effectively forgotten |

### 3.5 Feature Flags

[SOURCE: feature_catalog/feature_catalog.md:4014-4105, mcp_server/README.md:768-869]

**Flag evaluation:** `isFeatureEnabled()` treats absent/empty/'true' as enabled, 'false'/'0' as disabled.

**7 categories of environment variables:**
1. Search Pipeline Features (SPECKIT_*) -- ~50 flags, most default ON
2. Session and Cache -- 10 flags controlling dedup, BM25, tool cache
3. MCP Configuration -- 7 flags for save-time validation thresholds
4. Memory and Storage -- 8 flags for paths, batch sizes, DB locations
5. Embedding and API -- 6 flags for provider selection and API keys
6. Debug and Telemetry -- diagnostic flags
7. CI and Build -- informational flags

**Global rollout:** `SPECKIT_ROLLOUT_PERCENT` (default 100) applies percentage gate on top of all individual flags.

### 3.6 Cognitive Memory Architecture

[SOURCE: mcp_server/README.md:537-601]

Key cognitive features beyond basic storage:
- **FSRS Power-Law Decay**: Biologically-inspired memory strength model
- **5-State Memory Model**: HOT/WARM/COLD/DORMANT/ARCHIVED with tiered content injection
- **Type-Specific Half-Lives**: 9 memory types from "Never" to "Session"
- **Prediction Error Gating**: 5-tier duplicate detection (DUPLICATE/HIGH_MATCH/MEDIUM_MATCH/LOW_MATCH/UNIQUE)
- **3-Source Indexing Pipeline**: Constitutional rules, spec documents, spec memories
- **Co-activation Spreading**: Related memories boost each other through co-occurrence graph
- **Working Memory**: Session-scoped attention tracking with event-distance decay
- **Causal Graph**: 6 relationship types for decision lineage tracing
- **Reconsolidation-on-save**: Optional merge/supersede for similar memories
- **Quality Gate**: 3-layer pre-storage validation (structure, content quality, semantic dedup)

---

## 4. CURRENT README GAPS

### 4.1 Sections in the Current README

[SOURCE: mcp_server/README.md lines 1-1282]

| # | Section | Lines | Status |
|---|---------|-------|--------|
| 1 | OVERVIEW | 39-108 | Mostly accurate. Version (v1.7.2) needs verification. "By The Numbers" table has vague placeholders ("See Section 4") instead of concrete counts. |
| 2 | QUICK START | 110-171 | Accurate. Setup steps are correct. |
| 3 | ARCHITECTURE | 173-231 | Accurate but incomplete. Handler flow diagram is helpful. Missing shared memory handlers in the flow. |
| 4 | MCP TOOLS | 233-356 | **Stale.** Lists 28 tools in the layer table but actual count is 32. Missing: `shared_space_upsert`, `shared_space_membership_set`, `shared_memory_status`, `shared_memory_enable`. These 4 shared-memory tools ARE defined in tool-schemas.ts (L5 Lifecycle) but not listed in the README's MCP Tools section. The category table at line 238 shows 28 total across 9 categories, which is undercounted. |
| 5 | SEARCH SYSTEM | 358-535 | Comprehensive and accurate. Pipeline diagram, channel descriptions, post-fusion enhancements, ANCHOR format all well-documented. |
| 6 | COGNITIVE MEMORY | 537-602 | Good coverage. FSRS formula, 5-state model, PE gating, 3-source pipeline. |
| 7 | STRUCTURE | 604-708 | Detailed directory tree. Accurate. `schemas/` description says "28 MCP tools" (should be 32). |
| 8 | CONFIGURATION | 744-909 | **Partially stale.** Feature flags section is extensive but missing some newer flags. Does not list the 7-category organization from the feature catalog. Missing shared-memory governance flags. Database schema table is accurate. |
| 9 | USAGE EXAMPLES | 911-1060 | Good variety. Common patterns table is useful. |
| 10 | TROUBLESHOOTING | 1062-1197 | Solid. CLI operations, diagnostic commands, feature flag rollback procedure. |
| 11 | FAQ | 1199-1227 | Adequate but thin. Only 6 questions. |
| 12 | RELATED RESOURCES | 1230-1282 | Accurate but does not link to feature catalog. Missing link to shared memory docs. |

### 4.2 Specific Gaps and Stale Content

**Missing entirely:**
- 4 shared-memory tools (shared_space_upsert, shared_space_membership_set, shared_memory_status, shared_memory_enable) not listed in MCP Tools section
- Governance subsystem documentation (hierarchical scope, governed ingest, retention policies, audit trail)
- Shared-memory rollout explanation (deny-by-default membership, kill switch)
- No mention of the 7-layer architecture in the overview statistics
- No cross-reference to the feature catalog document

**Stale or inaccurate:**
- Tool count: README says 28 in schemas/ description (line 222), actual is 32
- MCP Tools category table (line 238) sums to 28, should be 32 (add Shared Memory category with 4 tools)
- "By The Numbers" table uses vague references instead of concrete numbers
- Feature flags section is split across two subsections with inconsistent organization

**Under-documented:**
- ANCHOR-based chunking could use more detail on the 50K threshold behavior
- Governance and retention policy parameters on memory_save
- Provenance-rich response envelopes (SPECKIT_RESPONSE_TRACE)
- Async ingestion lifecycle (ingest_start/status/cancel) deserves a workflow example
- Learning history tool (memory_get_learning_history) has no usage example

**Structure issues per README template:**
- Current README has 12 sections; template specifies 9 standard sections
- "ARCHITECTURE" and "STRUCTURE" are separate sections (3 and 7); template merges these into "STRUCTURE" (3)
- "SEARCH SYSTEM" (5) and "COGNITIVE MEMORY" (6) are domain-specific; template equivalent is "FEATURES" (4)
- "CONFIGURATION" (8) maps well to template section 5
- Missing explicit "FEATURES" section as defined in the template

---

## 5. TARGET SECTION STRUCTURE

Based on `sk-doc/assets/documentation/readme_template.md` (9-section standard structure), adapted for the MCP server's domain:

| # | Section | Template Section | Content Focus for MCP Server |
|---|---------|-----------------|------------------------------|
| 1 | **OVERVIEW** | 1. OVERVIEW | What is this, key statistics (32 tools, 7 layers, 5 channels, 6 tiers, 5 states), key features table, requirements |
| 2 | **QUICK START** | 2. QUICK START | 30-second setup, verify installation, MCP configuration JSON |
| 3 | **STRUCTURE** | 3. STRUCTURE | Directory tree, key files table, architecture flow diagram, 7-layer tool architecture table |
| 4 | **FEATURES** | 4. FEATURES | **Sub-sections:** MCP Tools (all 32 grouped by layer), Search System (5-channel pipeline, 4-stage architecture, post-fusion), Cognitive Memory (FSRS, 5-state, PE gating, causal graph), Governance (scopes, retention, shared memory) |
| 5 | **CONFIGURATION** | 5. CONFIGURATION | Environment variables, embedding providers, feature flags (all 7 categories), database schema, dependencies |
| 6 | **USAGE EXAMPLES** | 6. USAGE EXAMPLES | 6+ examples (search, context, causal tracing, checkpoints, learning workflow, shared memory), common patterns table |
| 7 | **TROUBLESHOOTING** | 7. TROUBLESHOOTING | Common issues, quick fixes, diagnostic commands, CLI operations, feature flag rollback, test commands |
| 8 | **FAQ** | 8. FAQ | General + technical questions, expanded to 8-10 Q&A entries |
| 9 | **RELATED DOCUMENTS** | 9. RELATED DOCUMENTS | Parent docs, feature catalog link, related specs, key library modules, external resources |

### Template Requirements Checklist

From `readme_template.md` section 8 (README Checklist):

**Structure:**
- [ ] Title with one-line description (blockquote)
- [ ] Table of contents with working anchor links
- [ ] All sections have content (no empty sections)
- [ ] Section numbers sequential
- [ ] Horizontal rules between major sections
- [ ] ANCHOR markers for structured retrieval

**Content:**
- [ ] Overview explains what AND why
- [ ] Quick Start achievable in <2 minutes
- [ ] All commands tested and working
- [ ] At least 3 usage examples
- [ ] At least 3 troubleshooting entries

**Style (from template section 7):**
- [ ] H2 headings use `## N. ALL CAPS` format
- [ ] TOC links use `#n--section-name` format
- [ ] File paths in backticks
- [ ] Commands in fenced code blocks
- [ ] YAML frontmatter with title, description, trigger_phrases

**Human Voice Rules (HVR):**
- [ ] No em dashes (use commas, periods, colons)
- [ ] No semicolons (split into two sentences or use "and")
- [ ] No Oxford commas
- [ ] No banned words (leverage, robust, seamless, etc.)
- [ ] Active voice throughout
- [ ] No setup language ("Let's explore", "dive in")

---

## 6. CROSS-REFERENCE NOTES

### Sibling Documents the New README Must Link To

| Document | Relative Path | Purpose |
|----------|--------------|---------|
| Feature Catalog | `../feature_catalog/feature_catalog.md` | Complete feature inventory with 22 categories. The README should reference this as the authoritative deep-dive for every feature. |
| Install Guide | `INSTALL_GUIDE.md` | Detailed installation steps. README Quick Start should link here for advanced setup. |
| Skill README | `../README.md` | Parent skill documentation. |
| SKILL.md | `../SKILL.md` | AI agent workflow instructions. |
| Rollback Runbook | `../references/workflows/rollback_runbook.md` | Feature flag rollback procedure. README Troubleshooting should link here. |
| Environment Variables Reference | `../references/config/environment_variables.md` | Canonical source of truth for all env vars. README Configuration should link here. |
| Search Pipeline README | `lib/search/README.md` | Detailed per-stage module mapping. README Search System should link here. |
| Hooks README | `hooks/README.md` | Lifecycle hook documentation. |

### Documents That Link TO the Current README

The MCP server README is referenced from:
- AGENTS.md (root level) -- references memory MCP tools
- CLAUDE.md (root level) -- references memory save workflow
- Skill SKILL.md -- references MCP server for tool definitions
- Various spec folder documents in `022-hybrid-rag-fusion/`

### Key Statistics for the Overview Section

| Metric | Value | Source |
|--------|-------|--------|
| Total MCP tools | 32 | tool-schemas.ts TOOL_DEFINITIONS array (32 entries) |
| Architecture layers | 7 (L1-L7) | tool-schemas.ts layer comments |
| Search channels | 5 (Vector, FTS5, BM25, Graph, Degree) | README.md line 62 |
| Importance tiers | 6 (constitutional through deprecated) | tool-schemas.ts memoryUpdate importanceTier enum |
| Memory states | 5 (HOT/WARM/COLD/DORMANT/ARCHIVED) | README.md lines 554-560 |
| Causal relationship types | 6 (caused/enabled/supersedes/contradicts/derived_from/supports) | tool-schemas.ts memoryCausalLink relation enum |
| Embedding providers | 3 (Voyage, OpenAI, HuggingFace local) | README.md line 766 |
| Pipeline stages | 4 (Candidate Generation, Fusion+Signals, Rerank+Aggregate, Filter+Annotate) | feature catalog 4-stage pipeline |
| Database tables | 12 (memory_index, vec_memories, memory_fts, checkpoints, memory_history, learning_records, working_memory, memory_conflicts, causal_edges, memory_corrections, session_state, schema_version) | README.md lines 872-886 |
| Feature flag categories | 7 | feature catalog section 22 |
| Intent types | 7 (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) | tool-schemas.ts memoryContext intent enum |
| Retrieval modes | 5 (auto, quick, deep, focused, resume) | tool-schemas.ts memoryContext mode enum |

---

*Research brief compiled from tool-schemas.ts, feature_catalog.md, mcp_server/README.md and readme_template.md. All citations verified via Read tool.*
