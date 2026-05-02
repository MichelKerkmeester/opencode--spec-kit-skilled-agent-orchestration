---
title: "Plan: @ultra-think → @multi-ai-council Agent Optimization"
description: "Sub-phase under 061-agent-optimization applying validated sk-improve-agent v2 substrate to @ultra-think."
trigger_phrases:
  - "006-agent-multi-ai-council"
  - "ultra-think optimization"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/061-agent-optimization/006-agent-multi-ai-council"
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
# Plan: @ultra-think → @multi-ai-council Agent Optimization

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Single linear iteration applying the validated sk-improve-agent v2 substrate (proven 060 → PASS 6/0/0) against `@ultra-think`. Rename interleaved before mirror sync. Mode: `:auto`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- All 5 legal-stop gates must pass before promote
- Score delta JSON required pre/post
- Mirror byte-alignment verified manually before commit
- Rename grep audit must return zero hits before commit
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

`@ultra-think` is consumed via the Task tool / orchestrator dispatch. Improvements ship as canonical `.opencode/agent/ultra-think.md` updates plus 3 mirror updates. Score profile is dynamic (generated per-target via `generate-profile.cjs`).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Steps | Output |
|---|---|---|
| **P1** Profile | scan-integration.cjs + generate-profile.cjs | `<packet>/profile.json` |
| **P2** Dispatch | `/improve:agent .opencode/agent/ultra-think.md` | `<packet>/candidate.md` |
| **P3** Score+Bench | score-candidate.cjs + run-benchmark.cjs | score + benchmark JSONs |
| **P4** Legal-stop | reduce-state.cjs verifies 5 gates | `<packet>/legal_stop_evaluated.json` |
| **P5** Promote | promote-candidate.cjs --approve | canonical updated |
| **P6a** Rename | git mv canonical + 3 mirrors; sed all references | renamed surfaces |
| **P6b** Mirror sync | Verify alignment across 4 runtimes | mirrors aligned |
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
- ultra-think → multi-ai-council mapping (this packet's special concern)
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`rollback-candidate.cjs --target=.opencode/agent/ultra-think.md --backup=<pre-promote-backup>` reverts canonical. Mirror revert via git revert of the sync commit. Rename revert: git revert the rename commit + grep audit to ensure no stale `multi-ai-council` references remain.
<!-- /ANCHOR:rollback -->
