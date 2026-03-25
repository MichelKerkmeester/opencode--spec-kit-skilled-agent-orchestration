● skill(sk-code--review)

I’m mapping the catalog files and the source of truth first, then I’ll do a file-by-file alignment pass with concrete mismatches only.

● Read quick_reference.md
  │ .agents/skills/sk-code--review/references/quick_reference.md
  └ 59 lines read

● Read review_core.md
  │ .agents/skills/sk-code--review/references/review_core.md
  └ 98 lines read

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/02--mutation/*.md"
  └ 10 files found

● Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/0a8c7bcc-d875-406a-934d-65f2cffbf024/plan.md'
  │ <<'EOF'
  │ 1. Inventory the 10 mutation feature catalog markdown files.
  │ 2. Read each file and extract the documented tool/feature names plus parameters.…
  └ 5 lines...

I’ve got the 10 targets. Next I’m reading them all together and then I’ll cross-check each claimed tool/parameter against `scripts/` so the findings stay evidence-based.

● Read 02-memory-metadata-update-memoryupdate.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/02-memory-metadata-update-memoryupd
  │ ate.md
  └ 64 lines read

● Read 01-memory-indexing-memorysave.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md
  └ 88 lines read

● Read 03-single-and-folder-delete-memorydelete.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/03-single-and-folder-delete-memoryd
  │ elete.md
  └ 279 lines read

● Read 04-tier-based-bulk-deletion-memorybulkdelete.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/04-tier-based-bulk-deletion-memoryb
  │ ulkdelete.md
  └ 160 lines read

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

I’ve finished the document read. Now I’m checking whether the catalog’s claimed tools and parameters actually exist under `scripts/` versus only in `mcp_server`, which is likely where the biggest drift will show up.

● Search (grep)
  │ "\basyncEmbedding\b|\ballowPartialUpdate\b|\bolderThanDays\b|\bqueryId\b|\bqueryTerms\b|\bresult
  │ Rank\b|\btotalResultsShown\b|\bsearchMode\b|\bwasUseful\b|\bimportanceTier\b|\bimportanceWeight\
  │ b|\btriggerPhrases\b" (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Search (grep)
  │ "\bmemory_save\b|\bmemory_update\b|\bmemory_delete\b|\bmemory_bulk_delete\b|\bmemory_validate\b"
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 9 lines found

● Search (grep)
  │ "\bshared_space_upsert\b|\bshared_space_membership_set\b|\bshared_memory_status\b|\bshared_memor
  │ y_enable\b" (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Search (grep)
  │ "prediction error|PE arbitration|PE gating|REINFORCE|SUPERSEDE|CREATE_LINKED|undo_correction|cor
  │ rections\.ts|memory_history|runInTransaction|transaction"
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 97 lines found

The first pass confirms a pattern: most named mutation tools do **not** appear as implemented features under `scripts/`; they mostly show up in test fixtures or install/help text. I’m tightening the search to non-test script sources now so the verdicts are precise.

● Search (grep)
  │ "\bmemory_save\b|\bmemory_update\b|\bmemory_delete\b|\bmemory_bulk_delete\b|\bmemory_validate\b|
  │ \bshared_space_upsert\b|\bshared_space_membership_set\b|\bshared_memory_status\b|\bshared_memory
  │ _enable\b" in !**/tests/** (.opencode/skill/system-spec-kit/scripts)
  └ 1 line found

● Search (grep)
  │ "\basyncEmbedding\b|\ballowPartialUpdate\b|\bolderThanDays\b|\bqueryId\b|\bqueryTerms\b|\bresult
  │ Rank\b|\btotalResultsShown\b|\bsearchMode\b|\bwasUseful\b|\bimportanceTier\b|\bimportanceWeight\
  │ b|\btriggerPhrases\b|\bspaceId\b|\btenantId\b|\bactorUserId\b|\bactorAgentId\b" in !**/tests/**
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Search (grep)
  │ "memory_history|corrections\.ts|undo_correction|prediction
  │ error|REINFORCE|SUPERSEDE|CREATE_LINKED|transaction\(|database\.transaction|runInTransaction" in
  │ !**/tests/** (.opencode/skill/system-spec-kit/scripts)
  └ 9 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/scripts/**/*.ts"
  └ 146 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/scripts/**/*.js"
  └ 28 files found

● Read copilot-tool-output-1774455684888-puxkgo.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774455684888-puxkgo.txt
  └ L1:200 (107 lines read)

● Search (grep)
  │ "\basyncEmbedding\b|\ballowPartialUpdate\b|\bolderThanDays\b|\bqueryId\b|\bwasUseful\b|\bspaceId
  │ \b|\btenantId\b" in !**/tests/** (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Search (grep)
  │ "\bimportanceTier\b|\bimportanceWeight\b|\btriggerPhrases\b" in !**/tests/**
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Search (grep)
  │ "queryTerms|resultRank|totalResultsShown|searchMode|actorUserId|actorAgentId|shared_memory" in
  │ !**/tests/** (.opencode/skill/system-spec-kit/scripts)
  └ 2 lines found

I’ve narrowed it to the actual `scripts/` sources. Most of the “tool” docs are drifting because they point at `mcp_server` handlers, while `scripts/` only contains adjacent helpers, generators, validators, or cleanup utilities.

● Read memory-indexer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
  └ L1:260 (244 lines read)

● Read generate-context.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
  └ L1:260 (260 lines read)

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L430:560 (131 lines read)

● Read memory-metadata.ts
  │ .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts
  └ L1:320 (320 lines read)

● Read cleanup-orphaned-vectors.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts
  └ L1:220 (204 lines read)

I’ve got enough to score most files. I’m just pulling a few pinpoint lines for the borderline cases (`memory_save`, `memory_validate`) so the final call-outs are unambiguous.

● Read install.sh
  │ .opencode/skill/system-spec-kit/scripts/setup/install.sh
  └ L345:355 (10 lines read)

● Read frontmatter-editor.ts
  │ .opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts
  └ L88:110 (23 lines read)

● Read map-ground-truth-ids.ts
  │ .opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts
  └ L45:60 (16 lines read)

● Read map-ground-truth-ids.ts
  │ .opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts
  └ L355:395 (41 lines read)

✗ Memory stored repository structure
  └ The system-spec-kit `scripts/` workspace provides context-generation/indexing he…

Checked against **non-test files under `.opencode/skill/system-spec-kit/scripts/` only**. References that resolve only in `mcp_server/` were treated as out-of-scope for this alignment pass.

`01-memory-indexing-memorysave.md | PARTIAL | P1: scripts has adjacent indexing flow in `scripts/memory/generate-context.ts` and `scripts/core/memory-indexer.ts` (CLI ingest, trigger phrases, `importanceWeight`, vector indexing), plus `triggerPhrases`/`importanceTier` normalization in `scripts/utils/input-normalizer.ts`; but the documented `memory_save` tool surface and params like `asyncEmbedding` are not implemented in non-test scripts. `memory_save` appears in scripts mainly in install/help text and tests.`

`02-memory-metadata-update-memoryupdate.md | MISALIGNED | P1: no non-test `scripts/` implementation of `memory_update`; no `allowPartialUpdate` match. Scripts only have generic metadata/frontmatter helpers like `renderTriggerPhrasesYaml()` and input normalization, not an update tool/handler.`

`03-single-and-folder-delete-memorydelete.md | MISALIGNED | P1: no non-test `scripts/` implementation of `memory_delete`, and no script-side `id` / `specFolder` / `confirm` delete path. The only nearby script is `scripts/memory/cleanup-orphaned-vectors.ts`, which performs orphan cleanup, not user-targeted single/folder deletion.`

`04-tier-based-bulk-deletion-memorybulkdelete.md | MISALIGNED | P1: no non-test `scripts/` implementation of `memory_bulk_delete`; no matches for `olderThanDays` or tier-bulk delete behavior. The documented checkpointed tier deletion exists outside `scripts/`.`

`05-validation-feedback-memoryvalidate.md | MISALIGNED | P1: no non-test `scripts/` implementation of `memory_validate`; `wasUseful`, `queryTerms`, `resultRank`, `totalResultsShown`, and `searchMode` are absent. `queryId` exists only in `scripts/evals/map-ground-truth-ids.ts`, which is an eval utility, not the validation feedback tool.`

`06-transaction-wrappers-on-mutation-handlers.md | PARTIAL | P2: scripts does use transactions (`scripts/memory/cleanup-orphaned-vectors.ts` wraps cleanup in `database.transaction()`), so the atomicity concept exists; but the specific documented mutation handlers (`memory-crud-update`, `memory-crud-delete`, reconsolidation bridge) are not in `scripts/` and resolve to `mcp_server/` instead.`

`07-namespace-management-crud-tools.md | MISALIGNED | P1: no non-test `scripts/` matches for `shared_space_upsert`, `shared_space_membership_set`, `shared_memory_status`, or `shared_memory_enable`, and no actor/tenant/shared-space lifecycle implementation under `scripts/`.`

`08-prediction-error-save-arbitration.md | MISALIGNED | P1: no non-test `scripts/` PE arbitration engine found; `REINFORCE`, `CREATE_LINKED`, threshold logic, and save-path action routing are absent. The only nearby script-side signal is `SUPERSEDES` causal-link metadata in `scripts/core/memory-metadata.ts`, which is not PE arbitration.`

`09-correction-tracking-with-undo.md | MISALIGNED | P1: no non-test `scripts/` `corrections.ts` module or `undo_correction()` implementation. This feature is not present in the `scripts/` source tree.`

`10-per-memory-history-log.md | PARTIAL | P2: `scripts/memory/cleanup-orphaned-vectors.ts` clearly knows about the `memory_history` table and cleans orphaned rows transactionally, so the history table is acknowledged in scripts; but the documented history-log ownership/writes (`ADD`/`UPDATE`/`DELETE`) are not implemented in `scripts/` and instead point to `mcp_server/` handlers/libs.`

**SUMMARY:** total `10`, aligned `0`, misaligned `7`, partial `3`, P0 `0`, P1 `8`, P2 `2`.

