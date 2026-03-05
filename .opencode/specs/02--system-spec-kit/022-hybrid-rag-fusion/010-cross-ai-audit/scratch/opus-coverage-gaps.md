# Coverage Gap Analysis & Tiered Action Plan
## Generated: 2026-03-02
## Author: Claude Opus 4.6 (coverage-gap agent)

**Inputs synthesized:**
- Multi-agent deep review (11 agents: 5 Opus, 3 Sonnet, 3 Haiku)
- Ultra-think meta-review (Opus @ultra-think)
- Gemini G5 coverage gap scan (automated pattern matching)
- Live codebase directory enumeration (23 lib/ subdirectories, 50,060 LOC in lib/ + 9,911 LOC in handlers/)

---

### Part 1: Coverage Heatmap

Total `mcp_server/lib/` surface: **23 subdirectories, ~50,060 LOC**
Total `mcp_server/handlers/` surface: **22 files, ~9,911 LOC**

| Area | Files | LOC | Coverage Level | Waves/Scans | Notes |
|------|:-----:|----:|:-------------:|-------------|-------|
| `search/` | 49 | 19,592 | **DEEP** | W1, W2, W4 + Codex DD + Opus DD | Most thoroughly reviewed. Math.max spread found in rsf-fusion, causal-boost, evidence-gap-detector. Safe reduce pattern already exists in intent-classifier and rrf-fusion. |
| `scoring/` | 7 | 1,923 | **DEEP** | W2 + Codex DD | Stage 2 fusion pipeline fully mapped (12 steps, 9 score-affecting). Internal docblock drift found. |
| `handlers/` | 22 | 9,911 | **MODERATE** | W2, W4 + Codex DD | Transaction boundary gaps found in 3 handlers (single-delete, update, bulk-delete ledger). CRUD operations reviewed for SQL safety. |
| `cognitive/` | 10 | 3,795 | **LIGHT** | W1 (arch only) + G5 scan | G5 confirmed `Math.min/max(...spread)` in `prediction-error-gate.ts`. Co-activation flag (SPECKIT_COACTIVATION) missed by flag audit. No logic review performed. |
| `telemetry/` | 4 | 1,132 | **LIGHT** | W1 (arch only) + G5 scan | G5 confirmed `Math.max(...spread)` in `retrieval-telemetry.ts`. Pattern match only; no logic review. |
| `eval/` | 15 | 7,051 | **LIGHT** | W1 (arch only) + G5 scan | G5 confirmed `Math.max/min(...spread)` in `reporting-dashboard.ts`. 15 files (14% of lib/ LOC) with only automated scan coverage. |
| `providers/` | 2 | 517 | **LIGHT** | G5 scan only | G5 found TODO at `retry-manager.ts:219` (unimplemented persistent embedding cache REQ-S2-001). No wave coverage. |
| `session/` | 1 | 1,123 | **LIGHT** | G5 scan only | **NEW HIGH finding:** G5 found transaction gap at `session-manager.ts:429-440` (enforceEntryLimit outside db.transaction). No wave coverage. |
| `parsing/` | 4 | 1,909 | **LIGHT** | G5 scan only | G5 found TODO placeholder at `content-normalizer.ts:62`. No wave coverage. |
| `storage/` | 12 | 4,831 | **SCAN** | G5 scan only | G5 confirmed clean (no Math spread, TODO, FIXME, HACK). Recommended for future transaction boundary audit. **Largest unreviewed area by LOC.** |
| `cache/` | 3 | 649 | **SCAN** | G5 scan only | G5 confirmed clean. Cache invalidation correctness not verified. |
| `errors/` | 3 | 1,135 | **SCAN** | G5 scan only | G5 confirmed clean. Error handling / circuit breaker analysis never performed. |
| `graph/` | 2 | 892 | **SCAN** | G5 scan only | G5 confirmed clean. Recommended for transaction boundary audit (DB-heavy). |
| `learning/` | 2 | 827 | **SCAN** | G5 scan only | G5 confirmed clean. Recommended for transaction boundary audit (DB-heavy). |
| `extraction/` | 4 | 745 | **SCAN** | G5 scan only | G5 confirmed clean. |
| `config/` | 2 | 726 | **SCAN** | G5 scan only | G5 confirmed clean. |
| `utils/` | 5 | 532 | **SCAN** | G5 scan only | G5 confirmed clean. |
| `validation/` | 2 | 1,427 | **SCAN** | G5 scan only | G5 confirmed clean. |
| `chunking/` | 2 | 400 | **SCAN** | G5 scan only | G5 confirmed clean. |
| `architecture/` | 1 | 231 | **SCAN** | G5 scan only | G5 confirmed clean. |
| `response/` | 1 | 230 | **SCAN** | G5 scan only | G5 confirmed clean. |
| `contracts/` | 1 | 197 | **SCAN** | G5 scan only | G5 confirmed clean. |
| `manage/` | 1 | 142 | **SCAN** | G5 scan only | G5 confirmed clean. |
| `interfaces/` | 1 | 48 | **SCAN** | G5 scan only | G5 confirmed clean. Type definitions only. |

#### Coverage Summary

| Level | Directories | Files | LOC | % of lib/ LOC |
|-------|:-----------:|:-----:|----:|:-------------:|
| **DEEP** | 2 | 56 | 21,515 | 43.0% |
| **MODERATE** | 1 (handlers) | 22 | 9,911 | (separate) |
| **LIGHT** | 6 | 36 | 15,527 | 31.0% |
| **SCAN** | 15 | 40 | 13,018 | 26.0% |
| **NONE** | 0 | 0 | 0 | 0% |
| **Total** | 23 (+handlers) | 154 (+22) | 50,060 (+9,911) | 100% |

**Key insight:** Only 43% of lib/ LOC received deep multi-wave review. 26% received only automated pattern scanning with no logic review whatsoever. The largest scan-only area is `storage/` (4,831 LOC) followed by `validation/` (1,427 LOC) and `errors/` (1,135 LOC).

---

### Part 2: New Findings from G5

| ID | File | Line | Pattern | Severity | Description | Cross-Verified? |
|----|------|:----:|---------|:--------:|-------------|:---------------:|
| NEW-1 | `session/session-manager.ts` | 429-440 | Transaction Gap | **HIGH** | `enforceEntryLimit` executes outside `db.transaction()` wrapper for `runBatch()`. Concurrent insertion batches can race past maximum limits, creating momentary invalid state. Unlike the single-process better-sqlite3 mitigation for handlers/ transaction gaps, session batch operations may be triggered by multiple concurrent MCP requests. | G5 only (single model) |
| NEW-2 | `providers/retry-manager.ts` | 219 | TODO | LOW | Unimplemented persistent embedding cache requirement (REQ-S2-001). Currently only in-memory. Under rate-limit starvation, embeddings are retried from scratch rather than served from cache. | G5 only (single model) |
| NEW-3 | `parsing/content-normalizer.ts` | 62 | TODO | LOW | Leftover `<!-- TODO: remove -->` placeholder comment. No functional impact; code hygiene only. | G5 only (single model) |
| NEW-4 | `cognitive/prediction-error-gate.ts` | 484-485 | Math.max spread | **P1** | Additional Math.max/min(...spread) instance in uncovered area. Same stack overflow risk as the 6 files already identified. | G5 + multi-agent (confirmed) |
| NEW-5 | `telemetry/retrieval-telemetry.ts` | 184 | Math.max spread | **P1** | Already known from multi-agent review. G5 independently confirmed in uncovered telemetry area. | G5 + multi-agent (confirmed) |
| NEW-6 | `eval/reporting-dashboard.ts` | 303-304 | Math.max spread | **P1** | Already known from multi-agent review. G5 independently confirmed in uncovered eval area. | G5 + multi-agent (confirmed) |

#### G5 Recommendations (from scan)

1. **Transaction Boundary Review** across all DB-heavy subdirectories (`storage/`, `extraction/`, `graph/`, `learning/`) -- the pattern of executing side-effects outside `.transaction()` wrappers may be repeated beyond `session-manager.ts` and the 3 known handler gaps.
2. **Persistent Embedding Cache** (REQ-S2-001) should be evaluated before production load increases rate-limit pressure.

---

### Part 3: Tiered Action Plan

#### Tier 1: Immediate (This Session / Next Spec) -- Critical Path

| ID | Description | Severity | Files Affected | Est. Effort |
|----|-------------|:--------:|----------------|:-----------:|
| T1-1 | **Fix summary_of_existing_features.md** -- Apply 4 P0 corrections: (a) signal count 11->12 stages/9 score-affecting, (b) remove V1 pipeline references, (c) mark PIPELINE_V2 as deprecated not active, (d) add resolveEffectiveScore() to pipeline section | P0 | `summary_of_existing_features.md` | 1.5h |
| T1-2 | **Fix summary_of_existing_features.md** -- Apply 5 P1 corrections: memory_update embedding scope, memory_delete cleanup scope, five-factor normalization docs, R8 summary channel in Stage 1, SPECKIT_ADAPTIVE_FUSION flag | P1 | `summary_of_existing_features.md` | 1.0h |
| T1-3 | **Fix summary_of_existing_features.md** -- Apply 4 P2 corrections: quality gate persistence, canonical ID dedup, memory_save summary gen, bulk_delete cleanup scope | P2 | `summary_of_existing_features.md` | 0.5h |
| T1-4 | **Fix Math.max/min spread patterns** -- Replace `Math.max(...arr)` with `arr.reduce((a, b) => Math.max(a, b), -Infinity)` in all 8 confirmed locations | P1 | `rsf-fusion.ts` (L101-104, L210-211), `causal-boost.ts` (L227), `evidence-gap-detector.ts` (L157), `prediction-error-gate.ts` (L484-485), `retrieval-telemetry.ts` (L184), `reporting-dashboard.ts` (L303-304) | 1.0h |
| T1-5 | **Fix session-manager.ts transaction gap** -- Move `enforceEntryLimit` inside `db.transaction()` for `runBatch()` | P1 (NEW-1) | `session/session-manager.ts` (L429-440) | 0.5h |
| T1-6 | **Fix implementation-summary.md** -- Incorporate Codex corrections: tool count 23->25, downgrade 3/5 SQL from P1->P2, resolve signal count to "12 stages, 9 score-affecting" | P1 | `implementation-summary.md` | 0.5h |
| T1-7 | **Fix stage2-fusion.ts internal docs** -- Update module header (L20-31) and function docblock (L462-470) to list all 12 processing steps | P2 | `search/stage2-fusion.ts` | 0.25h |

**Tier 1 Total: ~5.25 hours**

---

#### Tier 2: Near-Term (Within 2 Specs)

| ID | Description | Severity | Files Affected | Est. Effort |
|----|-------------|:--------:|----------------|:-----------:|
| T2-1 | **Standardize scripts/ imports** -- Convert 4+ files from relative `../../mcp_server/` paths to `@spec-kit/mcp-server/*` alias | P1 | 4 files in `scripts/` | 1.0h |
| T2-2 | **Add workspace deps** -- Add `@spec-kit/shared` and `@spec-kit/mcp-server` to `scripts/package.json` | P1 | `scripts/package.json` | 0.5h |
| T2-3 | **Extract DB_PATH constant** -- Move hardcoded DB path to `shared/config.ts`, update 4+ consumer files | P1 | `shared/config.ts` + 4 consumer files | 0.5h |
| T2-4 | **Fix AI-TRACE compliance** -- Add required trace tags to non-compliant files | P1 | 3+ files (specific list TBD via codemod) | 0.5h |
| T2-5 | **Add transaction wrappers** -- Wrap `handleMemoryUpdate` (steps 3-5) and single-delete path in transactions | P2 | `memory-crud-update.ts`, `memory-crud-delete.ts` | 0.5h |
| T2-6 | **Fix BM25 trigger phrase re-index condition** -- Expand gate from title-only to title OR triggerPhrases | P2 | `memory-crud-update.ts` (L134) | 0.25h |
| T2-7 | **Investigate dual dist paths** -- Verify `../../mcp_server/dist` vs `../../../mcp_server/dist` in `reindex-embeddings.ts` (one must be wrong) | P1 | `reindex-embeddings.ts` (L45-46) | 0.25h |
| T2-8 | **Resolve better-sqlite3 dependency tension** -- Codex says remove from scripts/package.json; Opus says needed for folder-detector.ts:942. Investigate and resolve. | P1 | `scripts/package.json`, `folder-detector.ts` | 0.5h |
| T2-9 | **Fix P1 code standards** -- specFolderLocks naming, import ordering violations | P1 | 3 specific files | 0.5h |
| T2-10 | **Create wave4-synthesis.md** or correct tasks.md checkbox (marked complete but file missing) | P2 | `scratch/wave4-synthesis.md` or `tasks.md` | 0.25h |
| T2-11 | **Annotate C138 deep-review error** — deep-review falsely accused synthesis of fabricating C138. C138 exists at `z_archive/wave3-gemini-mcp-standards.md:L32`. Add correction note to deep-review. | P2 | `z_archive/multi-agent-deep-review.md` | 0.1h |

**Tier 2 Total: ~4.85 hours**

---

#### Tier 3: Future (Dedicated Spec)

| ID | Description | Severity | Files Affected | Est. Effort |
|----|-------------|:--------:|----------------|:-----------:|
| T3-1 | **Code standards alignment pass** -- Convert 19 files from `// -------` headers to `// ---` box-drawing, narrative comments to AI-intent prefixes | P2 | 19 files across `mcp_server/` | 2.5h |
| T3-2 | **Transaction boundary audit** -- Specialized review of `storage/`, `extraction/`, `graph/`, `learning/` for side-effects outside `.transaction()` wrappers (G5 recommendation) | P2 | 12+ files across 4 subdirectories | 2.0h |
| T3-3 | **Deep review of eval/** -- 15 files (7,051 LOC, 14% of lib/) with only G5 scan coverage. Includes ablation framework, shadow scoring, BM25 baseline. | P2 | 15 files in `eval/` | 3.0h |
| T3-4 | **Deep review of cognitive/** -- 10 files (3,795 LOC) with only light coverage. Includes working memory, archival manager, prediction error gate. | P2 | 10 files in `cognitive/` | 2.0h |
| T3-5 | **Deep review of storage/** -- 12 files (4,831 LOC). Largest fully unreviewed directory. | P2 | 12 files in `storage/` | 2.0h |
| T3-6 | **Verify "89 feature flags" claim** -- Audit all flag sources beyond `search-flags.ts` (20 flags found; 69 unaccounted for) | P2 | Multiple files (rollout-policy.ts, cognitive/ modules, etc.) | 1.0h |
| T3-7 | **Fix stemmer double-consonant dedup** -- Make dedup conditional on suffix removal in BM25 stemmer | P3 | `search/bm25-index.ts` (L84-88) | 0.5h |
| T3-8 | **Evaluate persistent embedding cache** -- REQ-S2-001 TODO at `retry-manager.ts:219`. Assess priority before production load growth. | P2 | `providers/retry-manager.ts` | 1.0h |
| T3-9 | **Remove content-normalizer.ts TODO** -- Clean up placeholder comment | P3 | `parsing/content-normalizer.ts` (L62) | 0.1h |
| T3-10 | **Update spec.md metadata** -- Tool count from 23 to 25 | P2 | `spec.md` | 0.1h |
| T3-11 | **Remove duplicate deps** from scripts/package.json (better-sqlite3, sqlite-vec if confirmed redundant post T2-8) | P2 | `scripts/package.json` | 0.25h |
| T3-12 | **Add Phase D reindex entry point recommendation** -- Export dedicated `reindex()` from mcp_server to replace 7-typeof-import bootstrap | P2 | `mcp_server/index.ts`, `reindex-embeddings.ts` | 1.0h |
| T3-13 | **Check isFeatureEnabled() divergence** -- Verify whether `rollout-policy.ts` and `search-flags.ts` share the same implementation | P2 | `rollout-policy.ts`, `search-flags.ts` | 0.25h |
| T3-14 | **Verify remaining 25 Phase 017 fixes** -- Only 10/35 were sampled. 25 remain unverified. | P2 | Multiple files | 2.0h |
| T3-15 | **Error handling / circuit breaker analysis** -- No cascading failure analysis performed across the codebase | P2 | `errors/`, plus error boundaries throughout | 2.0h |

**Tier 3 Total: ~19.7 hours**

---

#### Effort Summary

| Tier | Items | Total Effort | Priority Window |
|------|:-----:|:------------:|-----------------|
| **Tier 1: Immediate** | 7 | **~5.25 hours** | This session / next spec |
| **Tier 2: Near-Term** | 11 | **~4.85 hours** | Within 2 specs |
| **Tier 3: Future** | 15 | **~19.7 hours** | Dedicated spec(s) |
| **Grand Total** | **33** | **~29.8 hours** | |

---

### Part 4: Audit Completeness

#### LOC Coverage

| Metric | Value | Notes |
|--------|:-----:|-------|
| **Total mcp_server/lib/ LOC** | 50,060 | 23 subdirectories, 154 .ts files |
| **Total mcp_server/handlers/ LOC** | 9,911 | 22 .ts files |
| **DEEP reviewed LOC** | ~21,515 | search/ + scoring/ (43% of lib/) |
| **MODERATE reviewed LOC** | ~9,911 | handlers/ only |
| **LIGHT reviewed LOC** | ~15,527 | 6 dirs with G5 findings or wave mentions (31%) |
| **SCAN-only LOC** | ~13,018 | 15 dirs with pattern scan only (26%) |
| **Effective LOC coverage** | **~52%** | DEEP + MODERATE as % of total (lib/ + handlers/) |
| **Pattern scan coverage** | **100%** | G5 scanned all subdirectories for Math spread + TODO/FIXME/HACK |

#### Cross-Verification Rate

| Metric | Value | Notes |
|--------|:-----:|-------|
| **Findings confirmed by 2+ models** | 18/29 | 62% of actionable findings |
| **Findings from single model only** | 11/29 | 38% -- includes all G5-only findings and some Opus-only discoveries |
| **Contradictions resolved** | 5/5 | 100% -- all cross-model disagreements have clear verdicts |
| **False positives caught** | 4 | 3 SQL template literals (Gemini overcalled) + 1 retry-manager "redundancy" |

#### Biggest Blind Spots

| Rank | Area | LOC | Risk | Rationale |
|:----:|------|----:|------|-----------|
| 1 | **eval/** | 7,051 | MEDIUM | 14% of lib/ LOC. Contains ablation framework, shadow scoring, BM25 baseline. Only G5 pattern scan. Complex testing/evaluation logic that could contain subtle correctness bugs. |
| 2 | **storage/** | 4,831 | MEDIUM | 10% of lib/ LOC. Database operations, migration logic. G5 recommended for transaction boundary audit. Largest single unreviewed directory. |
| 3 | **cognitive/** | 3,795 | MEDIUM | 8% of lib/ LOC. Working memory, prediction error gate, archival manager. Only light architecture-level mentions in Wave 1 + G5 Math spread finding. Complex stateful logic. |
| 4 | **parsing/** | 1,909 | LOW | Content normalization, markdown processing. Only G5 scan (found 1 TODO). Lower risk -- primarily text processing. |

#### Architecture Health Score

| Dimension | Score | Weight | Weighted | Notes |
|-----------|:-----:|:------:|:--------:|-------|
| **Functional Correctness** | 94/100 | 30% | 28.2 | Zero critical bugs across 3 AI models + G5 scan. Math.max spread is latent (-3). NEW-1 session transaction gap is a real concurrency risk (-3). |
| **Code Safety** | 83/100 | 20% | 16.6 | SQL parameterization excellent throughout. 8 files with spread-based stack overflow risk (-8). 4 handlers/session missing transaction wrappers (-6). isFeatureEnabled "1" quirk (-3). |
| **Documentation Accuracy** | 52/100 | 15% | 7.8 | summary_of_new_features.md perfect (15/15). summary_of_existing_features.md has 13 findings (4 P0). implementation-summary.md has propagation failures. spec.md metadata stale. Internal source docs drift in stage2-fusion.ts. |
| **Architecture Cleanliness** | 78/100 | 15% | 11.7 | Three-package monorepo correctly structured. No circular deps. 10 scripts/ files bypass shared/ to reach mcp_server internals (-12). Missing reindex entry point API surface (-5). Duplicate deps (-3). |
| **Code Standards Compliance** | 58/100 | 10% | 5.8 | 19/20 files fail sk-code--opencode compliance (consistent internal convention, divergent from stated standard). 3 P1 violations. AI-TRACE non-compliance. |
| **Maintainability** | 73/100 | 10% | 7.3 | AI-WHY comments provide excellent rationale. Phase 017 fixes well-documented. Documentation drift means new developers get incorrect info (-15). scripts/mcp_server coupling fragility (-12). |
| **TOTAL** | | **100%** | **77.4** | |

**Delta from ultra-think score:** -1.85 points (ultra-think: 79.25, this analysis: 77.4). Reduction driven by NEW-1 session transaction gap (true concurrency risk unlike single-process handler gaps) and expanding the Math.max spread count from 6 to 8 files after G5 confirmation.

---

### Appendix: Finding Registry (Master ID Map)

For cross-referencing between documents, all findings from all sources:

| Master ID | Source | Original ID | Severity | Status |
|-----------|--------|-------------|:--------:|--------|
| F-01 | Multi-agent | P0-1 | P0 | Tier 1 (T1-1) |
| F-02 | Multi-agent | P0-2 | P0 | Tier 1 (T1-1) |
| F-03 | Multi-agent | P0-3 | P0 | Tier 1 (T1-1) |
| F-04 | Multi-agent | P0-4 | P0 | Tier 1 (T1-1) |
| F-05 | Multi-agent + G5 | Math.max spread | P1 | Tier 1 (T1-4) -- 8 files |
| F-06 | G5 | NEW-1 | P1 | Tier 1 (T1-5) -- session tx gap |
| F-07 | Multi-agent | Synthesis propagation | P1 | Tier 1 (T1-6) |
| F-08 | Multi-agent | memory_update embed docs | P1 | Tier 1 (T1-2) |
| F-09 | Multi-agent | memory_delete scope docs | P1 | Tier 1 (T1-2) |
| F-10 | Multi-agent | Five-factor normalization docs | P1 | Tier 1 (T1-2) |
| F-11 | Multi-agent | R8 channel docs | P1 | Tier 1 (T1-2) |
| F-12 | Multi-agent | SPECKIT_ADAPTIVE_FUSION | P1 | Tier 1 (T1-2) |
| F-13 | Multi-agent | Import standardization | P1 | Tier 2 (T2-1) |
| F-14 | Multi-agent | Workspace deps | P1 | Tier 2 (T2-2) |
| F-15 | Multi-agent | Hardcoded DB path | P1 | Tier 2 (T2-3) |
| F-16 | Multi-agent | Dual dist paths | P1 | Tier 2 (T2-7) |
| F-17 | Multi-agent | AI-TRACE compliance | P1 | Tier 2 (T2-4) |
| F-18 | Multi-agent | better-sqlite3 tension | P1 | Tier 2 (T2-8) |
| F-19 | Multi-agent | P1 code standards (3 files) | P1 | Tier 2 (T2-9) |
| F-20 | Multi-agent | Stage 2 docblock drift | P2 | Tier 1 (T1-7) |
| F-21 | Multi-agent | Transaction wrappers (3 handlers) | P2 | Tier 2 (T2-5) |
| F-22 | Multi-agent | BM25 trigger phrase gate | P2 | Tier 2 (T2-6) |
| F-23 | Multi-agent | Code standards (19/20 files) | P2 | Tier 3 (T3-1) |
| F-24 | Multi-agent | spec.md tool count 23->25 | P2 | Tier 3 (T3-10) |
| F-25 | Multi-agent | 89 flags unverified | P2 | Tier 3 (T3-6) |
| F-26 | Multi-agent | isFeatureEnabled "1" | P2 | Tier 3 (T3-13) |
| F-27 | G5 | NEW-2 retry-manager TODO | LOW | Tier 3 (T3-8) |
| F-28 | G5 | NEW-3 content-normalizer TODO | LOW | Tier 3 (T3-9) |
| F-29 | Multi-agent | Stemmer dedup | P3 | Tier 3 (T3-7) |
| F-30 | Multi-agent | Missing wave4-synthesis.md | P2 | Tier 2 (T2-10) |
| F-31 | Multi-agent | C138 deep-review false accusation (C138 exists in source) | P2 | Tier 2 (T2-11) |
| F-32 | Multi-agent | Phase D reindex entry point | P2 | Tier 3 (T3-12) |
| F-33 | Ultra-think | Self-contradiction in impl-summary (11 vs 12) | P1 | Tier 1 (T1-6) |

**Total unique findings: 33** (4 P0, 15 P1, 11 P2, 3 LOW/P3)
