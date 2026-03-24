# Spec: sk-deep-research Review Mode

## Summary

Add a "review mode" to sk-deep-research that repurposes the iterative loop infrastructure (LEAF dispatch, JSONL state, convergence detection) for automated code quality auditing instead of external knowledge research.

## Problem

Currently, reviewing spec folders, code changes, skills, and their cross-references for release readiness is a manual, single-pass process. There is no iterative, convergence-driven review flow that systematically checks all dimensions (correctness, security, patterns, spec alignment, completeness, cross-reference integrity) across a review target.

## Proposed Solution

A new execution mode for sk-deep-research that:
- Accepts a review target (spec folder, skill, agent, file set)
- Decomposes it into review dimensions (focus areas)
- Dispatches LEAF review agents per iteration (one dimension per pass)
- Uses adapted convergence (no new findings = done)
- Produces a review-report.md with P0/P1/P2 findings, cross-reference results, and remediation priority
- Integrates with existing quality scoring (5-dimension rubric from sk-code--review)

## Scope

- Research phase only (this spec folder)
- 5 parallel research agents investigating architecture, convergence, scope, agent design, and output format
- Feeds into subsequent plan + implementation spec folder

## Out of Scope

- Actual implementation of review mode (separate spec folder)
- Changes to existing sk-deep-research v1.1.0 behavior
- Changes to @review agent

## Success Criteria

- [ ] All 5 research questions answered with evidence
- [ ] research.md synthesized with 10 sections
- [ ] Implementation roadmap is actionable
- [ ] No contradictions between agent proposals
