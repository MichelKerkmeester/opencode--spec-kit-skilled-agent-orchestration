---
title: "Verification Checklist: Gemini CLI Compatibility [023-gemini-cli-compatibility/checklist]"
description: "Verification Date: —"
trigger_phrases:
  - "verification"
  - "checklist"
  - "gemini"
  - "cli"
  - "compatibility"
  - "023"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Gemini CLI Compatibility

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available (`.opencode/skill/`, `.opencode/command/`, `.opencode/agent/`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:foundation -->
## Foundation (Phase 1)

- [ ] CHK-010 [P0] `.gemini/` directory created with correct subdirectories (`agents/`, `commands/`, `skills/`)
- [ ] CHK-011 [P0] `GEMINI.md` symlink exists and resolves to `AGENTS.md` (`readlink GEMINI.md` = `AGENTS.md`)
- [ ] CHK-012 [P0] `.gemini/settings.json` is valid JSON with `enableAgents: true`, `mcpServers` block, and `skills` config
- [ ] CHK-013 [P1] `.gemini/specs` symlink exists and resolves to `../.opencode/specs`
<!-- /ANCHOR:foundation -->

---

<!-- ANCHOR:agent-adaptation -->
## Agent Adaptation (Phase 2)

- [ ] CHK-020 [P0] 8 agent `.md` files exist in `.gemini/agents/` (orchestrate, context, debug, research, review, speckit, write, handover)
- [ ] CHK-021 [P0] All agent files use Gemini frontmatter schema (`name`, `description`, `kind`, `tools` array, `model`)
- [ ] CHK-022 [P0] No OpenCode-style permission maps in any `.gemini/agents/` files
- [ ] CHK-023 [P1] Orchestrate agent has Gemini Optimization Profile section and `max_turns: 25`
- [ ] CHK-024 [P1] Path convention lines in all agent files updated to `.gemini/agents/*.md`
<!-- /ANCHOR:agent-adaptation -->

---

<!-- ANCHOR:skill-symlinks -->
## Skill Symlinks (Phase 3)

- [ ] CHK-030 [P0] 9 skill symlinks created in `.gemini/skills/` (mcp-code-mode, mcp-figma, system-spec-kit, mcp-chrome-devtools, sk-code--full-stack, sk-code--opencode, workflows-code--web-dev, sk-doc, sk-git)
- [ ] CHK-031 [P0] All skill symlinks resolve correctly — no broken links (`find .gemini/skills -type l -exec test -e {} \;`)
- [ ] CHK-032 [P1] `scripts/` directory symlinked at `.gemini/skills/scripts`
<!-- /ANCHOR:skill-symlinks -->

---

<!-- ANCHOR:command-tomls -->
## Command TOMLs (Phase 4)

- [ ] CHK-040 [P0] 19 TOML files created across 4 namespaces (`spec_kit/` ×7, `memory/` ×5, `create/` ×6, root `agent_router.toml` ×1)
- [ ] CHK-041 [P0] All TOML files parse correctly (`python3 -c "import tomllib; tomllib.load(open(f, 'rb'))"` passes for each)
- [ ] CHK-042 [P0] All `@{path}` file references in TOML `prompt` fields resolve to existing OpenCode command `.md` files
- [ ] CHK-043 [P1] All TOML files have `description` field populated (not empty or placeholder)
<!-- /ANCHOR:command-tomls -->

---

<!-- ANCHOR:reference-updates -->
## Reference Updates (Phase 5)

- [ ] CHK-050 [P1] `AGENTS.md` §7 runtime table contains Gemini row: `Gemini CLI | .gemini/agents/ | Load Gemini-specific agent definitions from this directory`
- [ ] CHK-051 [P1] `.opencode/command/create/agent.md` references `.opencode/agent/gemini/` as a target path for new agent creation
<!-- /ANCHOR:reference-updates -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-060 [P0] No hardcoded secrets in `.gemini/settings.json`
- [ ] CHK-061 [P0] MCP server credentials in `.gemini/settings.json` use environment variable references (`"env": {"KEY": "$ENV_VAR"}` pattern)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-070 [P1] Spec, plan, and checklist are synchronized (no conflicting counts or file paths)
- [ ] CHK-071 [P2] Findings saved to `memory/` via `generate-context.js`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 9 | 0/9 |
| P2 Items | 1 | 0/1 |

**Verification Date**: —
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
