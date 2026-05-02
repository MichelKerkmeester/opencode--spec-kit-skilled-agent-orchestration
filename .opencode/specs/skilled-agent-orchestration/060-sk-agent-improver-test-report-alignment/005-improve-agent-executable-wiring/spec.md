<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
---
title: "Feature Specification: 062 — sk-improve-agent Executable Wiring"
description: "Wire executable producers + consumers across sk-improve-agent's command-flow pipeline so legal-stop, benchmark, and stop-reason evidence is grep-checkable and reducer-compatible. Implements 060/003 research §5 062 sketch with all decisions locked in (static skill assets, materializer alongside run-benchmark.cjs)."
trigger_phrases:
  - "062 executable wiring"
  - "sk-improve-agent benchmark wiring"
  - "legal-stop nested gateResults"
  - "benchmark materializer static assets"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/005-improve-agent-executable-wiring"
    last_updated_at: "2026-05-02T14:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Spec scaffolded"
    next_safe_action: "Bootstrap JSON; dispatch cli-codex"
    blockers: []
    key_files:
      - .opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/research/research.md
      - .opencode/command/improve/assets/improve_improve-agent_auto.yaml
      - .opencode/command/improve/assets/improve_improve-agent_confirm.yaml
      - .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs
      - .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs
      - .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs
      - .opencode/skill/sk-improve-agent/SKILL.md
    completion_pct: 5
    open_questions:
      - "Does 062 include the GREEN cli-copilot rerun or defer to optional 063?"
    answered_questions:
      - "Benchmark assets location → static skill assets at .opencode/skill/sk-improve-agent/assets/benchmark-profiles/ + assets/benchmark-fixtures/"
      - "Materializer location → alongside run-benchmark.cjs in .opencode/skill/sk-improve-agent/scripts/"
      - "Auto + confirm YAML parity → patch in lockstep"
---

# Feature Specification: 062 — sk-improve-agent Executable Wiring

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Packet 060/003 research synthesized 10 cli-copilot iterations and identified the executable producers + consumers that must be wired before sk-improve-agent's command-flow pipeline can produce honest GREEN evidence. 062 lands those wirings.

The decisions are locked from research.md §5: benchmark assets live as **static skill assets** under `.opencode/skill/sk-improve-agent/assets/benchmark-profiles/` + `assets/benchmark-fixtures/` (versioned with the skill, reused across runs); the materializer ships **alongside `run-benchmark.cjs`**; auto + confirm YAML are patched in lockstep; legal-stop emits **nested `details.gateResults`**; stop-reason vocabulary is reconciled across SKILL/helper/tests/docs.

This packet does NOT include the cli-copilot stress rerun (that's packet 004 (was 061)'s job — restructure CP-040..045 to invoke the command flow and verify GREEN against this packet's wiring). 062 ships executable wiring + native-RT validation only. If scope grows, the GREEN cli-copilot rerun spills to optional 063.

**Critical Dependencies:** 060/003/research/research.md as source of truth; 060/002 already-shipped diffs (CRITIC PASS, scan-integration mirror fix, score-candidate baseline+delta) stay intact.
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
| **Parent** | `specs/skilled-agent-orchestration/` |
| **Predecessor** | `060-sk-agent-improver-test-report-alignment/003-followup-research/` |
| **Sibling (planned)** | `004-improve-agent-command-flow-stress-tests/` |
| **Estimated LOC** | 200-400 (YAML edits + helper additions + materializer + tests + docs) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After 060/002, sk-improve-agent has CRITIC PASS in the agent body (4 runtime mirrors), score-candidate baseline+delta wiring, scan-integration `.gemini/agents` fix, and YAML emissions for `legal_stop_evaluated`/`benchmark_completed`/`blocked_stop`. But 060/003's deeper analysis surfaced executable seams the YAML emissions can't honestly satisfy:

- **Benchmark step is action prose, not a real command.** YAML says "Run profile fixtures..." — no `node run-benchmark.cjs` invocation. The `benchmark_completed` event fires regardless of whether anything actually ran.
- **Legal-stop emission is flat, reducer expects nested.** Auto YAML emits `legal_stop_evaluated` with `gateName=stop_check`/`gateResult` flat fields. Reducer reads `details.gateResults.contractGate` etc. Producer/consumer mismatch.
- **Stop-reason vocabulary disagrees across surfaces.** SKILL.md narrows the enum; helper script + tests use `plateau` and `benchmarkPlateau` which aren't in the SKILL enum.
- **Auto and confirm YAML diverged.** Confirm has a promotion command path auto doesn't; some emissions exist in auto only.
- **Native RT-028/RT-032 oracle scenarios reference command names + signal lists that no longer match the implementation.**
- **Benchmark assets don't exist as concrete files.** No profile JSON, no fixture JSON, no materializer.

### Purpose

Land all executable wirings so the command-flow pipeline produces evidence that matches what reducers/dashboards/tests expect to consume. This makes 061's command-flow stress tests able to return real GREEN against fixed code instead of "expected RED methodology evidence."
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Benchmark static assets** at `.opencode/skill/sk-improve-agent/assets/benchmark-profiles/*.json` + `assets/benchmark-fixtures/*.json` (versioned with skill)
- **Benchmark materializer helper** at `.opencode/skill/sk-improve-agent/scripts/materialize-benchmark-fixtures.cjs` (writes `{outputsDir}/{fixture.id}.md` before `run-benchmark.cjs` runs)
- **`run-benchmark.cjs` wiring** — actual node invocation in YAML with required CLI args (`--profile`, `--outputs-dir`, etc.); emit `benchmark_completed` only AFTER report file exists
- **Auto + confirm YAML parity in lockstep** — both emit `benchmark_completed`, both emit nested `legal_stop_evaluated.details.gateResults`, both emit `blocked_stop.failedGates`
- **Legal-stop nested shape** — change YAML emission from flat `gateName/gateResult` to nested `details.gateResults.{contractGate,behaviorGate,integrationGate,evidenceGate,improvementGate}`
- **Stop-reason enum reconciliation** — pick one source of truth (SKILL.md narrow enum vs helper/tests broader). Recommend: keep SKILL narrow enum, document `plateau`/`benchmarkPlateau` as compatibility aliases or remove from helper/tests
- **Reducer/dashboard assertions** — update `reduce-state.cjs` to consume nested `details.gateResults`; update dashboard rendering accordingly
- **Native RT-028/RT-032 alignment** — reconcile command names, target agent path, event vocabulary, expected signal list with the actual implementation
- **SKILL.md docs update** — clarify benchmark static-asset location, materializer ownership, nested legal-stop shape, stop-reason enum truth
- **Tests** — update existing tests for journal helper, reducer, score-candidate to match new shapes
- **CP-040..045 playbook contract updates** — adjust expected signals where the shape changed (so 061 can grep against the new shape)

### Out of Scope

- **cli-copilot stress test rerun** — that's packet 004 (was 061)'s job. 062 does NOT run CP-040..045 stress tests.
- **Restructuring CP-040..045 to invoke command flow** — that's 061. 062 just updates expected signal shapes.
- **Other meta-agents (@deep-research, @deep-review)** — separate packets if user wants them later
- **GREEN rerun verification** — optional 063 if 062 grows too large; otherwise rolled into 062's wrap-up
- **Constitutional rule updates** — research surfaced; user decides separately

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-improve-agent/assets/benchmark-profiles/default.json` | Create | Static benchmark profile JSON |
| `.opencode/skill/sk-improve-agent/assets/benchmark-fixtures/*.json` | Create | Static fixture JSON files (2-3 minimum) |
| `.opencode/skill/sk-improve-agent/scripts/materialize-benchmark-fixtures.cjs` | Create | Materializer helper (writes outputsDir/fixture.id.md before run-benchmark.cjs) |
| `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs` | Modify | Accept materialized fixture inputs; produce report.json with status:"benchmark-complete" |
| `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs` | Modify | Accept nested `details.gateResults` validation |
| `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs` | Modify | Consume `details.gateResults`; render in dashboard |
| `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` | Modify | Replace flat `gate_evaluation` with nested `legal_stop_evaluated.details.gateResults`; wire materialize+run-benchmark; emit benchmark_completed after report exists |
| `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml` | Modify | Same as auto (lockstep parity) |
| `.opencode/skill/sk-improve-agent/SKILL.md` | Modify | Document static-asset benchmark location, materializer ownership, nested gateResults shape, stop-reason enum truth |
| `.opencode/skill/sk-improve-agent/test-fixtures/060-stress-test/` (or new path) | Modify if needed | Native RT-028/RT-032 fixture alignment if these reference 062-specific shapes |
| `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/013-018*.md` | Modify | Update expected signal shapes for CP-040..045 to match 062's new shapes |
| Existing test files (journal, reducer, score-candidate) | Modify | Match new shapes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Static benchmark profile + fixture JSON exist at the documented paths | `ls assets/benchmark-{profiles,fixtures}/*.json` returns ≥3 files |
| REQ-002 | Materializer helper exists and writes fixture markdown to outputsDir | unit test or shell test confirms file creation |
| REQ-003 | `run-benchmark.cjs` consumes materialized fixtures + emits `report.json` with `status:"benchmark-complete"` | end-to-end shell test |
| REQ-004 | Auto + confirm YAML invoke materializer + run-benchmark + emit benchmark_completed AFTER report file exists | grep YAML; trace order in journal |
| REQ-005 | Both YAMLs emit `legal_stop_evaluated.details.gateResults.{contractGate,behaviorGate,integrationGate,evidenceGate,improvementGate}` | grep YAML; trace journal output |
| REQ-006 | Reducer consumes nested `details.gateResults` and renders correctly | reducer test passes |
| REQ-007 | Stop-reason enum reconciled — SKILL = single source of truth, helper + tests align | grep all surfaces; no contradictions |
| REQ-008 | Native RT-028/RT-032 scenarios run successfully against new shapes | scenario execution returns expected results |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-101 | CP-040..045 expected signal shapes updated to match 062's new emissions | grep playbook files for new shapes |
| REQ-102 | SKILL.md documents all 062 changes coherently | section-by-section read confirms |
| REQ-103 | Existing tests updated to new shapes; no regressions | test suite passes |

### P2 — Nice to Have

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-201 | GREEN cli-copilot rerun included in 062 (vs deferred to 063) | only if scope stays manageable |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:research-questions -->
## 5. KEY DECISIONS (already locked from 060/003 research)

| Decision | Choice | Source |
|---|---|---|
| Benchmark assets location | **Static skill assets** at `.opencode/skill/sk-improve-agent/assets/benchmark-profiles/` + `assets/benchmark-fixtures/` | 060/003/research §5 (user-confirmed) |
| Materializer location | **Alongside `run-benchmark.cjs`** in scripts/ | 060/003/research §5 |
| Auto + confirm YAML | **Lockstep parity** | 060/003/research §5 |
| Legal-stop emission shape | **Nested `details.gateResults`** | 060/003/research §5 |
| Stop-reason enum truth | **SKILL.md narrow enum** as source of truth; helper/tests align | 060/003/research §5 |

These are NOT open questions for 062. They are inputs.
<!-- /ANCHOR:research-questions -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

A successful 062 produces:

1. All P0 + P1 requirements met (REQ-001..103)
2. Native RT-028/RT-032 alignment validates the wiring end-to-end
3. SKILL.md docs reflect new state coherently
4. CP-040..045 expected-signal contracts updated for 061's stress test to grep against
5. `implementation-summary.md` updated with completion_pct=100 + per-REQ status
6. `handover.md` updated with 061 ready-state pointer
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:references -->
## 7. REFERENCES

- **Source of truth:** `../060-sk-agent-improver-test-report-alignment/003-followup-research/research/research.md` (§5 062 sketch + §9 hand-off + §8 evidence matrix)
- **Predecessor packets:** 060/001 (research), 060/002 (initial implementation + R1 stress), 060/003 (followup research synthesis)
- **Sibling (planned):** 061 (command-flow stress tests will rerun against 062's wiring)
- **Memory rules:**
  - `feedback_meta_agent_test_layer_selection.md` (the 060 lesson)
  - `feedback_codex_cli_fast_mode.md` (`-c service_tier="fast"`)
  - `feedback_new_agent_mirror_all_runtimes.md` (no agent-body changes here, but doc parity matters)
  - `feedback_stay_on_main_no_feature_branches.md`
  - `reference_specs_symlink_and_validator_quirks.md`
<!-- /ANCHOR:references -->
