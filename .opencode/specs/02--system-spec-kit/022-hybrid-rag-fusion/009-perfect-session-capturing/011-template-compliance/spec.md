---
title: "Feature Specification: Template Compliance"
description: "Repo-aligned hardening for live template comparison, stricter structural validation, and inline scaffold prompt enforcement."
trigger_phrases:
  - "template compliance"
  - "spec templates"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: Template Compliance

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


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
| **Created** | 2026-03-16 |
| **Completed** | 2026-03-17 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 11 |
| **Predecessor** | [010-integration-testing](../010-integration-testing/spec.md) |
| **Successor** | [012-auto-detection-fixes](../012-auto-detection-fixes/spec.md) |
| **Handoff Criteria** | validate.sh + test suite passing |
| **R-Item** | R-12 follow-up |
| **Sequence** | 012 |
<!-- /ANCHOR:metadata -->

---

### Phase Context

This is **Phase 12** of the Perfect Session Capturing specification.

**Scope Boundary**: The deferred R-12 work still relied on draft assumptions that do not match the current repo.
**Dependencies**: 010-integration-testing
**Deliverables**: Added one shared runtime helper that derives required headers and anchors from templates; promoted TEMPLATE_HEADERS structural failures to normal validator errors
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deferred R-12 work still relied on draft assumptions that do not match the current repo: there are no checked-in `.fingerprint` sidecars, the validator only partially enforced template structure, and runtime speckit prompts mostly pointed at template paths instead of carrying inline structure for the exact document being written. That gap let structurally invalid spec docs drift through normal validation and made post-write strict validation unreliable for agent workflows.

### Purpose
Use the live template files as the single source of truth for required header and anchor order, promote real structural drift to validator errors, and harden every active speckit runtime/workflow surface so generated docs are written from inline scaffolds and checked with `validate.sh --strict` immediately after writing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add one shared runtime helper that derives required headers and anchors from `templates/level_1`, `level_2`, `level_3`, and `level_3+`
- Use that helper in `check-template-headers.sh` and `check-anchors.sh`
- Promote `TEMPLATE_HEADERS` structural failures to normal validator errors in `validate.sh`
- Update runtime speckit agents and `/spec_kit` plan, implement, and complete workflow assets to include inline scaffolds plus strict post-write validation
- Add template-compliant fixtures and targeted shell/Vitest coverage for compliant, warning, and failure cases

### Out of Scope
- Adding or checking in `.fingerprint` sidecar files
- Rewriting the parent `010` phase set beyond this child phase
- Inventing a new Codex runtime speckit file when no repo-local or home-directory definition exists
- Semantic field validation beyond current structural/template compliance

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skill/system-spec-kit/scripts/utils/template-structure.js | Create | Shared live template contract parser/comparator |
| .opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh | Modify | Fail on missing/out-of-order required headers, warn on extra custom headers |
| .opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh | Modify | Compare ordered required anchors against live template contracts |
| .opencode/skill/system-spec-kit/scripts/spec/validate.sh | Modify | Treat `TEMPLATE_HEADERS` as an error in normal validation |
| OpenCode runtime speckit agent docs in `.opencode/agent/` plus `.agents/agents/` | Modify | Inline scaffold and strict post-write validation rules |
| Claude and Gemini runtime speckit agent docs | Modify | Match runtime prompt contract with inline scaffolds and strict validation |
| .opencode/command/spec_kit/assets/spec_kit_{plan,implement,complete}_{auto,confirm}.yaml | Modify | Embed scaffold contracts and `validate.sh --strict` post-write steps |
| System-spec-kit fixture and test lanes under `.opencode/skill/system-spec-kit/scripts/` | Create/Modify | Add compliant and mutated fixtures plus targeted test coverage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Live template structure derives from the active template files at runtime | `template-structure.js` resolves headers/anchors from `SPECKIT_LEVEL` + basename without `.fingerprint` files |
| REQ-002 | Structural header drift fails validation in normal mode | Missing/out-of-order required headers return validator exit code 2 through `TEMPLATE_HEADERS` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Ordered required anchors come from the same live contract source | Missing/out-of-order required anchors fail `ANCHORS_VALID` using the shared helper |
| REQ-004 | Active speckit runtime prompts include inline scaffolds and strict post-write validation | `.agents`, OpenCode x2, Claude, and Gemini speckit docs plus plan/implement/complete YAML assets reference inline scaffolds and `validate.sh [SPEC_FOLDER] --strict` |
| REQ-005 | Template compliance coverage includes compliant, warning, and failure fixtures | Shell/Vitest coverage exists for compliant docs, extra custom sections, missing/reordered headers, missing/reordered anchors, and checklist format enforcement |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh` passes on a template-compliant Level 2 fixture with zero warnings, and `validate.sh --strict` also passes.
- **SC-002**: Missing or reordered required headers/anchors fail with exit code 2 and point back to the active template contract.
- **SC-003**: Extra custom sections warn without failing in normal mode, but fail under `--strict`.
- **SC-004**: Runtime speckit prompts now carry inline scaffold guidance across `.agents`, OpenCode x2, Claude, and Gemini surfaces; no separate Codex speckit file is falsely claimed.

### Acceptance Scenarios
- **Given** a compliant Level 2 spec folder using the active level templates, **when** `validate.sh --strict` runs, **then** `TEMPLATE_HEADERS` and `ANCHORS_VALID` both pass without warnings.
- **Given** a spec document with a missing required template section, **when** normal validation runs, **then** `TEMPLATE_HEADERS` fails with exit code 2.
- **Given** a spec document with required anchors out of template order, **when** validation runs, **then** `ANCHORS_VALID` fails against the live template contract.
- **Given** an agent-authored spec document created through `/spec_kit`, **when** the writing step completes, **then** the workflow reruns strict validation before allowing the phase to continue.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Active level templates remain the source of truth | High | Compare only against live template files and keep helper logic centralized |
| Risk | Optional template sections or nested anchors get mislabeled as custom drift | Medium | Allow optional template headers and all template anchor IDs through the shared contract |
| Risk | Strict post-write validation blocks runtime workflows if legacy warning rules misfire on compliant docs | Medium | Align fixture content and stale section heuristics so a compliant fixture passes `--strict` |
| Risk | Codex runtime parity is assumed without a file on disk | Low | Explicitly record that no separate Codex speckit file exists in the repo or `/Users/michelkerkmeester/.codex` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Shared template parsing must stay lightweight enough for validator invocations across single folders and test fixtures without introducing noticeable CLI latency.
- **NFR-P02**: Prompt/workflow hardening must reuse existing assets and avoid duplicating full template catalogs in multiple runtime surfaces.

### Security
- **NFR-S01**: Template compliance checks must remain read-only with no dynamic execution of template content.
- **NFR-S02**: Runtime prompt updates must not fabricate unsupported agent surfaces just to satisfy parity expectations.

### Reliability
- **NFR-R01**: Header and anchor validation must derive from the same runtime contract so the rules cannot silently drift apart.
- **NFR-R02**: Compliant fixture coverage must prove stable pass behavior before stricter validation is enforced in authoring workflows.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. L2: EDGE CASES

### Data Boundaries
- Empty optional template blocks: optional Level 2 headers can be absent without becoming structural failures.
- Nested anchor sets in templates: allowed template anchor IDs must not be mislabeled as custom drift.
- Decision-record naming variance: ADR and DR header patterns must both validate when the runtime resolves that template.

### Error Scenarios
- Missing required header: fail immediately in normal validation instead of warning-only behavior.
- Reordered required anchor: fail using the live template sequence rather than pair-balance checks alone.
- Bare markdown filename references in phase docs: keep wording validator-safe so spec-doc integrity does not fail on false positives.

### State Transitions
- Pre-hardening fixture lanes: legacy minimalist fixtures may continue to exist, but template-compliance coverage must run through the compliant/mutation lane.
- Post-write workflow step: strict validation must run after authoring and block downstream indexing or completion if structure drifts.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 19/25 | Touches validator rules, shared runtime parsing, workflow assets, agent guidance, and fixture/test coverage |
| Risk | 17/25 | Structural validation affects authoring workflows and validator exit behavior, so regressions would be user-visible |
| Research | 11/20 | Required review of parent/phase docs, existing templates, and all active runtime prompt surfaces |
| **Total** | **47/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The draft references to `.fingerprint` storage and `delegation-prompt-builder.ts` were removed in favor of the runtime surfaces that actually exist.
<!-- /ANCHOR:questions -->
