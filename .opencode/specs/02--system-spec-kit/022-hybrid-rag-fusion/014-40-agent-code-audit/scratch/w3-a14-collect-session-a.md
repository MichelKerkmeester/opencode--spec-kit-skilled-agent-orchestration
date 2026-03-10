● skill(sk-code--review)

● Todo added: Load review guidance

● Read .agents/skills/sk-code--review/references/quick_reference.md lines 1-220
  └ 151 lines read

● Read .agents/skills/sk-code--review/references/security_checklist.md lines 1-220
  └ 206 lines read

● Read .agents/skills/sk-code--review/references/code_quality_checklist.md lines 1-220
  └ 162 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 1-150
  └ 150 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 151-300
  └ 149 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 301-430
  └ 130 lines read

● Glob ".agents/skills/sk-code--opencode/*" in /Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public
  └ No matches found

● Todo started:

● Grep "export (type|interface) ToolCounts|export (type|interface) Observation|export
(type|interface) RecentContextEntry" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts)
  └ 3 lines found

● Grep "LEARNING_WEIGHTS" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Grep "export (type|interface) FileEntry|export (type|interface) SpecFileEntry|export
(type|interface) UserPrompt" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts)
  └ 3 lines found

● Read .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts lines 1-130
  └ 130 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/config.ts lines 40-90
  └ 51 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/config.ts lines 250-320
  └ 71 lines read

● Grep "learningWeights|interface WorkflowConfig"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/core/config.ts)
  └ 17 lines found

● Read .opencode/skill/system-spec-kit/scripts/core/config.ts lines 1-45
  └ 45 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/config.ts lines 145-180
  └ 36 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/config.ts lines 195-210
  └ 16 lines read

● Grep "function extractBlockers|export function extractBlockers|const extractBlockers"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts)
  └ 1 line found

● Grep "function calculateSessionDuration|function buildProjectStateSnapshot|function
detectSessionCharacteristics" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts)
  └ 3 lines found

● Read .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts lines 227-276
  └ 49 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts lines 438-500
  └ 34 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 193-205
  └ 13 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 223-245
  └ 23 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 275-292
  └ 18 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 311-364
  └ 54 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 370-417
  └ 48 lines read

● Grep "PreflightPostflightResult|ContinueSessionData|CollectedDataFull"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 24 lines found

● Grep "DELTA_KNOW_SCORE|DELTA_UNCERTAINTY_SCORE|LEARNING_INDEX|PREFLIGHT_UNCERTAINTY_RAW"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 26 lines found

● Read .opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts lines 90-112
  └ 23 lines read

● Grep "DELTA_UNCERTAINTY_TREND|LEARNING_SUMMARY|PREFLIGHT_UNCERTAINTY_RAW"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests)
  └ 4 lines found

● Read .opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js lines 300-335
  └ 36 lines read

● Grep "DELTA_KNOW_TREND|DELTA_UNCERTAINTY_TREND|up'|down'"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 41 lines found

● Read .opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts lines 1-120
  └ 120 lines read

● Grep "getTrendIndicator|DELTA_KNOW_TREND.*up|DELTA_UNCERTAINTY_TREND.*down|\u2191|\u2193"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 16 lines found

● Read .opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js lines 284-305
  └ 22 lines read

● Grep "MOCK_PREFLIGHT_POSTFLIGHT|knowledgeScore|uncertaintyScore|contextScore"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js)
  └ 8 lines found

● Todo started:

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 80-155
  └ 76 lines read

● Todo completed: write-audit-report

### FINDING-01: Delta extraction is all-or-nothing despite optional metric types
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:223-231,275-292`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** No delta, trend, or learning index is produced unless all three preflight and postflight scores are present. If one metric is missing, the code drops every computed delta even when the other metrics are valid.
- **Expected Behavior:** Available metric pairs should still produce per-metric deltas/trends; only missing metrics should stay null.
- **Root Cause:** `hasPostflightDelta` is a single gate that requires all six numeric fields before any delta calculation runs.
- **Suggested Fix:** Compute knowledge, uncertainty, and context deltas independently with per-field guards, then derive `LEARNING_INDEX`/`LEARNING_SUMMARY` from the available values.

### FINDING-02: `NaN` is treated as valid numeric input and can poison extracted metrics
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:193-205,223-231`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** `typeof value === 'number'` allows `NaN`, so invalid scores can pass `hasPostflightDelta`; `calculateLearningIndex` then propagates `NaN` because `?? 0` does not sanitize it.
- **Expected Behavior:** Only finite numeric scores should participate in delta math and index generation.
- **Root Cause:** The code uses `typeof` and nullish coalescing instead of `Number.isFinite`-style validation.
- **Suggested Fix:** Replace numeric guards with `Number.isFinite(...)` checks and sanitize non-finite deltas/scores before subtraction, formatting, and index calculation.

### FINDING-03: Learning index math is not normalized to the configured weight total
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:193-205`
- **Severity:** LOW
- **Category:** DESIGN
- **Current Behavior:** The weighted sum is used directly as a 0-100 index. If configured weights do not sum to 1, the index becomes scale-dependent and can saturate at 100 or under-report progress.
- **Expected Behavior:** The learning index should stay comparable regardless of weight configuration, or invalid weight totals should be rejected.
- **Root Cause:** The formula multiplies by raw weights and clamps, but never normalizes by total weight.
- **Suggested Fix:** Normalize by the sum of active weights before clamping, or validate configuration so the weights must sum to exactly 1.

### FINDING-04: `PREFLIGHT_UNCERTAINTY_RAW` is fabricated from the normalized score
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:235-246`
- **Severity:** LOW
- **Category:** BUG
- **Current Behavior:** When `uncertaintyRaw` is absent, the extractor copies `uncertaintyScore` into `PREFLIGHT_UNCERTAINTY_RAW`.
- **Expected Behavior:** A raw field should remain null unless raw input was actually captured.
- **Root Cause:** The fallback chain conflates two different concepts: original/raw uncertainty input and normalized uncertainty score.
- **Suggested Fix:** Set `PREFLIGHT_UNCERTAINTY_RAW` from `preflight?.uncertaintyRaw ?? null` only, and keep normalized uncertainty in its own field.

### FINDING-05: Learning summaries hide regressions, especially context loss
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:319-350`
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Negative context deltas are never mentioned, and smaller negative knowledge/uncertainty shifts are also omitted. A regressive session can therefore get a bland “Low learning delta” summary instead of a warning.
- **Expected Behavior:** Meaningful regressions in any tracked metric should be surfaced explicitly in the generated summary.
- **Root Cause:** `generateLearningSummary` only handles positive context changes and only large negative changes for some metrics.
- **Suggested Fix:** Add explicit negative/small-delta branches for all three metrics and make the fallback summary direction-aware.

### FINDING-06: Final session status can stay `BLOCKED` after the blocker was resolved
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:370-385`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** Any non-`'None'` blocker string immediately forces `BLOCKED`, and the completion check never gets a chance to override it.
- **Expected Behavior:** Final status should reflect unresolved blockers, not just the fact that a blocker existed at some earlier point.
- **Root Cause:** `determineSessionStatus` depends on a string sentinel instead of structured “currently blocked vs resolved” state, and it prioritizes blocker text over terminal completion evidence.
- **Suggested Fix:** Track unresolved blocker state explicitly, or evaluate the latest blocker/completion signals so resolved blockers do not permanently mark the session as blocked.

### FINDING-07: Pending-task extraction misses normal “should/must/need to” phrasing
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:426-429`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** The first regex only matches `need to:`, `should:`, `must:`, etc. Phrases like “should update tests” or “must verify output” are ignored.
- **Expected Behavior:** Natural-language modal phrases should be extracted as pending tasks even when they are not written as colon-labeled items.
- **Root Cause:** Label-style markers and sentence-style modal verbs were combined into one pattern that requires a colon for every alternative.
- **Suggested Fix:** Split structured-label extraction from modal-verb extraction, or make the colon optional for `need to|should|must`.

### FINDING-08: `CollectedDataFull` is too permissive to give meaningful compile-time guarantees
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:135-155`
- **Severity:** LOW
- **Category:** DESIGN
- **Current Behavior:** `FILES` entries can type-check without any guaranteed path field, and the `[key: string]: unknown` index signature allows arbitrary shape drift through the extractor boundary.
- **Expected Behavior:** Downstream extractors should receive a normalized, strongly typed payload with guaranteed required fields.
- **Root Cause:** Raw and normalized file schemas are merged into one all-optional object shape plus a catch-all index signature.
- **Suggested Fix:** Normalize `FILES` at ingestion and replace the current shape with a strict canonical interface or a discriminated union of known input variants.

### SUMMARY - Total: 8, Critical: 0, High: 1, Medium: 4, Low: 3


Total usage est:        1 Premium request
API time spent:         6m 55s
Total session time:     7m 7s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                 945.4k in, 21.2k out, 838.3k cached (Est. 1 Premium request)
