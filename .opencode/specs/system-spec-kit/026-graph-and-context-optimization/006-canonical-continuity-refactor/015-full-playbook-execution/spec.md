---
title: "Phase 015 — Full Manual Testing Playbook Execution"
description: "Execute every system-spec-kit manual testing playbook scenario against the post-006 codebase. Capture pass/fail per scenario with evidence."
trigger_phrases:
  - "full playbook execution"
  - "run all scenarios"
  - "manual testing run"
importance_tier: "critical"
contextType: "verification"
level: 2
status: "planned"
parent: "006-canonical-continuity-refactor"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 015 — Full Manual Testing Playbook Execution

## EXECUTIVE SUMMARY

Run every single manual testing playbook scenario in `.opencode/skill/system-spec-kit/manual_testing_playbook/` against the current post-006 codebase. This is the definitive verification that the canonical continuity refactor, shared memory removal, graph-metadata implementation, dead code audit, and all subsequent cleanups haven't broken any operator workflow.

## SCOPE

### In scope
- Execute ALL ~305 scenarios across 22 categories
- For each scenario: run the prompt, execute the commands, verify expected behavior, capture evidence
- Record pass/fail per scenario with reason
- Track UNAUTOMATABLE scenarios with justification
- Run the full automated vitest suite alongside for comparison
- Produce a final execution report

### Out of scope
- Rewriting scenarios (Phase 014 already did this)
- Feature catalog changes
- Code fixes (if failures found, document them for a follow-up phase)

## APPROACH

1. Use the existing `scripts/tests/manual-playbook-runner.ts` from Gate I
2. Update it if needed for the post-006 handler changes
3. Build a fresh deterministic fixture reflecting current schema
4. Run all 22 categories sequentially
5. Run full vitest suite in parallel
6. Produce per-category + overall summary

## ACCEPTANCE BAR

- Manual scenarios: ≥95% PASS + UNAUTOMATABLE (zero FAIL)
- Automated vitest: ≥99% pass rate
- Every FAIL gets a documented reason + triage path
