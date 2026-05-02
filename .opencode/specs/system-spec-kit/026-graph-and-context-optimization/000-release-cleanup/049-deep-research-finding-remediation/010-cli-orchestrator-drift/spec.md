---
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
title: "Feature Specification: 010 CLI Orchestrator Skill Doc Drift [template:level_2/spec.md]"
description: "Resolve six findings F-007-B2-01..06 from packet 046 iteration-007 across the cli-opencode, cli-copilot, cli-codex, cli-claude-code, and cli-gemini skills. Reconciles SKILL.md dispatch contracts, model/effort pins, and approval-gated write templates so the CLI orchestrator skills speak with one voice."
trigger_phrases:
  - "F-007-B2"
  - "cli orchestrator drift"
  - "cli-opencode subagent contract"
  - "cli-copilot effort flag"
  - "cli prompt templates"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/010-cli-orchestrator-drift"
    last_updated_at: "2026-05-01T07:25:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Spec authored; ready for implementation"
    next_safe_action: "Apply six surgical doc edits then validate strict"
    blockers: []
    key_files:
      - ".opencode/skill/cli-opencode/SKILL.md"
      - ".opencode/skill/cli-opencode/references/agent_delegation.md"
      - ".opencode/skill/cli-copilot/SKILL.md"
      - ".opencode/skill/cli-codex/assets/prompt_templates.md"
      - ".opencode/skill/cli-claude-code/assets/prompt_templates.md"
      - ".opencode/skill/cli-gemini/assets/prompt_templates.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-010-cli-drift"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Feature Specification: 010 CLI Orchestrator Skill Doc Drift

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (3 findings) + P2 (3 findings) |
| **Status** | In Progress |
| **Created** | 2026-05-01 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-test-reliability |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The CLI orchestrator skills (`cli-opencode`, `cli-copilot`, `cli-codex`, `cli-claude-code`, `cli-gemini`) drifted across five files. cli-opencode contradicts itself on subagent invocation (claims subagents are not directly invokable, then invokes them in references). cli-copilot's effort flag prose is inconsistent with the live CLI. The five prompt-templates files omit required model/effort/tier pins, embed `--yolo` write flags without approval gates, and miss explicit `--model` defaults.

### Purpose
Land six surgical doc edits so each CLI skill states one consistent dispatch contract, pins model/effort/tier per template, and gates write-side flags behind explicit approval language.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Six surgical doc edits, one per finding F-007-B2-01..06
- Strict validation pass on this packet
- One commit pushed to `origin main`

### Out of Scope
- Live CLI version verification (treat the live `--effort` flag prose as authoritative since copilot 1.0.36+ is the documented baseline elsewhere in the SKILL.md)
- Adding new prompt templates; only fix existing ones
- Behavioral changes outside doc text

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/cli-opencode/SKILL.md` | Modify | Disambiguate subagent dispatch contract — note the `references/agent_delegation.md` examples are routed-via-orchestrate, not direct invocation |
| `.opencode/skill/cli-opencode/references/agent_delegation.md` | Modify | State explicitly that deep-research/deep-review/improve-* dispatch goes through their parent commands, not via `--agent <slug>` |
| `.opencode/skill/cli-copilot/SKILL.md` | Modify | Reconcile effort-flag prose; document precedence (CLI flag > config) and link copilot 1.0.36+ baseline |
| `.opencode/skill/cli-codex/assets/prompt_templates.md` | Modify | Add explicit `--model gpt-5.5 --reasoning-effort high` pins to single-file/multi-file templates; correct `--full-auto` description |
| `.opencode/skill/cli-claude-code/assets/prompt_templates.md` | Modify | Add explicit `--model claude-sonnet-4-6` to single-file/multi-file templates |
| `.opencode/skill/cli-gemini/assets/prompt_templates.md` | Modify | Replace bare `--yolo` in write templates with explicit "approved-write" gating language and split safe templates |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional
- FR-1: cli-opencode SKILL.md subagent table includes a footnote that direct invocation is illegal under single-hop NDP and the only safe surface is the parent command for `deep-research`/`deep-review`/`improve-*`.
- FR-2: cli-copilot SKILL.md effort-flag section states one truth: `--effort` / `--reasoning-effort` is the CLI flag (1.0.36+); persistent default lives in `~/.copilot/config.json`; CLI flag wins when both present.
- FR-3: cli-codex prompt_templates.md single-file and multi-file templates include explicit `--model gpt-5.5` and either `--reasoning-effort high` or note that `service_tier="fast"` MUST be opt-in (project memory rule).
- FR-4: cli-claude-code prompt_templates.md single-file and multi-file templates include `--model claude-sonnet-4-6`.
- FR-5: cli-gemini prompt_templates.md write templates split into safe (`--approval-mode interactive`) vs explicitly-approved (`--yolo` only after the caller has confirmed sandbox/path safety).
- FR-6: cli-opencode references/agent_delegation.md deep-research/deep-review section states that direct `opencode run --agent deep-research` is forbidden; routing must be through `/spec_kit:deep-research` parent command.

### Non-Functional
- NFR-1: `validate.sh --strict` exit 0 for this packet.
- NFR-2: No product-code change; no stress-test impact expected.
- NFR-3: Each edit cites its finding ID in a comment marker for traceability.

### Constraints
- Stay on `main`; commit pushes immediately to `origin main`.
- No template substitution beyond the six cited locations.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] Spec authored
- [x] All six doc edits applied with finding ID citations
- [ ] `validate.sh --strict` exit 0
- [ ] One commit pushed to `origin main`
- [x] implementation-summary.md updated with Findings closed table (6 rows)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Edit breaks downstream skill render | Edits are inline doc text only; no schema or template-source change; markers can be cherry-pick reverted |
| Stress regression | None expected — no product code touched; wave master confirms with `npm run stress` |
| Live CLI flag drift | Each fix references the SKILL.md's documented version baseline; future CLI version bumps are tracked separately |

Dependencies:
- Source of truth: `046-system-deep-research-bugs-and-improvements/research/research.md` §6
- Validate: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- No other packet dependencies
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:edges -->
## L2: EDGE CASES

| Edge | Trigger | Expected behavior |
|------|---------|-------------------|
| Doc text moved | Cited line range no longer matches | Locate the new line by surrounding context, apply the fix, document drift in implementation-summary |
| Live CLI flag changed | copilot 1.0.36 changed `--effort` semantics | Document the version baseline explicitly so the prose stays grounded |
<!-- /ANCHOR:edges -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Finding | File | Effort (minutes) |
|---------|------|-----------------:|
| F-007-B2-01 | cli-opencode/SKILL.md | 10 |
| F-007-B2-02 | cli-opencode/references/agent_delegation.md | 10 |
| F-007-B2-03 | cli-copilot/SKILL.md | 10 |
| F-007-B2-04 | cli-codex/assets/prompt_templates.md | 10 |
| F-007-B2-05 | cli-claude-code/assets/prompt_templates.md | 5 |
| F-007-B2-06 | cli-gemini/assets/prompt_templates.md | 10 |
| **Total** | | **~55** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. Live CLI version verification is deferred (out of scope) — each fix references the SKILL.md's documented version baseline.
<!-- /ANCHOR:questions -->
