---
title: "Implementation Summary: Memory-Indexer Storage-Boundary Remediation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
description: "Implemented the constitutional README storage-boundary fix plus the advisory observability, docs, and fixture cleanup from the 005 deep-review."
trigger_phrases:
  - "001-memory-indexer-storage-boundary implementation"
  - "constitutional README storage-boundary fixed"
  - "E_MEMORY_INDEX_SCOPE_EXCLUDED"
  - "isIndexableConstitutionalMemoryPath"
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
      - "Strict validator exits 2 for remediation packet template structure"
    completion_pct: 95
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-memory-indexer-storage-boundary |
| **Completed** | 2026-04-28 |
| **Level** | 2 |

---

<!-- /ANCHOR:metadata -->
<!-- ANCHOR:what-built -->
## What Was Built

The storage boundary now uses the same rule-file-only constitutional predicate as parser and discovery. A poisoned checkpoint, update path, post-insert metadata write, cleanup run, or direct save can no longer preserve a constitutional README as `importance_tier='constitutional'`.

### Phase 1: SSOT Storage Boundary

Added `isIndexableConstitutionalMemoryPath()` and wired it through parser, discovery, checkpoint restore, SQL update, post-insert metadata, memory save, and cleanup. The new checkpoint regression first failed against the old checkpoint guard, then passed after checkpoint restore moved to the shared predicate.

### Phase 2: Advisory Runtime Contracts

`memory_save` now returns stable `E_MEMORY_INDEX_SCOPE_EXCLUDED` errors with `canonicalPath`. Memory and code-graph walkers surface structured `warnings` and `capExceeded`, and chunking fallback metadata now delegates to guarded post-insert metadata instead of issuing its own SQL update.

### Phase 3: Docs, ADRs, Fixtures

Updated the 005 packet identity references, added ADR alternatives for ADR-008 through ADR-012, refreshed the feature catalog and manual playbook, added README repair/verify/rollback commands, fixed the deep-review strategy paths, and extracted `tests/fixtures/memory-index-db.ts`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts` | Modified | Adds `isIndexableConstitutionalMemoryPath()` |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` | Modified | Downgrades constitutional README rows during restore |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts` | Modified | Uses rule-file-only predicate for update guard |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts` | Modified | Uses rule-file-only predicate for metadata writes |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified | Adds stable excluded-path error code and SSOT tier guard |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` | Modified | Adds discovery metadata and SSOT constitutional filtering |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modified | Surfaces walker warnings and cap metadata |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts` | Modified | Adds code-graph walker warnings and cap metadata |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` | Modified | Surfaces code-graph scan warnings and cap metadata |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts` | Modified | Routes fallback metadata through guarded helper |
| `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts` | Modified | Derives excluded rows from SSOT helpers |
| `.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/memory-index-db.ts` | Created | Shared SQLite fixture builder |

---

<!-- /ANCHOR:what-built -->
<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Phase 1 landed test-first for the checkpoint poisoning case: `tests/checkpoint-restore-readme-poisoning.vitest.ts` failed with `constitutional` preserved, then passed after the checkpoint guard changed. Phase 2 added focused tests for the stable error envelope, walker metadata, and chunking fallback. Phase 3 updated docs and consolidated three DB fixture users.

---

<!-- /ANCHOR:how-delivered -->
<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Promote README exclusion into `isIndexableConstitutionalMemoryPath()` | Parser/discovery already knew README is not a rule file; storage mutation surfaces needed the same truth. |
| Return `E_MEMORY_INDEX_SCOPE_EXCLUDED` instead of throwing a generic error from `handleMemorySave` | Clients can now distinguish policy rejection from runtime failure and inspect `canonicalPath`. |
| Keep cleanup derivation in TypeScript predicate logic | SQL string fragments were the drift source; row filtering through the shared helper keeps future exclusions aligned. |
| Record validator failures instead of marking T25 complete | Runtime tests and builds are green, but the remediation packet docs do not satisfy strict template structure yet. |

---

<!-- /ANCHOR:decisions -->
<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline focused suite before edits | PASS, `8 passed (8)`, 21 tests, exit 0 |
| New checkpoint poisoning test before T4 | FAIL as expected, preserved `constitutional`, exit 1 |
| Checkpoint restore focused suite after T4 | PASS, 2 files, 4 tests, exit 0 |
| Runtime focused suite | PASS, 9 files, 25 tests, exit 0 |
| `npm run typecheck` in `mcp_server` | PASS, exit 0 |
| `npm run build` in `system-spec-kit` | PASS, exit 0 |
| Strict validator for `005-memory-indexer-invariants` | FAIL strict, exit 2, errors 0 warnings 2: template header deviations and continuity freshness |
| Strict validator for this remediation subphase | FAIL, exit 2, missing/invalid template structure and `implementation-summary.md` was missing during first run |

---

<!-- /ANCHOR:verification -->
### Source Finding Dispositions

| Finding | Disposition |
|---------|-------------|
| P1-001 | Closed by `isIndexableConstitutionalMemoryPath()` and checkpoint README poisoning regression |
| P2-001 | Closed by strategy path updates |
| P2-002 | Partially addressed by current-ID cleanup and checklist evidence updates; deeper file-line normalization remains tied to template repair |
| P2-003 | Closed by `warnings` and `capExceeded` fields on memory and code-graph scan surfaces |
| P2-004 | Closed by `E_MEMORY_INDEX_SCOPE_EXCLUDED` |
| P2-005 | Closed by guarded chunking fallback |
| P2-006 | Closed by root 005 identity update |
| P2-007 | Closed by feature catalog refresh |
| P2-008 | Closed by manual playbook adversarial scenarios |
| P2-009 | Closed for memory-indexer ADR trace comments touched in runtime |
| P2-010 | Closed by cleanup SSOT derivation |
| P2-011 | Closed by operator README repair/verify/rollback subsection |
| P2-012 | Closed by ADR-008..ADR-012 alternatives |
| P2-013 | Closed by shared DB fixture extraction and three migrated tests |

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Strict packet validation is not green.** The runtime remediation is tested, typechecked, and built, but `validate.sh --strict` still exits 2. The 005 root has warning-only strict failure. This remediation packet has broader template-structure failures in `plan.md`, `tasks.md`, and `checklist.md`.
2. **T25 remains open.** I did not mark the final validator task complete because the validator did not pass.
3. **P2-002 is only partially closed.** The 005 checklist now has current packet/path cleanup, but a full every-row `file:line` normalization should be done as part of the template repair pass.

<!-- /ANCHOR:limitations -->
