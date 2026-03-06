---
title: "Implementation Plan: GPT-5.4 Agent Model Upgrade"
description: "Apply runtime-specific GPT-5.4 model pins across Copilot, ChatGPT, and Codex agent definitions with minimal metadata-only edits and verification." 
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: GPT-5.4 Agent Model Upgrade

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown frontmatter + TOML config |
| **Framework** | OpenCode agent registry + Codex multi-agent config |
| **Storage** | Filesystem-based agent definitions |
| **Testing** | Grep checks + YAML/TOML parse verification + spec validation |

### Overview
This change is metadata-focused. OpenCode Copilot agents use YAML frontmatter keys such as `model:` and `reasoningEffort:`. ChatGPT OpenCode agents use the same frontmatter format but different provider-prefixed model ids. Codex multi-agent TOML layers are config overlays where `model` and `model_reasoning_effort` are top-level config keys. The implementation should only touch model pins, Copilot reasoning metadata, and stale review-model prose.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Target files inventoried across all three surfaces
- [x] Runtime-specific field formats confirmed from docs and local patterns
- [x] Requested scope excludes non-pinned orchestrate and ultra-think markdown files

### Definition of Done
- [ ] All targeted files updated to GPT-5.4
- [ ] Copilot target files include explicit role-specific `reasoningEffort` values
- [ ] ChatGPT and Codex reasoning settings preserved exactly
- [ ] Targeted files pass syntax and grep verification
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted config migration: inventory current metadata -> apply runtime-specific model replacement -> verify frontmatter/TOML correctness -> confirm no stale target-model references remain.

### Key Components
- **Copilot OpenCode agents**: `.opencode/agent/*.md` subset using `github-copilot/...`
- **ChatGPT OpenCode agents**: `.opencode/agent/chatgpt/*.md` subset using `openai/...`
- **Codex agents**: `.codex/agents/*.toml` config layers used by `[agents.*].config_file`

### Data Flow
```text
Requested scope
  -> inspect current model and reasoning metadata
  -> update target metadata per runtime
  -> parse and grep validate files
  -> record final state in spec artifacts
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research and Inventory
- Confirm GitHub Copilot supports GPT-5.4 in agent mode
- Confirm Codex config layers accept `model` and `model_reasoning_effort`
- Confirm OpenCode frontmatter pattern from existing adjacent agent files

### Phase 2: OpenCode Agent Updates
- Update the five Copilot markdown files to `github-copilot/gpt-5.4`
- Add explicit role-specific `reasoningEffort` values to those Copilot files
- Update the seven ChatGPT markdown files to `openai/gpt-5.4`
- Update stale review-model prose in both review markdown files

### Phase 3: Codex Agent Updates and Verification
- Add `model = "gpt-5.4"` to all nine `.codex/agents/*.toml` files
- Add top-level `model = "gpt-5.4"` to `.codex/config.toml`
- Verify reasoning-effort fields remain unchanged in ChatGPT and Codex surfaces
- Parse updated markdown frontmatter and TOML files
- Run grep checks for stale targeted model references in the changed scope
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Frontmatter check | Updated `.opencode/agent/**/*.md` targets | Python YAML-frontmatter parser |
| TOML parse check | Updated `.codex/agents/*.toml` and `.codex/config.toml` | Python `tomllib` |
| Negative grep | Changed scope only | `grep` tool for stale model strings |
| Spec validation | Spec folder | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| GitHub Copilot supported-model docs list GPT-5.4 | External | Green | Copilot model string confidence would drop |
| OpenAI Codex config docs define `model` and `model_reasoning_effort` | External | Green | TOML layering could be misconfigured |
| Existing local agent patterns in `.opencode/agent/` and `.opencode/agent/chatgpt/` | Internal | Green | Would need deeper repo investigation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any runtime rejects the new model pin or metadata format
- **Procedure**: Revert the affected files to their prior model entries and remove or retune the Copilot `reasoningEffort` lines
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Research and Inventory -> OpenCode Agent Updates -> Codex Updates and Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Research and Inventory | None | OpenCode updates |
| OpenCode updates | Research and Inventory | Codex updates and verification |
| Codex updates and verification | OpenCode updates | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Research and Inventory | Low | 5 minutes |
| OpenCode updates | Medium | 10 minutes |
| Codex updates and verification | Medium | 10 minutes |
| **Total** | | **~25 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Scope limited to metadata-bearing target files
- [x] No behavior or permission blocks will change

### Rollback Procedure
1. Restore prior model lines in the targeted OpenCode files
2. Remove Copilot `reasoningEffort: high` additions if rollback is needed
3. Remove `model = "gpt-5.4"` from the nine Codex TOML files
4. Restore or remove the top-level `model = "gpt-5.4"` line in `.codex/config.toml`
5. Re-run parse verification to confirm restored syntax

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: File-level revert only
<!-- /ANCHOR:enhanced-rollback -->
