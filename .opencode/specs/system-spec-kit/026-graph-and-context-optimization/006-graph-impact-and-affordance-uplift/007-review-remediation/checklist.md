---
title: "Checklist: Review Remediation (010/007)"
description: "Verification items for the 6-theme remediation pass."
importance_tier: "important"
contextType: "implementation"
---
# Checklist: 010/007

<!-- SPECKIT_LEVEL: 2 -->

## P0 — Resolved (no remediation needed)
- [x] LICENSE-quote P0 from review report 001 — RESOLVED via External Project name scrub (no upstream license to quote)

## P1 — All 21 closed before exit
### T-A (MCP wiring)
- [ ] R-007-2 wire-or-internal decision recorded in implementation-summary
- [ ] R-007-14 chosen path synced across 4 code files + 6 docs

### T-B (verification sync)
- [ ] R-007-1 001 status updated post-scrub
- [ ] R-007-5 002 verification evidence captured (real `vitest run`, `tsc --noEmit`, `validate.sh --strict` output)
- [ ] R-007-7 003 verification evidence captured
- [ ] R-007-15 006 DQI + validate evidence captured
- [ ] R-007-19, R-007-20, R-007-21 — checklists updated to remove premature PASS marks

### T-C (API surface)
- [ ] R-007-6 `minConfidence` exposed in MCP tool schema + Zod + allowed-param ledger + extended test
- [ ] R-007-10 `affordances` decision recorded + advisor schemas synced

### T-D (sanitization)
- [ ] R-007-3 diff-parser path canonicalization
- [ ] R-007-4 multi-file hunk boundary fix
- [ ] R-007-8 `conflicts_with` affordance contract
- [ ] R-007-9 broadened prompt-injection denylist (TS + PY)
- [ ] R-007-11 reject incomplete explicit `trustBadges`

### T-E (test rig)
- [ ] R-007-13 trust-badges tests unskipped + passing

### T-F (doc cleanup)
- [ ] R-007-12 memory_search cache invalidation
- [ ] R-007-16 INSTALL_GUIDE Python smoke-test cwd bug
- [ ] R-007-17 tool-count canonicalization
- [ ] R-007-18 FEATURE_CATALOG_IN_SIMPLE_TERMS.md link

## P2 — 12 actionable closed; 10 deferred with explicit Defer-To: notes
### T-D (sanitization P2)
- [ ] R-007-P2-1 phase-runner duplicate output-key rejection
- [ ] R-007-P2-3 edge metadata read-path allowlist
- [ ] R-007-P2-8 shared TS+PY adversarial fixture
- [ ] R-007-P2-10 trust-badge age-label sanitization
- [ ] R-007-P2-11 trust-badge derivation trace flag

### T-F (doc cleanup P2)
- [ ] R-007-P2-2 `runPhases` try/finally error-metric
- [ ] R-007-P2-4 `computeBlastRadius` `limit+1` fix
- [ ] R-007-P2-5 multi-subject seed preservation
- [ ] R-007-P2-6 failure-fallback stable code + log
- [ ] R-007-P2-7 shared relationship-edge mapper
- [ ] R-007-P2-9 affordance debug counters
- [ ] R-007-P2-12 phase-naming alias notes

### Deferred (track in `implementation-summary.md` "Deferred" section)
- [ ] All 10 deferred P2 items have `Deferred to: <packet|never>` annotation

## Phase Hand-off
- [ ] R-007-X1 /spec_kit:deep-review:auto verify pass: P0=0, P1≤2
- [ ] R-007-X2 phase-review-summary.md updated with post-remediation counts
- [ ] R-007-X3 commits pushed to main
- [ ] `validate.sh --strict` passes on this sub-phase
- [ ] `implementation-summary.md` populated with closeout summary

## References
- spec.md §4 (requirements), §5 (verification)
- plan.md §2 (themed batches), §3 (sequencing)
