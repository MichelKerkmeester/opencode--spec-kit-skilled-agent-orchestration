# Spec: 018 — Refinement Phase 7: Cross-AI Review Audit & Remediation

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Tier 1+2 Complete; Tier 4 Implemented (13/14, CR-P0-1 partial); Tier 5 Documented |
| **Created** | 2026-03-02 |
| **Spec Folder** | `023-hybrid-rag-fusion-refinement/018-refinement-phase-7` |
| **Parent** | `023-hybrid-rag-fusion-refinement` |

---

## Problem

The Spec Kit Memory MCP server has grown to a significant codebase across 17 prior refinement phases without a comprehensive quality audit:

| Package | Files | LOC | Role |
|---------|:-----:|----:|------|
| `mcp_server/lib/` | 154 | 50,060 | Core MCP server (23 subdirectories) |
| `mcp_server/handlers/` | 22 | 9,911 | Request handlers |
| `scripts/` | ~40 | 21,887 | Build, indexing, maintenance scripts |
| **Total** | ~216 | ~81,858 | |

**Specific problems identified:**
1. **Documentation drift** — `summary_of_existing_features.md` contains 13 factual errors (4 P0), including wrong signal counts, references to removed V1 pipeline, and undocumented functions
2. **Latent code risks** — Math.max/min spread patterns in 8 production files that crash Node.js at >100K array elements; session-manager transaction gap allowing concurrent race conditions
3. **Synthesis propagation failure** — Prior review waves discovered corrections that never reached final deliverable documents (8 propagation failures)
4. **Cross-AI inconsistency** — Different AI models produced contradictory findings that remained unresolved until this audit

## Purpose

Execute a comprehensive cross-AI audit and produce a verified, prioritized remediation plan:

1. Verify documentation accuracy against actual source code with file:line evidence
2. Detect latent bugs and code safety issues using multi-model cross-verification
3. Assess architecture health with quantified scoring (6 dimensions, 100-point scale)
4. Produce an authoritative findings registry where every finding has exactly one definitive status
5. Generate a 3-tiered action plan with realistic effort estimates
6. Document AI bias patterns and audit process lessons for future multi-AI workflows

## Scope

### In Scope

| Domain | Coverage Level | What Was Examined |
|--------|:-:|---|
| `mcp_server/lib/search/` + `scoring/` | **DEEP** | Multi-wave review (W1,W2,W4) + Codex deep-dives + Opus deep-dives. 21,515 LOC |
| `mcp_server/handlers/` | **MODERATE** | Wave 2 (documentation) + Wave 4 (bugs). 9,911 LOC |
| `mcp_server/lib/cognitive/`, `telemetry/`, `eval/`, `providers/`, `session/`, `parsing/` | **LIGHT** | Architecture mentions (W1) + G5 automated scan. 15,527 LOC |
| `mcp_server/lib/` remaining 15 dirs (storage/, cache/, errors/, graph/, etc.) | **SCAN** | G5 pattern scan only (Math.max, TODO/FIXME/HACK). 13,018 LOC |
| `scripts/` | **LIGHT** | Wave 1 (architecture), Wave 3 (code standards). 21,887 LOC |
| `summary_of_existing_features.md` | **DEEP** | Full cross-verification of every claim against source code |
| `summary_of_new_features.md` | **DEEP** | Full cross-verification — 15/15 features match (perfect) |
| Prior phase fixes (015, 016, 017) | **VERIFIED** | Phase 017: 10/10 sampled fixes verified. Phases 015-016: 5/5 verified |

### Out of Scope
- Performance testing / load testing / P99 latency measurement
- Security audit beyond SQL injection (authentication, authorization, rate limiting, data exfiltration)
- Automated test coverage analysis (test suite existence/quality not assessed)
- Production data volume profiling (array sizes, concurrency levels, flag counts)
- `shared/` package deep review (architecture only, no logic review)

---

## Audit Methodology

### Phase 1: 4-Wave Cross-AI Review (Prior Work)

| Wave | Focus | Models | Key Deliverables |
|------|-------|--------|-----------------|
| Wave 1 | Script location & architecture | Gemini + Codex + Opus | Import map, build system analysis, architecture verification |
| Wave 2 | Summary document verification | Gemini + Codex + Opus | 15/15 new features match; 13 existing features errors found |
| Wave 3 | Code standards review | Gemini + Codex | 19/20 files fail (consistent internal convention, divergent from standard) |
| Wave 4 | Bug detection & phase verification | Opus | 10/10 Phase 017 fixes verified; 0 critical bugs; 6 P2 findings |

### Phase 2: Deep-Dives & Meta-Reviews (Prior Work)

- **Codex verification**: Cross-checked contradictions (SQL false positives, tool count, signal count)
- **Gemini deep-dives**: Doc issues, flag audit, SQL safety, phase 015-016, tool count (5 files)
- **Ultra-think meta-review**: Severity recalibration, missed findings, prioritized action plan
- **11-agent deep review**: Synthesis quality grades, AI bias detection, coverage gaps

### Phase 3: 8-Agent Orchestrated Review (This Audit)

Executed per `.agents/agents/orchestrate.md` rules (CWB Pattern A, TCB ≤8, depth 1 leaf):

| Agent | Model | Task | Output | Quality |
|-------|-------|------|--------|:-------:|
| G1 | Gemini 3.1 Pro | Verify 4 P0 findings | 580 lines — all 4 CONFIRMED | Pass |
| G2 | Gemini 3.1 Pro | Verify 7 P1 findings | 827 lines — all 7 CONFIRMED | Pass |
| G3 | Gemini 3.1 Pro | Consistency audit of implementation-summary.md | 985 lines — contradictions + missing corrections found | Pass |
| G4 | Gemini 3.1 Pro | Git history for resolved findings | 560 lines — most findings still OPEN | Pass |
| G5 | Gemini 3.1 Pro | Coverage gap scan of uncovered areas | 592 lines — 1 HIGH + 2 LOW new findings | Pass |
| O1 | Claude Opus 4.6 | Authoritative Findings Registry | 153 lines — all 33 findings with definitive status | 90/100 |
| O2 | Claude Opus 4.6 | Synthesis Quality & Propagation Audit | 139 lines — 8 failures, 4 fabricated claims, 3 bias patterns | 90/100 |
| O3 | Claude Opus 4.6 | Coverage Gap Analysis & Action Plan | 241 lines — full heatmap, 33-item tiered plan | 88/100 |

### Phase 4: Ultra-Think Quality Review

Independent critical review of all 4 audit documents using 5 thinking strategies (Analytical, Critical, Creative, Pragmatic, Holistic). Found 5 issues across documents, all subsequently resolved.

---

## Findings Summary

### Status Distribution

| Status | Count | Description |
|--------|:-----:|-------------|
| **VERIFIED** | 16 | Code-side evidence confirms finding is real and unresolved |
| **RESOLVED** | 2 | Evidence shows finding was fixed (P1-12 workspace deps, signal count contradiction) |
| **FALSE_POSITIVE** | 1 | Cross-verification proved finding incorrect (FP-1 retry-manager redundancy) |
| **CORRECTED** | 1 | Deep-review's C138 fabrication accusation was itself wrong — C138 exists in source |
| **DOWNGRADED** | 5 | Severity recalibrated lower with evidence (SQL 3/5, transactions, tool count, naming, chunks) |
| **UNVERIFIED** | 6 | Could not be confirmed — lower-priority P2 items (flags, deps, headers, comments) |
| **PROCESS** | 2 | Audit process findings (propagation failure, missing wave4-synthesis) |
| **Total** | **33** | 4 P0, 15 P1, 11 P2, 3 LOW/P3 |

### Most Dangerous Finding

**P1-6: Math.max/min spread patterns** — 8 production files use `Math.max(...array)` which causes stack overflow at >100K elements. G4 found 25 active matches across the codebase. Safe reduce patterns already exist in `intent-classifier.ts` and `rrf-fusion.ts` but weren't applied universally. Confirmed by G2 + G4 + multi-agent deep review (3/3 models).

### Most Surprising Finding

**The meta-review fabricated a claim while auditing fabrications.** The deep-review accused Wave 3 synthesis of fabricating "C138" — but C138 verifiably exists at `z_archive/wave3-gemini-mcp-standards.md:L32` (confirmed by source read, G3 audit, and ultra-think validation). The reviewer introduced the same class of error it was auditing for.

### Contradiction Resolutions (6/6 Resolved)

| # | Contradiction | Resolution | Evidence |
|---|-------------|-----------|----------|
| 1 | Signal count "11" vs "12" vs "9" | **12 processing steps (9 score-affecting)** | G1 verified at `stage2-fusion.ts:335-515`. 3/3 models agree |
| 2 | SQL template literals P1 vs P2 | **3/5 FALSE_POSITIVE, 2/5 P2 code style** | Codex: all interpolation from internal logic, not user input |
| 3 | Tool count "23" vs "25" | **25 tools** (only spec.md metadata stale) | Codex verified all 25 across L1-L7 tiers |
| 4 | Transaction boundaries P1 vs P2 | **P2** — single-process better-sqlite3 | Self-healing covers crash consistency |
| 5 | retry-manager redundancy | **FALSE_POSITIVE** — zero functional overlap | Generic backoff vs 500-line embedding retry queue with DB ops |
| 6 | C138 "fabricated" vs "exists" | **EXISTS** at `wave3-gemini-mcp-standards.md:L32` | Source verification + G3 + ultra-think confirmed |

---

## Architecture Health Score: 77.4/100

| Dimension | Score | Weight | Weighted | Notes |
|-----------|:-----:|:------:|:--------:|-------|
| Functional Correctness | 94/100 | 30% | 28.2 | Zero critical bugs in reviewed code. Math.max latent (-3). Session tx gap (-3) |
| Code Safety | 83/100 | 20% | 16.6 | SQL parameterization excellent. 8 spread files (-8). 4 tx gaps (-6). isFeatureEnabled quirk (-3) |
| Documentation Accuracy | 52/100 | 15% | 7.8 | summary_of_new_features perfect (15/15). summary_of_existing has 13 errors. impl-summary propagation failures |
| Architecture Cleanliness | 78/100 | 15% | 11.7 | Monorepo correct. No circular deps. 10 scripts bypass shared (-12). Missing reindex API (-5) |
| Code Standards | 58/100 | 10% | 5.8 | 19/20 fail sk-code--opencode (consistent internal, divergent from standard). 3 P1 violations |
| Maintainability | 73/100 | 10% | 7.3 | AI-WHY comments excellent. Documentation drift hurts onboarding (-15). Scripts coupling fragility (-12) |
| **TOTAL** | | **100%** | **77.4** | Coverage caveat: only 52% received deep multi-wave review |

---

## Coverage Heatmap

| Level | Directories | LOC | % of lib/ | Description |
|-------|:-----------:|----:|:---------:|-------------|
| **DEEP** | 2 (search/, scoring/) | 21,515 | 43% | Multi-wave + deep-dives. High confidence in findings |
| **MODERATE** | 1 (handlers/) | 9,911 | (separate) | Focused wave analysis. Moderate confidence |
| **LIGHT** | 6 | 15,527 | 31% | Architecture mentions + G5 findings. Lower confidence |
| **SCAN** | 15 | 13,018 | 26% | G5 pattern scan only. Minimal confidence |

**Biggest blind spots:** eval/ (7,051 LOC, 14% of lib/), storage/ (4,831 LOC), cognitive/ (3,795 LOC)

---

## Requirements

### R1: Documentation Accuracy (P0)

Fix 13 errors in `summary_of_existing_features.md`:

**P0 corrections (4 — blocking):**
| # | Error | Current | Correct | Evidence |
|---|-------|---------|---------|----------|
| 1 | Signal count | "9 signals" | "12 processing steps (9 score-affecting)" | `stage2-fusion.ts:404` — G1 verified all 12 steps |
| 2 | V1 pipeline | Described as available | Removed in Phase 017 | `memory-search.ts:599` — only removal comment remains |
| 3 | SPECKIT_PIPELINE_V2 | Described as active toggle | Deprecated (always true) | `search-flags.ts:101` — hardcoded `return true` |
| 4 | resolveEffectiveScore() | Not documented | Shared function with cascading fallback | `pipeline/types.ts:56` — signature and purpose |

**P1 corrections (5 — high priority):**
| # | Error | Evidence |
|---|-------|----------|
| 5 | memory_update embedding scope (says title-only, actually title+content) | `memory-crud-update.ts:89-91` — `${title}\n\n${contentText}` |
| 6 | memory_delete cleanup scope (says 1 table, actually multi-table) | `memory-crud-delete.ts:74,80` — vectorIndex + causalEdges |
| 7 | Five-factor weight auto-normalization undocumented | `composite-scoring.ts:544-548` — recalculates when sum deviates >0.001 |
| 8 | R8 summary embedding channel missing from Stage 1 | `stage1-candidate-gen.ts:507-565` — R8 summary channel present |
| 9 | SPECKIT_ADAPTIVE_FUSION absent from feature flag docs | `adaptive-fusion.ts:65,74` — controls rollout policy |

**P2 corrections (4 — minor):**
10-13. Quality gate persistence, canonical ID dedup, memory_save summary gen, bulk_delete cleanup scope

### R2: Code Safety (P1)

**R2a: Math.max/min spread patterns (8 files, 25 total matches)**

Replace `Math.max(...array)` with safe reduce pattern. Stack overflow occurs at >100K elements, crashing Node.js process.

| File | Lines | Pattern | Confirmed By |
|------|:-----:|---------|:------------:|
| `search/rsf-fusion.ts` | 101-104, 210-211 | `Math.max(...scores)` | G2, G4 |
| `search/causal-boost.ts` | 227 | `Math.max(...values)` | G4 |
| `search/evidence-gap-detector.ts` | 157 | `Math.max(...gaps)` | G4 |
| `cognitive/prediction-error-gate.ts` | 484-485 | `Math.min(...similarities)` | G2, G5 |
| `telemetry/retrieval-telemetry.ts` | 184 | `Math.max(...scores)` | G2, G5 |
| `eval/reporting-dashboard.ts` | 303-304 | `Math.max/min(...)` | G2, G5 |
| + additional matches in tests and `shared/scoring/folder-scoring.ts` | various | various | G4 (25 total) |

**R2b: Session-manager transaction gap (NEW-1 — HIGH)**

`session-manager.ts:429-440` — `enforceEntryLimit` executes outside `db.transaction()` wrapper for `runBatch()`. Unlike the single-process handler gaps (mitigated by better-sqlite3), session batch operations may be triggered by multiple concurrent MCP requests, creating real race conditions that bypass maximum entry limits.

**R2c: stage2-fusion.ts docblock inconsistency**

Three-layer documentation drift: module header lists 11 steps (missing 2a), function docblock lists 9 steps (missing 2a, 8, 9), actual code has 12 steps.

### R3: Implementation-Summary Corrections (P1)

8 corrections discovered in deep-dives that never propagated to `implementation-summary.md`:

| # | Correction | Source | Target Section | Status |
|---|-----------|--------|:-:|--------|
| 1 | SQL 3/5 FALSE_POSITIVE (P1→P2) | Codex deep-dive | Section 6 | MISSING — still lists all 5 as P1 |
| 2 | Tool count 23→25 | Codex deep-dive | Exec Summary | FIXED — implementation-summary.md now says "25 MCP tools" |
| 3 | Signal count "12 stages, 9 score-affecting" | Codex deep-dive | Section 2 | CONTRADICTED — says "11" and "12" in different sections |
| 4 | Transaction boundary P1→P2 | Ultra-think meta-review | Section 6 | MISSING — still listed as P1 |
| 5 | retry-manager debunked (zero overlap) | Multi-agent deep review | Section 1 + 5 | CONTRADICTED — still recommends "move to shared/" |
| 6 | Phase D reindex entry point | Wave 1 Opus | Nowhere | MISSING — architecturally significant recommendation absent |
| 7 | stage2-fusion.ts docblock inconsistency | Ultra-think meta-review | Section 2/6 | MISSING — not documented |
| 8 | Positive confirmations (what NOT to change) | Wave 2 Opus | Nowhere | MISSING — only deficits listed |

### R4: Code Standards (P2)

| Item | Files | Evidence |
|------|-------|----------|
| Import standardization (relative → @spec-kit/ aliases) | 4+ files in scripts/ | 3/3 models confirmed `../../mcp_server/` bypassing aliases |
| Workspace deps missing | `scripts/package.json` | Depends on better-sqlite3 tension resolution |
| Hardcoded DB_PATH | `cleanup-orphaned-vectors.ts` + 3 others | `path.join(__dirname, '../../../mcp_server/database/...')` |
| AI-TRACE tag compliance | 3+ files | Task tokens lack `AI-TRACE` prefix |
| specFolderLocks naming | `memory-save.ts:64` | camelCase, should be UPPER_SNAKE_CASE |
| Import ordering | 3+ files | Convention violations |

---

## AI Bias Patterns Observed

| Model | Pattern | Impact | Evidence Items |
|-------|---------|--------|:-:|
| **Gemini** | Severity over-escalation | Every Gemini P1 cross-verified by another model was downgraded | 4 |
| **Codex** | Session truncation (tail-drop) | 30% of Wave 2 checklist unverified; synthesis hides incompleteness | 4 |
| **Opus** | Observation-over-recommendation | Thorough observation but hedged/absent actionable recommendations | 5 |

Details: `scratch/opus-synthesis-audit.md` Part 3

---

## Success Criteria

- [ ] All 4 P0 documentation errors in `summary_of_existing_features.md` fixed with file:line evidence
- [ ] All P1 code safety issues (Math.max 8 files, session tx gap) fixed and verified
- [ ] `implementation-summary.md` updated with all 8 propagated corrections; 0 internal contradictions
- [ ] `stage2-fusion.ts` header, docblock, and code all list 12 steps consistently
- [ ] Architecture health score verified at ≥77/100 post-remediation (target: ≥80)
- [ ] All 4 audit documents (master, registry, coverage, synthesis) internally consistent
- [ ] No cross-document contradictions on finding count, health score, A-IDs, or C138 status

---

## References

| Document | Location | Size | Purpose |
|----------|----------|:----:|---------|
| Master Consolidated Review | `scratch/master-consolidated-review.md` | 358 lines | Unified deliverable: all 33 findings, resolutions, action plan |
| Authoritative Findings Registry | `scratch/opus-findings-registry.md` | 153 lines | Definitive status for every finding with evidence |
| Coverage Gap Analysis | `scratch/opus-coverage-gaps.md` | 241 lines | Heatmap, new findings, 33-item tiered action plan |
| Synthesis Quality Audit | `scratch/opus-synthesis-audit.md` | 139 lines | Propagation failures, fabricated claims, AI bias patterns |
| Raw Wave Outputs | `scratch/z_archive/` | 19 files | Wave 1-4 agent outputs, deep-dives, meta-reviews |
| Session Memory | `memory/` | 1 file | Session context for continuation |
