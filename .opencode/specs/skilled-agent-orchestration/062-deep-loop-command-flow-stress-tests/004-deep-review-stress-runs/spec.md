---
title: "Spec: deep-review Stress Runs (004)"
description: "Sub-phase under 062-deep-loop-command-flow-stress-tests. Apply 060/004 methodology."
trigger_phrases:
  - "004-deep-review-stress-runs"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/062-deep-loop-command-flow-stress-tests/004-deep-review-stress-runs"
    last_updated_at: "2026-05-02T19:30:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Scaffolded sub-phase"
    next_safe_action: "extract_bash_blocks_run_R1"
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
# Spec: deep-review Stress Runs (004)

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

R1→R2→R3 stress runs against the 003-authored CP scenarios; target final PASS 6/0/0.

The 060/004 methodology proved that LEAF agents with command-orchestrator architecture (like @improve-agent) need command-flow stress, not body-prepend stress. `@deep-review` shares this architecture; this sub-phase applies the methodology.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R1 stress against the 001/003-authored CPs (extract bash blocks, run sequentially)
- Per-CP verdict file + composite score
- Triage gaps; iterate R2 with targeted edits between rounds
- R3 if needed; target composite PASS 6/0/0
- test-report.md mirroring 060/004 structure

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
| REQ-001 | All 6 CPs run end-to-end in R1 |
| REQ-002 | Verdict per CP recorded (PASS / PARTIAL / FAIL) |
| REQ-003 | If any FAIL/PARTIAL, R2 with targeted edits; re-score |
| REQ-004 | Final composite PASS 6 / PARTIAL 0 / FAIL 0 (R2 or R3)

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 CPs ran end-to-end in R1 (or R1→R2→R3)
- **SC-002**: Final composite PASS 6 / PARTIAL 0 / FAIL 0
- **SC-003**: test-report.md authored with lessons + per-CP transcripts

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
