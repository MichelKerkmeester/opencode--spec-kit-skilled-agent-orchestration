# Iteration 011: Dual-Source Extraction Design for conversation-extractor.ts

## Focus
Design concrete pseudocode for a dual-source extraction strategy in `extractConversations()`. The current implementation (lines 51-307 of conversation-extractor.ts) is built entirely around the `userPrompts` + `observations` path. When JSON-mode input arrives without `userPrompts` (the common case when the AI composes structured JSON), the function produces empty MESSAGES except for a late-stage `sessionSummary` synthesis block (lines 241-267) that only fires when `userPrompts.length <= 1`. This iteration designs the JSON extraction path to produce rich, properly-attributed MESSAGES without triggering synthetic-content filtering downstream.

## Findings

### 1. Current Code Path Analysis: Why JSON-Mode Produces Thin Messages

The existing `extractConversations()` at line 51 accepts a `CollectedDataSubset<'userPrompts' | 'observations' | 'sessionSummary' | 'keyDecisions' | 'nextSteps'>`. The main extraction loop (lines 93-214) iterates exclusively over `userPrompts`. When `userPrompts` is empty (standard for AI-composed JSON), no User/Assistant message pairs are created, no tool calls are extracted, and no exchange inputs are generated.

The fallback at lines 241-267 fires only when `userPrompts.length <= 1` AND `sessionSummary` exists. It creates bare-bones Assistant messages with no ROLE="User" counterpart, no tool calls, and generic timestamps. The phase classifier then receives empty exchange inputs, producing `flowPattern: 'empty'` and zero phases.

**Root cause chain:**
- `userPrompts === []` --> main loop produces 0 messages
- fallback creates 1-3 synthetic Assistant messages with no User pairing
- phase classifier gets 0 exchanges --> `flowPattern: 'empty'`
- quality scorer sees low MESSAGE_COUNT --> penalized
- trigger extractor has thin conversation content --> few triggers

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:51-267]

### 2. JSON Payload Fields Available for Message Construction

From `CollectedDataBase` (session-types.ts lines 126-190), JSON-mode payloads can carry:

| Field | Type | Usage for Messages |
|-------|------|-------------------|
| `sessionSummary` | `string` | Primary narrative -- becomes a high-quality Assistant message |
| `keyDecisions` | `Array<Record<string, unknown>>` | Each decision becomes a User-question + Assistant-answer pair |
| `nextSteps` | `Array<Record<string, unknown>>` | Becomes a forward-looking Assistant message |
| `exchanges` | `ExchangeSummary[]` | Pre-structured User/Assistant pairs (best source) |
| `toolCalls` | `ToolCallSummary[]` | Enrich Assistant messages with tool call entries |
| `observations` | `Observation[]` | May still be present even without userPrompts |

The `exchanges` field (line 143 of session-types.ts) is the richest source: it contains `{ userInput, assistantResponse, timestamp }` triples composed by the AI agent. When present, these should be the primary JSON message source.

[SOURCE: .opencode/skill/system-spec-kit/scripts/types/session-types.ts:126-190]

### 3. Dual-Source Activation Logic (Pseudocode)

```typescript
async function extractConversations(collectedData: CollectedDataSubset<...>): Promise<ConversationData> {
  if (!collectedData) return EMPTY_CONVERSATION_DATA;

  const userPrompts = collectedData.userPrompts || [];
  const observations = collectedData.observations || [];

  // ---- DECISION POINT: Which extraction path? ----
  const hasTranscriptData = userPrompts.length > 0;
  const hasJsonExchanges = Array.isArray((collectedData as any).exchanges)
    && (collectedData as any).exchanges.length > 0;
  const hasJsonSummary = typeof collectedData.sessionSummary === 'string'
    && collectedData.sessionSummary.trim().length > 20;

  const useJsonPath = !hasTranscriptData && (hasJsonExchanges || hasJsonSummary);

  if (useJsonPath) {
    return extractFromJsonPayload(collectedData);
  }

  // ---- EXISTING TRANSCRIPT PATH (unchanged) ----
  // ... lines 87-307 as-is ...
}
```

**Activation rules:**
- **Transcript path**: `userPrompts.length > 0` -- the existing code, unchanged
- **JSON path**: `userPrompts.length === 0` AND (`exchanges` present OR `sessionSummary` is non-trivial)
- **Hybrid path (future)**: `userPrompts.length > 0` AND `exchanges` present -- use transcript path but merge tool calls from JSON. Out of scope for this iteration.
- **Empty path**: neither userPrompts nor JSON enrichment -- returns `EMPTY_CONVERSATION_DATA` (already handled at line 56)

[INFERENCE: based on conversation-extractor.ts activation conditions and CollectedDataBase field availability]

### 4. JSON Path Message Construction (Detailed Pseudocode)

```typescript
function extractFromJsonPayload(
  collectedData: CollectedDataSubset<'userPrompts' | 'observations' | 'sessionSummary' | 'keyDecisions' | 'nextSteps'>
): ConversationData {
  const MESSAGES: ConversationMessage[] = [];
  const now = new Date().toISOString();
  const baseTimestamp = formatTimestamp(now, 'readable');

  // Cast to access JSON-mode fields
  const fullData = collectedData as CollectedDataBase;
  const exchanges = fullData.exchanges || [];
  const toolCalls = fullData.toolCalls || [];
  const sessionSummary = fullData.sessionSummary || '';
  const keyDecisions = fullData.keyDecisions || [];
  const nextSteps = fullData.nextSteps || [];

  // ---- STRATEGY A: exchanges[] present (best quality) ----
  if (exchanges.length > 0) {
    for (const exchange of exchanges) {
      // User message from exchange
      if (exchange.userInput && exchange.userInput.trim().length > 0) {
        MESSAGES.push({
          TIMESTAMP: formatTimestamp(exchange.timestamp || now, 'readable'),
          ROLE: 'User',
          CONTENT: exchange.userInput.trim(),
          TOOL_CALLS: [],
          _jsonSourced: true,  // NEW FLAG -- see Finding 5
        });
      }

      // Assistant message from exchange
      if (exchange.assistantResponse && exchange.assistantResponse.trim().length > 0) {
        // Match tool calls by timestamp proximity or exchange index
        const matchedTools = matchToolCallsToExchange(exchange, toolCalls);

        MESSAGES.push({
          TIMESTAMP: formatTimestamp(exchange.timestamp || now, 'readable'),
          ROLE: 'Assistant',
          CONTENT: exchange.assistantResponse.trim(),
          TOOL_CALLS: matchedTools.map(tc => ({
            TOOL_NAME: tc.tool,
            DESCRIPTION: tc.inputSummary || tc.tool,
            HAS_RESULT: tc.status === 'success',
            RESULT_PREVIEW: tc.outputSummary || '',
            HAS_MORE: false,
          })),
          _jsonSourced: true,
        });
      }
    }
  }

  // ---- STRATEGY B: No exchanges but sessionSummary exists ----
  if (MESSAGES.length === 0 && sessionSummary.trim().length > 20) {
    // Synthesize a contextual User message (what was the session about?)
    const sessionTopic = extractSessionTopic(sessionSummary, keyDecisions);

    MESSAGES.push({
      TIMESTAMP: baseTimestamp,
      ROLE: 'User',
      CONTENT: sessionTopic,
      TOOL_CALLS: [],
      _jsonSourced: true,
    });

    // Main summary as Assistant response
    MESSAGES.push({
      TIMESTAMP: baseTimestamp,
      ROLE: 'Assistant',
      CONTENT: sessionSummary,
      TOOL_CALLS: toolCalls.slice(0, 10).map(tc => ({
        TOOL_NAME: tc.tool,
        DESCRIPTION: tc.inputSummary || tc.tool,
        HAS_RESULT: tc.status === 'success',
        RESULT_PREVIEW: tc.outputSummary || '',
        HAS_MORE: false,
      })),
      _jsonSourced: true,
    });
  }

  // ---- APPEND: keyDecisions as additional exchanges ----
  if (keyDecisions.length > 0) {
    for (const decision of keyDecisions) {
      const title = typeof decision === 'string' ? decision : (decision?.title || '');
      const rationale = typeof decision === 'string' ? '' : (decision?.rationale || '');

      if (title.trim().length > 0) {
        MESSAGES.push({
          TIMESTAMP: baseTimestamp,
          ROLE: 'Assistant',
          CONTENT: `Decision: ${title}${rationale ? ` -- ${rationale}` : ''}`,
          TOOL_CALLS: [],
          _jsonSourced: true,
        });
      }
    }
  }

  // ---- APPEND: nextSteps as closing message ----
  if (nextSteps.length > 0) {
    const stepsText = nextSteps.map(s => typeof s === 'string' ? s : String(s)).join('; ');
    MESSAGES.push({
      TIMESTAMP: baseTimestamp,
      ROLE: 'Assistant',
      CONTENT: `Next steps: ${stepsText}`,
      TOOL_CALLS: [],
      _jsonSourced: true,
    });
  }

  // ---- PHASE CLASSIFICATION ----
  // Build exchange inputs for the phase classifier from the constructed messages
  const exchangeInputs = buildExchangeInputsFromMessages(MESSAGES);
  const classification = classifyConversationExchanges(exchangeInputs);

  const toolCount = MESSAGES.reduce((c, m) => c + m.TOOL_CALLS.length, 0);
  const autoFlow = flowchartGen.generateConversationFlowchart(
    classification.phases,
    MESSAGES[0]?.CONTENT,
  );

  return {
    MESSAGES,
    MESSAGE_COUNT: MESSAGES.length,
    DURATION: 'N/A',  // JSON mode has no real timestamps
    FLOW_PATTERN: classification.flowPattern,
    PHASE_COUNT: classification.phases.length,
    UNIQUE_PHASE_COUNT: classification.uniquePhaseCount,
    PHASES: classification.phases,
    TOPIC_CLUSTERS: classification.topicClusters,
    AUTO_GENERATED_FLOW: autoFlow,
    TOOL_COUNT: toolCount,
    DATE: new Date().toISOString().split('T')[0],
  };
}
```

[INFERENCE: based on conversation-extractor.ts structure, CollectedDataBase fields, and phase-classifier API]

### 5. The _jsonSourced Flag: Avoiding Synthetic Filtering

**Problem:** The contamination filter and quality scorer both check for `_synthetic` flags to penalize or discard messages that were not genuinely captured from a real conversation. If JSON-sourced messages are unmarked, they pass unchecked. If marked `_synthetic`, they are penalized unfairly.

**Solution:** Introduce a new `_jsonSourced: boolean` property on `ConversationMessage`:

```typescript
// In session-types.ts, extend ConversationMessage:
export interface ConversationMessage {
  TIMESTAMP: string;
  ROLE: string;
  CONTENT: string;
  TOOL_CALLS: ToolCallEntry[];
  _jsonSourced?: boolean;   // NEW: true when message was built from JSON payload
  _synthetic?: boolean;     // EXISTING: true when fabricated by simulation/fallback
}
```

**Semantic distinction:**
- `_synthetic = true`: Message was **fabricated** by the system (simulation mode, fallback generators). Penalized.
- `_jsonSourced = true`: Message was **composed by the AI agent** from its session knowledge. This is high-quality authored content, not simulation. Should NOT be penalized.
- Neither flag: Message was extracted from a live transcript. Standard treatment.

**Downstream impact:**
- `contamination-filter.ts`: Check `_synthetic` but NOT `_jsonSourced`. JSON-sourced messages are AI-authored, not contaminated.
- `quality-scorer.ts` (core): The `observations.filter(o => !o._synthetic)` pattern already ignores simulation. JSON-sourced content should be treated as genuine.
- `template-renderer.ts`: No special handling needed. JSON-sourced messages render identically.

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:241-267 (existing _synthetic patterns)]
[INFERENCE: based on contamination-filter.ts and quality-scorer.ts filtering behavior]

### 6. Edge Cases

| Edge Case | Behavior |
|-----------|----------|
| **exchanges[] present but empty strings** | Skip entries where both `userInput` and `assistantResponse` are empty/whitespace |
| **sessionSummary < 20 chars** | Too short to be meaningful. Falls through to EMPTY_CONVERSATION_DATA |
| **Both exchanges[] and sessionSummary present** | exchanges[] wins (Strategy A). sessionSummary is NOT duplicated |
| **keyDecisions with object format** | Extract `.title` and `.rationale` fields. Fall back to `JSON.stringify()` only if neither exists |
| **toolCalls[] without exchanges[]** | toolCalls are attached to the sessionSummary-based Assistant message |
| **Observations present but userPrompts empty** | JSON path activates. Observations are NOT processed through the transcript loop but could be used to enrich tool call detection |
| **exchanges[] with missing timestamps** | Use `new Date().toISOString()` as fallback. Duration returns 'N/A' |
| **Single exchange with very long content (>5000 chars)** | Truncate assistantResponse to CONFIG.MAX_MESSAGE_LENGTH (existing pattern) |
| **Mixed mode: userPrompts=[1 item] + exchanges=[5 items]** | `userPrompts.length > 0` so transcript path activates. The single prompt + exchange data means the existing fallback at line 241 fires. This is the "hybrid" case -- future improvement |

[INFERENCE: based on existing edge case handling in conversation-extractor.ts and data model constraints]

### 7. Helper Function: extractSessionTopic

When `exchanges[]` is absent and only `sessionSummary` exists, we need to synthesize a User message representing "what the session was about." This avoids an Assistant-only monologue.

```typescript
function extractSessionTopic(
  sessionSummary: string,
  keyDecisions: Array<Record<string, unknown>>
): string {
  // Strategy: Extract the first sentence of sessionSummary and phrase as intent
  const firstSentence = sessionSummary.match(/^[^.!?]+[.!?]/)?.[0]?.trim();

  // If decisions exist, the session topic is likely the first decision context
  if (keyDecisions.length > 0) {
    const firstDecision = keyDecisions[0];
    const context = typeof firstDecision === 'string'
      ? firstDecision
      : (firstDecision?.context || firstDecision?.title || '');
    if (typeof context === 'string' && context.trim().length > 10) {
      return context.trim();
    }
  }

  if (firstSentence && firstSentence.length >= 15) {
    return firstSentence;
  }

  // Last resort: generic but specific to the summary content
  return `Session context: ${sessionSummary.substring(0, 120).trim()}`;
}
```

[INFERENCE: based on how the phase classifier and trigger extractor use the first User prompt for topic detection]

## Ruled Out

- **Merging JSON messages into the transcript loop**: The transcript loop (lines 93-214) is tightly coupled to `userPrompts[i]` indexing, time-window observation matching, and `consumedObservationIndexes`. Injecting JSON messages into this loop would require rewriting the core algorithm. A separate function is cleaner and lower risk.
- **Using observations[] as primary JSON source**: Observations lack User/Assistant role distinction and are designed for tool-call evidence, not conversation reconstruction.

## Dead Ends

None identified. The dual-path approach is architecturally sound for this module.

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts` (full file, 316 lines)
- `.opencode/skill/system-spec-kit/scripts/types/session-types.ts:126-193` (CollectedDataBase interface)
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:985-990` (extractConversations call site)
- `.opencode/skill/system-spec-kit/scripts/lib/trigger-extractor.ts` (trigger extraction API)

## Assessment
- New information ratio: 0.85
- Questions addressed: ["How should extractConversations() build MESSAGES from sessionSummary/keyDecisions/observations when userPrompts is empty?"]
- Questions answered: ["How should extractConversations() build MESSAGES from sessionSummary/keyDecisions/observations when userPrompts is empty?"]

## Reflection
- What worked and why: Reading the full conversation-extractor.ts and session-types.ts together revealed the exact data flow gap. The `exchanges` field in CollectedDataBase was the key insight -- it provides pre-structured User/Assistant pairs that bypass the need for timestamp-based observation matching.
- What did not work and why: N/A -- first design iteration, no prior failed approaches.
- What I would do differently: In a future iteration, verify that the phase classifier can handle exchange inputs built from JSON messages (it currently expects `observationIndexes` and `factTexts` which won't exist in JSON mode).

## Recommended Next Focus
Design the JSON-mode quality scoring model: which dimensions apply, point allocation, minimum score guarantees for valid JSON input, and trigger phrase extraction from sessionSummary.
