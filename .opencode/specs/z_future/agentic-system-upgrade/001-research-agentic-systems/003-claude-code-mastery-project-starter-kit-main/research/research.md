---
title: "...future/agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/research]"
description: "30-iteration research of the Claude Code Mastery Project Starter Kit for system-spec-kit improvement opportunities. 25 actionable findings, 5 rejected."
trigger_phrases:
  - "future"
  - "agentic"
  - "system"
  - "upgrade"
  - "001"
  - "research"
  - "003"
  - "claude"
importance_tier: "important"
contextType: "research"
---
# Deep Research Report - 003-claude-code-mastery-project-starter-kit-main

## 1. Executive Summary
- External repo: `claude-code-mastery-project-starter-kit-main`; a Claude-first starter kit centered on guided commands, hooks, working docs, and lightweight operator ergonomics rather than a deep runtime substrate. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/README.md:39-77] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/help.md:31-107]
- Iterations executed: 30 of 30
- Stop reason: max_iterations
- Total actionable findings: 25
- Must-have: 5 | Should-have: 16 | Nice-to-have: 4 | Rejected: 5
- Phase 1 surfaced adoptable workflow ideas. Phase 2 exposed places where `system-spec-kit` appears overbuilt. Phase 3 confirmed that the biggest remaining opportunity is operator-surface simplification across commands, continuity, skills, and gate ceremony.
- Top 5 adoption opportunities for `system-spec-kit`:
  - F-023 - redesign the operator surface by moving deterministic gate behavior into runtime enforcement and shrinking the prose ceremony. Origin: iteration 028.
  - F-022 - keep skill routing, but hide the mandatory Gate 2 ceremony from most user-visible workflows. Origin: iteration 027.
  - F-017 - merge the visible lifecycle commands behind one guided front door. Origin: iteration 021.
  - F-018 - pull routine continuity actions back into the Spec Kit workflow surface instead of exposing memory as a parallel product. Origin: iteration 022.
  - F-014 - simplify validation around a smaller executable invariant core with generated readiness views. Origin: iteration 016.

## 2. Cross-Phase Synthesis
- The external repo is most valuable as an operator-UX reference, not as a runtime or application-architecture template.
- The local repo usually wins on durability, continuity, and deep autonomous workflows.
- The external repo usually wins on first-run clarity, fewer memorable entry points, and lower day-to-day cognitive load.
- The strongest combined recommendation is not "copy the starter kit." It is:
  - keep the strong local substrate
  - delete visible ceremony where automation can safely enforce policy
  - merge fragmented operator surfaces
  - add guided entry and better live orientation

## 3. External Repo Reality Check
- The external repo packages work around a few memorable commands, especially `/help`, `/mdd`, and `/progress`, backed by working docs and hooks. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/help.md:31-107] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/mdd.md:31-131] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/progress.md:11-60]
- It relies on lighter instruction layering and more executable settings than the local repo currently exposes at the operator surface. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.md:11-72] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/settings.json:1-64] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/global-claude-md/settings.json:1-39]
- It is not strong evidence for rebuilding `system-spec-kit` around starter-kit runtime assumptions. The captured packet remains scaffold-oriented and relatively shallow on the implementation side. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/README.md:92-104]

## 4. Findings Registry - Phases 1 and 2

### F-001 - Add a Claude-only quick reference layer
- Origin: `iteration-001.md`
- Priority: should-have
- Target: `.claude/CLAUDE.md`
- Summary: sharpen the Claude-only quick-reference surface without replacing the stronger root governance brief.

### F-002 - Add a guided doc-first front door without replacing Spec Kit
- Origin: `iteration-002.md`
- Priority: should-have
- Target: `.opencode/command/spec_kit/README.txt`
- Summary: introduce a memorable guided entry experience inspired by `/mdd`, but route into existing Spec Kit depth.

### F-003 - Add a lightweight compressed-brief pattern
- Origin: `iteration-003.md`
- Priority: nice-to-have
- Target: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- Summary: adopt the external repo's concise brief habit, not its marketing claims.

### F-004 - Introduce a lightweight working-brief template
- Origin: `iteration-004.md`
- Priority: should-have
- Target: `.opencode/skill/system-spec-kit/templates/`
- Summary: add a scan-friendly mid-session artifact that complements, not replaces, durable packets.

### F-005 - Keep recovery hooks and add a thin enforcement layer
- Origin: `iteration-005.md`
- Priority: should-have
- Target: `.claude/settings.local.json`
- Summary: retain recovery-first hooks but add narrow deterministic enforcement where Claude supports it.

### F-006 - Adopt secret guardrails first
- Origin: `iteration-006.md`
- Priority: must-have
- Target: `.claude/settings.local.json`
- Summary: copy the external secret-blocking and secret-verification pattern as the clearest tactical safety win.

### F-007 - Add command audience and distribution metadata
- Origin: `iteration-008.md`
- Priority: should-have
- Target: `.opencode/command/README.txt`
- Summary: start deriving command visibility and help from metadata instead of static taxonomy alone.

### F-008 - Expose operator-facing observability
- Origin: `iteration-009.md`
- Priority: nice-to-have
- Target: `.opencode/command/memory/manage.md`
- Summary: present AI activity and telemetry in a user-facing way rather than only as internal machinery.

### F-009 - Add a first-class personal-preference layer
- Origin: `iteration-011.md`
- Priority: should-have
- Target: `CLAUDE.md`, `.claude/CLAUDE.md`
- Summary: separate universal repo policy from personal working-style overrides more clearly.

### F-010 - Add a sanctioned working-brief stage before full packet depth
- Origin: `iteration-012.md`
- Priority: should-have
- Target: `.opencode/skill/system-spec-kit/templates/`
- Summary: allow a lighter starting artifact that can later promote into a full packet.

### F-011 - Split session digests from promoted memories
- Origin: `iteration-013.md`
- Priority: must-have
- Target: memory save and retrieval surfaces
- Summary: separate low-friction continuity capture from higher-integrity indexed memory promotion.

### F-012 - Move deterministic policy out of prose gates
- Origin: `iteration-014.md`
- Priority: should-have
- Target: `CLAUDE.md`, `.claude/settings.local.json`, hook packages
- Summary: move routine pre-flight behavior from instructions into executable policy.

### F-013 - Reduce deep-research primary state surfaces
- Origin: `iteration-015.md`
- Priority: should-have
- Target: deep-research agent and skill surfaces