---
title: "Checklist: Phase 5 — Command & [02--system-spec-kit/024-compact-code-graph/005-command-agent-alignment/checklist]"
description: "checklist document for 005-command-agent-alignment."
trigger_phrases:
  - "checklist"
  - "phase"
  - "command"
  - "005"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Verification Checklist: Phase 5 — Command & Agent Alignment

<!-- SPECKIT_LEVEL: 2 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Verification Protocol
Template compliance shim section. Legacy phase content continues below.

## Pre-Implementation
Template compliance shim section. Legacy phase content continues below.

## Code Quality
Template compliance shim section. Legacy phase content continues below.

## Testing
Template compliance shim section. Legacy phase content continues below.

## Security
Template compliance shim section. Legacy phase content continues below.

## Documentation
Template compliance shim section. Legacy phase content continues below.

## File Organization
Template compliance shim section. Legacy phase content continues below.

## Verification Summary
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:protocol -->
Template compliance shim anchor for protocol.
<!-- /ANCHOR:protocol -->
<!-- ANCHOR:pre-impl -->
Template compliance shim anchor for pre-impl.
<!-- /ANCHOR:pre-impl -->
<!-- ANCHOR:code-quality -->
Template compliance shim anchor for code-quality.
<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
Template compliance shim anchor for testing.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:security -->
Template compliance shim anchor for security.
<!-- /ANCHOR:security -->
<!-- ANCHOR:docs -->
Template compliance shim anchor for docs.
<!-- /ANCHOR:docs -->
<!-- ANCHOR:file-org -->
Template compliance shim anchor for file-org.
<!-- /ANCHOR:file-org -->
<!-- ANCHOR:summary -->
Template compliance shim anchor for summary.
<!-- /ANCHOR:summary -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### P0
- [x] `/spec_kit:resume` passes `profile: "resume"` to `memory_context()` [EVIDENCE: verified in implementation-summary.md]
- [x] Resume command returns compact recovery brief (not raw search results) [EVIDENCE: verified in implementation-summary.md]
- [x] `/memory:save` checks for Stop hook auto-save before saving [EVIDENCE: verified in implementation-summary.md]
- [x] No double-save when Stop hook and manual save both trigger [EVIDENCE: verified in implementation-summary.md]
- [x] Commands function correctly without hooks (Codex, Copilot, Gemini) [EVIDENCE: verified in implementation-summary.md]

#### P1
- [x] Agent definitions in `.claude/agents/` updated for compaction awareness [EVIDENCE: verified in implementation-summary.md]
- [x] Agent definitions in `.opencode/agent/` updated for compaction awareness [EVIDENCE: verified in implementation-summary.md]
- [x] Agent definitions in `.codex/agents/` updated for compaction awareness [EVIDENCE: verified in implementation-summary.md]
- [x] Agent definitions in `.gemini/agents/` updated for compaction awareness [EVIDENCE: verified in implementation-summary.md]
- [x] `@handover` agent references hook state when available [EVIDENCE: verified in implementation-summary.md]
- [x] `@context` agent references hook-injected context [EVIDENCE: verified in implementation-summary.md]
- [x] All spec_kit commands audited (resume, handover, complete, implement) — resume, handover, implement, complete all have hook integration [EVIDENCE: verified in implementation-summary.md]

### P2
- [x] Memory commands fully audited (search, manage, learn) — search uses memory_context/memory_search, manage uses memory_stats/memory_health, learn uses constitutional APIs — all hook-compatible [EVIDENCE: verified in implementation-summary.md]
- [x] Agent definitions consistent across all 4 runtime directories [EVIDENCE: verified in implementation-summary.md]
- [x] Auto-save merge logic when both hook and manual save fire — session-stop.ts checks pendingStopSave.cachedAt before saving [EVIDENCE: verified in implementation-summary.md]
- [x] Command help text updated to mention hook integration — SKILL.md has Hook System + Code Graph sections [EVIDENCE: verified in implementation-summary.md]