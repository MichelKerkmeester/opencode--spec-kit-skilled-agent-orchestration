# System-Spec-Kit Architecture Audit v2 -- Research Report

## Executive Summary

A comprehensive architecture audit of the `system-spec-kit` codebase was conducted over 10 iterations using 3 specialized agents per iteration (30 total agent runs). The audit covered scripts (core, extractors, lib, memory, utils, evals, spec-folder), the shared library, and the full MCP server (handlers, search pipeline, storage, eval, scoring, learning, validation, ops, collab, and configuration).

**Key numbers:**
- **192 total findings** across 10 iterations (deduplicated below to ~120 unique findings)
- **Severity breakdown (pre-dedup):** ~50 CRITICAL/HIGH, ~90 MEDIUM, ~50 LOW
- **newInfoRatio** declined from 1.00 to 0.22, confirming convergence
- **Scope:** ~98 non-test TS scripts + MCP server with 431+ files (212 source + 285 tests)
- **Prior audit** (005-architecture-audit phases 1-15, 142 tasks) focused on boundary enforcement -- all resolved. This audit targets logic, bugs, UX, automation, standards alignment, and security.

The most impactful findings cluster around: (1) the search pipeline's "V2 wraps legacy" architecture, (2) score normalization inconsistencies across fusion/rerank/boost stages, (3) silent error suppression patterns, (4) split-authority configuration, (5) path security gaps in background workers, and (6) documentation/code drift.

---

## Methodology

- **10 iterations**, 3 agents per iteration (**30 total agent runs**)
- **Agent types:**
  - **copilot-C1** (GPT-5.4): Primary investigator -- deep code analysis, architecture review, logic bugs
  - **copilot-C2** (GPT-5.4): Standards auditor -- sk-code--opencode compliance, contract consistency, documentation alignment
  - **codex-A1** (GPT-5.4): Bug hunter -- edge cases, security, data integrity, dead code
- **Convergence:** newInfoRatio declined from 1.00 to 0.22 over 10 iterations (3-iteration rolling average reached 0.29)
- **Validation:** Targeted Vitest suites were run during iterations 6-10 to confirm findings against live tests
- **Deduplication:** Findings appearing in multiple iterations are consolidated to the most detailed version

---

## Scope

### Audited

| Area | Files | Focus |
|---|---|---|
| `scripts/core/` | workflow.ts, config.ts, file-writer.ts, memory-indexer.ts, quality-scorer.ts, subfolder-utils.ts, tree-thinning.ts | God functions, logic bugs, silent fallbacks |
| `scripts/extractors/` | 18 extractors + capture adapters | Error suppression, contract inconsistency, DRY violations |
| `scripts/lib/` | content-filter.ts, semantic-signal-extractor.ts, structure-aware-chunker.ts, flowchart-generator.ts, frontmatter-migration.ts, simulation-factory.ts | Duplication, O(n^2) algorithms, misclassification |
| `scripts/memory/` | generate-context.ts, backfill-frontmatter.ts, reindex-embeddings.ts, validate-memory-quality.ts, historical-memory-remediation.ts, rank-memories.ts | Path bypass, process.exit safety, Windows compat |
| `scripts/utils/` | slug-utils.ts, path-utils.ts, data-validator.ts, input-normalizer.ts, validation-utils.ts, file-helpers.ts | Race conditions, cross-OS bugs, type coercion |
| `scripts/evals/` | 18 eval scripts | False-green exits, regex parsing, resource leaks |
| `scripts/spec-folder/` | folder-detector.ts, directory-setup.ts, alignment-validator.ts | Stale caches, manual workflows |
| `shared/` | embeddings.ts, factory.ts, chunking.ts, algorithms/, paths.ts, config.ts, types.ts, parsing/ | Provider failover, dimension bugs, RRF normalization, type sprawl |
| `mcp_server/handlers/` | CRUD, save pipeline, search, context, ingest, checkpoints, causal, learning, eval, shared-memory | Premature supersession, swallowed ledger, error contract drift |
| `mcp_server/lib/search/` | pipeline/, hybrid-search.ts, vector-index-*.ts, entity-linker.ts, graph-search-fn.ts, memory-summaries.ts, boost/filter modules | V2-wraps-legacy, score shadowing, stale caches, missing ORDER BY |
| `mcp_server/lib/storage/` | checkpoints.ts, reconsolidation.ts, transaction-manager.ts, index-refresh.ts | Incomplete restore, vector desync, no purge policy |
| `mcp_server/lib/eval/` | 16 eval modules | Split-brain quality proxy, broken ablation, ground-truth maintenance |
| `mcp_server/lib/config/` | capability-flags.ts, type-inference.ts, memory-types.ts | Tier misclassification, flag inconsistency |
| `mcp_server/lib/ops/` | job-queue.ts, file-watcher.ts | Single-worker bottleneck, no escalation |
| `mcp_server/lib/collab/` | shared-spaces.ts | Authorization gaps |
| Configuration | config.jsonc, filters.jsonc, search-weights.json, .env.example, environment_variables.md | Split authority, stale docs, divergent defaults |
| Documentation | SKILL.md, README.md, mcp_server/README.md, constitutional/, templates/ | Tool naming drift, stale counts, Gate 3 contradiction |
| Tests | 284 Vitest + 38 Vitest + 24 Node JS + 4 shell + 1 Python | Coverage gaps, shallow assertions, mixed runners |

### Excluded (resolved in prior audit)

- Boundary enforcement contracts
- Handler cycle dependencies
- Source-dist alignment
- Import policy violations
- Symlink architecture
- README structural coverage

---

## Finding Categories

### Category 1: Data Integrity & Correctness Bugs

#### F1.01 -- Premature supersession in save pipeline
- **Severity:** CRITICAL
- **File(s):** `mcp_server/handlers/save/pe-orchestration.ts:101-122`
- **Description:** Marks existing memory as superseded BEFORE new record is created. If create/enrichment fails, old row stays deprecated with no replacement.
- **Impact:** Data loss -- the old memory is effectively deleted even though no replacement exists.
- **Recommendation:** Move supersession mark to after successful new record creation, inside the same transaction.

#### F1.02 -- Warning banners break frontmatter
- **Severity:** CRITICAL
- **File(s):** `scripts/core/workflow.ts:2075-2098, 2172-2177`
- **Description:** Template contract validated before warning banners prepended, but banners inserted before YAML frontmatter. Saved memories no longer start with frontmatter at byte 0.
- **Impact:** All downstream YAML parsers that expect frontmatter at position 0 fail silently or skip parsing.
- **Recommendation:** Insert banners after frontmatter block, or validate after insertion.

#### F1.03 -- NaN in decision confidence
- **Severity:** HIGH
- **File(s):** `scripts/core/workflow.ts:1910-1922`
- **Description:** Decision confidence fields rounded without finite-number guard. `undefined`/`null`/`NaN` upstream produces `NaN` percentages in rendered templates.
- **Impact:** Corrupted confidence values in saved memories.
- **Recommendation:** Add `Number.isFinite()` guard before rounding; default to 0 or omit field.

#### F1.04 -- Tree-thinning from truncated preview
- **Severity:** HIGH
- **File(s):** `scripts/core/workflow.ts:654, 1756-1760`
- **Description:** Tree-thinning decisions made from `readFileSync(...).slice(0, 500)`, so token counts computed from truncated preview. Large files misclassified as "small."
- **Impact:** Large files escape thinning, inflating context windows.
- **Recommendation:** Use full file size or a proper token estimator on the full content.

#### F1.05 -- Root-level memory/ paths misclassified
- **Severity:** HIGH
- **File(s):** `scripts/core/tree-thinning.ts:83-86`
- **Description:** `isMemoryFile('memory/foo.md')` returns false because it only checks for `'/memory/'`. Root-level `memory/...` paths are misclassified as non-memory files.
- **Impact:** Memory files at root level skip memory-specific thinning rules.
- **Recommendation:** Also match paths starting with `memory/` (no leading slash).

#### F1.06 -- Title extraction misses bare/single-quoted titles
- **Severity:** HIGH
- **File(s):** `scripts/core/quality-scorer.ts:128-129`
- **Description:** `extractFrontmatterTitle()` only matches `title: "..."`. Bare titles and single-quoted titles are ignored, incorrectly triggering `generic_title` penalties.
- **Impact:** False quality score reductions for validly-titled memories.
- **Recommendation:** Support bare, single-quoted, and double-quoted YAML title values.

#### F1.07 -- Float values pass integer validation
- **Severity:** HIGH
- **File(s):** `scripts/core/config.ts:125-148, 156-170`
- **Description:** "Positive integer" fields only check `Number.isFinite(...)` plus range. Values like `1.5` for `maxConversationMessages` pass and leak into count/slice logic.
- **Impact:** Non-integer config values cause off-by-one or fractional-index bugs downstream.
- **Recommendation:** Add `Number.isInteger()` check.

#### F1.08 -- Duplicate frontmatter on large files
- **Severity:** HIGH
- **File(s):** `scripts/lib/frontmatter-migration.ts:398-411, 1213-1219`
- **Description:** `detectFrontmatter()` returns `found: false` when opening block exceeds 50 lines. `buildFrontmatterContent()` then prepends NEW frontmatter, creating duplicates.
- **Impact:** Double frontmatter blocks in migrated files.
- **Recommendation:** Increase the line limit or use a more robust frontmatter detector.

#### F1.09 -- Sequential workflows misclassified as parallel
- **Severity:** HIGH
- **File(s):** `scripts/lib/flowchart-generator.ts:97-100, 167-170, 195-197, 220-245`
- **Description:** `detectWorkflowPattern()` uses `phases.length > 4` as sole parallelism signal. Any 5+ phase sequential workflow shown as parallel, phases beyond 4 omitted.
- **Impact:** Incorrect flowchart diagrams for sequential multi-phase workflows.
- **Recommendation:** Use explicit parallelism markers rather than phase count.

#### F1.10 -- Swallowed ledger failures
- **Severity:** HIGH
- **File(s):** `mcp_server/handlers/memory-crud-utils.ts:43-64`
- **Description:** Swallows ledger write failures. DB mutations commit while audit history silently disappears.
- **Impact:** Audit trail gaps with no visible indication.
- **Recommendation:** Fail the mutation or at minimum surface a warning to the caller.

#### F1.11 -- Hidden review_count clobber
- **Severity:** HIGH
- **File(s):** `mcp_server/handlers/save/db-helpers.ts:53-57`
- **Description:** Always injects `review_count = 0` when caller omits field. Can clobber existing review state.
- **Impact:** Review progress silently reset on re-save.
- **Recommendation:** Only set `review_count` when explicitly provided; preserve existing value otherwise.

#### F1.12 -- NaN scores accepted in session-learning
- **Severity:** HIGH
- **File(s):** `mcp_server/handlers/session-learning.ts:189, 413`
- **Description:** `validateScores()` checks `typeof === 'number'` and `< 0` / `> 100`, both false for NaN. NaN can be persisted and poison averages.
- **Impact:** Corrupted learning metrics.
- **Recommendation:** Add `Number.isNaN()` check.

#### F1.13 -- Batch dedup breaks for id-less memories
- **Severity:** HIGH
- **File(s):** `mcp_server/lib/session/session-manager.ts:343, 706`
- **Description:** Dedup map uses `Map<number, boolean>`, id-less rows never represented. Already-sent id-less memories can be returned again.
- **Impact:** Duplicate memories in session results.
- **Recommendation:** Use content hash or file_path as fallback dedup key.

#### F1.14 -- Governed saves lose session_id
- **Severity:** HIGH
- **File(s):** `scope-governance.ts:295, save/db-helpers.ts:13, save/create-record.ts:64`
- **Description:** session_id validated but never persisted to memory_index. Same-path dedup filters on session_id, so governed session-scoped save fails to match own scope on next save.
- **Impact:** Duplicate governed saves within the same session.
- **Recommendation:** Persist session_id to memory_index row.

#### F1.15 -- Memory-type inference misclassifies spec docs
- **Severity:** HIGH
- **File(s):** `memory-parser.ts:190, type-inference.ts:228, 246, memory-types.ts:348`
- **Description:** Type inference checks tier before path rules. Default tiers collapse plan.md, tasks.md, checklist.md into 'declarative' instead of canonical 'procedural'/'prospective'. Skews decay/retention.
- **Impact:** Spec documents decay faster or slower than intended.
- **Recommendation:** Check path-based rules before tier-based defaults.

#### F1.16 -- Embedding status state machine marks success prematurely
- **Severity:** HIGH
- **File(s):** `vector-index-mutations.ts:410, 428, 281, 651`
- **Description:** Sets success metadata before the vector write path. The deferred path rewrites to `pending` without deleting old vectors, and `update_embedding_status()` can flip back to `success` without embedding validation.
- **Impact:** Stale or missing vectors masquerade as valid, corrupting search results.
- **Recommendation:** Set `embedding_status = 'success'` only after confirmed vector write.

#### F1.17 -- Embedding cache returns semantically different vectors under same key
- **Severity:** HIGH
- **File(s):** `embedding-pipeline.ts:111, 150; retry-manager.ts:257, 276`
- **Description:** Cache key hashes normalized raw content, but sync save stores weighted embedding while retry path stores unweighted embedding. A later cache hit can silently swap weighted and unweighted vectors.
- **Impact:** Search quality degradation from inconsistent vectors.
- **Recommendation:** Include weighting flag in cache key, or always use the same embedding strategy.

#### F1.18 -- Cross-variant RRF normalization destroys magnitude
- **Severity:** MEDIUM
- **File(s):** `shared/algorithms/rrf-fusion.ts:378, 223, 281, 405`
- **Description:** `fuseResultsCrossVariant()` normalizes scores per variant before merging. This destroys raw reciprocal-rank magnitudes, so a weak variant contributes as much as a strong one.
- **Impact:** Weak retrieval channels get equal weight in final ranking.
- **Recommendation:** Normalize after cross-variant merge, not before.

#### F1.19 -- Quarantine file loss
- **Severity:** HIGH
- **File(s):** `scripts/memory/historical-memory-remediation.ts:240, 703`
- **Description:** `discoverMemoryFiles()` uses `readdirSync()` with no error handling. Quarantine deletes existing target before rename; EXDEV or permission failure loses the file.
- **Impact:** Files permanently lost during remediation.
- **Recommendation:** Copy-then-delete instead of rename; add error handling to readdirSync.

#### F1.20 -- Empty array fast-path bug in input-normalizer
- **Severity:** HIGH
- **File(s):** `scripts/utils/input-normalizer.ts:424, 647`
- **Description:** Fast-path triggers on truthy empty arrays, so `{ user_prompts: [], sessionSummary: "..." }` skips slow-path synthesis. Validation misses camelCase arrays entirely.
- **Impact:** Incomplete data normalization for edge-case inputs.
- **Recommendation:** Check array length, not just truthiness.

#### F1.21 -- Malformed metadata injection by quality backfill
- **Severity:** HIGH
- **File(s):** `scripts/evals/deleted-chk210-quality-backfill-script:40`
- **Description:** Writes quality metadata into fenced yaml block with `quality_flags:` on separate line, while shared workflow writes `quality_flags: []` correctly. Backfill can write malformed metadata while updating DB.
- **Impact:** Malformed YAML in memory files.
- **Recommendation:** Use the shared workflow's format, or validate output.

---

### Category 2: Search Pipeline Architecture

#### F2.01 -- Stage 1 wraps legacy mini-pipeline (V2-wraps-V1)
- **Severity:** CRITICAL
- **File(s):** `pipeline/orchestrator.ts:42-65, stage1-candidate-gen.ts:281-285, hybrid-search.ts:543-1057`
- **Description:** Stage 1 delegates to `hybridSearch.searchWithFallback()` which already does routing, fusion, MPAB, rerank, MMR, co-activation, token-budget, header injection. Then Stages 2/3 re-do fusion/rerank. The "V2 pipeline wraps legacy mini-pipeline" is the biggest architectural issue.
- **Impact:** Redundant computation, unpredictable score semantics, maintenance burden.
- **Recommendation:** Migrate legacy features into pipeline stages; eliminate the double-processing.

#### F2.02 -- Stage 3 rerank scores shadowed by Stage 2 aliases
- **Severity:** CRITICAL
- **File(s):** `pipeline/types.ts:48-67, stage3-rerank.ts:320-327, stage4-filter.ts:203-216`
- **Description:** Score resolver prefers `intentAdjustedScore -> rrfScore` over `score`. Stage 3 overwrites only `score`/`rerankerScore`. Downstream ranking math still uses Stage 2 values. Reranking changes order transiently but the effect is lost.
- **Impact:** Reranking is effectively a no-op for final ordering.
- **Recommendation:** Update score resolver to prefer Stage 3 scores, or have Stage 3 write to the fields downstream consumers read.

#### F2.03 -- Score normalization inconsistent after fusion
- **Severity:** CRITICAL
- **File(s):** `stage2-fusion.ts:165-173, pipeline/types.ts:58-67, ranking-contract.ts:36-57`
- **Description:** Stage 2 stores boosted values without clamping. `resolveEffectiveScore()` clamps to [0,1] but deterministic sorting uses raw >1 scores. Ranking based on different score ranges depending on code path.
- **Impact:** Inconsistent ranking behavior depending on which score accessor is used.
- **Recommendation:** Clamp scores immediately after fusion; ensure all code paths use the same score accessor.

#### F2.04 -- Score boosting exceeds normalized range
- **Severity:** MEDIUM
- **File(s):** `session-boost.ts:57-71, 155-163; causal-boost.ts:267-275, 273-282`
- **Description:** Both modules write `score = baseScore * (1 + boost)` without clamping. A 1.0 base score becomes >1.0. Pipeline clamps later in `resolveEffectiveScore()`, but intermediate consumers see unclamped values.
- **Impact:** Range-consistency bug; intermediate processing uses invalid score ranges.
- **Recommendation:** Clamp after boost application.

#### F2.05 -- Channel enforcement undone by later stages
- **Severity:** MEDIUM
- **File(s):** `hybrid-search.ts:801-832, 842-848, 957-975; folder-relevance.ts:205-238`
- **Description:** Channel enforcement runs first, but confidence truncation and folder scoring run afterward. `twoPhaseRetrieval()` filters purely by top folders, so a promoted result from an underrepresented channel can still be removed if its folder loses.
- **Impact:** Channel diversity guarantees not maintained in final results.
- **Recommendation:** Re-run channel enforcement after folder scoring, or make folder scoring advisory.

#### F2.06 -- Token budgeting enforced but not strictly correct
- **Severity:** MEDIUM
- **File(s):** `hybrid-search.ts:991-999, 1034-1037, 1672-1679; dynamic-token-budget.ts:5-9`
- **Description:** Budget math subtracts header overhead using `reranked.length` before truncation (reserving for results that never survive). Trace records `budgetResult.budget` not the actual `adjustedBudget`. First oversized result always kept even if over budget. Docs say "advisory-only" but runtime enforces.
- **Impact:** Inaccurate budget enforcement; trace metadata misleading.
- **Recommendation:** Fix overhead calculation, record actual budget used, update docs.

#### F2.07 -- Stage 1 duplicates embedding work 3-4x
- **Severity:** MEDIUM
- **File(s):** `stage1-candidate-gen.ts:263-265, 277-280, 543-545, 594-596`
- **Description:** Multiple embedding generation calls for the same query within a single search request.
- **Impact:** Unnecessary latency and API cost.
- **Recommendation:** Cache query embedding at the start and share across channels.

#### F2.08 -- Query understanding dropped between classifiers
- **Severity:** MEDIUM
- **File(s):** `stage1-candidate-gen.ts:281-285, hybrid-search.ts:64-83, 733-742`
- **Description:** Query classification results from Stage 1 are not propagated to the legacy pipeline, which re-classifies independently.
- **Impact:** Inconsistent query understanding across pipeline stages.
- **Recommendation:** Pass classification context through the pipeline.

#### F2.09 -- Graph FTS score discarded after computation
- **Severity:** MEDIUM
- **File(s):** `graph-search-fn.ts:143, 160, 107`
- **Description:** BM25 relevance is computed and used for SQL ordering, but the returned candidate score is reset to `row.strength`. The later sort step ignores the BM25 signal the function claims to use.
- **Impact:** Graph search results ranked by edge strength only, not by lexical relevance.
- **Recommendation:** Combine BM25 score with edge strength in the returned candidate score.

#### F2.10 -- Summary-vector retrieval uses arbitrary prefix
- **Severity:** MEDIUM
- **File(s):** `memory-summaries.ts:161, 169, 210`
- **Description:** Fetches rows with `LIMIT ?` but no `ORDER BY` before cosine ranking. The channel is enabled only for larger indexes, making this a scale-triggered recall bug.
- **Impact:** At scale, most summary corpus ignored; retrieval quality degrades.
- **Recommendation:** Add `ORDER BY` before LIMIT, or use vector similarity as the ordering criterion.

#### F2.11 -- Entity linking has no disambiguation
- **Severity:** MEDIUM
- **File(s):** `entity-linker.ts:67, 87, 141, 293`
- **Description:** Only uses normalized surface-form equality. No entity type, context overlap, confidence threshold, or ambiguity filter. Any 2-folder occurrence treated as a match.
- **Impact:** False cross-document edges from ambiguous entity names.
- **Recommendation:** Add disambiguation criteria: entity type, context similarity threshold, or minimum confidence.

#### F2.12 -- Graph degree boosts stale after deletion
- **Severity:** MEDIUM
- **File(s):** `graph-search-fn.ts:265, 439; vector-index-mutations.ts:38`
- **Description:** Deletion removes `causal_edges` but does not invalidate the degree cache. Searches after deletes use obsolete degree boosts.
- **Impact:** Stale ranking boosts for deleted memories.
- **Recommendation:** Clear degree cache on edge deletion.

#### F2.13 -- Dead pipeline feature flag
- **Severity:** LOW
- **File(s):** `search-flags.ts:107-115`
- **Description:** `isPipelineV2Enabled()` always returns `true` and is documented as deprecated. Only found in definition plus own tests.
- **Impact:** Dead code adding complexity.
- **Recommendation:** Remove the flag and its guard clauses.

#### F2.14 -- Dead code: reranker.ts, rsf-fusion.ts, cross-encoder local path
- **Severity:** LOW
- **File(s):** `reranker.ts (standalone), rsf-fusion.ts (shadow-only), cross-encoder.ts:315-349`
- **Description:** Standalone reranker is unused. RSF fusion is shadow-only. Cross-encoder local path has no active consumers.
- **Impact:** Maintenance burden for dead code.
- **Recommendation:** Remove or archive.

---

### Category 3: Error Handling & Contract Consistency

#### F3.01 -- Extractors: Silent error suppression pattern
- **Severity:** HIGH
- **File(s):** `claude-code-capture.ts, codex-cli-capture.ts, copilot-cli-capture.ts, gemini-cli-capture.ts, spec-folder-extractor.ts` (all 18 extractors)
- **Description:** Capture adapters return `[]`, `null`, or `{}`-equivalents without surfacing why capture/parsing failed. No common failure/fallback contract. Some synthesize data, some return null, some return empty payloads.
- **Impact:** Consumers must know each extractor's private contract; failures invisible.
- **Recommendation:** Define a shared failure contract (e.g., `{ success: false, reason: string }`).

#### F3.02 -- Error formatting not uniform across CRUD handlers
- **Severity:** HIGH
- **File(s):** `memory-crud-delete.ts:68-75, memory-crud-update.ts:41-78`
- **Description:** Delete/update throw raw errors, unlike list/stats/health which return MCP envelopes.
- **Impact:** Inconsistent error experience for AI callers.
- **Recommendation:** Wrap all handler errors in MCP error envelopes.

#### F3.03 -- Error-code vocabulary inconsistent inside envelopes
- **Severity:** HIGH
- **File(s):** `recovery-hints.ts:45-119; memory-ingest.ts:203-217; checkpoints.ts:118-129, 226-240`
- **Description:** Canonical codes are `E###`, but handlers emit a mix of `E_VALIDATION`, `E404`, `E_DB_UNAVAILABLE`, `CHECKPOINT_CREATE_FAILED`, etc. `createErrorResponse()` only adds hints when handler explicitly passes `recovery`.
- **Impact:** Clients receive mixed code namespaces and inconsistent hint behavior.
- **Recommendation:** Standardize all error codes on the canonical `E###` catalog.

#### F3.04 -- MCP tool definitions and runtime validation out of sync
- **Severity:** HIGH
- **File(s):** `context-server.ts:264-265, 281-325; tool-schemas.ts:63-67, 186-189; tool-input-schemas.ts:113-152, 162-168, 405-409`
- **Description:** Tool catalog advertises parameters (tenantId, userId, agentId, sharedSpaceId, provenanceSource, retentionPolicy) that the validator and allowed-parameter list reject.
- **Impact:** AI callers use parameters the server will reject -- highest-friction UX issue.
- **Recommendation:** Generate tool definitions and validators from a single source of truth.

#### F3.05 -- Health handler reports partial failure as success
- **Severity:** HIGH
- **File(s):** `mcp_server/handlers/memory-crud-health.ts:320-359`
- **Description:** Logs DB read failures and continues with defaulted values. Reports "success" with incomplete diagnostics.
- **Impact:** Operators trust health checks that have silently degraded.
- **Recommendation:** Return partial success status when any component check fails.

#### F3.06 -- Raw handler errors reach MCP with wrong contract
- **Severity:** HIGH
- **File(s):** `memory-save.ts:729-847, memory-bulk-delete.ts:48-80, memory-ingest.ts:135-152`
- **Description:** Expected validation/policy failures lose tool-specific code, details, and recovery shape vs handlers returning structured MCP errors.
- **Impact:** Loss of actionable error context for callers.
- **Recommendation:** Route all handler errors through the structured error system.

#### F3.07 -- record_correction() not atomic with graph sync
- **Severity:** HIGH
- **File(s):** `lib/learning/corrections.ts:429-500`
- **Description:** Correction ledger and stability updates wrapped in transaction, but causal-edge creation is best-effort and swallowed on failure. Correction ledger says correction happened but graph never reflects it.
- **Impact:** Inconsistent lineage queries.
- **Recommendation:** Include causal-edge creation in the transaction, or record the graph-sync failure.

#### F3.08 -- Alignment failures silently swallowed
- **Severity:** MEDIUM
- **File(s):** `scripts/core/workflow.ts:381-396`
- **Description:** `resolveAlignmentTargets()` swallows spec-context failures and falls back to keyword-only matching, weakening contamination gate silently.
- **Impact:** Contamination detection degraded without warning.
- **Recommendation:** Log the fallback with at least a warning.

#### F3.09 -- listSpecFolderKeyFiles swallows all failures
- **Severity:** MEDIUM
- **File(s):** `scripts/core/workflow.ts:660-690`
- **Description:** Full recursive walk wrapped in one try/catch, returns `[]` on any failure. One unreadable directory erases all KEY_FILES context.
- **Impact:** Silent loss of spec folder context.
- **Recommendation:** Handle per-directory errors; return partial results.

#### F3.10 -- Error hierarchy clean in core but inconsistent in handler adoption
- **Severity:** MEDIUM
- **File(s):** `lib/errors/core.ts:93-110; handlers/checkpoints.ts:107-112, 197-199, 287-295`
- **Description:** `MemoryError` is a proper base class with hint metadata, but several handlers still throw raw `Error`, bypassing the hierarchy.
- **Impact:** Inconsistent error semantics depending on handler.
- **Recommendation:** Migrate all handlers to use `MemoryError` subclasses.

#### F3.11 -- Quality gate fail-open on dependency errors
- **Severity:** MEDIUM
- **File(s):** `lib/validation/save-quality-gate.ts:590-602, 690-710`
- **Description:** Semantic-dedup errors converted into pass-through results. Warn-only mode also allows would-be rejects.
- **Impact:** Low-quality content can bypass quality gate when dependencies fail.
- **Recommendation:** At minimum log/surface the dependency failure; consider blocking.

#### F3.12 -- Preflight duplicate check fails open on DB errors
- **Severity:** MEDIUM
- **File(s):** `lib/validation/preflight.ts:397-446`
- **Description:** Duplicate checks fail open if DB/vector lookup errors occur.
- **Impact:** Duplicate memories can be saved during transient DB issues.
- **Recommendation:** Return an explicit "check inconclusive" status.

---

### Category 4: Security & Path Safety

#### F4.01 -- Path prefix bypass in backfill-frontmatter
- **Severity:** HIGH
- **File(s):** `scripts/memory/backfill-frontmatter.ts:174`
- **Description:** Project-boundary validation uses `startsWith(PROJECT_ROOT)` prefix-based check. Sibling paths like `/repo-evil/...` pass. Also silently drops `readdirSync` failures.
- **Impact:** Potential path traversal to read/modify files outside project.
- **Recommendation:** Use `path.resolve()` + strict containment check (not just prefix).

#### F4.02 -- Cross-OS path security issue
- **Severity:** HIGH
- **File(s):** `scripts/utils/path-utils.ts:36, 55`
- **Description:** On macOS/Linux, `path.resolve('C:/tmp/x')` becomes `<cwd>/C:/tmp/x`, incorrectly accepted as inside the repo.
- **Impact:** Windows paths incorrectly accepted on POSIX systems.
- **Recommendation:** Reject paths containing Windows drive letters on POSIX.

#### F4.03 -- Retry worker bypasses path security
- **Severity:** MEDIUM
- **File(s):** `mcp_server/lib/providers/retry-manager.ts:423, 546, 276`
- **Description:** Retry processing reads `memory.file_path` directly from DB and passes to `readFile()` with no validation. The path validator exists but is not called. A poisoned `memory_index.file_path` row can make the retry worker read arbitrary local files.
- **Impact:** Arbitrary file read via poisoned DB state.
- **Recommendation:** Re-run `validateFilePath` before every retry-path read.

#### F4.04 -- DB paths can escape project root
- **Severity:** HIGH
- **File(s):** `shared/paths.ts:13, shared/config.ts:42`
- **Description:** `path.resolve(process.cwd(), configuredDir, ...)` called directly, so `SPEC_KIT_DB_DIR=/etc` resolves outside workspace. The shared layer has a hardened validator in `shared/utils/path-security.ts` but these builders don't use it.
- **Impact:** Database operations on unintended filesystem locations.
- **Recommendation:** Validate resolved DB path against project root.

#### F4.05 -- Redaction gate 40-char hex allowlist bypass
- **Severity:** MEDIUM
- **File(s):** `mcp_server/lib/extraction/redaction-gate.ts:21, 35`
- **Description:** 40-char hex strings are allowlisted (assumed to be git SHAs), but API keys and tokens can also be 40-char hex strings.
- **Impact:** Potential secret leakage through redaction bypass.
- **Recommendation:** Add context-aware checks (e.g., check if preceded by key/token/password labels).

#### F4.06 -- Structured logger has no redaction
- **Severity:** MEDIUM
- **File(s):** `mcp_server/lib/utils/logger.ts:46, 54`
- **Description:** Blindly `JSON.stringify`s whatever object it receives and emits to stderr. Any caller logging apiKey, Authorization, raw content, or file paths will leak them. Circular objects will crash.
- **Impact:** Potential secret leakage through logs; crash path from circular objects.
- **Recommendation:** Add field redaction for known sensitive keys; add circular-reference safety.

#### F4.07 -- MCP errors leak internal filesystem paths
- **Severity:** LOW
- **File(s):** `memory-crud-list.ts:137, memory-crud-stats.ts:158, memory-save.ts:1162-1165`
- **Description:** Raw database exceptions with absolute paths and SQL details returned to clients.
- **Impact:** Information disclosure of internal paths and schema.
- **Recommendation:** Sanitize error messages before returning to callers.

#### F4.08 -- Eval script uses string concatenation for SQL
- **Severity:** LOW
- **File(s):** `scripts/evals/deleted-chk210-quality-backfill-script:83, 89, 118`
- **Description:** Values interpolated directly into SQL strings passed to `sqlite3` shell. Quote-doubling reduces risk but is brittle.
- **Impact:** Potential SQL injection in maintenance scripts.
- **Recommendation:** Use parameterized queries via `better-sqlite3`.

---

### Category 5: Performance & Scalability

#### F5.01 -- 1,100+ line god function
- **Severity:** MEDIUM
- **File(s):** `scripts/core/workflow.ts:1283-2388`
- **Description:** `runWorkflow()` does loading, alignment, contamination, enrichment, extraction, thinning, rendering, scoring, writing, indexing, and retry. Biggest SRP/testability problem.
- **Impact:** Extremely difficult to test, debug, or modify individual stages.
- **Recommendation:** Decompose into stage functions with clear inputs/outputs.

#### F5.02 -- withWorkflowRunLock has no timeout
- **Severity:** MEDIUM
- **File(s):** `scripts/core/workflow.ts:943-959`
- **Description:** Global in-process queue with no timeout/cancellation. One hung run blocks every later run indefinitely.
- **Impact:** Process-level deadlock from a single hung workflow.
- **Recommendation:** Add configurable timeout; reject or queue with TTL.

#### F5.03 -- O(n) duplicate detection per save
- **Severity:** MEDIUM
- **File(s):** `scripts/core/file-writer.ts:83-108`
- **Description:** Duplicate detection re-reads and re-hashes every existing `.md` file per outgoing file. Latency scales with total historical content.
- **Impact:** Save operations slow down as memory count grows.
- **Recommendation:** Maintain a hash index; only rehash on file change.

#### F5.04 -- O(n^2) content similarity check
- **Severity:** MEDIUM
- **File(s):** `scripts/lib/content-filter.ts:376-398, 580-609`
- **Description:** Each item compared against all prior content using position-based char comparison on first 200 chars. Poor scaling and accuracy.
- **Impact:** Quadratic performance on large content sets.
- **Recommendation:** Use hash-based similarity (MinHash, SimHash) for O(n) scaling.

#### F5.05 -- Single-worker ingest queue
- **Severity:** MEDIUM
- **File(s):** `mcp_server/lib/ops/job-queue.ts:105-108, 651-697`
- **Description:** One-worker-at-a-time with `pendingQueue.includes()` for dedup (O(n) per enqueue). Head-of-line blocking.
- **Impact:** Ingest throughput bottleneck.
- **Recommendation:** Use Set-backed queue with bounded concurrency.

#### F5.06 -- Subfolder traversal: no early exit, no caching
- **Severity:** MEDIUM
- **File(s):** `scripts/core/subfolder-utils.ts:60-97, 158-194`
- **Description:** Traversal always scans whole tree even when unique match found. No early exit, no caching, hardcoded `SEARCH_MAX_DEPTH`.
- **Impact:** Unnecessary filesystem I/O on every subfolder resolution.
- **Recommendation:** Exit on unique match; cache results within request.

#### F5.07 -- MMR silently pads mismatched vectors
- **Severity:** MEDIUM
- **File(s):** `shared/algorithms/mmr-reranker.ts:48, 57`
- **Description:** `computeCosine()` zero-pads any dimension mismatch up to 10%. This is not cosine similarity in a single embedding space and hides dimension drift.
- **Impact:** Incorrect similarity calculations masking provider/dimension changes.
- **Recommendation:** Reject mismatched vectors or log a warning.

#### F5.08 -- Token estimation has no accuracy guarantee
- **Severity:** MEDIUM
- **File(s):** `shared/utils/token-estimate.ts:9, shared/lib/structure-aware-chunker.ts:39`
- **Description:** Assumes fixed 4 chars/token for every model and content type. Can be off by 2x-4x on code/CJK/punctuation-heavy text.
- **Impact:** Token budget enforcement unreliable for non-English/non-prose content.
- **Recommendation:** Use model-specific tokenizer or at minimum different ratios for code vs prose.

---

### Category 6: Code Duplication & Dead Code

#### F6.01 -- Structure-aware chunker: full duplicate
- **Severity:** HIGH
- **File(s):** `scripts/lib/structure-aware-chunker.ts` vs `shared/lib/structure-aware-chunker.ts`
- **Description:** Line-for-line duplicate. Only banner/comment differences. Future fixes can miss one copy.
- **Impact:** Maintenance burden; bug fixes in one copy don't reach the other.
- **Recommendation:** Replace script copy with re-export from shared.

#### F6.02 -- Duplicated trigger ranking pipeline
- **Severity:** MEDIUM
- **File(s):** `scripts/lib/semantic-signal-extractor.ts:166-414` vs `shared/trigger-extractor.ts:534-659`
- **Description:** Script-side rebuilds placeholder filtering, n-gram scoring, candidate merging, substring dedupe on top of shared primitives. Behavior drift risk.
- **Impact:** Two implementations of the same logic that can diverge.
- **Recommendation:** Consolidate into shared module.

#### F6.03 -- Sync/async duplication in subfolder-utils
- **Severity:** MEDIUM
- **File(s):** `scripts/core/subfolder-utils.ts:39-127, 130-223`
- **Description:** Sync and async implementations are near-copy-paste duplicates. Root dedupe, traversal, ambiguity handling should be shared.
- **Impact:** Maintenance burden; behavior drift between sync and async paths.
- **Recommendation:** Extract shared logic into helper functions.

#### F6.04 -- Path validation overlap
- **Severity:** MEDIUM
- **File(s):** `scripts/utils/path-utils.ts::sanitizePath()` vs `shared/utils/path-security.ts::validateFilePath()`
- **Description:** Substantially overlapping path validation logic in two locations. Security-sensitive code should have one canonical implementation.
- **Impact:** Security fixes may not reach both implementations.
- **Recommendation:** Consolidate onto `shared/utils/path-security.ts::validateFilePath()`.

#### F6.05 -- Anchor validation partially duplicated
- **Severity:** MEDIUM
- **File(s):** `scripts/utils/validation-utils.ts::validateAnchors()` vs `mcp_server/lib/validation/preflight.ts::validateAnchorFormat()`
- **Description:** Different anchor rules in two validators.
- **Impact:** Files passing one validator may fail the other.
- **Recommendation:** Unify anchor grammar/validation in one shared validator.

#### F6.06 -- Quality proxy split-brain implementations
- **Severity:** HIGH
- **File(s):** `mcp_server/lib/eval/eval-quality-proxy.ts:17-26, 166-207` vs `mcp_server/lib/telemetry/retrieval-telemetry.ts:41-44, 271-296, 483-500`
- **Description:** Both implement "quality proxy" with shared weights but different semantics: eval uses caller-supplied `expectedCount` and 500ms latency target; telemetry hardcodes saturation at 10 results and 5000ms ceiling.
- **Impact:** Offline eval numbers and live telemetry numbers not comparable even though they represent the same named metric.
- **Recommendation:** Unify into one parameterized implementation.

#### F6.07 -- Stale declaration artifact
- **Severity:** LOW
- **File(s):** `scripts/core/tree-thinning.ts:121` vs `scripts/core/tree-thinning.d.ts` vs `scripts/core/tree-thinning.js:10`
- **Description:** `.ts` exports `generateMergedDescription` but `.d.ts` and compiled `.js` do not declare/export it.
- **Impact:** Consumers using declaration files cannot access the function.
- **Recommendation:** Rebuild declarations; remove stale compiled output.

#### F6.08 -- Dead imports and exports
- **Severity:** LOW
- **File(s):** `diagram-extractor.ts:19` (unused `generateDecisionTree` import), `decision-extractor.ts:16` (dead `simFactory` import), `source-capabilities.ts:78` (dead `SOURCE_CAPABILITIES` and `isKnownDataSource`), `simulation-factory.ts:542` (6 test-only exports), multiple dead barrel type exports in `core/index.ts:19`
- **Description:** Various unused imports, dead exports, and test-only exports across the codebase.
- **Impact:** Code clutter and confusion about public API surface.
- **Recommendation:** Remove dead imports/exports; mark test-only exports with `@internal`.

#### F6.09 -- Tool/handler request contracts duplicated
- **Severity:** MEDIUM
- **File(s):** `tools/types.ts:41` vs `handlers/memory-context.ts:96, memory-search.ts:126, save/types.ts:106`
- **Description:** `ContextArgs`, `SearchArgs`, and `SaveArgs` defined separately in tool layer and handler layer. `SearchArgs` has already drifted: tool-side `mode` and `minState` are constrained unions while handler-side they are plain `string`.
- **Impact:** Schema drift caught late by structural typing rather than compilation.
- **Recommendation:** Export canonical types from one location; handlers import from there.

#### F6.10 -- IndexResult and AtomicSaveResult fragmented
- **Severity:** MEDIUM
- **File(s):** `handlers/save/types.ts:37, pe-gating.ts:51, chunking-orchestrator.ts:47, memory-index.ts:54, context-server.ts:106; transaction-manager.ts:31`
- **Description:** Same concepts (`IndexResult`, `AtomicSaveResult`) defined in 5+ locations with different field sets.
- **Impact:** Type drift and increasing use of `Record<string, unknown>` patching.
- **Recommendation:** Centralize into `handlers/save/types.ts`.

---

### Category 7: Type Safety & Interface Design

#### F7.01 -- Overly broad embedding provider types
- **Severity:** MEDIUM
- **File(s):** `shared/types.ts:22-57, shared/embeddings.ts:708-726`
- **Description:** `IEmbeddingProvider.getProfile()` returns anonymous union instead of canonical profile contract.
- **Impact:** Consumers can't rely on a consistent profile shape.
- **Recommendation:** Define a canonical `EmbeddingProfile` interface.

#### F7.02 -- Open-ended type signatures in folder scoring
- **Severity:** MEDIUM
- **File(s):** `shared/scoring/folder-scoring.ts:23, 204-218, 251-265; shared/types.ts:307-325`
- **Description:** Accepts `Partial<Memory> & Record<string, unknown>`. `FolderScore` has `[key: string]: unknown`. Biggest type-safety compromise in shared surface.
- **Impact:** No compile-time protection against incorrect usage.
- **Recommendation:** Replace with specific interfaces; remove index signatures.

#### F7.03 -- export * barrel hygiene
- **Severity:** MEDIUM
- **File(s):** `shared/index.ts:168, shared/algorithms/index.ts:5-7, shared/embeddings.ts:752-796`
- **Description:** Barrel files use `export *`; embeddings.ts exports wide mix of APIs/diagnostics/legacy aliases. Hard to reason about public surface.
- **Impact:** Accidental exposure of internal APIs; name collisions.
- **Recommendation:** Use explicit named exports in barrel files.

#### F7.04 -- parseArgs double-casts to target type
- **Severity:** MEDIUM
- **File(s):** `mcp_server/tools/types.ts:19`
- **Description:** `parseArgs<T>()` double-casts arbitrary records into target types and returns `{}` as `T` for non-objects. No `any` but heavy reliance on `unknown` + `Record<string, unknown>`.
- **Impact:** Type safety bypassed at the MCP boundary.
- **Recommendation:** Use Zod parsing that returns properly typed results.

#### F7.05 -- GraphSearchFn erases types
- **Severity:** MEDIUM
- **File(s):** `search-types.ts:7, graph-search-fn.ts:453`
- **Description:** `GraphSearchFn` erases both options and results to generic records. Prevents the graph channel from participating in stronger pipeline typing.
- **Impact:** Graph search results lose type information.
- **Recommendation:** Define specific input/output types for graph search.

#### F7.06 -- Parallel type hierarchies in session types
- **Severity:** HIGH
- **File(s):** `scripts/types/session-types.ts:8, 55; scripts/utils/input-normalizer.ts:22; scripts/loaders/data-loader.ts:20, 346, 527`
- **Description:** `session-types.ts` claims to be the single source of truth but `data-loader.ts` imports parallel types from `input-normalizer.ts` and bridges with `as LoadedData` casts.
- **Impact:** Schema drift between loader-normalizer data and extractor expectations is compile-time invisible.
- **Recommendation:** Migrate `data-loader.ts` to import from `session-types.ts`.

#### F7.07 -- Duplicate anchor detection blind spot
- **Severity:** MEDIUM
- **File(s):** `scripts/utils/validation-utils.ts:49`
- **Description:** Anchor validation uses Sets, so duplicate opens/closes invisible. Two opens and one close compare equal.
- **Impact:** Anchor validation passes for malformed anchor pairs.
- **Recommendation:** Use counting-based validation instead of Set membership.

---

### Category 8: Configuration & Standards Alignment

#### F8.01 -- No single source of truth for runtime config
- **Severity:** HIGH
- **File(s):** `config/config.jsonc:4-6, scripts/core/config.ts:223-275`
- **Description:** `config.jsonc` looks like a master config but only Section 1 is active. Sections like `semanticSearch`, `memoryDecay`, `importanceTiers`, `hybridSearch` are documentation, not live config.
- **Impact:** Operators edit config values that have no runtime effect.
- **Recommendation:** Either make all config sections live, or clearly mark which sections are reference-only.

#### F8.02 -- DB path config inconsistent across modules
- **Severity:** HIGH
- **File(s):** `shared/config.ts:9-10, mcp_server/core/config.ts:42-50, vector-index-store.ts:213-235, eval-db.ts:18-25`
- **Description:** `shared/config.ts` supports `SPEC_KIT_DB_DIR` and `SPECKIT_DB_DIR`. `core/config.ts` only honors `SPEC_KIT_DB_DIR`. `vector-index-store.ts` uses `SPEC_KIT_DB_DIR` plus legacy `MEMORY_DB_DIR`, and `MEMORY_DB_PATH` can override. Scripts and MCP server can point at different SQLite files.
- **Impact:** Split-brain database state between scripts and server.
- **Recommendation:** Centralize DB path resolution into one module; deprecate legacy env vars.

#### F8.03 -- Reference-only JSON config duplicates hardcoded values
- **Severity:** HIGH
- **File(s):** `mcp_server/configs/search-weights.json:7-19, lib/scoring/composite-scoring.ts:198-212`
- **Description:** `search-weights.json` says `documentTypeMultipliers` are "reference/future-config only" but live values are hardcoded in `composite-scoring.ts`.
- **Impact:** Editable config file that is the wrong source of truth.
- **Recommendation:** Either load from config or remove the config file.

#### F8.04 -- filters.jsonc defaults diverge from code defaults
- **Severity:** MEDIUM
- **File(s):** `config/filters.jsonc:21-50, scripts/lib/content-filter.ts:169-195`
- **Description:** File: `minContentLength: 15, minUniqueWords: 3, hashLength: 300, similarityThreshold: 0.70`. Code fallback: `5, 2, 200, 0.85`. Behavior changes significantly if file is missing.
- **Impact:** Silent behavior change on config file absence.
- **Recommendation:** Align defaults, or fail loudly when config file is missing.

#### F8.05 -- Feature flag semantics not uniform
- **Severity:** MEDIUM
- **File(s):** `rollout-policy.ts:42-57, search-flags.ts:240-243`
- **Description:** Many `SPECKIT_*` flags are default-on unless explicitly `false`/`0`, while some opt-ins require exact `"true"`. No uniform parsing.
- **Impact:** Operator confusion about flag behavior.
- **Recommendation:** Standardize flag parsing (e.g., always truthy/falsy, or always explicit).

#### F8.06 -- Stale env var documentation
- **Severity:** HIGH
- **File(s):** `README.md:385-392, .env.example, mcp_server/README.md:828-885`
- **Description:** Docs reference `SPEC_KIT_DB_PATH` and `SPEC_KIT_LOG_LEVEL` (not used). Docs use `EMBEDDING_PROVIDER` and `huggingface`; code uses `EMBEDDINGS_PROVIDER` and `hf-local`. `.env.example` documents `EMBEDDINGS_MODEL`, `EMBEDDINGS_BATCH_SIZE`, `EMBEDDINGS_CONCURRENCY`, `EMBEDDINGS_DEVICE` with no runtime consumers. Active vars like `OPENAI_BASE_URL`, `VOYAGE_BASE_URL`, `SPECKIT_RERANKER_TIMEOUT_MS` missing from docs.
- **Impact:** Operators configure vars that don't work; miss vars that do.
- **Recommendation:** Audit all env vars; sync docs with code.

#### F8.07 -- Documented error code doesn't match runtime
- **Severity:** HIGH
- **File(s):** `SKILL.md:578-580, handlers/memory-search.ts:804-813, lib/errors/core.ts:69-78`
- **Description:** SKILL.md says `memory_search()` with only `specFolder` causes `E040`, but runtime returns `E_VALIDATION`; `E040` is legacy `SEARCH_FAILED`.
- **Impact:** AI callers cannot match documented error handling patterns.
- **Recommendation:** Align docs with actual error codes.

#### F8.08 -- MCP tool naming/interface drift in docs
- **Severity:** HIGH
- **File(s):** `README.md:288-304, context-server.ts:264-266, tool-schemas.ts:40-43`
- **Description:** README says MCP calls use `spec_kit_memory_` prefix, but server registers raw tool names like `memory_context`, `checkpoint_create`.
- **Impact:** Documentation misleads integrators.
- **Recommendation:** Update docs to reflect actual tool names.

#### F8.09 -- Command inventory stale
- **Severity:** MEDIUM
- **File(s):** `README.md:306-340`
- **Description:** README claims 15 commands (8 spec_kit + 7 memory), but repo has 8 + 6. Omits `/spec_kit:deep-research`.
- **Impact:** Incomplete command reference.
- **Recommendation:** Update command count and add missing entries.

#### F8.10 -- Validation-rule counts inconsistent
- **Severity:** MEDIUM
- **File(s):** `README.md:109-116, 347-348, 669; references/validation/validation_rules.md:40-58`
- **Description:** README says "13 validation rules" but reference enumerates 14.
- **Impact:** Documentation credibility undermined.
- **Recommendation:** Update count to match actual rules.

#### F8.11 -- Gate 3 constitutional rules don't include Option E
- **Severity:** HIGH
- **File(s):** `constitutional/gate-enforcement.md:66-68, templates/README.md:87-90`
- **Description:** Constitutional rule says Gate 3 is only A/B/C/D, while templates rely on Option E for phase-child work. The always-surfaced constitutional rule and templates disagree.
- **Impact:** AI agents may not offer Option E when it is needed.
- **Recommendation:** Add Option E to gate-enforcement.md.

#### F8.12 -- Phase-rule contradiction between nodes and templates
- **Severity:** MEDIUM
- **File(s):** `nodes/phase-system.md:14-19, templates/level_2/README.md:78-83`
- **Description:** Phase system doc says phases apply only when `documentation level >= 3`, but Level 2 README recommends phase decomposition.
- **Impact:** Conflicting guidance for Level 2 workflows.
- **Recommendation:** Align phase eligibility rules.

#### F8.13 -- Feature-flag docs test currently failing
- **Severity:** HIGH
- **File(s):** `mcp_server/tests/feature-flag-reference-docs.vitest.ts:110-129`
- **Description:** Test looks for an outdated `manual_testing_playbook` location, but the file actually lives under `.opencode/skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/125-hydra-roadmap-capability-flags.md`. This is the current baseline test failure.
- **Impact:** `npm test` fails on a documentation contract test.
- **Recommendation:** Fix the path in the test.

#### F8.14 -- Version duplication across packages
- **Severity:** LOW
- **File(s):** root `package.json`, workspace `package.json` files, `scripts/core/config.ts:283-305`
- **Description:** Version `1.7.2` appears in all package.json files and also hardcoded as `SKILL_VERSION` in config.
- **Impact:** Version drift risk.
- **Recommendation:** Derive version from package.json at runtime.

#### F8.15 -- .gitignore doesn't ignore .env
- **Severity:** LOW
- **File(s):** `.opencode/skill/system-spec-kit/.gitignore`
- **Description:** No `.env` entry in gitignore.
- **Impact:** Accidental secret commits possible.
- **Recommendation:** Add `.env` to `.gitignore`.

#### F8.16 -- Compliance scorecard summary
- **Severity:** (informational)
- **File(s):** Full codebase
- **Description:** sk-code--opencode compliance grades from iteration 10: File naming **A**, Module structure **A**, TypeScript strict **A**, Import organization **A-**, Documentation quality **B**, Test naming **B**, JSDoc coverage **B-**, Error class usage **C+**, Logger usage **C+**.
- **Impact:** Main compliance gaps are mixed error/logging strategy across workspaces, uneven JSDoc coverage, and legacy test naming.
- **Recommendation:** Prioritize error class and logger consistency.

---

### Category 9: UX & Automation Opportunities

#### F9.01 -- CLI help references nonexistent commands
- **Severity:** HIGH
- **File(s):** `mcp_server/cli.ts:351-356, 50-60, 483-499`
- **Description:** Bulk delete prints restore instruction `spec-kit-cli checkpoint restore <name>`, but CLI only implements `stats`, `bulk-delete`, `reindex`, and `schema-downgrade`. Hidden undocumented `--folder` flag on `schema-downgrade`. Reindex failures dump raw JSON to stderr.
- **Impact:** Users try to run commands that don't exist.
- **Recommendation:** Fix CLI help text; document all flags; format error output.

#### F9.02 -- Startup UX mixes severity levels
- **Severity:** HIGH
- **File(s):** `context-server.ts:515, 527, 741-744, 831-832, 1065-1067, 518-521, 529-531, 781-785, 820-825`
- **Description:** Almost all startup state logged via `console.error` including normal progress. Cannot distinguish normal, degraded, skipped, or failed startup. Eager warmup timeout marks embeddings "ready" to avoid undefined state, masking degraded startup.
- **Impact:** Operators cannot distinguish healthy from degraded startup.
- **Recommendation:** Use structured log levels (info/warn/error/fatal) for startup stages.

#### F9.03 -- Recovery hints misleading or generic
- **Severity:** MEDIUM
- **File(s):** `recovery-hints.ts:462-468, 310-317, 554-562, 563-570`
- **Description:** `SESSION_EXPIRED` suggests `/memory:continue` (not an MCP tool). `PARAMETER_OUT_OF_RANGE` doesn't say which parameter. `ANCHOR_FORMAT_INVALID` gives generic rules. `TOKEN_BUDGET_EXCEEDED` suggests splitting but doesn't include actual vs budget.
- **Impact:** Callers must do detective work to resolve errors.
- **Recommendation:** Include specific context (parameter name, actual values, valid tool names).

#### F9.04 -- Parameter naming conventions inconsistent
- **Severity:** MEDIUM
- **File(s):** `tool-schemas.ts:179-182; tool-input-schemas.ts:129-130, 154-160`
- **Description:** `memory_match_triggers` mixes `session_id`, `turnNumber`, `include_cognitive`. `memory_search` supports both `min_quality_score` and deprecated `minQualityScore`.
- **Impact:** Increased cognitive load for AI callers.
- **Recommendation:** Standardize on one naming convention (snake_case); deprecate alternatives.

#### F9.05 -- Severity taxonomy inconsistent
- **Severity:** MEDIUM
- **File(s):** `recovery-hints.ts:13-23; memory-ingest.ts:212-216; memory-crud-update.ts:236-240; envelope.ts:64-80`
- **Description:** Canonical catalog defines `low | medium | high | critical`, but ad hoc handlers use `warning` and `error`. Envelope accepts any string.
- **Impact:** Clients receive mixed severity vocabularies.
- **Recommendation:** Enforce canonical severity enum.

#### F9.06 -- Manual steps still on happy path
- **Severity:** MEDIUM
- **File(s):** `SKILL.md:355-375, 497-505, 600-603, 663-668, 806-812; scripts/spec-folder/directory-setup.ts:68-88; scripts/core/workflow.ts:2352-2354`
- **Description:** Users/operators told to manually run `create.sh`, `generate-context.js`, `memory_index_scan()`/`memory_save()`, `validate.sh`, alignment verification, completeness checks, and shell pipeline to find next spec number. Workflow falls back to "Run npm run rebuild to retry indexing later."
- **Impact:** Error-prone manual workflows.
- **Recommendation:** Automate index follow-up after generate-context.js; provide idempotent scaffold command.

#### F9.07 -- Self-healing stops at detection
- **Severity:** MEDIUM
- **File(s):** `mcp_server/lib/storage/index-refresh.ts:189-197; mcp_server/lib/ops/file-watcher.ts:241-243, 379-381`
- **Description:** `index-refresh.ts` detects stale index state but does not trigger repair. `file-watcher.ts` only logs failures with `console.warn`; no escalation, restart, or quarantine.
- **Impact:** Detected problems persist until manual intervention.
- **Recommendation:** Turn `ensureIndexFresh()` into an actual repair scheduler; add watcher failure escalation.

#### F9.08 -- No monitoring/alerting surface
- **Severity:** MEDIUM
- **File(s):** `file-watcher.ts:47-62, index-refresh.ts:66-98`
- **Description:** Watcher/index stats exposed but no runtime consumers found outside tests. No stale-index alarm, queue-depth alarm, repeated-failure threshold, or "watcher unhealthy" state.
- **Impact:** Operational problems not surfaced.
- **Recommendation:** Promote stats into a health endpoint/tool with alert thresholds.

#### F9.09 -- Provider failover effectively disabled on lazy-init path
- **Severity:** HIGH
- **File(s):** `shared/embeddings.ts:326; shared/embeddings/factory.ts:191, 233`
- **Description:** Normal lazy-init path creates provider with `warmup: false`. Cloud-to-`hf-local` fallback only runs in warmup/create branches. Once OpenAI/Voyage initializes successfully, later API outages only retry the same provider.
- **Impact:** No fallback to local embeddings during cloud outages.
- **Recommendation:** Add runtime failover path, not just initialization failover.

#### F9.10 -- Silent provider swap changes dimensions
- **Severity:** HIGH
- **File(s):** `shared/embeddings/factory.ts:191-223, 233-262`
- **Description:** `createEmbeddingsProvider()` silently swaps failed cloud provider for `hf-local` even when embedding dimension changes. Callers receive incompatible vectors.
- **Impact:** Dimension mismatch causing search failures.
- **Recommendation:** Check dimension compatibility before allowing provider swap.

#### F9.11 -- getEmbeddingDimension() hardcodes wrong defaults
- **Severity:** HIGH
- **File(s):** `shared/embeddings.ts:625; providers/openai.ts:19; providers/voyage.ts:19`
- **Description:** Returns `1024` for any Voyage config and `1536` for any OpenAI config before initialization, even though providers define other valid dimensions (e.g., `text-embedding-3-large = 3072`, `voyage-code-2 = 1536`).
- **Impact:** Pre-init schema checks or DB selection using this helper make wrong compatibility decisions.
- **Recommendation:** Look up dimension from model-specific table, not provider-level default.

#### F9.12 -- Custom embedding dimensions accepted but not sent to API
- **Severity:** HIGH
- **File(s):** `shared/embeddings/providers/openai.ts:98, 126; voyage.ts:110, 131`
- **Description:** Constructors honor `options.dim` but request bodies never include a dimensions/output-dimension field. Length check then throws mismatch error.
- **Impact:** Custom dimension configuration silently fails.
- **Recommendation:** Pass dimension parameter to provider API request body.

#### F9.13 -- Mixed-provider dimension resolution
- **Severity:** HIGH
- **File(s):** `vector-index-store.ts:124, 135, 169, 575`
- **Description:** Dimension inferred from whichever API key is present (Voyage checked before OpenAI). Validator exists but `initialize_db()` never calls it before creating/using DB. Provider changes between runs can create dimension mismatch.
- **Impact:** Live DB with wrong vector dimension for active provider.
- **Recommendation:** Validate dimension at DB initialization; reject mismatches.

---

## Convergence Report

| Iteration | Focus | New Findings | newInfoRatio | Cumulative |
|---|---|---|---|---|
| 1 | scripts/core, extractors, memory, utils | 37 | 1.00 | 37 |
| 2 | scripts/lib, shared, evals, spec-folder | 29 | 0.78 | 66 |
| 3 | MCP handlers CRUD/save, search/hooks, cognitive/scoring/session | 24 | 0.65 | 90 |
| 4 | MCP search pipeline, storage/vector, extraction/parsing | 21 | 0.57 | 111 |
| 5 | UX friction, automation, providers/cache/telemetry | 18 | 0.49 | 129 |
| 6 | Search features boosting/filtering/budget, API surface, BM25/FTS/vector | 15 | 0.41 | 144 |
| 7 | Cross-module duplication, SKILL.md alignment, dead code | 16 | 0.43 | 160 |
| 8 | Eval system, learning/errors, shared bugs | 14 | 0.38 | 174 |
| 9 | Config sprawl, test coverage, loaders/types | 10 | 0.27 | 184 |
| 10 | Final sweep, compliance scorecard, security | 8 | 0.22 | 192 |

**Convergence achieved:** 3-iteration rolling average reached 0.29 at iteration 10, with steady decline from 1.00 to 0.22. Each subsequent iteration produced fewer novel findings, confirming diminishing returns.

---

## Statistics

### By Severity (deduplicated findings)

| Severity | Count |
|---|---|
| CRITICAL | 5 |
| HIGH | 48 |
| MEDIUM | 55 |
| LOW | 12 |
| **Total** | **~120** |

### By Category (deduplicated findings)

| Category | Count |
|---|---|
| 1. Data Integrity & Correctness Bugs | 21 |
| 2. Search Pipeline Architecture | 14 |
| 3. Error Handling & Contract Consistency | 12 |
| 4. Security & Path Safety | 8 |
| 5. Performance & Scalability | 8 |
| 6. Code Duplication & Dead Code | 10 |
| 7. Type Safety & Interface Design | 7 |
| 8. Configuration & Standards Alignment | 16 |
| 9. UX & Automation Opportunities | 13 |

### Top 10 Highest-Impact Findings

1. **F2.01** -- Search pipeline V2 wraps legacy V1 (CRITICAL, architecture)
2. **F2.02** -- Stage 3 rerank scores shadowed (CRITICAL, search quality)
3. **F2.03** -- Score normalization inconsistent after fusion (CRITICAL, search quality)
4. **F1.01** -- Premature supersession causes data loss (CRITICAL, data integrity)
5. **F1.02** -- Warning banners break frontmatter (CRITICAL, data integrity)
6. **F3.04** -- Tool definitions vs validator out of sync (HIGH, UX)
7. **F8.02** -- DB path config split-brain (HIGH, reliability)
8. **F4.03** -- Retry worker bypasses path security (MEDIUM, security)
9. **F6.06** -- Quality proxy split-brain implementations (HIGH, eval trustworthiness)
10. **F9.09** -- Provider failover disabled on lazy-init (HIGH, reliability)

### Test Coverage Assessment

- **mcp_server/tests/:** 284 Vitest files, broad coverage but too many shallow contract/existence assertions (589 `toBeDefined()`, 175 `toBeTruthy()`, 90 `not.toThrow()`)
- **scripts/tests/:** 38 Vitest + 24 Node JS + 4 shell + 1 Python, fragmented across runners. `npm test` only runs `*.vitest.ts` -- large portion outside default test path.
- **Key gaps:** scripts/evals (entire layer), scripts/extractors (most adapters), scripts/utils (data-validator, logger, path-utils), mcp_server/hooks, mcp_server/lib/ops, mcp_server/lib/collab
- **Integration test gaps:** No combined session+causal boost test, no channel-enforcement + folder-scoring test, no budget over-reservation test

### Validated Strengths

- TypeScript strict mode enabled with project references across all workspaces
- Module structure (barrel exports, file naming) is consistently high quality
- MCP response envelope factory provides solid top-level contract
- Zod-based schema validation generates actionable error messages
- Recovery hints catalog is broad and generally well-structured
- Ground truth versioned in-repo; eval architecture is well-designed
- SQLite embedding cache properly bounded (10k rows)
- No confirmed published CVEs in pinned dependency versions
- No direct API key exposure; keys masked in provider info
- FTS paths use parameterized queries after sanitization

---

## Expert Review (Ultra-Think Validation)

*Reviewed by GPT-5.4 (copilot, high reasoning) — validated all 51 CRITICAL/HIGH findings against source code.*

### Validation Summary

- **Validated substantially as written:** 41/51 (80%)
- **Validated with severity/scope adjustments:** 8/51 (16%)
- **Questioned/overstated:** 2/51 (4%)

### Top 10 Actionable Improvements

| Rank | Improvement | Impact | Effort | Priority |
|------|-------------|-------:|-------:|---------:|
| 1 | Fix failing feature-flag docs test path | 3 | 1 | **3.00** |
| 2 | Fix CLI help advertising nonexistent commands | 3 | 1 | **3.00** |
| 3 | Derive MCP tool definitions from single source of truth; fix memory_save governance args | 5 | 2 | **2.50** |
| 4 | Preserve frontmatter at byte 0 — insert banners after frontmatter block | 5 | 2 | **2.50** |
| 5 | Make supersede-and-replace atomic: create new row first, supersede old in same transaction | 5 | 2 | **2.50** |
| 6 | Resync/clamp score aliases at Stage 2/3 boundaries so reranking affects final ordering | 5 | 2 | **2.50** |
| 7 | Centralize DB path/env resolution and enforce containment in one shared validator | 5 | 2 | **2.50** |
| 8 | Unify quality-proxy metric into one canonical implementation for eval and telemetry | 4 | 2 | **2.00** |
| 9 | Close fail-open audit/health paths: surface partial failure explicitly | 4 | 2 | **2.00** |
| 10 | Add embedding dimension/runtime failover guardrails at provider and DB init | 5 | 3 | **1.67** |

**Strategic item outside top 10:** F2.01 — Unwrap Stage 1 from legacy mini-pipeline. Impact 5, Effort 5, Priority 1.00. Biggest architecture cleanup but needs bounded design work.

### ADR Conflict Check

**No direct conflicts** between validated findings and accepted ADRs.
- ADR-003 (consolidate duplicates) reinforced by F6.01, F6.06, F8.02
- ADR-002 (transitional wrappers) reinforced by docs drift findings

### Validated Strengths

1. Search pipeline has explicit stage contracts, invariants, and regression tests
2. `scripts/utils/path-utils.ts` contains good canonical containment implementation
3. `lib/eval/eval-quality-proxy.ts` is clean, pure, well-documented — should be canonical version
4. Tool definitions centralized structurally in `tool-schemas.ts` (drift is the problem, not absence)
5. Embeddings factory logs dimension drift loudly during fallback

### Recommended Next Steps

1. **Hardening sprint on items 1-7** — localized, testable, highest-friction fixes
2. **Add regression tests before broader refactors** — frontmatter, atomicity, governance args, reranking, DB paths, CLI help
3. **Separate design track for F2.01 and embedding dimension/failover** — architecture issues needing bounded design
