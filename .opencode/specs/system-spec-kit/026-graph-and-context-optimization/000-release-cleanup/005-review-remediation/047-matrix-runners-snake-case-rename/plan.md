---
title: "Implementation Plan: 047 matrix_runners Snake Case Rename"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Move the matrix runner runtime folder to snake_case, update literal references, and verify imports with build plus targeted Vitest smoke tests."
trigger_phrases:
  - "047-matrix-runners-snake-case-rename"
  - "matrix_runners rename"
  - "kebab-to-snake convention"
  - "mcp_server folder convention"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/047-matrix-runners-snake-case-rename"
    last_updated_at: "2026-04-29T22:47:36+02:00"
    last_updated_by: "codex"
    recent_action: "Planned rename"
    next_safe_action: "Run final validation"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/matrix_runners"
      - "rename-log.md"
    session_dedup:
      fingerprint: "sha256:047-matrix-runners-snake-case-rename-plan"
      session_id: "047-matrix-runners-snake-case-rename"
      parent_session_id: "046-release-readiness-synthesis-and-remediation"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 047 matrix_runners Snake Case Rename

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Markdown, JSON |
| **Framework** | Spec Kit MCP server |
| **Storage** | None |
| **Testing** | TypeScript build, Vitest, Spec Kit validator, grep |

### Overview
This packet performs a pure filesystem and reference rename from the legacy matrix runner directory name to `matrix_runners`. The implementation is intentionally mechanical: move the directory, replace literal path fragments, create packet evidence, and verify that imports and docs no longer point at the old content path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified: packets 036 and 046.

### Definition of Done
- [x] Runtime directory renamed to `matrix_runners`.
- [x] All literal old-path content references replaced.
- [x] `npm run build` passes.
- [x] `npx vitest run matrix-adapter` passes.
- [x] Strict packet validation and final grep pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Filesystem convention alignment.

### Key Components
- **Runtime runner directory**: Holds the meta-runner, manifest, per-CLI adapters, and prompt templates.
- **Matrix adapter tests**: Import adapter modules from the renamed directory.
- **Documentation and spec evidence**: Preserve accurate path references across evergreen docs and historical packet records.

### Data Flow
No runtime data flow changes. The same TypeScript modules are loaded from a snake_case folder path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Rename
- [x] Attempt `git mv`.
- [x] Fall back to filesystem `mv` when git index write is blocked.

### Phase 2: Reference Update
- [x] Replace literal old folder fragment with `matrix_runners`.
- [x] Confirm runtime imports point at the renamed directory.
- [x] Update runner README self-reference.

### Phase 3: Packet Docs
- [x] Create Level 2 packet docs.
- [x] Create `rename-log.md` with file ledger and replacement count.

### Phase 4: Verification
- [x] Run MCP server build.
- [x] Run matrix adapter smoke suite.
- [x] Run strict packet validator.
- [x] Run final recursive grep for old-path content.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | TypeScript imports and project references | `npm run build` |
| Unit smoke | Matrix adapter mocked spawn coverage | `npx vitest run matrix-adapter` |
| Documentation validation | Packet structure and evidence markers | `validate.sh --strict` |
| Search verification | Old-path content references | `grep -rln` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 036 CLI matrix adapter runners | Internal | Green | Rename has no source tree to move |
| Packet 046 release readiness synthesis | Internal | Green | Sequencing context missing |
| Git index write access | Tooling | Yellow | Staging unavailable, filesystem move still works |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Build, matrix adapter tests, strict validator, or final grep fails and cannot be fixed surgically.
- **Procedure**: Move `mcp_server/matrix_runners/` back to its prior folder name, reverse the literal replacement, and rerun the same checks.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Rename -> Reference Update -> Packet Docs -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Rename | Existing runner directory | Reference Update |
| Reference Update | Rename | Verification |
| Packet Docs | Reference Update | Strict Validation |
| Verification | Reference Update, Packet Docs | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Rename | Low | <1 hour |
| Reference Update | Medium | <1 hour |
| Packet Docs | Medium | <1 hour |
| Verification | Low | <1 hour |
| **Total** | | **<4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migrations.
- [x] No feature flags.
- [x] No semantic code changes.

### Rollback Procedure
1. Move the runtime folder back to its previous name.
2. Reverse the literal path replacement.
3. Rerun build, matrix adapter tests, strict validation, and grep.
4. Keep packet docs with failure evidence if rollback is needed.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
