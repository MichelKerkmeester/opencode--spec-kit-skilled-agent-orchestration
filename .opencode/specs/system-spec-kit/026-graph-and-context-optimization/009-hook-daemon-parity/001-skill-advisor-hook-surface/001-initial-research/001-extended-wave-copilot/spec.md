---
title: "...timization/009-hook-daemon-parity/001-skill-advisor-hook-surface/001-initial-research/001-extended-wave-copilot/spec]"
description: "Second 10-iteration research wave dispatched via cli-copilot gpt-5.4 high. Deep-dives on wave-1 remaining open questions + new architectural angles (adversarial advisor, observability, migration, concurrent sessions, NFKC interaction)."
trigger_phrases:
  - "020 extended research"
  - "skill advisor copilot wave"
importance_tier: "critical"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/001-initial-research/001-extended-wave-copilot"
    last_updated_at: "2026-04-19T09:05:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Extended wave scaffolded post-wave-1 convergence"
    next_safe_action: "Dispatch iteration 1 via copilot --model gpt-5.4"
    blockers: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
# Feature Specification: 020 Extended Research (cli-copilot)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md (020/001-initial-research) |
| **Sibling**  | ../001/research.md (wave 1 converged 2026-04-19) |
| **Dispatch** | `copilot -p ... --model gpt-5.4 --allow-all-tools --no-ask-user` |
| **Budget** | 10 iterations |
| **Executor** | cli-copilot gpt-5.4 high |

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (deepens wave-1 findings; not architecture-blocking) |
| **Status** | Dispatch Pending |
| **Effort Estimate** | 10 × ~5-10 min = 50-100 min wall clock |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Wave 1 (cli-codex, 2026-04-19) converged with 10 answered questions but flagged 8 open questions as "validation/implementation" work. This wave runs follow-on investigation with a different executor (cli-copilot) for cross-model diversity. Targets: (a) wave-1 open questions, (b) new architectural angles not covered.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 In Scope — 10 research angles

1. Full 200-prompt corpus parity + timing harness DESIGN (wave-1 Q deferred to `005`)
2. Claude UserPromptSubmit exact output semantics — code-evidence capture
3. Copilot userPromptSubmitted model-visible behavior — adapter design
4. Codex PreToolUse/PostToolUse payload + blocking semantics for enforcement-mode advisor
5. Adversarial advisor — prompt injection that poisons advisor output the model trusts
6. Observability + telemetry full design — metrics schema, log lines, alarms, session_health
7. Migration semantics — skill add/remove/rename impact on cached briefs
8. Multi-session / concurrent race conditions (workspace-level cache invalidation)
9. NFKC sanitization interaction (phase 019/003) — does advisor brief need pre-surface sanitization?
10. Synthesis — write `research-extended.md` consolidating wave-1+wave-2 findings with delta

### 3.2 Out of Scope

- Wave-1 questions already fully answered (Q1-Q10 from initial research)
- Implementing any hook wiring
- Advisor algorithm changes
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 - Blockers

- **R1**: 10 iterations complete OR convergence < 0.05 for 3 consecutive
- **R2**: research-extended.md synthesis with wave-1+wave-2 delta table
- **R3**: Each of 10 angles gets at least one iteration of investigation
- **R4**: Cross-model comparison — where copilot findings diverge from codex wave-1, flag explicitly
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] 10 iterations executed
- [ ] research-extended.md written
- [ ] Delta analysis (wave-1 vs wave-2 convergence/divergence) documented
- [ ] All 8 wave-1 open questions either closed or explicitly deferred to implementation child
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Copilot 3-concurrent cap slows throughput | Dispatch sequentially (matches wave-1 pattern) |
| Copilot model availability differences | Detect + surface in per-iter notes |
| Duplicate-of-wave-1 findings waste budget | Prompts explicitly reference wave-1 research.md and require additive work |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

Inherited from wave-1 §Open Questions Remaining. Extended wave targets each.
<!-- /ANCHOR:questions -->
