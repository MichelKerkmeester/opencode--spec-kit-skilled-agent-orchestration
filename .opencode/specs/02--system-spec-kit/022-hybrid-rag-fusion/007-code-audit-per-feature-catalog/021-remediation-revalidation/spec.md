---
title: "Feature Specification: remediation-revalidation [template:level_2/spec.md]"
description: "Phase 021 reconciles parent audit documentation with already-applied remediation fixes in tests and feature-catalog coverage wording."
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
trigger_phrases:
  - "remediation"
  - "revalidation"
  - "chunk thinning timeout"
  - "stale parent synthesis"
  - "legacy compatibility coverage"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: remediation-revalidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-03-13 |
| **Branch** | `021-remediation-revalidation` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../020-feature-flag-reference/spec.md |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Key remediation fixes were already applied outside the spec folder, but parent audit documentation remained stale and partially contradictory. Specifically, parent synthesis still presented the older 41/106/33 snapshot as current truth, parent task state remained outdated, and phase navigation did not link phase 020 to the new remediation phase.

### Purpose
Make phase 021 the canonical reconciliation record by documenting the already-applied remediation work (timeout stabilization, README coverage wording update, and feature-catalog coverage drift fixes) and aligning parent docs to current repository reality.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update phase 021 docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) so they match actual repository state.
- Update parent docs (`../spec.md`, `../plan.md`, `../tasks.md`, `../synthesis.md`) to include phase 021 and remove stale parent-state reporting.
- Update phase 020 metadata so `Next Phase` points to phase 021.
- Document already-applied remediation outcomes:
  - `tests/chunk-thinning.vitest.ts` R7 timeout increased to `60_000`,
  - `.opencode/skill/system-spec-kit/mcp_server/tests/README.md` and related catalog entries treat `incremental-index.vitest.ts` as supplemental legacy compatibility coverage,
  - feature-catalog updates across phases 001-018 keep `incremental-index-v2.vitest.ts` as the primary behavioral suite and `incremental-index.vitest.ts` as supplemental compatibility coverage.

### Out of Scope
- New code changes outside the spec folder in this phase.
- Re-auditing raw per-feature evidence outside the finalized post-remediation recount ledger.
- Edits outside `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/021-remediation-revalidation/spec.md` | Modify | Align phase 021 requirements and scope with current remediation reality |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/021-remediation-revalidation/plan.md` | Modify | Align implementation plan to factual remediation evidence and verification |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/021-remediation-revalidation/tasks.md` | Modify | Remove over-claims and track truthful completion state |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/021-remediation-revalidation/checklist.md` | Modify | Sync checklist evidence and verification results to actual work |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/021-remediation-revalidation/implementation-summary.md` | Modify | Replace template residue and record factual completion/verification |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/spec.md` | Modify | Keep parent scope/requirements aligned with phase 021 |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/plan.md` | Modify | Keep parent execution and verification state aligned |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/tasks.md` | Modify | Replace stale unchecked baseline with current remediation task state |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/synthesis.md` | Modify | Mark old metrics historical and point current truth to phase 021 |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/020-feature-flag-reference/spec.md` | Modify | Set `Next Phase` metadata to phase 021 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document chunk-thinning timeout remediation with reproducible evidence | Spec package references `60_000` timeout change and the two PASS Vitest command outcomes supplied for ordered/shuffled runs |
| REQ-002 | Remove stale parent-state claims | Parent `../tasks.md` and `../synthesis.md` no longer present stale state as current truth |
| REQ-003 | Preserve phase navigation integrity | Parent phase map includes phase 021 and phase 020 `Next Phase` points to phase 021 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Reflect legacy-suite coverage wording remediation | Phase 021 docs capture README and feature-catalog wording alignment for primary behavioral coverage vs supplemental compatibility coverage |
| REQ-005 | Keep phase 021 free of template placeholders | No unresolved template tokens remain in `021-remediation-revalidation/*.md` |
| REQ-006 | Record real verification outcomes | If validation is run, record actual result; if not run, explicitly state not run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 021 and parent docs tell one consistent story about completed remediation work and remaining reconciliation tasks.
- **SC-002**: Old 41/106/33 metrics are preserved only as historical context, not current executive truth.
- **SC-003**: Navigation chain across parent -> phase 020 -> phase 021 is valid.
- **SC-004**: No template placeholders remain in phase 021 completion artifacts.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:acceptance-scenarios -->
## 6. ACCEPTANCE SCENARIOS

1. **Given** remediation fixes exist in repository tests, **When** phase 021 docs are reviewed, **Then** timeout stabilization evidence is documented without claiming new code edits in this phase.
2. **Given** legacy compatibility coverage labeling changed in test docs, **When** coverage drift notes are reviewed, **Then** README and feature-catalog wording alignment is explicit.
3. **Given** parent synthesis previously presented stale totals as current, **When** `../synthesis.md` is read, **Then** those totals are clearly labeled historical/superseded.
4. **Given** phase navigation requirements, **When** phase 020 metadata is checked, **Then** `Next Phase` points to `../021-remediation-revalidation/spec.md`.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | External remediation evidence accuracy | Incorrect evidence statements would mislead parent reconciliation | Cite file-level repository checks and explicitly label provided command evidence |
| Risk | Legacy metrics interpreted as current | Stakeholders may prioritize from stale counts | Mark old snapshot as superseded/historical in synthesis and point to phase 021 |
| Risk | Over-claiming validation completion | False quality signal in checklist and summary | Record only actually executed validation commands/results |
| Risk | Template residue in completion docs | Validation quality and readability degrade | Run placeholder scan over phase 021 markdown files |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Parent + phase 021 docs should allow reviewers to confirm remediation state in one pass.
- **NFR-P02**: Verification evidence should remain concise and reproducible.

### Security
- **NFR-S01**: No secrets or sensitive runtime data introduced in documentation.
- **NFR-S02**: Commands referenced in docs avoid destructive repository actions.

### Reliability
- **NFR-R01**: Completion claims in checklist/summary must be traceable to observed evidence.
- **NFR-R02**: Parent synthesis must remain stable under future phase additions by preserving historical labeling.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: If a remediation stream had no changes, docs must explicitly mark it as unchanged/no-op.
- Maximum length: Parent synthesis should remain readable while preserving required historical context.
- Invalid format: Any broken frontmatter/anchor/template markers must be corrected before final verification.

### Error Scenarios
- External service failure: N/A for this documentation-only phase.
- Network timeout: N/A for local repository state verification.
- Concurrent access: Re-read modified docs before final verification if files change mid-session.

### State Transitions
- Partial completion: Mark verification tasks pending until commands are actually run.
- Session expiry: Phase 021 tasks/checklist must remain sufficient to resume reconciliation safely.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 10 coordinated markdown files across parent + child + adjacent phase |
| Risk | 20/25 | High risk of stale-truth reporting if not reconciled carefully |
| Research | 13/20 | Requires repository evidence checks outside spec folder plus doc synchronization |
| **Total** | **53/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. `tests/feature-flag-reference-docs.vitest.ts` now serves as recorded verification evidence for this closeout pass.
<!-- /ANCHOR:questions -->
