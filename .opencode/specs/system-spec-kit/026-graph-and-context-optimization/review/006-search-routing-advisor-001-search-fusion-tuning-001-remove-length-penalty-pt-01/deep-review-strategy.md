---
title: Deep Review Strategy - Remove Length Penalty
---

# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

Target packet: `system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty`

This session ran the requested 10-iteration deep-review loop across correctness, security, traceability, and maintainability. Runtime behavior stayed stable; the active issues are packet-governance drift after renumbering and post-remediation documentation updates.

---

## 2. TOPIC
Deep review of the remove-length-penalty packet, including its canonical docs, metadata files, referenced implementation, and targeted reranker tests.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness — Logic errors, off-by-one, wrong return types, broken invariants
- [x] D2 Security — Injection, auth bypass, secrets exposure, unsafe deserialization
- [x] D3 Traceability — Spec/code alignment, checklist evidence, cross-reference integrity
- [x] D4 Maintainability — Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS
- Rewriting the packet to fix the findings.
- Changing any reviewed production or packet file outside `review/`.
- Re-auditing unrelated fusion or search-advisor phases.

---

## 5. STOP CONDITIONS
- Stop immediately on any confirmed P0.
- Allow early stop only if all four dimensions are covered and traceability gates no longer fail.
- Otherwise stop at the explicit `maxIterations=10` ceiling.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | PASS | 9 | No content-length scoring defect survived three passes through code and tests. |
| D2 Security | PASS | 10 | Provider resolution and warning paths stayed inside expected trust boundaries. |
| D3 Traceability | CONDITIONAL | 7 | Metadata, plan, checklist, and implementation-summary drift after renumbering and post-review remediation. |
| D4 Maintainability | CONDITIONAL | 8 | ADR state and no-op compatibility surface still need cleanup. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 6 active
- **P2 (Minor):** 1 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2

Active registry: `deep-review-findings-registry.json`
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
- Cross-reading packet docs against the referenced runtime and tests quickly separated packet drift from real behavior defects. (iterations 3-8)
- Re-running the targeted TypeScript and Vitest checks confirmed the code slice is stable and kept the review from over-escalating traceability issues into correctness findings. (iterations 5 and 7)
- Revisiting traceability after maintainability surfaced distinct stale artifacts instead of collapsing all packet drift into one generic note. (iteration 7)

---

## 9. WHAT FAILED
- Trusting any single packet doc as canonical verification evidence failed: checklist, implementation-summary, and decision-record all carry different post-remediation state. (iterations 3, 4, 7)
- The packet's renumbering metadata is not self-healing; `description.json` still carries a retired parent node even though migration fields know the current phase slug. (iteration 3)

---

## 10. EXHAUSTED APPROACHES (do not retry)
### Security pass -- PRODUCTIVE (iteration 10)
- What worked: Re-checking provider resolution, fixed endpoints, and warning logs proved the slice is not hiding a trust-boundary defect.
- Prefer for: Confirming that the packet's risk is documentary, not exploit-oriented.

### Correctness saturation -- BLOCKED (iteration 9, 3 attempts)
- What was tried: Runtime rereads, Stage 3 plumbing checks, and targeted test review.
- Why blocked: The behavior is already stable; new work only restated the same traceability drift.
- Do NOT retry: Another correctness-only pass without first remediating packet docs.

---

## 11. RULED OUT DIRECTIONS
- Security leak through provider logging: ruled out because warning strings include provider names and error text, but never echo API keys. (iteration 2, evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:492-495`)
- Live length-based scoring branch: ruled out because `calculateLengthPenalty()` returns `1.0`, `applyLengthPenalty()` clones results unchanged, and the tests assert identical scores across short/long content. (iteration 1, evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:230-239`)

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Synthesis complete. Next safe action: repair the six P1 packet-drift findings, regenerate packet metadata, and then re-run the four-suite verification command so checklist evidence and implementation-summary share one exact captured result.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT
- The packet migrated from the older `010-search-and-routing-tuning` branch into the current `006-search-routing-advisor/001-search-and-routing-tuning` hierarchy on 2026-04-21.
- The shipped code intentionally keeps `applyLengthPenalty` accepted and inert for compatibility, while the cache-key split on retired `lp` bits has already been removed.
- The packet is complete at Level 2 and therefore depends on trustworthy checklist evidence and aligned metadata for downstream search/routing surfaces.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 7 | `plan.md` and `decision-record.md` drift from the shipped compatibility posture in `cross-encoder.ts`. |
| `checklist_evidence` | core | fail | 7 | Checklist and implementation-summary exact test counts conflict. |
| `feature_catalog_code` | overlay | notApplicable | 4 | No feature catalog artifact exists in this packet. |
| `playbook_capability` | overlay | notApplicable | 4 | No playbook artifact exists in this packet. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `spec.md` | D3, D4 | 7 | 0 P0, 1 P1, 0 P2 | complete |
| `plan.md` | D3 | 3 | 0 P0, 1 P1, 0 P2 | complete |
| `tasks.md` | D4 | 4 | 0 P0, 1 P1, 0 P2 | complete |
| `checklist.md` | D3 | 7 | 0 P0, 1 P1, 0 P2 | complete |
| `decision-record.md` | D3, D4 | 7 | 0 P0, 2 P1, 0 P2 | complete |
| `implementation-summary.md` | D3, D4 | 8 | 0 P0, 2 P1, 0 P2 | complete |
| `description.json` | D3 | 3 | 0 P0, 1 P1, 0 P2 | complete |
| `graph-metadata.json` | D3 | 3 | 0 P0, 0 P1, 0 P2 | partial |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` | D1, D2, D3, D4 | 10 | 0 P0, 2 P1, 1 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts` | D1, D2 | 5 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts` | D1, D4 | 9 | 0 P0, 0 P1, 1 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts` | D1, D2 | 6 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts` | D1 | 5 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts` | D1 | 9 | 0 P0, 0 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=`drv-2026-04-21T16-04-55Z-remove-length-penalty`, parentSessionId=`null`, generation=`1`, lineageMode=`new`
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=`spec_code, checklist_evidence`, overlay=`feature_catalog_code, playbook_capability`
- Started: 2026-04-21T16:04:55.927Z
<!-- MACHINE-OWNED: END -->
