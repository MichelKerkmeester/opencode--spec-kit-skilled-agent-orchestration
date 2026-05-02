<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
---
title: "Feature Specification: Followup research on 060/002 R1 results + meta-finding"
description: "Phase 003 of 060. Run 10 cli-copilot iterations on the question: given 060/002's R1 score (0/2/4 PASS/PARTIAL/FAIL) and the test-layer-selection meta-finding, how do we further improve sk-improve-agent + the testing methodology + downstream packets?"
trigger_phrases:
  - "060/003"
  - "060 followup research"
  - "improve sk-improve-agent further"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research"
    last_updated_at: "2026-05-02T13:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Phase 003 spec scaffolded"
    next_safe_action: "Dispatch 10-iter cli-copilot loop"
    blockers: []
    key_files:
      - .opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md
      - .opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/stress-runs/stage4-summary.md
      - .opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations/research/research.md
    completion_pct: 5
    open_questions:
      - "Concrete diff sketches to land in 062 (the actionable code-edit packet)"
      - "Whether 061 should reuse CP-040..CP-045 IDs or create CP-046..CP-051 variants"
      - "Are there other meta-agents in the system that share the @improve-agent command-orchestrator pattern and need similar treatment?"
    answered_questions: []
---

# Feature Specification: Followup Research on 060/002 R1 Results

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Packet 060/002 ran R1 stress tests (CP-040..CP-045) and scored 0 PASS / 2 PARTIAL / 4 FAIL. The failures surfaced a methodology-level meta-finding: the 059 same-task A/B prepend-agent-body pattern works when discipline lives in the agent body (like @code) but breaks when discipline lives at the command/orchestrator layer above the agent body (like @improve-agent — proposal-only mutator per ADR-001).

Phase 003 takes those two artifacts (R1 scores + meta-finding) as the input to 10 cli-copilot deep-research iterations and produces concrete recommendations for: (a) how to actually improve sk-improve-agent further given what R1 showed, (b) how packet 061 should structure its command-flow stress tests, (c) whether other meta-agents in the system need the same treatment, (d) how to generalize the test-layer-selection lesson into a reusable testing template.

**Key Decisions:** ADR-1 cli-copilot+gpt-5.5 executor (matches 060/001+059 success pattern); ADR-2 10-iter cap with convergence; ADR-3 research-only scope (no source edits this packet); ADR-4 build on 060/002 R1 transcripts as primary evidence (don't re-run scenarios).
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
| **Parent** | `specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/` (phase parent) |
| **Siblings** | `001-deep-research-recommendations/` + `002-stress-test-implementation/` |
| **Estimated LOC** | 0 (research-only) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

R1 produced two distinct artifacts:

1. **Per-scenario verdicts** (CP-040 PARTIAL, CP-041 PARTIAL, CP-042..CP-045 FAIL) — each verdict carries grep-checkable evidence about specific gaps in the disciplined path.
2. **Meta-finding** (test-layer-selection) — bigger insight transferable beyond this packet.

What's missing is a structured plan for what to do next. Specifically:
- Which gaps R1 surfaced are best closed at the agent-body layer vs the command layer
- Whether the 6 P0/P1 diffs we already applied need further iteration or are sufficient
- What 061 should look like operationally (not just "it should test command flow" but "here's the exact dispatch shape and grep contract")
- Whether the test-layer-selection lesson generalizes — are there other meta-agents in the system that need the same treatment? (e.g. @write, @improve-prompt, @debug, @deep-research, @deep-review)
- How to write a reusable "meta-agent stress-test rubric" so future packets don't repeat the wrong-layer mistake

### Purpose

Run 10 deep-research iterations on these questions, producing `research/research.md` with prioritized recommendations + sketched packet structures + a reusable rubric.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Read 060/001/research/research.md, 060/002/test-report.md, and 060/002/stress-runs/* as primary evidence
- Read 060/002 modified source files (the 6 P0/P1 diffs already applied) to understand current state
- Investigate other meta-agents in `.opencode/agent/*.md` — identify which share @improve-agent's command-orchestrator pattern
- Synthesize 10 iterations into `research/research.md` with: gap analysis (per-RQ), 061 packet sketch, generalization recommendations, reusable rubric
- Hand-off notes to packets 061 (command-flow stress tests) and 062 (further sk-improve-agent edits if the research supports them)

### Out of Scope

- Any source-file edits (research-only this packet; matches 060/001 ADR-3)
- Re-running CP-040..CP-045 stress tests (R1 results are the input, not the target)
- Designing 061's playbook entries (that's 061's job; 003 sketches the approach)
- Constitutional rule additions (research surfaces; user decides)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:research-questions -->
## 4. RESEARCH QUESTIONS (Iteration Anchors)

| # | Question |
|---|---|
| **RQ-1** | Of the 6 P0/P1 diffs already applied in 060/002, which would meaningfully improve under further iteration vs which are functionally complete as shipped? |
| **RQ-2** | What's the exact dispatch shape for 061's Call B? `/improve:agent <target> :auto --spec-folder=...` or YAML-step-by-step or something else? |
| **RQ-3** | What grep contract should 061's Call B verdict use? List specific journal events + artifact paths + script invocation traces with file:line evidence. |
| **RQ-4** | Which OTHER meta-agents in the system share @improve-agent's command-orchestrator pattern (discipline in command, not body)? Read each .opencode/agent/*.md and classify body-level vs command-level. |
| **RQ-5** | Are there gaps in 060/001's research that R1 surfaced (i.e. things the 854-line synthesis missed that the actual stress run revealed)? |
| **RQ-6** | What's the right rubric for grading meta-agent stress tests? Should the 5-dim Coder Acceptance Rubric (from 059) be adapted, or is a different shape needed? |
| **RQ-7** | How do we generalize the test-layer-selection finding into a reusable template? What questions should a future packet author ask before authoring CP-XXX scenarios for any new agent? |
<!-- /ANCHOR:research-questions -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

A successful 003 produces:

1. ≤10 iteration files at `research/iterations/iteration-001.md` through `iteration-010.md` (or fewer if convergence)
2. `research/research.md` synthesis with: §1 Executive Summary, §2 Methodology, §3 Per-RQ Findings, §4 061 Packet Sketch, §5 Other Meta-Agent Audit, §6 Reusable Rubric Template, §7 Hand-off Notes
3. Updated `implementation-summary.md` (completion_pct=100; metrics filled)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:references -->
## 6. REFERENCES

- **Primary evidence** (R1 results + meta-finding):
  - `../002-stress-test-implementation/test-report.md` — narrative + meta-finding
  - `../002-stress-test-implementation/stress-runs/stage4-summary.md` — scores
  - `../002-stress-test-implementation/stress-runs/stage4-run-log.txt` — full transcripts
- **Source-of-recommendations:** `../001-deep-research-recommendations/research/research.md` (854 lines)
- **Methodology template:** `../../059-agent-implement-code/test-report.md`
- **Modified source files (state after 002):** `.opencode/agent/improve-agent.md` (4 mirrors), `.opencode/skill/sk-improve-agent/{SKILL.md,scripts/scan-integration.cjs,scripts/score-candidate.cjs}`, `.opencode/command/improve/assets/improve_improve-agent_{auto,confirm}.yaml`
- **Other meta-agents to classify (RQ-4):** `.opencode/agent/{write,improve-agent,improve-prompt,debug,deep-research,deep-review,context,orchestrate,review,code}.md`
<!-- /ANCHOR:references -->
