---
title: "Implementation Summary: CLI Self-Invocation Guards"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: CLI Self-Invocation Guards

## Overview

Added self-invocation guards to all 4 CLI orchestration skills (`cli-claude-code`, `cli-gemini`, `cli-codex`, `cli-copilot`) to prevent an AI agent from invoking a skill that delegates to the very CLI it is already running inside.

## Problem Solved

The shared skill system (symlinked across `.claude/skills`, `.codex/skills`, `.gemini/agents/`) means `skill_advisor.py` can recommend a CLI skill to the AI that IS that CLI. This creates circular self-delegation — wasteful and potentially causing runtime errors.

## Changes Made

### All 4 SKILL.md files — "When NOT to Use" section

Added a prominent **Self-invocation guard** as the first entry in each "When NOT to Use" section. Each guard:
- Identifies the specific CLI runtime
- Lists native capabilities the AI should use instead
- States that the skill is for EXTERNAL AIs only
- Includes env var detection where applicable

### All 4 SKILL.md files — NEVER rules

Added explicit NEVER rule against self-invocation to each skill's rules section.

### cli-claude-code — Prerequisite Detection

Reframed both `$CLAUDECODE` env var checks (in Smart Routing and How It Works) from "nesting prevention" to "self-invocation guard" framing.

### cli-copilot — Prerequisite Detection

Updated the commented env var check comment to reference self-invocation.

### cli-copilot — "When NOT to Use"

Removed the old "When already running inside a Copilot CLI session (to avoid nesting)" bullet, replaced with the comprehensive self-invocation guard entry.

## Files Modified

| File | Changes |
|------|---------|
| `.opencode/skill/cli-claude-code/SKILL.md` | Enhanced "When NOT to Use" (replaced nesting bullet with self-invocation guard), enhanced NEVER rule #2, reframed 2 prerequisite detection comments |
| `.opencode/skill/cli-gemini/SKILL.md` | Added self-invocation guard to "When NOT to Use", added NEVER rule #7 |
| `.opencode/skill/cli-codex/SKILL.md` | Added self-invocation guard to "When NOT to Use", added NEVER rule #7 |
| `.opencode/skill/cli-copilot/SKILL.md` | Replaced nesting bullet with self-invocation guard in "When NOT to Use", added NEVER rule #5, updated prerequisite detection comment |

## Guard Pattern (consistent across all 4)

**"When NOT to Use" entry:**
> **Self-invocation guard**: If you ARE [CLI] (running natively inside a [CLI] session), do NOT use this skill. You already have direct access to all capabilities described here — [native capabilities list]. Delegating to yourself via CLI is circular and wasteful. This skill is for EXTERNAL AIs ([other CLIs]) to delegate TO [CLI].

**NEVER rule:**
> **NEVER invoke this skill from within [CLI] itself** — If you ARE [CLI], you already have native access to all capabilities — do not self-delegate via CLI. Self-invocation creates a circular, wasteful loop; use your native tools directly instead.

## Native Capabilities Referenced

| CLI | Native Capabilities Cited |
|-----|--------------------------|
| Claude Code | Edit tool, Agent tool, extended thinking, structured output, skills system, Spec Kit Memory |
| Gemini CLI | google_web_search, codebase_investigator, save_memory, agent system |
| Codex CLI | Sandbox execution, /review workflow, --search, session management, profile system |
| Copilot CLI | Autopilot, Explore/Task agents, cloud delegation, repo memory, multi-model selection |
