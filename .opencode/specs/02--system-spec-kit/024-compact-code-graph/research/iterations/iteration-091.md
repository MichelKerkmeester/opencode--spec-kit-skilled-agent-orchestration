# Iteration 91: Verification of review P1-10 and key P2 findings against current code

## Focus
Verify the current implementation status of five review findings, with special attention to the security boundary in `code_graph_scan`:

1. P1-10: `code_graph_scan` can index arbitrary readable trees outside the workspace.
2. P2-1: compact-recovery cache freshness is never validated.
3. P2-2: the startup Working Memory branch is unreachable.
4. P2-3: transcript totals and USD estimates undercount cache buckets.
5. P2-8: `memory_context` and `code_graph_context` reflect internal exception text back to callers.

## Findings

### 1. P1-10 is VERIFIED: `code_graph_scan` accepts caller-controlled `rootDir` and never constrains it to the workspace root
`handleCodeGraphScan()` sets `rootDir` from `args.rootDir ?? process.cwd()`, feeds it straight into `getDefaultConfig(rootDir)`, and then calls `indexFiles(config)`. There is no normalization or boundary check against the workspace root before traversal starts. The underlying structural indexer then recursively walks `config.rootDir` with `readdirSync()` / `resolve()` and reads matching files under that tree.

In current code, any caller that can invoke the tool can point `rootDir` at a different readable source tree on disk, not just the current repository. The default is the workspace root, but the optional override is effectively unrestricted.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:30-39]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:97-105]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:392-445]

### 2. P2-1 is VERIFIED: compact-recovery cache freshness is never enforced at the point of reuse
`handleCompact()` only checks whether `state.pendingCompactPrime` exists, logs its `cachedAt`, injects the payload, and clears it. It never compares `cachedAt` to the current time or rejects old payloads. The only age-based use of `cachedAt` I found is in `session-stop.ts`, where recent cached state suppresses duplicate auto-saves; that logic does not protect the later SessionStart recovery path.

The existing edge-case test also explicitly preserves a very old `cachedAt` value and treats it as readable state, which matches the implementation.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:39-53]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:149-156]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:142-155]

### 3. P2-2 is VERIFIED WITH NUANCE: the startup Working Memory branch is effectively unreachable from the current hook pipeline
On startup, `handleStartup()` reads `state.workingSet` via an ad hoc cast to `Record<string, unknown>` and emits a `Working Memory` section only if that field is a non-empty array. But `HookState` does not define `workingSet`, the default state created by `updateState()` does not include it, and a repository-wide search for `workingSet` only found this read site.

So the branch is not logically impossible, but it is unreachable in normal in-repo operation because there is no producer that persists `workingSet` into hook state.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:119-133]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-28]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:79-95]
[SOURCE: repository search for `workingSet` across `.opencode/skill/system-spec-kit/mcp_server` on 2026-03-31 returned only `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:123-127`]

### 4. P2-3 is VERIFIED: transcript totals and surfaced cost estimates exclude the cache buckets
`parseTranscript()` does parse `cache_creation_input_tokens` and `cache_read_input_tokens`, and it stores them in `cacheCreationTokens` and `cacheReadTokens`. But `usage.totalTokens` is incremented with only `prompt + completion`. `estimateCost()` likewise prices only `promptTokens` and `completionTokens`; the cache buckets are ignored.

`session-stop.ts` then logs and stores that reduced total in the token snapshot path. The tests reinforce the same behavior: they assert that cache buckets are captured separately, while `totalTokens` and cost expectations continue to reflect only prompt/completion accounting.

Whether every cache bucket should be billed depends on product pricing semantics, but the code-level review claim is still correct: the totals and USD estimates surfaced by this implementation do not include the parsed cache buckets.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:87-99]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:120-142]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:51-69]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:101-121]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-stop-token-tracking.vitest.ts:77-94]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-stop-token-tracking.vitest.ts:97-135]

### 5. P2-8 is VERIFIED: both `memory_context` and `code_graph_context` reflect raw internal exception text back to callers
`memory_context` exposes internal exception text in multiple places. On database state check failure it returns `Database state check failed: ${message}`. On strategy failure it returns `error: toErrorMessage(error)`, and `toErrorMessage()` is just `err instanceof Error ? err.message : String(err)`. It also forwards upstream strategy details into the response envelope. Separately, `handleCodeGraphContext()` catches any thrown error from `buildContext()` and returns `code_graph_context failed: ${err.message}` directly to the caller.

That means both surfaces currently expose internal exception strings rather than mapping them to sanitized error categories.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:984-996]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1163-1185]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1188-1205]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/utils/db-helpers.ts:46-47]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:59-92]

## Ruled Out
- Treating `session-stop`'s duplicate-save age check as protection for `session-prime` compact recovery freshness. The read path never consults age.
- Treating the startup Working Memory branch as impossible in principle. It is externally reachable if some out-of-band writer injects `workingSet`; it is just not produced anywhere in the current hook pipeline.
- Treating cache buckets as absent from transcript parsing. They are parsed correctly; the undercount happens when totals and cost estimates are derived.

## Dead Ends
- Prior markdown artifacts for iterations 088-090 were not present in the local tree, so I could not compare their prose directly and instead verified against current source plus the JSONL state log.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/utils/db-helpers.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/hook-stop-token-tracking.vitest.ts`

## Assessment
- New information ratio: **0.67**
- Questions addressed: **5/5**
- Questions answered:
  1. `code_graph_scan` still accepts caller-controlled `rootDir` without workspace-boundary validation.
  2. `session-prime` still consumes `pendingCompactPrime` without freshness checks.
  3. The startup `Working Memory` branch still has no in-repo `workingSet` producer.
  4. Transcript totals and surfaced cost estimates still exclude cache buckets.
  5. `memory_context` and `code_graph_context` still reflect raw internal exception text back to callers.

## Reflection
- **What worked and why:** Tracing each finding from handler entrypoint into its downstream helper or test quickly separated real, still-live behavior from stale review wording. The `scan.ts` -> `indexer-types.ts` -> `structural-indexer.ts` chain was especially effective for confirming the P1-10 boundary.
- **What did not work and why:** Looking for prior markdown writeups from iterations 088-090 did not help because those files were not present locally. Current source and the JSONL state log were more reliable than relying on missing artifacts.
- **What I would do differently:** For future verification waves, start with a repo-wide producer/consumer search before reading entire hook files. That would have identified the dead `workingSet` branch almost immediately.

## Recommended Next Focus
Prioritize remediation design and verification for the most externally exposed findings first:

1. workspace-boundary enforcement for `code_graph_scan` (`rootDir` must resolve under the active workspace root), and
2. error sanitization for `memory_context` / `code_graph_context`, where internal exception strings currently cross the MCP boundary.
