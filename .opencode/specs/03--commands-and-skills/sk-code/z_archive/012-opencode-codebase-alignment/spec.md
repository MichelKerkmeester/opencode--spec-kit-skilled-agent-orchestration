---
title: "Feature Specification: OpenCode Codebase Alignment [012-opencode-codebase-alignment/spec]"
description: "Align OpenCode implementation files in TypeScript, JavaScript, Python, Shell, JSON, and JSONC to the standards defined by .opencode/skill/sk-code--opencode with a behavior-prese..."
trigger_phrases:
  - "feature"
  - "specification"
  - "opencode"
  - "codebase"
  - "alignment"
  - "spec"
  - "031"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: OpenCode Codebase Alignment

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Align OpenCode implementation files in TypeScript, JavaScript, Python, Shell, JSON, and JSONC to the standards defined by `.opencode/skill/sk-code--opencode` with a behavior-preserving, KISS-first approach. The work is intentionally limited to consistency, correctness, and bug fixes discovered during alignment, with no feature expansion.

**Key Decisions**:
- Keep runtime behavior unchanged; style and structure changes must be non-semantic.
- Fix only defects discovered during alignment that are directly in touched files.
- Prioritize the smallest safe change set per file before any broader cleanup.

**Critical Dependencies**:
- `.opencode/skill/sk-code--opencode` as the normative standard.
- Existing test and validation commands for each language stack.
- Maintainer review for any standard-vs-reality mismatch before changing skill guidance.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-02-16 |
| **Updated** | 2026-02-16 |
| **Parent Spec** | `005-workflows-code-opencode` |
| **Target Languages** | TypeScript, JavaScript, Python, Shell, JSON, JSONC |
| **Change Intent** | Standards alignment + bug fixes found during alignment, behavior preserved |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
OpenCode scripts and runtime code were built over time across multiple languages, while the unified standards skill was defined later. This has created uneven style, inconsistent structure, and avoidable defects in touched areas, which increases review effort and weakens trust that code and documented standards match.

### Purpose
Deliver one standards-aligned codebase surface for TypeScript, JavaScript, Python, Shell, JSON, and JSONC that preserves behavior, removes consistency debt, and fixes bugs discovered in-scope during alignment.

### Objectives
1. Reach enforceable consistency with `.opencode/skill/sk-code--opencode` for touched files.
2. Preserve runtime behavior and external contracts for all modified components.
3. Resolve in-scope defects found during alignment without introducing side work.
4. Keep implementation simple, local, and easy to review.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Code and script files in OpenCode-owned paths that use `.ts`, `.tsx`, `.js`, `.mjs`, `.cjs`, `.py`, `.sh`, `.json`, `.jsonc`.
- Alignment of headers, structure, naming, comments, error-handling style, and config conventions per skill standards.
- Bug fixes found while aligning touched files when the fix is required to keep behavior correct and verifiable.
- Minimal test/verification updates required only when existing checks break due to corrected defects.

### Out of Scope
- New product features, architectural rewrites, or unrelated refactors.
- Dependency upgrades, tooling migrations, or introducing new frameworks.
- Reformatting untouched files solely for visual consistency.
- Third-party, generated, vendored, build artifact, or cache directories.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/**/*.ts` | Modify | Standards alignment + behavior-preserving cleanup + in-scope bug fixes |
| `.opencode/**/*.js` | Modify | Standards alignment + behavior-preserving cleanup + in-scope bug fixes |
| `.opencode/**/*.py` | Modify | Standards alignment + behavior-preserving cleanup + in-scope bug fixes |
| `.opencode/**/*.sh` | Modify | Standards alignment + behavior-preserving cleanup + in-scope bug fixes |
| `.opencode/**/*.json` | Modify | Config alignment and key/style normalization where safe |
| `.opencode/**/*.jsonc` | Modify | Config alignment and comment/section normalization where safe |
| `.opencode/skill/sk-code--opencode/**/*` | Modify (only if needed) | Correct standard docs when verified code reality conflicts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Behavior preservation | Existing checks pass for every changed area; no intended runtime behavior changes |
| REQ-002 | Scope discipline | Every change maps to alignment or in-scope bug fix; no unrelated edits |
| REQ-003 | TypeScript alignment | Touched TS files follow standards for structure, naming, imports, error handling, and docs |
| REQ-004 | JavaScript alignment | Touched JS files follow standards for strict mode, naming, headers/sections, exports, and docs |
| REQ-005 | Python alignment | Touched Python files follow standards for naming, docstrings, typing usage, and error handling |
| REQ-006 | Shell alignment | Touched Shell files follow standards for strict mode, quoting, naming, and logging patterns |
| REQ-007 | JSON/JSONC alignment | Touched config files follow key naming, ordering, comment, and section conventions |
| REQ-008 | Bug-fix policy | Defects discovered during alignment are fixed if in touched files and validated by tests or reproducible checks |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Standards evidence trail | Each batch documents which standards were enforced and where |
| REQ-010 | Skill correction loop | Verified mismatches between standards and proven best practice are captured and reconciled |
| REQ-011 | Reviewability | Changes remain small enough for focused review and rollback |
| REQ-012 | KISS enforcement | No new abstractions unless needed to preserve clarity or correctness |

### P2 - Optional (can defer)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-013 | Extra lint hardening | Add or tighten linting only where directly supporting adopted standards |
| REQ-014 | Contributor examples | Add concise examples to standards docs for recurring alignment patterns |
| REQ-015 | Automation expansion | Introduce repeatable alignment checks for future drift prevention |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All touched files in TS/JS/PY/SH/JSON/JSONC conform to the active standards set.
- **SC-002**: No accepted change introduces a deliberate behavior difference in runtime or public contract.
- **SC-003**: Each discovered in-scope defect in touched files is fixed or explicitly deferred with rationale.
- **SC-004**: Verification commands for impacted areas pass before completion is claimed.
- **SC-005**: Reviewers can map every change to one of: alignment, defect correction, or required verification adjustment.
- **SC-006**: Any standards-doc updates remain consistent with validated production code patterns.

### Acceptance Scenarios

1. **Behavior Preservation Across Touched Paths**
   - **Given** a batch that updates `.opencode/agent/context.md` support code and one `.opencode/skill` helper script,
   - When the same pre-change command sequence is run after alignment,
   - Then outputs, exit codes, and side effects remain unchanged except for corrected in-scope defects.

2. **Language-Specific Standards Alignment Validation**
   - **Given** one touched file in each language group (`.ts/.js/.py/.sh/.json/.jsonc`),
   - When each file is reviewed against `.opencode/skill/sk-code--opencode` standards,
   - Then naming, structure, error-handling style, strictness/config conventions, and documentation patterns match the language-specific rules.

3. **Bug-Fix Safety in Alignment Scope**
   - **Given** a defect discovered while aligning a touched shell script,
   - When the fix is applied,
   - Then a reproducible failing case is demonstrated before the fix, a passing case is demonstrated after the fix, and no unrelated file is modified.

4. **Verification Gate Enforcement Before Completion Claim**
   - **Given** a completed language-scoped batch,
   - When completion is proposed,
   - Then required impacted checks run first, all required gates pass, and the batch is blocked from completion if any required gate fails.

5. **No Contract Breaks for Public Interfaces**
   - **Given** a touched module exporting a command, script entrypoint, or configuration contract used by other workflows,
   - When alignment changes are applied,
   - Then command signatures, input/output contract shape, expected file paths, and integration call points remain backward-compatible.

6. **Memory/Context Save for Session Continuity**
   - **Given** a major alignment milestone or session stop point,
   - When context is saved,
   - Then memory is generated via `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]` and records decisions, verification evidence location, open risks, and next-step handoff state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Standards source (`sk-code--opencode`) | High | Use as baseline and log any conflict before changing docs |
| Dependency | Existing test/verification commands | High | Run per impacted area before completion claim |
| Dependency | Maintainer review availability | Medium | Keep batches small and independently verifiable |
| Risk | Hidden semantic drift during style edits | High | Restrict to local edits, compare behavior, run targeted checks |
| Risk | Scope creep from opportunistic cleanup | Medium | Reject unrelated edits and track separately |
| Risk | Regression from bug fix side effects | High | Reproduce, patch minimally, verify exact failing path |
| Risk | Cross-language inconsistency in standards interpretation | Medium | Apply per-language references and document edge cases |
| Risk | Over-complex remediation | Medium | Apply KISS gate before merge; prefer smallest valid patch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Modified code remains straightforward to read and reason about.
- **NFR-M02**: No new deep abstraction layers are introduced for style-only goals.

### Reliability
- **NFR-R01**: Post-change execution paths for touched areas remain stable.
- **NFR-R02**: Error handling remains explicit and testable.

### Performance
- **NFR-P01**: No measurable performance degradation is intentionally introduced.

### Governance
- **NFR-G01**: Every batch records verification evidence before merge readiness.
- **NFR-G02**: Standards/document mismatches are reconciled with traceable rationale.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Mixed-language directories where scripts call each other across TS/JS/PY/SH.
- JSONC files where comment normalization must not break tooling expectations.
- Legacy modules with intentional deviations required for compatibility.

### Error Scenarios
- Formatting updates that accidentally alter command parsing behavior in shell scripts.
- Type narrowing cleanup that changes runtime truthiness behavior in TS/JS.
- Bug fixes that reveal additional latent issues outside current touch scope.

### Handling Rules
- If behavior risk is uncertain, keep existing behavior and mark for follow-up.
- If compatibility is ambiguous, choose backward-compatible path first.
- If a bug requires wider refactor, stop and split into a separate tracked change.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 23/25 | Multi-language alignment across core operational code and scripts |
| Risk | 21/25 | High chance of accidental semantic drift without strict verification |
| Research | 14/20 | Standards exist; reconciliation required where implementation diverges |
| Multi-Agent | 9/15 | Parallel language-specific execution possible but coupled by shared standards |
| Coordination | 11/15 | Cross-language consistency + staged verification + rollback constraints |
| **Total** | **78/100** | **Level 3+ (high governance and verification needs)** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Behavior change introduced by non-functional edits | H | M | Require targeted verification and small atomic commits |
| R-002 | Bug fix in touched file causes adjacent regression | H | M | Add focused regression check for affected path |
| R-003 | Scope expansion from broad cleanup impulses | M | H | Enforce explicit in-scope mapping for each change |
| R-004 | Standards docs conflict with proven code constraints | M | M | Resolve with documented exception or standards correction |
| R-005 | JSON/JSONC edits break parser/tool assumptions | H | L | Validate consumer tooling and preserve required structure |
| R-006 | Shell quoting/strict-mode updates alter script semantics | H | M | Test command-line behavior and failure modes directly |
| R-007 | Review fatigue from large mixed-language batches | M | M | Keep batches narrow by language or subsystem |
| R-008 | Rollback complexity in large single PR | M | M | Use independent, revert-safe change groups |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Predictable Standards (Priority: P0)

**As a** contributor, **I want** touched OpenCode files to follow one language-appropriate standard, **so that** review and maintenance are predictable.

**Acceptance Criteria**:
1. **Given** a touched file, when reviewed, then it matches documented standards for its language.
2. **Given** a standards question, when checking skill docs, then the guidance matches real code patterns.

### US-002: Safe Alignment (Priority: P0)

**As a** maintainer, **I want** alignment changes to preserve behavior, **so that** reliability is not traded for style consistency.

**Acceptance Criteria**:
1. **Given** a completed batch, when verification runs, then impacted checks pass.
2. **Given** a change under review, when tracing intent, then it is either alignment or in-scope bug fix.

### US-003: KISS Execution (Priority: P1)

**As a** reviewer, **I want** minimal patches with clear intent, **so that** defects are easier to detect and rollback is safe.

**Acceptance Criteria**:
1. **Given** any patch, when inspected, then unnecessary abstraction is absent.
2. **Given** a defect fix in alignment, when examined, then fix scope is local and justified.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:execution-protocol -->
## 12. Execution Protocol & Workstream Coordination

### Autonomous Execution Model (Level 3+)
- Default operating mode is **autonomous execution** within the approved scope, with no pause required for notify-only checkpoints.
- All changes must remain behavior-preserving, KISS-first, and restricted to alignment plus in-scope defect correction.
- If a proven standards error is found, update `.opencode/skill/sk-code--opencode` docs in the same governed flow with explicit rationale.
- Autonomous execution may continue in parallel streams only while each stream remains independently testable and independently revertible.

### Workstream Boundaries (Parallel-Allowed)

| Workstream | Allowed Scope | Must Not Do | Independent Verification Minimum |
|------------|---------------|-------------|----------------------------------|
| WS-TSJS | `.opencode/**/*.ts`, `.opencode/**/*.tsx`, `.opencode/**/*.js`, `.opencode/**/*.mjs`, `.opencode/**/*.cjs` | Cross-language refactors into Python/Shell streams | Impacted lint/type/test checks for touched JS/TS paths |
| WS-PY | `.opencode/**/*.py` | API contract rewrites or shared behavior changes outside touched files | Impacted Python lint/test/command checks |
| WS-SH | `.opencode/**/*.sh` | Command behavior redesign, shell framework swaps | Script execution checks with strict-mode and failure-path validation |
| WS-CONFIG | `.opencode/**/*.json`, `.opencode/**/*.jsonc` | Key schema redesign or unrelated config migration | Consumer parse/load checks for each touched config |
| WS-STANDARDS | `.opencode/skill/sk-code--opencode/**/*` (only when fundamental mismatch is proven) | Policy expansion unrelated to validated mismatch | Cross-check doc rule against validated production behavior |

### Workstream Alias Map (Compact)

| Descriptive Workstream | Numeric Alias IDs |
|------------------------|-------------------|
| WS-TSJS | WS-1, WS-2, WS-3 |
| WS-PY | WS-4 |
| WS-SH | WS-5 |
| WS-CONFIG | WS-6 |
| WS-STANDARDS | WS-7 |

### Checkpoint Classification (Notify-Only vs Hard-Blocking)

| Checkpoint | Mode in Autonomous Execution | Required Action |
|------------|-------------------------------|-----------------|
| Spec Review | Notify-only | Post summary and continue once scope remains unchanged |
| Standards Baseline Confirmed | **Hard-blocking** | Stop until baseline is explicitly confirmed or corrected |
| Language Batch Complete (each stream) | Notify-only | Post batch diff intent + verification evidence, then continue |
| Verification Report Review | **Hard-blocking** | Stop until full verification report is reviewed and accepted |
| Launch Approval | **Hard-blocking** | Stop until explicit launch approval is recorded |
| Scope Change Detected | **Hard-blocking** | Stop, re-scope, and obtain updated approval before further edits |

### Merge and Review Flow
1. Open or update one merge unit per workstream batch with a narrow diff and explicit rollback boundary.
2. Link each changed file to one reason: standards alignment, in-scope defect fix, or required verification adjustment.
3. Run stream-local verification first, then run any required cross-stream integration checks.
4. Request review with a structured evidence bundle; unresolved hard-blocking checkpoints prevent merge.
5. Merge only when all P0 requirements and all hard-blocking checkpoints are satisfied.

### Evidence Requirements (Required for Every Batch)
- Verification command list with pass/fail outcomes and timestamps.
- File-level mapping from changed paths to requirement IDs (REQ-001 through REQ-012 as applicable).
- Defect evidence for bug fixes (repro before, validation after).
- Standards mismatch proof and correction rationale for any WS-STANDARDS updates.
- Explicit statement that behavior is preserved for touched execution paths.
<!-- /ANCHOR:execution-protocol -->

---

<!-- ANCHOR:approval-workflow -->
## 13. APPROVAL WORKFLOW

| Checkpoint | Type | Approver | Status | Date |
|------------|------|----------|--------|------|
| Spec Review | Notify-only | User | Completed | 2026-02-16 - Autonomous execution complete; evidence in checklist/tasks/implementation-summary |
| Standards Baseline Confirmed | Hard-blocking | User | Completed | 2026-02-16 - Autonomous execution complete; evidence in checklist/tasks/implementation-summary |
| Language Batch Complete (per stream) | Notify-only | User | Completed | 2026-02-16 - Autonomous execution complete; evidence in checklist/tasks/implementation-summary |
| Verification Report Review | Hard-blocking | User | Completed | 2026-02-16 - Autonomous execution complete; evidence in checklist/tasks/implementation-summary |
| Launch Approval | Hard-blocking | User | Completed | 2026-02-16 - Autonomous execution complete; evidence in checklist/tasks/implementation-summary |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## 14. COMPLIANCE CHECKPOINTS

### Process Compliance
- [x] Only in-scope files changed
- [x] Every change maps to alignment or in-scope bug fix
- [x] KISS principle applied; no unnecessary abstraction added

### Quality Compliance
- [x] Impacted checks pass after each batch
- [x] No intentional behavior changes introduced
- [x] Language standards applied consistently in touched files

### Governance Compliance
- [x] Standards/code mismatches documented and reconciled
- [x] Risk matrix reviewed before completion claim
- [x] Rollback boundaries preserved
<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## 15. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| OpenCode Maintainers | Decision makers | High | Batch review checkpoints |
| Contributors | Primary implementers | High | Standards-aligned examples |
| Reviewers | Quality gate | High | Diff-level rationale and verification evidence |
| Tooling Users | Runtime consumers | Medium | No behavior regressions |
<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## 16. CHANGE LOG

### v1.1 (2026-02-16)
**Execution governance clarification**
- Added Level 3+ section `Execution Protocol & Workstream Coordination` with autonomous model, parallel workstream boundaries, merge/review flow, and evidence requirements.
- Defined checkpoint behavior in autonomous mode by separating notify-only and hard-blocking checkpoints.
- Updated approval workflow table to align with explicit autonomy rules.

### v1.0 (2026-02-16)
**Mission-aligned rewrite**
- Reframed spec around behavior-preserving alignment and in-scope bug fixes.
- Added explicit objectives, rollback boundaries, and verification strategy.
- Tightened scope, requirements, risk controls, and KISS constraints.
<!-- /ANCHOR:changelog -->

---

<!-- ANCHOR:questions -->
## 17. OPEN QUESTIONS

- None. Current scope, standards baseline, and execution boundaries are defined for implementation start.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:rollback-boundaries -->
## 18. ROLLBACK BOUNDARIES

1. Rollback unit is one language-scoped or subsystem-scoped batch.
2. Each batch must be independently revertible without requiring follow-up fixes.
3. No batch may combine standards alignment with unrelated behavior work.
4. If a bug fix expands beyond touched-file boundaries, stop and split into a separate tracked change.
5. If verification fails post-batch and root cause is unclear, revert the batch and re-scope.
<!-- /ANCHOR:rollback-boundaries -->

---

<!-- ANCHOR:verification-strategy -->
## 19. VERIFICATION STRATEGY

### Verification Principles
- Verify at the smallest impacted scope first, then at integration scope.
- Use existing project checks; do not invent broad new gates inside this mission.
- Treat failing verification as a blocker for completion claims.

### Required Verification Sequence
1. Run language/tool-specific checks for touched areas.
2. Run impacted test suites or command-level reproducible checks.
3. Confirm no contract/behavior drift on critical execution paths.
4. Capture evidence per batch before moving to next batch.

### Completion Gate
- Completion is valid only when all P0 requirements are met and verification evidence is available for every changed batch.
<!-- /ANCHOR:verification-strategy -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Parent Spec**: See `../001-initial-set-up/spec.md`

---

<!--
AUTHORING NOTES
- This document intentionally uses fully resolved template content.
- Mission constraints applied: behavior preservation, bug fixes found in-scope, KISS-first execution.
-->
