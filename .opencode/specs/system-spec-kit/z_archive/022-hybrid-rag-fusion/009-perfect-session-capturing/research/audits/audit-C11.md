OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019ccec9-a6ac-72d3-a55e-3c81e5bfdaec
--------
user
You are a code auditor. Read EVERY LINE of /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts (400 lines).

This file extracts architectural decisions from conversation text.

Audit specifically:
1. DECISION CUE REGEX: What patterns trigger decision detection? Are they comprehensive? False positives?
2. SENTENCE EXTRACTION: How are decision sentences extracted from surrounding text? Boundary detection?
3. OPTION/RATIONALE PARSING: How are options and rationales identified? Accuracy?
4. CONFIDENCE SCORING: Is the confidence score hardcoded (e.g., always 75)? Should it be computed?
5. DEDUP: Can the same decision be extracted multiple times? How are duplicates handled?
6. CONTEXT: How much surrounding context is captured with each decision?

Report every issue, no matter how small. 

OUTPUT FORMAT — repeat this block for EACH finding:

### FINDING-[NN]: [Title]
- **File:** [path:lines]
- **Severity:** CRITICAL / HIGH / MEDIUM / LOW
- **Category:** BUG / QUALITY / PERFORMANCE / SECURITY / DESIGN
- **Current Behavior:** [what happens now]
- **Expected Behavior:** [what should happen]
- **Root Cause:** [why it is wrong]
- **Suggested Fix:** [concrete code change or pseudocode]
- **Effort:** TRIVIAL (<5 min) / SMALL (<30 min) / MEDIUM (<2 hr) / LARGE (>2 hr)

End with:

### SUMMARY
- Total findings: [N]
- Critical: [N], High: [N], Medium: [N], Low: [N]
- Top 3 recommendations: [...]

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents or spawn child tasks. Complete ALL work with direct tool calls only.
Depth: 1
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: code_mode starting
mcp: sequential_thinking starting
mcp: spec_kit_memory starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m going to do a full line-by-line audit of that `decision-extractor.ts` file now, focusing on the six areas you listed, then I’ll return a findings-first report in your exact format. I’ll start by reading the entire file with line numbers so each finding can point to precise locations.
exec
/bin/zsh -lc "wc -l '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts' && nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     400 /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts
     1	// ---------------------------------------------------------------
     2	// MODULE: Decision Extractor
     3	// ---------------------------------------------------------------
     4	// Extracts decision records with options, rationale, confidence, and decision trees
     5	
     6	import { formatTimestamp } from '../utils/message-utils';
     7	import { validateDataStructure } from '../utils/data-validator';
     8	import { generateAnchorId, validateAnchorUniqueness, extractSpecNumber } from '../lib/anchor-generator';
     9	import { generateDecisionTree } from '../lib/decision-tree-generator';
    10	import type { DecisionNode } from '../lib/decision-tree-generator';
    11	import * as simFactory from '../lib/simulation-factory';
    12	import type { DecisionOption, DecisionRecord, DecisionData } from '../types/session-types';
    13	
    14	// Re-export canonical types for backward compatibility
    15	export type { DecisionOption, DecisionRecord, DecisionData };
    16	
    17	/* -----------------------------------------------------------------
    18	   1. INTERFACES
    19	------------------------------------------------------------------*/
codex
### FINDING-01: Overly Broad Cue `we'll` Causes Frequent False Positives
- **File:** [decision-extractor.ts#L36](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L36)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** Any sentence containing `we'll` can be treated as a decision cue.
- **Expected Behavior:** Only explicit decision language should trigger decision extraction.
- **Root Cause:** `DECISION_CUE_REGEX` includes a generic future-tense token.
- **Suggested Fix:** Remove `we'll` or gate it behind decision verbs (e.g., `/we'll\s+(use|adopt|choose|go with)/i`).
- **Effort:** TRIVIAL (<5 min)

### FINDING-02: Cue Regex Lacks Word Boundaries
- **File:** [decision-extractor.ts#L36](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L36)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** Substring matches can trigger (e.g., `selectedIndex`, `adoption`).
- **Expected Behavior:** Match complete lexical cues only.
- **Root Cause:** No `\b` boundaries around cue terms.
- **Suggested Fix:** Use `\b(decided|chose|...|adopt)\b`.
- **Effort:** TRIVIAL (<5 min)

### FINDING-03: No Negation Handling in Decision Cue Detection
- **File:** [decision-extractor.ts#L36](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L36)
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Phrases like `not decided yet` still trigger extraction.
- **Expected Behavior:** Negated/uncertain statements should not be treated as finalized decisions.
- **Root Cause:** Cue detection checks only token presence, not polarity.
- **Suggested Fix:** Add negation filter (e.g., skip when `\b(not|haven't|unsure|pending)\b` near cue).
- **Effort:** SMALL (<30 min)

### FINDING-04: Decision Cue Vocabulary Is Incomplete
- **File:** [decision-extractor.ts#L36](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L36)
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Common forms like `choose`, `chosen`, `opted`, `settled on`, `approved`, `finalized` are missed.
- **Expected Behavior:** Broader high-precision cue coverage.
- **Root Cause:** Narrow hardcoded cue list.
- **Suggested Fix:** Expand pattern list and keep it centralized/configurable.
- **Effort:** SMALL (<30 min)

### FINDING-05: Only First Cue in Text Is Processed
- **File:** [decision-extractor.ts#L43](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L43)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** `text.match(...)` captures only first cue; additional decisions in same text are ignored.
- **Expected Behavior:** All cue occurrences should be considered.
- **Root Cause:** Single-match extraction flow.
- **Suggested Fix:** Iterate with global regex (`matchAll`) and extract per cue.
- **Effort:** MEDIUM (<2 hr)

### FINDING-06: Sentence Boundary Detection Ignores Newlines/Bullets
- **File:** [decision-extractor.ts#L52](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L52)
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Uses only `. ! ?` to find sentence start/end.
- **Expected Behavior:** Respect markdown bullets, line breaks, and list boundaries.
- **Root Cause:** Boundary logic is punctuation-only.
- **Suggested Fix:** Split with sentence tokenizer or include newline/list delimiters in boundary logic.
- **Effort:** MEDIUM (<2 hr)

### FINDING-07: End-of-Sentence Detection Breaks on Abbreviations/Decimals
- **File:** [decision-extractor.ts#L53](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L53)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Stops at first punctuation after cue, including `e.g.` or version numbers.
- **Expected Behavior:** More robust sentence end detection.
- **Root Cause:** Naive first punctuation match.
- **Suggested Fix:** Use a sentence segmenter or smarter punctuation heuristics.
- **Effort:** MEDIUM (<2 hr)

### FINDING-08: Hard 200-Character Truncation Loses Key Context
- **File:** [decision-extractor.ts#L63](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L63)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** Extracted sentence is always clipped to 200 chars.
- **Expected Behavior:** Preserve full sentence or controlled configurable limit.
- **Root Cause:** Hardcoded slice.
- **Suggested Fix:** Remove truncation or make it config-driven and applied after semantic parsing.
- **Effort:** TRIVIAL (<5 min)

### FINDING-09: Option Detection Is Case-Sensitive and Narrow
- **File:** [decision-extractor.ts#L209](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L209)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** Only `Option`/`Alternative` exact casing are recognized.
- **Expected Behavior:** Detect `option`, `OPTION`, `alt`, etc.
- **Root Cause:** `includes()` with case-sensitive literals.
- **Suggested Fix:** Normalize with `toLowerCase()` and use regex variants.
- **Effort:** TRIVIAL (<5 min)

### FINDING-10: Options Are Ignored Unless in `facts`
- **File:** [decision-extractor.ts#L209](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L209)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** Options present in narrative are not parsed.
- **Expected Behavior:** Parse options from both `facts` and narrative text.
- **Root Cause:** Option parsing pipeline is facts-only.
- **Suggested Fix:** Add narrative option extraction fallback before creating implied option.
- **Effort:** MEDIUM (<2 hr)

### FINDING-11: `CHOSEN` Extraction Is Fragile and Fallback Is Incorrectly Generic
- **File:** [decision-extractor.ts#L252](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L252), [decision-extractor.ts#L253](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L253)
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** If regex misses, `CHOSEN` becomes label (`Chosen Approach`) instead of actual chosen content.
- **Expected Behavior:** `CHOSEN` should identify concrete selected option/description.
- **Root Cause:** Narrow regex verbs and poor fallback target (`OPTIONS[0].LABEL`).
- **Suggested Fix:** Expand cue verbs and fallback to `OPTIONS[0].DESCRIPTION` (or resolved option ID).
- **Effort:** SMALL (<30 min)

### FINDING-12: Rationale Parsing Is Over-Simplified and Boundary-Unsafe
- **File:** [decision-extractor.ts#L255](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L255)
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Matches first `because|rationale|reason`, then cuts at first period/newline.
- **Expected Behavior:** Capture complete rationale segments and avoid partial/accidental matches.
- **Root Cause:** Single regex with no word-boundary around all terms and short stop condition.
- **Suggested Fix:** Use bounded patterns (`\b`) and multi-clause extraction (e.g., up to sentence end with abbreviation handling).
- **Effort:** MEDIUM (<2 hr)

### FINDING-13: Confidence Defaults Are Hardcoded (80/75) Instead of Derived
- **File:** [decision-extractor.ts#L168](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L168), [decision-extractor.ts#L259](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L259)
- **Severity:** HIGH
- **Category:** DESIGN
- **Current Behavior:** Manual decisions always `80`; non-explicit auto decisions default to `75`.
- **Expected Behavior:** Confidence should be computed from extraction signals.
- **Root Cause:** Static fallback constants with no scoring model.
- **Suggested Fix:** Compute confidence from features (explicit cue, chosen parsed, rationale parsed, options count, evidence presence, source type).
- **Effort:** MEDIUM (<2 hr)

### FINDING-14: Parsed Confidence Is Not Validated/Clamped
- **File:** [decision-extractor.ts#L258](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L258)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** `confidence: 999` is accepted as-is.
- **Expected Behavior:** Confidence should be constrained to 0-100.
- **Root Cause:** `parseInt` result used directly.
- **Suggested Fix:** `CONFIDENCE = Math.max(0, Math.min(100, parsed))`.
- **Effort:** TRIVIAL (<5 min)

### FINDING-15: No Semantic Deduplication of Decisions
- **File:** [decision-extractor.ts#L205](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L205)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** Repeated observations/prompts produce duplicate decision records.
- **Expected Behavior:** Same decision should be merged or dropped.
- **Root Cause:** Straight `map` over observations without normalization/hash/similarity pass.
- **Suggested Fix:** Dedup by normalized `(title + chosen + rationale)` hash or similarity threshold.
- **Effort:** MEDIUM (<2 hr)

### FINDING-16: Lexical Extraction Is Disabled If Any `type=decision` Observation Exists
- **File:** [decision-extractor.ts#L197](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L197), [decision-extractor.ts#L201](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L201)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** Presence of one explicit decision observation blocks lexical extraction entirely.
- **Expected Behavior:** Merge both sources, then dedup.
- **Root Cause:** Binary source selection logic.
- **Suggested Fix:** Combine `decisionObservations + lexicalDecisionObservations`, then deduplicate.
- **Effort:** SMALL (<30 min)

### FINDING-17: Manual Decision `CONTEXT` Drops Surrounding Context
- **File:** [decision-extractor.ts#L139](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L139), [decision-extractor.ts#L159](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L159)
- **Severity:** HIGH
- **Category:** QUALITY
- **Current Behavior:** Manual context is derived from title/rationale split, not full source decision text/context.
- **Expected Behavior:** Keep full original decision context and parsed summary separately.
- **Root Cause:** `CONTEXT` is set to parsed `rationale` from simplistic dash split.
- **Suggested Fix:** Store raw decision text in `CONTEXT`; keep parsed rationale in `RATIONALE`.
- **Effort:** SMALL (<30 min)

### FINDING-18: Lexical Decision Metadata Uses Synthetic Timestamp and Minimal Facts
- **File:** [decision-extractor.ts#L91](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L91), [decision-extractor.ts#L92](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L92)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Lexical candidates use extraction-time timestamp and only `Source: ... lexical cue`.
- **Expected Behavior:** Preserve source message timestamp and richer provenance (message id/index/original text pointer).
- **Root Cause:** Candidate builder does not carry source metadata.
- **Suggested Fix:** Pass through source timestamp/index and include raw snippet reference in `facts`.
- **Effort:** SMALL (<30 min)

### SUMMARY
- Total findings: 18
- Critical: 0, High: 3, Medium: 13, Low: 2
- Top 3 recommendations:  
1. Replace hardcoded regex-only extraction with a two-pass parser (cue detection + structured sentence segmentation with negation handling).  
2. Implement computed confidence scoring with bounded 0-100 output based on extraction evidence.  
3. Merge multi-source observations and add semantic deduplication before final decision record creation.
tokens used
24,650
### FINDING-01: Overly Broad Cue `we'll` Causes Frequent False Positives
- **File:** [decision-extractor.ts#L36](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L36)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** Any sentence containing `we'll` can be treated as a decision cue.
- **Expected Behavior:** Only explicit decision language should trigger decision extraction.
- **Root Cause:** `DECISION_CUE_REGEX` includes a generic future-tense token.
- **Suggested Fix:** Remove `we'll` or gate it behind decision verbs (e.g., `/we'll\s+(use|adopt|choose|go with)/i`).
- **Effort:** TRIVIAL (<5 min)

### FINDING-02: Cue Regex Lacks Word Boundaries
- **File:** [decision-extractor.ts#L36](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L36)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** Substring matches can trigger (e.g., `selectedIndex`, `adoption`).
- **Expected Behavior:** Match complete lexical cues only.
- **Root Cause:** No `\b` boundaries around cue terms.
- **Suggested Fix:** Use `\b(decided|chose|...|adopt)\b`.
- **Effort:** TRIVIAL (<5 min)

### FINDING-03: No Negation Handling in Decision Cue Detection
- **File:** [decision-extractor.ts#L36](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L36)
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Phrases like `not decided yet` still trigger extraction.
- **Expected Behavior:** Negated/uncertain statements should not be treated as finalized decisions.
- **Root Cause:** Cue detection checks only token presence, not polarity.
- **Suggested Fix:** Add negation filter (e.g., skip when `\b(not|haven't|unsure|pending)\b` near cue).
- **Effort:** SMALL (<30 min)

### FINDING-04: Decision Cue Vocabulary Is Incomplete
- **File:** [decision-extractor.ts#L36](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L36)
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Common forms like `choose`, `chosen`, `opted`, `settled on`, `approved`, `finalized` are missed.
- **Expected Behavior:** Broader high-precision cue coverage.
- **Root Cause:** Narrow hardcoded cue list.
- **Suggested Fix:** Expand pattern list and keep it centralized/configurable.
- **Effort:** SMALL (<30 min)

### FINDING-05: Only First Cue in Text Is Processed
- **File:** [decision-extractor.ts#L43](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L43)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** `text.match(...)` captures only first cue; additional decisions in same text are ignored.
- **Expected Behavior:** All cue occurrences should be considered.
- **Root Cause:** Single-match extraction flow.
- **Suggested Fix:** Iterate with global regex (`matchAll`) and extract per cue.
- **Effort:** MEDIUM (<2 hr)

### FINDING-06: Sentence Boundary Detection Ignores Newlines/Bullets
- **File:** [decision-extractor.ts#L52](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L52)
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Uses only `. ! ?` to find sentence start/end.
- **Expected Behavior:** Respect markdown bullets, line breaks, and list boundaries.
- **Root Cause:** Boundary logic is punctuation-only.
- **Suggested Fix:** Split with sentence tokenizer or include newline/list delimiters in boundary logic.
- **Effort:** MEDIUM (<2 hr)

### FINDING-07: End-of-Sentence Detection Breaks on Abbreviations/Decimals
- **File:** [decision-extractor.ts#L53](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L53)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Stops at first punctuation after cue, including `e.g.` or version numbers.
- **Expected Behavior:** More robust sentence end detection.
- **Root Cause:** Naive first punctuation match.
- **Suggested Fix:** Use a sentence segmenter or smarter punctuation heuristics.
- **Effort:** MEDIUM (<2 hr)

### FINDING-08: Hard 200-Character Truncation Loses Key Context
- **File:** [decision-extractor.ts#L63](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L63)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** Extracted sentence is always clipped to 200 chars.
- **Expected Behavior:** Preserve full sentence or controlled configurable limit.
- **Root Cause:** Hardcoded slice.
- **Suggested Fix:** Remove truncation or make it config-driven and applied after semantic parsing.
- **Effort:** TRIVIAL (<5 min)

### FINDING-09: Option Detection Is Case-Sensitive and Narrow
- **File:** [decision-extractor.ts#L209](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L209)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** Only `Option`/`Alternative` exact casing are recognized.
- **Expected Behavior:** Detect `option`, `OPTION`, `alt`, etc.
- **Root Cause:** `includes()` with case-sensitive literals.
- **Suggested Fix:** Normalize with `toLowerCase()` and use regex variants.
- **Effort:** TRIVIAL (<5 min)

### FINDING-10: Options Are Ignored Unless in `facts`
- **File:** [decision-extractor.ts#L209](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L209)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** Options present in narrative are not parsed.
- **Expected Behavior:** Parse options from both `facts` and narrative text.
- **Root Cause:** Option parsing pipeline is facts-only.
- **Suggested Fix:** Add narrative option extraction fallback before creating implied option.
- **Effort:** MEDIUM (<2 hr)

### FINDING-11: `CHOSEN` Extraction Is Fragile and Fallback Is Incorrectly Generic
- **File:** [decision-extractor.ts#L252](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L252), [decision-extractor.ts#L253](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L253)
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** If regex misses, `CHOSEN` becomes label (`Chosen Approach`) instead of actual chosen content.
- **Expected Behavior:** `CHOSEN` should identify concrete selected option/description.
- **Root Cause:** Narrow regex verbs and poor fallback target (`OPTIONS[0].LABEL`).
- **Suggested Fix:** Expand cue verbs and fallback to `OPTIONS[0].DESCRIPTION` (or resolved option ID).
- **Effort:** SMALL (<30 min)

### FINDING-12: Rationale Parsing Is Over-Simplified and Boundary-Unsafe
- **File:** [decision-extractor.ts#L255](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L255)
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Matches first `because|rationale|reason`, then cuts at first period/newline.
- **Expected Behavior:** Capture complete rationale segments and avoid partial/accidental matches.
- **Root Cause:** Single regex with no word-boundary around all terms and short stop condition.
- **Suggested Fix:** Use bounded patterns (`\b`) and multi-clause extraction (e.g., up to sentence end with abbreviation handling).
- **Effort:** MEDIUM (<2 hr)

### FINDING-13: Confidence Defaults Are Hardcoded (80/75) Instead of Derived
- **File:** [decision-extractor.ts#L168](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L168), [decision-extractor.ts#L259](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L259)
- **Severity:** HIGH
- **Category:** DESIGN
- **Current Behavior:** Manual decisions always `80`; non-explicit auto decisions default to `75`.
- **Expected Behavior:** Confidence should be computed from extraction signals.
- **Root Cause:** Static fallback constants with no scoring model.
- **Suggested Fix:** Compute confidence from features (explicit cue, chosen parsed, rationale parsed, options count, evidence presence, source type).
- **Effort:** MEDIUM (<2 hr)

### FINDING-14: Parsed Confidence Is Not Validated/Clamped
- **File:** [decision-extractor.ts#L258](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L258)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** `confidence: 999` is accepted as-is.
- **Expected Behavior:** Confidence should be constrained to 0-100.
- **Root Cause:** `parseInt` result used directly.
- **Suggested Fix:** `CONFIDENCE = Math.max(0, Math.min(100, parsed))`.
- **Effort:** TRIVIAL (<5 min)

### FINDING-15: No Semantic Deduplication of Decisions
- **File:** [decision-extractor.ts#L205](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L205)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** Repeated observations/prompts produce duplicate decision records.
- **Expected Behavior:** Same decision should be merged or dropped.
- **Root Cause:** Straight `map` over observations without normalization/hash/similarity pass.
- **Suggested Fix:** Dedup by normalized `(title + chosen + rationale)` hash or similarity threshold.
- **Effort:** MEDIUM (<2 hr)

### FINDING-16: Lexical Extraction Is Disabled If Any `type=decision` Observation Exists
- **File:** [decision-extractor.ts#L197](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L197), [decision-extractor.ts#L201](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L201)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** Presence of one explicit decision observation blocks lexical extraction entirely.
- **Expected Behavior:** Merge both sources, then dedup.
- **Root Cause:** Binary source selection logic.
- **Suggested Fix:** Combine `decisionObservations + lexicalDecisionObservations`, then deduplicate.
- **Effort:** SMALL (<30 min)

### FINDING-17: Manual Decision `CONTEXT` Drops Surrounding Context
- **File:** [decision-extractor.ts#L139](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L139), [decision-extractor.ts#L159](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L159)
- **Severity:** HIGH
- **Category:** QUALITY
- **Current Behavior:** Manual context is derived from title/rationale split, not full source decision text/context.
- **Expected Behavior:** Keep full original decision context and parsed summary separately.
- **Root Cause:** `CONTEXT` is set to parsed `rationale` from simplistic dash split.
- **Suggested Fix:** Store raw decision text in `CONTEXT`; keep parsed rationale in `RATIONALE`.
- **Effort:** SMALL (<30 min)

### FINDING-18: Lexical Decision Metadata Uses Synthetic Timestamp and Minimal Facts
- **File:** [decision-extractor.ts#L91](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L91), [decision-extractor.ts#L92](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts#L92)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Lexical candidates use extraction-time timestamp and only `Source: ... lexical cue`.
- **Expected Behavior:** Preserve source message timestamp and richer provenance (message id/index/original text pointer).
- **Root Cause:** Candidate builder does not carry source metadata.
- **Suggested Fix:** Pass through source timestamp/index and include raw snippet reference in `facts`.
- **Effort:** SMALL (<30 min)

### SUMMARY
- Total findings: 18
- Critical: 0, High: 3, Medium: 13, Low: 2
- Top 3 recommendations:  
1. Replace hardcoded regex-only extraction with a two-pass parser (cue detection + structured sentence segmentation with negation handling).  
2. Implement computed confidence scoring with bounded 0-100 output based on extraction evidence.  
3. Merge multi-source observations and add semantic deduplication before final decision record creation.
