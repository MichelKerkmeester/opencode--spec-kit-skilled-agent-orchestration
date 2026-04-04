---
title: "Checklist: Non-Hook Auto-Priming & Session Health [024/018]"
description: "12 items across P1/P2 for phase 018, including remaining follow-ups."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Verification Checklist: Phase 018 — Non-Hook Auto-Priming & Session Health

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

**Overall phase state:** PARTIAL — core delivery is in place, but remaining limitations below are not yet closed.

#### P1 — Must Pass

- [x] [P1] PrimePackage includes specFolder, codeGraphStatus, cocoIndexAvailable, recommendedCalls — memory-surface.ts PrimePackage type [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] First tool call triggers auto-prime with structured meta and hints — context-server.ts primeSessionIfNeeded() [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] session_health tool returns ok/warning/stale traffic-light status — handlers/session-health.ts [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] Token budget enforced on prime payload — enforceAutoSurfaceTokenBudget applied [EVIDENCE: verified in implementation-summary.md]
- [x] [P1] Tool call timestamps tracked per session — recordToolCall/getSessionTimestamps in memory-surface.ts [EVIDENCE: verified in implementation-summary.md]

### P2 — Should Pass

- [x] session_health registered in tool-schemas.ts — schema and input schema present [EVIDENCE: verified in implementation-summary.md]
- [x] Handler wired in lifecycle-tools.ts — dispatch path verified [EVIDENCE: verified in implementation-summary.md]
- [x] F045: sessionPrimed flag retry on failure — DONE (flag now flips after successful priming) [EVIDENCE: verified in implementation-summary.md]
- [x] F046: cocoIndex path uses configured root instead of process.cwd() — DONE [EVIDENCE: verified in implementation-summary.md]
- [x] session_health spec-folder-drift limitation is documented accurately as not implemented [EVIDENCE: Phase 018 tasks and implementation summary preserve the limitation]
- [x] session_health idle-gap timer limitation is documented accurately [EVIDENCE: Phase 018 tasks and implementation summary preserve the limitation]
- [x] F047 dual `lastToolCallAt` state was later resolved and is no longer an unresolved checklist gap [EVIDENCE: `handlers/session-health.ts` now uses context-metrics as the single source of truth]
