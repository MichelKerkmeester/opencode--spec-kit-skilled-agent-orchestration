---
title: "Implementation Plan: Memory-Indexer Storage-Boundary Remediation"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Three-phase plan: (1) SSOT predicate + storage-layer wire-up + regression, (2) advisory P2 batch (errors/walker warnings/chunking), (3) docs/ADR/test-fixture cleanup."
trigger_phrases:
  - "001-memory-indexer-storage-boundary"
  - "validator hygiene"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/001-memory-indexer-storage-boundary"
    last_updated_at: "2026-04-28T19:30:00Z"
    last_updated_by: "codex-gpt-5-hygiene-pass"
    recent_action: "Hygiene pass - validator structure"
    next_safe_action: "Keep validators green"
    completion_pct: 100
---

# Implementation Plan: Memory-Indexer Storage-Boundary Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

The 005-memory-indexer-invariants packet shipped with a single P1 release-blocker: parser/discovery exclude constitutional/README.md but storage-layer mutation surfaces (checkpoint restore, SQL update, post-insert metadata, cleanup CLI) only consult the broader `isConstitutionalPath()`. A row that ALREADY exists in the DB or arrives via a poisoned checkpoint can survive as constitutional. Adversarial self-check (Hunter→Skeptic→Referee) on iter-4 confirmed P1.

This plan sequences the fix into three phases: a P1 storage-boundary fix that must land cleanly, a P2 advisory batch covering API contract and observability, and a docs/test-infrastructure cleanup batch.

<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Source review report read and source findings mapped to REQ-001..REQ-015.
- [x] Remediation packet scoped to memory-indexer storage-boundary findings.

### Definition of Done
- [x] Runtime remediation tests, typecheck, and build evidence recorded.
- [x] Strict validator for this remediation packet exits 0 after this closure pass.

<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared predicate plus call-site replacement. The storage boundary is centralized in `isIndexableConstitutionalMemoryPath()` so parser, discovery, checkpoint restore, SQL update, post-insert metadata, cleanup, and save-time validation use the same rule-file-only definition.

### Key Components
- **Index scope helper**: Owns constitutional README exclusion semantics.
- **Storage mutation surfaces**: Consume the helper instead of broader constitutional-path checks.
- **Regression suite**: Proves poisoned checkpoint replay cannot preserve README constitutional tier.

<!-- /ANCHOR:architecture -->
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

**Goal**: Add `isIndexableConstitutionalMemoryPath()` and wire it into every mutation surface; add regression test.

1. Author predicate in `mcp_server/lib/utils/index-scope.ts`:
   - Returns `false` for constitutional/README.md (case-insensitive basename) under any `/constitutional/` prefix.
   - Returns the same boolean as `isConstitutionalPath()` otherwise.
2. Update consumers in this order (each is a single-call swap):
   - `mcp_server/lib/parsing/memory-parser.ts` (replace ad-hoc README check at ~line 967).
   - `mcp_server/handlers/memory-index-discovery.ts` (replace inline README exclusion at ~line 223).
   - `mcp_server/lib/storage/checkpoints.ts` (line ~1335 downgrade gate).
   - `mcp_server/lib/search/vector-index-mutations.ts` (line ~449).
   - `mcp_server/lib/storage/post-insert-metadata.ts` (tier preservation).
   - `mcp_server/handlers/memory-save.ts` (save-time validation).
   - `scripts/memory/cleanup-index-scope-violations.ts` (replace inline SQL with helper-derived predicate; closes REQ-012 in same touch).
3. Author regression test `mcp_server/tests/checkpoint-restore-readme-poisoning.vitest.ts`:
   - Fixture: in-memory SQLite with a pre-seeded `memory_index` row at .../constitutional/README.md carrying `importance_tier='constitutional'`.
   - Action: execute `checkpoint_restore` against a checkpoint containing the same row.
   - Assertion: post-restore the row has `importance_tier='important'` AND a `governance_audit` row with `action='tier_downgrade_non_constitutional_path'`.
4. Run focused suite: `npx vitest run tests/index-scope.vitest.ts tests/checkpoint-restore-invariant-enforcement.vitest.ts tests/checkpoint-restore-readme-poisoning.vitest.ts` exits 0.

**Exit criterion**: P1-001 closed; regression green; existing 005 test suite still green.

### Phase 2: Core Implementation

**Goal**: Close the API-contract and observability advisories.

1. **REQ-006 stable error code**: define `E_MEMORY_INDEX_SCOPE_EXCLUDED` in `mcp_server/lib/errors/` (or wherever error codes live); thread through `memory-save.ts:2715` rejection. Add a focused test for the error envelope.
2. **REQ-005 walker warnings**: extend the response shape of `findFiles()` in both `memory-index-discovery.ts` and `code_graph/lib/structural-indexer.ts` to include `warnings: string[]` and `capExceeded: { maxNodes: boolean, depth: boolean, gitignoreSize: boolean }`. Surface those fields in the `memory_index_scan` MCP response and in code-graph scan summaries. Add a test that triggers a node-cap and asserts the field appears in the response.
3. **REQ-007 chunking helper guard**: route `applyPostInsertMetadataFallback` through `applyPostInsertMetadata`; remove the local SQL `UPDATE memory_index SET ${setClause}` path or guard it with the SSOT predicate. Add a focused test that exercises the fallback and asserts no constitutional-tier write outside `/constitutional/`.

**Exit criterion**: REQ-005, REQ-006, REQ-007 closed with focused tests; full vitest suite still green.

### Phase 3: Verification

**Goal**: Close the documentation drift and test-fixture duplication advisories.

1. **REQ-008** post-merge identity drift in 005 root docs: rewrite `010-memory-indexer-invariants` references to `005-memory-indexer-invariants` in `spec.md`, leaving aliases only where explicit.
2. **REQ-004** checklist evidence: open 005-memory-indexer-invariants/checklist.md; add `file:line` anchors to each `[x]` CHK-* item that currently cites only file or narrative.
3. **REQ-014** ADR alternatives: back-fill decision-record.md ADR-008..ADR-012 with a strongest rejected alternative + rationale per ADR.
4. **REQ-009** feature catalog refresh: update packet path + ADR identifiers in .opencode/skill/sk-doc/feature_catalog/13--memory-quality-and-indexing/25-indexing-runtime-bootstrap-api.md.
5. **REQ-010** manual playbook scenarios: add explicit cleanup-apply, rollback, restore-validation, walker-DoS, promotion-bypass scenarios in .opencode/skill/sk-doc/manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md.
6. **REQ-011** runtime trace comments: grep for `packet 026/011` in runtime files; rewrite to `packet 026/005` where the reference is to memory-indexer ADRs.
7. **REQ-013** operator README: append Repair / Verify / Rollback subsection under "Index Scope Invariants" in mcp_server/README.md.
8. **REQ-003** strategy artifact map paths: fix `code-graph` → `code_graph` and `handlers/memory-parser.ts` → `lib/parsing/memory-parser.ts` in the deep-review strategy file.
9. **REQ-015** test fixture: extract `mcp_server/tests/fixtures/memory-index-db.ts` with a composable schema builder; migrate `cleanup-script-audit-emission.vitest.ts`, `memory-save-index-scope.vitest.ts`, and `checkpoint-restore-invariant-enforcement.vitest.ts` to consume it.

**Exit criterion**: All 13 P2 advisories closed; strict packet validation green for both 005 and this remediation sub-phase.

<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `npm run typecheck` exits 0.
- `npm run build` exits 0.
- `npx vitest run` for the focused suite (Phase 1 tests) exits 0.
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/001-memory-indexer-storage-boundary --strict` exits 0.
- Re-read source review report; confirm each finding has a closed/closed-by-deferral disposition.

<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 005 source review report | Internal | Complete | Findings would not be traceable. |
| Focused memory-indexer tests | Internal | Complete | Runtime remediation evidence would be incomplete. |
| Strict validator | Internal | Complete after closure pass | Packet could not be claimed strict-green. |

<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Revert call-site replacements to the previous predicate only if regression evidence shows over-filtering.
- Revert documentation-only advisory closures per file; no runtime state migration is involved.
- Re-run the focused storage-boundary suite after any rollback.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:phase-deps -->
