---
title: "Spec: @ultra-think → @multi-ai-council Agent Optimization"
description: "Sub-phase under 061-agent-optimization applying validated sk-improve-agent v2 substrate to @ultra-think."
trigger_phrases:
  - "006-agent-multi-ai-council"
  - "ultra-think optimization"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/061-agent-optimization/006-agent-multi-ai-council"
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
# Spec: @ultra-think → @multi-ai-council Agent Optimization

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
| **Target** | `@ultra-think` (526 LOC) → @multi-ai-council |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`@ultra-think` (526 LOC) has not been through the sk-improve-agent v2 lens. After 060's empirical validation (PASS 6/0/0), the substrate is ready to apply across the fleet.

### Purpose
Improvement focus: **Multi-strategy planning architect; cross-runtime RENAME (ultra-think → multi-ai-council)**. Planning-only — never modifies files. RENAME requires touching all 4 runtime mirrors + every reference.

### Rename Scope (sub-phase 006 only)

In addition to standard improvement, rename `@ultra-think` → `@multi-ai-council` across:
- Canonical: `.opencode/agent/ultra-think.md` → `.opencode/agent/multi-ai-council.md`
- 3 mirrors: `.claude/agents/`, `.gemini/agents/`, `.codex/agents/` (TOML)
- Frontmatter `name:` field updated in all 4
- Every reference in `.opencode/skill/*/SKILL.md`, `.opencode/command/*`, READMEs, MEMORY index, CLAUDE.md, AGENTS.md, root README.md
- Verification: `grep -r "@ultra-think\|ultra-think" .opencode .claude .gemini .codex README.md CLAUDE.md AGENTS.md` returns zero hits

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Canonical agent body: `.opencode/agent/ultra-think.md`
- Runtime mirrors: `.claude/agents/ultra-think.md`, `.gemini/agents/ultra-think.md`, `.codex/agents/ultra-think.toml`
- Frontmatter / behavioral rules / output verification / anti-patterns refinements
- Score-weighting dimensions: planning depth, strategy diversity, rename completeness
- Rename across 4 runtimes + every reference

### Out of Scope
- Skill changes (sk-improve-agent locked at 060/005 wiring)
- Command changes (`/improve:agent` locked)
- Other agents (each gets its own sub-phase)
- Infrastructure (benchmark fixtures, materializer, scripts) — 060/005 territory

### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `.opencode/agent/ultra-think.md` | Update | Promoted candidate body |
| `.claude/agents/ultra-think.md` | Update | Mirror sync |
| `.gemini/agents/ultra-think.md` | Update | Mirror sync |
| `.codex/agents/ultra-think.toml` | Update | Mirror sync (TOML) |
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
| REQ-005 | Zero remaining `ultra-think` references | Grep audit returns zero hits |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: graph-metadata.json shows `status=complete`, `completion_pct=100`
- **SC-002**: Score uplift documented in implementation-summary.md with per-dimension delta table
- **SC-003**: All 4 runtime mirrors verified aligned
- **SC-004**: Rename grep-audit clean
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | sk-improve-agent v2 substrate | If broken, blocks entire 061 campaign | Validated PASS 6/0/0 in 060 |
| Risk | Score regression on unweighted dimension | Promotion may degrade off-axis behavior | rollback-candidate.cjs available |
| Risk | Mirror drift after promote | Runtime divergence | Mandatory grep audit pre-commit |
| Risk | Stale `@ultra-think` reference after rename | Broken cross-references | Final grep -r audit across all surfaces |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Mode choice: `:auto` vs `:confirm`? (Currently planned `:auto` based on stakes)
- Should we run a smoke-test from a DIFFERENT scenario than the agent's typical caller?
- After rename, should the `@multi-ai-council` description emphasize multi-AI consensus over single-strategy planning?
<!-- /ANCHOR:questions -->
