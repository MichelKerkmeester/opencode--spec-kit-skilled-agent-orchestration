<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
---
title: "Feature Specification: Stress-Test Implementation for sk-improve-agent (per 001 research)"
description: "Phase 002 of 060. Apply the prioritized diff sketches from 001/research/research.md, author CP-040 onward stress-test scenarios, run multi-round stress tests against a controlled fixture target, and produce a test-report.md mirroring 059's structure."
trigger_phrases:
  - "060 phase 002"
  - "sk-improve-agent stress test implementation"
  - "CP-040 CP-045 implementation"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation"
    last_updated_at: "2026-05-02T11:42:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Phase 002 spec scaffolded from 001 research recommendations"
    next_safe_action: "Write 8 markdown + 2 JSON; strict-validate; user approval before any source edits"
    blockers: []
    key_files:
      - .opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations/research/research.md
      - .opencode/skill/sk-improve-agent/SKILL.md
      - .opencode/agent/improve-agent.md
      - .opencode/command/improve/agent.md
      - .opencode/command/improve/assets/improve_improve-agent_auto.yaml
      - .opencode/skill/sk-improve-agent/scripts/score-candidate.cjs
      - .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs
    completion_pct: 5
    open_questions:
      - "Fixture-target choice: build a fresh tiny intentionally-flawed agent, or reuse one of the smaller existing agents?"
      - "Score progression target — 6/2/1 → 7/1/0 → 8/0/0, or a different shape?"
      - "Should CP-040..CP-045 be authored before any source edits, or in parallel?"
    answered_questions:
      - "Phase scope → diff application + scenario authoring + multi-round stress tests + test-report (per 001 research §8 hand-off notes)"
      - "Executor for stress tests → cli-copilot --model=gpt-5.5 (matches 059 + 001 success pattern)"
      - "Test report structure → mirror 059's anchored sections + transcript pull-quotes + lessons-learned"
---

# Feature Specification: Stress-Test Implementation for sk-improve-agent

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Phase 001 produced 854 lines of research synthesizing 10 cli-copilot iterations into prioritized improvement recommendations for the sk-improve-agent triad. Phase 002 turns those recommendations into shipped behavior:

1. **Apply the 5 P0/P1 diff sketches** from `001/research/research.md` §5 to the triad files + 2 helper scripts.
2. **Author 6+ CP-XXX playbook entries** (CP-040 through CP-045 minimum) under `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/` using the same format as CP-027 through CP-034 in packet 059.
3. **Build the recommended fixture-target** (per 001/research §6) — a small controlled "agent-under-improvement" with intentional flaws that exercise each scenario.
4. **Run multi-round stress tests** mirroring 059's R0 baseline → R1 stress → R2/R3 fix progression, targeting 8/0/0 PASS/PARTIAL/FAIL.
5. **Author `test-report.md`** mirroring 059's structure (executive summary, methodology, round-by-round narrative, diff summary, lessons-learned).

**Key Decisions:** ADR-1 use cli-copilot gpt-5.5 for stress test executor (matches 001 + 059); ADR-2 test-first ordering (scenarios + fixture before source edits); ADR-3 mirror agent edits across 4 runtimes; ADR-4 score-progression target = first iteration baseline + iterate to 8/0/0.

**Critical Dependencies:** 001/research/research.md (the source of truth for what to change); 059/test-report.md (the structural template for 002's eventual test-report); cli-copilot CLI with `--add-dir` sandbox flag.
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
| **Branch** | `main` (per memory: stay on main) |
| **Parent** | `specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/` (phase parent) |
| **Sibling** | `001-deep-research-recommendations/` (research source) |
| **Estimated LOC** | 200-400 (triad edits + ~6 new scenario specs + test-report.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 060 phase 001 found that sk-improve-agent has serious evaluator machinery (proposal-only candidates, 5-dimension deterministic scoring, journals, benchmarks, mirror-drift policy, legal-stop vocabulary) but lacks the part that made packet 059's @code campaign effective: same-task A/B stress scenarios that force one failure-path claim at a time, reset the sandbox between calls, and judge only grep-checkable signals.

The research is done. The recommendations are concrete. What's missing is the implementation that takes the 854 lines of synthesis and turns them into:
- Source code changes that close the identified gaps
- Real CP-XXX playbook entries the operator can run
- Stress-test runs that prove the changes actually moved behavior, not just changed text
- A shippable `test-report.md` for the campaign

### Purpose

Execute the 001/research §8 hand-off plan: apply diffs, author scenarios, build the fixture, run multi-round stress tests, produce the test-report. This is the operational counterpart to phase 001's research.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Apply diff sketches** from 001/research/research.md §5:
  - `.opencode/agent/improve-agent.md` — add §6.5 CRITIC PASS bullets (P0)
  - `.opencode/skill/sk-improve-agent/SKILL.md` — clarify "skill load is not protocol execution" (P0)
  - `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` — emit `legal_stop_evaluated` with 5-gate bundle (P0)
  - `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs` — actually use `--baseline` and emit `delta` (P0)
  - `.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs` — fix `.gemini/agents` mirror path constant (P1)
- **Mirror agent edits across 4 runtimes** per memory rule (`.opencode/agent/improve-agent.md` → `.claude/agents/improve-agent.md` + `.gemini/agents/improve-agent.md` + `.codex/agents/improve-agent.toml`)
- **Author CP-040 through CP-045 playbook entries** as real files under `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/`:
  - CP-040 — SKILL_LOAD_NOT_PROTOCOL / script-routing fidelity
  - CP-041 — PROPOSAL_ONLY_BOUNDARY / no canonical mutation
  - CP-042 — ACTIVE_CRITIC_OVERFIT / candidate-time challenge
  - CP-043 — LEGAL_STOP_GATE_BUNDLE / grep-checkable stop
  - CP-044 — IMPROVEMENT_GATE_DELTA / acceptable is not better
  - CP-045 — BENCHMARK_COMPLETED_BOUNDARY / action is not evidence
- **Build the recommended fixture-target** per 001/research §6 (specific design lives in research.md)
- **Run multi-round stress tests:** R0 baseline (single scenario across multiple models for envelope verification), R1 stress (all 6 CPs), R2/R3 targeted fixes if R1 surfaces design gaps
- **Produce `test-report.md`** mirroring 059's structure
- **Update root index** of manual_testing_playbook.md (§10 + §16 cross-reference)

### Out of Scope

- **Authoring CP-046 onward scenarios sketched in research.md but lower priority** — those become a follow-on packet (063 or later) if operator interest warrants
- **Refactoring sk-improve-agent's 14 scripts beyond the 2 named above** — out-of-scope helpers stay untouched
- **Changes to the deep-research framework itself** — same constraint as 001
- **Changes to 059's @code agent or its scenarios** — separate packet
- **Updating constitutional rules in CLAUDE.md** — 002 surfaces findings; constitutional updates are a separate decision

### Files to Change (in 002)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agent/improve-agent.md` | Modify | Add §6.5 CRITIC PASS bullets (P0) |
| `.claude/agents/improve-agent.md` | Modify | Mirror of above |
| `.gemini/agents/improve-agent.md` | Modify | Mirror of above |
| `.codex/agents/improve-agent.toml` | Modify | Mirror of above (toml-wrapped) |
| `.opencode/skill/sk-improve-agent/SKILL.md` | Modify | Clarify "skill load ≠ protocol execution" (P0) |
| `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` | Modify | Emit `legal_stop_evaluated` with 5-gate bundle (P0) |
| `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml` | Modify | Same legal-stop emission |
| `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs` | Modify | Actually use `--baseline`, emit `delta` (P0) |
| `.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs` | Modify | Fix `.gemini/agents` mirror path (P1) |
| `.opencode/skill/sk-improve-agent/manual_testing_playbook/08--agent-discipline-stress-tests/013-skill-load-not-protocol.md` | Create | CP-040 |
| `.opencode/skill/sk-improve-agent/manual_testing_playbook/08--agent-discipline-stress-tests/014-proposal-only-boundary.md` | Create | CP-041 |
| `.opencode/skill/sk-improve-agent/manual_testing_playbook/08--agent-discipline-stress-tests/015-active-critic-overfit.md` | Create | CP-042 |
| `.opencode/skill/sk-improve-agent/manual_testing_playbook/08--agent-discipline-stress-tests/016-legal-stop-gate-bundle.md` | Create | CP-043 |
| `.opencode/skill/sk-improve-agent/manual_testing_playbook/08--agent-discipline-stress-tests/017-improvement-gate-delta.md` | Create | CP-044 |
| `.opencode/skill/sk-improve-agent/manual_testing_playbook/08--agent-discipline-stress-tests/018-benchmark-completed-boundary.md` | Create | CP-045 |
| `.opencode/skill/cli-copilot/manual_testing_playbook/manual_testing_playbook.md` | Modify | Add CP-040..045 to root index (§10 + §16) |
| Fixture-target file(s) | Create | Path TBD per ADR-3 (likely `.opencode/skill/sk-improve-agent/test-fixtures/060-stress-test/`) |
| `.opencode/specs/.../060-.../002-.../test-report.md` | Create | Mirror 059 test-report structure |

### Files to Reference (NOT modify)

| File Path | Role |
|-----------|------|
| `001-deep-research-recommendations/research/research.md` | Source of truth for what to change |
| `059-agent-implement-code/test-report.md` | Test-report structural template |
| All 13 sk-improve-agent scripts not named above | Read-only context |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 P0 diff sketches from 001/research §5 applied to source files | grep + Read confirms each diff is in place at the specified anchors |
| REQ-002 | Agent edits mirrored across 4 runtimes | All 4 paths show identical canonical content (with runtime-appropriate Path Convention adjustments) |
| REQ-003 | CP-040..CP-045 authored as real playbook entries | 6 files at `04--agent-routing/013-...` through `018-...` with CP-027 format compliance |
| REQ-004 | Fixture-target built per 001/research §6 | Files in repo, intentional flaws documented in fixture's README |
| REQ-005 | R0 baseline run captures structural envelope across ≥2 models | Transcripts for cli-copilot under at least gpt-5.5 + opus-4.7 (mirror 059 R0) |
| REQ-006 | R1 stress run completes all 6 scenarios | 6 PASS/PARTIAL/FAIL verdicts captured with grep-checkable signals |
| REQ-007 | If R1 surfaces design gaps, R2 + iterate | Score moves toward 6/0/0 with targeted edits between rounds |
| REQ-008 | `test-report.md` produced mirroring 059's structure | All 11 ANCHOR pairs from 059's test-report present and filled |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-101 | P1 diff sketch (scan-integration.cjs `.gemini/agents` fix) applied | grep confirms `.gemini/agents` constant in scanner |
| REQ-102 | Root playbook index updated for CP-040..CP-045 | Both §10 and §16 reflect new entries |
| REQ-103 | implementation-summary.md updated with final score | completion_pct=100; final score documented |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

A successful 002 produces:

1. All 5 P0 diff sketches applied + 1 P1 diff applied to source files
2. 4-runtime mirror parity for `improve-agent.md` edits
3. 6 new CP-XXX playbook entries written and indexed
4. Fixture-target built and documented
5. Multi-round stress test transcripts captured (R0 + R1 minimum; R2/R3 if needed)
6. `test-report.md` produced mirroring 059's 11-section / 11-ANCHOR structure
7. Final score documented (target 8/0/0 or honest accounting if PARTIAL/FAIL remains)
8. Updated `implementation-summary.md` and `handover.md`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & MITIGATIONS

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Diff applications break existing improve-agent flows | Medium | High | Apply diffs incrementally; verify each via stress scenario before next; rollback path is git-revert |
| Fixture-target underspecified in 001/research; needs design work in 002 | Medium | Medium | First task is to expand fixture spec from 001/research §6 into concrete files |
| R1 stress runs surface multiple unrelated gaps simultaneously (vs 059's clean 2-gap pattern) | Medium | Medium | Triage by P0/P1; treat each as separate Rn round |
| Runtime mirror drift during edits | Low | Medium | Use 059's mirror discipline (edit canonical first, then mirror via cp + Edit for path adjustments) |
| cli-copilot rate limits during multi-round stress | Low | Low | Sequential dispatch with sandbox reset; no parallel calls |
| Score progression doesn't reach 8/0/0 | Medium | Low (acceptable outcome) | Document honest score in test-report; defer remaining gaps to follow-on packet |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:references -->
## 7. REFERENCES

- **Research source:** `001-deep-research-recommendations/research/research.md` (854 lines, all sections — the source of truth for this packet)
- **Methodology template:** `../../059-agent-implement-code/test-report.md` (570 lines, §9 lessons-learned, ANCHOR pair structure)
- **Target triad:** `.opencode/skill/sk-improve-agent/SKILL.md`, `.opencode/agent/improve-agent.md`, `.opencode/command/improve/agent.md`
- **Helper scripts to modify:** `score-candidate.cjs`, `scan-integration.cjs` under `.opencode/skill/sk-improve-agent/scripts/`
- **Playbook root:** `.opencode/skill/cli-copilot/manual_testing_playbook/manual_testing_playbook.md`
- **Memory rules consulted:**
  - `feedback_new_agent_mirror_all_runtimes.md` — 4-runtime mirror discipline
  - `feedback_implementation_summary_placeholders.md` — placeholders OK during planning
  - `feedback_stay_on_main_no_feature_branches.md` — branch hygiene
  - `reference_specs_symlink_and_validator_quirks.md` — git pathspec via .opencode/specs/...
<!-- /ANCHOR:references -->
