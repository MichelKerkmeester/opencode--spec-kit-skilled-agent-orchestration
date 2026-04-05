# Review Iteration 3: Traceability - Spec/Checklist/Decision Record Cross-Reference

## Focus
Traceability dimension: Cross-reference all 6 spec.md recommendations, checklist.md [SOURCE:] claims, decision-record.md DR-001 through DR-006, and tasks.md evidence against the actual implementation code.

## Scope
- Review target: All 6 spec docs + 9 implementation files
- Spec refs: spec.md Recs 1-6, checklist.md all [SOURCE:] lines, decision-record.md DR-001 to DR-006, tasks.md Waves 1-4
- Dimension: traceability

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| checklist.md | - | - | 7 | - |
| decision-record.md | - | - | 6 | - |
| spec.md | - | - | 8 | - |
| tasks.md | - | - | 8 | - |

## Findings

### P1-002: DR-002 claims _source:'json' flag but code implements no such property
- Dimension: traceability
- Evidence: [SOURCE: decision-record.md:17] says "New `_source: 'json'` flag that preserves messages through the pipeline." [SOURCE: conversation-extractor.ts:57-127] -- the actual `extractFromJsonPayload()` function creates plain message objects with only TIMESTAMP, ROLE, CONTENT, TOOL_CALLS fields. No `_source` property is set on any message.
- Cross-reference: [SOURCE: checklist.md:20] says "Messages NOT marked with _synthetic:true [no _synthetic flag used; plain User/Assistant ROLE]" -- this is accurate (no _synthetic), but it does NOT mention `_source: 'json'` either, contradicting the decision record.
- Impact: The decision record documents an architectural choice (`_source: 'json'` flag) that was never implemented. Anyone reading DR-002 to understand the codebase would believe messages carry a `_source` marker for downstream identification. The actual approach is implicit (no flag at all), which means there is no runtime mechanism to distinguish JSON-sourced messages from transcript messages in downstream consumers.
- Skeptic: The decision may describe the _intent_ rather than the implementation, or the flag may have been planned and then simplified away. The code works without it because the JSON path is entered only when `userPrompts.length === 0`, so the absence of a flag has no functional bug. The DR should still reflect what was shipped.
- Referee: Confirmed traceability gap. The decision record describes a mechanism that does not exist in the code. This is not a runtime bug but a documentation accuracy issue that could mislead future maintainers. P1 is appropriate because DR accuracy is a gating traceability concern.
- Final severity: P1

```json
{"type":"claim-adjudication","claim":"DR-002 documents _source:'json' flag implementation, but no such property exists on messages created by extractFromJsonPayload().","evidenceRefs":["decision-record.md:17","conversation-extractor.ts:57-127","checklist.md:20"],"counterevidenceSought":"Searched for _source or _jsonSourced across conversation-extractor.ts and workflow.ts. No such property is set on ConversationMessage objects.","alternativeExplanation":"The flag may have been designed but simplified away during implementation because the JSON branch is already gated by userPrompts.length === 0, making an explicit flag unnecessary.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"If _source:'json' is set elsewhere in a transformer or post-processor not in the review scope, this finding would be invalid."}
```

### P2-007: Checklist references filesChanged at line 754 but actual location is line 797
- Dimension: traceability
- Evidence: [SOURCE: checklist.md:13] says "[SOURCE: input-normalizer.ts:754]" for filesChanged in KNOWN_RAW_INPUT_FIELDS. [SOURCE: input-normalizer.ts:795-797] -- KNOWN_RAW_INPUT_FIELDS is declared at line 795, and `filesChanged` appears within the set at line 797. Line 754 is actually the `_manualDecisions` assignment in the slow-path normalization function.
- Impact: A 43-line offset in the [SOURCE:] reference. Anyone following the checklist to verify the claim would land on unrelated code. Low severity because the feature IS implemented, just the line reference is wrong.
- Final severity: P2

### P2-008: Checklist references !jsonModeHandled at line 324 but actual location is line 327
- Dimension: traceability
- Evidence: [SOURCE: checklist.md:21] says "[SOURCE: conversation-extractor.ts:324]" for the `!jsonModeHandled` guard. [SOURCE: conversation-extractor.ts:327] -- the actual guard is at line 327: `if (!jsonModeHandled && userPrompts.length <= 1 && collectedData.sessionSummary)`. Line 324 is an empty line after `.push(entry.message)`.
- Impact: 3-line offset. Minor but contributes to pattern of imprecise line references. The feature IS correctly implemented.
- Final severity: P2

### P2-009: Spec.md lists data-loader.ts as modified file but it is absent from review scope and tasks.md
- Dimension: traceability
- Evidence: [SOURCE: spec.md:120] lists "data-loader.ts | loaders/ | 1 | 5" as a file to modify. [SOURCE: tasks.md:1-54] -- data-loader.ts is not mentioned anywhere in tasks.md. The 9-file review scope (from config) also does not include data-loader.ts.
- Cross-reference: [SOURCE: spec.md:72] says Rec 1 touches "workflow.ts, data-loader.ts, input-normalizer.ts, session-types.ts". But the actual implementation wired normalization through workflow.ts:615-619 without any data-loader.ts changes.
- Impact: Spec-to-implementation gap. The spec predicted a data-loader.ts change that was unnecessary. This is a planning artifact that was never cleaned up. Future readers may wonder if the data-loader change was forgotten or intentionally skipped.
- Final severity: P2

### P2-010: Multiple checklist line references have minor offsets (systematic pattern)
- Dimension: traceability
- Evidence: Systematic pattern of line reference inaccuracies across checklist.md:
  - checklist.md:38 says `workflow-path-utils.ts:97` for the 20-file cap, actual: line 99 (.slice(0,20))
  - checklist.md:39 says `workflow-path-utils.ts:63, 95` for iteration exclusion, actual: line 64 (ignoredDirs), line 97 (filter)
  - checklist.md:18 says `conversation-extractor.ts:51-130` for extractFromJsonPayload, actual: function at lines 57-127 (doc comment starts ~51)
  - checklist.md:19 says `conversation-extractor.ts:67-74` for User-role message, actual: message push at lines 69-74
- Impact: Individually trivial (1-3 line offsets), but collectively they form a pattern indicating line references were estimated rather than verified post-implementation. This reduces confidence in all unchecked references.
- Final severity: P2

## Cross-Reference Results

### Core Protocols
- Confirmed:
  - spec_code Rec 1 (normalization wiring): workflow.ts:615-619 calls normalizeInputData() as specified [PASS]
  - spec_code Rec 2 (message synthesis): extractFromJsonPayload() at conversation-extractor.ts:57-127 matches spec [PASS]
  - spec_code Rec 3 (title/description): collect-session-data.ts:1020-1030 derives title from sessionSummary [PASS]
  - spec_code Rec 4 (decisions): decision-extractor.ts:273 sets DESCRIPTION='' for plain-string, line 338 sets CONTEXT='' [PASS]
  - spec_code Rec 4 (key_files cap): workflow-path-utils.ts:64,97,99 excludes iterations, caps at 20 [PASS]
  - spec_code Rec 5 (V8 sibling): validate-memory-quality.ts:562-583 builds sibling allowlist [PASS]
  - spec_code Rec 5 (structured skip): validate-memory-quality.ts:803-810 skips scattered detection for structured [PASS]
  - spec_code Rec 6 (quality floor): quality-scorer.ts quality floor exists (confirmed in iteration 1)
  - checklist_evidence: 23 of 27 checked items verified with correct or near-correct evidence [PASS]
  - tasks_evidence: All 4 waves implemented with matching code evidence [PASS]
- Contradictions:
  - DR-002 _source:'json' flag not implemented (P1-002)
  - spec.md data-loader.ts listed but never modified (P2-009)
  - 6 checklist line references have 1-43 line offsets (P2-007, P2-008, P2-010)
- Unknowns:
  - checklist.md line 10 sessionSummary slow-path ref "input-normalizer.ts:693-695": actual slow-path sessionSummary→userPrompts is at line 738-740. Could not verify exact claim without re-reading that region (budget constraint).

### Overlay Protocols
- Not applicable (no skill/agent/feature-catalog overlay for this review target)

## Ruled Out
- **tasks.md Wave ordering mismatch**: Investigated whether waves were implemented out of order. All 4 waves are marked [x] with consistent evidence. No ordering issue found.
- **DR-001 implementation mismatch**: DR-001 says "wire JSON through existing normalization at workflow.ts:613". Actual implementation is at workflow.ts:615 (normalizeInputData call) and 618-619 (spread merge). The 2-line offset is within the same logical block. Not a meaningful gap.
- **DR-003 V8 relaxation too broad**: DR-003 says "Add sibling phase names to V8's existing allowedIds mechanism. Do NOT disable V8 for all JSON input." Code at validate-memory-quality.ts:562-583 adds siblings to allowedIds (correct), and lines 803-810 skip only scattered detection for structured mode while keeping dominance-based detection. This matches DR-003 intent.
- **DR-004 quality floor implementation**: DR-004 describes floor = jsonFloor * 0.85, capped at 70/100. Confirmed in iteration 1 at quality-scorer.ts:277-278.
- **DR-005 filesChanged alias**: DR-005 describes adding filesChanged as alias. Confirmed at input-normalizer.ts:797 in KNOWN_RAW_INPUT_FIELDS and mapped at lines 519-522 (fast-path) and 641-649 (slow-path).
- **DR-006 key_files cap**: DR-006 describes cap at 20, excluding iterations. Confirmed at workflow-path-utils.ts:64,97,99.

## Sources Reviewed
- [SOURCE: spec.md:1-142] -- All 6 recommendations and file table
- [SOURCE: checklist.md:1-72] -- All P0/P1/P2/P3 items and acceptance criteria
- [SOURCE: tasks.md:1-54] -- All 4 waves and sub-tasks
- [SOURCE: decision-record.md:1-48] -- DR-001 through DR-006
- [SOURCE: conversation-extractor.ts:45-139] -- extractFromJsonPayload function
- [SOURCE: conversation-extractor.ts:315-334] -- jsonModeHandled guard
- [SOURCE: collect-session-data.ts:860-909] -- SUMMARY derivation
- [SOURCE: collect-session-data.ts:1010-1039] -- TITLE derivation
- [SOURCE: workflow.ts:608-627] -- preloaded data normalization
- [SOURCE: decision-extractor.ts:265-349] -- OPTIONS and CONTEXT for plain-string decisions
- [SOURCE: input-normalizer.ts:685-764] -- slow-path normalization
- [SOURCE: input-normalizer.ts:795-797] -- KNOWN_RAW_INPUT_FIELDS
- [SOURCE: input-normalizer.ts:906-907] -- filesChanged validation
- [SOURCE: validate-memory-quality.ts:550-594] -- V8 sibling allowlist
- [SOURCE: validate-memory-quality.ts:795-810] -- structured inputMode scattered skip
- [SOURCE: workflow-path-utils.ts:55-101] -- key_files enumeration and cap

## Assessment
- Confirmed findings: 5 (1 P1, 4 P2)
- New findings ratio: 1.00
- noveltyJustification: First traceability iteration; all 5 findings are new. Severity-weighted: 1 P1 (5.0) + 4 P2 (1.0 each) = 9.0 total, all new.
- Dimensions addressed: [traceability]

## Reflection
- What worked: Systematic cross-reference of each spec doc section against code. Reading decision-record.md and then grepping for the claimed mechanism (_source:'json') was the most productive approach, immediately surfacing the P1.
- What did not work: Attempting to verify every single checklist line reference would have exceeded budget. Prioritized the most specific claims (exact line numbers) and spot-checked the rest.
- Next adjustment: For maintainability dimension, focus on code clarity, pattern consistency, and documentation quality within the implementation files themselves rather than cross-referencing spec docs.
