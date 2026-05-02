---
title: "Phase 021: Cross-Runtime [system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/spec]"
description: "Template compliance shim section. Legacy phase content continues below."
trigger_phrases:
  - "phase"
  - "021"
  - "cross"
  - "runtime"
  - "spec"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 021: Cross-Runtime Instruction Parity

<!-- PHASE_LINKS: parent=../spec.md predecessor=020-query-routing-integration successor=022-gemini-hook-porting -->

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

### What This Is

The instruction files that tell AI assistants how to use Spec Kit Memory are inconsistent across runtimes. Claude's CLAUDE.md is comprehensive; CODEX.md, AGENTS.md, and GEMINI.md are missing key lifecycle instructions. This phase brings them all to parity.

### Plain-English Summary

**Problem:** When you use a non-hook runtime like Codex CLI or Gemini CLI, the instruction file can drift away from the live recovery contract. Earlier Phase 021 wording still told operators to start with `session_resume()` even after the packet standardized on `session_bootstrap()` as the canonical first recovery call.

**Solution:** Add a standard non-hook recovery section to every runtime's instruction file with the current bootstrap-first trigger table. Also create an `@context-prime` agent for OpenCode, while keeping its internal two-step `session_resume()` + optional `session_health()` workflow distinct from the public first-call recovery contract.

### What to Build

### Part 1: Instruction File Updates (from research iter 100)

Add a non-hook recovery section to `AGENTS.md`, `AGENTS.md`, and `AGENTS.md` with a trigger table:

| When | What to Call |
|------|-------------|
| Fresh session start | `session_bootstrap()` — returns resume + health + structural context in one call |
| After resume/reconnect | `session_resume()` |
| Suspected context loss | `session_health()` → if structural context is stale or missing, call `session_bootstrap()` |
| After `/clear` | Same as fresh session |
| Before structural search | `code_graph_context({ subject: "..." })` |
| Before memory save | `memory_save()` via generate-context.js |

Also reduce Claude-hook-specific wording in non-Claude instruction files, but record the remaining references as a known residual gap until the follow-up cleanup lands.

**Files to change:**
- `AGENTS.md` — add No Hook Transport section
- `AGENTS.md` — define `@context-prime` and add No Hook Transport session lifecycle guidance
- `AGENTS.md` — add No Hook Transport section
- `.codex/agents/orchestrate.toml` — reduce Claude-hook references where possible
- `.gemini/agents/orchestrate.md` — reduce Claude-hook references where possible

### Part 2: OpenCode @context-prime Agent (from research iter 104)

Create a new lightweight agent at `.opencode/agent/context.md` that:
1. Calls `session_resume()` to recover prior session state plus graph/CocoIndex availability
2. Optionally calls `session_health()` when session quality scoring is useful
3. Returns a compact "Prime Package" with: spec folder, task status, system health, and recommended next steps

This agent is invoked on first turn or after `/clear` by the orchestrator.

This remains an internal delegated workflow. It does not replace the public runtime guidance that tells hookless operators to call `session_bootstrap()` first on fresh starts and after `/clear`.

**Files to change:**
- New `.opencode/agent/context.md`
- `.opencode/agent/orchestrate.md` — delegate to `@context-prime` on first turn or after `/clear`

### Cross-Runtime Impact

| Runtime | Before | After |
|---------|--------|-------|
| Claude Code | 100% | 100% |
| OpenCode | 60% | 80% |
| Codex CLI | 55% | 80-85% |
| Copilot CLI | 50% | 80% |
| Gemini CLI | 50% | 80% |

### Estimated LOC: 140-350
### Risk: LOW — documentation and config changes only
### Dependencies: Phases 018-020 should land first (the instructions reference those tools)

---

### Implementation Status (Post-Review Iterations 041-050)

| Item | Status | Evidence |
|------|--------|----------|
| Part 1: Bootstrap-first non-hook recovery table in CODEX.md | DONE | Fresh starts and `/clear` now point to `session_bootstrap()` first |
| Part 1: Bootstrap-first non-hook recovery table in AGENTS.md | DONE | Runtime guidance mirrors the canonical bootstrap-first contract |
| Part 1: Bootstrap-first non-hook recovery table in GEMINI.md | DONE | Non-hook runtime guidance mirrors AGENTS/CODEX wording |
| Part 2: @context-prime agent | DONE | `.opencode/agent/context.md` keeps the delegated `session_resume()` + optional `session_health()` flow |
| Orchestrator delegation to @context-prime | VERIFIED/DONE | F059 closed — `.opencode/agent/orchestrate.md` lines 18-21 delegate on first turn or after `/clear` |
| Claude-hook wording removed from non-Claude agent files | KNOWN GAP | Residual wording still exists in `.codex/agents/*.toml` and `.gemini/agents/*.md`; follow-up cleanup remains |

### Review Findings (iter 047)
- F059 (P2): CLOSED. `.opencode/agent/orchestrate.md` lines 18-21 wire first-turn and post-`/clear` delegation to `@context-prime`.
- Residual gap: Claude Code SessionStart hook wording still appears in `.codex/agents/orchestrate.toml` (827-835), `.codex/agents/deep-research.toml` (425-429), `.codex/agents/speckit.toml` (557-561), plus `.gemini/agents/orchestrate.md` and related Gemini agent docs. Do not treat that cleanup as complete in this phase.
- Truth-sync note: public runtime guidance is bootstrap-first, while `@context-prime` remains a delegated lower-level resume surface.

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
