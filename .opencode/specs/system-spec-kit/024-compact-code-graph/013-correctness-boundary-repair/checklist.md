---
title: "Checklist: Correctness & Boundary [system-spec-kit/024-compact-code-graph/013-correctness-boundary-repair/checklist]"
description: "25 items across P0/P1/P2 for phase 013."
trigger_phrases:
  - "checklist"
  - "correctness"
  - "boundary"
  - "013"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/013-correctness-boundary-repair"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["checklist.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Verification Checklist: Phase 013 — Correctness & Boundary Repair

<!-- SPECKIT_LEVEL: 3 -->


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

- [x] endLine correctly set for multi-line JS/TS functions (brace-counting) [EVIDENCE: verified in implementation-summary.md]
- [x] endLine correctly set for multi-line Python functions (indentation) [EVIDENCE: verified in implementation-summary.md]
- [x] endLine correctly set for multi-line Bash functions (marker tracking) [EVIDENCE: verified in implementation-summary.md]
- [x] CALLS edges detected across full function bodies (not just declaration line) [EVIDENCE: verified in implementation-summary.md]
- [x] contentHash computed over full function body (startLine to endLine) [EVIDENCE: verified in implementation-summary.md]

#### P1

- [x] Seed identity (source type) preserved through code_graph_context pipeline [F006] [EVIDENCE: verified in implementation-summary.md]
- [x] Code-graph dispatch uses local `getMissingRequiredStringArgs()` checks for required strings in `code_graph_query` and `ccc_feedback` — not unified `validateToolArgs()` [F010] [EVIDENCE: verified in implementation-summary.md]
- [x] code_graph_scan rejects rootDir outside workspace root [F010] [EVIDENCE: verified in implementation-summary.md]
- [x] Exception strings sanitized in memory-context.ts handler [EVIDENCE: verified in implementation-summary.md]
- [x] Exception strings sanitized in code_graph_context handler [EVIDENCE: verified in implementation-summary.md]
- [x] Orphan inbound edges deleted during replaceNodes() [F007] [EVIDENCE: verified in implementation-summary.md]
- [x] Orphan outbound edges deleted during replaceNodes() [F007] [EVIDENCE: verified in implementation-summary.md]
- [x] Budget allocator accepts caller-provided budget (no hard 4000 ceiling) [F011] [EVIDENCE: verified in implementation-summary.md]
- [x] sessionState section included in budget allocation (no bypass) [F020] [EVIDENCE: verified in implementation-summary.md]
- [x] Merger skips sections with zero granted budget [F012] [EVIDENCE: verified in implementation-summary.md]
- [x] Merger truncation marker stays within granted budget [F012] [EVIDENCE: verified in implementation-summary.md]
- [x] code_graph_scan initializes DB on fresh runtime without throwing [F021] [EVIDENCE: verified in implementation-summary.md]
- [x] initDb() has migration guard — failed init resets singleton for retry [F023] [EVIDENCE: verified in implementation-summary.md]
- [x] replaceNodes/Edges wrapped in transaction — constraint error rolls back [F024] [EVIDENCE: verified in implementation-summary.md]
- [x] Transitive code_graph_query respects maxDepth — no node leak [F026] [EVIDENCE: verified in implementation-summary.md]
- [x] Converging paths deduplicated in transitive query results [F026] [EVIDENCE: verified in implementation-summary.md]
- [x] `includeTrace` is absent from the `code_graph_context` schema; memory tool schemas (`memory_context`, `memory_search`) still expose `includeTrace` [F033] [EVIDENCE: verified in implementation-summary.md]
- [x] All existing vitest tests still pass after changes — 226/226 [EVIDENCE: verified in implementation-summary.md]

### P2

- [x] Working-set-tracker enforces maxFiles at insertion (no 2x overshoot) [F013] [EVIDENCE: verified in implementation-summary.md]
- [x] `ccc_feedback` length-validation gap for `comment`/`resultFile` is documented accurately as still open [EVIDENCE: Phase 013 tasks and implementation summary record the limitation]
