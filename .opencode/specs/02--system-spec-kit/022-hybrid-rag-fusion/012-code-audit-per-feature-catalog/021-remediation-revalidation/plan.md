---
title: "Implementation Plan: remediation-revalidation [template:level_2/plan.md]"
description: "Phase 021 reconciliation plan for parent-state truthfulness after already-applied timeout and coverage-wording fixes."
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
trigger_phrases:
  - "remediation plan"
  - "revalidation"
  - "parent synthesis"
  - "chunk thinning timeout"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: remediation-revalidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation with repository evidence checks |
| **Framework** | Spec Kit Level 2 templates + validator workflow |
| **Storage** | Spec-folder markdown under `012-code-audit-per-feature-catalog/` |
| **Testing** | Recursive spec validation, placeholder scans, and cited runtime-test evidence |

### Overview
Phase 021 is a reconciliation phase, not a fresh audit. Runtime/test/catalog fixes already landed; this plan aligns parent and child documentation to that reality and removes stale completion/state claims.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Repository evidence for timeout and coverage wording changes verified
- [x] Parent stale-state issues identified (`../tasks.md`, `../synthesis.md`, phase-link mismatch)
- [x] Phase 021 Level 2 packet available for reconciliation edits

### Definition of Done
- [x] Parent + phase docs describe remediation status truthfully
- [x] Phase 020 links forward to phase 021
- [x] Recursive spec validation run and recorded with real outcome
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation reconciliation pattern with explicit historical-vs-current separation.

### Key Components
- **Repository Evidence Layer**: Test files/README/feature catalog changes already applied outside spec docs.
- **Phase 021 Packet**: Canonical remediation/revalidation record.
- **Parent Packet**: `../spec.md`, `../plan.md`, `../tasks.md`, `../synthesis.md` updated to reflect current truth.

### Data Flow
Existing repository changes are inspected, then phase 021 docs capture remediation evidence, then parent docs consume phase 021 as the current reconciliation source while preserving old baseline metrics as historical context.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Verify current mismatch between phase 021 claims and parent state.
- [x] Confirm runtime/test/catalog remediation evidence exists in repository.
- [x] Define exact in-scope file set under parent spec folder.

### Phase 2: Core Implementation
- [x] Update phase 021 docs to remove over-claims and align scope with already-applied fixes.
- [x] Update parent docs to include truthful task/synthesis state and phase 021 linkage.
- [x] Update phase 020 `Next Phase` metadata to phase 021.

### Phase 3: Verification
- [x] Run recursive spec validation for parent + child phase tree (result: PASS with zero errors and zero warnings after parent closeout artifact creation).
- [x] Run placeholder scan for phase 021 completion artifacts (result: PASS with no placeholder hits).
- [x] Record real verification outputs in `checklist.md` and `implementation-summary.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural validation | Parent + child markdown integrity | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog --recursive` |
| Placeholder integrity | Ensure no unresolved template markers in phase 021 | `rg -n "\\[NAME\\]|\\[YYYY-MM-DD\\]|\\[###-feature-name\\]|\\[path\\]" 021-remediation-revalidation/*.md` |
| Runtime-test remediation evidence (provided) | Timeout stabilization confidence | `npx vitest run tests/file-watcher.vitest.ts tests/chunk-thinning.vitest.ts` and shuffled-order equivalent (reported PASS) |
| Suite health snapshot (provided) | Broad regression confidence | `npm run check:full` (reported PASS) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mcp_server/tests/chunk-thinning.vitest.ts` timeout change (`60_000`) | Internal evidence | Green | Phase 021 cannot truthfully assert timeout remediation |
| `.opencode/skill/system-spec-kit/mcp_server/tests/README.md` placeholder-suite wording update | Internal evidence | Green | Coverage-drift narrative cannot be reconciled |
| Feature-catalog wording updates across phases 001-018 | Internal evidence | Green | Parent synthesis remains stale and ungrounded |
| Spec validator script | Internal tooling | Green | Completion quality cannot be verified |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Reconciliation edits introduce broken links, stale claims, or validation failures.
- **Procedure**: Revert phase 021 and parent markdown edits, then re-apply in this order: phase 020 pointer, parent map/tasks/synthesis, phase 021 packet, verification updates.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Reconcile) ──────► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Reconcile |
| Reconcile | Setup | Verify |
| Verify | Reconcile | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15-30 minutes |
| Reconcile Docs | Medium | 45-90 minutes |
| Verify | Low | 15-30 minutes |
| **Total** | | **75-150 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - N/A (markdown-only)
- [x] Feature flag configured - N/A
- [x] Monitoring alerts set - N/A

### Rollback Procedure
1. Restore prior versions of parent docs and phase 021 packet.
2. Restore phase 020 `Next Phase` metadata if needed.
3. Re-run recursive validator to confirm baseline integrity.
4. Re-apply reconciliation edits with verification after each logical group.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
