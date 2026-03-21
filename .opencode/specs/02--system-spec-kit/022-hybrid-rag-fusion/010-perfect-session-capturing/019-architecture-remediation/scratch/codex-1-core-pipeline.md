CODEX1-001 | HIGH | BUG  
File: [.opencode/skill/system-spec-kit/scripts/core/tree-thinning.js:16](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/tree-thinning.js#L16)  
Description: The shipped JS artifact has drifted from the TypeScript source, so JS consumers and TS consumers can execute different tree-thinning behavior.  
Evidence:
- [.opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts:34](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts#L34) sets `memoryThinThreshold` to `150`.
- [.opencode/skill/system-spec-kit/scripts/core/tree-thinning.js:16](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/tree-thinning.js#L16) still ships `memoryThinThreshold: 300`.
- [.opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts:122](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts#L122) exports `generateMergedDescription`.
- [.opencode/skill/system-spec-kit/scripts/core/tree-thinning.js:11](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/tree-thinning.js#L11) does not export it.
- [.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts:393](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts#L393) still asserts the old `300` threshold.  
Fix: Rebuild the JS/declaration artifacts from `tree-thinning.ts`, then update tests to the canonical TS contract.

CODEX1-002 | MEDIUM | ARCHITECTURE  
File: [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2084](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L2084)  
Description: The pipeline uses two different quality scoring systems for one memory, which makes gating, persisted metadata, and indexed search quality diverge.  
Evidence:
- [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2084](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L2084) computes `qualityV2`.
- [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2095](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L2095) injects `qualityV2` into frontmatter.
- [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2140](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L2140) recomputes legacy `scoreMemoryQuality` and uses that for abort/index decisions.
- [.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:145](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts#L145) extracts the quality score from rendered content when indexing.
- [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2011](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L2011) explicitly documents the split scoring model.  
Fix: Pick one canonical score for gating and indexing, or persist both under distinct field names and make all consumers explicit about which one they use.

CODEX1-003 | MEDIUM | BUG  
File: [.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:184](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts#L184)  
Description: Metadata embedding-status persistence failures are swallowed, so `runWorkflow()` can report a finalized indexing status that never made it to `metadata.json`.  
Evidence:
- [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2308](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L2308) treats `persistIndexingStatus()` as part of workflow finalization.
- [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2315](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L2315) awaits `updateMetadataEmbeddingStatus(...)`.
- [.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:188](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts#L188) wraps read/parse/write in `try`.
- [.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:208](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts#L208) only warns on failure and does not rethrow.  
Fix: Return a success flag or rethrow on persistence failure so callers can distinguish “indexed” from “indexed but metadata status not persisted.”

CODEX1-004 | MEDIUM | ARCHITECTURE  
File: [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1313](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1313)  
Description: `runWorkflow()` is a god-function that owns nearly the entire pipeline end-to-end, making change isolation, testing, and API evolution hard.  
Evidence:
- [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1313](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1313) starts a single function spanning ~1,100 lines.
- [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1796](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1796) performs tree thinning.
- [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1934](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1934) renders templates and metadata.
- [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2065](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L2065) validates and scores quality.
- [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2224](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L2224) writes files, then [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2303](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L2303) indexes and retries.  
Fix: Split the orchestrator into typed stages such as load/alignment, enrichment, extraction, render, quality-gate, persistence, and indexing.

CODEX1-005 | LOW | DEAD_CODE  
File: [.opencode/skill/system-spec-kit/scripts/core/tree-thinning.d.ts.map:1](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/tree-thinning.d.ts.map#L1)  
Description: The deleted `tree-thinning.d.ts` still has a stale source-map artifact in the repo, which leaves broken declaration metadata behind.  
Evidence:
- [.opencode/skill/system-spec-kit/scripts/core/tree-thinning.d.ts.map:1](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/tree-thinning.d.ts.map#L1) names `"file":"tree-thinning.d.ts"`.
- The `core/` directory contains `tree-thinning.ts`, `tree-thinning.js`, `tree-thinning.js.map`, and `tree-thinning.d.ts.map`, but no `tree-thinning.d.ts`.
- Repo search found no live TS import sites for `tree-thinning.d.ts`; the drift is in generated artifacts, not source imports.  
Fix: Delete stale generated maps or regenerate declarations/maps together so artifact inventory matches source.

CODEX1-006 | LOW | DEAD_CODE  
File: [.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:96](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts#L96)  
Description: There is unused exported API surface in core modules, which increases maintenance cost without serving any in-repo consumers.  
Evidence:
- [.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:96](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts#L96) exports `QualityScore`, but repo search found no imports.
- [.opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts:122](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts#L122) exports `generateMergedDescription`, but repo search found no imports.  
Fix: Remove these exports, or route consumers through the barrel/public API and add tests that justify keeping them public.

CODEX1-007 | LOW | TYPE_SAFETY  
File: [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1635](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1635)  
Description: `workflow.ts` relies on broad type assertions at pipeline boundaries instead of a normalized intermediate DTO, which weakens contract safety between stages.  
Evidence:
- [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1635](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1635) casts `collectedData` to an augmented shape.
- [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1686](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1686), [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1692](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1692), [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1698](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1698), and [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1704](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1704) cast into extractor parameter types.
- [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1778](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1778) and [.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1783](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1783) cast into summarizer/file-extractor inputs.  
Fix: Normalize `CollectedDataFull` once into an explicit workflow DTO, then pass typed stage outputs between modules.

Notes:
- Data flow is linear and centered in `runWorkflow()`: load data -> spec alignment -> stateless enrichment -> parallel extraction -> semantic summary -> tree thinning -> template render -> quality validation/scoring -> atomic write -> vector indexing -> retry queue.
- I did not find a circular dependency among the nine TypeScript core modules. The core graph is effectively `workflow -> {config, quality-scorer, topic-extractor, file-writer, memory-indexer, tree-thinning}`, `subfolder-utils -> config`, and `index -> {config, subfolder-utils}`; [.opencode/skill/system-spec-kit/scripts/core/index.ts:8](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/index.ts#L8) explicitly avoids exporting `workflow` to prevent a cycle.