# Iteration 89: Verification of Deep Review P1 Findings 4-6 Against Current Code

## Focus
Verify deep review P1 findings 4-6 against the live implementation:

1. P1-4: whether the advertised stop-time auto-save path is actually implemented, or whether `pendingCompactPrime` is being reused as a surrogate.
2. P1-5: whether the structural indexer still collapses symbol ranges to one line, and whether any fix has landed since the Segment 6 research.
3. P1-6: whether the public `code_graph_context` handler strips manual/graph seed identity during seed normalization.

## Findings

### 1. P1-4 is TRUE: the stop hook still has no dedicated auto-save path and reuses `pendingCompactPrime` as a surrogate
The current stop hook does not perform any real context-save operation. There is no call to `generate-context.js`, no memory-save helper, and no dedicated persisted auto-save field in hook state.

Instead, the stop hook does two things with `pendingCompactPrime`:

- it treats an existing `pendingCompactPrime.cachedAt` as evidence of a recent prior save and uses it to suppress duplicate stop-time behavior
- when completion tokens exceed the threshold, it writes a new `pendingCompactPrime` payload containing only a recovery hint string telling the agent to call `memory_context({ mode: "resume", profile: "resume" })`

That same `pendingCompactPrime` field is also the cache written by the PreCompact hook. So the stop-time "auto-save" path is not a separate implementation; it is reusing the compaction-prime cache slot as a lightweight surrogate.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:146-167]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-28]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:234-241]

### 2. P1-5 is TRUE: the end-line fix has not landed, so multi-line range handling is still broken
No corrective fix is present in the current structural indexer. All three regex parsers still stamp captures with `endLine: lineNum`:

- JS/TS functions, arrows, classes, interfaces, types, enums, imports, exports
- Python classes, functions, methods, imports
- Bash functions

Those one-line ranges flow directly into `capturesToNodes()`, so every node inherits the collapsed range. Two downstream problems are still present:

- `CALLS` extraction only scans `contentLines.slice(caller.startLine - 1, caller.endLine)`, which means multi-line function and method bodies are reduced to their declaration line. Calls on later body lines are therefore missed.
- enclosing-symbol resolution in `resolveSeed()` still depends on `start_line <= ? AND end_line >= ?`. With `endLine === startLine`, a seed on an interior body line will usually fail the enclosing match unless it happens to point at the declaration line itself.

So the research finding remains current: the range-collapse bug is still present, and no fix has been applied since Segment 6. The only nuance is that `CALLS` is not universally zero: one-line definitions or declaration-line calls can still resolve. The bug remains a real correctness problem for normal multi-line bodies.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:39-42]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:45-48]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:51-61]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:119-143]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:163-166]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:178-191]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:282-313]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:194-213]

### 3. P1-6 is TRUE: the public `code_graph_context` handler strips manual/graph seed identity before resolution
The public handler accepts provider-typed seed inputs that include `provider`, `symbolName`, `kind`, `nodeId`, and `symbolId`. But during normalization it converts everything into plain `CodeGraphSeed[]`.

The live mapping logic does this:

- CocoIndex seeds keep only `filePath`, `startLine`, `endLine`, and `query`
- all non-CocoIndex seeds are also reduced to `filePath`, `startLine`, `endLine`, and `query`

That means the handler discards:

- `provider`
- `symbolName`
- `kind`
- `nodeId`
- `symbolId`

before calling `buildContext()`.

This matters because the lower-level resolver still has distinct seed types and distinct handlers:

- `resolveManualSeed()` expects `provider: 'manual'` plus `symbolName`
- `resolveGraphSeed()` expects `provider: 'graph'` plus `symbolId`
- `resolveSeeds()` can route correctly only if that identity survives into `resolveAnySeed()`

But the public handler erases that identity first, so manual and graph seeds can no longer take their intended resolution path. Graph seeds lose the pre-resolved `symbolId` fast path, and manual seeds lose symbol-name-based lookup.

So the deep review finding is correct: the public `code_graph_context` entry point strips manual/graph seed identity during processing.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:9-31]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:39-57]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:14-23]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:47-53]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:18-43]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:82-165]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:242-247]

## Synthesis
All three target review findings remain valid against the current code.

- **P1-4:** confirmed as an implementation gap: stop-time "auto-save" still writes a surrogate recovery payload into `pendingCompactPrime` instead of performing a dedicated save flow.
- **P1-5:** confirmed unchanged since Segment 6: symbol ranges still collapse to one line, which still undermines multi-line `CALLS` extraction and enclosing-symbol resolution.
- **P1-6:** confirmed as a public-handler normalization bug: provider-specific seed identity is still erased before resolution.

## Ruled Out
- Claiming the stop hook already performs a dedicated context-save operation
- Claiming the end-line/range-collapse fix has landed since the Segment 6 research
- Claiming manual and graph seeds preserve their provider-specific identity through the public `code_graph_context` handler

## Dead Ends
None. The requested source files plus the adjacent resolver/state files were sufficient to verify all three findings.

## Sources Consulted
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts`

## Assessment
- New information ratio: 0.36
- Questions addressed: P1-4, P1-5, and P1-6 verification against current code
- Questions answered:
  - P1-4 is still true: the stop hook reuses `pendingCompactPrime` instead of a dedicated auto-save path
  - P1-5 is still true: the end-line fix has not landed, so multi-line range handling remains broken
  - P1-6 is still true: the public handler still strips manual/graph seed identity before resolution

## Reflection
- What worked and why: Reading each finding's surface file together with its adjacent state/resolution dependency made it possible to verify the implementation consequences rather than just the local symptom. In particular, `session-stop.ts` only becomes clearly "surrogate auto-save" once read alongside `hook-state.ts` and `compact-inject.ts`, and the `code_graph_context` handler bug is only obvious when paired with `seed-resolver.ts`.
- What did not work and why: The requested `iteration-088.md` file does not exist, so there was no immediate prior iteration note to anchor wording from. Existing nearby iteration files were enough to keep the output shape consistent.
- What I would do differently: For future review verification passes, I would always read the public entry point and the downstream typed resolver in the same batch up front, because several of these issues are type-erasure or contract-mismatch problems rather than isolated local bugs.

## Recommended Next Focus
Continue the P1 verification wave with findings 7-10, especially any claims that depend on public handler contracts versus lower-level helper capabilities, since this wave surfaced multiple "supports it internally, loses it at the boundary" mismatches.
