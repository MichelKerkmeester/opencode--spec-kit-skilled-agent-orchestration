# Deep Research Round 2: Targeted Gap Analysis

**Date:** 2026-03-26
**Method:** 5 targeted GPT-5.4 high agents (Agents 8-12) drilling into specific gaps from Round 1
**Total tokens consumed:** ~1.5M (round 1) + ~1.8M (round 2) = ~3.3M across 12 agents

---

## ROUND 2 SUMMARY

Round 1 identified the gaps. Round 2 produced **actionable remediation blueprints** for each gap cluster.

| Agent | Focus | Key Deliverable |
|-------|-------|-----------------|
| 8 | API surface deep audit | 6 files enumerated, 5 catalog entries proposed, 1 dead-code module found |
| 9 | Complete SPECKIT_* inventory | **137 total env vars**, 28 undocumented, 1 stale |
| 10 | Scripts ecosystem map | 223 files, 24.7% coverage, **12 new catalog entries** proposed |
| 11 | Constitutional + shared memory paths | End-to-end flow maps, cache architecture, 2 unified entries proposed |
| 12 | Category 17/19/20/21 fixes | Snippet-by-snippet fixes, 11 new entries, 4 stub replacements |

---

## 1. API SURFACE (Agent 8)

### Inventory: 6 files, 5 ACTIVE + 1 DEAD_CODE

| File | Status | Wraps | Callers |
|------|--------|-------|---------|
| `api/index.ts` | ACTIVE | Barrel: eval, indexing, search, providers, storage + 20+ additional exports | 8+ callers (scripts, tests, workflows) |
| `api/eval.ts` | ACTIVE | ablation-framework, bm25-baseline, ground-truth, eval-db | Via barrel (run-ablation, run-bm25) |
| `api/indexing.ts` | ACTIVE | Runtime bootstrap, embedding warmup, memory_index_scan | reindex-embeddings.ts |
| `api/search.ts` | ACTIVE | hybrid-search, sqlite-fts, vector-index | memory-indexer.ts, tests |
| `api/providers.ts` | ACTIVE | shared/embeddings, retry-manager | workflow.ts, tests |
| `api/storage.ts` | **DEAD_CODE** | checkpoints init, access-tracker init | Only internal api/indexing.ts |
| `api/README.md` | PARTIAL | Public boundary policy docs | N/A |

### Docs Drift Found
- ARCHITECTURE.md:291 references nonexistent `searchMemories`
- ARCHITECTURE.md:326 references nonexistent `api/scoring`

### Proposed Catalog Entries (5)
1. **MCP Server Public API Barrel** → category 14 or new
2. **Evaluation API Surface** → category 07/09
3. **Indexing Runtime Bootstrap API** → category 13
4. **Search API Surface** → category 01/14
5. **Embeddings and Retry API** → category 14

---

## 2. SPECKIT_* ENV VAR INVENTORY (Agent 9)

### Scale: 137 source-backed env vars

| Metric | Count |
|--------|-------|
| Total SPECKIT_* in source | 137 |
| Documented in catalog 19 | ~109 |
| **UNDOCUMENTED** | **28** |
| STALE (in catalog, not in source) | 1 |

### HIGH Severity Undocumented (must fix)

| Var | Default | Source | Why HIGH |
|-----|---------|--------|----------|
| `SPECKIT_ADAPTIVE_FUSION` | `true` | hybrid-search.ts | Runtime/docs drift - live but not read |
| `SPECKIT_SHARED_MEMORY_ADMIN_USER_ID` | unset | shared-memory.ts | Security-relevant identity config |
| `SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID` | unset | shared-memory.ts | Security-relevant identity config |
| `SPECKIT_SKIP_VALIDATION` | unset | validate.sh | Safety bypass |
| `SPECKIT_VALIDATION` | `true` | validate.sh | Validation master toggle |

### MEDIUM Severity Undocumented (18 flags)
Graph calibration (`CALIBRATION_PROFILE_NAME`, `GRAPH_LOCAL_THRESHOLD`, `GRAPH_WEIGHT_CAP`, `LOUVAIN_MIN_DENSITY`, `LOUVAIN_MIN_SIZE`, `N2A_CAP`, `N2B_CAP`), adaptive (`MEMORY_ADAPTIVE_MODE`), search (`LEARNED_STAGE2_MODEL`, `RRF_K`, `TOKEN_BUDGET`, `RECENCY_DECAY_DAYS`, `RERANKER_TIMEOUT_MS`, `SHADOW_LEARNING`), scripts (`SKIP_POST_VALIDATE`, `STRICT`)

### LOW Severity Undocumented (5 flags)
`HYDE_LOG`, `JSON`, `RESULT_EXPLAIN_DEBUG`, `VALIDATE_LINKS`, `VERBOSE`, `LINKS_SKILL_DIR`

### STALE: `SPECKIT_RSF_FUSION` - removed from live runtime, docs/tests-only

### Config File Flags (not env vars)
- `config.jsonc`: 11 boolean toggles (semanticSearch, memoryIndex, etc.)
- `filters.jsonc`: 4 boolean toggles (pipeline, noise, dedupe, quality)

---

## 3. SCRIPTS ECOSYSTEM (Agent 10)

### Coverage: 223 files, 55 covered (24.7%)

| Directory | Files | Covered | Coverage |
|-----------|-------|---------|----------|
| `core/` | 18 | 5 | 27.8% |
| `evals/` | 14 | 2 | 14.3% |
| `extractors/` | 13 | 9 | 69.2% |
| `kpi/` | 1 | 0 | **0.0%** |
| `lib/` | 20 | 1 | 5.0% |
| `memory/` | 9 | 2 | 22.2% |
| `ops/` | 6 | 0 | **0.0%** |
| `rules/` | 19 | 0 | **0.0%** |
| `setup/` | 5 | 0 | **0.0%** |
| `spec/` | 12 | 2 | 16.7% |
| `spec-folder/` | 5 | 0 | **0.0%** |
| `templates/` | 1 | 0 | **0.0%** |
| `utils/` | 20 | 6 | 30.0% |
| `tests/` | 74 | 25 | 33.8% |

### 12 Proposed New Catalog Entries

1. **Spec Lifecycle Automation** (10 scripts: create, archive, completion, level recommend, etc.)
2. **Spec Validation Rule Engine** (validate.sh + 19 rules/*.sh)
3. **Memory Maintenance and Migration CLIs** (7 scripts: backfill, reindex, cleanup, etc.)
4. **Core Workflow Infrastructure** (13 scripts: config, indexer, metadata, gates, etc.)
5. **Session Extraction and Enrichment** (4 scripts: diagram, file, activity signal)
6. **Spec-Folder Detection and Description** (5 scripts: detector, alignment, description.json)
7. **Ops Self-Healing Runbooks** (6 scripts: heal-index, heal-ledger, heal-session, runbook)
8. **Setup, Native Module Health, and MCP Installation** (5 scripts)
9. **Template Composition System** (compose.sh + template-utils.sh)
10. **Evaluation, Benchmark, and Import-Policy Tooling** (12 scripts)
11. **Shared Script Libraries and Utilities** (lib/, utils/, config/ barrels)
12. **Memory Quality KPI Reporting** (quality-kpi.sh)

---

## 4. CONSTITUTIONAL MEMORY PATH (Agent 11, Part A)

### End-to-End Flow
```
/memory:learn → constitutional/*.md → memory_save → parser infers tier='constitutional'
→ createMemoryRecord in memory_index → vec_memories + memory_fts companions
```

### Two Retrieval Paths
- **Auto-surface hook**: memory-surface.ts → SELECT WHERE tier='constitutional' → enrichWithRetrievalDirectives() → 4k token budget
- **memory_search**: includeConstitutional=true → Stage 1 injects max 5 constitutional rows → no decay applied

### Cache Architecture (4 layers)
| Layer | TTL | Scope | Invalidation |
|-------|-----|-------|-------------|
| Hook auto-surface | 60s | 10 rows max | clearConstitutionalCache() |
| Vector/search | 300s | 50 keys max | DB mtime, mutations, restores |
| Prompt assembly | 2000 tokens | Per-assembly | Truncation |
| Auto-surface payload | 4000 tokens × 2 | Tool dispatch + compaction | Truncation |

### Potential Bug Found
Agent 11 flagged: vector-index-store.ts clears cache by raw `spec_folder` but cache keys use `folder:arch|noarch` format → potential cache invalidation mismatch for folder-specific clears.

### Catalog Coverage: Fragmented across 20+ entries, no unified entry
**Proposed:** Single "Constitutional memory end-to-end lifecycle" catalog entry with 10 source files.

---

## 5. SHARED MEMORY SOURCE MAP (Agent 11, Part B)

### Directory Reality Check
| Path | Reality |
|------|---------|
| `mcp_server/shared/` | Symlink to `shared/dist` — generic utilities, NOT shared-memory feature |
| `mcp_server/shared-spaces/` | README-only — docs, NOT implementation |
| Real implementation | `handlers/shared-memory.ts` + `lib/collab/shared-spaces.ts` + 7 other files |

### Flow: Enable → Create → Membership → Query → Kill
All traced with source file evidence. Key insight: kill switch is set via `shared_space_upsert` (no separate tool), and shared memories appear as normal `memory_index` rows with `shared_space_id` set.

### Proposed: Add "Shared memory end-to-end architecture and source map" entry + update shared-spaces README with "Implementation lives in handler/lib files, not this directory."

---

## 6. CATEGORY FIX PROPOSALS (Agent 12)

### Category 17 -- Governance (4 snippets → 6)
| Snippet | Action | Priority |
|---------|--------|----------|
| `01-feature-flag-governance` | FIX: add rollout-policy.ts, capability-flags.ts source paths | P1 |
| `02-feature-flag-sunset-audit` | REPLACE or move to cat 21 | P1 |
| `03-hierarchical-scope-governance` | FIX: replace deleted retention.ts with scope-governance.ts | P1 |
| `04-shared-memory-rollout` | VALID: add admin-identity cross-link | P2 |
| NEW `05-admin-identity-governance` | CREATE | P2 |
| NEW `06-governance-audit-review` | CREATE | P2 |

### Category 19 -- Feature Flag Reference (8 snippets)
| Snippet | Action | Priority |
|---------|--------|----------|
| `01` (pipeline) | FIX: add SPECKIT_MEMORY_ADAPTIVE_MODE + ADAPTIVE_FUSION drift note | P1 |
| `05` (embedding/API) | FIX: add RERANKER_MODEL + RERANKER_TIMEOUT_MS rows | P1 |
| `06` (debug/telemetry) | FIX: add RESULT_EXPLAIN_DEBUG + HYDE_LOG rows | P1 |
| `08` (mapping note) | Reclassify as meta | P2 |

### Category 20 -- Remediation (1 stub → 3)
| Snippet | Action | Priority |
|---------|--------|----------|
| `01-category-stub` | P0 REPLACE with real remediation content | P0 |
| NEW `02-memory-health-auto-repair` | CREATE | P1 |
| NEW `03-feedback-driven-revalidation` | CREATE | P1 |

### Category 21 -- Deprecated Features (1 stub → 5)
| Snippet | Action | Priority |
|---------|--------|----------|
| `01-category-stub` | P0 REPLACE with retired runtime shims | P0 |
| NEW `02-lazy-loading-migration` | CREATE | P1 |
| NEW `03-shadow-scoring-retirement` | CREATE | P1 |
| NEW `04-inert-scoring-flags` | CREATE | P2 |
| NEW `05-adaptive-fusion-drift` | CREATE | P1 |

---

## CONSOLIDATED REMEDIATION BACKLOG

### P0 — Critical (8 items)
1. Replace cat 20 stub with real remediation content
2. Replace cat 21 stub with retired runtime shims
3. Document 5 HIGH-severity undocumented SPECKIT_* flags
4. Add 5 catalog entries for `mcp_server/api/` surface
5. Create constitutional memory unified catalog entry
6. Create shared memory source map catalog entry
7. Fix ARCHITECTURE.md docs drift (searchMemories, api/scoring)
8. Mark `read_spec_section` phantom tool as planned/deferred

### P1 — Required (15 items)
9. Fix cat 17 snippets 01, 02, 03 (source paths, stale content)
10. Fix cat 19 snippets 01, 05, 06 (missing flag rows)
11. Document 18 MEDIUM-severity SPECKIT_* flags
12. Add 12 scripts ecosystem catalog entries (168 uncovered files)
13. Create cat 20 entries 02-03 (auto-repair, feedback revalidation)
14. Create cat 21 entries 02-03, 05 (lazy-loading, shadow-scoring, adaptive-fusion)
15. Audit 5 unaudited catalog snippets in code audit
16. Update umbrella spec feature count 218 → 222
17. Formally audit create.sh and validate.sh (AUDIT_MISSING)
18. Add shared-spaces README pointer to real implementation files
19. Remove SPECKIT_RSF_FUSION stale catalog entry
20. Reclassify cat 19/08 as meta
21. Add cat 17 entries 05-06 (admin-identity, audit-review)
22. Remove api/storage.ts dead code or document as deprecated
23. Add config.jsonc and filters.jsonc flag documentation

### P2 — Recommended (5 items)
24. Document 5 LOW-severity SPECKIT_* flags
25. Create cat 21 entry 04 (inert scoring flags)
26. Add admin-identity cross-link to cat 17/04
27. Investigate constitutional cache invalidation mismatch (potential bug)
28. Reclassify audit phases 019/021/022 as mapping/meta packets
