OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce98-6f25-79a0-b197-000378494754
--------
user
You are a feature catalog verification agent. Read these feature snippet files: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md through /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md (files 01 through 12). For each, read its '## Source Files' section to find listed source file paths under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. 

OUTPUT FORMAT (repeat for each feature file):
---
FEATURE: [filename without path]
DESCRIPTION_ACCURATE: [YES/NO/PARTIAL - does Current Reality match source code?]
CODE_PATHS_VALID: [YES/NO - do all listed file paths exist?]
INVALID_PATHS: [list any paths that do not exist, or NONE]
MISSING_CODE_PATHS: [list source files that implement this but are not listed, or NONE]
SEVERITY: [HIGH/MEDIUM/LOW - how important are any issues found]
RECOMMENDED_ACTION: [NONE/UPDATE_DESCRIPTION/UPDATE_PATHS/BOTH/REWRITE]
NOTES: [brief explanation of any issues]
---

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents. Complete with direct tool calls only.
Depth: 1
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: sequential_thinking starting
mcp: code_mode starting
mcp: spec_kit_memory starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m going to inspect the 12 feature snippets first, extract each `Current Reality` and `Source Files` section, then I’ll cross-check those paths and the implementation under `mcp_server` against the described behavior.
exec
/bin/zsh -lc "rg --files '.opencode/skill/system-spec-kit/mcp_server'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "for f in '.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/'{01..12}-*.md; do printf '\\n===== %s =====\\n' \""'$f"; sed -n '"'1,220p' \""'$f"; done' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts
.opencode/skill/system-spec-kit/mcp_server/eslint.config.mjs
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts
.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts
.opencode/skill/system-spec-kit/mcp_server/tsconfig.json
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/types.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts
 succeeded in 52ms:

===== .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md =====
# 4-stage pipeline refactor

## Current Reality

The retrieval pipeline was restructured into four bounded stages with clear responsibilities, a single authoritative scoring point and a strict score-immutability invariant in the final stage.

Stage 1 (Candidate Generation) executes search channels based on query type: multi-concept, deep mode with query expansion, embedding expansion with R15 mutual exclusion, or standard hybrid search. The R8 memory summary channel runs in parallel when the scale gate is met (>5K memories), merging and deduplicating results by memory ID. Summary candidates now pass through the same `minQualityScore` filter as other candidates (Sprint 8 fix). Constitutional memory injection and quality/tier filtering run at the end of Stage 1.

**Phase 017 update:** The query embedding is now cached at function scope for reuse in the constitutional injection path, saving one API call per search. The constitutional injection count is tracked and passed through the orchestrator to Stage 4 output metadata (previously hardcoded to 0).

Stage 2 (Fusion and Signal Integration) applies scoring/enrichment in a fixed order: session boost, causal boost, co-activation spreading, community co-retrieval (N2c from precomputed `community_assignments`), graph signals (N2a+N2b — additive momentum/depth bonuses), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Community injection (N2c) runs before graph signals (N2a+N2b) so injected rows also receive momentum/depth adjustments. The G2 prevention is structural: an `isHybrid` boolean gates the intent weight step so the code path is absent for hybrid search.

**Phase 017 update:** Stage 2 now uses the shared `resolveEffectiveScore()` function from `pipeline/types.ts` (aliased as `resolveBaseScore`) for consistent score resolution. The five-factor composite weights auto-normalize to sum 1.0 after partial overrides. Cross-variant RRF fusion no longer double-counts convergence bonuses (per-variant bonus subtracted before cross-variant bonus). Adaptive fusion core weights (semantic + keyword + recency) normalize after doc-type adjustments.

Stage 3 (Rerank and Aggregate) handles optional cross-encoder reranking (gated by `SPECKIT_CROSS_ENCODER`) and MPAB chunk collapse with parent reassembly preserving document order.

Stage 4 (Filter and Annotate) enforces the "no score changes" invariant via dual enforcement: compile-time `Stage4ReadonlyRow` readonly fields plus runtime `verifyScoreInvariant()` assertion checking all six score fields. Within this invariant, it applies memory state filtering, TRM evidence gap detection and annotation metadata.

codex
I’ve got the catalog entries and the current `mcp_server` tree. Next I’m drilling into the actual implementation files feature by feature so I can separate “description drift” from simple path-listing issues.
exec
/bin/zsh -lc "for f in .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/{01..12}-*.md; do printf '\\n=== %s ===\\n' \""'$(basename "$f")"; awk '"'
  /"'^## Current Reality/{flag=1; next}
  /''^## Source Files/{flag=0}
  flag{print}
'"' \""'$f"; echo '"'--FILES--'; awk '
  /"'^### Implementation/{flag=1; next}
  /''^### Tests/{flag=0}
  flag && /`/{gsub(/`/, ""); print $2}
'"' \""'$f"; done' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:

=== 01-4-stage-pipeline-refactor.md ===

The retrieval pipeline was restructured into four bounded stages with clear responsibilities, a single authoritative scoring point and a strict score-immutability invariant in the final stage.

Stage 1 (Candidate Generation) executes search channels based on query type: multi-concept, deep mode with query expansion, embedding expansion with R15 mutual exclusion, or standard hybrid search. The R8 memory summary channel runs in parallel when the scale gate is met (>5K memories), merging and deduplicating results by memory ID. Summary candidates now pass through the same `minQualityScore` filter as other candidates (Sprint 8 fix). Constitutional memory injection and quality/tier filtering run at the end of Stage 1.

**Phase 017 update:** The query embedding is now cached at function scope for reuse in the constitutional injection path, saving one API call per search. The constitutional injection count is tracked and passed through the orchestrator to Stage 4 output metadata (previously hardcoded to 0).

Stage 2 (Fusion and Signal Integration) applies scoring/enrichment in a fixed order: session boost, causal boost, co-activation spreading, community co-retrieval (N2c from precomputed `community_assignments`), graph signals (N2a+N2b — additive momentum/depth bonuses), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Community injection (N2c) runs before graph signals (N2a+N2b) so injected rows also receive momentum/depth adjustments. The G2 prevention is structural: an `isHybrid` boolean gates the intent weight step so the code path is absent for hybrid search.

**Phase 017 update:** Stage 2 now uses the shared `resolveEffectiveScore()` function from `pipeline/types.ts` (aliased as `resolveBaseScore`) for consistent score resolution. The five-factor composite weights auto-normalize to sum 1.0 after partial overrides. Cross-variant RRF fusion no longer double-counts convergence bonuses (per-variant bonus subtracted before cross-variant bonus). Adaptive fusion core weights (semantic + keyword + recency) normalize after doc-type adjustments.

Stage 3 (Rerank and Aggregate) handles optional cross-encoder reranking (gated by `SPECKIT_CROSS_ENCODER`) and MPAB chunk collapse with parent reassembly preserving document order.

Stage 4 (Filter and Annotate) enforces the "no score changes" invariant via dual enforcement: compile-time `Stage4ReadonlyRow` readonly fields plus runtime `verifyScoreInvariant()` assertion checking all six score fields. Within this invariant, it applies memory state filtering, TRM evidence gap detection and annotation metadata.

**Phase 017 update:** The legacy `postSearchPipeline` path  was removed entirely. `isPipelineV2Enabled()` now always returns `true` regardless of the `SPECKIT_PIPELINE_V2` env var (deprecated). The V2 4-stage pipeline is the only code path. A shared `resolveEffectiveScore()` function in `pipeline/types.ts` replaced both Stage 2's `resolveBaseScore()` and Stage 3's local `effectiveScore()`, ensuring a consistent fallback chain (`intentAdjustedScore -> rrfScore -> score -> similarity/100`, all clamped [0,1]) across all stages.

--FILES--
exec
/bin/zsh -lc "rg --files '.opencode/skill/system-spec-kit/shared'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/shared/chunking.ts
.opencode/skill/system-spec-kit/shared/config.ts
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts
.opencode/skill/system-spec-kit/shared/paths.ts
.opencode/skill/system-spec-kit/shared/index.ts
.opencode/skill/system-spec-kit/shared/tsconfig.json
.opencode/skill/system-spec-kit/shared/lib/structure-aware-chunker.ts
.opencode/skill/system-spec-kit/shared/embeddings.ts
.opencode/skill/system-spec-kit/shared/normalization.ts
.opencode/skill/system-spec-kit/shared/README.md
.opencode/skill/system-spec-kit/shared/types.ts
.opencode/skill/system-spec-kit/shared/trigger-extractor.ts
.opencode/skill/system-spec-kit/shared/scoring/README.md
.opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts
.opencode/skill/system-spec-kit/shared/algorithms/index.ts
.opencode/skill/system-spec-kit/shared/algorithms/mmr-reranker.ts
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts
.opencode/skill/system-spec-kit/shared/embeddings/profile.ts
codex
I’m doing an existence pass now so we can catch path-list drift independently from behavior drift. After that I’ll finish the code audit for each feature and call out any omitted implementation files.
exec
/bin/zsh -lc "python3 -c 'import os,re; base=\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit\"; d=os.path.join(base,\"feature_catalog/14--pipeline-architecture\");
for name in sorted(f for f in os.listdir(d) if re.match(r\""'^'"\\d\\d-.*\\.md"'$", f)):
    text=open(os.path.join(d,name)).read().splitlines(); paths=[]; ins=False
    for line in text:
        if line.startswith("## Source Files"): ins=True; continue
        if ins and line.startswith("## "): break
        m=re.search(r"'"\\|\\s*"'`([''^`]+)`'"\\s*\\|\", line)
        if m: paths.append(m.group(1))
    invalid=[p for p in paths if not os.path.exists(os.path.join(base,p))]
    print(name)
    print(\"ALL_VALID\" if not invalid else \"\\n\".join(invalid))
    print(\"---\")'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 672ms:
01-4-stage-pipeline-refactor.md
mcp_server/tests/retry.vitest.ts
---
02-mpab-chunk-to-memory-aggregation.md
ALL_VALID
---
03-chunk-ordering-preservation.md
ALL_VALID
---
04-template-anchor-optimization.md
ALL_VALID
---
05-validation-signals-as-retrieval-metadata.md
ALL_VALID
---
06-learned-relevance-feedback.md
ALL_VALID
---
07-search-pipeline-safety.md
mcp_server/tests/retry.vitest.ts
exec
/bin/zsh -lc 'rg -n "MPAB_BONUS_COEFFICIENT|SPECKIT_DOCSCORE_AGGREGATION|aggregateChunkScores|collapse.*chunk|chunk_index|contentSource|file_read_fallback" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "ANCHOR:|derive.*type|anchor.*metadata|anchorType|anchorId|annotateAnchors" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "validation metadata|quality_score|SPECKIT_LEVEL|VALIDATED|VALIDATION: PASS|validationMultiplier|checklist bonus|tier mapped|deprecated=0.1|quality factor" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:41:        chunkReassemblyStats: { collapsedChunkHits: 0, chunkParents: 0, reassembled: 0, fallback: 0 },
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:300:      contentSource: 'reassembled_chunks',
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:311:    expect(result.contentSource).toBe('reassembled_chunks');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:732:      // When enabled, collapses chunk-level results back to their parent memory
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:753:            // Merge collapsed chunk results with non-chunk results
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:92:    expect(columns).toEqual(expect.arrayContaining(['parent_id', 'chunk_index', 'chunk_label']));
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:333:    expect(columns).not.toContain('chunk_index');
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:339:  it('collapses sibling chunk hits and reassembles content', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:374:      (id, spec_folder, file_path, anchor_id, title, created_at, updated_at, embedding_status, content_text, parent_id, chunk_index, chunk_label, importance_tier)
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:383:      { id: 9001, parent_id: 9000, chunk_index: 0, chunk_label: 'chunk-1', file_path: '/specs/010-test/memory/large.md' },
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:384:      { id: 9002, parent_id: 9000, chunk_index: 1, chunk_label: 'chunk-2', file_path: '/specs/010-test/memory/large.md' },
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:400:    expect(chunkResult.contentSource).toBe('reassembled_chunks');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:132:      chunk_index: parentId !== null ? 0 : null,
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:12:  MPAB_BONUS_COEFFICIENT,
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:127:    expect(MPAB_BONUS_COEFFICIENT).toBe(0.3);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:140:  const ENV_KEY = 'SPECKIT_DOCSCORE_AGGREGATION';
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:202:    const result = collapseAndReassembleChunkResults(chunks);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:217:    const result = collapseAndReassembleChunkResults(chunks);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:228:    const result = collapseAndReassembleChunkResults(chunks);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:241:    const result = collapseAndReassembleChunkResults(chunks);
 succeeded in 52ms:
Total output lines: 655

.opencode/skill/system-spec-kit/shared/README.md:16:<!-- ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/shared/README.md:28:<!-- /ANCHOR:table-of-contents -->
.opencode/skill/system-spec-kit/shared/README.md:32:<!-- ANCHOR:overview -->
.opencode/skill/system-spec-kit/shared/README.md:106:<!-- /ANCHOR:overview -->
.opencode/skill/system-spec-kit/shared/README.md:121:<!-- ANCHOR:quick-start -->
.opencode/skill/system-spec-kit/shared/README.md:164:<!-- /ANCHOR:quick-start -->
.opencode/skill/system-spec-kit/shared/README.md:168:<!-- ANCHOR:structure -->
.opencode/skill/system-spec-kit/shared/README.md:229:<!-- /ANCHOR:structure -->
.opencode/skill/system-spec-kit/shared/README.md:233:<!-- ANCHOR:features -->
.opencode/skill/system-spec-kit/shared/README.md:309:<!-- /ANCHOR:features -->
.opencode/skill/system-spec-kit/shared/README.md:313:<!-- ANCHOR:configuration -->
.opencode/skill/system-spec-kit/shared/README.md:345:<!-- /ANCHOR:configuration -->
.opencode/skill/system-spec-kit/shared/README.md:349:<!-- ANCHOR:usage-examples -->
.opencode/skill/system-spec-kit/shared/README.md:441:<!-- /ANCHOR:usage-examples -->
.opencode/skill/system-spec-kit/shared/README.md:445:<!-- ANCHOR:troubleshooting -->
.opencode/skill/system-spec-kit/shared/README.md:520:<!-- /ANCHOR:troubleshooting -->
.opencode/skill/system-spec-kit/shared/README.md:524:<!-- ANCHOR:related -->
.opencode/skill/system-spec-kit/shared/README.md:545:<!-- /ANCHOR:related -->
 succeeded in 50ms:
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:39:    'quality_score: 0.95',
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:48:// 3. Valid frontmatter with quality_score: 0.85 -> 0.85
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:50:  const content = ['---', 'quality_score: 0.85', '---', 'Body text'].join('\n');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:54:// 4. quality_score > 1 -> clamped to 1.0
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:56:  const content = ['---', 'quality_score: 1.75', '---'].join('\n');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:60:// 5. quality_score < 0 -> clamped to 0.0
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:62:  const content = ['---', 'quality_score: -0.25', '---'].join('\n');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:66:// 6. quality_score: NaN or non-numeric -> 0
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:68:  const nanContent = ['---', 'quality_score: NaN', '---'].join('\n');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:69:  const textContent = ['---', 'quality_score: not-a-number', '---'].join('\n');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:75:// 7. quality_score in body text but NOT in frontmatter -> must return 0
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:81:    'quality_score: 0.99',
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:126:    'quality_score: 0.42',
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:142:  const content = ['---', 'quality_score: 0.67', 'quality_flags:', '- windows', '---', 'Body'].join('\r\n');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:148:// 13. Frontmatter with extra whitespace around quality_score value
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:150:  const content = ['---', 'quality_score:    0.31   ', '---'].join('\n');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts:23:  const match = fm.match(/quality_score:\s*([0-9.]+)/i);
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:10://   T6-T9   : extractValidationMetadata — SPECKIT_LEVEL extraction
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:43:  it('T1: extracts qualityScore from db quality_score when present and positive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:44:    const row = makeRow({ quality_score: 0.85 });
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "resolveEffectiveScore|isPipelineV2Enabled|constitutionalInjected|constitutionalInjectionCount|minQualityScore|memory summary|summaryResults|artifact routing|intent weight|verifyScoreInvariant|Stage4ReadonlyRow" .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/shared/algorithms' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Stage2 Fusion
// ---------------------------------------------------------------
// AI-GUARD: Sprint 5 (R6): 4-Stage Retrieval Pipeline
//
// I/O CONTRACT:
//   Input:  Stage2Input { candidates: PipelineRow[], config, stage1Metadata }
//   Output: Stage2Output { scored: PipelineRow[], metadata }
//   Key invariants:
//     - Every score modification in the pipeline happens exactly once here
//     - Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)
//     - scored is sorted descending by effective composite score on exit
//   Side effects:
//     - FSRS write-back to memory_index (when trackAccess=true) — DB write
//     - Learned trigger and negative-feedback reads from DB
//
// PURPOSE: Single point for ALL scoring signals. Intent weights are
// applied ONCE here only — this is the architectural guard against
// the G2 double-weighting recurrence bug.
//
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Orchestrator
// ---------------------------------------------------------------
// Sprint 5 (R6): 4-stage pipeline execution behind SPECKIT_PIPELINE_V2
//
// I/O CONTRACT:
//   Input:  PipelineConfig (query, embedding, limits, flags, intent, session)
//   Output: PipelineResult { results: Stage4ReadonlyRow[], metadata, annotations, trace }
//   Key invariants:
//     - results are scored by Stage 2, reranked by Stage 3, filtered by Stage 4
//     - Score fields are frozen after Stage 3; Stage 4 output scores == Stage 3 output scores
//     - Stage metadata for all four stages is included for observability
//   Side effects:
//     - Delegates to each stage; see individual stage modules for their side effects

import type {
  PipelineConfig,
  PipelineResult,
  Stage4ReadonlyRow,
} from './types';
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Stage1 Candidate Gen
// ---------------------------------------------------------------
// Sprint 5 (R6): 4-Stage Retrieval Pipeline Architecture
// ---------------------------------------------------------------
//
// Responsibility: Execute search channels and collect raw candidate results.
// This stage performs NO scoring modifications — it only retrieves candidates
// from the appropriate search channel based on search type.
//
// Search channels handled:
//   - multi-concept: Generate per-concept embeddings, run multiConceptSearch
//   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
//   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
//                         Suppressed when R15 classifies query as "simple" (mutual exclusion)
//   - hybrid: searchWithFallback → falls back to vector on failure
//   - vector: Direct vectorSearch
//
// Post-channel operations:
//   - Constitutional memory injection (if not already present)
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Types
// ---------------------------------------------------------------
// Sprint 5 (R6): Stage interfaces with Stage 4 immutability invariant
// ---------------------------------------------------------------

import type { RetrievalTrace } from '@spec-kit/shared/contracts/retrieval-trace';

/**
 * Memory search row — the canonical internal result type flowing through the pipeline.
 * Extends Record<string, unknown> for backward compatibility with existing code.
 */
export interface PipelineRow extends Record<string, unknown> {
  id: number;
  similarity?: number;
  score?: number;
  importance_tier?: string;
  contextType?: string;
  context_type?: string;
  attentionScore?: number;
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Stage4 Filter
// ---------------------------------------------------------------
// AI-WHY: Sprint 5 (R6): Final stage of the 4-stage retrieval pipeline.
//
// ARCHITECTURAL INVARIANT: Stage 4 MUST NOT modify scores.
// Any ordering change after Stage 3 is a bug. Score fields on
// Stage4ReadonlyRow are compile-time readonly; the runtime assertion
// via captureScoreSnapshot / verifyScoreInvariant provides a second
// defence-in-depth layer.
//
// I/O CONTRACT:
//   Input:  Stage4Input { results: Stage4ReadonlyRow[], config }
//   Output: Stage4Output { final: Stage4ReadonlyRow[], metadata, annotations }
//   Key invariants:
//     - No score field (similarity, score, rrfScore, intentAdjustedScore,
//       attentionScore, importance_weight) may change between input and output
//     - Ordering from Stage 3 is preserved for all surviving rows
//     - final contains only rows at or above config.minState priority
//   Side effects:
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Stage3 Rerank
// ---------------------------------------------------------------
// AI-GUARD: 4-Stage Retrieval Pipeline: Stage 3 of 4
//
// Responsibilities (in execution order):
//   1. Cross-encoder reranking   — re-scores results via neural model
//   2. MMR diversity pruning     — maximal marginal relevance (SPECKIT_MMR flag)
//   3. MPAB chunk collapse        — dedup chunks, reassemble parents
//
// Pipeline position constraint (Sprint 4):
// MPAB MUST remain AFTER RRF fusion (Stage 2).
//   Stage 3 is the only stage that may change scores after Stage 2.
//
// I/O CONTRACT:
//   Input:  Stage3Input { scored: PipelineRow[], config }
//   Output: Stage3Output { reranked: PipelineRow[], metadata }
//   Key invariants:
//     - reranked is sorted descending by effective score after all steps
//     - Chunk rows (parent_id != null) are collapsed; only parent rows exit
 succeeded in 51ms:
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:78:/** Small weight shift applied per document type to fine-tune intent weights. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:101:export function isPipelineV2Enabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:118:**Score immutability invariant**: Stage 4 MUST NOT modify scores. Enforced via compile-time `Stage4ReadonlyRow` readonly fields and runtime `captureScoreSnapshot` / `verifyScoreInvariant` defence-in-depth. Applies memory-state filtering (HOT/WARM/COLD/DORMANT/ARCHIVED with per-tier limits), evidence gap detection (Z-score confidence check), quality floor (`QUALITY_FLOOR=0.005`), and token budget truncation.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:363:| `SPECKIT_MEMORY_SUMMARIES`| `true`  | Enable memory summary generation and search channel (R8) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:8:// Stage4ReadonlyRow are compile-time readonly; the runtime assertion
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:9:// via captureScoreSnapshot / verifyScoreInvariant provides a second
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:13://   Input:  Stage4Input { results: Stage4ReadonlyRow[], config }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:14://   Output: Stage4Output { final: Stage4ReadonlyRow[], metadata, annotations }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:37:import type { Stage4Input, Stage4Output, Stage4ReadonlyRow } from './types';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:38:import { captureScoreSnapshot, verifyScoreInvariant } from './types';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:82:function resolveStateForFiltering(row: Stage4ReadonlyRow, fallbackState: string): string {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:109:  filtered: Stage4ReadonlyRow[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:136:  results: Stage4ReadonlyRow[],
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:161:    const limitPassing: Stage4ReadonlyRow[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:202: * @param row - A Stage4ReadonlyRow to inspect.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:205:export function extractScoringValue(row: Stage4ReadonlyRow): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:226: * guarantee is enforced via Stage4ReadonlyRow readonly fields; the runtime check
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:227: * via captureScoreSnapshot / verifyScoreInvariant provides defence-in-depth. If
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:228: * verifyScoreInvariant throws, it indicates a Stage 4 implementation bug.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:235: * @throws Error if verifyScoreInvariant detects any score mutation (Stage 4 bug).
exec
/bin/zsh -lc "sed -n '260,680p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,760p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,420p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,180p' .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
              }
            }
          }
          candidates = merged;
        } catch (expandErr: unknown) {
          const expandMsg =
            expandErr instanceof Error ? expandErr.message : String(expandErr);
          console.warn(
            `[stage1-candidate-gen] Deep query expansion failed, falling back to single hybrid: ${expandMsg}`
          );
          // Fall through to single hybrid search below
          channelCount = 1;
          candidates = (await hybridSearch.searchWithFallback(
            query,
            effectiveEmbedding,
            { limit, specFolder, includeArchived }
          )) as PipelineRow[];
        }
      } else {
        // expandQuery returned only the original; treat as standard hybrid
 succeeded in 51ms:
    return {
      ...row,
      intentAdjustedScore: intentScore,
    };
  });

  return scored.sort((a, b) => {
    const aScore = typeof a.intentAdjustedScore === 'number' ? a.intentAdjustedScore : 0;
    const bScore = typeof b.intentAdjustedScore === 'number' ? b.intentAdjustedScore : 0;
    if (bScore === aScore) return (a.id ?? 0) - (b.id ?? 0);
    return bScore - aScore;
  });
}

/**
 * Apply artifact routing weight boosts to results.
 *
 * When the routing system detected a known artifact class with non-zero
 * confidence, the class strategy's `boostFactor` is applied to the
 * current composite score (`score`, then `rrfScore`, then `similarity`).
 succeeded in 50ms:
 *
 * Runtime assertion: scores at entry must equal scores at exit.
 * Compile-time enforcement: input type uses Stage4ReadonlyRow with readonly score fields.
 */
export interface Stage4Input {
  /** Results with read-only score fields — Stage 4 cannot modify scores */
  results: Stage4ReadonlyRow[];
  config: PipelineConfig;
  /** Fix #15: Stage 1 metadata passed through for constitutional count */
  stage1Metadata?: { constitutionalInjected?: number };
}

/**
 * Stage 4 output containing final rows, filter metadata, and annotations.
 */
export interface Stage4Output {
  final: Stage4ReadonlyRow[];
  metadata: {
    stateFiltered: number;
    constitutionalInjected: number;
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Search Flags
// ---------------------------------------------------------------
// Default-on runtime gates for search pipeline controls
//
// Production-ready flags graduated to default-ON.
// Set SPECKIT_<FLAG>=false to disable any graduated feature.

import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';

/**
 * Graph-guided MMR diversity reranking.
 * Default: TRUE (enabled). Set SPECKIT_MMR=false to disable.
 */
export function isMMREnabled(): boolean {
  return isFeatureEnabled('SPECKIT_MMR');
}

/**
 * Transparent Reasoning Module (evidence-gap detection).
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Adaptive Fusion
// ---------------------------------------------------------------
// Local
import { fuseResultsMulti } from './rrf-fusion';

// Type-only
import type { RrfItem, FusionResult, RankedList } from './rrf-fusion';

/* --- 1. INTERFACES --- */

/** Represents fusion weights. */
export interface FusionWeights {
  /** Weight for semantic/vector search results (0-1) */
  semanticWeight: number;
  /** Weight for keyword/lexical search results (0-1) */
  keywordWeight: number;
  /** Weight for recency-based scoring (0-1) */
  recencyWeight: number;
  /** Weight for graph channel results (0-1). Only used when graph channel active. */
codex
I’ve confirmed the high-level pipeline pieces are real in code. I’m now checking the smaller remediation entries, because a few of those look like they may have stale or underlisted source paths even if the behavior itself still exists.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '420,640p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:

  // Separate chunks from non-chunks
  const nonChunks: PipelineRow[] = [];
  const chunksByParent = new Map<number, PipelineRow[]>();

  for (const row of results) {
    const parentId = row.parent_id ?? row.parentId;
    if (parentId != null && typeof parentId === 'number') {
      // This row is a chunk — group by parent
      const group = chunksByParent.get(parentId);
      if (group) {
        group.push(row);
      } else {
        chunksByParent.set(parentId, [row]);
      }
    } else {
      nonChunks.push(row);
    }
  }

 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Validation Metadata
// ---------------------------------------------------------------
// AI-GUARD: 
// PURPOSE: Extract validation signals from spec document metadata
// and surface them as retrieval metadata on PipelineRow results.
// This allows the scoring layer to incorporate spec quality information.
//
// SIGNAL SOURCES (in extraction order):
//   1. importance_tier  → qualitative quality signal (tier → numeric score)
//   2. quality_score    → direct numeric quality metric from DB column
//   3. content          → SPECKIT_LEVEL marker extraction
//   4. content          → validation completion markers
//
// AI-INVARIANT: This module is metadata-only. It NEVER modifies score
// fields (score, rrfScore, similarity, intentAdjustedScore). It only
// adds the `validationMetadata` key to enriched rows.

import type { PipelineRow } from './pipeline/types';

 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Anchor Metadata
// ---------------------------------------------------------------
// Sprint 5 Phase B — S2 template anchor optimization
//
// PURPOSE: Parse ANCHOR tags from memory content and attach the
// resulting metadata to search pipeline rows. This is a PURE
// ANNOTATION step — no scores are modified.
//
// ANCHOR FORMAT:
//   <!-- ANCHOR:id --> ... content ... <!-- /ANCHOR:id -->
//
// ANCHOR ID CONVENTION (for type extraction):
//   Structured IDs follow the pattern: TYPE-keywords-NNN
//   e.g.  DECISION-pipeline-003  → type = "DECISION"
//         state                  → type = "state"
//         summary                → type = "summary"
//
// Integration point: called at the end of Stage 2 fusion, after
// all scoring signals have been applied (signals 1-7). Adding
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Learned Feedback
// ---------------------------------------------------------------
//
//
// Learns from user memory selections to improve future search results.
// Writes to a SEPARATE `learned_triggers` column (NOT FTS5 index).
//
// 10 Safeguards:
// 1. Separate column -- `learned_triggers` TEXT column, NOT in FTS5 index
// 2. 30-day TTL -- learned terms expire after 30 days
// 3. 100+ stop words denylist -- prevent noise injection
// 4. Rate cap -- max 3 terms per selection, max 8 terms per memory
// 5. Top-3 exclusion -- only learn from selections NOT already in top 3
// 6. 1-week shadow period -- log but don't apply for first week
// 7. Exclude <72h memories -- too new to learn from
// 8. Sprint gate review -- manual review before enabling
// 9. Rollback mechanism -- can clear all learned triggers
// 10. Provenance/audit log -- track what was learned and why
//
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Learned Triggers Schema Migration (R11)
// ---------------------------------------------------------------
// AI-GUARD: Schema migration for the learned_triggers column.
//
// ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]';
//
// CRITICAL: This column MUST NOT be added to the FTS5 index.
// The column stores JSON array of { term, addedAt, source, expiresAt }
// objects representing learned relevance feedback terms.
//
// Rollback: ALTER TABLE memory_index DROP COLUMN learned_triggers;
// (SQLite 3.35.0+)
// ---------------------------------------------------------------

import type { DatabaseExtended as Database } from '@spec-kit/shared/types';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Feedback Denylist
// ---------------------------------------------------------------
// AI-GUARD: 100+ stop words that should never be learned as trigger phrases.
// AI-WHY: Prevents noise injection into learned relevance feedback.
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. ENGLISH STOP WORDS
   Common English words that carry no semantic signal.
   --------------------------------------------------------------- */

const ENGLISH_STOP_WORDS: readonly string[] = [
  // Articles & determiners
  'a', 'an', 'the', 'this', 'that', 'these', 'those',
  // Pronouns
  'i', 'me', 'my', 'mine', 'we', 'us', 'our', 'ours',
  'you', 'your', 'yours', 'he', 'him', 'his', 'she', 'her', 'hers',
  'it', 'its', 'they', 'them', 'their', 'theirs',
  'who', 'whom', 'whose', 'which', 'what',
exec
/bin/zsh -lc "sed -n '220,520p' .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "memory_validate|queryId|recordSelection|learned trigger|learned_triggers|SPECKIT_LEARN_FROM_SELECTION|shadow period|isInShadowPeriod" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:

  // Deduplicate
  const unique = [...new Set(candidates)];

  // AI-WHY: Rate cap: max 3 per selection (Safeguard #4)
  return unique.slice(0, MAX_TERMS_PER_SELECTION);
}

/* ---------------------------------------------------------------
   6. CORE OPERATIONS
   --------------------------------------------------------------- */

/**
 * Record a user selection and learn from it (Safeguards #1-#10).
 *
 * This is the main entry point for the feedback loop. When a user selects
 * a search result, this function:
 * 1. Checks if the feature is enabled (Safeguard #8)
 * 2. Checks if the result was NOT in the top-3 (Safeguard #5)
 * 3. Checks if the memory is old enough (Safeguard #7)
 succeeded in 52ms:
Total output lines: 731

.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:208:    _evalQueryId = evalEntry.queryId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:217:          queryId: _evalQueryId,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:8:const mockLogSearchQuery = vi.fn(() => ({ queryId: 11, evalRunId: 22 }));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:963:        queryId: `hybrid-${Date.now()}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1498:  queryId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1580: * @param options - Optional includeContent flag and queryId for overflow logging.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1586:  options?: { includeContent?: boolean; queryId?: string }
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1590:  const queryId = options?.queryId ?? `q-${Date.now()}`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1607:      queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1636:    queryId,
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:78:    tool: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts:29:  queryId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts:135:      obs.queryId,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget.vitest.ts:183:      { includeContent: true, queryId: 'test-q1' }
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget.vitest.ts:198:    expect(overflow!.queryId).toBe('test-q1');
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget.vitest.ts:229:    const { overflow } = truncateToBudget(results, 100, { queryId: 'eval-test' });
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget.vitest.ts:233:    expect(log.queryId).toBe('eval-test');
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:357:        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id),
exec
/bin/zsh -lc "rg -n \"trackAccess|includeArchived|mode|sessionDeduped|constitutionalInjected|cachedEmbedding|simpleStem|double consonant|title \\+ \\\"\\\\n\\\\n\\\" \\+ content_text|degree_snapshots|community_assignments|memory_summaries|memory_entities|causal_edges|removeDocument\\(|dbCommitted|preflightResult\\.errors\\[0\\]\\.code|ANCHOR_FORMAT_INVALID\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "ensureActivationTimestampInitialized|warn-only|warm-up|warmup|14-day|14 day|activation timestamp|save-quality-gate|WO7" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "sanitizeQueryTokens|QUALITY_FLOOR|summary hits|filterByMinQualityScore|memory summary|summary channel|querySummaryEmbeddings" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"Math\\.max\\(\\.\\.\\.|reduce\\(|LIMIT |json_extract|mergedEntities|new Set\\(|UNION ALL|lastInsertRowid|WeakMap TTL|WeakMap|spec folder hierarchy|60-second|60 second|cache\" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 2 in 50ms:
rg: the literal "\n" is not allowed in a regex

Consider enabling multiline mode with the --multiline flag (or -U for short).
When multiline mode is enabled, new line characters can be matched.
exec
/bin/zsh -lc 'rg -n "getDbDir|SPEC_KIT_DB_DIR|SPECKIT_DB_DIR|DB_PATH|cleanup-orphaned-vectors|@spec-kit/" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "postSearchPipeline|STATE_PRIORITY|MAX_DEEP_QUERY_VARIANTS|buildDeepQueryVariants|strengthenOnAccess|applyTestingEffect|filterByMemoryState|applyCrossEncoderReranking|applyIntentWeightsToResults|shouldApplyPostSearchIntentWeighting|verify_integrity|orphaned chunk|autoClean|isPipelineV2Enabled" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:70:| **prospective** | 14 days | 60 days | Future intentions: TODOs, next steps, plans |
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:408:  it('contains lazy warmup and eager override in cli source', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:412:    expect(cliSource).toContain('--eager-warmup');
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:15:// MR12 mitigation: warn-only mode for first 2 weeks after
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:16:// activation. When in warn-only mode, log quality scores and
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:20:// table so the 14-day graduation countdown survives server
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:108:/** Warn-only period duration in milliseconds (14 days) */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:141:/** SQLite config key for persisted activation timestamp */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:158: * Load the activation timestamp from SQLite config table.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:175: * Persist the activation timestamp to SQLite config table.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:191: * Clear the activation timestamp from SQLite config table.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:206: * Activation timestamp for warn-only mode tracking.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:226: * Check if the quality gate is in warn-only mode (MR12 mitigation).
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:227: * For the first 14 days after activation, the gate logs scores but
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:231: * 14-day countdown survives server restarts.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:233: * @returns true if in warn-only period
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:252: * Record the activation timestamp for warn-only mode tracking.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:265: * Reset the activation timestamp. Used in testing.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:275: * Ensure activation timestamp is initialized without resetting persisted state.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:278: * persisted value exists do we create a new activation timestamp.
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:4:// summary channel, flag behavior, backward compatibility.
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:29:import { generateAndStoreSummary, querySummaryEmbeddings, checkScaleGate } from '../lib/search/memory-summaries';
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:436:    it('querySummaryEmbeddings returns results', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:447:      const results = querySummaryEmbeddings(db, queryEmb, 10);
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:157:│   ├── channel-representation.ts # Min-representation R2 (QUALITY_FLOOR=0.005)
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:327:| `search/channel-representation.ts` | Min-representation R2 (QUALITY_FLOOR=0.005) |
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:306:  'memory summary',
.opencode/skill/system-spec-kit/mcp_server/tests/query-router-channel-interaction.vitest.ts:28:  QUALITY_FLOOR,
.opencode/skill/system-spec-kit/mcp_server/tests/query-router-channel-interaction.vitest.ts:284:    it('T033-12: R2 does not promote below QUALITY_FLOOR', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-router-channel-interaction.vitest.ts:304:      // No items should be promoted because all are below QUALITY_FLOOR
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:50:  QUALITY_FLOOR,
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:816:      // Best graph result (score=0.6 > QUALITY_FLOOR=0.005) should be promoted
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:8:import { sanitizeQueryTokens } from './bm25-index';
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:70:  const tokens = sanitizeQueryTokens(query);
.opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts:13:  QUALITY_FLOOR,
.opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts:253:    // Test with a result at exactly QUALITY_FLOOR
.opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts:256:      ['graph',  [makeChannelResult('g1', QUALITY_FLOOR)]],   // exactly 0.2
.opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts:339:  // ---- T15: QUALITY_FLOOR constant is exactly 0.005 ----
.opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts:340:  it('T15: QUALITY_FLOOR constant is exactly 0.005', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts:341:    expect(QUALITY_FLOOR).toBe(0.005);
 succeeded in 51ms:
Total output lines: 1102

.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:11:import * as workingMemory from '../cache/cognitive/working-memory';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:330:      LIMIT 1
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:369:    const existingHashes = new Set(existingRows.map((r) => r.memory_hash));
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:490:        LIMIT ?
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:12:import { CO_ACTIVATION_CONFIG, spreadActivation } from '../cache/cognitive/co-activation';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:47:import type { SpreadResult } from '../cache/cognitive/co-activation';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:172:const DEFAULT_LIMIT = 20;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:704:          if (!sourceMap.has(key)) sourceMap.set(key, new Set());
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1128:      LIMIT ?
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1205:// Cache invalidates after 60 seconds so folder renames are eventually picked up.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1206:// M5 fix: Return stale cache immediately and refresh asynchronously to avoid
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1214:  const cache = ensureDescriptionCache(getSpecsBasePaths());
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1215:  if (!cache || !Array.isArray(cache.folders)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1219:  for (const entry of cache.folders) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1235:  // Fresh cache — return immediately
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1240:  // Stale cache — return it and schedule async refresh (fail open)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1249:          // AI-GUARD: Non-fatal: stale cache remains usable
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1306:  const topExisting = existing.reduce((max, row) => {
 succeeded in 50ms:
.opencode/skill/system-spec-kit/shared/paths.ts:7:import { getDbDir } from './config';
.opencode/skill/system-spec-kit/shared/paths.ts:9:const DEFAULT_DB_PATH = path.join(__dirname, '../../mcp_server/database/context-index.sqlite');
.opencode/skill/system-spec-kit/shared/paths.ts:12:export const DB_PATH: string = (() => {
.opencode/skill/system-spec-kit/shared/paths.ts:13:  const dir = getDbDir();
.opencode/skill/system-spec-kit/shared/paths.ts:14:  return dir ? path.resolve(process.cwd(), dir, 'context-index.sqlite') : DEFAULT_DB_PATH;
.opencode/skill/system-spec-kit/shared/config.ts:9:export function getDbDir(): string | undefined {
.opencode/skill/system-spec-kit/shared/config.ts:10:  return process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR || undefined;
.opencode/skill/system-spec-kit/shared/config.ts:42:  const configuredDir = getDbDir();
.opencode/skill/system-spec-kit/shared/README.md:114:- **Import convention**: Consumers should import via `@spec-kit/shared/*` path alias
.opencode/skill/system-spec-kit/shared/README.md:128:import { generateEmbedding } from '@spec-kit/shared/embeddings';
.opencode/skill/system-spec-kit/shared/README.md:129:import { extractTriggerPhrases } from '@spec-kit/shared/trigger-extractor';
.opencode/skill/system-spec-kit/shared/README.md:132:import { generateEmbedding } from '@spec-kit/shared/embeddings';
.opencode/skill/system-spec-kit/shared/README.md:133:import { extractTriggerPhrases } from '@spec-kit/shared/trigger-extractor';
.opencode/skill/system-spec-kit/shared/README.md:152:import { generateDocumentEmbedding, getProviderMetadata } from '@spec-kit/shared/embeddings';
.opencode/skill/system-spec-kit/shared/README.md:262:- `scripts/lib/embeddings.ts` → `export * from '@spec-kit/shared/embeddings'`
.opencode/skill/system-spec-kit/shared/README.md:263:- `mcp_server/lib/providers/embeddings.ts` → `export * from '@spec-kit/shared/embeddings'`
.opencode/skill/system-spec-kit/shared/README.md:356:import { generateDocumentEmbedding, getEmbeddingDimension } from '@spec-kit/shared/embeddings';
.opencode/skill/system-spec-kit/shared/README.md:357:import { extractTriggerPhrases } from '@spec-kit/shared/trigger-extractor';
.opencode/skill/system-spec-kit/shared/README.md:376:import { generateQueryEmbedding, preWarmModel } from '@spec-kit/shared/embeddings';
.opencode/skill/system-spec-kit/shared/README.md:377:import { extractTriggerPhrases } from '@spec-kit/shared/trigger-extractor';
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:101:export function isPipelineV2Enabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:198:// AI-WHY: Sprint-0 intent weighting guard tests removed — shouldApplyPostSearchIntentWeighting
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:51:const MAX_DEEP_QUERY_VARIANTS = 3;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:115: * The original query is always the first variant. Up to `MAX_DEEP_QUERY_VARIANTS - 1`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:122: * @returns Array of distinct query variants, original first, capped at MAX_DEEP_QUERY_VARIANTS.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:124:async function buildDeepQueryVariants(query: string): Promise<string[]> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:131:    return Array.from(variants).slice(0, MAX_DEEP_QUERY_VARIANTS);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:135:      `[stage1-candidate-gen] buildDeepQueryVariants failed, using original query: ${msg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:233:      const queryVariants = await buildDeepQueryVariants(query);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:612:  buildDeepQueryVariants,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:791:  async verifyIntegrity(options: { autoClean?: boolean } = {}) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:793:    const { verify_integrity } = await import('./vector-index-queries');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:794:    return verify_integrity(options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:23:// FILTER APPLICATION ORDER (within filterByMemoryState):
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:29://   2. Apply memory-state filtering (filterByMemoryState)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:51:const STATE_PRIORITY: Record<string, number> = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:72:const UNKNOWN_STATE_PRIORITY = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:79:  return normalizedState in STATE_PRIORITY ? normalizedState : null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:99: * Per-state tally produced by `filterByMemoryState`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:105: * Return value of the internal `filterByMemoryState` function.
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '240,340p' .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '280,360p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Save Quality Gate
// ---------------------------------------------------------------
// ---------------------------------------------------------------
// TM-04: Pre-Storage Quality Gate
//
// 3-layer validation before storing memories:
// - Layer 1: Structural validation (existing checks, formalized)
// - Layer 2: Content quality scoring (title, triggers, length,
//            anchors, metadata, signal density)
// - Layer 3: Semantic dedup (cosine similarity against existing)
//
// Behind SPECKIT_SAVE_QUALITY_GATE flag (default OFF)
//
// MR12 mitigation: warn-only mode for first 2 weeks after
// activation. When in warn-only mode, log quality scores and
// would-reject decisions but do NOT block saves.
//
// P1-015: Activation timestamp is persisted to SQLite config
// table so the 14-day graduation countdown survives server
 succeeded in 51ms:
      qualityGateActivatedAt = persisted;
    }
  }

  if (qualityGateActivatedAt === null) {
    return false;
  }
  const elapsed = Date.now() - qualityGateActivatedAt;
  return elapsed < WARN_ONLY_PERIOD_MS;
}

/**
 * Record the activation timestamp for warn-only mode tracking.
 * Called when the quality gate is first enabled.
 *
 * P1-015: Persists to SQLite config table for restart survival.
 *
 * @param timestamp - Unix timestamp in milliseconds. If not provided, uses Date.now()
 */
export function setActivationTimestamp(timestamp?: number): void {
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
function getDivergenceReconcileAttemptCount(db: Database.Database, normalizedPath: string): number {
  const targetPath = normalizePath(normalizedPath);
  if (targetPath.length === 0) {
    return 0;
  }

  // Use COUNT(*) with json_extract to filter by path in SQL rather than scanning
  // all decision_meta rows in application code (O(1) vs O(n) full-table scan).
  const row = db.prepare(`
    SELECT COUNT(*) AS cnt
    FROM mutation_ledger
    WHERE mutation_type = 'reindex'
      AND reason = ?
      AND json_extract(decision_meta, '$.normalizedPath') = ?
  `).get(DIVERGENCE_RECONCILE_REASON, targetPath) as { cnt: number } | undefined;

  return row?.cnt ?? 0;
}

function hasDivergenceEscalationEntry(db: Database.Database, normalizedPath: string): boolean {
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/tfidf-summarizer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Causal Edges
// ---------------------------------------------------------------
// Causal relationship graph for memory lineage
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import { clearDegreeCache } from '../search/graph-search-fn';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const RELATION_TYPES = Object.freeze({
  CAUSED: 'caused',
  ENABLED: 'enabled',
  SUPERSEDES: 'supersedes',
  CONTRADICTS: 'contradicts',
  DERIVED_FROM: 'derived_from',
  SUPPORTS: 'supports',
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Entity Linker
// ---------------------------------------------------------------
// Gated via SPECKIT_ENTITY_LINKING
// Creates causal edges between memories sharing entities across spec folders.
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import { isEntityLinkingEnabled } from './search-flags';

// ---------------------------------------------------------------------------
// 1. CONSTANTS
// ---------------------------------------------------------------------------

/** Maximum causal edges per node to prevent graph density explosion. */
const MAX_EDGES_PER_NODE = 20;

/** S5 density guard default: skip entity linking when projected density exceeds this threshold. */
const DEFAULT_MAX_EDGE_DENSITY = 1.0;

 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Spec Folder Hierarchy
// ---------------------------------------------------------------
// Builds a spec folder hierarchy from stored spec_folder paths
// and enables hierarchy-aware retrieval (REQ-S6-006).
//
// Parses folder paths like "system-spec-kit/140-hybrid-rag/006-sprint-5"
// into a tree structure where each path segment is a node, allowing child
// folders to discover and retrieve memories from parent/sibling folders.

import type Database from 'better-sqlite3';

// --- 0. HIERARCHY TREE CACHE ---
//
// buildHierarchyTree does a full scan of spec_folder values on every call.
// The hierarchy changes only when new spec folders are created, so we cache
// the result with a TTL. A single cached value per database instance is
// sufficient — no full LRU library needed.

const HIERARCHY_CACHE_TTL_MS = 60_000; // 60 seconds
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Tfidf Summarizer
// ---------------------------------------------------------------
// Pure TypeScript, zero dependencies
// ---------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1. INTERFACES
// ---------------------------------------------------------------------------

interface ScoredSentence {
  text: string;
  score: number;
  index: number;
}

// ---------------------------------------------------------------------------
// 2. CONSTANTS
// ---------------------------------------------------------------------------

 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Memory Summaries
// ---------------------------------------------------------------
// Gated via SPECKIT_MEMORY_SUMMARIES

import type Database from 'better-sqlite3';
import { generateSummary } from './tfidf-summarizer';
import { isMemorySummariesEnabled } from './search-flags';

// ---------------------------------------------------------------------------
// 1. INTERFACES
// ---------------------------------------------------------------------------

interface SummarySearchResult {
  id: number;
  memoryId: number;
  similarity: number;
}

// ---------------------------------------------------------------------------
exec
/bin/zsh -lc 'rg -n "trackAccess|includeArchived|mode" .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts .opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts .opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"sessionDeduped|constitutionalInjected|cachedEmbedding|simpleStem|dbCommitted|preflightResult\\.errors\\[0\\]\\.code|ANCHOR_FORMAT_INVALID|removeDocument\\(|degree_snapshots|community_assignments|memory_summaries|memory_entities|causal_edges|content_text|title\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/shared/config.ts && printf '\\n---\\n' && sed -n '1,120p' .opencode/skill/system-spec-kit/shared/paths.ts && printf '\\n---\\n' && sed -n '1,120p' .opencode/skill/system-spec-kit/mcp_server/core/config.ts && printf '\\n---\\n' && sed -n '1,120p' .opencode/skill/system-spec-kit/mcp_server/core/db-state.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:62:      validateToolInputSchema('memory_context', { input: 'resume', mode: 'invalid-mode' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:31:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, limit: { type: 'number', description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Caller-supplied session identifier. If omitted, server generates an ephemeral UUID for this call only (not persisted across requests).' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:138:      trackAccess: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:143:      includeArchived: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:148:      mode: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:152:        description: 'Search mode. "auto" uses standard retrieval. "deep" enables multi-query expansion for broader recall.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:185:  description: '[L3:Discovery] Get statistics about the memory system. Shows counts, dates, status breakdown, and top folders. Supports multiple ranking modes including composite scoring. Token Budget: 800.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:186:  inputSchema: { type: 'object', additionalProperties: false, properties: { folderRanking: { type: 'string', enum: ['count', 'recency', 'importance', 'composite'], description: 'How to rank folders: count (default, by memory count), recency (most recent first), importance (by tier), composite (weighted multi-factor score)', default: 'count' }, excludePatterns: { type: 'array', items: { type: 'string' }, description: 'Regex patterns to exclude folders (e.g., ["z_archive", "scratch"])' }, includeScores: { type: 'boolean', description: 'Include score breakdown for each folder', default: false }, includeArchived: { type: 'boolean', description: 'Include archived/test/scratch folders in results', default: false }, limit: { type: 'number', description: 'Maximum number of folders to return', default: 10 } } },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:200:        description: 'Report mode. full returns system diagnostics; divergent_aliases returns compact divergent alias triage output.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:209:        description: 'Optional spec folder filter for divergent alias triage mode.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:214:        description: 'When true in full mode, attempts best-effort repair actions for detected health issues (e.g., FTS rebuild).'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:230:      id: { type: 'number', minimum: 1, description: 'Memory ID to delete (single delete mode)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:231:      specFolder: { type: 'string', minLength: 1, description: 'Delete all memories in this spec folder (bulk delete mode, requires confirm: true)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:256:      searchMode: { type: 'string', description: 'Optional search mode context (search/context/trigger)' },
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:5:// Strict mode is controlled by SPECKIT_STRICT_SCHEMAS (default: true).
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:76:  mode: z.enum(['auto', 'quick', 'deep', 'focused', 'resume']).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:113:  trackAccess: z.boolean().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:114:  includeArchived: z.boolean().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:115:  mode: z.enum(['auto', 'deep']).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:203:  includeArchived: z.boolean().optional(),
 succeeded in 51ms:
Total output lines: 1783

.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:19:  title?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:35:  title?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:301:      title: memory.title,
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:2:title: "Session Layer"
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:31:    INSERT INTO memory_index (id, title, confidence, validation_count, importance_tier, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:43:        title TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:50:      title TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:51:      content_text TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:62:    CREATE TABLE causal_edges (
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:77:    CREATE TABLE degree_snapshots (
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:87:    CREATE TABLE community_assignments (
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:97:    CREATE TABLE memory_summaries (
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:109:    CREATE TABLE memory_entities (
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:137:  db.prepare(`INSERT INTO memory_index (id, spec_folder, file_path, title) VALUES (?, ?, ?, ?)`)
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:139:  db.prepare(`INSERT INTO memory_index (id, spec_folder, file_path, title) VALUES (?, ?, ?, ?)`)
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:141:  db.prepare(`INSERT INTO memory_index (id, spec_folder, file_path, title) VALUES (?, ?, ?, ?)`)
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:143:  db.prepare(`INSERT INTO memory_index (id, spec_folder, file_path, title) VALUES (?, ?, ?, ?)`)
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:145:  db.prepare(`INSERT INTO memory_index (id, spec_folder, file_path, title) VALUES (?, ?, ?, ?)`)
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Config
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';

/** Get db dir. */
export function getDbDir(): string | undefined {
  return process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR || undefined;
}

function findUp(filename: string, startDir: string): string | undefined {
  let dir = startDir;
  while (true) {
    if (fs.existsSync(path.join(dir, filename))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
exec
/bin/zsh -lc "rg -n \"function simpleStem|simpleStem\\(|double consonant|stem\" .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts .opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"title \\+ '\\\\n\\\\n' \\+ content_text|title \\+ \\\"\\\\n\\\\n\\\" \\+ content_text|content_text.*title|generateDocumentEmbedding|memory_update|updatedContent|full-content embedding|content_text\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save .opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"degree_snapshots|community_assignments|memory_summaries|memory_entities|causal_edges|removeDocument\\(|delete memory|deleteByPath|memory_delete|bm25\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts .opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"dbCommitted|atomicSaveMemory|Rename failed after DB commit|preflightResult\\.errors\\[0\\]\\.code|ANCHOR_FORMAT_INVALID|preflight\" .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:58:    expect(simpleStem('running')).toBe('run');
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:62:    expect(simpleStem('played')).toBe('play');
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:66:    expect(simpleStem('dogs')).toBe('dog');
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:70:    expect(simpleStem('boxes')).toBe('box');
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:74:    expect(simpleStem('quickly')).toBe('quick');
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:78:    expect(simpleStem('creation')).toBe('crea');
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:82:    expect(simpleStem('bed')).toBe('bed');
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:86:    expect(simpleStem('is')).toBe('is');
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:89:  it('SS09: RUNNING → run (lowercased + stemmed + double-consonant dedup)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:90:    expect(simpleStem('RUNNING')).toBe('run');
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:94:    expect(simpleStem('fox')).toBe('fox');
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:98:    expect(simpleStem('')).toBe('');
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:102:    expect(simpleStem('a')).toBe('a');
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:135:     T033: Porter stemmer subset reduces words to stems
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:138:  describe('T033: Porter stemmer subset reduces words to stems', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:141:      expect(simpleStem('running')).toBe('run');
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:145:      expect(simpleStem('tested')).toBe('test');
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:149:      expect(simpleStem('studies')).toBe('studi');
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:153:      expect(simpleStem('boxes')).toBe('box');
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:157:      expect(simpleStem('tests')).toBe('test');
 exited 2 in 52ms:
rg: the literal "\n" is not allowed in a regex

Consider enabling multiline mode with the --multiline flag (or -U for short).
When multiline mode is enabled, new line characters can be matched.
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:142:      this.removeDocument(id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:154:  removeDocument(id: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:274:      console.warn(`[bm25-index] Failed to rebuild from database: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:27:const handle_memory_delete = handleMemoryDelete;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:36:  handle_memory_delete,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:45:/** Handle memory_delete tool -- deletes a single memory by ID or bulk-deletes by spec folder. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:78:            reason: 'memory_delete: single memory delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:83:              tool: 'memory_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:89:            actor: 'mcp:memory_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:99:        tool: 'memory_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:175:            reason: 'memory_delete: bulk delete by spec folder',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:180:              tool: 'memory_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:187:            actor: 'mcp:memory_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:242:    tool: 'memory_delete',
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:24:    it('T518-3: atomicSaveMemory exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:25:      expect(typeof handler.atomicSaveMemory).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:19://   atomicSaveMemory, getAtomicityMetrics, indexMemoryFile
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:711:     SUITE: atomicSaveMemory
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:714:  describe('atomicSaveMemory', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:715:    const atomicSaveFn = typeof handler.atomicSaveMemory === 'function'
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:716:      ? handler.atomicSaveMemory
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:6:import * as preflight from '../lib/validation/preflight';
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:8:type DuplicateParams = Parameters<typeof preflight.checkDuplicate>[0];
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:23:- Decision 1: Use preflight validation
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:29:- test preflight
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:72:      const result = preflight.validateAnchorFormat(TEST_CONTENT_VALID);
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:80:      const result = preflight.validateAnchorFormat(TEST_CONTENT_UNCLOSED_ANCHOR);
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:83:      expect(result.errors.some(e => e.code === preflight.PreflightErrorCodes.ANCHOR_UNCLOSED)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:87:      const result = preflight.validateAnchorFormat(TEST_CONTENT_INVALID_ANCHOR_ID);
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:89:      expect(result.errors.some(e => e.code === preflight.PreflightErrorCodes.ANCHOR_ID_INVALID)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:93:      const result = preflight.validateAnchorFormat(TEST_CONTENT_DUPLICATE_ANCHOR);
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:95:      expect(result.errors.some(e => e.code === preflight.PreflightErrorCodes.ANCHOR_FORMAT_INVALID)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:99:      const result = preflight.validateAnchorFormat('');
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:111:      const result = preflight.checkDuplicate(
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,320p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '160,240p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '340,380p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
 * 2. Execute database operations
 * 3. Rename pending to final
 *
 * AI-WHY: This function provides file-system-level atomicity (write-to-pending + rename),
 * NOT database transaction isolation. Callers needing transactional guarantees for
 * dbOperation() must wrap it in their own db.transaction() call. The rename step
 * ensures the file is either fully written or not present, but the DB operation
 * is not rolled back if the rename fails (extremely rare on local filesystems).
 */
function executeAtomicSave(
  filePath: string,
  content: string,
  dbOperation: () => void
): AtomicSaveResult {
  const pendingPath = getPendingPath(filePath);

  try {
    // Step 1: Write to pending path
    const dir = path.dirname(pendingPath);
    if (!fs.existsSync(dir)) {
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Memory Crud Delete
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   IMPORTS
--------------------------------------------------------------- */

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as checkpoints from '../lib/storage/checkpoints';
import * as mutationLedger from '../lib/storage/mutation-ledger';
import * as causalEdges from '../lib/storage/causal-edges';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { appendMutationLedgerSafe, getMemoryHashSnapshot } from './memory-crud-utils';
import { runPostMutationHooks } from './mutation-hooks';
import { buildMutationHookFeedback } from '../hooks/mutation-feedback';

 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Memory CRUD Update Handler
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   IMPORTS
--------------------------------------------------------------- */

import { randomUUID } from 'node:crypto';
import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import type { UpdateMemoryParams } from '../lib/search/vector-index';
import * as embeddings from '../lib/providers/embeddings';
import * as bm25Index from '../lib/search/bm25-index';
import { VALID_TIERS, isValidTier } from '../lib/scoring/importance-tiers';
import { MemoryError, ErrorCodes } from '../lib/errors';
import * as mutationLedger from '../lib/storage/mutation-ledger';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: BM25 Index
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import { normalizeContentForBM25 } from '../parsing/content-normalizer';

/* ---------------------------------------------------------------
   1. INTERFACES
   --------------------------------------------------------------- */

interface BM25SearchResult {
  id: string;
  /**
   * BM25 term-frequency relevance score (unbounded, typically 0-25+).
   * Higher = better lexical match. Not directly comparable to vector similarity
   * scores; use min-max normalization or RRF when combining with other methods.
   */
  score: number;
}
 succeeded in 50ms:
            errors: preflightResult.errors,
            warnings: preflightResult.warnings,
            details: preflightResult.details,
          },
          message: dryRunSummary,
        },
        hints: preflightResult.dry_run_would_pass
          ? ['Dry-run complete - no changes made']
          : ['Fix validation errors before saving', 'Use skipPreflight: true to bypass validation'],
      });
    }

    if (!preflightResult.pass) {
      const errorMessages = preflightResult.errors.map((e: string | { message: string }) =>
        typeof e === 'string' ? e : e.message
      ).join('; ');

      // AI-WHY: Fix #23 (017-refinement-phase-6) — Use the actual error code from the
      // first validation error instead of hardcoding ANCHOR_FORMAT_INVALID.
      const firstError = preflightResult.errors[0];
codex
I’ve started seeing a pattern: the code generally implements the feature behavior, but several catalog entries under-list the real implementation files, and a couple of descriptions look stale. I’m checking those “description vs. code” mismatches now so the final report is concrete rather than just saying “paths incomplete.”
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "cleanup-orphaned-vectors|@spec-kit/shared|@spec-kit/" .opencode/skill/system-spec-kit/mcp_server/scripts .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '280,360p' .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '660,720p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1260,1385p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Sqlite Fts
// ---------------------------------------------------------------
// Weighted BM25 scoring for FTS5 full-text search.
// Extracted from hybrid-search.ts ftsSearch() for independent
// testing and future delegation.

import { sanitizeQueryTokens } from './bm25-index';

import type Database from 'better-sqlite3';

/* ---------------------------------------------------------------
   1. CONSTANTS
   --------------------------------------------------------------- */

/**
 * C138-P2: FTS5 bm25() column weight arguments.
 * Passed positionally to bm25(memory_fts, w0, w1, w2, w3)
 * matching the FTS5 table column order:
 *   col 0 = title           -> 10.0
 succeeded in 51ms:
.opencode/skill/system-spec-kit/shared/README.md:114:- **Import convention**: Consumers should import via `@spec-kit/shared/*` path alias
.opencode/skill/system-spec-kit/shared/README.md:128:import { generateEmbedding } from '@spec-kit/shared/embeddings';
.opencode/skill/system-spec-kit/shared/README.md:129:import { extractTriggerPhrases } from '@spec-kit/shared/trigger-extractor';
.opencode/skill/system-spec-kit/shared/README.md:132:import { generateEmbedding } from '@spec-kit/shared/embeddings';
.opencode/skill/system-spec-kit/shared/README.md:133:import { extractTriggerPhrases } from '@spec-kit/shared/trigger-extractor';
.opencode/skill/system-spec-kit/shared/README.md:152:import { generateDocumentEmbedding, getProviderMetadata } from '@spec-kit/shared/embeddings';
.opencode/skill/system-spec-kit/shared/README.md:262:- `scripts/lib/embeddings.ts` → `export * from '@spec-kit/shared/embeddings'`
.opencode/skill/system-spec-kit/shared/README.md:263:- `mcp_server/lib/providers/embeddings.ts` → `export * from '@spec-kit/shared/embeddings'`
.opencode/skill/system-spec-kit/shared/README.md:356:import { generateDocumentEmbedding, getEmbeddingDimension } from '@spec-kit/shared/embeddings';
.opencode/skill/system-spec-kit/shared/README.md:357:import { extractTriggerPhrases } from '@spec-kit/shared/trigger-extractor';
.opencode/skill/system-spec-kit/shared/README.md:376:import { generateQueryEmbedding, preWarmModel } from '@spec-kit/shared/embeddings';
.opencode/skill/system-spec-kit/shared/README.md:377:import { extractTriggerPhrases } from '@spec-kit/shared/trigger-extractor';
.opencode/skill/system-spec-kit/shared/README.md:394:import { getProviderMetadata, getEmbeddingProfile } from '@spec-kit/shared/embeddings';
.opencode/skill/system-spec-kit/shared/README.md:412:import { extractTriggerPhrasesWithStats } from '@spec-kit/shared/trigger-extractor';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:6:import { validateFilePath } from '@spec-kit/shared/utils/path-security';
.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:11:      "@spec-kit/shared/*": ["../shared/*"]
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:7:import type { DatabaseExtended } from '@spec-kit/shared/types';
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:8:import { DB_UPDATED_FILE as SHARED_DB_UPDATED_FILE } from '@spec-kit/shared/config';
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:99:- `Cannot find module '@spec-kit/shared/...'`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:172:- Workspace dependencies including `@spec-kit/shared`
 succeeded in 50ms:

/* ---------------------------------------------------------------
   4. SINGLETON
   --------------------------------------------------------------- */

let indexInstance: BM25Index | null = null;

function getIndex(): BM25Index {
  if (!indexInstance) {
    indexInstance = new BM25Index();
  }
  return indexInstance;
}

function resetIndex(): void {
  indexInstance = null;
}

/* ---------------------------------------------------------------
   5. FTS5 QUERY SANITIZATION (P3-06)
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Channel Representation
// ---------------------------------------------------------------
/* --- 1. CONSTANTS --- */

/** Minimum similarity / relevance score for a result to qualify for promotion.
 * AI-WHY: QUALITY_FLOOR changed from 0.2 to 0.005 (Sprint 10, D3). The original 0.2
 * assumed normalized [0,1] scores, but raw RRF scores (~0.01-0.03) never exceeded that
 * threshold, causing channel-representation promotion to silently reject ALL RRF results.
 * The 0.005 floor prevents promoting genuinely irrelevant results while remaining
 * compatible with both raw RRF scores and normalized [0,1] scores. */
export const QUALITY_FLOOR = 0.005;

/** Env-var name for the feature flag. */
const FEATURE_FLAG = 'SPECKIT_CHANNEL_MIN_REP';

/* --- 2. INTERFACES --- */

/** A single item that may appear in a top-k result set. */
interface TopKItem {
 succeeded in 51ms:
        database.exec('CREATE INDEX IF NOT EXISTS idx_memory_entities_memory ON memory_entities(memory_id)');
        database.exec('CREATE INDEX IF NOT EXISTS idx_memory_entities_text ON memory_entities(entity_text)');
        logger.info('Migration v20: Created memory_entities table (R10)');
      } catch (e: unknown) {
        if (!get_error_message(e).includes('already exists')) {
          console.warn('[VectorIndex] Migration v20 warning (memory_entities):', get_error_message(e));
        }
      }

      try {
        database.exec(`
          CREATE TABLE IF NOT EXISTS entity_catalog (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            canonical_name TEXT NOT NULL UNIQUE,
            aliases TEXT DEFAULT '[]',
            entity_type TEXT NOT NULL DEFAULT 'noun_phrase',
            memory_count INTEGER NOT NULL DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now'))
          )
        `);
 succeeded in 51ms:
// BUG-013 FIX: Added autoClean option for automatic orphan cleanup
/**
 * Verifies vector-index consistency and optional cleanup results.
 * @param options - Integrity verification options.
 * @returns The integrity summary.
 */
export function verify_integrity(options: { autoClean?: boolean } = {}): { totalMemories: number; totalVectors: number; orphanedVectors: number; missingVectors: number; orphanedFiles: Array<{ id: number; file_path: string; reason: string }>; orphanedChunks: number; isConsistent: boolean; cleaned?: { vectors: number; chunks: number } } {
  const { autoClean = false } = options;
  const database = initialize_db();
  const sqlite_vec = get_sqlite_vec_available();

  const find_orphaned_vector_ids = () => {
    if (!sqlite_vec) return [];
    try {
      return (database.prepare(`
        SELECT v.rowid FROM vec_memories v
        WHERE NOT EXISTS (SELECT 1 FROM memory_index m WHERE m.id = v.rowid)
      `).all() as Array<{ rowid: number }>).map((r) => r.rowid);
    } catch (e: unknown) {
      console.warn('[vector-index] Could not query orphaned vectors:', get_error_message(e));
exec
/bin/zsh -lc "rg --files '.opencode/skill/system-spec-kit/mcp_server/scripts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/scripts/reindex-embeddings.ts
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md
exec
/bin/zsh -lc "sed -n '200,245p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts && printf '\\n---\\n' && sed -n '1,80p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
    }

    return { valid: true, stored: stored_dim, current: current_dim };
  } catch (e: unknown) {
    console.warn('[vector-index] Dimension validation error:', get_error_message(e));
    return { valid: true, stored: null, current: get_embedding_dim(), reason: get_error_message(e) };
  }
}

/* -------------------------------------------------------------
   2. DATABASE PATH AND SECURITY
----------------------------------------------------------------*/

// P1-05 FIX: Unified env var precedence
const DEFAULT_DB_DIR = process.env.SPEC_KIT_DB_DIR ||
  process.env.MEMORY_DB_DIR ||
  path.resolve(__dirname, '../../database');
/** Default path for the vector-index database file. */
export const DEFAULT_DB_PATH = process.env.MEMORY_DB_PATH ||
  path.join(DEFAULT_DB_DIR, 'context-index.sqlite');
exec
/bin/zsh -lc "sed -n '220,380p' .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "getEdgeCount|UNION ALL|source_id IN|target_id IN|edge count|batch" .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts .opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"lastInsertRowid|SELECT id FROM causal_edges WHERE source_id = \\? AND target_id = \\? AND relation = \\?\" .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts .opencode/skill/system-spec-kit/mcp_server/tests/causal-edges*.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
 * Returns 0 when there are no memories or when a DB error occurs.
 */
function getGlobalEdgeDensityStats(
  db: Database.Database,
): { totalEdges: number; totalMemories: number; density: number } {
  try {
    const edgeRow = (db.prepare(
      `SELECT COUNT(*) AS cnt FROM causal_edges`,
    ) as Database.Statement).get() as { cnt: number };
    const totalEdges = edgeRow?.cnt ?? 0;

    const memoryRow = (db.prepare(
      `SELECT COUNT(*) AS cnt FROM memory_index`,
    ) as Database.Statement).get() as { cnt: number };
    const totalMemories = memoryRow?.cnt ?? 0;

    const density = totalMemories > 0 ? totalEdges / totalMemories : 0;
    return { totalEdges, totalMemories, density };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:160:function getEdgeCount(db: Database.Database, nodeId: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:246: * Batch-fetch edge counts for a set of node IDs in a single query.
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:247: * Returns a map of nodeId -> edge count (source OR target).
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:248: * Uses UNION ALL to count both directions per node in one round-trip.
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:250:function batchGetEdgeCounts(db: Database.Database, nodeIds: string[]): Map<string, number> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:255:  //   SELECT source_id AS id FROM causal_edges WHERE source_id IN (...)
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:256:  //   UNION ALL
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:257:  //   SELECT target_id AS id FROM causal_edges WHERE target_id IN (...)
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:262:      SELECT source_id AS id FROM causal_edges WHERE source_id IN (${placeholders})
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:263:      UNION ALL
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:264:      SELECT target_id AS id FROM causal_edges WHERE target_id IN (${placeholders})
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:278:    console.warn(`[entity-linker] batchGetEdgeCounts failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:307:  // Collect all unique node IDs across all matches so we can fetch edge counts
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:315:  // edgeCountCache holds the edge counts at the start of this run.
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:318:  const edgeCountCache = batchGetEdgeCounts(db, Array.from(allNodeIds));
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:537:  getEdgeCount,
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:698:    it('exposes getEdgeCount function', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:699:      expect(typeof __testables.getEdgeCount).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:702:      const count = __testables.getEdgeCount(db, '1');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:707:      expect(__testables.getEdgeCount(db, '1')).toBe(1);
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:189:        SELECT id FROM causal_edges WHERE source_id = ? AND target_id = ? AND relation = ?
exec
/bin/zsh -lc "rg -n \"removeDocument\\(|deleteMemory\\(|memory_summaries|degree_snapshots|community_assignments|memory_entities|causal_edges\" .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:367:      'DELETE FROM degree_snapshots WHERE memory_id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:368:      'DELETE FROM community_assignments WHERE memory_id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:369:      'DELETE FROM memory_summaries WHERE memory_id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:370:      'DELETE FROM memory_entities WHERE memory_id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:376:      database.prepare('DELETE FROM causal_edges WHERE source_id = ? OR target_id = ?').run(id, id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:392:        bm25Index.getIndex().removeDocument(String(id));
exec
/bin/zsh -lc "sed -n '340,410p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
  });

  return update_memory_tx();
}

/**
 * Deletes a memory and its related index records.
 * @param id - The memory identifier.
 * @returns True when a memory was deleted.
 */
export function delete_memory(id: number): boolean {
  const database = initialize_db();
  const sqlite_vec = get_sqlite_vec_available();

  const delete_memory_tx = database.transaction(() => {
    database.prepare('DELETE FROM memory_history WHERE memory_id = ?').run(id);

    if (sqlite_vec) {
      try {
        database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
exec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/mcp_server/scripts/reindex-embeddings.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Reindex Embeddings Compatibility Wrapper
// ---------------------------------------------------------------

import { spawnSync } from 'child_process';
import path from 'path';

const targetScript = path.resolve(__dirname, '../../scripts/dist/memory/reindex-embeddings.js');
const result = spawnSync(process.execPath, [targetScript, ...process.argv.slice(2)], {
  stdio: 'inherit',
});

if (typeof result.status === 'number') {
  process.exit(result.status);
}

process.exit(1);
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"double-count|convergence bonus|cross-variant bonus|per-variant bonus|auto-normal|normalize.*1\\.0|normalize core weights|normalize after doc-type adjustments|partial overrides|five-factor\" .opencode/skill/system-spec-kit/shared/algorithms .opencode/skill/system-spec-kit/mcp_server/lib" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: RRF Fusion
// ---------------------------------------------------------------
// Reciprocal Rank Fusion for combining search results
// P3-11: TypeScript source (previously orphaned .js only)

/* --- 1. CONSTANTS --- */

const SOURCE_TYPES = {
  VECTOR: 'vector',
  FTS: 'fts',
  BM25: 'bm25',
  GRAPH: 'graph',
  DEGREE: 'degree',
  KEYWORD: 'keyword',
} as const;

// AI-WHY: K=60 is the standard RRF constant from Cormack et al. (2009); higher K
// flattens rank differences, reducing the dominance of top-1 results. 60 balances
// discrimination vs. stability for our typical 10-50 candidate lists.
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:377:      // AI-GUARD: Preserve first-occurrence decision for the same memory ID — prevents double-counting.
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:38:/** Result of RRF fusion: an RrfItem augmented with fused score, source tracking, and convergence bonus. */
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:43:   * result was ranked highly by more methods. Includes convergence bonus
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:149:      // AI: Fix F16 — apply convergence bonus only once per ID.
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:172: * @param options - Optional k value, convergence bonus, and graph weight boost overrides.
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:214:  // Apply convergence bonus for multi-source matches
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:291: * @param options - Fusion configuration (k, convergence bonus, graph weight boost).
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:318: * cross-variant convergence bonus when the same ID appears in results
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:324: * @returns Fused results with cross-variant convergence bonuses
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:330:  // Use ?? so callers can explicitly pass 0 convergence bonus without falling back to default
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:379:  // Step 4: Apply cross-variant convergence bonus (clean, no double-counting)
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:423: * - If all scores are equal, they normalize to 1.0.
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:424: * - If a single result, it normalizes to 1.0.
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:456:    // All same score (or single result) — normalize to 1.0
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:558:  // merging partial overrides. Without this, partial overrides break weighted-average semantics.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:786: * - If all scores are equal, they normalize to 1.0.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:787: * - If a single result, it normalizes to 1.0.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:35:// main handler to avoid double-counting and cache pollution.
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:62: * double-counting in the fusion pipeline.
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:53:  // AI-WHY: When all scores identical, normalize to 1.0 (not 0/0) — all equally relevant
exec
/bin/zsh -lc "sed -n '260,360p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "featureFlags|constitutionalInjected|stateFiltered|evidenceGapDetected|sessionDeduped" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
257:  const stateFiltered = filterResult.removedCount;
260:  let evidenceGapDetected = false;
267:    evidenceGapDetected = trm.gapDetected;
281:  const featureFlags: Record<string, boolean> = {
291:    removed: stateFiltered,
297:    featureFlags,
319:        stateFiltered,
320:        evidenceGapDetected,
331:      stateFiltered,
332:      // AI-WHY: Fix #14 — sessionDeduped removed; dedup is post-cache in main handler
333:      // AI-WHY: Fix #15 — constitutionalInjected passed from Stage 1 metadata
334:      constitutionalInjected: input.stage1Metadata?.constitutionalInjected ?? 0,
335:      evidenceGapDetected,
 succeeded in 52ms:
  let evidenceGapDetected = false;
  let evidenceGapWarning: string | undefined;

  if (isTRMEnabled()) {
    const scores = workingResults.map(extractScoringValue);
    const trm = detectEvidenceGap(scores);

    evidenceGapDetected = trm.gapDetected;

    if (trm.gapDetected) {
      evidenceGapWarning = formatEvidenceGapWarning(trm);

      // Annotate each result with the gap metadata (non-score field).
      workingResults = workingResults.map(row => ({
        ...row,
        evidenceGap: { gapDetected: true, warning: evidenceGapWarning },
      }));
    }
  }

exec
/bin/zsh -lc "sed -n '300,410p' .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
      try {
        const results = await sf.fn();
        return { source: sf.source, results, weight: sf.weight };
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[rrf-fusion] ${sf.source} search failed: ${msg}`);
        return { source: sf.source, results: [], weight: sf.weight };
      }
    })
  );
  return fuseResultsMulti(lists, options);
}

/**
 * C138-P3: Cross-Variant RRF Fusion for multi-query RAG.
 *
 * Accepts multi-dimensional arrays (one RankedList[] per query variant),
 * groups identical memory IDs across variants, and applies a +0.10
 * cross-variant convergence bonus when the same ID appears in results
 * from different query variants.
exec
/bin/zsh -lc "sed -n '520,590p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
      logScoringObservation({
        memoryId: (row.id as number) || 0,
        queryId: `${queryIdPrefix}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        noveltyBoostApplied: false,
        noveltyBoostValue: 0,
        memoryAgeDays: isNaN(createdMs) ? 0 : (Date.now() - createdMs) / 86400000,
        // AI-WHY: Graduated flag — default ON. Use !== 'false' to match graduated semantics (BUG-4 fix).
        interferenceApplied: interferenceScore > 0 && process.env.SPECKIT_INTERFERENCE_SCORE?.toLowerCase() !== 'false',
        interferenceScore,
        interferencePenalty: process.env.SPECKIT_INTERFERENCE_SCORE?.toLowerCase() !== 'false' && interferenceScore > 0
          ? INTERFERENCE_PENALTY_COEFFICIENT * interferenceScore : 0,
        scoreBeforeBoosts: composite,
        scoreAfterBoosts: finalScore,
        scoreDelta: finalScore - composite,
      });
    }
  } catch (_err: unknown) { /* AI-RISK: Telemetry must never affect scoring — fail-safe swallow */ }

  return finalScore;
exec
/bin/zsh -lc 'rg -n "isDocscoreAggregationEnabled|collapseAndReassembleChunkResults|DOCSCORE_AGGREGATION" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts .opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:6:// Feature flag: SPECKIT_DOCSCORE_AGGREGATION (default OFF)
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:64: * Default: TRUE (graduated Sprint 4). Set SPECKIT_DOCSCORE_AGGREGATION=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:69:  return process.env.SPECKIT_DOCSCORE_AGGREGATION?.toLowerCase() !== 'false';
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:141:export function collapseAndReassembleChunkResults(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:210:    await collapseAndReassembleChunkResults(results);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:411:async function collapseAndReassembleChunkResults(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:613:  collapseAndReassembleChunkResults,
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Mpab Aggregation
// ---------------------------------------------------------------
// Multi-Parent Aggregated Bonus (MPAB) for chunk-to-memory score aggregation.
// Pipeline position: after RRF fusion, before state filtering.
// Feature flag: SPECKIT_DOCSCORE_AGGREGATION (default OFF)

/* --- 1. TYPES --- */

/**
 * Result of MPAB aggregation for a single parent memory.
 * Contains the aggregated score and metadata about the chunks
 * that contributed to it.
 */
export interface MpabResult {
  /** Unique identifier of the parent memory document. */
  parentMemoryId: number | string;
  /** MPAB-aggregated score: sMax + 0.3 * sum(remaining) / sqrt(N). */
  mpabScore: number;
  /** Number of chunk hits that contributed to this score. */
exec
/bin/zsh -lc "rg -n \"computeMPAB|MPAB_BONUS_COEFFICIENT|isMpabEnabled|sqrt\\(N\\)|sumRemaining|mpab\" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
206:  const mpabStart = Date.now();
220:      Date.now() - mpabStart,
exec
/bin/zsh -lc "sed -n '360,470p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
    return { rows: rerankedRows, applied: true };
  } catch (err: unknown) {
    // AI-WHY: Graceful degradation — return original results on any reranker failure
    console.warn(
      `[stage3-rerank] Cross-encoder reranking failed: ${toErrorMessage(err)} — returning original results`
    );
    return { rows: results, applied: false };
  }
}

/**
 * Resolve the content string used for cross-encoder scoring for a given row.
 * Prefers `content` over `file_path`; falls back to an empty string if
 * neither is available (rare edge case for index-only entries).
 *
 * This value is placed into the `content` field of the RerankDocument sent
 * to the cross-encoder module.
 *
 * @param row - A pipeline result row.
 * @returns Content string for the cross-encoder.
exec
/bin/zsh -lc "rg -n \"computeMPAB|collapseAndReassembleChunkResults\\(|isMpabEnabled\\(\" .opencode/skill/system-spec-kit/mcp_server -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:376:function collapseAndReassembleChunkResults(results: MemorySearchRow[]): ChunkReassemblyResult {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:148:    const result = collapseAndReassembleChunkResults([]);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:156:    const result = collapseAndReassembleChunkResults(rows);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:164:    const result = collapseAndReassembleChunkResults(rows);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:172:    const result = collapseAndReassembleChunkResults(rows);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:179:    const result = collapseAndReassembleChunkResults(rows);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:188:    const result = collapseAndReassembleChunkResults(rows);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:8:  computeMPAB,
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:37:// computeMPAB — Core Algorithm
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:40:describe('computeMPAB', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:42:    expect(computeMPAB([])).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:46:    expect(computeMPAB([0.75])).toBe(0.75);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:50:    expect(computeMPAB([0.0])).toBe(0.0);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:51:    expect(computeMPAB([1.0])).toBe(1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:52:    expect(computeMPAB([0.123456])).toBe(0.123456);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:62:    expect(computeMPAB(scores)).toBeCloseTo(expected, 10);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:66:    const a = computeMPAB([0.4, 0.8]);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:67:    const b = computeMPAB([0.8, 0.4]);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:81:    expect(computeMPAB(scores)).toBeCloseTo(expected, 10);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:86:    const result = computeMPAB(scores);
exec
/bin/zsh -lc "rg -n \"isPipelineV2Enabled\\(|executePipeline\\(|executeStage1|postSearchPipeline|SPECKIT_PIPELINE_V2\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:575:// shouldApplyPostSearchIntentWeighting, postSearchPipeline) removed in
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:810:        const pipelineResult: PipelineResult = await executePipeline(pipelineConfig);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:575:// shouldApplyPostSearchIntentWeighting, postSearchPipeline) removed in
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:810:        const pipelineResult: PipelineResult = await executePipeline(pipelineConfig);
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:48:  'SPECKIT_PIPELINE_V2',
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:72:  { flag: 'SPECKIT_PIPELINE_V2', checker: isPipelineV2Enabled },
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:164:      // AI-WHY: isPipelineV2Enabled() is deprecated and always returns true
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:166:      const expected = flag === 'SPECKIT_PIPELINE_V2' ? true : false;
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:186:      // AI-WHY: isPipelineV2Enabled() always returns true (deprecated).
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:187:      const expected = flag === 'SPECKIT_PIPELINE_V2' ? true : i < half;
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:4:// and pipeline orchestration under SPECKIT_PIPELINE_V2 flag.
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:292:  it('R6-T18: SPECKIT_PIPELINE_V2 defaults to true (graduated)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:293:    delete process.env.SPECKIT_PIPELINE_V2;
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:294:    expect(isPipelineV2Enabled()).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:297:  it('R6-T19: SPECKIT_PIPELINE_V2=true enables pipeline V2', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:298:    process.env.SPECKIT_PIPELINE_V2 = 'true';
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:299:    expect(isPipelineV2Enabled()).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:302:  it('R6-T20: SPECKIT_PIPELINE_V2=false still returns true (deprecated, V2 always on)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:303:    process.env.SPECKIT_PIPELINE_V2 = 'false';
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:305:    // isPipelineV2Enabled() now always returns true regardless of env var.
exec
/bin/zsh -lc "sed -n '700,770p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
      const sourceMap = new Map<string, Set<string>>();
      for (const list of lists) {
        for (const r of list.results) {
          const key = canonicalResultId(r.id);
          if (!sourceMap.has(key)) sourceMap.set(key, new Set());
          sourceMap.get(key)!.add(list.source); // non-null safe: has() guard above guarantees entry exists
        }
      }
      for (const [, sources] of sourceMap) {
        if (sources.size > 1) graphMetrics.multiSourceResults++;
        if (sources.size === 1 && sources.has('graph')) graphMetrics.graphOnlyResults++;
      }

      // C138: Use adaptive fusion to get intent-aware weights replacing hardcoded [1.0, 0.8, 0.6]
      const intent = options.intent || classifyIntent(query).intent;
      const adaptiveResult = hybridAdaptiveFuse(semanticResults, keywordResults, intent);
      const { semanticWeight, keywordWeight } = adaptiveResult.weights;

      // Apply adaptive weights to the fusion lists (update in place)
      const { graphWeight: adaptiveGraphWeight } = adaptiveResult.weights;
exec
/bin/zsh -lc 'rg -n "mergedEntities" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 53ms:

exec
/bin/zsh -lc 'rg -n "artifactRouting|detectedClass|boostFactor|maxResults|artifact-routing" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:32:  maxResults: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:34:  boostFactor: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:39:  detectedClass: ArtifactClass;
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:60:    maxResults: 5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:61:    boostFactor: 1.0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:68:    maxResults: 5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:69:    boostFactor: 1.0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:76:    maxResults: 10,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:77:    boostFactor: 0.9,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:84:    maxResults: 10,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:85:    boostFactor: 0.9,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:92:    maxResults: 5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:93:    boostFactor: 1.0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:100:    maxResults: 5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:101:    boostFactor: 1.0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:108:    maxResults: 5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:109:    boostFactor: 1.1,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:116:    maxResults: 5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:117:    boostFactor: 1.0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:124:    maxResults: 10,
exec
/bin/zsh -lc "sed -n '360,410p' .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
      reason: promotionResult.reason,
    };
  }

  // T002b: Negative-feedback confidence signal persistence for runtime scoring.
  if (!wasUseful) {
    recordNegativeFeedbackEvent(database, memoryId);
  }

  // T002 + T027a: Optional wiring from memory_validate to learned feedback + ground truth.
  let learnedFeedback: {
    attempted: boolean;
    applied: boolean;
    termsLearned: string[];
    reason?: string;
  } | null = null;
  let groundTruthSelectionId: number | null = null;

  if (wasUseful && typeof queryId === 'string' && queryId.trim().length > 0) {
    groundTruthSelectionId = recordUserSelection(queryId, memoryId, {
codex
---
FEATURE: 01-4-stage-pipeline-refactor.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/handlers/memory-search.ts, mcp_server/lib/search/artifact-routing.ts, mcp_server/lib/scoring/composite-scoring.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The 4-stage pipeline is real, but the R8 summary channel is not actually run in parallel in `stage1-candidate-gen.ts`, and some cited behavior is implemented in unlisted files.
---
FEATURE: 02-mpab-chunk-to-memory-aggregation.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/hybrid-search.ts, mcp_server/lib/search/pipeline/stage1-candidate-gen.ts, mcp_server/lib/search/pipeline/stage3-rerank.ts, mcp_server/lib/search/search-flags.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: The MPAB formula module exists, but the active 4-stage pipeline does not apply that formula in Stage 3; hybrid search applies MPAB earlier, while Stage 3 currently collapses by best chunk plus reassembly.
---
FEATURE: 03-chunk-ordering-preservation.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/pipeline/stage3-rerank.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The behavior matches `stage3-rerank.ts`, which sorts by `chunk_index`, reassembles parent content from DB, and falls back to best-chunk content with `contentSource: 'file_read_fallback'`.
---
FEATURE: 04-template-anchor-optimization.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/pipeline/stage2-fusion.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: `anchor-metadata.ts` matches the description, but the Stage 2 integration point is in unlisted `stage2-fusion.ts`.
---
FEATURE: 05-validation-signals-as-retrieval-metadata.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/pipeline/stage2-fusion.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Extraction and bounded multiplier logic match the code; the missing piece in the catalog is the Stage 2 scoring/integration file.
---
FEATURE: 06-learned-relevance-feedback.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/checkpoints.ts, mcp_server/lib/search/pipeline/stage2-fusion.ts, mcp_server/lib/search/vector-index-schema.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The learning flow, FTS5 isolation, TTL, shadow period, and 0.7x Stage 2 boost are real; however, the “sprint gate review” safeguard is not runtime-enforced, and key wiring/schema files are omitted.
---
FEATURE: 07-search-pipeline-safety.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The three fixes are present in code: summary quality filtering, shared FTS token sanitization, and `QUALITY_FLOOR=0.005`.
---
FEATURE: 08-performance-improvements.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/tfidf-summarizer.ts, mcp_server/lib/search/memory-summaries.ts, mcp_server/lib/storage/mutation-ledger.ts, mcp_server/lib/search/entity-linker.ts, mcp_server/lib/storage/causal-edges.ts, mcp_server/lib/search/spec-folder-hierarchy.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: Several improvements are real, but the listed source files are unrelated, `mergedEntities` is not present in the current code, and `causal-edges.ts` still performs a post-upsert `SELECT` instead of the described `lastInsertRowid` flow.
---
FEATURE: 09-activation-window-persistence.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/validation/save-quality-gate.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The feature is implemented exactly in `save-quality-gate.ts`, including `ensureActivationTimestampInitialized()` and test `WO7`; the listed files do not implement it.
---
FEATURE: 10-legacy-v1-pipeline-removal.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/handlers/memory-search.ts, mcp_server/lib/search/pipeline/stage1-candidate-gen.ts, mcp_server/lib/search/pipeline/stage2-fusion.ts, mcp_server/lib/search/pipeline/stage3-rerank.ts, mcp_server/lib/search/pipeline/stage4-filter.ts, mcp_server/lib/search/vector-index-queries.ts, mcp_server/lib/search/vector-index-store.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: V2-only execution and orphaned chunk cleanup are real, but the catalog overstates the deletion: several named functions/constants still exist in the new pipeline modules, so the description is misleading as written.
---
FEATURE: 11-pipeline-and-mutation-hardening.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/tool-schemas.ts, mcp_server/schemas/tool-input-schemas.ts, mcp_server/lib/search/pipeline/stage1-candidate-gen.ts, mcp_server/lib/search/pipeline/stage4-filter.ts, mcp_server/handlers/memory-crud-update.ts, mcp_server/lib/search/vector-index-mutations.ts, mcp_server/lib/search/bm25-index.ts, mcp_server/handlers/memory-save.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The fixes are in code, but they span schemas, pipeline stages, CRUD handlers, vector-index mutations, BM25, and preflight handling; the current source list only covers a small subset.
---
FEATURE: 12-dbpath-extraction-and-import-standardization.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/tsconfig.json, shared/index.ts, mcp_server/lib/search/vector-index-store.ts, mcp_server/lib/eval/eval-db.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: `getDbDir()` and `shared/paths.ts` are real, and alias-based imports are widespread, but the named `cleanup-orphaned-vectors.ts` script does not exist and DB-path handling is still duplicated in other core modules.
---
tokens used
305,586
---
FEATURE: 01-4-stage-pipeline-refactor.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/handlers/memory-search.ts, mcp_server/lib/search/artifact-routing.ts, mcp_server/lib/scoring/composite-scoring.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The 4-stage pipeline is real, but the R8 summary channel is not actually run in parallel in `stage1-candidate-gen.ts`, and some cited behavior is implemented in unlisted files.
---
FEATURE: 02-mpab-chunk-to-memory-aggregation.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/hybrid-search.ts, mcp_server/lib/search/pipeline/stage1-candidate-gen.ts, mcp_server/lib/search/pipeline/stage3-rerank.ts, mcp_server/lib/search/search-flags.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: The MPAB formula module exists, but the active 4-stage pipeline does not apply that formula in Stage 3; hybrid search applies MPAB earlier, while Stage 3 currently collapses by best chunk plus reassembly.
---
FEATURE: 03-chunk-ordering-preservation.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/pipeline/stage3-rerank.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The behavior matches `stage3-rerank.ts`, which sorts by `chunk_index`, reassembles parent content from DB, and falls back to best-chunk content with `contentSource: 'file_read_fallback'`.
---
FEATURE: 04-template-anchor-optimization.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/pipeline/stage2-fusion.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: `anchor-metadata.ts` matches the description, but the Stage 2 integration point is in unlisted `stage2-fusion.ts`.
---
FEATURE: 05-validation-signals-as-retrieval-metadata.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/pipeline/stage2-fusion.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: Extraction and bounded multiplier logic match the code; the missing piece in the catalog is the Stage 2 scoring/integration file.
---
FEATURE: 06-learned-relevance-feedback.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/checkpoints.ts, mcp_server/lib/search/pipeline/stage2-fusion.ts, mcp_server/lib/search/vector-index-schema.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The learning flow, FTS5 isolation, TTL, shadow period, and 0.7x Stage 2 boost are real; however, the “sprint gate review” safeguard is not runtime-enforced, and key wiring/schema files are omitted.
---
FEATURE: 07-search-pipeline-safety.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The three fixes are present in code: summary quality filtering, shared FTS token sanitization, and `QUALITY_FLOOR=0.005`.
---
FEATURE: 08-performance-improvements.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/tfidf-summarizer.ts, mcp_server/lib/search/memory-summaries.ts, mcp_server/lib/storage/mutation-ledger.ts, mcp_server/lib/search/entity-linker.ts, mcp_server/lib/storage/causal-edges.ts, mcp_server/lib/search/spec-folder-hierarchy.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: Several improvements are real, but the listed source files are unrelated, `mergedEntities` is not present in the current code, and `causal-edges.ts` still performs a post-upsert `SELECT` instead of the described `lastInsertRowid` flow.
---
FEATURE: 09-activation-window-persistence.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/validation/save-quality-gate.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The feature is implemented exactly in `save-quality-gate.ts`, including `ensureActivationTimestampInitialized()` and test `WO7`; the listed files do not implement it.
---
FEATURE: 10-legacy-v1-pipeline-removal.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/handlers/memory-search.ts, mcp_server/lib/search/pipeline/stage1-candidate-gen.ts, mcp_server/lib/search/pipeline/stage2-fusion.ts, mcp_server/lib/search/pipeline/stage3-rerank.ts, mcp_server/lib/search/pipeline/stage4-filter.ts, mcp_server/lib/search/vector-index-queries.ts, mcp_server/lib/search/vector-index-store.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: V2-only execution and orphaned chunk cleanup are real, but the catalog overstates the deletion: several named functions/constants still exist in the new pipeline modules, so the description is misleading as written.
---
FEATURE: 11-pipeline-and-mutation-hardening.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/tool-schemas.ts, mcp_server/schemas/tool-input-schemas.ts, mcp_server/lib/search/pipeline/stage1-candidate-gen.ts, mcp_server/lib/search/pipeline/stage4-filter.ts, mcp_server/handlers/memory-crud-update.ts, mcp_server/lib/search/vector-index-mutations.ts, mcp_server/lib/search/bm25-index.ts, mcp_server/handlers/memory-save.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The fixes are in code, but they span schemas, pipeline stages, CRUD handlers, vector-index mutations, BM25, and preflight handling; the current source list only covers a small subset.
---
FEATURE: 12-dbpath-extraction-and-import-standardization.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/tsconfig.json, shared/index.ts, mcp_server/lib/search/vector-index-store.ts, mcp_server/lib/eval/eval-db.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: `getDbDir()` and `shared/paths.ts` are real, and alias-based imports are widespread, but the named `cleanup-orphaned-vectors.ts` script does not exist and DB-path handling is still duplicated in other core modules.
---
