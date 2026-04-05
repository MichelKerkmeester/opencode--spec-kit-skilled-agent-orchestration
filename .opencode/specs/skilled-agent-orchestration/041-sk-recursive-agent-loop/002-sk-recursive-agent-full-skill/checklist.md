---
title: "Verification Checklist: Agent Improvement Full Skill [skilled-agent-orchestration/041-sk-agent-improver-loop/002-sk-agent-improver-full-skill/checklist]"
description: "Planning and implementation checklist for the follow-on full-skill packet."
trigger_phrases:
  - "agent improvement full skill checklist"
  - "benchmark harness verification"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: Agent Improvement Full Skill

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Follow-on requirements documented in `spec.md` [EVIDENCE: `spec.md` defines the benchmark-first full-skill scope, target-profile expansion, and downstream packaging boundary.]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` [EVIDENCE: `plan.md` phases cover benchmark harness, runtime generalization, second-target onboarding, reporting, and final review.]
- [x] CHK-003 [P1] Baseline dependency on packet `041-sk-agent-improver-loop` is explicit [EVIDENCE: `spec.md`, `plan.md`, and `tasks.md` all identify packet 041 as the verified baseline.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Handover evaluation is benchmark-backed rather than prompt-surface-only [EVIDENCE: reusable handover fixtures now exist under `.opencode/skill/sk-agent-improver/assets/fixtures/handover/`, benchmark reports exist at `improvement/benchmark-runs/handover/run-001.json`, `run-002.json`, and `run-candidate-weak.json`, and prompt scoring is now paired with deterministic output benchmarking.]
- [x] CHK-011 [P0] Shared runtime schema supports target profiles without one-off redesign [EVIDENCE: `.opencode/skill/sk-agent-improver/assets/improvement_config.json` now declares `targetProfile`, profile catalogs, benchmark roots, and stop rules; `.opencode/skill/sk-agent-improver/assets/target_manifest.jsonc` is profile-aware; `.opencode/skill/sk-agent-improver/scripts/reduce-state.cjs` now groups records by target profile.]
- [x] CHK-012 [P1] Second target profile exists with explicit evaluator rules [EVIDENCE: `.opencode/skill/sk-agent-improver/assets/target-profiles/context-prime.json`, `.opencode/skill/sk-agent-improver/assets/fixtures/context-prime/`, `.opencode/agent/context-prime.md`, `.codex/agents/context-prime.toml`, and `improvement/score-context-prime-candidate-001.json` now define and verify the second target's `session_bootstrap()`-first benchmark and prompt-surface contract.]
- [x] CHK-013 [P1] Reporting surfaces distinguish target families and repeated failure modes [EVIDENCE: `improvement/agent-improvement-dashboard.md` and `improvement/experiment-registry.json` now separate `handover` and `context-prime` metrics and list repeated failure modes per profile.]
- [x] CHK-014 [P1] Target onboarding guidance exists for future operators [EVIDENCE: `.opencode/skill/sk-agent-improver/references/target_onboarding.md` documents the profile, fixture, manifest, and benchmark workflow for future targets.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Handover fixture runs are repeatable across multiple executions [EVIDENCE: `improvement/benchmark-runs/handover/run-001.json` and `run-002.json` both scored `100`, and `improvement/benchmark-runs/handover/repeatability.json` records `passed: true` with tolerance `0`.]
- [x] CHK-021 [P0] Invalid-target promotion still fails after runtime expansion [EVIDENCE: `improvement/promotion-invalid-target.log` records `Cannot promote: target .opencode/agent/context-prime.md is not the single allowed canonical target .opencode/agent/handover.md`.]
- [x] CHK-022 [P1] Invalid-target rollback still fails after runtime expansion [EVIDENCE: `improvement/rollback-invalid-target.log` records `Cannot roll back: target .opencode/agent/context-prime.md is not the single allowed canonical target .opencode/agent/handover.md`.]
- [x] CHK-023 [P1] Second-target bounded run completes with coherent ledger and dashboard evidence [EVIDENCE: `improvement/score-context-prime-candidate-001.json`, `improvement/benchmark-runs/context-prime/run-001.json`, `improvement/benchmark-runs/context-prime/run-candidate-weak.json`, `improvement/agent-improvement-state.jsonl`, and `improvement/agent-improvement-dashboard.md` all record the bounded `context-prime` run coherently under the updated `session_bootstrap()` contract.]
- [x] CHK-024 [P1] Strict packet validation passes after implementation [EVIDENCE: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/002-sk-agent-improver-full-skill --strict` returned `RESULT: PASSED` with `Errors: 0  Warnings: 0`.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Canonical mutation remains manifest-enforced after full-skill upgrades [EVIDENCE: `.opencode/skill/sk-agent-improver/assets/target_manifest.jsonc` still defines exactly one canonical target, `.opencode/skill/sk-agent-improver/scripts/promote-candidate.cjs` and `rollback-candidate.cjs` still resolve a single canonical target from the manifest, and the invalid-target logs prove `context-prime` cannot cross that boundary.]
- [x] CHK-031 [P0] Mirror sync remains downstream packaging, not experiment evidence [EVIDENCE: `.opencode/skill/sk-agent-improver/references/mirror_drift_policy.md` keeps mirror work downstream-only, and `improvement/mirror-drift-report.md` records parity review separately from benchmark reports.]
- [x] CHK-032 [P1] No-go automation exists for weak signals, infra instability, or drift ambiguity [EVIDENCE: `.opencode/skill/sk-agent-improver/assets/improvement_config.json` defines `stopRules`, `.opencode/skill/sk-agent-improver/scripts/reduce-state.cjs` now evaluates those limits into `stopStatus`, `improvement/experiment-registry.json` records `stopStatus`, `improvement/agent-improvement-dashboard.md` renders a `Stop Status` section, and `.opencode/command/spec_kit/assets/improve_agent-improver_auto.yaml` now points the auto workflow at reducer-enforced stop status.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Follow-on packet docs exist and are synchronized [EVIDENCE: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` now exist in this packet.]
- [x] CHK-041 [P1] Benchmark operator guidance is documented [EVIDENCE: `.opencode/skill/sk-agent-improver/references/benchmark_operator_guide.md` now documents the packet-local layout, repeatability rule, and benchmark runner usage.]
- [x] CHK-042 [P1] Target onboarding guide is documented [EVIDENCE: `.opencode/skill/sk-agent-improver/references/target_onboarding.md` now documents preconditions, required steps, and classification rules for adding future targets.]
- [x] CHK-043 [P2] Residual out-of-scope boundaries are documented clearly after implementation [EVIDENCE: `implementation-summary.md` and `.opencode/skill/sk-agent-improver/README.md` both now state that only `handover` remains promotion-eligible and broader agent families remain out of scope.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Required Level 3 planning docs exist in this phase [EVIDENCE: all required Level 3 spec docs now exist in `041-sk-agent-improver-loop/002-sk-agent-improver-full-skill`.]
- [x] CHK-051 [P1] Benchmark evidence lives in a dedicated packet-local runtime area [EVIDENCE: benchmark evidence is stored under `improvement/benchmark-runs/` with profile-specific subfolders and reducer outputs at `improvement/agent-improvement-dashboard.md` and `improvement/experiment-registry.json`.]
- [x] CHK-052 [P2] Second-target evidence remains distinguishable from handover benchmark evidence [EVIDENCE: `improvement/benchmark-runs/handover/` and `improvement/benchmark-runs/context-prime/` remain separate, and the reducer groups those profiles independently.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

### Packet Status

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 17 | 17/17 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-04-03
**Status**: Implemented and verified; packet-local review evidence is recorded in `review/`, and the final parallel read-only re-check returned `NO_FINDINGS`
<!-- /ANCHOR:summary -->

---

## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Benchmark harness architecture is documented in `decision-record.md` [EVIDENCE: `decision-record.md` ADR-001 and ADR-005 document the benchmark-first architecture and the split between reusable fixtures and packet-local benchmark evidence.]
- [x] CHK-101 [P1] Target-profile expansion tradeoffs are documented in `decision-record.md` [EVIDENCE: `decision-record.md` ADR-002 and ADR-004 document why only one second target was added and why `context-prime` was chosen as candidate-only.]
- [x] CHK-102 [P1] Packaging/evaluation separation remains documented after implementation [EVIDENCE: `decision-record.md` ADR-003 and `.opencode/skill/sk-agent-improver/references/mirror_drift_policy.md` both preserve the separation between benchmark truth and downstream packaging parity.]

---

## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Full-skill rollout boundaries are proven by evidence, not only by prose [EVIDENCE: `improvement/agent-improvement-state.jsonl`, `improvement/agent-improvement-dashboard.md`, `improvement/promotion-invalid-target.log`, `improvement/rollback-invalid-target.log`, `improvement/mirror-drift-report.md`, and `improvement/score-context-prime-candidate-001.json` prove the rollout boundaries with concrete artifacts.]
- [x] CHK-121 [P1] Second-target expansion keeps the trust boundary understandable [EVIDENCE: `.opencode/skill/sk-agent-improver/assets/target_manifest.jsonc`, `.opencode/skill/sk-agent-improver/references/second_target_evaluation.md`, and `decision-record.md` all keep `context-prime` candidate-only and `handover` canonical.]
- [x] CHK-122 [P1] Operator runbooks cover benchmark runs, target onboarding, and downstream parity handling [EVIDENCE: `.opencode/skill/sk-agent-improver/references/benchmark_operator_guide.md`, `.opencode/skill/sk-agent-improver/references/target_onboarding.md`, and `.opencode/skill/sk-agent-improver/references/mirror_drift_policy.md` now cover those operator workflows.]

---

## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents remain synchronized after implementation [EVIDENCE: strict packet validation passed after the implementation updates, the packet docs now all describe the same benchmark-first, two-profile bounded model, and `review/parallel-review-summary.md` records the post-fix review closeout.]
- [x] CHK-141 [P2] `implementation-summary.md` is upgraded from planning stub to completed summary at closeout [EVIDENCE: `implementation-summary.md` now documents completed work, verification, and residual limitations instead of planning-only text.]
