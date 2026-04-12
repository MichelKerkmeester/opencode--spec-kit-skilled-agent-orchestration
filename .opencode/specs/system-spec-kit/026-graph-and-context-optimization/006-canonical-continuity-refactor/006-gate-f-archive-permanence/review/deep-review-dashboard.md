---
title: Deep Review Dashboard
description: Gate F post-remediation validation overview.
---

# Deep Review Dashboard - Gate F Archive Permanence

## 1. STATUS
<!-- MACHINE-OWNED: START -->
- Target: Gate F cleanup-verification validation
- Target Type: files
- Started: 2026-04-12T19:11:09Z
- Session: 1A5D8748-F322-450B-8B70-E8B8D5A0F73E (generation 2, lineage restart)
- Status: ITERATING
- Release Readiness: in-progress
- Iteration: 10 of 30
- Provisional Verdict: CONDITIONAL
- hasAdvisories: false
<!-- MACHINE-OWNED: END -->

## 2. FINDINGS SUMMARY
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active, 0 new this slice, 0 upgrades, 0 resolved
- **P1 (Major):** 1 active, 1 new this slice, 0 upgrades, 0 resolved
- **P2 (Minor):** 0 active, 0 new this slice, 0 upgrades, 0 resolved
- **Dimensions covered:** traceability
- **Convergence score:** 0.46
<!-- MACHINE-OWNED: END -->

## 3. PROGRESS
<!-- MACHINE-OWNED: START -->
| # | Focus | Files | Dimensions | New P0/P1/P2 | Ratio | Status |
|---|-------|-------|------------|---------------|-------|--------|
| 10 | Packet omits the accepted `shared_space_id` compatibility exception | 5 | traceability | 0 / 1 / 0 | 0.50 | complete |
<!-- MACHINE-OWNED: END -->

## 4. COVERAGE
<!-- MACHINE-OWNED: START -->
- Files reviewed: 5 / 5 total
- Dimensions complete: 1 / 4 total
- Core protocols complete: 2 / 2 required in this slice
- Overlay protocols complete: 1 / 2 applicable
<!-- MACHINE-OWNED: END -->

## 5. TREND
<!-- MACHINE-OWNED: START -->
- Severity trend (last 1): P0:0 P1:1 P2:0
- New findings trend (last 1): 1
- Cleanup-contract trend (last 1): fail
<!-- MACHINE-OWNED: END -->

## 6. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Gate F validation slice complete. Extend only if another pass is needed to sweep nearby packet docs that may also have inherited the narrowed `is_archived` wording without recording the shared-space exception.
<!-- MACHINE-OWNED: END -->

## 7. ACTIVE RISKS
<!-- MACHINE-OWNED: START -->
- Gate F now documents only `is_archived` deprecation and archived-tier cleanup, so future reviewers could miss that the original shared-memory finding was resolved by an explicit `shared_space_id` compatibility exception instead of full schema removal.
<!-- MACHINE-OWNED: END -->
