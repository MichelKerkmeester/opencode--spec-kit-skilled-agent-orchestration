---
title: Deep Research Strategy — 060 sk-improve-agent test-report-alignment
description: Iteration tracker for the 10-iter cli-copilot research run on improving sk-improve-agent triad based on 059 methodology.
---

# Deep Research Strategy — 060 sk-improve-agent test-report-alignment

## 1. OVERVIEW

Apply the testing methodology that worked on `@code` (packet 059) to the `sk-improve-agent` triad: SKILL.md, improve-agent.md, /improve:agent command. Produce gap analysis, sketched stress-test scenarios, and prioritized diff sketches. Implementation is deferred to packet 061.

## 2. TOPIC

Apply 059 stress-test methodology to sk-improve-agent triad — produce gap analysis, sketched stress-test scenarios, prioritized diff sketches, and recommended fixture-target design.

## 3. KEY QUESTIONS (remaining)

- [ ] **RQ-1** — Does sk-improve-agent have an analog of "stress-test the failure paths"? If not, what would it look like?
- [ ] **RQ-2** — Where in the improve-loop does an active Critic challenge live, vs reactive anti-pattern reference text?
- [ ] **RQ-3** — Do sk-improve-agent's 14 scripts (run-benchmark, score-candidate, etc.) actually fire when the skill is loaded, or does the agent read SKILL.md and improvise?
- [ ] **RQ-4** — Does the candidate-scoring pipeline test across multiple models for attribution discipline?
- [ ] **RQ-5** — What does Call A (baseline improve attempt) vs Call B (sk-improve-agent-disciplined) look like? Can the differential be made grep-checkable?
- [ ] **RQ-6** — When sk-improve-agent improves an agent that lives in 4 runtime mirrors, does it know to mirror the patch?
- [ ] **RQ-7** — Are the 5 legal-stop gates (contractGate / behaviorGate / integrationGate / evidenceGate / improvementGate) actually grep-checkable from journal output, or LLM-judge-based?

## 4. NON-GOALS

- Implementing recommendations (deferred to packet 061)
- Authoring CP-XXX scenarios as real playbook files (deferred to 061)
- Stress-test execution against sk-improve-agent (deferred to 061)
- Changes to sk-improve-agent's 14 scripts (read-only here)
- Changes to the deep-research framework itself

## 5. STOP CONDITIONS

- Convergence: 3 consecutive iterations with no new findings registry entries
- All 7 RQs marked answered with evidence citations
- 10-iteration cap (hard maximum)
- Stuck for 3 consecutive iterations (>= 12 tool calls without progress)

## 6. ANSWERED QUESTIONS

[None yet — populated as iterations answer questions]

---

<!-- MACHINE-OWNED: START -->

## 7. WHAT WORKED

[First iteration — populated after iteration 1 completes]

## 8. WHAT FAILED

[First iteration — populated after iteration 1 completes]

## 9. EXHAUSTED APPROACHES (do not retry)

[Populated when an approach has been tried from multiple angles without success]

## 10. RULED OUT DIRECTIONS

[Approaches that were investigated and definitively eliminated]

## 11. NEXT FOCUS

**Iteration 1 focus:** RQ-1 + RQ-3. Establish the baseline gap analysis: does sk-improve-agent have any failure-path stress test, and do its 14 scripts actually fire end-to-end? Read SKILL.md and improve-agent.md fully, sample 3-4 representative scripts, and produce evidence-cited answers.

<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

### From packet 059 (the methodology source)

The 059 test-report.md (570 lines) at `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/test-report.md` documents:

- Same-task A/B dispatch shape (Call A: built-in @Task; Call B: prepended agent definition)
- Sandbox discipline (`/tmp/cp-XXX-sandbox/` reset between calls; `--add-dir` flag for copilot)
- Grep-only verdict signals (no LLM-as-judge)
- Multi-round score progression: 5/2/1 → 6/2/0 → 8/0/0 PASS/PARTIAL/FAIL
- Smart-router audit revealed `skill(sk-code)` was firing but routing logic was being skipped
- 5 transferable lessons in §9 (anti-patterns reactive, Critic challenges preventive, audit transcripts for tool-routing fidelity, multi-model baseline matters, skill invocation ≠ application)

### Triad surface area

- `.opencode/skill/sk-improve-agent/SKILL.md` (463 lines)
- `.opencode/agent/improve-agent.md` (246 lines)
- `.opencode/command/improve/agent.md` (456 lines)
- `references/` (12 docs: quick_reference, loop_protocol, evaluator_contract, benchmark_operator_guide, promotion_rules, rollback_runbook, mirror_drift_policy, no_go_conditions, target_onboarding, integration_scanning, README)
- `scripts/` (14 .cjs: run-benchmark, score-candidate, reduce-state, promote-candidate, rollback-candidate, scan-integration, generate-profile, check-mirror-drift, improvement-journal, mutation-coverage, trade-off-detector, candidate-lineage, benchmark-stability)
- `assets/` (6 items: improvement_charter, improvement_strategy, improvement_config (json + reference), target_manifest.jsonc)

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05 (diminishing-returns heuristic)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new` (this is a fresh session)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Capability matrix: cli-copilot model=gpt-5.5, no reasoning-effort flag (set via ~/.copilot/settings.json:effortLevel="high"), no service-tier
- Current generation: 1
- Started: 2026-05-02T11:01:00Z
