---
title: "Implemen [system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/011-scoring-and-calibration/plan]"
description: "Technical plan for auditing 23 Scoring and Calibration features against source code"
trigger_phrases:
  - "audit plan"
  - "scoring and calibration"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/011-scoring-and-calibration"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: Code Audit — Scoring and Calibration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / JavaScript (Node.js) |
| **Framework** | MCP server (Model Context Protocol) |
| **Storage** | better-sqlite3 |
| **Testing** | Manual code review + cross-reference |

### Overview
Audit each of the 23 Scoring and Calibration features by reading the feature catalog entry, locating the referenced source files, and verifying that the implementation matches the documented behavior.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Feature catalog files current and accessible
- [x] Source code accessible via file system
- [x] Audit methodology defined

### Definition of Done
- [x] All 23 features audited
- [x] Findings documented per feature
- [x] Summary report completed

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only audit: Feature Catalog → Source Code → Findings Report

### Key Components
- **Feature Catalog**: `feature_catalog/11--scoring-and-calibration/` — source of truth
- **Source Code**: `.opencode/skill/system-spec-kit/` — implementation files
- **Audit Output**: This spec folder — findings and documentation

### Data Flow
Read feature catalog entry → Locate source files → Compare description to implementation → Document findings

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preparation
- [x] Verify feature catalog is current for Scoring and Calibration
- [x] Identify source code root paths
- [x] Set up audit methodology

### Phase 2: Feature-by-Feature Audit
- [x] Audit: Score normalization — MATCH
- [x] Audit: Cold-start novelty boost — MATCH
- [x] Audit: Interference scoring — MATCH
- [x] Audit: Classification-based decay — MATCH
- [x] Audit: Folder-level relevance scoring — MATCH
- [x] Audit: Embedding cache — MATCH
- [x] Audit: Double intent weighting investigation — MATCH
- [x] Audit: RRF K-value sensitivity analysis — MATCH
- [x] Audit: Negative feedback confidence signal — MATCH
- [x] Audit: Auto-promotion on validation — MATCH
- [x] Audit: Scoring and ranking corrections — MATCH
- [x] Audit: Stage 3 effectiveScore fallback chain — MATCH
- [x] Audit: Scoring and fusion corrections — PARTIAL (file paths missing `pipeline/` prefix)
- [x] Audit: Local GGUF reranker via node-llama-cpp — MATCH
- [x] Audit: Tool-level TTL cache — MATCH
- [x] Audit: Access-driven popularity scoring — MATCH
- [x] Audit: Temporal-structural coherence scoring — MATCH
- [x] Audit: Adaptive shadow ranking — MATCH
- [x] Audit: Learned Stage 2 weight combiner — MATCH
- [x] Audit: Shadow feedback holdout evaluation — MATCH
- [x] Audit: Calibrated overlap bonus — MATCH
- [x] Audit: RRF K experimental tuning — PARTIAL (function name: catalog `perIntentKSweep`, code `runJudgedKSweep`)
- [x] Audit: Fusion policy shadow evaluation V2 — PARTIAL (flag accessor `isShadowFeedbackEnabled()` confirmed in `search-flags.ts:397`. Corrected per deep research iteration 3+9 verification.)

### Phase 3: Synthesis
- [x] Cross-reference findings across features
- [x] Identify systemic patterns
- [x] Compile summary report

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Cross-reference | Feature-to-code traceability | Grep, Read, Glob |
| Completeness | All 23 features covered | Checklist verification |
| Accuracy | Catalog matches implementation | Manual review |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Feature catalog | Internal | Green | Cannot audit without reference |
| Source code access | Internal | Green | Cannot verify implementation |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Audit methodology proves inadequate
- **Procedure**: Revise approach and restart from Phase 1

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Prep) ──► Phase 2 (Audit 23 features) ──► Phase 3 (Synthesis)
```

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preparation | Low | 1 session |
| Feature Audit | High | 23 features |
| Synthesis | Medium | 1 session |

---

### Milestones

| Milestone | Description | Success Criteria |
|-----------|-------------|------------------|
| M1 | Audit spec created | All docs in place |
| M2 | All features audited | 23/23 complete |
| M3 | Synthesis delivered | Summary report finalized |

---

### Findings Summary

**Completed**: 2026-03-22
**Result**: 20 MATCH, 3 PARTIAL, 0 MISS out of 23 features

| Status | Count | Features |
|--------|-------|---------|
| MATCH | 20 | F01–F12, F14–F21 |
| PARTIAL | 3 | F13, F22, F23 |
| MISS | 0 | — |

**PARTIAL details:**
- **F13** (Scoring and fusion corrections): Catalog file paths missing `pipeline/` prefix
- **F22** (RRF K experimental tuning): Function name in catalog (`perIntentKSweep`) differs from code (`runJudgedKSweep`)
- **F23** (Fusion policy shadow evaluation V2): Flag accessor `isShadowFeedbackEnabled()` confirmed in `search-flags.ts:397`. Corrected per deep research iteration 3+9 verification.

**Conclusion**: All behavioral descriptions are accurate. The three PARTIAL findings are naming/path precision issues only — no functional discrepancies detected. No deprecated or undocumented features found.
<!-- /ANCHOR:effort -->
