---
title: "Feature Specification: cli-copilot Skill"
description: "No skill exists for AI assistants to delegate tasks to GitHub Copilot CLI, leaving multi-model selection, cloud delegation, plan mode, and autopilot capabilities inaccessible."
trigger_phrases:
  - "cli-copilot spec"
  - "copilot skill spec"
importance_tier: "normal"
contextType: "implementation"
---
# Feature Specification: cli-copilot Skill

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
| **Created** | 2026-03-02 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No skill exists for AI assistants to delegate tasks to GitHub's Copilot CLI (`copilot`). The project has 3 CLI orchestration skills (cli-gemini, cli-codex, cli-claude-code) but no equivalent for Copilot CLI. This leaves Copilot's unique capabilities — multi-provider model selection (7+ models from Anthropic, OpenAI, Google), cloud delegation (`/delegate`), collaborative plan mode, autopilot execution, and repository memory — inaccessible to external orchestrators.

### Purpose
Any AI assistant can invoke Copilot CLI for multi-model task execution, cloud-delegated background work, collaborative planning, and autonomous code generation through a documented skill with smart routing, reference materials, and prompt templates. This completes the 4-CLI cross-AI ecosystem.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New cli-copilot skill with full file structure (SKILL.md, README.md, 4 references, 1 asset)
- Standard orchestration model: calling AI = conductor, Copilot CLI = executor
- Ecosystem registration: skill_advisor.py entries, `.claude/skills` symlink, README updates (3 files)
- Changelog entry in `.opencode/changelog/20--cli-copilot/`

### Out of Scope
- Changes to Copilot CLI itself — documenting only
- Copilot subscription management or billing
- Custom agent definitions for Copilot — documenting the feature, not creating agents
- Changes to existing cli-gemini, cli-codex, or cli-claude-code skills
- Install guides for Copilot CLI

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/cli-copilot/SKILL.md` | Create | Main orchestrator (8 sections) |
| `.opencode/skill/cli-copilot/README.md` | Create | Companion guide |
| `.opencode/skill/cli-copilot/references/cli_reference.md` | Create | CLI flags, 7+ models, auth, config |
| `.opencode/skill/cli-copilot/references/agent_delegation.md` | Create | Built-in + custom agents |
| `.opencode/skill/cli-copilot/references/copilot_tools.md` | Create | Unique capabilities, 4-way comparison |
| `.opencode/skill/cli-copilot/references/integration_patterns.md` | Create | Cross-AI orchestration patterns |
| `.opencode/skill/cli-copilot/assets/prompt_templates.md` | Create | Copy-paste templates |
| `.opencode/skill/scripts/skill_advisor.py` | Modify | Add 3 booster sections |
| `.claude/skills/cli-copilot` | Create | Symlink to skill |
| `.opencode/skill/README.md` | Modify | Add skill entry |
| `.opencode/README.md` | Modify | Add skill entry |
| `README.md` | Modify | Add skill entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | SKILL.md with 8 standard sections | All 8 anchored sections present, smart routing pseudocode functional |
| REQ-002 | All 4 reference files exist | cli_reference.md, agent_delegation.md, copilot_tools.md, integration_patterns.md |
| REQ-003 | prompt_templates.md exists | 10 template categories with copy-paste commands using `copilot -p` |
| REQ-004 | README.md companion guide | 8-section README with quick start and examples |
| REQ-005 | Symlink resolves | `.claude/skills/cli-copilot` points to skill directory |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | skill_advisor.py registration | Entries in INTENT_BOOSTERS, MULTI_SKILL_BOOSTERS, PHRASE_INTENT_BOOSTERS |
| REQ-007 | README updates | cli-copilot listed in 3 READMEs |
| REQ-008 | Multi-model documentation | All 7+ models from 3 providers documented with selection guidance |
| REQ-009 | Core invocation pattern | `copilot -p "prompt" --allow-all-tools 2>&1` used consistently |
| REQ-010 | AI-agnostic language | No specific AI hardcoded as conductor — uses "the calling AI" |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `python3 skill_advisor.py "use copilot cli"` returns cli-copilot with confidence >= 0.8
- **SC-002**: `readlink .claude/skills/cli-copilot` resolves to `../../.opencode/skill/cli-copilot`
- **SC-003**: 4-way comparison table (Copilot vs Claude Code vs Gemini CLI vs Codex CLI) in copilot_tools.md
- **SC-004**: Cloud delegation (`/delegate`) documented as unique capability
- **SC-005**: All 7+ model IDs with provider attribution in cli_reference.md
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Copilot CLI installed | Skill is documentation-only; no runtime dependency | Installation instructions included |
| Dependency | GitHub Copilot subscription | Required for Copilot CLI auth | Document subscription tiers |
| Risk | Copilot CLI flags/models change | Medium — multi-model landscape evolves fast | Version-pin references, centralize model list |
| Risk | Cloud delegation availability | Low — GA feature | Document fallback to local execution |
| Risk | Gemini CLI generates inaccurate content | Medium — delegated implementation | Claude reviews all output against research |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Skill routing via skill_advisor.py returns in < 1 second
- **NFR-P02**: Smart router pseudocode handles all 7 intent signals

### Security
- **NFR-S01**: No API keys, tokens, or credentials in any skill files
- **NFR-S02**: `--allow-all-tools` always flagged as requiring explicit user approval
- **NFR-S03**: GH_TOKEN/GITHUB_TOKEN never hardcoded

### Reliability
- **NFR-R01**: Error handling table covers all common failure modes (auth, rate limits, model unavailable)
- **NFR-R02**: Subscription requirement documented in prerequisites
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty prompt: CLI returns usage help; skill documents this
- Very long prompts: File references recommended over inline content
- Invalid model ID: Error message documented in troubleshooting

### Error Scenarios
- No Copilot subscription: Auth fails; document subscription requirement
- Rate limiting: Documented with wait/retry guidance
- Cloud delegation fails: Fallback to local execution documented
- Model unavailable: Document model switching via `/model`

### State Transitions
- Session continuity: Conversation context maintained within sessions
- Plan mode toggle: Shift+Tab behavior documented
- Cloud delegation: Task handoff behavior documented
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 11 new files, 4 modified, documentation-only |
| Risk | 8/25 | Multi-model complexity, delegated to Gemini CLI for implementation |
| Research | 12/20 | New CLI with evolving features, web research required |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None — research completed via web search and official documentation.
<!-- /ANCHOR:questions -->
