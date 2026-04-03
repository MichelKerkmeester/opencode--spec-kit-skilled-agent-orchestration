---
title: "Iteration 017: Regression Risk Analysis — Test Coverage Map"
focus: "regression-risk-analysis"
iteration: 17
status: complete
timestamp: "2026-04-01T12:30:00Z"
---

# Iteration 017: Regression Risk Analysis — Test Coverage Map

## Focus

Map the existing test suite for the generate-context pipeline to identify: (a) which test cases cover transcript-mode saves, (b) which test cases cover JSON-mode saves, (c) what gaps exist that could allow regressions when fixing JSON-mode quality.

## Findings

### 1. Comprehensive Vitest Test Suite Exists (30+ test files)

The `scripts/tests/` directory contains approximately 30 Vitest test files covering different aspects of the pipeline. The test runner is configured via `vitest` (v4.1.0) using `../mcp_server/vitest.config.ts` as the shared config. Tests run via `npm test` in the scripts workspace. There are also approximately 15 legacy `.js` test files that run separately via `npm run test:legacy`. [SOURCE: .opencode/skill/system-spec-kit/scripts/package.json:13-14]

### 2. Transcript-Mode Coverage is Strong via workflow-e2e.vitest.ts

The `workflow-e2e.vitest.ts` file provides full end-to-end save pipeline coverage using a `buildRichSessionData()` factory (from `fixtures/session-data-factory.ts`) that constructs complete SessionData objects. It tests 7 scenarios:

1. **Happy-path save** -- writes markdown + metadata, updates memorySequence and memoryNameHistory
2. **Stale lock clearing** -- clears abandoned .workflow-lock before save
3. **Write-skip-index on V2 failure** -- writes file but skips indexing when V2 validation fails
4. **Duplicate dedup** -- second identical save skips markdown write, does not bump sequence
5. **Same-minute unique filenames** -- two distinct saves in same minute produce different filenames
6. **Insufficient context abort** -- sparse data triggers INSUFFICIENT_CONTEXT_ABORT rejection
7. **Embedding failure resilience** -- markdown and description tracking commit even when indexing fails
8. **Tree-thinning merge notes** -- renders tree-thinning merge annotations correctly

However, all tests use `collectSessionDataFn` which bypasses the input normalization and conversation extraction layers. The tests inject pre-built SessionData directly. This means the transcript->SessionData path is tested at the workflow output level, but the extractor layer (conversation-extractor, session-extractor) is tested separately or not at all. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:384-640]

### 3. JSON-Mode Input Normalization Has Dedicated Coverage

The `runtime-memory-inputs.vitest.ts` file tests the JSON-mode input path through `normalizeInputData()` and `loadCollectedData()`. It covers:

- **Data loading/rejection**: missing file, invalid JSON, permission errors, path traversal
- **snake_case JSON shape**: `spec_folder`, `session_summary`, `user_prompts`, `recent_context`, `trigger_phrases` all survive normalization
- **FILES field transformation**: provenance metadata, ACTION normalization, backward compatibility
- **nextSteps normalization**: camelCase vs snake_case precedence, empty arrays, dedup of Next Steps observation, empty first step edge case
- **importanceTier override**: explicit `critical`, `temporary`, auto-detect behavior
- **Observation truncation priority**: followup observations preserved when exceeding MAX_OBSERVATIONS
- **extractNextAction regex fallback**: extracts from recentContext.learning, truncates at 100 chars

This is the most comprehensive JSON-mode test file. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:1-624]

### 4. No Test Exists for extractConversations() with JSON-Synthesized Data

The `collect-session-data.vitest.ts` tests `determineSessionStatus()` and `estimateCompletionPercent()` on already-normalized data. There is NO test that feeds raw JSON input (e.g., `{ sessionSummary, keyDecisions, observations }`) through the full chain `normalizeInputData()` -> `collectSessionData()` -> `extractConversations()` to verify that the conversation extractor produces meaningful MESSAGES from JSON-sourced data rather than the empty/synthetic fallback path documented in iteration 001. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:1-100]

### 5. Quality Scorer Tests Use Pre-Rendered Content Only

The `quality-scorer-calibration.vitest.ts` tests `scoreMemoryQuality()` with pre-rendered content strings. It validates V-rule penalty application, contamination severity caps (low: no cap, medium: 0.85, high: 0.60), and score01/score100 consistency. It does NOT test the score produced when the pipeline renders JSON-mode input, meaning a regression where JSON-mode produces thin rendered content would go undetected by these scorer tests. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts:1-212]

### 6. Contamination Filter Has No V8 Same-Parent Phase Test

The `contamination-filter.vitest.ts` tests severity tracking (low/medium/high), pattern matching (API error prefix, JSON error payload, request_id leak), and source-capability-aware downgrades for `tool title with path` patterns. It does NOT test the V8 same-parent phase reference scenario critical for JSON-mode saves where the AI explicitly provides cross-phase spec folder references. V8 lives in `validate-memory-quality.ts`, not `contamination-filter.ts` (per iteration 003 finding), but there is no unit test for V8's allowlist behavior either. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:1-128] [SOURCE: iteration-003 finding on V8 location]

### 7. Memory Sufficiency Tests Are Post-Render Only

The `memory-sufficiency.vitest.ts` tests `evaluateMemorySufficiency()` with pre-constructed memory content. It verifies: rich evidence passes, single-anchor prompt fails, rendered sections not counted as evidence, generic title fails, placeholder descriptions not counted, spec-specific tool evidence passes. This is post-render validation -- it catches thin JSON-mode output but only after the pipeline has already run. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:1-170]

### 8. The Session Data Factory Provides Realistic Fixtures But Only for Transcript Mode

The `fixtures/session-data-factory.ts` provides `buildRichSessionData()`, `buildSparseSessionData()`, and `buildTreeThinningSessionData()` which construct complete SessionData objects. These factories populate all fields (TITLE, SUMMARY, FILES, OUTCOMES, OBSERVATIONS, DECISIONS, TOOL_COUNTS, etc.) with realistic transcript-mode values. There is NO equivalent factory for JSON-mode-derived SessionData (data that would come from the normalizer fast/slow paths with synthesized MESSAGES). [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/fixtures/session-data-factory.ts:1-100]

### Additional Test Files Reviewed

| Test File | Covers | Mode | Relevant? |
|-----------|--------|------|:---------:|
| `generate-context-cli-authority.vitest.ts` | CLI arg passing (--json, data-file, spec-folder) | JSON | Yes -- verifies args reach workflow |
| `input-normalizer-unit.vitest.ts` | FILE_PATH coercion edge cases | JSON | Yes -- normalizeFileEntryLike |
| `memory-pipeline-regressions.vitest.ts` | Title truncation, trigger phrase filtering, embeddings | Both | Partial -- mode-agnostic |
| `validate-memory-quality.vitest.ts` | V13 YAML frontmatter parsing | Both | Partial -- mode-agnostic |
| `memory-template-contract.vitest.ts` | Structural anchor/section validation | Both | Partial -- structural only |
| `session-enrichment.vitest.ts` | Session enrichment pipeline | Transcript | Yes |
| `template-mustache-sections.vitest.ts` | Mustache section rendering | Both | Partial |
| `decision-confidence.vitest.ts` | Decision confidence scoring | Both | Partial |
| `trigger-phrase-filter.vitest.ts` | Trigger phrase quality filtering | Both | Partial |
| `content-filter-parity.vitest.ts` | Content filter behavior | Both | Partial |

## Test Coverage Matrix

| Component | Test File | Transcript-Mode | JSON-Mode | Gap? |
|-----------|-----------|:---:|:---:|:---:|
| CLI argument parsing | `generate-context-cli-authority.vitest.ts` | -- | Yes | No |
| Data loading / rejection | `runtime-memory-inputs.vitest.ts` | -- | Yes | No |
| Input normalization | `runtime-memory-inputs.vitest.ts` | -- | Yes | No |
| FILE_PATH coercion | `input-normalizer-unit.vitest.ts` | -- | Yes | No |
| Session data collection | `collect-session-data.vitest.ts` | Partial | No | **YES** |
| Conversation extraction | **None** | **MISSING** | **MISSING** | **YES** |
| Quality scoring | `quality-scorer-calibration.vitest.ts` | Pre-rendered | No | **YES** |
| Contamination (V8 allowlist) | **None** | **MISSING** | **MISSING** | **YES** |
| Memory sufficiency | `memory-sufficiency.vitest.ts` | Post-render | Post-render | No (detection, not prevention) |
| Template rendering quality | `memory-template-contract.vitest.ts` | Structural | Structural | **YES** (no content quality check) |
| Full E2E pipeline | `workflow-e2e.vitest.ts` | Yes (via factory) | **MISSING** | **YES** |
| SessionData factory | `session-data-factory.ts` | Yes | **MISSING** | **YES** |

## New Tests Needed to Prevent Regression

### Priority 1 (MUST have before any pipeline changes)

1. **JSON-mode full pipeline E2E** -- A new test in `workflow-e2e.vitest.ts` (or a companion file) that feeds a realistic JSON payload through `runWorkflow()` WITHOUT a `collectSessionDataFn` override. Assert: rendered markdown exists, quality score >= 50/100, no boilerplate/placeholder sections, title is not generic.
2. **JSON-mode SessionData factory** -- Add a `buildJsonModeSessionData()` to `session-data-factory.ts` that constructs SessionData as it would be produced from normalized JSON input (with sparse MESSAGES, observations-as-OBSERVATIONS, manual decisions).
3. **Conversation extractor JSON path** -- Unit test `extractConversations()` with normalized data that has observations + sessionSummary but empty userPrompts. Assert: produces non-empty MESSAGES array, no `[object Object]` artifacts.

### Priority 2 (SHOULD have)

4. **V8 same-parent phase reference** -- Unit test for validate-memory-quality.ts V8 rule with cross-phase spec folder references from the same parent. Assert: same-parent references pass V8 allowlist.
5. **Quality scorer with JSON-rendered content** -- Integration test: render JSON-mode data -> feed to `scoreMemoryQuality()`. Assert: score >= 0.50, no spurious contamination cap.
6. **Sparse JSON regression** -- Test `normalizeInputData()` with sessionSummary + keyDecisions only (no observations, no FILES). Assert: produces at least 2 observations (summary + decision), non-empty recentContext.

### Priority 3 (NICE to have)

7. **FILES capping** -- Test that 100+ filesModified entries are capped at a configurable limit.
8. **Code block contamination exclusion** -- Test that markdown code fences in observation narratives do not trigger contamination false-positives.

## Ruled Out

- `mcp_server/tests/` files: these cover MCP handler tests (memory_save, memory_search), not the generate-context CLI pipeline.
- Legacy `.js` test files (`test-scripts-modules.js`, `test-extractors-loaders.js`): CommonJS module smoke tests, not quality-focused.

## Dead Ends

None -- this was a mapping exercise, not an exploratory search.

## Sources Consulted

- `.opencode/skill/system-spec-kit/scripts/package.json` (test configuration)
- `.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts` (E2E save pipeline)
- `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts` (JSON input normalization)
- `.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts` (session data extraction)
- `.opencode/skill/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts` (quality scoring)
- `.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts` (contamination patterns)
- `.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts` (sufficiency evaluation)
- `.opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality.vitest.ts` (V-rule validation)
- `.opencode/skill/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts` (template contract)
- `.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts` (CLI argument passing)
- `.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts` (FILE_PATH normalization)
- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/session-data-factory.ts` (SessionData fixture builders)
- `.opencode/skill/system-spec-kit/scripts/tests/memory-pipeline-regressions.vitest.ts` (title truncation, trigger filtering)
- Prior iteration findings (iterations 001, 003, 005, 006, 015, 016)

## Assessment

- New information ratio: 0.75
- Questions addressed: ["What regression risks exist when modifying the JSON-mode pipeline?", "What test coverage exists for JSON-mode vs transcript-mode?"]
- Questions answered: ["What regression risks exist when modifying the JSON-mode pipeline?"] -- 6 critical gaps identified in the coverage matrix, with 8 specific new test recommendations prioritized.

## Reflection

- What worked and why: Systematic reading of each test file and mapping coverage per component. The matrix format made gaps visible immediately. Cross-referencing with prior iteration findings (especially iterations 001, 003, 005 on conversation extractor, V8, and decision repetition) enriched the gap analysis.
- What did not work and why: The initial JSONL state read returned stale data (only run 1), which caused a false start. Should have cross-checked with iteration file listing immediately.
- What I would do differently: Start by listing all existing iteration files first before reading JSONL state, since the JSONL may be incomplete.

## Recommended Next Focus

Edge case analysis for JSON-mode saves: enumerate specific edge case inputs (partial JSON, extremely long fields, markdown in observations) and document expected behavior for each. This directly feeds into test case design for the Priority 1 tests.
