# Deep-Research Iteration 7 — Reducer / state rehydration schema agreement (Q6)

## YOUR ROLE
LEAF executor, iteration 7 of 10. Do NOT dispatch sub-agents. Write ALL findings to files.

## STATE SUMMARY
- Segment: 1 | Iteration: 7 of 10
- Questions: 4/7 answered (Q1 partial; Q2, Q3, Q4 full; Q5 partial).
- Last 2 ratios: 0.54 → 0.41 | Stuck count: 0
- Next focus: Q6 — reducer / state rehydration schema agreement.

## RESEARCH TOPIC
026 continuity-memory-runtime — correctness gaps, concurrency/race conditions, doc-code drift.
Parent: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/`

## PRIOR FINDINGS (context only; DO NOT re-file)
- Iter 1 P1 `FIND-iter001-reducer-path-drift` — reducer re-allocates pt-{N+1} on every call; cannot locate active packet.
- Iter 2 P2 `reducer-derived-overwrite` — registry/strategy/dashboard are plain overwrite writes.
- Iter 5 P2 `save-mode-name-collision-crosses-runtime-layers` — SaveMode means different things in script runtime and MCP router.
- Plus iter1 matrix: `reduce-state.cjs`, `hook-state.ts`, `thin-continuity-record.ts`, `memory-metadata.ts`, `generate-context.ts/js`.

## ITERATION 7 FOCUS — Q6

> **Q6 — Does `reduce-state.cjs` + the deep-research state machine agree on the canonical JSONL schema (type enum, required fields, lineage fields) across all four children? Are there drift points between code, prompt pack, and protocol doc?**

Also extend to the "state rehydration" angle: when the reducer re-reads the JSONL + delta files to rebuild registry/dashboard/strategy, does it agree with what the workflow YAML says should be persisted? What about `hook-state.ts` rehydration, `thin-continuity-record.ts` rehydration, and the shared memory-metadata schema?

## RESEARCH ACTIONS (target 5–8, cap 12 tool calls)

1. **Enumerate JSONL type enum.** Read `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` completely (it's the source-of-truth for what the reducer accepts). Extract the exhaustive list of `type` values it handles (iteration, event, config, spec_mutation, etc.) and which fields are required per type. Then read:
   - `.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl` (what agents are TOLD to emit)
   - `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` lines 440–480 (the `post_dispatch_validate` schema contract) and its `stop_reasons_enum`, `append_to_jsonl` shapes
   - `.opencode/skill/sk-deep-research/references/state_format.md` (documented schema)

2. **Compare schemas.** Produce a type×field drift matrix with columns: `type | Required fields (reducer) | Required fields (prompt pack) | Required fields (YAML audit contract) | Required fields (state_format.md) | Drift verdict`.
   Identify:
   - Types the reducer accepts but docs/prompts never emit (dead code).
   - Types emitted by prompts/YAML but the reducer silently drops.
   - Field-level drift (e.g. `status` enum values, `stopReason` enum alignment with `STOP_REASONS`).
   - Missing lineage fields (`sessionId`, `generation`, `lineageMode`) in any emitter.

3. **Review-side parity.** The research reducer has a sibling in `.opencode/skill/sk-deep-review/`. Compare:
   - `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` (if exists) or equivalent
   - Does review's reducer share code with research's? If duplicated, are the schemas diverging?

4. **Rehydration from hook-state.ts.** Read the rehydration entrypoints in `hook-state.ts` (the `load*`, `rehydrate`, `resume` functions). Does the schema version it expects match what `session-stop.ts` writes? Any version field that's ignored on read? Any silent fallback if schema is older?

5. **Thin continuity record.** Read `mcp_server/lib/continuity/thin-continuity-record.ts`. Does the shape it writes match what `handlers/memory-context.ts` + `handlers/session-resume.ts` expect on read? Any optional fields that, when absent, trigger silent defaults that diverge from the packet-docs contract?

6. **Memory metadata.** Read `scripts/core/memory-metadata.ts` + `scripts/dist/memory/generate-context.js` (the live path). The `_memory.continuity` frontmatter block in spec docs is written by these; read the expected shape and check it against what `memory-context` reads back and what `memory_save` indexes.

7. **YAML reducer contract on restart/resume.** Re-check yaml lines 180–210 (classify_session, on_resume, on_restart). The reducer's pt-drift bug (iter 1) means `resume` cannot locate state. Identify whether YAML explicitly expects the reducer to read lineage.generation from config (which would prevent the bug) or whether the YAML contract is silent on re-resolution.

## OUTPUT CONTRACT (THREE artifacts)

### 1. Iteration narrative
Path: `.../iterations/iteration-007.md`

Required headings: Focus, Actions Taken, Findings (P0/P1/P2, `FIND-iter007-<slug>`), Questions Answered (Q6 status), Questions Remaining (Q7), Next Focus.

Include an inline table: `Schema surface | Emitter | Reader | Drift (none / field-level / type-level / silent-drop / version-ignored) | Consequence`.

Aim 5–12 findings.

### 2. Canonical JSONL iteration record
Append to `.../deep-research-state.jsonl`:
```
{"type":"iteration","iteration":7,"newInfoRatio":<0..1>,"status":"evidence","focus":"Q6 reducer/schema rehydration","findingsCount":<int>,"timestamp":"<ISO-Z>","sessionId":"dr-002cmr-20260423-200456","generation":7,"graphEvents":[/* optional */]}
```
Expected newInfoRatio: ~0.30–0.50.

### 3. Per-iteration delta file
Path: `.../deltas/iter-007.jsonl`. One JSON record per line. One `iteration` + one `finding` per finding (`questionTag:"Q6"`, `iteration:7`). Optional invariants/ruled_out/nodes/edges.

## BUDGET & CONSTRAINTS
- Max 12 tool calls, target 5–8.
- Max 15 min wall time.
- Do NOT re-file iter 1's reducer-path-drift or iter 2's reducer-derived-overwrite (context only).
- Do NOT modify runtime code.
- Do NOT answer Q7 yet.
- `research.md` is NOT written yet.

## WHEN DONE
Print: `ITERATION_7_DONE: <findings_count> findings (P0=<n>, P1=<n>, P2=<n>), newInfoRatio=<n>, Q6_status=<fully|partially|unanswered>`
