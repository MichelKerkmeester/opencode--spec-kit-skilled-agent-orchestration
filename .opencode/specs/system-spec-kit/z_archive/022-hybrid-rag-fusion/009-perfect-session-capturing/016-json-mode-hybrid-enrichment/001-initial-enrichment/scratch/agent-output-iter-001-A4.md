# Iteration 1: Domain E -- Hallucination & Error Prevention (Steps 5, 7, 8)

## Focus
Investigate where the generate-context.js pipeline injects, synthesizes, or derives content NOT present in the explicit JSON input (Q5/Q9), and identify what contamination categories are missing from the filter (Q5/Q10). Directed focus on contamination-filter.ts, session-extractor.ts, and workflow.ts.

## Findings

### Finding 1: The contamination filter has 29 patterns, not 74
The DEFAULT_DENYLIST in `contamination-filter.ts` contains exactly **29 labeled DenylistEntry objects**, distributed across 6 categories:
- **Orchestration chatter** (medium severity): 4 patterns -- "step-by-step orchestration", "analysis preamble", "progress narration", "step narration"
- **Preamble phrases** (low severity): 8 patterns -- "check preamble", "start-by preamble", "start preamble", "read preamble", "look-into preamble", "begin preamble", "proceed preamble", "handle preamble", "will-now preamble"
- **Orchestration headings/transitions** (medium/low): 5 patterns -- "analysis heading", "review heading", "transition phrase", "close-reading transition", "first-step narration", "now-step narration", "next-step narration"
- **AI self-referencing** (high severity): 3 patterns -- "As an AI", "As a language model", "As your assistant"
- **Filler phrases** (low severity): 3 patterns -- "Of course!", "Sure!", "Absolutely!"
- **Tool scaffolding** (high severity): 4 patterns -- tool usage narration, active form, preamble form, tool title with path
- **API/service error leakage** (high severity): 3 patterns -- API error prefix, JSON error payload, request ID leak

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:31-74]

### Finding 2: The "74 patterns" claim from the research prompt is inaccurate
The current codebase has 29 patterns. The number 74 may reference an earlier version, a planned target, or a miscount. This is important because Q10 asks about "missing categories from the 74-pattern filter" -- the baseline is actually 29.

[INFERENCE: based on full enumeration of DEFAULT_DENYLIST array entries in contamination-filter.ts]

### Finding 3: Seven categories of content synthesis NOT from JSON input
The pipeline derives/synthesizes content in these locations:

**3a. Context type detection (session-extractor.ts:119-134):** `detectContextType()` synthesizes a context type string (`'decision'`, `'discovery'`, `'research'`, `'implementation'`, `'general'`) from tool usage ratios. In JSON mode, tool counts are always 0, so unless the AI provides explicit `contextType`, this defaults to `'general'` (after the RC5 fix for decisionCount). The explicit contextType override was added at lines 557-562.
[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:119-134, 545-568]

**3b. Importance tier detection (session-extractor.ts:142-175):** `detectImportanceTier()` synthesizes an importance tier by scanning file path segments for keywords like 'architecture', 'core', 'schema', 'security', 'config'. This can OVERRIDE the actual importance of the session if files happen to be in directories named with these segments. The `resolveImportanceTier()` function respects explicit input if valid, but falls back to the heuristic.
[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:142-175]

**3c. Project phase detection (session-extractor.ts:188-207):** `detectProjectPhase()` synthesizes a phase string from tool ratios. In JSON mode, with tool counts at 0, it always returns `'RESEARCH'` regardless of the actual session phase. There is no explicit override mechanism for this field (unlike contextType and importanceTier).
[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:188-207]

**3d. Next action fallback (session-extractor.ts:289-297):** `extractNextAction()` returns `'Continue implementation'` as a hardcoded fallback when no pattern match is found in observations or recentContext. This synthesized default is misleading -- it implies implementation work when the session may have been research or planning.
[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:289-297]

**3e. Session status determination (collect-session-data.ts:338-399):** `determineSessionStatus()` synthesizes status from keyword matching on observation text. Uses broad regex patterns for completion (`done|complete|finished|successful`) and resolution (`resolved|fixed|unblocked`). Can hallucinate `'COMPLETED'` if any observation casually mentions "done" in a different context (e.g., "the done button").
[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:338-399]

**3f. Learning summary generation (collect-session-data.ts:279-332):** `generateLearningSummary()` synthesizes narrative text like "Highly productive learning session" from numeric score deltas. While the numbers come from input, the narrative phrasing is entirely invented.
[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:279-332]

**3g. Key topics extraction (session-extractor.ts:501-527):** `extractKeyTopics()` runs SemanticSignalExtractor on summary and decision text to derive topic terms. This transforms input text into derived tokens that may not preserve original meaning (e.g., splitting compound terms, aggressive stopword removal losing domain-specific terms).
[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:501-527]

### Finding 4: Missing contamination categories
Comparing the 29-pattern filter against real-world AI-generated session content, these categories are absent:

**4a. Hedging/qualification phrases:** "I believe", "I think", "It seems like", "It appears that", "If I understand correctly" -- these leak epistemic uncertainty into factual memory content.

**4b. Conversational acknowledgment:** "Great question!", "That's a good point", "Thank you for", "Happy to help" -- these conversational fillers pollute memory content.

**4c. Meta-commentary about the session:** "In this session we", "During our conversation", "As we discussed", "Earlier in this conversation" -- these temporal references are meaningless in stored memory.

**4d. Instruction echoing:** "As you requested", "Per your instructions", "Following your request", "You asked me to" -- these reference the conversation context that won't exist when the memory is retrieved.

**4e. Markdown formatting artifacts:** Excessive `**bold**` emphasis, `---` horizontal rules used as visual separators in chat, bullet points that are actually enumerated steps in chat flow.

**4f. Safety/disclaimer phrases:** "Please note that", "Keep in mind that", "It's important to note", "Be aware that", "Disclaimer:" -- these are AI-generated caveats that add no value in memory.

**4g. Redundant certainty markers:** "I can confirm that", "I've verified that", "After checking", "Upon investigation" -- these are process narration that doesn't belong in stored facts.

[INFERENCE: based on analysis of AI output patterns vs. contamination-filter.ts coverage, and typical content seen in generate-context.js outputs]

### Finding 5: Contamination filter only runs on observations and SUMMARY
In workflow.ts (lines 597-602), the pre-enrichment cleaning pass only applies to:
- `collectedData.observations` (title, narrative, facts)
- `collectedData.SUMMARY`

It does NOT clean:
- `sessionSummary` (the JSON-mode primary summary field, distinct from SUMMARY)
- `keyDecisions` (decision titles and rationales)
- `nextSteps` (continuation instructions)
- `blockers` (blocker text)
- `recentContext` (learning entries)
- `keyTopics` (if provided directly)
- `triggerPhrases` (if provided directly)

This means contamination in these fields passes through unfiltered to the final memory output.

[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:597-602]

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts` (full file, 200 lines)
- `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts` (full file, 611 lines)
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` (lines 1-400)
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` (lines 530-610, contamination area)

## Assessment
- New information ratio: 0.90
- Questions addressed: Q5 (Q9 + Q10 from dispatch)
- Questions answered: Q9 fully answered (7 synthesis points identified), Q10 partially answered (7 missing categories identified, but need to verify against real output samples)

## Reflection
- What worked and why: Direct source code reading of the contamination filter and session extractor was highly productive because the code is well-structured with clear function names and JSDoc comments, making the synthesis points easy to identify systematically.
- What did not work and why: The contamination-filter.ts file path given in the dispatch (`lib/contamination-filter.ts`) was wrong -- actual path is `extractors/contamination-filter.ts`. The Glob tool quickly resolved this.
- What I would do differently: For the next iteration on contamination, I would read the actual test file (`contamination-filter.vitest.ts`) to see what edge cases are tested and which missing categories have been considered but not implemented.

## Recommended Next Focus
Domain A (Pipeline Data Integrity): Trace field propagation through input-normalizer.ts and workflow.ts Steps 1-6 to identify silent field drops, mutation, and priority chain issues (Q1). This directly complements the Q5 findings by mapping HOW data moves through the pipeline, building on the synthesis points identified here.
