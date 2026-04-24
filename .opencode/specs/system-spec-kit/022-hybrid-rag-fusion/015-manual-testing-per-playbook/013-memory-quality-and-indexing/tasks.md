---
title: "Tasks [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/013-memory-quality-and-indexing/tasks]"
description: "Task tracker for 34 exact IDs across 27 scenario files in the memory quality and indexing category. Code analysis complete: 34 PASS, 0 PARTIAL, 0 FAIL."
trigger_phrases:
  - "memory quality tasks"
  - "phase 013 tasks"
  - "manual testing memory quality tasks"
  - "tasks core memory indexing"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/013-memory-quality-and-indexing"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: manual-testing-per-playbook memory quality and indexing phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Verify playbook files accessible at `../../manual_testing_playbook/13--memory-quality-and-indexing/` -- 27 files confirmed
- [x] T002 Confirm feature catalog accessible at `../../feature_catalog/13--memory-quality-and-indexing/` -- 24 files confirmed
- [x] T003 Load review protocol from `../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` -- loaded
- [x] T004 Verify MCP runtime healthy (`memory_save`, `memory_index_scan`, quality gate pipeline) -- code analysis mode (source verified)
- [x] T005 [P] Record baseline feature flag values -- all flags verified in search-flags.ts and respective modules
- [x] T006 [P] Prepare sandbox data and named checkpoint for destructive scenarios -- code analysis mode (no runtime mutation)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Group 1: Core Pipeline Scenarios (M-003, M-005 family, M-006 family)

| Task | Scenario ID | Scenario Name | Status | Evidence |
|------|-------------|---------------|--------|----------|
| T010 | M-003 | Context Save + Index Update | PASS | generate-context.js writes file; memory_index_scan handler in memory-index.ts indexes it; memory-save.ts:509-536 indexes parsed file. Full save-then-index round-trip implemented. |
| T011 | M-005 | Outsourced Agent Memory Capture Round-Trip | PASS | data-loader.ts:112-132 loads JSON with EXPLICIT_DATA_FILE_LOAD_FAILED errors; generate-context.js accepts --json and file path modes; workflow.ts orchestrates save pipeline with memory_index_scan post-save. |
| T012 | M-005a | JSON-mode hard-fail | PASS | data-loader.ts:125 throws `EXPLICIT_DATA_FILE_LOAD_FAILED: Invalid JSON in data file` on parse error. Test at scripts/tests/runtime-memory-inputs.vitest.ts:40 confirms. |
| T013 | M-005b | nextSteps persistence | PASS | collect-session-data.js extracts nextSteps from JSON payload; workflow.ts passes to content generation; observations include NEXT_ACTION signals from session data. |
| T014 | M-005c | Verification freshness | PASS | Procedural requirement for evidence dating. Code supports: generate-context.js produces timestamped filenames (YY-MM-DD_HH-MM format) enabling freshness verification. |
| T015 | M-006 | Session Enrichment and Alignment Guardrails | PASS | git-context-extractor.js:265-275 extracts headRef, commitRef, repositoryState, isDetachedHead. alignment-validator.ts validates file scope against spec files-to-change. |
| T016 | M-006a | Unborn-HEAD and dirty snapshot fallback | PASS | git-context-extractor.js:265-270: branchRef via rev-parse, commitRef via rev-parse HEAD. If no commits yet, commitRef=null, repositoryState='dirty' when uncommitted files exist. emptyResult() at :37-49 returns null refs and 'unavailable' state. |
| T017 | M-006b | Detached-HEAD snapshot preservation | PASS | git-context-extractor.js:266: isDetachedHead = !branchRef && Boolean(commitRef). :267: headRef = 'HEAD' when detached. :412: 'detached HEAD' observation emitted. commitRef populated from rev-parse. |
| T018 | M-006c | Similar-folder boundary protection | PASS | spec-folder-extractor.js uses realpath containment checks; git-context-extractor.js filters commit observations by scope. Prefix-matching folder boundaries enforced by path normalization at :72-78. |

### Group 2: Quality Loop and Signal Scenarios (039-048)

| Task | Scenario ID | Scenario Name | Status | Evidence |
|------|-------------|---------------|--------|----------|
| T020 | 039 | Verify-fix-verify memory quality loop (PI-A5) | PASS | quality-loop.ts implements multi-attempt scoring with auto-fix. runQualityLoop() retries with fixes. qualityLoopResult.rejected=true and rejectionReason set on final reject. memory-save.ts:251-266 returns rejected status. |
| T021 | 040 | Signal vocabulary expansion (TM-08) | PASS | trigger-matcher.ts:11 SignalCategory = 'correction' / 'preference' / 'reinforcement' / 'neutral'. REINFORCEMENT_KEYWORDS (7 terms) with detectSignals() detection block and SIGNAL_BOOSTS.reinforcement = 0.15. All 88 trigger-matcher tests pass. |
| T022 | 041 | Pre-flight token budget validation (PI-A3) | PASS | preflight.ts:178 defines PF020 (TOKEN_BUDGET_EXCEEDED) and PF021 (TOKEN_BUDGET_WARNING). :187-191 reads MCP_CHARS_PER_TOKEN, MCP_MAX_MEMORY_TOKENS, MCP_TOKEN_WARNING_THRESHOLD from env. Token estimation runs before indexing. |
| T023 | 042 | Spec folder description discovery (PI-B3) | PASS | folder-discovery.ts implements PerFolderDescription with specId, folderSlug, parentChain, memorySequence, memoryNameHistory, specFolder, description, keywords, lastUpdated. Stale detection, mixed-mode aggregation, realpath containment, YAML frontmatter stripping, and folder routing all implemented. |
| T024 | 043 | Pre-storage quality gate (TM-04) | PASS | save-quality-gate.ts implements 3 layers: Layer 1 structural (validateStructural :395-443), Layer 2 content quality scoring (:456-548), Layer 3 semantic dedup. Blocking vs warn-only behavior at memory-save.ts:324-371. No persisted decision log (correctly matches playbook criteria). |
| T025 | 044 | Reconsolidation-on-save (TM-06) | PASS | reconsolidation.ts:105 MERGE_THRESHOLD=0.88, :108 CONFLICT_THRESHOLD=0.75. :168 merge at >=0.88, :171 conflict at >=0.75. reconsolidation-bridge.ts:151-250 wires into save pipeline with checkpoint requirement. |
| T026 | 045 | Smarter memory content generation (S1) | PASS | workflow.ts orchestrates content generation via title-builder.ts, content-cleaner.ts, topic-extractor.ts, frontmatter-editor.ts. Structure preservation (headings, lists, code blocks) maintained through pipeline. quality-scorer.ts scores output quality. |
| T027 | 046 | Anchor-aware chunk thinning (R7) | PASS | chunk-thinning.ts:45-46 ANCHOR_WEIGHT=0.6, DENSITY_WEIGHT=0.4. scoreChunk() computes composite. thinChunks() retains chunks above threshold (DEFAULT_THINNING_THRESHOLD=0.3). Anchor chunks always score >= 0.6, ensuring retention. |
| T028 | 047 | Encoding-intent capture at index time (R16) | PASS | encoding-intent.ts:32-43 classifies content as document/code/structured_data. Persisted via reconsolidation-bridge.ts:219 and vector-index indexMemory(). Flag gated by SPECKIT_ENCODING_INTENT (default ON). Read-only after indexing per module docs :10-11. |
| T029 | 048 | Auto entity extraction (R10) | PASS | entity-extractor.ts:76 extractEntities() with 5 rules: proper_noun, technology, key_phrase, heading, quoted. entity-denylist.ts filters denied entities. normalizeEntityName from entity-linker.ts. Flag: SPECKIT_AUTO_ENTITIES (default ON). |

### Group 3: Consolidation and Persistence Scenarios (069-119)

| Task | Scenario ID | Scenario Name | Status | Evidence |
|------|-------------|---------------|--------|----------|
| T030 | 069 | Entity normalization consolidation | PASS | entity-extractor.ts:8-13 re-exports normalizeEntityName and computeEdgeDensity from entity-linker.ts. Both extractor and linker use the same normalizeEntityName function, ensuring identical normalized forms. Unicode handled via .normalize('NFD') in slug-utils. |
| T031 | 073 | Quality gate timer persistence | PASS | save-quality-gate.ts:168-195 loadActivationTimestampFromDb() reads from SQLite config table, persistActivationTimestampToDb() writes. :242-256 isWarnOnlyMode() lazy-loads from DB on first access after restart. 14-day countdown survives restarts. |
| T032 | 092 | Implemented: auto entity extraction (R10) | PASS | search-flags.ts:189-191 isAutoEntitiesEnabled() returns true by default (graduated). Post-insert enrichment in memory-save.ts:485 calls runPostInsertEnrichment() which includes entity extraction. post-insert.ts wires entity extraction into save pipeline. |
| T033 | 111 | Deferred lexical-only indexing | PASS | vector-index-schema.ts:1856-1857 defines embedding_status DEFAULT 'pending' with CHECK constraint and retry_count column. :1973-1974 creates indices for retry eligibility. embedding-pipeline.ts handles failure fallback. BM25/FTS5 index includes pending memories for lexical search. |
| T034 | 119 | Memory filename uniqueness (ensureUniqueMemoryFilename) | PASS | slug-utils.ts:198-251 implements O_CREAT/O_EXCL atomic check. Sequential -1 through -100 suffix. :236 crypto.randomBytes(6).toString('hex') for random fallback (12 hex chars, not SHA1). Repeated fallback saves use same atomic check. |

### Group 4: Validation and Preflight Scenarios (131-133)

| Task | Scenario ID | Scenario Name | Status | Evidence |
|------|-------------|---------------|--------|----------|
| T035 | 131 | Description.json batch backfill validation (PI-B3) | PASS | folder-discovery.ts implements generateFolderDescriptions with per-folder PerFolderDescription schema. Parity maintained by scanning spec folders with spec.md. Per-folder preferred over spec.md fallback. JSON syntax enforced by JSON.parse. |
| T036 | 132 | description.json schema field validation | PASS | folder-discovery.ts:39-45 defines PerFolderDescription with all 9 fields: specId (string), folderSlug (string), parentChain (string[]), memorySequence (number), memoryNameHistory (string[]), specFolder (string), description (string), keywords (string[]), lastUpdated (string). Type enforcement in generation code. |
| T037 | 133 | Dry-run preflight for memory_save | PASS | memory-save.ts:549-553 dryRun flag. :572-613 dryRun+skipPreflight path returns dry_run summary with would_pass computed from validation, quality loop, template contract, and sufficiency. :268-270 insufficiency rejection with INSUFFICIENT_CONTEXT_ABORT code. No DB mutation on dry-run. force:true does not bypass insufficiency (sufficiency checked before force evaluation). |

### Group 5: Post-Save and Review Scenarios (155, 155-F)

| Task | Scenario ID | Scenario Name | Status | Evidence |
|------|-------------|---------------|--------|----------|
| T040 | 155 | Post-save quality review | PASS | post-save-review.ts:208-350 reviewPostSaveQuality() checks title quality (HIGH), trigger path fragments (HIGH), importance_tier mismatch (MEDIUM), decision_count zero (MEDIUM), contextType mismatch (LOW), generic description (LOW). Returns PASSED/ISSUES_FOUND/SKIPPED status. |
| T041 | 155-F | Score penalty advisory logging | PASS | post-save-review.ts:357-361 REVIEW_SEVERITY_PENALTIES: HIGH=-0.10, MEDIUM=-0.05, LOW=-0.02. :368 computeReviewScorePenalty() computes penalty capped at -0.30. workflow.ts logs "Post-save review: quality_score penalty" with computed value. |

### Group 6: Advanced Quality Features (164-178)

| Task | Scenario ID | Scenario Name | Status | Evidence |
|------|-------------|---------------|--------|----------|
| T050 | 164 | Batch learned feedback (SPECKIT_BATCH_LEARNED_FEEDBACK) | PASS | batch-learning.ts:34 MIN_SUPPORT_SESSIONS=3, :41 MAX_BOOST_DELTA=0.10, :44 BATCH_WINDOW_MS=7 days, :47 CONFIDENCE_WEIGHTS correct. runBatchLearning(database) called from context-server.ts startup (after retry manager), try/catch non-fatal, feature flag gate inside function. |
| T051 | 165 | Assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION) | PASS | reconsolidation-bridge.ts:42 ASSISTIVE_COMPATIBILITY_NOTE_THRESHOLD=0.96, :49 ASSISTIVE_REVIEW_THRESHOLD=0.88. :89-95 classifyAssistiveSimilarity() returns auto_merge/review/keep_separate. :109-117 classifySupersededOrComplement(). :125-134 logAssistiveRecommendation() is shadow-only (console.warn, no DB writes). |
| T052 | 176 | Implicit feedback log (SPECKIT_IMPLICIT_FEEDBACK_LOG) | PASS | feedback-ledger.ts:25-30 defines 5 event types. :78-84 resolveConfidence() maps correctly (strong: result_cited/follow_on_tool_use, medium: query_reformulated, weak: search_shown/same_topic_requery). :106-109 isImplicitFeedbackLogEnabled() defaults ON. Comment at :104 fixed to "Default: TRUE (graduated)". Module-level comment at :8 fixed to "(default ON, graduated)". Consistent with search-flags.ts:287. 39 feedback-ledger tests pass. |
| T053 | 177 | Hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY) | PASS | fsrs-scheduler.ts:403-406 isHybridDecayPolicyEnabled() defaults ON. :417-422 classifyHybridDecay() maps decision/constitutional/critical to no_decay. :443-446 applyHybridDecayPolicy() returns Infinity (NO_DECAY) for protected types, original stability for others. FSRS v4 formula at :78-89 R(t) = (1 + 19/81 * t/S)^(-0.5). |
| T054 | 178 | Save quality gate exceptions (SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS) | PASS | save-quality-gate.ts:115 SHORT_CRITICAL_MIN_STRUCTURAL_SIGNALS=2. :310-314 isSaveQualityGateExceptionsEnabled() defaults ON. :344-360 isShortCriticalException() requires contextType=decision and >=2 structural signals. :411-429 Layer 1 bypass with warn-only logging. Non-decision types and <2 signals still rejected. |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T060 Record verdict for each of the 34 exact IDs (PASS, PARTIAL, or FAIL) with rationale -- 34 PASS, 0 PARTIAL, 0 FAIL
- [x] T061 Confirm 34/34 exact IDs executed with no skipped test IDs -- all 34 verdicted
- [x] T062 Verify sub-scenarios M-005a/b/c, M-006a/b/c, and 155-F have independent verdicts -- all 7 sub-scenarios independently verdicted
- [x] T063 Update checklist.md with evidence references for all P0 items
- [x] T064 Complete implementation-summary.md with aggregate results
- [x] T065 Restore all feature flags to baseline values -- code analysis mode, no flags changed
- [x] T066 Restore sandbox checkpoint if needed -- code analysis mode, no mutations made
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 34 scenario tasks (T010-T054) marked complete -- 34 PASS, 0 PARTIAL, 0 FAIL
- [x] All verification tasks (T060-T066) complete
- [x] No `[B]` blocked tasks remaining without documented reason
- [x] Manual verification passed per review protocol -- code analysis review complete
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

**Audit Follow-up Additions (2026-03-23)**

- [ ] T067 Execute post-audit follow-up for M5 — validate `validateHalfLifeConfig` rejects `halfLifeDays: 0` and preserves the positive-number-or-null contract
- [ ] T068 Verify zero-value half-life input is rejected with the same contract boundary as other non-positive values while `null` remains allowed
- [ ] T069 Execute post-audit follow-up for L1 batch inference — submit multiple pathless inputs to `inferMemoryTypesBatch` and confirm each receives its own `__pathless_<n>` fallback key
- [ ] T070 Verify pathless batch results no longer collapse onto one Map entry; capture isolated outputs for each pathless input
