---
title: "Iteration 028 — Rollout pacing with critical path DAG"
iteration: 28
band: D
timestamp: 2026-04-11T16:45:00Z
worker: codex-gpt-5
scope: q8_rollout_pacing
status: complete
focus: "Critical path, sequencing, staffing, handoffs, and buffer planning for phase 018 gates A-D."
maps_to_questions: [Q8]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-028.md"]

---

# Iteration 028 — Rollout pacing with critical path DAG

## Goal
Turn gates A-D into an execution schedule with:
- critical-path dependencies
- parallel branches for 2-3 engineers
- exact gate sequencing
- lead/tests/docs handoffs
- buffer guidance
- slip-safe vs gate-blocking work

## Grounding
Based on `findings/rollout-plan.md`, `iteration-020.md`, `iteration-016.md`, `iteration-019.md`, and `iteration-027.md`.

## Critical path DAG
```text
Gate A
  A1 audit blockers -> A2 canonical backfill ----\
  A3 embed health -------------------------------+-> A4 close A
  A3.1 backup+restore ---------------------------/
  A3.2 rollback drill ---------------------------/

Gate B
  A4 -> B1 migrate on copy -> B2 prod schema -> B3 archive flip -> B4 ranking validate ----\
              \-> B5 research track 1 converge ---------------------------------------------+-> B7 close B
              \-> B6 research track 2 converge ---------------------------------------------/
  B2 --------------------------------------------> B4.1 archived_hit_rate visible ----------/

Gate C
  B7 -> C1 contentRouter -------\
     -> C2 anchorMerge ---------+-> C4 atomicIndexMemory -> C5 save-path integration -> C6 dual-write -> C9 close C
     -> C3 spec-doc validator --/                                      \-> C7 unit tests --/
                                                                     \--> C8 integration --/

Gate D
  C6 -> D0 two-week archived observation ----------------------------------------------------\
  C9 -> D1 search/context retarget --\                                                        \
     -> D2 resumeLadder ------------+-> D3 session-resume fast path -> D4 @context update --+-> D7 close D
                                     \-> D5 regression suite ---------------------------------/
  D1 + D3 --------------------------------> D6 perf benchmarks + tuning ---------------------/
```

## Critical path
Serial spine:
`A1 -> A2 -> A4 -> B1 -> B2 -> B3 -> B4 -> B7 -> C1/C2/C3 -> C4 -> C5 -> C6 -> C9 -> D1/D2 -> D3 -> D6 -> D7`

Implications:
1. Gate C is the main code critical path.
2. Gate D is the main calendar critical path because `D0` is fixed-duration.
3. The best compression move is to activate `C6` early so `D0` runs underneath the remaining work.

## Gate pacing

### Gate A — Pre-work
- Sequence: audit blocker packets -> backfill canonical docs -> verify embedding health -> backup/restore DB -> rollback drill -> close.
- Parallel branches: `audit/backfill` and `env safety` can run side by side once the blocker packet list exists.
- Handoffs: lead -> docs after audit matrix freezes; tests -> lead after restore + rollback evidence is captured.
- Buffer: 1-2 days, mostly for messy root-packet backfills.
- Can slip: formatting polish in new canonical docs; extra warmup samples after `<5s` is already stable.
- Cannot slip: identifying all blocker packets; canonical backfill for those packets; verified restore; verified rollback.

### Gate B — Foundation
- Sequence: migration plan -> migrate on copy -> rollback on copy -> prod schema -> archive flip -> ranking/fallback validation -> archived metric visible -> research tracks converge -> close.
- Parallel branches: `migration/archive`, `ranking/metric`, and `research convergence`.
- Handoffs: lead -> tests with exact DDL and expected row counts before rehearsal; tests -> lead after copy migration/rollback passes.
- Buffer: 2 days after rehearsal, 1 day after staging validation.
- Can slip: dashboard cosmetics; research write-up polish after findings files already exist.
- Cannot slip: copy rehearsal; production schema change; archive flip; staging ranking proof; both research tracks converged.

### Gate C — Writer ready
- Sequence: freeze contracts for `contentRouter`, `anchorMerge`, `spec-doc-structure` -> start unit tests -> build `atomicIndexMemory` -> wire `generate-context.ts` -> wire `memory-save.ts` stages 3/10 -> activate dual-write -> run integration tests -> run shadow comparison -> close.
- Parallel branches: `core writer contracts`, `save-path integration`, and `tests`.
- Handoffs: lead -> tests at contract freeze; tests -> lead when blocking unit/integration failures are isolated; lead -> docs once dual-write behavior is stable enough to document.
- Buffer: 3 days for integration break/fix and coverage gaps.
- Can slip: extra unit cases above `>80%`; richer routing telemetry; operator-facing polish.
- Cannot slip: the three core modules; `atomicIndexMemory`; save-path rewiring; dual-write activation; blocking unit/integration/shadow evidence.

### Gate D — Reader ready
- Sequence: start `D0` as soon as `C6` exists -> retarget `memory-context.ts` and `memory-search.ts` -> build `resumeLadder` -> wire `session-resume.ts` fast path -> freeze recovery order -> update `@context` protocol -> run 13-feature regression suite -> run perf benchmarks -> tune until p95 passes -> close when `D0` also passes.
- Parallel branches: `reader/search retarget`, `resume fast path`, and `regression/perf/docs`.
- Handoffs: lead -> docs only after recovery order stops moving; tests -> lead after regression/perf reports identify the dominant miss.
- Buffer: 2 days for performance tuning, but `D0` is not float and should never be treated as buffer.
- Can slip: prose polish in the `@context` protocol docs; extra histograms beyond the blocking perf metrics.
- Cannot slip: document-type retarget; `resumeLadder`; fast-path wiring; regression green; p95 targets; the 2-week observation window.

## Parallelizable staffing view

### With 1 engineer
```text
Week 0    A  audit -> backfill -> env safety
Weeks 1-2 B  rehearse migration -> prod schema -> archive -> ranking/metric -> research converge
Weeks 3-4 C  writer modules -> save-path rewiring -> dual-write -> tests -> shadow compare
Weeks 5-6 D  reader retarget -> resume fast path -> protocol -> regression/perf -> observation closes
```
- Expected wall clock: about 7 weeks, plus 0.5-1 week if Gate C or D consumes all planned buffer.
- Main risk: tests compete directly with implementation time, so Gate C slips first.

### With 3 engineers
```text
Week 0    A  lead:audit  docs:backfill  tests:embed+backup+rollback
Weeks 1-2 B  lead:migration+archive  tests:staging proof  docs:research support
Week 3    C  lead:core modules  tests:unit suite  docs:shadow checklist prep
Week 4    C/D lead:save-path+dual-write  tests:integration  docs:draft recovery update
Week 5    D  lead:reader+resume  tests:regression+perf  docs:@context finalize
Week 6    D  observation window completes, fixes land, gate closes
```
- Expected wall clock: about 6 weeks.
- Hard floor: the serial `A -> B` chain plus the fixed `D0` observation window.
- Compression condition: freeze Gate C contracts by early week 3 and Gate D recovery order by early week 5.

## What can slip without moving the gate
- Gate A: doc polish and surplus warmup runs.
- Gate B: dashboard cosmetics and narrative cleanup after findings land.
- Gate C: extra coverage beyond threshold, telemetry niceties, operator UX polish.
- Gate D: doc wording polish and non-blocking dashboard extras.

## What cannot slip without moving the gate
- Gate A: blocker packet backfill and recovery proof.
- Gate B: migration rehearsal, production schema/archive work, ranking proof, research convergence.
- Gate C: writer-core modules, save-path rewiring, dual-write, blocking tests, shadow parity.
- Gate D: reader retarget, resume fast path, regression suite, perf thresholds, two-week archived observation.

## Recommendation
For 1 engineer, preserve the published 7-week A-D shape and protect Gate C from scope creep.

For 3 engineers, optimize for early `C6` activation. Starting the Gate D observation clock early is the single highest-leverage move that shortens phase 018 without weakening any pass criteria.

## Findings
- **F28.1**: The schedule floor is not implementation volume; it is the Gate A/B safety chain plus the Gate D observation window.
- **F28.2**: Gate C is the engineering bottleneck; Gate D is the calendar bottleneck.
- **F28.3**: The 3-engineer plan only beats the 1-engineer plan if tests start at contract freeze, not after feature completion.
- **F28.4**: Docs eng has two high-value windows: Gate A canonical backfill and Gate D protocol freeze capture.
- **F28.5**: The safest slip bucket is polish; the least safe slip bucket is migration rehearsal, dual-write activation, and blocking test evidence.
