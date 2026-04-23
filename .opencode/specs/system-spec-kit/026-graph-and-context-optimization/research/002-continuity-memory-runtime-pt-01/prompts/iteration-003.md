# Deep-Research Iteration 3 — /memory:save planner-first routing drift (Q2)

## YOUR ROLE
LEAF executor, iteration 3 of 10. Do NOT dispatch sub-agents. Write ALL findings to files.

## STATE SUMMARY
- Segment: 1 | Iteration: 3 of 10
- Questions: 1/7 answered (Q1 partially answered — closed enough; remaining slices are workflow-YAML-owned).
- Last 2 ratios: 0.91 → 0.69 | Stuck count: 0
- Next focus: Q2 — /memory:save planner-first routing table drift.

## RESEARCH TOPIC
026 continuity-memory-runtime — correctness gaps, concurrency/race conditions, doc-code drift.
Parent: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/`

## PRIOR FINDINGS (context only; DO NOT re-file)
- **P0 FIND-iter002-post-save-rollback-clobber** — post-save rollback can restore pre-merge over concurrent writer (memory-save:1597,3118).
- **P1 FIND-iter002-lock-after-allocation** — deep-research packet selection happens before advisory locking.
- **P1 FIND-iter002-generate-context-lock-fail-open** — generate-context workflow lock times out then proceeds unlocked.
- Plus 5 additional Q1 findings logged in `deltas/iter-002.jsonl`.

## ITERATION 3 FOCUS — Q2

> **Q2 — /memory:save planner-first rewrite: does the routing table in code match the documented behavior for every intent (decision, narrative_progress, narrative_delivery, handover_state, research_finding, task_update, metadata_only, drop)? Where is the specified-but-unimplemented gap or implemented-but-undocumented behavior?**

Produce severity-ranked findings (P0/P1/P2) with exact file:line evidence for every drift point.

## RESEARCH ACTIONS (target 5–8, cap 12 tool calls)

1. **Read the documented routing contract.** Read:
   - `.opencode/command/memory/save.md` (full)
   - `.opencode/skill/system-spec-kit/references/` directory listing, then open any routing-contract or planner-first doc (grep for "planner-first", "routeAs", "narrative_progress|narrative_delivery|handover_state|research_finding|task_update|metadata_only|drop")
   - `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` (sections relating to `SPECKIT_MEMORY_SAVE_*`, `SPECKIT_COMMUNITY_SEARCH_FALLBACK`, and planner/execute flags)

2. **Read the runtime routing implementation.** Read:
   - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` (planner branching, envvar gates, default behavior)
   - `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts` (planner response shape, follow-up actions)
   - `.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts` (blockers vs advisories)
   - `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` (Tier 3 exception + routing table)

3. **Cross-check every route value against code.** For each of the 8 documented `routeAs` values (`decision`, `narrative_progress`, `narrative_delivery`, `handover_state`, `research_finding`, `task_update`, `metadata_only`, `drop`), answer in code:
   - Where is the route decision made (source-of-truth function)?
   - What canonical spec doc does it target (decision-record.md, implementation-summary.md, handover.md, etc.)?
   - Which merge mode does it apply (append-as-paragraph, insert-new-adr, append-table-row, update-in-place, append-section)?
   - Is the documented merge-mode hint honored or ignored?
   - Are there any route values that exist in code but NOT in docs, or vice versa?

4. **Planner-first default + execute opt-in.** Does `SPECKIT_MEMORY_SAVE_EXECUTE` behave as documented? Default is planner-only (no mutation); opt-in enables mutation. Grep for the env var, trace its guard in code, and check: are all mutation sites actually guarded? Are there any mutations that leak under planner-only mode? Are there documented guarded mutations that are NOT gated in code?

5. **Fallback path parity.** The planner returns structured planner response; fallback (when planner cannot decide) invokes generate-context.js. Are the fallback outcomes consistent with the planner's advertised routes? Look at `post-save-review` to see if reviewer assumptions align with planner output.

6. **ADR/decision-record routing.** `decision` route → `decision-record.md` insertion. Check the ADR numbering logic (insert-new-adr merge mode). Is it deterministic? Can two concurrent saves both get the same ADR number? (Relate to iter 2 P0 — but do not re-file unless a NEW angle.)

7. **(If budget remains)** Check `SaveRoute` / `SaveMode` enum vs documented enum in the planner-first spec. Any enum drift (values added/renamed/deleted in code but not propagated to docs)?

## OUTPUT CONTRACT (THREE artifacts)

### 1. Iteration narrative
Path: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/002-continuity-memory-runtime-pt-01/iterations/iteration-003.md`

Required headings: Focus, Actions Taken, Findings (grouped P0/P1/P2, with `FIND-iter003-<slug>`), Questions Answered (Q2 status), Questions Remaining (Q3-Q7), Next Focus.

Aim for 5–12 findings. Prefer precise over exhaustive. Include at minimum a drift table with columns: `routeAs value | Documented target | Code target | Documented merge-mode | Code merge-mode | Drift verdict (match / drift / code-only / doc-only)`.

### 2. Canonical JSONL iteration record
Append ONE line to `.../deep-research-state.jsonl`:
```
{"type":"iteration","iteration":3,"newInfoRatio":<0..1>,"status":"evidence","focus":"Q2 /memory:save routing drift","findingsCount":<int>,"timestamp":"<ISO-Z>","sessionId":"dr-002cmr-20260423-200456","generation":3,"graphEvents":[/* optional */]}
```
Expected newInfoRatio: ~0.45–0.65 (new slice, narrower scope than iter 1; some overlap with iter 2 on mutation paths).

### 3. Per-iteration delta file
Path: `.../deltas/iter-003.jsonl`. One record per line:
- Exactly ONE `{"type":"iteration",...}` (same content as state-log append).
- One `{"type":"finding",...}` per finding with `questionTag:"Q2"`.
- Optional `{"type":"invariant",...}`, `{"type":"ruled_out",...}`, `{"type":"node",...}`, `{"type":"edge",...}`.

All records include `"iteration":3`.

## BUDGET & CONSTRAINTS
- Max 12 tool calls, target 5–8.
- Max 15 min wall time.
- Do NOT modify runtime code.
- Do NOT answer Q3–Q7 yet.
- `research.md` is NOT written yet.

## WHEN DONE
Print: `ITERATION_3_DONE: <findings_count> findings (P0=<n>, P1=<n>, P2=<n>), newInfoRatio=<n>, Q2_status=<fully|partially|unanswered>`
