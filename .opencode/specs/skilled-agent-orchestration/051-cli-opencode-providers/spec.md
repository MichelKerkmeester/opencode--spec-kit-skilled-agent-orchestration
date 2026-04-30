---
title: "Feature Specification: cli-opencode provider realignment"
description: "Remove github-copilot as a provider from cli-opencode skill, promote opencode-go to default, preserve direct DeepSeek API references."
trigger_phrases:
  - "cli-opencode providers"
  - "remove copilot provider"
  - "opencode-go default"
  - "deepseek direct api"
  - "provider realignment"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "051-cli-opencode-providers"
    last_updated_at: "2026-04-29T10:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author Level 1 spec for provider realignment"
    next_safe_action: "Begin file edits per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skill/cli-opencode/SKILL.md"
      - ".opencode/skill/cli-opencode/README.md"
      - ".opencode/skill/cli-opencode/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-051-init"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Default model after copilot removal? -> opencode-go/deepseek-v4-pro --variant high"
      - "Preserve cli-copilot sibling references? -> Yes, sibling skill is unrelated to provider"
---
# Feature Specification: cli-opencode provider realignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-29 |
| **Branch** | `051-cli-opencode-providers` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cli-opencode skill currently treats `github-copilot` as the default provider with `gpt-5.4` and `claude-sonnet-4.6` surfaced by name across SKILL.md, README.md, references, prompt templates, and the manual testing playbook. The skill's own README FAQ already recommends `opencode-go/deepseek-v4-pro` as the default, creating documentation drift. The user wants a clean removal of the github-copilot provider surface while keeping the direct DeepSeek API references intact.

### Purpose
Realign cli-opencode so `opencode-go/deepseek-v4-pro --variant high` is the documented default provider+model, the github-copilot provider is fully removed from invocation patterns and model tables, and the direct `deepseek/*` provider remains documented as today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove every reference to `github-copilot` as a model provider (model ids, provider tables, default-invocation flags, FAQ entries, examples)
- Set `opencode-go/deepseek-v4-pro --variant high` as the new default-invocation shape across the skill
- Preserve `deepseek/deepseek-v4-pro` and `deepseek/deepseek-v4-flash` direct-API documentation as currently presented
- Delete the two copilot-only manual_testing_playbook entries (`03--multi-provider/001-copilot-default-gpt-5-4.md`, `03--multi-provider/002-copilot-claude-sonnet-4-6.md`)
- Update remaining manual_testing_playbook entries that use `github-copilot/*` in example commands to use `opencode-go/deepseek-v4-pro`
- Refresh the skill keyword list (frontmatter HTML comment in SKILL.md) and `graph-metadata.json` causal_summary to drop the copilot-as-provider keywords
- Add a Provider Auth Pre-Flight (smart fallback) protocol: detect missing `opencode-go` login, ASK the user before substituting a fallback model, surface login commands when no provider is configured, and re-run the pre-flight on auth-error mid-dispatch

### Out of Scope
- Other skills under `.opencode/skill/` - scope is strictly cli-opencode/
- Re-running version baselines or installer instructions

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skill/cli-opencode/SKILL.md | Modify | Replace all `github-copilot/*` model references with `opencode-go/deepseek-v4-pro`; drop copilot rows from model tables; update default-invocation block; refresh keyword comment |
| .opencode/skill/cli-opencode/README.md | Modify | Update default invocation, key statistics, configuration, FAQ; drop copilot rows from model + provider tables |
| .opencode/skill/cli-opencode/references/cli_reference.md | Modify | Update default invocation table; drop copilot model rows; update variant ranges section |
| .opencode/skill/cli-opencode/references/integration_patterns.md | Modify | Update example commands to use opencode-go/deepseek-v4-pro |
| .opencode/skill/cli-opencode/references/opencode_tools.md | Modify | Update example commands to use opencode-go/deepseek-v4-pro |
| .opencode/skill/cli-opencode/references/agent_delegation.md | Modify | Update example commands to use opencode-go/deepseek-v4-pro |
| .opencode/skill/cli-opencode/assets/prompt_templates.md | Modify | Update template default-invocation shape |
| .opencode/skill/cli-opencode/manual_testing_playbook/manual_testing_playbook.md | Modify | Drop copilot rows from index, retitle multi-provider section |
| .opencode/skill/cli-opencode/manual_testing_playbook/03--multi-provider/001-copilot-default-gpt-5-4.md | Delete | Provider-specific test no longer applicable |
| .opencode/skill/cli-opencode/manual_testing_playbook/03--multi-provider/002-copilot-claude-sonnet-4-6.md | Delete | Provider-specific test no longer applicable |
| .opencode/skill/cli-opencode/manual_testing_playbook/03--multi-provider/004-variant-levels-comparison.md | Modify | Reframe variant comparison around opencode-go/deepseek-v4-pro |
| .opencode/skill/cli-opencode/manual_testing_playbook/* (other entries) | Modify | Replace `github-copilot/gpt-5.4` and `github-copilot/claude-sonnet-4.6` example invocations with `opencode-go/deepseek-v4-pro` |
| .opencode/skill/cli-opencode/graph-metadata.json | Modify | Drop `github-copilot` from causal_summary; drop copilot keywords from intent_signals/derived.trigger_phrases if present |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero `github-copilot/` model references in skill files | `grep -ri "github-copilot" .opencode/skill/cli-opencode/` returns no matches |
| REQ-002 | New default invocation everywhere uses `opencode-go/deepseek-v4-pro --variant high` | SKILL.md §3 default block, README.md §1 key statistics, cli_reference.md default table all show opencode-go default |
| REQ-003 | DeepSeek direct API still documented | `deepseek/deepseek-v4-pro` and `deepseek/deepseek-v4-flash` remain in provider tables and example commands |
| REQ-004 | The two copilot-only multi-provider test entries are removed | `001-copilot-default-gpt-5-4.md` and `002-copilot-claude-sonnet-4-6.md` no longer exist; playbook index reflects removal |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `graph-metadata.json` causal_summary updated to drop github-copilot from provider list | causal_summary mentions only opencode-go and deepseek as providers |
| REQ-006 | SKILL.md frontmatter Keywords HTML comment updated | The keyword list no longer contains github-copilot as a provider keyword |
| REQ-007 | Provider Auth Pre-Flight protocol documented in SKILL.md, cli_reference.md, and README.md FAQ | SKILL.md §3 has a "Provider Auth Pre-Flight (Smart Fallback)" subsection with a `opencode providers list` pre-flight script, a 3-state decision table, and user-prompt templates; ALWAYS rule 11 mandates the pre-flight; cli_reference.md §4 mirrors the decision tree; README.md §8 FAQ has a "What if the default provider isn't logged in?" Q/A |
| REQ-008 | Error handling table covers auth failures | SKILL.md §3 Error Handling has rows for `provider/model not found` (→ run pre-flight) and `401 Unauthorized` mid-dispatch (→ invalidate cache, rerun pre-flight, ASK before fallback) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -ri "github-copilot" .opencode/skill/cli-opencode/` returns zero hits
- **SC-002**: SKILL.md §3 Default Invocation block shows `opencode-go/deepseek-v4-pro --variant high` as the pinned default
- **SC-003**: README.md §3.2 Models table lists only opencode-go and deepseek rows
- **SC-004**: Manual testing playbook index lists only `003-deepseek-direct-api.md` and `004-variant-levels-comparison.md` under `03--multi-provider/`
- **SC-005**: SKILL.md and cli_reference.md both contain the exact phrase "Provider Auth Pre-Flight" and document the 3-state decision tree (default-available, default-missing-fallback-ready, both-missing) with user-prompt templates
- **SC-006**: SKILL.md ALWAYS rule list contains rule 11 mandating the pre-flight before first dispatch and cache invalidation on auth-error
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Inconsistent default values across files (some show opencode-go, some leave stale github-copilot) | High | Run final grep verification after all edits; fix any remaining `github-copilot` hits |
| Risk | Manual testing playbook orphaned cross-references after deleting the two github-copilot test files | Low | Update playbook root index and any cross-link in 003/004 of the same section |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None - user request is unambiguous on default (opencode-go) and preserved providers (deepseek direct API)
<!-- /ANCHOR:questions -->

---
