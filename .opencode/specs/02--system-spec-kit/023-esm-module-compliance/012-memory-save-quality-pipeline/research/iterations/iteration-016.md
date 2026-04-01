# Iteration 16: Trigger Phrase Extraction Pipeline End-to-End Analysis

## Focus
Analyze the complete trigger phrase extraction pipeline for JSON-mode saves: from sessionSummary text input through SemanticSignalExtractor to the final filtered trigger phrases in the memory file frontmatter. Design an NLP strategy for extracting meaningful phrases, quality filtering to avoid bigram fragments, and dedup strategy.

## Findings

### Finding 1: The pipeline has 5 stages with 3 quality gates

The trigger phrase pipeline flows through these stages:

1. **Source assembly** (workflow.ts lines 1178-1197): Builds `triggerSourceParts` from SUMMARY, decision fields (TITLE, RATIONALE, CONTEXT, CHOSEN), file DESCRIPTIONS, and spec folder name tokens.

2. **Auto-extraction** (trigger-extractor.ts -> SemanticSignalExtractor): Calls `extractTriggerPhrases(triggerSource)` which delegates to `SemanticSignalExtractor.extractTriggerPhrases()`. This runs: markdown removal -> tokenization -> stopword filtering (balanced profile) -> n-gram scoring (up to bigrams) -> category extraction (problem/technical/decision/action/compound terms) -> deduplication -> tech stopword filter -> top-N selection.

3. **Manual merge** (workflow.ts lines 1203-1233): Prepends `_manualTriggerPhrases` from JSON payload, deduplicating case-insensitively.

4. **Quality filter** (workflow.ts lines 120-157 `filterTriggerPhrases`): Three-stage filter:
   - Stage 1: Remove path separators and leading number prefixes
   - Stage 2: Remove entries where every word is under 3 chars (unless in TRIGGER_ALLOW_LIST)
   - Stage 3: Remove n-gram shingle phrases that are substrings of longer retained phrases

5. **Minimum phrase guarantee** (workflow.ts line 1263 `ensureMinTriggerPhrases`): Fills up to minimum count from file names and spec folder tokens. Also adds individual folder name tokens that pass the FOLDER_STOPWORDS gate (lines 1242-1261).

[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1174-1264]
[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/trigger-extractor.ts:21-27]
[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:219-258]

### Finding 2: The JSON-mode trigger extraction problem

For JSON-mode saves, the `sessionSummary` is the primary (often only) semantic text source. Unlike transcript-mode where user prompts and observations generate rich text, JSON-mode provides a single summary paragraph. This causes two problems:

**(a) Low token count after stopword removal**: A typical 2-3 sentence summary yields 20-40 tokens. After balanced-profile stopword removal, this drops to 10-20 filtered tokens. With the SemanticSignalExtractor's `MIN_WORD_LENGTH` check (line 227), short summaries may produce zero trigger phrases.

**(b) Category extractors find few matches**: The category extractors (problem terms, technical terms, decision terms, action terms, compound nouns) use regex patterns designed for conversational text. A structured summary like "Implemented ESM module compliance for the MCP server shared packages" yields few category matches because it lacks the conversational markers ("error in", "bug with", "decided to", "need to fix").

The result: trigger phrases fall back entirely to n-gram scoring, which produces generic bigrams like "module compliance" or "mcp server" that may not be distinctive enough for retrieval.

[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:219-258]
[INFERENCE: based on stopword set analysis and category regex patterns in shared/trigger-extractor.ts]

### Finding 3: NLP strategy for structured text trigger extraction

**Proposed approach: Augmented source text construction**

Rather than changing the SemanticSignalExtractor itself (which is shared infrastructure), the fix should enrich the `triggerSourceParts` assembled in workflow.ts. For JSON-mode saves specifically:

1. **Key decisions as trigger source** (already done, lines 1182-1187): Decision TITLE, RATIONALE, CONTEXT, CHOSEN are already added. No change needed.

2. **Observations as trigger source** (currently missing): Add observation titles and narratives to `triggerSourceParts`. These are high-value semantic signals from the AI's own classification. Add after line 1187:
   ```typescript
   (collectedData?.observations || []).forEach(obs => {
     if (obs.title) triggerSourceParts.push(obs.title);
     if (obs.narrative && obs.narrative.length > 20) triggerSourceParts.push(obs.narrative);
   });
   ```

3. **Key topics as trigger source** (currently missing): The `extractKeyTopics()` function (session-extractor.ts line 535) already produces high-quality topic terms from the summary. These should be added as explicit trigger source text, but this creates a circular dependency (topics extracted from the same text). Instead, pass the already-extracted `keyTopicsInitial` array as additional phrases. Add after auto-extraction:
   ```typescript
   for (const topic of keyTopicsInitial) {
     const lowered = topic.toLowerCase();
     if (!seenMergedTriggers.has(lowered)) {
       mergedTriggers.push(topic);
       seenMergedTriggers.add(lowered);
     }
   }
   ```

4. **Explicit sessionSummary noun phrase extraction**: For JSON-mode, parse `sessionSummary` for capitalized noun phrases and technical compound nouns before passing to the general extractor. A lightweight heuristic:
   ```typescript
   // Extract capitalized sequences (proper nouns, acronyms)
   const capitalizedPhrases = sessionSummary.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g) || [];
   // Extract hyphenated compounds
   const hyphenated = sessionSummary.match(/\b\w+-\w+(?:-\w+)*\b/g) || [];
   triggerSourceParts.push(...capitalizedPhrases, ...hyphenated);
   ```

Estimated LOC: ~25 lines in workflow.ts.

[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1178-1199]
[INFERENCE: based on analysis of existing triggerSourceParts construction and JSON-mode data availability]

### Finding 4: Quality filtering to avoid bigram fragments

The current `filterTriggerPhrases()` function (workflow.ts lines 120-157) handles three cases but misses several bigram quality problems:

**(a) Generic bigrams that pass current filters**: Phrases like "module compliance", "server packages", "implementation plan" are technically valid bigrams but are too generic to be useful trigger phrases. They match too many memories.

**(b) Proposed additional quality stage -- Semantic specificity filter**:

Add a Stage 4 to `filterTriggerPhrases`:
```typescript
// Stage 4: Remove bigrams where both words are in FOLDER_STOPWORDS (too generic)
filtered = filtered.filter(p => {
  const words = p.trim().split(/\s+/);
  if (words.length === 2) {
    // If both words are generic domain terms, reject
    if (words.every(w => FOLDER_STOPWORDS.has(w.toLowerCase()))) {
      return false;
    }
  }
  return true;
});
```

**(c) Proposed minimum phrase length**: Add a minimum character length of 5 for single-word phrases (beyond the existing 3-char check). This prevents nonsensical tokens like "esm" passing as trigger phrases while allowing legitimate acronyms via the TRIGGER_ALLOW_LIST.

**(d) Maximum phrase count cap**: The current pipeline has no explicit cap after the filter stages. The SemanticSignalExtractor's `MAX_PHRASE_COUNT` limits auto-extracted phrases, but manual phrases and folder tokens can push the total higher. Add a cap of 15 total trigger phrases, preferring manual > auto-extracted > folder-derived.

Estimated LOC: ~15 lines added to `filterTriggerPhrases`.

[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:120-157]
[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1242-1261]

### Finding 5: Dedup strategy analysis

The current dedup operates at two levels:

1. **Case-insensitive exact match** (workflow.ts lines 1215-1231): Uses `seenMergedTriggers` Set with lowered keys. This catches exact duplicates like "MCP Server" vs "mcp server".

2. **Substring elimination** (filterTriggerPhrases Stage 3, lines 143-155): Removes shorter phrases that are substrings of longer retained phrases. This catches "mcp" being a substring of "mcp server".

**Missing dedup: Semantic near-duplicates**. The pipeline does not catch:
- "esm compliance" vs "esm module compliance" (the shorter is a non-contiguous subset)
- "quality pipeline" vs "memory save quality pipeline" (subset words)
- "trigger phrase" vs "trigger phrases" (singular/plural)

**Proposed dedup additions**:

1. **Plural normalization**: Before the `seenMergedTriggers` check, normalize trailing 's'/'es' for comparison:
   ```typescript
   const normalizedForDedup = lowered.replace(/(?:es|s)$/, '');
   ```
   This is lightweight and handles the most common English plurals without a full stemmer.

2. **Word-set containment**: After collecting all phrases, check if any phrase's word set is a strict subset of another's:
   ```typescript
   const wordSets = filtered.map(p => new Set(p.toLowerCase().split(/\s+/)));
   filtered = filtered.filter((p, idx) => {
     const thisSet = wordSets[idx];
     for (let j = 0; j < wordSets.length; j++) {
       if (j !== idx && wordSets[j].size > thisSet.size) {
         const isSubset = [...thisSet].every(w => wordSets[j].has(w));
         if (isSubset) return false;
       }
     }
     return true;
   });
   ```

Estimated LOC: ~20 lines.

[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1200-1237]
[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:143-155]

## Ruled Out
- **Replacing SemanticSignalExtractor with a custom NLP pipeline**: The SSE is shared infrastructure used by topic extraction, trigger extraction, and summary generation. Modifying it would have broad impact. Better to enrich the input text and add post-processing filters.
- **Using an external NLP library (e.g., compromise.js)**: Adds a dependency for a marginal improvement over the heuristic approach. The existing tokenizer + stopword system is sufficient when given better input text.

## Dead Ends
- **Full stemming/lemmatization for dedup**: Requires a stemmer library (Porter, Snowball) which adds complexity. The plural normalization heuristic covers the most common case with zero dependencies.

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` (lines 110-157, 1174-1268)
- `.opencode/skill/system-spec-kit/scripts/lib/trigger-extractor.ts` (full file, 65 lines)
- `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts` (lines 1-350, extraction engine)
- `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts` (lines 535-561, extractKeyTopics)

## Assessment
- New information ratio: 1.0
- Questions addressed: ["What is the optimal trigger phrase extraction strategy for structured JSON input?"]
- Questions answered: ["What is the optimal trigger phrase extraction strategy for structured JSON input?"]

## Reflection
- What worked and why: Tracing the full pipeline from source assembly through extraction, merge, filter, and minimum-guarantee stages revealed exactly where each quality problem originates. The 5-stage model made it clear that fixes belong at stages 1 (source enrichment) and 4 (quality filtering), not at the core extraction engine.
- What did not work and why: N/A -- the pipeline was well-structured and readable.
- What I would do differently: For the implementation phase, create a test fixture with 5 representative JSON payloads (minimal, moderate, rich, edge-case empty, edge-case long) and verify the trigger phrase output at each pipeline stage to measure improvement.

## Recommended Next Focus
Integration analysis: map how the decision de-duplication fix and trigger phrase improvements interact with the quality scorer dimensions.
