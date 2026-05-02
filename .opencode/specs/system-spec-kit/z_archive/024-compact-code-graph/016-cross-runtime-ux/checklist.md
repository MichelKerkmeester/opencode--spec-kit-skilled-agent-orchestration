---
title: "Checklist: Cross-Runtime UX & Documentation [system-spec-kit/024-compact-code-graph/016-cross-runtime-ux/checklist]"
description: "8 items across P2/P3 for phase 016."
trigger_phrases:
  - "checklist"
  - "cross"
  - "runtime"
  - "documentation"
  - "016"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/016-cross-runtime-ux"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["checklist.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Verification Checklist: Phase 016 — Cross-Runtime UX & Documentation

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

### Phase Status

**PARTIAL (11/14 items complete; 3 deferred)**

### Completed / In Scope

### P2

- [x] Near-exact seed tier added (±5 lines, graduated confidence 0.95 - distance*0.02) [EVIDENCE: verified in implementation-summary.md]
- [x] CocoIndex score-propagation limitation is documented accurately as deferred [EVIDENCE: Phase 016 tasks and implementation summary record the API dependency]
- [x] Composite index (file_path, start_line) added to code_nodes [EVIDENCE: verified in implementation-summary.md]
- [x] Intent pre-classifier annotates structural vs semantic vs hybrid metadata — classifyQueryIntent() in query-intent-classifier.ts feeds `queryIntentMetadata` / `queryIntentRouting` [EVIDENCE: verified in implementation-summary.md]
- [x] Auto-reindex triggers on git branch switch (HEAD hash change) [EVIDENCE: verified in implementation-summary.md]
- [x] Auto-reindex on session start via first-call priming [EVIDENCE: verified in implementation-summary.md]
- [x] Recovery documentation consolidated (single source of truth in root CLAUDE.md) [F018] [EVIDENCE: verified in implementation-summary.md]
- [x] Seed-resolver DB failures return error — no silent placeholder anchors [F014] [EVIDENCE: verified in implementation-summary.md]
- [x] Spec/settings SessionStart scope aligned (matchers match registration) [F030] — spec updated: single unscoped entry + in-script branching is the correct design [EVIDENCE: verified in implementation-summary.md]
- [x] Parent checklist PARTIAL items downgraded for phases 005/006/008/011/012 [EVIDENCE: verified in implementation-summary.md]

### P3

- [x] CODEX.md updated with Session Start Protocol [EVIDENCE: verified in implementation-summary.md]
- [x] AGENTS.md updated with code graph auto-trigger for Copilot CLI [EVIDENCE: verified in implementation-summary.md]
- [x] OpenCode context.md updated with code graph integration [EVIDENCE: verified in implementation-summary.md]
- [x] GEMINI.md updated with session start protocol (shared via AGENTS.md symlink) [EVIDENCE: verified in implementation-summary.md]
- [x] CLAUDE.md updated with universal Code Search Protocol [EVIDENCE: verified in implementation-summary.md]

### Deferred / Out of Scope for This Phase

- [x] Intent-metadata routing limitation is documented accurately as deferred [EVIDENCE: Phase 016 tasks and implementation summary preserve the distinction between metadata and backend dispatch]
- [x] Runtime instruction-file verification remains explicitly documented as a manual follow-up [EVIDENCE: Phase 016 tasks and implementation summary keep this out of shipped scope]
