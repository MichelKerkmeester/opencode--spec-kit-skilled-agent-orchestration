---
title: "Feature Specification: Skill Advisor Setup Command [system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/spec]"
description: "New spec_kit:skill-advisor slash command that interactively guides the AI to analyze all skills in a user's repo, optimize the skill advisor scoring tables (TOKEN_BOOSTS, PHRASE_BOOSTS, graph-metadata.json), and index the skill graph. Includes a user-facing setup guide."
trigger_phrases:
  - "skill advisor setup command"
  - "/spec_kit:skill-advisor"
  - "skill advisor set-up"
  - "skill advisor setup"
  - "012-skill-advisor-setup-command"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command"
    last_updated_at: "2026-04-25T14:30:00Z"
    last_updated_by: "deepseek-v4-pro"
    recent_action: "Created spec.md"
    next_safe_action: "Create command markdown, YAML workflows, and install guide"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0120000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-skill-advisor-setup"
      parent_session_id: "026-phase-root-flatten-2026-04-21"
    completion_pct: 0
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: Skill Advisor Setup Command

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-25 |
| **Parent** | `026-graph-and-context-optimization/008-skill-advisor/` |
| **Parent Spec** | `../spec.md` |
| **Related** | `../003-advisor-phrase-booster-tailoring/`, `../004-skill-advisor-docs-and-code-alignment/`, `../008-skill-graph-daemon-and-advisor-unification/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill advisor scoring system (explicit lane TOKEN_BOOSTS, PHRASE_BOOSTS, lexical CATEGORY_HINTS, graph-metadata.json derived triggers/keywords) is manually maintained with no guided setup workflow. Users have no command to analyze their repo's skills, detect coverage gaps, and apply optimized keywords, weights, and triggers. The existing plan for a "SET-UP - Skill Advisor.md" install guide exists only as a reference path but has no command backing it.

### Purpose
Deliver a `/spec_kit:skill-advisor` slash command that interactively walks the AI through analyzing all skills in the repo, proposing optimized trigger phrases, keywords, and token boosts, applying changes to the scoring system, and indexing the skill graph. Paired with a user-facing install guide.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New slash command `.opencode/command/spec_kit/skill-advisor.md` with `:auto` and `:confirm` modes
- Two YAML workflow assets: `spec_kit_skill-advisor_auto.yaml` and `spec_kit_skill-advisor_confirm.yaml`
- Update `.opencode/command/spec_kit/README.txt` to document the new command
- Install guide `.opencode/install_guides/SET-UP - Skill Advisor.md`
- Command reads all skills from `.opencode/skill/*/SKILL.md`
- Command reads current `graph-metadata.json` files and detects gaps
- Command reads current `explicit.ts` TOKEN_BOOSTS and PHRASE_BOOSTS
- Command reads current `lexical.ts` CATEGORY_HINTS
- Command reads current `weights-config.ts` lane weights
- Command scans repo context (languages, frameworks, project type)
- Command proposes optimized trigger phrases per skill
- Command proposes new explicit lane tokens and phrases
- Command runs `skill_graph_scan` to index changes
- Command runs advisor test suite to validate

### Out of Scope
- Modifying the fusion scorer confidence/inference logic — scoring changes only
- Modifying the daemon or freshness infrastructure
- Auto-approving changes without user review in interactive mode
- Rewriting skill SKILL.md content — only graph-metadata.json and scoring tables

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/spec_kit/skill-advisor.md` | Create | Command markdown definition |
| `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_auto.yaml` | Create | Autonomous execution workflow |
| `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_confirm.yaml` | Create | Interactive execution workflow |
| `.opencode/command/spec_kit/README.txt` | Modify | Add new command to index |
| `.opencode/install_guides/SET-UP - Skill Advisor.md` | Create | User-facing setup guide |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Command file exists and follows existing spec_kit command conventions | `skill-advisor.md` loads on `/spec_kit:skill-advisor` with same header/metadata pattern as `resume.md`, `plan.md` |
| REQ-002 | Auto and confirm YAML workflows exist in assets/ | Both YAML files follow existing workflow structure (operating_mode, workflow steps, error_recovery) |
| REQ-003 | Command reads all skill SKILL.md files and graph-metadata.json files | Parses skill name, description, domains, intent_signals, derived triggers/keywords |
| REQ-004 | Command reads current explicit.ts TOKEN_BOOSTS and PHRASE_BOOSTS | Parses the TSTypeScript object literals and detects which skills are already covered |
| REQ-005 | Command detects repo context (languages, frameworks, project type) | Scans workspace for package.json, tsconfig, requirements.txt, etc. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Command proposes optimized derived triggers/keywords per skill | Output shows before/after for each skill's graph-metadata.json |
| REQ-007 | Command proposes new explicit lane tokens and phrases | Output shows diff of TOKEN_BOOSTS and PHRASE_BOOSTS before/after |
| REQ-008 | Command runs skill graph scan after changes | `skill_graph_scan` succeeds with updated node/edge counts |
| REQ-009 | Command runs advisor test suite | All 220+ tests pass after changes |
| REQ-010 | README.txt updated with new command entry | Table follows existing format with invocation, steps, description |
| REQ-011 | Install guide exists at `.opencode/install_guides/SET-UP - Skill Advisor.md` | Guide includes AI-first prompt, prerequisite check, and step-by-step flow |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Typing `/spec_kit:skill-advisor` triggers the command workflow that analyzes all skills
- **SC-002**: In auto mode, the command produces a complete optimization proposal without interaction
- **SC-003**: In confirm mode, the user can approve/reject each proposed change
- **SC-004**: After running, `skill_graph_scan` shows updated trigger phrases for all skills
- **SC-005**: All advisor tests pass (220/220) after any scoring table changes
- **SC-006**: User-facing setup guide is clear enough for a new user to follow independently
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `skill_graph_scan` MCP tool must be operational | High — can't index changes | Verify tool availability in Phase 0 |
| Dependency | Advisor test suite at `.opencode/skill/system-spec-kit/mcp_server/` | High — can't validate scoring changes | Run tests before and after changes |
| Risk | Over-optimization of scoring tables breaks existing skill recommendations | Medium | Run full test suite, review changes in confirm mode |
| Risk | Command adds tokens that collide with other skills' scoring | Low | Cross-reference TOKEN_BOOSTS for existing entries before adding |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the command also update `derived_generated` lane weight (currently 0.15) based on skill count?
- Should the command auto-detect missing CATEGORY_HINTS entries (like sk-code-web was missing before)?
- Should the setup guide be a standalone AI prompt or embedded in the command workflow?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Command completes full analysis and proposal within 60 seconds (excluding test suite run)
- **NFR-P02**: Skill graph scan completes within 10 seconds for 20+ skills

### Security
- **NFR-S01**: No hardcoded credentials in command or workflow files
- **NFR-S02**: Command must not modify files without explicit approval in confirm mode

### Reliability
- **NFR-R01**: Command handles missing/corrupt skill folders gracefully with clear error messages
- **NFR-R02**: Rollback instructions exist for scoring table changes that break tests
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty `.opencode/skill/` directory: Command reports "no skills found" and exits
- Corrupt `graph-metadata.json`: Command skips skill with warning
- Missing `SKILL.md`: Command infers skill name from folder name

### Error Scenarios
- `skill_graph_scan` unavailable: Command warns but continues with remaining phases
- Test suite fails after changes: Command offers rollback option
- Token collision with existing entries: Command flags and asks for resolution

### State Transitions
- Partial change application (some skills updated, some not): Command offers retry or revert

### Acceptance Scenarios
- **Scenario 1 — New user discovers gap**: Given a repo with skills but no optimized scoring tables, when the user runs `/spec_kit:skill-advisor:auto`, then the command reads all skills, detects which lack explicit lane tokens and derived triggers, and proposes a complete set of optimized keywords.
- **Scenario 2 — Interactive approval**: Given the confirm workflow, when the command proposes a new token for explicit.ts, then the user sees the before/after diff and can approve or reject each change individually.
- **Scenario 3 — Skill graph re-indexed**: Given optimized graph-metadata.json files have been written, when the command runs `skill_graph_scan`, then the SQLite skill graph is refreshed with updated trigger phrases and the scan report shows updated node/edge counts.
- **Scenario 4 — Validation succeeds**: Given all scoring table changes have been applied, when the command runs `vitest run skill_advisor/tests/`, then all 220 tests pass without regression.
- **Scenario 5 — Setup guide works**: Given a new user follows `SET-UP - Skill Advisor.md` from scratch, when they paste the AI-first prompt, then the AI guides them through skill analysis and optimization without requiring knowledge of internal scoring architecture.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 5 files to create, 3 to modify. No new code, only markdown and YAML. |
| Risk | 8/25 | Mutates scoring tables and graph metadata — tests catch regressions. |
| Research | 5/20 | Follows existing command patterns (resume.md, plan.md). No novel architecture. |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
