---
title: "Plan: deep-research CP-Scenario Authoring (001)"
description: "Sub-phase under 062-deep-loop-command-flow-stress-tests. Apply 060/004 methodology."
trigger_phrases:
  - "001-deep-research-cp-scenarios"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/062-deep-loop-command-flow-stress-tests/001-deep-research-cp-scenarios"
    last_updated_at: "2026-05-02T19:30:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Plan scaffolded — references 060/004 plan as source"
    next_safe_action: "Begin Phase 1"
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
# Plan: deep-research CP-Scenario Authoring (001)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Direct adaptation of `060/004` (improve-agent stress) for `/spec_kit:deep-research`. Re-read 060/004's plan.md as the methodology source.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- 13-question preflight (060/003 §7) passes for each CP
- Sandbox helper idempotent + isolated
- Signal contracts grep-checkable, not LLM-judge
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

`@deep-research` is dispatched ONLY by `/spec_kit:deep-research`. The command owns iteration state, convergence, journal, gates, stop reasons. Body is a thin LEAF.

CP scenarios test the FULL FLOW (cmd → agent body → state files → journal → gate evaluation → next iter), not the body in isolation.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Steps | Output |
|---|---|---|
| **P1** Author CPs | Apply 13-question preflight × 6; write CP-XXX scenarios | 6 .md files |
| **P2** Sandbox helper | Build setup-cp-sandbox.sh | 1 .sh file |
| **P3** Validate | Run preflight check; sandbox dry-run | clean preflight pass |
| **P4** Hand-off | Mark complete; queue 002 (or 004) for stress runs | impl-summary.md |

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Preflight check applied at authoring time. CP execution deferred to sub-phase 002.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 060/004 methodology (reference packet)
- 060/003 §7 13-question preflight + 11-dim rubric
- sk-deep-research skill + scripts (executor of the command being stress-tested)
- cli-copilot (proven executor; alt: cli-codex)


<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

CP scenarios are additive (new files). Rollback = `git rm` the new scenarios.

<!-- /ANCHOR:rollback -->
