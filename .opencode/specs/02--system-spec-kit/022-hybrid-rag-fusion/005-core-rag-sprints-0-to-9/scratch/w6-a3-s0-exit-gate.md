# Sprint 0 Exit Gate Certification

**Agent:** W6-A3  
**Spec Folder:** `005-core-rag-sprints-0-to-8`  
**Certification Date:** 2026-03-08  
**Decision:** **PASS**

## Scope of Certification

This certification evaluates the Sprint 0 exit gate criteria defined in the Sprint 0 spec handoff criteria and success gates, then cross-checks them against the Sprint 0 checklist evidence and the requested targeted test run. Sources reviewed:

- `spec.md` Sprint 0 handoff criteria and diversity gate requirements [`spec.md:72`, `spec.md:91`, `spec.md:157`, `spec.md:185-190`]
- `checklist.md` Sprint 0 verification and exit gate items [`checklist.md:73`, `checklist.md:148-160`]
- `tasks.md` Sprint 0 task acceptance for the manually curated query requirement [`tasks.md:135-137`, `tasks.md:157-165`]
- `implementation-summary.md` Sprint 0 delivery summary for the 110-query baseline corpus and eval infrastructure [`implementation-summary.md:54`, `implementation-summary.md:72-74`]

## Exit Gate Results

### Gate 1 — Graph hit rate >0% (G1 fix)
**Result:** PASS

**Evidence**
- Sprint 0 exit checklist item `CHK-S0-060` is checked and explicitly states that the numeric ID fix resolves the prior 0% graph hit rate failure [`checklist.md:148`].
- Supporting checklist evidence cites both repaired locations in `graph-search-fn.ts` for numeric `source_id` / `target_id` output instead of `mem:${...}` strings [`checklist.md:148`].

### Gate 2 — Chunk dedup verified (G3 fix)
**Result:** PASS

**Evidence**
- Sprint 0 exit checklist item `CHK-S0-061` is checked and states there are no duplicate chunk rows in default search mode (`includeContent=false`) [`checklist.md:149`].
- The cited evidence confirms unconditional dedup on both live and cached paths, matching the Sprint 0 requirement that dedup run on all code paths [`checklist.md:83`, `checklist.md:149`].

### Gate 3 — BM25 baseline MRR@5 recorded
**Result:** PASS

**Evidence**
- Checklist item `CHK-S0-063` is checked and records BM25 baseline `MRR@5=0.2083`, with persistence into `eval_metric_snapshots` and contingency logic wired in [`checklist.md:153-154`].
- Checklist item `CHK-S0-022` independently confirms the BM25-only path was tested and that the same `MRR@5=0.2083` value was recorded on 110 queries [`checklist.md:97`].

### Gate 4 — Baseline metrics for 100+ queries with diversity requirement
**Result:** PASS

**Evidence**
- Checklist item `CHK-S0-062` is checked and confirms baseline metrics were computed for **110 queries**, exceeding the 100-query exit threshold [`checklist.md:150`].
- Checklist item `CHK-S0-062b` is checked and confirms the diversity gate: **>=5 queries per intent type** and **>=3 complexity tiers** [`checklist.md:151`].
- The Sprint 0 spec defines the same hard diversity gate and adds the **>=30 manually curated** requirement for the ground-truth corpus [`spec.md:157`, `spec.md:185-190`].
- Sprint 0 task `T007` marks completion of the corpus generation task whose acceptance criteria explicitly require **>=30 manually curated natural-language queries not derived from trigger phrases**; Sprint 0 exit task `T009` is also marked complete with the diversity gate satisfied [`tasks.md:135-137`, `tasks.md:157-165`].
- The implementation summary reports the delivered artifact as **110 ground truth queries with diversity gates** and names the ground-truth workstream as completed [`implementation-summary.md:54`, `implementation-summary.md:72-74`].

**Certification note**
- The checklist directly proves the 100+ query count and the intent/complexity diversity thresholds.
- The >=30 manually curated component is tied to the same Sprint 0 gate via the accepted Sprint 0 task contract and spec requirement, so the overall criterion is satisfied.

### Gate 5 — Active feature flags <=6
**Result:** PASS

**Evidence**
- Checklist item `CHK-S0-068` is checked and explicitly records **5 active flags**, which satisfies the Sprint 0 maximum of 6 [`checklist.md:159`].

### Gate 6 — Eval DB 5-table schema operational
**Result:** PASS

**Evidence**
- Checklist item `CHK-S0-002` is checked and verifies the evaluation DB defines all five required tables: `eval_queries`, `eval_channel_results`, `eval_final_results`, `eval_ground_truth`, and `eval_metric_snapshots` [`checklist.md:73`].
- The Sprint 0 spec lists the 5-table eval infrastructure as an in-scope deliverable and P0 requirement [`spec.md:91`, `spec.md:155`].
- The implementation summary states Sprint 0 delivered a complete evaluation infrastructure with a separate `speckit-eval.db` and 5-table schema [`implementation-summary.md:54`, `implementation-summary.md:67`].

## Checklist Status Summary

- All Sprint 0 **P0** items verified: `15/15` [`checklist.md:167-171`]
- All Sprint 0 **P1** items verified: `25/25` [`checklist.md:167-171`]
- Requested evidence items supplied in the checklist are present for G1, G3, tests, BM25 baseline, and exit-gate verification [`checklist.md:82-83`, `checklist.md:95-97`, `checklist.md:148-160`]

## Test Verification Results

Requested command executed on 2026-03-08:

```bash
cd .opencode/skill/system-spec-kit/mcp_server && \
npx vitest run tests/eval-db.vitest.ts tests/bm25-baseline.vitest.ts tests/graph-search-fn.vitest.ts --reporter=verbose 2>&1 | tail -20
```

**Observed result**
- `Test Files  3 passed (3)`
- `Tests  63 passed (63)`
- Exit code `0`

**Interpretation**
- `eval-db.vitest.ts` passing supports the operational state of the 5-table eval DB schema.
- `bm25-baseline.vitest.ts` passing supports BM25 baseline recording and contingency evaluation behavior.
- `graph-search-fn.vitest.ts` passing supports the G1 graph ID repair behavior.

## Final Certification

**Sprint 0 Exit Gate Certification: PASS**  
Date: **2026-03-08**

All six requested Sprint 0 exit criteria are satisfied based on the verified Sprint 0 checklist evidence, the accepted Sprint 0 task/spec artifacts for the manually curated query requirement, and the targeted verification test run passing cleanly.

## Recommended Next Step

Proceed to **Sprint 1**.
