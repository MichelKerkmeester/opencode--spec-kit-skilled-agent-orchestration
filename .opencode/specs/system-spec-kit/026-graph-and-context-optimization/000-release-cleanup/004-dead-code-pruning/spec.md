---
title: "Feature Specification: Dead-Code Pruning — apply 003-audit high-confidence deletes"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Apply the 13 high-confidence dead-code deletes identified by 003-dead-code-audit. Surgical local removals: unused imports, unused constants, unused private helpers, unused test locals. Remediation packet only — no architectural change. Verified by tsc --noEmit + full vitest sweep."
trigger_phrases:
  - "004-dead-code-pruning"
  - "dead code pruning system-spec-kit"
  - "apply dead-code audit"
  - "remove unused imports mcp_server"
  - "release cleanup pruning"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/004-dead-code-pruning"
    last_updated_at: "2026-04-28T09:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored spec and applied 13 dead-code deletes"
    next_safe_action: "Validate packet + parent manifest update"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: null
      session_id: "004-dead-code-pruning-execute-2026-04-28"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Dead-Code Pruning — apply 003-audit high-confidence deletes

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-04-28 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `000-release-cleanup` |
| **Predecessor** | `../003-dead-code-audit/` |
| **Successor** | None (current tail) |
| **Handoff Criteria** | All 13 high-confidence deletes from `../003-dead-code-audit/dead-code-audit-report.md` are applied; `tsc --noEmit` exit 0; full `vitest run` passes; no scope drift outside the 13 cited symbols (cascade orphan cleanups documented). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Sibling packet `003-dead-code-audit` produced `../003-dead-code-audit/dead-code-audit-report.md` listing 13 high-confidence dead-code findings under `.opencode/skill/system-spec-kit/mcp_server/`. Each is a small local delete: unused namespace import, unused constant, unused private helper, unused test-local variable. Left in place, they:

- Add noise during deep-research / deep-review passes (agents read dead lines)
- Increase apparent surface area for future refactors
- Risk a future packet adding *new* references to dead code thinking it's load-bearing
- Trip `tsc --noUnusedLocals --noUnusedParameters` (a stricter mode that some operators run locally)

### Purpose

Mechanically apply the 13 audit-identified deletes, verify cleanup is safe by running typecheck and full vitest, and commit a clean diff with no scope creep. Cascade orphans (symbols that become unused only after a listed delete is applied) are removed in the same packet to keep the strict-typecheck baseline green.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Apply each of the 13 high-confidence deletes listed in `../003-dead-code-audit/dead-code-audit-report.md` (Category: `dead`):
  1. `mcp_server/context-server.ts` — unused `memoryParser` namespace import
  2. `mcp_server/hooks/codex/user-prompt-submit.ts` — unused `DEFAULT_TOKEN_CAP` constant
  3. `mcp_server/lib/parsing/memory-parser.ts` — unused private `isMarkdownOrTextFile` helper
  4. `mcp_server/lib/storage/checkpoints.ts` — unused private `deleteCausalEdgesForMemoryIds`
  5. `mcp_server/skill_advisor/handlers/advisor-validate.ts` — unused `failedCount` local
  6. `mcp_server/skill_advisor/lib/daemon/lifecycle.ts` — unused type import `SkillGraphLease`
  7. `mcp_server/skill_advisor/lib/daemon/watcher.ts` — unused `statSync` import
  8. `mcp_server/skill_advisor/lib/derived/extract.ts` — unused `dirname` import
  9. `mcp_server/skill_advisor/lib/derived/extract.ts` — unused `SOURCE_CATEGORIES` constant
  10. `mcp_server/skill_advisor/lib/generation.ts` — unused `join` import
  11. `mcp_server/code_graph/tests/code-graph-indexer.vitest.ts` — unused test-local `content`
  12. `mcp_server/code_graph/tests/code-graph-seed-resolver.vitest.ts` — unused `vi` import
  13. `mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts` — unused `existsSync` import
- Cascade orphan cleanup: when a listed delete leaves another symbol orphaned (only used by the deleted target), remove that symbol too in the same packet.
- Verify by running normal `tsc --noEmit` (must exit 0), strict unused-checks `tsc --noUnusedLocals --noUnusedParameters` (must exit 0), and full `vitest run` (must pass).

### Out of Scope

- Any finding outside the 13 high-confidence deletes (e.g., `dynamic-only-reference` or `false-positive` audit categories).
- Architectural change. This is a mechanical deletion sweep, not a refactor.
- Touching cross-runtime mirrors directly. `.opencode/skill/system-spec-kit/` is the single source of truth (hardlinked to `.gemini/`, `.claude/`, `.codex/`).
- New tests, new docs, new types. The packet only deletes.
- Modifications to sibling packets (`001-memory-terminology/`, `002-sk-code-opencode-alignment/`, `003-dead-code-audit/`).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional Requirements

| ID | Priority | Requirement |
|----|----------|-------------|
| **REQ-001** | P0 | All 13 high-confidence deletes from the audit report MUST be applied (or explicitly skipped with documented reason). |
| **REQ-002** | P0 | Each delete MUST remove ONLY the cited symbol (and any cascade orphans). No "while we're here" cleanup. |
| **REQ-003** | P0 | Normal `tsc --noEmit` MUST exit 0 after all deletes. |
| **REQ-004** | P0 | Strict `tsc --noUnusedLocals --noUnusedParameters` MUST exit 0 after all deletes (validates the audit's 13 plus any cascade orphans). |
| **REQ-005** | P0 | Full `vitest run` MUST pass on the post-delete tree. |
| **REQ-006** | P1 | Cascade orphans MUST be cleaned up (symbols whose only consumer was a listed delete). |
| **REQ-007** | P1 | Stale comment references to deleted symbols SHOULD be cleaned up; documentation history that names the removed function inline MUST be trimmed to avoid confusion. |
| **REQ-008** | P2 | `implementation-summary.md` MUST list which deletes landed cleanly + which were skipped + cascade-orphan removals + tsc/vitest results. |

### Acceptance Scenarios

**Given** the audit report ships 13 high-confidence deletes, **when** this packet executes, **then** all 13 are applied or documented as skipped (with reason), and the post-delete tree compiles + tests cleanly.

**Given** a listed delete leaves another symbol orphaned, **when** the cascade is detected by strict typecheck, **then** the orphan is cleaned up in the same packet so the post-delete strict baseline is green.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| ID | Criterion |
|----|-----------|
| **SC-001** | All 13 audit-listed deletes applied (or skip-with-reason documented in implementation-summary). |
| **SC-002** | `tsc --noEmit` exit 0. |
| **SC-003** | `tsc --noUnusedLocals --noUnusedParameters` exit 0 (zero strict-unused diagnostics). |
| **SC-004** | `vitest run` passes (no regressions vs pre-delete baseline). |
| **SC-005** | No files outside `.opencode/skill/system-spec-kit/mcp_server/` modified by the deletes. |
| **SC-006** | No sibling packets (`001/`, `002/`, `003/`) modified. |
| **SC-007** | `implementation-summary.md` lists per-finding outcome (applied / skipped) + cascade orphan list + tsc/vitest results. |
| **SC-008** | `validate.sh --strict` on this packet exits 0 (SPEC_DOC_INTEGRITY false-positives accepted as noise per the predecessor pattern). |
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| Audit miscategorized a `dead` finding (the symbol IS used somewhere the audit missed) | tsc fails after delete | Restore that one finding; document as skipped in implementation-summary; do not let one bad finding gate the other 12 |
| Cascade orphan creates a chain (delete A → B becomes unused → delete B → C becomes unused) | Scope creep risk | Only chase one cascade level deep; if a second-level cascade appears, document and stop |
| Stale comments still name the deleted symbol | Confusing future readers | Trim the comment to remove the dangling name reference; preserve the explanatory context |
| Vitest fails on a test that depended on a deleted symbol | Real regression | Should not happen for unused-only deletes, but verify; if it happens, the symbol was not actually unused — restore that finding |
| Source line numbers shifted between audit time and pruning time (other concurrent work) | Edit tool can't locate the symbol | Cross-check by symbol name not line number; symbol-based Edit calls are robust to line drift |

### Dependencies

- `../003-dead-code-audit/dead-code-audit-report.md` (the source of truth for which deletes to apply)
- TypeScript compiler (`tsc`) — already a dev dependency
- `vitest` — already a dev dependency
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh` for packet validation
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

| ID | Question | Resolution |
|----|----------|-----------|
| **Q-001** | Should cascade orphans be deleted in this packet or deferred? | Resolved: delete in this packet. The `tsc --noUnusedLocals` strict mode would otherwise stay red, defeating the purpose. Cascade orphans are inseparable from their parent deletes. |
| **Q-002** | Should stale doc comments mentioning the removed function be removed? | Resolved: trim the dangling name reference but preserve any explanatory context. Comments are not in scope for fresh authoring; only stale references get touched. |
| **Q-003** | Should this packet also touch the `dynamic-only-reference` (15) or `false-positive` (5) categories? | Resolved: NO. Those categories are explicitly out of scope per audit recommendations (`keep-with-rationale`). |
<!-- /ANCHOR:questions -->
