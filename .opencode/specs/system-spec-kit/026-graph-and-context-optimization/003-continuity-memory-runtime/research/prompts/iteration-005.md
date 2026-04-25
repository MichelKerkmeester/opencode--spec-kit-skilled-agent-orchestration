# Deep-Research Iteration 5 — D1-D8 memory-quality remediation landing status (Q4)

## YOUR ROLE
LEAF executor, iteration 5 of 10. Do NOT dispatch sub-agents. Write ALL findings to files.

## STATE SUMMARY
- Segment: 1 | Iteration: 5 of 10
- Questions: 3/7 answered (Q1 partial; Q2, Q3 full).
- Last 2 ratios: 0.58 → 0.47 | Stuck count: 0
- Next focus: Q4 — D1–D8 memory quality remediation.

## RESEARCH TOPIC
026 continuity-memory-runtime — correctness gaps, concurrency/race conditions, doc-code drift.
Parent: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/`

## PRIOR FINDINGS (context only, DO NOT re-file)
Iter 1–4 logged 22 findings (1 P0, 13 P1, 6 P2 + iter1 reducer-path-drift). Key cross-cuts relevant to Q4:
- Gate C's five writer rules are live via `spec-doc-structure.ts`, but with no structured reporter (iter4 P1).
- `post-save-review.ts` is the D1-D8 reviewer surface (iter1 matrix H-risk).
- `decision-extractor.ts`, `trigger-phrase-sanitizer.ts`, `truncate-on-word-boundary.ts`, `semantic-signal-extractor.ts`, `memory-metadata.ts`, `frontmatter-migration.ts` are the candidate landing files (iter1 matrix).

## ITERATION 5 FOCUS — Q4 D1–D8

> **Q4 — For each of the 8 memory-quality remediation slices D1–D8, which land in code and which are only in documentation / tests? What silent-drop, enum-mismatch, or schema-mismatch paths remain?**

Produce a D1–D8 landing-status table plus severity-ranked findings for every gap.

## RESEARCH ACTIONS (target 5–8, cap 12 tool calls)

1. **Enumerate D1–D8.** Read:
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md` + `implementation-summary.md`
   - List child phase folders: `ls .../002-memory-quality-remediation/`
   - Read each child's `spec.md` briefly (what defect does D{N} target, what's the remediation, what's the landing test).

2. **Map each D{N} to runtime code.** For each:
   - Which source file actually implements the remediation (not a test)?
   - Is the remediation guard an early return, a transformation, a new validator, or a reviewer rule?
   - Is it gated by an env var, always-on, or opt-in?
   - Does `post-save-review.ts` enforce it at save time, or is it enforced elsewhere?
   - Where is the regression test? Does it execute real runtime code or only the unit?

3. **Check for "landed in reviewer only" slices.** A common drift pattern: remediation exists as a reviewer rule in `post-save-review.ts` but the actual write path does not enforce it, so the fix is informational only. For each D{N}, determine if the reviewer-detected defect is ALSO prevented at write time. If not, flag it.

4. **Silent drops / enum mismatches.** Grep for every silent drop pattern:
   - `rg -n "silently (?:drop|ignore)|return\\s+;.*//.*skip|if.*return\\s+null.*//" .opencode/skill/system-spec-kit/scripts/core/ .opencode/skill/system-spec-kit/mcp_server/lib/ --type ts`
   - Compare the SaveMode / SaveRoute / RoutingTier enum surfaces across:
     - `mcp_server/handlers/memory-save.ts`
     - `mcp_server/handlers/save/response-builder.ts`
     - `mcp_server/lib/routing/content-router.ts`
     - `mcp_server/lib/routing/` other files
     - `scripts/core/workflow.ts`, `scripts/core/post-save-review.ts`
   - Flag any enum value that appears in one file but not another (drift).

5. **Frontmatter / schema migration.** Read `scripts/lib/frontmatter-migration.ts`. What migration path does it apply? What fields does it add/remove? Does it handle partial frontmatter (e.g. missing `_memory.continuity` block)? Is it idempotent under repeated execution? Does it interact with `thin-continuity-record.ts` or `memory-metadata.ts` in a way that could produce divergent schemas after migration?

6. **Trigger-phrase preservation + truncation.** Read `scripts/lib/trigger-phrase-sanitizer.ts` and `scripts/lib/truncate-on-word-boundary.ts`. The packet maps these to D-repairs. Confirm: manual-trigger preservation is actually preserved (not overwritten by generated triggers), control-char guardrails are applied before persistence (not after), truncation is UTF-8 boundary-safe.

7. **Decision extractor precedence.** Read `scripts/extractors/decision-extractor.ts`. Packet prose said authored-decision precedence + lexical fallback. Check: can a corrupted authored decision still win precedence and propagate a garbage ADR? Does the lexical fallback have any early-return paths that silently drop valid decisions?

## OUTPUT CONTRACT (THREE artifacts)

### 1. Iteration narrative
Path: `.../iterations/iteration-005.md`

Required headings: Focus, Actions Taken, Findings (P0/P1/P2, `FIND-iter005-<slug>`), Questions Answered (Q4), Questions Remaining (Q5-Q7), Next Focus.

Required inline table: D-landing status with columns: `D{N} | Target defect | Documented remediation | Code enforcer file:line (or "reviewer-only"/"doc-only") | Reviewer coverage | Regression test | Landing verdict (live / reviewer-only / doc-only / partial / drift)`.

Aim 5–12 findings.

### 2. Canonical JSONL iteration record
Append to `.../deep-research-state.jsonl`:
```
{"type":"iteration","iteration":5,"newInfoRatio":<0..1>,"status":"evidence","focus":"Q4 D1-D8 remediation landing","findingsCount":<int>,"timestamp":"<ISO-Z>","sessionId":"dr-002cmr-20260423-200456","generation":5,"graphEvents":[/* optional */]}
```
Expected newInfoRatio: ~0.40–0.60.

### 3. Per-iteration delta file
Path: `.../deltas/iter-005.jsonl`. One JSON record per line. Required: one `iteration` + one `finding` per finding (`questionTag:"Q4"`, `iteration:5`). Optional: invariants, ruled_out, nodes, edges.

## BUDGET & CONSTRAINTS
- Max 12 tool calls, target 5–8.
- Max 15 min wall time.
- Do NOT modify runtime code.
- Do NOT answer Q5–Q7 yet.
- `research.md` is NOT written yet.

## WHEN DONE
Print: `ITERATION_5_DONE: <findings_count> findings (P0=<n>, P1=<n>, P2=<n>), newInfoRatio=<n>, Q4_status=<fully|partially|unanswered>`
