# Deep-Research Iteration 2 — Concurrency / race conditions audit (Q1)

## YOUR ROLE
LEAF executor, iteration 2 of 10. Do NOT dispatch sub-agents. Write ALL findings to files.

## STATE SUMMARY (auto-generated)
- Segment: 1 | Iteration: 2 of 10
- Questions: 0/7 answered | Last focus: runtime surface area mapping (60 matrix rows, insight)
- Last 2 ratios: N/A → 0.91 | Stuck count: 0
- Next focus: Q1 concurrency / race conditions

## RESEARCH TOPIC
026 continuity-memory-runtime — correctness gaps, concurrency/race conditions, doc-code drift.
Parent: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/`

## PRIOR CONTEXT (iteration 1)
The files × packets matrix identified these as the highest-risk concurrency surfaces:
- **Packet 001 (cache-warning hooks):** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`, `hooks/claude/session-stop.ts`, `mcp_server/tests/_support/hooks/replay-harness.ts`
- **Packet 002 (quality remediation):** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`, `scripts/core/post-save-review.ts`, `scripts/core/memory-metadata.ts`
- **Packet 004 (memory-save rewrite):** `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`, `handlers/save/create-record.ts`, `handlers/save/atomic-index-memory.ts`, `handlers/save/reconsolidation-bridge.ts`, `handlers/save/response-builder.ts`, `handlers/save/validation-responses.ts`, `mcp_server/lib/validation/save-quality-gate.ts`, `mcp_server/lib/continuity/thin-continuity-record.ts`, `mcp_server/lib/routing/content-router.ts`, `mcp_server/handlers/quality-loop.ts`
- **Shared:** `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` (+ source `.ts`)
- **Workflow runtime (this packet):** deep-research lock, `allocateShortSubfolder`, JSONL appenders
- **KNOWN P1 FINDING from iter 1 (already logged, do NOT re-file):** `FIND-iter001-reducer-path-drift` — `resolveArtifactRoot()` in `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs:31` calls `allocateShortSubfolder()` which returns `pt-{existingCount+1}` on every call; reducer/resume cannot locate the active packet. **Build on this** — explore its concurrency consequences.

## ITERATION 2 FOCUS — Q1: concurrency and race conditions

Answer Q1 with concrete code evidence:

> **Q1 — Advisory-lock, sentinel-file, and generation-bumping paths in the continuity runtime (deep-research lock, cache-warning hooks, /memory:save): where can two concurrent writers or an interrupted writer + resumer corrupt or silently drop state?**

Produce precise file-line findings with severity P0/P1/P2. P0 = data corruption/loss; P1 = incorrect behavior observable to caller; P2 = cosmetic/observability drift.

## RESEARCH ACTIONS FOR THIS ITERATION (target 5–8, cap 12 tool calls)

1. **Read the Stop-hook concurrency surface.** Read `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts` and `.../hooks/claude/session-stop.ts` completely. Map every persisted state write, every read-modify-write path, and every file lock (or lack thereof). Identify: can two concurrent Stop-hook invocations corrupt state? Is generation/sequence bumping atomic?

2. **Read the replay harness + tests.** Read `.opencode/skill/system-spec-kit/mcp_server/tests/_support/hooks/replay-harness.ts` (key sections only), `tests/hook-session-stop-replay.vitest.ts`, `tests/hook-stop-token-tracking.vitest.ts`. Do these tests cover: two parallel Stop invocations, hook failure mid-write, resume after kill -9? What concurrency paths are NOT covered?

3. **Read the /memory:save atomic-index-memory + create-record path.** Read `.opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts`, `handlers/save/create-record.ts`, `mcp_server/handlers/memory-save.ts`. Identify: is the "atomic" in the filename honored by the implementation? What happens if two concurrent saves race the same canonical spec doc (e.g. two resumers both appending to `implementation-summary.md` continuity frontmatter)? Is the fingerprint (POST_SAVE_FINGERPRINT) check a TOCTOU? Under what file-system semantics does it hold?

4. **Read the shared generate-context.js + its source.** Read `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` (source, more readable) and skim `scripts/dist/memory/generate-context.js`. Does the CLI path lock? Does parallel execution against the same spec folder produce deterministic output, or can concurrent runs lose writes?

5. **Investigate the deep-research workflow lock + path-allocation race.** Read `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs` completely. Confirm: two concurrent `resolveArtifactRoot()` calls with no existing pt-folders both read existingCount=0 and both allocate `pt-01`, then one wins the mkdir — but does either caller detect the collision? Trace callers: how does `deep-research` init (yaml `step_create_directories`) handle an existing directory? Does the advisory lock actually prevent this, given that the lock is created INSIDE the very pt-folder that the allocation race would duplicate?

6. **Trace the JSONL-append contract.** Grep for writes to `deep-research-state.jsonl` across the workflow and reducer. Are appends using POSIX `O_APPEND` semantics (atomic for < PIPE_BUF)? Shell `>>` satisfies this on macOS for small lines, but JS `fs.appendFileSync` may not. Check every appender. Identify any record types that can exceed PIPE_BUF (512 bytes on Darwin traditionally; 4096 typical for modern fs).

7. **Look at `post-save-review.ts` in packets 002.** Does the save workflow reviewer run concurrently with the primary save write? If yes, what synchronization keeps them consistent?

8. **(If budget remains)** Skim `handlers/save/reconsolidation-bridge.ts` for opt-in flag handling that could race; and skim `lib/continuity/thin-continuity-record.ts` for the continuity-record TOCTOU.

## OUTPUT CONTRACT (THREE artifacts — required)

### 1. Iteration narrative markdown
Write to:
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/002-continuity-memory-runtime-pt-01/iterations/iteration-002.md`

Required headings:
- **Focus** — one sentence
- **Actions Taken** — numbered list, each with tool + result summary
- **Findings** — grouped by severity (P0, P1, P2). For each: `FIND-iter002-<short-slug>` | Severity | File:line | Description | Repro / observed behavior | Why it matters. Aim for 6–15 findings; prefer fewer, higher-quality, with exact line numbers.
- **Questions Answered** — state whether Q1 is **fully answered**, **partially answered**, or **unanswered**. If partial, enumerate the specific concurrency slices you did NOT cover and why (defer-to-later).
- **Questions Remaining** — list Q2–Q7 with 1-line next-step each.
- **Next Focus** — one sentence naming the next key question and target files.

### 2. Canonical JSONL iteration record
Append ONE line to:
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/002-continuity-memory-runtime-pt-01/deep-research-state.jsonl`

Shape:
```
{"type":"iteration","iteration":2,"newInfoRatio":<0..1>,"status":"evidence","focus":"Q1 concurrency and race conditions","findingsCount":<int>,"timestamp":"<ISO-8601-Z>","sessionId":"dr-002cmr-20260423-200456","generation":2,"graphEvents":[/* optional */]}
```

Rules:
- `type="iteration"` exactly.
- `status="evidence"` (not thought/insight) since this iteration produces concrete P0/P1/P2 findings.
- `newInfoRatio` in [0, 1]; calibrated estimate. Orientation iter had 0.91; Q1-depth iter should land roughly 0.50–0.75 (lots of NEW evidence but narrower slice).
- `generation:2` tracks the iteration, not the lineage generation (config lineage.generation=1 is session-level).
- Optional `graphEvents`: emit one FINDING node per P0/P1 finding plus one COVERS edge from FINDING → the packet SOURCE node (packet-001-cache-warning-hooks, etc.).

### 3. Per-iteration delta file
Write to:
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/002-continuity-memory-runtime-pt-01/deltas/iter-002.jsonl`

Content (one JSON record per line):
- ONE `{"type":"iteration",...}` record (same as state log append).
- ONE `{"type":"finding",...}` record per P0/P1/P2 finding with keys: `id`, `severity`, `label`, `iteration`, `evidence`, `questionTag:"Q1"`.
- Optional `{"type":"invariant",...}` records for concurrency invariants you derived (e.g. "every JSONL appender must be O_APPEND + line-atomic").
- Optional `{"type":"ruled_out","direction":"...","reason":"...","iteration":2}` records for concurrency hypotheses you considered and eliminated.
- Optional `{"type":"node",...}` / `{"type":"edge",...}` records for graph events.

All records MUST include `"iteration":2` and be single-line valid JSON.

## BUDGET & CONSTRAINTS
- Max 12 tool calls. Target 5–8.
- Max 15 minutes wall time.
- Do NOT modify production runtime code.
- Do NOT answer Q2–Q7 yet (later iterations).
- **DO NOT re-file** `FIND-iter001-reducer-path-drift`; use it as context for the path-allocation race investigation in Action 5.
- `research.md` is NOT written this iteration.

## WHEN DONE
Print one line: `ITERATION_2_DONE: <findings_count> findings (P0=<n>, P1=<n>, P2=<n>), newInfoRatio=<n>, Q1_status=<fully|partially|unanswered>`
