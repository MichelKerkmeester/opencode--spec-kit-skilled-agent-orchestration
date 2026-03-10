● skill(sk-code--review)

● SQL: Track audit todos
  └ 3 row(s) inserted. Last inserted row ID: 3.

● Read .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts
  └ 476 lines read

● Grep "extractDecisions|normalizeConfidence|decision-extractor" in **/*.{ts,tsx,js,json,md}
(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public)
  └ 5 lines found

● Run skill advisor
  $ python3 .opencode/skill/scripts/skill_advisor.py "Read and audit the file at
  .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts for bugs, security
  issues, quality problems, and design concerns" --threshold 0.8
  └ 35 lines...

● Todo started: inspect-decision-extractor

● Grep "export type DecisionOption|export interface DecisionOption|export type DecisionRecord|export
 interface DecisionRecord|export type DecisionData|export interface DecisionData"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts)
  └ 3 lines found

● Read .opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts
  └ 310 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/data-validator.ts
  └ 122 lines read

● Glob "**/*decision*extractor*.{ts,tsx,js,md}" in
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit
  └ 1 file found

● Read .opencode/skill/system-spec-kit/scripts/types/session-types.ts lines 1-140
  └ 140 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/message-utils.ts
  └ 245 lines read

● Grep
"extractDecisions\(|DECISION_ANCHOR_ID|DECISION_IMPORTANCE|HIGH_CONFIDENCE_COUNT|FOLLOWUP_COUNT" in
**/*.ts (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 26 lines found

● Read .opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts lines 290-340
  └ 50 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 800-840
  └ 41 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 1032-1048
  └ 17 lines read

● Read .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts lines 419-470
  └ 52 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts lines 1-220
  └ 220 lines read

● Grep "CONFIDENCE\b" in **/*.ts (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 20 lines found

● Grep "HIGH_CONFIDENCE_THRESHOLD|MEDIUM_CONFIDENCE_THRESHOLD" in **/*.ts
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 10 lines found

● Read .opencode/skill/system-spec-kit/scripts/lib/decision-tree-generator.ts lines 1-180
  └ 180 lines read

● Grep "CONFIDENCE[^\n]*%|Confidence|confidence" in **/*.{ts,md}
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 94 lines found

● Read .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts lines 150-210
  └ 61 lines read

● Read .opencode/skill/system-spec-kit/scripts/lib/ascii-boxes.ts lines 80-115
  └ 36 lines read

● Grep "confidence\s*[:=]" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts)
  └ 2 lines found

● Grep "_manualDecisions|keyDecisions|manual decision" in **/*.ts
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 15 lines found

● Read .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts lines 1-120
  └ 120 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts lines 250-335
  └ 86 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 470-500
  └ 31 lines read

● Confirm regex edge cases
  $ node - <<'NODE'
  const titleRe = /^(?:Decision\s*\d+:\s*)?(.+?)(?:\s*[-\u2013\u2014]\s*(.+))?$/i;
  for (const text of ['MCP-based solution', 'Decision 1: client-side rendering - fewer
  requests']) {
    const m = text.match(titleRe);...
  └ 14 lines...

● Confirm confidence display
  $ node - <<'NODE'
  function formatDecisionHeader(title, context, confidence, timestamp) {
    const width = 48;
    const innerWidth = width - 4;
    const date = new Date(timestamp);...
  └ 13 lines...

● Confirm manual early return
  $ node - <<'NODE'
  const collectedData = { _manualDecisions: ['Spec decision'], observations: [{ type:
  'decision', title: 'Observed', narrative: 'Selected option A', facts: ['Option A: use x'] }]
  };
  const manualDecisions = collectedData?._manualDecisions || [];...
  └ 6 lines...

● Confirm evidence branch bug
  $ node - <<'NODE'
  const obs = { files: [], facts: ['Evidence: docs/spec.md'] };
  const observationFiles = 'files' in obs && Array.isArray(obs.files) ? obs.files : null;
  const EVIDENCE = observationFiles
    ? observationFiles.map((f) => ({ EVIDENCE_ITEM: f }))...
  └ 9 lines...

● Todo started: analyze-findings

● Confirm malformed input crashes
  $ node - <<'NODE'
  try {
    const collectedData = { _manualDecisions: 'not-an-array' };
    const manualDecisions = collectedData?._manualDecisions || [];
    if (manualDecisions.length > 0) {...
  └ 16 lines...

● Todo completed: report-audit

● Confirm manual schema mismatch
  $ node - <<'NODE'
  const manualObj = { chosenOption: 'Redis', reason: 'Lower latency', options: ['Redis',
  'Postgres'] };
  const toText = (value) => typeof value === 'string' ? value.trim() : '';
  const chosenLabel = toText(manualObj?.chosen) || toText(manualObj?.choice) || ...
  └ 7 lines...

● Todo completed: analyze-findings

### FINDING-01: Null input fabricates decisions instead of failing safely
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:123-126`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** When `collectedData` is `null`, the extractor logs a warning and returns `simFactory.createDecisionData()`, which injects fake decisions into downstream summaries.
- **Expected Behavior:** Missing/invalid input should return an empty `DecisionData` payload or propagate an explicit failure, not synthetic decisions.
- **Root Cause:** The extractor treats `null` as “simulation mode” instead of “no usable decision input”.
- **Suggested Fix:** Return an empty structure (`DECISIONS: []`, counts `0`) or throw/propagate a typed error; keep simulation data behind an explicit upstream simulation flag only.

### FINDING-02: Manual decisions short-circuit and discard real observed decisions
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:121-129,250-257`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** Any non-empty `_manualDecisions` array causes an early return, so the observation-driven and lexical extraction path at lines 260-465 never runs.
- **Expected Behavior:** Manual decisions should augment or override specific records, not suppress all observed decisions from the session.
- **Root Cause:** The manual branch is implemented as an unconditional early-return path instead of a merge step.
- **Suggested Fix:** Extract manual decisions into an intermediate array, continue processing observed/lexical decisions, then merge/dedupe and compute counts once.

### FINDING-03: Accepted manual-decision fields `chosenOption` and `reason` are ignored
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:211-217; .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:63-71`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** Manual objects only honor `chosen|choice|selected` and `rationale|reasoning`. The declared input contract also supports `chosenOption` and `reason`, but those values are dropped, so `CHOSEN` and `RATIONALE` can be wrong.
- **Expected Behavior:** All fields accepted by the normalizer contract should survive into extracted decision records.
- **Root Cause:** Schema drift between `DecisionItemObject` and the manual parsing logic in `extractDecisions`.
- **Suggested Fix:** Add `chosenOption` to the chosen-field precedence and `reason` to the rationale-field precedence; add regression tests for both fields.

### FINDING-04: Malformed input can crash the extractor due to missing runtime guards
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:103-109,121,135,261-278,381-383`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** The code assumes `_manualDecisions`, `observations`, `userPrompts`, `facts`, and `files` all have the declared runtime shapes. Malformed values produce runtime errors such as `manualDecisions.map is not a function` and `(obs.facts || []).filter is not a function`.
- **Expected Behavior:** Exported extractors should degrade gracefully on malformed data by skipping bad records or normalizing to empty arrays.
- **Root Cause:** The implementation relies on TypeScript static types instead of runtime `Array.isArray`/object/null checks, despite already acknowledging irregular runtime data.
- **Suggested Fix:** Normalize every inbound collection with runtime guards, skip non-object observation entries, and add malformed-input tests for strings, nulls, and mixed arrays.

### FINDING-05: Hyphenated manual decision text is split into the wrong title and rationale
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:151-153`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** The title parser treats any dash as a title/rationale separator, so text like `MCP-based solution` becomes title `MCP` and rationale `based solution`.
- **Expected Behavior:** Only explicit separators like ` - ` / ` — ` should split title from rationale; hyphenated words should remain intact.
- **Root Cause:** The regex uses `\s*[-\u2013\u2014]\s*`, which allows zero spaces around the dash.
- **Suggested Fix:** Require surrounding whitespace (for example `\s+[-\u2013\u2014]\s+`) or split only on the first spaced dash separator.

### FINDING-06: Lexical decision cue matching has both major false negatives and false positives
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:36,45-71,73-111,323-327`
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Fallback extraction depends on a narrow cue regex plus a very broad bare `we'll` token. It misses common decision language like `opted for`, `picked`, `settled on`, and `go with`, while classifying generic future-tense text like `we'll investigate` as a decision.
- **Expected Behavior:** Lexical fallback should detect actual decision statements with bounded patterns and consistent downstream chosen/rationale parsing.
- **Root Cause:** One coarse regex gates lexical extraction, but its vocabulary is incomplete and one token is too generic.
- **Suggested Fix:** Replace the current regex with bounded phrase patterns, remove bare `we'll`, and align `chosenMatch`/`rationaleMatch` with the same cue set.

### FINDING-07: Decimal normalized confidences are parsed as zero
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:40-42,329-335`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** A narrative like `confidence: 0.7` matches only `0`, then `normalizeConfidence(0)` stores `0`, incorrectly classifying a 70% confidence decision as low confidence.
- **Expected Behavior:** The extractor should correctly parse normalized decimals (`0.7`) and percentages (`70`, `70%`).
- **Root Cause:** `confidenceMatch` captures only integers, even though `normalizeConfidence` explicitly supports 0..1 inputs.
- **Suggested Fix:** Capture decimals (e.g. `(\d+(?:\.\d+)?)`), parse with `Number`, and add tests for `0.7`, `70`, and `70%`.

### FINDING-08: Confidence units are inconsistent with decision-tree rendering
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:40-42,333-335,420-421; .opencode/skill/system-spec-kit/scripts/lib/ascii-boxes.ts:92-105`
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** The extractor stores `CONFIDENCE` as a 0..1 fraction, but the ASCII renderer prints `Confidence: ${confidence}%`, so decisions render as `0.7%` instead of `70%`.
- **Expected Behavior:** Confidence should use one unit consistently across extraction, counting, and rendering.
- **Root Cause:** The extractor normalizes to fractions while the visualization layer formats the same field as a percentage.
- **Suggested Fix:** Standardize the contract to either 0..1 or 0..100 everywhere; if keeping normalized values, multiply by 100 before rendering decision trees.

### FINDING-09: Evidence extraction drops fact-based evidence whenever `files` exists
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:381-393`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** If `obs.files` is present, the extractor uses only file paths as evidence. An empty `files: []` suppresses valid `Evidence:` facts entirely, and non-empty `files` also discard textual evidence.
- **Expected Behavior:** File evidence and fact-based evidence should be combined; empty `files` should fall back to fact parsing.
- **Root Cause:** A ternary chooses one evidence source exclusively instead of merging both sources.
- **Suggested Fix:** Collect `fileEvidence` and `factEvidence` separately and concatenate them into a single `EVIDENCE` array.

### FINDING-10: Manual decision records are materially less complete than observation-derived records
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:223-246,250-257,420-455`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** Manual decisions always return `DECISION_TREE: ''`, `HAS_DECISION_TREE: false`, and hardcoded `DECISION_IMPORTANCE: 'medium'`, even when options and rationale are available.
- **Expected Behavior:** Manual and observation-derived decisions should receive the same derived-field enrichment and importance scoring.
- **Root Cause:** The manual branch returns before the shared post-processing that generates decision trees and computes importance.
- **Suggested Fix:** Move tree generation, importance derivation, validation, and aggregate counting into a shared post-processing step used by both branches.

### FINDING-11: Duplicate-title anchor IDs are unique only by extraction order
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:219-221,431-445`
- **Severity:** LOW
- **Category:** DESIGN
- **Current Behavior:** Duplicate decision titles are disambiguated with `-2`, `-3`, etc. based on encounter order. If record order changes between runs, anchor IDs change.
- **Expected Behavior:** Anchor IDs should remain deterministic for equivalent source data while still being unique.
- **Root Cause:** The hash input omits a stable discriminator, so collisions are resolved with order-dependent suffixes only.
- **Suggested Fix:** Include a stable differentiator such as original index, timestamp, or rationale hash before uniqueness validation.

### FINDING-12: Lexical fallback timestamps use extraction time instead of source time
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:88-100,103-109`
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Synthesized lexical decisions are timestamped with `new Date().toISOString()` rather than the observation/prompt timestamp, so they appear to happen at extraction time.
- **Expected Behavior:** Source timestamps should be preserved when available.
- **Root Cause:** `addCandidate` has no timestamp parameter and always stamps the current time.
- **Suggested Fix:** Pass source timestamps into `addCandidate` and only fall back to the current time when the source record lacks one.

### SUMMARY - Total: 12, Critical: 0, High: 5, Medium: 5, Low: 2


Total usage est:        1 Premium request
API time spent:         7m 36s
Total session time:     8m 1s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                 1.6m in, 23.0k out, 1.4m cached (Est. 1 Premium request)
