---
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
title: "Feature Specification: 008 Search Quality Tuning [template:level_2/spec.md]"
description: "Resolve five findings F-011-C1-01..05 from packet 046 across the search-quality stress harness, the conditional rerank gate, the cross-encoder candidate window, the CocoIndex calibration overfetch, and the Stage 2 learned blend. Adds NDCG/MRR rank-sensitive metrics, lowers the rerank floor for weak-margin/disagreement triggers, enforces provider maxDocuments before the cross-encoder call, graduates a bounded adaptive overfetch, and promotes a small guarded blend of the learned Stage 2 model."
trigger_phrases:
  - "F-011-C1"
  - "search quality tuning"
  - "ndcg mrr metrics"
  - "rerank gate floor"
  - "cross-encoder candidate cap"
  - "cocoindex adaptive overfetch"
  - "learned stage2 blend"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/008-search-quality-tuning"
    last_updated_at: "2026-05-01T08:20:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Five fixes landed; tests green"
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
# Feature Specification: 008 Search Quality Tuning

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (2 findings) + P2 (3 findings) |
| **Status** | In Progress |
| **Created** | 2026-04-30 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 10 |
| **Predecessor** | 007-topology-build-boundary |
| **Successor** | 009-test-reliability |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Five tuning findings sit in the search subsystem. (1) The search-quality harness only reports precision@3 and recall@3 — no rank-sensitive metric like NDCG or MRR — so the harness cannot distinguish a top-1 hit from a top-3 hit. (2) The conditional rerank gate hard-floors at four candidates, blocking ambiguous three-candidate cases that have weak-margin or disagreement triggers. (3) The cross-encoder declares `maxDocuments` per provider but never enforces it, so providers receive the entire candidate list. (4) Duplicate-density adaptive overfetch is wired as telemetry-only; even when duplicate density is high, the calibrator records a recommendation but never raises the live overfetch multiplier. (5) The learned Stage 2 combiner runs in shadow mode forever despite stable quality deltas — there is no path to graduate it into a small guarded blend.

### Purpose
Land five surgical fixes that close F-011-C1-01..05 without disturbing the existing W3-W13 stress contract: add NDCG@3 / NDCG@10 / MRR to the metrics module, lower the rerank gate floor to 2 for weak-margin/disagreement triggers, apply the provider candidate cap before the cross-encoder call, graduate bounded adaptive overfetch behind a feature flag, and promote a small guarded learned-blend weight (also flag-gated). All changes stay within the existing flag and behavior surface — no full rollout in this packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Five surgical product-code fixes, one per finding F-011-C1-01..05
- One additive test file (NDCG/MRR metrics) in `mcp_server/stress_test/search-quality/`
- Targeted assertions added to existing W4 / W6 tests where they cover the gate-floor and cocoindex behaviors
- Strict validation pass on this packet
- Targeted vitest run + full `npm run stress`
- One commit pushed to `origin main`

### Out of Scope
- Full rollout of adaptive overfetch (graduate-only, gated)
- Full rollout of learned Stage 2 combiner as the live ranker (tiny guarded blend only)
- Behavior change to `MIN_RESULTS_FOR_RERANK = 4` in `stage3-rerank.ts` (preserves F-16 regression guard)
- Cross-encoder provider integration changes (the cap is enforced before the provider call)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/stress_test/search-quality/metrics.ts` | Modify | Add NDCG@K, MRR, and surface them through the metric summary |
| `mcp_server/lib/search/rerank-gate.ts` | Modify | Lower the candidate-count floor to 2 for weak-margin/disagreement triggers |
| `mcp_server/lib/search/cross-encoder.ts` | Modify | Enforce provider `maxDocuments` window before the API call; merge tail untouched |
| `mcp_server/lib/search/cocoindex-calibration.ts` | Modify | Graduate adaptive overfetch — flag-gated multiplier, conservative bound (2x not 4x) when duplicate density is high |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Modify | Promote a small guarded learned-blend weight (default 0, opt-in via flag) |
| `mcp_server/stress_test/search-quality/ndcg-mrr.vitest.ts` | Create | Unit tests for NDCG@3, NDCG@10, and MRR |
| `mcp_server/stress_test/search-quality/w4-conditional-rerank.vitest.ts` | Modify | Extend with a weak-margin 3-candidate gate-pass assertion |
| `mcp_server/stress_test/search-quality/w11-cocoindex-calibration-telemetry.vitest.ts` | Modify | Extend with a graduated-overfetch flag assertion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional
- FR-1: `metrics.ts` exports `ndcgAtK(candidates, relevantIds, k)` and `mrr(candidates, relevantIds)` plus surface NDCG@3, NDCG@10, MRR through `summarizeSearchQualityRun`. Existing precision@3 / recall@3 / latency / refusal / citation outputs remain unchanged.
- FR-2: `decideConditionalRerank` returns `shouldRerank: true` when there are at least 2 candidates AND a weak-margin or disagreement trigger fires. The hard floor stays at 4 only when no weak-margin/disagreement trigger is present (i.e. complex-query / high-authority gate without the ambiguity signals still respects the original floor).
- FR-3: `rerankResults` enforces `PROVIDER_CONFIG[provider].maxDocuments` — only the top-N candidates by score are sent to the provider call; the untouched tail is appended in original order with `scoringMethod: 'cross-encoder-tail'`.
- FR-4: `cocoindex-calibration.ts` exposes a `SPECKIT_COCOINDEX_GRADUATED_OVERFETCH` flag (default OFF). When ON AND duplicate density >= 0.35, the multiplier is 2x (graduated) instead of 1x. The existing `SPECKIT_COCOINDEX_ADAPTIVE_OVERFETCH=1` flag continues to apply 4x (unchanged); they are independent.
- FR-5: `stage2-fusion.ts` reads `SPECKIT_LEARNED_STAGE2_BLEND_WEIGHT` (default 0.0). When > 0 AND <= 0.05 AND a model loaded successfully, the live result score is blended as `(1-w) * manual + w * learned`. Out-of-range values clamp to [0, 0.05]. When the value is 0 or no model loaded, behavior is identical to today's shadow-only path.

### Non-Functional
- NFR-1: `validate.sh --strict` exit 0 for this packet.
- NFR-2: `npm run stress` stays at >= 56 files / >= 163 tests / exit 0.
- NFR-3: Each edit carries an inline `// F-011-C1-NN:` marker for traceability.
- NFR-4: No imports of `service_tier="fast"` workflows; this packet is normal-speed work.

### Constraints
- Stay on `main`.
- Do NOT change `MIN_RESULTS_FOR_RERANK = 4` in `stage3-rerank.ts` — F-16 regression guard.
- Adaptive overfetch graduation is conservative (2x, flag-gated) — existing 4x flag stays for explicit power-user opt-in.
- Learned blend default weight is 0.0 (no behavior change). Promotion is an opt-in capability, not a flip.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] Spec authored
- [x] All five findings closed with `// F-011-C1-NN:` source markers
- [x] NDCG@3, NDCG@10, MRR added with passing unit tests
- [x] Rerank gate weak-margin floor lowered with passing test
- [x] Cross-encoder candidate cap enforced with passing test
- [x] CocoIndex graduated overfetch flag added with passing test
- [x] Learned-blend weight added with default-off behavior verified
- [x] `validate.sh --strict` exit 0 errors (5 informational warnings — same pattern as worked-pilot 010 at commit 889d1ee08)
- [x] Targeted vitest pass for search-quality (18 files / 61 tests)
- [x] `npm run stress` exit 0 with 58 files / 195 tests (exceeds 56/163 baseline)
- [x] One commit pushed to `origin main`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Lowering the rerank floor regresses W4 or stage3-rerank-regression test | The lower floor only triggers when a weak-margin OR disagreement trigger is present; baseline W4 case (margin=0.5) still skips at < 4. F-16 regression test asserts on `MIN_RESULTS_FOR_RERANK = 4` in `stage3-rerank.ts`, which is unchanged |
| Provider candidate cap changes API quota usage | Cap reduces, never increases, doc volume sent to provider — quota usage drops or stays equal |
| Graduated overfetch increases p95 latency | Flag-gated and bounded at 2x (not 4x); off by default; existing 4x flag stays for power users |
| Learned blend changes live ranking | Weight defaults to 0.0; flag-clamped to <= 0.05; off in CI; no behavior change unless opted in |
| NDCG/MRR addition breaks summary contract | Additive only — existing fields preserved; new fields added at end of summary object |

Dependencies:
- Source of truth: `046-system-deep-research-bugs-and-improvements/research/research.md` §11 (C1: search quality)
- Existing W3-W13 stress harness must keep passing
- Validate: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- No other packet dependencies
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:edges -->
## L2: EDGE CASES

| Edge | Trigger | Expected behavior |
|------|---------|-------------------|
| Cited line moved | Cited line range no longer matches | Locate by surrounding context, apply fix, document drift in implementation-summary |
| Cross-encoder receives < maxDocuments candidates | Candidate count below cap | Cap is a no-op; entire list sent to provider as today |
| Adaptive flag and graduated flag both set | Both env vars on | Adaptive 4x wins (existing power-user opt-in); graduated 2x applies only when adaptive is OFF |
| Learned blend weight > 0.05 | User sets 0.5 | Clamped to 0.05; warning logged once at startup |
| NDCG denominator zero | No relevant ids in test case | NDCG returns 0 (matches precision/recall convention in the same module) |
<!-- /ANCHOR:edges -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Finding | File | Effort (minutes) |
|---------|------|-----------------:|
| F-011-C1-01 (P2) | metrics.ts + ndcg-mrr.vitest.ts | 35 |
| F-011-C1-02 (P1) | rerank-gate.ts + W4 test extension | 30 |
| F-011-C1-03 (P1) | cross-encoder.ts + cap assertion | 30 |
| F-011-C1-04 (P2) | cocoindex-calibration.ts + W11 test extension | 25 |
| F-011-C1-05 (P2) | stage2-fusion.ts + flag-default test | 25 |
| **Total** | | **~145** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. The "full rollout" follow-on work (live adaptive overfetch by default, live learned-blend weight > 0) is deferred to a separate packet that can run multi-week telemetry before flipping defaults.
<!-- /ANCHOR:questions -->
