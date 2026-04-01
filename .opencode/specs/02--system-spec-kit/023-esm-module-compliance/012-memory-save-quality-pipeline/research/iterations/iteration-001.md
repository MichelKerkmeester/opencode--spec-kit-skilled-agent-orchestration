---
title: "Deep-Read of conversation-extractor.ts: JSON Data Flow Analysis"
iteration: 1
focus: "Conversation Extractor Architecture — code path analysis for JSON-mode vs transcript-mode"
findings_summary: "extractConversations() has two code paths. The primary loop (lines 93-214) iterates over userPrompts[] only, so when JSON-mode provides zero userPrompts, zero MESSAGES are produced. A secondary fallback (lines 241-267) fires only when userPrompts.length <= 1 AND sessionSummary exists, injecting synthetic Assistant messages for sessionSummary, keyDecisions, and nextSteps. Observations are never consumed independently — they are only matched to userPrompts via timestamp proximity. This means JSON-mode payloads that provide rich sessionSummary, keyDecisions, and observations but zero userPrompts produce at most 1-3 synthetic messages (and zero User messages)."
---

# Iteration 1: Deep-Read of conversation-extractor.ts

## Focus

Examine every code path in `extractConversations()` to understand exactly how JSON-mode structured data (sessionSummary, keyDecisions, observations) is processed versus transcript-mode data (userPrompts with timestamps). Document where JSON data is ignored and why MESSAGES stays empty or minimal.

## Findings

### 1. Function Signature and Input Contract

`extractConversations()` accepts a `CollectedDataSubset` typed to five fields: `userPrompts`, `observations`, `sessionSummary`, `keyDecisions`, `nextSteps` (line 52). However, the function's primary loop only uses two of these: `userPrompts` and `observations`.

[SOURCE: conversation-extractor.ts:51-53]

The type `CollectedDataSubset<Keys>` is defined as `Pick<CollectedDataBase, Keys>` (session-types.ts:193), which means the function signature explicitly declares it CAN receive sessionSummary, keyDecisions, and nextSteps — but the code only processes them in a narrow fallback path.

[SOURCE: session-types.ts:193]

### 2. Null Guard Returns Empty Data (Line 55-69)

When `collectedData` is null, the function returns a fully empty `ConversationData` object with `MESSAGES: []`. This is correct behavior for the null case.

[SOURCE: conversation-extractor.ts:55-69]

### 3. Primary Data Extraction (Line 71-72)

Only two fields are destructured for the main processing:
```typescript
const userPrompts = collectedData.userPrompts || [];
const observations = collectedData.observations || [];
```

`sessionSummary`, `keyDecisions`, and `nextSteps` are NOT extracted here. They are only accessed later in the fallback path.

[SOURCE: conversation-extractor.ts:71-72]

### 4. Warning Emission But No Alternative Path (Lines 74-86)

When `userPrompts.length === 0`, the code logs a warning ("No user prompts found (empty conversation)") but does NOT branch to an alternative extraction strategy. Similarly for empty observations. The code continues into the primary loop, which simply iterates zero times.

[SOURCE: conversation-extractor.ts:74-86]

**THIS IS THE ROOT CAUSE FOR EMPTY MESSAGES IN JSON-MODE.** The function warns about the empty state but has no fallback to synthesize messages from sessionSummary or keyDecisions when userPrompts is empty.

### 5. Primary Loop: Iterates Over userPrompts Only (Lines 93-214)

The main `for` loop (`for (let i = 0; i < userPrompts.length; i++)`) processes each user prompt, creating User messages and matching them with temporally proximate observations:

- **Line 98-103**: Creates a `ConversationMessage` with ROLE="User" from each `userPrompt.prompt`
- **Lines 112-127**: Finds related observations by timestamp proximity (`CONFIG.MESSAGE_TIME_WINDOW`)
- **Lines 132-166**: Extracts tool calls from matched observation facts
- **Lines 177-199**: Creates Assistant messages from matched observations' narratives

**Critical**: Observations are ONLY consumed if they fall within `CONFIG.MESSAGE_TIME_WINDOW` of a userPrompt's timestamp. Observations without a matching userPrompt are silently dropped.

[SOURCE: conversation-extractor.ts:93-214]

### 6. Fallback for JSON-Mode: The sessionSummary Synthesis (Lines 241-267)

This is the ONLY code path that handles JSON-mode data:

```typescript
if (userPrompts.length <= 1 && collectedData.sessionSummary) {
```

The condition `userPrompts.length <= 1` means this fires when:
- Zero userPrompts (JSON-mode typical case)
- Exactly one userPrompt (edge case)

When triggered, it creates synthetic messages:
- **Line 243-246**: One Assistant message containing `String(collectedData.sessionSummary)`
- **Lines 249-256**: One Assistant message with keyDecisions joined by semicolons (if array)
- **Lines 258-265**: One Assistant message with nextSteps joined by semicolons (if array)

**Problems with this fallback:**
1. All messages have ROLE="Assistant" — no User messages are ever created from JSON data
2. The sessionSummary is coerced via `String()`, which for objects produces `[object Object]`
3. keyDecisions items are processed as `Record<string, unknown>` with fallback to `JSON.stringify(d)` — lossy for rich objects
4. nextSteps items are coerced via `String(s)` — same object-to-string problem
5. No tool calls are synthesized even when the JSON payload contains tool usage information
6. The timestamp is generic (`formatTimestamp(undefined, 'readable')`) — all messages share the same timestamp
7. Observations from the JSON payload are completely ignored in this path — they were only consumed in the primary loop

[SOURCE: conversation-extractor.ts:241-267]

### 7. Observations Are Never Independently Consumed

The observations array is only accessed inside the primary userPrompts loop (line 112-127). There is no code path that processes observations independently. In JSON-mode, where userPrompts is typically empty, ALL observations are silently dropped even though they may contain rich structured data.

[SOURCE: conversation-extractor.ts:112-127]

### 8. Post-Processing Assumes Messages Exist (Lines 275-306)

After message construction:
- Phase classification runs on `exchangeInputs` (line 275) — which is empty when userPrompts is empty
- Duration calculation checks `tempMessages.length > 0` (line 279) — returns "N/A" when empty
- Tool count sums across MESSAGES (line 288) — returns 0 when messages are empty or synthetic
- Flowchart generation receives empty phases (line 289)

All of these produce minimal/empty results when JSON-mode data was the input.

[SOURCE: conversation-extractor.ts:275-306]

## Ruled Out

No approaches were "tried and failed" in this iteration — this was a pure code-reading exercise.

## Dead Ends

None identified — all code paths are relevant to the problem.

## Sources Consulted

- `.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts` (full file, 316 lines)
- `.opencode/skill/system-spec-kit/scripts/types/session-types.ts` (lines 123-193, type definitions)

## Assessment

- New information ratio: 1.0
- Questions addressed: ["How should extractConversations() build MESSAGES from sessionSummary/keyDecisions/observations when userPrompts is empty?"]
- Questions answered: The question is now fully characterized — we know exactly WHERE and WHY JSON data is ignored. The answer: the function's primary loop (lines 93-214) is userPrompt-driven, observations require timestamp proximity to a userPrompt to be consumed, and the sessionSummary fallback (lines 241-267) only creates 1-3 synthetic Assistant messages without processing observations.

## Reflection

- What worked and why: Line-by-line reading of the single source file revealed the complete data flow. The function is self-contained (no deep call chains), which made the analysis straightforward.
- What did not work and why: N/A — first iteration, pure code reading approach was appropriate.
- What I would do differently: In a follow-up, I would trace how the MESSAGES array feeds into the quality scorer and template renderer to understand downstream impact.

## Recommended Next Focus

Deep-read `quality-scorer.ts` and `quality-gates.ts` to understand how scoring dimensions depend on conversation messages. This will reveal which scoring dimensions are structurally impossible to satisfy when MESSAGES is empty/minimal from JSON-mode input.
