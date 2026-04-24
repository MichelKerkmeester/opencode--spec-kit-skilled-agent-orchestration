# Deep-Research Iteration 4 — Continuity-refactor Gates A–F enforcement (Q3)

## YOUR ROLE
LEAF executor, iteration 4 of 10. Do NOT dispatch sub-agents. Write ALL findings to files.

## STATE SUMMARY
- Segment: 1 | Iteration: 4 of 10
- Questions: 2/7 answered (Q1 partially; Q2 fully).
- Last 2 ratios: 0.69 → 0.58 | Stuck count: 0
- Next focus: Q3 — Gates A–F enforcement (003-continuity-refactor-gates).

## RESEARCH TOPIC
026 continuity-memory-runtime — correctness gaps, concurrency/race conditions, doc-code drift.
Parent: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/`

## PRIOR FINDINGS (context only, DO NOT re-file)
- P0 FIND-iter002-post-save-rollback-clobber
- P1 FIND-iter003-planner-default-gated-by-hints — planner-first is not the live default
- P1 FIND-iter003-generate-context-fallback-doc-only — docs still center generate-context.js but live planner never invokes it
- P1 FIND-iter003-adr-numbering-cross-process-race — decision route ADR-NNN collides across processes (relates to iter2 P0)
- Plus 11 additional findings logged in `deltas/iter-00*.jsonl`

## ITERATION 4 FOCUS — Q3 Gates A–F

> **Q3 — Continuity-refactor Gates A–F (003-continuity-refactor-gates): which gate checks are actually enforced by runtime code vs. documented as enforced? Where does the gate runner's reporter contract differ from the gate spec?**

The packet's prose already signals "Phase 6 acts as the repaired gates-only coordination packet" with promoted follow-ons. The audit question: are Gates A–F (Ready, Context, Writer, Reader, Execute, Fingerprint — or whatever the actual letters map to) each a live runtime check, or are some gates doc-only scaffolding whose assertions live in tests but never run on user traffic?

Produce severity-ranked findings with exact file:line evidence for every gate drift point.

## RESEARCH ACTIONS (target 5–8, cap 12 tool calls)

1. **Enumerate the Gates A–F contract.** Read:
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/spec.md` + `implementation-summary.md`
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/001-gate-a-*/spec.md` through `006-gate-f-*/spec.md` (actual child-phase folders — list them first via `ls`)

2. **Map each gate to the runtime enforcer.** For every gate A–F find the source-of-truth runtime implementation via grep:
   - `rg -n "gate[-_ ]?a|gate[-_ ]?b|gate[-_ ]?c|gate[-_ ]?d|gate[-_ ]?e|gate[-_ ]?f" --type ts --type js -g '!tests/**' -g '!*.md'`
   - `rg -n "gate-a|gate-b|gate-c|gate-d|gate-e|gate-f" --type ts --type js --type md` (to include reference docs but mark tests vs code)
   - Identify: which gates are live (live-path check in handler/service), which are test-only (invariants asserted only in `*.vitest.ts`), which are doc-only (described but no runtime invocation).

3. **Read the Gate D regression suites.** The iter 1 matrix flagged these as H/M risk:
   - `mcp_server/tests/memory-context.resume-gate-d.vitest.ts`
   - `mcp_server/tests/session-bootstrap-gate-d.vitest.ts`
   - `mcp_server/tests/gate-d-regression-intent-routing.vitest.ts`
   - `mcp_server/tests/gate-d-regression-4-stage-search-pipeline.vitest.ts`
   - `mcp_server/tests/gate-d-regression-quality-gates.vitest.ts`
   - `mcp_server/tests/gate-d-regression-reconsolidation.vitest.ts`
   Read the first 80 lines of each to extract: what invariant is being asserted? Is there an equivalent live-runtime enforcer anywhere in the non-test code?

4. **Check the gate runner / orchestrator.** Grep for a gate runner script / command:
   - `find .opencode/skill/system-spec-kit/scripts -name '*gate*' -o -name '*continuity*'`
   - Read any `validate-*.sh` or `run-gates-*.ts` entrypoints
   Does it enumerate A–F or only some? What does the reporter emit — what's the output schema, and does it match the documented reporter contract in the spec?

5. **Spec-vs-handler drift.** For each gate, list: documented assertion, runtime check location (or "none"), test coverage, reporter field. Identify:
   - Gates asserted in docs but never checked at runtime (fail silent).
   - Gates checked at runtime but not in reporter output (invisible to operators).
   - Gates whose documented trigger / precondition differs from code.
   - Gates with stale test coverage pointing to pre-refactor invariants.

6. **Promoted-follow-on integrity.** The packet says follow-on work was promoted to sibling top-level phases 007+. Skim the 003-continuity-refactor-gates `implementation-summary.md` for promotion notes; check one or two of the promoted phases (e.g. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-*/`) to see if the gate-reporter changes actually landed there. This is a lightweight cross-reference, not a full audit of phase 007+.

7. **(If budget remains)** Scan for a `gate-enforcement.md` constitutional file surfaced by the MCP hook — it was one of the constitutional memories surfaced to this session; check whether its invariants align with the refactor.

## OUTPUT CONTRACT (THREE artifacts)

### 1. Iteration narrative
Path: `.../iterations/iteration-004.md`

Required headings: Focus, Actions Taken, Findings (grouped P0/P1/P2 with `FIND-iter004-<slug>`), Questions Answered (Q3 status), Questions Remaining (Q4–Q7), Next Focus.

Include a Gate-by-Gate drift table with columns: `Gate | Documented check | Runtime enforcer file:line (or "none") | Test coverage file:line | Reporter output (yes/no) | Drift verdict (live / test-only / doc-only / reporter-missing / drift)`.

Aim 5–12 findings. Precision over volume.

### 2. Canonical JSONL iteration record
Append ONE line to `.../deep-research-state.jsonl`:
```
{"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"evidence","focus":"Q3 Gates A-F enforcement","findingsCount":<int>,"timestamp":"<ISO-Z>","sessionId":"dr-002cmr-20260423-200456","generation":4,"graphEvents":[/* optional */]}
```
Expected newInfoRatio: ~0.40–0.60.

### 3. Per-iteration delta file
Path: `.../deltas/iter-004.jsonl`. One JSON record per line. Required: one `iteration` + one `finding` per finding (with `questionTag:"Q3"` and `iteration:4`). Optional: invariants / ruled_out / nodes / edges.

## BUDGET & CONSTRAINTS
- Max 12 tool calls, target 5–8.
- Max 15 min wall time.
- Do NOT modify runtime code.
- Do NOT answer Q4–Q7 yet.
- `research.md` is NOT written yet.

## WHEN DONE
Print: `ITERATION_4_DONE: <findings_count> findings (P0=<n>, P1=<n>, P2=<n>), newInfoRatio=<n>, Q3_status=<fully|partially|unanswered>`
