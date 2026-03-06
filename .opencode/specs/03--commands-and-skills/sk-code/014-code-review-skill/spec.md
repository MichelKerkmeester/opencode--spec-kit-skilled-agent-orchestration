---
title: "Feature Specification: sk-code--review Promotion [014-code-review-skill/spec]"
description: "Level 2 specification for promoting sk-code--review to a first-class stack-agnostic review skill with baseline+overlay routing across agents, commands, and advisor logic."
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
trigger_phrases:
  - "sk-code--review"
  - "code review skill"
  - "baseline overlay"
  - "review agent"
  - "041"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 2 -->
# Feature Specification: sk-code--review Promotion

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

## 1. OVERVIEW

Level 2 specification for converting the draft `legacy-single-hyphen-review` package into `sk-code--review`, aligning router behavior to `sk-doc` standards, and wiring `@review` workflows to a baseline+overlay model.
---

<!-- ANCHOR:metadata -->
## 2. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Implemented (validation caveat documented) |
| **Created** | 2026-02-22 |
| **Updated** | 2026-02-22 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 3. PROBLEM & PURPOSE

### Problem Statement
The draft review skill existed as `legacy-single-hyphen-review` and was not aligned with project naming patterns (`sk-code--*`) or the current `sk-doc` routing structure. Review agents and review-dispatch command workflows also lacked a unified baseline+overlay standards contract.

### Purpose
Promote `sk-code--review` as a first-class, stack-agnostic review baseline that:
- never overrides stack-specific standards,
- always enforces security/correctness minimums,
- and is consistently used by review agents, orchestrators, and review-dispatch command YAMLs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 4. SCOPE

### In Scope

- Hard rename skill package: `legacy-single-hyphen-review` -> `sk-code--review`.
- Rebuild `SKILL.md` router to `sk-doc` parity (resource domains, loading levels, weighted scoring, ambiguity handling, unknown fallback, guarded recursive discovery).
- Add baseline+overlay contract and precedence matrix:
  - baseline: `sk-code--review`
  - overlay: one of `sk-code--opencode`, `sk-code--web`, `sk-code--full-stack`
  - precedence: overlay style/process/build/test overrides generic guidance; baseline security/correctness minimums are always enforced.
- Update review agents and orchestrators across runtime profiles (`.opencode`, `.opencode/chatgpt`, `.gemini`, `.claude`) to document and follow baseline+overlay contract.
- Update `.codex/agents/review.toml` and `.codex/agents/orchestrate.toml` wrappers to require the same baseline+overlay contract when delegating to canonical chatgpt playbooks.
- Update all listed review-dispatch command YAML assets (18 files) to include the same contract.
- Update skill routing (`skill_advisor.py`) so generic review intents route to `sk-code--review` while preserving git behavior and removing stale visual-skill claims from live docs.
- Update skill indexes (`.opencode/skill/README.md`, `.opencode/README.md`).
- Finalize Level 2 spec docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`).

### Out of Scope

- Editing preserved context source under `014-code-review-skill/context/`.
- Refactoring unrelated commands, agents, or skills outside listed scope.
- Modifying memory files for this run.

### Files to Change (Grouped)

| Group | Paths |
|------|-------|
| Skill package | `.opencode/skill/sk-code--review/SKILL.md`, `.opencode/skill/sk-code--review/README.md`, `.opencode/skill/sk-code--review/references/*.md` |
| Review agents/orchestrators | `.opencode/agent/review.md`, `.opencode/agent/chatgpt/review.md`, `.opencode/agent/orchestrate.md`, `.opencode/agent/chatgpt/orchestrate.md`, `.gemini/agents/review.md`, `.gemini/agents/orchestrate.md`, `.claude/agents/review.md`, `.claude/agents/orchestrate.md`, `.codex/agents/review.toml`, `.codex/agents/orchestrate.toml` |
| Review dispatch commands | 18 YAMLs under `.opencode/command/spec_kit/assets/` and `.opencode/command/create/assets/` (full list in `tasks.md`) |
| Routing + catalogs | `.opencode/skill/scripts/skill_advisor.py`, `.opencode/skill/README.md`, `.opencode/README.md` |
| Spec docs | `.opencode/specs/03--commands-and-skills/sk-code/014-code-review-skill/spec.md`, `.opencode/specs/03--commands-and-skills/sk-code/014-code-review-skill/plan.md`, `.opencode/specs/03--commands-and-skills/sk-code/014-code-review-skill/tasks.md`, `.opencode/specs/03--commands-and-skills/sk-code/014-code-review-skill/checklist.md`, `.opencode/specs/03--commands-and-skills/sk-code/014-code-review-skill/implementation-summary.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Hard rename completed | Skill folder exists only as `.opencode/skill/sk-code--review/`; `legacy-single-hyphen-review.zip` removed |
| REQ-002 | Router rebuilt to standards parity | `SKILL.md` includes required section order + smart routing model + baseline+overlay logic + precedence matrix + related resources |
| REQ-003 | Review runtime contract updated | Review agents/orchestrators in `.opencode`, `.opencode/chatgpt`, `.gemini`, `.claude`, plus `.codex` wrapper configs, explicitly document/enforce baseline `sk-code--review` + one overlay model |
| REQ-004 | Command review dispatch updated | All 18 listed command YAMLs include baseline+overlay review contract wording/config |
| REQ-005 | Review routing updated | `skill_advisor.py` routes generic code-review intents to `sk-code--review`, preserves `sk-git` behavior, and live docs do not assert a removed visual target |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Skill indexes updated | `.opencode/skill/README.md` and `.opencode/README.md` include `sk-code--review` and updated counts |
| REQ-007 | Spec docs synchronized | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` match actual implementation state and evidence |
| REQ-008 | Validation evidence captured | Planned commands executed and outcomes recorded, including known validator constraints |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: `sk-code--review` is the only active review skill package name in scope.
- **SC-002**: Review standards contract is consistent across skill, agents, orchestrators, and command dispatch docs.
- **SC-003**: `skill_advisor.py` returns expected top matches for review/git/visual-review test prompts.
- **SC-004**: Spec folder documentation is complete and evidence-backed.
- **SC-005**: Validation commands are run and outcomes are documented transparently.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `sk-doc` validators | `quick_validate.py` and `package_skill.py` currently reject consecutive hyphens in `name` | Record command evidence and note existing validator/name mismatch with current `sk-code--*` naming convention |
| Dependency | YAML structure consistency | Broken indentation could invalidate command assets | Applied standardized `standards_contract` insertions and re-checked blocks |
| Risk | Scope drift | Large file list across agents/commands/docs | Limited edits to explicit scope list |
| Risk | Routing regression | Review intent could still route to unrelated targets unexpectedly | Added dedicated review boosts and test prompts in evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Router logic remains lightweight and resource-loading uses progressive disclosure.
- **NFR-P02**: Review dispatch contract additions remain schema-safe and localized.

### Security
- **NFR-S01**: Baseline security/correctness checks remain mandatory even when overlay exists.
- **NFR-S02**: Review outputs remain findings-first with clear severity evidence.

### Reliability
- **NFR-R01**: Advisor routing behavior validated with representative prompts.
- **NFR-R02**: Command and agent contract wording is consistent across copilot/chatgpt/gemini/claude runtime docs and codex wrapper configs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Ambiguous stack signals -> default overlay `sk-code--full-stack` with explicit uncertainty.
- Mixed-intent prompts (visual + review + diff) -> allow visual skill to remain contender while preserving review route viability.

### Error Scenarios
- Validator rejects `sk-code--*` names due consecutive-hyphen rule.
- Multi-file YAML bulk edits can create indentation drift.

### State Transitions
- Plan stage -> implementation stage completed in this spec folder.
- Completion remains evidence-driven; unresolved validator mismatch is documented as a known limitation.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:acceptance-scenarios -->
## L2: ACCEPTANCE SCENARIOS

1. **Given** a review request with security language, **When** advisor routing runs, **Then** `sk-code--review` is top skill.
2. **Given** git workflow phrasing, **When** advisor routing runs, **Then** `sk-git` remains top skill.
3. **Given** visual review phrasing, **When** advisor routing runs, **Then** this spec set does not rely on any removed visual skill target claim to prove success.
4. **Given** review dispatch steps in all listed YAMLs, **When** inspected, **Then** each contains baseline+overlay standards contract.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Skill + agents + orchestrators + 18 command assets + advisor + catalogs + spec docs |
| Risk | 17/25 | Routing regressions and YAML contract consistency across many files |
| Research | 11/20 | Required parity with existing `sk-doc` and `sk-code--*` patterns |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- None. Implementation proceeded autonomously per user direction; known validator mismatch is documented as evidence rather than blocked by additional clarification.
<!-- /ANCHOR:questions -->
