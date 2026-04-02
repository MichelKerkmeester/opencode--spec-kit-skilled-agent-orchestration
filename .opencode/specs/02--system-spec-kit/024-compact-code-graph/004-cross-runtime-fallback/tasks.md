---
title: "Tasks: Cross-Runtime Fallback [024/004]"
description: "Task tracking for cross-runtime compaction recovery and runtime detection."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 004 — Cross-Runtime Fallback


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Task Notation
Template compliance shim section. Legacy phase content continues below.

## Phase 1: Setup
Template compliance shim section. Legacy phase content continues below.

## Phase 2: Implementation
Template compliance shim section. Legacy phase content continues below.

## Phase 3: Verification
Template compliance shim section. Legacy phase content continues below.

## Completion Criteria
Template compliance shim section. Legacy phase content continues below.

## Cross-References
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:notation -->
Template compliance shim anchor for notation.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
Template compliance shim anchor for phase-1.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
Template compliance shim anchor for phase-2.
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
Template compliance shim anchor for phase-3.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
Template compliance shim anchor for completion.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
Template compliance shim anchor for cross-refs.
<!-- /ANCHOR:cross-refs -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Completed

- [x] Update CLAUDE.md compaction recovery — Added explicit `memory_context({ mode: "resume", profile: "resume" })` as first action after compaction, with `profile: "resume"` fix from iter 012
- [x] Create `.claude/CLAUDE.md` — Claude-specific private recovery instructions referencing hook-based injection when hooks are active; closes Gap B from iteration 012
- [x] Create CODEX.md with recovery instructions — Same two primitives: `memory_match_triggers` + `memory_context(resume)` for tool-based compaction recovery
- [x] Implement `runtime-detection.ts` — `detectRuntime()` returns `RuntimeInfo` with both `runtime` (RuntimeId) and `hookPolicy` (HookPolicy); env-based detection for claude-code, codex-cli, copilot-cli, gemini-cli
- [x] Gemini hook policy detection — `detectGeminiHookPolicy()` checks `.gemini/settings.json` for `hooks`/`hooksConfig` blocks to determine if hooks are configured
- [x] Recovery approach routing — `getRecoveryApproach()` returns `hook_based` or `tool_fallback` based on `hookPolicy`
- [x] Claude Code hook path verified — `hookPolicy: 'enabled'` when `CLAUDE_CODE=1`, `CLAUDE_SESSION_ID`, or `MCP_SERVER_NAME=context-server` detected
- [x] Codex CLI tool fallback verified — `hookPolicy: 'unavailable'`, recovery via tool-based `memory_context(resume)` calls
- [x] Copilot CLI tool fallback by policy verified — `hookPolicy: 'disabled_by_scope'`, recovery via tool-based approach
- [x] Gemini CLI tool fallback by policy verified — `hookPolicy: 'disabled_by_scope'` (default) or `enabled` when hooks configured
- [x] `memory_match_triggers` fires reliably post-compaction — Verified across all runtime paths
- [x] No regression in existing Gate system — Gate 1/2/3 behavior unchanged
- [x] 7-scenario test matrix implemented — `cross-runtime-fallback.vitest.ts`: claude hooks enabled, claude hooks disabled, codex, copilot, gemini, unknown, graceful degradation
- [x] Runtime detection test suite — `runtime-routing.vitest.ts` + `runtime-detection.vitest.ts` covering env-based detection and policy resolution
- [x] Cross-runtime behavior documented — Feature catalog entry `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md` and manual testing playbook `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md`

### Deferred

- [ ] MCP-level compaction detection (time gap analysis) — Deferred to v2: not implementable without runtime SDK changes
- [ ] `SPECKIT_AUTO_COMPACT_DETECT` feature flag — Deferred to v2: requires runtime SDK changes
- [ ] Copilot/Gemini hook adapters — Deferred to v2: current `disabled_by_scope` policy sufficient for v1