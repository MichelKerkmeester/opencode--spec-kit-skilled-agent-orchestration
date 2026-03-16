---
title: "Feature Specification: Template Compliance"
---
# Feature Specification: Template Compliance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent** | [010-perfect-session-capturing](../spec.md) |
| **R-Item** | R-12 |
| **Sequence** | B5 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

External agents (Copilot, Gemini) deviate from spec-kit templates because `validate.sh` checks syntax (anchor pairs balanced) not semantics (correct headers, correct anchors, correct format). 18 validation rules exist but none compare generated content against template structure. The existing `check-template-headers.sh` rule and required-anchor extension from the R-12 partial implementation only WARN on deviations -- they do not block structurally invalid output. Additionally, delegation prompts reference template paths rather than inlining template content, so agents that lack filesystem access generate from memory rather than from the actual template.

### Purpose

Generate template structural fingerprints for automated comparison, inline template content in delegation prompts, and add a post-agent validation gate so that structurally non-compliant spec docs are caught and rejected before indexing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Generate structural fingerprints (header sequence + anchor sequence) from each template file under `templates/`
- Add fingerprint comparison mode to `check-anchors.sh` that validates generated files against their template's fingerprint
- Upgrade `check-template-headers.sh` from WARN to ERROR for critical structural deviations (missing required headers, wrong header order)
- Add post-agent validation gate to `validate.sh` (`--strict` mode) that runs fingerprint comparison after any agent creates spec docs
- Ensure delegation prompts inline template content rather than referencing template paths only

### Out of Scope

- Changing template content or adding new templates -- only fingerprinting existing templates
- Semantic validation of field values (e.g., checking that dates are valid) -- only structural compliance
- Modifying how agents are invoked -- only what content is included in the prompt

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/validators/check-template-headers.sh` | Modify | Upgrade critical deviations from WARN to ERROR; add header-order validation |
| `scripts/validators/check-anchors.sh` | Modify | Add `--fingerprint` mode that compares generated file anchor sequence against template fingerprint |
| `scripts/validators/validate.sh` | Modify | Add `--strict` flag triggering post-agent fingerprint validation gate |
| `templates/` | Modify | Generate and store `.fingerprint` sidecar files (header + anchor sequence) for each template |
| `scripts/lib/delegation-prompt-builder.ts` | Modify | Inline full template content in delegation prompts instead of path references (REQ-003) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template structural fingerprint generated from each template file: ordered list of headers and ordered list of ANCHOR open/close pairs | Running `generate-fingerprint.sh templates/core/spec-core.md` produces a `.fingerprint` file listing header sequence and anchor sequence |
| REQ-002 | Validation compares generated file fingerprint against its template fingerprint | `check-anchors.sh --fingerprint spec.md` exits non-zero when anchor sequence differs from the template declared in `SPECKIT_TEMPLATE_SOURCE` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Delegation prompts include inline template content, not just path references | Delegation prompt builder embeds full template markdown when dispatching to external agents |
| REQ-004 | Post-agent validation gate: `validate.sh --strict` runs fingerprint comparison after any agent creates spec docs | `validate.sh --strict` returns non-zero when generated docs have structural deviations from their template |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Generated spec docs structurally match their templates -- header sequence and anchor sequence validated automatically with zero false negatives on compliant files
- **SC-002**: Structural deviations (missing headers, reordered anchors, dropped sections) are caught automatically before indexing, with ERROR-level output
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None -- builds on existing R-12 partial implementation | N/A | check-template-headers.sh and required-anchor checks already exist; this phase hardens them |
| Risk | Fingerprint comparison may be too strict for templates with optional sections | Medium | Fingerprint marks optional sections explicitly; comparison only enforces required header/anchor pairs |
| Risk | Inlining full template content in delegation prompts increases prompt size | Low | Templates are ~80-120 lines; well within context limits for all supported agents |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **OQ-001**: Which file owns delegation prompt construction? Candidates: `scripts/lib/delegation-prompt-builder.ts` (if it exists) or the workflow orchestrator that dispatches to external agents. Needs confirmation before REQ-003 implementation.
<!-- /ANCHOR:questions -->
