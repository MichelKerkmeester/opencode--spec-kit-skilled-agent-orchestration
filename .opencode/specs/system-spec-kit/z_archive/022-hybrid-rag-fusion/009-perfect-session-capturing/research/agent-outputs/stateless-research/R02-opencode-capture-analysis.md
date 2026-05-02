# R02 OpenCode capture analysis

## Scope
Analyzed:
- `.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts`
- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` (`transformOpencodeCapture`)
- `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts` for fallback behavior

## 1. What `captureConversation()` returns

`captureConversation(maxMessages = 10, directory = process.cwd())` returns a `ConversationCapture` object with this shape:

```ts
{
  session_id: string,
  session_title: string,
  projectId: string,
  directory: string,
  captured_at: string,
  exchanges: Exchange[],
  toolCalls: ToolExecution[],
  metadata: {
    total_messages: number,
    total_responses: number,
    total_tool_calls: number,
    session_created: number,
    session_updated: number,
    file_summary: Record<string, unknown>
  }
}
```

Source: `opencode-capture.ts:79-95,417-458`.

### `exchanges`
Each `Exchange` is:

```ts
{
  userInput: string,
  assistantResponse: string,
  timestamp: number,
  user_message_id: string,
  assistant_message_id: string | null,
  mode: string
}
```

Source: `opencode-capture.ts:68-76`.

How they are built (`buildExchanges()`):
- Takes the last `limit` user messages from OpenCode storage.
- Tries to match each user message to prompt-history JSONL by timestamp within `TIMESTAMP_MATCH_TOLERANCE_MS` (default 5000 ms).
- Tries to find the first assistant text response whose parent message is that user message.
- Falls back to `userMsg.summary.title` for `userInput` if prompt-history match is missing.
- Falls back to placeholder strings if either side is missing:
  - `User initiated conversation`
  - `Assistant processed request`
- Truncates assistant text to `TOOL_OUTPUT_MAX_LENGTH` (default 500 chars).

Source: `opencode-capture.ts:460-500`, `config.ts:148-155`.

### `toolCalls`
Each `ToolExecution` is:

```ts
{
  tool: string,
  call_id: string | null,
  input: Record<string, unknown>,
  output: string,
  status: string,
  timestamp: number,
  duration: number | null,
  title: string | null,
  messageId: string
}
```

Source: `opencode-capture.ts:55-66`.

How they are built:
- Reads all assistant message parts of type `tool`.
- Pulls `state.input`, `state.output`, `state.status`, `state.time`, `state.title`.
- Truncates output with a head/tail splice if over the configured limit.
- Returns only the trailing `maxMessages * 3` tool calls from the final capture payload.

Source: `opencode-capture.ts:370-406,448-449`.

### `metadata`
`metadata` contains counts and session timing plus `session.summary` as `file_summary`.

Source: `opencode-capture.ts:449-456`.

Important detail: the capture payload uses **snake_case** field names (`session_id`, `session_title`, `captured_at`), not camelCase.

## 2. What `transformOpencodeCapture()` does

`transformOpencodeCapture(capture, specFolderHint?)` converts the raw capture into the MCP/manual normalized shape:

```ts
{
  userPrompts: UserPrompt[],
  observations: Observation[],
  recentContext: RecentContext[],
  FILES: FileEntry[],
  _source: 'opencode-capture',
  _sessionId?: string,
  _capturedAt?: string
}
```

Source: `input-normalizer.ts:115-124,353-482`.

Main behavior:
1. Reads `exchanges`, `toolCalls`, `metadata`, and `sessionTitle` from the capture.
2. Builds a relevance-keyword list from `specFolderHint` path segments.
3. Filters tool calls by file path/title substring matching when a spec folder hint is present.
4. Converts **all exchanges** into `userPrompts`.
5. Converts non-placeholder assistant responses into `feature` observations.
6. Converts filtered tool calls into `implementation` or generic `observation` observations.
7. Builds a single `recentContext` item from the first user request and last assistant response.
8. Builds `FILES` only from filtered `edit`/`write` tool calls.

Source: `input-normalizer.ts:353-482`.

### Critical shape mismatch
`transformOpencodeCapture()` expects camelCase fields on the input object:
- `sessionTitle`
- `sessionId`
- `capturedAt`

But `captureConversation()` returns:
- `session_title`
- `session_id`
- `captured_at`

Result:
- `sessionTitle` is effectively `undefined`
- `_sessionId` is effectively `undefined`
- `_capturedAt` is effectively `undefined`
- `recentContext[0].request` falls back to `exchanges[0].userInput` or ultimately `'OpenCode session'`, not the captured session title

Source: `opencode-capture.ts:441-446` vs `input-normalizer.ts:354,453-481`.

`metadata` is destructured but never used, so capture-level counts and `file_summary` are dropped during transformation.

## 3. What `userPrompts`, `observations`, and `FILES` are generated

## `userPrompts`
Generated from **every exchange**, regardless of spec-folder relevance filtering:

```ts
{
  prompt: ex.userInput || '',
  timestamp: ex.timestamp ? new Date(ex.timestamp).toISOString() : new Date().toISOString()
}
```

Source: `input-normalizer.ts:384-387`.

Implications:
- User prompts preserve the reconstructed prompt text from `buildExchanges()`.
- If prompt-history matching failed, this may just be `userMsg.summary.title` or the placeholder `User initiated conversation`.
- Spec-folder filtering does **not** apply here, so unrelated prompts can still leak into stateless memories even while tool observations are filtered.

## `observations`
Two observation streams are produced.

### A. Assistant-response observations
For each exchange whose assistant response:
- exists,
- is longer than 20 chars,
- does not contain placeholder phrases (`[response]`, `Assistant processed request`, `placeholder`, `simulation mode`),
- and, when `specFolderHint` is supplied, whose user input or assistant response text mentions a relevance keyword,

it creates:

```ts
{
  type: 'feature',
  title: ex.assistantResponse.substring(0, 80),
  narrative: ex.assistantResponse,
  timestamp: ISO string,
  facts: [],
  files: []
}
```

Source: `input-normalizer.ts:389-428`.

These are effectively raw assistant-text summaries, not structured decisions or learnings.

### B. Tool-call observations
For each filtered tool call:

```ts
{
  type: tool.tool === 'edit' || tool.tool === 'write' ? 'implementation' : 'observation',
  title: `Tool: ${tool.tool}`,
  narrative: tool.title || `Executed ${tool.tool}`,
  timestamp: ISO string,
  facts: [`Tool: ${tool.tool}`, `Status: ${tool.status}`],
  files: [maybe one extracted path]
}
```

Source: `input-normalizer.ts:430-451`.

Implications:
- The observation retains only tool name, status, title, and maybe one file path.
- Tool input payloads, truncated output, duration, call id, and message linkage are not preserved in observation facts.
- Non-file tools still create observations, but usually with weak semantics.

## `FILES`
`FILES` is built only from filtered tool calls where `tool.tool` is `edit` or `write`:

```ts
{
  FILE_PATH: filePath,
  DESCRIPTION: tool.title || `${Created|Edited} via ${tool.tool} tool`
}
```

Source: `input-normalizer.ts:458-472`.

Properties and limitations:
- Deduplicated by exact path.
- Only one path is extracted from `input.filePath`, `input.file_path`, or `input.path`.
- Read/search/list/bash tools do not contribute to `FILES`.
- Relevant files touched indirectly or via multi-file commands are invisible.

## `recentContext`
Only one entry is created:

```ts
{
  request: exchanges[0].userInput || sessionTitle || 'OpenCode session',
  learning: exchanges[exchanges.length - 1]?.assistantResponse || ''
}
```

Source: `input-normalizer.ts:453-456`.

This is extremely lossy: it keeps just the first captured request and the last captured answer.

## 4. Quality-relevant data missing versus a pre-built JSON input

Compared with the manual/pre-built JSON path (`normalizeInputData()` and `RawInputData`), OpenCode capture is missing or drops several high-value fields.

### Available in pre-built JSON, absent or not derivable from capture
- `specFolder` / `SPEC_FOLDER`
- `sessionSummary`
- `keyDecisions`
- `technicalContext`
- `triggerPhrases`
- `importanceTier`
- curated `observations`
- curated `recentContext`
- curated `FILES` descriptions

Source: `input-normalizer.ts:45-59,222-285`.

### Specifically missing for quality
1. **Explicit decisions and rationale**
   - Manual JSON can express `keyDecisions` with chosen option, rationale, and alternatives.
   - OpenCode transform only turns assistant text into generic `feature` observations.
   - No durable decision object is extracted from capture.

2. **Technical context**
   - Manual JSON can provide structured implementation details.
   - Capture transform ignores tool input/output details except tool name/status/title/path.

3. **Trigger phrases / retrieval hooks**
   - Manual JSON can pass `triggerPhrases`, which become facts and saved manual trigger phrases.
   - OpenCode capture produces none.

4. **Importance tier / prioritization metadata**
   - Manual JSON can declare `importanceTier`.
   - Capture path provides no equivalent signal.

5. **Session summary authored for memory quality**
   - Manual JSON can include a deliberate `sessionSummary`.
   - Capture relies on truncated assistant text and prompt-history reconstruction.

6. **Structured file intent**
   - Manual JSON can provide `FILES` with real descriptions.
   - Capture only emits `edit`/`write` files with generic descriptions.

7. **Richer recent context**
   - Manual JSON can provide a curated `recentContext[]` timeline.
   - Capture produces only one coarse request/learning pair.

8. **Session metadata retention**
   - Raw capture has counts and `file_summary`, but transform discards them.

9. **Session identity retention**
   - Because of the snake_case/camelCase mismatch, even `_sessionId` and `_capturedAt` are lost.

10. **Complete assistant responses and tool evidence**
   - Assistant text is truncated to 500 chars during capture.
   - Tool output is truncated during capture and then mostly discarded during transform.
   - Duration, call id, message relationships, model, agent, and part-level chronology are not surfaced into the normalized result.

11. **Reliability of prompt text**
   - Prompt text depends on prompt-history timestamp matching within 5 seconds.
   - If that fails, the exchange may degrade to summary titles or placeholders.

## 5. What happens when OpenCode storage is not available

There are two failure layers.

### A. OpenCode module can load, but storage is absent
`captureConversation()` checks for `~/.local/share/opencode/storage` and throws `OpenCode storage not found` if missing.

Source: `opencode-capture.ts:101-109,421-423`.

### B. Loader behavior
`loadCollectedData()` tries sources in order:
1. explicit data file
2. OpenCode capture
3. simulation fallback

If the OpenCode capture module is unavailable or capture throws, the loader logs a warning/debug message and falls back to simulation mode:

```ts
return { _isSimulation: true, _source: 'simulation' };
```

It also prints warnings that placeholder data will be generated and advises passing a real JSON file instead.

Source: `data-loader.ts:80-186`.

### Under Claude Code / non-OpenCode runtimes
In a runtime without OpenCode storage (for example Claude Code), the practical behavior is:
- OpenCode capture attempt fails (`storage not found` or library unavailable).
- The script does **not** produce real session content from that runtime.
- It falls back to simulation mode unless a pre-built JSON file is supplied.

So stateless memory generation under Claude Code is effectively dependent on manually constructed JSON, not on native session capture.

## 6. Relevance filter for `specFolderHint`: help or hurt in stateless mode?

## What the filter does
When `specFolderHint` is present, it derives keywords from the spec path segments and the full path, then:
- filters tool calls by substring match against tool file path or tool title
- filters assistant-response observations unless the user input or assistant response text mentions a keyword

Source: `input-normalizer.ts:356-383,404-416`.

## Where it helps
It helps with one real problem: a long-lived OpenCode session can contain unrelated prior work, and this filter reduces obvious contamination when tool paths explicitly reference the target spec area.

## Where it hurts
In stateless mode it likely hurts overall quality more than it helps, because the capture is already sparse and lossy:

1. **False negatives on semantically relevant work**
   - Relevant files often live outside the spec folder path.
   - Repo code under implementation is commonly outside `specs/...`.
   - Those tool calls are dropped if their path/title does not include a spec keyword.

2. **False negatives on natural-language exchanges**
   - Users and assistants rarely repeat spec-folder slug terms in every message.
   - Relevant exchanges get skipped if they do not literally mention those keywords.

3. **Asymmetry: prompts are unfiltered, observations are filtered**
   - `userPrompts` keeps all exchanges.
   - `observations` may drop many of those same exchanges.
   - This creates an inconsistent memory artifact.

4. **Keyword quality is weak**
   - Keywords are simple path substrings with prefix stripping.
   - No semantic matching, no dependency awareness, no branch/file graph awareness.

5. **Stateless mode needs recall more than precision**
   - Since there is no curated JSON, capture should preserve as much evidence as possible.
   - Over-filtering removes evidence that cannot be recovered later.

## Assessment
- **For contamination control:** helpful in principle.
- **For stateless mode memory quality:** mostly harmful as currently implemented.

A better stateless strategy would bias toward recall:
- keep all exchanges,
- keep more tool calls,
- annotate probable relevance instead of hard-dropping,
- or filter at ranking/render time rather than at extraction time.

## Bottom line
OpenCode capture provides a useful but shallow reconstruction: prompt text, one assistant text snippet per user turn, a thin tool log, and some session counts. `transformOpencodeCapture()` then compresses that further into generic prompts/observations/files, drops most structured evidence, and currently loses session identity fields because of a snake_case/camelCase mismatch. For high-quality stateless memory, a pre-built JSON remains materially better.
