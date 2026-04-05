● skill(sk-code-review)

I’m pulling the catalog files plus the review guidance up front, then I’ll cross-check each feature against both `mcp_server/` and `scripts/` and only flag real mismatches.

● Read review_core.md
  │ .agents/skills/sk-code-review/references/review_core.md
  └ L1:220 (98 lines read)

● Read review_ux_single_pass.md
  │ .agents/skills/sk-code-review/references/review_ux_single_pass.md
  └ L1:220 (82 lines read)

● memory_match_triggers
  └ {"summary":"Matched 3 memories via trigger phrases","data":{"matchType":"trig...

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/02--mutation/*.md"
  └ 10 files found

● Run skill advisor (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && python3
  │ .opencode/skill/scripts/skill_advisor.py 'Review ALL .md files in
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/ against mcp_server
  │ handlers/tools/lib and scripts; verify tool names, parameters, handlers, mutation logic; output
  │ aligned/misaligned/partial per file.' --threshold 0.8
  └ 27 lines...

● skill(sk-code-opencode)

I’ve got the file list and routing context. Next I’m reading all ten catalog entries together so I can cross-check each one consistently against the actual handlers and tool definitions.

● Read 04-tier-based-bulk-deletion-memorybulkdelete.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/04-tier-based-bulk-deletion-memoryb
  │ ulkdelete.md
  └ 160 lines read

● Read 01-memory-indexing-memorysave.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md
  └ 88 lines read

● Read 02-memory-metadata-update-memoryupdate.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/02-memory-metadata-update-memoryupd
  │ ate.md
  └ 64 lines read

● Read 03-single-and-folder-delete-memorydelete.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/03-single-and-folder-delete-memoryd
  │ elete.md
  └ 279 lines read

● Read 05-validation-feedback-memoryvalidate.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/05-validation-feedback-memoryvalida
  │ te.md
  └ 66 lines read

● Read 06-transaction-wrappers-on-mutation-handlers.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/06-transaction-wrappers-on-mutation
  │ -handlers.md
  └ 50 lines read

● Read 07-namespace-management-crud-tools.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.
  │ md
  └ 62 lines read

● Read 08-prediction-error-save-arbitration.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/08-prediction-error-save-arbitratio
  │ n.md
  └ 52 lines read

● Read 09-correction-tracking-with-undo.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md
  └ 50 lines read

● Read 10-per-memory-history-log.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/10-per-memory-history-log.md
  └ 52 lines read

● Create session plan (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/dc500abc-edaa-4278-a752-e2d50152e66d/plan.md'
  │ <<'EOF'
  │ # Plan…
  └ 9 lines...

I’ve read the catalog itself. Now I’m pulling the real tool/schema/handler locations so I can compare documented parameters and behavior against the code instead of relying on the source-file tables in the docs.

● Search (grep)
  │ "memorySaveInputSchema|memoryUpdateInputSchema|memoryDeleteInputSchema|memoryBulkDeleteInputSche
  │ ma|memoryValidateInputSchema|sharedSpaceUpsertInputSchema|sharedSpaceMembershipSetInputSchema|sh
  │ aredMemoryStatusInputSchema|sharedMemoryEnable"
  │ (.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts)
  └ No matches found

● Search (grep)
  │ "memory_save|memory_update|memory_delete|memory_bulk_delete|memory_validate|shared_space_upsert|
  │ shared_space_membership_set|shared_memory_status|shared_memory_enable"
  │ (.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
  └ 9 lines found

● Search (grep)
  │ "case 'memory_save'|case 'memory_update'|case 'memory_delete'|case 'memory_bulk_delete'|case
  │ 'memory_validate'|case 'shared_space_upsert'|case 'shared_space_membership_set'|case
  │ 'shared_memory_status'|case 'shared_memory_enable'"
  │ (.opencode/skill/system-spec-kit/mcp_server/tools)
  └ 9 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/scripts/**/*.js"
  └ 28 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/handlers/**/*.ts"
  └ 44 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/scripts/**/*.ts"
  └ 146 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/scripts/**/*.py"
  └ 1 file found

● Search (grep)
  │ "handleMemorySave|handleMemoryUpdate|handleMemoryDelete|handleMemoryBulkDelete|handleMemoryValid
  │ ate|handleSharedSpaceUpsert|handleSharedSpaceMembershipSet|handleSharedMemoryStatus|handleShared
  │ MemoryEnable" (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 31 lines found

● Search (grep)
  │ "negative_feedback_events|learned_triggers|groundTruthSelectionId|recordNegativeFeedbackEvent|au
  │ toPromotion" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "recordHistory|memory_history|cleanup-orphaned-vectors|orphaned history|orphaned_history" in
  │ *.{ts,js,py,md} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "corrections|undo_correction|before_stability|after_stability|is_undone|SPECKIT_RELATIONS" in
  │ *.{ts,js,py,md} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "memory_conflicts|REINFORCE|UPDATE|SUPERSEDE|CREATE_LINKED|CREATE" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "runInTransaction|clear_search_cache|clearSearchCache|invalidate.*cache|tool cache|trigger
  │ matcher|constitutional cache" in *.ts (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 4 lines found

● Read memory-tools.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts
  └ L1:120 (77 lines read)

● Read tool-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ L210:465 (256 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L1:260 (259 lines read)

● Read lifecycle-tools.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts
  └ L1:110 (66 lines read)

● Search (grep)
  │ "sharedSpaceUpsertInputSchema|sharedSpaceMembershipSetInputSchema|sharedMemoryStatusInputSchema"
  │ (.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts)
  └ No matches found

● Search (grep)
  │ "sharedSpaceUpsertSchema|sharedSpaceMembershipSetSchema|sharedMemoryStatusSchema|sharedMemoryEna
  │ bleSchema|shared_space_upsert|shared_space_membership_set|shared_memory_status|shared_memory_ena
  │ ble" (.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts)
  └ 8 lines found

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L430:490 (61 lines read)

● Read memory-crud-delete.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts
  └ L1:320 (288 lines read)

● Read memory-crud-update.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts
  └ L1:320 (295 lines read)

● Read memory-bulk-delete.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts
  └ L1:320 (285 lines read)

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
  └ L520:700 (176 lines read)

● Read shared-memory.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts
  └ L240:640 (401 lines read)

I’ve confirmed the real tool registrations and started tracing the handlers. A few docs already look suspicious on exact parameter semantics, so I’m checking those against the actual runtime code before I label anything misaligned.

● Search (grep)
  │ "resolveAdminActor|actorUserId|actorAgentId|buildAdminScope|assertSharedSpaceAccess"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts)
  └ 16 lines found

● Search (grep)
  │ "recordValidation|promotionEligible|0\.1|0\.05|0\.5|validationCount|positiveValidationCount"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts)
  └ 33 lines found

● Search (grep)
  │ "executeAutoPromotion|5|10|3 per
  │ 8|8-hour|non-promotable|constitutional|critical|temporary|deprecated"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts)
  └ 15 lines found

● Search (grep)
  │ "recordNegativeFeedbackEvent|negative_feedback_events|half-life|0\.3|0\.1"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts)
  └ 13 lines found

● Search (grep)
  │ "recordUserSelection|recordSelection|learned_triggers|groundTruthSelectionId|queryTerms|resultRa
  │ nk" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/lib/learning/**/*.ts"
  └ 2 files found

● Search (grep)
  │ "recordHistory\(|memory_history|orphaned history|cleanup-orphaned-vectors" in *.{ts,js,py,md}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "SPECKIT_RELATIONS|undo_correction|before_stability|after_stability|is_undone|Correction#" in
  │ *.{ts,js,py,md} (.opencode/skill/system-spec-kit)
  └ 43 lines found

● Read shared-memory.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts
  └ L35:140 (106 lines read)

● Read confidence-tracker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts
  └ L80:190 (111 lines read)

● Read auto-promotion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts
  └ L1:280 (280 lines read)

● Read negative-feedback.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts
  └ L1:210 (177 lines read)

● Read corrections.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts
  └ L1:240 (240 lines read)

● Read corrections.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts
  └ L520:660 (141 lines read)

● Read history.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "corrections|undo_correction|SPECKIT_RELATIONS|shared
  │ memory|shared_space|promotion|negative_feedback_events|learned_triggers" in *.{ts,js,py}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 2 lines found

● Search (grep)
  │ "memory_save|memory_update|memory_delete|memory_bulk_delete|memory_validate|shared_space_upsert|
  │ shared_space_membership_set|shared_memory_status|shared_memory_enable" in *.{ts,js,py}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 8 lines found

● Search (grep)
  │ "cleanup-orphaned-vectors|memory_history|orphaned
  │ history|generate-context|validate-memory-quality|quality gate|reindex-embeddings" in
  │ *.{ts,js,py} (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Search (grep)
  │ "prediction error|REINFORCE|SUPERSEDE|CREATE_LINKED|memory_conflicts|similarity" in *.{ts,js,py}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 13 lines found

● Read history.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts
  └ L260:420 (161 lines read)

● Search (grep)
  │ "export function recordHistory|recordHistory\("
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts)
  └ 1 line found

● Read vector-index-schema.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
  └ L340:420 (81 lines read)

● Read cleanup-orphaned-vectors.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts
  └ L1:260 (204 lines read)

● Read learned-feedback.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts
  └ L1:260 (260 lines read)

● Read ground-truth-feedback.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts
  └ L1:220 (220 lines read)

● Search (grep)
  │ "REINFORCE|UPDATE|SUPERSEDE|CREATE_LINKED|CREATE|memory_conflicts|sessionId|force|embedding"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts)
  └ 40 lines found

● Search (grep)
  │ "asyncEmbedding|skipPreflight|dryRun|INSUFFICIENT_CONTEXT_ABORT|template
  │ contract|reconsolidation|SPECKIT_CONSOLIDATION|SPECKIT_RECONSOLIDATION|SPECKIT_ENCODING_INTENT|p
  │ ending|clearSearchCache|clear_search_cache|runPostMutationHooks|content hash|partial"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 56 lines found

● Search (grep)
  │ "normalizeContentForEmbeddings|normalizeContentForBM25|frontmatter|anchors|HTML comments|code
  │ fences|tables|lists|headings"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts)
  └ 19 lines found

● Search (grep)
  │ "REINFORCE|UPDATE|SUPERSEDE|CREATE_LINKED|CREATE|memory_conflicts|sessionId|force|embedding"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts)
  └ 26 lines found

● Search (grep)
  │ "recordHistory\(|clearSearchCache|encoding_intent|importance_weight|document|spec|plan|scratch|m
  │ emory file|chunk thinning|anchor|0\.3|0\.6|0\.4"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts)
  └ 19 lines found

● Search (grep)
  │ "quality loop|verify-fix-verify|attempts|retry|semantic sufficiency|template
  │ contract|reject|status: 'rejected'|rollback"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts)
  └ 29 lines found

● Search (grep)
  │ "memory_save|generate-context|insufficiency|semantic sufficiency|template contract" in
  │ *.{ts,js,py} (.opencode/skill/system-spec-kit/scripts)
  └ 82 lines found

● Search (grep)
  │ "delete_memory_by_path|deleteMemories|recordHistory\(|clearSearchCache"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts)
  └ 6 lines found

I’ve got enough code to start separating “feature exists” from “doc overstates behavior.” I’m now drilling into the save/arbitration paths because those entries pack the most claims and are the most likely to hide subtle drift.

● Read pe-gating.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts
  └ L1:360 (341 lines read)

● Read pe-orchestration.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts
  └ L1:230 (170 lines read)

● Read prediction-error-gate.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts
  └ L1:260 (260 lines read)

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L650:990 (341 lines read)

● Read create-record.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts
  └ L1:260 (233 lines read)

● Read reconsolidation-bridge.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "same-path|healthy state|partial|content_hash|same path|unchanged|duplicate"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 18 lines found

● Search (grep)
  │ "clearSearchCache|clear_search_cache" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 20 lines found

● Search (grep)
  │ "canonical_file_path|content_hash|embedding_status|success|pending|partial|complete"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts)
  └ 5 lines found

● Search (grep)
  │ "calculateDocumentWeight|constitutional|0\.8|0\.7|0\.5|0\.25|scratch|plan"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/document-helpers.ts)
  └ 12 lines found

● Read vector-index-mutations.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts
  └ L200:260 (61 lines read)

● Read vector-index-mutations.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts
  └ L430:520 (91 lines read)

● Read vector-index-mutations.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts
  └ L620:675 (56 lines read)

● Read prediction-error-gate.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts
  └ L258:360 (103 lines read)

● Read embedding-pipeline.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts
  └ L1:260 (209 lines read)

● Read chunking-orchestrator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts
  └ L520:640 (82 lines read)

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L300:560 (261 lines read)

● Read content-normalizer.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts
  └ L190:280 (74 lines read)

● Read save-quality-gate.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts
  └ L1:260 (260 lines read)

● Read spec-folder-mutex.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts
  └ L1:220 (29 lines read)

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L120:300 (181 lines read)

● Search (grep)
  │ "function
  │ checkContentHashDedup|healthy|partial|pending|complete|contentHash|same-path|canonicalFilePath"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 37 lines found

● Search (grep)
  │ "olderThanDays|skipCheckpoint|checkpoint|linkedMemoryIds|slice\(0, 50\)|runPostMutationHooks"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts)
  └ 46 lines found

● Search (grep)
  │ "pre-cleanup-|createCheckpoint|proceeding without backup|mutation
  │ ledger|deletedIds|recordHistory"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts)
  └ 8 lines found

● Search (grep)
  │ "exactly one actor|required|optional corroboration|shared-memory admin identity" (.opencode/skil
  │ l/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.md)
  └ 3 lines found

● Search (grep)
  │ "InputSchema|actorUserId|actorAgentId|Provide only one actor identity hint|Omit
  │ actorUserId/actorAgentId|server-configured shared-memory admin"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts)
  └ 10 lines found

● Search (grep)
  │ "appendMutationLedgerSafe\("
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ No matches found

● Search (grep)
  │ "appendMutationLedgerSafe\(" in *.ts (.opencode/skill/system-spec-kit/mcp_server/handlers/save)
  └ 4 lines found

● Search (grep)
  │ "appendMutationLedgerSafe\(" (.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts)
  └ No matches found

● Read response-builder.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts
  └ L110:220 (111 lines read)

● Search (grep)
  │ "SPECKIT_CONSOLIDATION|weekly|contradictions|Hebbian|stale edges|20 per node|0\.85|90\+ days" in
  │ *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "SPECKIT_ENCODING_INTENT|encoding_intent|document|code|structured_data|0\.4" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "shared-memory lifecycle|shared_space_upsert|shared_space_membership_set|shared_memory_status|sh
  │ ared_memory_enable" in *.{ts,js,py} (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Search (grep)
  │ "record_correction\(|undo_correction\(|from '../lib/learning/corrections'|from
  │ './lib/learning/corrections'|from '../lib/learning'" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 9 lines found

● Search (grep)
  │ "recordHistory\(|getHistory\(|getHistoryEventsForLineage|getLineageTransitionAnchors" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 57 lines found

● Search (grep)
  │ "memory_bulk_delete|memory_delete|memory_update|memory_validate|memory_save" in *.{ts,js,py}
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 8 lines found

I found an important drift in the save/arbitration docs: the documented `UPDATE` path says “in-place update,” but the handler actually appends a new version and deprecates the old record. I’m checking whether that same drift shows up in the broader `memory_save` page and whether any other “sounds right but isn’t” claims remain.

● Search (grep)
  │ "live behavior|learning pipeline|record_correction\(|undo_correction\(|corrections" (.opencode/s
  │ kill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md)
  └ 8 lines found

● Search (grep)
  │ "causal edge|causal_edges|supersedes|recordLineageTransition|transitionEvent|CREATE_LINKED|relat
  │ ed_memories" in *.ts (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 39 lines found

● Search (grep)
  │ "CREATE_LINKED|related_memories|supersede|appendOnly|deprecated"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts)
  └ 8 lines found

● Search (grep)
  │ "record_correction\(|undo_correction\(|corrections" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ No matches found

● Search (grep)
  │ "record_correction\(|undo_correction\(|corrections" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tools)
  └ No matches found

● Search (grep)
  │ "record_correction\(|undo_correction\(|corrections" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read lineage-state.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts
  └ L360:470 (111 lines read)

● Search (grep)
  │ "function recordLineageTransition|export function recordLineageTransition|INSERT INTO
  │ causal_edges|INSERT INTO memory_lineage|causal_edges"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts)
  └ 4 lines found

✗ Memory stored shared memory
  └ Shared-memory lifecycle tools use server-configured admin identity; actorUserId/…

I’ve got the verdicts. I’m just doing one last evidence pass on the specific doc lines behind the mismatches so the final report stays tight and only flags real drift.

● Read 01-memory-indexing-memorysave.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md
  └ L18:28 (11 lines read)

● Read 03-single-and-folder-delete-memorydelete.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/03-single-and-folder-delete-memoryd
  │ elete.md
  └ L18:24 (7 lines read)

● Read 07-namespace-management-crud-tools.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.
  │ md
  └ L16:25 (9 lines read)

● Read 08-prediction-error-save-arbitration.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/08-prediction-error-save-arbitratio
  │ n.md
  └ L18:25 (7 lines read)

● Read 09-correction-tracking-with-undo.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md
  └ L18:24 (7 lines read)

● Read shared-memory.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts
  └ L40:128 (89 lines read)

● Read memory-crud-delete.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts
  └ L157:186 (30 lines read)

● Read pe-gating.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts
  └ L223:279 (57 lines read)

● Read create-record.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts
  └ L168:183 (16 lines read)

`01-memory-indexing-memorysave.md | PARTIAL | Core save pipeline is implemented in mcp_server handlers/tools, but PE action semantics are overstated: UPDATE appends a new version and deprecates the old record, not an in-place overwrite; CREATE_LINKED stores `related_memories`, not an automatic causal edge.`

`02-memory-metadata-update-memoryupdate.md | ALIGNED | Tool/schema/handler wiring, transactional update flow, partial-update behavior, BM25 refresh, and embedding-regeneration rules all match implementation.`

`03-single-and-folder-delete-memorydelete.md | PARTIAL | Single delete is aligned. Folder delete checkpointing is best-effort, not guaranteed: if checkpoint creation fails, deletion still proceeds after confirmation.`

`04-tier-based-bulk-deletion-memorybulkdelete.md | ALIGNED | Tier guardrails, checkpoint rules, delete transaction, causal-edge cleanup, and consolidated ledger behavior match code.`

`05-validation-feedback-memoryvalidate.md | ALIGNED | Handler, confidence updates, auto-promotion, negative-feedback persistence, learned-feedback hooks, and ground-truth logging are all present.`

`06-transaction-wrappers-on-mutation-handlers.md | ALIGNED | Transaction wrappers around update/delete/reconsolidation handlers exist as described.`

`07-namespace-management-crud-tools.md | MISALIGNED | Docs say exactly one actor identity is required from the caller. Actual code uses the server-configured shared-memory admin as authority; actorUserId/actorAgentId are optional corroboration hints and may be omitted.`

`08-prediction-error-save-arbitration.md | PARTIAL | Decision engine, thresholds, session filtering, and conflict logging exist. But UPDATE is not in-place, and CREATE_LINKED does not create an automatic causal edge.`

`09-correction-tracking-with-undo.md | PARTIAL | The corrections module and undo logic exist, but I found no handler/tool wiring in mcp_server `handlers/` or `tools/`; the “live behavior during the learning pipeline” claim is overstated.`

`10-per-memory-history-log.md | ALIGNED | `memory_history` storage, per-memory event recording across mutation paths, and orphan cleanup support are implemented.`

`SUMMARY: total=10, aligned=5, misaligned=1, partial=4, P0=0, P1=4, P2=1`

