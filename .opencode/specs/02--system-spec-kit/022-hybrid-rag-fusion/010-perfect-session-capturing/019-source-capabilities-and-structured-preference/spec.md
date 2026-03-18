---
title: "Feature Specification: Source Capabilities And Structured Preference [template:level_1/spec.md]"
description: "Document the shipped typed source-capability model and the preference for structured save paths over stateless capture."
trigger_phrases:
  - "phase 019"
  - "source capabilities"
  - "structured preference"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Source Capabilities And Structured Preference

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + phase-child-header | v2.2 -->

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 19 of 20 |
| **Predecessor** | 018-runtime-contract-and-indexability |
| **Successor** | 020-live-proof-and-parity-hardening |
| **Handoff Criteria** | The capability model and structured-input preference are documented as the baseline contract before live-proof refresh. |

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-18 |
| **Branch** | `010-perfect-session-capturing/019-source-capabilities-and-structured-preference` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The earlier audit called out a tactical source-name exception around contamination handling and an implicit preference for structured input. Maintainers needed a phase-local document that explains the shipped capability registry and the explicit preference for curated `--stdin` / `--json` inputs.

### Purpose
Document the shipped source-capability model and the structured-input preference that now anchor session-capturing policy.

---

## 3. SCOPE

### In Scope
- Typed source capabilities in `scripts/utils/source-capabilities.ts`
- Capability-driven contamination policy in `scripts/extractors/contamination-filter.ts`
- Structured-input preference language in `scripts/memory/generate-context.ts`
- Focused documentation updates in the feature catalog and manual playbook

### Out of Scope
- Validation/indexing disposition work from phase `018`
- Retained live artifact refresh from phase `020`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts` | Modify/Create | Define the capability registry |
| `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts` | Modify | Use capabilities instead of source-name branching |
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | Modify | Make structured-input preference explicit |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modify | Reflect the updated scenario expectations |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define a typed source-capability registry | Sources have explicit capability metadata |
| REQ-002 | Use capabilities for contamination severity policy | Tool-title downgrade is capability-driven instead of source-name-driven |
| REQ-003 | Prefer structured save paths when curated input exists | Docs describe `--stdin` / `--json` as the preferred path |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Keep direct mode as fallback | Docs preserve direct positional spec-folder mode as supported fallback |
| REQ-005 | Keep CLI target precedence explicit | Structured-input docs say explicit CLI targets still win over payload `specFolder` |

---

## 5. SUCCESS CRITERIA

- **SC-001**: Phase `019` explains the capability registry in one place.
- **SC-002**: Phase `019` explains why structured `--stdin` / `--json` is preferred when available.
- **SC-003**: Phase `019` keeps direct positional mode documented as fallback rather than deprecated removal.

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shipped source-capability runtime | High | Document only current behavior |
| Risk | New CLI exceptions drift back into ad hoc source-name branching | Medium | Keep the capability registry documented as canonical |

---

## 7. OPEN QUESTIONS

- None. Retained live parity proof is handled in phase `020`.
