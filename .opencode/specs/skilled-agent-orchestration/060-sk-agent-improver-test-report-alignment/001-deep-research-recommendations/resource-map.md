<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->
---
title: "Resource Map: 060 — sk-improve-agent Test-Report Alignment"
description: "Lean path ledger for packet 060. Lists targets-under-research, methodology source, output paths, and tooling."
trigger_phrases:
  - "060 resource map"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations"
    last_updated_at: "2026-05-02T10:50:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Resource map authored"
    next_safe_action: "Bootstrap JSON metadata; strict-validate; dispatch deep-research"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Resource Map: 060 — sk-improve-agent Test-Report Alignment

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:targets-under-research -->
## Targets Under Research (read-only in 060)

### Primary triad

| Path | Lines | Role |
|---|---:|---|
| `.opencode/skill/sk-improve-agent/SKILL.md` | 463 | Primary — skill orchestration, gates, contracts |
| `.opencode/agent/improve-agent.md` | 246 | Primary — proposal-only mutator agent |
| `.opencode/command/improve/agent.md` | 456 | Primary — `/improve:agent` command (Phase 0 routing, setup phase) |

### Secondary surface

| Path | Items | Role |
|---|---:|---|
| `.opencode/skill/sk-improve-agent/references/` | 12 docs | quick_reference, loop_protocol, evaluator_contract, benchmark_operator_guide, promotion_rules, rollback_runbook, mirror_drift_policy, no_go_conditions, target_onboarding, integration_scanning, README |
| `.opencode/skill/sk-improve-agent/scripts/` | 14 .cjs | run-benchmark, score-candidate, reduce-state, promote-candidate, rollback-candidate, scan-integration, generate-profile, check-mirror-drift, improvement-journal, mutation-coverage, trade-off-detector, candidate-lineage, benchmark-stability |
| `.opencode/skill/sk-improve-agent/assets/` | 6 items | improvement_charter, improvement_strategy, improvement_config (json + reference), target_manifest.jsonc |
<!-- /ANCHOR:targets-under-research -->

---

<!-- ANCHOR:methodology-source -->
## Methodology Source

| Path | Role |
|---|---|
| `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/test-report.md` | Gold-standard test report (570 lines); §9 lessons-learned is the lens |
| `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/spec.md` | 059 spec for context |
| `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/decision-record.md` | 059 ADRs for cross-reference |
| `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/004-code-vs-general-agent-perf-comparison.md` | CP-026 (baseline scenario format) |
| `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/005-unknown-stack-escalation-discipline.md` | CP-027 (stress-test scenario format reference) |
<!-- /ANCHOR:methodology-source -->

---

<!-- ANCHOR:outputs -->
## Outputs (created in 060)

### Created in Phase 1

| Path | Created by |
|---|---|
| `.opencode/specs/skilled-agent-orchestration/060-.../spec.md` | Hand-authored |
| `.opencode/specs/skilled-agent-orchestration/060-.../plan.md` | Hand-authored |
| `.opencode/specs/skilled-agent-orchestration/060-.../tasks.md` | Hand-authored |
| `.opencode/specs/skilled-agent-orchestration/060-.../checklist.md` | Hand-authored |
| `.opencode/specs/skilled-agent-orchestration/060-.../decision-record.md` | Hand-authored |
| `.opencode/specs/skilled-agent-orchestration/060-.../implementation-summary.md` | Hand-authored (placeholder) |
| `.opencode/specs/skilled-agent-orchestration/060-.../handover.md` | Hand-authored |
| `.opencode/specs/skilled-agent-orchestration/060-.../resource-map.md` | This file |
| `.opencode/specs/skilled-agent-orchestration/060-.../description.json` | `generate-context.js` |
| `.opencode/specs/skilled-agent-orchestration/060-.../graph-metadata.json` | `generate-context.js` |

### Created in Phase 2 (by deep-research workflow)

| Path | Created by |
|---|---|
| `.opencode/specs/.../060-.../research/deep-research-config.json` | sk-deep-research |
| `.opencode/specs/.../060-.../research/deep-research-strategy.md` | sk-deep-research |
| `.opencode/specs/.../060-.../research/deep-research-state.jsonl` | sk-deep-research |
| `.opencode/specs/.../060-.../research/deep-research-dashboard.md` | sk-deep-research |
| `.opencode/specs/.../060-.../research/iterations/iteration-001.md` (.. iteration-NNN.md) | sk-deep-research |
| `.opencode/specs/.../060-.../research/research.md` | sk-deep-research (synthesis) |
| `.opencode/specs/.../060-.../research/resource-map.md` | sk-deep-research (auto-emitted at convergence) |
<!-- /ANCHOR:outputs -->

---

<!-- ANCHOR:tooling -->
## Tooling

| Tool | Purpose |
|---|---|
| `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` | Bootstrap description.json + graph-metadata.json |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --strict` | Strict-validate spec folder |
| `/spec_kit:deep-research:auto` | Owns iteration loop, convergence detection, synthesis |
| `/memory:save` | Refresh continuity surfaces post-completion |
<!-- /ANCHOR:tooling -->
