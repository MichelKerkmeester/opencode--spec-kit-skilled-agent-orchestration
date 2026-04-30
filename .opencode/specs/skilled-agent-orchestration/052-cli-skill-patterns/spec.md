---
title: "Feature Specification: cli-* skill consistency patterns"
description: "Harmonize the 5 cli-* skills (cli-claude-code, cli-codex, cli-copilot, cli-gemini, cli-opencode) on the structural surface they already share, without flattening each provider's unique value props."
trigger_phrases:
  - "cli skill patterns"
  - "cli skill consistency"
  - "cli sibling harmonization"
  - "do-not-collapse cli skills"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "052-cli-skill-patterns"
    last_updated_at: "2026-04-29T12:05:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 spec scope, REQs, do-not-collapse list, harmonization rules"
    next_safe_action: "Author plan.md per-skill diff plan, then tasks.md"
    blockers: []
    key_files:
      - ".opencode/skill/cli-claude-code/SKILL.md"
      - ".opencode/skill/cli-codex/SKILL.md"
      - ".opencode/skill/cli-copilot/SKILL.md"
      - ".opencode/skill/cli-gemini/SKILL.md"
      - ".opencode/skill/cli-opencode/SKILL.md"
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Should we collapse divergent flag names? -> No, native flag names are intentional"
      - "Should we collapse agent-routing syntax? -> No, --agent / -p / @prefix all stay"
---
# Feature Specification: cli-* skill consistency patterns

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-29 |
| **Branch** | `main` (no feature branch — operating directly on main) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 5 cli-* skills under `.opencode/skill/` (`cli-claude-code`, `cli-codex`, `cli-copilot`, `cli-gemini`, `cli-opencode`) all expose the same intent — orchestrate an external CLI from another AI runtime — and were authored from the same 8-section template. Audit during packet 051 surfaced concrete drift: cli-copilot is missing the Error Handling table, cli-opencode duplicates UNKNOWN_FALLBACK_CHECKLIST 3×, cli-claude-code is missing the Default Invocation block, INTENT_SIGNALS counts differ (codex=8, others=7), and the new Provider Auth Pre-Flight pattern added to cli-opencode in 051 has no equivalent in the other 4 even though several of them have provider-auth failure modes.

### Purpose
Harmonize the structural surface that's already shared across all 5 skills (section ordering, frontmatter contract, INTENT_SIGNALS keys, ALWAYS/NEVER/ESCALATE triple, Memory Handback, Error Handling table presence, single-occurrence UNKNOWN_FALLBACK_CHECKLIST, Provider Auth Pre-Flight pattern) while explicitly preserving each skill's unique value props (per-CLI flag names, agent-routing syntax, model rosters, auth flows, manual-testing-playbook scenarios).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (harmonize)
- 8-section header order + titles identical across all 5 SKILL.md files
- `§3 HOW IT WORKS` common subsections: Default Invocation, Reasoning-Effort Knob, Error Handling table, Provider Auth Pre-Flight (port the 051 cli-opencode pattern, adapted per CLI)
- `§4 RULES` ALWAYS / NEVER / ESCALATE triple parity
- Frontmatter key set parity (`name`, `description`, `allowed-tools`, `version`)
- `INTENT_SIGNALS` count alignment (target: 7 intents); identical `RESOURCE_MAP` / `LOADING_LEVELS` / `UNKNOWN_FALLBACK_CHECKLIST` keys
- `UNKNOWN_FALLBACK_CHECKLIST` single occurrence per skill (cli-opencode currently has 3, dedupe to 1)
- `§7 INTEGRATION POINTS / RELATED SKILLS` table column order parity (`Skill | Integration`)
- Memory Handback identical 7-step pointer to `system-spec-kit/references/cli/memory_handback.md`

### Out of Scope (do-NOT-collapse — provider-native, intentional divergence)
- Reasoning-effort flag names: `--effort` (claude-code, copilot) / `-c model_reasoning_effort=` (codex) / `--variant` (opencode) / N/A (gemini)
- Agent-routing syntax: `--agent <slug>` (claude-code, copilot, opencode) / `-p <profile>` (codex) / `@prefix` (gemini)
- Provider rosters, model lists, authentication flows, free-tier vs paid-tier notes
- Manual-testing-playbook entry counts (7-10 is intentional per-skill; provider-specific scenarios)
- Reference/asset folder counts where the extra file is load-bearing: `cli-codex/references/hook_contract.md` (hooks support unique to codex); `cli-copilot/assets/shell_wrapper.md` (wrapper unique to copilot)

### Do-NOT-Collapse Inventory (per-skill unique value props that MUST survive)
- **cli-claude-code**: `--effort high` Opus extended thinking, `--json-schema` validated output, `--max-budget-usd` cost cap, `--permission-mode plan|default|bypassPermissions`, surgical Edit tool
- **cli-codex**: `--search` web browsing, sandbox modes (`read-only` / `workspace-write` / `danger-full-access`), `--ask-for-approval`, `--full-auto`, `--image` / `-i` visual input, session fork, `/review` subcommand, native hooks support
- **cli-copilot**: `--allow-all-tools` Autopilot, `/delegate` cloud agents, `&prompt` cloud prefix, `/model` runtime switch (5 models / 3 providers), repo memory, `--agent explore|task` two-built-in agents, max-3-concurrent constraint, `SPEC-KIT-COPILOT-CONTEXT` markers in `~/.copilot/copilot-instructions.md`
- **cli-gemini**: `google_web_search` grounding, `codebase_investigator` tool, `save_memory` tool, 1M+ context window, free tier (60/min, 1000/day), `.geminiignore`, `--yolo` / `-y` auto-approve, `@prefix` agent invocation, single-model `gemini-3.1-pro-preview`
- **cli-opencode**: full plugin/skill/MCP runtime + Spec Kit Memory database, parallel detached sessions (`--share --port`), cross-repo `--dir`, cross-server `--attach`, ADR-001 self-invocation guard *with* parallel-session exception, `--variant` provider-scoped reasoning effort, `--pure` plugin-disable, `--thinking` block display, Provider Auth Pre-Flight (3-state decision tree, ASK-not-substitute, cache invalidation)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skill/cli-claude-code/SKILL.md | Modify | Add Default Invocation block to §3; align INTENT_SIGNALS keys; verify section order |
| .opencode/skill/cli-codex/SKILL.md | Modify | Align INTENT_SIGNALS to 7-intent target (currently 8); verify section order |
| .opencode/skill/cli-copilot/SKILL.md | Modify | Add Error Handling table to §3; align ALWAYS/NEVER/ESCALATE if drifted; verify section order |
| .opencode/skill/cli-gemini/SKILL.md | Modify | Section-order audit only; verify INTENT_SIGNALS keys |
| .opencode/skill/cli-opencode/SKILL.md | Modify | Dedupe UNKNOWN_FALLBACK_CHECKLIST 3→1; serves as the canonical Provider Auth Pre-Flight template the others adapt |
| .opencode/skill/cli-claude-code/SKILL.md + cli-codex + cli-copilot + cli-gemini | Modify | Port Provider Auth Pre-Flight subsection from cli-opencode §3 (adapt detection commands per CLI: `claude auth list` / `codex auth status` / `gh auth status copilot` / `gemini auth status`) |
| Each skill's `graph-metadata.json` | Modify | Refresh `causal_summary` / `key_topics` to surface harmonized vocabulary |
| Each skill's `manual_testing_playbook/manual_testing_playbook.md` | Modify (only if section-name references rotted) | Rename audit; update header references if any |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 SKILL.md files have identical 8-section header order + titles | `grep -E '^## [0-9]+\.' <skill>/SKILL.md` returns the same titles in the same order across all 5 |
| REQ-002 | All 5 skills have an Error Handling table in §3 | `grep -E '^### Error Handling' <skill>/SKILL.md` returns 1 hit per skill (cli-copilot currently 0) |
| REQ-003 | All 5 skills have a Provider Auth Pre-Flight subsection in §3 | `grep -E 'Provider Auth Pre-Flight' <skill>/SKILL.md` returns ≥1 hit per skill (currently only cli-opencode) |
| REQ-004 | All 5 skills have a Default Invocation block in §3 | `grep -E 'Default Invocation' <skill>/SKILL.md` returns ≥1 hit per skill (cli-claude-code currently 0) |
| REQ-005 | UNKNOWN_FALLBACK_CHECKLIST appears exactly once per skill | `grep -c UNKNOWN_FALLBACK_CHECKLIST <skill>/SKILL.md` returns `1` for all 5 (cli-opencode currently 3) |
| REQ-006 | Every do-not-collapse term still grep-matches in its skill's SKILL.md after harmonization | The checklist.md per-skill grep gate exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Frontmatter key set is identical across all 5 SKILL.md files | Same keys (`name`, `description`, `allowed-tools`, `version`) appear in same order |
| REQ-008 | INTENT_SIGNALS count is 7 across all 5 skills (codex drops 1 to align) | Per-skill grep counts equal |
| REQ-009 | ALWAYS / NEVER / ESCALATE triple present in §4 of all 5 skills | `grep -cE '^### (ALWAYS\|NEVER\|ESCALATE)' <skill>/SKILL.md` returns `3` per skill |
| REQ-010 | `decision-record.md` enumerates the intentional divergences kept per Step 5 of the plan | ADR-001 (provider-native flag names), ADR-002 (agent-routing syntax), ADR-003 (load-bearing extra reference/asset files) authored |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/052-cli-skill-patterns --strict` exits 0
- **SC-002**: All P0 checklist items marked `[x]` with grep-evidence
- **SC-003**: Per-skill do-not-collapse grep gate passes (every unique term still ≥1 hit in its SKILL.md)
- **SC-004**: 8-section header order/titles identical across all 5 SKILL.md files
- **SC-005**: `Provider Auth Pre-Flight` subsection present in all 5 skills (1 canonical opencode + 4 adapted siblings)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-collapsing native flag semantics during harmonization | High | Per-skill grep gate in checklist.md; do-not-collapse list in spec.md §3 |
| Risk | Advisor scoring regression after SKILL.md churn | Med | Run `doctor:skill-advisor` post-edit; diff `graph-metadata.json` per skill |
| Risk | Sibling cross-reference rot when renumbering sections | Med | `<!-- ANCHOR: -->` audit across all 5 SKILL.md and per-skill `manual_testing_playbook/manual_testing_playbook.md` |
| Risk | Manual-testing-playbook header references silently rot if section titles change | Low | Playbook root-index grep audit |
| Dependency | Packet 051 (cli-opencode provider realignment + auth pre-flight) | Required | Already complete; cli-opencode SKILL.md serves as canonical template for harmonized §3 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None - the do-not-collapse list is exhaustive based on the 051 audit and the user's "without removing unique context" constraint.
<!-- /ANCHOR:questions -->

---
