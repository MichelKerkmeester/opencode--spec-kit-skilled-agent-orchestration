---
title: "Feature Specification: Live Proof And Parity Hardening [template:level_1/spec.md]"
description: "Track the remaining retained live-proof work after the automated runtime contract was hardened."
trigger_phrases:
  - "live proof"
  - "parity hardening"
  - "phase 020"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Live Proof And Parity Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-03-18 |
| **Branch** | `020-live-proof-and-parity-hardening` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `019-source-capabilities-and-structured-preference` |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The automated runtime contract is stronger now, but the live-proof boundary is still lagging behind it. The repo still needs refreshed retained artifacts across supported CLIs and save modes before it can honestly claim flawless current parity everywhere.

### Purpose

Track the remaining retained live-proof and parity-hardening work explicitly so universal multi-CLI claims stay gated on real evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Refresh retained live artifacts for supported CLIs and save modes.
- Keep the M-007 proof boundary aligned with the current runtime contract.
- Add any remaining parity hardening that the retained artifact review exposes.

### Out of Scope
- Reopening the completed 018/019 runtime code unless retained proof shows a real gap.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/.../020-live-proof-and-parity-hardening/*` | Modify | Track the remaining live-proof work |
| `.opencode/specs/.../research/live-cli-proof-2026-03-17.json` | Modify/Create | Refresh retained proof artifacts when rerun-backed |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modify | Keep the proof claim boundary honest |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Retained live artifacts must exist for the current contract | One retained artifact exists per supported CLI and supported save mode |
| REQ-002 | Universal parity claims must stay gated on retained evidence | Docs do not claim flawless multi-CLI parity without refreshed artifacts |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Automated and live proof surfaces must stay aligned | The playbook and retained artifacts target the same contract that automated tests prove |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Retained artifacts cover each supported CLI and save mode for the active contract.
- **SC-002**: Operator docs can make stronger parity claims without overstating the current evidence.

### Acceptance Scenarios

1. **Given** retained live artifacts are refreshed for each supported CLI and mode, **when** reviewers compare them to the automated contract, **then** parity claims can be upgraded with evidence.
2. **Given** the retained artifact set is incomplete, **when** maintainers review the parent pack and playbook, **then** the docs keep universal multi-CLI claims conservative.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Working CLI environments for each supported client | High | Capture retained artifacts only from real runnable environments |
| Risk | Docs start claiming more than the retained evidence proves | High | Keep phase `020` open until the artifact set is refreshed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the retained live-proof format evolve into one artifact per CLI/mode instead of a single aggregated file?
<!-- /ANCHOR:questions -->
