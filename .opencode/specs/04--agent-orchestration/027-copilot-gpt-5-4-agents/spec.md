---
title: "Feature Specification: GPT-5.4 Agent Model Upgrade [04--agent-orchestration/027-copilot-gpt-5-4-agents/spec]"
description: "Update Copilot OpenCode agents, ChatGPT OpenCode agents, and Codex agent config layers to GPT-5.4 while preserving target-specific reasoning behavior."
trigger_phrases:
  - "feature"
  - "specification"
  - "gpt"
  - "agent"
  - "model"
  - "spec"
  - "027"
  - "copilot"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: GPT-5.4 Agent Model Upgrade

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Stalled |
| **Created** | 2026-03-06 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The active agent fleet is split across older model pins: five Copilot OpenCode agents still point at `github-copilot/claude-sonnet-4.6`, seven ChatGPT OpenCode agents still point at `openai/gpt-5.3-codex`, and all nine Codex multi-agent TOML config layers rely on reasoning-effort settings without an explicit `gpt-5.4` model pin. This leaves the three agent surfaces inconsistent with the requested GPT-5.4 standard.

### Purpose
Move the requested agent surfaces to GPT-5.4 with the correct configuration format for each runtime: OpenCode Copilot frontmatter, OpenCode ChatGPT frontmatter, and Codex TOML config layers. Preserve existing reasoning levels for ChatGPT and Codex agents, while setting the Copilot Sonnet-replacement agents to high reasoning.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update the five Copilot OpenCode agent files in `.opencode/agent/` that currently pin `github-copilot/claude-sonnet-4.6`
- Add explicit `reasoningEffort` values to those Copilot files as part of the GPT-5.4 replacement
- Update the seven ChatGPT OpenCode agent files in `.opencode/agent/chatgpt/` that currently pin `openai/gpt-5.3-codex`
- Preserve existing `reasoningEffort` values in the ChatGPT agent files
- Add `model = "gpt-5.4"` to all nine `.codex/agents/*.toml` files
- Add top-level `model = "gpt-5.4"` to `.codex/config.toml` for non-agent Codex sessions
- Preserve existing `model_reasoning_effort` values in all Codex TOML files
- Update any hardcoded model-convention prose that would become stale after the model change

### Out of Scope
- Changing agent workflow logic, permissions, or tool access
- Updating `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/chatgpt/orchestrate.md` or `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/chatgpt/ultra-think.md`, which do not declare model pins
- Updating `.codex/config.toml` profile reasoning-effort values
- Touching `.opencode/agent/chatgpt/` files outside the direct model change request

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/context.md` | Modify | Switch Copilot model to GPT-5.4 and set role-tuned reasoning |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/handover.md` | Modify | Switch Copilot model to GPT-5.4 and set role-tuned reasoning |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/review.md` | Modify | Switch Copilot model to GPT-5.4, keep high reasoning, update model note |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/speckit.md` | Modify | Switch Copilot model to GPT-5.4 and set role-tuned reasoning |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/write.md` | Modify | Switch Copilot model to GPT-5.4 and set role-tuned reasoning |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/chatgpt/context.md` | Modify | Switch OpenAI model to GPT-5.4, keep high reasoning |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/chatgpt/debug.md` | Modify | Switch OpenAI model to GPT-5.4, keep xhigh reasoning |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/chatgpt/handover.md` | Modify | Switch OpenAI model to GPT-5.4, keep medium reasoning |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/chatgpt/research/research/research.md` | Modify | Switch OpenAI model to GPT-5.4, keep xhigh reasoning |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/chatgpt/review.md` | Modify | Switch OpenAI model to GPT-5.4, keep xhigh reasoning, update model note |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/chatgpt/speckit.md` | Modify | Switch OpenAI model to GPT-5.4, keep medium reasoning |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/chatgpt/write.md` | Modify | Switch OpenAI model to GPT-5.4, keep medium reasoning |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/context.toml` | Modify | Add explicit `model = "gpt-5.4"` |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/debug.toml` | Modify | Add explicit `model = "gpt-5.4"` |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/handover.toml` | Modify | Add explicit `model = "gpt-5.4"` |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/orchestrate.toml` | Modify | Add explicit `model = "gpt-5.4"` |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/research.toml` | Modify | Add explicit `model = "gpt-5.4"` |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/review.toml` | Modify | Add explicit `model = "gpt-5.4"` |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/speckit.toml` | Modify | Add explicit `model = "gpt-5.4"` |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/ultra-think.toml` | Modify | Add explicit `model = "gpt-5.4"` |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/agents/write.toml` | Modify | Add explicit `model = "gpt-5.4"` |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/config.toml` | Modify | Set default Codex session model to `gpt-5.4` |

> **Note (2026-03-21):** The `model:` and `reasoningEffort:` frontmatter fields were never added to the `.opencode/agent/*.md` files, and `model = "gpt-5.4"` was never added to `.codex/config.toml`. The implementation-summary records a completed state but the actual file changes are absent. Status updated to "Stalled".
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Copilot OpenCode Sonnet-pinned agents use GPT-5.4 | All five target files contain `model: github-copilot/gpt-5.4` |
| REQ-002 | Copilot target files declare explicit reasoning levels | All five target Copilot files contain role-specific `reasoningEffort` values matching final tuning |
| REQ-003 | ChatGPT OpenCode pinned agents use GPT-5.4 | All seven target files contain `model: openai/gpt-5.4` |
| REQ-004 | Codex agent TOML layers use GPT-5.4 | All nine `.codex/agents/*.toml` files contain `model = "gpt-5.4"` |
| REQ-005 | Non-agent Codex sessions default to GPT-5.4 | `.codex/config.toml` contains top-level `model = "gpt-5.4"` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | ChatGPT reasoning effort preserved | Each ChatGPT file keeps its original `reasoningEffort` value |
| REQ-007 | Codex reasoning effort preserved | Each TOML file keeps its original `model_reasoning_effort` value |
| REQ-008 | Hardcoded review model notes stay accurate | Review-agent prose references GPT-5.4 instead of stale older models |
| REQ-009 | Research-backed config format used | Final field choices match runtime-specific docs and current repo patterns |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All targeted OpenCode Copilot files pin `github-copilot/gpt-5.4` and include explicit role-appropriate `reasoningEffort` values
- **SC-002**: All targeted OpenCode ChatGPT files pin `openai/gpt-5.4` with unchanged reasoning-effort values
- **SC-003**: All `.codex/agents/*.toml` files explicitly pin `model = "gpt-5.4"` with unchanged `model_reasoning_effort`
- **SC-004**: `.codex/config.toml` sets top-level `model = "gpt-5.4"` for direct Codex sessions
- **SC-005**: No stale `github-copilot/claude-sonnet-4.6` or `openai/gpt-5.3-codex` references remain in the targeted files
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Copilot model availability | Invalid model string would break intended routing | Use GitHub Copilot supported-model docs that list GPT-5.4 in agent mode |
| Dependency | Codex config-layer support | Wrong TOML key placement could be ignored | Use Codex config docs that define agent `config_file` TOML layers and `model` / `model_reasoning_effort` keys |
| Risk | OpenCode frontmatter drift | Unsupported frontmatter fields could break loading | Reuse existing `model:` and `reasoningEffort:` patterns already present in adjacent agent files |
| Risk | Scope creep into non-targeted agents | Extra edits would violate request boundaries | Touch only files with direct model responsibilities in the requested surfaces |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Updated agent files remain valid frontmatter documents
- **NFR-R02**: Updated Codex TOML layers remain parseable after adding `model = "gpt-5.4"`

### Maintainability
- **NFR-M01**: Changes remain limited to model and reasoning metadata plus required stale prose updates

### Compatibility
- **NFR-C01**: Runtime-specific field naming stays unchanged: `reasoningEffort` for OpenCode markdown, `model_reasoning_effort` for Codex TOML
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## L2: EDGE CASES

### Data Boundaries
- ChatGPT and Copilot agent surfaces use different provider prefixes and must not be mixed
- Codex TOML layers already include reasoning effort, so only the new `model` line should be inserted

### Error Scenarios
- If a target file already contains `reasoningEffort`, it must not be duplicated
- If a file has model prose tied to the old model, the prose must be updated with the frontmatter change

### State Transitions
- Existing orchestrate and ultra-think OpenCode markdown files without model pins remain unchanged by design
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 21 files across three agent systems |
| Risk | 8/25 | Config-only change, but runtime-sensitive |
| Research | 12/20 | Requires both GitHub Copilot and Codex config confirmation |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The requested scope is explicit enough to implement directly.
<!-- /ANCHOR:questions -->
