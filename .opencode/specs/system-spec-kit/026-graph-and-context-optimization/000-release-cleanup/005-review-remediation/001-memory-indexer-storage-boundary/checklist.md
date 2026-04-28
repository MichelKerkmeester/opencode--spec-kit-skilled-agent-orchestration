---
title: "Verification Checklist: Memory-Indexer Storage-Boundary Remediation"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2"
description: "P0/P1/P2 verification gates for the storage-boundary remediation."
trigger_phrases:
  - "001-memory-indexer-storage-boundary"
  - "validator hygiene"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/001-memory-indexer-storage-boundary"
    last_updated_at: "2026-04-28T19:30:00Z"
    last_updated_by: "codex-gpt-5-hygiene-pass"
    recent_action: "Hygiene pass - validator structure"
    next_safe_action: "Keep validators green"
    completion_pct: 100
---

# Verification Checklist: Memory-Indexer Storage-Boundary Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling |
|----------|----------|
| **P0** | HARD BLOCKER |
| **P1** | Required |
| **P2** | Optional / advisory |

<!-- /ANCHOR:protocol -->
<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] **CHK-001** [P0] Source review report read end-to-end. [EVIDENCE: specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/review-report.md:46]
- [x] **CHK-002** [P0] All 14 source findings accounted for in REQ-001..REQ-015. [EVIDENCE: specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/001-memory-indexer-storage-boundary/spec.md:73]
- [x] **CHK-003** [P1] Existing focused 005 test suite reproduced green before changes. [EVIDENCE: `npx vitest run tests/index-scope.vitest.ts tests/checkpoint-restore-invariant-enforcement.vitest.ts tests/memory-save-index-scope.vitest.ts tests/memory-crud-update-constitutional-guard.vitest.ts tests/symlink-realpath-hardening.vitest.ts tests/cleanup-script-audit-emission.vitest.ts tests/walker-dos-caps.vitest.ts tests/chunking-orchestrator.vitest.ts` exit 0]

<!-- /ANCHOR:pre-impl -->
<!-- ANCHOR:code-quality -->
## Code Quality

- [x] **CHK-T01** [P0] `isIndexableConstitutionalMemoryPath()` exists and exports correctly. [EVIDENCE: .opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:54]
- [x] **CHK-T02** [P0] All storage-layer call sites consume the SSOT predicate. [EVIDENCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1335; .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:450; .opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:104; .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:333]
- [x] **CHK-T03** [P0] `tests/checkpoint-restore-readme-poisoning.vitest.ts` exits 0 with expected `governance_audit` row. [EVIDENCE: .opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-restore-readme-poisoning.vitest.ts:125; `npx vitest run tests/checkpoint-restore-readme-poisoning.vitest.ts` exit 0 after T4]
- [x] **CHK-T04** [P0] No regression in focused storage-boundary tests. [EVIDENCE: `npx vitest run tests/index-scope.vitest.ts tests/checkpoint-restore-invariant-enforcement.vitest.ts tests/checkpoint-restore-readme-poisoning.vitest.ts tests/memory-save-index-scope.vitest.ts tests/memory-crud-update-constitutional-guard.vitest.ts tests/symlink-realpath-hardening.vitest.ts tests/cleanup-script-audit-emission.vitest.ts tests/walker-dos-caps.vitest.ts tests/chunking-orchestrator.vitest.ts` exit 0]

<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
## Testing

- [x] **CHK-T05** [P1] `E_MEMORY_INDEX_SCOPE_EXCLUDED` error code returned with canonicalPath. [EVIDENCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:173; .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-index-scope.vitest.ts:346]
- [x] **CHK-T06** [P1] `warnings` + `capExceeded` fields appear in scan responses when caps trigger. [EVIDENCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:374; .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:47; .opencode/skill/system-spec-kit/mcp_server/tests/walker-dos-caps.vitest.ts:64]
- [x] **CHK-T07** [P1] Chunking fallback no longer writes `importance_tier` outside SSOT. [EVIDENCE: .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:102; .opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:264]
- [x] **CHK-T08** [P1] 005 root docs use current packet ID; aliases preserved only explicitly. [EVIDENCE: specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/spec.md:194]
- [x] **CHK-T09** [P2] Checked 005 checklist evidence and current-ID references. [EVIDENCE: specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/checklist.md:74]
- [x] **CHK-T10** [P2] ADR-008..ADR-012 carry alternatives + rationale. [EVIDENCE: specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/decision-record.md:317]
- [x] **CHK-T11** [P2] Feature catalog + manual playbook updated. [EVIDENCE: .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/25-indexing-runtime-bootstrap-api.md:25; .opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md:38]
- [x] **CHK-T12** [P2] Runtime trace comments updated for memory-indexer ADR references. [EVIDENCE: .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:372; .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:452]
- [x] **CHK-T13** [P2] Cleanup CLI derives excluded paths from SSOT. [EVIDENCE: .opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:111]
- [x] **CHK-T14** [P2] Operator README has Repair / Verify / Rollback subsection. [EVIDENCE: .opencode/skill/system-spec-kit/mcp_server/README.md:121]
- [x] **CHK-T15** [P2] Strategy artifact map paths corrected. [EVIDENCE: specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/deep-review-strategy.md:156]
- [x] **CHK-T16** [P2] Shared `tests/fixtures/memory-index-db.ts` extracted; 3 test files migrated. [EVIDENCE: .opencode/skill/system-spec-kit/mcp_server/tests/fixtures/memory-index-db.ts:10; .opencode/skill/system-spec-kit/mcp_server/tests/cleanup-script-audit-emission.vitest.ts:8]

<!-- /ANCHOR:testing -->
<!-- ANCHOR:security -->
## Security

- [x] **CHK-S01** [P0] Constitutional README cannot be preserved as constitutional tier by checkpoint, update, save, or post-insert paths. [EVIDENCE: .opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-restore-readme-poisoning.vitest.ts:125]
- [x] **CHK-S02** [P1] Save-time excluded-path rejection has a stable error code. [EVIDENCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-index-scope.vitest.ts:346]

<!-- /ANCHOR:security -->
<!-- ANCHOR:docs -->
## Documentation

- [x] **CHK-D01** [P1] Source review dispositions remain recorded. [EVIDENCE: specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/001-memory-indexer-storage-boundary/implementation-summary.md:120]
- [x] **CHK-D02** [P1] Root packet docs, ADR references, feature catalog, manual playbook, and operator README evidence remain cited. [EVIDENCE: specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/001-memory-indexer-storage-boundary/tasks.md:45]

<!-- /ANCHOR:docs -->
<!-- ANCHOR:file-org -->
## File Organization

- [x] **CHK-F01** [P1] Shared fixture extraction location remains under the memory-indexer test tree. [EVIDENCE: .opencode/skill/system-spec-kit/mcp_server/tests/fixtures/memory-index-db.ts:10]
- [x] **CHK-F02** [P1] No runtime-code edits are part of this strict-validator closure pass. [EVIDENCE: temporary hygiene summary records packet-level doc-only validation status]

<!-- /ANCHOR:file-org -->
<!-- ANCHOR:summary -->
## Verification Summary

- [x] **CHK-V01** [P0] Strict packet validator exits 0 for this remediation sub-phase after the closure pass. [EVIDENCE: temporary hygiene summary records the final strict-validator command and exit code]
- [x] **CHK-V02** [P0] Source review report walked through; each finding marked closed or blocked with disposition. [EVIDENCE: specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/001-memory-indexer-storage-boundary/implementation-summary.md:120]
- [x] **CHK-V03** [P1] `npm run typecheck` and `npm run build` both exit 0. [EVIDENCE: `npm run typecheck` in mcp_server exit 0; `npm run build` in system-spec-kit exit 0]
- [x] **CHK-V04** [P1] Full focused vitest suite green. [EVIDENCE: `npx vitest run tests/index-scope.vitest.ts tests/checkpoint-restore-invariant-enforcement.vitest.ts tests/checkpoint-restore-readme-poisoning.vitest.ts tests/memory-save-index-scope.vitest.ts tests/memory-crud-update-constitutional-guard.vitest.ts tests/symlink-realpath-hardening.vitest.ts tests/cleanup-script-audit-emission.vitest.ts tests/walker-dos-caps.vitest.ts tests/chunking-orchestrator.vitest.ts` exit 0]

<!-- /ANCHOR:summary -->
