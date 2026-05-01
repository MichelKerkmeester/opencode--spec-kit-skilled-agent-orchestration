---
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
title: "Implementation Plan: 008 Search Quality Tuning [template:level_2/plan.md]"
description: "Five surgical search-quality fixes plus targeted tests close findings F-011-C1-01..05 from packet 046. Adds NDCG/MRR metrics, lowers the rerank gate floor for weak-margin/disagreement triggers, enforces the cross-encoder candidate cap, graduates a bounded CocoIndex overfetch, and promotes a small guarded learned-blend weight."
trigger_phrases:
  - "F-011-C1 plan"
  - "008 search quality plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/008-search-quality-tuning"
    last_updated_at: "2026-05-01T08:20:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Plan executed; phases complete"
    next_safe_action: "Commit and push to origin main"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/metrics.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-008-search-quality"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 008 Search Quality Tuning

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Five surgical product-code fixes close F-011-C1-01..05. Each fix is bounded, additive where possible, and gated so default behavior matches today's stress harness. The packet stays inside the existing W3-W13 stress contract: no harness rewrite, no fixture churn, no flag flip.

### Technical Context

The search subsystem has five orthogonal tuning gaps:
1. The metrics module (`metrics.ts`) reports precision/recall but no rank-sensitive metric.
2. The rerank gate (`rerank-gate.ts`) hard-floors at four candidates and skips ambiguous three-candidate cases.
3. The cross-encoder (`cross-encoder.ts`) declares `maxDocuments` but never enforces it.
4. The CocoIndex calibrator (`cocoindex-calibration.ts`) emits adaptive-overfetch telemetry but never raises the live multiplier outside an existing 4x flag.
5. Stage 2 fusion (`stage2-fusion.ts`) runs the learned combiner in shadow mode forever with no graduation path.

The fix surface is small and self-contained per file. No cross-cutting refactor; no schema change; no new pipeline stage.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Threshold |
|------|-----------|
| validate.sh --strict | exit 0 (errors=0) |
| Git diff scope | five product files + one new test file + two extended tests + this packet's spec docs only |
| Stress regression | none expected — existing flags default to today's behavior |
| `npm run stress` | exit 0, >= 56 files, >= 163 tests |
| Inline traceability markers | one `// F-011-C1-NN:` comment per finding |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Per-file surgical changes within the existing module boundaries:
- **metrics.ts**: Add `ndcgAtK` and `mrr` pure functions; extend the `SearchQualityMetricSummary` interface with `ndcgAt3`, `ndcgAt10`, `mrr` fields; update `summarizeSearchQualityRun` to compute them. Existing field shapes unchanged.
- **rerank-gate.ts**: Conditional floor — `< 4` blocks ONLY when no weak-margin/disagreement trigger fires. With weak-margin or disagreement, the floor drops to 2.
- **cross-encoder.ts**: Inside `rerankResults`, after provider resolution, slice candidates to `PROVIDER_CONFIG[provider].maxDocuments`, send the head, then append the untouched tail (with `scoringMethod: 'cross-encoder-tail'` so callers can audit) before returning.
- **cocoindex-calibration.ts**: Add `isGraduatedOverfetchEnabled(env)` helper; when adaptive flag is OFF AND graduated flag is ON AND duplicate density >= 0.35, multiplier = 2 (graduated). Adaptive flag still wins when both are set.
- **stage2-fusion.ts**: Add `resolveLearnedBlendWeight()` helper reading `SPECKIT_LEARNED_STAGE2_BLEND_WEIGHT` (clamp [0, 0.05]). Inside the existing shadow loop (around line 1297), if weight > 0 AND model loaded AND shadow score returned, mutate `row.score` toward the learned score by the blend weight.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| # | Phase | Action | File | Finding | Status |
|---|-------|--------|------|---------|--------|
| 1 | Edit | Add NDCG@K / MRR + extend summary | metrics.ts | F-011-C1-01 | Pending |
| 2 | Test | Add ndcg-mrr.vitest.ts unit tests | stress_test/search-quality/ | F-011-C1-01 | Pending |
| 3 | Edit | Lower rerank floor for weak-margin/disagreement triggers | rerank-gate.ts | F-011-C1-02 | Pending |
| 4 | Test | Extend W4 with weak-margin 3-candidate gate-pass | w4-conditional-rerank.vitest.ts | F-011-C1-02 | Pending |
| 5 | Edit | Enforce provider maxDocuments before API call | cross-encoder.ts | F-011-C1-03 | Pending |
| 6 | Test | Add candidate-cap-enforced assertion to existing test surface | cross-encoder test (inline in test for stage3 gate or new) | F-011-C1-03 | Pending |
| 7 | Edit | Graduate adaptive overfetch behind new flag | cocoindex-calibration.ts | F-011-C1-04 | Pending |
| 8 | Test | Extend W11 with graduated-overfetch flag assertion | w11-cocoindex-calibration-telemetry.vitest.ts | F-011-C1-04 | Pending |
| 9 | Edit | Promote learned blend behind clamped flag | stage2-fusion.ts | F-011-C1-05 | Pending |
| 10 | Verify | Run targeted vitest + full `npm run stress` | mcp_server/ | — | Pending |
| 11 | Validate | `validate.sh --strict` for this packet | this packet | — | Pending |
| 12 | Refresh | `generate-context.js` to refresh metadata | this packet | — | Pending |
| 13 | Ship | commit + push to origin main | repo | — | Pending |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | NDCG@3 / NDCG@10 / MRR pure functions | vitest, additive `ndcg-mrr.vitest.ts` |
| Unit | Rerank gate weak-margin 3-candidate flow | vitest, extension to `w4-conditional-rerank.vitest.ts` |
| Unit | Cross-encoder maxDocuments cap | vitest, new test in cross-encoder coverage area |
| Unit | CocoIndex graduated overfetch flag | vitest, extension to `w11-cocoindex-calibration-telemetry.vitest.ts` |
| Smoke | Stage 2 learned-blend default-off path | implicit — full stress run must stay green |
| Full | All search-quality + repo stress | `npm run stress` from `mcp_server/` |

NDCG/MRR additions must not change the baseline test (`baseline.vitest.ts`) — its assertions reference precision/recall/latency only and remain untouched.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Source of truth: `046-system-deep-research-bugs-and-improvements/research/research.md` §11 (C1: search quality findings)
- Validate script: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Existing search-quality stress files: `baseline`, `w3`, `w4`, `w5`, `w6`, `w7-*`, `w8`, `w10`, `w11`, `w13` — all must remain green
- No other packet dependencies; sub-phase 008 is independent within Wave 1
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If a downstream regression appears:
1. `git revert <commit-sha>` reverts all five fixes plus tests atomically.
2. Re-run `npm run stress` to confirm pre-fix baseline restored.
3. For partial revert, the per-finding `// F-011-C1-NN:` markers locate the exact hunk for targeted cherry-pick reverse.

Per-finding fallback strategy:
- C1-01 (NDCG/MRR): purely additive — revert leaves precision/recall intact.
- C1-02 (rerank floor): revert restores `< 4` hard floor.
- C1-03 (candidate cap): revert sends entire candidate list to provider as before.
- C1-04 (graduated overfetch): flag default OFF, so no rollback needed unless a user opted in; revert removes the flag-handling branch.
- C1-05 (learned blend): weight default 0, so no rollback needed unless a user opted in.
<!-- /ANCHOR:rollback -->
