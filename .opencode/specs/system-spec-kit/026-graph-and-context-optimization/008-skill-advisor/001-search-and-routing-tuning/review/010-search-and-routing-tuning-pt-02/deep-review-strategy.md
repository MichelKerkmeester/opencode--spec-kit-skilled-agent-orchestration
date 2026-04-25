# Deep Review Strategy - 010 Continuity Research Root Review

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Review the promoted `010-search-and-routing-tuning` coordination tree after the move from the older `006` / `017-019` lineage. The goal is to verify promotion integrity across active prompts, child-root review artifacts, graph metadata, and packet status surfaces without modifying any reviewed packet files.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Root review of `010-search-and-routing-tuning` covering the promoted parent metadata plus child roots `001-search-fusion-tuning`, `002-content-routing-accuracy`, and `003-graph-metadata-validation`.

<!-- /ANCHOR:topic -->
<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness — Logic and artifact truthfulness checks over promoted packet claims
- [x] D2 Security — Prompt, metadata, and review-surface trust-boundary sweep
- [x] D3 Traceability — Promotion path, lineage, and status-surface fidelity
- [x] D4 Maintainability — Recovery-surface and review-lineage durability
<!-- MACHINE-OWNED: END -->

<!-- /ANCHOR:review-dimensions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Reopening runtime implementation files under `.opencode/skill/system-spec-kit/`.
- Repairing packet docs during the review itself.
- Auditing unrelated packet families outside `010-search-and-routing-tuning/`.

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- Complete the operator-requested 20 iterations.
- Cover correctness, security, traceability, and maintainability at least once.
- Reconcile promotion integrity across prompts, review lineage, graph metadata, and root packet status coherence.
- Finish with packet-local review artifacts only under `010-search-and-routing-tuning/review/`.

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:completed-dimensions -->
## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 14 | Promotion drift does not reopen the old runtime bugs, but 003 still overclaims a clean graph-metadata corpus. |
| D2 Security | PASS | 9 | Packet-local prompt and review drift does not cross a trust boundary or expose secrets. |
| D3 Traceability | FAIL | 18 | The active prompt, child review outputs, task evidence, and 002 root status still point at retired paths or contradictory packet states. |
| D4 Maintainability | CONDITIONAL | 19 | Recovery surfaces remain usable, but promoted review artifacts were not regenerated after the move. |
<!-- MACHINE-OWNED: END -->

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 5 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

<!-- /ANCHOR:running-findings -->
<!-- ANCHOR:what-worked -->
## 8. WHAT WORKED
- Cross-checking promoted child review reports against live runtime/test files quickly separated stale review carry-over from live runtime regressions. (iterations 3-5, 13-14)
- Reading the promoted packet surfaces with line numbers exposed a small, consistent set of high-signal promotion defects instead of a diffuse validator-only complaint list. (iterations 1-8, 15-19)
- A dedicated security pass confirmed the packet drift is operational and documentary rather than trust-boundary related. (iterations 7 and 9)

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 9. WHAT FAILED
- The preexisting root review packet was internally inconsistent: it claimed completion but lacked `deep-review-state.jsonl`, so it could not be resumed safely and had to be archived before this run.
- CocoIndex semantic discovery was not needed after exact line-number reads made the promotion drift obvious; the packet was better served by direct file evidence and validator output.

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES (do not retry)
### Current-runtime replay of the old 001 Stage 3 defect -- BLOCKED (iterations 3, 4, 14)
- What was tried: Replay the promoted `001` review report against the live rerank implementation.
- Why blocked: `stage3-rerank.ts` now prefers `adaptiveFusionIntent`, so the promoted report is stale evidence rather than proof of a live defect.
- Do NOT retry: Treating the promoted `001` root review report as evidence for a current Stage 3 bug.

### Current-runtime replay of the old 002 metadata-only routing defect -- BLOCKED (iterations 5, 13)
- What was tried: Replay the promoted `002` review report against the live handler and targeted regression.
- Why blocked: The shipped handler now routes metadata-only saves into `implementation-summary.md` when present, and the targeted regression covers that path.
- Do NOT retry: Treating the promoted `002` root review report as evidence for a current metadata-only routing defect.

### Root metadata remapping as the primary cause of the drift -- BLOCKED (iterations 10, 17)
- What was tried: Re-check the promoted root `description.json` and `graph-metadata.json`.
- Why blocked: The coordination-parent metadata still maps the promoted children correctly; the high-signal drift is concentrated in prompts, child review artifacts, graph-metadata closeout claims, and task evidence.
- Do NOT retry: Broad root-metadata speculation without a concrete line-cited contradiction.

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 11. RULED OUT DIRECTIONS
- A current Stage 3 continuity regression in the promoted runtime. Ruled out by the live MMR intent selection. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209]
- A current metadata-only host-selection regression in the promoted runtime. Ruled out by the live host resolver and targeted regression. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1054] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1157]
- A packet-local security issue in prompts, metadata, or review surfaces. The security passes found no secret handling or privilege-boundary defect.

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Stop iteration. Open a narrow promotion-remediation pass that regenerates the promoted child root review artifacts, fixes the 002 prompt path, reconciles the 003 closeout claims and task evidence, and normalizes the 002 root packet status.
<!-- MACHINE-OWNED: END -->

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:known-context -->
## 13. KNOWN CONTEXT
- `010-search-and-routing-tuning` is a promoted coordination parent with `description.json` and canonical JSON `graph-metadata.json` at the top level.
- The three child roots each carry their own review or implementation artifacts, but those artifacts were not uniformly regenerated after the move from the older `006` / `017-019` lineage.
- The most obvious old runtime defects reported in promoted child reviews are already fixed in the live runtime and regression suite; the current problem set is promotion drift.
- The archived root review packet under `review/archive-invalid-2026-04-13T16-59-27Z/` was preserved only as a recovery snapshot because it lacked a valid JSONL lineage.

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:cross-reference-status -->
## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 18 | Promoted packet surfaces still contradict current promoted paths and current runtime reality. |
| `checklist_evidence` | core | fail | 12 | Promoted 003 tasks still cite retired 019 evidence and 002 root status remains contradictory. |
| `feature_catalog_code` | overlay | notApplicable | 20 | No feature-catalog surface is owned directly by the promoted coordination parent. |
| `playbook_capability` | overlay | notApplicable | 20 | No manual playbook surface is owned directly by `010-search-and-routing-tuning`. |
<!-- MACHINE-OWNED: END -->

<!-- /ANCHOR:cross-reference-status -->
<!-- ANCHOR:files-under-review -->
## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/description.json` | D2, D4 | 17 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/graph-metadata.json` | D2, D4 | 17 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/review/review-report.md` | D3, D4 | 19 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/graph-metadata.json` | D1 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/prompts/deep-research-prompt.md` | D2, D3 | 18 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/spec.md` | D3 | 18 | 0 P0, 2 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/tasks.md` | D3 | 6 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/checklist.md` | D3 | 6 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/graph-metadata.json` | D1, D3 | 6 | 0 P0, 2 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/review/review-report.md` | D3, D4 | 19 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/tasks.md` | D3, D4 | 19 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/implementation-summary.md` | D1 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/graph-metadata.json` | D1 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/review/deep-review-dashboard.md` | D3, D4 | 19 | 0 P0, 2 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts` | D1, D3 | 14 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | D1, D3 | 13 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts` | D1, D3 | 13 | 0 P0, 1 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

<!-- /ANCHOR:files-under-review -->
<!-- ANCHOR:review-boundaries -->
## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 20
- Convergence threshold: 0.05
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=`2026-04-13T16:59:27Z-010-search-and-routing-tuning-root-review`, parentSessionId=`null`, generation=`1`, lineageMode=`new`
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: `in-progress | converged | release-blocking`
- Per-iteration budget: 11 tool calls, 15 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=`spec_code, checklist_evidence`; overlay=`feature_catalog_code, playbook_capability`
- Started: 2026-04-13T16:59:27Z
<!-- MACHINE-OWNED: END -->

<!-- /ANCHOR:review-boundaries -->
