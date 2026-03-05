# Master Consolidated Review: Phase 018-Refinement-Phase-7

> **Cross-AI Audit of 022-hybrid-rag-fusion**
> 50K+ LOC MCP Server | 21,887 LOC Scripts | 89 Feature Flags | 23-25 MCP Tools

**Generated:** 2026-03-02
**Method:** 8-agent orchestrated review (5 Gemini `gemini-3.1-pro-preview` + 3 Opus `claude-opus-4-6`)
**Orchestration:** Per `.agents/agents/orchestrate.md` — CWB Pattern A, TCB ≤8 per agent, depth 1 leaf
**Quality Gate:** All agent outputs scored ≥85/100

---

## 1. Executive Summary

### Verdict: Functionally Solid, Documentation Is the Critical Debt

The Spec Kit Memory MCP server is **architecturally sound** with no critical runtime bugs found in the 52% of code that received meaningful multi-wave review, plus automated pattern scanning across 100% of `mcp_server/lib/`. Two P1 findings carry plausible arguments for critical severity: Math.max stack overflow (8 files) and session-manager concurrency gap (NEW-1). The primary debt is **documentation accuracy** — the existing features summary has 13 errors (4 P0), and the implementation-summary.md suffers from synthesis propagation failure where corrections discovered in deep-dives never reached the final deliverables.

> **Coverage caveat:** Only 43% of `mcp_server/lib/` (21,515 LOC in search/ + scoring/) received deep multi-wave review. 26% (13,018 LOC across 15 directories) received only automated pattern scanning. G5 found issues in every area it scanned, suggesting comparable defect density may exist in unreviewed areas.

### Key Statistics

| Metric | Value |
|--------|-------|
| Total findings (verified) | **33** (4 P0, 15 P1, 11 P2, 3 LOW/P3) |
| VERIFIED | 11 |
| RESOLVED | 2 |
| FALSE_POSITIVE | 1 (retry-manager redundancy) |
| CORRECTED | 1 (C138 accusation by deep-review was wrong — C138 exists in source) |
| DOWNGRADED | 5 (SQL templates 3/5, transaction boundaries, tool count metadata, specFolderLocks, memory-save chunks) |
| UNVERIFIED | 6 (lower-priority P2 items) |
| New discoveries (this review) | 6 (incl. HIGH: session-manager tx gap) |
| Propagation failures | 8 (0 of 5 known failures were resolved) |
| Fabricated claims found | 4 (incl. meta-review itself fabricating a claim) |
| Cross-model agreement rate | 62% confirmed by 2+ models |
| Architecture health score | **77.4/100** |
| Total remediation effort | **~29.8 hours** across 3 tiers |

### Most Dangerous Finding

**P1-6: Math.max/min spread patterns** — 8 confirmed files use `Math.max(...array)` or `Math.min(...array)`, which causes stack overflow at >100K elements. Some files already have safe reduce patterns (intent-classifier.ts, rrf-fusion.ts), proving the fix pattern exists but wasn't applied universally. G4 found 25 active matches across the codebase.

### Most Surprising Finding

**The meta-review fabricated a claim while auditing fabrications.** The `most-recent-multi-agent-deep-review.md` accused the Wave 3 synthesis of fabricating a "C138" token — but C138 verifiably exists at `z_archive/wave3-gemini-mcp-standards.md:L32` (confirmed by direct source read, G3 Gemini audit, and ultra-think validation). The reviewer introduced the same class of error it was auditing for.

---

## 2. Authoritative Findings Registry

### Definitive Status for All Findings

| # | ID | Title | Original | Verified | Status | Evidence | Conf. |
|---|-----|-------|:--------:|:--------:|--------|----------|:-----:|
| 1 | P0-1 | Stage 2 signal count wrong in summary_of_existing_features.md | P0 | P0 | VERIFIED | G1: 12 steps, 9 score-affecting at `stage2-fusion.ts:404`. 3/3 models agree | 0.98 |
| 2 | P0-2 | Legacy V1 pipeline described as available (removed Phase 017) | P0 | P0 | VERIFIED | G1: `postSearchPipeline` zero implementation. Only removal comment at `memory-search.ts:599` | 0.98 |
| 3 | P0-3 | SPECKIT_PIPELINE_V2 described as active toggle (deprecated) | P0 | P0 | VERIFIED | G1: `isPipelineV2Enabled()` hardcoded `return true` at `search-flags.ts:101` | 0.98 |
| 4 | P0-4 | resolveEffectiveScore() not documented | P0 | P0 | VERIFIED | G1: Function at `pipeline/types.ts:56` with cascading fallback chain | 0.95 |
| 5 | P1-5 | SPECKIT_ADAPTIVE_FUSION missing from flag docs | P1 | P1 | VERIFIED | G2: Flag at `adaptive-fusion.ts:65,74`. Controls rollout. 2/3 agree | 0.92 |
| 6 | P1-6 | Math.max/min spread (stack overflow >100K) | P1 | P1 | VERIFIED | G2: 3 files confirmed. G4: 25 active matches. G5: expanded to 8 production files | 0.97 |
| 7 | P1-7 | memory_update embedding text wrong (title-only vs title+content) | P1 | P1 | VERIFIED | G2: `memory-crud-update.ts:89-91` passes `${title}\n\n${contentText}`. Doc says title-only | 0.95 |
| 8 | P1-8 | memory_delete cleanup scope wrong (1 table vs multi) | P1 | P1 | VERIFIED | G2: `memory-crud-delete.ts:74,80` cleans vectorIndex + causalEdges. Doc understates | 0.93 |
| 9 | P1-9 | Five-factor normalization not documented | P1 | P1 | VERIFIED | G2: `composite-scoring.ts:544-548` auto-normalization when sum deviates >0.001 | 0.90 |
| 10 | P1-10 | R8 summary channel missing from Stage 1 | P1 | P1 | VERIFIED | G2: `stage1-candidate-gen.ts:507-565` R8 summary embedding channel present | 0.93 |
| 11 | P1-11 | Mixed import patterns in scripts/ (relative paths) | P1 | P1 | VERIFIED | 3/3 models found `../../mcp_server/` bypassing `@spec-kit/` aliases | 0.90 |
| 12 | P1-12 | Missing workspace deps in scripts/package.json | P1 | P1 | RESOLVED | G4: AI-WHY fix comments + 0 `"workspace:` matches suggest resolution | 0.70 |
| 13 | P1-13 | Hardcoded DB path in cleanup-orphaned-vectors.ts | P1 | P1 | VERIFIED | 3/3 confirmed `path.join(__dirname, '../../../mcp_server/database/...')` in 3+ files | 0.92 |
| 14 | P1-14 | specFolderLocks naming (camelCase vs UPPER_SNAKE) | P1 | P1 | DOWNGRADED | G2: `memory-save.ts:64`. Code style, not functional. Effectively P2 | 0.88 |
| 15 | P1-15 | Import ordering + AI-TRACE tags | P1 | P1 | VERIFIED | Wave 3 Gemini confirmed. Task tokens lack `AI-TRACE` prefix | 0.85 |
| 16 | P2-16 | SQL template literals (5 files) | P1 | P2 | DOWNGRADED | Codex proved 3/5 FALSE_POSITIVE. Remaining 2 = P2 code style. Opus: no SQL injection | 0.96 |
| 17 | P2-17 | Transaction wrappers (3 handlers) | P1 | P2 | DOWNGRADED | Single-process better-sqlite3 = no concurrency risk. Self-healing covers crash | 0.93 |
| 18 | P2-18 | stage2-fusion.ts docblock inconsistency (header=11, docblock=9, code=12) | P2 | P2 | VERIFIED | Meta-review identified 3-layer internal doc drift | 0.95 |
| 19 | P2-19 | spec.md metadata tool count stale (23 vs 25) | P0 | P2 | DOWNGRADED | Codex proved doc table has all 25. Only spec.md metadata line stale | 0.96 |
| 20 | P2-20 | "89 feature flags" claim unverified | P2 | P2 | UNVERIFIED | 20 flags in search-flags.ts. Total 89 across all sources never verified | 0.50 |
| 21 | P2-21 | Duplicate deps in scripts/package.json | P2 | P2 | UNVERIFIED | Low risk (harmless duplication) | 0.60 |
| 22 | P2-22 | quality-scorer/topic-extractor could move to shared/ | P2 | P2 | UNVERIFIED | Architecture recommendation. retry-manager move debunked separately | 0.65 |
| 23 | P2-23 | File header format (19/20 files) | P2 | P2 | UNVERIFIED | Consistent internal convention. Divergent from sk-code--opencode standard | 0.80 |
| 24 | P2-24 | Narrative comments (19/20 files) | P2 | P2 | UNVERIFIED | Same as P2-23. Cosmetic only | 0.80 |
| 25 | P2-25 | isFeatureEnabled() treats "1" as disabled | P2 | P2 | UNVERIFIED | Opus only. Potential inconsistency between rollout-policy.ts and search-flags.ts | 0.65 |
| 26 | P2-26 | Co-activation spreading missing from docs | P2 | P2 | VERIFIED | Step 2a causes inconsistency across header, docblock, and new_features docs | 0.85 |

### Additional Findings (Not in Original tasks.md)

> **ID alignment note:** A-IDs below match the Authoritative Findings Registry (`opus-findings-registry.md`). A6/A7 are process findings.

| # | ID | Title | Severity | Status | Evidence | Conf. |
|---|-----|-------|:--------:|--------|----------|:-----:|
| A1 | FP-1 | retry-manager redundancy assertion | P2 | FALSE_POSITIVE | Zero functional overlap: generic backoff vs 500-line embedding retry queue with DB ops | 0.98 |
| A2 | CORRECTED | C138 accusation by deep-review was wrong | — | CORRECTED | Deep-review accused synthesis of fabricating C138. Source verification: C138 exists at `z_archive/wave3-gemini-mcp-standards.md:L32`. The accusation was itself incorrect | 0.97 |
| A3 | NEW-1 | Session-manager transaction gap | HIGH | VERIFIED | G5: `session-manager.ts:429-440` — enforceEntryLimit outside db.transaction(). Real concurrency risk | 0.85 |
| A4 | NEW-2 | retry-manager TODO (persistent embedding cache) | LOW | VERIFIED | G5: `retry-manager.ts:219` — REQ-S2-001 unimplemented | 0.80 |
| A5 | NEW-3 | content-normalizer TODO placeholder | LOW | VERIFIED | G5: `content-normalizer.ts:62` — leftover comment | 0.80 |
| A6 | PROC-1 | Synthesis propagation failure | P1 | VERIFIED | 8 corrections never reached implementation-summary.md | 0.95 |
| A7 | PROC-2 | Missing wave4-synthesis.md | P2 | VERIFIED | tasks.md marks `[x]` but file does not exist | 0.90 |

---

## 3. Contradiction Resolution Log

### 1. Signal Count: "11" vs "12" vs "9"

- **Before:** Opus said 11, Gemini said 12, Codex said "12 stages, 9 score-affecting"
- **After:** **"12 processing steps (9 score-affecting)"**
- **Evidence:** G1 verified all 12 steps at `stage2-fusion.ts:335-515`. 3/3 models agree on 12 total.

### 2. SQL Template Literals: "P1 security" vs "P2 style"

- **Before:** Gemini rated 5 files P1 security risk
- **After:** 3/5 = **FALSE_POSITIVE** (fixed fragments, not user input). 2/5 = **P2 code style**
- **Evidence:** Codex `deep-dive-codex-verification.md`. All interpolated values from internal logic.

### 3. Tool Count: "23" vs "25"

- **Before:** Gemini said 25 in code but 23 in docs. Codex said 25 in both.
- **After:** Code has 25, doc table has 25. Only spec.md metadata says "23" (stale).
- **Evidence:** Codex verified all 25 across L1-L7 tiers in `tool-schemas.ts`.

### 4. Transaction Boundaries: "P1" vs "P2"

- **Before:** Gemini and Codex rated P1. Opus rated P2.
- **After:** **P2** — single-process better-sqlite3, no concurrency risk. Self-healing covers crashes.
- **Evidence:** Meta-review L143: "Classify as P2 improvement, not P1 requirement"

### 5. retry-manager: "Possible redundancy" vs "Zero overlap"

- **Before:** Opus flagged possible redundancy → synthesis escalated to "move to shared/"
- **After:** **FALSE_POSITIVE** — completely different modules
- **Evidence:** shared/ = generic backoff. mcp_server/ = 500-line embedding retry queue with DB ops.

### 6. C138: "Fabricated by synthesis" vs "Actually exists in source"

- **Before:** Deep-review claimed C138 was fabricated by Wave 3 synthesis
- **After:** **C138 EXISTS** at `z_archive/wave3-gemini-mcp-standards.md:L32` and `z_archive/wave3-synthesis.md:L22`. The accusation was wrong.
- **Evidence:** Direct source verification confirmed the token. G3 Gemini consistency audit independently confirmed. Ultra-think meta-review further validated this resolution.
- **Lesson:** The meta-review layer introduced the same class of error it was auditing for. Review layers need automated source-tag verification.

---

## 4. Synthesis Propagation Failure Map

8 corrections discovered in deep-dives that **never reached** `implementation-summary.md`:

| # | Correction | Source | Target | Status |
|---|-----------|--------|--------|--------|
| 1 | SQL 3/5 false positive (P1→P2) | `deep-dive-codex-verification.md` SQL Safety table | Section 6 still lists all 5 as P1 | **MISSING** |
| 2 | Tool count 23→25 | `deep-dive-codex-verification.md` Tool Count row | Executive Summary still says "23 MCP tools" | **MISSING** |
| 3 | Signal count "12 stages, 9 score-affecting" | `deep-dive-codex-verification.md` Doc Accuracy | S2 says "11", S6 says "12". Neither uses Codex's precise framing | **CONTRADICTED** |
| 4 | Transaction boundary P1→P2 | `ultra-think-opus-meta-review.md` L143 | S6 still lists P1. tasks.md updated but impl-summary not | **MISSING** |
| 5 | retry-manager debunked (zero overlap) | `most-recent-multi-agent-deep-review.md` S1 | S1 still calls it "a shim"; S5 still says "Move to shared/" | **CONTRADICTED** |
| 6 | Phase D reindex entry point | `wave1-opus-import-map.md` L291 | Nowhere in impl-summary | **MISSING** |
| 7 | Stage 2 docblock inconsistency | `ultra-think-opus-meta-review.md` | Neither S2 nor S6 documents it | **MISSING** |
| 8 | Positive confirmations O-1 to O-5 | `wave2-opus-cross-reference.md` | Only deficits listed; no "what works" | **MISSING** |

**Root cause:** No back-propagation gate existed in the workflow. Deep-dives were performed AFTER synthesis was written, and no step required updating upstream documents with corrections.

---

## 5. AI Bias Pattern Documentation

### Gemini: Severity Over-Escalation

Every Gemini P1 that was cross-verified by another model was downgraded.

| # | Finding | Gemini Rating | Corrected | Source |
|---|---------|:------------:|:---------:|--------|
| 1 | SQL template literals (3/5 safe) | P1 | P2 | Codex deep-dive |
| 2 | Code standards (cosmetic headers) | P1 | P2 | Codex rated same type as P2 |
| 3 | Tool count (claimed 2 undocumented) | P1 | Non-issue | Codex: all 25 documented |
| 4 | Eval script location | P1 | P2 | Opus: coupling justified |

**Recommendation:** Treat Gemini P1 ratings as preliminary until independently confirmed.

### Codex: Session Truncation

Systematic tail-drop bias from context limits, hidden in synthesis.

| # | Impact | Source |
|---|--------|--------|
| 1 | 3/10 Wave 2 checklist items unverified (hit session limit) | `wave2-codex-existing-features.md:L33-37` |
| 2 | Synthesis grades "A-" without disclosing Codex's incomplete coverage | `most-recent-multi-agent-deep-review.md:L213` |
| 3 | Tool count error (item in unverified tail) | `wave2-codex-existing-features.md:L35` |
| 4 | 2/5 SQL files "not explicitly checked" — verdict inferred | `deep-dive-codex-verification.md` |

**Recommendation:** Mandate session-limit disclosure in synthesis. Score fidelity against verified items only.

### Opus: Observation-Over-Recommendation

Thorough observation with hedged/absent recommendations.

| # | Finding | Hedging Language | Source |
|---|---------|-----------------|--------|
| 1 | retry-manager redundancy | "**may be** redundant **if**..." | `wave1-opus-import-map.md:L64` |
| 2 | Transaction boundaries | "**Worth noting** for future..." | `wave4-opus-phase017-bugs.md:L376` |
| 3 | specFolderLock limitation | "acknowledged in code comments" — stops at observation | `wave4-opus-phase017-bugs.md:L374` |
| 4 | Reindex entry point | "**consider** having mcp_server export..." | `wave1-opus-import-map.md:L291` |
| 5 | Null-typing inconsistency | "**would be** cleaner" | `wave4-opus-phase017-bugs.md:L419` |

**Recommendation:** When Opus flags "investigate" or "consider", synthesis should either investigate immediately or track as an explicit open question. Never silently convert to a recommendation.

---

## 6. Coverage Gap Analysis

### Coverage Heatmap (mcp_server/lib/ — 50,060 LOC)

| Level | Directories | LOC | % of lib/ |
|-------|:-----------:|----:|:---------:|
| **DEEP** (multi-wave + deep-dives) | 2 (search/, scoring/) | 21,515 | 43% |
| **MODERATE** (focused wave analysis) | 1 (handlers/) | 9,911 | (separate) |
| **LIGHT** (mentions + G5 findings) | 6 (cognitive/, telemetry/, eval/, providers/, session/, parsing/) | 15,527 | 31% |
| **SCAN** (G5 pattern scan only) | 15 (storage/, cache/, errors/, graph/, etc.) | 13,018 | 26% |

### Biggest Blind Spots

| Rank | Area | LOC | Risk |
|:----:|------|----:|------|
| 1 | **eval/** | 7,051 | 14% of lib/. Ablation framework, shadow scoring. Complex logic, only G5 scan. |
| 2 | **storage/** | 4,831 | 10% of lib/. Database ops, migration. Largest unreviewed directory. |
| 3 | **cognitive/** | 3,795 | 8% of lib/. Working memory, archival. Complex stateful logic. |

---

## 7. New Discoveries (This Review)

| ID | File | Line | Severity | Description |
|----|------|:----:|:--------:|-------------|
| NEW-1 | `session/session-manager.ts` | 429-440 | **HIGH** | `enforceEntryLimit` outside `db.transaction()` for `runBatch()`. Concurrent MCP requests can race past limits. Real concurrency risk (unlike single-process handler gaps). |
| NEW-2 | `providers/retry-manager.ts` | 219 | LOW | Unimplemented persistent embedding cache (REQ-S2-001). Retries from scratch under rate-limit starvation. |
| NEW-3 | `parsing/content-normalizer.ts` | 62 | LOW | Leftover `<!-- TODO: remove -->` placeholder. |
| NEW-4 | Math.max spread expansion | — | P1 | Count expanded from 6 to 8 confirmed production files after G5 scan of uncovered areas. |
| META-1 | Deep-review C138 false accusation | — | — | Meta-review fabricated a claim about fabrication. C138 verifiably exists in source. Self-referential error class. |

---

## 8. Prioritized Action Plan

### Tier 1: Immediate (~5.25 hours)

| ID | Description | Severity | Files | Effort |
|----|-------------|:--------:|-------|:------:|
| T1-1 | Fix summary_of_existing_features.md — 4 P0 corrections (signal count, V1 pipeline, PIPELINE_V2, resolveEffectiveScore) | P0 | 1 file | 1.5h |
| T1-2 | Fix summary_of_existing_features.md — 5 P1 corrections (memory_update, memory_delete, normalization, R8, ADAPTIVE_FUSION) | P1 | 1 file | 1.0h |
| T1-3 | Fix summary_of_existing_features.md — 4 P2 corrections | P2 | 1 file | 0.5h |
| T1-4 | Fix Math.max/min spread in 8 files — replace with `arr.reduce((a,b) => Math.max(a,b), -Infinity)` | P1 | 8 files | 1.0h |
| T1-5 | Fix session-manager.ts tx gap — move enforceEntryLimit inside db.transaction() | P1 | 1 file | 0.5h |
| T1-6 | Fix implementation-summary.md — propagate Codex corrections (tool count, SQL, signal count) | P1 | 1 file | 0.5h |
| T1-7 | Fix stage2-fusion.ts internal docs — update header + docblock to list all 12 steps | P2 | 1 file | 0.25h |

### Tier 2: Near-Term (~4.85 hours)

| ID | Description | Severity | Effort |
|----|-------------|:--------:|:------:|
| T2-1 | Standardize scripts/ imports to @spec-kit/ aliases (4 files) | P1 | 1.0h |
| T2-2 | Add workspace deps to scripts/package.json | P1 | 0.5h |
| T2-3 | Extract DB_PATH constant to shared/config.ts | P1 | 0.5h |
| T2-4 | Fix AI-TRACE compliance (3+ files) | P1 | 0.5h |
| T2-5 | Add transaction wrappers to update + single-delete handlers | P2 | 0.5h |
| T2-6 | Fix BM25 trigger phrase re-index gate (title OR triggerPhrases) | P2 | 0.25h |
| T2-7 | Investigate dual dist paths in reindex-embeddings.ts | P1 | 0.25h |
| T2-8 | Resolve better-sqlite3 dependency tension | P1 | 0.5h |
| T2-9 | Fix P1 code standards (specFolderLocks naming, import ordering) | P1 | 0.5h |
| T2-10 | Create wave4-synthesis.md or correct tasks.md checkbox | P2 | 0.25h |
| T2-11 | Correct C138 false accusation in deep-review (or annotate) | P2 | 0.1h |

### Tier 3: Future (~19.7 hours)

15 items including: code standards alignment pass (2.5h), transaction boundary audit across storage/graph/learning (2.0h), deep review of eval/ (3.0h), cognitive/ (2.0h), storage/ (2.0h), verify "89 flags" claim (1.0h), error/circuit-breaker analysis (2.0h), and more.

### Effort Summary

| Tier | Items | Optimistic Est. | Realistic Est. | Window |
|------|:-----:|:--------------:|:--------------:|--------|
| Tier 1: Immediate | 7 | **5.25h** | 8-10h | This session / next spec |
| Tier 2: Near-Term | 11 | **4.85h** | 8-12h | Within 2 specs |
| Tier 3: Future | 15 | **19.7h** | 50-70h | Dedicated spec(s) |
| **Grand Total** | **33** | **~29.8h** | **~66-92h** | |

> **Effort estimate caveat (per ultra-think review):** Optimistic estimates assume 37-40 LOC/minute for deep review and 7.5 minutes per file for code fixes including testing. Realistic estimates apply 1.5-2x multiplier for Tiers 1-2 (comprehension, testing, edge cases) and 2.5-3.5x for Tier 3 (honest deep-review durations for eval/, storage/, cognitive/). Plan resourcing against realistic column.

---

## 9. Methodology Notes

### Phase A: Gemini Context Gathering (5 agents)

All source code reading delegated to Gemini CLI to prevent Claude context overload.

| Agent | Task | Lines Output | Status |
|-------|------|:-----------:|--------|
| G1 | P0 verification (4 findings) | 580 | All 4 CONFIRMED with file:line |
| G2 | P1 verification (7 findings) | 827 | All 7 CONFIRMED with file:line |
| G3 | Implementation-summary consistency | 985 | Found contradictions + missing corrections |
| G4 | Git history for resolved findings | 560 | Most findings still OPEN |
| G5 | Coverage gap scan (uncovered areas) | 592 | 1 HIGH + 2 LOW new findings |

Note: All 5 agents hit Gemini API 429 rate limits initially but succeeded on retry (~550-950 lines of errors before content).

### Phase B: Opus Deep Analysis (3 agents)

| Agent | Task | Quality | Key Contribution |
|-------|------|:-------:|------------------|
| O1 | Authoritative Findings Registry | 90/100 | Definitive status for all 26+4 findings |
| O2 | Synthesis Quality & Propagation Audit | 90/100 | 8 propagation failures, C138 meta-finding |
| O3 | Coverage Gap Analysis & Action Plan | 88/100 | Full heatmap, 33-item tiered plan |

### Phase C: Assembly

Orchestrator synthesized all outputs into this document with targeted reads (self-protection per orchestrate.md §8).

---

## Appendix A: Architecture Health Score

| Dimension | Score | Weight | Weighted | Notes |
|-----------|:-----:|:------:|:--------:|-------|
| Functional Correctness | 94/100 | 30% | 28.2 | Zero critical bugs. Math.max spread latent (-3). Session tx gap (-3). |
| Code Safety | 83/100 | 20% | 16.6 | SQL parameterization excellent. 8 spread files (-8). 4 tx gaps (-6). |
| Documentation Accuracy | 52/100 | 15% | 7.8 | summary_of_new_features perfect. summary_of_existing has 13 errors. impl-summary propagation failures. |
| Architecture Cleanliness | 78/100 | 15% | 11.7 | Monorepo correct. No circular deps. 10 scripts bypass shared (-12). |
| Code Standards | 58/100 | 10% | 5.8 | 19/20 fail sk-code--opencode (consistent internal, divergent from standard). |
| Maintainability | 73/100 | 10% | 7.3 | AI-WHY comments excellent. Doc drift hurts onboarding (-15). |
| **TOTAL** | | **100%** | **77.4** | |

---

## Appendix B: Cross-Model Agreement Matrix

**Full Agreement (3/3 models) — 10 findings:**
P0-1 (signal count), P0-2 (V1 pipeline), P0-3 (PIPELINE_V2), P0-4 (resolveEffectiveScore), P1-7 (memory_update), P1-8 (memory_delete), P1-10 (R8 channel), P1-11 (imports), P1-13 (hardcoded path), P2-16 (SQL downgrade)

**Strong Agreement (2/3 models) — 5 findings:**
P1-5 (ADAPTIVE_FUSION), P1-9 (normalization), P2-19 (tool count), P2-23 (headers), P2-24 (comments)

**Single-Model — 4 findings:**
P2-20 (89 flags), P2-25 (isFeatureEnabled), FP-1 (retry-manager)

**Corrected (cross-verified):**
C138: Deep-review accused synthesis of fabrication → source verification + G3 + ultra-think confirmed C138 is real (3/4 verification sources agree)

---

## Appendix C: Unverified Items

6 findings could not be code-verified during this audit:

| ID | Title | Reason | Risk |
|----|-------|--------|------|
| P2-20 | "89 feature flags" claim | No model counted all flag sources | Low — informational only |
| P2-21 | Duplicate deps | Not code-verified | Low — harmless duplication |
| P2-22 | Module moves to shared/ | Architecture recommendation | Low — no functional impact |
| P2-23 | File header format | Confirmed visually, not line-counted | Low — cosmetic |
| P2-24 | Narrative comments | Same as P2-23 | Low — cosmetic |
| P2-25 | isFeatureEnabled "1" quirk | Opus only, no cross-verification | Medium — potential inconsistency |

---

## Appendix D: Recommendations for Future Multi-AI Audits

1. **Back-propagation gate** — After any deep-dive correction, require explicit propagation checklist updating all upstream documents.
2. **Synthesis provenance tags** — Every claim should carry `[SRC: file:line]` tags for automated fabrication detection.
3. **Session-limit disclosure** — Mandate coverage caveat when any agent hits limits. Score fidelity against verified items only.
4. **Severity confirmation protocol** — Single-model P1+ ratings listed as "unconfirmed" until cross-verified.
5. **Wave completeness artifact check** — `ls scratch/waveN-synthesis.md` before marking checkbox.
6. **Hedged recommendation escalation** — "Needs investigation" must be investigated or tracked. Never silently convert to definitive.
7. **Meta-review self-consistency** — The review layer must apply the same verification standard it demands of the synthesis (C138 lesson).
