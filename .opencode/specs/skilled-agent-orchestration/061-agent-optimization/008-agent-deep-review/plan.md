---
title: "Plan: @deep-review Agent Optimization"
description: "Sub-phase under 061-agent-optimization applying validated sk-improve-agent v2 substrate to @deep-review."
trigger_phrases:
  - "008-agent-deep-review"
  - "deep-review optimization"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/061-agent-optimization/008-agent-deep-review"
    last_updated_at: "2026-05-02T17:30:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Plan scaffolded — single linear iteration"
    next_safe_action: "Begin Phase 1 (scan + profile)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-061-2026-05-02"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Plan: @deep-review Agent Optimization

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Single linear iteration applying the validated sk-improve-agent v2 substrate (proven 060 → PASS 6/0/0) against `@deep-review`. Standard 9-step pipeline. Mode: `:auto`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- All 5 legal-stop gates must pass before promote
- Score delta JSON required pre/post
- Mirror byte-alignment verified manually before commit

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

`@deep-review` is consumed via a specific spec_kit command flow. Improvements ship as canonical `.opencode/agent/deep-review.md` updates plus 3 mirror updates. Score profile is dynamic (generated per-target via `generate-profile.cjs`).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Steps | Output |
|---|---|---|
| **P1** Profile | scan-integration.cjs + generate-profile.cjs | `<packet>/profile.json` |
| **P2** Dispatch | `/improve:agent .opencode/agent/deep-review.md` | `<packet>/candidate.md` |
| **P3** Score+Bench | score-candidate.cjs + run-benchmark.cjs | score + benchmark JSONs |
| **P4** Legal-stop | reduce-state.cjs verifies 5 gates | `<packet>/legal_stop_evaluated.json` |
| **P5** Promote | promote-candidate.cjs --approve | canonical updated |
| **P6** Mirror sync | Propagate to 3 mirrors | 4 mirrors aligned |
| **P7** Verify+Commit | Diff vs baseline; smoke-test; commit | committed packet |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Smoke-test via re-running a representative scenario from `.opencode/skill/sk-improve-agent/manual_testing_playbook/`. For LEAF agents (@context, @deep-research, @deep-review), test via the dispatching command's flow.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- sk-improve-agent v2 (060/005 wiring)
- /improve:agent command flow (060/004 validated)
- 4-runtime mirror discipline (memory rule)

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`rollback-candidate.cjs --target=.opencode/agent/deep-review.md --backup=<pre-promote-backup>` reverts canonical. Mirror revert via git revert of the sync commit. 
<!-- /ANCHOR:rollback -->
