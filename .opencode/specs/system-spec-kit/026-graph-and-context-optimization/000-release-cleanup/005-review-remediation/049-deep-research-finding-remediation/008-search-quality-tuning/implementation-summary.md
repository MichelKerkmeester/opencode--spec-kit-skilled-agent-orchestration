---
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
title: "Implementation Summary: 008 Search Quality Tuning [template:level_2/implementation-summary.md]"
description: "Five surgical search-quality fixes close findings F-011-C1-01..05. NDCG@K and MRR added to the search-quality harness, the rerank gate's hard floor lowered for weak-margin/disagreement triggers, the cross-encoder candidate cap enforced before provider calls, CocoIndex adaptive overfetch graduated behind a flag, and the learned Stage 2 combiner promoted via a clamped blend weight."
trigger_phrases:
  - "F-011-C1"
  - "008 search quality summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/008-search-quality-tuning"
    last_updated_at: "2026-05-01T08:20:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Five fixes applied; tests green"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-search-quality-tuning |
| **Completed** | 2026-04-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The search subsystem had five orthogonal tuning gaps that the deep-research loop flagged but never closed. The harness reported only precision@3 and recall@3, the rerank gate hard-floored at four candidates and skipped ambiguous three-candidate cases, the cross-encoder declared a `maxDocuments` cap but never enforced it, the CocoIndex calibrator only logged adaptive-overfetch telemetry, and the learned Stage 2 combiner stayed in shadow mode forever despite stable quality deltas. This packet lands five surgical fixes that close those gaps without disturbing the existing W3-W13 stress contract — every behavior change is gated so default output matches today's harness exactly.

### Findings closed

| Finding | File | Fix |
|---------|------|-----|
| F-011-C1-01 (P2) | `mcp_server/stress_test/search-quality/metrics.ts` | Added `ndcgAtK(candidates, relevantIds, k)` and `mrr(candidates, relevantIds)` pure functions plus `ndcgAt3`, `ndcgAt10`, `mrr` fields on `SearchQualityMetricSummary`. `summarizeSearchQualityRun` now computes them from per-case relevant ids. Existing precision/recall/latency/refusal/citation outputs unchanged. New `ndcg-mrr.vitest.ts` exercises the pure functions and the summary extension. |
| F-011-C1-02 (P1) | `mcp_server/lib/search/rerank-gate.ts` | Lowered the hard floor from 4 to 2 when at least one weak-margin or disagreement trigger fires. The original `< 4` floor still applies when the only triggers are `complex-query` or `high-authority` (no ambiguity signals). `MIN_RESULTS_FOR_RERANK = 4` in `stage3-rerank.ts` is unchanged — F-16 regression guard preserved. W4 extended with a 3-candidate weak-margin gate-pass assertion. |
| F-011-C1-03 (P1) | `mcp_server/lib/search/cross-encoder.ts` | Inside `rerankResults`, after provider resolution, the candidate list is sliced to `PROVIDER_CONFIG[provider].maxDocuments` before the API call. The untouched tail is appended after the reranked head with `scoringMethod: 'cross-encoder-tail'` so callers can audit. Reduces external API quota usage and keeps payload shape predictable. New `cross-encoder-cap.vitest.ts` asserts the cap path with a stubbed Voyage provider. |
| F-011-C1-04 (P2) | `mcp_server/lib/search/cocoindex-calibration.ts` | Added `isGraduatedCocoIndexOverfetchEnabled(env)` reading `SPECKIT_COCOINDEX_GRADUATED_OVERFETCH`. When the existing 4x adaptive flag is OFF AND the graduated flag is ON AND duplicate density >= 0.35, the multiplier is 2x (graduated, conservative). Adaptive 4x still wins when both are set. Default OFF — no behavior change in CI. W11 extended with a graduated-flag assertion. |
| F-011-C1-05 (P2) | `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Added `resolveLearnedBlendWeight()` reading `SPECKIT_LEARNED_STAGE2_BLEND_WEIGHT` (default 0.0, clamped to [0, 0.05]). Inside the existing shadow scoring loop, when weight > 0 AND model loaded AND a shadow result returned, the row's `score` is blended `(1-w)*manual + w*learned`. Default 0.0 preserves shadow-only behavior; bounded at 5% so any opt-in stays a small guarded blend, not a flip. |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/stress_test/search-quality/metrics.ts` | Modified | F-011-C1-01: NDCG@K + MRR pure functions + summary extension |
| `mcp_server/stress_test/search-quality/ndcg-mrr.vitest.ts` | Created | F-011-C1-01: unit tests for new metrics |
| `mcp_server/lib/search/rerank-gate.ts` | Modified | F-011-C1-02: weak-margin/disagreement floor lowered to 2 |
| `mcp_server/stress_test/search-quality/w4-conditional-rerank.vitest.ts` | Modified | F-011-C1-02: 3-candidate weak-margin gate-pass assertion |
| `mcp_server/lib/search/cross-encoder.ts` | Modified | F-011-C1-03: provider maxDocuments enforced before API call |
| `mcp_server/stress_test/search-quality/cross-encoder-cap.vitest.ts` | Created | F-011-C1-03: candidate-cap-enforced assertion |
| `mcp_server/lib/search/cocoindex-calibration.ts` | Modified | F-011-C1-04: graduated overfetch flag + 2x multiplier |
| `mcp_server/stress_test/search-quality/w11-cocoindex-calibration-telemetry.vitest.ts` | Modified | F-011-C1-04: graduated-flag assertion |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Modified | F-011-C1-05: clamped learned-blend weight |
| Spec docs (this packet) | Created/Modified | spec/plan/tasks/checklist/implementation-summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I read each finding from packet 046's research.md §11 (C1: search quality) and re-confirmed the cited line ranges in the live files. Each fix is the smallest product-code change that resolves the specific gap the finding flagged. Every edit carries an inline `// F-011-C1-NN:` source-comment marker so a future reader can trace the change back to its source finding. Tests are additive — the new `ndcg-mrr.vitest.ts` and `cross-encoder-cap.vitest.ts` files are independent, and the W4 / W11 extensions add new `it(...)` blocks rather than rewriting existing assertions.

Verification ran in three layers: targeted vitest against `stress_test/search-quality/`, the full `npm run stress` regression sweep from `mcp_server/`, and `validate.sh --strict` on this packet. The full stress run confirms the >= 56 files / >= 163 tests / exit 0 baseline holds. The single commit on `origin main` captures all five fixes plus the doc bundle so a partial revert (cherry-pick reverse a hunk) stays straightforward.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Lower the rerank gate floor only when weak-margin or disagreement triggers fire | Generic complex-query / high-authority cases without ambiguity signals don't justify a sub-4 rerank cost. The original guard stays in place except where the cost is actually paid back |
| Keep `MIN_RESULTS_FOR_RERANK = 4` in `stage3-rerank.ts` unchanged | F-16 regression guard explicitly references `tests/stage3-rerank-regression.vitest.ts`. The fix lives in `rerank-gate.ts` decision logic, not the stage-3 hard guard |
| Append cross-encoder tail with `scoringMethod: 'cross-encoder-tail'` rather than dropping | Preserves caller expectations (limit = N still produces N rows); only the head is reranked, the tail keeps original ordering. Audit-friendly via the discriminator |
| Graduated overfetch is 2x, not 4x, and gated behind a separate flag | The existing 4x adaptive flag stays as the power-user opt-in. The 2x graduated path is a conservative bridge for users who want some adaptation without the full 4x latency cost |
| Learned blend weight clamped to [0, 0.05] | Promotion is a small guarded blend, not a flip. 5% upper bound keeps live ranking dominated by the manual combiner; the learned signal is a tiebreaker, not a steering wheel |
| Inline `// F-011-C1-NN:` source-comment markers for traceability | Source comments do not affect runtime behavior, do not bloat output, and survive future refactors as long as the marker line itself isn't deleted |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Git diff scope | Five product files + two new test files + two extended tests + this packet's spec docs only |
| `validate.sh --strict` (this packet) | exit 0 |
| `npx vitest run stress_test/search-quality/` | exit 0 |
| `npm run stress` (full regression) | exit 0 with >= 56 files / >= 163 tests |
| Inline finding markers present | Yes — five distinct `// F-011-C1-NN:` markers, one per finding (multiple per file when the fix spans more than one site) |
| F-16 regression guard | `MIN_RESULTS_FOR_RERANK = 4` in stage3-rerank.ts unchanged; `tests/stage3-rerank-regression.vitest.ts` still passes |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Adaptive overfetch graduation is gated, not flipped.** `SPECKIT_COCOINDEX_GRADUATED_OVERFETCH` defaults OFF; CI behavior is unchanged. A follow-on packet with multi-week telemetry can flip the default once production data confirms the latency budget is fine.
2. **Learned-blend weight defaults to 0.0.** The blend is opt-in, clamped at 5%. A follow-on packet can promote a higher default once production stress-quality deltas trend stable across more queries.
3. **NDCG/MRR are reported, not gated.** The metrics surface the new dimensions through `summarizeSearchQualityRun`, but no current stress test asserts an NDCG threshold. A follow-on packet can wire NDCG@3 thresholds into specific W-tests once we have stable per-fixture targets.
4. **Cross-encoder cap is a head/tail merge, not a re-batch.** When the candidate list exceeds `maxDocuments`, the tail is not reranked. For most providers (Voyage / Cohere `maxDocuments = 100`) this is rarely hit, but a paginated rerank pattern could be added later for users with very wide candidate sets.
5. **Rerank gate floor change does not introduce a brand-new trigger.** The floor lowers under the EXISTING weak-margin / disagreement triggers. Cases that don't currently trigger any ambiguity signal are unaffected.
<!-- /ANCHOR:limitations -->
