<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
---
title: "Feature Specification: Apply 059 Stress-Test Methodology to sk-improve-agent Triad [template:level_3/spec.md]"
description: "Research-only packet that applies the testing methodology from packet 059 (@code stress-test campaign) to the sk-improve-agent system. Produces gap analysis, sketched stress-test scenarios, and prioritized diff recommendations to inform a follow-on implementation packet (061)."
trigger_phrases:
  - "060 sk-improve-agent test report alignment"
  - "improve agent improver"
  - "sk-improve-agent stress test"
  - "059 methodology meta-application"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations"
    last_updated_at: "2026-05-02T10:50:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Spec packet scaffolded; awaiting deep-research dispatch"
    next_safe_action: "Dispatch /spec_kit:deep-research:auto with cli-copilot/gpt-5.5/10-iter"
    blockers: []
    key_files:
      - .opencode/skill/sk-improve-agent/SKILL.md
      - .opencode/agent/improve-agent.md
      - .opencode/command/improve/agent.md
      - .opencode/specs/skilled-agent-orchestration/059-agent-implement-code/test-report.md
    completion_pct: 5
    open_questions:
      - "Does sk-improve-agent's 14-script orchestration actually fire when the skill is loaded, or does the agent improvise?"
      - "Where would a Critic-protocol analog live in the improve-loop?"
      - "What does the right fixture-target look like for stress-testing sk-improve-agent end-to-end?"
    answered_questions:
      - "Spec level → 3 (research-heavy with eventual architectural recommendations)"
      - "Executor for research → cli-copilot --model=gpt-5.5 (matches 059 success pattern)"
      - "Iterations cap → 10 with convergence detection"
      - "Scope of 060 → research only; implementation deferred to 061"
---

# Feature Specification: Apply 059 Stress-Test Methodology to sk-improve-agent Triad

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Packet 059 produced a stress-test methodology that surfaced two real design gaps in `@code` after a single round of failure-path scenarios — gaps that the pre-merge structural smoke test (CP-026) had missed entirely. The methodology is reusable: same-task A/B dispatch, sandboxed isolation, grep-only verdict signals, multi-round iterative edits with measurable score progression, and a smart-router audit asking "does the skill *actually fire its routing logic*, or does the agent just read SKILL.md and stop?"

This packet (060) takes that methodology and points it at a meta-target: the **`sk-improve-agent` triad** — `.opencode/skill/sk-improve-agent/SKILL.md` (463 lines), `.opencode/agent/improve-agent.md` (246 lines), and `.opencode/command/improve/agent.md` (456 lines). The triad exists *to improve other agents*. The premise is reflexive: if the 059 lens revealed gaps in `@code`, it should reveal analogous gaps in the agent-improver itself.

**This packet is research-only.** Its deliverable is `research/research.md` synthesizing 10 deep-research iterations into: (a) gap analysis mapped to 059's transferable lessons, (b) 6-10 sketched stress-test scenarios in CP-XXX format, (c) prioritized diff sketches for the 3 target files, (d) a recommended fixture-target design. *Implementation* of those recommendations is explicitly deferred to a follow-on packet (061) that will reuse the 059 stress-test pattern against the improved triad.

**Key Decisions:** ADR-1 cli-copilot+gpt-5.5 executor; ADR-2 10-iteration cap with convergence; ADR-3 research-only scope; ADR-4 research the real triad, not a stand-in fixture.

**Critical Dependencies:** `sk-deep-research` v1.9.0+ (cli-copilot wiring); `~/.copilot/settings.json:effortLevel="high"` (already set); 059 test-report.md as methodology reference.
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
| **Branch** | `main` (per memory: stay on main, no feature branches) |
| **Parent** | `specs/skilled-agent-orchestration/` |
| **Estimated LOC** | 0 (research-only; no production code in this packet) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `sk-improve-agent` triad is the system's *self-improvement engine*: it scaffolds candidates, scores them across 5 integration-aware dimensions, runs benchmarks, and gates promotion through 5 legal-stop conditions (contractGate, behaviorGate, integrationGate, evidenceGate, improvementGate). It owns 14 orchestration scripts under `.opencode/skill/sk-improve-agent/scripts/` and 12 reference docs.

Despite that surface area, the triad has never been stress-tested end-to-end. Its claims about candidate-scoring determinism, journal contract enforcement, mirror-drift detection, and trade-off detection are validated only by code-level unit/integration tests — not by the kind of failure-path A/B differential that surfaced gaps in `@code` (059). The exploration-agent report flagged six concrete weaknesses against the 059 lens:

- No same-task A/B comparison (baseline improve attempt vs. sk-improve-agent-disciplined improve attempt)
- No sandboxed isolation with reset discipline
- No grep-only verdict signals (current evaluation depends on script outputs that may not be tested holistically)
- No multi-round iteration with code-body edits between rounds
- No smart-router audit verifying the 14 scripts actually fire vs. the agent reading SKILL.md and improvising
- Journal contract defined but never validated against actual end-to-end runs

### Purpose

Produce a research-grade plan — not an implementation — for closing those gaps. The research output (`research/research.md`) becomes the input to a follow-on packet (061) that will (a) apply the recommended diffs, (b) author the sketched stress-test scenarios as real CP-XXX playbook entries, and (c) execute multi-round stress tests with the 059 score-progression discipline.

The reflexive nature is deliberate. If `sk-improve-agent` is supposed to improve agents, it should be improvable by its own kind of methodology. This packet treats the triad as the agent-under-test in a 059-style harness — but operating *one level up*, on documents and recommendations rather than on running code.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Investigate** the current state of all three target files (SKILL.md, improve-agent.md, improve/agent.md) plus 14 scripts, 12 references, 6 assets
- **Map** each behavioral claim in the triad to a 059-style stress-test scenario
- **Sketch** 6-10 CP-XXX scenario specs in the same format used by 059 (CP-027 through CP-034)
- **Draft** prioritized diff sketches for each of the three target files
- **Recommend** a fixture-target design (a small "agent-under-improvement" used as the controlled case)
- **Synthesize** all findings into `research/research.md` with the same shape as 059's `test-report.md`'s lessons-learned structure
- **Update** `implementation-summary.md` after research completes with a synthesis pointer

### Out of Scope

- **Any implementation of recommendations.** Diffs may be sketched in research/research.md but MUST NOT be applied to SKILL.md, improve-agent.md, or improve/agent.md in this packet. (Deferred to packet 061.)
- **Authoring of CP-XXX scenarios as real playbook files.** Specs are sketched in research; promotion to `manual_testing_playbook/` happens in 061.
- **Stress-test execution against sk-improve-agent.** No actual A/B dispatches in this packet. (Deferred to 061.)
- **Changes to sk-improve-agent's 14 scripts.** Those are read-only references during research.
- **Changes to the deep-research framework itself.** This packet uses it; doesn't modify it.

### Files to Change (in 060)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/.../060-.../spec.md` | Create | This file |
| `.opencode/specs/.../060-.../plan.md` | Create | Phase plan |
| `.opencode/specs/.../060-.../tasks.md` | Create | Task breakdown |
| `.opencode/specs/.../060-.../checklist.md` | Create | Level 3 checklist |
| `.opencode/specs/.../060-.../decision-record.md` | Create | 4 ADRs |
| `.opencode/specs/.../060-.../implementation-summary.md` | Create | Placeholder until research completes |
| `.opencode/specs/.../060-.../handover.md` | Create | Resume state |
| `.opencode/specs/.../060-.../resource-map.md` | Create | File ledger |
| `.opencode/specs/.../060-.../description.json` | Create (auto) | via generate-context.js |
| `.opencode/specs/.../060-.../graph-metadata.json` | Create (auto) | via generate-context.js |
| `.opencode/specs/.../060-.../research/*` | Create (auto) | via /spec_kit:deep-research:auto |

### Files to Reference (NOT modify in 060)

| File Path | Role |
|-----------|------|
| `.opencode/skill/sk-improve-agent/SKILL.md` | Primary research target (463 lines) |
| `.opencode/agent/improve-agent.md` | Primary research target (246 lines) |
| `.opencode/command/improve/agent.md` | Primary research target (456 lines) |
| `.opencode/skill/sk-improve-agent/references/` | Secondary surface (12 docs) |
| `.opencode/skill/sk-improve-agent/scripts/` | Secondary surface (14 .cjs scripts) |
| `.opencode/skill/sk-improve-agent/assets/` | Secondary surface (6 items) |
| `.opencode/specs/.../059-agent-implement-code/test-report.md` | Methodology reference (570 lines) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Spec folder validates strict | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment --strict` exits 0 |
| REQ-002 | Deep-research dispatch succeeds | `/spec_kit:deep-research:auto` with cli-copilot/gpt-5.5/10-iter runs to completion (convergence or 10 iters) |
| REQ-003 | research/research.md contains gap analysis | Sections present: gap-analysis, scenario-sketches, diff-sketches, fixture-design |
| REQ-004 | Each of the 7 research questions has an answer | RQ-1 through RQ-7 (§5 below) addressed in research.md, each with evidence citations |
| REQ-005 | At least 6 CP-XXX scenarios sketched | research/research.md includes scenario sketches for analogs of CP-027..CP-034 patterns |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-101 | Diff sketches cite specific section anchors | Every diff sketch names the SKILL.md / improve-agent.md / improve/agent.md section it modifies |
| REQ-102 | Fixture-target design is concrete | research.md proposes a specific small target agent (path or sketch) for use as the controlled case in 061 |
| REQ-103 | implementation-summary.md updated post-research | completion_pct=100; recent_action reflects synthesis output |

### P2 — Nice to Have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-201 | Multi-model attribution baseline sketched | research.md proposes how 061 should run a multi-model R0 baseline |
| REQ-202 | 4-runtime mirror discipline check | research.md confirms whether sk-improve-agent currently knows to mirror patches across 4 runtime surfaces |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:research-questions -->
## 5. RESEARCH QUESTIONS (Iteration Anchors)

The 10 deep-research iterations should anchor on these 7 questions, mapped to the transferable lessons from 059's `test-report.md` §9. Each question is something the iterations are expected to answer concretely with evidence citations.

| # | Question | Maps to 059 Lesson |
|---|---|---|
| **RQ-1** | Does `sk-improve-agent` have an analog of "stress-test the failure paths"? If not, what would it look like? | L1 — Single-task structural tests are insufficient |
| **RQ-2** | Where in the improve-loop does an *active Critic challenge* live, vs reactive anti-pattern reference text? | L2 — Anti-patterns are reactive; Critic challenges are preventive |
| **RQ-3** | Do `sk-improve-agent`'s 14 scripts (run-benchmark, score-candidate, etc.) actually fire when the skill is loaded, or does the agent read SKILL.md and improvise? | L3 + L5 — Audit transcripts for tool-routing fidelity; skill invocation ≠ application |
| **RQ-4** | Does the candidate-scoring pipeline test across multiple models for attribution discipline? | L4 — Multi-model baseline matters |
| **RQ-5** | What does Call A (baseline improve attempt) vs Call B (sk-improve-agent-disciplined improve attempt) look like? Can the differential be made grep-checkable? | 059 A/B pattern (whole-methodology) |
| **RQ-6** | When `sk-improve-agent` improves an agent that lives in 4 runtime mirrors (.opencode/.claude/.gemini/.codex), does it know to mirror the patch? | 4-runtime sync rule (memory) |
| **RQ-7** | Are the 5 legal-stop gates (contractGate / behaviorGate / integrationGate / evidenceGate / improvementGate) actually grep-checkable from journal output, or LLM-judge-based? | 059 grep-only verdicts |

### Why these specific questions

Each question targets a transferable lesson from 059 §9. RQ-1 maps to L1's discovery that a single-task structural test missed gaps. RQ-2 maps to L2's most-cited finding (anti-pattern table rows didn't change behavior; Critic challenges did). RQ-3 maps to the smart-router audit that found `skill(sk-code)` was firing but routing logic was being skipped. RQ-4 maps to R0's multi-model baseline value for attribution. RQ-5 is the methodology's structural shape. RQ-6 is the 4-runtime sync rule that 059 itself had to obey. RQ-7 is the grep-only verdict discipline that made 059's signals unambiguous.

If the answer to any RQ is "yes, sk-improve-agent already does this," the research output should cite the specific code/contract that proves it. If the answer is "no," the output should sketch what closing the gap would look like.
<!-- /ANCHOR:research-questions -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

A successful 060 produces:

1. **Validated spec folder** — strict-validate exits 0
2. **10 iteration files** — `research/iterations/iteration-{001..010}.md` (or fewer if convergence triggers earlier)
3. **Synthesis output** — `research/research.md` with these sections:
   - Gap Analysis (per RQ-1..RQ-7)
   - Scenario Sketches (≥6 in CP-XXX format)
   - Diff Sketches (per target file, with section anchors)
   - Fixture-Target Recommendation
   - Lessons Learned (mirroring 059 §9 structure)
   - Hand-off Notes for Packet 061
4. **Updated implementation-summary.md** — completion_pct=100, synthesis pointer cited
5. **Memory save** — _memory.continuity blocks refreshed; recent_action reflects synthesis completion
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & MITIGATIONS

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Deep-research convergence stops early at <5 iterations | Medium | Medium | If <5 iterations, manually inspect convergence signal; may rerun with refined research charter |
| cli-copilot dispatch fails parse-time on flag combination | Low | High | Pre-flight verified: `--executor=cli-copilot --model=gpt-5.5 --max-iterations=10` accepted; `--reasoning-effort` omitted (handled by ~/.copilot/settings.json) |
| Iteration outputs diverge instead of converging | Medium | Low | Convergence detection + 10-iter cap bound the cost; partial findings still useful |
| Research stays too abstract (no concrete diff sketches) | Medium | Medium | Spec.md REQ-101 explicitly requires section-anchor citations in diff sketches |
| Recommendations conflict with sk-improve-agent's existing contracts | Low | Medium | Decision-record ADR-3 keeps research advisory; conflicts are surfaced for human judgment in 061 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:references -->
## 8. REFERENCES

- **Methodology source:** `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/test-report.md` (570 lines, lessons-learned in §9)
- **Target triad:**
  - `.opencode/skill/sk-improve-agent/SKILL.md` (463 lines)
  - `.opencode/agent/improve-agent.md` (246 lines)
  - `.opencode/command/improve/agent.md` (456 lines)
- **Deep-research wiring:** `.opencode/skill/sk-deep-research/changelog/v1.9.0.0.md` (cli-copilot integration); `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:32-38` (flag-support map)
- **Memory rules** consulted:
  - `feedback_implementation_summary_placeholders.md` — placeholders OK during planning
  - `feedback_new_agent_mirror_all_runtimes.md` — 4-runtime mirror discipline (relevant to RQ-6)
  - `feedback_stay_on_main_no_feature_branches.md` — branch hygiene
  - `reference_specs_symlink_and_validator_quirks.md` — git pathspec via .opencode/specs/...
<!-- /ANCHOR:references -->
