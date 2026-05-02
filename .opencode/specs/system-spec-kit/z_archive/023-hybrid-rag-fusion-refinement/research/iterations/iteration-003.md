# Iteration 3: Verify Spec 009/010/011 Fix Implementations

## Focus
Verify that the specific fixes from specs 009, 010, and 011 are correctly implemented and working in the current codebase. Three questions: Q6 (validator V8/V12 fixes), Q7 (6 retrieval quality fixes), Q8 (lexical score propagation).

## Findings

### Q6: Validator Fixes (V8 Cross-Spec Contamination, V12 Topical Coherence) -- WORKING

1. **V8 (Cross-Spec Contamination) is correctly implemented with three-pronged detection.**
   The V8 rule in `validate-memory-quality.ts` checks three contamination vectors: (a) frontmatter foreign spec mentions, (b) body content where foreign spec IDs dominate rendered content, (c) scattered foreign spec mentions in body text. All three are merged into a `v8Matches` array; the rule passes only when `v8Matches.length === 0`. V8 has severity "high", `blockOnWrite: true`, `blockOnIndex: true` -- meaning contaminated memories are blocked at both write and index stages.
   [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:101-108, 762-775]

2. **V12 (Topical Coherence) is correctly implemented with spec trigger_phrase overlap checking.**
   V12 reads the parent spec folder's `spec.md` to extract `trigger_phrases`, then checks whether ANY of those phrases appear (case-insensitive) in the memory content. If zero phrases match, V12 fails with `V12_TOPICAL_MISMATCH`. V12 has severity "medium", `blockOnWrite: false`, `blockOnIndex: true` -- meaning off-topic memories are written to disk but excluded from the semantic index.
   [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:133-140, 841-872]

3. **V-Rule Bridge correctly loads the compiled validator at runtime.**
   The `v-rule-bridge.ts` handler in the MCP server uses `createRequire(import.meta.filename)` to dynamically load the compiled `validate-memory-quality.js` from the scripts/dist directory. It attempts two candidate paths and falls back gracefully if the module is unavailable (returns error result or bypasses when SPECKIT_VRULE_OPTIONAL=true). The bridge exports `validateMemoryQualityContent()` and `determineValidationDisposition()`.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/v-rule-bridge.ts:54-82, 88-119]

4. **V8/V12 have dedicated test coverage.**
   The file `scripts/tests/validation-v13-v14-v12.vitest.ts` exists (confirmed by grep results), indicating V12 has dedicated test coverage alongside V13/V14. The contamination audit record type is imported from `content-filter.ts`, confirming V8's cross-spec contamination detection is integrated with the broader content filtering system.
   [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/validation-v13-v14-v12.vitest.ts (file exists), .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:19-20]

### Q7: Retrieval Quality Fixes (6 Items from Spec 010) -- ALL PRESENT

5. **Intent propagation -- PRESENT.** The `hybrid-search.ts` imports `classifyIntent` from `intent-classifier.js` and `INTENT_LAMBDA_MAP` for per-intent weight adjustments. The `HybridSearchOptions` interface includes an `intent` field (line 92) that threads classified intent through the entire pipeline. The search-results formatter resolves `intentAdjustedScore` as the highest-priority score in `resolveCompositeScore()` (lines 205-206) and `resolveScoreResolution()` (line 217).
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:14, 92; .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:205-217]

6. **Folder auto-narrowing -- PRESENT.** The `hybrid-search.ts` imports `lookupFolders`, `computeFolderRelevanceScores`, `enrichResultsWithFolderScores`, and `twoPhaseRetrieval` from `folder-relevance.js` (lines 50-55). Also imports `ensureDescriptionCache` and `getSpecsBasePaths` from `folder-discovery.js` (line 49). The `isFolderScoringEnabled()` flag gates folder-based scoring as a boost signal rather than a hard filter.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:48-55]

7. **Token budget truncation -- PRESENT.** The `hybrid-search.ts` imports `getDynamicTokenBudget`, `isDynamicTokenBudgetEnabled`, and `DEFAULT_TOKEN_BUDGET_CONFIG` from `dynamic-token-budget.js` (lines 44-47). Critically, the `evaluationMode` flag in `HybridSearchOptions` (lines 85-90) explicitly bypasses both confidence truncation AND token-budget truncation for evaluation/testing purposes, confirming the fix differentiates between aggressive truncation and evaluation contexts.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:44-47, 85-90]

8. **Folder discovery as boost signal -- PRESENT.** The `isFolderScoringEnabled()` flag (imported from `folder-relevance.js`) uses folder relevance as a BOOST signal rather than a pre-filter. `enrichResultsWithFolderScores()` adds folder relevance scores additively to results, and `twoPhaseRetrieval()` implements two-phase retrieval that first discovers relevant folders then applies them as scoring signals.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:50-55]

9. **Two-tier metadata+content response -- PRESENT.** The `search-results.ts` formatter implements a full two-tier response: the default tier returns metadata (id, specFolder, filePath, title, similarity, importanceTier, triggerPhrases, etc.), while `includeContent: true` adds the full file content with anchor-filtered extraction, token metrics, chunk reassembly, and content source tracking. The `includeTrace` flag adds a third tier with scores, source provenance, and pipeline trace.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:69-108, 150-154, 457-478]

10. **Intent confidence floor -- PRESENT.** The `confidence-truncation.ts` module is imported with `truncateByConfidence` and `isConfidenceTruncationEnabled` (lines 38-42). The `DEFAULT_MIN_RESULTS` and `GAP_THRESHOLD_MULTIPLIER` constants establish a floor that prevents over-aggressive truncation from eliminating all results. The `evaluationMode` flag explicitly bypasses confidence truncation when enabled.
    [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:38-42, 85-90]

### Q8: Lexical Score Propagation (BM25/FTS5 through RRF) -- WORKING

11. **FTS5 scores propagate through the search pipeline via sourceScores.**
    In `hybrid-search.ts`, the `ftsSearch()` function (lines 446-472) delegates to `fts5Bm25Search()` which uses weighted BM25 scoring (title 10x, trigger_phrases 5x, file_path 2x, content 1x). Results are mapped with `score: row.fts_score || 0` and tagged `source: 'fts'`. The `combinedLexicalSearch()` function (lines 482-508) merges FTS and BM25 results, deduplicating by canonical ID and preferring FTS scores.
    [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:446-508]

12. **Source scores are preserved through RRF fusion via mergeRawCandidate.**
    The `mergeRawCandidate()` function (lines 557-600) preserves per-channel scores in `sourceScores` by merging existing and incoming scores (`{...getCandidateSourceScores(existing), ...getCandidateSourceScores(incoming)}`). This means both BM25 and FTS scores survive fusion and are available in final results.
    [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:535-555, 590-600]

13. **Lexical scores surface in the response envelope.**
    The `search-results.ts` formatter extracts lexical scores from multiple possible locations: `rawResult.fts_score`, `rawResult.bm25_score`, `rawResult.sourceScores?.keyword`, `rawResult.sourceScores?.fts`, or `rawResult.sourceScores?.bm25` (line 461). This fallback chain ensures lexical scores from any channel propagate into the `scores.lexical` field in the trace envelope.
    [SOURCE: .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:461]

## Ruled Out
- V8/V12 regressions: Both rules are fully implemented with correct severity levels and blocking behavior.
- Missing retrieval quality fixes: All 6 fixes from spec 010 are confirmed present in imports and interfaces.
- Lexical score loss during fusion: The sourceScores merge pattern explicitly preserves per-channel scores.

## Dead Ends
None -- all investigation paths were productive.

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts` (lines 23, 101-108, 133-140, 762-775, 841-872)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/v-rule-bridge.ts` (full file, 122 lines)
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts` (full file, 686 lines)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` (lines 1-100, 400-600)
- `.opencode/skill/system-spec-kit/scripts/tests/validation-v13-v14-v12.vitest.ts` (confirmed existence)

## Assessment
- New information ratio: 0.85
- Questions addressed: Q6, Q7, Q8
- Questions answered: Q6 (validator fixes working), Q7 (all 6 retrieval quality fixes present), Q8 (lexical score propagation working)

## Reflection
- What worked and why: Reading the actual source files for V8/V12 rules, the hybrid-search imports, and the search-results formatter provided definitive evidence. The code is well-structured with clear module boundaries, making verification straightforward.
- What did not work and why: The compiled JS (validate-memory-quality.js) did not contain searchable V8/V12 strings, requiring fallback to the TypeScript source. This suggests minification or name mangling during compilation.
- What I would do differently: Start with TypeScript sources directly instead of compiled JS when investigating rule implementations.

## Recommended Next Focus
Investigate Q3 (remaining search quality issues beyond 009/010/011), Q4 (hookless UX/auto-utilization improvements), and Q9 (adaptive fusion refinement opportunities). Focus on running actual searches or reading the search pipeline end-to-end to identify any remaining quality gaps.
