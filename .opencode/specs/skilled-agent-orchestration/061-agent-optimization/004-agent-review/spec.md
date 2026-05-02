---
title: "Spec: @review Agent Optimization"
description: "Sub-phase under 061-agent-optimization applying validated sk-improve-agent v2 substrate to @review."
trigger_phrases:
  - "004-agent-review"
  - "review optimization"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/061-agent-optimization/004-agent-review"
    last_updated_at: "2026-05-02T17:30:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Scaffolded sub-phase spec — awaiting dispatch"
    next_safe_action: "dispatch_improve_agent"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-061-2026-05-02"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: @review Agent Optimization

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-05-02 |
| **Branch** | `main` |
| **Parent** | 061-agent-optimization |
| **Target** | `@review` (477 LOC) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`@review` (477 LOC) has not been through the sk-improve-agent v2 lens. After 060's empirical validation (PASS 6/0/0), the substrate is ready to apply across the fleet.

### Purpose
Improvement focus: **Read-only review discipline; severity scoring; pattern enforcement**. READ-ONLY — never edits files; produces findings only. Hunter/Skeptic/Referee challenges discipline.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Canonical agent body: `.opencode/agent/review.md`
- Runtime mirrors: `.claude/agents/review.md`, `.gemini/agents/review.md`, `.codex/agents/review.toml`
- Frontmatter / behavioral rules / output verification / anti-patterns refinements
- Score-weighting dimensions: finding severity calibration, false-positive resistance


### Out of Scope
- Skill changes (sk-improve-agent locked at 060/005 wiring)
- Command changes (`/improve:agent` locked)
- Other agents (each gets its own sub-phase)
- Infrastructure (benchmark fixtures, materializer, scripts) — 060/005 territory

### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `.opencode/agent/review.md` | Update | Promoted candidate body |
| `.claude/agents/review.md` | Update | Mirror sync |
| `.gemini/agents/review.md` | Update | Mirror sync |
| `.codex/agents/review.toml` | Update | Mirror sync (TOML) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-001 | Score uplift on ≥3 of 5 dimensions | Pre/post score JSONs show measurable delta |
| REQ-002 | All 5 legal-stop gates pass | `legal_stop_evaluated.details.gateResults` shows pass for all 5 |
| REQ-003 | 4 runtime mirrors byte-aligned | Manual diff confirms (modulo runtime frontmatter shape) |

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-004 | No dependent skill/command regressions | Smoke-test re-run from sk-improve-agent's manual_testing_playbook |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: graph-metadata.json shows `status=complete`, `completion_pct=100`
- **SC-002**: Score uplift documented in implementation-summary.md with per-dimension delta table
- **SC-003**: All 4 runtime mirrors verified aligned

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | sk-improve-agent v2 substrate | If broken, blocks entire 061 campaign | Validated PASS 6/0/0 in 060 |
| Risk | Score regression on unweighted dimension | Promotion may degrade off-axis behavior | rollback-candidate.cjs available |
| Risk | Mirror drift after promote | Runtime divergence | Mandatory grep audit pre-commit |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Mode choice: `:auto` vs `:confirm`? (Currently planned `:confirm` based on stakes)
- Should we run a smoke-test from a DIFFERENT scenario than the agent's typical caller?

<!-- /ANCHOR:questions -->
