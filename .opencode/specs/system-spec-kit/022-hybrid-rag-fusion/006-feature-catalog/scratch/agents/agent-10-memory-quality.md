● skill(sk-code-review)

I’m going to inventory the 24 catalog files, load the review guidance, and inspect the two code roots so I can compare each document against real implementations.

● Read review_core.md
  │ .agents/skills/sk-code-review/references/review_core.md
  └ L1:220 (98 lines read)

● Read review_ux_single_pass.md
  │ .agents/skills/sk-code-review/references/review_ux_single_pass.md
  └ L1:220 (82 lines read)

● Read security_checklist.md
  │ .agents/skills/sk-code-review/references/security_checklist.md
  └ L1:220 (206 lines read)

● Read code_quality_checklist.md
  │ .agents/skills/sk-code-review/references/code_quality_checklist.md
  └ L1:220 (162 lines read)

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/*.md"
  └ 24 files found

● List directory ~/.copilot/session-state/9b9f7fc0-9e9b-422e-b475-204699327ff8
  └ 7 files found

● List directory .opencode/skill/system-spec-kit/mcp_server
  └ 32 files found

● List directory .opencode/skill/system-spec-kit/scripts
  └ 34 files found

I’ve got the file inventory. Next I’m splitting the 24 docs into parallel review batches and capturing a short working plan so I can keep the alignment pass systematic.

● Explore Review batch one
  └ Agent started in background with agent_id: catalog-batch-1. You can use read_...

● Todo added 4 items
  │ Review files 1-8
  │ Review files 9-16
  │ Review files 17-24
  └ Synthesize findings

● Explore Review batch two
  └ Agent started in background with agent_id: catalog-batch-2. You can use read_...

● Explore Review batch three
  └ Agent started in background with agent_id: catalog-batch-3. You can use read_...

● Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/9b9f7fc0-9e9b-422e-b475-204699327ff8/plan.md'
  │ <<'EOF'
  │ # Plan…
  └ 10 lines...

The batch reviewers are running. I’m spot-checking the catalog and codebase directly so I can verify the highest-impact mismatches instead of just relaying agent output.

● Search (grep)
  │ "dryRun|preflight|token budget|duplicate|empty content|entity|intent|reconsolid|quality
  │ gate|post-save|feedback|decay|anchor|chunk|description\.json|filename|outsourced|agent
  │ memory|alignment guard" (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Search (grep)
  │ "dryRun|preflight|token budget|duplicate|empty content|entity|intent|reconsolid|quality
  │ gate|post-save|feedback|decay|anchor|chunk|description\.json|filename|outsourced|agent
  │ memory|alignment guard" (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Summarize catalog files (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing')
  │ for p in sorted(root.glob('*.md')):…
  └ 33 lines...

● search generate-context save quality review nextSteps outsourced agent session enrichment alignme…
  └ {"success":false,"results":[],"total_returned":0,"offset":0,"message":"Query ...

● search memory save preflight validation token budget duplicate detection dryRun implementation
  └ {"success":false,"results":[],"total_returned":0,"offset":0,"message":"Query ...

✗ search implicit feedback learning decay reconsolidation entity extraction memory indexing quality…
  └ MCP server 'cocoindex_code': McpError: MCP error -32001: Request timed out

The parallel review batches finished. I’m pulling their results together now and will reconcile any disagreements before I give you the final catalog-by-catalog verdict.

● Read (Explore agent — Review batch one)
  └ idle

● Read (Explore agent — Review batch two)
  └ idle

● Read (Explore agent — Review batch three)
  └ idle

● Todo started

The batch results are surprisingly clean, so I’m sanity-checking the more complex claims directly in code before I call the whole set aligned.

● Read 14-quality-gate-timer-persistence.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/14-quality-gate-
  │ timer-persistence.md
  └ L1:220 (96 lines read)

● Read 17-outsourced-agent-memory-capture.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-ag
  │ ent-memory-capture.md
  └ L1:240 (66 lines read)

● Read 20-weekly-batch-feedback-learning.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/20-weekly-batch-
  │ feedback-learning.md
  └ L1:240 (53 lines read)

● Read 21-assistive-reconsolidation.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/21-assistive-rec
  │ onsolidation.md
  └ L1:240 (55 lines read)

● Search (grep)
  │ "qualityGateActivatedAt|persistActivationTimestampToDb|config
  │ table|QUALITY_GATE_WARN_ONLY_PERIOD_MS"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts)
  └ 18 lines found

● Search (grep)
  │ "EXPLICIT_DATA_FILE_LOAD_FAILED|nextSteps|NEXT_ACTION|Follow-up:|Next:"
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 83 lines found

● Search (grep)
  │ "MIN_SUPPORT_SESSIONS|MAX_BOOST_DELTA|CONFIDENCE_WEIGHTS|batch_learning_log|SPECKIT_BATCH_LEARNE
  │ D_FEEDBACK" (.opencode/skill/system-spec-kit/mcp_server)
  └ 84 lines found

● Search (grep)
  │ "ASSISTIVE_AUTO_MERGE_THRESHOLD|ASSISTIVE_REVIEW_THRESHOLD|assistiveRecommendation|SPECKIT_ASSIS
  │ TIVE_RECONSOLIDATION|shadow-only|is_archived" (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read copilot-tool-output-1774457932031-mkuo9f.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774457932031-mkuo9f.txt
  └ L1:120 (99 lines read)

● Read batch-learning.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts
  └ L1:180 (180 lines read)

● Read save-quality-gate.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts
  └ L150:310 (161 lines read)

● Read 15-deferred-lexical-only-indexing.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/15-deferred-lexi
  │ cal-only-indexing.md
  └ L1:220 (47 lines read)

● Search (grep)
  │ "embedding_status|pending|index_memory_deferred|BM25|FTS5|retry" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 5 lines found

● Read 09-encoding-intent-capture-at-index-time.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/09-encoding-inte
  │ nt-capture-at-index-time.md
  └ L1:180 (44 lines read)

● Search (grep)
  │ "classifyEncodingIntent|encoding_intent|SPECKIT_ENCODING_INTENT"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 86 lines found

I found one likely doc-quality drift already: `14-quality-gate-timer-persistence.md` has a correct feature description, but its source-file table appears massively over-inclusive. I’m checking whether that’s an outlier or a pattern across the set.

● Read 04-spec-folder-description-discovery.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-d
  │ escription-discovery.md
  └ L1:220 (101 lines read)

● Read 05-pre-storage-quality-gate.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/05-pre-storage-q
  │ uality-gate.md
  └ L1:220 (121 lines read)

● Read 24-save-quality-gate-exceptions.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/24-save-quality-
  │ gate-exceptions.md
  └ L1:220 (49 lines read)

● Count implementation tables (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing')
  │ for p in sorted(root.glob('*.md')):…
  └ 42 lines...

There’s a clear secondary pattern: several docs accurately describe the feature but have bloated “Source Files” sections that pull in lots of unrelated dependencies/tests. I’m treating that as doc drift rather than implementation drift.

● Read 02-signal-vocabulary-expansion.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/02-signal-vocabu
  │ lary-expansion.md
  └ L1:180 (98 lines read)

● Read 06-reconsolidation-on-save.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/06-reconsolidati
  │ on-on-save.md
  └ L1:220 (158 lines read)

● Read 12-generation-time-duplicate-and-empty-content-prevention.md
  │ .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/12-generation-ti
  │ me-duplicate-and-empty-content-prevention.md
  └ L1:220 (147 lines read)

● Search (grep)
  │ "CORRECTION|PREFERENCE|trigger-matcher|quality-loop|reconsolidation|writeFilesAtomically|duplica
  │ te|contentSubstance" in **/*.{ts,js,sh} (.opencode/skill/system-spec-kit)
  └ 5 lines found

I found a stronger issue in `12-generation-time-duplicate-and-empty-content-prevention.md`: its narrative points at `scripts/core/file-writer.ts`, but the formal “Source Files” table doesn’t include that file at all and instead lists a large mcp_server bundle. That one looks more than cosmetic.

● Search (grep)
  │ "file-writer\.ts" (.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexi
  │ ng/12-generation-time-duplicate-and-empty-content-prevention.md)
  └ 1 line found

● Search (grep)
  │ "scripts/core/file-writer\.ts|validateContentSubstance|checkForDuplicateContent|writeFilesAtomic
  │ ally" (.opencode/skill/system-spec-kit/scripts)
  └ 17 lines found

● Search (grep)
  │ "trigger-matcher\.ts|CORRECTION_KEYWORDS|PREFERENCE_KEYWORDS"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 26 lines found

● Search (grep)
  │ "handlers/save/reconsolidation-bridge\.ts|lib/storage/reconsolidation\.ts|SPECKIT_RECONSOLIDATIO
  │ N" (.opencode/skill/system-spec-kit/mcp_server)
  └ 56 lines found

● Listing background agents

✔ Todo completed synthesize

I reviewed all 24 catalog files against both code roots. Most feature descriptions match runtime reality; the only drift I found is in some docs’ `Source Files` / `Tests` sections, which are over-broad or omit the actual implementation file.

```text
01-verify-fix-verify-memory-quality-loop.md | ALIGNED | Implemented in mcp_server (`handlers/quality-loop.ts`, `handlers/memory-save.ts`); no scripts-side implementation found, which matches the doc’s scope.
02-signal-vocabulary-expansion.md | PARTIAL | Feature is implemented in `mcp_server/lib/parsing/trigger-matcher.ts` (`CORRECTION_KEYWORDS`, `PREFERENCE_KEYWORDS`) with tests in `mcp_server/tests/signal-vocab.vitest.ts`; scripts has no counterpart, which is fine. Mismatch: the doc’s Source Files/Tests tables are heavily over-inclusive for this narrow feature (P2).
03-pre-flight-token-budget-validation.md | ALIGNED | Implemented in mcp_server preflight validation (`handlers/save/preflight.ts` and save flow); no scripts counterpart found, consistent with the doc.
04-spec-folder-description-discovery.md | ALIGNED | Implemented across both roots as documented: `mcp_server/lib/search/folder-discovery.ts` plus scripts-side generation/tracking in `scripts/spec-folder/generate-description.ts`, `scripts/utils/slug-utils.ts`, and workflow integration.
05-pre-storage-quality-gate.md | PARTIAL | Core behavior matches `mcp_server/lib/validation/save-quality-gate.ts` and save ordering in `handlers/memory-save.ts`; scripts has no implementation, which is fine. Mismatch: Source Files/Tests sections include many unrelated modules/tests beyond the actual feature slice (P2).
06-reconsolidation-on-save.md | PARTIAL | Implemented in `mcp_server/lib/storage/reconsolidation.ts` with bridge/integration in `handlers/save/reconsolidation-bridge.ts`; scripts has no counterpart, which is fine. Mismatch: Source Files/Tests sections are massively over-broad relative to the actual implementation surface (P2).
07-smarter-memory-content-generation.md | ALIGNED | Implemented in `mcp_server/lib/parsing/content-normalizer.ts`; scripts has no separate counterpart, which matches the documented scope.
08-anchor-aware-chunk-thinning.md | ALIGNED | Implemented in mcp_server chunk thinning/orchestration (`chunk-thinning.ts` integrated with anchor chunking); no scripts counterpart found, consistent with the doc.
09-encoding-intent-capture-at-index-time.md | ALIGNED | Implemented in `mcp_server/lib/search/encoding-intent.ts`, persisted via save/chunking flows and schema columns; scripts has no counterpart, which matches the doc.
10-auto-entity-extraction.md | ALIGNED | Implemented in `mcp_server/lib/extraction/entity-extractor.ts` and linked normalization logic; scripts has no counterpart, consistent with the doc.
11-content-aware-memory-filename-generation.md | ALIGNED | Implemented on the scripts side in `scripts/utils/slug-utils.ts` with selection logic in `scripts/core/workflow.ts`; no mcp_server implementation needed for this feature.
12-generation-time-duplicate-and-empty-content-prevention.md | PARTIAL | Actual feature is implemented in `scripts/core/file-writer.ts` (`validateContentSubstance`, `checkForDuplicateContent`, `writeFilesAtomically`), with mcp_server only providing complementary index-time dedup. Mismatch: the doc narrative names `scripts/core/file-writer.ts`, but the formal Source Files table omits it and instead lists a large mcp_server/shared bundle (P1).
13-entity-normalization-consolidation.md | ALIGNED | Implemented in mcp_server entity-linking/extraction normalization code; no scripts counterpart found, consistent with the doc.
14-quality-gate-timer-persistence.md | PARTIAL | Feature is implemented in `mcp_server/lib/validation/save-quality-gate.ts` via persisted `qualityGateActivatedAt` state in the `config` table; no scripts counterpart is needed. Mismatch: Source Files/Tests sections are over-inclusive and pull in many unrelated files (P2).
15-deferred-lexical-only-indexing.md | ALIGNED | Implemented in mcp_server deferred index path (`lib/search/vector-index-mutations.ts`, schema, save/embedding pipeline); scripts has no counterpart, which matches the doc.
16-dry-run-preflight-for-memory-save.md | ALIGNED | Implemented in mcp_server tool schema + save handler/preflight response path; scripts has no counterpart, consistent with the doc.
17-outsourced-agent-memory-capture.md | ALIGNED | Implemented on the scripts side (`scripts/loaders/data-loader.ts`, `scripts/utils/input-normalizer.ts`, `scripts/extractors/session-extractor.ts`); no mcp_server counterpart found, which matches the feature scope.
18-session-enrichment-and-alignment-guards.md | ALIGNED | Implemented on the scripts side through enrichment/alignment guard workflow logic and extractors; no mcp_server counterpart found, consistent with the doc.
19-post-save-quality-review.md | ALIGNED | Implemented on the scripts side in `scripts/core/post-save-review.ts` and workflow integration; no mcp_server counterpart found, consistent with the doc.
20-weekly-batch-feedback-learning.md | ALIGNED | Implemented in `mcp_server/lib/feedback/batch-learning.ts` with startup hook in `context-server.ts`; scripts has no counterpart, which matches the doc.
21-assistive-reconsolidation.md | ALIGNED | Implemented in `mcp_server/handlers/save/reconsolidation-bridge.ts` with thresholds, shadow-archive behavior, and `assistiveRecommendation`; scripts has no counterpart, consistent with the doc.
22-implicit-feedback-log.md | ALIGNED | Implemented in `mcp_server/lib/feedback/feedback-ledger.ts` with flag gating and tests; scripts has no counterpart, which matches the doc.
23-hybrid-decay-policy.md | ALIGNED | Implemented in `mcp_server/lib/cognitive/fsrs-scheduler.ts` with `SPECKIT_HYBRID_DECAY_POLICY`; scripts has no counterpart, consistent with the doc.
24-save-quality-gate-exceptions.md | ALIGNED | Implemented in `mcp_server/lib/validation/save-quality-gate.ts` plus `search-flags.ts`; scripts has no counterpart, which matches the doc.

SUMMARY: total=24, aligned=19, misaligned=0, partial=5, P0=0, P1=1, P2=4
```

The main gap is doc-mapping drift, not missing features. The strongest issue is `12-...duplicate-and-empty-content-prevention.md`, where the documented source table omits the actual scripts implementation file.

