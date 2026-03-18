---
title: "Feature Specification: Live Proof And Parity Hardening [template:level_1/spec.md]"
description: "Define the remaining retained live-proof and parity-hardening work needed before the parent pack can claim current end-to-end CLI closure."
trigger_phrases:
  - "phase 020"
  - "live proof"
  - "parity hardening"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Live Proof And Parity Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + phase-child-header | v2.2 -->

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 20 of 20 |
| **Predecessor** | 019-source-capabilities-and-structured-preference |
| **Successor** | Parent closeout |
| **Handoff Criteria** | Retained live artifacts are refreshed and the parent pack can truthfully claim current multi-CLI proof. |

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-03-18 |
| **Branch** | `010-perfect-session-capturing/020-live-proof-and-parity-hardening` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
Automated parity is stronger after phases `018` and `019`, but the repo still does not have the refreshed retained live artifacts needed to claim current end-to-end CLI proof across supported modes. Without a dedicated phase, that gap is easy to understate.

### Purpose
Define the remaining live-proof and parity-hardening work so future operators can close the loop honestly.

---

## 3. SCOPE

### In Scope
- Retained live artifacts for supported CLI/runtime paths
- Direct stateless, structured `--stdin`, and structured `--json` proof scenarios
- Same-minute repeated-save proof expectations
- Parent proof-boundary closeout criteria

### Out of Scope
- Re-describing the already-shipped runtime contract from phases `018` and `019`
- Reopening earlier audit findings unless the live proof contradicts them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/research/live-cli-proof-*.json` | Modify/Create | Refresh retained live proof artifacts |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modify | Keep scenario expectations aligned with the live-proof bar |
| `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md` | Modify | Upgrade proof status only when retained artifacts exist |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Refresh retained live CLI artifacts | Supported CLI/runtime paths have current retained proof |
| REQ-002 | Cover all supported save modes | Direct stateless, `--stdin`, and `--json` are represented where applicable |
| REQ-003 | Keep closeout claims conservative until artifacts exist | The parent pack stays in-progress until retained proof is refreshed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Reconfirm same-minute save hardening in live or manual proof | The proof set includes unique-filename and metadata-stability expectations |
| REQ-005 | Reconfirm successful flows stay free of template-data warning noise | The retained proof does not rely on noisy “successful” saves |

---

## 5. SUCCESS CRITERIA

- **SC-001**: Phase `020` names the exact remaining proof bar.
- **SC-002**: The parent pack does not claim current full CLI closure until phase `020` is complete.
- **SC-003**: A future operator can resume the live-proof refresh directly from this phase.

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Access to supported CLI/runtime environments | High | Keep the phase open until real artifacts exist |
| Risk | Automated parity is mistaken for retained live proof | High | Keep the phase and parent pack explicitly in-progress |

---

## 7. OPEN QUESTIONS

- Which supported CLI/runtime environments are available for the next live-proof refresh pass?
