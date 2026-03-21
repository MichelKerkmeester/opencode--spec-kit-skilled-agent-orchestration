# Research: JSON Mode Hybrid Enrichment (Phase 1B) — Archival Design Analysis

**Research Method**: Deep research loop with 3 GPT-5.4 copilot agents per iteration (Code Auditor, Type Analyst, Integration Verifier)
**Iterations**: 3 (converged at iteration 3; max was 6)
**Date**: 2026-03-20
**Spec Folder**: `016-json-mode-hybrid-enrichment`

---

## Executive Summary

This research artifact analyzed the original broader hybrid-enrichment design for phase 016. It assumed file-backed JSON payloads would flow through a dedicated enrichment branch and evaluated the risks of that proposed path.

That is **not** the behavior that shipped in the live tree. The current code keeps file-backed JSON authoritative and supports a narrower structured-summary contract instead. As a result, the detailed findings from the original research should be treated as **archival design input**, not as an active bug list against the shipped phase-016 implementation.

The review remediation applied in this pass addressed the current implementation issues that were still real outside that abandoned branch:

- `runWorkflow()` now enforces the recovery-only policy even for programmatic stateless callers unless `allowRecovery: true` is set explicitly.
- `generate-context.ts` now installs signal handlers only for the direct CLI execution path, preventing repeated-import listener buildup.

---

## Applicability Status

| Area | Current Status | Applicability |
|------|----------------|---------------|
| Proposed file-backed hybrid enrichment branch | Did not ship | Historical only |
| `toolCalls` / `exchanges` structured-summary support | Shipped | Active |
| File-backed JSON authority (`_source: 'file'`) | Shipped | Active |
| Wave 2 count / confidence / outcome hardening | Shipped | Active |
| Recovery-only policy enforcement for stateless capture | Remediated in this pass | Active |
| CLI signal-handler listener leak | Remediated in this pass | Active |

---

## Archived Findings Disposition

The original deep-research questions remain useful only if a future spec revives the abandoned hybrid-enrichment design.

| Historical Question | Disposition |
|---------------------|-------------|
| V8 observation leak paths in file-backed hybrid enrichment | Archive for future design work only; current shipped path does not enter that branch |
| File-description mutation and provenance side effects inside hybrid enrichment | Archive for future design work only |
| Type-safety issues around `session` / `git` access in the proposed contract | Archive for future design work only |
| Nested `session` / `git` validation depth | Archive for future design work only |
| Status/percent reconciliation for explicit nested session metadata | Archive for future design work only |
| Session metadata pipeline wiring for nested `session` / `git` blocks | Archive for future design work only |
| Template wiring gaps for nested git metadata | Archive for future design work only |
| End-to-end test coverage for the abandoned nested metadata contract | Archive for future design work only |

---

## Current Guidance

Use this file as background context only.

- If future work revives full hybrid enrichment for file-backed JSON, start a new spec and reuse the archived analysis selectively.
- Do not cite this file as evidence that phase 016 shipped `enrichFileSourceData()` or nested `session` / `git` contract support.
- For the live phase-016 behavior, treat `spec.md`, `plan.md`, `decision-record.md`, and `implementation-summary.md` as the source of truth.

---

## Research Metadata

| Metric | Value |
|--------|-------|
| Iterations completed | 3 of 6 max |
| Convergence trigger | All 8/8 questions answered (entropy 1.00 >= 0.85) |
| Weighted convergence score | 0.75 > 0.60 threshold |
| newInfoRatio trend | 1.00 → 0.64 → 0.35 |
| Original unique findings | 21 |
| Agent model | GPT-5.4 (high reasoning effort) |
| Agent slots | C1 (Code Auditor), C2 (Type Analyst), C3 (Integration Verifier) |
| Historical analysis target | Proposed hybrid-enrichment branch that did not ship |
