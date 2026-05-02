## [v0.7.0] - 2026-03-30

Phase 007 restored hybrid search so saved context can be found again, then tightened the ranking and monitoring needed to keep those results trustworthy. Two silent filters were individually discarding every search result despite a healthy 999-memory database. Once both were removed, queries returned real matches again from both the semantic-similarity and exact-word-matching channels. A follow-up research and review pass then addressed the remaining gaps in ranking accuracy, candidate recall, result diversity and pipeline observability.

> Spec folder: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/007-hybrid-search-null-db-fix/` (Level 2)

---

## Bug Fixes (3)

These three fixes removed silent filters that were discarding good matches before they could reach the user. A tracing pass across the search stages confirmed the problem was not missing data. Good candidates were being found, then thrown away before output.

### Unscoped searches no longer reject every result

**Problem:** A security hardening change switched on access-scope enforcement, the rule that results must belong to the caller's designated space (tenant, user, or agent), by default. That sounds cautious, but it created a harmful default for single-user environments. A query without explicit space-ownership fields was treated as "this caller owns nothing, show nothing," and every candidate was rejected before reaching the user. The system appeared healthy. The memory list still worked and trigger phrase matching still fired, but every ranked search returned empty.

**Fix:** Access-scope enforcement now requires a deliberate opt-in to activate. Unmanaged and single-user deployments work as expected by default. Shared environments that need strict separation between users can still enable enforcement explicitly. Normal searches no longer fail silently when no ownership parameters are provided.

### Missing lifecycle-state data no longer wipes out all results

**Problem:** A filter step in the search pipeline checked each result's lifecycle state — a value that indicates how "warm" or active a memory is — against a minimum threshold before passing candidates downstream. The problem was that the database had never been provisioned to store lifecycle states: the column did not exist, so every memory resolved to an unknown state that ranked below the threshold. Vector search (semantic similarity — finding memories by meaning rather than exact words) and FTS5 (full-text search using exact word matching) both found good matches, but every one of those candidates was then silently removed at this final gating step.

**Fix:** The minimum-state filter was removed from both search tools while lifecycle-state storage remains unimplemented. Candidates are no longer judged against data that does not exist. After this fix, queries return four to five results and both search channels contribute to the final answer.

### Background search monitoring no longer discards all candidates

**Problem:** The search pipeline includes a shadow evaluation mode — a non-user-facing monitoring pass that runs queries in the background to measure ranking quality without affecting live results. This monitoring pass had inherited the same lifecycle-state filter that broke the main search pipeline. Every candidate was being silently discarded during monitoring runs, producing no usable quality signals.

**Fix:** The state filter was removed from shadow evaluation as well. Monitoring runs now complete successfully and produce the quality measurements they were designed to collect.

---

## Search (10)

These improvements were applied after search correctness was restored. They address ranking accuracy, candidate recall, result variety, and how related memories are surfaced together.

### Ranking tuned for a smaller corpus

**Problem:** The algorithm used to blend results from multiple search channels, called reciprocal rank fusion (a technique that combines multiple ranked lists into a single unified score), was configured with a smoothing constant designed for collections of tens of thousands of documents. Applied to a 999-memory database, the setting compressed scores too tightly together, making it difficult to distinguish a strong match from a mediocre one.

**Fix:** The smoothing constant was lowered to a value better suited to the current corpus size. Scores now spread more meaningfully, so the best-matching memories separate more clearly from borderline ones.

### Long memories no longer get cut short

**Problem:** The search pipeline capped how much text it would read per memory at a token budget (the maximum number of word fragments the system processes at once per item). For memories holding extended notes or detailed summaries, this cap cut off content partway through, making the tail end of a long memory invisible to ranking.

**Fix:** The token budget was raised across quick, focused, deep and session-resume modes. Long memories are now read in full, making dense or detailed entries as retrievable as short ones.

### Exact-match filtering made consistent across channels

**Problem:** The pipeline uses two separate channels for exact word matching — one for broad text search, one for ranked scoring — and each applied slightly different rules for excluding archived or deprecated memories. The inconsistency meant a memory excluded by one channel might still appear through the other, producing unpredictable filtering behavior depending on which path surfaced a result.

**Fix:** Both channels now apply the same exclusion rule for deprecated content. What you see in results is consistent regardless of which internal path surfaced it.

### Candidate expansion now activates for borderline matches

**Problem:** When the pipeline considered whether to expand a search by retrieving semantically similar neighbors — broadening the candidate pool beyond the initial vector results — it required a relevance score high enough to exclude useful borderline cases. Memories that were a strong match in context, but not a near-perfect vector match, would not trigger expansion and were left out of results entirely.

**Fix:** The expansion threshold was relaxed to permit borderline candidates to enter the pool. More semantically neighboring memories now become eligible, improving recall for queries that do not precisely match the most prominent phrasing in the database.

### Reranking scores content and title separately; diversity pass always runs

**Problem:** When a secondary scoring pass, called reranking (a more expensive sorting step applied after the initial candidate list is assembled), evaluated a memory, it concatenated the title and body into a single block before scoring. A strong title match and a weak body could cancel each other into a middling result. Additionally, a diversity reordering step called MMR (maximum marginal relevance, a technique that pushes similar results apart to increase variety) was skipped entirely whenever the full reranker was unavailable.

**Fix:** The reranker now scores title and body as separate inputs. The MMR diversity pass runs regardless of whether the full reranker is available, so a run of nearly identical results is broken up in all cases.

### Multi-word queries now find phrase matches

**Problem:** When a search included a compound term such as "spec kit" or "search pipeline," the full-text search channel treated the words as an unordered bag — it found memories containing both words anywhere in the document but gave no extra credit to memories where the words appeared together as a phrase. Phrase-level matches are semantically stronger and should rank higher.

**Fix:** Multi-word queries are now expanded to include phrase variants alongside individual token variants. Full-text search now rewards memories that contain the exact phrasing, not just both words scattered across the body.

### Related memories now enter search results correctly

**Problem:** The system tracks which memories tend to be retrieved together — called co-activation (the pattern of related memories being surfaced together based on shared retrieval history). These co-activated memories are supposed to be injected as extra candidates during result fusion (the step where results from all search channels are blended), boosting recall for conceptually linked content. Two bugs prevented this from working: the related-memory identifiers were returned in a format the fusion step could not recognize, and the similarity score used to gauge how closely two memories are related was scaled one hundred times too small.

**Fix:** Both issues were corrected. Co-activated memories are now returned in the right format at the right scale, and they are injected into the fusion candidate pool. Conceptually related memories can surface together as intended.

### Older memories now receive quality scores

**Problem:** Roughly 520 memories in the database had never been assigned a quality score — the value used to assess how reliable or well-formed a memory is. These entries were invisible to any quality-based ranking or filtering because their score was effectively zero. The scoring step only ran at save time, so memories that predated the quality-assessment logic had no score at all.

**Fix:** A backfill step was added that calculates a quality score for previously un-scored memories when they are first encountered during a search pass. Over time, all memories accumulate quality scores without requiring a bulk migration.

### Chunk lineage repaired

**Problem:** When a large note is split into smaller pieces — called chunking (breaking a long memory into child segments for more granular retrieval) — each child piece is supposed to record a link back to its source, called lineage (parent-child links that let the system reassemble a full picture from its parts). This link was not being written during chunking, leaving all child segments disconnected from their parent source.

**Fix:** Chunk creation now records the parent link for every child segment. Lineage traversal from chunk to source is restored.

### Search timing and cache statistics are now observable

**Problem:** The search pipeline already measured how long each internal stage took — candidate generation, fusion, reranking, filtering — but those measurements were written only to the live console log and never stored anywhere. Separately, the embedding cache (a short-term store that avoids recomputing the mathematical representations of repeated queries) had no way to report how often it was returning stored results versus generating new ones.

**Fix:** Stage timing is now persisted so it can be reviewed after a session without needing live log access. The embedding cache now tracks and exposes hit and miss counts. Both improvements make the search pipeline observable through monitoring instead of requiring live inspection.

---

## Testing (1)

### Tool-schema tests updated for simplified definitions

**Problem:** After the search tool input schemas were simplified, the automated tests that validated the structure of tool inputs still expected the older, more complex schema. These tests were checking for fields that no longer existed or formats that had changed, causing them to fail against the current codebase.

**Fix:** The tool-schema tests were updated to match the current simplified definitions. Tests now pass and correctly reflect the input structure that users interact with.

---

## Test Impact

| Metric | Before | After |
| ------ | ------ | ----- |
| `memory_search` results for known queries | 0 | 4-5 |
| `memory_context` results for known queries | 0 | 4-5 |
| Search channels contributing to output | 0 (all filtered before output) | Both vector + FTS5 |
| Tool-input-schema test suite | Failing (schema mismatch) | Passing |

The two base bug fixes were verified with three representative queries against the live 999-memory database: "semantic search" returned 4 results including the top CocoIndex memory, "SpecKit Phase System" returned 5 results including the top phase-system memory, and "compact code graph" returned 5 results. Both the semantic-similarity and exact-word-matching channels contributed candidates in all three cases. The Phase 5 review added updated tool-input-schema tests that now correctly reflect the current simplified tool definitions.

---

<details>
<summary>Technical Details: Files Changed (21 total)</summary>

### Source (20 files)

All paths relative to `.opencode/skill/system-spec-kit/mcp_server/`.

| File | Changes |
| ---- | ------- |
| `lib/governance/scope-governance.ts` | Changed access-scope enforcement from default-on to explicit opt-in via environment flag. |
| `handlers/memory-search.ts` | Removed default minimum-state filter and raised the search token budget. |
| `handlers/memory-context.ts` | Removed two hardcoded minimum-state filter values. |
| `dist/lib/governance/scope-governance.js` | Applied the same access-scope enforcement change in compiled output. |
| `dist/handlers/memory-search.js` | Applied the same minimum-state and token-budget changes in compiled output. |
| `dist/handlers/memory-context.js` | Applied the same minimum-state changes in compiled output. |
| `lib/search/hybrid-search.ts` | Added per-stage timing persistence so durations are stored, not just logged. |
| `lib/search/pipeline/stage1-candidate-gen.ts` | Relaxed candidate expansion gating and wired quality-score backfill into the read path. |
| `lib/search/pipeline/stage2-fusion.ts` | Added co-activation candidate injection into the fusion step. |
| `lib/search/pipeline/stage3-rerank.ts` | Split cross-encoder scoring to evaluate title and body separately; ensured MMR diversity pass runs when reranker is absent. |
| `lib/search/sqlite-fts.ts` | Added deprecated-tier exclusion filter to match the BM25 channel's behavior. |
| `lib/search/bm25-index.ts` | Aligned deprecated-tier exclusion clause with FTS5 channel; added compound-term phrase expansion for multi-word queries. |
| `lib/search/embedding-expansion.ts` | Relaxed the relevance threshold for neighbor expansion, allowing borderline candidates to enter the pool. |
| `lib/cache/embedding-cache.ts` | Added hit/miss counters and a `getCacheStats()` method. |
| `lib/cognitive/co-activation.ts` | Fixed related-memory identifier handling and corrected similarity scaling for co-activated entries. |
| `handlers/chunking-orchestrator.ts` | Added parent-ID propagation when writing chunk children. |
| `lib/validation/save-quality-gate.ts` | Added `computeBackfillQualityScore()` for un-scored memories. |
| `lib/architecture/layer-definitions.ts` | Updated token budget constant to match the new 2500-token limit. |
| `lib/feedback/shadow-evaluation-runtime.ts` | Removed minimum-state filter from background monitoring runs. |
| `../shared/algorithms/rrf-fusion.ts` | Lowered reciprocal rank fusion smoothing constant from 60 to 40 for a smaller corpus. |

### Tests (1 file)

| File | Changes |
| ---- | ------- |
| `tests/tool-input-schema.vitest.ts` | Updated assertions to match the current simplified tool input schema definitions. |

### Documentation (0 files)

No documentation files were modified in this phase.

</details>

---

## Upgrade

No migration required.

If a deployment intentionally relies on access-scope enforcement for multi-tenant isolation, enable it explicitly in the environment. Deployments that did not set this flag were already affected by the original breakage and will return to expected behavior after the fix.
