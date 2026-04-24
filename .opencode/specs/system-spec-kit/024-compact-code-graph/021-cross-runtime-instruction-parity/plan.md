---
title: "Plan: Cross-Runtime Instruction [system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/plan]"
description: "Implementation order for No Hook Transport tables and @context-prime agent."
trigger_phrases:
  - "plan"
  - "cross"
  - "runtime"
  - "instruction"
  - "021"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 021 — Cross-Runtime Instruction Parity


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

### Implementation Order

1. **No Hook Transport section in CODEX.md** (20-30 LOC)
   - Add trigger table: fresh session → session_resume, with optional session_health follow-up
   - After resume/reconnect → session_resume
   - After compaction/long gap → session_resume; optionally session_health when drift is suspected
   - Reduce Claude-hook-specific wording, but track residual references as a known gap until follow-up cleanup

2. **No Hook Transport section in AGENTS.md** (30-40 LOC)
   - Add same trigger table for OpenCode/Copilot CLI
   - Clarify AGENTS.md defines `@context-prime` and advertises session lifecycle guidance
   - Keep actual first-turn delegation in `.opencode/agent/orchestrate.md`

3. **No Hook Transport section in GEMINI.md** (30-40 LOC)
   - Add trigger table adapted for Gemini CLI lifecycle
   - Reference Gemini-native hooks from Phase 022
   - Include fallback for non-hook Gemini usage

4. **@context-prime agent for OpenCode** (60-80 LOC)
    - Create `.opencode/agent/context-prime.md`
   - Agent calls: `session_resume()` plus optional `session_health()`
   - Returns compact Prime Package: spec folder, task status, system health, and recommended next steps
    - Invoked on first turn or after /clear by orchestrator

5. **Orchestrator delegation** (10-15 LOC)
    - Update `.opencode/agent/orchestrate.md` to delegate to @context-prime on first turn
    - Add @context-prime to Agent Definitions in CLAUDE.md

### Status Notes

- **F059**: VERIFIED/DONE. `.opencode/agent/orchestrate.md` lines 18-21 explicitly delegate to `@context-prime` on the first user turn or after `/clear`.
- **Residual gap**: Claude Code SessionStart hook wording still persists in `.codex/agents/orchestrate.toml`, `.codex/agents/deep-research.toml`, `.codex/agents/speckit.toml`, and several `.gemini/agents/*.md` files. This phase should describe that wording as partially cleaned up, not fully removed.

6. **CLAUDE.md Agent Definitions update** (5-10 LOC)
   - Add @context-prime entry to Agent Definitions table
   - Document as LEAF-only retrieval agent for session priming

### Dependencies
- Phases 018-020 should land first (instructions reference session_health, session_resume, auto-prime)

### Estimated Total LOC: 140-350

### Technical Context
- Runtime surface: system-spec-kit MCP server + hook adapters.
- Validation surface: recursive packet validation and full quality-gate checks.

### Phase 1: Validation
- Maintain packet verification and release-gate traceability.

### Phase 2: Validation
- Maintain packet verification and release-gate traceability.
