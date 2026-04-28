# Deep-Review Synthesis Prompt

The 4-dimension iteration loop has converged. You are dispatched to compile the final review-report.md.

## CONVERGENCE STATE

```
Iterations: 4 of 7 (converged early)
Stop reason: converged (composite weighted-stop score >= 0.60; all 4 dimensions covered; ratio decay 0.07 → 0.05 → 0.04 → 0.04; P0=0)
Cumulative findings: P0=0, P1=1, P2=13
Verdict: CONDITIONAL (P1-001 active; advisories present)
Provisional hasAdvisories: true
```

## YOUR TASK

1. **Adversarial self-check** on P1-001:
   - **Hunter**: Re-verify P1-001 finding by re-reading the cited evidence at:
     - `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:25`
     - `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:50`
     - `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:967`
     - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:223`
     - `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1313`
     - `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1335`
     - `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:449`
   - **Skeptic**: Challenge severity. Could P1-001 actually be a P2 (theoretical bypass with no observed exploit) given that constitutional README rows have to ALREADY exist in the DB or be smuggled in via a poisoned checkpoint? Or is it correctly P1 (silent invariant violation at storage boundary)?
   - **Referee**: Final call — confirm P1, downgrade to P2, or mark false_positive.

2. **Read iteration files**:
   - `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/iterations/iteration-001.md`
   - `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/iterations/iteration-002.md`
   - `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/iterations/iteration-003.md`
   - `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/iterations/iteration-004.md`

3. **Compile** `review-report.md` at:
   `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/review-report.md`

   **Required structure (9 core sections + embedded Planning Packet):**

   ### 1. Executive Summary
   - Overall verdict: **CONDITIONAL** (or downgrade-via-self-check)
   - hasAdvisories: true (P2 advisories active)
   - P0=0, P1=1, P2=13 (active counts after dedup + adversarial check)
   - Review scope summary (4 dimensions, 4 iterations, ~92 files reviewed cumulatively)
   - One-paragraph headline finding: the packet is RELEASE-READY conditional on (a) the existing CHK-T15 live MCP rescan blocker AND (b) closing P1-001 (constitutional README storage-boundary gap).

   ### 2. Planning Trigger
   State whether `/spec_kit:plan` is required. Include a fenced `json` block labeled `Planning Packet`:
   ```json
   {
     "triggered": true,
     "verdict": "CONDITIONAL",
     "hasAdvisories": true,
     "activeFindings": {"P0": 0, "P1": 1, "P2": 13},
     "remediationWorkstreams": [
       "constitutional-readme-storage-boundary",
       "checklist-evidence-resolvability",
       "walker-cap-mcp-observability",
       "save-time-error-code-stability",
       "chunking-helper-defense-in-depth",
       "post-merge-identity-drift-cleanup",
       "feature-catalog-and-playbook-refresh",
       "ssot-cleanup-cli-derivation",
       "adr-alternatives-completeness",
       "test-fixture-consolidation"
     ],
     "specSeed": "Add P1-001 storage-boundary invariant as REQ-017 in spec.md; document explicit out-of-scope items (live MCP rescan) more prominently.",
     "planSeed": "Phase 1: P1-001 fix (storage-layer SSOT for indexable-constitutional-memory predicate). Phase 2: P2 cleanup batch (catalog/playbook refresh, identity drift, ADR alternatives). Phase 3: CHK-T15 live rescan."
   }
   ```

   ### 3. Active Finding Registry
   For each of the 14 findings (P1-001 + P2-001 through P2-013), one row with: ID, severity (post-self-check), title, dimension, file:line, evidence excerpt, impact, fix recommendation, disposition (active / downgraded / resolved / false_positive).

   Pull the canonical text from the iteration files. Deduplicate by (file:line, normalized_title). Mark P1-001 with the post-self-check disposition.

   ### 4. Remediation Workstreams
   Ordered groups:
   - **P0**: none (skip section but note it)
   - **P1**: P1-001 storage-boundary fix
   - **P2 (advisories — non-blocking)**: group the 13 P2 findings by theme:
     - Documentation drift: P2-006, P2-007, P2-008, P2-009, P2-011
     - SSOT and policy derivation: P2-010
     - Operator observability: P2-003
     - API contract: P2-004
     - Defense-in-depth: P2-005
     - ADR completeness: P2-012
     - Test infrastructure: P2-013
     - Inventory hygiene: P2-001, P2-002

   ### 5. Spec Seed
   3-5 bullet seed for spec.md updates:
   - REQ-017 candidate text for storage-boundary invariant.
   - Explicit out-of-scope clause for live MCP rescan and how CHK-T15 is closed downstream.
   - Path-rewrite policy for post-merge metadata.
   - Stable error code contract for save-time rejections.

   ### 6. Plan Seed
   Concrete starter tasks for `/spec_kit:plan`:
   - T1: Introduce `isIndexableConstitutionalMemoryPath()` in `lib/utils/index-scope.ts`
   - T2: Wire T1 into checkpoint restore + SQL update + post-insert metadata + cleanup
   - T3: Add regression `tests/checkpoint-restore-readme-poisoning.vitest.ts`
   - T4: Define `E_MEMORY_INDEX_SCOPE_EXCLUDED` error code + thread through `memory-save.ts` rejection path
   - T5: Add `warnings`/`capExceeded` fields to `memory_index_scan` and code-graph scan response shapes
   - T6: Refactor `chunking-orchestrator.ts` fallback through post-insert guard
   - T7: Documentation cleanup batch (P2-006 .. P2-009, P2-011)

   ### 7. Traceability Status
   Aggregate the per-iteration traceabilityChecks:

   **Core Protocols:**
   - `spec_code`: partial (REQ-001..REQ-016 mostly mapped; REQ-017 candidate from P1-001)
   - `checklist_evidence`: fail (62/62 CHK-* lack file:line resolvability per P2-002)

   **Overlay Protocols:**
   - `feature_catalog_code`: partial (entry exists but stale identifiers per P2-007)
   - `playbook_capability`: fail (adversarial scenarios missing per P2-008)
   - `skill_agent`: notApplicable
   - `agent_cross_runtime`: notApplicable

   ### 8. Deferred Items
   Items intentionally out-of-scope for this packet that are tracked elsewhere:
   - **CHK-T15 (Live MCP rescan)**: P0 blocker for FINAL release; tracked at packet level, requires user-initiated MCP restart — not a review finding.
   - **Carryover failures** in `tests/copilot-hook-wiring.vitest.ts` and `tests/stage3-rerank-regression.vitest.ts` per `implementation-summary.md` Known Limitations §3.
   - **`SPEC_DOC_INTEGRITY` warnings** per Known Limitations §4 (pre-existing, not regression).

   ### 9. Audit Appendix
   - **Convergence summary**: 4 iterations; ratio decay 0.07 → 0.05 → 0.04 → 0.04; composite stop score crossed 0.60 at iter-3; legal-stop gates all green at iter-4.
   - **Coverage summary**: D1 correctness (24 files), D2 security (18 files), D3 traceability (38 files), D4 maintainability (32 files); aggregate ~92 file reads (with overlap).
   - **Ruled-out claims**: A2 PE post-filter is sound (iter-1 confirmed both `UPDATE` and `REINFORCE` paths). B2 fromScan does NOT leak across save passes (iter-1 confirmed scan-vs-direct control). Symlink/realpath canonicalization holds (iter-2 confirmed against `tests/symlink-realpath-hardening.vitest.ts`). Cleanup CLI transaction safety + idempotency holds (iter-2). SSOT predicate covers `external`, `z_archive`, `z_future` correctly.
   - **Sources reviewed**: list the 6 spec docs + ~20 runtime files + 11 test files + feature catalog + manual playbook + operator README.
   - **Cross-reference appendix**: split into `Core Protocols` (spec_code, checklist_evidence) and `Overlay Protocols` (feature_catalog_code, playbook_capability, skill_agent, agent_cross_runtime).

## CONSTRAINTS

- Review target is READ-ONLY.
- Cite every finding with exact file:line evidence.
- Adversarial self-check on P1-001 is required and the result MUST be stated explicitly (confirmed / downgraded / false_positive) with rationale.
- Use ACTUAL on-disk paths.

After writing review-report.md, also append a `synthesis_complete` event to `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/deep-review-state.jsonl`:

```json
{"type":"event","event":"synthesis_complete","mode":"review","totalIterations":4,"activeP0":0,"activeP1":<post-self-check>,"activeP2":13,"dimensionCoverage":1.0,"verdict":"<final>","releaseReadinessState":"<final>","stopReason":"converged","timestamp":"<ISO_8601>","sessionId":"2026-04-28T13:57:00.000Z","generation":1}
```

GO.
