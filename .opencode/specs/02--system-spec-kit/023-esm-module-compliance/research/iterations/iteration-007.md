# Iteration 7: P1 Refinement Deep Dive -- Exact Code Locations and Concrete Fix Proposals

## Focus
Deep investigation of the 4 P1 refinement items identified in iteration 6. For each item: locate exact code, understand the current behavior, propose a concrete fix with effort estimate. Also identify the single highest-impact change and any quick wins.

## Findings

### P1-1: Trigger Matching -- Already Uses Regex Boundary Matching (CORRECTED)

**Prior understanding**: Auto-surface trigger matching uses exact substring matching.

**Corrected finding**: The trigger matcher at `lib/parsing/trigger-matcher.ts` is significantly more sophisticated than "exact substring". It uses:

1. **Unicode-aware word boundary regex** (line 203-218): `buildBoundaryRegex()` constructs a regex with Unicode character class boundaries: `(?:^|[^\p{L}\p{N}\p{M}])PHRASE(?:[^\p{L}\p{N}\p{M}]|$)` -- this is NOT naive substring; it respects word boundaries across all scripts.

2. **N-gram candidate index** (line 237-269): `extractTriggerIndexKeys()` builds a candidate index using unigrams and 2-3 grams, with stopword filtering. This pre-filters candidates before regex matching -- an optimization, not a limitation.

3. **CJK-aware fallback** (line 210-212): For CJK text without whitespace, it falls back to plain substring matching (correct behavior since CJK has no word boundaries).

4. **NFC Unicode normalization + case-folding** (line 466-484): `normalizeUnicode()` applies NFC normalization and locale-independent lowercasing.

**What IS missing**: There is no stemming (e.g., "implement" would not match "implementation"), no fuzzy matching (Levenshtein distance), and no semantic similarity. But the boundary regex is well above "exact substring".

**Revised assessment**: P1-1 is a P2 enhancement, not a P1 bug. The current matching is solid for exact phrase matching with proper word boundaries. Stemming would be the most impactful addition.

**Proposed fix (if desired)**: Add optional Porter stemmer to `normalizeUnicode()` that stems both trigger phrases and prompt tokens before boundary matching. Effort: ~2-3 hours (porter-stemmer npm package + integration into `buildBoundaryRegex`). Risk: False positives from aggressive stemming.

[SOURCE: mcp_server/lib/parsing/trigger-matcher.ts:82-86, 203-218, 237-269, 466-484, 622-692]

### P1-2: Constitutional Always-Surface -- Capped at Cache Level, Not at Injection

**Current behavior**: Constitutional memories are handled at two levels:
1. **Vector search level** (`vector-index-store.ts:944`): `includeConstitutional` defaults to true, which includes constitutional tier in vector results. For hybrid search, it's explicitly set to `false` (line 871) because "Handler manages constitutional separately".
2. **Handler level**: The handler injects constitutional results at the top of search results. The handler's `includeConstitutional` parameter defaults to `true` in the tool schema.
3. **Cache level** (`vector-index-store.ts:662-667`): Constitutional results use a dedicated LRU cache with TTL, preventing repeated DB queries.

**The concern**: There is no explicit count cap on constitutional results injected. If a user creates 50+ constitutional memories, ALL of them would be injected at the top of every search result, potentially consuming the entire token budget (~2000 tokens mentioned in the MCP tool description).

**Evidence of soft limit**: The tool description says "Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max)" -- this 2000 token budget is documented but not enforced in code. The actual limit is the total number of constitutional memories in the DB.

**Proposed fix**: Add a `MAX_CONSTITUTIONAL_INJECT` constant (default: 10) and a token budget check to the constitutional injection path. When constitutional results exceed the cap, sort by importance_weight descending and take top N. Effort: ~1-2 hours. Risk: Very low -- purely additive cap.

[SOURCE: mcp_server/lib/search/vector-index-store.ts:662-667, 939-944; mcp_server/lib/search/hybrid-search.ts:871]

### P1-3: Recency Boost -- Actually TWO Different Recency Systems (CLARIFIED)

There are **two distinct recency scoring systems** that prior iterations conflated:

1. **Folder-level recency** (`shared/scoring/folder-scoring.ts:137-159`): Uses inverse decay `1 / (1 + days * 0.10)`. This gives 0.59 at 7 days, 0.50 at 10 days, 0.25 at 30 days. This is used for **folder ranking** (folder_scores composite), weighted at 40% of the composite. This is NOT small -- it's the dominant signal in folder scoring.

2. **Memory-level recency in Stage 2**: The `computeRecencyScore` imported at `stage2-fusion.ts:80` is the SAME folder-scoring function re-used for individual memory recency. It applies the same decay formula but in the context of fusion scoring.

**The "0.1 recency boost" from iteration 5**: This referred to the `DECAY_RATE = 0.10` constant, NOT a "boost of 0.1 to score". The decay rate of 0.10 means scores halve every 10 days -- this is actually a strong recency signal. A document from today gets score 1.0; from yesterday gets 0.91; from a week ago gets 0.59.

**Real issue**: The recency score is computed per-memory but applied through the folder scoring composite (40% weight). At the individual search result level, recency does NOT directly boost individual result scores in Stage 2 -- it only contributes through folder-level scoring when folder scoring is active. If a user searches without folder context, individual result recency is NOT factored into ranking.

**Proposed fix**: Add a direct recency signal to Stage 2 fusion (after Step 6, before Step 7) that applies a small additive recency bonus to individual results based on their `updated_at` timestamp. Formula: `bonus = 0.05 * computeRecencyScore(row.updated_at)`. Effort: ~1-2 hours. This would give a recently-updated memory up to +0.05 score, which is meaningful but not overwhelming.

[SOURCE: shared/scoring/folder-scoring.ts:60-71, 137-159; mcp_server/lib/search/pipeline/stage2-fusion.ts:80]

### P1-4: Graph Cap/Weight Mismatch -- Confirmed, Two-Layer Cap Architecture

**Current values**:
- `GRAPH_WEIGHT_CAP = 0.05` (graph-calibration.ts:25) -- Maximum graph contribution in Stage 2
- `COMMUNITY_SCORE_CAP = 0.03` (graph-calibration.ts:28) -- Maximum community boost
- `n2aCap = 0.10` (DEFAULT_PROFILE, graph-calibration.ts:148) -- N2a RRF fusion overflow cap
- `n2bCap = 0.10` (DEFAULT_PROFILE, graph-calibration.ts:149) -- N2b RRF fusion overflow cap
- Adaptive fusion `graphWeight` ranges from 0.10 to 0.50 across intent profiles (iteration 5 finding)

**The mismatch**: The adaptive fusion system allocates up to 50% weight to graph signals for `find_decision` intent (graphWeight=0.50), but the calibration profile caps the actual graph contribution at 0.05. This means:
- For `find_decision`: graph gets 50% weight allocation but max 0.05 absolute contribution
- For `fix_bug`: graph gets 10% weight allocation, still capped at 0.05

The graph weight is effectively capped at a fixed absolute value regardless of how much the adaptive system allocates to it. This is by design (conservative rollout), but it means the adaptive weight profiles for graph are largely decorative for the `find_decision` intent.

**Calibration application** (`graph-calibration.ts:405-415`): `applyCalibrationProfile()` calls `calibrateGraphWeight()` which clamps all values to the profile caps. The profile is loaded from env vars with the default profile active.

**Stage 2 integration** (`stage2-fusion.ts:344-381`): The calibrated graph scores replace the original uncalibrated values, and the delta is tracked in `graphContribution`.

**Proposed fix**: Two options:
- **Option A (conservative)**: Raise `GRAPH_WEIGHT_CAP` from 0.05 to 0.15. This gives graph signals more room while still being bounded. Effort: 1 line change + regression testing (~1 hour).
- **Option B (proportional)**: Make the graph cap proportional to the adaptive graphWeight: `effectiveCap = Math.min(GRAPH_WEIGHT_CAP, graphWeight * 0.3)`. This means `find_decision` gets up to 0.15, while `fix_bug` gets up to 0.03. Effort: ~2 hours (requires passing intent context to calibration).

[SOURCE: mcp_server/lib/search/graph-calibration.ts:25-28, 145-160, 322-347, 405-415; mcp_server/lib/search/pipeline/stage2-fusion.ts:344-381]

### Finding 5: Highest-Impact Single Change -- Direct Recency Signal in Stage 2

The single highest-impact change for search quality would be **adding a direct recency signal to Stage 2 fusion** (P1-3 fix). Currently, a memory updated 5 minutes ago and a memory updated 6 months ago with identical semantic similarity get identical scores in the fusion pipeline (absent folder scoring context). Most users searching memory want recent context, and the session-based decay in folder scoring only helps when folder context is available.

**Quick wins identified**:
1. **Raise GRAPH_WEIGHT_CAP to 0.10** (P1-4 Option A): 1 line, 5 minutes, immediate improvement for graph-heavy queries
2. **Add MAX_CONSTITUTIONAL_INJECT = 15** (P1-2): ~20 lines, 30 minutes, prevents edge case token budget overflow
3. **Log a warning when constitutional count exceeds threshold** (P1-2 variant): ~5 lines, 5 minutes, visibility without behavioral change

### Finding 6: Additional Search Quality Issue Discovered -- Query Classifier Exact Match

The `hasTriggerMatch` function in `query-classifier.ts:82-86` uses **exact string equality** (after trimming and lowercasing) to classify query complexity. This is a completely different system from the trigger-matcher module:
- `trigger-matcher.ts`: Uses regex word boundary matching (sophisticated)
- `query-classifier.ts`: Uses `===` exact equality (brittle)

If a trigger phrase is "save context" and the user types "save context please", the trigger-matcher would match it (word boundary), but the query-classifier would NOT classify it as a trigger match (not exact). This inconsistency means the query complexity tier (simple/moderate/complex) may be misclassified when the user's query contains a trigger phrase embedded in a longer sentence.

**Impact**: Low-medium. Affects classification confidence ("high" confidence from trigger match is skipped), which influences routing decisions. Not a ranking bug but a classification inconsistency.

**Proposed fix**: Replace `hasTriggerMatch` in query-classifier.ts with a call to `matchPhraseWithBoundary` from trigger-matcher.ts, using the same word-boundary logic. Effort: ~30 minutes.

[SOURCE: mcp_server/lib/search/query-classifier.ts:82-86; mcp_server/lib/parsing/trigger-matcher.ts:488-495]

### Finding 7: Adaptive Fusion Weight Profiles -- Recency Not a Named Channel

Looking at the adaptive fusion weight profiles (iteration 5 finding confirmed), the four channels are: `vectorWeight`, `keywordWeight`, `graphWeight`, and a 4th intent-specific parameter. There is NO explicit `recencyWeight` channel. This confirms P1-3: recency is structurally absent from the fusion pipeline as a first-class scoring signal.

[SOURCE: stage2-fusion.ts:80; shared/scoring/folder-scoring.ts:60-65]

## Ruled Out
- Trigger matcher using naive substring: CORRECTED -- it uses sophisticated Unicode boundary regex with n-gram candidate indexing
- Recency boost being "0.1 additive": CORRECTED -- the 0.10 is a decay rate constant, not an additive boost; actual scores range 0.0-1.0

## Dead Ends
- None this iteration. All approaches were productive.

## Sources Consulted
- `mcp_server/lib/parsing/trigger-matcher.ts` (full file, 792 lines) -- trigger matching architecture
- `mcp_server/lib/search/query-classifier.ts:75-135` -- query complexity classification
- `mcp_server/lib/search/graph-calibration.ts` (full file, 552 lines) -- graph caps, profiles, calibration
- `mcp_server/lib/search/pipeline/stage2-fusion.ts:1-260, 344-381` -- fusion pipeline, recency import, graph integration
- `shared/scoring/folder-scoring.ts:1-178` -- recency scoring formula, constants, folder composite
- `mcp_server/lib/search/hybrid-search.ts:866-876, 1056-1064` -- constitutional injection points
- `mcp_server/lib/search/vector-index-store.ts:662-670, 939-949` -- constitutional cache, vector search options

## Assessment
- New information ratio: 0.79
- Questions addressed: P1-1 (trigger matching), P1-2 (constitutional capping), P1-3 (recency boost), P1-4 (graph cap mismatch), additional quality issues, highest-impact change, quick wins
- Questions answered: All 4 P1 items investigated with exact code locations and concrete fix proposals. P1-1 downgraded to P2 (existing implementation is better than described). 1 new issue discovered (query-classifier inconsistency).

## Reflection
- What worked and why: Reading the full trigger-matcher.ts file (792 lines) was essential -- it revealed the implementation is far more sophisticated than the summary from iteration 4 suggested. Grep for specific constants (GRAPH_WEIGHT_CAP, DECAY_RATE) across the shared/ directory quickly located the canonical definitions.
- What did not work and why: N/A -- all approaches were productive this iteration.
- What I would do differently: In iteration 4, I should have read the full trigger-matcher file instead of summarizing from grep snippets. The "naive keyword matching" finding was an oversimplification that this iteration corrected.

## Recommended Next Focus
The research is now comprehensive with all 10 key questions answered and all P1 items investigated in depth. Two prior findings were corrected (P1-1 trigger matching, P1-3 recency interpretation). The prioritized backlog is:

**Revised Priority List**:
- P1-A (was P1-3): Add direct recency signal to Stage 2 fusion (~2 hours, highest impact)
- P1-B (was P1-4): Raise GRAPH_WEIGHT_CAP or make proportional (~1-2 hours)
- P1-C (was P1-2): Add constitutional injection count cap (~1 hour)
- P2-A (was P1-1): Add optional stemming to trigger matcher (~3 hours, lower priority since current matching is solid)
- P2-B (new): Fix query-classifier hasTriggerMatch inconsistency (~30 min)

Recommend convergence: proceed to synthesis of final research output.
