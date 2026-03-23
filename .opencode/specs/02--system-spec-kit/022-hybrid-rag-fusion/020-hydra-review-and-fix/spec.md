---
title: "Hydra Review & Fix: 5-Agent GPT-5.4 Code Audit + Remediation"
status: "Complete"
level: 2
created: "2026-03-23"
updated: "2026-03-23"
---

# Hydra Review & Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## 1. METADATA

| Field | Value |
|-------|-------|
| Spec Folder | `specs/02--system-spec-kit/022-hybrid-rag-fusion/020-hydra-review-and-fix/` |
| Parent | `022-hybrid-rag-fusion` (coordination root) |
| Level | 2 |
| Status | Complete |
| Branch | `fix/hydra-review-2026-03-23` |

---

## 2. PROBLEM STATEMENT

The hybrid-RAG-fusion implementation (80+ TypeScript files, ~25K LOC) had accumulated architectural debt, numerical edge cases, standards drift, documentation count misalignment, and eval infrastructure bugs. No comprehensive cross-file review had been performed since the initial implementation sprints.

---

## 3. SOLUTION

### Phase 1: Multi-Agent Review (5 GPT-5.4 ultra-think agents via cli-codex)

Each agent reviewed a distinct file partition in read-only sandbox mode:

| Agent | Focus | Files | Findings |
|-------|-------|-------|----------|
| 1 | Core Pipeline Architecture | 11 pipeline files | 1 CRITICAL + 7 HIGH + 1 MEDIUM |
| 2 | Fusion Algorithms & Scoring | 11 algorithm files | 8 HIGH + 5 MEDIUM |
| 3 | sk-code--opencode Standards | 10 search utility files | ~5 P0 + ~30 P1 |
| 4 | Feature Catalog ↔ Playbook Alignment | Indexes + samples | 1 CRITICAL + 6 HIGH + 1 MEDIUM + 1 LOW |
| 5 | Eval Framework & Refinement | 14 eval files | 4 HIGH + 7 MEDIUM + 3 LOW |

**Total review findings: ~80 unique issues**

### Phase 2: Multi-Agent Fix Application (5 parallel agents)

Fixes applied by file-partitioned agents (no overlap):

| Agent | Method | Files Modified | Fixes Applied |
|-------|--------|----------------|---------------|
| A | Opus worktree | 4 pipeline files | 9/9 |
| B | GPT-5.4 (codex exec) | 9 algorithm/scoring files | 13/13 |
| C | GPT-5.4 (codex exec) | 6 search utility files | 11/11 |
| D | GPT-5.4 (codex exec) | 4 vector-index files | 11/11 |
| E | GPT-5.4 (codex exec) | 12 eval + 4 doc files | 15/15 |

### Phase 3: Pre-Existing Test Failure Remediation (3 Opus agents)

| Agent | Focus | Files Fixed | Failures Resolved |
|-------|-------|-------------|-------------------|
| 1 | DB-init handler tests | 8 test files | 72 → 0 |
| 2 | Integration/scoring tests | 7 test + 3 source files | 44 → 0 |
| 3 | Misc tests | 6 test files | 19 → 0 |

---

## 4. KEY FIXES

### Critical
- **Stage 1 architecture violation**: Documented double-processing issue (searchWithFallback does fusion+rerank before pipeline stages 2-4 re-process). Added TODO for future candidate-only refactor.
- **Documentation count drift**: Updated 4 governing documents with live filesystem counts (233 playbook files, 222 catalog files, ~272 exact IDs). Prior claims of 264/264 invalidated.

### High (Score Correctness)
- Session boost clamped to [0,1] after multiplication
- Causal boost: injected neighbors now respect MAX_COMBINED_BOOST cap
- Causal boost: hop distance returned directly instead of back-derived
- MMR preserves non-embedded rows (was silently dropping lexical/graph hits)
- Stage 2 deep-clones rows at entry (prevents timeout-fallback race condition)
- Stage 2 syncs score aliases immediately after every mutation
- Stage 1 uses Promise.allSettled for fail-open fan-out
- Zero-weight RRF channels excluded from overlap bonus
- Cross-encoder re-sorts after length penalty
- Confidence scoring requires rerankerApplied provenance
- NaN guards in MMR lambda + cosine computation

### High (Eval Infrastructure)
- Ablation adapter unified with handler (forceAllChannels: true)
- Ground-truth parser reads JSON directly (was regex-parsing stale TS wrapper)
- Eval DB: added secondary indexes + busy_timeout(5000)
- Handler validation-before-I/O ordering fixed (3 handler source files)

### Standards (P0/P1)
- File headers, section headers, import ordering fixed across 10+ files
- VectorIndexError class with typed error codes (replaces raw Error throws)
- Shared types consolidated in vector-index-types.ts (DRY)
- TSDoc added to all public functions in 16+ files
- Bare catch {} → catch (error: unknown)

---

## 5. VERIFICATION

| Metric | Before | After |
|--------|--------|-------|
| Tests passing | 8,763 | **8,905** |
| Tests failing | 135 | **0** |
| Test files passing | 297 | **322** |
| Files changed | — | **46+ source, 20+ test** |
| Lines changed | — | **+1,167 / -695 (source)** |

---

## 6. SCOPE

### In Scope
- All findings from the 5-agent GPT-5.4 review
- Pre-existing test failures (135 → 0)
- Documentation count alignment

### Out of Scope
- Full Stage 1 architectural refactor (extracting candidate-only path from searchWithFallback) — documented as TODO
- Module splitting for SRP violations (hybrid-search.ts 1850 LOC, vector-index-queries.ts 1440 LOC)
- Feature catalog ↔ playbook backlink repair (55+ orphan features, 30+ orphan tests)
