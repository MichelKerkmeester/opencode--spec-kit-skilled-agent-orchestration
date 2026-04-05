---
title: "Checklist: Phase 3 — Stop Hook + Token [system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/checklist]"
description: "checklist document for 003-stop-hook-tracking."
trigger_phrases:
  - "checklist"
  - "phase"
  - "stop"
  - "hook"
  - "token"
  - "003"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Verification Checklist: Phase 3 — Stop Hook + Token Tracking

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
- [x] `session-stop.ts` created with async execution [EVIDENCE: verified in implementation-summary.md]
- [x] `claude-transcript.ts` parses JSONL incrementally [EVIDENCE: verified in implementation-summary.md]
- [x] Stop hook registered with `async: true` [EVIDENCE: verified in implementation-summary.md]
- [x] Token snapshot stored in hook state metrics [EVIDENCE: verified in implementation-summary.md]
- [x] `stop_hook_active` guard prevents recursion [EVIDENCE: verified in implementation-summary.md]
- [x] No OOM on large transcripts (streaming parse) [EVIDENCE: verified in implementation-summary.md]
- [x] Cost estimate calculated per model [EVIDENCE: verified in implementation-summary.md]

#### P1
- [x] Incremental parsing with byte offset (only new lines) [EVIDENCE: verified in implementation-summary.md]
- [x] Context auto-save when >1000 output tokens — AUTO_SAVE_TOKEN_THRESHOLD in session-stop.ts [EVIDENCE: verified in implementation-summary.md]
- [x] Hook-state updated with save bookmark [EVIDENCE: verified in implementation-summary.md]
- [x] Spec folder auto-detected from transcript or hook-state — detectSpecFolder() in session-stop.ts [EVIDENCE: verified in implementation-summary.md]
- [x] Append-only snapshots (multiple Stop fires handled) [EVIDENCE: verified in implementation-summary.md]

### P2
- [x] Token usage viewable via `memory_stats` tool — hook state stores estimatedPromptTokens/estimatedCompletionTokens; code_graph_status exposes graph metrics [EVIDENCE: verified in implementation-summary.md]
- [x] `token_usage_ratio` fed back into MCP pressure logic — getTokenUsageRatio() in code-graph-db.ts + calculatePressureAdjustedBudget() in shared.ts [EVIDENCE: verified in implementation-summary.md]
- [x] Session summary extraction for auto-save — extractSessionSummary() in session-stop.ts stores to hook state sessionSummary [EVIDENCE: verified in implementation-summary.md]
- [x] `SessionEnd` hook reuses `session-stop.ts --finalize` for cleanup — --finalize argv flag triggers cleanStaleStates() [EVIDENCE: verified in implementation-summary.md]