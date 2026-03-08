# R05 - Claude Code session log structure for mining session data

## Summary

Claude Code logs are present on this machine under `~/.claude/`, and the primary mineable session transcripts live under `~/.claude/projects/`. The per-project transcript format is JSONL with rich event records, but **full user prompts are not consistently stored as plain `user.text` records inside the main transcript**; to reconstruct prompts reliably, combine project transcripts with `~/.claude/history.jsonl` and `last-prompt` records.

## 1. `~/.claude/` existence and structure

Observed: `~/.claude/` exists.

Top-level contents observed include:

- `~/.claude/CLAUDE.md`
- `~/.claude/history.jsonl`
- `~/.claude/settings.json`
- `~/.claude/stats-cache.json`
- directories such as `backups/`, `cache/`, `debug/`, `plugins/`, `projects/`, `telemetry/`, `todos/`, `transcripts/`

Relevant directories for session mining:

- `~/.claude/projects/` - per-project session transcripts and session artifacts
- `~/.claude/history.jsonl` - global prompt history with `project` + `sessionId`
- `~/.claude/transcripts/` - extra JSONL transcripts also exist, but `projects/` is the strongest source for project-scoped mining

## 2. JSONL transcript files in `~/.claude/projects/`

Observed project directory naming pattern:

- Current repo cwd: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public`
- Corresponding Claude project folder: `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Opencode-Env-Public/`

Observed file pattern inside that folder:

- top-level main session transcripts: `<session-id>.jsonl`
- matching session artifact folder: `<session-id>/`
- nested subagent transcripts: `<session-id>/subagents/agent-*.jsonl`
- nested subagent metadata: `<session-id>/subagents/agent-*.meta.json`
- persisted large tool outputs: `<session-id>/tool-results/*.txt`

Examples observed:

- `.../e425d56e-fcaf-4f0f-9fcf-68738f7933fe.jsonl`
- `.../e425d56e-fcaf-4f0f-9fcf-68738f7933fe/subagents/agent-*.jsonl`
- `.../e425d56e-fcaf-4f0f-9fcf-68738f7933fe/tool-results/toolu_....txt`

## 3. Claude Code session transcript format

Main transcript files are newline-delimited JSON objects. In sampled main-session files, the most common record types were:

- `progress`
- `assistant`
- `user`
- `queue-operation`
- `system`
- `file-history-snapshot`
- `last-prompt`

### 3.1 Common top-level fields

Many records share these fields:

- `type`
- `timestamp`
- `sessionId`
- `cwd`
- `gitBranch`
- `version`
- `uuid`
- `parentUuid`
- `userType`
- sometimes `slug`, `requestId`, `toolUseID`, `parentToolUseID`

### 3.2 `assistant` records

Sample shape:

- `type: "assistant"`
- `message.model`
- `message.id`
- `message.role`
- `message.type`
- `message.content[]`
- `message.usage`

Observed `assistant.message.content[]` item types:

- `thinking`
- `text`
- `tool_use`

Example tool call payload shape inside `assistant.message.content[]`:

```json
{
  "type": "tool_use",
  "id": "toolu_...",
  "name": "Read",
  "input": {
    "file_path": "/abs/path/to/file"
  },
  "caller": {
    "type": "direct"
  }
}
```

Observed tool names in one sampled session included:

- `Read`
- `Edit`
- `Write`
- `Bash`
- `Glob`
- `Grep`
- `Agent`
- `TaskOutput`
- `ToolSearch`
- `Skill`

This is enough to reconstruct tool name + structured input arguments directly from transcript lines.

### 3.3 `user` records

`user.message.content[]` contained both:

- `tool_result`
- sometimes `text`

Important nuance:

- In sampled main-session files, most `user` records were **tool results**, not raw human prompts.
- Some `user.text` entries were interruption markers such as `[Request interrupted by user for tool use]` rather than the original prompt.
- Full raw prompt text was observed more reliably in:
  - `~/.claude/history.jsonl` (`display`, `project`, `sessionId`)
  - `last-prompt` records in the project transcript
  - nested `progress.data.message.message.content[].text` for delegated agent prompts

### 3.4 `progress` records

Observed `progress.data.type` values:

- `hook_progress`
- `agent_progress`
- `bash_progress`

Examples:

- `hook_progress` captures hook event name and command
- `agent_progress` can embed the delegated agent prompt and message envelope
- `bash_progress` can contain streamed command output in `output` / `fullOutput`

This makes `progress` useful for recovering incremental execution details even before the final tool result lands.

### 3.5 `system` records

Observed `system.subtype` values:

- `stop_hook_summary`
- `turn_duration`
- `compact_boundary`

These provide execution metadata such as hook timing and per-turn duration.

### 3.6 `queue-operation` records

Observed shape includes:

- `operation`
- `timestamp`
- `sessionId`
- `content`

The `content` field can include XML-like task notifications referencing:

- background task IDs
- tool use IDs
- output file paths
- status summaries

### 3.7 `file-history-snapshot` records

Observed shape:

```json
{
  "type": "file-history-snapshot",
  "messageId": "...",
  "snapshot": {
    "messageId": "...",
    "trackedFileBackups": {
      "relative/path": {
        "backupFileName": "...",
        "version": 1,
        "backupTime": "..."
      }
    },
    "timestamp": "..."
  },
  "isSnapshotUpdate": true
}
```

This is a strong source for touched/edited files.

## 4. What data can be extracted from Claude Code logs

### 4.1 User messages and assistant responses

#### User messages

Best sources, in order:

1. `~/.claude/history.jsonl`
   - fields observed: `display`, `timestamp`, `project`, `sessionId`
   - strongest source for plain-language top-level user prompts
2. transcript `last-prompt`
   - fields: `lastPrompt`, `sessionId`
3. transcript `user.message.content[].text`
   - useful when present, but not reliable as the only source

#### Assistant responses

Use `assistant.message.content[]`:

- `text` items for natural-language response text
- `thinking` items if explicitly desired and permitted
- `tool_use` items for action trace

Assistant metadata also includes:

- `message.model` (observed: `claude-opus-4-6`)
- token usage in `message.usage`
- `requestId`
- timestamps and session IDs

### 4.2 Tool calls with inputs and outputs

#### Tool inputs

Directly extract from `assistant.message.content[]` items where `type == "tool_use"`:

- `name` -> tool name
- `input` -> structured arguments
- `id` -> join key for outputs

#### Tool outputs

Primary sources:

1. `user.message.content[]` items where `type == "tool_result"`
   - includes `tool_use_id`
   - includes inline `content`
   - may include `is_error`
2. `user.toolUseResult`
   - can contain structured material such as returned file content
3. persisted text files in `<session-id>/tool-results/`
   - used when output is large
   - transcript content explicitly references saved output file paths
4. `progress.data.type == "bash_progress"`
   - gives incremental stdout/stderr fragments

This is enough to pair tool calls to results by `tool_use_id` and reconstruct a high-fidelity action log.

### 4.3 Session metadata

Observed metadata extractable per record/session:

- `sessionId`
- `timestamp`
- `cwd`
- `gitBranch`
- `version`
- `slug`
- `requestId` (assistant records)
- `userType`
- `durationMs` (from `system` / `turn_duration`)
- model (`assistant.message.model`)
- project path (from transcript `cwd` and history `project`)

## 5. How to identify the current / most recent session

### Project-scoped approach

For a known cwd/project:

1. Sanitize the cwd into the project directory name used by Claude under `~/.claude/projects/`
2. Look inside that project directory for top-level `*.jsonl`
3. Pick the newest top-level transcript by file mtime
4. Treat the filename stem as the `sessionId`
5. Optionally confirm with the newest `~/.claude/history.jsonl` entry for the same `project`

Observed relationship:

- main transcript: `.../<session-id>.jsonl`
- session artifact folder: `.../<session-id>/`

### Additional signals

- newest `timestamp` inside the JSONL file
- presence of a matching `<session-id>/tool-results/` or `<session-id>/subagents/`
- newest history entry in `~/.claude/history.jsonl` for the same `project`
- `last-prompt.sessionId`

### Recommendation

Use **history + project transcript together**:

- `history.jsonl` to find the latest session for a project and recover the prompt text
- top-level project transcript to recover assistant/tool/system events for that `sessionId`

## 6. Mapping Claude data to expected input format

Target format from `generate-context.ts` / `collect-session-data.ts`:

- `userPrompts[]` with `{ prompt, timestamp? }`
- `observations[]` with `{ type?, title?, narrative?, facts?, timestamp?, files? }`
- `FILES[]` with `{ FILE_PATH, DESCRIPTION }`
- `recentContext[]` with `{ learning?, request?, continuationCount?, files? }`

### 6.1 `userPrompts`

Recommended mapping:

1. From `~/.claude/history.jsonl` rows matching the chosen `sessionId`
   - `prompt = display`
   - `timestamp = timestamp` (convert ms epoch to ISO if needed)
2. Supplement with transcript `last-prompt.lastPrompt`
3. Supplement with transcript `user.message.content[].text` only when it is real prompt text

Why: relying on project transcript `user` records alone will under-capture prompts in tool-heavy sessions.

### 6.2 `observations`

Build observations from Claude events such as:

- assistant text summaries -> `type: progress` or `note`
- tool uses -> titles like `Used Read on X`, `Ran Bash command`, `Edited file`
- tool results -> facts/narrative from outputs, especially error messages or success summaries
- `system.turn_duration` -> timing observation
- `queue-operation` -> background-task completion observation
- `agent_progress` -> delegated-research observation

Suggested shape:

```json
{
  "type": "progress",
  "title": "Ran Bash command",
  "narrative": "Executed npm test and received 2 failing tests.",
  "facts": ["tool=Bash", "exit_code=1"],
  "timestamp": "...",
  "files": ["src/foo.ts"]
}
```

### 6.3 `FILES`

Strongest file sources, in order:

1. `file-history-snapshot.snapshot.trackedFileBackups` keys
2. `assistant.message.content[].tool_use.input.file_path`
   - especially for `Read`, `Edit`, `Write`
3. `user.toolUseResult.file.filePath` when present
4. parsed file references from tool outputs (lower confidence)

Recommended `FILES` mapping:

- `FILE_PATH` -> normalized relative path under project root
- `DESCRIPTION` -> derived from tool type or result, e.g.:
  - `Read during session`
  - `Edited during session`
  - `Written during session`
  - `Modified during session (from file-history snapshot)`

### 6.4 `recentContext`

Possible mapping:

- `request` -> latest matching `history.jsonl.display` or `last-prompt.lastPrompt`
- `files` -> distinct normalized file list collected for `FILES`
- `learning` -> synthesized from assistant summary text, final tool results, or recent observations
- `continuationCount` -> not directly obvious from the sampled Claude schema; can default conservatively or infer externally

## 7. Security considerations

### 7.1 Path traversal and path trust

Do not trust path strings from transcript records directly.

Required safeguards:

- canonicalize all candidate paths with `path.resolve`
- ensure mined files stay under the expected roots:
  - `~/.claude/projects/`
  - `~/.claude/history.jsonl`
  - current project root when normalizing file paths
- reject `..` traversal after normalization
- avoid following arbitrary transcript-referenced output paths unless they resolve inside the matching `<session-id>/tool-results/` or other explicitly allowed Claude-owned locations

### 7.2 Data sensitivity

Claude logs can contain highly sensitive content:

- raw user prompts
- assistant responses
- full file contents returned by `Read`
- diffs or replacement strings from `Edit`
- shell commands and shell output
- absolute filesystem paths
- background task outputs

Implications:

- never mine across unrelated projects by default
- scope extraction to the current project and selected `sessionId`
- avoid dumping raw transcript content into saved memory unless necessary
- prefer summarization over verbatim capture
- redact secrets / tokens / credentials / personal paths where possible

### 7.3 Cross-project contamination

Because `~/.claude/history.jsonl` is global, always filter by both:

- `project == current cwd`
- matching `sessionId`

This prevents mixing prompts from different repositories or terminals.

## 8. Practical extraction strategy for stateless mode

Recommended stateless fallback for Claude Code:

1. Detect Claude environment by presence of `~/.claude/projects/` and `~/.claude/history.jsonl`
2. Map current cwd to Claude's sanitized project folder name
3. Select latest top-level `*.jsonl` for that project
4. Join with matching `history.jsonl` rows on `sessionId`
5. Extract:
   - `userPrompts` from history + `last-prompt`
   - `observations` from assistant/tool/system/progress events
   - `FILES` from `file-history-snapshot` + file-based tool calls
6. Optionally read `tool-results/*.txt` for oversized outputs referenced by transcript lines
7. Normalize all file paths relative to project root and redact sensitive content before saving memory

## 9. Key takeaway

Claude Code provides enough local data to build a high-quality stateless capture path, but the data is split across multiple sources:

- `~/.claude/history.jsonl` for human prompts
- `~/.claude/projects/<project>/<session>.jsonl` for assistant/tool/system events
- `~/.claude/projects/<project>/<session>/tool-results/*.txt` for oversized outputs
- `file-history-snapshot` records for touched files

So the Claude-compatible capture path should be a **multi-source join**, not a single-file parser.
