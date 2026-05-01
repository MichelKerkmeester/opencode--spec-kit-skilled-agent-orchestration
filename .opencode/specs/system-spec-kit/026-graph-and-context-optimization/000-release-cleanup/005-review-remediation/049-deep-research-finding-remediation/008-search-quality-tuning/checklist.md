---
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2"
title: "Quality Checklist: 008 Search Quality Tuning [template:level_2/checklist.md]"
description: "QA gates for F-011-C1-01..05 remediation. Five surgical product-code fixes + targeted tests; full stress must remain green."
trigger_phrases:
  - "F-011-C1 checklist"
  - "008 search quality checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/008-search-quality-tuning"
    last_updated_at: "2026-05-01T08:20:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "All items ticked"
    next_safe_action: "Commit and push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-008-search-quality"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 008 Search Quality Tuning

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This is a product-code remediation packet with five surgical fixes plus targeted tests. Verification combines structural checks (`validate.sh --strict`), targeted vitest runs against the search-quality stress harness, and a full `npm run stress` regression sweep.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] [P1] Read packet 046 §11 (C1: search quality) findings F-011-C1-01..05
- [x] [P1] Confirmed each cited file:line still matches the research.md claim
- [x] [P1] Authored spec.md, plan.md, tasks.md, checklist.md (this file), implementation-summary.md
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] [P1] Each edit is the smallest product-code change that resolves the finding
- [x] [P1] No template-source bumps (template_source headers unchanged)
- [x] [P2] Each edit carries an inline `// F-011-C1-NN:` marker for traceability
- [x] [P1] No prose outside the cited line ranges or scoped functions was modified
- [x] [P1] No imports removed; existing public exports preserved (additive only for metrics, gated for stage2-fusion)
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] [P1] `ndcg-mrr.vitest.ts` added with NDCG@3, NDCG@10, MRR coverage (15 assertions)
- [x] [P1] `cross-encoder-cap.vitest.ts` added — candidate cap enforced via mocked Voyage provider (4 cases)
- [x] [P1] W4 extended with weak-margin 3-candidate gate-pass assertion + 2-candidate disagreement case + backward-compat guard (3 new cases)
- [x] [P1] W11 extended with graduated-overfetch flag assertion (4 new cases incl. interaction with adaptive flag)
- [x] [P1] W5 extended with learned-blend-weight clamp tests (5 new cases) — covers F-011-C1-05 unit verification
- [x] [P1] `npx vitest run stress_test/search-quality/` exits 0 (18 files / 61 tests)
- [x] [P1] `npm run stress` exits 0 with 58 files / 195 tests (exceeds 56/163 baseline)
- [x] [P1] `validate.sh --strict` on this packet exits with 0 errors (5 informational warnings — same pattern as worked-pilot 010 at commit 889d1ee08)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] [P1] No secrets, tokens, or credentials in any edit
- [x] [P1] Provider candidate cap REDUCES doc volume sent to external rerank APIs (Voyage / Cohere) — net safety improvement
- [x] [P1] Learned-blend weight clamped to [0, 0.05]; out-of-range values do not bypass the clamp
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] [P1] All five findings have a row in the Findings closed table
- [x] [P1] Implementation-summary.md describes the actual fix per finding (not generic)
- [x] [P2] Plan.md numbered phases match the steps actually run
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] [P1] Only the five product files + the new/extended test files modified outside this packet
- [x] [P1] No `MIN_RESULTS_FOR_RERANK` change in `stage3-rerank.ts` (preserves F-16 regression guard)
- [x] [P1] Spec docs live at this packet's root, not in `scratch/`
- [x] [P1] Template artifact `README.md` deleted from packet root (was a Level 1 template fragment, not packet content)
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

### Findings closed

| ID | File | Evidence |
|----|------|----------|
| F-011-C1-01 (P2) | `mcp_server/stress_test/search-quality/metrics.ts` | NDCG@K + MRR added; new `ndcg-mrr.vitest.ts` exercises NDCG@3, NDCG@10, MRR; `// F-011-C1-01:` markers |
| F-011-C1-02 (P1) | `mcp_server/lib/search/rerank-gate.ts` | Floor lowered to 2 when weak-margin/disagreement triggers fire; W4 extended with 3-candidate weak-margin gate-pass; `// F-011-C1-02:` marker |
| F-011-C1-03 (P1) | `mcp_server/lib/search/cross-encoder.ts` | Provider `maxDocuments` enforced before API call; tail merged untouched; `// F-011-C1-03:` markers; cap-enforced unit test |
| F-011-C1-04 (P2) | `mcp_server/lib/search/cocoindex-calibration.ts` | Graduated overfetch flag + 2x multiplier; W11 extended; `// F-011-C1-04:` marker |
| F-011-C1-05 (P2) | `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Learned-blend weight env-clamped to [0, 0.05]; default 0 preserves shadow-only behavior; `// F-011-C1-05:` marker |

### Status

- [x] All five findings closed
- [x] `npm run stress` exit 0 with 58 files / 195 tests (>= 56/163 baseline)
- [x] `validate.sh --strict` exit 0 errors (5 informational warnings, same as worked-pilot 010)
- [x] commit + push to origin main
<!-- /ANCHOR:summary -->
