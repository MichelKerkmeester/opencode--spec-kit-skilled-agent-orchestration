# Deep Review Strategy - search-fusion-tuning root packet

## 1. TOPIC
Deep review of the root packet `001-search-fusion-tuning`, including its root spec docs, packet metadata, packet-local prompt artifacts, selected child closeout documents, and the key implementation files cited by the packet.

## 2. REVIEW DIMENSIONS
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness
- [x] D2 Security
- [x] D3 Traceability
- [x] D4 Maintainability
<!-- MACHINE-OWNED: END -->

## 3. NON-GOALS
- No production code edits.
- No speculative runtime tuning beyond what the packet and shipped tests already claim.
- No Git history changes or packet moves.

## 4. STOP CONDITIONS
- Stop immediately on any confirmed P0.
- Stop on convergence if all four dimensions are covered and new findings ratio stays below `0.10`.
- Stop at iteration `010` if convergence does not legally trigger first.

## 5. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iterations | Summary |
|-----------|---------|------------|---------|
| Correctness | CONDITIONAL | 001, 005, 009 | Shipped code behavior matched the narrow sub-phase claims, but the root packet still overstates closure and the packet-local replay prompt is stale. |
| Security | PASS | 002, 006, 010 | No credential exposure, auth, or trust-boundary defects surfaced in the reviewed scope. |
| Traceability | CONDITIONAL | 003, 007 | Root packet metadata and canonical root artifacts drift from the packet's declared lineage and closeout state. |
| Maintainability | CONDITIONAL | 004, 008 | Child ADR surfaces and packet-local operational docs remain inconsistent after closeout. |
<!-- MACHINE-OWNED: END -->

## 6. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 7 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 7. WHAT WORKED
- Cross-reading the root packet's stated exit criteria against the actual closeout tasks immediately exposed the packet-level completeness gap (iteration 001).
- Comparing child packet closeout surfaces against the root packet metadata surfaced the lineage and status drift without needing speculative code assumptions (iterations 003, 004, 007).
- Re-reading `cross-encoder.ts`, `stage3-rerank.ts`, `content-router.ts`, and the regression suites prevented doc drift from being misreported as a shipped code defect (iterations 005, 006, 010).

## 8. WHAT FAILED
- Treating packet metadata as authoritative without cross-checking `description.json` against `graph-metadata.json` would have missed the renumbering drift (fixed in iteration 007).
- Security passes on this packet were useful for ruling problems out, but they produced no incremental findings after the first sweep.

## 9. EXHAUSTED APPROACHES
- **Security code sweep -- PRODUCTIVE (iterations 002, 006, 010):** Re-reading provider resolution, cache handling, prompt routing, and Stage 3 thresholds consistently produced no actionable security defect in this packet scope.
- **Child implementation verification -- PRODUCTIVE (iterations 005, 006):** The underlying code/test changes matched the narrow child packet claims; the remaining issues are packet-governance drift rather than hidden runtime regressions.

## 10. RULED OUT DIRECTIONS
- No P0-grade correctness or security defect was confirmed in `cross-encoder.ts`, `stage3-rerank.ts`, or `content-router.ts`; the material problems are packet closure and metadata integrity issues instead. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:35-59,396-559`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:49-56,146-212`; `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:11-31`.

## 11. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Loop complete. Next focus is packet remediation in this order: root closeout synthesis -> root canonical docs -> metadata regeneration -> child ADR normalization -> prompt cleanup.
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT
- The packet was renumbered on `2026-04-21`, and both `description.json` and `graph-metadata.json` preserve migration history and aliases.
- Child phases `001-006` are all marked complete and account for the shipped search-tuning sub-work.
- The packet root itself currently ships only `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `description.json`, `graph-metadata.json`, `prompts/`, and the newly created `review/` packet.

## 13. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 001 | Root packet completion claim does not resolve to the root packet's own research deliverables. |
| `checklist_evidence` | core | partial | 003 | Checklist evidence closes child cleanup, but root canonical packet artifacts are missing. |
| `feature_catalog_code` | overlay | notApplicable | 000 | Root target is a spec packet, not a feature catalog surface. |
| `playbook_capability` | overlay | partial | 009 | Packet-local replay prompt still points to a legacy path and stale charter. |
<!-- MACHINE-OWNED: END -->

## 14. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `spec.md` | correctness, traceability | 009 | 0 P0, 4 P1 | complete |
| `plan.md` | correctness, maintainability | 004 | 0 P0, 2 P1 | complete |
| `tasks.md` | correctness, traceability | 003 | 0 P0, 1 P1 | complete |
| `checklist.md` | correctness, traceability | 003 | 0 P0, 1 P1 | complete |
| `description.json` | traceability | 007 | 0 P0, 1 P1 | complete |
| `graph-metadata.json` | traceability | 007 | 0 P0, 2 P1 | complete |
| `prompts/deep-research-prompt.md` | correctness | 009 | 0 P0, 1 P1 | complete |
| `001-004/*decision-record.md` | maintainability | 004 | 0 P0, 1 P1 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` | security, correctness | 010 | 0 P0, 0 P1 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts` | correctness, security | 010 | 0 P0, 0 P1 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` | correctness, security | 010 | 0 P0, 0 P1 | complete |
<!-- MACHINE-OWNED: END -->

## 15. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: `10`
- Convergence threshold: `0.10`
- Rolling stop threshold: `0.08`
- No-progress threshold: `0.05`
- Session lineage: `rvw-2026-04-21T16-04-55Z`, generation `1`, lineage `new`
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: `in-progress | converged | release-blocking`
- Per-iteration budget: `12` tool calls / `10` minutes
- Severity threshold: `P2`
- Review target type: `spec-folder`
- Cross-reference checks: core=`spec_code, checklist_evidence`; overlay=`feature_catalog_code, playbook_capability`
<!-- MACHINE-OWNED: END -->
