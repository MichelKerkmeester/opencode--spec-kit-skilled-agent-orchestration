# Iteration 3 -- 003-contextador

## Metadata
- Run: 3 of 10
- Focus: self-healing loop end to end across `feedback.ts`, `janitor.ts`, `generator.ts`, `freshness.ts`, and `enrichFromFeedback()` in `mcp.ts`
- Agent: cli-codex (gpt-5.4, model_reasoning_effort=high)
- Started: 2026-04-06T10:44:21Z
- Finished: 2026-04-06T10:47:26Z
- Tool calls used: 9

## Reading order followed
1. `external/src/lib/core/feedback.ts` `1-160`
2. `external/src/lib/core/generator.ts` `1-157`
3. `external/src/lib/core/freshness.ts` `1-171`
4. `external/src/lib/core/janitor.ts` `1-492`
5. `external/src/mcp.ts` `101-174`, `286-340`, `436-448`
6. `external/src/lib/core/stats.ts` `1-108`

## Findings

### F3.1 -- `processFeedback()` patches `CONTEXT.md` and optionally queues repair work, but stats writes happen in the MCP caller, not inside `feedback.ts`
- Source evidence: `external/src/lib/core/feedback.ts:24-47`, `external/src/lib/core/feedback.ts:53-97`, `external/src/lib/core/feedback.ts:106-143`, `external/src/mcp.ts:296-306`, `external/src/lib/core/stats.ts:29-41`, `external/src/lib/core/stats.ts:53-58`
- Evidence type: source-proven
- What it shows: `processFeedback()` always targets `<root>/<scope>/CONTEXT.md`. If that file exists, it increments `feedback_failures` in frontmatter for all feedback types. For `missing_context`, it also appends raw `missingFiles` bullets into `## Key Files` and writes the patched `CONTEXT.md`. For `build_failure` and `wrong_location`, it writes the updated `CONTEXT.md` and appends a deduplicated `{scope, reason, addedAt}` entry to `.contextador/repair-queue.json`. If `CONTEXT.md` does not exist, it does not create or patch that file; it only queues repair work. Separately, the MCP tool calls `recordFeedback(ROOT)`, which increments `feedbackReports` and updates `lastUsed` in `.contextador/stats.json`.
- Why it matters for Code_Environment/Public: The self-healing claim is narrower than “feedback rewrites everything automatically.” The source proves three concrete write targets on feedback: the scope `CONTEXT.md`, `.contextador/repair-queue.json`, and `.contextador/stats.json`, with the stats write owned by `mcp.ts` rather than the repair library.
- Affected subsystem: feedback ingestion and accounting
- Open questions resolved: Q4, partial Q5
- Risk / ambiguity: `addToKeyFiles()` in `feedback.ts` does not deduplicate bullets, so repeated `missing_context` reports can keep appending duplicate file lines (`external/src/lib/core/feedback.ts:53-68`, `external/src/lib/core/feedback.ts:123-128`).

### F3.2 -- The explicit feedback path is mostly synchronous and narrower than the return message suggests
- Source evidence: `external/src/mcp.ts:104-115`, `external/src/mcp.ts:296-340`
- Evidence type: source-proven
- What it shows: There are two different sweep paths. Query-time missing-scope handling uses `triggerBackgroundSweep()`, which runs only `processRepairQueue(ROOT)` plus `freshnessSweep(ROOT)` behind the `sweepInProgress` guard. The explicit `context_feedback` path does not call `triggerBackgroundSweep()`. Instead, when `missingFiles` exist or the type is not `missing_context`, it synchronously runs only `processRepairQueue(ROOT)` before calling `enrichFromFeedback()`. The returned string says “Context enriched and background sweep queued,” but this code path does not actually queue or launch the background freshness sweep shown at lines 104-115.
- Why it matters for Code_Environment/Public: The source-backed behavior is “repair queue processing now, full sweep later only through other entry points,” not “full asynchronous janitor pass on every feedback report.” That distinction matters if we evaluate whether contextador is truly self-healing in-band or just partially self-repairing.
- Affected subsystem: MCP feedback orchestration
- Open questions resolved: Q4, partial Q5
- Risk / ambiguity: The confirmation text overstates what the code currently guarantees, so README or demo claims that imply a full post-feedback sweep should be treated as unverified until traced elsewhere.

### F3.3 -- `processRepairQueue()` consumes queued work in one pass, creates whole `CONTEXT.md` files when absent, and retries failed entries indefinitely
- Source evidence: `external/src/lib/core/janitor.ts:65-81`, `external/src/lib/core/janitor.ts:89-147`, `external/src/lib/core/generator.ts:101-157`, `external/src/lib/core/freshness.ts:155-170`
- Evidence type: source-proven
- What it shows: `processRepairQueue()` reads `.contextador/repair-queue.json` and exits early if the file is absent, invalid, or empty. For each queued entry, it either creates the scope directory and writes a full `CONTEXT.md` using `generateContextContent(root, scope)` with a stub fallback, or, if `CONTEXT.md` already exists, checks freshness and stamps stale files with current frontmatter. Entries that succeed are removed because the queue file is rewritten with only `remaining` failed entries. There is no retry counter, backoff, or failure cutoff; failed items stay in the queue for the next run.
- Why it matters for Code_Environment/Public: The repair queue is a real work queue, but it is not a managed job system. It supports single-pass consumption and eventual retry, not bounded retries or durable per-entry state transitions.
- Affected subsystem: janitor repair queue
- Open questions resolved: Q4, partial Q5
- Risk / ambiguity: The action label says `created stub`, but the happy path first attempts AI-generated full content and only falls back to the stub template on generation failure (`external/src/lib/core/janitor.ts:116-125`).

### F3.4 -- `enrichFromFeedback()` deterministically rewrites `CONTEXT.md` Key Files and Notes from live file reads; it is not model-driven
- Source evidence: `external/src/mcp.ts:119-174`
- Evidence type: source-proven
- What it shows: After the synchronous repair-queue pass, `enrichFromFeedback()` reopens `<scope>/CONTEXT.md`, reads each reported missing file from disk, extracts a one-line description from the first comment or the first exported symbol, and either replaces an existing `Key Files` bullet for that basename or appends a new one. If `detail` is longer than 20 characters, it appends a bullet under `## Notes`, creating that section if needed, then writes the entire `CONTEXT.md` back to disk. If the scope file is still absent, it returns without writing anything.
- Why it matters for Code_Environment/Public: This is the strongest source-proven “self-improving” behavior in the loop, but it is rule-based enrichment, not learned summarization. The system is turning concrete agent discoveries into durable context patches using regex extraction and file IO.
- Affected subsystem: feedback-driven context enrichment
- Open questions resolved: Q4, partial Q5
- Risk / ambiguity: The inserted `Key Files` entry uses the basename rather than the original relative path, so same-named files from different folders could collide in one scope’s list (`external/src/mcp.ts:143-149`).

### F3.5 -- Freshness decisions combine git drift with success/failure ratios, and the thresholds are deterministic
- Source evidence: `external/src/lib/core/freshness.ts:4-6`, `external/src/lib/core/freshness.ts:95-153`, `external/src/lib/core/janitor.ts:149-157`, `external/src/lib/core/janitor.ts:167-235`
- Evidence type: source-proven
- What it shows: Freshness is computed from frontmatter plus git history. A file is major-stale if it has never been validated or is at least 3 commits or 3 days behind; otherwise it may be minor-stale. `freshnessSweep()` then layers deterministic policy on top: if a file is not stale but has a failure ratio above 0.5 with at least 3 failures, it regenerates anyway; if it is minor-stale with failure ratio above 0.3, it regenerates; if it is minor-stale with more than 5 successes and failure ratio below 0.1, it skips regeneration and just stamps freshness; otherwise it stamps freshness without regeneration.
- Why it matters for Code_Environment/Public: The maintenance loop is not purely time-based. It uses source-proven outcome counters in `CONTEXT.md` to prioritize which files deserve expensive regeneration and which can be accepted as still useful despite minor drift.
- Affected subsystem: freshness heuristics
- Open questions resolved: Q4, partial Q5
- Risk / ambiguity: These heuristics are deterministic but fairly coarse; the code has no per-scope learning memory beyond cumulative counters embedded in markdown frontmatter.

### F3.6 -- `runJanitor()` executes six stages in code order, persists state, and only some stages currently mutate disk
- Source evidence: `external/src/lib/core/janitor.ts:242-272`, `external/src/lib/core/janitor.ts:279-311`, `external/src/lib/core/janitor.ts:317-379`, `external/src/lib/core/janitor.ts:387-490`, `external/src/mcp.ts:436-448`, `external/src/lib/core/stats.ts:68-73`
- Evidence type: source-proven
- What it shows: The actual orchestration order is: `processRepairQueue()`, `freshnessSweep()`, `detectNewScopes()`, `dependencyScan()`, `cleanupHitLogs()`, then doc-sync artifact regeneration plus `janitor-state.json`. If `detectNewScopes()` finds code directories without `CONTEXT.md`, it appends deduplicated entries to `.contextador/repair-queue.json` for the next run. If any stage reports changes, doc sync rewrites `.contextador/briefing.md`, `.contextador/hierarchy.json`, and invokes service-index and architecture dependency sync. The janitor always writes `.contextador/janitor-state.json`, and the MCP `context_sweep` wrapper increments `sweepsRun` in `.contextador/stats.json`. One subtle source detail: `cleanupHitLogs()` can report prunable entries, but it explicitly does not rewrite files yet because the current hit-log parser format does not support that write path.
- Why it matters for Code_Environment/Public: The janitor is a multi-stage maintenance pass with durable side effects beyond `CONTEXT.md`, but the live write set is narrower than the stage names imply. The system persists run metadata and support artifacts, yet hit-log cleanup is mostly a placeholder today.
- Affected subsystem: full janitor orchestration
- Open questions resolved: Q4, partial Q5
- Risk / ambiguity: The helper comments label cleanup as “Stage 4” and dependency scan as “Stage 5,” while `runJanitor()` executes dependency scan before hit-log cleanup; the orchestrator order is the authoritative one (`external/src/lib/core/janitor.ts:275-379`, `external/src/lib/core/janitor.ts:399-435`).

### F3.7 -- `generator.ts` returns full `CONTEXT.md` payloads, not patch hunks or saved prompt files, and its output is only partly model-driven
- Source evidence: `external/src/lib/core/generator.ts:7-18`, `external/src/lib/core/generator.ts:21-47`, `external/src/lib/core/generator.ts:49-64`, `external/src/lib/core/generator.ts:76-99`, `external/src/lib/core/generator.ts:101-157`
- Evidence type: source-proven
- What it shows: `generateContextContent()` gathers a bounded source snapshot by recursively listing code-like files up to depth 4, selecting at most 15 preview files, and reading at most 500 characters from each. It then builds frontmatter and tries one `generateText()` call against `getModel("local-fast")` with a prompt requesting `#`, `## Purpose`, `## Key Files`, and `## Architecture` sections. On model failure, it deterministically returns a directory-listing fallback body. The function returns a complete markdown file string; callers such as `processRepairQueue()` and `freshnessSweep()` decide whether to write it.
- Why it matters for Code_Environment/Public: The “self-healing” loop is hybrid. File discovery, preview bounds, frontmatter, and fallback output are deterministic; the body regeneration path is prompt-driven and model-dependent. There is no on-disk prompt cache, template registry, or patch-based merge engine in this file.
- Affected subsystem: context generation
- Open questions resolved: Q4, partial Q5
- Risk / ambiguity: Regeneration can discard prior hand-edited details because the generated path rewrites the entire file content rather than merging section-by-section.

### F3.8 -- The bounded parts are local guards and thresholds; the long-running loop itself is not fully bounded
- Source evidence: `external/src/mcp.ts:102-115`, `external/src/lib/core/feedback.ts:87-96`, `external/src/lib/core/generator.ts:16-18`, `external/src/lib/core/generator.ts:21-47`, `external/src/lib/core/janitor.ts:136-145`, `external/src/lib/core/janitor.ts:242-272`
- Evidence type: inferred from source
- What it shows: Several operations are bounded per invocation: only one background sweep can run at a time because of `sweepInProgress`; repair queue inserts are deduplicated by exact `scope + reason`; generator input is capped by recursion depth, preview-file count, and preview length; and scope discovery stops at `maxDepth`. But the overall maintenance loop is not strongly bounded over time: failed repair entries remain forever until they succeed, new reasons can accumulate for the same scope, feedback counters have no decay or cap, and future queries can keep re-triggering sweeps.
- Why it matters for Code_Environment/Public: The source supports calling this loop “guarded” or “heuristic-bounded per pass,” but not “fully bounded” or “self-stabilizing” in a strict systems sense.
- Affected subsystem: operational reliability and claims audit
- Open questions resolved: Q5
- Risk / ambiguity: This finding is inferential because the code shows local bounds and missing caps, but it does not include an explicit design statement about liveness or stability guarantees.

## Self-healing flow diagram

```text
context_feedback
  -> processFeedback()
     -> patch scope CONTEXT.md feedback_failures
     -> maybe patch Key Files
     -> maybe append .contextador/repair-queue.json
  -> recordFeedback()
     -> update .contextador/stats.json
  -> if needed, processRepairQueue()
     -> create full CONTEXT.md or stamp stale one
  -> enrichFromFeedback()
     -> replace/append Key Files bullets
     -> append Notes bullet

query-time missing CONTEXT.md
  -> queue repair entry in .contextador/repair-queue.json
  -> triggerBackgroundSweep()
     -> processRepairQueue()
     -> freshnessSweep()

manual context_sweep
  -> runJanitor()
     -> repairQueue
     -> freshnessSweep
     -> detectNewScopes
     -> dependencyScan
     -> cleanupHitLogs
     -> docSync + janitor-state
```

## Newly answered key questions
- Q4: The self-healing loop has three concrete entry paths. `context_feedback` writes feedback counters, queue entries, and stats; can synchronously process the repair queue; and can deterministically enrich `CONTEXT.md` from actual file reads (`external/src/lib/core/feedback.ts:106-143`, `external/src/mcp.ts:296-340`, `external/src/lib/core/stats.ts:53-58`). Query-time misses queue repair work and launch only `processRepairQueue()` plus `freshnessSweep()` in the background (`external/src/mcp.ts:104-115`, `external/src/mcp.ts:225-255`). Manual `context_sweep` runs the full janitor, which may also rewrite `.contextador` support artifacts and stats (`external/src/lib/core/janitor.ts:387-490`, `external/src/mcp.ts:436-448`).
- Q5: Source-proven “self-improving” claims are limited to file-level self-repair and heuristic regeneration: queueing missing scopes, generating or stamping `CONTEXT.md`, enriching `Key Files` and `Notes` from feedback, using failure/success ratios to choose regen vs stamp, and regenerating support artifacts when the janitor detects changes (`external/src/lib/core/feedback.ts:106-143`, `external/src/lib/core/janitor.ts:167-235`, `external/src/lib/core/janitor.ts:387-490`, `external/src/mcp.ts:119-174`). Stronger claims such as durable learning, conflict resolution, bounded retries, or full automatic post-feedback sweeps are not source-proven by the files traced in this iteration.

## Open questions still pending
- Q3: How good or lossy are the pointer payloads once they are serialized for the MCP client, especially around hierarchy depth and omitted code details?
- Q6: What exactly does Mainframe share or coordinate beyond task posting and cache hints?
- Q7: How do janitor lock semantics interact with distributed agents in practice, especially across failures or abandoned locks?
- Q8: Are there conflict-resolution rules when feedback enrichment, janitor regeneration, and docsync all want to rewrite adjacent context artifacts?
- Q9: What are the real token and latency costs of model-driven generation versus the deterministic fallback path?
- Q10: How robust is dependency detection across languages and non-standard import styles?
- Q11: Is hit-log cleanup intentionally incomplete, or is the parser/write path simply unfinished?
- Q12: Which README or marketing phrases about “self-improving” context over-claim relative to the source trace?

## Recommended next focus (iteration 4)
Iteration 4 should trace the Mainframe path through `external/src/lib/mainframe/bridge.ts`, `client.ts`, `rooms.ts`, `dedup.ts`, and `summarizer.ts`. Focus on Matrix room protocol, query-hash dedup, janitor lock semantics, budget tracking, summary generation, and any conflict-resolution gaps between shared state and local repairs.

## Self-assessment
- newInfoRatio (estimate, 0.0-1.0): 0.68
- status: insight
- findingsCount: 8
