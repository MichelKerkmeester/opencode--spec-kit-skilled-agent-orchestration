---
title: "Feature Specification: Memory-Indexer Storage-Boundary Remediation"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Close the P1 constitutional README storage-boundary gap and 13 P2 advisories surfaced by the 005-memory-indexer-invariants deep review. Adds an SSOT predicate isIndexableConstitutionalMemoryPath() and wires it into every storage-layer mutation surface."
trigger_phrases:
  - "001-memory-indexer-storage-boundary"
  - "constitutional readme storage gap"
  - "P1-001 advisor remediation"
  - "isIndexableConstitutionalMemoryPath"
  - "memory indexer review remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/001-memory-indexer-storage-boundary"
    last_updated_at: "2026-04-28T19:30:00Z"
    last_updated_by: "codex-gpt-5-hygiene-pass"
    recent_action: "Hygiene pass - validator structure"
    next_safe_action: "Keep validators green"
    blockers:
      - "T25 strict validator exits 2 for remediation packet template structure"
    completion_pct: 95
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Memory-Indexer Storage-Boundary Remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implementation complete, validation blocked |
| **Created** | 2026-04-28 |
| **Branch** | `main` |
| **Parent** | `005-review-remediation` |
| **Source review** | 026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/review-report.md |
| **Source verdict** | CONDITIONAL (P0=0, P1=1, P2=13) |

---

<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 005-memory-indexer-invariants deep review surfaced one release-blocker correctness gap (P1-001) and 13 advisory cleanup items (P2-001..P2-013). The P1 specifically: parser/discovery correctly exclude constitutional/README.md, but storage-layer mutation paths (checkpoint restore, SQL update, post-insert metadata, cleanup CLI) only check the broader `isConstitutionalPath()` predicate. A poisoned checkpoint or pre-existing DB row can therefore preserve a constitutional README as `importance_tier='constitutional'` even though normal ingestion would reject it. Hunter→Skeptic→Referee adversarial self-check confirmed P1 severity.

### Purpose
Promote the README distinction into a shared SSOT predicate and wire it into every storage-layer mutation surface, plus close the 13 doc/observability/maintainability advisories so the packet can move from CONDITIONAL to PASS.

---

<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New predicate `isIndexableConstitutionalMemoryPath()` in `mcp_server/lib/utils/index-scope.ts`.
- Wire-up to: parser, discovery, checkpoint restore, SQL update, post-insert metadata, cleanup CLI, save-time validation.
- Regression test `tests/checkpoint-restore-readme-poisoning.vitest.ts`.
- Stable error code `E_MEMORY_INDEX_SCOPE_EXCLUDED` in save-time rejection path (P2-004).
- `warnings` / `capExceeded` fields on memory_index_scan + code-graph scan responses (P2-003).
- Chunking helper fallback routed through post-insert guard (P2-005).
- Documentation cleanup batch (P2-001, P2-002, P2-006, P2-007, P2-008, P2-009, P2-011) — updates to checklist evidence, strategy paths, root packet docs, feature catalog, manual playbook, runtime trace comments, operator README.
- ADR-008..ADR-012 alternatives back-fill (P2-012).
- Test fixture consolidation `tests/fixtures/memory-index-db.ts` (P2-013).
- Cleanup CLI policy derivation from SSOT (P2-010).

### Out of Scope
- CHK-T15 live MCP rescan (operator-controlled gate, not a code fix).
- Re-running 005 deep-review (the source of these findings is final).
- Changes to non-memory-indexer code.

### Files to Change

| File | Change Type | Description |
|------|-------------|-------------|
| `mcp_server/lib/utils/index-scope.ts` | Modify | Add `isIndexableConstitutionalMemoryPath()` SSOT predicate. |
| `mcp_server/lib/storage/checkpoints.ts` | Modify | Use new predicate at line ~1335 (current downgrade gate). |
| `mcp_server/lib/search/vector-index-mutations.ts` | Modify | Use new predicate at line ~449. |
| `mcp_server/lib/storage/post-insert-metadata.ts` | Modify | Use new predicate before tier preservation. |
| `mcp_server/handlers/memory-save.ts` | Modify | Use new predicate; emit `E_MEMORY_INDEX_SCOPE_EXCLUDED` on rejection. |
| `mcp_server/handlers/memory-index-discovery.ts` | Modify | Switch to new predicate (was ad-hoc README exclusion at line ~223). |
| `mcp_server/lib/parsing/memory-parser.ts` | Modify | Switch to new predicate (was ad-hoc check at line ~967). |
| `mcp_server/handlers/chunking-orchestrator.ts` | Modify | Route fallback + safe-swap through post-insert guard. |
| `mcp_server/handlers/memory-index-discovery.ts` + `mcp_server/code_graph/lib/structural-indexer.ts` | Modify | Add structured `warnings` / `capExceeded` fields to scan responses. |
| `mcp_server/handlers/memory-index.ts` | Modify | Surface walker warnings in `memory_index_scan` response. |
| `scripts/memory/cleanup-index-scope-violations.ts` | Modify | Derive excluded-path policy from SSOT instead of inline SQL. |
| `mcp_server/tests/checkpoint-restore-readme-poisoning.vitest.ts` | Create | Regression test for poisoned checkpoint replay. |
| `mcp_server/tests/fixtures/memory-index-db.ts` | Create | Shared DB-shape fixture. |
| `mcp_server/tests/*.vitest.ts` (selected) | Modify | Migrate to shared fixture (P2-013). |
| mcp_server/README.md | Modify | Add Repair / Verify / Rollback subsection (P2-011). |
| 005-memory-indexer-invariants/spec.md | Modify | Add REQ-017 storage-boundary invariant; refresh post-merge identity drift (P2-006). |
| 005-memory-indexer-invariants/checklist.md | Modify | Add `file:line` evidence to existing CHK items (P2-002). |
| 005-memory-indexer-invariants/decision-record.md | Modify | Back-fill alternatives for ADR-008..ADR-012 (P2-012). |
| .opencode/skill/sk-doc/feature_catalog/13--memory-quality-and-indexing/25-indexing-runtime-bootstrap-api.md | Modify | Update packet ID + ADR refs (P2-007). |
| .opencode/skill/sk-doc/manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md | Modify | Add adversarial scenarios (P2-008). |
| Strategy file 005/.../deep-review-strategy.md | Modify | Fix `code-graph` → `code_graph` and `handlers/memory-parser.ts` → `lib/parsing/memory-parser.ts` (P2-001). |

---

<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (none)

### P1 — Required

| ID | Requirement | Acceptance Criteria | Source finding |
|----|-------------|---------------------|----------------|
| REQ-001 | Storage-layer SSOT for constitutional README. | `isIndexableConstitutionalMemoryPath()` exists in `lib/utils/index-scope.ts` and is consumed by checkpoint restore, SQL update, post-insert metadata, cleanup, parser, discovery, save-time validation. | P1-001 |
| REQ-002 | Regression test for poisoned checkpoint. | `tests/checkpoint-restore-readme-poisoning.vitest.ts` exits 0; fixture replays a checkpoint containing constitutional/README.md and confirms it is downgraded to `important`. | P1-001 |

### P2 — Required (advisories from review)

| ID | Requirement | Source |
|----|-------------|--------|
| REQ-003 | Strategy artifact map paths corrected. | P2-001 |
| REQ-004 | Checklist `file:line` evidence added to existing CHK items. | P2-002 |
| REQ-005 | Walker DoS warnings surfaced via structured response fields. | P2-003 |
| REQ-006 | Save-time rejection emits stable error code `E_MEMORY_INDEX_SCOPE_EXCLUDED`. | P2-004 |
| REQ-007 | Chunking helper fallback routed through post-insert guard. | P2-005 |
| REQ-008 | Root packet docs refreshed for post-merge identity. | P2-006 |
| REQ-009 | Feature catalog entry refreshed (packet + ADR identifiers). | P2-007 |
| REQ-010 | Manual playbook adds adversarial scenarios. | P2-008 |
| REQ-011 | Runtime trace comments updated to current packet IDs. | P2-009 |
| REQ-012 | Cleanup CLI derives excluded paths from SSOT. | P2-010 |
| REQ-013 | Operator README adds Repair / Verify / Rollback subsection. | P2-011 |
| REQ-014 | ADR-008..ADR-012 back-fill alternatives. | P2-012 |
| REQ-015 | Shared `tests/fixtures/memory-index-db.ts` schema builder. | P2-013 |

---

<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 14 source findings closed or explicitly deferred with sign-off.
- **SC-002**: Storage-boundary regression test passes (`tests/checkpoint-restore-readme-poisoning.vitest.ts` exit 0).
- **SC-003**: Existing 005 test suite still green (no regression).
- **SC-004**: Strict packet validation passes for `005-memory-indexer-invariants` AND for this remediation sub-phase.
- **SC-005**: Source review-report can be re-evaluated against this remediation and yield verdict PASS (verbal walk-through, not a re-run of the loop).

### Acceptance Scenarios

1. **Given** a poisoned checkpoint row for constitutional README, when restore runs, then the row is downgraded from `constitutional` to `important`.
2. **Given** a direct `memory_save` attempt for an excluded constitutional README path, when validation runs, then the response includes `E_MEMORY_INDEX_SCOPE_EXCLUDED`.
3. **Given** walker caps are reached during a scan, when `memory_index_scan` or code-graph scan reports results, then `warnings` and `capExceeded` describe the cap condition.
4. **Given** the remediation packet is validated, when strict validation runs, then template structure and evidence remain resolvable.

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | New SSOT predicate has different edge-case behavior than the existing inline checks | High | Cross-test against existing `tests/index-scope.vitest.ts` and `tests/symlink-realpath-hardening.vitest.ts`. |
| Risk | Doc cleanup batch overlaps with running deep-review of other packets | Medium | Touch only files explicitly in scope; do not refactor. |
| Dependency | None blocking — both 005 deep-review and synthesis are complete. | — | — |

---

<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. Related documents for audit replay:

- **Source review report**: `../../../005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/review-report.md`
- **Source planning packet** (embedded in review report §2): drives `remediationWorkstreams`, `specSeed`, `planSeed`.
- **Implementation plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`

<!-- /ANCHOR:questions -->
