# R07 - Input normalizer enhancement research

## Scope

Research target: enrich `transformOpencodeCapture()` so stateless saves produce useful observations, decisions, file context, and learning metrics from capture data instead of generic placeholders.

## Current state

### What the normalizer keeps today

- `transformOpencodeCapture()` maps every exchange to a `userPrompts` entry, but only preserves prompt text and timestamp. It drops OpenCode exchange metadata such as `mode`, `user_message_id`, and `assistant_message_id` that already exist in the capture extractor (`scripts/utils/input-normalizer.ts:384-387`, `scripts/extractors/opencode-capture.ts:68-76`, `scripts/extractors/opencode-capture.ts:490-497`).
- Assistant exchanges become generic `feature` observations whose title is just the first 80 characters of the response and whose `facts` / `files` arrays are empty (`scripts/utils/input-normalizer.ts:398-428`).
- Tool-call observations only retain `tool`, `title`, `status`, timestamp, and one optional file path. The normalizer-side `CaptureToolCall` type does not expose `output`, `duration`, `call_id`, or `messageId`, even though OpenCode capture already returns them (`scripts/utils/input-normalizer.ts:91-103`, `scripts/utils/input-normalizer.ts:430-451`, `scripts/extractors/opencode-capture.ts:55-66`, `scripts/extractors/opencode-capture.ts:381-390`).
- `recentContext` is a single entry built from the first user request plus the last assistant response, so middle-of-session discoveries, decisions, blockers, and next steps are lost (`scripts/utils/input-normalizer.ts:453-456`).
- `FILES` is only populated from `edit` and `write` tool calls, with a generic description (`scripts/utils/input-normalizer.ts:458-472`).

### Why this hurts downstream quality

- Downstream file/session extractors already know how to classify richer observation types like `bugfix`, `feature`, `refactor`, `decision`, `research`, and `discovery`, but the normalizer currently emits mostly `feature` and `observation`, so those heuristics are underfed (`scripts/extractors/file-extractor.ts:83-98`).
- The decision extractor can build structured decision records when observations contain decision-oriented narratives, option facts, rationale facts, and confidence markers, but the current OpenCode path rarely produces any of those signals (`scripts/extractors/decision-extractor.ts:36-105`, `scripts/extractors/decision-extractor.ts:193-279`).
- Session assembly already understands optional `preflight` / `postflight` data and computes a Learning Index from it, but `RawInputData`, `NormalizedData`, and `TransformedCapture` in the normalizer do not currently carry those fields (`scripts/utils/input-normalizer.ts:44-82`, `scripts/extractors/collect-session-data.ts:53-107`, `scripts/extractors/collect-session-data.ts:198-303`).
- Session summaries, continuation hints, and next-action extraction rely heavily on `recentContext[0]` plus observation facts, so low-signal context directly lowers saved-memory quality (`scripts/extractors/collect-session-data.ts:673-715`, `scripts/extractors/session-extractor.ts:202-223`).

## Recommendation 1: richer observation building from exchanges

### Reuse existing classification patterns instead of inventing a second taxonomy

The repo already centralizes pragmatic observation typing in `detectObservationType()`. The fastest safe improvement is to either:

1. export and reuse that helper inside `input-normalizer.ts`, or
2. extract the regex bank into a shared utility consumed by both normalizer and file extractor.

Existing patterns already cover the core types the stateless path needs (`scripts/extractors/file-extractor.ts:83-98`).

### Proposed observation pipeline

For each exchange, derive a richer observation from:

- `userInput`
- `assistantResponse`
- nearby tool calls by timestamp / `messageId`
- referenced files from tool inputs

Suggested steps:

1. Ignore placeholder assistant responses as today.
2. Build a `combinedText` string from `userInput + assistantResponse`.
3. Detect the best observation type with ordered regexes.
4. Attach related files from nearby tool calls.
5. Build a title from the best sentence, not raw truncation.
6. Populate `facts` with extracted signals so downstream extractors can reuse them.

### Suggested regex bank

```ts
const OBSERVATION_PATTERNS = {
  bugfix: /\b(fix(?:ed|es|ing)?|bug|error|issue|regression|broken|failing|root cause|resolved)\b/i,
  implementation: /\b(implement(?:ed|ing)?|added?|created?|built|wired|hooked up|updated)\b/i,
  decision: /\b(decid(?:ed|ing)?|chose|selected|went with|opted for|trade-?off|alternative)\b/i,
  research: /\b(research(?:ed|ing)?|investigat(?:ed|ing)?|explor(?:ed|ing)?|analyz(?:ed|ing)?|looked into)\b/i,
  verification: /\b(test(?:ed|ing)?|verified|confirmed|validated|passed|works?|resolved)\b/i,
  discovery: /\b(found|discovered|realized|learned|turned out|identified)\b/i,
};
```

### Narrative construction

Instead of `title = response.substring(0, 80)`, build:

- `title`: first sentence around the strongest cue (`fix`, `decided`, `verified`, `found`)
- `narrative`: short 1-3 sentence summary containing the cue sentence plus one supporting sentence
- `facts`:
  - `Tool: Read File: ... Result: inspected existing implementation`
  - `Files: a.ts, b.ts`
  - `Outcome: fixed failing parser branch`
  - `Evidence: tests passed`

This matches existing fact parsing conventions. Tool detection already understands explicit `Tool:` facts, and tests show that richer fact strings like `Tool: Read File: scripts/core/workflow.ts Result: ...` are accepted (`scripts/utils/tool-detection.ts:30-53`, `scripts/tests/memory-render-fixture.vitest.ts:173-179`, `scripts/tests/test-scripts-modules.js:1456-1460`).

### File-aware observation narratives

When a nearby tool call touched files, append them to the observation:

- `files`: canonical list of involved paths
- `facts`: one line per file action when useful
- `narrative`: include the highest-signal file reference

Example:

```ts
{
  type: 'bugfix',
  title: 'Fixed input normalizer decision parsing',
  narrative: 'Adjusted the input normalizer to preserve decision cues and attach related files from tool activity.',
  facts: [
    'Tool: Read File: scripts/utils/input-normalizer.ts Result: inspected current capture mapping',
    'Tool: Edit File: scripts/utils/input-normalizer.ts Result: updated decision extraction flow',
    'Evidence: preserved alternatives and rationale in normalized observations'
  ],
  files: ['scripts/utils/input-normalizer.ts']
}
```

### Strong recommendation

Do not emit one observation per assistant response plus one observation per tool call as separate unrelated items. Instead, create:

- **exchange observations** for semantic progress
- **tool observations** only when the tool execution itself is the main event (for example: test run, grep investigation, failed bash command)

That will reduce noisy duplicate observations while feeding downstream summarizers more meaningful narratives.

## Recommendation 2: decision extraction from exchanges

### Current opportunity

There is already a structured `_manualDecision` shape on observations and downstream logic that extracts options, rationale, and confidence from decision narratives plus fact lines (`scripts/utils/input-normalizer.ts:19-23`, `scripts/utils/input-normalizer.ts:175-185`, `scripts/extractors/decision-extractor.ts:205-279`).

The OpenCode path should populate that shape directly whenever an exchange contains a decision cue.

### Decision patterns to detect

Core cue patterns:

```ts
const DECISION_PATTERNS = [
  /(?:chose|selected|picked|went with|opted for)\s+(?<choice>[^.]+?)(?:\s+over\s+(?<alternative>[^.]+))?(?:\s+because\s+(?<reason>[^.]+))?/i,
  /decided to\s+(?<choice>[^.]+?)(?:\s+because\s+(?<reason>[^.]+))?/i,
  /decided on\s+(?<choice>[^.]+?)(?:\s+instead of\s+(?<alternative>[^.]+))?/i,
  /(?:rather than|instead of|over)\s+(?<alternative>[^.]+)$/i,
  /confidence:?\s*(?<confidence>\d{1,3})%?/i,
];
```

Supplementary evidence patterns:

- alternatives: `instead of`, `over`, `rather than`, `alternative`, `trade-off`
- rationale: `because`, `so that`, `to avoid`, `for consistency`, `due to`
- caveats: `but`, `however`, `still`, `follow-up`

### Proposed `_manualDecision` payload

The existing type only has `fullText`, `chosenApproach`, and `confidence`. That is enough for backward compatibility, but the observation should also emit richer `facts` so the decision extractor can recover the rest:

```ts
{
  type: 'decision',
  title: 'Use shared regex classification',
  narrative: 'Decided to reuse detectObservationType patterns instead of adding a second classifier because downstream extractors already depend on that taxonomy.',
  facts: [
    'Option 1: Reuse detectObservationType',
    'Alternative 2: Add normalizer-specific regex map',
    'Rationale: Keep classification rules consistent across normalization and file extraction',
    'Confidence: 82%',
    'Follow-up: extract shared regex helpers into a common module'
  ],
  _manualDecision: {
    fullText: 'Decided to reuse detectObservationType patterns instead of adding a second classifier because downstream extractors already depend on that taxonomy.',
    chosenApproach: 'Reuse detectObservationType',
    confidence: 82
  }
}
```

### Confidence heuristic

If explicit confidence is absent, estimate it:

- 85: choice + rationale + explicit alternative
- 75: choice + rationale
- 65: clear choice only
- 50: weak decision wording without rationale

This matches the downstream extractor's current behavior of inferring stronger confidence when options and rationale exist (`scripts/extractors/decision-extractor.ts:258-261`).

### Implementation note

Decision extraction should run on both:

- assistant responses
- user prompts (for cases where the human makes the architectural choice)

The decision extractor already does lexical fallback across both observations and prompts when structured decisions are absent, so feeding richer source text will pay off immediately (`scripts/extractors/decision-extractor.ts:66-105`, `scripts/extractors/decision-extractor.ts:197-203`).

## Recommendation 3: file extraction enhancement

### Important current limitation

OpenCode capture already records tool `input`, `output`, `status`, `duration`, and `title`, but the normalizer currently throws away most of that surface area and only turns `edit` / `write` paths into `FILES` entries (`scripts/extractors/opencode-capture.ts:381-390`, `scripts/utils/input-normalizer.ts:430-472`).

### Proposed file extraction rules

#### A. Expand file collection beyond edit/write

Collect paths from any tool call with a usable path:

- `read`
- `edit`
- `write`
- `grep` / `glob` / `search` if the tool result includes file paths
- bash/git-derived file lists when explicitly available

At minimum, include all tool calls whose `input` contains `filePath`, `file_path`, or `path`; today the normalizer already knows how to read those fields but only applies them to edit/write (`scripts/utils/input-normalizer.ts:440-447`, `scripts/utils/input-normalizer.ts:462-469`).

#### B. Preserve action, not just file path

Current `FileEntry` only stores `FILE_PATH` and `DESCRIPTION` (`scripts/utils/input-normalizer.ts:38-42`). Consider adding optional `ACTION?: 'Read' | 'Edited' | 'Created' | 'Verified' | 'Discovered'` so downstream rendering can distinguish "inspected" from "modified". If schema expansion is undesirable, encode action at the start of `DESCRIPTION`.

#### C. Generate descriptions from tool context

Description priority:

1. parsed tool title
2. parsed tool output snippet
3. nearest exchange sentence mentioning the file
4. fallback action text

Recommended output:

- Read: `Inspected scripts/utils/input-normalizer.ts while tracing OpenCode capture mapping`
- Edit: `Updated transformOpencodeCapture decision extraction`
- Write: `Created scratch research note for normalizer enhancement`
- Bash/Git: `Detected modified file from git status after stateless save run`

This aligns with the existing semantic summarizer approach, which already extracts contextual file descriptions from nearby prose and observation narratives (`scripts/lib/semantic-summarizer.ts:192-303`).

#### D. Use git status as a supplementary source

`transformOpencodeCapture()` itself is pure and only receives the capture object, so the cleanest design is:

- keep normalizer file extraction capture-based by default
- optionally merge a supplementary `metadata.gitStatus` payload when the loader/collector provides it
- or enrich later in `loadCollectedData()` / stateless collection before normalization

Suggested git supplement shape:

```ts
metadata: {
  gitStatus?: [
    { path: 'scripts/utils/input-normalizer.ts', status: 'M' },
    { path: 'scratch/R07-input-normalizer-enhancement.md', status: '??' }
  ]
}
```

Use it only when:

- capture-derived `FILES` is sparse
- capture session is known to match the current repo/spec folder

That prevents unrelated dirty-worktree files from polluting saved context.

### Recommended dedup behavior

Keep one entry per file path and prefer the most specific description, matching the behavior already used by `extractFilesFromData()` (`scripts/extractors/file-extractor.ts:113-128`, `scripts/extractors/file-extractor.ts:167-181`).

## Recommendation 4: learning metric synthesis

### Current gap

The session collector already supports `preflight` and `postflight`, computes deltas, and produces a Learning Index, but the OpenCode normalization path never synthesizes those objects (`scripts/extractors/collect-session-data.ts:53-107`, `scripts/extractors/collect-session-data.ts:186-195`, `scripts/extractors/collect-session-data.ts:265-303`).

### First change required

Extend normalizer types so capture transforms may return:

- `preflight`
- `postflight`

These fields are missing from `RawInputData`, `NormalizedData`, and `TransformedCapture` today (`scripts/utils/input-normalizer.ts:44-82`, `scripts/utils/input-normalizer.ts:115-124`).

### Preflight synthesis heuristic

Build a baseline from the first 20-30% of the session:

- **knowledgeScore** starts lower when early exchanges are exploratory and read-heavy
- **uncertaintyScore** starts higher when early text contains uncertainty cues
- **contextScore** starts lower when few files are identified and decisions are absent
- **gaps** come from explicit unknowns
- **confidence** can mirror `100 - uncertaintyScore`
- **readiness** can map to bands like `Needs research`, `Ready to implement`, `Ready to verify`

Useful cues:

```ts
const UNCERTAINTY_CUES = /\b(not sure|unclear|unknown|need to check|investigate|maybe|hypothesis|seems like)\b/i;
const RESEARCH_CUES = /\b(read|inspect|investigate|trace|search|explore|understand)\b/i;
const PLAN_CUES = /\b(plan|approach|should|option|decide)\b/i;
```

Example heuristic:

- read/grep/glob heavy first phase -> knowledge 30-45, uncertainty 55-75
- explicit decision present early -> raise context score modestly
- explicit architecture familiarity (`already uses`, `existing pattern is`) -> raise knowledge

### Postflight synthesis heuristic

Build an end-state estimate from the last 20-30% of the session:

- raise `knowledgeScore` when discovery / root-cause / understanding cues appear
- lower `uncertaintyScore` when verification / completion cues appear
- raise `contextScore` when files, decisions, and outcomes are more concrete
- populate `gapsClosed` from statements like `root cause was ...`, `found that ...`, `fixed by ...`
- populate `newGaps` from trailing caveats like `still need to`, `follow-up`, `remaining issue`

Useful cues:

```ts
const KNOWLEDGE_GAIN_CUES = /\b(found|discovered|realized|learned|identified|root cause was|turned out)\b/i;
const VERIFICATION_CUES = /\b(test(?:ed|ing)?|verified|confirmed|validated|passed|works|resolved|fixed)\b/i;
const FOLLOWUP_CUES = /\b(next|todo|follow-?up|remaining|still need|later)\b/i;
```

### Learning Index compatibility

No formula changes are needed. The collector already uses:

`LI = (KnowledgeDelta * 0.4) + (UncertaintyReduction * 0.35) + (ContextImprovement * 0.25)` (`scripts/extractors/collect-session-data.ts:186-195`, `scripts/memory/generate-context.ts:73-100`).

The improvement is simply to synthesize plausible baseline and end-state metrics when stateless capture lacks explicit pre/post tool output.

## Recent-context upgrade

Although not explicitly requested as its own section, it is worth fixing because many downstream summaries read `recentContext[0]`.

### Current issue

The normalizer stores only:

- `request = first exchange userInput`
- `learning = last exchange assistantResponse`

(`scripts/utils/input-normalizer.ts:453-456`)

### Better strategy

Emit 2-4 recent-context entries and make entry `0` the highest-signal summary:

1. **session objective** - what the user asked for
2. **key learning/decision** - strongest discovery or choice
3. **current state** - most recent verification or implementation result
4. **next step** - explicit follow-up if detected

Recommended shape:

```ts
[
  {
    request: 'Enhance the input normalizer to produce richer stateless capture data.',
    learning: 'Identified that transformOpencodeCapture drops tool output/duration and only records edit/write files.',
    files: ['scripts/utils/input-normalizer.ts', 'scripts/extractors/opencode-capture.ts'],
    continuationCount: 1
  },
  {
    request: 'Decision',
    learning: 'Decided to reuse shared observation classification and synthesize preflight/postflight metrics from conversation phases.',
    files: ['scripts/utils/input-normalizer.ts']
  }
]
```

This directly benefits summary selection, continuation extraction, active-file detection, and next-step inference (`scripts/extractors/collect-session-data.ts:673-715`, `scripts/extractors/session-extractor.ts:194-223`, `scripts/extractors/session-extractor.ts:440-449`).

## Claude Code note

I did not find a Claude-specific capture transformer under `scripts/`; the current stateless capture path appears OpenCode-only and is wired through `loadCollectedData()` -> `captureConversation()` -> `transformOpencodeCapture()` (`scripts/loaders/data-loader.ts:142-178`).

Because of that, the safest design is to generalize the normalizer around a shared capture contract:

```ts
interface GenericCapture {
  exchanges: Array<{
    userInput?: string;
    assistantResponse?: string;
    timestamp?: number | string;
    mode?: string;
    userMessageId?: string;
    assistantMessageId?: string | null;
  }>;
  toolCalls?: Array<{
    tool: string;
    title?: string | null;
    status?: string;
    timestamp?: number | string;
    duration?: number | null;
    output?: string;
    messageId?: string;
    input?: Record<string, unknown>;
  }>;
  metadata?: Record<string, unknown>;
}
```

Then OpenCode and future Claude Code capture adapters can each normalize into that contract before the richer observation/decision/file/learning pipeline runs.

## Concrete implementation order

1. **Broaden normalizer types**
   - add `output`, `duration`, `messageId`, optional `mode` metadata
   - add `preflight` / `postflight`
   - optionally add `ACTION` on file entries
2. **Build shared exchange classifier**
   - reuse `detectObservationType()` patterns
   - add sentence extraction helpers
3. **Add decision extraction pass**
   - emit `decision` observations + `_manualDecision`
   - populate option/rationale/confidence facts
4. **Upgrade file extraction**
   - collect read/edit/write files
   - derive descriptions from tool title/output/exchange context
   - optionally merge git-status supplement
5. **Synthesize recentContext + learning metrics**
   - multi-entry recent context
   - preflight/postflight estimation from phase flow

## Highest-value changes first

If this work is split, implement in this order:

1. preserve richer tool-call fields (`output`, `duration`, `messageId`)
2. emit typed exchange observations with file references
3. emit decision observations / `_manualDecision`
4. synthesize `preflight` / `postflight`
5. add git-status supplement

That sequence gives the biggest stateless quality gain earliest while minimizing schema churn.
