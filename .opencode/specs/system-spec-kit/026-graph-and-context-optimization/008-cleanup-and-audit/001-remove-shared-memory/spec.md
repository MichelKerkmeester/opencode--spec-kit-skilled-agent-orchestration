---
title: "018 / 010 — Remove shared memory feature surface"
description: "Hard-delete the shared-memory lifecycle, runtime filters, tests, and documentation so the system no longer exposes shared spaces or shared-memory collaboration."
trigger_phrases: ["018 010 spec", "remove shared memory", "hard delete shared memory"]
importance_tier: "critical"
contextType: "implementation"
status: "complete"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit/001-remove-shared-memory"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Defined the hard-delete scope for shared memory removal"
    next_safe_action: "Review implementation-summary.md for the verification evidence"
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
---
# Feature Specification: 018 / 010 — Remove shared memory feature surface

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-04-12 |
| **Branch** | `system-speckit/026-graph-and-context-optimization` |
| **Parent Metadata** | `../graph-metadata.json` |
| **Parent Description** | `../description.json` |
| **Predecessor** | `009-readme-alignment-revisit` |
| **Successor** | `011-spec-folder-graph-metadata` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 018 still exposes a full shared-memory collaboration surface through MCP lifecycle tools, shared-space runtime helpers, governed retrieval filters, save-path enforcement, feature-flag docs, feature-catalog entries, playbook scenarios, and tests. The user explicitly wants that feature removed as if it never shipped. The follow-up cleanup adds an idempotent `dropDeprecatedSharedSpaceColumn()` helper that runs on every startup. When the column is still present the helper issues `ALTER TABLE memory_index DROP COLUMN shared_space_id`. When the column is already gone (or when the SQLite build does not support DROP COLUMN) the helper silently returns without doing anything, so subsequent starts never fail on deployed installs.

Leaving the code in a disabled or documented-only state is out of scope. The system has to stop registering shared-memory tools, stop resolving shared-space scope, stop shipping shared-memory docs and tests, and stop advertising shared-memory setup or rollout flows.

### Purpose
Delete the shared-memory feature end to end while preserving only the unavoidable schema columns and documenting the removal in this phase packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the four shared-memory lifecycle MCP tools from registrations, input schemas, type definitions, and public tool catalog docs.
- Delete the dedicated shared-memory handler and shared-space collaboration library files, plus any runtime imports, exports, and barrel references that point at them.
- Remove shared-space filtering and `sharedSpaceId` request plumbing from retrieval, trigger matching, governed save, checkpoint, preflight, and related runtime helpers.
- Delete shared-memory docs, shared-space directories, feature-catalog entries, playbook scenarios, and shared-memory-only tests.
- Run the idempotent `dropDeprecatedSharedSpaceColumn()` helper on every startup. When the column is present, the helper issues `ALTER TABLE memory_index DROP COLUMN shared_space_id`. When the column is already gone, or when the SQLite build does not support DROP COLUMN, the helper returns without doing anything. The runtime never reads or writes the column, so installs that cannot execute DROP COLUMN keep an unused column on disk without side effects.

### Out of Scope
- Forced data migration or destructive rewrites for installs on SQLite older than 3.35. The startup helper falls back to a no-op so those installs keep an unused column instead of failing the boot.
- Broad governance redesign unrelated to shared memory. Tenant, user, agent, and session scope remain if they are still used elsewhere.
- Git commit or push actions. This phase ends with a commit-ready file list only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts` | Modify | Remove shared-memory tool dispatch and types. |
| `.opencode/skill/system-spec-kit/mcp_server/tools/types.ts` | Modify | Remove shared-memory tool arg types and `sharedSpaceId` request args. |
| `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modify | Remove shared-memory tool schemas and `sharedSpaceId` params from active tool schemas. |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Modify | Remove shared-memory tool catalog entries and shared-space parameters from active tools. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts` | Delete | Delete the shared-memory lifecycle handler. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts` | Delete | Delete shared-space runtime/storage logic. |
| `.opencode/skill/system-spec-kit/mcp_server/**` | Modify/Delete | Remove shared-space filters, imports, exports, tests, and docs across runtime helpers. |
| `.opencode/command/memory/manage.md` | Modify | Remove the `shared` mode from command docs and allowed tools. |
| `.opencode/skill/system-spec-kit/feature_catalog/**` | Modify/Delete | Delete shared-memory catalog entries and index references. |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/**` | Modify/Delete | Delete shared-memory playbook scenarios and index references. |
| The dedicated shared-memory database guide file | Delete | Remove the standalone shared-memory guide entirely. |
| `.opencode/skill/system-spec-kit/shared-spaces/` | Delete | Remove the documentation-only shared-spaces directory. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared-memory lifecycle tools are fully removed. | `lifecycle-tools.ts`, `tool-input-schemas.ts`, `tool-schemas.ts`, and `tools/types.ts` no longer define or dispatch `shared_memory_enable`, `shared_space_upsert`, `shared_space_membership_set`, or `shared_memory_status`. |
| REQ-002 | Shared-memory runtime code is deleted. | `handlers/shared-memory.ts` and `lib/collab/shared-spaces.ts` are deleted, and no remaining runtime import/re-export points at them. |
| REQ-003 | Active runtime contracts no longer expose shared-space scope. | `sharedSpaceId` request parameters and shared-space filtering logic are removed from live tool args, handlers, search helpers, save helpers, checkpoints, and preflight paths. |
| REQ-004 | Shared-memory docs and test surfaces are removed. | Command docs, MCP docs, skill docs, feature catalog, manual testing playbook, and shared-memory-only tests no longer advertise or verify shared memory. |
| REQ-005 | No active shared-memory surface survives the cleanup. | Final grep returns no active shared-memory references outside this 010 packet. The schema runs `dropDeprecatedSharedSpaceColumn()` on startup so deployed databases shed the column on first launch (with a silent no-op fallback on older SQLite). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The packet documents the hard-delete scope and verification evidence. | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` are complete and consistent. |
| REQ-007 | Required verification commands pass after the removal. | The requested typecheck, build, test, strict validation, and final grep commands pass with the shared-memory surface removed. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No MCP tool, command doc, or runtime handler still exposes shared-memory lifecycle behavior.
- **SC-002**: Retrieval, trigger, save, and checkpoint code no longer accept or enforce shared-space scope.
- **SC-003**: Shared-memory docs, feature-catalog rows, playbook scenarios, and shared-only tests are gone.
- **SC-004**: Typecheck, build, tests, strict packet validation, and final grep all pass.
<!-- /ANCHOR:success-criteria -->

---

### Acceptance Scenarios

**Given** the MCP server enumerates lifecycle tools, **when** the live tool surface and tool catalog are inspected, **then** none of the four removed shared-memory tools appear.

**Given** retrieval, trigger, save, checkpoint, or preflight handlers receive governed-scope requests, **when** they execute after this phase, **then** they continue to work without any `sharedSpaceId` parameter or shared-space filtering branch.

**Given** operators open command docs, MCP docs, feature-catalog pages, or manual playbook indices, **when** they search for shared-memory workflows, **then** they find no active shared-memory setup, rollout, or membership guidance.

**Given** the exact shared-reference grep is run after implementation, **when** results are reviewed, **then** the only remaining hits are the `dropDeprecatedSharedSpaceColumn()` migration helper in `vector-index-schema.ts` and the 010 packet docs that describe the removal.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shared-memory references are spread across runtime, docs, and tests | Missing one leaves broken imports or final-grep failures | Use exhaustive `rg` sweeps before and after edits, then verify with the requested final grep. |
| Risk | Removing `sharedSpaceId` from generic scope contracts can break unrelated governance code | High | Keep tenant, user, agent, and session scope intact while deleting only shared-space-specific branches. |
| Risk | Checkpoint and save helpers may still reference shared-space tables or conflict logging | High | Read and trim the affected helper files, then rely on typecheck and test runs to catch any dangling paths. |
| Dependency | SQLite version skew across installs | Medium | Run `ALTER TABLE memory_index DROP COLUMN shared_space_id` on startup and silently fall back when the SQLite build does not support DROP COLUMN. The runtime never reads or writes the column either way. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator explicitly requested a hard delete with the schema-column exception only.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Shared-memory removal must not add new search or save overhead; it should only remove branches and filters.
- **NFR-P02**: Verification must prove the repo still typechecks and builds after the runtime surface is reduced.

### Security
- **NFR-S01**: Shared-memory auth and shared-space membership paths must be removed, not left in a dormant state.
- **NFR-S02**: Governance code must still preserve the remaining non-shared scope rules.

### Reliability
- **NFR-R01**: No dangling imports, barrel exports, or test references remain after the delete.
- **NFR-R02**: The final grep must provide a stable proof that the active shared-memory surface is gone.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Existing databases can still contain `shared_space_id` values until startup drops the column. The runtime never reads or writes the column either way.
- Existing schema migrations still need to succeed for installs that already created the shared-space-related columns. The startup DROP COLUMN runs once and falls back to a no-op when SQLite lacks DROP COLUMN support.

### Error Scenarios
- Removing shared-space modules can break save, checkpoint, or search code through stale imports or type references.
- Removing catalog or playbook files can leave stale links in master indices or README tables.

### State Transitions
- A fresh install should no longer have a shared-memory control plane even if legacy flags are present in the environment.
- Existing checkpoints or data rows with shared-space metadata should no longer receive special restore or filtering behavior.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 24/25 | Runtime, docs, feature catalog, playbook, tests, and packet docs all need coordinated removal. |
| Risk | 23/25 | Generic scope and save/checkpoint paths currently carry shared-space branches that can break if trimmed incorrectly. |
| Research | 12/20 | The work relies on direct repo inspection and exhaustive grep sweeps rather than new product research. |
| **Total** | **59/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
