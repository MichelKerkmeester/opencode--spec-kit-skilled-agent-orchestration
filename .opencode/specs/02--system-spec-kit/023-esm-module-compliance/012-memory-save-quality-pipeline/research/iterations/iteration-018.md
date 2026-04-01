---
title: "Iteration 018: Edge Case Analysis — JSON-Mode Save Inputs"
focus: "edge-case-analysis"
iteration: 18
status: complete
timestamp: "2026-04-01T12:45:00Z"
---

# Iteration 018: Edge Case Analysis — JSON-Mode Save Inputs

## Focus

Systematically enumerate edge cases for JSON-mode saves and document expected behavior for each. This directly informs test case design and guards against regressions when fixing the pipeline. The six cases were specified in the dispatch: (a) sessionSummary but no keyDecisions, (b) keyDecisions but no sessionSummary, (c) only nextSteps, (d) observations with markdown/code blocks, (e) extremely long sessionSummary, (f) 100+ filesChanged paths.

## Findings

### Edge Case A: JSON with sessionSummary but no keyDecisions

**Input:**
```json
{
  "sessionSummary": "Implemented the ESM module compliance audit across all script files.",
  "specFolder": "023-esm-module-compliance"
}
```

**Current Behavior:** The `normalizeInputData()` SLOW path activates (no `userPrompts`, `observations`, or `recentContext` present -- per the guard at line 468). It builds:
1. A session summary observation via `buildSessionSummaryObservation()` with type `feature`, title truncated at 100 chars (word-boundary), narrative truncated at 500 chars (T09b increased from 200).
2. A `recentContext` entry where both `request` and `learning` equal the full summary text (NO truncation on recentContext fields).
3. No decision observations since `keyDecisions` is empty/absent.
4. `_manualDecisions` is NOT set.

The conversation extractor downstream receives 0 `userPrompts` and hits the fallback path (iteration 001 finding: lines 241-267), creating 1-3 synthetic Assistant-role messages from the sessionSummary via `String()` coercion. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:445-595] [SOURCE: iteration-001 finding on conversation extractor fallback]

**Expected Behavior:** Should produce a valid memory. The session summary provides enough semantic content for the title, OVERVIEW section, and CONTINUE SESSION anchor. Quality score should be low (no files, no decisions, no tool evidence) but the memory should NOT be rejected as insufficient if the summary text is substantive (>100 chars with spec-relevant keywords).

**Risk Level:** MEDIUM -- The pipeline handles this but the rendered output has boilerplate sections (empty DECISIONS, empty FILES) that drag quality down. The conversation section will contain synthetic messages that may trip contamination checks.

**Test recommendation:** Assert that a sessionSummary-only JSON input produces a memory with score >= 30/100 and passes sufficiency IF the summary contains spec-relevant terms.

---

### Edge Case B: JSON with keyDecisions but no sessionSummary

**Input:**
```json
{
  "keyDecisions": [
    "Use ESM imports instead of CommonJS require() for all new modules.",
    "Keep backward-compatible re-exports in index.ts files during migration."
  ],
  "specFolder": "023-esm-module-compliance"
}
```

**Current Behavior:** The slow path activates again. `sessionSummary` is absent so `buildSessionSummaryObservation()` is called with an empty/undefined string, producing a feature observation with empty title and narrative. The `keyDecisions` array IS processed:
1. Each string is fed through `transformKeyDecision()` (lines 198-261) which extracts a title (first sentence up to 200 chars), attempts a `chosenApproach` regex match (looking for "chose/selected/decided on/using/went with/opted for/implemented"), and builds a decision observation with facts: `Option 1: ...`, `Chose: ...`, `Rationale: ...`.
2. The decisions become observations with type `decision` and confidence 0.50 (no explicit chosenApproach) or 0.65 (regex match found).
3. `_manualDecisions` is also populated for downstream use by the decision extractor.

The CRITICAL problem: without sessionSummary, the title builder in `core/title-builder.ts` will either use the empty string or fall back to a generic "Development session" title. The sufficiency gate at `evaluateMemorySufficiency()` explicitly checks for generic titles and REJECTS them (confirmed in `memory-sufficiency.vitest.ts` test "fails long content when the memory title stays generic"). [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:198-261, 547-564] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:94-123]

**Expected Behavior:** Should produce a valid memory -- the decisions provide real semantic substance. The title builder SHOULD derive a meaningful title from the keyDecisions when sessionSummary is absent (e.g., "ESM imports migration decisions" from the first decision). Currently, this path produces a generic title -> sufficiency rejection, which is incorrect for substantive decisions.

**Risk Level:** HIGH -- Generic title triggers sufficiency failure. This is a functional bug, not just a quality issue.

**Test recommendation:** Assert that keyDecisions-only input produces a non-generic title (not "Development session") and passes sufficiency.

---

### Edge Case C: JSON with only nextSteps

**Input:**
```json
{
  "nextSteps": [
    "Run the full ESM compliance test suite.",
    "Update import paths in scripts/core/."
  ],
  "specFolder": "023-esm-module-compliance"
}
```

**Current Behavior:** The slow path activates. No sessionSummary means empty summary observation. `nextSteps` is processed by `buildNextStepsObservation()` which creates a `followup` type observation titled "Next Steps" with facts: `Next: Run the full ESM compliance test suite.`, `Follow-up: Update import paths in scripts/core/.`. The first next step becomes `NEXT_ACTION` in SessionData via `collectSessionData()`.

With no observations of substance, no userPrompts, no recentContext, no files, and no sessionSummary, the memory is extremely thin. The sufficiency gate should reject this: no primary evidence items, no spec-relevant observations, and if any title is generated it will be generic. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:323-412 (nextSteps normalization tests)] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:49-71 (insufficient context pattern)]

**Expected Behavior:** CORRECTLY REJECTED by the sufficiency gate. Next steps alone do not constitute durable context -- they are forward-looking pointers without evidence of work done. Expected rejection code: `INSUFFICIENT_CONTEXT_ABORT`.

**Risk Level:** LOW -- Existing sufficiency gate handles this correctly. No fix needed.

**Test recommendation:** Assert that nextSteps-only input is rejected with `INSUFFICIENT_CONTEXT_ABORT`.

---

### Edge Case D: JSON with observations containing markdown/code blocks

**Input:**
```json
{
  "sessionSummary": "Fixed ESM import resolution in the MCP server.",
  "observations": [
    {
      "type": "implementation",
      "title": "Import path fix",
      "narrative": "Changed `require('./lib/search')` to `import { search } from './lib/search.js'`. The `.js` extension is required:\n\n```typescript\n// Before\nconst { search } = require('./lib/search');\n\n// After\nimport { search } from './lib/search.js';\n```\n\nFollows Node.js ESM rules.",
      "facts": ["Tool: Edit File: mcp_server/lib/index.ts", "Result: Import resolution works under ESM."]
    }
  ],
  "specFolder": "023-esm-module-compliance"
}
```

**Current Behavior:** The FAST path activates (observations array is present -- per the guard at line 468). Observations are cloned and passed through as-is. The narrative text containing markdown code fences flows into the template renderer which embeds it in the OBSERVATIONS section. The contamination filter runs on the rendered output.

**Contamination Risk Analysis:** The rendered content will contain:
- `` `require('./lib/search')` `` -- inline code that may match contamination patterns
- `import { search } from './lib/search.js'` -- contains file path pattern
- `Tool: Edit File: mcp_server/lib/index.ts` in facts -- this is a LEGITIMATE tool evidence string, but the contamination filter's `tool title with path` pattern (per iteration 003 findings, contamination-filter.vitest.ts lines 84-127) will match it

The contamination filter does NOT have markdown-awareness. It does not skip fenced code blocks (```` ``` ... ``` ````). It scans the full text. Source-capability-aware downgrade (claude-code-capture gets `low` severity for tool-title-with-path) only applies when `sourceCapabilities` or `captureSource` metadata is passed. JSON-mode saves do NOT set capture source, so the default behavior applies: `tool title with path` = HIGH severity = quality score capped at 0.60. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:84-127 (source capability downgrades)] [SOURCE: iteration-003 finding on V8 being in validate-memory-quality.ts not contamination-filter.ts]

**Expected Behavior:** Code blocks in observation narratives should be preserved verbatim. The contamination filter should NOT flag code examples or tool evidence strings in facts as contamination. Two possible fixes: (1) strip fenced code blocks before contamination scanning, (2) set an appropriate captureSource for JSON-mode saves so the tool-path downgrade applies.

**Risk Level:** HIGH -- False-positive contamination on code blocks caps quality at 0.60, making otherwise excellent memories appear low-quality. This directly undermines the value of providing code evidence in JSON-mode observations.

**Test recommendation:** Assert that observations with markdown code fences do NOT trigger high-severity contamination. Assert facts containing "Tool: Edit File: path" strings are treated as legitimate evidence, not contamination.

---

### Edge Case E: JSON with extremely long sessionSummary (>10K chars)

**Input:**
```json
{
  "sessionSummary": "[10,000+ character detailed narrative covering multiple implementation steps, decisions, and outcomes across a long session]",
  "specFolder": "023-esm-module-compliance"
}
```

**Current Behavior:** `normalizeInputData()` does NOT enforce a length limit on sessionSummary. The processing varies by path:

1. **Observation title:** Truncated at 100 chars (word-boundary) via `buildSessionSummaryObservation()` at line 273
2. **Observation narrative:** Truncated at 500 chars (word-boundary, T09b increase) via line 279
3. **recentContext fields:** Both `request` and `learning` receive the FULL untruncated text (slow path at ~line 632 or fast path backfill). No cap applied.
4. **SUMMARY in SessionData:** `collectSessionData()` passes the sessionSummary through to the SUMMARY field. The collector does NOT truncate it.
5. **OVERVIEW in rendered markdown:** The template renderer places SUMMARY directly into the OVERVIEW section. No length guard.
6. **Embedding input:** The final rendered markdown (potentially 10K+ chars just from SUMMARY) is sent to the embedding provider. Very long documents may: (a) exceed embedding model token limits (voyage-4: 32K tokens), (b) dilute embedding relevance signal as the summary dominates the vector.

[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:272-289] [SOURCE: iteration-006 finding on --json path bypassing data-loader validation]

**Expected Behavior:** The pipeline should cap SUMMARY/OVERVIEW text at a reasonable length (2000-3000 chars recommended) to prevent:
- Oversized memories wasting retrieval token budget
- Embedding signal dilution from a single enormous section
- Extremely long memories that push past the memory template's designed balance of sections

The cap should truncate at a word boundary and append an indicator like "(truncated)".

**Risk Level:** MEDIUM -- Does not break the pipeline but produces suboptimal memories. The quality scorer does not penalize length. The sufficiency gate does not check for excessive length. The main damage is retrieval inefficiency: a 10K-char memory uses disproportionate context window budget when surfaced by `memory_search`.

**Test recommendation:** Assert that sessionSummary > 3000 chars is truncated in the SUMMARY/OVERVIEW section. Assert the truncation preserves word boundaries.

---

### Edge Case F: JSON with filesChanged containing 100+ paths

**Input:**
```json
{
  "sessionSummary": "Bulk ESM migration across all script files.",
  "filesModified": [
    "scripts/core/workflow.ts",
    "scripts/core/config.ts",
    "scripts/core/file-writer.ts",
    "... (100+ more entries)"
  ],
  "specFolder": "023-esm-module-compliance"
}
```

**Current Behavior:** `normalizeInputData()` converts `filesModified` to `FILES` array with NO length cap. The conversion logic (lines 486-509 in fast-path, lines 591+ in slow-path):

1. Each string entry is parsed for a separator: regex `/^(.+?)\s+(?:[-\u2013\u2014]|:)\s+(.+)$/` to split `path - description` or `path: description`
2. If no separator found: `filePath = entry`, description auto-generated from basename: `Modified ${basename.replace(/[-_]/g, ' ')}`
3. All entries become `{ FILE_PATH, DESCRIPTION, ACTION: 'Modified' }`
4. ALL 100+ entries flow into the template renderer's FILES section

Downstream effects:
- **Rendered markdown size:** 100+ file entries, each ~80 chars = ~8000+ chars for the FILES section alone
- **Contamination scanning:** Each FILE_PATH is scanned. Paths containing `/tool/`, `read/`, `lib/` may match contamination patterns like `tool title with path`
- **Quality scoring:** The file count may actually help (HAS_FILES = true, FILE_COUNT = 100+) but the descriptions will all be placeholder text ("Modified workflow", "Modified config") which the sufficiency gate marks as NOT primary evidence (confirmed in `memory-sufficiency.vitest.ts` test "does not count placeholder file descriptions as primary evidence")
- **Embedding relevance:** 100+ file paths will dominate the embedding vector, reducing relevance for semantic queries about the actual session content

This is explicitly called out in the research config as question 6: "What key_files scoping strategy prevents 300+ entry lists while preserving useful file references?" [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:478-515] [SOURCE: research/deep-research-config.json question 6]

**Expected Behavior:** The pipeline should cap FILES at a configurable limit (30-50 entries recommended) with a summary note: "... and N more files modified". The capping strategy should:
1. Prioritize files that match the spec folder's known paths (via spec-affinity scoring already available in `spec-affinity.ts`)
2. Prioritize files with non-placeholder descriptions
3. Prioritize files with meaningful ACTION values (Created, Deleted over Modified/Read)
4. Cap at limit, append count note

**Risk Level:** HIGH -- 100+ file entries create oversized memories with diluted embeddings and potential contamination false-positives. The placeholder descriptions provide no semantic value while consuming token budget.

**Test recommendation:** Assert that 100+ filesModified entries are capped at configured limit. Assert capping preserves spec-relevant files. Assert a summary count note is appended.

---

## Additional Edge Cases Identified During Analysis

### Edge Case G: JSON with keyDecisions as structured objects

```json
{
  "keyDecisions": [
    {
      "decision": "Use ESM imports",
      "chosenOption": "Native ESM with .js extensions",
      "rationale": "Node.js 22+ fully supports ESM",
      "alternatives": ["CommonJS with require()", "Dual CJS/ESM package"]
    }
  ]
}
```

**Current Behavior:** `transformKeyDecision()` handles object format correctly: extracts `decision`, `chosenOption`, `rationale`, `alternatives`. Appends "Alternatives considered: ..." to decision text. Sets confidence to 0.70 (>1 alternative). This is the BETTER path for decisions -- it produces distinct values for CHOSEN, RATIONALE, and OPTIONS, avoiding the 4x repetition documented in iteration 005. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:204-261]

**Risk Level:** LOW -- Object decisions are handled correctly.

### Edge Case H: JSON with all fields maximally populated

When ALL fields are provided (sessionSummary, keyDecisions, observations, userPrompts, recentContext, FILES, nextSteps, triggerPhrases, importanceTier, contextType, technicalContext), the FAST path activates. The normalizer clones and backfills but there is potential for observation duplication: the fast path adds keyDecisions as decision observations (lines 555-564) even when the original observations array already contains decision-type entries.

The dedup function `dedupeObservationsByNarrative()` at line 567 handles narrative-level deduplication, but if the user provides a keyDecision string AND a manual decision observation with slightly different narrative text, both will survive dedup.

**Risk Level:** MEDIUM -- Potential for duplicate decision content in rendered output. Not a crash, but reduces memory quality through redundancy.

## Ruled Out

- Non-UTF8 JSON encoding: Node.js `JSON.parse()` handles encoding at the boundary; not a pipeline concern.
- Nested JSON (JSON strings within JSON): Not a realistic input pattern; the normalizer expects structured objects.
- Null/undefined values for top-level fields: The normalizer's `Array.isArray()` checks and optional chaining handle these gracefully.

## Dead Ends

None -- this was a systematic analysis, not an exploratory search.

## Sources Consulted

- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:198-600` (normalizeInputData, transformKeyDecision, buildSessionSummaryObservation, fast/slow paths)
- `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts` (existing JSON-mode tests for nextSteps, importanceTier, FILES)
- `.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts` (source-capability downgrades)
- `.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts` (generic title rejection, placeholder description rejection)
- `research/deep-research-config.json` (research questions, especially Q6 on key_files scoping)
- Prior iteration findings: 001 (conversation extractor), 003 (V8 contamination), 005 (decision 4x repetition), 006 (data pipeline)

## Edge Case Risk Summary

| Case | Description | Risk | Needs Fix? | Fix Complexity |
|------|-------------|:----:|:----------:|:--------------:|
| A | sessionSummary only, no keyDecisions | MEDIUM | Cosmetic | LOW (~10 LOC) |
| B | keyDecisions only, no sessionSummary | **HIGH** | **Yes** | MEDIUM (~30 LOC) |
| C | nextSteps only | LOW | No (correctly rejected) | -- |
| D | Markdown/code blocks in observations | **HIGH** | **Yes** | MEDIUM (~40 LOC) |
| E | Very long sessionSummary (>10K chars) | MEDIUM | Yes | LOW (~15 LOC) |
| F | 100+ filesModified entries | **HIGH** | **Yes** | MEDIUM (~50 LOC) |
| G | Object-form keyDecisions | LOW | No (handled correctly) | -- |
| H | All fields maximally populated | MEDIUM | Maybe | LOW (~10 LOC) |

**Priority order for fixes:** B > D > F > E > H > A (HIGH risk first, then MEDIUM by complexity)

## Assessment

- New information ratio: 0.75
- Questions addressed: ["What is the minimum viable JSON payload that should produce a >= 50/100 quality memory?", "What key_files scoping strategy prevents 300+ entry lists?", "How should the template renderer handle JSON-sourced observations vs transcript-sourced ones?"]
- Questions answered: ["What is the minimum viable JSON payload?"] -- sessionSummary + at least 1 keyDecision or observation is the minimum viable payload. sessionSummary alone works but is fragile. keyDecisions alone fails due to generic title. nextSteps alone is correctly rejected.

## Reflection

- What worked and why: Tracing each edge case through the normalizer code paths (fast vs slow), then mapping downstream effects through contamination filter, quality scorer, sufficiency gate, and template renderer. Having the prior iteration findings (001, 003, 005, 006) available provided the downstream behavior context without needing to re-read those files.
- What did not work and why: N/A -- systematic analysis against source code is reliable.
- What I would do differently: Add a code flow diagram showing fast-path vs slow-path activation conditions, since the guard at line 468 is the critical branching point and easy to forget.

## Recommended Next Focus

Design specific implementation fixes for the three HIGH-risk edge cases (B: title derivation from keyDecisions, D: code-block-aware contamination filtering, F: FILES capping with spec-affinity prioritization). Estimate LOC and identify which source files need modification for each fix.
