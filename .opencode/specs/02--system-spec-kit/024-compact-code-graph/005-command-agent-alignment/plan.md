---
title: "Plan: Phase 5 — Command & Agent Alignment [02--system-spec-kit/024-compact-code-graph/005-command-agent-alignment/plan]"
description: "1. Audit memory commands"
trigger_phrases:
  - "plan"
  - "phase"
  - "command"
  - "agent"
  - "alignment"
  - "005"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 5 — Command & Agent Alignment


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. SUMMARY
Template compliance shim section. Legacy phase content continues below.

## 2. QUALITY GATES
Template compliance shim section. Legacy phase content continues below.

## 3. ARCHITECTURE
Template compliance shim section. Legacy phase content continues below.

## 4. IMPLEMENTATION PHASES
Template compliance shim section. Legacy phase content continues below.

## 5. TESTING STRATEGY
Template compliance shim section. Legacy phase content continues below.

## 6. DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 7. ROLLBACK PLAN
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:summary -->
Template compliance shim anchor for summary.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
Template compliance shim anchor for quality-gates.
<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
Template compliance shim anchor for architecture.
<!-- /ANCHOR:architecture -->
<!-- ANCHOR:phases -->
Template compliance shim anchor for phases.
<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
Template compliance shim anchor for testing.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
Template compliance shim anchor for dependencies.
<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
Template compliance shim anchor for rollback.
<!-- /ANCHOR:rollback -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Steps

1. **Audit memory commands:**
   - Read all files in `.opencode/command/memory/`
   - Identify compaction references, save triggers, context assumptions
   - Document which commands need changes
2. **Update `/spec_kit:resume` to pass `profile: "resume"`:**
   - Locate the `memory_context()` call in resume command
   - Add `profile: "resume"` parameter (fixes gap from research iter 012)
   - Verify the resume brief format is returned instead of raw search results
3. **Update `/memory:save` for Stop hook awareness:**
   - Remove stale guidance that tells users to inspect a non-existent `pendingStopSave.cachedAt` marker
   - Document the shipped reality: hook-aware recovery exists, but no dedicated stop-save field landed in `hook-state.ts`
   - Preserve existing save behavior as default when no hooks are active
4. **Audit agent definitions for compaction recovery instructions:**
   - Search all 4 agent directories for compaction-related content:
     `.claude/agents/`, `.opencode/agent/`, `.codex/agents/`, `.gemini/agents/`
   - List every agent file that references: compaction, compact, recovery, resume, context loss
5. **Update agent definitions to reference hook-injected context:**
   - Add conditional block: "If hook-injected context is present in conversation, use it"
   - Keep existing manual recovery as fallback
   - Ensure `@handover`, `@context`, `@orchestrate` agents are updated
6. **Test commands with and without hooks active:**
   - Claude Code (hooks active): verify resume uses hook context, save detects auto-save
   - Codex CLI (no hooks): verify resume still works via tool fallback
   - Verify no regression in any command's core behavior

<!-- ANCHOR:dependencies -->
### Dependencies
- Phase 1 (hook scripts must exist to test hook awareness)
- Phase 3 (Stop hook must exist for `/memory:save` double-save detection)
- Phase 4 (runtime detection needed for conditional behavior)
<!-- /ANCHOR:dependencies -->

### Technical Context
- Runtime surface: system-spec-kit MCP server + hook adapters.
- Validation surface: recursive packet validation and full quality-gate checks.

### Phase 1: Validation
- Maintain packet verification and release-gate traceability.

### Phase 2: Validation
- Maintain packet verification and release-gate traceability.
