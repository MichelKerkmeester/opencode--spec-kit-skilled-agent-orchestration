# Feature Catalog Audit — Analysis Summary

> **Date:** 2026-03-08
> **Method:** 30 Codex agents (20 verification + 10 investigation) scanned 180 feature snippets and 55 known gaps
> **Duration:** ~12 minutes total (parallel execution)

---

## Executive Summary

The audit verified all 180 feature snippet files and investigated all 55 known undocumented gaps. Only **7 features (3.9%) passed with no issues**. The remaining 173 features need some level of remediation. Additionally, **29 new gaps** were discovered beyond the original 55, while **7 of the original 55 were false positives**.

---

## Stream 1: Feature Verification (C01-C20)

### Features Verified: 180

| Metric | Count | Percentage |
|--------|-------|------------|
| **Total features** | 180 | 100% |
| PASS (no action needed) | 7 | 3.9% |
| UPDATE_PATHS only | 81 | 45.0% |
| BOTH (desc + paths) | 63 | 35.0% |
| REWRITE | 18 | 10.0% |
| UPDATE_DESCRIPTION only | 11 | 6.1% |

### Description Accuracy

| Rating | Count | Percentage |
|--------|-------|------------|
| YES (accurate) | 89 | 49.4% |
| PARTIAL | 78 | 43.3% |
| NO (inaccurate) | 13 | 7.2% |

**Description accuracy rate: 49.4%** (below the 95% target). Note: PARTIAL descriptions are not necessarily wrong, just incomplete or slightly outdated.

### Severity Distribution

| Severity | Count | Percentage |
|----------|-------|------------|
| HIGH | 41 | 22.8% |
| MEDIUM | 92 | 51.1% |
| LOW | 47 | 26.1% |

### Category-Level Summary

| Category | Files | PASS | Issues | Primary Issue Type |
|----------|-------|------|--------|-------------------|
| 01-retrieval | 9 | 1 | 8 | BOTH (5), UPDATE_PATHS (3) |
| 02-mutation | 10 | 0 | 10 | UPDATE_PATHS (3), BOTH (3), REWRITE (2) |
| 03-discovery | 3 | 0 | 3 | BOTH (3) |
| 04-maintenance | 2 | 0 | 2 | UPDATE_PATHS (1), UPDATE_DESC (1) |
| 05-lifecycle | 7 | 0 | 7 | UPDATE_PATHS (4), BOTH (1), UPDATE_DESC (2) |
| 06-analysis | 7 | 0 | 7 | UPDATE_PATHS (5), BOTH (2) |
| 07-evaluation | 2 | 0 | 2 | UPDATE_PATHS (1), BOTH (1) |
| 08-bug-fixes | 11 | 2 | 9 | UPDATE_PATHS (5), BOTH (1), REWRITE (1) |
| 09-eval-measurement | 14 | 0 | 14 | BOTH (8), UPDATE_PATHS (3), REWRITE (1) |
| 10-graph-signal | 11 | 1 | 10 | BOTH (6), UPDATE_PATHS (2), UPDATE_DESC (2) |
| 11-scoring | 17 | 1 | 16 | UPDATE_PATHS (7), BOTH (5), REWRITE (2) |
| 12-query-intelligence | 6 | 0 | 6 | BOTH (4), UPDATE_PATHS (1), REWRITE (1) |
| 13-memory-quality | 16 | 0 | 16 | UPDATE_PATHS (6), BOTH (7), REWRITE (1) |
| 14-pipeline | 21 | 0 | 21 | UPDATE_PATHS (9), BOTH (3), REWRITE (5) |
| 15-retrieval-enh | 9 | 0 | 9 | UPDATE_PATHS (7), BOTH (2) |
| 16-tooling | 8 | 0 | 8 | BOTH (6), UPDATE_PATHS (2) |
| 17-governance | 2 | 0 | 2 | UPDATE_PATHS (1), REWRITE (1) |
| 18-ux-hooks | 13 | 0 | 13 | UPDATE_PATHS (13) |
| 19-decisions | 5 | 0 | 5 | UPDATE_PATHS (4), UPDATE_DESC (1) |
| 20-feature-flags | 7 | 2 | 5 | REWRITE (2), BOTH (2), UPDATE_DESC (1) |

### Path Validation Findings

| Invalid Path | Referenced In | Resolution |
|-------------|---------------|------------|
| `mcp_server/tests/retry.vitest.ts` | 52 snippets | Renamed to `retry-manager.vitest.ts` |
| `mcp_server/lib/parsing/slug-utils.ts` | 2 snippets | Removed; slug logic now in tests |
| `mcp_server/lib/architecture/check-architecture-boundaries.ts` | 1 snippet | Script removed |

---

## Stream 2: Gap Investigation (X01-X10)

### Original 55 Gaps

| Status | Count | Percentage |
|--------|-------|------------|
| CONFIRMED_GAP | 48 | 87.3% |
| FALSE_POSITIVE | 7 | 12.7% |

### False Positives (7)

| Gap # | Feature | Reason |
|-------|---------|--------|
| 15 | Quality-Aware 3-Tier Fallback | Already documented in 01-retrieval/08 |
| 16 | Causal Neighbor Boost + Injection | Already documented in 10-graph-signal/10 |
| 19 | Automatic Archival Subsystem | Already documented in 05-lifecycle/07 |
| 22 | Temporal Contiguity Layer | Already documented in 10-graph-signal/11 |
| 32 | Durable Ingest Job Queue | Already documented in 05-lifecycle/05 |
| 35 | Tool-Level TTL Cache | Already documented in 11-scoring/15 |
| 37 | 7-Layer Tool Architecture Metadata | Already documented in 14-pipeline/20 |

### New Gaps Discovered (29)

| Agent | Gap | Feature | Significance |
|-------|-----|---------|-------------|
| X01 | NEW-1 | Startup API-Key Preflight Gate | MEDIUM |
| X01 | NEW-2 | Dynamic MCP Server Instructions from Live Stats | MEDIUM |
| X01 | NEW-3 | Deterministic Graceful Shutdown | MEDIUM |
| X03 | NEW-1 | Spec-Doc Indexing Kill Switch | MEDIUM |
| X03 | NEW-2 | Multi-Strategy Causal Reference Resolution | MEDIUM |
| X03 | NEW-3 | sqlite-vec Capability Fallback | MEDIUM |
| X04 | NEW-1 | Rerank Score Provenance Discriminator | MEDIUM |
| X04 | NEW-2 | Confidence-Scored Artifact Query Classification | MEDIUM |
| X05 | NEW-1 | Co-Activation Related-Memory Cache | MEDIUM |
| X05 | NEW-2 | Wraparound-Safe Event Counter Clock | MEDIUM |
| X05 | NEW-3 | Durable Archival Stats Persistence | LOW |
| X06 | NEW-1 | Relative BM25-vs-Hybrid Contingency Mode | MEDIUM |
| X06 | NEW-2 | Multi-Metric Ablation Diagnostics | MEDIUM |
| X06 | NEW-3 | Consumption Pattern Mining | LOW |
| X06 | NEW-4 | Sampled Scoring Observability Store | MEDIUM |
| X07 | NEW-1 | Optimistic State-Transition Conflict Guard | MEDIUM |
| X07 | NEW-2 | Regex-Based Tool Cache Invalidation | LOW |
| X07 | NEW-3 | Layer Prefix/Documentation Rendering Utilities | LOW |
| X08 | NEW-1 | Schema-Adaptive Canonical-Path Query Fallback | MEDIUM |
| X08 | NEW-2 | Spec-Folder-Scoped History Aggregation | LOW |
| X08 | NEW-3 | Shutdown-Safe Access Accumulator Drain | MEDIUM |
| X08 | NEW-4 | Extraction Rule Regex Safety Validation | MEDIUM |
| X08 | NEW-5 | Redaction-Ratio Abort Gate | MEDIUM |
| X09 | NEW-1 | Intent Disambiguation Guardrails | MEDIUM |
| X09 | NEW-2 | Deterministic Provider-Free Centroid Classifier | MEDIUM |
| X09 | NEW-3 | Stage 2 Post-Signal Score Reconciliation Guard | LOW |
| X10 | NEW-1 | Persistent Embedding Cache Hit/Miss Path | LOW |
| X10 | NEW-2 | Age-Filtered Retention Deletion | LOW |
| X10 | NEW-3 | Alias Reconcile Candidate Expansion | LOW |

### New Gap Significance Distribution

| Significance | Count |
|-------------|-------|
| HIGH | 0 |
| MEDIUM | 19 |
| LOW | 10 |

---

## Combined Statistics

| Metric | Value |
|--------|-------|
| **Total features verified** | 180 |
| **Features passing** | 7 (3.9%) |
| **Features needing remediation** | 173 (96.1%) |
| **Original gaps confirmed** | 48/55 (87.3%) |
| **Original gaps false positive** | 7/55 (12.7%) |
| **New gaps discovered** | 29 |
| **Total confirmed gaps** | 48 + 29 = 77 |
| **Invalid file paths** | 3 unique (affecting 55 snippets) |
| **REWRITEs needed** | 18 features |
| **HIGH severity issues** | 41 features |

---

## Key Findings

1. **Path staleness is the #1 issue**: 81 features need path updates, primarily due to the renamed `retry.vitest.ts` affecting 52 files. This is batch-fixable.

2. **Description drift is significant**: Only 49.4% of descriptions are fully accurate. 43.3% are partially correct (outdated details), and 7.2% are materially wrong.

3. **18 features need complete rewrites**: These have descriptions that no longer match the implemented behavior at all.

4. **7 original gaps were already documented**: The prior scan missed existing catalog entries for these capabilities.

5. **29 new undocumented capabilities found**: Mostly medium-significance infrastructure and cognitive subsystem features.

6. **14-pipeline-architecture is the worst category**: 5 rewrites needed, highest concentration of stale documentation.

7. **18-ux-hooks paths are all stale**: Every single UX hook feature needs path updates (likely a systematic path change).
