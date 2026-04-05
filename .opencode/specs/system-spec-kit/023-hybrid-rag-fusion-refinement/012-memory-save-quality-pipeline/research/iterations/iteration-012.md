# Iteration 012: JSON-Mode Quality Scoring Model Design

## Focus
Design the quality scoring model for JSON-mode saves. The current V2 quality scorer (extractors/quality-scorer.ts) uses validation rules V1-V14 with severity-weighted penalties starting from a base of 1.0. The core quality scorer (core/quality-scorer.ts) uses a 6-dimension breakdown totaling 100 points. Neither scorer accounts for the specific characteristics of JSON-mode input: rich structured data, absence of transcript-derived signals, and the need for minimum score guarantees when valid JSON is provided.

## Findings

### 1. Current Scoring Architecture: Two Scorers, Neither Fits JSON

**V2 Scorer (extractors/quality-scorer.ts)**: Starts at `score = 1.0`, subtracts severity-weighted penalties for failed V-rules. This is the scorer used in the final workflow (workflow.ts:1473). Its penalties are:
- HIGH rules (V1, V3, V8, V9, V11, V13): -0.10 each
- MEDIUM rules (V2, V4, V5, V6, V7, V10, V12, V14): -0.03 each
- LOW rules: -0.01 each

**Problem for JSON mode**: V-rules are run against the *rendered markdown output*, not the input data. A well-structured JSON payload that produces boilerplate markdown (due to extractor gaps) will fail V1 (placeholder), V2 (boilerplate), V5 (sparse semantic), and V6 (generic title) -- accumulating -0.19 penalty even though the *input* was high quality.

**Core Scorer (core/quality-scorer.ts)**: Uses a 6-dimension breakdown (trigger_phrases: 20, key_topics: 15, file_descriptions: 20, content_length: 15, html_safety: 15, observation_dedup: 15). This is called as a secondary/legacy scorer.

**Problem for JSON mode**: The `observation_dedup` dimension (15 points) scores observations by title uniqueness. JSON-mode observations are often empty because they come from `observations[]` which is transcript-sourced. The `content_length` dimension (15 points) requires `hasSpecificTitle()` which checks frontmatter/heading -- metadata that depends on the template renderer, not the input.

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:73-223]
[SOURCE: .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:127-320]

### 2. Proposed Scoring Dimensions for JSON-Mode

The V2 scorer should remain the canonical scorer, but we need to (a) prevent false penalties when the *input* is valid JSON and (b) add positive-signal dimensions for JSON-specific data.

**Approach: Input-Aware Score Floor + Existing V-Rule Pipeline**

Rather than creating a separate scoring path (which would fork the quality model), introduce a *score floor* computed from JSON input quality. The V-rule pipeline still runs, but the final score cannot drop below the floor.

```
finalScore = max(vRuleScore, jsonInputFloor)
```

This ensures valid JSON always produces a reasonable score even if the renderers/extractors have not yet been updated.

**JSON Input Quality Dimensions (for floor calculation):**

| Dimension | Weight | Scoring Criteria |
|-----------|--------|-----------------|
| **D1: Session Summary** | 25 | Length and specificity of `sessionSummary` |
| **D2: Key Decisions** | 20 | Count and structure of `keyDecisions[]` |
| **D3: Exchanges** | 20 | Count and content length of `exchanges[]` |
| **D4: Tool Calls** | 10 | Count and diversity of `toolCalls[]` |
| **D5: Trigger Phrases** | 15 | Quality of `_manualTriggerPhrases[]` |
| **D6: Metadata Completeness** | 10 | Presence of `contextType`, `importanceTier`, `specFolder` |
| **TOTAL** | 100 | |

[INFERENCE: based on CollectedDataBase fields and their downstream impact on memory retrievability]

### 3. Point Allocation per Dimension

#### D1: Session Summary (0-25 points)

```typescript
function scoreSessionSummary(summary: string | undefined): number {
  if (!summary || summary.trim().length === 0) return 0;

  const text = summary.trim();
  const wordCount = text.split(/\s+/).length;
  const hasSpecificTerms = /(?:implement|fix|refactor|design|debug|research|configur|migrat|upgrad)/i.test(text);
  const hasTechnicalDetail = /(?:\.ts|\.js|\.py|\.md|function|class|module|component|API|database|schema)/i.test(text);

  let score = 0;

  // Length tiers
  if (wordCount >= 50) score += 15;
  else if (wordCount >= 25) score += 10;
  else if (wordCount >= 10) score += 5;
  else return 2;  // Very short summary, minimal credit

  // Specificity bonus
  if (hasSpecificTerms) score += 5;
  if (hasTechnicalDetail) score += 5;

  return Math.min(score, 25);
}
```

#### D2: Key Decisions (0-20 points)

```typescript
function scoreKeyDecisions(decisions: Array<Record<string, unknown>> | undefined): number {
  if (!decisions || !Array.isArray(decisions) || decisions.length === 0) return 0;

  let score = 0;
  const validDecisions = decisions.filter(d => {
    const title = typeof d === 'string' ? d : (d?.title || '');
    return String(title).trim().length > 5;
  });

  // Count tiers
  if (validDecisions.length >= 3) score += 10;
  else if (validDecisions.length >= 1) score += 5;

  // Structure bonus: decisions with rationale are higher quality
  const withRationale = validDecisions.filter(d =>
    typeof d === 'object' && d !== null && typeof d.rationale === 'string' && d.rationale.length > 10
  );
  if (withRationale.length >= 2) score += 10;
  else if (withRationale.length >= 1) score += 5;

  return Math.min(score, 20);
}
```

#### D3: Exchanges (0-20 points)

```typescript
function scoreExchanges(exchanges: ExchangeSummary[] | undefined): number {
  if (!exchanges || !Array.isArray(exchanges) || exchanges.length === 0) return 0;

  let score = 0;
  const validExchanges = exchanges.filter(e =>
    e.userInput?.trim().length > 5 && e.assistantResponse?.trim().length > 10
  );

  // Count tiers
  if (validExchanges.length >= 5) score += 12;
  else if (validExchanges.length >= 3) score += 8;
  else if (validExchanges.length >= 1) score += 5;

  // Content richness: average response length
  if (validExchanges.length > 0) {
    const avgResponseLength = validExchanges.reduce((sum, e) =>
      sum + (e.assistantResponse?.length || 0), 0
    ) / validExchanges.length;

    if (avgResponseLength >= 200) score += 8;
    else if (avgResponseLength >= 50) score += 4;
  }

  return Math.min(score, 20);
}
```

#### D4: Tool Calls (0-10 points)

```typescript
function scoreToolCalls(toolCalls: ToolCallSummary[] | undefined): number {
  if (!toolCalls || !Array.isArray(toolCalls) || toolCalls.length === 0) return 0;

  let score = 0;

  // Count tiers
  if (toolCalls.length >= 10) score += 5;
  else if (toolCalls.length >= 3) score += 3;
  else score += 1;

  // Diversity: unique tool names
  const uniqueTools = new Set(toolCalls.map(t => t.tool));
  if (uniqueTools.size >= 4) score += 5;
  else if (uniqueTools.size >= 2) score += 3;
  else score += 1;

  return Math.min(score, 10);
}
```

#### D5: Trigger Phrases (0-15 points)

```typescript
function scoreTriggerPhrases(
  manualPhrases: string[] | undefined,
  autoExtracted: string[]
): number {
  const manual = (manualPhrases || []).filter(p => typeof p === 'string' && p.trim().length >= 3);
  const total = manual.length + autoExtracted.length;

  if (total === 0) return 0;

  let score = 0;

  // Count tiers
  if (total >= 8) score += 10;
  else if (total >= 4) score += 7;
  else if (total >= 2) score += 4;
  else score += 2;

  // Manual phrase bonus: AI-composed phrases are often higher quality
  if (manual.length >= 3) score += 5;
  else if (manual.length >= 1) score += 3;

  return Math.min(score, 15);
}
```

#### D6: Metadata Completeness (0-10 points)

```typescript
function scoreMetadata(data: CollectedDataBase): number {
  let score = 0;

  if (data.contextType || data.context_type) score += 3;
  if (data.importanceTier || data.importance_tier) score += 3;
  if (data.SPEC_FOLDER) score += 2;
  if (data.projectPhase || data.project_phase) score += 2;

  return Math.min(score, 10);
}
```

[INFERENCE: based on how each field contributes to downstream memory quality -- retrievability, trigger matching, and semantic richness]

### 4. Minimum Score Guarantees

The score floor ensures that valid JSON input always produces a usable memory. The guarantee logic:

```typescript
function computeJsonInputFloor(data: CollectedDataBase): number {
  // Only compute floor for JSON-sourced data
  if (data._source !== 'file' && !data.sessionSummary) {
    return 0;  // Not a JSON save, no floor
  }

  const d1 = scoreSessionSummary(data.sessionSummary);
  const d2 = scoreKeyDecisions(data.keyDecisions);
  const d3 = scoreExchanges(data.exchanges);
  const d4 = scoreToolCalls(data.toolCalls);
  const d5 = scoreTriggerPhrases(data._manualTriggerPhrases, []);
  const d6 = scoreMetadata(data);

  const rawFloor = (d1 + d2 + d3 + d4 + d5 + d6) / 100;

  // Apply a damping factor: the floor should not be so high that
  // it masks genuine rendering problems. Cap at 0.70.
  return Math.min(rawFloor * 0.85, 0.70);
}
```

**Guarantee tiers:**

| Input Quality | D1-D6 Score | Floor (after damping) | Meaning |
|--------------|-------------|----------------------|---------|
| **Minimal valid** (sessionSummary >= 10 words only) | ~15/100 | 0.13 | Low floor, V-rules dominate |
| **Good** (summary + 2 decisions + 3 exchanges) | ~55/100 | 0.47 | Meaningful floor, prevents <50 on valid input |
| **Excellent** (all fields populated, manual triggers) | ~85/100 | 0.70 (capped) | Floor guarantees >= 70 even with renderer issues |

**Critical invariant:** The floor is applied AFTER contamination caps. Contaminated content should never benefit from a JSON floor:

```typescript
// In V2 scorer, after computing vRuleScore and contamination caps:
const jsonFloor = computeJsonInputFloor(collectedData);
const contaminationCapped = applyContaminationCaps(vRuleScore, ...);
// Floor applies only when no contamination cap is active
const finalScore = hadContamination
  ? contaminationCapped
  : Math.max(contaminationCapped, jsonFloor);
```

[INFERENCE: based on the V2 scorer contamination cap logic at extractors/quality-scorer.ts:159-171]

### 5. Trigger Phrase Extraction from sessionSummary

The current trigger extraction pipeline in workflow.ts (lines 1170-1237) builds trigger source from:
1. `sessionData.SUMMARY` (the session summary)
2. Decision titles, rationales, contexts, choices
3. Non-synthetic file descriptions
4. Spec folder name tokens

**For JSON mode**, the trigger source should also include:
- `sessionSummary` directly (currently this flows through sessionData.SUMMARY which may be set)
- `keyDecisions[]` title/rationale (already covered by the decision loop)
- `exchanges[].userInput` text (new: user intents are strong trigger signals)
- `_manualTriggerPhrases` (already merged at line 1206)

**Concrete extraction strategy:**

```typescript
// In workflow.ts, expand triggerSourceParts construction:

// EXISTING: sessionData.SUMMARY
if (sessionData.SUMMARY) {
  triggerSourceParts.push(sessionData.SUMMARY);
}

// NEW: For JSON mode, also extract from exchanges
if (collectedData?.exchanges && Array.isArray(collectedData.exchanges)) {
  for (const exchange of collectedData.exchanges) {
    // User inputs are strong intent signals
    if (exchange.userInput && exchange.userInput.trim().length > 10) {
      triggerSourceParts.push(exchange.userInput.trim());
    }
    // Only first sentence of assistant response (avoid noise)
    if (exchange.assistantResponse) {
      const firstSentence = exchange.assistantResponse.match(/^[^.!?]+[.!?]/)?.[0];
      if (firstSentence && firstSentence.length >= 15) {
        triggerSourceParts.push(firstSentence.trim());
      }
    }
  }
}

// EXISTING: decisions loop
// EXISTING: file descriptions loop
// EXISTING: spec folder name tokens
```

**Why user inputs are strong trigger signals:**
The `exchanges[].userInput` contains the actual commands/requests the user gave during the session. These are exactly the phrases a future user would type when trying to find this memory. Examples:
- "Implement the JSON-primary plan" --> triggers: "json primary", "implement json"
- "Fix the quality scoring for structured input" --> triggers: "quality scoring", "structured input", "fix quality"
- "Design the dual-source extraction" --> triggers: "dual source extraction", "design extraction"

The SemanticSignalExtractor already handles compound noun extraction and stopword filtering, so raw user input text will produce high-quality triggers without additional preprocessing.

[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1170-1237]
[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/trigger-extractor.ts:21-27]
[INFERENCE: based on how trigger matching works in the MCP server -- user queries match against trigger phrases]

### 6. Concrete Scoring Examples

#### Example A: Typical JSON Save (sessionSummary + 2 decisions + manual triggers)

```json
{
  "sessionSummary": "Implemented ESM module compliance for the shared package. Migrated 12 files from CommonJS require() to ES import syntax. Fixed circular dependency between config.ts and path-security.ts by extracting shared constants.",
  "keyDecisions": [
    { "title": "Use .js extensions in import paths", "rationale": "Node.js ESM requires explicit file extensions" },
    { "title": "Keep CommonJS interop wrapper for scripts/", "rationale": "Legacy scripts use require() and changing them is out of scope" }
  ],
  "nextSteps": ["Run full test suite", "Update tsconfig.json strict settings"],
  "_manualTriggerPhrases": ["esm migration", "commonjs to esm", "import syntax"],
  "contextType": "implementation",
  "importanceTier": "important"
}
```

**D1 (Summary)**: 35 words, has specific terms ("ESM", "CommonJS"), has technical detail (".ts") --> 15 + 5 + 5 = 25/25
**D2 (Decisions)**: 2 valid decisions, 2 with rationale --> 5 + 10 = 15/20
**D3 (Exchanges)**: Empty --> 0/20
**D4 (Tool Calls)**: Empty --> 0/10
**D5 (Triggers)**: 3 manual phrases, 0 auto --> 4 + 5 = 9/15 (auto-extracted will add more at runtime)
**D6 (Metadata)**: contextType + importanceTier = 6/10

**Raw floor**: (25 + 15 + 0 + 0 + 9 + 6) / 100 = 0.55
**Damped floor**: 0.55 * 0.85 = 0.47
**V-rule score** (assuming good rendering): ~0.90 (V5 sparse may fire: -0.03)
**Final**: max(0.90, 0.47) = 0.90

#### Example B: Minimal JSON Save (sessionSummary only)

```json
{
  "sessionSummary": "Fixed a bug in the download button transition.",
  "SPEC_FOLDER": "031-fix-download-btn-transition-glitch"
}
```

**D1**: 9 words, has specific term ("bug"), no technical detail --> 5 + 5 = 10/25
**D2**: Empty --> 0/20
**D3**: Empty --> 0/20
**D4**: Empty --> 0/10
**D5**: Empty --> 0/15
**D6**: SPEC_FOLDER only --> 2/10

**Raw floor**: (10 + 0 + 0 + 0 + 0 + 2) / 100 = 0.12
**Damped floor**: 0.12 * 0.85 = 0.10
**V-rule score** (poor rendering due to thin data): ~0.70 (V5, V6 fire)
**Final**: max(0.70, 0.10) = 0.70

The floor is too low to matter here -- the V-rule score dominates. This is correct: minimal input should not guarantee a high score.

#### Example C: Rich JSON Save (all fields populated)

```json
{
  "sessionSummary": "Designed and implemented the hybrid RAG fusion pipeline with BM25, vector, and graph channels. Calibrated RRF K parameter to 55 based on ablation study results. Added ground truth queries for 15 memory entries.",
  "keyDecisions": [
    { "title": "RRF K=55 for all channels", "rationale": "Ablation showed K=55 maximizes Recall@20 across all ground truth queries" },
    { "title": "Graph channel as boost-only", "rationale": "Graph edges are sparse; using as primary retrieval produces too many gaps" },
    { "title": "Deferred FTS5 trigram for v2", "rationale": "Performance overhead not justified by marginal recall improvement" }
  ],
  "exchanges": [
    { "userInput": "Run the ablation study on all channels", "assistantResponse": "Executed ablation across vector, BM25, FTS5, graph, and trigger channels. Results show vector+BM25 achieves 0.85 Recall@20, adding graph boosts to 0.89.", "timestamp": "2026-03-28T10:30:00Z" },
    { "userInput": "Set K=55 and verify", "assistantResponse": "Updated RRF K parameter to 55 in fusion config. Re-ran benchmark: Recall@20 improved from 0.82 to 0.89 across 47 ground truth queries.", "timestamp": "2026-03-28T11:15:00Z" },
    { "userInput": "Add ground truth for the new memories", "assistantResponse": "Created 15 new ground truth query-memory pairs covering recent spec folders. All pass at Recall@20.", "timestamp": "2026-03-28T12:00:00Z" }
  ],
  "toolCalls": [
    { "tool": "Read", "inputSummary": "fusion-config.ts", "outputSummary": "245 lines", "status": "success" },
    { "tool": "Edit", "inputSummary": "Set K=55", "outputSummary": "Updated 1 line", "status": "success" },
    { "tool": "Bash", "inputSummary": "Run ablation", "outputSummary": "Recall@20: 0.89", "status": "success" },
    { "tool": "Write", "inputSummary": "ground-truth.json", "outputSummary": "15 entries added", "status": "success" }
  ],
  "_manualTriggerPhrases": ["hybrid rag fusion", "rrf calibration", "ablation study", "recall at 20", "ground truth"],
  "contextType": "implementation",
  "importanceTier": "critical",
  "projectPhase": "IMPLEMENTATION"
}
```

**D1**: 40+ words, specific terms, technical detail --> 25/25
**D2**: 3 decisions, 3 with rationale --> 10 + 10 = 20/20
**D3**: 3 valid exchanges, avg response ~180 chars --> 8 + 4 = 12/20
**D4**: 4 tool calls, 4 unique tools --> 3 + 5 = 8/10
**D5**: 5 manual phrases --> 7 + 5 = 12/15
**D6**: contextType + importanceTier + projectPhase = 8/10

**Raw floor**: (25 + 20 + 12 + 8 + 12 + 8) / 100 = 0.85
**Damped floor**: min(0.85 * 0.85, 0.70) = 0.70 (capped)
**V-rule score** (good rendering from rich data): ~0.97 (maybe V14 cosmetic: -0.01)
**Final**: max(0.97, 0.70) = 0.97

The floor cap at 0.70 prevents the floor from masking real rendering problems. The actual score of 0.97 reflects the genuinely high-quality output.

[INFERENCE: based on the scoring dimensions defined above and typical JSON payloads observed in the codebase]

### 7. Integration Point in the V2 Scorer

The floor calculation should be added to the V2 scorer (`extractors/quality-scorer.ts`) as a post-processing step:

```typescript
// In scoreMemoryQuality(), after line 206 (final clamp):
function scoreMemoryQuality(inputs: QualityInputs): QualityScoreResult {
  // ... existing logic ...

  qualityScore = clamp01(qualityScore);

  // NEW: Apply JSON input floor when applicable
  if (inputs.jsonInputData && !hadContamination) {
    const jsonFloor = computeJsonInputFloor(inputs.jsonInputData);
    if (jsonFloor > qualityScore) {
      qualityScore = jsonFloor;
      warnings.push(`JSON input floor applied: ${Math.round(jsonFloor * 100)}/100 (input quality exceeds rendered quality)`);
      qualityFlags.add('json_floor_applied');
    }
  }

  return { ... };
}
```

This requires extending `QualityInputs` with an optional `jsonInputData` field:

```typescript
interface QualityInputs {
  // ... existing fields ...
  jsonInputData?: CollectedDataBase;  // NEW: raw JSON input for floor calculation
}
```

And the workflow.ts call site (line 1473) passes `collectedData` through:

```typescript
const qualityV2 = scoreMemoryQualityV2({
  content: files[ctxFilename],
  validatorSignals: qualitySignals,
  hadContamination,
  contaminationSeverity: maxSeverity,
  messageCount: conversationData.MESSAGE_COUNT,
  toolCount: conversationData.TOOL_COUNT,
  decisionCount: decisions.DECISIONS.length,
  sufficiencyScore: sufficiencyResult.score,
  insufficientContext: !sufficiencyResult.pass,
  jsonInputData: collectedData,  // NEW
});
```

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:206]
[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1473-1483]

## Ruled Out

- **Creating a completely separate JSON scorer**: Would fork the quality model and create maintenance burden. The floor approach preserves the V-rule pipeline as canonical.
- **Replacing V-rule penalties with JSON bonuses**: The V-rule system is well-calibrated for rendered output quality. Adding bonuses would inflate scores for all saves, not just JSON ones.
- **Using the core quality scorer (core/quality-scorer.ts) for JSON**: The core scorer is legacy and dimension-based. The V2 scorer is the canonical pipeline. Adding JSON support to the V2 scorer is the correct path.

## Dead Ends

None. The floor-based approach is compatible with the existing architecture.

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts` (full file, 239 lines)
- `.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:127-320` (legacy scorer dimensions)
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1170-1237` (trigger extraction)
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1473-1483` (V2 scorer call site)
- `.opencode/skill/system-spec-kit/scripts/lib/trigger-extractor.ts` (trigger API)
- `.opencode/skill/system-spec-kit/scripts/types/session-types.ts:126-190` (CollectedDataBase)

## Assessment
- New information ratio: 0.90
- Questions addressed: ["What quality scoring dimensions should apply to JSON-mode inputs vs transcript inputs?", "What is the minimum viable JSON payload that should produce a >= 50/100 quality memory?", "What is the optimal trigger phrase extraction strategy for structured JSON input?"]
- Questions answered: ["What quality scoring dimensions should apply to JSON-mode inputs vs transcript inputs?", "What is the optimal trigger phrase extraction strategy for structured JSON input?"]

## Reflection
- What worked and why: Analyzing the V2 scorer's penalty-from-1.0 model revealed that a score floor is the cleanest integration pattern. It preserves the existing pipeline while providing a safety net for valid JSON input.
- What did not work and why: Initially considered a "dual scorer" approach (separate JSON scorer + transcript scorer), but this would require maintaining two scoring models and choosing between them at the workflow level. The floor approach is simpler and additive.
- What I would do differently: Include the sufficiency evaluator (memory-sufficiency.ts) in the analysis -- it also contributes to the final score cap and may need JSON-mode awareness.

## Recommended Next Focus
Design V8 contamination filter refinement for same-parent phase references. The current V8 rule flags cross-spec references as contamination, but phase folders (e.g., `023-esm/001-shared/` referencing `023-esm/002-mcp/`) are legitimate same-parent references, not contamination.
