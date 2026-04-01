# Deep Research Strategy: Memory Save Quality Pipeline

## Focus Areas

1. **Conversation Extractor Architecture** — How the dual-source extraction should work
2. **Quality Scoring Model** — Dimensions and weights for JSON vs transcript modes
3. **Contamination Detection** — V8 rule refinement for same-parent references
4. **Template Rendering** — Boilerplate elimination and observation mapping
5. **Trigger Phrase Extraction** — NLP strategies for structured text
6. **Key Files Scoping** — Filtering and capping strategies
7. **Decision Rendering** — De-duplication and enrichment
8. **Integration Testing** — End-to-end quality validation

## Answered Questions

- [x] **How can decision rendering avoid 4x text repetition when only keyDecision text is available?** — Add IS_COMPACT flag to DecisionRecord; when true, suppress CONTEXT/OPTIONS/CHOSEN fields and use compact template block. Fix CONTEXT assignment to not concatenate title+rationale. ~25 LOC extractor + ~10 LOC template. (Iterations 005, 015)
- [x] **What is the optimal trigger phrase extraction strategy for structured JSON input?** — Enrich triggerSourceParts with observation titles/narratives, add keyTopics as phrases, extract capitalized/hyphenated compounds. Add Stage 4 semantic specificity filter, plural normalization dedup, word-set containment dedup. ~60 LOC across workflow.ts. Also: add exchanges[].userInput as trigger source (strong intent signals). (Iterations 012, 016)
- [x] **How can V8 contamination filter distinguish same-parent phase refs from genuine cross-spec contamination?** — Add upward sibling walk in extractAllowedSpecIds() + source-aware scattered threshold relaxation for JSON-mode + explicit relatedSpecs allowlist from JSON payload. ~15 LOC in validate-memory-quality.ts. (Iterations 009, 013)
- [x] **How should extractConversations() build MESSAGES from sessionSummary/keyDecisions when userPrompts is empty?** — Dual-path design: JSON path activates when userPrompts empty AND (exchanges[] or sessionSummary present). Uses _jsonSourced flag (distinct from _synthetic) to avoid filtering. Strategy A: exchanges[] for pre-structured pairs. Strategy B: sessionSummary synthesis with extractSessionTopic() for User message. ~120 LOC new function. (Iterations 010, 011)
- [x] **How should the template renderer handle JSON-sourced observations vs transcript-sourced ones?** — Coerce string observations to Observation objects in collect-session-data.ts before truncation. String gets title (truncated to 80 chars) + narrative (full string) + type='implementation'. ~12 LOC. (Iteration 014)
- [x] **What key_files scoping strategy prevents 300+ entry lists while preserving useful file references?** — Cap at MAX_KEY_FILES=20 with priority order: session-captured > git-derived > synthetic/spec-folder. Replace buildKeyFiles() body in workflow-path-utils.ts. ~25 LOC. (Iteration 014)
- [x] **What quality scoring dimensions should apply to JSON-mode inputs vs transcript inputs?** — Score floor approach: 6 dimensions (D1-D6: summary 25pts, decisions 20pts, exchanges 20pts, tools 10pts, triggers 15pts, metadata 10pts) compute a floor. Floor is damped by 0.85x and capped at 0.70. Applied after V-rule scoring but NOT when contamination cap is active. Minimal disruption to existing V-rule pipeline. ~80 LOC in quality-scorer.ts. (Iteration 012)

- [x] **What quality scoring dimensions should apply to JSON-mode inputs vs transcript inputs?** -- Existing 6-dimension scorer works if conversation extractor produces rich messages from JSON data. Minor adjustments: raise observation-absent base from 5 to 8 for structured mode, add trigger phrase floor of 10 for rich sessionSummary. ~16 LOC in quality-scorer.ts. (Iterations 019, 020)
- [x] **What is the minimum viable JSON payload that should produce >= 50/100 quality memory?** -- sessionSummary (200+ chars) + 2 keyDecisions = projected 50-60/100. With 4 observations: 68-92 raw, 55-75 effective. MVP fix (Items 1+2+3, ~97 LOC) achieves this. (Iteration 020)

## What Worked

- **Iteration 001**: Line-by-line reading of conversation-extractor.ts revealed the full data flow.
- **Iteration 005**: Tracing fallback chains in decision-extractor.ts with specific line numbers pinpointed the exact 4x repetition cause.
- **Iteration 006**: Reading generate-context.ts first to understand CLI entry points, then tracing into data-loader.ts and input-normalizer.ts, revealed the --json path bypasses data-loader entirely.
- **Iteration 009**: Complete file read of validate-memory-quality.ts (998 lines) yielded full V1-V14 rule inventory with JSON-mode risk assessment per rule.
- **Iteration 010**: Tracing actual function call chain from CLI entry through each pipeline stage revealed the normalization bypass.
- **Iteration 011**: Reading conversation-extractor.ts and session-types.ts together revealed the exchanges field as the primary JSON message source. The dual-path approach with separate extractFromJsonPayload() function is architecturally clean.
- **Iteration 012**: Analyzing the V2 scorer's penalty-from-1.0 model showed that a score floor is the minimal-disruption integration pattern. Concrete scoring examples validated the floor cap at 0.70.
- **Iteration 013**: Direct code reading of validate-memory-quality.ts revealed exact V8 detection algorithm and extractAllowedSpecIds() gap.
- **Iteration 014**: Tracing full data flow from JSON input through collect-session-data.ts to workflow.ts template assembly identified observation coercion gap and missing key_files cap.
- **Iteration 015**: Direct code tracing through decision-extractor.ts field assignments to template rendering. Precisely mapped the duplication paths.
- **Iteration 016**: Pipeline stage mapping (5 stages, 3 quality gates) for trigger phrase extraction clarified that fixes belong at stages 1 and 4.
- **Iteration 017**: Systematic reading of each test file and mapping coverage per component. Matrix format made gaps visible immediately. Cross-referencing with prior iteration findings enriched the gap analysis.
- **Iteration 018**: Tracing each edge case through normalizer code paths (fast vs slow), then mapping downstream effects through contamination filter, quality scorer, sufficiency gate, and template renderer. Prior iteration findings provided downstream context without needing re-reads.

## What Failed

- **Iteration 006**: Attempted to confirm whether runWorkflow() calls validateInputData() for --json input, but could not read workflow.ts within scope.
- **Iteration 013**: Initial assumption that contamination-filter.ts was involved in V8 spec-ID detection was incorrect.
- **Iteration 014**: Searching for filesChanged field returned zero codebase matches.

## Exhausted Approaches

(none yet)

## Next Focus

**RESEARCH COMPLETE.** All 8 research questions answered. Proceed to implementation phase. Implementation order: P0 (types + data-loader) -> P1 (conversation extractor) -> P2 (quality scorer + workflow triggers) -> P3 (template + decisions) -> P4 (contamination filter) -> P5 (key files cap). MVP subset: P0 + P1 + P2 = ~97 LOC fixes the critical 0/100 quality symptom.


## Iteration Plan

- Iterations 001-005: Deep code reading of each extractor, scorer, and renderer
- Iterations 006-010: Identify all code paths affected by JSON-mode, map data flow gaps
- Iteration 011: Dual-source conversation extraction design -- COMPLETE
- Iteration 012: JSON-mode quality scoring model design -- COMPLETE
- Iteration 013: V8 contamination filter fix design -- COMPLETE
- Iteration 014: Template population and key_files scoping fixes design -- COMPLETE
- Iteration 015: Decision renderer de-duplication fix design -- COMPLETE
- Iteration 016: Trigger phrase extraction pipeline analysis -- COMPLETE
- Iteration 017: Regression risk analysis -- test coverage map -- COMPLETE
- Iteration 018: Edge case analysis -- JSON-mode save inputs -- COMPLETE
- Iterations 019-020: Regression risk assessment, implementation ordering

## Key Findings So Far

### Iteration 011 -- Dual-Source Conversation Extraction Design
- Dual-path activation: JSON path when userPrompts.length === 0 AND (exchanges[] present OR sessionSummary non-trivial)
- Strategy A (exchanges[]): Map pre-structured User/Assistant pairs with tool call matching
- Strategy B (sessionSummary): Synthesize User message via extractSessionTopic(), Assistant from summary text
- _jsonSourced flag on ConversationMessage distinguishes AI-composed from simulation-generated content
- Edge cases: empty exchanges, short summaries, mixed mode (userPrompts + exchanges)

### Iteration 012 -- JSON-Mode Quality Scoring Model
- Score floor approach: 6 dimensions (D1-D6) totaling 100 points, damped by 0.85x, capped at 0.70
- Floor applied after V-rule scoring but NOT when contamination cap is active
- Trigger phrase extraction: add exchanges[].userInput as trigger source (strong intent signals)
- Concrete examples: minimal save -> floor 0.10, good save -> floor 0.47, excellent save -> floor 0.70 (capped)

### Iteration 013 -- V8 contamination filter fix design
- V8 detects foreign spec IDs via 3 checks: dominance, scattered, frontmatter
- extractAllowedSpecIds() only walks DOWN never UP -- root cause of false positives
- Fix: 1-level upward sibling walk + scattered threshold relaxation for JSON-mode + relatedSpecs allowlist

### Iteration 014 -- Template population and key_files scoping fixes design
- Title: swap priority when task is generic and sessionSummary is present (~10 LOC)
- Observations: coerce strings to Observation objects (~12 LOC)
- Key files: MAX_KEY_FILES=20 with priority ordering (~25 LOC)

### Iteration 015 -- Decision Renderer De-duplication Fix Design
- 5 fields all default to the same source text for string-form decisions
- Fix: Add IS_COMPACT flag with compact template block showing only TITLE + optional RATIONALE + CONFIDENCE

### Iteration 016 -- Trigger Phrase Extraction Pipeline Analysis
- Pipeline has 5 stages: source assembly, auto-extraction, manual merge, quality filter, minimum guarantee
- Fix: Enrich triggerSourceParts with observation titles/narratives + capitalized/hyphenated compound extraction
- Add Stage 4 to filterTriggerPhrases: semantic specificity filter removing generic bigrams

### Iteration 003 (rewrite) -- contamination-filter.ts + V8 trace
- 47 DenylistEntry patterns (14 high, 12 medium, 21 low); V8 is NOT a denylist pattern but a validation rule in validate-memory-quality.ts
- V8 allowlist: path ancestors + child phase folders + related_specs; cross-phase refs trigger via dominatesForeignSpec or scatteredForeignSpec
- Pre-render ALIGNMENT_BLOCK at workflow.ts:650-672 is separate from V8; dynamic severity downgrade for toolTitleWithPath
- V8 allowlist fallback for missing spec_folder frontmatter at validate-memory-quality.ts:627-638

### Iteration 004 (rewrite) -- template-renderer.ts + context_template.md
- Custom 217-line Mustache engine (3-pass: array loops, inverted sections, variables); missing vars render empty with warnings
- "Session focused on implementing and testing features." at collect-session-data.ts:873 via 3-level fallback chain
- OBSERVATION blocks from buildObservationsWithAnchors() in file-extractor.ts:330-374; JSON-mode yields 1 feature obs via buildSessionSummaryObservation()
- CONTEXT_SUMMARY (Phase + recent titles) is distinct from SUMMARY (learning -> observation titles -> hardcoded)

### Iteration 007 -- workflow.ts Step 7-8 data flow
- Step 7 runs 5 extractors in parallel via Promise.all (workflow.ts:979-1027)
- extractConversations receives raw collectedData; sessionDataFn receives narrativeCollectedData (post-contamination filter) -- divergent observation sets
- Trigger phrases extracted during Step 8 (lines 1174-1263) from SUMMARY + decisions + file descriptions + folder tokens, through 6-stage pipeline
- Key topics from core/topic-extractor.ts (NOT session-extractor.ts version) -- session-extractor.ts extractKeyTopics is dead code from workflow perspective
- Quality scoring at Step 8.6 (lines 1449-1484): validateContent -> sufficiency -> scoreV2 -> injectMetadata
- Template merge spreads sessionData then conversations then workflowData -- conversations OVERWRITES same-named sessionData fields (TOOL_COUNT patch at line 1286 for captured-session mode)
- KEY_FILES buildKeyFiles() has no cap on fallback listSpecFolderKeyFiles() recursive walk

### Iteration 017 -- Regression Risk Analysis: Test Coverage Map
- 30+ Vitest test files exist; transcript-mode well-covered by workflow-e2e.vitest.ts (7 scenarios via SessionData factory)
- JSON-mode normalization covered by runtime-memory-inputs.vitest.ts (snake_case, FILES, nextSteps, importanceTier)
- 6 critical coverage gaps: (1) no conversation extractor JSON path test, (2) no quality scorer with JSON-rendered content, (3) no V8 same-parent phase test, (4) no full JSON-mode E2E pipeline test, (5) no JSON-mode SessionData factory, (6) no template rendering quality test for JSON content
- 8 new test recommendations prioritized: P1 (must-have before changes), P2 (should-have), P3 (nice-to-have)
- workflow-e2e.vitest.ts bypasses normalization via collectSessionDataFn -- tests workflow outputs not extraction quality

### Iteration 018 -- Edge Case Analysis: JSON-Mode Save Inputs
- 8 edge cases analyzed (A-H) with risk levels: 3 HIGH (B: keyDecisions-only generic title, D: code blocks in observations, F: 100+ filesModified), 3 MEDIUM (A, E, H), 2 LOW (C, G)
- Case B (keyDecisions only, no sessionSummary): generic title triggers sufficiency rejection -- functional bug
- Case D (markdown code blocks): contamination filter lacks markdown awareness, false-positive HIGH severity on code examples caps quality at 0.60
- Case F (100+ files): no FILES cap, oversized memories with diluted embeddings and placeholder descriptions
- Case E (>10K sessionSummary): no SUMMARY length cap, recentContext fields store full text uncapped
- Priority fix order: B > D > F > E > H > A

### Iteration 008 -- session-extractor.ts + file-extractor.ts metadata generation
- TITLE always from folder basename (collect-session-data.ts:1017) via path.basename(folderName).replace(/^\d{3}-/, '').replace(/-/g, ' ') -- never from JSON sessionSummary
- SUMMARY cascade: rawLearning -> observationFallback -> 'Session focused on implementing and testing features.' (line 873)
- Generic text fires when rawLearning is empty AND observation titles are empty/non-topical
- sessionSummary from JSON passed as _JSON_SESSION_SUMMARY (line 1034) for title enrichment only, never as SUMMARY candidate
- contextType honors explicit JSON via RC5 fix (session-extractor.ts:601-606); detectContextType defaults 'general' when toolCounts all zero and decisionCount is 0
- importanceTier defaults 'normal' unless files contain critical segments or contextType is 'planning'
- projectPhase RC5-ext fix (collect-session-data.ts:894-909) infers from contextType when no explicit phase
- extractFilesFromData caps FILES at MAX_FILES_IN_MEMORY=10 (config.ts:232) -- this cap does NOT apply to KEY_FILES in buildKeyFiles()
- session-extractor.ts extractKeyTopics (lines 535-561) double-weights decision text and processes CHOSEN field, but is NOT used by workflow (dead code from pipeline perspective)
