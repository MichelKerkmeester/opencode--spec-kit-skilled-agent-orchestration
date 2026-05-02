---
title: "Feature Specification: 047 matrix_runners Snake Case Rename"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Rename the CLI matrix runner runtime directory to snake_case and update all textual references. This keeps mcp_server folder naming aligned without changing runtime behavior."
trigger_phrases:
  - "034-matrix-runners-snake-case-rename"
  - "matrix_runners rename"
  - "kebab-to-snake convention"
  - "mcp_server folder convention"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/034-matrix-runners-snake-case-rename"
    last_updated_at: "2026-04-29T22:47:36+02:00"
    last_updated_by: "codex"
    recent_action: "Renamed runner dir"
    next_safe_action: "Run final validation"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/matrix_runners"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-codex.vitest.ts"
      - "rename-log.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "034-matrix-runners-snake-case-rename"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "The packet folder was provided by the operator; no Gate 3 prompt needed."
---
# Feature Specification: 047 matrix_runners Snake Case Rename

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-29 |
| **Branch** | `034-matrix-runners-snake-case-rename` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The CLI matrix runner folder used kebab-case while adjacent MCP server support directories use snake_case. That naming mismatch made the runtime tree inconsistent and left imports, docs, tests, feature catalog entries, and prior packet evidence pointing at the outlier path.

### Purpose
Rename the runtime folder to `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/` and update every path reference without changing behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename the runtime directory to `mcp_server/matrix_runners/`.
- Update literal path references across runtime code, tests, docs, feature catalog entries, and spec evidence.
- Create a Level 2 packet with a rename log.
- Verify build, targeted matrix adapter tests, strict packet validation, and zero old-path content references.

### Out of Scope
- Renaming spec packet folders.
- Changing CLI adapter behavior, manifest semantics, or test logic.
- Committing or staging changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/` | Rename | Runtime folder moves to snake_case |
| `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-*.vitest.ts` | Modify | Import paths point to `matrix_runners` |
| `.opencode/skill/system-spec-kit/**/*.md` | Modify | Evergreen docs and catalog references use the new path |
| `specs/system-spec-kit/026-graph-and-context-optimization/**` | Modify | Prior packet evidence references use the new path |
| `README.md` | Modify | Root README points at the renamed folder |
| `rename-log.md` | Create | File ledger and replacement count |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename runtime directory | Only `mcp_server/matrix_runners/` remains for the matrix runner runtime |
| REQ-002 | Update imports and references | Repository search returns zero old-path content references |
| REQ-003 | Preserve semantics | `npm run build` and targeted matrix adapter tests pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Document packet evidence | Level 2 docs and `rename-log.md` exist under this packet |
| REQ-005 | Keep scope surgical | Diff contains path-reference updates only, aside from packet docs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `find .opencode/skill/system-spec-kit/mcp_server -maxdepth 1 -type d -name 'matrix*'` shows `matrix_runners`.
- **SC-002**: `npm run build` passes from `.opencode/skill/system-spec-kit/mcp_server`.
- **SC-003**: `npx vitest run matrix-adapter` passes all smoke tests.
- **SC-004**: `grep -rln` over the requested surfaces returns no old-path content references.
- **SC-005**: Strict validator exits 0 for this packet.

### Acceptance Scenarios
- **Scenario 1**: **Given** the MCP server runtime tree is listed, the matrix runner directory appears as `matrix_runners`.
- **Scenario 2**: **Given** TypeScript builds the MCP server, imports from matrix adapter tests resolve from `matrix_runners`.
- **Scenario 3**: **Given** the matrix adapter smoke suite runs, all mocked adapter tests pass without invoking real CLIs.
- **Scenario 4**: **Given** the requested recursive grep runs, no content file reports the old runtime folder fragment.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet 036 matrix adapter runners | This rename depends on the existing runner tree | Preserve all files and update references only |
| Dependency | Packet 046 release readiness | This packet follows the remediation sequence | Record dependency in graph metadata |
| Risk | Hidden textual references | Build could pass while docs stay stale | Run final recursive grep over requested surfaces |
| Risk | Git index sandbox | `git mv` may fail to write `.git/index.lock` | Use filesystem move and leave staging to orchestrator |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime code path may gain new work; this is a path-only rename.

### Security
- **NFR-S01**: No permissions, secrets, or command behavior may change.

### Reliability
- **NFR-R01**: TypeScript build must prove imports resolve after the folder move.
- **NFR-R02**: Matrix adapter smoke tests must prove mocked adapter execution still works.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Spec packet folder slugs stay unchanged even when content references are updated.
- Symlinked `specs/` and `.opencode/specs/` paths refer to the same physical docs.

### Error Scenarios
- `git mv` blocked by `.git/index.lock`: use filesystem `mv` and note that staging is unavailable.
- Build failure: search for unresolved imports and fix remaining path references.

### State Transitions
- Runtime folder renamed: imports and docs update to `matrix_runners`.
- Verification passed: checklist and implementation summary record command evidence.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Directory rename plus broad reference update |
| Risk | 7/25 | Import breakage possible, no semantic code changes |
| Research | 5/20 | Reference discovery and packet template alignment |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
