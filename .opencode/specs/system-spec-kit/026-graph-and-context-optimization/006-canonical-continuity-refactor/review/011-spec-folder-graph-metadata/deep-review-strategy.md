---
title: "Deep Review Strategy - 011-spec-folder-graph-metadata"
description: "Session tracking for Batch 3/5 review of 011-spec-folder-graph-metadata."
---

# Deep Review Strategy - 011-spec-folder-graph-metadata

## 1. OVERVIEW

Batch review packet for `011-spec-folder-graph-metadata`.

## 2. TOPIC

Verify that the graph-metadata schema, parser, and backfill flow are correct, and that the derived packet metadata stays useful for downstream retrieval and traceability.

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness - Schema, parser, and backfill behavior
- [x] D2 Security - No unsafe or cross-packet leakage in derived metadata
- [x] D3 Traceability - On-disk output reflects the intended packet graph contract
- [x] D4 Maintainability - Derived file/entity hints remain clean and usable
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- No parser/schema changes.
- No packet-doc-only findings unless they demonstrate a real derived-output issue.

## 5. STOP CONDITIONS

- Stop at 2 iterations max for this batch allocation.
- Stop early only if both passes add no new findings.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | PASS with advisories | 1-2 | Schema, refresh, and backfill flows work, but key-file derivation is overly permissive about basename-only references. |
| D3 Traceability | PASS with advisories | 1 | Parser output can contain both fully qualified paths and bare basenames for the same artifact. |
| D2 Security | PASS | 2 | No unsafe relationship merge or cross-packet leakage was found in the reviewed code paths. |
| D4 Maintainability | PASS with advisories | 2 | Ambiguous basename-only `key_files` entries make the derived metadata noisier for downstream consumers. |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 1 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED

- Iteration 1: Reading the parser beside a real `graph-metadata.json` output made the basename-duplication issue visible immediately.
- Iteration 2: Rechecking the schema and backfill paths confirmed the issue is quality-of-output noise rather than a contract-breaking correctness failure.

## 9. WHAT FAILED

- No failed review approaches in this packet.

## 10. EXHAUSTED APPROACHES (do not retry)

- None.

## 11. RULED OUT DIRECTIONS

- The schema version, manual/derived split, and backfill traversal logic all align with the intended packet-graph contract.
- No unsafe manual-field overwrite or cross-packet relationship corruption was found in the reviewed code paths.

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Complete after 2 iterations. The only active follow-up is to normalize or filter basename-only file references before they enter `key_files` and derived entities.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

- Packet `011` made `graph-metadata.json` a root-level packet artifact refreshed on canonical save and indexed by the memory server.
- The current review is focused on derived-output quality rather than whether the feature exists at all.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1-2 | The feature works, but derived key-file/entity output is noisier than the ideal packet contract suggests. |
| `checklist_evidence` | core | partial | 2 | Packet closure is broadly correct, yet downstream metadata quality still has one advisory gap. |
| `feature_catalog_code` | overlay | notApplicable | 0 | Feature-catalog surfaces were not in the requested scope. |
| `playbook_capability` | overlay | notApplicable | 0 | Manual-playbook surfaces were not in the requested scope. |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | [D1, D2, D3] | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | [D1, D2, D3, D4] | 2 | 0 P0, 0 P1, 1 P2 | complete |
| `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` | [D1, D3, D4] | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/011-spec-folder-graph-metadata/graph-metadata.json` | [D3, D4] | 1 | 0 P0, 0 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 2
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-04-12T17:20:00Z-011-spec-folder-graph-metadata, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 15 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=`spec_code`,`checklist_evidence`; overlay=`feature_catalog_code`,`playbook_capability`
- Started: 2026-04-12T17:20:00Z
<!-- MACHINE-OWNED: END -->
