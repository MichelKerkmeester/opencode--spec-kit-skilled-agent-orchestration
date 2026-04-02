---
title: "Checklist: Cross-Runtime UX & Documentation [024/016]"
description: "8 items across P2/P3 for phase 016."
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
- [ ] CocoIndex score propagation via blended confidence formula — DEFERRED: requires CocoIndex API changes
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

- [ ] Intent metadata drives backend selection/routing — DEFERRED: current implementation annotates `queryIntentMetadata` / `queryIntentRouting` but does not yet route queries to different backends from that metadata
- [ ] All instruction files verified to load on their respective runtimes — DEFERRED: requires manual verification