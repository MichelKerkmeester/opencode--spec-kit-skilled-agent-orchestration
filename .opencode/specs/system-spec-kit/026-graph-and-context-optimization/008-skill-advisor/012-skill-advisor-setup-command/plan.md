---
title: "Implementation Plan: Skill Advisor Setup Command [system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/plan]"
description: "Creates the /spec_kit:skill-advisor command with auto/confirm YAML workflows, updates README.txt, and delivers a user-facing setup guide. Follows existing spec_kit command conventions (resume.md, plan.md patterns)."
trigger_phrases:
  - "skill advisor setup command plan"
  - "012-skill-advisor-setup-command"
  - "/spec_kit:skill-advisor plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command"
    last_updated_at: "2026-04-25T14:30:00Z"
    last_updated_by: "deepseek-v4-pro"
    recent_action: "Created plan.md"
    next_safe_action: "Create command markdown, YAML workflows, README update, install guide"
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
template_source_hint: ""
---
# Implementation Plan: Skill Advisor Setup Command

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command files + YAML workflow definitions |
| **Framework** | OpenCode slash command system (`/spec_kit:*` command group) |
| **Storage** | Skill graph SQLite database (via `skill_graph_scan`) |
| **Testing** | Vitest — `skill_advisor/tests/` suite (220 tests) |

### Overview
Deliver a `/spec_kit:skill-advisor` slash command that follows the existing spec_kit command pattern: a markdown file with frontmatter + execution protocol header + consolidated prompt phase, backed by two YAML workflow assets (auto/confirm). The command analyzes all skills in `.opencode/skill/`, reads current scoring tables, detects gaps, proposes optimizations, applies them, re-indexes the skill graph, and validates with tests. A user-facing install guide wraps the command in a discoverable setup flow.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md done)
- [ ] Success criteria measurable
- [ ] Dependencies identified (skill_graph_scan, test suite)

### Definition of Done
- [ ] Command markdown file created with correct frontmatter
- [ ] Auto and confirm YAML workflows created
- [ ] README.txt updated
- [ ] Install guide created
- [ ] All 220+ advisor tests pass
- [ ] Parent context-index.md updated with new child phase
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
OpenCode Slash Command + YAML Workflow Orchestration (same pattern as `/spec_kit:resume`, `/spec_kit:plan`)

### Key Components
- **Command Markdown** (`skill-advisor.md`): Frontmatter with `allowed-tools`, execution protocol header, consolidated prompt phase, MCP tool usage reference
- **Auto YAML** (`spec_kit_skill-advisor_auto.yaml`): Autonomous workflow — reads skills, detects gaps, proposes optimizations, applies them, runs tests
- **Confirm YAML** (`spec_kit_skill-advisor_confirm.yaml`): Interactive workflow — same as auto but pauses at approval gates before each mutation
- **Install Guide** (`SET-UP - Skill Advisor.md`): AI-first prompt for users to invoke the command, with prerequisite checks and step-by-step flows

### Data Flow
```
User invokes /spec_kit:skill-advisor [:auto|:confirm]
    → Command markdown loads
    → YAML workflow selected by mode suffix
    → Phase 0: Discovery (list skills, check graph health, detect repo context)
    → Phase 1: Analysis (read SKILL.md files, graph-metadata.json, explicit.ts, lexical.ts)
    → Phase 2: Proposal (generate optimized triggers, tokens, phrases; show diffs)
    → Phase 3: Apply (write graph-metadata.json, edit explicit.ts/lexical.ts, rebuild dist)
    → Phase 4: Verify (skill_graph_scan, run tests)
    → Status report + summary
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Command Scaffolding
- [ ] Create `skill-advisor.md` with frontmatter, argument hint, allowed-tools
- [ ] Create `spec_kit_skill-advisor_auto.yaml` workflow definition
- [ ] Create `spec_kit_skill-advisor_confirm.yaml` workflow definition
- [ ] Follow existing command patterns (resume.md structure, YAML format)

### Phase 2: Core Workflow Logic
- [ ] Phase 0 — Skill discovery and repo context detection
- [ ] Phase 1 — Skill analysis (read SKILL.md, graph-metadata.json, scoring tables)
- [ ] Phase 2 — Optimization proposal (trigger phrases, token boosts, phrase boosts)
- [ ] Phase 3 — Apply changes (write graph-metadata.json, edit scoring files, rebuild dist)
- [ ] Phase 4 — Verify (skill_graph_scan, test suite)

### Phase 3: Documentation & Integration
- [ ] Update `README.txt` with new command entry
- [ ] Create `SET-UP - Skill Advisor.md` install guide
- [ ] Update parent `context-index.md` with new child phase
- [ ] Run strict validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | YAML workflow validation | Manual parse check |
| Integration | Command loads and triggers workflow | OpenCode `/spec_kit:skill-advisor` invocation |
| Regression | Advisor scoring after changes | `vitest run skill_advisor/tests/` (220 tests) |
| Manual | Install guide follow-through | Follow `SET-UP - Skill Advisor.md` from clean state |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `skill_graph_scan` MCP tool | Internal | Green | Can't re-index after changes |
| Advisor test suite | Internal | Green | Can't validate scoring correctness |
| TypeScript build (`tsc --build`) | Internal | Green | Dist won't reflect source changes |
| `.opencode/skill/*/SKILL.md` files | Internal | Green | Nothing to analyze |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Tests fail after scoring changes, or skill recommendations degrade
- **Procedure**: Git revert the scoring file changes (`explicit.ts`, `lexical.ts`, `weights-config.ts`) and `graph-metadata.json` files, rebuild dist, re-run tests
<!-- /ANCHOR:rollback -->
