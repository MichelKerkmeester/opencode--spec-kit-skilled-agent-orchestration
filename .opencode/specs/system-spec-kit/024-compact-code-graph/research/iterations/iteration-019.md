# Iteration 019: Claude Code Transcript JSONL Format

## Focus
Determine the real JSONL structure of Claude Code transcript files, identify where token usage and model metadata live, estimate practical file sizes for a 30-minute session, and recommend an incremental Node.js parser that can safely tail `~/.claude/projects/**/*.jsonl` without re-parsing old content.

This iteration used two evidence sources:

1. Local artifact inspection of real Claude Code transcript files under `~/.claude/projects/` on 2026-03-30.
2. Public Anthropic/Claude Code documentation and issue threads for official path/documentation context and known transcript edge cases.

## Findings
1. There does not appear to be a public, formal Anthropic document for the internal JSONL line schema itself.
   - Official Claude Code docs document `transcript_path` in hook input and describe it as the "Path to conversation JSON", but they do not publish a line-by-line transcript schema for the `.jsonl` body.
   - Practically, the transcript format must therefore be treated as an observed, implementation-detail schema, not a stable contract unless Anthropic later publishes one.

2. Claude Code transcripts are append-only JSONL files with one JSON object per line, but there are multiple record layers.
   - Top-level JSONL line type is in the root `type` field.
   - Conversation payloads live under `message`.
   - Tool calls and tool results are usually not top-level record types; they live inside `message.content[]`.
   - In a 100-file local sample of root session transcripts, observed top-level `type` values were:
     - `progress`
     - `assistant`
     - `user`
     - `queue-operation`
     - `system`
     - `file-history-snapshot`
     - `last-prompt`
     - `custom-title`
     - `agent-name`
     - `pr-link`
   - In a 40-file local sample, observed `message.content[].type` values were:
     - `tool_use`
     - `tool_result`
     - `text`
     - `thinking`
     - `image`
     - `tool_reference`

3. The root JSONL structure is broader than just `user` and `assistant`.
   - A typical root `user` line includes metadata like:
     - `uuid`
     - `parentUuid`
     - `sessionId`
     - `timestamp`
     - `permissionMode` (sometimes)
     - `entrypoint`
     - `cwd`
     - `gitBranch`
     - `version`
     - `message`
   - A typical root `assistant` line includes:
     - `uuid`
     - `parentUuid`
     - `requestId`
     - `sessionId`
     - `timestamp`
     - `entrypoint`
     - `cwd`
     - `gitBranch`
     - `version`
     - `message`
   - Some non-conversation lines have completely different shapes:
     - `file-history-snapshot` lines carry `snapshot`
     - `system` lines can carry hook summaries
     - `progress` lines can carry hook progress or other runtime progress metadata
     - `queue-operation` lines can carry task queue notifications

4. Example lines from real local transcripts confirm that `tool_use` and `tool_result` are content-item types, not root line types.

```json
{"type":"file-history-snapshot","messageId":"...","snapshot":{"messageId":"...","trackedFileBackups":{},"timestamp":"2025-10-16T12:41:35.905Z"},"isSnapshotUpdate":false}
{"parentUuid":"...","type":"user","message":{"role":"user","content":"Run 20 more /spec_kit:deep-research with gpt 5.4 high ..."},"timestamp":"2026-03-30T13:05:10.111Z","permissionMode":"plan","entrypoint":"cli","cwd":"<cwd>","sessionId":"...","version":"2.1.87","gitBranch":"main","slug":"groovy-hopping-bentley"}
{"parentUuid":"...","type":"assistant","message":{"model":"claude-opus-4-6","id":"msg_...","type":"message","role":"assistant","content":[{"type":"text","text":"Let me first check the current state of the deep-research for this spec folder."}],"stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":3,"cache_creation_input_tokens":15522,"cache_read_input_tokens":11801,"cache_creation":{"ephemeral_5m_input_tokens":0,"ephemeral_1h_input_tokens":15522},"output_tokens":48,"service_tier":"standard","inference_geo":"not_available"}},"requestId":"...","timestamp":"2026-03-30T13:05:15.026Z","entrypoint":"cli","cwd":"<cwd>","sessionId":"...","version":"2.1.87","gitBranch":"main"}
{"parentUuid":"...","type":"assistant","message":{"model":"claude-opus-4-6","id":"msg_...","type":"message","role":"assistant","content":[{"type":"tool_use","id":"toolu_...","name":"Bash","input":{"command":"<redacted>","description":"<redacted>"},"caller":{"type":"direct"}}],"stop_reason":"tool_use","usage":{"input_tokens":3,"cache_creation_input_tokens":15522,"cache_read_input_tokens":11801,"output_tokens":332,"server_tool_use":{"web_search_requests":0,"web_fetch_requests":0},"service_tier":"standard","cache_creation":{"ephemeral_1h_input_tokens":15522,"ephemeral_5m_input_tokens":0},"inference_geo":"","iterations":[],"speed":"standard"}},"requestId":"...","timestamp":"2026-03-30T13:05:16.577Z","entrypoint":"cli","cwd":"<cwd>","sessionId":"...","version":"2.1.87","gitBranch":"main"}
{"parentUuid":"...","type":"user","message":{"role":"user","content":[{"type":"tool_result","tool_use_id":"toolu_...","is_error":false,"content":"001-precompact-hook..."}]},"toolUseResult":{"stdout":"001-precompact-hook...","stderr":"","interrupted":false,"isImage":false,"noOutputExpected":false},"sourceToolAssistantUUID":"...","timestamp":"2026-03-30T13:05:16.002Z","entrypoint":"cli","cwd":"<cwd>","sessionId":"...","version":"2.1.87","gitBranch":"main"}
```

5. Usage objects are located in `assistant.message.usage`, not at the root.
   - In a 500-file local scan, every observed `usage` object was located at `assistant.message.usage`.
   - No `root.usage` locations were observed.
   - In a 100-file root-session sample, the observed ratio was `12209/12209` assistant lines carrying `message.usage`.
   - This means the safest extraction rule is:
     - parse only lines where `type === "assistant"`
     - require `message.usage`
     - ignore `user`, `system`, `progress`, `queue-operation`, and `file-history-snapshot` for token accounting

6. The `usage` object fields vary slightly by assistant message type, but the core token fields are stable.
   - Core fields observed in all sampled assistant usage objects:
     - `input_tokens`
     - `output_tokens`
     - `cache_creation_input_tokens`
     - `cache_read_input_tokens`
     - `cache_creation`
     - `service_tier`
     - `inference_geo`
   - Nested `cache_creation` object fields observed:
     - `ephemeral_5m_input_tokens`
     - `ephemeral_1h_input_tokens`
   - Additional fields observed on tool-calling assistant records:
     - `server_tool_use`
     - `iterations`
     - `speed`
   - Nested `server_tool_use` fields observed:
     - `web_search_requests`
     - `web_fetch_requests`
   - Important implementation note:
     - Do not hard-code a single exact usage schema.
     - Treat the core token counters as required for accounting, and everything else as optional metadata.

7. The model identifier is stored in `assistant.message.model`.
   - In the same 500-file scan, every observed model field was located at `assistant.message.model`.
   - No root-level `model` fields were observed.
   - Typical values observed locally:
     - `claude-opus-4-6`
     - rare synthetic values such as `<synthetic>`
   - Therefore:
     - use `assistant.message.model` for pricing/model attribution
     - do not look for model on `user` or `tool_result` records

8. Message typing works at two distinct layers, and this matters for parsers.
   - Root JSONL line layer:
     - `assistant`
     - `user`
     - `system`
     - `progress`
     - `queue-operation`
     - `file-history-snapshot`
     - other low-frequency metadata lines
   - Inner message/content layer:
     - `message.role` is usually `assistant` or `user`
     - `message.content[]` items carry fine-grained types like `text`, `thinking`, `tool_use`, `tool_result`, `image`
   - This is the key correction to a common assumption:
     - `tool_use` is not a root transcript line type in the sampled corpus
     - `tool_result` is not a root transcript line type in the sampled corpus
     - they are inner content-item types

9. There are also subagent transcripts, and they use the same basic structure with extra agent metadata.
   - Main/root sessions live directly under project folders in `~/.claude/projects/.../*.jsonl`
   - Subagent sessions live under `~/.claude/projects/.../subagents/agent-*.jsonl`
   - Local scan counts:
     - 640 root session files
     - 9,726 subagent files
   - Subagent lines add fields like `agentId`, but still use the same `assistant.message.usage` and `assistant.message.model` locations

10. A 30-minute root-session transcript is typically around 1-2.5 MB, with a local median of 1.65 MB.
   - I scanned 629 parseable root transcripts and computed duration from first-to-last line timestamps.
   - For sessions between 25 and 35 minutes (`n = 65`):
     - median size: `1,652,996` bytes
     - mean size: `1,839,434` bytes
     - 25th percentile: `1,094,290` bytes
     - 75th percentile: `2,572,616` bytes
     - median line count: `486`
     - median duration: `29.44` minutes
   - Practical estimate for implementation:
     - expect a normal 30-minute main transcript to land around `~1.1 MB` to `~2.6 MB`
     - lighter sessions can be below `500 KB`
     - tool-heavy sessions can exceed `2.5 MB`

11. Incremental parsing should be byte-offset-based, append-safe, and tolerant of malformed trailing lines.
   - Best model:
     - persist `offset` in bytes, not line number
     - reopen the file with `start: offset`
     - parse only complete newline-terminated lines
     - if the final chunk ends with an incomplete line, keep it in memory and do not advance `offset` past it
   - On the next poll:
     - reopen from the last committed offset
     - re-read the incomplete tail once the writer finishes the line
   - Also persist a small parser state:
     - `offset`
     - `lastSeenUuid` or `lastSeenMessageId` for optional dedupe
     - file fingerprint such as `(path, size, mtime)` or `(path, inode)` if available
   - Reset rules:
     - if `stat.size < savedOffset`, assume truncation/rotation and reset to `0`
     - if the file identity changes unexpectedly, reset and rebuild

12. Real transcripts are not always perfectly parseable, so the parser must handle partial/corrupted lines without failing the entire session.
   - In the local root-session corpus:
     - 635 root files parsed cleanly
     - 5 root files were malformed
   - Observed failure modes:
     - empty line where JSON was expected
     - truncated object missing a comma delimiter
   - Public bug reports also show transcript corruption/pathology cases, including runaway `file-history-snapshot` spam.
   - Implementation consequence:
     - treat parse failures on the final line as transient unless proven otherwise
     - log and skip unrecoverable malformed lines, but do not discard the whole file

13. The safest token-extraction rule is to sum `assistant.message.usage` across assistant records, including tool-call turns.
   - If you want full session totals, include:
     - assistant text replies
     - assistant thinking-only emissions
     - assistant tool-call messages with `stop_reason: "tool_use"`
   - Do not count:
     - `tool_result` user messages
     - `progress` lines
     - `system` lines
     - `queue-operation` lines
     - `file-history-snapshot` lines
   - Rationale:
     - each assistant record with `message.usage` corresponds to an actual model response step
     - tool-result lines are execution artifacts, not model billing events

14. For Node.js, a manual buffered stream parser is better than a naive whole-file read, and slightly more robust than plain `readline` if exact resume offsets matter.
   - Recommended approach:
     - `fs.createReadStream(path, { start: offset, encoding: null })`
     - accumulate `Buffer` chunks
     - split on byte `0x0A` (`\n`)
     - decode only complete lines
     - `JSON.parse()` each complete line
     - advance committed byte offset only after a full line is consumed
   - `readline` is acceptable for simple one-shot analysis, but a manual buffer splitter is better when you need:
     - exact byte offsets
     - partial-line recovery
     - newline-normalization control
     - lower ambiguity when resuming mid-file

15. Recommended Node.js parser shape:

```js
import fs from "node:fs";

export async function parseClaudeJsonlIncremental(path, startOffset, onRecord) {
  const stream = fs.createReadStream(path, { start: startOffset });
  let offset = startOffset;
  let carry = Buffer.alloc(0);

  for await (const chunk of stream) {
    const buffer = carry.length ? Buffer.concat([carry, chunk]) : chunk;
    let cursor = 0;

    while (true) {
      const nl = buffer.indexOf(0x0a, cursor);
      if (nl === -1) break;

      const lineBuf = buffer.subarray(cursor, nl);
      const line = lineBuf.toString("utf8").replace(/\r$/, "");

      if (line.trim() !== "") {
        const record = JSON.parse(line);
        await onRecord(record, offset);
      }

      offset += (nl - cursor) + 1;
      cursor = nl + 1;
    }

    carry = buffer.subarray(cursor);
  }

  return {
    nextOffset: offset,
    trailingBytes: carry.length,
    trailingBuffer: carry
  };
}
```

16. Recommended record filter for token extraction:

```js
function extractUsage(record) {
  if (record?.type !== "assistant") return null;

  const message = record.message;
  const usage = message?.usage;
  const model = message?.model;

  if (!usage || !model) return null;

  return {
    sessionId: record.sessionId ?? null,
    timestamp: record.timestamp ?? null,
    model,
    inputTokens: usage.input_tokens ?? 0,
    outputTokens: usage.output_tokens ?? 0,
    cacheCreationInputTokens: usage.cache_creation_input_tokens ?? 0,
    cacheReadInputTokens: usage.cache_read_input_tokens ?? 0,
    serviceTier: usage.service_tier ?? null,
    inferenceGeo: usage.inference_geo ?? null,
    speed: usage.speed ?? null,
    serverToolUse: usage.server_tool_use ?? null
  };
}
```

## Evidence
- Local corpus inspection on 2026-03-30:
  - `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Opencode-Env-Public/c211b5d0-fce0-47a3-a94a-ab5b7e42d8f7.jsonl`
  - `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Opencode-Env-Public/e12640fa-ebbb-4067-bb8d-9911d8e7b249.jsonl`
  - `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Opencode-Env-Public/e12640fa-ebbb-4067-bb8d-9911d8e7b249/subagents/agent-a5e9b5bec2eb47390.jsonl`
- Anthropic Claude Code Hooks reference: official documentation for `transcript_path` and hook input context, but not transcript body schema.  
  https://code.claude.com/docs/en/hooks
- Anthropic Claude Code Monitoring docs: official model/usage monitoring vocabulary (`model`, token counts, cache token counts, speed).  
  https://code.claude.com/docs/en/monitoring-usage
- Claude Code issue #8861: confirms that users currently resort to parsing transcript files/logs for detailed token metrics because status APIs expose only aggregates.  
  https://github.com/anthropics/claude-code/issues/8861
- Claude Code issue #9658: public evidence that transcript JSONL files can accumulate pathological `file-history-snapshot` entries and therefore should not be assumed to be clean conversational-only logs.  
  https://github.com/anthropics/claude-code/issues/9658

## New Information Ratio (0.0-1.0)
0.90

## Novelty Justification
This iteration adds concrete transcript-file evidence that earlier hook-focused iterations did not provide:

- exact observed location of `usage` and `model` (`assistant.message.*`, not root)
- distinction between root record types and inner `message.content[].type`
- proof that `tool_use` and `tool_result` are inner content-item types, not root line types
- observed usage-field variants including `server_tool_use`, `speed`, and nested `cache_creation`
- real-world size distribution for 30-minute sessions based on local corpus statistics
- concrete malformed-file rate and parser-failure modes from local transcripts
- a byte-offset incremental parsing design suitable for production extraction

## Recommendations for Implementation
- Treat the Claude transcript format as an observed schema, not a guaranteed public contract. Build optional-field parsing and schema drift tolerance into the extractor.
- Extract tokens only from `assistant.message.usage`. Do not attempt to infer billing from `tool_result`, `progress`, `system`, or snapshot lines.
- Use `assistant.message.model` for model attribution. Persist both tokens and model at the per-record level so later pricing logic can remain version-aware.
- Implement byte-offset incremental parsing with a manual buffered stream parser. Avoid whole-file re-parsing on each poll.
- Persist parser state per transcript:
  - `nextOffset`
  - file fingerprint
  - optional `lastSeenUuid` / `message.id` dedupe marker
- Treat malformed trailing lines as transient. Only commit offsets after complete newline-terminated records.
- Skip non-conversational root record types by default:
  - `file-history-snapshot`
  - `progress`
  - `queue-operation`
  - `system`
  - `last-prompt`
  - `custom-title`
  - `agent-name`
  - `pr-link`
- Support subagent transcripts explicitly. They live in `subagents/agent-*.jsonl` and share the same usage/model locations.
