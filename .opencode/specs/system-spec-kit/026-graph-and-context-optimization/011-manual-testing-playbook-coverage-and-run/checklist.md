---
title: "Checklist: Manual Testing Playbook Coverage and Run (011) [template:level_2/checklist.md]"
description: "P0/P1/P2 verification gates for the 011 coverage sync + runner pass."
trigger_phrases:
  - "011 checklist"
  - "phase 011 verification"
  - "playbook coverage checklist"
importance_tier: "important"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-manual-testing-playbook-coverage-and-run"
    last_updated_at: "2026-04-25T19:13:00Z"
    last_updated_by: "claude-opus-4-7-orchestrator"
    recent_action: "Checklist written with 3-state convention (real / OPERATOR-PENDING / BLOCKED)."
    next_safe_action: "Begin scenario edits (T011-1..T011-9)."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "011-init"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Checklist: Manual Testing Playbook Coverage and Run (011)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

---

## 3-state convention

- `[x]` = real evidence captured (command output reproduced verbatim or file diff verifiable on disk)
- `[ ] OPERATOR-PENDING` = command can't run from this context (sk-doc DQI scripts, live MCP smoke against running tools)
- `[ ] BLOCKED` = blocked with explicit reason recorded inline

---

## P0 — Blockers (MUST complete)

- [ ] **REQ-001 — 014 detect_changes scenario synced.** Adversarial path-traversal step + multi-file diff boundary step appended; scenario file passes playbook validator.
- [ ] **REQ-002 — 026 graph query / blast_radius scenario synced.** All 5 010/007 sub-steps appended (minConfidence, exact-limit overflow, multi-subject seed, failureFallback.code, control-char sanitization); scenario file passes validator.
- [ ] **REQ-003 — 203 cache-invalidation scenario added.** Setup seeds causal edges, mutation triggers cache-key change, assertion compares two memory_search calls; scenario file passes validator.
- [ ] **REQ-004 — Runner pass executed.** `manual-playbook-runner.ts` invoked for each of the 4 scenario IDs; per-scenario `manual-playbook-results.json` files written under `scratch/manual-playbook-results/`.
- [ ] **REQ-005 — Scorecard recorded.** `implementation-summary.md` contains per-scenario table (Steps / PASS / FAIL / SKIP / UNAUTOMATABLE / Verdict) + aggregate row + triage notes.

## P1 — Required (complete OR user-approved deferral)

- [ ] **REQ-006 — 199 affordance evidence confirmed up-to-date.** File read; debug-counters coverage either confirmed present (no edit) or extended with R-007-P2-9 step.
- [ ] **REQ-007 — Automated test baselines unchanged.** `tsc --noEmit` clean; canonical phase-010 11-file vitest suite still 175/175 PASS; Python `test_skill_advisor.py` still 57/57 PASS.
- [ ] **REQ-008 — Spec validation.** `bash validate.sh --strict` on the 011 spec folder returns PASSED or FAILED-COSMETIC (template-section conformance only); no contract violations.

## P2 — Optional follow-ups

- [ ] OPERATOR-PENDING — Broader run across all 306 scenarios (out-of-scope per spec.md §3; available as separate phase).
- [ ] OPERATOR-PENDING — Numerical scoring rubric beyond PASS/FAIL/SKIP/UNAUTOMATABLE (out-of-scope; separate phase if desired).
- [ ] OPERATOR-PENDING — Runner CLI extension to accept comma-separated filter (workaround in 011: 4 sequential runs).

---

## Hard rules

- [ ] No code changes under `mcp_server/` (per spec.md §3 Out of Scope).
- [ ] No fabricated runner output; every count in the scorecard maps to a real `manual-playbook-results.json` row.
- [ ] If a step is genuinely UNAUTOMATABLE (e.g., `compute_error` failureFallback fault injection), document the reason inline in the scenario AND in the scorecard triage column.

---

## Output contract

- [ ] Commit on main: `feat(011): playbook coverage sync + runner scorecard for 010-shipped surfaces`
- [ ] Print at end of orchestration: `EXIT_STATUS=DONE | scenarios_synced=4 | scenarios_run=4 | coverage_pct=<N>`

---

## Sign-offs

| Reviewer | Status | Date |
|----------|--------|------|
| Orchestrator (this session) | pending | — |
| User | pending | — |
