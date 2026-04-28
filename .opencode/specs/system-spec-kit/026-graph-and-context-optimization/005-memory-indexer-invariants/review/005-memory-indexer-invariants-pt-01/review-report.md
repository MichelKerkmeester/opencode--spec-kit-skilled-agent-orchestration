# Review Report — 005 Memory Indexer Invariants

## 1. Executive Summary

Overall verdict: **CONDITIONAL**. `hasAdvisories: true`. Active finding counts after deduplication and adversarial self-check: `P0=0`, `P1=1`, `P2=13`.

The four-dimension review loop converged after 4 of 7 allowed iterations. Coverage included D1 correctness, D2 security, D3 traceability, and D4 maintainability, with about 92 cumulative file reads after overlap across runtime, tests, packet docs, catalog, playbook, and operator documentation.

Headline finding: the packet is release-ready conditional on two required closures: (a) the existing CHK-T15 live MCP rescan blocker, which remains a packet-level final-release gate requiring a restarted MCP runtime, and (b) P1-001, the constitutional README storage-boundary gap. The runtime scanner/parser entry points reject constitutional `README.md`, but storage restore/update paths can preserve already-materialized README rows as `importance_tier='constitutional'`.

Adversarial self-check on P1-001: **confirmed**. Hunter re-read every cited source line and confirmed the parser/discovery boundary excludes README while checkpoint restore and SQL update guards rely on `shouldIndexForMemory()` plus the broader `isConstitutionalPath()` predicate. Skeptic is right that normal ingestion does not create the row; it must already exist in the DB or arrive through checkpoint replay. Referee still keeps this at P1 because the storage layer is explicitly in scope for this packet and silently violates the invariant at a mutation boundary.

## 2. Planning Trigger

`/spec_kit:plan` is required. The verdict is CONDITIONAL because one active P1 remains, and P2 advisories should be batched into non-blocking cleanup workstreams.

Planning Packet:

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

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Evidence excerpt | Impact | Fix recommendation | Disposition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P1-001 | P1 | Constitutional README can survive storage-layer restore/update as constitutional | D1 Correctness | `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1335` | `r.importance_tier === 'constitutional' && !isConstitutionalPath(...)` | Poisoned checkpoint or existing DB row can preserve constitutional README despite parser/discovery exclusion. | Add `isIndexableConstitutionalMemoryPath()` and use it in parser, discovery, checkpoint restore, SQL update guards, post-insert metadata, cleanup, and save-time validation. | active; confirmed by self-check |
| P2-001 | P2 | Review strategy artifact map has stale runtime paths | D1 Correctness / Inventory | `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/deep-review-strategy.md:156` | ``mcp_server/code-graph/lib/structural-indexer.ts`` | Strategy replay points reviewers at non-existent `code-graph` paths instead of live `code_graph` paths. | Update strategy artifact paths to live runtime locations, including `mcp_server/code_graph/...` and `lib/parsing/memory-parser.ts`. | active |
| P2-002 | P2 | Checklist evidence is not resolvable as file:line citations | D1 Correctness / Inventory | `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/checklist.md:63` | `EVIDENCE: handlers/save/pe-orchestration.ts` | Replay tooling cannot validate 62 checklist claims without manual interpretation. | Add concrete `path:line` evidence per checked `CHK-*`, or add a machine-readable evidence map. | active |
| P2-003 | P2 | Walker DoS caps warn only through logs, not tool results | D2 Security | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:158` | `return results;` | Cap-hit partial discovery can look like a normal successful scan unless the operator sees stderr. | Return structured `warnings` and `capExceeded` metadata from memory and code-graph walkers and surface it in scan responses. | active |
| P2-004 | P2 | Save-time excluded-path rejection lacks a stable error code | D2 Security | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2715` | `throw new Error(...)` | Clients cannot distinguish index-scope rejection from a generic handler failure. | Emit a stable code such as `E_MEMORY_INDEX_SCOPE_EXCLUDED` with rejected canonical path details. | active |
| P2-005 | P2 | Exported chunking helper has an unguarded fallback tier write | D2 Security | `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:118` | `UPDATE memory_index SET ${setClause}` | Direct internal imports can bypass the guarded post-insert metadata helper. | Route fallback and safe-swap parent updates through the same post-insert guard or local SSOT predicate. | active |
| P2-006 | P2 | Root packet docs still carry post-merge identity drift outside the strategy artifact | D3 Traceability | `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/spec.md:193` | `reference 010-memory-indexer-invariants` | Canonical docs contradict current parent metadata and current packet identity. | Rewrite root packet docs from `010-memory-indexer-invariants` to `005-memory-indexer-invariants`, preserving aliases only where explicit. | active |
| P2-007 | P2 | Feature catalog entry points at stale packet and ADR identifiers | D3 Traceability | `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/25-indexing-runtime-bootstrap-api.md:25` | `Packet 026/010/002` and `ADR-005` | Catalog readers cannot reliably trace capability claims to the current packet and ADR. | Patch the catalog entry to current packet path, ADR-006, cleanup action strings, and governance helper surface. | active |
| P2-008 | P2 | Manual playbook misses first-class adversarial scenarios | D3 Traceability | `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md:17` | `one broad context-save/index-update scenario` | Manual QA under-specifies cleanup apply, rollback, restore validation, walker DoS, and promotion bypass checks. | Add dedicated scenarios or explicit steps for the missing adversarial paths with evidence capture. | active |
| P2-009 | P2 | Runtime trace comments point ADR readers at the wrong packet | D3 Traceability | `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:452` | `See ADR-006 in packet 026/011.` | Code breadcrumbs map to the right decision shape but wrong packet ID after merge. | Update runtime comments to current packet ID and ADR numbers. | active |
| P2-010 | P2 | Cleanup CLI duplicates excluded-path policy instead of deriving from SSOT | D4 Maintainability | `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:111` | `zFutureRows: countQuery(...)` | Future excluded segments can be added to runtime helpers while cleanup verify/apply keeps old SQL patterns. | Export a data-level segment list or SQL predicate builder from the same policy module and consume it in cleanup summary/plan code. | active |
| P2-011 | P2 | Operator README omits cleanup and rollback flow at invariant entry point | D4 Maintainability | `.opencode/skill/system-spec-kit/mcp_server/README.md:113` | `### Index Scope Invariants` | Operators get the invariant but not the colocated repair, verify, backup, or rollback path. | Add a short "Repair / Verify / Rollback" subsection under the invariant section. | active |
| P2-012 | P2 | ADR-008 through ADR-012 omit alternatives | D4 Maintainability | `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/decision-record.md:297` | `## ADR-008...` | Future maintainers may re-litigate late-stage choices without rejected alternatives and rationale. | Add one alternatives table per ADR-008 through ADR-012 with strongest rejected option and rationale. | active |
| P2-013 | P2 | Invariant tests duplicate partial `memory_index` schemas | D4 Maintainability | `.opencode/skill/system-spec-kit/mcp_server/tests/cleanup-script-audit-emission.vitest.ts:12` | `function createTestDatabase()` | Schema changes require updating several ad hoc partial fixtures, increasing drift risk. | Add a shared `tests/fixtures/memory-index-db.ts` schema builder with composable options. | active |

## 4. Remediation Workstreams

P0: none. No active blocker-class review findings were found.

P1: close P1-001 before promoting the packet beyond CONDITIONAL. The fix should make the constitutional README predicate a storage-layer SSOT, not only a parser/discovery convention.

P2 advisories are non-blocking and should be grouped by theme:

- Documentation drift: P2-006, P2-007, P2-008, P2-009, P2-011.
- SSOT and policy derivation: P2-010.
- Operator observability: P2-003.
- API contract: P2-004.
- Defense-in-depth: P2-005.
- ADR completeness: P2-012.
- Test infrastructure: P2-013.
- Inventory hygiene: P2-001, P2-002.

## 5. Spec Seed

- Add REQ-017: "Storage-layer memory mutation surfaces MUST reject or downgrade constitutional README rows with the same rule-file-only predicate used by parser and discovery. A path under `/constitutional/README.md` MUST NOT persist as `importance_tier='constitutional'` through checkpoint restore, SQL update, post-insert metadata, cleanup, or save-time validation."
- Add an explicit out-of-scope clause for the live MCP rescan: CHK-T15 requires a restarted MCP process and embedding-capable `memory_index_scan`; it is a final release gate, not a review finding.
- Add a post-merge metadata path-rewrite policy: packet docs, parent metadata, feature catalog, and runtime breadcrumbs must use current canonical packet IDs, with legacy IDs documented only as aliases.
- Add a stable error-code contract for save-time path rejection: excluded memory paths should return `E_MEMORY_INDEX_SCOPE_EXCLUDED` with canonical path details.

## 6. Plan Seed

- T1: Introduce `isIndexableConstitutionalMemoryPath()` in `lib/utils/index-scope.ts`.
- T2: Wire T1 into checkpoint restore, SQL update, post-insert metadata, save-time validation, cleanup, parser, and discovery.
- T3: Add regression `tests/checkpoint-restore-readme-poisoning.vitest.ts`.
- T4: Define `E_MEMORY_INDEX_SCOPE_EXCLUDED` and thread it through the `memory-save.ts` rejection path.
- T5: Add `warnings` / `capExceeded` fields to `memory_index_scan` and code-graph scan response shapes.
- T6: Refactor `chunking-orchestrator.ts` fallback through the post-insert guard.
- T7: Run the documentation cleanup batch for P2-006 through P2-009 and P2-011.

## 7. Traceability Status

Core Protocols:

- `spec_code`: partial. REQ-001 through REQ-016 mostly map to implementation, but P1-001 implies a REQ-017 storage-boundary invariant and REQ-014 carries identity drift.
- `checklist_evidence`: fail. The iterations found 62 `CHK-*` items without fully replayable file:line evidence; one quantified pass cited only a single concrete file:line.

Overlay Protocols:

- `feature_catalog_code`: partial. Entry exists, but packet and ADR identifiers are stale.
- `playbook_capability`: fail. Broad scenario exists, but first-class adversarial scenarios are missing.
- `skill_agent`: notApplicable.
- `agent_cross_runtime`: notApplicable.

## 8. Deferred Items

- CHK-T15 (Live MCP rescan): P0 blocker for FINAL release; tracked at packet level, requires user-initiated MCP restart, and is not a review finding.
- Carryover failures in `tests/copilot-hook-wiring.vitest.ts` and `tests/stage3-rerank-regression.vitest.ts`, per `implementation-summary.md` Known Limitations section 3.
- `SPEC_DOC_INTEGRITY` warnings, per Known Limitations section 4. These are pre-existing and not a regression from this packet.

## 9. Audit Appendix

Convergence summary: 4 iterations; ratio decay `0.07 -> 0.05 -> 0.04 -> 0.04`; composite stop score crossed `0.60` at iteration 3; legal-stop gates were green at iteration 4.

Coverage summary: D1 correctness reviewed 24 files, D2 security reviewed 18 files, D3 traceability reviewed 38 files, and D4 maintainability reviewed 32 files. Aggregate review volume was about 92 file reads with overlap.

Ruled-out claims:

- A2 PE post-filter is sound: iteration 1 confirmed both `UPDATE` and `REINFORCE` paths downgrade unsafe cross-file candidates to `CREATE`.
- B2 `fromScan` does not leak across save passes: iteration 1 confirmed scan-vs-direct control.
- Symlink/realpath canonicalization holds: iteration 2 confirmed behavior against `tests/symlink-realpath-hardening.vitest.ts`.
- Cleanup CLI transaction safety and idempotency hold: iteration 2 confirmed plan rebuild inside transaction and clean second-run behavior.
- SSOT predicate covers `external`, `z_archive`, and `z_future` correctly; P1-001 is specifically about constitutional README handling at storage boundaries.

Sources reviewed:

- Spec docs: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`.
- Runtime files: `handlers/save/pe-orchestration.ts`, `handlers/pe-gating.ts`, `handlers/save/types.ts`, `handlers/memory-index.ts`, `handlers/memory-save.ts`, `handlers/memory-index-discovery.ts`, `handlers/memory-crud-update.ts`, `handlers/chunking-orchestrator.ts`, `lib/utils/index-scope.ts`, `lib/utils/canonical-path.ts`, `lib/config/spec-doc-paths.ts`, `lib/parsing/memory-parser.ts`, `lib/search/vector-index-mutations.ts`, `lib/search/auto-promotion.ts`, `lib/storage/post-insert-metadata.ts`, `lib/storage/checkpoints.ts`, `lib/governance/scope-governance.ts`, `code_graph/lib/structural-indexer.ts`, `code_graph/lib/indexer-types.ts`, `scripts/memory/cleanup-index-scope-violations.ts`.
- Test files: `pe-orchestration.vitest.ts`, `handler-memory-index.vitest.ts`, `index-scope.vitest.ts`, `memory-save-index-scope.vitest.ts`, `memory-crud-update-constitutional-guard.vitest.ts`, `checkpoint-restore-invariant-enforcement.vitest.ts`, `cleanup-script-audit-emission.vitest.ts`, `exclusion-ssot-unification.vitest.ts`, `symlink-realpath-hardening.vitest.ts`, `walker-dos-caps.vitest.ts`, `memory-governance.vitest.ts`, plus the README-regression set named in iteration 4.
- Documentation overlays: feature catalog entry `13--memory-quality-and-indexing/25-indexing-runtime-bootstrap-api.md`, manual testing playbook entry `13--memory-quality-and-indexing/003-context-save-index-update.md`, root manual playbook, MCP operator README, scripts README, and utility README.

Cross-reference appendix:

Core Protocols:

- `spec_code`: partial, due to REQ-017 candidate and REQ-014 identity drift.
- `checklist_evidence`: fail, due to non-resolvable checklist evidence.

Overlay Protocols:

- `feature_catalog_code`: partial, due to stale identifiers.
- `playbook_capability`: fail, due to missing adversarial scenarios.
- `skill_agent`: notApplicable.
- `agent_cross_runtime`: notApplicable.
