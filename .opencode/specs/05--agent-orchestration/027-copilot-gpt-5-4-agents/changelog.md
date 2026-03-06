---
title: "Changelog: GPT-5.4 Agent Model Upgrade"
description: "Chronological notes for the GPT-5.4 rollout across OpenCode and Codex agent configs."
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

## 2026-03-06

### Added
- Explicit `model = "gpt-5.4"` pins for all Codex agent TOML layers in `.codex/agents/`
- Top-level `model = "gpt-5.4"` in `.codex/config.toml` for direct Codex sessions
- Spec artifacts and verification evidence for the GPT-5.4 migration in `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`

### Changed
- OpenCode Copilot agents in `.opencode/agent/` now use `github-copilot/gpt-5.4`
- OpenCode ChatGPT agents in `.opencode/agent/chatgpt/` now use `openai/gpt-5.4`
- Review-agent model notes now reference GPT-5.4 instead of older pinned models

### Follow-Up Tuning
- Copilot reasoning tiers were finalized as `context=medium`, `handover=low`, `review=high`, `speckit=medium`, and `write=medium`
- ChatGPT and Codex reasoning tiers remained unchanged from their pre-upgrade values

### Verification
- Metadata and TOML parsing succeeded via Python verification scripts (`VERIFY_OK`, `CODEX_CONFIG_OK`)
- Grep checks confirmed the targeted old model strings no longer appear in the changed agent scope
- Spec validation passed with warnings for documentation-shape recommendations only
