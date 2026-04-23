# Deep-Research Iteration 6 — Cache-warning hooks transcript identity + replay coverage (Q5)

## YOUR ROLE
LEAF executor, iteration 6 of 10. Do NOT dispatch sub-agents. Write ALL findings to files.

## STATE SUMMARY
- Segment: 1 | Iteration: 6 of 10
- Questions: 4/7 answered (Q1 partial; Q2, Q3, Q4 full).
- Last 2 ratios: 0.47 → 0.54 | Stuck count: 0
- Next focus: Q5 — cache-warning hooks transcript-identity + replay harness coverage.

## RESEARCH TOPIC
026 continuity-memory-runtime — correctness gaps, concurrency/race conditions, doc-code drift.
Parent: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/`

## PRIOR FINDINGS (context only, DO NOT re-file)
- Iter 2 P1 `stop-hook-last-writer-wins` — concurrent Stop writers merge stale state.
- Iter 2 P1 `stop-hook-offset-metric-drift` — lastTranscriptOffset advances while token totals regress.
- Iter 2 P2 `stop-hook-tests-miss-parallelism` — replay harness is serial only.
- Iter 1 matrix: `hook-state.ts`, `session-stop.ts`, `replay-harness.ts`, `hook-session-stop-replay.vitest.ts`, `hook-stop-token-tracking.vitest.ts`, `session-token-resume.vitest.ts`, `sqlite-fts.vitest.ts`.

**New ground to cover in this iteration (do NOT re-file iter2 concurrency findings):** transcript-identity invariants themselves (separate from concurrency), producer metadata correctness, cache-token carry-forward correctness across session boundaries, replay harness semantic coverage (what real-world transcript shapes does it NOT simulate).

## ITERATION 6 FOCUS — Q5 transcript identity + replay coverage

> **Q5 — Is the documented transcript-identity + cache-token carry-forward contract fully honored by the hook runtime code? Does the replay harness cover the actual concurrency paths AND real-world transcript edge cases?**

Specific sub-questions:
- What invariants define "transcript identity" (sessionId, transcript file path, fingerprint, producer metadata)?
- Can two different transcripts be conflated into one identity (collision)?
- Can one transcript be split into two identities on resume (loss)?
- Does cache-token carry-forward survive: session kill, session crash, session fork (compaction), session restore from archive?
- Does replay exercise: multi-session transcripts, in-flight compaction, transcript retargeting, cold-start vs. warm-resume?

## RESEARCH ACTIONS (target 5–8, cap 12 tool calls)

1. **Read the identity contract docs.** Read:
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/001-cache-warning-hooks/spec.md` + `implementation-summary.md`
   - List its child phases: `ls .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/001-cache-warning-hooks/`
   - Identify the documented invariants (fingerprint formula, producer metadata shape, cache-token schema).

2. **Read `hook-state.ts` identity-relevant sections** (lines 1-200 for schema + lines around `fingerprint|producer|transcriptId|sessionId|cacheToken` matches). Map the persisted identity schema and how keys are derived. Focus on:
   - What uniquely identifies a transcript?
   - What happens if the transcript file is moved, truncated, or rotated?
   - What happens if sessionId collides across concurrent sessions?

3. **Read `session-stop.ts` transcript handling** for the sections NOT covered by iter 2 (identity assignment, retarget, producer metadata merge). Specifically:
   - How does the Stop handler detect that the current transcript is the same as last run vs. a new one?
   - What's the retargeting behavior when user switches spec folders mid-session?
   - Can a retarget carry forward cache tokens from the previous spec folder's context into a new spec folder's context? Would that be a leak?

4. **Read replay harness coverage.** Open `mcp_server/tests/_support/hooks/replay-harness.ts` (key sections) and `tests/hook-session-stop-replay.vitest.ts`, `tests/hook-stop-token-tracking.vitest.ts`. Map every transcript fixture used. Check:
   - What transcript shapes ARE tested? (typical, short, long)
   - What shapes are NOT tested? (rotated files, UTF-8 BOM, CRLF, partial JSON line, embedded NUL, multi-session transcript)
   - Is compaction-in-flight simulated?
   - Is cold-start (no prior state) exercised?

5. **Check session-token-resume behavior.** Read `tests/session-token-resume.vitest.ts` + the production code it covers (likely `session-stop.ts` + `hook-state.ts` token carry-forward paths). Does the cache-token carry-forward preserve semantic equivalence across restart? Are there ordering dependencies (e.g. must resume before new Stop hook can fire, else tokens are lost)?

6. **SQLite-FTS prerequisite.** Packet 001 mentioned FTS hardening as prerequisite. Read `tests/sqlite-fts.vitest.ts` briefly and the shared FTS helper. Is there any identity-related assertion (e.g. transcript body stored in FTS with sessionId as primary key)? Any failure mode where FTS rebuild loses identity linkage?

7. **(Optional)** Grep for `retarget|retargetAt|retarget_count` and trace the retarget state machine in hook-state + session-stop. Is there a retarget cap / debounce, or can a rapid spec-folder-switch thrash produce identity loss?

## OUTPUT CONTRACT (THREE artifacts)

### 1. Iteration narrative
Path: `.../iterations/iteration-006.md`

Required headings: Focus, Actions Taken, Findings (P0/P1/P2, `FIND-iter006-<slug>`), Questions Answered (Q5 status), Questions Remaining (Q6, Q7), Next Focus.

Include an inline table of transcript-identity invariants with columns: `Invariant | Documented | Code enforcer (file:line or "none") | Replay coverage (file:line or "none") | Verdict (honored / drift / unenforced)`.

Aim 5–12 findings.

### 2. Canonical JSONL iteration record
Append to `.../deep-research-state.jsonl`:
```
{"type":"iteration","iteration":6,"newInfoRatio":<0..1>,"status":"evidence","focus":"Q5 transcript identity + replay coverage","findingsCount":<int>,"timestamp":"<ISO-Z>","sessionId":"dr-002cmr-20260423-200456","generation":6,"graphEvents":[/* optional */]}
```
Expected newInfoRatio: ~0.30–0.50 (overlaps with iter 2 stop-hook surface).

### 3. Per-iteration delta file
Path: `.../deltas/iter-006.jsonl`. One JSON record per line. One `iteration` + one `finding` per finding (`questionTag:"Q5"`, `iteration:6`). Optional invariants/ruled_out/nodes/edges.

## BUDGET & CONSTRAINTS
- Max 12 tool calls, target 5–8.
- Max 15 min wall time.
- Do NOT re-file iter 2 concurrency findings (already logged: last-writer-wins, offset-drift, tests-miss-parallelism).
- Do NOT modify runtime code.
- Do NOT answer Q6–Q7 yet.
- `research.md` is NOT written yet.

## WHEN DONE
Print: `ITERATION_6_DONE: <findings_count> findings (P0=<n>, P1=<n>, P2=<n>), newInfoRatio=<n>, Q5_status=<fully|partially|unanswered>`
