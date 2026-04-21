---
title: Deep Review Strategy
description: Session tracking for the 003-wire-tier3-llm-classifier packet review.
---

# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

### Purpose
This file tracks the ten-iteration review over the Tier 3 save-handler wiring packet and the shipped implementation it references.

### Usage
- Init: anchor the review on the packet docs, implementation files, and verification tests.
- Per iteration: rotate one dimension at a time and preserve only file-cited findings.
- Final state: all four dimensions are covered; synthesis is complete; remediation starts from the active blocker list below.

## 2. TOPIC
Review of the `003-wire-tier3-llm-classifier` phase packet against the shipped Tier 3 routing implementation in `memory-save.ts`, `content-router.ts`, and the focused tests.

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness
- [x] D2 Security
- [x] D3 Traceability
- [x] D4 Maintainability
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS
- No production code edits.
- No attempt to repair the packet metadata during the review loop itself.
- No broader audit of unrelated save-path subsystems beyond the files this packet names or directly relies on.

## 5. STOP CONDITIONS
- Stop early only if convergence is legal and no active P0 remains.
- Otherwise continue until the 10-iteration cap or the 3-iteration stuck rule triggers.
- Any active P0 blocks convergence and forces synthesis into a FAIL verdict.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| Correctness | FAIL | 5 | Cache-key scope is too narrow and can replay stale Tier 3 destinations across different routing contexts. |
| Security | FAIL | 6 | Full-auto mode bypasses the documented rollout gate and can send save content to the LLM endpoint. |
| Traceability | FAIL | 7 | Packet docs, feature-flag references, and metadata ancestry drift from the shipped implementation. |
| Maintainability | CONDITIONAL | 8 | Cache lifetime and packet closure hygiene create follow-on maintenance debt, but neither is independently release-blocking. |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 1 active
- **P1 (Major):** 3 active
- **P2 (Minor):** 2 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED
- Reading the packet docs and the implementation side-by-side exposed rollout-contract drift quickly.
- Revisiting correctness after the maintainability pass was useful: the dedicated cache-contract test made F002 materially stronger.
- Running the packet’s focused `tsc` and `vitest` verification helped separate passing behavior from packet/document drift.

## 9. WHAT FAILED
- Trusting the phase packet alone overstated the shipped rollout contract.
- The dedicated cache-context test did not protect the built-in cache implementation, so test coverage initially looked stronger than the shipped runtime behavior.

## 10. EXHAUSTED APPROACHES (do not retry)
### Fail-open timeout handling as the primary security risk -- BLOCKED (iteration 2, 1 attempt)
- What was tried: Reviewed timeout/null-response handling as the likely security defect.
- Why blocked: Those branches fail open to Tier 2 and did not explain the outbound disclosure path.
- Do NOT retry: Treat fail-open transport handling as secondary to the rollout-gate bypass.

### Graph metadata ancestry as the source of the migration drift -- BLOCKED (iteration 7, 1 attempt)
- What was tried: Compared `graph-metadata.json` and `description.json` to see which metadata surface stayed stale after renumbering.
- Why blocked: `graph-metadata.json` is already aligned; the stale ancestry is isolated to `description.json`.
- Do NOT retry: Do not spend more traceability passes blaming `graph-metadata.json` for the parent-chain error.

### Custom cache contracts as proof that the built-in cache is safe -- BLOCKED (iteration 5, 1 attempt)
- What was tried: Considered whether the dedicated cache-context test implicitly covered the shipped in-memory cache.
- Why blocked: The test uses a custom cache keyed on richer context, while the built-in cache still ignores those fields.
- Do NOT retry: Do not rely on the contract test as evidence that `InMemoryRouterCache` is context-safe.

## 11. RULED OUT DIRECTIONS
- The Tier 3 parser/response-shape path is not the blocker; the issue is upstream enablement and cache scoping.
- `graph-metadata.json` already reflects the migrated packet path, so the parent-chain defect is not a whole-packet metadata failure.
- Timeout/null-response handling is not what makes F001 release-blocking.

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Synthesis complete. If remediation starts, fix F001 first, then F002, then align the packet metadata and rollout docs (F003/F004), and close with cache/closure hygiene fixes (F005/F006).
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT
- The packet claims a rollout gate keyed on `SPECKIT_TIER3_ROUTING`, but the shipped code reads `SPECKIT_ROUTER_TIER3_ENABLED` and also enables Tier 3 automatically in full-auto mode.
- The packet was recently renumbered from `010-search-and-routing-tuning` to `001-search-and-routing-tuning`, and only part of the metadata was regenerated.
- Focused TypeScript and Vitest verification still passes, so the highest-signal issues are contract drift and hidden runtime behavior rather than obvious failing regressions.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 3 | Packet docs say the live Tier 3 path is gated by `SPECKIT_TIER3_ROUTING`, but the shipped implementation uses `SPECKIT_ROUTER_TIER3_ENABLED` and also enables Tier 3 in full-auto mode. |
| `checklist_evidence` | core | partial | 8 | Checked items are evidenced, but packet closure still leaves unresolved should-fix/advisory items and a planned decision record with no closure note. |
| `feature_catalog_code` | overlay | fail | 3 | The feature catalog says `SPECKIT_TIER3_ROUTING` was removed entirely, which contradicts both the phase packet and the shipped code. |
| `playbook_capability` | overlay | notApplicable | 8 | This packet has no dedicated manual playbook surface to reconcile. |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | D2, D4 | 10 | 1 P0, 1 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` | D1, D2, D3, D4 | 9 | 1 P1, 1 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts` | D1 | 5 | 0 direct findings | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts` | D1, D3 | 9 | 1 P1 (contract mismatch evidence) | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts` | D2 | 10 | 0 direct findings | complete |
| `implementation-summary.md` | D2, D3 | 10 | 1 P0, 1 P1 | complete |
| `description.json` | D3 | 7 | 1 P1 | complete |
| `decision-record.md` | D4 | 8 | 1 P2 | complete |
| `checklist.md` | D2, D4 | 8 | 1 P2 | complete |
| `graph-metadata.json` | D3, D4 | 8 | 0 direct findings | complete |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=rvw-2026-04-21-tier3-save-handler, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code,checklist_evidence; overlay=feature_catalog_code,playbook_capability
- Started: 2026-04-21T17:16:00Z
<!-- MACHINE-OWNED: END -->
