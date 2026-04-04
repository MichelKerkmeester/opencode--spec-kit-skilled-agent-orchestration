# Research Iteration 008: Compaction, Working Set, and Pre-Merge Shaping

## Focus

Use `opencode-lcm` to find net-new improvements for compaction behavior, working-set signals, cached compact payloads, and budget shaping in the existing compact-brief pipeline.

## Findings

### We Already Have A Better Working-Set Primitive Than We Use

Our compaction path still builds its working set from transcript heuristics even though the runtime already contains a recency-weighted `WorkingSetTracker`.

- `compact-inject` tails transcript lines and regex-extracts files/topics/identifiers [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:21-55`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:193-245`]
- `WorkingSetTracker` already exposes top files and top symbols by recency-weighted score [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:15-53`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:111-153`]

The immediate improvement is to use tracked roots/symbols first and transcript heuristics only as fallback.

### The Main Budget Gap Is Before `mergeCompactBrief()`

`mergeCompactBrief()` already handles:

- budget allocation
- truncation
- file-path deduplication

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:137-176`]

But `opencode-lcm` is stronger before rendering:

- overfetch
- rank
- apply quotas
- suppress fresh hits
- stop early when enough good hits are found

[SOURCE: `external/opencode-lcm-master/src/store.ts:2947-3053`] [SOURCE: `external/opencode-lcm-master/src/store.ts:3201-3240`]

So we should keep the merger and add a **pre-merge candidate selector**.

### We Lack An Anti-Feedback Guard

`opencode-lcm` strips its own archive markers, telemetry, and hints before future retrieval tokenization. [SOURCE: `external/opencode-lcm-master/src/utils.ts:274-289`]

Our compact-cache builder scans transcript lines directly, so recovered compact text can become future input signal and bias the next compact brief.

### Current Compact State Is Too Ephemeral

Today we store one `pendingCompactPrime`, reject it after 30 minutes, and clear it after one successful injection. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:19-28`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:44-87`]

`opencode-lcm` also maintains a durable compaction resume note. [SOURCE: `external/opencode-lcm-master/src/store.ts:2859-2873`] [SOURCE: `external/opencode-lcm-master/src/store.ts:3242-3275`]

The better pattern for us is:

- one-shot injection cache
- durable latest compact brief with metadata

## Recommendations

1. Feed `WorkingSetTracker.getTopRoots()` and `getTopSymbols()` into compact-brief assembly.
2. Add a pre-merge ranking stage for graph roots, symbols, triggered memories, and semantic neighbors.
3. Strip prior recovered-context markers from transcript-derived inputs before extracting signals.
4. Split compact state into a one-shot cache and a durable latest compact brief artifact.

## Duplication Check

This is new relative to earlier packet research because it identifies:

- the unused internal `WorkingSetTracker` as an immediate upgrade path
- the pre-merge candidate-selection gap
- the anti-feedback sanitization pattern
- the difference between our one-shot hook cache and the plugin's durable compaction note
