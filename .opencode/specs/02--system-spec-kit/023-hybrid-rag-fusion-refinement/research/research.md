# Deep Research: Spec Kit Memory Feature Audit & Quality Verification

> **20 iterations | 19 research + 1 synthesis | All 10 key questions answered | 0 critical bugs | 14 actionable items**

---

## Executive Summary

This research audited the entire Spec Kit Memory system -- feature flags, search quality, fusion pipeline, UX automation, and cross-cutting infrastructure -- across specs 009 (reindex validator), 010 (retrieval quality), and 011 (indexing and adaptive fusion). The investigation spanned 20 iterations with progressive convergence from newInfoRatio 1.0 to 0.21.

**Key findings:**

1. **Feature completeness is high.** 50 of 56 features are enabled by default. Of the 6 opt-in features, 2 should be promoted to default-ON (RECONSOLIDATION, QUALITY_LOOP), 3 are correctly opt-in due to external dependencies, and 1 is dead code (NOVELTY_BOOST).

2. **No critical bugs exist.** The 4-stage fusion pipeline has comprehensive error handling: 5-tier graceful fallback, 25+ per-channel catch blocks, NaN/null guards, and 3-tier degradation (mandatory Stage 1, graceful Stages 2-4, cross-encoder circuit breaker).

3. **All spec fixes are working.** Spec 009 validator rules (V8/V12), spec 010 retrieval quality fixes (6 of 6), and spec 011 lexical score propagation are all verified present and functional.

4. **UX is fully hookless.** Auto-surface, progressive disclosure, session priming, and goal refinement all operate within the MCP server without external hook dependencies. Three improvement opportunities identified and designed.

5. **Three fusion refinements identified.** Recency signal is negligibly small in hybrid mode (max 0.02 effective), graph bonus cap mismatches adaptive weights, and doc-type weight shift is disproportionate. All three have complete designs ready for implementation.

6. **Implementation-ready roadmap.** 14 items across 5 phases: Phases A-D (~7.25h, LOW-to-ZERO risk) are ready to implement; Phase E (~8-14h, MEDIUM risk) covers infrastructure improvements.

---

## Table of Contents

1. [Feature Flag Audit (Q1, Q2)](#1-feature-flag-audit-q1-q2)
2. [Fusion Pipeline Analysis (Q5)](#2-fusion-pipeline-analysis-q5)
3. [Spec Fix Verification (Q6, Q7, Q8)](#3-spec-fix-verification-q6-q7-q8)
4. [UX/Auto-Utilization (Q4)](#4-uxauto-utilization-q4)
5. [Code Graph/CocoIndex Integration (Q10)](#5-code-graphcocoindex-integration-q10)
6. [Remaining Search Quality Issues (Q3)](#6-remaining-search-quality-issues-q3)
7. [Adaptive Fusion Refinements (Q9)](#7-adaptive-fusion-refinements-q9)
8. [Cross-Cutting Concerns](#8-cross-cutting-concerns)
9. [Implementation Roadmap](#9-implementation-roadmap)
10. [Risk Assessment](#10-risk-assessment)
11. [Test Impact Matrix](#11-test-impact-matrix)
12. [Convergence Report](#12-convergence-report)

---

## 1. Feature Flag Audit (Q1, Q2)

### Current State

The Spec Kit Memory system uses `isFeatureEnabled()` in `search-flags.ts` as the canonical gating mechanism. The default behavior is feature-ON: if a flag is not explicitly disabled, it is treated as enabled.

[SOURCE: mcp_server/lib/search/search-flags.ts, rollout-policy.ts, capability-flags.ts]

- **50 features default ON** via `isFeatureEnabled()` -- includes session boost, causal boost, intent weights, feedback signals, graph signals, progressive disclosure, auto-surface, and all core pipeline stages
- **5 features opt-in** (require explicit `SPECKIT_*=true`): RECONSOLIDATION, FILE_WATCHER, RERANKER_LOCAL, QUALITY_LOOP, NOVELTY_BOOST
- **1 roadmap feature OFF**: ADAPTIVE_RANKING (intentional shadow/roadmap feature, not a bug)
- **Governance flags**: SCOPE_ENFORCEMENT and GOVERNANCE_GUARDRAILS show roadmap-ON / runtime-OFF discrepancy -- this is by design (standard feature graduation: roadmap -> shadow -> promoted -> default-on)

### Opt-In Feature Verdicts

| Feature | Current | Verdict | Risk | Rationale |
|---------|---------|---------|------|-----------|
| SPECKIT_RECONSOLIDATION | OFF (opt-in) | **ENABLE by default** | Medium | Full reconsolidation (similarity-based merge/conflict routing, thresholds: >=0.88 merge, 0.75-0.88 conflict, <0.75 complement). Assistive variant already ON. Requires auto-checkpoint guard -- `hasReconsolidationCheckpoint()` gate already exists in db-helpers.ts. Merge path IS destructive (archives old memory, creates merged record, generates causal edge, refreshes BM25+interference+cache). [SOURCE: reconsolidation.ts:212-300, db-helpers.ts] |
| SPECKIT_QUALITY_LOOP | OFF (opt-in) | **ENABLE by default** | Low | Pure algorithmic, bounded (max 2 retries), deterministic, synchronous, no I/O, no DB writes, no network calls. NUANCE: enabling enforcement means previously-warned low-quality saves will now be rejected -- this is desired behavior. [SOURCE: quality-loop.ts:581] |
| SPECKIT_FILE_WATCHER | OFF (opt-in) | KEEP OFF | High | Requires chokidar native dependency. Background resource consumption. Not portable across CI/containers. Uses double-gate pattern (explicit env check + isFeatureEnabled) signaling external dependency concerns. [SOURCE: search-flags.ts] |
| RERANKER_LOCAL | OFF (opt-in) | KEEP OFF | Very High | Requires node-llama-cpp + GGUF model file + sufficient RAM. Heavy native dependency. Also uses double-gate pattern. [SOURCE: search-flags.ts] |
| SPECKIT_NOVELTY_BOOST | OFF (inert) | **REMOVE (dead code)** | None | `calculateNoveltyBoost()` always returns 0 with underscore-prefixed unused param. JSDoc explicitly states "Eval complete. Marginal value confirmed." Env var is completely inert. [SOURCE: composite-scoring.ts:529-531] |
| SPECKIT_MEMORY_ADAPTIVE_RANKING | OFF (roadmap) | KEEP OFF | Low-Medium | Roadmap feature in shadow mode. Needs standard graduation process (shadow -> promoted -> default-on). [SOURCE: rollout-policy.ts, capability-flags.ts] |

### All Boost Signals Confirmed ON (Q2)

All five core boost signals are enabled by default via `isFeatureEnabled()`:
- Session boost (`isSessionBoostEnabled()`)
- Causal boost (`isCausalBoostEnabled()`)
- Intent weights (via `classifyIntent()` pipeline integration)
- Feedback signals (`isFeedbackSignalEnabled()`)
- Graph signals (`isGraphUnifiedEnabled()`)

[SOURCE: search-flags.ts, graph-flags.ts]

---

## 2. Fusion Pipeline Analysis (Q5)

### Architecture: 4-Stage Pipeline

| Stage | Module | Purpose | Failure Mode |
|-------|--------|---------|--------------|
| Stage 1 | `stage1-candidate-gen.ts` | Multi-channel candidate retrieval (vector, FTS5, BM25, graph) | **Mandatory** -- throws `PIPELINE_STAGE1_FAILED` |
| Stage 2 | `stage2-fusion.ts` | 12-step signal integration and score fusion | Graceful -- returns Stage 1 output with `degraded=true` |
| Stage 3 | `stage3-rerank.ts` | Cross-encoder reranking + MMR diversity | Graceful -- returns Stage 2 output with `degraded=true` |
| Stage 4 | `stage4-filter.ts` | Score invariant enforcement and quality filtering | Graceful -- returns Stage 3 output with `degraded=true` |

[SOURCE: mcp_server/lib/search/pipeline/]

### Bug Audit: No Critical Issues Found

The pipeline is well-defended with:
- **12-step signal order** with G2 double-weighting prevention (intent weights skipped in hybrid mode to avoid stacking with RRF channel weights)
- **Score clamping [0,1]** at multiple pipeline points
- **try/catch isolation** per step -- each of the 12 signal applications is individually wrapped
- **Compile-time + runtime score invariant enforcement** in Stage 4

[SOURCE: stage2-fusion.ts:715-1102, stage4-filter.ts]

### One Fragility (Non-Critical)

Stage 2 uses shallow-spread clone (`{...candidate}`) for candidate objects. Nested objects (`graphContribution`, `sourceScores`) share references across clones. This is safe TODAY because the pipeline avoids in-place nested mutation, but it creates a latent risk if future changes add nested writes.

[SOURCE: stage2-fusion.ts spread pattern analysis]

### Self-Corrections

Two iteration-2 findings were corrected with evidence in iteration 6: