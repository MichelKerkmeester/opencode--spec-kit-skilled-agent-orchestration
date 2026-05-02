---
title: "Spec: deep-review CP-Scenario Authoring (003)"
description: "Sub-phase under 062-deep-loop-command-flow-stress-tests. Apply 060/004 methodology."
trigger_phrases:
  - "003-deep-review-cp-scenarios"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/062-deep-loop-command-flow-stress-tests/003-deep-review-cp-scenarios"
    last_updated_at: "2026-05-02T19:30:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Scaffolded sub-phase"
    next_safe_action: "dispatch_cp_scenario_authoring"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-062-2026-05-02"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: deep-review CP-Scenario Authoring (003)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-05-02 |
| **Branch** | `main` |
| **Parent** | 062-deep-loop-command-flow-stress-tests |
| **Target** | `/spec_kit:deep-review` + `@deep-review` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Author 6 CP-XXX scenarios for the @deep-review command flow.

The 060/004 methodology proved that LEAF agents with command-orchestrator architecture (like @improve-agent) need command-flow stress, not body-prepend stress. `@deep-review` shares this architecture; this sub-phase applies the methodology.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 6 CP-XXX scenarios authored in `.opencode/skill/sk-deep-review/manual_testing_playbook/`
- Per-CP signal contracts (grep-checkable artifacts/journals)
- Sandbox helper script (setup-cp-sandbox.sh) for sub-phase 002
- Pass the 13-question authoring preflight from 060/003 §7 for each CP

### Out of Scope
- Changes to the deep-review agent body (already promoted in 061/008)
- Changes to /spec_kit:deep-review command body (out of stress-test scope)
- Changes to sk-improve-agent substrate (locked at 060/005)


<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
| ID | Requirement |
|---|---|
| REQ-001 | 6 CP-XXX scenarios authored, each passing 13-question preflight |
| REQ-002 | Per-CP signal contracts machine-checkable (grep, file existence, exit code) |
| REQ-003 | setup-cp-sandbox.sh idempotent + 4-runtime mirror skeleton

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 6 CPs landed under `.opencode/skill/sk-deep-review/manual_testing_playbook/`
- **SC-002**: setup-cp-sandbox.sh executes cleanly, builds isolated /tmp/cp-NNN-sandbox/
- **SC-003**: Each CP has clear bash block + signal contract

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | 060/004 methodology | Required reference | Re-read 060/004 spec + plan + tasks before starting |
| Risk | Sandbox auth gotcha | cli-copilot's `--sandbox workspace-write` doesn't inherit copilot keyring | Run stress dispatches from main session, per 060/004's documented gotcha |
| Risk | CP body-vs-command misclassification | Repeats 060/002 R1 = 0/2/4 mistake | Apply per-CP layer partition explicitly per 060/004 ADR |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Use cli-copilot (proven for 060/004) or try cli-codex for variance?
- Run sub-phases sequentially or 001+003 in parallel (both authoring) then 002+004?

<!-- /ANCHOR:questions -->
