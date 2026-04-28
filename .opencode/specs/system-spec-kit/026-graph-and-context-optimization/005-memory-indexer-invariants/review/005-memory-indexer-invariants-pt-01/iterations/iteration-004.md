# Iteration 4 — Maintainability

## Dimension

Maintainability. This pass audited code clarity, pattern consistency, operator-facing docs, ADR completeness, and the cost of safe follow-on changes. It did not re-flag findings from iterations 1-3.

## Files Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts`
- `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts`
- `.opencode/skill/system-spec-kit/mcp_server/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md`
- `.opencode/skill/system-spec-kit/scripts/memory/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/api/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts`
- `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/decision-record.md`
- 14 focused vitest files: `checkpoint-restore-invariant-enforcement.vitest.ts`, `cleanup-script-audit-emission.vitest.ts`, `exclusion-ssot-unification.vitest.ts`, `full-spec-doc-indexing.vitest.ts`, `gate-d-regression-constitutional-memory.vitest.ts`, `handler-memory-index.vitest.ts`, `index-scope.vitest.ts`, `memory-crud-update-constitutional-guard.vitest.ts`, `memory-governance.vitest.ts`, `memory-parser-extended.vitest.ts`, `memory-save-index-scope.vitest.ts`, `pe-orchestration.vitest.ts`, `symlink-realpath-hardening.vitest.ts`, `walker-dos-caps.vitest.ts`

## Findings — P0 (Blockers)

No new P0 findings.

## Findings — P1 (Required)

No new P1 findings.

## Findings — P2 (Suggestions)

### P2-010 — Cleanup CLI duplicates the excluded-path policy instead of deriving it from the index-scope SSOT

The main runtime surfaces consistently import `shouldIndexForMemory()`, `shouldIndexForCodeGraph()`, or `isConstitutionalPath()` from `lib/utils/index-scope.ts`; the one maintainability outlier is the cleanup CLI. The SSOT currently defines memory exclusions in `EXCLUDED_FOR_MEMORY` (`.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:25`), but the cleanup script independently spells the same policy as SQL `LIKE` clauses for summaries and plans (`.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:111`, `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:130`). If a future invariant adds another excluded segment, normal scanners can inherit it from the helper while `--verify` and `--apply` can silently keep repairing only the old set.

Remediation: export a data-level excluded segment list, or a cleanup-specific SQL predicate builder, from the same policy module and consume it in `collectSummary()` / `buildPlan()`. Keep the regex predicate for runtime paths, but make the DB-repair path mechanically derive from the same segment list.

### P2-011 — Operator README lists stable action strings but does not give the cleanup and rollback flow at the invariant entry point

The main operator section names the three invariants and action strings (`.opencode/skill/system-spec-kit/mcp_server/README.md:113`, `.opencode/skill/system-spec-kit/mcp_server/README.md:121`), but it stops before the practical repair path. The cleanup CLI exists in a separate scripts README (`.opencode/skill/system-spec-kit/scripts/memory/README.md:41`), and the target verify counts are documented in a utility README (`.opencode/skill/system-spec-kit/mcp_server/lib/utils/README.md:106`). An operator landing on the `Index Scope Invariants` section without packet context has the contract but not the dry-run, apply, verify, backup, or rollback story.

Remediation: add a short "Repair / Verify / Rollback" subsection under `Index Scope Invariants` with the cleanup command, expected clean counts, DB backup/restore guidance, and where governance-audit action strings should appear after repair.

### P2-012 — ADR-008 through ADR-012 omit alternatives, leaving future maintainers to re-litigate late-stage choices

ADR-001 through ADR-007 include concrete alternatives tables, but the later ADRs drop that structure. ADR-008 records the cleanup-audit decision without alternatives (`specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/decision-record.md:297`), and ADR-009 through ADR-012 do the same for SSOT overlays, realpath fallback, transaction-snapshot planning, and governance-audit helper centralization (`specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/decision-record.md:319`, `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/decision-record.md:341`, `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/decision-record.md:363`, `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/decision-record.md:385`). These are exactly the decisions future maintainers are likely to revisit when schema, audit, or restore behavior changes.

Remediation: add one alternatives table per ADR with the strongest rejected option and the concrete rejection rationale. For example: "delete audit rows with deleted memories" for ADR-008, "hard-fail broken symlinks" for ADR-010, and "force every emitter to pass explicit action strings" for ADR-012.

### P2-013 — Invariant tests duplicate partial `memory_index` schemas instead of sharing a DB-shape fixture

The focused invariant tests use local in-memory SQLite fixtures, but each file defines a different partial `memory_index` shape. Examples: cleanup audit tests define one schema (`.opencode/skill/system-spec-kit/mcp_server/tests/cleanup-script-audit-emission.vitest.ts:12`), update-guard tests define another plus `active_memory_projection` (`.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts:8`), checkpoint-restore tests define a larger checkpoint-specific shape (`.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-restore-invariant-enforcement.vitest.ts:10`), and governance tests create smaller ad hoc schemas inline (`.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:190`). There is no evident shared invariant DB fixture under `tests/fixtures/` or `tests/setup/`.

Remediation: add a small `tests/fixtures/memory-index-db.ts` helper with composable schema builders such as `createMemoryIndexDb({ governance: true, projection: true, checkpoints: true })`. Tests can still stay local and fast, but future schema changes get one fixture surface instead of several partial copies.

## Traceability Checks

| Check | Status | Evidence |
|-------|--------|----------|
| M1 SSOT import shape | Partial | Runtime callers use shared helpers; cleanup CLI still restates excluded path SQL. |
| M2 Cleanup CLI testability | Partial | `buildPlan()` / `applyCleanup()` are exported and transaction-testable; DB-shape fixtures are duplicated. |
| M3 Governance audit helper extensibility | Pass | Action strings are centralized in `GOVERNANCE_AUDIT_ACTIONS`, with optional `action` override on `recordTierDowngradeAudit()`. |
| M4 README operator coverage | Partial | Stable strings documented; repair and rollback flow not colocated with invariant section. |
| M5 Defensive error-handling clarity | Pass | Expected validation failures and runtime errors are generally distinct; audit insert failures warn and preserve invariant paths. |
| M6 ADR alternatives | Fail | ADR-008 through ADR-012 lack alternatives sections. |
| M7 Test fixture shape consistency | Partial | No `it.skip` / `it.todo` markers found in the focused files; DB schemas are duplicated. |
| M8 Phase-merge artifact hygiene | Pass | No orphaned invariant helper imports or redundant re-export drift found in the reviewed surfaces. |

## Claim Adjudication Packets

No new P0/P1 findings surfaced in this iteration, so no claim-adjudication packet was required.

For P2 confidence:

- P2-010 is supported by the contrast between the canonical excluded-memory policy in `index-scope.ts` and the cleanup script's independent SQL pattern set.
- P2-011 is supported by README section boundaries: operator-facing invariant/action-string contract is present, but the cleanup command and expected counts are elsewhere.
- P2-012 is supported by ADR structure: later ADRs have context, decision, and consequences but no alternatives.
- P2-013 is supported by repeated local `CREATE TABLE memory_index` fixtures in focused invariant tests and no shared fixture helper path in `tests/fixtures/` or `tests/setup/`.

## Verdict

CONDITIONAL. No new P0/P1 surfaced, but the prior active P1 remains and there are four new maintainability P2 advisories. The implementation is directionally maintainable: the main helper and audit registry patterns are solid. The residual costs are documentation and fixture consolidation, plus one cleanup-policy drift surface.

## Next Dimension

STOP candidate — all 4 dimensions covered.
