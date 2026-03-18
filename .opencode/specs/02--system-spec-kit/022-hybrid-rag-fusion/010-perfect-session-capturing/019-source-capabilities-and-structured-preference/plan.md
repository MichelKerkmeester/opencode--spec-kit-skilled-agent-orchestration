---
title: "Implementation Plan: Source Capabilities And Structured Preference [template:level_1/plan.md]"
description: "Capture the shipped capability model and the preference for structured inputs over stateless transcript fallback."
trigger_phrases:
  - "implementation"
  - "plan"
  - "phase 019"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Source Capabilities And Structured Preference

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and Markdown |
| **Framework** | system-spec-kit session-capturing pipeline |
| **Storage** | Phase-local docs plus feature-catalog/playbook references |
| **Testing** | Focused contamination and CLI-authority Vitest coverage |

### Overview
Phase `019` documents the current source-capability contract. The plan is to preserve one clear rule: when a caller can provide curated structured session data, `--stdin` or `--json` is preferred, while direct positional mode remains the supported stateless fallback.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Runtime capability model already shipped.
- [x] Structured-input preference already shipped.

### Definition of Done
- [x] The phase spec records the capability model and structured preference.
- [x] The summary records the fallback rule honestly.

---

## 3. ARCHITECTURE

### Pattern
Capability-driven source policy with structured-input preference.

### Key Components
- **Source capability registry**: describes each supported source
- **Contamination policy**: uses capabilities for severity downgrades
- **CLI help and docs**: describe structured input as preferred

### Data Flow
Caller/source -> capability lookup -> contamination and input-mode policy -> documented save-path guidance.

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Policy Capture
- [x] Document the capability registry.
- [x] Document the contamination-policy change.

### Phase 2: Save-Path Guidance
- [x] Document the preference for structured `--stdin` / `--json`.
- [x] Document direct mode as fallback.

### Phase 3: Documentation Sync
- [x] Link the feature catalog and manual playbook to the same policy.

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Capability lookup and contamination policy | Vitest |
| CLI parity | `--stdin` / `--json` target resolution | Vitest |
| Documentation | Feature-catalog and playbook alignment | Parent/phase sync |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `source-capabilities.ts` | Internal | Green | Phase would lose its policy anchor |
| Updated CLI help text | Internal | Green | Structured preference would be under-documented |

---

## 7. ROLLBACK PLAN

- **Trigger**: The capability model changes and phase `019` falls out of sync.
- **Procedure**: Update this phase and the feature catalog/playbook together, then rerun validation.
