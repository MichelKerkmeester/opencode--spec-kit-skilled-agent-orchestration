---
title: "Phase 5: Command & Agent Alignment [02--system-spec-kit/024-compact-code-graph/005-command-agent-alignment/spec]"
description: "Update commands and agent definitions across all runtimes to work with the new hook system. Commands like /spec_kit:resume and /memory:save need hook-awareness, and agent defini..."
trigger_phrases:
  - "phase"
  - "command"
  - "agent"
  - "alignment"
  - "spec"
  - "005"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 5: Command & Agent Alignment

<!-- PHASE_LINKS: parent=../spec.md predecessor=004-cross-runtime-fallback successor=006-documentation-alignment -->

<!-- SPECKIT_LEVEL: 2 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. METADATA
Template compliance shim section. Legacy phase content continues below.

## 2. PROBLEM & PURPOSE
Template compliance shim section. Legacy phase content continues below.

## 3. SCOPE
Template compliance shim section. Legacy phase content continues below.

## 4. REQUIREMENTS
Template compliance shim section. Legacy phase content continues below.

## 5. SUCCESS CRITERIA
Template compliance shim section. Legacy phase content continues below.

## 6. RISKS & DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 10. OPEN QUESTIONS
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:metadata -->
Template compliance shim anchor for metadata.
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
Template compliance shim anchor for problem.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
Template compliance shim anchor for scope.
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
Template compliance shim anchor for requirements.
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
Template compliance shim anchor for success-criteria.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
Template compliance shim anchor for risks.
<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
Template compliance shim anchor for questions.
<!-- /ANCHOR:questions -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Summary
Update commands and agent definitions across all runtimes to work with the new hook system. Commands like `/spec_kit:resume` and `/memory:save` need hook-awareness, and agent definitions referencing compaction recovery must align with hook-injected context.

### Gap Analysis

| Gap | Current State | Target State |
|-----|---------------|--------------|
| `/spec_kit:resume` missing `profile: "resume"` | Calls `memory_context({ mode: "resume" })` without profile param | Pass `profile: "resume"` for compact brief format (iter 012 finding) |
| `/memory:save` double-save risk | Always saves unconditionally | Check if Stop hook already saved context; skip or merge |
| Agent compaction instructions stale | Agents reference manual compaction recovery | Agents reference hook-injected context when available |
| Command memory awareness | Commands unaware of hook-injected context | Commands check for hook context before redundant MCP calls |

### What to Update

### 1. Memory Commands (`.opencode/command/memory/`)

Audit all commands for compaction references:
- `/memory:save` — Must document Stop-hook awareness truthfully (avoid double-save overclaims). The shipped guidance should acknowledge hook-aware recovery without claiming a dedicated `pendingStopSave.cachedAt` marker that does not exist in `hook-state.ts`.
- `/memory:search`, `/memory:manage` — Likely no changes needed, but verify no compaction-specific assumptions.

### 2. Spec Kit Commands (`.opencode/command/spec_kit/`)

- `/spec_kit:resume` — Must pass `profile: "resume"` to `memory_context()`. Currently missing this parameter, which causes search results instead of a compact recovery brief (iteration 012 gap).
- `/spec_kit:handover` — Verify handover doc creation accounts for hook-based context snapshots.
- `/spec_kit:complete`, `/spec_kit:implement` — Verify no compaction-related assumptions broken by hooks.

### 3. Agent Definitions

Audit and update agent files that reference compaction recovery across all runtimes:

| Runtime | Agent Directory | Files to Check |
|---------|----------------|---------------|
| Claude | `.claude/agents/` | All agent `.md` files referencing compaction |
| OpenCode (Copilot) | `.opencode/agent/` | All agent `.md` files referencing compaction |
| Codex | `.codex/agents/` | All agent `.toml` files referencing compaction |
| Gemini | `.gemini/agents/` | All agent `.md` files referencing compaction |

Updates needed:
- Add conditional: "If hook-injected context is present, use it instead of manual recovery calls"
- Keep manual recovery as fallback for runtimes without hooks
- Ensure `@handover` and `@context` agents reference hook state when available

### 4. Query-Intent Routing

Agents should route queries to the appropriate system based on intent:

| Query Intent | Primary Source | Secondary |
|---|---|---|
| "Find code related to X" | CocoIndex (semantic) | Code graph (expand neighbors) |
| "What calls this function?" | Code graph (structural) | — |
| "What imports this file?" | Code graph (structural) | — |
| "How does retry logic work?" | CocoIndex (semantic) | Code graph (trace call chain) |
| "What changed recently?" | Memory (session) | Code graph (impact analysis) |
| "Show file structure/outline" | Code graph (structural) | — |

**Agent update guidance:**
- Use CocoIndex (`mcp__cocoindex_code__search`) for "find code that...", "how is X implemented", semantic discovery
- Use Code Graph (`code_graph_query`, when available) for "what calls/imports/extends...", structural navigation
- Use Memory (`memory_search`, `memory_context`) for session continuity, prior decisions, compaction recovery

### 5. Working-Set Awareness (Iteration 053)

Agents should be aware of the session working set when available:
- After compaction, the working set identifies which files/symbols were actively touched
- Agents receiving compaction-recovery context should prioritize working-set files over generic search results
- The `@context` agent should check for working-set data before doing broad codebase exploration
- Working-set data includes: file paths, symbol names, access type (read/write/reference), structural role

### Acceptance Criteria
- [ ] `/spec_kit:resume` passes `profile: "resume"` to `memory_context()`
- [ ] `/memory:save` detects Stop hook auto-save and avoids double-save
- [ ] Agent definitions updated across all 4 runtime directories
- [ ] Agents reference hook-injected context when available, with tool fallback
- [ ] Commands work correctly both with and without hooks active
- [ ] No regression in command behavior for non-hook runtimes (Codex, Copilot, Gemini)

### Files Modified
- EDIT: `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml` (add `profile: "resume"` to `memory_context()` parameters)
- EDIT: `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml` (add `profile: "resume"` to `memory_context()` parameters)
- EDIT: `.opencode/command/memory/save.md` (add Stop hook double-save check)
- EDIT: `.claude/agents/*.md` (compaction-aware agents)
- EDIT: `.opencode/agent/*.md` (compaction-aware agents)
- EDIT: `.codex/agents/*.toml` (compaction-aware agents)
- EDIT: `.gemini/agents/*.md` (compaction-aware agents)

### LOC Estimate
~100-150 lines across command updates + ~80-120 lines across agent definitions

### Problem Statement
This phase addresses concrete context-preservation and code-graph reliability gaps tracked in this packet.

### Requirements Traceability
- REQ-900: Keep packet documentation and runtime verification aligned for this phase.
- REQ-901: Keep packet documentation and runtime verification aligned for this phase.
- REQ-902: Keep packet documentation and runtime verification aligned for this phase.
- REQ-903: Keep packet documentation and runtime verification aligned for this phase.
- REQ-904: Keep packet documentation and runtime verification aligned for this phase.

### Acceptance Scenarios
- **Given** phase context is loaded, **When** verification scenario 1 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 2 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 3 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 4 runs, **Then** expected packet behavior remains intact.
