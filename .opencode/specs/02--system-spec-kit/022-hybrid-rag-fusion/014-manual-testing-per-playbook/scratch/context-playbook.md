# Manual Testing Playbook -- Per-Category Summary

> Generated: 2026-03-22
> Source: `.opencode/skill/system-spec-kit/manual_testing_playbook/`
> Purpose: Source of truth for rewriting spec documentation in 014-manual-testing-per-playbook

---

## 01--retrieval
Scenario files: 11
Exact IDs: EX-001, M-001, EX-002, M-002, EX-003, EX-004, EX-005, 086, 109, 142, 143
Total exact IDs: 11
Files:
1. 001-context-recovery-and-continuation.md — "M-001 -- Context Recovery and Continuation"
2. 001-unified-context-retrieval-memory-context.md — "EX-001 -- Unified context retrieval (memory_context)"
3. 002-semantic-and-lexical-search-memory-search.md — "EX-002 -- Semantic and lexical search (memory_search)"
4. 002-targeted-memory-lookup.md — "M-002 -- Targeted Memory Lookup"
5. 003-trigger-phrase-matching-memory-match-triggers.md — "EX-003 -- Trigger phrase matching (memory_match_triggers)"
6. 004-hybrid-search-pipeline.md — "EX-004 -- Hybrid search pipeline"
7. 005-4-stage-pipeline-architecture.md — "EX-005 -- 4-stage pipeline architecture"
8. 086-bm25-trigger-phrase-re-index-gate.md — "086 -- BM25 trigger phrase re-index gate"
9. 109-quality-aware-3-tier-search-fallback.md — "109 -- Quality-aware 3-tier search fallback"
10. 142-session-transition-trace-contract.md — "142 -- Session transition trace contract"
11. 143-bounded-graph-walk-rollout-and-diagnostics.md — "143 -- Bounded graph-walk rollout and diagnostics"

---

## 02--mutation
Scenario files: 9
Exact IDs: EX-006, EX-007, M-008, EX-008, EX-009, EX-010, 085, 101, 110
Total exact IDs: 9
Files:
1. 006-memory-indexing-memory-save.md — "EX-006 -- Memory indexing (memory_save)"
2. 007-memory-metadata-update-memory-update.md — "EX-007 -- Memory metadata update (memory_update)"
3. 008-feature-09-direct-manual-scenario-per-memory-history-log.md — "M-008 -- Feature 09 Direct Manual Scenario (Per-memory History Log)"
4. 008-single-and-folder-delete-memory-delete.md — "EX-008 -- Single and folder delete (memory_delete)"
5. 009-tier-based-bulk-deletion-memory-bulk-delete.md — "EX-009 -- Tier-based bulk deletion (memory_bulk_delete)"
6. 010-validation-feedback-memory-validate.md — "EX-010 -- Validation feedback (memory_validate)"
7. 085-transaction-wrappers-on-mutation-handlers.md — "085 -- Transaction wrappers on mutation handlers"
8. 101-memory-delete-confirm-schema-tightening.md — "101 -- memory_delete confirm schema tightening"
9. 110-prediction-error-save-arbitration.md — "110 -- Prediction-error save arbitration"

---

## 03--discovery
Scenario files: 3
Exact IDs: EX-011, EX-012, EX-013
Total exact IDs: 3
Files:
1. 011-memory-browser-memory-list.md — "EX-011 -- Memory browser (memory_list)"
2. 012-system-statistics-memory-stats.md — "EX-012 -- System statistics (memory_stats)"
3. 013-health-diagnostics-memory-health.md — "EX-013 -- Health diagnostics (memory_health)"

---

## 04--maintenance
Scenario files: 2
Exact IDs: EX-014, EX-035
Total exact IDs: 2
Files:
1. 014-workspace-scanning-and-indexing-memory-index-scan.md — "EX-014 -- Workspace scanning and indexing (memory_index_scan)"
2. 035-startup-runtime-compatibility-guards.md — "EX-035 -- Startup runtime compatibility guards"

---

## 05--lifecycle
Scenario files: 10
Exact IDs: EX-015, EX-016, EX-017, EX-018, 097, 100, 114, 124, 134, 144
Total exact IDs: 10
Files:
1. 015-checkpoint-creation-checkpoint-create.md — "EX-015 -- Checkpoint creation (checkpoint_create)"
2. 016-checkpoint-listing-checkpoint-list.md — "EX-016 -- Checkpoint listing (checkpoint_list)"
3. 017-checkpoint-restore-checkpoint-restore.md — "EX-017 -- Checkpoint restore (checkpoint_restore)"
4. 018-checkpoint-deletion-checkpoint-delete.md — "EX-018 -- Checkpoint deletion (checkpoint_delete)"
5. 097-async-ingestion-job-lifecycle-p0-3.md — "097 -- Async ingestion job lifecycle (P0-3)"
6. 100-async-shutdown-with-deadline-server-lifecycle.md — "100 -- Async shutdown with deadline (server lifecycle)"
7. 114-path-traversal-validation-p0-4.md — "114 -- Path traversal validation (P0-4)"
8. 124-automatic-archival-lifecycle-coverage.md — "124 -- Automatic archival lifecycle coverage"
9. 134-startup-pending-file-recovery-lifecycle-coverage.md — "134 -- Startup pending-file recovery lifecycle coverage"
10. 144-advisory-ingest-lifecycle-forecast.md — "144 -- Advisory ingest lifecycle forecast"

---

## 06--analysis
Scenario files: 7
Exact IDs: EX-019, EX-020, EX-021, EX-022, EX-023, EX-024, EX-025
Total exact IDs: 7
Files:
1. 019-causal-edge-creation-memory-causal-link.md — "EX-019 -- Causal edge creation (memory_causal_link)"
2. 020-causal-graph-statistics-memory-causal-stats.md — "EX-020 -- Causal graph statistics (memory_causal_stats)"
3. 021-causal-edge-deletion-memory-causal-unlink.md — "EX-021 -- Causal edge deletion (memory_causal_unlink)"
4. 022-causal-chain-tracing-memory-drift-why.md — "EX-022 -- Causal chain tracing (memory_drift_why)"
5. 023-epistemic-baseline-capture-task-preflight.md — "EX-023 -- Epistemic baseline capture (task_preflight)"
6. 024-post-task-learning-measurement-task-postflight.md — "EX-024 -- Post-task learning measurement (task_postflight)"
7. 025-learning-history-memory-get-learning-history.md — "EX-025 -- Learning history (memory_get_learning_history)"

---

## 07--evaluation
Scenario files: 2
Exact IDs: EX-026, EX-027
Total exact IDs: 2
Files:
1. 026-ablation-studies-eval-run-ablation.md — "EX-026 -- Ablation studies (eval_run_ablation)"
2. 027-reporting-dashboard-eval-reporting-dashboard.md — "EX-027 -- Reporting dashboard (eval_reporting_dashboard)"

---

## 08--bug-fixes-and-data-integrity
Scenario files: 11
Exact IDs: 001, 002, 003, 004, 065, 068, 075, 083, 084, 116, 117
Total exact IDs: 11
Files:
1. 001-graph-channel-id-fix-g1.md — "001 -- Graph channel ID fix (G1)"
2. 002-chunk-collapse-deduplication-g3.md — "002 -- Chunk collapse deduplication (G3)"
3. 003-co-activation-fan-effect-divisor-r17.md — "003 -- Co-activation fan-effect divisor (R17)"
4. 004-sha-256-content-hash-deduplication-tm-02.md — "004 -- SHA-256 content-hash deduplication (TM-02)"
5. 065-database-and-schema-safety.md — "065 -- Database and schema safety"
6. 068-guards-and-edge-cases.md — "068 -- Guards and edge cases"
7. 075-canonical-id-dedup-hardening.md — "075 -- Canonical ID dedup hardening"
8. 083-math-max-min-stack-overflow-elimination.md — "083 -- Math.max/min stack overflow elimination"
9. 084-session-manager-transaction-gap-fixes.md — "084 -- Session-manager transaction gap fixes"
10. 116-chunking-safe-swap-atomicity-p0-6.md — "116 -- Chunking safe swap atomicity (P0-6)"
11. 117-sqlite-datetime-session-cleanup-p0-7.md — "117 -- SQLite datetime session cleanup (P0-7)"

---

## 09--evaluation-and-measurement
Scenario files: 16
Exact IDs: 005, 006, 007, 008, 009, 010, 011, 012, 013, 014, 015, 072, 082, 088, 090, 126
Total exact IDs: 16
Files:
1. 005-evaluation-database-and-schema-r13-s1.md — "005 -- Evaluation database and schema (R13-S1)"
2. 006-core-metric-computation-r13-s1.md — "006 -- Core metric computation (R13-S1)"
3. 007-observer-effect-mitigation-d4.md — "007 -- Observer effect mitigation (D4)"
4. 008-full-context-ceiling-evaluation-a2.md — "008 -- Full-context ceiling evaluation (A2)"
5. 009-quality-proxy-formula-b7.md — "009 -- Quality proxy formula (B7)"
6. 010-synthetic-ground-truth-corpus-g-new-1-g-new-3-phase-a.md — "010 -- Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A)"
7. 011-bm25-only-baseline-g-new-1.md — "011 -- BM25-only baseline (G-NEW-1)"
8. 012-agent-consumption-instrumentation-g-new-2.md — "012 -- Agent consumption instrumentation (G-NEW-2)"
9. 013-scoring-observability-t010.md — "013 -- Scoring observability (T010)"
10. 014-full-reporting-and-ablation-study-framework-r13-s3.md — "014 -- Full reporting and ablation study framework (R13-S3)"
11. 015-shadow-scoring-and-channel-attribution-r13-s2.md — "015 -- Shadow scoring and channel attribution (R13-S2)"
12. 072-test-quality-improvements.md — "072 -- Test quality improvements"
13. 082-evaluation-and-housekeeping-fixes.md — "082 -- Evaluation and housekeeping fixes"
14. 088-cross-ai-validation-fixes-tier-4.md — "088 -- Cross-AI validation fixes (Tier 4)"
15. 090-int8-quantization-evaluation-r5.md — "090 -- INT8 quantization evaluation (R5)"
16. 126-memory-roadmap-baseline-snapshot.md — "126 -- Memory roadmap baseline snapshot"

---

## 10--graph-signal-activation
Scenario files: 15
Exact IDs: 016, 017, 018, 019, 020, 021, 022, 081, 091, 120, 156, 157, 158, 174, 175
Total exact IDs: 15
Files:
1. 016-typed-weighted-degree-channel-r4.md — "016 -- Typed-weighted degree channel (R4)"
2. 017-co-activation-boost-strength-increase-a7.md — "017 -- Co-activation boost strength increase (A7)"
3. 018-edge-density-measurement.md — "018 -- Edge density measurement"
4. 019-weight-history-audit-tracking.md — "019 -- Weight history audit tracking"
5. 020-graph-momentum-scoring-n2a.md — "020 -- Graph momentum scoring (N2a)"
6. 021-causal-depth-signal-n2b.md — "021 -- Causal depth signal (N2b)"
7. 022-community-detection-n2c.md — "022 -- Community detection (N2c)"
8. 081-graph-and-cognitive-memory-fixes.md — "081 -- Graph and cognitive memory fixes"
9. 091-implemented-graph-centrality-and-community-detection-n2.md — "091 -- Implemented: graph centrality and community detection (N2)"
10. 120-unified-graph-rollback-and-explainability-phase-3.md — "120 -- Unified graph rollback and explainability (Phase 3)"
11. 156-graph-refresh-mode-speckit-graph-refresh-mode.md — "156 -- Graph refresh mode (SPECKIT_GRAPH_REFRESH_MODE)"
12. 157-llm-graph-backfill-speckit-llm-graph-backfill.md — "157 -- LLM graph backfill (SPECKIT_LLM_GRAPH_BACKFILL)"
13. 158-graph-calibration-profile-speckit-graph-calibration-profile.md — "158 -- Graph calibration profile (SPECKIT_GRAPH_CALIBRATION_PROFILE)"
14. 174-graph-concept-routing-speckit-graph-concept-routing.md — "174 -- Graph concept routing (SPECKIT_GRAPH_CONCEPT_ROUTING)"
15. 175-typed-traversal-speckit-typed-traversal.md — "175 -- Typed traversal (SPECKIT_TYPED_TRAVERSAL)"

---

## 11--scoring-and-calibration
Scenario files: 22
Exact IDs: 023, 024, 025, 026, 027, 028, 029, 030, 031, 032, 066, 074, 079, 098, 102, 118, 121, 159, 160, 170, 171, 172
Total exact IDs: 22
Files:
1. 023-score-normalization.md — "023 -- Score normalization"
2. 024-cold-start-novelty-boost-n4.md — "024 -- Cold-start novelty boost (N4)"
3. 025-interference-scoring-tm-01.md — "025 -- Interference scoring (TM-01)"
4. 026-classification-based-decay-tm-03.md — "026 -- Classification-based decay (TM-03)"
5. 027-folder-level-relevance-scoring-pi-a1.md — "027 -- Folder-level relevance scoring (PI-A1)"
6. 028-embedding-cache-r18.md — "028 -- Embedding cache (R18)"
7. 029-double-intent-weighting-investigation-g2.md — "029 -- Double intent weighting investigation (G2)"
8. 030-rrf-k-value-sensitivity-analysis-fut-5.md — "030 -- RRF K-value sensitivity analysis (FUT-5)"
9. 031-negative-feedback-confidence-signal-a4.md — "031 -- Negative feedback confidence signal (A4)"
10. 032-auto-promotion-on-validation-t002a.md — "032 -- Auto-promotion on validation (T002a)"
11. 066-scoring-and-ranking-corrections.md — "066 -- Scoring and ranking corrections"
12. 074-stage-3-effectivescore-fallback-chain.md — "074 -- Stage 3 effectiveScore fallback chain"
13. 079-scoring-and-fusion-corrections.md — "079 -- Scoring and fusion corrections"
14. 098-local-gguf-reranker-via-node-llama-cpp-p1-5.md — "098 -- Local GGUF reranker via node-llama-cpp (P1-5)"
15. 102-node-llama-cpp-optionaldependencies.md — "102 -- node-llama-cpp optionalDependencies"
16. 118-stage-2-score-field-synchronization-p0-8.md — "118 -- Stage-2 score field synchronization (P0-8)"
17. 121-adaptive-shadow-proposal-and-rollback-phase-4.md — "121 -- Adaptive shadow proposal and rollback (Phase 4)"
18. 159-learned-stage2-combiner-speckit-learned-stage2-combiner.md — "159 -- Learned Stage 2 combiner (SPECKIT_LEARNED_STAGE2_COMBINER)"
19. 160-shadow-feedback-speckit-shadow-feedback.md — "160 -- Shadow feedback (SPECKIT_SHADOW_FEEDBACK)"
20. 170-fusion-policy-shadow-v2-speckit-fusion-policy-shadow-v2.md — "170 -- Fusion policy shadow v2 (SPECKIT_FUSION_POLICY_SHADOW_V2)"
21. 171-calibrated-overlap-bonus-speckit-calibrated-overlap-bonus.md — "171 -- Calibrated overlap bonus (SPECKIT_CALIBRATED_OVERLAP_BONUS)"
22. 172-rrf-k-experimental-speckit-rrf-k-experimental.md — "172 -- RRF K experimental (SPECKIT_RRF_K_EXPERIMENTAL)"

---

## 12--query-intelligence
Scenario files: 10
Exact IDs: 033, 034, 035, 036, 037, 038, 161, 162, 163, 173
Total exact IDs: 10
Files:
1. 033-query-complexity-router-r15.md — "033 -- Query complexity router (R15)"
2. 034-relative-score-fusion-in-shadow-mode-r14-n1.md — "034 -- Relative score fusion in shadow mode (R14/N1)"
3. 035-channel-min-representation-r2.md — "035 -- Channel min-representation (R2)"
4. 036-confidence-based-result-truncation-r15-ext.md — "036 -- Confidence-based result truncation (R15-ext)"
5. 037-dynamic-token-budget-allocation-fut-7.md — "037 -- Dynamic token budget allocation (FUT-7)"
6. 038-query-expansion-r12.md — "038 -- Query expansion (R12)"
7. 161-llm-reformulation-speckit-llm-reformulation.md — "161 -- LLM reformulation (SPECKIT_LLM_REFORMULATION)"
8. 162-hyde-speckit-hyde.md — "162 -- HyDE (SPECKIT_HYDE)"
9. 163-query-surrogates-speckit-query-surrogates.md — "163 -- Query surrogates (SPECKIT_QUERY_SURROGATES)"
10. 173-query-decomposition-speckit-query-decomposition.md — "173 -- Query decomposition (SPECKIT_QUERY_DECOMPOSITION)"

---

## 13--memory-quality-and-indexing
Scenario files: 27
Exact IDs: M-003, M-005, M-005a, M-005b, M-005c, M-006, M-006a, M-006b, M-006c, 039, 040, 041, 042, 043, 044, 045, 046, 047, 048, 069, 073, 092, 111, 119, 131, 132, 133, 155, 155-F, 164, 165, 176, 177, 178
Total exact IDs: 34
Files:
1. 003-context-save-index-update.md — "M-003 -- Context Save + Index Update"
2. 005-outsourced-agent-memory-capture-round-trip.md — "M-005 -- Outsourced Agent Memory Capture Round-Trip"
   - Sub-scenarios: M-005a (JSON-mode hard-fail), M-005b (nextSteps persistence), M-005c (Verification freshness)
3. 006-session-enrichment-and-alignment-guardrails.md — "M-006 -- Session Enrichment and Alignment Guardrails"
   - Sub-scenarios: M-006a (Unborn-HEAD and dirty snapshot fallback), M-006b (Detached-HEAD snapshot preservation), M-006c (Similar-folder boundary protection)
4. 039-verify-fix-verify-memory-quality-loop-pi-a5.md — "039 -- Verify-fix-verify memory quality loop (PI-A5)"
5. 040-signal-vocabulary-expansion-tm-08.md — "040 -- Signal vocabulary expansion (TM-08)"
6. 041-pre-flight-token-budget-validation-pi-a3.md — "041 -- Pre-flight token budget validation (PI-A3)"
7. 042-spec-folder-description-discovery-pi-b3.md — "042 -- Spec folder description discovery (PI-B3)"
8. 043-pre-storage-quality-gate-tm-04.md — "043 -- Pre-storage quality gate (TM-04)"
9. 044-reconsolidation-on-save-tm-06.md — "044 -- Reconsolidation-on-save (TM-06)"
10. 045-smarter-memory-content-generation-s1.md — "045 -- Smarter memory content generation (S1)"
11. 046-anchor-aware-chunk-thinning-r7.md — "046 -- Anchor-aware chunk thinning (R7)"
12. 047-encoding-intent-capture-at-index-time-r16.md — "047 -- Encoding-intent capture at index time (R16)"
13. 048-auto-entity-extraction-r10.md — "048 -- Auto entity extraction (R10)"
14. 069-entity-normalization-consolidation.md — "069 -- Entity normalization consolidation"
15. 073-quality-gate-timer-persistence.md — "073 -- Quality gate timer persistence"
16. 092-implemented-auto-entity-extraction-r10.md — "092 -- Implemented: auto entity extraction (R10)"
17. 111-deferred-lexical-only-indexing.md — "111 -- Deferred lexical-only indexing"
18. 119-memory-filename-uniqueness-ensureuniquememoryfilename.md — "119 -- Memory filename uniqueness (ensureUniqueMemoryFilename)"
19. 131-description-json-batch-backfill-validation-pi-b3.md — "131 -- Description.json batch backfill validation (PI-B3)"
20. 132-description-json-schema-field-validation.md — "132 -- description.json schema field validation"
21. 133-dry-run-preflight-for-memory-save.md — "133 -- Dry-run preflight for memory_save"
22. 155-post-save-quality-review.md — "155 -- Post-save quality review"
    - Sub-scenario: 155-F (Score penalty advisory logging)
23. 164-batch-learned-feedback-speckit-batch-learned-feedback.md — "164 -- Batch learned feedback (SPECKIT_BATCH_LEARNED_FEEDBACK)"
24. 165-assistive-reconsolidation-speckit-assistive-reconsolidation.md — "165 -- Assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION)"
25. 176-implicit-feedback-log-speckit-implicit-feedback-log.md — "176 -- Implicit feedback log (SPECKIT_IMPLICIT_FEEDBACK_LOG)"
26. 177-hybrid-decay-policy-speckit-hybrid-decay-policy.md — "177 -- Hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY)"
27. 178-save-quality-gate-exceptions-speckit-save-quality-gate-exceptions.md — "178 -- Save quality gate exceptions (SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS)"

---

## 14--pipeline-architecture
Scenario files: 18
Exact IDs: 049, 050, 051, 052, 053, 054, 067, 071, 076, 078, 080, 087, 095, 112, 115, 129, 130, 146
Total exact IDs: 18
Files:
1. 049-4-stage-pipeline-refactor-r6.md — "049 -- 4-stage pipeline refactor (R6)"
2. 050-mpab-chunk-to-memory-aggregation-r1.md — "050 -- MPAB chunk-to-memory aggregation (R1)"
3. 051-chunk-ordering-preservation-b2.md — "051 -- Chunk ordering preservation (B2)"
4. 052-template-anchor-optimization-s2.md — "052 -- Template anchor optimization (S2)"
5. 053-validation-signals-as-retrieval-metadata-s3.md — "053 -- Validation signals as retrieval metadata (S3)"
6. 054-learned-relevance-feedback-r11.md — "054 -- Learned relevance feedback (R11)"
7. 067-search-pipeline-safety.md — "067 -- Search pipeline safety"
8. 071-performance-improvements.md — "071 -- Performance improvements"
9. 076-activation-window-persistence.md — "076 -- Activation window persistence"
10. 078-legacy-v1-pipeline-removal.md — "078 -- Legacy V1 pipeline removal"
11. 080-pipeline-and-mutation-hardening.md — "080 -- Pipeline and mutation hardening"
12. 087-db-path-extraction-and-import-standardization.md — "087 -- DB_PATH extraction and import standardization"
13. 095-strict-zod-schema-validation-p0-1.md — "095 -- Strict Zod schema validation (P0-1)"
14. 112-cross-process-db-hot-rebinding.md — "112 -- Cross-process DB hot rebinding"
15. 115-transaction-atomicity-on-rename-failure-p0-5.md — "115 -- Transaction atomicity on rename failure (P0-5)"
16. 129-lineage-state-active-projection-and-asof-resolution.md — "129 -- Lineage state active projection and asOf resolution"
17. 130-lineage-backfill-rollback-drill.md — "130 -- Lineage backfill rollback drill"
18. 146-dynamic-server-instructions-p1-6.md — "146 -- Dynamic server instructions (P1-6)"

---

## 15--retrieval-enhancements
Scenario files: 11
Exact IDs: 055, 056, 057, 058, 059, 060, 077, 093, 094, 096, 145
Total exact IDs: 11
Files:
1. 055-dual-scope-memory-auto-surface-tm-05.md — "055 -- Dual-scope memory auto-surface (TM-05)"
2. 056-constitutional-memory-as-expert-knowledge-injection-pi-a4.md — "056 -- Constitutional memory as expert knowledge injection (PI-A4)"
3. 057-spec-folder-hierarchy-as-retrieval-structure-s4.md — "057 -- Spec folder hierarchy as retrieval structure (S4)"
4. 058-lightweight-consolidation-n3-lite.md — "058 -- Lightweight consolidation (N3-lite)"
5. 059-memory-summary-search-channel-r8.md — "059 -- Memory summary search channel (R8)"
6. 060-cross-document-entity-linking-s5.md — "060 -- Cross-document entity linking (S5)"
7. 077-tier-2-fallback-channel-forcing.md — "077 -- Tier-2 fallback channel forcing"
8. 093-implemented-memory-summary-generation-r8.md — "093 -- Implemented: memory summary generation (R8)"
9. 094-implemented-cross-document-entity-linking-s5.md — "094 -- Implemented: cross-document entity linking (S5)"
10. 096-provenance-rich-response-envelopes-p0-2.md — "096 -- Provenance-rich response envelopes (P0-2)"
11. 145-contextual-tree-injection-p1-4.md — "145 -- Contextual tree injection (P1-4)"

---

## 16--tooling-and-scripts
Scenario files: 28
Exact IDs: PHASE-001, PHASE-002, PHASE-003, M-004, PHASE-004, PHASE-005, M-007, M-007a, M-007b, M-007c, M-007d, M-007e, M-007f, M-007g, M-007h, M-007i, M-007j, M-007k, M-007l, M-007m, M-007n, M-007o, M-007p, M-007q, 061, 062, 070, 089, 099, 108, 113, 127, 128, 135, 136, 137, 138, 139, 147, 149, 150, 151, 152, 153, 153-A, 153-B, 153-C, 153-D, 153-E, 153-F, 153-G, 153-H, 153-I, 153-J, 153-K, 153-L, 153-M, 153-N, 153-O, 154
Total exact IDs: 60
Files:
1. 001-phase-detection-scoring.md — "PHASE-001 -- Phase detection scoring"
2. 002-phase-folder-creation.md — "PHASE-002 -- Phase folder creation"
3. 003-recursive-phase-validation.md — "PHASE-003 -- Recursive phase validation"
4. 004-main-agent-review-and-verdict-handoff.md — "M-004 -- Main-Agent Review and Verdict Handoff"
5. 004-phase-link-validation.md — "PHASE-004 -- Phase link validation"
6. 005-phase-command-workflow.md — "PHASE-005 -- Phase command workflow"
7. 007-session-capturing-pipeline-quality.md — "M-007 -- Session Capturing Pipeline Quality"
   - Sub-scenarios: M-007a (JSON authority and successful indexing), M-007b (Thin JSON insufficiency rejection), M-007c (Explicit-CLI mis-scoped captured-session warning), M-007d (Spec-folder and git-context enrichment presence), M-007e (OpenCode precedence), M-007f (Claude fallback), M-007g (Codex fallback), M-007h (Copilot fallback), M-007i (Gemini fallback), M-007j (Final NO_DATA_AVAILABLE hard-fail), M-007k (V10-only captured-session save warns), M-007l (V8/V9 captured-session contamination abort), M-007m (--stdin structured JSON with explicit CLI target), M-007n (--json structured JSON with payload-target fallback), M-007o (Claude tool-path downgrade vs non-Claude capped path), M-007p (Structured-summary JSON coverage and file-backed authority), M-007q (Phase 018 output-quality hardening)
8. 061-tree-thinning-for-spec-folder-consolidation-pi-b1.md — "061 -- Tree thinning for spec folder consolidation (PI-B1)"
9. 062-progressive-validation-for-spec-documents-pi-b2.md — "062 -- Progressive validation for spec documents (PI-B2)"
10. 070-dead-code-removal.md — "070 -- Dead code removal"
11. 089-code-standards-alignment.md — "089 -- Code standards alignment"
12. 099-real-time-filesystem-watching-p1-7.md — "099 -- Real-time filesystem watching (P1-7)"
13. 108-spec-007-finalized-verification-command-suite-evidence.md — "108 -- Spec 007 finalized verification command suite evidence"
14. 113-standalone-admin-cli.md — "113 -- Standalone admin CLI"
15. 127-migration-checkpoint-scripts.md — "127 -- Migration checkpoint scripts"
16. 128-schema-compatibility-validation.md — "128 -- Schema compatibility validation"
17. 135-grep-traceability-for-feature-catalog-code-references.md — "135 -- Grep traceability for feature catalog code references"
18. 136-feature-catalog-annotation-name-validity.md — "136 -- Feature catalog annotation name validity"
19. 137-multi-feature-annotation-coverage.md — "137 -- Multi-feature annotation coverage"
20. 138-module-header-compliance-via-verify-alignment-drift-py.md — "138 -- MODULE: header compliance via verify_alignment_drift.py"
21. 139-session-capturing-pipeline-quality.md — "139 -- Session capturing pipeline quality"
22. 147-constitutional-memory-manager-command.md — "147 -- Constitutional memory manager command"
23. 149-rendered-memory-template-contract.md — "149 -- Rendered memory template contract"
24. 150-source-dist-alignment-validation.md — "150 -- Source-dist alignment validation"
25. 151-module-map-accuracy.md — "151 -- MODULE_MAP.md accuracy validation"
26. 152-no-symlinks-in-lib-tree.md — "152 -- No symlinks in lib/ tree"
27. 153-json-mode-hybrid-enrichment.md — "153 -- JSON mode structured summary hardening"
    - Sub-scenarios: 153-A (Post-save quality review output verification), 153-B (sessionSummary propagates to frontmatter title), 153-C (triggerPhrases propagate to frontmatter trigger_phrases), 153-D (keyDecisions propagate to non-zero decision_count), 153-E (importanceTier propagates to frontmatter importance_tier), 153-F (contextType propagates for full documented valid enum), 153-G (Contamination filter cleans hedging in sessionSummary), 153-H (Fast-path filesModified to FILES conversion), 153-I (Unknown field warning for typos), 153-J (contextType enum rejection), 153-K (Quality score discriminates contaminated vs clean), 153-L (Trigger phrase filter removes path fragments), 153-M (Embedding retry stats visible in memory_health), 153-N (Default-on pre-save overlap warning uses exact content match), 153-O (projectPhase override propagates to frontmatter)
28. 154-json-primary-deprecation-posture.md — "154 -- JSON-primary deprecation posture"

---

## 17--governance
Scenario files: 5
Exact IDs: 063, 064, 122, 123, 148
Total exact IDs: 5
Files:
1. 063-feature-flag-governance.md — "063 -- Feature flag governance"
2. 064-feature-flag-sunset-audit.md — "064 -- Feature flag sunset audit"
3. 122-governed-ingest-and-scope-isolation-phase-5.md — "122 -- Governed ingest and scope isolation (Phase 5)"
4. 123-shared-space-deny-by-default-rollout-phase-6.md — "123 -- Shared-space deny-by-default rollout (Phase 6)"
5. 148-shared-memory-disabled-by-default-and-first-run-setup.md — "148 -- Shared-memory disabled-by-default and first-run setup"

---

## 18--ux-hooks
Scenario files: 11
Exact IDs: 103, 104, 105, 106, 107, 166, 167, 168, 169, 179, 180
Total exact IDs: 11
Files:
1. 103-ux-hook-module-coverage-mutation-feedback-response-hints.md — "103 -- UX hook module coverage (mutation-feedback, response-hints)"
2. 104-mutation-save-path-ux-parity-and-no-op-hardening.md — "104 -- Mutation save-path UX parity and no-op hardening"
3. 105-context-server-success-envelope-finalization.md — "105 -- Context-server success-envelope finalization"
4. 106-hooks-barrel-readme-synchronization.md — "106 -- Hooks barrel + README synchronization"
5. 107-checkpoint-confirmname-and-schema-enforcement.md — "107 -- Checkpoint confirmName and schema enforcement"
6. 166-result-explain-v1-speckit-result-explain-v1.md — "166 -- Result explain v1 (SPECKIT_RESULT_EXPLAIN_V1)"
7. 167-response-profile-v1-speckit-response-profile-v1.md — "167 -- Response profile v1 (SPECKIT_RESPONSE_PROFILE_V1)"
8. 168-progressive-disclosure-v1-speckit-progressive-disclosure-v1.md — "168 -- Progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE_V1)"
9. 169-session-retrieval-state-v1-speckit-session-retrieval-state-v1.md — "169 -- Session retrieval state v1 (SPECKIT_SESSION_RETRIEVAL_STATE_V1)"
10. 179-empty-result-recovery-speckit-empty-result-recovery-v1.md — "179 -- Empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY_V1)"
11. 180-result-confidence-speckit-result-confidence-v1.md — "180 -- Result confidence (SPECKIT_RESULT_CONFIDENCE_V1)"

---

## 19--feature-flag-reference
Scenario files: 8
Exact IDs: EX-028, EX-029, EX-030, EX-031, EX-032, EX-033, EX-034, 125
Total exact IDs: 8
Files:
1. 028-1-search-pipeline-features-speckit.md — "EX-028 -- 1. Search Pipeline Features (SPECKIT_*)"
2. 029-2-session-and-cache.md — "EX-029 -- 2. Session and Cache"
3. 030-3-mcp-configuration.md — "EX-030 -- 3. MCP Configuration"
4. 031-4-memory-and-storage.md — "EX-031 -- 4. Memory and Storage"
5. 032-5-embedding-and-api.md — "EX-032 -- 5. Embedding and API"
6. 033-6-debug-and-telemetry.md — "EX-033 -- 6. Debug and Telemetry"
7. 034-7-ci-and-build-informational.md — "EX-034 -- 7. CI and Build (informational)"
8. 125-hydra-roadmap-capability-flags.md — "125: Hydra roadmap capability flags"

---

## GRAND TOTALS

| Category | Scenario Files | Exact IDs |
|----------|---------------|-----------|
| 01--retrieval | 11 | 11 |
| 02--mutation | 9 | 9 |
| 03--discovery | 3 | 3 |
| 04--maintenance | 2 | 2 |
| 05--lifecycle | 10 | 10 |
| 06--analysis | 7 | 7 |
| 07--evaluation | 2 | 2 |
| 08--bug-fixes-and-data-integrity | 11 | 11 |
| 09--evaluation-and-measurement | 16 | 16 |
| 10--graph-signal-activation | 15 | 15 |
| 11--scoring-and-calibration | 22 | 22 |
| 12--query-intelligence | 10 | 10 |
| 13--memory-quality-and-indexing | 27 | 34 |
| 14--pipeline-architecture | 18 | 18 |
| 15--retrieval-enhancements | 11 | 11 |
| 16--tooling-and-scripts | 28 | 60 |
| 17--governance | 5 | 5 |
| 18--ux-hooks | 11 | 11 |
| 19--feature-flag-reference | 8 | 8 |
| **TOTAL** | **226** | **265** |

### Sub-scenario breakdown (files with more IDs than the file count)

| File | Parent ID | Sub-IDs | Count |
|------|-----------|---------|-------|
| 13/005-outsourced-agent-memory-capture-round-trip.md | M-005 | M-005a, M-005b, M-005c | +3 |
| 13/006-session-enrichment-and-alignment-guardrails.md | M-006 | M-006a, M-006b, M-006c | +3 |
| 13/155-post-save-quality-review.md | 155 | 155-F | +1 |
| 16/007-session-capturing-pipeline-quality.md | M-007 | M-007a..M-007q | +17 |
| 16/153-json-mode-hybrid-enrichment.md | 153 | 153-A..153-O | +15 |
| **Sub-scenario surplus** | | | **+39** |

> 226 scenario files + 39 sub-scenario surplus = 265 total exact IDs
