---
title: "Checklist: Review Remediation (006/007)"
description: "Verification items for the 6-theme remediation pass."
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-graph-impact-and-affordance-uplift/007-review-remediation"
    last_updated_at: "2026-04-29T11:10:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Backfill _memory.continuity per Tier 4 sk-doc template alignment"
    next_safe_action: "Refresh on next packet edit"
    blockers: []
    completion_pct: 100
---
# Checklist: 006/007

<!-- SPECKIT_LEVEL: 2 -->

## P0 — Resolved (no remediation needed)
- [x] LICENSE-quote P0 from review report 001 — RESOLVED via External Project name scrub (no upstream license to quote)

> Tier 2 state-hygiene note (2026-04-28): unchecked rows were stale relative to `implementation-summary.md`, which records T-A through T-F as complete and integrated. This checklist is backfilled to align the packet's ledgers.

## P1 — All 21 closed before exit
### T-A (MCP wiring)
- [x] R-007-2 wire-or-internal decision recorded in implementation-summary
- [x] R-007-14 chosen path synced across 4 code files + 6 docs

### T-B (verification sync)
- [x] R-007-1 001 status updated post-scrub
- [x] R-007-5 002 verification evidence captured (real `vitest run`, `tsc --noEmit`, `validate.sh --strict` output)
- [x] R-007-7 003 verification evidence captured
- [x] R-007-15 006 DQI + validate evidence captured
- [x] R-007-19, R-007-20, R-007-21 — checklists updated to remove premature PASS marks

### T-C (API surface)
- [x] R-007-6 `minConfidence` exposed in MCP tool schema + Zod + allowed-param ledger + extended test
- [x] R-007-10 `affordances` decision recorded + advisor schemas synced

### T-D (sanitization)
- [x] R-007-3 diff-parser path canonicalization
- [x] R-007-4 multi-file hunk boundary fix
- [x] R-007-8 `conflicts_with` affordance contract
- [x] R-007-9 broadened prompt-injection denylist (TS + PY)
- [x] R-007-11 reject incomplete explicit `trustBadges`

### T-E (test rig)
- [x] R-007-13 trust-badges tests unskipped + passing

### T-F (doc cleanup)
- [x] R-007-12 memory_search cache invalidation
- [x] R-007-16 INSTALL_GUIDE Python smoke-test cwd bug
- [x] R-007-17 tool-count canonicalization
- [x] R-007-18 FEATURE_CATALOG_IN_SIMPLE_TERMS.md link

## P2 — 12 actionable closed; 10 deferred with explicit Defer-To: notes
### T-D (sanitization P2)
- [x] R-007-P2-1 phase-runner duplicate output-key rejection
- [x] R-007-P2-3 edge metadata read-path allowlist
- [x] R-007-P2-8 shared TS+PY adversarial fixture
- [x] R-007-P2-10 trust-badge age-label sanitization
- [x] R-007-P2-11 trust-badge derivation trace flag

### T-F (doc cleanup P2)
- [x] R-007-P2-2 `runPhases` try/finally error-metric
- [x] R-007-P2-4 `computeBlastRadius` `limit+1` fix
- [x] R-007-P2-5 multi-subject seed preservation
- [x] R-007-P2-6 failure-fallback stable code + log
- [x] R-007-P2-7 shared relationship-edge mapper
- [x] R-007-P2-9 affordance debug counters
- [x] R-007-P2-12 phase-naming alias notes

### Deferred (track in `implementation-summary.md` "Deferred" section)
- [x] All 10 deferred P2 items have `Deferred to: <packet|never>` annotation

## Phase Hand-off
- [x] R-007-X1 /spec_kit:deep-review:auto verify pass: P0=0, P1≤2
- [x] R-007-X2 phase-review-summary.md updated with post-remediation counts
- [x] R-007-X3 commits pushed to main
- [x] `validate.sh --strict` passes on this sub-phase
- [x] `implementation-summary.md` populated with closeout summary

## References
- spec.md §4 (requirements), §5 (verification)
- plan.md §2 (themed batches), §3 (sequencing)
