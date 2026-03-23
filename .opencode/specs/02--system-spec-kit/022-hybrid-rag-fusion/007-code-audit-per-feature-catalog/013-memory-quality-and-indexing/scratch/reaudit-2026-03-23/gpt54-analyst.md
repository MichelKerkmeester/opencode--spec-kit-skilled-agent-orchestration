I audited all 24 entries in `13--memory-quality-and-indexing` against the current `mcp_server` implementation and the prior audit summary at [implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/013-memory-quality-and-indexing/implementation-summary.md). The prior audit was directionally strong, but I found additional drift in F10, F17, F19, and a material mismatch in F21.

1. F01 `Verify-fix-verify memory quality loop`  
Verdict: `MATCH`  
Prior verdict: `MATCH`  
Changed since prior: `NO`  
Evidence: [quality-loop.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts#L67), [quality-loop.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts#L427), [quality-loop.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts#L546), [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L186), [memory-sufficiency.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts#L304), [memory-template-contract.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts#L235), [quality-loop.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts#L433)  
Discrepancies: none.

2. F02 `Signal vocabulary expansion`  
Verdict: `MATCH`  
Prior verdict: `MATCH`  
Changed since prior: `NO`  
Evidence: [trigger-matcher.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts#L10), [trigger-matcher.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts#L318), [trigger-matcher.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts#L329), [trigger-matcher.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts#L351)  
Discrepancies: none.

3. F03 `Pre-flight token budget validation`  
Verdict: `MATCH`  
Prior verdict: `MATCH`  
Changed since prior: `NO`  
Evidence: [preflight.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts#L187), [preflight.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts#L460), [preflight.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts#L468), [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L693)  
Discrepancies: none.

4. F04 `Spec folder description discovery`  
Verdict: `MATCH`  
Prior verdict: `MATCH`  
Changed since prior: `NO`  
Evidence: [folder-discovery.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts#L472), [folder-discovery.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts#L588), [folder-discovery.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts#L640), [folder-discovery.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts#L673), [folder-discovery.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts#L698), [generate-description.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts#L36), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1010), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1506)  
Discrepancies: none.

5. F05 `Pre-storage quality gate`  
Verdict: `MATCH`  
Prior verdict: `MATCH`  
Changed since prior: `NO`  
Evidence: [save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L98), [save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L395), [save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L569), [save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L664), [save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L727), [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L323)  
Discrepancies: none.

6. F06 `Reconsolidation-on-save`  
Verdict: `MATCH`  
Prior verdict: `MATCH`  
Changed since prior: `NO`  
Evidence: [reconsolidation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts#L104), [reconsolidation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts#L160), [reconsolidation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts#L452), [reconsolidation-bridge.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L165)  
Discrepancies: none.

7. F07 `Smarter memory content generation`  
Verdict: `MATCH`  
Prior verdict: `MATCH`  
Changed since prior: `NO`  
Evidence: [content-normalizer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts#L36), [content-normalizer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts#L216), [content-normalizer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts#L255), [bm25-index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts#L6), [bm25-index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts#L262)  
Discrepancies: none.

8. F08 `Anchor-aware chunk thinning`  
Verdict: `MATCH`  
Prior verdict: `MATCH`  
Changed since prior: `NO`  
Evidence: [chunk-thinning.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts#L41), [chunk-thinning.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts#L56), [chunk-thinning.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts#L90), [chunk-thinning.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts#L145)  
Discrepancies: none.

9. F09 `Encoding-intent capture at index time`  
Verdict: `MATCH`  
Prior verdict: `MATCH`  
Changed since prior: `NO`  
Evidence: [encoding-intent.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/encoding-intent.ts#L22), [encoding-intent.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/encoding-intent.ts#L45), [encoding-intent.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/encoding-intent.vitest.ts#L399)  
Discrepancies: none.

10. F10 `Auto entity extraction`  
Verdict: `PARTIAL`  
Prior verdict: `MATCH`  
Changed since prior: `YES`  
Evidence: [entity-extractor.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts#L7), [entity-extractor.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts#L61), [entity-extractor.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts#L153), [entity-extractor.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts#L196), [entity-denylist.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts#L11), [entity-linker.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts#L345), [entity-linker.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts#L496)  
Discrepancies: behavior is implemented, but the catalog’s referenced-source set is incomplete because extraction depends on `entity-linker.ts` for canonical normalization and edge density.

11. F11 `Content-aware memory filename generation`  
Verdict: `PARTIAL`  
Prior verdict: `PARTIAL`  
Changed since prior: `NO`  
Evidence: [slug-utils.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts#L14), [slug-utils.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts#L191), [slug-utils.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts#L262), [task-enrichment.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts#L35), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L982), [title-builder.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/title-builder.ts#L35)  
Discrepancies: behavior matches, but the catalog still omits `scripts/core/title-builder.ts`, which contains the `slugToTitle()` path from slug to H1/title.

12. F12 `Generation-time duplicate and empty content prevention`  
Verdict: `PARTIAL`  
Prior verdict: `PARTIAL`  
Changed since prior: `NO`  
Evidence: [file-writer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts#L79), [file-writer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts#L98), [file-writer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts#L131), [workflow-e2e.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts#L439)  
Discrepancies: duplicate prevention exists, but the catalog is stale about behavior. Duplicate saves are now idempotent and return the existing filename instead of throwing/hard-failing. The catalog also misses the primary implementation file `scripts/core/file-writer.ts`.

13. F13 `Entity normalization consolidation`  
Verdict: `PARTIAL`  
Prior verdict: `PARTIAL`  
Changed since prior: `NO`  
Evidence: [entity-extractor.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts#L7), [entity-linker.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts#L345), [entity-linker.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts#L496), [entity-extractor.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts#L709)  
Discrepancies: the catalog still omits `mcp_server/lib/search/entity-linker.ts`, which is where the consolidated normalization logic actually lives.

14. F14 `Quality gate timer persistence`  
Verdict: `PARTIAL`  
Prior verdict: `PARTIAL`  
Changed since prior: `NO`  
Evidence: [save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L149), [save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L168), [save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L242), [save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L287), [save-quality-gate.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts#L54), [save-quality-gate.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts#L212)  
Discrepancies: behavior is accurate, but the catalog still overstates the source set with many unrelated files.

15. F15 `Deferred lexical-only indexing`  
Verdict: `MATCH`  
Prior verdict: `MATCH`  
Changed since prior: `NO`  
Evidence: [vector-index-mutations.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts#L203), [vector-index-mutations.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts#L246), [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L304), [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L1851), [embedding-pipeline.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts#L116)  
Discrepancies: none.

16. F16 `Dry-run preflight for memory_save`  
Verdict: `MATCH`  
Prior verdict: `MATCH`  
Changed since prior: `NO`  
Evidence: [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L571), [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L717), [preflight.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts#L468)  
Discrepancies: none.

17. F17 `Outsourced agent handback protocol`  
Verdict: `PARTIAL`  
Prior verdict: `MATCH`  
Changed since prior: `YES`  
Evidence: [data-loader.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L105), [input-normalizer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L445), [runtime-memory-inputs.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts#L323), [task-enrichment.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts#L1286), [task-enrichment.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts#L1347), [outsourced-agent-handback-docs.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts#L35)  
Discrepancies: file-backed handbacks do not skip all quality-gate abort paths. Tests show `QUALITY_GATE_ABORT` and template-contract rejection can still happen, so the catalog’s “skip `QUALITY_GATE_ABORT`” claim is inaccurate.

18. F18 `Session enrichment and alignment guards`  
Verdict: `MATCH`  
Prior verdict: `MATCH`  
Changed since prior: `NO`  
Evidence: [input-normalizer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L998), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L413), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L517), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L732), [git-context-extractor.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts#L325), [session-extractor.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts#L620), [session-enrichment.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts#L560)  
Discrepancies: none.

19. F19 `Post-save quality review`  
Verdict: `PARTIAL`  
Prior verdict: `MATCH`  
Changed since prior: `YES`  
Evidence: [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1595), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L211), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L236), [post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts#L356), [post-save-review.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts#L22)  
Discrepancies: the catalog says this review is always active, but code only runs it for file/JSON-backed saves and explicitly skips captured-mode flows.

20. F20 `Weekly batch feedback learning`  
Verdict: `MATCH`  
Prior verdict: `MATCH`  
Changed since prior: `NO`  
Evidence: [batch-learning.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts#L34), [batch-learning.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts#L136), [batch-learning.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts#L406), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L969)  
Discrepancies: none.

21. F21 `Assistive reconsolidation`  
Verdict: `MISMATCH`  
Prior verdict: `MATCH`  
Changed since prior: `YES`  
Evidence: [reconsolidation-bridge.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L42), [reconsolidation-bridge.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L89), [reconsolidation-bridge.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L109), [reconsolidation-bridge.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L333), [assistive-reconsolidation.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts#L52)  
Discrepancies: the catalog says near-duplicates are automatically merged. The implementation does not merge content; it shadow-archives the older record and lets the new save proceed. That is a material behavior mismatch, not just a wording issue.

22. F22 `Implicit feedback log`  
Verdict: `MATCH`  
Prior verdict: `MATCH`  
Changed since prior: `NO`  
Evidence: [feedback-ledger.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts#L78), [feedback-ledger.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts#L102), [feedback-ledger.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts#L115), [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L280)  
Discrepancies: none.

23. F23 `Hybrid decay policy`  
Verdict: `MATCH`  
Prior verdict: `MATCH`  
Changed since prior: `NO`  
Evidence: [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L397), [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L399), [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L408), [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L431), [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L289)  
Discrepancies: none.

24. F24 `Save quality gate exceptions`  
Verdict: `MATCH`  
Prior verdict: `MATCH`  
Changed since prior: `NO`  
Evidence: [save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L114), [save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L302), [save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L316), [save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L334), [save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L395), [short-critical-quality-gate.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/short-critical-quality-gate.vitest.ts#L32)  
Discrepancies: none.

| # | Feature | Verdict | Prior | Changed? |
| --- | --- | --- | --- | --- |
| 1 | Verify-fix-verify memory quality loop | MATCH | MATCH | NO |
| 2 | Signal vocabulary expansion | MATCH | MATCH | NO |
| 3 | Pre-flight token budget validation | MATCH | MATCH | NO |
| 4 | Spec folder description discovery | MATCH | MATCH | NO |
| 5 | Pre-storage quality gate | MATCH | MATCH | NO |
| 6 | Reconsolidation-on-save | MATCH | MATCH | NO |
| 7 | Smarter memory content generation | MATCH | MATCH | NO |
| 8 | Anchor-aware chunk thinning | MATCH | MATCH | NO |
| 9 | Encoding-intent capture at index time | MATCH | MATCH | NO |
| 10 | Auto entity extraction | PARTIAL | MATCH | YES |
| 11 | Content-aware memory filename generation | PARTIAL | PARTIAL | NO |
| 12 | Generation-time duplicate and empty content prevention | PARTIAL | PARTIAL | NO |
| 13 | Entity normalization consolidation | PARTIAL | PARTIAL | NO |
| 14 | Quality gate timer persistence | PARTIAL | PARTIAL | NO |
| 15 | Deferred lexical-only indexing | MATCH | MATCH | NO |
| 16 | Dry-run preflight for memory_save | MATCH | MATCH | NO |
| 17 | Outsourced agent handback protocol | PARTIAL | MATCH | YES |
| 18 | Session enrichment and alignment guards | MATCH | MATCH | NO |
| 19 | Post-save quality review | PARTIAL | MATCH | YES |
| 20 | Weekly batch feedback learning | MATCH | MATCH | NO |
| 21 | Assistive reconsolidation | MISMATCH | MATCH | YES |
| 22 | Implicit feedback log | MATCH | MATCH | NO |
| 23 | Hybrid decay policy | MATCH | MATCH | NO |
| 24 | Save quality gate exceptions | MATCH | MATCH | NO |