# Iteration 1: Pipeline Data Integrity (Domain A) + Schema & Validation (Domain B)

## Focus
Trace the full field propagation path through `input-normalizer.ts` (load + normalize) and `validate-memory-quality.ts` (V-rules). Identify fields that can be silently dropped or mutated during normalization, map the priority chain where explicit input and enrichment both contribute, and evaluate V-rule coverage gaps.

## Findings

### Domain A: Pipeline Data Integrity — Field Propagation

1. **Two-path normalizer creates asymmetric field handling (silent drops on fast-path).**
   `normalizeInputData()` (lines 414-610) has a critical branch at line 437: if the raw data already has `userPrompts`, `observations`, or `recentContext`, it takes the "fast path" (clone + backfill). Otherwise, it takes the "slow path" (construct from scratch). The fast path clones the entire input, but **only explicitly backfills 8 specific fields**: `userPrompts`, `recentContext`, `observations`, `FILES`, `nextSteps`, `triggerPhrases`, `SPEC_FOLDER`, `TECHNICAL_CONTEXT`, `importanceTier`, `contextType`, and `keyDecisions`. Any field NOT in this explicit list is silently carried through or dropped depending on whether the clone picked it up. This means:
   - `sessionSummary` is **never transformed into an observation** on the fast path -- the slow path explicitly creates a `buildSessionSummaryObservation()` (line 549-551), but the fast path never calls this function. If a caller provides `sessionSummary` AND `observations`, the sessionSummary text is silently ignored.
   - `filesModified` (the string[] shorthand) is **never processed on the fast path** -- only `FILES` (the object[] format) gets normalized at line 443-444. The slow path handles `filesModified` -> `FILES` conversion (lines 505-541), but the fast path skips this entirely. Result: if a caller provides `filesModified: ["a.ts", "b.ts"]` alongside `userPrompts`, those files are **silently dropped**.
   [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:437-492]

2. **`sessionSummary` is silently consumed but never preserved as a first-class field.**
   On the slow path, `sessionSummary` is used to: (a) create a 'feature' observation (line 549), (b) fabricate a synthetic `userPrompts` entry (line 579-582), and (c) fabricate a synthetic `recentContext` entry (line 584-587). The original `sessionSummary` string is **never stored** in the `NormalizedData` output -- it is decomposed into three derived fields. If downstream code needs the raw summary, it cannot retrieve it. This is a lossy transformation with no audit trail.
   [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:545-587]

3. **Decision objects lose structured data during text flattening.**
   `transformKeyDecision()` (lines 195-258) converts structured `DecisionItemObject` (with `decision`, `chosenOption`, `rationale`, `alternatives`) into a flat text `Observation`. The structured object is also stored in `_manualDecisions` (line 477, 594), but the observation loses the individual fields: `chosenOption` is regex-extracted back from text on the string path (line 203), and confidence is heuristically assigned (0.50-0.70) based on whether alternatives were mentioned. The original structured data survives in `_manualDecisions` but the observation that templates consume is the lossy version.
   [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:195-258]

4. **`technicalContext` is dual-stored but the observation version loses key structure.**
   When `technicalContext` is provided, it generates both: (a) a `TECHNICAL_CONTEXT` array of `{KEY, VALUE}` objects (line 570), and (b) an 'implementation' observation with a semicolon-delimited string (line 568). The observation flattens all values to strings via `JSON.stringify()` for nested objects (line 289). If a value is `{nested: {deep: true}}`, it becomes the JSON string -- losing type information and making the observation harder to parse downstream.
   [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:287-311, 567-571]

5. **No validation for `observations` array element structure.**
   `validateInputData()` checks that `observations` is an array (line 686-689) but **never validates individual observation objects**. An observation with no `type`, no `title`, no `narrative`, or with wrong-typed `facts` (e.g., facts as a number) will pass validation and enter the pipeline. The `NormalizedObservation` type (line 39-44) requires `type`, `title`, `narrative`, and `facts`, but this is compile-time only -- no runtime enforcement exists.
   [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:686-689, 39-44]

6. **`RawInputData` index signature `[key: string]: unknown` means ANY field is accepted without warning.**
   The `RawInputData` interface (line 72-98) has an open index signature. Combined with the fact that `validateInputData()` only checks known fields, a typo like `sesionSummary` (missing 's') or `trigerphrases` is silently accepted and ignored. No "unknown field" warning is emitted.
   [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:72-98, 621-703]

### Domain B: Schema & Validation Completeness — V-Rule Coverage

7. **V-rules operate on rendered markdown, not on the structured data pipeline.**
   All 12 V-rules in `validateMemoryQualityContent()` (lines 456-686) parse the **rendered markdown string** using regex. They search for patterns like `[TBD]`, `[N/A]`, foreign spec IDs, etc. This means validation happens **after** template rendering, not at the structured data level. Any field corruption, silent drop, or type confusion that produces valid-looking markdown will pass all V-rules undetected.
   [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:456-686]

8. **No V-rule validates YAML frontmatter well-formedness.**
   The V-rules parse specific YAML keys (title, spec_folder, trigger_phrases, key_topics) using custom regex-based extractors (`extractYamlValue`, `parseYamlList`). But there is **no rule that validates YAML syntax itself** -- a malformed frontmatter block (unclosed quotes, tab indentation, duplicate keys) will cause silent extraction failures where `extractYamlValue()` returns null without flagging an error. V3 checks for specific malformation patterns in `spec_folder` (bold markers, brackets), but the general case of broken YAML is uncovered.
   [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:183-304, 484-491]

9. **No V-rule validates numeric field consistency (status/percentage contradictions).**
   The prior research round flagged "COMPLETED+30%, BLOCKED+100%" contradictions. No V-rule checks for logical consistency between `session_status` and `completion_percent`. A memory can claim status "COMPLETED" with 30% completion or "BLOCKED" with 100% completion, and all V-rules pass. V7 checks tool_count vs execution signals, but the status/percent domain is completely unvalidated.
   [INFERENCE: based on V7 pattern at validate-memory-quality.ts:516-521 and absence of status/percent rules in V1-V12]

10. **V12 topical coherence has a filesystem dependency that silently degrades.**
    V12 (lines 612-650) reads `spec.md` from the filesystem to extract spec-level trigger_phrases. But `specFolder` extracted from YAML frontmatter may be a relative name (e.g., "016-json-mode-hybrid-enrichment") rather than an absolute path. The `path.resolve(specFolder, 'spec.md')` at line 618 resolves relative to CWD, which may not be the spec root. When the file is not found, V12 silently passes (no trigger_phrases = no check). This means V12 is a best-effort check that degrades to a no-op for many real invocations.
    [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:612-650]

11. **Missing V-rule: No validation for empty or near-empty memory content.**
    A memory file with valid YAML frontmatter but a body consisting of only headers and no substantive text (e.g., all sections empty) passes all V-rules. V1 only checks for `[TBD]` in 4 specific fields. V5 only checks trigger_phrases when tool_count >= 5. There is no minimum content length or density check.
    [INFERENCE: based on exhaustive review of V1-V12 implementations at validate-memory-quality.ts:456-686]

12. **Missing V-rule: No validation that `importance_tier` in frontmatter is a valid enum value.**
    `validateInputData()` validates `importanceTier` against the valid tiers list (line 663-669), but the rendered markdown V-rules do not re-check this. If the enrichment pipeline or template renderer injects an invalid tier value after input validation, it passes undetected.
    [INFERENCE: based on input-normalizer.ts:663-669 vs. absence of tier validation in validate-memory-quality.ts V-rules]

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` (lines 1-784)
- `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts` (lines 1-729)
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` (lines 1-200)
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` (lines 1-200)

## Assessment
- New information ratio: 0.85
- Questions addressed: Q1 (field drops/mutations), Q2 (V-rule coverage gaps), Q3 (partially -- schema presence)
- Questions answered: Q1 (partially -- normalization path mapped, enrichment priority chain needs workflow.ts deep read), Q3 (no formal JSON Schema exists; ad-hoc runtime validation only)

## Reflection
- What worked and why: Reading `input-normalizer.ts` end-to-end revealed the two-path architecture (fast vs slow) which is the root cause of most silent field drops. The asymmetry was not visible from types alone.
- What did not work and why: Could not read `workflow.ts` deeply enough to trace the enrichment phase (where `collectSessionData` output is further processed). The 200-line read captured only imports and interfaces.
- What I would do differently: Start next iteration from `workflow.ts` line 200+ to trace the enrichment/rendering pipeline, specifically where enrichment can overwrite explicit JSON data.

## Recommended Next Focus
Domain A (continued) + Domain E (Hallucination Prevention): Read workflow.ts enrichment pipeline (lines 200-600) to trace where `collectSessionData` output gets enriched, what the contamination filter covers, and where synthetic content injection occurs. This directly addresses the remaining parts of Q1 (priority chains) and Q5 (content not in explicit JSON input).
