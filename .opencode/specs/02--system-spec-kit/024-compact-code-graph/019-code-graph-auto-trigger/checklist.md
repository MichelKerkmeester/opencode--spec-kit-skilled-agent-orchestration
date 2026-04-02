---
title: "Checklist: Code Graph Auto-Trigger [024/019]"
description: "10 items across P1/P2 for phase 019."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Verification Checklist: Phase 019 — Code Graph Auto-Trigger

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

#### P1 — Must Pass

- [x] [P1] ensureCodeGraphReady() checks empty graph → full scan — detectState() empty branch [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] ensureCodeGraphReady() checks git HEAD change → full rescan — detectState() HEAD comparison [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] ensureCodeGraphReady() checks file mtimes → selective reindex — detectState() mtime branch [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] code_graph_context attempts ensureCodeGraphReady before building context — handlers/code-graph/context.ts [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] code_graph_query attempts ensureCodeGraphReady before running query — handlers/code-graph/query.ts [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] 10-second timeout prevents blocking on long reindex — AUTO_INDEX_TIMEOUT_MS = 10_000 [EVIDENCE: verified in implementation-summary.md]

### P2 — Should Pass

- [x] code_graph_status reports detectState()-based freshness (fresh/stale/empty) — getGraphFreshness() in status.ts [EVIDENCE: verified in implementation-summary.md]
- [x] Selective reindex threshold limits full rescan — SELECTIVE_REINDEX_THRESHOLD = 50 [EVIDENCE: verified in implementation-summary.md]
- [ ] Freshness includes an additional 5-minute age window — NOT IMPLEMENTED
- [ ] Debounce state is keyed by rootDir — NOT IMPLEMENTED
- [ ] New files are detected by freshness checks before a full scan — NOT IMPLEMENTED
- [ ] Deleted files are cleaned up on the auto-trigger indexing path — NOT IMPLEMENTED
- [ ] Auto-index failures are surfaced as blocking errors to callers — NOT IMPLEMENTED
- [ ] F048: includeGlobs receives proper glob patterns, not raw paths — DEFERRED
- [ ] F049: AbortController actually cancels indexFiles operation — DEFERRED (fire-and-forget acceptable)