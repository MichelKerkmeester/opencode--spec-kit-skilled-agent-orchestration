---
title: "Deep Review Strategy - 007-detector-provenance-and-regression-floor"
description: "Session tracking for Batch B review of 007-detector-provenance-and-regression-floor."
---

# Deep Review Strategy - 007-detector-provenance-and-regression-floor

## 1. OVERVIEW

Batch review packet for `007-detector-provenance-and-regression-floor`.

## 2. TOPIC

Batch review of `007-detector-provenance-and-regression-floor`

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness - Detector provenance honesty and frozen regression coverage
- [ ] D2 Security - Fail-closed detector labeling boundaries and misleading certainty risks
- [ ] D3 Traceability - Spec/checklist/implementation-summary alignment
- [ ] D4 Maintainability - Clarity of detector-floor versus outcome-quality separation
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- No detector rewrites or new fixtures beyond reviewing shipped evidence.
- No routing-quality claims outside the packet's detector-integrity scope.

## 5. STOP CONDITIONS

- Stop at 10 iterations max.
- Stop early on convergence if two consecutive iterations add no new findings.
- Stop immediately if evidence cannot support or refute a claimed shipped surface.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | PASS | 1 | Audited detector modules now expose honest `heuristic` and `regex` provenance and the frozen floor matches that shipped scope. |
| D2 Security | PASS | 2 | No unsafe trust inflation or hidden AST-style certainty surfaced in the reviewed detector lanes. |
| D3 Traceability | PASS | 3 | The packet docs consistently frame the floor as regression integrity rather than end-user quality proof. |
| D4 Maintainability | PASS | 4 | The bounded provenance constants plus single frozen harness keep the packet reusable without widening scope. |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED

- Reviewing the provenance constants and frozen harness together made it straightforward to confirm honesty and regression-floor alignment.
- Re-reading the README boundary text against the implementation summary ruled out outcome-quality overclaim drift.

## 9. WHAT FAILED

- None yet.

## 10. EXHAUSTED APPROACHES (do not retry)

- None yet.

## 11. RULED OUT DIRECTIONS

- No evidence of live AST-overclaim labels remained in the reviewed detector surfaces.

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Complete after 10 iterations. No active findings remain for packet `007`; successor packets can treat this as a bounded detector-integrity floor only.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

- Implementation summary claims the audit found no live `ast` overclaims, so the packet shipped typed provenance descriptors and a frozen regression floor instead of a large runtime rewrite.
- Shipped guardrails are described on `evidence-gap-detector.ts`, `deterministic-extractor.ts`, and a scripts-side Vitest harness.
- Known limitation: the regression floor is explicitly not an end-user outcome benchmark.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 3 | Code and docs align on provenance honesty plus frozen regression scope. |
| `checklist_evidence` | core | pass | 3 | Checklist evidence matches the shipped detector constants and floor harness. |
| `skill_agent` | overlay | notApplicable | 0 | No skill-agent cross-runtime surface in packet scope |
| `agent_cross_runtime` | overlay | notApplicable | 0 | No agent runtime parity work in packet scope |
| `feature_catalog_code` | overlay | notApplicable | 0 | No feature catalog surface in packet scope |
| `playbook_capability` | overlay | notApplicable | 0 | No playbook surface in packet scope |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts` | [D1, D2, D4] | 10 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/deterministic-extractor.ts` | [D1, D2, D4] | 10 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md` | [D2, D3] | 10 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/scripts/tests/detector-regression-floor.vitest.ts.test.ts` | [D1, D3, D4] | 10 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts` | [D1] | 1 | 0 P0, 0 P1, 0 P2 | sampled |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts` | [D1] | 1 | 0 P0, 0 P1, 0 P2 | sampled |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-04-09T14:20:47Z-007-detector-provenance-and-regression-floor, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=`spec_code`,`checklist_evidence`; overlay=`skill_agent`,`agent_cross_runtime`,`feature_catalog_code`,`playbook_capability`
- Started: 2026-04-09T14:20:47Z
<!-- MACHINE-OWNED: END -->
