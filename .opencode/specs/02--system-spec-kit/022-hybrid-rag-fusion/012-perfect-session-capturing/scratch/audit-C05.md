OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019ccec9-6007-7e61-9f13-7cf1d8d8ddb6
--------
user
You are a code auditor. Read EVERY LINE of /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts (499 lines).

This file normalizes input data from different AI session formats into a common structure. A recent bug was fixed in transformOpencodeCapture() where irrelevant session content was leaking into memory files due to missing spec-folder relevance filtering.

Audit specifically:
1. transformOpencodeCapture(): VERIFY the recent fix is complete. Does the spec-folder relevance filtering work correctly? Are there remaining edge cases?
2. DECISION REGEX: How are decisions extracted? Are the regex patterns robust? What do they miss?
3. CONFIDENCE VALUES: Are confidence scores hardcoded or computed? Are they meaningful?
4. FORMAT DETECTION: How does it distinguish between OpenCode, Copilot, and other formats?
5. DATA MAPPING: Are all source fields correctly mapped to target fields? Any data loss?
6. NORMALIZATION: Are strings trimmed? Are arrays deduplicated? Are dates normalized?

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
mcp: sequential_thinking starting
mcp: spec_kit_memory starting
mcp: code_mode starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m auditing that file line-by-line now, with focus on `transformOpencodeCapture()` and the six areas you listed. First step is to load the full file with line numbers so I can verify the fix and map every field precisely.
exec
/bin/zsh -lc "wc -l '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts' && nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     499 /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
     1	// ---------------------------------------------------------------
     2	// MODULE: Input Normalizer
     3	// ---------------------------------------------------------------
     4	// Validates, normalizes, and transforms raw input data into structured session format
     5	
     6	// 1. TYPES
     7	
     8	/** Data source type indicating where loaded data came from */
     9	export type DataSource = 'file' | 'opencode-capture' | 'simulation';
    10	
    11	/** A single observation record produced by transformation */
    12	export interface Observation {
    13	  type: string;
    14	  title: string;
    15	  narrative: string;
    16	  facts: string[];
    17	  timestamp?: string;
    18	  files?: string[];
    19	  _manualDecision?: {
codex
I’ve finished the full-line read and I’m now cross-checking edge cases against each required audit area (filtering, regex, confidence, detection, mapping, normalization). I’ll run a quick targeted scan for format-detection cues next.
exec
/bin/zsh -lc "rg -n \"copilot|opencode|format|normalize|source|capture\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
4:// Validates, normalizes, and transforms raw input data into structured session format
8:/** Data source type indicating where loaded data came from */
9:export type DataSource = 'file' | 'opencode-capture' | 'simulation';
11:/** A single observation record produced by transformation */
44:/** Raw input data that may be in manual or MCP-compatible format */
72:/** Normalized data in MCP-compatible format */
84:/** An exchange in an OpenCode capture */
91:/** A tool call in an OpenCode capture */
105:/** OpenCode session capture structure */
112:  capturedAt?: string;
115:/** Transformed OpenCode capture result */
121:  _source: DataSource;
123:  _capturedAt?: string;
222:function normalizeInputData(data: RawInputData): NormalizedData | RawInputData {
227:  const normalized: NormalizedData = {
234:    normalized.SPEC_FOLDER = data.specFolder;
238:    normalized.FILES = data.filesModified.map((filePath: string): FileEntry => ({
263:  normalized.observations = observations;
265:  normalized.userPrompts = [{
270:  normalized.recentContext = [{
codex
I’ve validated the core behavior now and identified multiple concrete issues, including residual leakage paths after the recent fix. I’m compiling them in your exact reporting template with severity and line-anchored references.
codex
### FINDING-01: `userPrompts` bypasses spec-folder relevance filter
- **File:** [input-normalizer.ts:384](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:384)
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** `userPrompts` is built from all `exchanges`, even when `specFolderHint` is provided.
- **Expected Behavior:** Only prompts relevant to the target spec folder should be included when filtering is active.
- **Root Cause:** Relevance filtering is applied to observations/tool calls, but not to `userPrompts`.
- **Suggested Fix:** Build a filtered exchange list first, then derive `userPrompts`, `observations`, and `recentContext` from that same filtered set.
- **Effort:** SMALL (<30 min)

### FINDING-02: `recentContext` still leaks irrelevant session content
- **File:** [input-normalizer.ts:453](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:453)
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** `recentContext` uses first/last of full `exchanges`, not filtered exchanges.
- **Expected Behavior:** `recentContext` should reflect only relevant exchanges for the target spec folder.
- **Root Cause:** Filtered tool calls are used, but exchange-level filtering is not centralized for all outputs.
- **Suggested Fix:** Compute `relevantExchanges` once and use it for `recentContext`.
- **Effort:** SMALL (<30 min)

### FINDING-03: Relevance keywords are over-broad (especially with absolute paths)
- **File:** [input-normalizer.ts:366](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:366)
- **Severity:** HIGH
- **Category:** DESIGN
- **Current Behavior:** Keywords include every path segment (e.g., `public`, `development`, `specs`) plus full path.
- **Expected Behavior:** Matching should focus on canonical spec-folder identifiers, not generic directory words.
- **Root Cause:** Naive `split('/')` segment extraction and substring matching.
- **Suggested Fix:** Normalize to relative spec path and match exact segment boundaries (or `startsWith` on normalized file paths under the target spec folder).
- **Effort:** MEDIUM (<2 hr)

### FINDING-04: Substring matching causes false positives
- **File:** [input-normalizer.ts:377](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:377)
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Relevance uses `combined.includes(keyword)`.
- **Expected Behavior:** Relevance should use token/segment boundary aware matching.
- **Root Cause:** Plain substring checks are too permissive.
- **Suggested Fix:** Match normalized path segments or regex with boundaries.
- **Effort:** SMALL (<30 min)

### FINDING-05: Relevant follow-up exchanges can be dropped
- **File:** [input-normalizer.ts:406](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:406)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** Each exchange must mention a keyword directly; contextual follow-ups (“do that change now”) get excluded.
- **Expected Behavior:** Conversation continuity should preserve adjacent relevant exchanges.
- **Root Cause:** Stateless per-message keyword gate.
- **Suggested Fix:** Keep an exchange if it is keyword-matching OR near a matching exchange (windowed/contextual relevance).
- **Effort:** MEDIUM (<2 hr)

### FINDING-06: Tool relevance check misses many relevant tool calls
- **File:** [input-normalizer.ts:374](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:374)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** Only `input.filePath/file_path/path` and `title` are considered.
- **Expected Behavior:** Relevance should inspect other tool input fields (e.g., query, glob pattern, args) when path fields are absent.
- **Root Cause:** Narrow field selection in `isToolRelevant`.
- **Suggested Fix:** Serialize/select additional safe input fields for relevance matching.
- **Effort:** SMALL (<30 min)

### FINDING-07: Decision extraction regex is narrow and misses common phrasing
- **File:** [input-normalizer.ts:138](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:138)
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Extractor only catches a small verb set (`chose`, `selected`, etc.).
- **Expected Behavior:** It should catch patterns like “settled on”, “preferred”, “picked”, “we’ll use”, “decision: X”.
- **Root Cause:** Limited regex vocabulary and structure.
- **Suggested Fix:** Expand pattern set and add structured fallback parsing (e.g., decision headers, colon formats).
- **Effort:** SMALL (<30 min)

### FINDING-08: Decision regex can over-capture non-option text
- **File:** [input-normalizer.ts:138](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:138)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** `([^.,]+)` captures until punctuation, often including extra clause text.
- **Expected Behavior:** Extracted option should be concise and option-like.
- **Root Cause:** Broad capture group with no stopwords/structure.
- **Suggested Fix:** Post-process captured string (trim connectors like “because”, “to”, etc.) or use multi-pattern extraction.
- **Effort:** SMALL (<30 min)

### FINDING-09: Confidence scores are hardcoded and not meaningful
- **File:** [input-normalizer.ts:183](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:183)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** `_manualDecision.confidence` is always `75`.
- **Expected Behavior:** Confidence should be computed from extraction quality/signals or omitted if unavailable.
- **Root Cause:** Static literal instead of scoring logic.
- **Suggested Fix:** Derive confidence from structured source quality (object vs free text, regex match strength, alternatives presence).
- **Effort:** MEDIUM (<2 hr)

### FINDING-10: No Copilot/other format detection logic in this normalizer
- **File:** [input-normalizer.ts:222](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:222)
- **Severity:** HIGH
- **Category:** DESIGN
- **Current Behavior:** Only manual-ish normalization and OpenCode transform exist; no explicit Copilot schema detection path.
- **Expected Behavior:** Distinct source-format detection should route OpenCode/Copilot/other payloads to proper transformers.
- **Root Cause:** Missing discriminator logic in this module.
- **Suggested Fix:** Add `detectFormat(data)` + dedicated transform branches (OpenCode/Copilot/manual/unknown).
- **Effort:** MEDIUM (<2 hr)

### FINDING-11: Early return skips normalization for partially-normalized inputs
- **File:** [input-normalizer.ts:223](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:223)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** If any one of `userPrompts|observations|recentContext` exists, function returns raw data unchanged.
- **Expected Behavior:** Missing fields should be normalized/defaulted to arrays; schema should be completed.
- **Root Cause:** Overly broad short-circuit condition.
- **Suggested Fix:** Return early only when all required normalized fields are valid arrays; otherwise fill missing ones.
- **Effort:** SMALL (<30 min)

### FINDING-12: Invalid timestamps can throw and abort normalization
- **File:** [input-normalizer.ts:386](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:386)
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** `new Date(invalid).toISOString()` can throw `RangeError`.
- **Expected Behavior:** Invalid timestamps should fallback safely (e.g., current time or omitted timestamp).
- **Root Cause:** No date validity check before `toISOString()`.
- **Suggested Fix:** Wrap in helper `toIsoOrNow(ts)` using `isNaN(date.getTime())` guard.
- **Effort:** SMALL (<30 min)

### FINDING-13: String normalization (trim) is mostly missing
- **File:** [input-normalizer.ts:385](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:385)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Prompt/narrative/title/file-path strings are copied without trimming/cleanup.
- **Expected Behavior:** Input strings should be normalized (`trim`, collapse obvious noise) before persistence.
- **Root Cause:** No centralized string sanitizer.
- **Suggested Fix:** Add `clean(s)` helper and apply at mapping points.
- **Effort:** SMALL (<30 min)

### FINDING-14: Arrays are not consistently deduplicated
- **File:** [input-normalizer.ts:275](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:275)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** `FILES` is deduped in one path, but `triggerPhrases`, `keyDecisions`, and prompt/observation-derived arrays are not.
- **Expected Behavior:** Repeated values should be deduped where semantically set-like.
- **Root Cause:** Dedup logic is local and incomplete.
- **Suggested Fix:** Apply `Array.from(new Set(...))` for relevant arrays during normalization.
- **Effort:** SMALL (<30 min)

### SUMMARY
- Total findings: 14
- Critical: 0, High: 5, Medium: 6, Low: 3
- Top 3 recommendations:
1. Centralize relevance filtering: compute `relevantExchanges` once and use it for `userPrompts`, `observations`, and `recentContext`.
2. Replace keyword `includes` matching with normalized path-segment/boundary matching against canonical spec folder identifiers.
3. Add resilient normalization helpers (`toIsoOrNow`, `clean`, dedupe utilities) and stricter format detection routing (OpenCode/Copilot/manual).
tokens used
13,292
### FINDING-01: `userPrompts` bypasses spec-folder relevance filter
- **File:** [input-normalizer.ts:384](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:384)
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** `userPrompts` is built from all `exchanges`, even when `specFolderHint` is provided.
- **Expected Behavior:** Only prompts relevant to the target spec folder should be included when filtering is active.
- **Root Cause:** Relevance filtering is applied to observations/tool calls, but not to `userPrompts`.
- **Suggested Fix:** Build a filtered exchange list first, then derive `userPrompts`, `observations`, and `recentContext` from that same filtered set.
- **Effort:** SMALL (<30 min)

### FINDING-02: `recentContext` still leaks irrelevant session content
- **File:** [input-normalizer.ts:453](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:453)
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** `recentContext` uses first/last of full `exchanges`, not filtered exchanges.
- **Expected Behavior:** `recentContext` should reflect only relevant exchanges for the target spec folder.
- **Root Cause:** Filtered tool calls are used, but exchange-level filtering is not centralized for all outputs.
- **Suggested Fix:** Compute `relevantExchanges` once and use it for `recentContext`.
- **Effort:** SMALL (<30 min)

### FINDING-03: Relevance keywords are over-broad (especially with absolute paths)
- **File:** [input-normalizer.ts:366](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:366)
- **Severity:** HIGH
- **Category:** DESIGN
- **Current Behavior:** Keywords include every path segment (e.g., `public`, `development`, `specs`) plus full path.
- **Expected Behavior:** Matching should focus on canonical spec-folder identifiers, not generic directory words.
- **Root Cause:** Naive `split('/')` segment extraction and substring matching.
- **Suggested Fix:** Normalize to relative spec path and match exact segment boundaries (or `startsWith` on normalized file paths under the target spec folder).
- **Effort:** MEDIUM (<2 hr)

### FINDING-04: Substring matching causes false positives
- **File:** [input-normalizer.ts:377](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:377)
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Relevance uses `combined.includes(keyword)`.
- **Expected Behavior:** Relevance should use token/segment boundary aware matching.
- **Root Cause:** Plain substring checks are too permissive.
- **Suggested Fix:** Match normalized path segments or regex with boundaries.
- **Effort:** SMALL (<30 min)

### FINDING-05: Relevant follow-up exchanges can be dropped
- **File:** [input-normalizer.ts:406](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:406)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** Each exchange must mention a keyword directly; contextual follow-ups (“do that change now”) get excluded.
- **Expected Behavior:** Conversation continuity should preserve adjacent relevant exchanges.
- **Root Cause:** Stateless per-message keyword gate.
- **Suggested Fix:** Keep an exchange if it is keyword-matching OR near a matching exchange (windowed/contextual relevance).
- **Effort:** MEDIUM (<2 hr)

### FINDING-06: Tool relevance check misses many relevant tool calls
- **File:** [input-normalizer.ts:374](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:374)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** Only `input.filePath/file_path/path` and `title` are considered.
- **Expected Behavior:** Relevance should inspect other tool input fields (e.g., query, glob pattern, args) when path fields are absent.
- **Root Cause:** Narrow field selection in `isToolRelevant`.
- **Suggested Fix:** Serialize/select additional safe input fields for relevance matching.
- **Effort:** SMALL (<30 min)

### FINDING-07: Decision extraction regex is narrow and misses common phrasing
- **File:** [input-normalizer.ts:138](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:138)
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Extractor only catches a small verb set (`chose`, `selected`, etc.).
- **Expected Behavior:** It should catch patterns like “settled on”, “preferred”, “picked”, “we’ll use”, “decision: X”.
- **Root Cause:** Limited regex vocabulary and structure.
- **Suggested Fix:** Expand pattern set and add structured fallback parsing (e.g., decision headers, colon formats).
- **Effort:** SMALL (<30 min)

### FINDING-08: Decision regex can over-capture non-option text
- **File:** [input-normalizer.ts:138](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:138)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** `([^.,]+)` captures until punctuation, often including extra clause text.
- **Expected Behavior:** Extracted option should be concise and option-like.
- **Root Cause:** Broad capture group with no stopwords/structure.
- **Suggested Fix:** Post-process captured string (trim connectors like “because”, “to”, etc.) or use multi-pattern extraction.
- **Effort:** SMALL (<30 min)

### FINDING-09: Confidence scores are hardcoded and not meaningful
- **File:** [input-normalizer.ts:183](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:183)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** `_manualDecision.confidence` is always `75`.
- **Expected Behavior:** Confidence should be computed from extraction quality/signals or omitted if unavailable.
- **Root Cause:** Static literal instead of scoring logic.
- **Suggested Fix:** Derive confidence from structured source quality (object vs free text, regex match strength, alternatives presence).
- **Effort:** MEDIUM (<2 hr)

### FINDING-10: No Copilot/other format detection logic in this normalizer
- **File:** [input-normalizer.ts:222](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:222)
- **Severity:** HIGH
- **Category:** DESIGN
- **Current Behavior:** Only manual-ish normalization and OpenCode transform exist; no explicit Copilot schema detection path.
- **Expected Behavior:** Distinct source-format detection should route OpenCode/Copilot/other payloads to proper transformers.
- **Root Cause:** Missing discriminator logic in this module.
- **Suggested Fix:** Add `detectFormat(data)` + dedicated transform branches (OpenCode/Copilot/manual/unknown).
- **Effort:** MEDIUM (<2 hr)

### FINDING-11: Early return skips normalization for partially-normalized inputs
- **File:** [input-normalizer.ts:223](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:223)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** If any one of `userPrompts|observations|recentContext` exists, function returns raw data unchanged.
- **Expected Behavior:** Missing fields should be normalized/defaulted to arrays; schema should be completed.
- **Root Cause:** Overly broad short-circuit condition.
- **Suggested Fix:** Return early only when all required normalized fields are valid arrays; otherwise fill missing ones.
- **Effort:** SMALL (<30 min)

### FINDING-12: Invalid timestamps can throw and abort normalization
- **File:** [input-normalizer.ts:386](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:386)
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** `new Date(invalid).toISOString()` can throw `RangeError`.
- **Expected Behavior:** Invalid timestamps should fallback safely (e.g., current time or omitted timestamp).
- **Root Cause:** No date validity check before `toISOString()`.
- **Suggested Fix:** Wrap in helper `toIsoOrNow(ts)` using `isNaN(date.getTime())` guard.
- **Effort:** SMALL (<30 min)

### FINDING-13: String normalization (trim) is mostly missing
- **File:** [input-normalizer.ts:385](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:385)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Prompt/narrative/title/file-path strings are copied without trimming/cleanup.
- **Expected Behavior:** Input strings should be normalized (`trim`, collapse obvious noise) before persistence.
- **Root Cause:** No centralized string sanitizer.
- **Suggested Fix:** Add `clean(s)` helper and apply at mapping points.
- **Effort:** SMALL (<30 min)

### FINDING-14: Arrays are not consistently deduplicated
- **File:** [input-normalizer.ts:275](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:275)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** `FILES` is deduped in one path, but `triggerPhrases`, `keyDecisions`, and prompt/observation-derived arrays are not.
- **Expected Behavior:** Repeated values should be deduped where semantically set-like.
- **Root Cause:** Dedup logic is local and incomplete.
- **Suggested Fix:** Apply `Array.from(new Set(...))` for relevant arrays during normalization.
- **Effort:** SMALL (<30 min)

### SUMMARY
- Total findings: 14
- Critical: 0, High: 5, Medium: 6, Low: 3
- Top 3 recommendations:
1. Centralize relevance filtering: compute `relevantExchanges` once and use it for `userPrompts`, `observations`, and `recentContext`.
2. Replace keyword `includes` matching with normalized path-segment/boundary matching against canonical spec folder identifiers.
3. Add resilient normalization helpers (`toIsoOrNow`, `clean`, dedupe utilities) and stricter format detection routing (OpenCode/Copilot/manual).
