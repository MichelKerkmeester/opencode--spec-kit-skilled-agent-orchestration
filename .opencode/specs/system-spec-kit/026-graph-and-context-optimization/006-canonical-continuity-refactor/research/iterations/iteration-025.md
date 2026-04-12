---
title: "Iteration 025 — 13 feature regression test scenarios"
iteration: 25
band: B
timestamp: 2026-04-11T17:20:00Z
worker: codex-gpt-5.4
scope: q4_q9_feature_regression_tests
status: complete
focus: "Define concrete plain-language regression scenarios for all 13 preserved advanced memory features so phase 018 has a merge-blocking acceptance set."
maps_to_questions: [Q4, Q9]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-025.md"]

---
# Iteration 025 — Q4 + Q9: Feature Regression Test Scenarios
## Goal
Translate the preserve-13-features contract into a concrete regression suite that phase 018 must pass before merge.

## Test posture
- These are plain-language scenarios, not TypeScript prescriptions.
- Each scenario assumes phase 018 has already retargeted memory behavior into `spec_doc`, `continuity`, `archived`, and constitutional file surfaces where applicable.
- Each scenario is merge-blocking because phase 017 selected Option C partly on the promise that all 13 advanced features would survive retargeting.
- The suite should run against stable fixtures, not ad hoc developer state, so failures reflect behavior regressions rather than local workspace noise.

## Shared fixture assumptions
- Use one packet fixture with canonical spec docs, valid anchors, thin continuity blocks, archived legacy rows, and at least one constitutional file.
- Include one shared-memory fixture with two actors in the same tenant and one unauthorized actor outside the allowed space membership.
- Seed enough data to activate all five search channels: trigger, BM25, FTS5, vector, and graph.
- Keep timestamps controllable so FSRS decay and session dedup behavior can be replayed deterministically.

## Scenario 01 — Trigger phrase fast matching
- Test name: `trigger_phrase_fast_match_preserves_fast_path_for_spec_docs`
- Setup: Seed a canonical spec doc row and a continuity row with known trigger phrases that used to resolve from `memory_index.trigger_phrases`, plus unrelated rows that only match semantically.
- Action: Run the trigger-matching path with an exact trigger phrase that should now resolve across `spec_doc` and `continuity` document types.
- Expected result:
- The system returns the intended spec doc or continuity hit through the trigger path, not through a slower semantic fallback.
- The result set includes the newly broadened document types and still respects the same indexed lookup behavior as the legacy implementation.
- Warm-cache latency remains in the same practical class as the old fast path, with no obvious regression that would make the feature feel like a full search.
- Failure criteria:
- The trigger lookup misses valid `spec_doc` or `continuity` hits that were deliberately indexed for the test.
- The only way to find the target is by vector or BM25 search after the trigger path fails.
- Observed latency clearly regresses beyond the expected fast-path envelope for a warmed fixture.
- Estimated runtime: ~20-30 seconds

## Scenario 02 — Intent-aware retrieval
- Test name: `intent_routing_targets_canonical_spec_anchors`
- Setup: Prepare representative queries for the seven retrieval intents and map each one to a known canonical anchor in a spec doc fixture.
- Action: Run the intent-aware retrieval flow for each query and inspect both the routed target and the returned top result.
- Expected result:
- Each intent lands on the correct target class and resolves to a canonical spec-doc anchor instead of a loose memory note that merely mentions the topic.
- The query-to-target mapping reflects the updated routing contract in `intent-classifier.ts`, not the legacy "find memory files mentioning X" behavior.
- The returned anchor is actionable and packet-specific, so a resume or context request would send the operator to the right place immediately.
- Failure criteria:
- Any of the seven intents routes to the wrong document family or the wrong anchor class.
- A generic or archived note outranks the intended canonical anchor when the canonical anchor is present and relevant.
- The feature still behaves like legacy memory indirection rather than direct anchor targeting.
- Estimated runtime: ~45-60 seconds

## Scenario 03 — Session dedup
- Test name: `session_dedup_suppresses_repeat_hits_across_broadened_id_space`
- Setup: Seed a session with one query that returns a stable set of spec doc, continuity, and archived hits, and preserve the session state for a second identical query.
- Action: Run the same query twice in the same session without mutating the corpus between runs.
- Expected result:
- The first query returns the full relevant set, while the second query suppresses already-served logical hits from the same session.
- Dedup works across the broader ID space, meaning retargeted spec-doc and continuity rows participate in the same session-state rules as legacy memory rows.
- The second response is materially smaller and more efficient than the first, preserving the token-savings goal of the original feature.
- Failure criteria:
- The second query returns the same logical hits again as if no dedup state existed.
- Dedup works for old memory rows but fails for `spec_doc` or `continuity` rows introduced by phase 018.
- The repeated response is not meaningfully smaller, indicating that session savings were lost in the retarget.
- Estimated runtime: ~30-45 seconds

## Scenario 04 — Multi-dimension quality scoring
- Test name: `quality_gates_reject_invalid_spec_docs_and_accept_valid_writes`
- Setup: Prepare two save candidates: one valid canonical spec doc with correct anchors and one invalid candidate missing the required structural markers expected by the new validator.
- Action: Pass both candidates through the phase 018 save pipeline that now uses the spec-doc structure gate instead of the legacy memory-template contract.
- Expected result:
- The valid candidate passes all relevant gates and is accepted for write or indexing.
- The invalid candidate is rejected specifically because the new structure rules detect missing canonical anchor requirements.
- The rejection reason is precise enough that the developer can tell the failure is structural, not a vague downstream scoring failure.
- Failure criteria:
- The invalid document passes and is allowed into the corpus despite missing required structure.
- The valid document is rejected even though it satisfies the packet’s canonical structure rules.
- The save pipeline reports a generic failure that does not prove the spec-doc validator is actually enforcing the intended contract.
- Estimated runtime: ~30-45 seconds

## Scenario 05 — Memory reconsolidation
- Test name: `reconsolidation_auto_merges_high_similarity_and_preserves_thresholds`
- Setup: Seed one existing canonical entry, then prepare three incoming writes that are respectively above 0.96 similarity, inside the 0.88-0.96 review band, and clearly below the merge threshold.
- Action: Run the reconsolidation bridge before write for all three candidates.
- Expected result:
- The above-0.96 candidate is auto-merged into the existing entry instead of creating a duplicate row.
- The review-band candidate does not silently auto-merge; it is surfaced as a boundary case for explicit review behavior.
- The low-similarity candidate remains distinct, proving the bridge still separates genuinely new content from near-duplicates.
- Failure criteria:
- The high-similarity candidate creates a duplicate entry instead of merging.
- The medium-similarity candidate auto-merges even though it should stay in the review band.
- The thresholds drift so far that the system either over-merges or stops merging obvious duplicates.
- Estimated runtime: ~45-60 seconds

## Scenario 06 — Causal graph
- Test name: `causal_graph_traverses_anchor_level_edges_across_two_hops`
- Setup: Create a small graph where one anchor in a child packet points to a parent decision anchor, which in turn points to a related implementation-summary anchor through the causal relations used by the memory graph.
- Action: Run the relevant graph traversal or "why" analysis from the child anchor and request a two-hop explanation path.
- Expected result:
- The traversal resolves through anchor-level endpoints, not just coarse row-level nodes.
- The returned path includes both hops in the right order and preserves the relation semantics needed for traceability.
- The result proves that the added `source_anchor` and `target_anchor` semantics are actually usable, not just stored.
- Failure criteria:
- The traversal stops at the row level and cannot distinguish the anchor that carries the actual decision or continuity signal.
- Only the first hop resolves, showing that two-hop BFS behavior was lost during retargeting.
- The graph returns an incomplete or incorrect chain even though all edges are present in the fixture.
- Estimated runtime: ~45-60 seconds

## Scenario 07 — Memory tiers
- Test name: `importance_tiers_preserve_priority_with_optional_anchor_overrides`
- Setup: Seed constitutional, critical, normal, and deprecated content in the same topical area, including one spec doc that carries mixed-priority sections through anchor-tier overrides.
- Action: Run a broad relevance query that can legitimately match all of those tiers.
- Expected result:
- Constitutional content still surfaces first when it is relevant, even after the move toward spec-doc and constitutional-file indexing.
- Lower-tier content remains retrievable, but it does not outrank higher-tier material without a strong reason.
- Anchor-level tier overrides are honored where present, so a mixed spec doc does not flatten all sections into one undifferentiated priority.
- Failure criteria:
- Deprecated or normal content outranks constitutional content in a case where constitutional content clearly applies.
- Tier behavior works only at the row level and ignores anchor-tier overrides in mixed documents.
- Retargeting makes tiered ordering unstable enough that operators would lose the old priority guarantees.
- Estimated runtime: ~30-45 seconds

## Scenario 08 — FSRS cognitive decay
- Test name: `fsrs_decay_applies_equally_to_spec_doc_continuity_and_archived_rows`
- Setup: Seed comparable rows across `spec_doc`, `continuity`, and `archived` types with controlled FSRS fields, then simulate elapsed time without additional reviews.
- Action: Recompute retrieval or state signals at two different simulated times and compare the retrievability and lifecycle outcomes.
- Expected result:
- Retrievability drops over time in the expected direction for all three document types.
- The decay model behaves content-agnostically, meaning phase 018 did not special-case spec docs out of the existing scheduler logic.
- Older, less-reviewed content becomes less prominent than fresher or more-stable content under otherwise similar relevance conditions.
- Failure criteria:
- Decay works for legacy memory rows but does not apply to `spec_doc`, `continuity`, or `archived` rows.
- Retrievability does not decrease over simulated time, indicating the scheduler fields are no longer being respected.
- Retargeting produces a flat ranking where stale content remains artificially sticky.
- Estimated runtime: ~30-45 seconds

## Scenario 09 — Shared memory governance
- Test name: `shared_memory_remains_deny_by_default_after_retargeting`
- Setup: Create a shared-space fixture with one authorized actor, one editor in the same tenant, and one unauthorized actor who lacks membership for the space.
- Action: Run the same relevant query as each actor and compare the visible result sets and access decisions.
- Expected result:
- Authorized actors see the shared content that belongs to their tenant and shared-space scope.
- The unauthorized actor sees no protected shared content even when the query is an exact topical match.
- Audit and provenance behavior still attaches to the row metadata rather than disappearing because the source document is now a spec doc.
- Failure criteria:
- Any unauthorized actor can retrieve protected shared content by semantic match alone.
- Scope filters stop working for retargeted spec-doc rows even though they worked for legacy memory rows.
- Governance metadata becomes invisible or unenforced when content moves into the new document model.
- Estimated runtime: ~45-60 seconds

## Scenario 10 — Ablation studies and drift analysis
- Test name: `ablation_and_drift_outputs_include_retargeted_archive_signal`
- Setup: Seed an evaluation corpus where some answers come from fresh canonical docs and some come only from archived material, so the archive path is exercised intentionally.
- Action: Run the ablation study flow and then inspect the related drift-analysis output for the same query family.
- Expected result:
- The ablation report emits the `archived_hit_rate` metric as part of the evaluation output.
- The metric changes meaningfully when archived-only support is present, proving the new archive path is actually measured.
- Drift analysis still explains why a result surfaced, including causal or provenance reasoning that spans the retargeted document classes.
- Failure criteria:
- The ablation output omits `archived_hit_rate` entirely.
- Archived material affects ranking but leaves no measurable evaluation trace, making the permanence decision impossible to justify later.
- Drift analysis becomes less informative because it cannot follow the retargeted document and graph relationships.
- Estimated runtime: ~60-90 seconds

## Scenario 11 — Constitutional memory
- Test name: `constitutional_files_resolve_and_always_surface_when_relevant`
- Setup: Move constitutional guidance into `.opencode/constitutional/*.md` fixture files and ensure those files are indexed alongside ordinary packet docs.
- Action: Run a query or resume action that should always include constitutional guidance at the top because the guidance is directly relevant.
- Expected result:
- The constitutional content is resolved from the dedicated files, not from a hidden legacy-only row that survived by accident.
- The returned result order keeps constitutional guidance pinned at the top when relevant, preserving the old always-surface rule.
- The file-based move still leaves constitutional content editable, visible, and safe without losing retrieval guarantees.
- Failure criteria:
- The constitutional file is not indexed or cannot be retrieved after migration.
- A normal or archived result outranks the constitutional rule when that rule clearly applies to the query.
- The test only passes because stale legacy rows still exist, which would mask a broken migration.
- Estimated runtime: ~30-45 seconds

## Scenario 12 — Embedding semantic search
- Test name: `embedding_search_returns_expected_top_k_for_retargeted_docs`
- Setup: Seed semantically rich spec docs, continuity rows, and archived rows whose meaning matches the query better than their exact keywords do.
- Action: Run an embedding-driven search with a paraphrased query that should succeed on semantics rather than exact token overlap.
- Expected result:
- The intended canonical result appears in the top-K even when the query wording does not share exact trigger or keyword text.
- The embedding system covers retargeted document classes the same way it covered legacy memory rows, preserving the Voyage-based semantic path.
- Archived rows remain eligible when they are the best semantic support, but fresher canonical docs still win when they are more appropriate.
- Failure criteria:
- Semantic retrieval works only for legacy memory rows and not for retargeted spec-doc or continuity rows.
- Exact-token channels dominate so completely that a meaning-based query cannot retrieve the intended document.
- The expected top-K changes so sharply that the retarget clearly broke semantic relevance.
- Estimated runtime: ~45-60 seconds

## Scenario 13 — 4-stage search pipeline
- Test name: `four_stage_pipeline_keeps_all_channels_and_rrf_fusion_intact`
- Setup: Build one query fixture where trigger, BM25, FTS5, vector, and graph channels all contribute useful but different evidence for the final answer.
- Action: Run the full search pipeline with trace output enabled so gather, score, rerank, and filter behavior can be inspected end to end.
- Expected result:
- All intended channels participate in the gather stage, and none silently disappear because the content is now stored as spec docs or continuity rows.
- The scoring and reranking stages produce a sensible fused order rather than a single-channel winner that ignores the others.
- The filter stage preserves the canonical best answer and removes only the content that truly should not survive to the final payload.
- Failure criteria:
- One or more channels drop out of the pipeline for retargeted document classes.
- Final ordering no longer reflects reciprocal-rank fusion and instead collapses to whichever channel happened to return first.
- Filtering removes the correct canonical result or leaves obvious duplicate/noise entries that the old pipeline would have cleaned up.
- Estimated runtime: ~45-60 seconds

## Merge gate summary
- Phase 018 should not merge unless all 13 scenarios pass on a stable fixture corpus.
- The suite should be treated as a preservation lock, not as optional nice-to-have coverage.
- Any failure should be read as evidence that Option C no longer preserves the advanced memory feature set promised during selection.

## Findings
- **F25.1**: The cleanest regression strategy is one merge-blocking scenario per preserved feature, because it maps exactly to the preserve-13-features contract.
- **F25.2**: The highest-risk regressions are not just correctness failures; they also include silent degradations in latency, ranking, and observability.
- **F25.3**: Features 3, 8, 9, 12, and 13 especially need cross-document-type fixtures because their main risk is that retargeted rows quietly fall out of the old generic infrastructure.
- **F25.4**: Feature 10 must validate both measurement and explanation, otherwise phase 020 will lack evidence for any permanence decision about archived memory.
