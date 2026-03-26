---
title: "Architecture Audit"
description: "Deep Research implementation complete. All deliverables verified: 7/7 PASSED. research.md synthesized from 20 iterations (811 lines, 21 sections, 25 recommendations). Full sprint roadmap defined."
trigger_phrases:
  - "architecture audit deep research"
  - "ADR-001 API-first boundary"
  - "ADR-003 duplicate helper consolidation"
  - "ADR-004 import enforcement hardening"
  - "ADR-007 cache cognitive symlink"
  - "score resolution unify A1"
  - "sprint roadmap architecture audit"
importance_tier: "normal"
contextType: "research"
quality_score: 1.00
quality_flags: []
---

# Architecture Audit

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-03-20 |
| Session ID | session-1774016811860-7156c6b8c60e |
| Spec Folder | 02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit |
| Channel | main |
| Git Ref | main (`cbec3d70b3d1`) |
| Importance Tier | normal |
| Context Type | research |
| Total Messages | 5 |
| Tool Executions | 8 |
| Decisions Made | 8 |
| Created At | 2026-03-20 |

---

<!-- ANCHOR:continue-session -->
<a id="continue-session"></a>

## CONTINUE SESSION

### Session State

| Field | Value |
|-------|-------|
| Session Status | COMPLETED |
| Completion % | 100% |
| Last Activity | 2026-03-20T13:46:40.955Z |

### Context Summary

**Phase:** RESEARCH — Deep Research complete, all deliverables verified 7/7.

**Summary:** Completed the remaining deliverables of a 20-iteration deep research campaign analyzing the hybrid-rag-fusion retrieval system. research.md synthesized from all 20 iterations with 25 prioritized recommendations across 7 categories. Full sprint roadmap (Sprint 1-3 + Epic) defined and spec folder completed.

**Key Files Modified:**
- `005-architecture-audit/spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`
- `001-hybrid-rag-fusion-epic/research.md` — 811 lines, 21 sections, synthesized from 20 iterations
- `001-hybrid-rag-fusion-epic/scratch/deep-research-state.jsonl` — convergence report appended

<!-- /ANCHOR:continue-session -->

---

<!-- ANCHOR:project-state-snapshot -->
<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | RESEARCH (complete) |
| Last Action | Full sprint roadmap defined for Sprints 2-3 and dead code/epic items |
| Blockers | None |

### File Progress

| File | Status |
|------|--------|
| spec.md | EXISTS |
| plan.md | EXISTS |
| tasks.md | EXISTS |
| checklist.md | EXISTS |
| decision-record.md | EXISTS |
| research.md | EXISTS |

<!-- /ANCHOR:project-state-snapshot -->

---

<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built:**

- **research.md — Full synthesis (811 lines, 21 sections)** compiled from all 20 deep-research iterations:
  - 25 prioritized recommendations across 7 categories (A: bugs, B: architecture, C: dead code, D: docs, E: DX, F: performance, G: testing)
  - Cross-validation results (6 confirmed, 3 modified, 1 refuted)
  - Implementation roadmap: Sprint 1 (3 days) → Sprint 2 (5 days) → Sprint 3 (5 days) → Epic (2-4 weeks)

- **Top 3 recommendations (ultra-think scored):**
  1. A1: Unify score resolution — `resolveEffectiveScore` inconsistency (25/25 — perfect score)
  2. B1: Orchestrator error handling + timeouts (24/25)
  3. B6: Signal tri-state metadata (22/25)

- **Full sprint roadmap:**
  - Sprint 1 (1-2 days): A1 score unification, B6 signal metadata, B7 BM25 N+1 batch, G1/G2/G3 test gaps
  - Sprint 2 (3-5 days): B1 orchestrator hardening, D1 channel docs, D4 feature flag manifest (81 flags), E3 simplified memory_search
  - Sprint 3 (3-5 days): F1 deep-mode caching, A4+G5 concurrent save dedup, B4 stage-2 decomposition
  - Epic: B2 weight coherence, B5 flag governance overhaul, B3 eval-to-scoring feedback loop
  - Dead code cleanup: C1-C9 (9 items, P2/S, batchable)

- **60 agent output files completed:** 20/20 native (A3), 20/20 Codex (A1), 20/20 Copilot (A2)

<!-- ANCHOR:task-guide -->
**Key Files:**

| File | Role |
|------|------|
| `001-hybrid-rag-fusion-epic/research.md` | 811-line synthesis, 25 recommendations |
| `001-hybrid-rag-fusion-epic/scratch/deep-research-state.jsonl` | 24-record JSONL with convergence report |
| `001-hybrid-rag-fusion-epic/scratch/deep-research-strategy.md` | 18/18 research questions answered |
| `001-hybrid-rag-fusion-epic/scratch/ultra-think-review.md` | 113 lines, top 20 scored recommendations |
| `005-architecture-audit/research.md` | Architecture audit research findings |

<!-- /ANCHOR:task-guide -->

---

<a id="overview"></a>

## 2. OVERVIEW

<!-- ANCHOR:summary -->
Deep Research implementation complete. All 7 verification criteria met (7/7 PASSED). 79 scratch files confirmed (20/20 native, 20/20 Codex, 20/20 Copilot — excess due to .log files and historical w1-w7 artifacts). research.md synthesized from 20 iterations with 25 prioritized recommendations across 7 categories. Full sprint roadmap defined.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

## 4. DECISIONS

### ADR-001: API-First Boundary Contract for Cross-Area Consumption

Scripts consumers currently import runtime internals (`@spec-kit/mcp-server/lib/*`). **Decision:** External consumers in `scripts/` should use `mcp_server/api/*` as the supported boundary. Confidence: 70%

### ADR-002: Compatibility Wrappers Are Transitional, Not Canonical

`mcp_server/scripts/reindex-embeddings.ts` invokes `../../scripts/dist/memory/reindex-embeddings.js` (back-edge). **Decision:** Preserve wrappers as transitional surfaces; move canonical runbook ownership to root scripts docs. Confidence: 70%

### ADR-003: Consolidate Duplicate Helper Logic Into Shared Modules

Duplicated `estimateTokenCount`/`estimateTokens` (same `Math.ceil(text.length/4)` heuristic in `tree-thinning.ts` and `token-metrics.ts`) and `extractQualityScore`/`extractQualityFlags` (in `memory-indexer.ts` and `memory-parser.ts`). **Decision:** Consolidate into shared modules. Confidence: 70%

### ADR-004: Enforcement Script Hardening (Cross-AI Review Findings)

4 CRITICAL evasion vectors in `check-no-mcp-lib-imports.ts`: (1) dynamic `import()` undetected, (2) relative path depth variants bypass, (3) multi-line imports bypass line-by-line scan, (4) boundary too narrow (only `lib/`, not `core/`). Plus 3 more from 10-agent cross-AI review (ADR-006): template literal imports, same-line block comments, transitive barrel re-exports limited to 1 hop. **Decision:** Incremental hardening in 3 tiers. Confidence: 70%

### ADR-005: handler-utils.ts as Canonical Handler-Domain Module

`escapeLikePattern` extracted from `memory-save.ts` (T013a); `detectSpecLevelFromParsed` extracted from `causal-links-processor.ts` (T013b); consumers migrated to `handler-utils.ts` (T014). Removes documented handler cycle CHK-013. **Decision:** Accept `handler-utils.ts` as canonical consolidation module. Confidence: 70%

### ADR-006: Regex Evasion Risk Acceptance with Time-Bounded AST Hardening

Combined ADR-004 + cross-AI 10-agent review vectors still partially exposed. **Decision:** Accept short-term regex-evasion risk; schedule AST-based enforcement hardening as explicit time-bounded technical debt. Confidence: 70%

### ADR-007: Eliminate lib/cache/cognitive Symlink

`mcp_server/lib/cache/cognitive` is a symlink to `../cognitive` — 74+ imports resolve through phantom `cache/cognitive/` path. Deleting apparent dead code `lib/cognitive/adaptive-ranking.ts` broke all 11 cognitive modules because the symlink masked the real dependency graph. **Decision:** Remove symlink; update all 74+ imports from `cache/cognitive/X` to `cognitive/X`. Confidence: 70%

<!-- /ANCHOR:decisions -->

---

*Generated by system-spec-kit skill | Trimmed 2026-03-25*
