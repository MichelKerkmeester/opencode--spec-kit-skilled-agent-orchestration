---
title: "Iteration 029 — Test catalog descriptions"
iteration: 29
band: D
timestamp: 2026-04-11T12:27:51Z
worker: codex-gpt-5
scope: q9_test_catalog
status: complete
focus: "Produce a concrete catalog of unit, integration, and regression test descriptions for phase 018 without writing test code."
maps_to_questions: [Q9]
---

# Iteration 029 — Q9: Test Catalog Descriptions

## Goal
Turn the phase 018 test strategy into a concrete naming-ready catalog so implementation can write the suite without re-deciding coverage shape, edge cases, or fixture posture.

## Grounding
Based on `findings/testing-strategy.md`, iteration 002 routing rules, iteration 003 merge semantics, iteration 022 validator detail, iteration 024 continuity validation rules, iteration 025 regression scenarios, and `findings/resume-journey.md`.

## Naming convention
All names follow `testCategory_specificCase_expectedOutcome`.

## contentRouter — `narrative_progress`
- `contentRouter_narrativeProgress_structuredObservation_routesToWhatBuilt`: Given a structured `observations[]` chunk describing code changes, classify it and expect `implementation-summary.md::what-built` with `append-as-paragraph`.
- `contentRouter_narrativeProgress_freeformRefactorNote_routesToWhatBuilt`: Given unstructured text about a refactor plus passing tests, classify it and expect `narrative_progress` instead of a generic fallback.
- `contentRouter_narrativeProgress_codeCitationParagraph_routesToWhatBuilt`: Given a paragraph with file-path citations and implementation detail, route it to `what-built` and preserve the paragraph append target.
- `contentRouter_narrativeProgress_deliveryCueConflict_prefersImplementation`: Given mixed implementation and rollout cues where implementation dominates, classify the chunk as `narrative_progress` and not `narrative_delivery`.
- `contentRouter_narrativeProgress_decisionCueConflict_staysProgress`: Given a progress update that mentions a decision in passing, classify it as `narrative_progress` rather than `decision`.
- `contentRouter_narrativeProgress_embeddingRescue_routesToWhatBuilt`: Given low-confidence rule output but strong similarity to progress prototypes, use Tier 2 and route to `what-built`.
- `contentRouter_narrativeProgress_llmEscalation_routesToWhatBuilt`: Given ambiguous prose that Tier 1 and Tier 2 both score low, use Tier 3 and expect a final `narrative_progress` decision.
- `contentRouter_narrativeProgress_highConfidence_silentAutoRoute`: Given a canonical progress chunk with strong rule matches, auto-route with confidence `>=0.9` and no warning behavior.
- `contentRouter_narrativeProgress_midConfidence_logsRoutingDecision`: Given a progress chunk in the `0.7-0.89` band, route it correctly and mark it for routing-log review.
- `contentRouter_narrativeProgress_warningBand_emitsWarningButRoutes`: Given a progress chunk in the `0.5-0.69` band, route it to `what-built` and surface a warning in the save response.
- `contentRouter_narrativeProgress_existingAnchors_routesToCanonicalWhatBuilt`: Given a packet with all expected anchors already present, classify a progress chunk and keep the canonical `what-built` anchor target.
- `contentRouter_narrativeProgress_structuredExchangeWithImplementation_routesToWhatBuilt`: Given an `exchanges[]` entry that contains implementation substance rather than chat noise, classify it as `narrative_progress`.
- `contentRouter_narrativeProgress_routeAsOverride_honorsForcedProgress`: Given a borderline chunk plus `--route-as narrative_progress`, keep the progress route and mark the decision as overrideable.
- `contentRouter_narrativeProgress_packetLevelL2_routesToImplementationSummary`: Given an L2 packet with no ADR document, classify a progress chunk and still target `implementation-summary.md::what-built`.
- `contentRouter_narrativeProgress_placeholderBoilerplate_avoidsFalsePositive`: Given template boilerplate with no implementation evidence, classify it and expect not to produce a false `narrative_progress` route.

## contentRouter — `narrative_delivery`
- `contentRouter_narrativeDelivery_featureFlagNote_routesToHowDelivered`: Given text describing a feature-flag rollout plan, classify it and expect `implementation-summary.md::how-delivered`.
- `contentRouter_narrativeDelivery_shadowComparisonNote_routesToHowDelivered`: Given text about shadow comparison and rollout timing, route it to the delivery anchor with paragraph append behavior.
- `contentRouter_narrativeDelivery_migrationPlanParagraph_routesToHowDelivered`: Given prose about schema migration sequencing and release gates, classify it as `narrative_delivery`.
- `contentRouter_narrativeDelivery_implCueConflict_prefersDelivery`: Given mixed implementation and rollout cues where rollout language dominates, classify it as `narrative_delivery`.
- `contentRouter_narrativeDelivery_decisionMention_staysDelivery`: Given a delivery note that references a decision but mostly describes rollout mechanics, keep the `narrative_delivery` category.
- `contentRouter_narrativeDelivery_embeddingRescue_routesToHowDelivered`: Given low-confidence rules but high similarity to delivery prototypes, use Tier 2 and route to `how-delivered`.
- `contentRouter_narrativeDelivery_llmEscalation_routesToHowDelivered`: Given ambiguous operational prose, use Tier 3 and expect a final `narrative_delivery` classification.
- `contentRouter_narrativeDelivery_highConfidence_silentAutoRoute`: Given a canonical delivery chunk with clear deployment keywords, route silently with no warning.
- `contentRouter_narrativeDelivery_midConfidence_logsRoutingDecision`: Given a delivery chunk in the audit band, route to `how-delivered` and emit a routing-log record.
- `contentRouter_narrativeDelivery_warningBand_emitsWarningButRoutes`: Given a low-certainty rollout note, route it to `how-delivered` while warning the caller that confidence is below the silent threshold.
- `contentRouter_narrativeDelivery_existingAnchors_routesToCanonicalHowDelivered`: Given a packet with delivery anchors already present, classify a new rollout paragraph and keep the canonical target.
- `contentRouter_narrativeDelivery_structuredObservationWithRollout_routesToHowDelivered`: Given a structured observation that describes deployment mechanics rather than code changes, classify it as `narrative_delivery`.
- `contentRouter_narrativeDelivery_routeAsOverride_honorsForcedDelivery`: Given a borderline operational chunk plus a forced route override, keep the delivery category and mark accepted risk.
- `contentRouter_narrativeDelivery_packetLevelL3_routesToImplementationSummary`: Given an L3 packet with decision records available, classify delivery prose and still target `implementation-summary.md::how-delivered`.
- `contentRouter_narrativeDelivery_placeholderBoilerplate_avoidsFalsePositive`: Given generic release boilerplate with no packet-specific information, refuse to misclassify it as real delivery narrative.

## contentRouter — `decision`
- `contentRouter_decision_structuredDecision_routesToDecisionTarget`: Given a structured `decisions[]` payload, classify it and expect the `decision` category with a decision-target route.
- `contentRouter_decision_freeformTradeoffNote_routesToDecision`: Given prose that explicitly states a choice and rationale, classify it as `decision`.
- `contentRouter_decision_l3Packet_routesToAdrInsert`: Given an L3 packet with `decision-record.md`, classify a decision chunk and target `insert-new-adr`.
- `contentRouter_decision_l2Packet_routesToDecisionTable`: Given an L2 packet without ADR docs, classify the same decision chunk and target `implementation-summary.md::decisions` with `append-table-row`.
- `contentRouter_decision_progressCueConflict_prefersDecision`: Given a chunk that reports progress but centers on a design choice, classify it as `decision` instead of `narrative_progress`.
- `contentRouter_decision_deliveryCueConflict_prefersDecision`: Given a chunk that mentions rollout implications but is primarily about an architectural choice, keep the `decision` category.
- `contentRouter_decision_embeddingRescue_routesToDecision`: Given low-confidence rules but a strong decision-prototype match, use Tier 2 and route to a decision target.
- `contentRouter_decision_llmEscalation_routesToDecision`: Given nuanced tradeoff prose that only the LLM tier can disambiguate, classify it as `decision`.
- `contentRouter_decision_highConfidence_silentAutoRoute`: Given an explicit “chose X over Y because Z” chunk, route silently with confidence above the auto threshold.
- `contentRouter_decision_midConfidence_logsRoutingDecision`: Given a decision chunk in the review band, route it correctly and capture the decision in routing telemetry.
- `contentRouter_decision_warningBand_emitsWarningButRoutes`: Given a weakly signaled design-choice paragraph, route it as `decision` while warning about uncertainty.
- `contentRouter_decision_existingDecisionRecord_targetsCanonicalAdrDoc`: Given existing decision records in the packet, choose the ADR target and not the summary-table fallback.
- `contentRouter_decision_routeAsOverride_honorsForcedDecision`: Given an ambiguous chunk plus `--route-as decision`, keep the decision route and preserve overrideability metadata.
- `contentRouter_decision_duplicateTitleNeighbor_stillClassifiesDecision`: Given a decision chunk whose title resembles an existing ADR, classify it as `decision` and leave dedup to merge logic.
- `contentRouter_decision_placeholderTemplate_avoidsFalsePositive`: Given blank ADR template content with no real tradeoff, avoid falsely classifying it as a real `decision`.

## contentRouter — `handover_state`
- `contentRouter_handoverState_sessionPauseNote_routesToHandover`: Given a chunk that says where work stopped and what to do next, classify it as `handover_state`.
- `contentRouter_handoverState_blockerList_routesToHandover`: Given a chunk dominated by blockers and next steps, route it to `handover.md`.
- `contentRouter_handoverState_recentActionNextAction_routesToHandover`: Given text containing recent action plus next safe action fields, classify it as `handover_state`.
- `contentRouter_handoverState_progressCueConflict_prefersHandover`: Given mixed progress and pause-state cues where pause-state dominates, classify it as `handover_state`.
- `contentRouter_handoverState_researchCueConflict_prefersHandover`: Given a chunk that references findings but is framed as a session handoff, keep the `handover_state` route.
- `contentRouter_handoverState_embeddingRescue_routesToHandover`: Given low-confidence rules but strong similarity to handover prototypes, use Tier 2 and target `handover.md`.
- `contentRouter_handoverState_llmEscalation_routesToHandover`: Given ambiguous operator prose, use Tier 3 and resolve it to `handover_state`.
- `contentRouter_handoverState_highConfidence_silentAutoRoute`: Given a canonical pause/resume chunk with clear handoff markers, route silently.
- `contentRouter_handoverState_midConfidence_logsRoutingDecision`: Given a handover chunk in the audit band, route it to `handover.md` and log the classification decision.
- `contentRouter_handoverState_warningBand_emitsWarningButRoutes`: Given a lower-confidence handover paragraph, route it while warning that it may need operator confirmation.
- `contentRouter_handoverState_existingHandoverAnchor_targetsSessionAppend`: Given a packet with existing handover content, classify a new pause-state note and keep the handover append target.
- `contentRouter_handoverState_structuredExchangeWithNextSteps_routesToHandover`: Given an exchange entry that is mostly a stop-state summary, classify it as `handover_state`.
- `contentRouter_handoverState_routeAsOverride_honorsForcedHandover`: Given an ambiguous chunk plus a forced handover override, keep the handover route and mark accepted risk.
- `contentRouter_handoverState_packetWithoutResearchDoc_stillTargetsHandover`: Given a packet missing `research/research.md`, classify a handoff chunk and still target `handover.md`.
- `contentRouter_handoverState_templateBoilerplate_avoidsFalsePositive`: Given empty handover template scaffolding, avoid falsely classifying it as real `handover_state`.

## contentRouter — `research_finding`
- `contentRouter_researchFinding_citedFinding_routesToResearchDoc`: Given a chunk with a cited source and finding statement, classify it as `research_finding`.
- `contentRouter_researchFinding_markdownResearchHeading_routesToResearchDoc`: Given content that starts with a research heading and source-oriented prose, route it to `research/research.md`.
- `contentRouter_researchFinding_upstreamBugDiscovery_routesToResearchDoc`: Given a finding about an upstream issue discovered during investigation, classify it as `research_finding`.
- `contentRouter_researchFinding_decisionCueConflict_prefersResearch`: Given a finding that informs a future decision but is still primarily evidence-gathering, keep the `research_finding` category.
- `contentRouter_researchFinding_handoverCueConflict_prefersResearch`: Given a chunk that mentions next steps but is mainly a cited finding, classify it as `research_finding`.
- `contentRouter_researchFinding_embeddingRescue_routesToResearchDoc`: Given low-confidence rules but a strong prototype match for research text, use Tier 2 and route to research.
- `contentRouter_researchFinding_llmEscalation_routesToResearchDoc`: Given nuanced research prose that rules and prototypes cannot cleanly classify, use Tier 3 and expect `research_finding`.
- `contentRouter_researchFinding_highConfidence_silentAutoRoute`: Given canonical research text with obvious source cues, route silently with high confidence.
- `contentRouter_researchFinding_midConfidence_logsRoutingDecision`: Given a research chunk in the logging band, route to research and emit a routing audit entry.
- `contentRouter_researchFinding_warningBand_emitsWarningButRoutes`: Given a low-certainty finding with partial citation evidence, route it while surfacing the confidence warning.
- `contentRouter_researchFinding_existingResearchDoc_targetsAppendSection`: Given an existing research document, classify a new finding and keep the `append-section` merge target.
- `contentRouter_researchFinding_structuredObservationWithSources_routesToResearchDoc`: Given structured observations that contain source-backed evidence, classify them as `research_finding`.
- `contentRouter_researchFinding_routeAsOverride_honorsForcedResearch`: Given an ambiguous analytical chunk plus `--route-as research_finding`, keep the research route.
- `contentRouter_researchFinding_packetWithoutHandover_keepsResearchTarget`: Given a packet missing `handover.md`, classify a cited finding and still target `research/research.md`.
- `contentRouter_researchFinding_plainBoilerplate_avoidsFalsePositive`: Given generic “research later” placeholder text, avoid falsely classifying it as a real `research_finding`.

## contentRouter — `task_update`
- `contentRouter_taskUpdate_checkboxMutation_routesToTasksPhase`: Given a chunk containing task checkbox updates, classify it as `task_update` and target `tasks.md::phase-N`.
- `contentRouter_taskUpdate_taskIdCompletion_routesToUpdateInPlace`: Given text that names `T023` as complete with evidence, route it to `update-in-place`.
- `contentRouter_taskUpdate_checklistItemMutation_routesToStructuredListTarget`: Given a checklist-style chunk with item IDs, classify it as `task_update` and preserve a structured list target.
- `contentRouter_taskUpdate_progressCueConflict_prefersTaskUpdate`: Given mixed progress prose and explicit task ID updates, classify the chunk as `task_update`.
- `contentRouter_taskUpdate_deliveryCueConflict_prefersTaskUpdate`: Given rollout text that also marks specific tasks complete, let the explicit task-ID cues dominate and route as `task_update`.
- `contentRouter_taskUpdate_embeddingRescue_routesToTasks`: Given low-confidence rules but a strong match to task-update prototypes, use Tier 2 and route to tasks.
- `contentRouter_taskUpdate_llmEscalation_routesToTasks`: Given ambiguous work-log prose that only the LLM tier can disambiguate, classify it as `task_update`.
- `contentRouter_taskUpdate_highConfidence_silentAutoRoute`: Given canonical checkbox/task-ID text, route silently with high confidence.
- `contentRouter_taskUpdate_midConfidence_logsRoutingDecision`: Given a task-update chunk in the review band, route it to tasks and log the decision.
- `contentRouter_taskUpdate_warningBand_emitsWarningButRoutes`: Given a lower-confidence structured list update, route it while warning that confirmation may be needed.
- `contentRouter_taskUpdate_existingPhaseAnchor_targetsCorrectPhaseSection`: Given multiple phase anchors in `tasks.md`, classify a task update and target the correct phase section.
- `contentRouter_taskUpdate_structuredExchangeWithTaskIds_routesToTasks`: Given an exchange payload that mostly contains task state mutation, classify it as `task_update`.
- `contentRouter_taskUpdate_routeAsOverride_honorsForcedTaskUpdate`: Given an ambiguous chunk plus `--route-as task_update`, preserve the task-update route and override metadata.
- `contentRouter_taskUpdate_packetWithoutDecisionDoc_stillTargetsTasks`: Given a packet without `decision-record.md`, classify explicit task mutations and still target `tasks.md`.
- `contentRouter_taskUpdate_placeholderChecklist_avoidsFalsePositive`: Given empty checklist template rows with no completed state, avoid falsely classifying them as real `task_update`.

## contentRouter — `metadata_only`
- `contentRouter_metadataOnly_triggerPhraseArray_routesToContinuity`: Given a metadata payload that only contains trigger phrases, classify it as `metadata_only` and target the thin continuity record.
- `contentRouter_metadataOnly_fsrsStatePayload_routesToContinuity`: Given a chunk with FSRS fields and no narrative content, classify it as `metadata_only`.
- `contentRouter_metadataOnly_fingerprintPayload_routesToSetField`: Given a chunk that contains only fingerprint/session-dedup state, route it to `set-field` on `_memory.continuity`.
- `contentRouter_metadataOnly_preflightPayload_routesToContinuity`: Given a structured preflight baseline payload, classify it as `metadata_only`.
- `contentRouter_metadataOnly_postflightPayload_routesToContinuity`: Given a structured postflight learning payload, classify it as `metadata_only`.
- `contentRouter_metadataOnly_progressCueConflict_prefersMetadata`: Given a mostly machine-state payload with one narrative sentence, classify it as `metadata_only` and not `narrative_progress`.
- `contentRouter_metadataOnly_handoverCueConflict_prefersMetadata`: Given continuity fields plus a small next-step hint, keep the `metadata_only` category because the payload is machine-owned state.
- `contentRouter_metadataOnly_embeddingRescue_routesToContinuity`: Given low-confidence rules but a prototype match for metadata-only payloads, use Tier 2 and route to continuity.
- `contentRouter_metadataOnly_llmEscalation_routesToContinuity`: Given unusual but still metadata-shaped JSON-like input, use Tier 3 and expect `metadata_only`.
- `contentRouter_metadataOnly_highConfidence_silentAutoRoute`: Given a clean machine-state payload, route silently with no warning.
- `contentRouter_metadataOnly_midConfidence_logsRoutingDecision`: Given a metadata payload in the review band, route it and log the classification for audit.
- `contentRouter_metadataOnly_warningBand_emitsWarningButRoutes`: Given a mixed metadata chunk in the `0.5-0.69` band, route it to continuity while warning the caller.
- `contentRouter_metadataOnly_existingContinuityBlock_targetsSetField`: Given an existing `_memory.continuity` block, classify metadata input and keep the field-set target rather than a body anchor.
- `contentRouter_metadataOnly_routeAsOverride_honorsForcedMetadata`: Given an ambiguous payload plus `--route-as metadata_only`, preserve the metadata route and accepted-risk note.
- `contentRouter_metadataOnly_plainNarrativeParagraph_avoidsFalsePositive`: Given ordinary prose with no machine-owned fields, avoid falsely classifying it as `metadata_only`.

## contentRouter — `drop`
- `contentRouter_drop_conversationLogWrapper_refusesRoute`: Given text wrapped in `CONVERSATION_LOG` markers, classify it as `drop` and produce no writable target.
- `contentRouter_drop_rawToolCallTrace_refusesRoute`: Given telemetry-heavy tool-call output with no canonical content, classify it as `drop`.
- `contentRouter_drop_genericRecoveryHint_refusesRoute`: Given boilerplate recovery instructions with no packet-specific information, classify it as `drop`.
- `contentRouter_drop_placeholderTemplateText_refusesRoute`: Given placeholder template text with empty sections, classify it as `drop`.
- `contentRouter_drop_smallTalkExchange_refusesRoute`: Given pure conversational filler with no implementation value, classify it as `drop`.
- `contentRouter_drop_transcriptLikeParagraph_refusesRoute`: Given a transcript-style speaker-turn block, classify it as `drop` instead of routing it into spec docs.
- `contentRouter_drop_embeddingSupportsDrop_keepsRefusal`: Given low-confidence rules but a prototype match for disposable chatter, use Tier 2 and keep the `drop` result.
- `contentRouter_drop_llmEscalation_returnsDrop`: Given ambiguous prose that Tier 1 and Tier 2 cannot safely place, use Tier 3 and expect a final `drop` classification.
- `contentRouter_drop_highConfidence_marksNotOverrideable`: Given clearly disposable conversation content, classify it as `drop` and mark the decision as not overrideable.
- `contentRouter_drop_midConfidence_refusesRouteWithWarning`: Given a likely-drop chunk in the warning band, refuse to route it and surface the ambiguity.
- `contentRouter_drop_lowConfidence_refuseToRouteEscalatesUserDecision`: Given a chunk below the refuse threshold, return the refuse-to-route signal and require manual user intervention.
- `contentRouter_drop_structuredToolCalls_mapToDrop`: Given a structured `toolCalls[]` payload, classify it as `drop` because it is telemetry rather than canonical content.
- `contentRouter_drop_routeAsOverride_stillRecordsAcceptedRisk`: Given a forced override on disposable content, honor the override but record that the natural classifier result was `drop`.
- `contentRouter_drop_packetContextDoesNotCreateFalseTarget`: Given full packet context and existing anchors, keep transcript-only content in `drop` instead of inventing a target.
- `contentRouter_drop_mixedChunkWithNoDominantSignal_refusesRoute`: Given a mixed chunk with no dominant category cues, avoid accidental writes by resolving to `drop` or explicit refusal.

## anchorMergeOperation — `append-as-paragraph`
- `anchorMergeOperation_appendAsParagraph_validAnchor_appendsBeforeClose`: Given a narrative anchor with existing body content, append a new paragraph and expect insertion before the closing anchor marker.
- `anchorMergeOperation_appendAsParagraph_emptyAnchor_initializesFirstParagraph`: Given an empty but valid narrative anchor, append the first paragraph and preserve surrounding anchor structure.
- `anchorMergeOperation_appendAsParagraph_duplicateHash_skipsWrite`: Given incoming content whose hash already exists inside the target anchor, run the merge and expect a no-op result.
- `anchorMergeOperation_appendAsParagraph_preservesBlankLineSeparation`: Given existing paragraph content, append a second paragraph and expect one blank-line separator between the old and new text.
- `anchorMergeOperation_appendAsParagraph_missingAnchor_returnsError`: Given a target anchor ID that does not exist, attempt the merge and expect a hard error with no file mutation.
- `anchorMergeOperation_appendAsParagraph_frontmatterUntouched_preservesBytes`: Given a document with frontmatter plus body anchors, append a paragraph and expect frontmatter bytes to remain unchanged.
- `anchorMergeOperation_appendAsParagraph_adjacentAnchorsUntouched_preserveNeighbors`: Given multiple anchors in sequence, append within one anchor and expect all adjacent anchor content to remain byte-stable.
- `anchorMergeOperation_appendAsParagraph_validationFailure_rollsBackSnapshot`: Given a post-merge validation failure, run the operation and expect backup snapshot restoration instead of partial write-through.
- `anchorMergeOperation_appendAsParagraph_lockHeld_serializesConcurrentWrite`: Given concurrent save attempts to the same spec folder, run the paragraph merge and expect serialized execution with no interleaving corruption.
- `anchorMergeOperation_appendAsParagraph_conflictMarkersPresent_rejectsMerge`: Given target anchor content containing unresolved conflict markers, attempt the merge and expect a legality failure before any write.

## anchorMergeOperation — `insert-new-adr`
- `anchorMergeOperation_insertNewAdr_existingAdrCount_assignsNextNumber`: Given a decision record with existing ADR anchors, insert a new decision and expect the next sequential ADR number.
- `anchorMergeOperation_insertNewAdr_duplicateTitle_skipsInsert`: Given a decision whose title exactly matches an existing ADR title, run the merge and expect a no-op result.
- `anchorMergeOperation_insertNewAdr_trailingComments_preservedAfterInsert`: Given trailing comments at the end of `decision-record.md`, insert a new ADR and expect those comments to remain after the inserted section.
- `anchorMergeOperation_insertNewAdr_nestedAnchors_renderFromTemplate`: Given a valid decision chunk, insert a new ADR and expect all nested ADR sub-anchors to render from the template.
- `anchorMergeOperation_insertNewAdr_missingDecisionRecord_returnsError`: Given an L3 route with no `decision-record.md` present, attempt the merge and expect a hard error rather than silent fallback.
- `anchorMergeOperation_insertNewAdr_frontmatterUntouched_preservesBytes`: Given a decision record with frontmatter, insert a new ADR and expect frontmatter bytes to remain unchanged.
- `anchorMergeOperation_insertNewAdr_anchorValidationFailure_rollsBack`: Given a rendered ADR that would break anchor pairing, attempt the insert and expect rollback to the pre-merge snapshot.
- `anchorMergeOperation_insertNewAdr_numberCollision_recomputesUniqueId`: Given a manually inserted ADR number collision, attempt a new insert and expect the merge logic to choose the next unused ADR number.
- `anchorMergeOperation_insertNewAdr_concurrentSave_serializesWithinLock`: Given simultaneous ADR insert attempts in the same packet, run both and expect the folder mutex to serialize them without duplicate numbering.
- `anchorMergeOperation_insertNewAdr_noDecisionRationale_failsSufficiency`: Given a decision chunk missing rationale fields, insert the ADR candidate and expect validator-driven failure instead of persisted incomplete ADR content.

## anchorMergeOperation — `append-table-row`
- `anchorMergeOperation_appendTableRow_validDecisionTable_appendsRow`: Given a `decisions` markdown table with matching columns, append a new row and expect correct row insertion at the bottom.
- `anchorMergeOperation_appendTableRow_headerOnlyTable_addsFirstDataRow`: Given a table containing only header and separator lines, append a row and expect the first data row to be created correctly.
- `anchorMergeOperation_appendTableRow_duplicateDecisionTitle_skipsInsert`: Given a new row whose decision title already exists in the table, attempt the merge and expect a no-op result.
- `anchorMergeOperation_appendTableRow_columnWidthMismatch_rejectsMerge`: Given a new row that does not match header width, run the merge and expect a legality error.
- `anchorMergeOperation_appendTableRow_pipeEscaping_preservesCellShape`: Given cell text containing pipe characters, append the row and expect markdown-safe escaping with intact table shape.
- `anchorMergeOperation_appendTableRow_missingTablePattern_returnsError`: Given a target anchor with prose instead of a markdown table, attempt `append-table-row` and expect a mode-compatibility failure.
- `anchorMergeOperation_appendTableRow_frontmatterUntouched_preservesBytes`: Given a document with frontmatter and a decision table anchor, append a row and expect frontmatter bytes to remain unchanged.
- `anchorMergeOperation_appendTableRow_adjacentAnchorsUntouched_preserveNeighbors`: Given multiple anchors around the table anchor, append a row and expect only the target anchor body to change.
- `anchorMergeOperation_appendTableRow_validationFailure_rollsBackSnapshot`: Given a row that would produce malformed markdown, attempt the merge and expect rollback to the backup snapshot.
- `anchorMergeOperation_appendTableRow_concurrentWrite_serializesRowInsert`: Given concurrent row-insert attempts against the same packet, run the merge and expect serialized writes with no corrupted table body.

## anchorMergeOperation — `update-in-place`
- `anchorMergeOperation_updateInPlace_existingTaskId_marksCheckboxComplete`: Given a task list containing the target task ID, update that item and expect its checkbox to change from open to complete.
- `anchorMergeOperation_updateInPlace_existingChecklistId_appendsEvidence`: Given a checklist item ID plus evidence text, update the item in place and expect evidence to append without touching sibling lines.
- `anchorMergeOperation_updateInPlace_alreadyCompleteMatchingEvidence_skipsWrite`: Given a target item already complete with identical evidence, run the update and expect a no-op result.
- `anchorMergeOperation_updateInPlace_missingTaskId_returnsError`: Given a task ID that does not exist in the anchor, attempt the update and expect a hard failure rather than silent append behavior.
- `anchorMergeOperation_updateInPlace_wrongAnchorShape_rejectsMerge`: Given an anchor body that is prose instead of a structured list, attempt `update-in-place` and expect a mode-compatibility error.
- `anchorMergeOperation_updateInPlace_onlyTargetLineMutates_preserveNeighbors`: Given several nearby task items, update one task ID and expect all non-target lines to remain unchanged.
- `anchorMergeOperation_updateInPlace_phaseAnchorSelection_updatesCorrectPhase`: Given multiple phase anchors in the same file, run the update and expect only the intended phase section to mutate.
- `anchorMergeOperation_updateInPlace_frontmatterUntouched_preservesBytes`: Given a document with machine-owned frontmatter, update a task item and expect frontmatter bytes to remain unchanged.
- `anchorMergeOperation_updateInPlace_validationFailure_rollsBackSnapshot`: Given a malformed evidence append that would break list syntax, attempt the update and expect rollback rather than partial mutation.
- `anchorMergeOperation_updateInPlace_concurrentMutations_serializeWithoutLoss`: Given two updates against the same task file in one packet, run them concurrently and expect lock-serialized results with no lost checkbox state.

## anchorMergeOperation — `append-section`
- `anchorMergeOperation_appendSection_validResearchDoc_addsTimestampedSection`: Given `research/research.md` with prior findings, append a new finding and expect a timestamped section at the bottom.
- `anchorMergeOperation_appendSection_duplicateTitleAndBody_skipsWrite`: Given a finding whose title and body hash already exist, run the merge and expect a no-op result.
- `anchorMergeOperation_appendSection_preservesTrailingComments`: Given trailing comments after the research body, append a section and expect those comments to remain at the end.
- `anchorMergeOperation_appendSection_emptyResearchDoc_initializesFirstSection`: Given an empty but valid research document, append a new finding and expect the first section to be created correctly.
- `anchorMergeOperation_appendSection_missingResearchDoc_returnsError`: Given a route targeting research but no research document on disk, attempt the merge and expect a hard error.
- `anchorMergeOperation_appendSection_frontmatterUntouched_preservesBytes`: Given research docs with frontmatter, append a section and expect frontmatter bytes to remain unchanged.
- `anchorMergeOperation_appendSection_anchorValidationFailure_rollsBack`: Given a new section render that would break anchor pairing, attempt the merge and expect rollback to the backup snapshot.
- `anchorMergeOperation_appendSection_adjacentSectionsUntouched_preserveExistingFindings`: Given several existing findings, append a new section and expect all earlier sections to remain byte-stable.
- `anchorMergeOperation_appendSection_concurrentWrites_serializeSectionAppend`: Given simultaneous research-finding appends in the same packet, run both and expect serialized section insertion without interleaving.
- `anchorMergeOperation_appendSection_headingFormat_normalizesFindingTitle`: Given a finding title with punctuation and whitespace noise, append the section and expect the heading format to remain consistent with the packet convention.

## thin continuity schema validator
- `thinContinuitySchema_validBlock_normalizesAndPasses`: Given a complete `_memory.continuity` block with valid field shapes, validate it and expect normalized output plus pass status.
- `thinContinuitySchema_invalidPacketPointer_rejectsAbsolutePath`: Given `packet_pointer` as an absolute path or containing `..`, validate the block and expect `MEMORY_003`.
- `thinContinuitySchema_offsetTimestamp_normalizesToZulu`: Given `last_updated_at` with a timezone offset, validate it and expect normalization to canonical `Z` format.
- `thinContinuitySchema_invalidActorSlug_rejectsLastUpdatedBy`: Given `last_updated_by` with spaces or uppercase noise, validate it and expect `MEMORY_005`.
- `thinContinuitySchema_narrativeRecentAction_rejectsProse`: Given `recent_action` as multi-sentence narrative text, validate it and expect `MEMORY_006`.
- `thinContinuitySchema_imperativeNextSafeAction_acceptsCompactPhrase`: Given `next_safe_action` as a short imperative phrase, validate it and expect pass status with unchanged action text.
- `thinContinuitySchema_noneBlockers_normalizesToEmptyArray`: Given `blockers` containing `"none"` or `"n/a"`, validate it and expect normalization to an empty array.
- `thinContinuitySchema_absoluteKeyFile_rejectsPath`: Given `key_files` entries that are absolute or use backslashes, validate them and expect `MEMORY_009`.
- `thinContinuitySchema_questionOverlap_rejectsConflictingSets`: Given overlapping `open_questions` and `answered_questions`, validate the block and expect `MEMORY_016`.
- `thinContinuitySchema_oversizeFragment_compactsThenFailsBudget`: Given a continuity block above 2KB after normalization caps, validate it and expect deterministic compaction followed by `MEMORY_017`.

## spec-doc-structure validator
- `specDocStructure_anchorSyntaxMalformed_returnsAnchors001`: Given an anchor comment with invalid syntax, validate the doc and expect `SPECDOC_ANCHORS_001`.
- `specDocStructure_orphanCloseAnchor_returnsAnchors002`: Given a closing anchor with no matching opener, validate the doc and expect `SPECDOC_ANCHORS_002`.
- `specDocStructure_missingRequiredImplementationAnchor_returnsAnchors004`: Given `implementation-summary.md` missing `verification`, validate it and expect `SPECDOC_ANCHORS_004`.
- `specDocStructure_extraCustomAnchor_warnsAnchors006`: Given an extra custom anchor in an otherwise valid doc, validate it and expect warning code `SPECDOC_ANCHORS_006`.
- `specDocStructure_invalidYamlFrontmatter_returnsFrontmatter001`: Given malformed YAML in frontmatter, validate the doc and expect `SPECDOC_FRONTMATTER_001`.
- `specDocStructure_missingMemoryBlockOnSaveTarget_warnsFrontmatter002`: Given an active save target with no `_memory` block, validate it and expect warning code `SPECDOC_FRONTMATTER_002`.
- `specDocStructure_invalidFingerprintFormat_returnsFrontmatter005`: Given `_memory.fingerprint` without the required hash prefix, validate it and expect `SPECDOC_FRONTMATTER_005`.
- `specDocStructure_mergeModeShapeMismatch_returnsMerge003`: Given `append-table-row` targeting prose content, run merge legality and expect `SPECDOC_MERGE_003`.
- `specDocStructure_missingTargetAnchor_returnsMerge002`: Given a merge plan whose anchor does not exist, validate it and expect `SPECDOC_MERGE_002`.
- `specDocStructure_emptyWhatBuiltAnchor_returnsSufficiency001`: Given an empty `what-built` anchor body, validate sufficiency and expect `SPECDOC_SUFFICIENCY_001`.
- `specDocStructure_weakVerificationEvidence_warnsSufficiency002`: Given `verification` text with no concrete command or artifact, validate it and expect warning code `SPECDOC_SUFFICIENCY_002`.
- `specDocStructure_researchWithoutCitation_warnsSufficiency004`: Given a research anchor body with no cited source, validate it and expect warning code `SPECDOC_SUFFICIENCY_004`.
- `specDocStructure_alternateCategoryWins_warnsContam001`: Given merged content whose prototype similarity favors another category by the configured margin, validate it and expect `SPECDOC_CONTAM_001`.
- `specDocStructure_dropClassification_returnsContam003`: Given a routed chunk that rule-based and embedding checks both resolve to `drop`, validate it and expect `SPECDOC_CONTAM_003`.
- `specDocStructure_postSaveFingerprintMismatch_rollsBackWithFingerprint002`: Given a saved file whose re-read fingerprint differs from the planned fingerprint, validate post-save state and expect rollback plus `SPECDOC_FINGERPRINT_002`.

## resumeLadder
- `resumeLadder_handoverPresent_returnsHappyPathPackage`: Given a valid `handover.md`, run resume and expect the first-screen package to come from the handover path with no deeper fallback.
- `resumeLadder_missingHandover_usesContinuityFrontmatter`: Given no `handover.md` but a valid `_memory.continuity` block, run resume and expect recovery data from `implementation-summary.md` frontmatter.
- `resumeLadder_malformedContinuity_fallsThroughToSpecDocs`: Given a malformed continuity block, run resume and expect a warning plus fallback to direct spec-doc reads.
- `resumeLadder_missingCanonicalDocs_usesArchivedFallback`: Given no handover and no canonical docs but archived recovery rows exist, run resume and expect archived memory fallback results.
- `resumeLadder_noRecoveryContext_surfacesPlanSuggestion`: Given no recoverable state in any ladder tier, run resume and expect an explicit “no recovery context found” message plus `/spec_kit:plan` guidance.
- `resumeLadder_invalidPacketPointer_requestsExplicitSpecFolder`: Given a packet pointer that resolves nowhere, run resume and expect the handler to request `--spec-folder` or equivalent user guidance.
- `resumeLadder_deepProfile_readsFullSpecDocs`: Given `--profile deep`, run resume and expect the ladder to load richer spec-doc context beyond the compact happy path.
- `resumeLadder_noArchivedFlag_skipsArchiveTier`: Given `--no-archived` and no fresh sources, run resume and expect the ladder to skip archived fallback rather than using it.
- `resumeLadder_handoverAndContinuityConflict_prefersFreshestSignal`: Given both handover and continuity data with different timestamps, run resume and expect the fresher signal to win synthesis.
- `resumeLadder_stalePacketPointer_butExplicitOverride_usesOverride`: Given a stale stored pointer plus an explicit spec-folder override, run resume and expect the explicit path to short-circuit pointer resolution.

## Integration scenarios
- `integration_freshPacketLifecycle_planSaveResumeSearchComplete_succeeds`: Given a fresh packet fixture, run the full lifecycle from planning through completion and expect all canonical doc, continuity, and retrieval steps to compose cleanly.
- `integration_existingPacketSave_existingAnchorsMergeWithoutCorruption`: Given an existing packet with populated anchors, save new content into it and expect successful merge with no anchor corruption.
- `integration_concurrentSaves_samePacket_mutexSerializesWrites`: Given two saves aimed at the same packet at the same time, execute both and expect mutex-serialized writes with no lost content.
- `integration_externalEditDuringSave_mtimeRetryPreservesHumanChange`: Given a human edit that lands during save planning, run the save and expect mtime detection, retry behavior, and preserved human changes.
- `integration_rootPacketMissingCanonicalDocs_fallbackActivatesSafely`: Given a root packet without canonical docs, run save or resume and expect safe fallback behavior rather than silent corruption.
- `integration_decisionPromotion_childToParent_preservesCausalTraversal`: Given a child decision that should promote to a parent packet, execute the flow and expect preserved causal graph traversal across packets.
- `integration_highConfidenceSave_autoRoutesWithoutPrompt`: Given high-confidence routing decisions, run save and expect no interactive prompt while still producing the correct canonical writes.
- `integration_lowConfidenceChunk_refusesRouteAndPromptsUser`: Given low-confidence content, run save and expect refuse-to-route behavior plus a user-facing prompt rather than unsafe writes.
- `integration_routeAsOverride_forcedCategoryPersistsAcceptedRisk`: Given `--route-as` on an ambiguous chunk, run save and expect the forced route to execute while recording accepted risk.
- `integration_validatorFailure_rollsBackAllChanges`: Given a merge candidate that fails validator checks, run save and expect full rollback with no partial on-disk mutation.
- `integration_dryRunMode_reportsPlanWithoutSideEffects`: Given a valid save request in dry-run mode, run it and expect a full routing/merge report with zero file or index mutations.
- `integration_multiChunkSave_mixedCategoriesLandInCorrectTargets`: Given a single save request with mixed progress, decision, metadata, and handover chunks, run save and expect each chunk to land in its canonical target.
- `integration_prePhase018Doc_missingContinuityBackfillsOnFirstTouch`: Given a legacy canonical doc with no `_memory.continuity`, run the first save and expect graceful backfill plus preserved main content.
- `integration_archiveFallback_noFreshResultsUsesArchivedSupport`: Given a query with no fresh canonical matches, run retrieval and expect archived fallback support to appear according to archive policy.
- `integration_resumeWithStalePacketPointer_ladderStillFindsCurrentContext`: Given a stale stored pointer and recoverable current packet docs, run resume and expect the ladder to recover actionable context.
- `integration_resumeWithMalformedHandover_continuityFallbackStillWorks`: Given malformed `handover.md` but valid continuity frontmatter, run resume and expect fallback to continuity rather than total failure.
- `integration_sharedMemoryGovernance_unauthorizedActorSeesNoProtectedRows`: Given shared content and an unauthorized actor, run retrieval and expect deny-by-default enforcement on protected rows.
- `integration_crossPacketPromotion_preservesAnchorLevelCausalEdges`: Given content promoted across packets, run indexing and expect anchor-level causal edges to remain intact.
- `integration_constitutionalMemoryRelevantQuery_surfacesAtTop`: Given a relevant constitutional file and competing canonical docs, run retrieval and expect constitutional guidance at the top of results.
- `integration_triggerFastPath_knownTrigger_staysSubMsClass`: Given a known trigger phrase in a warm cache, run the fast path and expect practical sub-millisecond class behavior rather than full search latency.
- `integration_fsrsDecay_simulatedTimeLowersRetrievability`: Given fixed review state and simulated elapsed time, run retrieval twice and expect lower retrievability for older content.
- `integration_sessionDedup_repeatQuery_reducesPayloadSize`: Given the same query run twice in one session, execute both and expect the second payload to shrink materially through dedup.
- `integration_migrationBackfill_prePhase018Docs_gainCanonicalMemoryBlock`: Given pre-phase-018 spec docs, run the migration backfill flow and expect canonical memory fields to populate safely.
- `integration_schemaRollback_copyDatabase_restoresPreMigrationState`: Given a migrated copy of the database, run rollback and expect full restoration to the pre-migration schema and content state.
- `integration_postSaveFingerprintMismatch_triggersRollbackAndAlert`: Given a post-save fingerprint mismatch, complete the save pipeline and expect rollback plus surfaced alert telemetry.

## Regression per feature
- `regression_triggerPhraseMatching_knownTrigger_preservesFastLookup`: Given a known trigger phrase in canonical docs, run trigger matching and expect preserved fast-path retrieval behavior.
- `regression_intentRouting_sevenIntents_hitExpectedTargets`: Given representative queries for the seven intents, run retrieval and expect each intent to land on the correct canonical target class.
- `regression_sessionDedup_secondQuery_suppressesRepeatHits`: Given two identical queries in one session, run both and expect duplicate logical hits to be suppressed on the second response.
- `regression_qualityGates_invalidStructure_rejectedBeforeWrite`: Given a candidate doc missing required anchors, run the save pipeline and expect structure-gate rejection before write.
- `regression_reconsolidation_similarityAboveThreshold_autoMerges`: Given near-duplicate content above the merge threshold, run reconsolidation and expect automatic merge rather than duplicate creation.
- `regression_causalGraph_twoHopTraversal_returnsAnchorChain`: Given linked anchors across two hops, run causal traversal and expect the full anchor-level explanation chain.
- `regression_memoryTiers_constitutionalRows_surfaceFirstWhenRelevant`: Given relevant constitutional and lower-tier rows, run retrieval and expect constitutional content to rank first.
- `regression_fsrsDecay_elapsedTime_reducesRankingStrength`: Given comparable rows with simulated time passage, run retrieval and expect decayed content to weaken in ranking.
- `regression_sharedMemoryGovernance_unauthorizedQuery_returnsNoSharedContent`: Given an unauthorized actor querying protected shared memory, run retrieval and expect zero protected hits.
- `regression_ablationStudies_archivedHitRate_metricEmitted`: Given an archive-sensitive evaluation corpus, run ablation and expect `archived_hit_rate` to appear in the report.
- `regression_constitutionalMemory_fileBasedResolution_stillAlwaysSurfaces`: Given constitutional guidance moved into file form, run a relevant query and expect it to resolve and surface at the top.
- `regression_embeddingSemanticSearch_paraphrasedQuery_returnsExpectedTopK`: Given a paraphrased semantic query, run vector retrieval and expect the intended canonical result in top-K.
- `regression_fourStageSearchPipeline_allChannelsParticipateAndFuseCorrectly`: Given a fixture that activates trigger, BM25, FTS5, vector, and graph evidence, run the full pipeline and expect correct gather, fusion, rerank, and filter behavior.

## Summary
- `contentRouter`: 120 unit test descriptions
- `anchorMergeOperation`: 50 unit test descriptions
- Continuity schema validator: 10 test descriptions
- Spec-doc-structure validator: 15 test descriptions
- `resumeLadder`: 10 test descriptions
- Integration scenarios: 25 test descriptions
- Regression suite: 13 test descriptions

## Findings
- `contentRouter` needs the broadest catalog because the main risk is silent misclassification across eight content categories and four confidence behaviors.
- `anchorMergeOperation` needs dense mode-by-mode tests because idempotency, rollback, and anchor integrity are where write corruption would surface first.
- The validator and resume catalogs are smaller because the contracts are tighter, but they remain merge-blocking due to their central role in phase 018 safety and recovery.
