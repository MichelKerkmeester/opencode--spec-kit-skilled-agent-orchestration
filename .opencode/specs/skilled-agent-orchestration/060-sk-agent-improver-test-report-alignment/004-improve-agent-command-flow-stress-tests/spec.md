<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
---
title: "Feature Specification: 061 — sk-improve-agent Command-Flow Stress Tests"
description: "Restructure CP-040..045 stress tests to invoke /improve:agent command flow (with 062's wiring in place) instead of just prepending the @improve-agent body. Use per-CP layer partition: CP-041/042 stay body-level; CP-040/043/044/045 use command-flow dispatch in a command-capable temp root."
trigger_phrases:
  - "061 command-flow stress tests"
  - "sk-improve-agent command-flow CP"
  - "command-capable temp root"
  - "CP-040 CP-043 CP-044 CP-045 rerun"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/004-improve-agent-command-flow-stress-tests"
    last_updated_at: "2026-05-02T15:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Spec scaffolded"
    next_safe_action: "Dispatch cli-codex stages 1-3"
    blockers: []
    key_files:
      - .opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/research/research.md
      - .opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/005-improve-agent-executable-wiring/handover.md
      - .opencode/skill/sk-improve-agent/manual_testing_playbook/08--agent-discipline-stress-tests/013-skill-load-not-protocol.md
    completion_pct: 5
    open_questions:
      - "Does the temp-root setup helper become a reusable script under sk-improve-agent or live in the packet?"
    answered_questions:
      - "Per-CP layer partition: CP-041/042 body-level; CP-040/043/044/045 command-flow"
      - "Reuse CP-040..045 IDs for active corrections (not new IDs)"
      - "Score-progression target: methodology PASS with honest gaps documented; defer GREEN claims to per-scenario evidence"
---

# Feature Specification: 061 — sk-improve-agent Command-Flow Stress Tests

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Packet 060/002 ran R1 stress tests with the prepend-agent-body dispatch and scored 0/2/4 PASS/PARTIAL/FAIL. 060/003 research diagnosed the failure as test-layer-selection: @improve-agent's discipline lives in the `/improve:agent` command orchestrator, not in the agent body. Packet 005 (was 062) just shipped the executable wiring (static benchmark assets, materializer, nested `legal_stop_evaluated.details.gateResults`, stop-reason enum reconciliation, both YAMLs in lockstep).

061 closes the loop: restructure CP-040..045 stress tests to invoke the command flow with a command-capable temp project root, run R1 against 062's wiring, and document honest GREEN/PARTIAL/FAIL results.

**Per-CP layer partition** (per 060/003 research §4):
- **CP-041, CP-042** stay as **body-level tests** (proposal-only boundary + active Critic check) — discipline lives in the agent body. Ensure the 5 required runtime/control inputs are materialized so Call B has what it needs.
- **CP-040, CP-043, CP-044, CP-045** need **command-flow dispatch**: Call B invokes `/improve:agent ".opencode/agent/cp-improve-target.md" :auto --spec-folder=/tmp/cp-061-spec --iterations=1` from a command-capable temp project root containing `.opencode/command/improve/`, `.opencode/skill/sk-improve-agent/`, the fixture target, and benchmark assets.

**Critical Dependencies:** 062 (just shipped, commit `6374d5806`) — its wiring is what 061 tests against; without it, expected GREEN scenarios would still RED for producer/consumer mismatch reasons.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-02 |
| **Branch** | `main` |
| **Predecessor** | 060 trilogy + 062 (just shipped) |
| **Sibling** | 005-improve-agent-executable-wiring |
| **Estimated LOC** | 100-200 (mainly playbook scenario rewrites + sandbox setup script) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After 062, the executable wiring is in place but the existing CP-040..045 stress scenarios still dispatch via prepend-agent-body. That dispatch shape can't exercise the command-orchestrator discipline (script firing, journal events, legal-stop evaluation) regardless of how good the underlying code is. Until the dispatch shape changes, R1 will continue to score 0/2/4 for methodology reasons even with 062's improvements.

### Purpose

Switch the dispatch shape, run R1 against 062's wiring, document honest results, and produce a test-report that shows the test-layer-selection meta-finding from 060/003 actually closed the gap.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Build a command-capable temp project root setup helper** (e.g., `/tmp/cp-061-sandbox-setup.sh`) that creates `/tmp/cp-061-sandbox/` containing `.opencode/command/improve/`, `.opencode/skill/sk-improve-agent/`, `.opencode/agent/cp-improve-target.md` (fixture), mirrors, and benchmark assets — enough that `/improve:agent` resolves all its relative paths
- **Modify CP-040, CP-043, CP-044, CP-045** in-place at `.opencode/skill/sk-improve-agent/manual_testing_playbook/08--agent-discipline-stress-tests/013/016/017/018*.md`:
  - Replace the Call B prepend-agent-body shape with `/improve:agent ".opencode/agent/cp-improve-target.md" :auto --spec-folder=/tmp/cp-061-spec --iterations=1`
  - Update sandbox setup to include the command-capable temp-root copy
  - Adjust expected-signal grep contracts to match 062's emissions (most already done by 062's stage 6, but verify)
- **Modify CP-041, CP-042** in-place at `014/015*.md`:
  - Keep body-level dispatch (Call B prepends @improve-agent body)
  - Ensure the 5 required runtime/control inputs are materialized so the agent doesn't halt on missing input
- **Run R1 stress** — all 6 scenarios sequentially via cli-copilot gpt-5.5
- **Triage** R1 results; if any PARTIAL/FAIL, dispatch R2 with targeted edits
- **Author test-report.md** mirroring 059's 11-section structure with R1/R2 narratives + transcript pull-quotes

### Out of Scope

- **Further sk-improve-agent code edits** (062's wiring is the substrate; if R1 surfaces new code gaps, sketch follow-on but don't fix in 061)
- **New CP-XXX scenarios beyond CP-040..045** (existing IDs are reused for active corrections)
- **Other meta-agents** (@deep-research, @deep-review still flagged as future work per 060/003 §6)
- **Constitutional rule updates** (research surfaces; user decides)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Command-capable temp root setup helper exists + creates a directory structure that lets `/improve:agent` resolve | Manual test: dispatch `/improve:agent` against the temp root → no missing-file errors |
| REQ-002 | CP-040, CP-043, CP-044, CP-045 use command-flow Call B dispatch | grep playbook files for `/improve:agent ".opencode/agent/cp-improve-target.md"` |
| REQ-003 | CP-041, CP-042 keep body-level dispatch with 5 required inputs materialized | grep + scenario read |
| REQ-004 | R1 stress run completes all 6 scenarios | 6 verdict files + transcripts |
| REQ-005 | Per-CP verdicts documented honestly (PASS/PARTIAL/FAIL with evidence) | test-report §5 |
| REQ-006 | test-report.md exists with 11 ANCHOR-paired sections mirroring 059 | strict ANCHOR check |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-101 | If R1 surfaces gaps, R2 with targeted edits OR honest deferral to follow-on | test-report §6 documents either outcome |
| REQ-102 | Implementation-summary + handover updated | completion_pct=100 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:references -->
## 5. REFERENCES

- **Source of recommendations:** `../060-sk-agent-improver-test-report-alignment/003-followup-research/research/research.md` (§4 062 sketch is what 062 implemented; §11 + §9 hand-off prompts are 061's contract)
- **Predecessor (substrate):** `../005-improve-agent-executable-wiring/handover.md` — 062's hand-off pointer
- **Methodology template:** `../059-agent-implement-code/test-report.md` — 11-section ANCHOR structure
- **Existing CP scenarios to modify:**
  - `.opencode/skill/sk-improve-agent/manual_testing_playbook/08--agent-discipline-stress-tests/013-skill-load-not-protocol.md` (CP-040)
  - `014-proposal-only-boundary.md` (CP-041 — body-level)
  - `015-active-critic-overfit.md` (CP-042 — body-level)
  - `016-legal-stop-gate-bundle.md` (CP-043)
  - `017-improvement-gate-delta.md` (CP-044)
  - `018-benchmark-completed-boundary.md` (CP-045)
- **Memory rules carried forward:** `feedback_meta_agent_test_layer_selection.md`, `feedback_codex_cli_fast_mode.md`, `feedback_stay_on_main_no_feature_branches.md`, `feedback_worktree_cleanliness_not_a_blocker.md`
<!-- /ANCHOR:references -->
