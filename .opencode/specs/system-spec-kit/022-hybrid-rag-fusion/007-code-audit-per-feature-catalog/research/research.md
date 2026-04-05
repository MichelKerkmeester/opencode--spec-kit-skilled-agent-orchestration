---
title: "Deep Research: Code Audit Gap [system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/research]"
description: "Progressive synthesis of gaps, missed features, inaccuracies, and systemic issues found in the 007-code-audit-per-feature-catalog"
trigger_phrases:
  - "deep"
  - "research"
  - "code"
  - "audit"
  - "gap"
  - "007"
importance_tier: "normal"
contextType: "research"
status: complete
---
# Deep Research: Code Audit Gap Analysis

## 1. Undocumented Features and Modules

### 1.1 MCP Tool Surface -- Fully Cataloged

All 32 registered MCP tools (across layers L1-L7) are documented in the feature catalog. No tool-level gaps exist. [SOURCE: mcp_server/tool-schemas.ts:579-620]

### 1.2 Uncataloged Source Modules

The following source directories/modules have **no catalog entry** in any of the 19 feature categories:

| Module | Files | Severity | Notes |
|--------|-------|----------|-------|
| `api/` (programmatic API) | 6 | HIGH | Complete parallel API surface for JS/TS consumers; not MCP tools but a distinct integration path |
| `formatters/` | 3 | MEDIUM | Search result and token metrics formatting; possibly implicitly covered by UX Hooks |
| `core/` | 3 | MEDIUM | Config management and DB state; foundational infrastructure |
| `utils/` (top-level) | 6 | MEDIUM | Batch processor, DB helpers, validators; batch-processor underpins async ingestion |
| `lib/errors/` | 3 | MEDIUM | Typed error hierarchy with recovery hints; cross-cutting |
| `lib/utils/` | 4 | MEDIUM | Includes path-security.ts (security-relevant path traversal prevention) |
| `configs/cognitive.ts` | 1 | LOW | Cognitive feature configuration |
| `context-server.ts` | 1 | LOW | MCP server entry point/bootstrap |
| `cli.ts` | 1 | LOW | Referenced in catalog 16-07 but source file not mapped |

**Total uncataloged files: ~28**

### 1.3 Significance

The `api/` directory is the most significant gap. It represents a complete programmatic API that external consumers (scripts, other tools) can use without going through MCP. If this API has different behavior or lacks validation compared to the MCP tool layer, it could be a source of bugs or security issues.

The `lib/utils/path-security.ts` module is security-relevant and deserves explicit catalog coverage to ensure path traversal prevention is verified.

## 2. Unaudited Code Paths

### 2.1 Quantitative Summary

A definitive cross-reference of all 286 non-test `.ts` source files against all `.ts` file references in the feature catalog reveals **32 files (11.2%) that are never referenced by any audit phase**.

### 2.2 Severity Breakdown

| Severity | Count | Description |
|----------|-------|-------------|
| CRITICAL | 6 | Active production code in save pipeline, search pipeline, telemetry |
| HIGH | 9 | Active utility/infrastructure code (chunking, metrics, storage) |
| MEDIUM | 8 | api/ layer (6) + barrel index files (2) |
| LOW | 5 | Deprecated dead code (3) + redirect wrappers (2) |
| INFORMATIONAL | 4 | Misplaced test files (2) + misc utilities (2) |

### 2.3 Critical Unreferenced Files

These 6 files are actively used in production pipelines but have zero catalog coverage:

1. **`handlers/save/markdown-evidence-builder.ts`** -- Extracts structured evidence from markdown for sufficiency evaluator
2. **`handlers/save/spec-folder-mutex.ts`** -- Concurrency control preventing TOCTOU races during save
3. **`handlers/save/validation-responses.ts`** -- Constructs rejection/dry-run results from validation outcomes
4. **`handlers/v-rule-bridge.ts`** -- Runtime bridge to memory quality validation scripts
5. **`lib/search/pipeline/stage2b-enrichment.ts`** -- Stage 2b enrichment step (split from stage2-fusion.ts)
6. **`lib/telemetry/eval-channel-tracking.ts`** -- Eval channel attribution and graph walk diagnostics

### 2.4 Deprecated Dead Code (Candidates for Cleanup)

3 files are explicitly marked `@deprecated` with "never wired into production pipeline":
- `lib/manage/pagerank.ts` -- Graph ranking uses typed-weighted degree boost instead
- `lib/search/context-budget.ts` -- Token budget managed by dynamic-token-budget.ts instead
- `shared/ranking/matrix-math.ts` -- Circular island with learned-combiner.ts

### 2.5 Modularization Extraction Gap

Several unreferenced files were extracted from larger files during modularization refactors. The parent files ARE in the catalog, but the extracted children are not:
- `chunk-reassembly.ts` (from memory-search handler)
- `search-utils.ts` (from memory-search handler)
- `deterministic-extractor.ts` (from graph-lifecycle.ts)
- `rank-metrics.ts` (from shadow-scoring.ts)
- `eval-channel-tracking.ts` (from memory-search handler)

This suggests the audit was conducted against a point-in-time snapshot, and subsequent modularization created files the catalog never tracked.

### 2.6 Overlap with Section 1

The 6 `api/` files identified in Section 1 are confirmed as part of the 32 unreferenced files, validating the iteration 1 finding. The iteration 2 analysis refines the total: 32 specific files (vs the earlier ~25-35 estimate).

## 3. Audit Correction Accuracy (PARTIAL Finding Verification)

### 3.1 Methodology

Spot-checked 4 of 41 PARTIAL findings across 3 audit phases (001-retrieval, 011-scoring-and-calibration, 013-memory-quality-and-indexing) by searching the MCP server source tree for the exact file names and function names cited in audit corrections.

### 3.2 Initial Spot-Check Results (Superseded by Section 3.5 Systematic Verification)

> **Note**: The original spot-check (n=4) suggested ~50% error rate. This was superseded by the iteration 9 systematic verification (n=21) in Section 3.5, which found **85.7% accuracy** for file-reference corrections. The spot-check data below is retained for provenance but should not be cited as the current accuracy estimate.

| Phase | Feature | Original Discrepancy | Audit Correction | Verification Result |
|-------|---------|---------------------|------------------|-------------------|
| 011 | F22 | Catalog says `perIntentKSweep` | Corrected to `runJudgedKSweep` | **CORRECT** -- `runJudgedKSweep` exists at `lib/eval/k-value-analysis.ts:670` |
| 011 | F23 | Catalog says `isShadowFusionV2Enabled` in `search-flags.ts` | Corrected to `fusion-lab.ts` | **WRONG** -- `fusion-lab.ts` does not exist as source file. Wave 1 verification confirms: actual function is `isShadowFeedbackEnabled()` in `search-flags.ts:397` |
| 013 | F11 | Catalog says `slugToTitle` in `slug-utils.ts` | Corrected to `title-builder.ts` | **REVISED** -- Wave 1 verification found `slugToTitle` IS in `scripts/core/title-builder.ts:35` (verified). Original audit correction was accurate; initial spot-check searched `lib/` only, missing `scripts/core/` |
| 001 | F8 | `stage4-filter.ts` listed for 3-tier fallback | Corrected description of stage4 function | **CORRECT but INCOMPLETE** -- stage4 also does TRM evidence-gap detection and score immutability enforcement, not mentioned |

### 3.3 Error Pattern: Hallucinated Corrections (Partially Revised)

In the initial spot-check, both 011-F23 and 013-F11 appeared wrong. The audit agent appeared to:
1. Correctly detect a real discrepancy in the catalog
2. Fabricate the "correct" file/function name without verifying it exists
3. Record the fabrication as a finding

However, **Wave 1 systematic verification revised this assessment**: 013-F11 was actually correct -- the initial spot-check failed to search `scripts/core/` (only checked `lib/`). Of the two "wrong" findings, only 011-F23 had a genuine error (citing non-existent `fusion-lab.ts`). This means the audit corrections were MORE accurate than the initial spot-check suggested (1 of 4 wrong, not 2 of 4).

The remaining concern for 011-F23 is real: **the audit correctly identified WHAT was wrong but cited a non-existent source file**. This is consistent with the Section 3.5 finding that function name citations carry higher hallucination risk than file path citations.

### 3.4 MATCH Boundary Reliability

The 001-retrieval implementation-summary notes "15+ source files missing from catalog" for memory_search (F2) yet classifies it as part of the "9 MATCH" count. This suggests the MATCH/PARTIAL boundary was inconsistently applied -- missing source file references is arguably a PARTIAL finding, not a MATCH.

**Wave 1 update**: 001-F02 (memory_search) has been reclassified from MATCH to PARTIAL based on this analysis, confirming the boundary concern was actionable.

### 3.5 Revised Accuracy Estimate (Iteration 9 Systematic Verification)

Iteration 9 systematically verified every file-reference correction across phases 001-005 (8 PARTIAL findings, 21 verifiable correction claims):

| Verification Result | Count | Rate |
|---------------------|-------|------|
| File reference CONFIRMED real | 18 | 85.7% |
| File reference NOT FOUND (possible hallucination) | 2 | 9.5% |
| Function name fabricated | 1 | 4.8% |
| Behavioral claims (unverifiable via static analysis) | 3 | -- |

The two NOT FOUND files are `memory-sufficiency.ts` and `spec-doc-health.ts` (cited in Phase 002 F01). The fabricated function name is `summarizeAliasConflicts` (cited in Phase 003 F03 -- the handler file `memory-index-alias.ts` exists but the function name has no match in source).

**Revision**: The iteration 3 estimate of ~50% error rate was inflated by a small sample (n=4). Wave 1 verification later confirmed that title-builder.ts was real (found at `scripts/core/title-builder.ts:35`), reducing the spot-check errors to 1 of 4 (fusion-lab.ts only). The two error categories remain distinct:
- **Audit descriptions** (in implementation-summary prose): higher hallucination rate (~50% in spot check)
- **PARTIAL correction claims** (specific "file X should be Y" corrections): 85.7% accurate

**Updated recommendation**: The 41 PARTIAL corrections are more reliable than initially assessed. Priority re-verification should focus on phases with the most PARTIAL findings (005-lifecycle: 3, 002-mutation: 2) and on any corrections citing function names rather than file paths.

### 3.6 Estimated Impact

- **41 PARTIAL findings** exist across all 21 phases
- Systematic verification (n=21 claims across 5 phases) shows **85.7% accuracy for file references**
- Remaining risk is concentrated in function name citations and behavioral claims
- **Recommendation**: Prioritize re-verification of PARTIAL corrections that cite function/variable names (higher hallucination risk) over those citing file paths (lower risk)

## 4. Cross-Feature Interaction Blind Spots

### 4.1 Structural Limitation of Per-Category Audit

The audit's 19-category structure is effective for verifying features that map cleanly to one category. However, cross-cutting modules that serve multiple categories represent a structural blind spot: no single category "owns" them, so no single phase verifies their internal behavior comprehensively.

### 4.2 Active Modules With ZERO Feature Catalog Mentions

Four production modules have zero mentions in the feature catalog despite being actively imported by core handlers:

| Module | Size | Active Importers | Affected Features |
|--------|------|-----------------|-------------------|
| `lib/cognitive/attention-decay.ts` | 10KB | fsrs-scheduler, stage2-fusion, memory-triggers, context-server | Retrieval scoring, trigger matching |
| `lib/cognitive/tier-classifier.ts` | 17KB | fsrs-scheduler, archival-manager, memory-search, memory-triggers | Memory importance tiers across all retrieval |
| `lib/cognitive/pressure-monitor.ts` | 2.7KB | memory-context handler | Context retrieval behavior |
| `hooks/mutation-feedback.ts` | 2.3KB | memory-save, memory-crud-update, memory-crud-delete, save/response-builder, save/types, memory-bulk-delete | All mutation operations (6 handlers) |

These modules total ~32KB of unverified production code affecting core features classified as MATCH.

### 4.3 The Hooks Layer as Cross-Cutting Concern

The `hooks/` directory (4 files, ~21KB) sits between handlers and the response pipeline. It is imported by 17 files across the codebase. While the feature catalog mentions "hooks" 35 times, specific hook modules are poorly covered:
- `mutation-feedback.ts`: 0 mentions (affects 6 mutation handlers spanning 2+ audit categories)
- `response-hints.ts`: 1 mention (4KB module)
- `memory-surface.ts`: 0 mentions by filename (13.5KB, the largest hook file)

A behavioral change in any hook file affects multiple audit categories simultaneously, but no category is responsible for verifying the hook layer itself.

### 4.4 Session Manager: 1186-Line Module Spanning Multiple Categories

`lib/session/session-manager.ts` (1186 lines, 26 exported functions) is imported by 4 production files (context-server.ts, core/db-state.ts, handlers/memory-search.ts, lib/utils/logger.ts) and has 7 dedicated test files.

**Iteration 9 deep-dive findings**: Only Phase 008 (bug-fixes-and-data-integrity) references session-manager in the catalog (5 mentions across 4 files). 85% of its functions (22/26) have NO direct catalog audit coverage:

| Function Domain | Functions (count) | Catalog Coverage |
|----------------|-------------------|-----------------|
| Init + schema (3) | init, ensureSchema, getDb | NONE |
| Dedup engine (3) | shouldSendMemory, shouldSendMemoriesBatch, generateMemoryHash | Indirect via 001 |
| Mark/filter (4) | markMemorySent, markMemoriesSentBatch, filterSearchResults, markResultsSent | Indirect via 001 |
| Entry limits (1) | enforceEntryLimit | NONE |
| Cleanup (3) | cleanupExpiredSessions, cleanupStaleSessions, clearSession | NONE |
| Session state (5) | saveSessionState, completeSession, resetInterruptedSessions, recoverState, getInterruptedSessions | NONE |
| Continue-session (2) | generateContinueSessionMd, writeContinueSessionMd | NONE |
| Checkpointing (1) | checkpointSession | Indirect via 005 |
| Config/stats (3) | isEnabled, getConfig, getSessionStats | NONE |
| Shutdown (1) | shutdown | NONE |

Session-manager is a **single-point-of-unverified-behavior**: it controls dedup (directly affects search results), session state (affects resume mode), and cleanup (affects data integrity) -- none verified as primary audit targets. The 3 dedicated test files provide behavioral assurance outside the audit scope, but the audit's "220+ features verified" claim implicitly includes session-dependent features whose session behavior was never directly examined.

### 4.5 Import Frequency and Audit Coverage Correlation

| Import Frequency Tier | Modules | Audit Coverage Quality |
|----------------------|---------|----------------------|
| 100+ (core/, utils/) | 2 | Infrastructure gap (identified iter 1-2) |
| 15-25 (envelope, vector-index, hooks, memory-parser) | 4 | Cataloged but per-consumer only -- no holistic verification |
| 7-12 (cognitive, embeddings, search-flags, history, trigger-matcher, causal-edges) | 6 | Mixed: 3 cognitive modules ZERO coverage |
| 1-6 (individual handlers) | majority | Well-covered by per-category audit |

**Key insight**: The per-category audit's effectiveness is inversely proportional to a module's import frequency. Category-specific code (low imports) is well-verified. Cross-cutting code (high imports) is either unverified or verified only from each consumer's perspective, never holistically.

### 4.6 MATCH Boundary Structural Problem

Features classified MATCH may depend on unverified cross-cutting modules:
- `memory_search` (MATCH in 001-retrieval) imports `tier-classifier.ts` (0 catalog mentions) and `attention-decay.ts` (0 catalog mentions)
- `memory_save` (MATCH in 002-mutation) imports `mutation-feedback.ts` (0 catalog mentions)
- `memory_context` (MATCH in 001-retrieval) imports `pressure-monitor.ts` (0 catalog mentions)

A MATCH at the feature level does not guarantee all underlying code paths were verified. The audit verified documented behavior, not implementation completeness.

## 5. Temporal Gaps

### 5.1 Audit Window and Concurrent Code Churn

The feature catalog audit was completed on 2026-03-22 at 19:08 (commit 4a477420d). The audit window spans from the 022 renumbering (2026-03-16, commit 3cf8b0912) through audit completion -- a 6-day period during which the codebase was under heavy active development.

| Metric | Value |
|--------|-------|
| .ts files modified during audit window | 234 of 286 (82%) |
| Commits touching mcp_server/ | 27 |
| New source files (non-test) added | 27 |
| New test files added | 63 |
| Post-audit drift (files changed after audit) | 0 |

The audit ran concurrently with 4 major implementation waves, a feature flag graduation event, a 10-agent code review, and multiple deep research remediation passes. [SOURCE: git log 3cf8b0912..4a477420d -- mcp_server/]

### 5.2 Uncataloged New Source Files

6 of 27 newly added source files have zero mentions in any feature catalog category:

| File | Module Area | Function |
|------|-------------|----------|
| `lib/feedback/batch-learning.ts` | Feedback | Batch learning feedback loop |
| `lib/search/confidence-scoring.ts` | Search | Search result confidence scoring |
| `lib/search/graph-calibration.ts` | Search/Graph | Graph signal calibration |
| `lib/search/llm-cache.ts` | Search/Query | LLM response caching for reformulation |
| `lib/search/recovery-payload.ts` | Search | Empty result recovery payload construction |
| `lib/search/result-explainability.ts` | Search | Result explainability/provenance traces |

21 of 27 new files DO appear in the catalog, indicating the audit partially incorporated concurrent changes but missed these 6. [SOURCE: grep -rl across 007-code-audit-per-feature-catalog/ for each filename]

### 5.3 Three Layers of Temporal Gap

The temporal gap operates at three distinct levels, each with different remediation requirements:

1. **Uncataloged new files (6 files)**: Created during audit window, never added to catalog, never audited. Remediation: add catalog entries and audit.
2. **Modified existing files (234 files)**: Audited against catalog descriptions that may not reflect post-modification behavior. A MATCH finding may have been accurate at time of verification but invalidated by a subsequent commit within the same audit window. Remediation: re-verify MATCH findings for heavily modified files.
3. **Graduated feature flags**: Commit 09acbe8ce "graduate all Wave 1-4 feature flags to default ON" changed which code paths are active in production. If catalog descriptions were written for experimental behavior, they may be stale for graduated-ON behavior. Remediation: check flag-dependent catalog entries against graduated state.

### 5.4 Significance

The temporal gap is the audit's most fundamental structural limitation. The other gaps (uncataloged infrastructure modules, fabricated corrections, cross-cutting blind spots) are detectable by careful re-examination. But the temporal gap means the audit's MATCH findings have a hidden validity window: they were accurate at time of verification but the underlying code may have changed before the audit completed.

The zero post-audit drift finding is positive: the audit IS current as of HEAD. The risk is entirely within the audit window, not ongoing.

## 6. Feature Flag Graduation Impact

### 6.1 Mass Graduation Event During Audit Window

Commit 09acbe8ce ("graduate all Wave 1-4 feature flags to default ON", Mar 21 22:54) changed 22 feature flags from opt-in (default OFF) to default-ON in a single commit. This landed approximately 20 hours before the final audit commit (Mar 22 19:08), during active audit work. [SOURCE: git log 09acbe8ce]

### 6.2 Behavioral Semantics Reversed

The graduation changed each flag's implementation from explicit opt-in:
```typescript
// Pre-graduation: undefined env var = DISABLED
process.env.SPECKIT_FLAG?.toLowerCase().trim() === 'true'
```
to rollout-policy-mediated opt-out:
```typescript
// Post-graduation: undefined env var = ENABLED (100% rollout default)
isFeatureEnabled('SPECKIT_FLAG')
```

The `isFeatureEnabled()` function (rollout-policy.ts:42-57) treats undefined environment variables as ENABLED when `SPECKIT_ROLLOUT_PERCENT >= 100` (the default). This is a complete inversion of runtime behavior for all 22 graduated features. [SOURCE: lib/cognitive/rollout-policy.ts:42-57]

### 6.3 Flag Inventory by Domain and Audit Phase Impact

| Domain | Graduated Flags | Affected Audit Phases |
|--------|----------------|----------------------|
| D1 (Scoring/Fusion) | CALIBRATED_OVERLAP_BONUS, RRF_K_EXPERIMENTAL, LEARNED_STAGE2_COMBINER | 011, 014, 015 |
| D2 (Query Intelligence) | QUERY_DECOMPOSITION, GRAPH_CONCEPT_ROUTING, LLM_REFORMULATION, HYDE, QUERY_SURROGATES | 012 |
| D3 (Graph Lifecycle) | TYPED_TRAVERSAL, GRAPH_REFRESH_MODE, LLM_GRAPH_BACKFILL, GRAPH_CALIBRATION_PROFILE | 010 |
| D4 (Feedback/Quality) | IMPLICIT_FEEDBACK_LOG, HYBRID_DECAY_POLICY, SAVE_QUALITY_GATE_EXCEPTIONS, BATCH_LEARNED_FEEDBACK, ASSISTIVE_RECONSOLIDATION, SHADOW_FEEDBACK | 008, 009, 013 |
| D5 (UX/Disclosure) | EMPTY_RESULT_RECOVERY_V1, RESULT_CONFIDENCE_V1, RESULT_EXPLAIN_V1, RESPONSE_PROFILE_V1, PROGRESSIVE_DISCLOSURE_V1, SESSION_RETRIEVAL_STATE_V1 | 018 |

### 6.4 Phase 020 Coverage Gap

Phase 020 ("Feature Flag Reference") audited only 7 features (6 MATCH / 1 PARTIAL), but search-flags.ts contains 40+ flag functions. The remaining 33+ flags were audited only as features within their domain phases -- not as flag governance objects. This means:
- Default-vs-JSDoc consistency was NOT systematically verified for all flags
- Env var name alignment across search-flags.ts and consuming modules was NOT verified for all flags
- Post-graduation test updates were verified in the graduation commit itself, but NOT in the audit

### 6.5 Three Flag Categories

| Category | Count | Audit Impact |
|----------|-------|-------------|
| **Graduated during audit** (D1-D5 waves) | 22 | HIGH -- behavioral semantics reversed; phases may have verified wrong code paths |
| **Pre-existing default-ON** (MMR, TRM, etc.) | ~18 | NONE -- already used isFeatureEnabled() before audit |
| **Still opt-in** (RECONSOLIDATION, FILE_WATCHER, RERANKER_LOCAL, QUALITY_LOOP) | 4 | LOW -- these features were OFF during audit and remain OFF; audit verified catalog descriptions only, not runtime behavior |

### 6.6 Moving Baseline Risk

The audit's spec.md explicitly identifies Risk R-003 ("Source code changes during audit") with mitigation "Pin to specific commit SHA." However, the audit used "Current HEAD on main branch at 2026-03-22" rather than a pinned SHA. This means audit phases conducted on different days verified against different code states. Phases run before Mar 21 22:54 saw opt-in flags; phases run after saw default-ON flags. The MATCH/PARTIAL classifications may straddle the graduation boundary without any explicit record of which flag state was active during each phase's verification.

## 7. Test-Catalog Alignment Gap

### 7.1 Scale of the Gap

Of 321 test files in the MCP server test suite, only **9 (2.8%) are referenced anywhere in the committed catalog documentation**. The remaining 312 test files exercise behaviors, edge cases, and subsystems that the catalog never mentions by test file name.

Referenced test files: `graph-signals`, `handler-memory-context`, `handler-memory-health-edge`, `handler-memory-ingest`, `handler-memory-ingest-edge`, `hooks-mutation-wiring`, `hybrid-search-context-headers`, `tool-input-schema`, `transaction-manager-extended`.

[SOURCE: comm -23 of 321 test basenames vs grep-extracted catalog content from git HEAD]

### 7.2 Unreferenced Test Categories

| Category | Count | Significance |
|----------|-------|-------------|
| Scoring/fusion (RSF, RRF, MMR, shadow, five-factor, adaptive) | 31 | Core ranking pipeline -- catalog features verified but test-level behavior unchecked |
| Memory-specific (governance, cascade, lineage, roadmap, state) | 22 | Systemic memory properties not individual features |
| Regression/safety/security | 21 | Production-critical: crash recovery (T009-T016), path traversal (T001-T007), batchSize safety (T105-T106), race conditions (T214), FTS5 sanitization |
| Graph/causal (boost, edges, pagerank, community, density) | 20 | Graph subsystem internals -- catalog covers features but not graph algorithm behaviors |
| Handler (MCP dispatch layer) | 14 | One abstraction layer below catalog scope -- tests how tools route, not what features exist |
| Integration (end-to-end pipelines) | 9 | Cross-category pipeline verification that per-category audit cannot provide |
| Session (lifecycle, cleanup, stress, boost) | 9 | Session management behaviors spanning retrieval + lifecycle categories |
| Query (classifier, decomposer, expander, router, surrogates) | 8 | Query intelligence internals -- catalog Phase 012 covers features but not algorithm details |
| Unit (types, formulas, normalization, security) | 9 | Low-level correctness verification |

### 7.3 Security-Critical Unreferenced Tests

Several unreferenced tests verify production security behaviors with no catalog counterpart:

- **`unit-path-security.vitest.ts`**: Path traversal prevention (T001-T007) -- tests `../../etc/passwd` rejection
- **`bm25-security.vitest.ts`**: FTS5 query sanitization -- tests SQL injection via search queries
- **`safety.vitest.ts`**: Batch size validation (T105-T106) -- prevents resource exhaustion
- **`stdio-logging-safety.vitest.ts`**: stdout/stderr separation for MCP protocol safety
- **`redaction-gate.vitest.ts`**: Content redaction before response

These security behaviors are tested but not documented as features, meaning the audit never verified their catalog descriptions (because no descriptions exist).

### 7.4 Structural Root Cause

The 97.2% test-catalog gap is a structural design consequence, not an oversight:

- **The catalog** was designed as a **feature registry** (documenting "what capabilities exist")
- **The test suite** was designed for **behavioral verification** (testing "what works correctly under what conditions")

These are complementary but different scopes. The audit was scoped to verify catalog features against source code -- it was never designed to verify catalog features against test coverage. This means the audit provides no assurance about:

1. Whether test-verified behaviors match catalog descriptions
2. Whether test-only behaviors represent undocumented production capabilities
3. Whether the test suite is itself complete relative to the catalog

### 7.5 Connection to Cross-Cutting Blind Spots (Section 4)

The 9 integration test files (integration-save-pipeline, integration-search-pipeline, integration-causal-graph, etc.) exercise full pipeline paths that cross catalog category boundaries. This independently confirms the Section 4 finding that per-category audit structure cannot verify cross-cutting behaviors. The test suite fills this gap, but the audit never leveraged it.

## 8. Quantitative Per-Phase Risk Model

### 8.1 Risk Dimensions and Weights

Six measurable dimensions were scored per phase, weighted by impact on audit reliability:

| Dimension | Weight | Source |
|-----------|--------|--------|
| D1: PARTIAL ratio (partial / total findings) | 0.25 | Implementation summaries |
| D2: Feature complexity (feature count / max) | 0.15 | Feature catalog |
| D3: Cross-cutting dependency exposure | 0.20 | Iteration 4 shared module analysis |
| D4: Temporal churn exposure | 0.15 | Iteration 5 git analysis |
| D5: Flag graduation exposure | 0.10 | Iteration 6 flag analysis |
| D6: Test coverage gap (unreferenced tests in domain) | 0.15 | Iteration 7 test analysis |

### 8.2 Top 5 Highest-Risk Phases

| Rank | Phase | Composite | Risk Tier | Primary Risk Drivers |
|------|-------|-----------|-----------|---------------------|
| 1 | **011-scoring-and-calibration** | 0.80 | CRITICAL | Highest feature count (23), all cross-cutting modules, highest test gap (31 scoring tests), flag graduation affected |
| 2 | **014-pipeline-architecture** | 0.78 | CRITICAL | 22 features, 6 of 32 unreferenced files live here, maximum temporal churn, 4 PARTIAL findings |
| 3 | **001-retrieval** | 0.64 | HIGH | Core handlers import all cross-cutting modules, maximum search pipeline churn, 14 handler tests unreferenced |
| 4 | **018-ux-hooks** | 0.62 | HIGH | 19 features, 4 PARTIAL, hooks/ layer (17 importers) unowned, 22 graduated flags affect hook behavior |
| 5 | **013-memory-quality-and-indexing** | 0.58 | HIGH | Highest feature count overall (24), 3 CRITICAL unreferenced save-pipeline files in its domain |

### 8.3 Risk Distribution

| Risk Tier | Count | Phases |
|-----------|-------|--------|
| CRITICAL (>= 0.70) | 2 | 011, 014 |
| HIGH (>= 0.50) | 5 | 001, 012, 013, 015, 018 |
| MEDIUM (>= 0.30) | 7 | 002, 004, 006, 008, 009, 010, 016 |
| LOW (< 0.30) | 7 | 003, 005, 007, 017, 019, 020, 021 |

### 8.4 Risk Concentration Finding

The top 2 CRITICAL phases (011, 014) alone account for:
- 45 of 220 catalog features (20%)
- 10 of the 32 unreferenced source files (31%)
- The entire scoring/fusion and pipeline architecture -- the system's core ranking pathway

A targeted re-audit of just these 2 phases would address roughly 30% of the total identified risk.

### 8.5 Systemic Remediation Recommendations

| ID | Recommendation | Addresses | Priority |
|----|---------------|-----------|----------|
| R1 | Pin audit baseline to a specific commit SHA | D4, D5 | P0 |
| R2 | Add cross-cutting module audit phase (hooks, session-manager, cognitive, search pipeline internals) | D3 | P0 |
| R3 | Re-verify all 41 PARTIAL corrections against actual source code | D1 | P1 |
| R4 | Bridge test-catalog gap for 21 security-critical tests | D6 | P1 |
| R5 | Add 32 unreferenced source files to catalog | D2 | P2 |

## 9. Emerging Research Questions

Based on the synthesis of iterations 1-9, one deeper question remains:

- ~~**Q9 (Audit agent reliability)**~~: **ANSWERED** (Iteration 9). File-reference corrections are 85.7% accurate (18/21 verified). Function name citations are less reliable. The two error categories (description hallucinations vs correction hallucinations) have different accuracy rates.
- ~~**Q10 (Session-manager blind spot)**~~: **ANSWERED** (Iteration 9). 85% of session-manager functions (22/26) have no direct audit coverage. Confirmed as structural blind spot, mitigated by 3 dedicated test files.
- ~~**Q11 (Optimal re-audit planning)**~~: **ANSWERED** (Iteration 10). Minimum re-audit is 27-38 hours across 3 tiers: 2 systemic interventions (pin SHA + cross-cutting audit phase, 9-13 hr), 7 targeted phase re-audits (18-25 hr), and 3 new categories (8-11 hr). All 7 at-risk phases drop below 0.50 composite risk. Research complete -- all 11 questions answered.

## 10. Minimum-Cost Re-Audit Plan

### 10.1 Problem Statement

7 of 21 phases score >= 0.50 composite risk (2 CRITICAL at 0.80/0.78, 5 HIGH at 0.54-0.64). The goal is to bring ALL phases below 0.50 with the fewest interventions.

### 10.2 Systemic Interventions (Apply Once, Benefit All Phases)

| ID | Intervention | Effort | Impact | Phases Affected |
|----|-------------|--------|--------|-----------------|
| **S1** | Pin audit baseline to specific commit SHA | 1 hr | Reduces D4+D5 by 0.10-0.20 per phase | All 21 |
| **S2** | Create cross-cutting module audit phase (hooks, session-manager, cognitive, pipeline internals -- 14 files, ~70KB) | 8-12 hr | Reduces D3 by 0.12-0.18 per HIGH/CRITICAL phase | 6 of 7 at-risk |
| **S3** | Catalog 32 unreferenced source files | 3-4 hr | Closes coverage completeness gap | 011, 014, 013 primarily |

### 10.3 Targeted Phase Re-Audits (Resolve PARTIAL Findings)

| ID | Phase | Current Score | Effort | Post-Intervention Score | Reduction |
|----|-------|--------------|--------|------------------------|-----------|
| **T1** | 011-scoring-and-calibration | 0.80 CRITICAL | 4-5 hr | 0.36 | -0.44 |
| **T2** | 014-pipeline-architecture | 0.78 CRITICAL | 4-5 hr | 0.33 | -0.45 |
| **T3** | 001-retrieval | 0.64 HIGH | 2-3 hr | 0.25 | -0.39 |
| **T4** | 018-ux-hooks | 0.62 HIGH | 2-3 hr | 0.28 | -0.34 |
| **T5** | 013-memory-quality-and-indexing | 0.58 HIGH | 3-4 hr | 0.31 | -0.27 |
| **T6** | 012-query-intelligence | 0.55 HIGH | 1-2 hr | 0.23 | -0.32 |
| **T7** | 015-retrieval-enhancements | 0.54 HIGH | 1-2 hr | 0.22 | -0.32 |

Post-intervention scores assume S1 and S2 are completed first (reducing D3, D4, D5 systemically) and then each targeted re-audit resolves its PARTIAL findings (reducing D1 to ~0.10).

### 10.4 New Audit Categories Recommended

| ID | Category | Scope | Effort | Impact |
|----|----------|-------|--------|--------|
| **N1** | Cross-cutting shared modules | Session-manager (26 fn), hooks/ (4 files), cognitive/ (3 files) | Included in S2 | Closes the structural blind spot that no existing category owns |
| **N2** | Security and safety behaviors | 21 regression/safety/security test-verified behaviors (path traversal, FTS5 sanitization, crash recovery, race conditions) | 3-4 hr | Documents production-critical behaviors that tests verify but catalog ignores |
| **N3** | Programmatic API layer | 6 api/ files providing non-MCP interface | 2-3 hr | Closes the largest single-module documentation gap |

### 10.5 Execution Priority Order

| Priority | Interventions | Cumulative Hours | Achievement |
|----------|--------------|-----------------|-------------|
| **P0** | S1 (pin SHA) + S2 (cross-cutting audit) | 9-13 hr | Systemic risk eliminated; 2 of 7 phases drop below 0.50 |
| **P1** | T1 (scoring) + T2 (pipeline) + T3 (retrieval) | 19-24 hr | Both CRITICAL phases resolved; 5 of 7 below 0.50 |
| **P2** | T4-T7 (hooks, memory, query, enhancements) | 27-35 hr | ALL 7 phases below 0.50 -- target achieved |
| **P3** | S3 + N2 + N3 (completeness) | 36-46 hr | Full coverage: all files cataloged, security documented, API audited |

### 10.6 Total Effort Summary

| Scope Level | Hours | All Below 0.50? | Description |
|-------------|-------|-----------------|-------------|
| Minimum viable (P0) | 9-13 | No (5 still above) | Systemic fixes only |
| Target threshold (P0-P2) | 27-38 | YES | All CRITICAL/HIGH resolved |
| Comprehensive (P0-P3) | 36-50 | YES + new categories | Complete remediation |

### 10.7 Consolidated Core Findings (10-Iteration Summary)

The full deep research across 10 iterations and 11 questions distills to 5 core findings:

1. **Coverage Gaps**: 32/286 source files (11%) unreferenced, 4 active modules with ZERO mentions, session-manager 85% unaudited
2. **Accuracy Concerns**: PARTIAL corrections 85.7% accurate for file references, function names less reliable, MATCH boundary inconsistently applied
3. **Temporal Instability**: 82% of files modified during 6-day audit, 22 flags graduated mid-audit reversing semantics, no pinned SHA
4. **Structural Blind Spots**: Per-category effectiveness inversely proportional to module import frequency; 97.2% of tests unreferenced; 21 security behaviors undocumented
5. **Risk Concentration**: 2 of 21 phases (9.5%) hold 31% of unreferenced files and 20% of features at CRITICAL risk level

---

## Convergence Report

| Metric | Value |
|--------|-------|
| **Stop reason** | all_questions_answered |
| **Total iterations** | 10 |
| **Questions answered** | 11 / 11 (100%) |
| **Remaining questions** | 0 |
| **Convergence threshold** | 0.05 |
| **Final rolling average** | 0.80 |

### Iteration History

| Run | Focus | newInfoRatio |
|-----|-------|-------------|
| 1 | Q1: Undocumented features | 0.90 |
| 2 | Q2: Unaudited code paths | 0.85 |
| 3 | Q3: PARTIAL accuracy verification | 0.80 |
| 4 | Q4: Cross-feature blind spots | 0.85 |
| 5 | Q5: Temporal gaps | 0.85 |
| 6 | Q6: Feature flag graduation | 0.85 |
| 7 | Q7: Undocumented test behaviors | 0.90 |
| 8 | Q8: Per-phase risk model | 0.75 |
| 9 | Q9+Q10: Hallucination verification + session-manager | 0.80 |
| 10 | Q11: Minimum-cost re-audit plan | 0.80 |

**Note**: newInfoRatio remained high throughout (0.75-0.90) because each iteration addressed a distinct question dimension. Convergence was triggered by question exhaustion, not diminishing returns.
