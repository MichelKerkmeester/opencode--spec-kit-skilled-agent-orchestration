# Verification Findings Report — 140-hybrid-rag-fusion-refinement

> **Date:** 2026-02-28
> **Method:** 18-agent parallel verification (7 Opus + 11 Sonnet) across 2 waves
> **Scope:** All 8 sprints (S0–S7), source code, documentation, research corpus

---

## 1. Executive Summary

| Dimension              | Score   | Status                                                                        |
| ---------------------- | ------- | ----------------------------------------------------------------------------- |
| **Code Quality**       | PASS    | TypeScript compiles (0 errors), 5,797 tests pass (0 failures), 4 bug fixes correct |
| **Spec Quality**       | 8.2/10  | EXCELLENT band — 5 P1 issues, 7 P2 suggestions                               |
| **Research Quality**   | 8.9/10  | EXCELLENT band — multi-agent self-correcting methodology                      |
| **Sprint 0–3 Delivery**| 98%    | All tasks `[x]`, conditional proceed on dark-run metrics                      |
| **Sprint 4–7 Planning**| 100%   | All Level 2 docs complete, well-structured, NOT started                       |
| **Documentation Accuracy** | 79/100 | 7 cross-document contradictions found                                    |

**Bottom line:** The codebase is healthy and all implemented features work. Issues found are documentation accuracy problems — no code bugs discovered. **Sprints 4–7 are fully planned but have zero implementation work.**

---

## 2. Code Verification

### 2.1 Compilation & Tests

| Check                             | Result                                      |
| --------------------------------- | ------------------------------------------- |
| `npx tsc --noEmit`               | **PASS** — 0 errors                         |
| Full test suite                   | **5,797 passing** / 0 failing / 19 skipped / 196 files |
| Sprint-specific tests (t010–t043) | All passing                                 |

### 2.2 Working-Tree Changes (4 Correct Bug Fixes)

| File                           | Change                                              | Assessment                                                          |
| ------------------------------ | --------------------------------------------------- | ------------------------------------------------------------------- |
| `handlers/memory-context.ts`   | `enforced: true` → `false` on under-budget path     | **Correct** — telemetry was logically inverted                      |
| `handlers/memory-search.ts`    | `throw Error` → `createMCPErrorResponse` + `error` → `debug` | **Correct** — structured errors + log hygiene              |
| `lib/search/hybrid-search.ts`  | Direct property → `Object.defineProperty` for `_s3meta` | **Correct** — implements non-enumerable intent                  |
| `lib/cognitive/co-activation.ts`| Reported as DELETED                                 | **FALSE ALARM** — symlink architecture (`lib/cache/cognitive` → `../cognitive`), file is tracked and present |

### 2.3 Stale Dist Artifacts (Non-Blocking)

- 4 compiled test files in `dist/` reference old import path `lib/cognitive/co-activation`
- Runtime resolves correctly because source file exists at both paths (symlink)
- A `npm run build` will clean this up

---

## 3. Sprint Completion Status

| Sprint | Phase | Status          | Exit Gate                | Tests Added | Docs Level               |
| ------ | ----- | --------------- | ------------------------ | ----------- | ------------------------ |
| **S0** | 1/8   | **COMPLETE**    | 8/8 PASS                 | 268         | Level 2 (full)           |
| **S1** | 2/8   | **CONDITIONAL** | 4/6 PASS, 2 DEFERRED    | 262         | Level 2 (no handover)    |
| **S2** | 3/8   | **CONDITIONAL** | 7/8 PASS, 1 DEFERRED    | 182         | Level 2 (no handover)    |
| **S3** | 4/8   | **CONDITIONAL** | 5/7 PASS, 2 CONDITIONAL | 370+        | Level 2 (no handover)    |
| **S4** | 5/8   | **Draft**       | Not started              | –           | Level 2 (4 files)        |
| **S5** | 6/8   | **Draft**       | Not started              | –           | Level 2 (4 files)        |
| **S6** | 7/8   | **Draft**       | Not started              | –           | Level 2 (4 files)        |
| **S7** | 8/8   | **Draft**       | Not started              | –           | Level 2 (4 files + memory) |

**Total test count:** 5,797 across 196 files (from ~4,600 pre-Sprint 0)

---

## 4. Missing Implementation Summaries

Implementation summaries are required after implementation completes. Current status:

| Sprint | Has `implementation-summary.md`? | Status     |
| ------ | -------------------------------- | ---------- |
| S0     | Yes                              | Complete   |
| S1     | Yes                              | Complete   |
| S2     | Yes                              | Complete   |
| S3     | Yes                              | Complete   |
| **S4** | **No**                           | **Not implemented yet — needs implementation first** |
| **S5** | **No**                           | **Not implemented yet — needs implementation first** |
| **S6** | **No**                           | **Not implemented yet — needs implementation first** |
| **S7** | **No**                           | **Not implemented yet — needs implementation first** |

**Action required:** Sprints 4–7 need full implementation. Implementation summaries will be created after each sprint is completed.

---

## 5. Missing Handover Documents

| Sprint | Has `handover.md`? |
| ------ | ------------------ |
| S0     | Yes                |
| **S1** | **No**             |
| **S2** | **No**             |
| **S3** | **No**             |
| S4–S7  | N/A (not started)  |

**Note:** S2/S3 memory was saved at the parent (140) level rather than per-sprint. Implementation summaries partially compensate.

---

## 6. Deferred Items in Implemented Sprints (S1–S3)

These items were supposed to be completed but remain open:

### Sprint 1 — 4 Deferred P0 Items (CRITICAL)

| Item         | Priority | Description                                              | Reason                         |
| ------------ | -------- | -------------------------------------------------------- | ------------------------------ |
| CHK-S1-010   | **P0**   | R4 dark-run: no single memory >60% in results            | Requires live measurement      |
| CHK-S1-011   | **P0**   | R4 MRR@5 delta >+2% absolute over Sprint 0 baseline     | Requires live measurement      |
| CHK-S1-060   | **P0**   | Exit gate: MRR@5 delta >+2% verified via R13 eval       | Requires live measurement      |
| CHK-S1-061   | **P0**   | Exit gate: no single memory >60% presence in dark-run    | Requires live measurement      |

> **Impact:** These are the core R4 graph signal effectiveness validations. The sprint was marked done on *implementation correctness* but empirical signal quality was never verified.

### Sprint 2 — 1 Deferred P1 Item

| Item         | Priority | Description                                              | Reason                         |
| ------------ | -------- | -------------------------------------------------------- | ------------------------------ |
| CHK-S2-061   | P1       | N4 live dark-run: new memories surface without displacing old | Implementation verified; live dark-run deferred |

### Sprint 3 — 6 Deferred Items

| Item           | Priority | Description                                              | Reason                           |
| -------------- | -------- | -------------------------------------------------------- | -------------------------------- |
| T008 / PI-A2   | P1       | Search strategy degradation fallback chain               | DEFERRED — re-evaluate post-S3   |
| CHK-PI-B3-001  | P2       | descriptions.json generated from spec.md                 | Optional — impl done, unverified |
| CHK-PI-B3-002  | P2       | Orchestration layer folder lookup via descriptions.json  | Optional — impl done, unverified |
| CHK-PI-B3-003  | P2       | Cache invalidation on spec.md changes                    | Optional — impl done, unverified |
| CHK-PI-B3-004  | P2       | Graceful degradation without descriptions.json           | Optional — impl done, unverified |
| CHK-S3-075     | P2       | R12 mutual exclusion flag inactive at S3 exit            | Sprint 5 scope — not yet active  |

---

## 7. Features Still Marked as Planned — Full Inventory

**All features below are fully planned (spec, plan, tasks, checklist exist) but have ZERO implementation work done.** The user wants everything implemented.

### Sprint 4 — Feedback and Quality (Est. 64–97h)

| Task ID   | Feature                                                    | Flag/Gate                        |
| --------- | ---------------------------------------------------------- | -------------------------------- |
| T001      | R1 MPAB Chunk-to-Memory Aggregation + `computeMPAB()`     | `SPECKIT_DOCSCORE_AGGREGATION`   |
| T001a     | Chunk ordering preservation within documents               | Part of T001                     |
| T002      | R11 Learned Relevance Feedback (schema migration + 10 safeguards) | `SPECKIT_LEARN_FROM_SELECTION` |
| T002a     | Memory importance auto-promotion (threshold-based tier promotion) | Part of T002                |
| T002b     | Negative feedback confidence signal (demotion multiplier floor=0.3) | Part of T002              |
| T003      | R13-S2 Shadow Scoring + Channel Attribution + Ground Truth Phase B | —                         |
| T003a     | Exclusive Contribution Rate metric                         | Part of T003                     |
| T007      | TM-04 Pre-Storage Quality Gate (3-layer)                   | `SPECKIT_SAVE_QUALITY_GATE`      |
| T007a-d   | Structural validation → Content scoring → Semantic dedup → Warn-only | Part of T007            |
| T008      | TM-06 Reconsolidation-on-Save (merge/conflict/complement paths) | `SPECKIT_RECONSOLIDATION`   |
| T008a-e   | Checkpoint → Top-3 query → Merge ≥0.88 → Conflict 0.75-0.88 → Complement <0.75 | Part of T008 |
| T027a-b   | G-NEW-3 Ground Truth Diversification (Phase B + Phase C)   | —                                |
| T004-T006 | Sprint 4 verification + exit gate + feature flag audit     | —                                |

**Key risks:** CRITICAL FTS5 contamination risk (R11), 28-day calendar dependency for shadow period

### Sprint 5 — Pipeline Refactor (Est. 68–136h)

| Task ID   | Feature                                                    | Flag/Gate                        |
| --------- | ---------------------------------------------------------- | -------------------------------- |
| T002      | R6 4-Stage Pipeline Refactor (40–55h core)                 | `SPECKIT_PIPELINE_V2`            |
| T002a-h   | Stage architecture → Candidate gen → Fusion → Rerank → Filter → Integration → Flag testing → Dark-run | Part of T002 |
| T005      | R9 Spec Folder Pre-Filter                                  | —                                |
| T006      | R12 Query Expansion with R15 mutual exclusion              | `SPECKIT_EMBEDDING_EXPANSION`    |
| T007      | S2 Template Anchor Optimization                            | —                                |
| T008      | S3 Validation Signals as Retrieval Metadata                | —                                |
| T009a     | TM-05 Memory Auto-Surface Hooks at lifecycle points        | —                                |
| T011      | PI-B1 Tree Thinning for spec folder consolidation          | —                                |
| T012      | PI-B2 Progressive Validation (4-level pipeline)            | —                                |
| T013      | PI-A4 Constitutional Memory as Retrieval Directives        | —                                |

**Key risk:** Sprint 5 is overloaded (106–154h with PageIndex items). Recommend decomposing into S5a (pipeline) + S5b (search features).

### Sprint 6 — Indexing and Graph (Est. 70–108h)

**Sprint 6a: Practical Improvements**

| Task ID   | Feature                                                    | Flag/Gate                        |
| --------- | ---------------------------------------------------------- | -------------------------------- |
| T001d     | MR10 Mitigation — `weight_history` column for N3-lite      | —                                |
| T003      | R7 Anchor-Aware Chunk Thinning                             | —                                |
| T004      | R16 Encoding-Intent Capture at index time                  | `SPECKIT_ENCODING_INTENT`        |
| T006      | S4 Spec Folder Hierarchy as Retrieval Structure            | —                                |
| T002      | N3-Lite (contradiction scan + Hebbian + staleness)         | Blocked by T001d                 |
| T002a-e   | Contradiction scan → Hebbian strengthening → Staleness → Edge bounds → Cluster surfacing | Part of T002 |

**Sprint 6b: Graph Sophistication (GATED — requires spike)**

| Task ID   | Feature                                                    | Flag/Gate                        |
| --------- | ---------------------------------------------------------- | -------------------------------- |
| T-S6-SPIKE | Algorithm feasibility spike (Louvain vs. connected components) | Gate for S6b entry          |
| T001a     | N2a Graph Momentum (Temporal Degree Delta)                 | —                                |
| T001b     | N2b Causal Depth Signal                                    | —                                |
| T001c     | N2c Community Detection                                    | —                                |
| T005      | R10 Auto Entity Extraction                                 | `SPECKIT_AUTO_ENTITIES`          |

**Key risk:** Stale "Katz centrality" reference in plan.md contradicts spec OQ-S6-002 resolution

### Sprint 7 — Long Horizon (Est. 37–53h, ALL Optional P2/P3)

| Task ID   | Feature                                                    | Flag/Gate                        |
| --------- | ---------------------------------------------------------- | -------------------------------- |
| T001      | R8 Memory Summary Generation (gated on >5K memories)       | `SPECKIT_MEMORY_SUMMARIES`       |
| T002      | S1 Smarter Memory Content from Markdown                    | —                                |
| T003      | S5 Cross-Document Entity Linking (gated on >1K memories)   | `SPECKIT_ENTITY_LINKING`         |
| T004      | R13-S3 Full Reporting Dashboard + Ablation Framework       | —                                |
| T005      | R5 INT8 Quantization Evaluation                            | —                                |
| T005a     | Feature Flag Sunset Audit (program-wide)                   | —                                |
| T006a     | DEF-014 `structuralFreshness()` Disposition                | —                                |

**Key constraint:** Scale thresholds likely not met (<2K active memories vs 5K requirement). May need re-scoping.

---

## 8. Cross-Document Contradictions (7 Found)

All verified against source code to determine the authoritative answer:

| # | Contradiction                                      | Doc A                  | Doc B                       | **Source Truth**                    |
| - | -------------------------------------------------- | ---------------------- | --------------------------- | ----------------------------------- |
| 1 | RSF naming                                         | "Reciprocal Similarity Fusion" (sprint-1-3-features.md) | "Relative Score Fusion" (spec.md, summary_of_new_features.md) | **Relative Score Fusion** (rsf-fusion.ts line 1) |
| 2 | Moderate channel count                             | "4 channels" (summary docs) | "3 channels" (spec.md)    | **3 channels** (query-router.ts:54-58) |
| 3 | PREFERENCE keywords count                          | "3 keywords" (summary_of_new_features.md) | "7 keywords" (sprint-1-3-features.md) | **7 keywords** (trigger-matcher.ts:320-328) |
| 4 | Sprint 0 effort estimate                           | "50–77h" (spec.md)    | "56–89h" (plan.md/tasks.md) | **56–89h** (plan.md is authoritative for effort) |
| 5 | Feature flag system                                | "≤6 operative" (gate checks) | "8 absolute ceiling" (NFR-O01) | **Both correct** — two-tier system |
| 6 | Sprint 4 decomposition language                    | "should be considered" (spec.md) | "MUST be decomposed" (plan.md) | **plan.md** is authoritative |
| 7 | Sprint 1 gate status                               | T014 `[x]` PASSED (tasks.md) | 2 P0 `[ ]` DEFERRED (checklist.md) | **CONDITIONAL** (checklist is truth) |

---

## 9. spec.md Issues

| Issue                      | Detail                                                                  | Fix                                   |
| -------------------------- | ----------------------------------------------------------------------- | ------------------------------------- |
| REQ-062 phantom reference  | Referenced in plan/checklist but never defined in spec.md               | Add REQ-062 definition                |
| ADR-002 status             | Marked "Reserved" but actively used in plan.md and checklist.md         | Populate ADR-002 content              |
| Research cross-references  | Doc 9 vs doc 10 file numbers swapped in some references                | Correct cross-reference numbers       |

---

## 10. Issues — Priority Ranked

### P0: IMMEDIATE ACTION (~1.5h)

1. **Sprint 1 Gate Contradiction** — tasks.md T014 marked `[x]` PASSED, but checklist has 2 P0 items `[ ]` DEFERRED. Implementation-summary shows 5/5 PASS instead of CONDITIONAL PROCEED.
   - Fix: Update tasks.md T014, T006 sub-items, and implementation-summary gate table
   - Risk: Gate appears fraudulently passed; undermines trust in gate system

2. **Untracked Spec Documents** — 4 files (~176KB) at risk of loss:
   - `feature-catalog.md` (81KB), `summary_of_existing_features.md` (55KB), `summary_of_new_features.md` (40KB), memory file
   - Fix: `git add` and commit these files
   - Risk: Work lost on `git clean` or machine failure

3. **RSF Naming Conflict** — "Reciprocal Similarity Fusion" (sprint-1-3-features.md) vs "Relative Score Fusion" (source code, spec.md, summary_of_new_features.md)
   - Fix: Update sprint-1-3-features.md heading and body text

### P1: FIX THIS WEEK (~4h)

4. **Root Checklist Partial Desync** — ~90/201 items checked but ~130 should be based on S0–S3 completion evidence.
   - Fix: Cross-reference remaining unchecked items against sprint checklists

5. **Effort Estimate Mismatches** (4 instances):

   | Sprint | spec.md   | plan.md/tasks.md | Correct        |
   | ------ | --------- | ---------------- | -------------- |
   | S0     | 50–77h    | 56–89h           | **56–89h**     |
   | S3     | 42–66h    | Items sum 34–53h | **34–53h core**|
   | S6a    | 36–57h    | 33–51h           | **33–51h**     |
   | S6b    | 45–69h    | 37–53h           | **37–53h**     |

6. **Feature Flag Two-Tier System** — Gate checks enforce ≤6 but NFR-O01 says 8 and sunset schedule shows peak of 7. Both correct but poorly unified.
   - Fix: Add definitive two-tier statement to spec.md NFR section

7. **Sprint 4 Decomposition Language** — spec.md "should be considered" vs plan.md "MUST be decomposed."
   - Fix: Update spec.md to match plan.md mandatory language

8. **spec.md Issues** — REQ-062 phantom, ADR-002 "Reserved" but used, research cross-ref errors
   - Fix: Add REQ-062, populate ADR-002, correct cross-refs

### P2: FIX BEFORE S4 (~3h)

9. **Missing handover.md for Sprints 1–3** — Sprint 0 has comprehensive handover; S1–S3 do not.

10. **Memory Save Location Discrepancy** — S2/S3 checklists mark memory-save as `[x]` but no `memory/` folder exists in those sprints. Memory IS saved at parent level.

11. **Summary Doc Contradictions** — Moderate channel count (3, not 4), PREFERENCE keywords (7, not 3), folder scoring formula inconsistency

12. **Sprint 5 Overload** — Accumulates 106–154h when PageIndex items are included (2.5–3x typical sprint). Recommend decomposing into S5a (pipeline) + S5b (search features).

13. **Stale Dist Build** — 3 bug-fixed source files committed but `dist/` not rebuilt. Run `npm run build`.

---

## 11. What's Working Exceptionally Well

1. **Evaluation-First Discipline** — R13 infrastructure blocking all downstream work. BM25 contingency decision matrix prepared to invalidate own premise if data says so.
2. **Self-Correcting Research** — 25 research docs (~650KB) with explicit conflict resolution registers, evidence grading (A+ to D), and verification of verifiers (doc 8 found doc 7 was ~80% accurate).
3. **Sprint Architecture** — Logical progression (fix → measure → activate → calibrate → intelligence → off-ramp). S1/S2 parallelization correctly exploits non-overlapping subsystems.
4. **Governance** — Hard scope cap at S3, explicit off-ramps, checkpoint-before-risky-sprint protocol, feature flag sunset schedule with per-sprint dispositions.
5. **Risk Engineering** — 14 named risks, 9 dangerous interaction pairs, deploy disaster scenario for R11 FTS5 contamination. Three-way interaction risk (R4+N3+R10) identified.
6. **Test Investment** — 1,200+ new tests added across S0–S3 with cross-sprint integration tests. Zero test failures.

---

## 12. Remediation Plan

| Tier     | Scope                                                         | Effort | When          |
| -------- | ------------------------------------------------------------- | ------ | ------------- |
| **Tier 1** | P0 items (gate fix, git track, RSF rename)                  | ~1.5h  | **Now**       |
| **Tier 2** | P1 items (checklist sync, effort alignment, flag clarity)   | ~4h    | **This week** |
| **Tier 3** | P2 items (handovers, memory claims, Sprint 5 warning)       | ~3h    | **Before S4** |
| **Tier 4** | Polish (glossary, user stories, boundary blur)              | ~3h    | **Defer**     |

**Total remediation:** ~11.5h across all tiers (only ~1.5h urgent).

---

## 13. Recommended Next Steps

1. **Immediate:** Execute Tier 1 remediation (1.5h) — fix Sprint 1 gate status, track untracked files, fix RSF naming
2. **Complete S1–S3 deferred items:** Run live measurements for the 4 P0 Sprint 1 checklist items
3. **Begin Sprint 4 implementation:** This is the first fully-planned but unimplemented sprint
4. **Plan Sprint 5 decomposition:** Split into S5a + S5b before implementation
5. **Re-evaluate Sprint 7 scope:** Scale thresholds (<2K vs 5K memories) may require re-scoping or deferral

---

*Report generated by 18-agent parallel verification (7 Opus + 11 Sonnet) on 2026-02-28*
