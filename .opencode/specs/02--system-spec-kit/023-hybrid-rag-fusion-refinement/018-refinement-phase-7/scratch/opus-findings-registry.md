# Authoritative Findings Registry

## Generated: 2026-03-02
## Method: Cross-verified via 5 Gemini CLI agents + 3 Opus agents

---

### Summary

- **Total findings: 33** (26 original + 7 additional from deep-review and G5 scan)
- VERIFIED: 16
- RESOLVED: 2
- FALSE_POSITIVE: 1 (retry-manager redundancy)
- CORRECTED: 1 (C138 accusation — see note below)
- DOWNGRADED: 5
- UNVERIFIED: 6
- PROCESS FINDINGS: 2 (synthesis propagation, missing wave4-synthesis)

> **Note (2026-03-02 reconciliation):** This Registry was updated to align with the Master Consolidated Review and Coverage Gaps analysis. Health score updated from 79.25 → 77.4 per O3 coverage analysis. A-IDs aligned with Master document. C138 entry corrected after source verification.

---

### Detailed Registry

| # | ID | Title | Original Severity | Verified Severity | Status | Evidence | Confidence |
|---|-----|-------|:-:|:-:|--------|----------|:-:|
| 1 | P0-1 | Stage 2 signal count wrong in summary_of_existing_features.md | P0 | P0 | VERIFIED | G1 confirmed 12 steps, 9 score-affecting at `stage2-fusion.ts:404`. 3/3 models agree. Canonical: "12 processing steps (9 score-affecting)" | 0.98 |
| 2 | P0-2 | Legacy V1 pipeline described as available (removed Phase 017) | P0 | P0 | VERIFIED | G1 confirmed `postSearchPipeline` has zero implementation remaining. Only a removal comment references it. 3/3 models agree | 0.98 |
| 3 | P0-3 | SPECKIT_PIPELINE_V2 described as active toggle (deprecated, always true) | P0 | P0 | VERIFIED | G1 confirmed `isPipelineV2Enabled()` hardcoded to `return true` at `search-flags.ts:101`. 3/3 models agree | 0.98 |
| 4 | P0-4 | resolveEffectiveScore() not documented | P0 | P0 | VERIFIED | G1 confirmed function exists at `pipeline/types.ts:56` with cascading fallback chain. 3/3 models agree | 0.95 |
| 5 | P1-5 | SPECKIT_ADAPTIVE_FUSION missing from feature flag documentation | P1 | P1 | VERIFIED | G2 confirmed flag at `adaptive-fusion.ts:65,74`. Feature flag `SPECKIT_ADAPTIVE_FUSION` controls rollout but absent from docs. 2/3 models agree | 0.92 |
| 6 | P1-6 | Math.max/min spread patterns (stack overflow >100K) | P1 | P1 | VERIFIED | G2 confirmed in 3 files (`prediction-error-gate.ts:484-485`, `retrieval-telemetry.ts:184`, `reporting-dashboard.ts:303-304`). G4 found 25 active `Math.max(...` / `Math.min(...` matches in codebase. Multi-agent deep review confirmed 6+ production files. Most dangerous latent defect | 0.97 |
| 7 | P1-7 | memory_update embedding text wrong (title-only vs title+content) | P1 | P1 | VERIFIED | G2 confirmed at `memory-crud-update.ts:89-91`: passes `${title}\n\n${contentText}`. Doc says title-only. 3/3 models agree | 0.95 |
| 8 | P1-8 | memory_delete cleanup scope wrong (1 table vs multi) | P1 | P1 | VERIFIED | G2 confirmed at `memory-crud-delete.ts:74,80`: cleans vectorIndex + causalEdges explicitly. Doc understates scope. 3/3 models agree | 0.93 |
| 9 | P1-9 | Five-factor normalization not documented | P1 | P1 | VERIFIED | G2 confirmed at `composite-scoring.ts:544-548`: auto-normalization recalculates weights when sum deviates >0.001 from 1.0. 2/3 models agree | 0.90 |
| 10 | P1-10 | R8 summary channel missing from Stage 1 description | P1 | P1 | VERIFIED | G2 confirmed at `stage1-candidate-gen.ts:507-565`: R8 summary embedding channel present in code, absent from existing_features.md. 3/3 models agree | 0.93 |
| 11 | P1-11 | Mixed import patterns in scripts/ (10 files use relative paths) | P1 | P1 | VERIFIED | 3/3 models found relative `../../mcp_server/` imports bypassing `@spec-kit/` aliases in scripts/. 4 files confirmed need conversion | 0.90 |
| 12 | P1-12 | Missing workspace deps in scripts/package.json | P1 | P1 | RESOLVED | G4 found comments: `// AI-WHY: Fix #12`, `// BUG-012 FIX: Weights read from config`. Codebase search shows 0 matches for `"workspace:` dependencies. Evidence suggests deps may have been resolved or pattern changed. 2/3 models agree on finding but G4 evidence shows resolution work | 0.70 |
| 13 | P1-13 | Hardcoded DB path in cleanup-orphaned-vectors.ts | P1 | P1 | VERIFIED | 3/3 models confirmed hardcoded `path.join(__dirname, '../../../mcp_server/database/...')` pattern in 3+ files | 0.92 |
| 14 | P1-14 | specFolderLocks constant naming (camelCase vs UPPER_SNAKE) | P1 | P1 | DOWNGRADED | G2 confirmed at `memory-save.ts:64`. Meta-review recalibrated: code style issue, not functional defect. P1 maintained per tasks.md but effectively a minor standards violation | 0.88 |
| 15 | P1-15 | memory-indexer.ts import ordering + AI-TRACE tags | P1 | P1 | VERIFIED | Confirmed by wave 3 Gemini review. Import ordering violates convention; task tokens lack `AI-TRACE` prefix | 0.85 |
| 16 | P2-16 | SQL template literals in 5 files | P1 | P2 | DOWNGRADED | Codex deep-dive proved 3/5 are FALSE_POSITIVE (memory-crud-list.ts, mutation-ledger.ts, causal-edges.ts use fixed fragments not user input). Remaining 2 (consumption-logger.ts, prediction-error-gate.ts) are P2 code style. Opus bug hunt independently confirmed "No SQL injection vulnerabilities found". 3/3 models agree on downgrade | 0.96 |
| 17 | P2-17 | Transaction wrappers for 3 handlers | P1 | P2 | DOWNGRADED | Meta-review downgraded: single-process better-sqlite3 eliminates concurrency risk. Self-healing mechanisms (orphan detector, health check, BM25 self-rebuild) cover crash consistency. 3/3 models agree on finding, Opus + meta-review agree on P2 | 0.93 |
| 18 | P2-18 | stage2-fusion.ts internal docblock inconsistency (header=11, docblock=9, code=12) | P2 | P2 | VERIFIED | Meta-review identified: module header lists 11 steps (missing 2a), function docblock lists 9 steps (missing 2a, 8, 9), actual code has 12. Internal documentation drift | 0.95 |
| 19 | P2-19 | spec.md metadata tool count stale (23 vs 25) | P0 | P2 | DOWNGRADED | Codex proved doc table has all 25 tools. Only spec.md metadata line and implementation-summary.md reference stale "23". Gemini's original P0 was overcounted. 2/2 verifying models agree | 0.96 |
| 20 | P2-20 | "89 feature flags" claim unverified | P2 | P2 | UNVERIFIED | Flag audit found 20 flags in search-flags.ts. Total of 89 across all sources (rollout-policy.ts, cognitive/ modules, etc.) was never verified by any model | 0.50 |
| 21 | P2-21 | Duplicate deps in scripts/package.json | P2 | P2 | UNVERIFIED | Raised but not code-verified during this audit cycle. Low risk (harmless duplication) | 0.60 |
| 22 | P2-22 | quality-scorer, topic-extractor could move to shared/ | P2 | P2 | UNVERIFIED | Architecture recommendation. retry-manager redundancy investigation confirmed FALSE_POSITIVE (zero functional overlap). Module move is separate concern | 0.65 |
| 23 | P2-23 | File header format (19/20 files) | P2 | P2 | UNVERIFIED | Systematic divergence from sk-code--opencode standard. Consistent internal convention. 2/2 reviewing models confirm | 0.80 |
| 24 | P2-24 | Narrative comments (19/20 files) | P2 | P2 | UNVERIFIED | Same systematic convention divergence as P2-23. Cosmetic only | 0.80 |
| 25 | P2-25 | isFeatureEnabled() treats "1" as disabled | P2 | P2 | UNVERIFIED | Opus found in rollout-policy.ts. No model checked whether search-flags.ts uses same function or diverges. Potential inconsistency | 0.65 |
| 26 | P2-26 | Co-activation spreading may be missing from new_features.md signal list | P2 | P2 | VERIFIED | Meta-review confirmed: step 2a (co-activation spreading) is the step that causes documentation inconsistency at all three levels (module header, docblock, new_features) | 0.85 |

---

### Additional Findings (from Multi-Agent Deep Review, not in original tasks.md)

| # | ID | Title | Severity | Status | Evidence | Confidence |
|---|-----|-------|:-:|--------|----------|:-:|
| A1 | FP-1 | retry-manager redundancy assertion | P2 | FALSE_POSITIVE | Zero functional overlap: `shared/utils/retry` (generic backoff) vs `mcp_server/lib/providers/retry-manager` (500-line embedding retry queue with DB ops). Investigation would be wasted effort | 0.98 |
| A2 | CORRECTED | C138 accusation by deep-review was wrong | — | CORRECTED | **Original claim debunked:** Deep-review said C138 was "fabricated" by Wave 3 synthesis. Source verification confirmed C138 EXISTS at `z_archive/wave3-gemini-mcp-standards.md:L32` and `z_archive/wave3-synthesis.md:L22`. The deep-review's accusation was itself incorrect. See Contradiction Resolution §6 | 0.97 |
| A3 | NEW-1 | Session-manager transaction gap | HIGH | VERIFIED | G5: `session-manager.ts:429-440` — `enforceEntryLimit` outside `db.transaction()` for `runBatch()`. Real concurrency risk (unlike single-process handler gaps) | 0.85 |
| A4 | NEW-2 | retry-manager TODO (persistent embedding cache) | LOW | VERIFIED | G5: `retry-manager.ts:219` — REQ-S2-001 unimplemented. Retries from scratch under rate-limit starvation | 0.80 |
| A5 | NEW-3 | content-normalizer TODO placeholder | LOW | VERIFIED | G5: `content-normalizer.ts:62` — leftover `<!-- TODO: remove -->` comment | 0.80 |
| A6 | PROC-1 | Synthesis propagation failure | P1 | VERIFIED | 8 corrections from deep-dives never propagated to implementation-summary.md. Anyone reading final deliverables gets stale/incorrect info | 0.95 |
| A7 | PROC-2 | Missing wave4-synthesis.md | P2 | VERIFIED | tasks.md marks Wave 4 synthesis as `[x]` complete but file does not exist. Structural integrity violation | 0.90 |

---

### Contradiction Resolutions

#### 1. Signal Count: "11" vs "12" vs "9"

- **Before:** Opus said 11 (from summary_of_new_features.md text), Gemini said 12 (from code), Codex said "12 stages, 9 score-affecting" (from code review classifying which steps modify scores)
- **After:** Canonical answer is **"12 processing steps (9 score-affecting)"**
- **Evidence:** G1 verified all 12 steps at `stage2-fusion.ts:335-515`. Codex classified each step. Meta-review independently confirmed. 3/3 models agree on 12 total.

#### 2. SQL Template Literals: "P1 security" vs "P2 style" vs "No issues"

- **Before:** Gemini rated 5 files as P1 security risk. Codex proved 3 are false positives. Opus found no SQL injection.
- **After:** 3 files (memory-crud-list.ts, mutation-ledger.ts, causal-edges.ts) = **FALSE_POSITIVE**. 2 files (consumption-logger.ts, prediction-error-gate.ts) = **DOWNGRADED to P2** (code style, no security risk)
- **Evidence:** Codex deep-dive at `deep-dive-codex-verification.md`. All interpolated values come from internal logic, not user input.

#### 3. Tool Count: "23" vs "25"

- **Before:** Gemini said 25 in code but 23 in docs. Codex said 25 in both code and doc table.
- **After:** Code has 25 tools. Documentation table has 25 tools. Only spec.md metadata line says "23" (stale).
- **Evidence:** Codex verified all 25 across L1-L7 tiers in `tool-schemas.ts`. Gemini's "23" came from spec.md metadata.

#### 4. Transaction Boundaries: "P1" vs "P2"

- **Before:** Gemini and Codex rated P1. Opus rated P2.
- **After:** **P2** (downgraded by meta-review)
- **Evidence:** Single-process better-sqlite3 = no concurrency risk. Self-healing mechanisms cover crash consistency. Bulk-delete path already has transactions.

#### 5. retry-manager Redundancy: "Possible redundancy" vs "Zero overlap"

- **Before:** Opus Wave 1 import map flagged possible redundancy between `shared/utils/retry` and `mcp_server/lib/providers/retry-manager`
- **After:** **FALSE_POSITIVE** -- zero functional overlap confirmed
- **Evidence:** Multi-agent deep review verified: shared/ exports generic backoff utilities; mcp_server/ exports 500-line embedding retry queue with DB ops and background jobs. Completely different modules.

#### 6. C138 Token: "Fabricated by synthesis" vs "Actually exists in source"

- **Before:** Deep-review (`most-recent-multi-agent-deep-review.md`) claimed C138 was fabricated by Wave 3 synthesis
- **After:** **C138 EXISTS** at `z_archive/wave3-gemini-mcp-standards.md:L32`. The deep-review's accusation was itself incorrect.
- **Evidence:** Source verification: `wave3-gemini-mcp-standards.md:L32` contains "Files use requirement/task tokens like `T005`, `C138`, `R10`, `P1-015` without mandatory `AI-TRACE` prefix". G3 Gemini consistency audit independently confirmed. The deep-review introduced the same class of error it was auditing for.

---

### Cross-Model Agreement

**Full Agreement (3/3 models confirm same status) -- 10 findings:**
- P0-1: Stage 2 signal count (Gemini found, Codex confirmed, Opus confirmed)
- P0-2: Legacy V1 pipeline (all three found removal evidence)
- P0-3: SPECKIT_PIPELINE_V2 deprecated (all three confirm always-true)
- P0-4: resolveEffectiveScore undocumented (all three confirm existence)
- P1-7: memory_update embedding (all three confirm title+content)
- P1-8: memory_delete cleanup scope (all three confirm multi-table)
- P1-10: R8 summary channel (all three confirm presence in code)
- P1-11: Mixed import patterns (all three found relative path violations)
- P1-13: Hardcoded DB path (all three independently confirmed)
- P2-16: SQL template literals downgrade (Codex corrected, Opus confirmed safe, meta-review agreed)

**Strong Agreement (2/3 models confirm) -- 5 findings:**
- P1-5: SPECKIT_ADAPTIVE_FUSION (Gemini found, Codex confirmed)
- P1-9: Five-factor normalization (Gemini found, Codex confirmed)
- P2-19: Tool count stale metadata (Gemini found, Codex corrected)
- P2-23: File header format (Gemini + Codex reviewed)
- P2-24: Narrative comments (Gemini + Codex reviewed)

**Single-Model Findings -- 3 findings:**
- P2-20: 89 flags unverified (raised in meta-review only)
- P2-25: isFeatureEnabled "1" behavior (Opus only)
- FP-1: retry-manager redundancy (multi-agent deep review)

**Corrected (cross-verified) -- 1 finding:**
- C138: Deep-review accused synthesis of fabrication, but Gemini G3 + source verification confirmed C138 exists (2/3 sources agree C138 is real)

---

### Architecture Health Score (updated per O3 Coverage Gaps analysis)

| Dimension | Score | Weight | Weighted | Notes |
|-----------|:-----:|:------:|:--------:|-------|
| Functional Correctness | 94/100 | 30% | 28.2 | Adjusted -1: NEW-1 session tx gap is real concurrency risk |
| Code Safety | 83/100 | 20% | 16.6 | Adjusted -2: Math.max expanded from 6 to 8 files |
| Documentation Accuracy | 52/100 | 15% | 7.8 | Adjusted -3: propagation failures worse than initially assessed |
| Architecture Cleanliness | 78/100 | 15% | 11.7 | Adjusted -2: scripts coupling clearer after G5 scan |
| Code Standards Compliance | 58/100 | 10% | 5.8 | Adjusted -2: G5 found additional TODO/comment issues |
| Maintainability | 73/100 | 10% | 7.3 | Adjusted -2: documentation drift worse for onboarding |
| **TOTAL** | | **100%** | **77.4** | Delta from original: -1.85 pts |

> **Score revision note:** Original score was 79.25 based on pre-G5 analysis. Updated to 77.4 after Coverage Gaps agent (O3) integrated NEW-1 session transaction gap and expanded Math.max spread count. See `opus-coverage-gaps.md` Part 4 for full breakdown.
