---
title: "Implementation Plan: Skill-Advisor Release Remediation"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Four-phase plan for closing skill-advisor release blockers: P1 runtime fixes, recovery/concurrency hardening, documentation and diagnostic cleanup, and pattern consolidation."
trigger_phrases:
  - "003-skill-advisor-fail-open plan"
  - "skill-advisor remediation plan"
  - "advisor unavailable fail-open"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-skill-advisor-fail-open"
    last_updated_at: "2026-04-28T16:13:26Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed four-phase remediation plan"
    next_safe_action: "Keep final validators green"
    completion_pct: 100
---

# Implementation Plan: Skill-Advisor Release Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript, Python |
| **Framework** | MCP server package with Vitest and pytest |
| **Storage** | SQLite skill graph database |
| **Testing** | Vitest, pytest, TypeScript typecheck, package build, spec validator |

### Overview

Three P1s were confirmed in the 008/008 deep review: unavailable recommendation calls could still score, public scan mutation lacked caller authority, and active invariants lacked regression coverage. This plan sequences the remediation into four phases: release-blocking P1 fixes, live-path recovery/concurrency, diagnostic and documentation cleanup, and pattern consolidation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented. Evidence: `spec.md:49`.
- [x] Success criteria measurable. Evidence: `spec.md:153`.
- [x] Dependencies identified. Evidence: `spec.md:163`.

### Definition of Done

- [x] All acceptance criteria met. Evidence: `checklist.md:34`.
- [x] Runtime tests, typecheck, build, and validators pass. Evidence: `implementation-summary.md:151`.
- [x] Docs updated across spec, plan, tasks, checklist, and summary. Evidence: `implementation-summary.md:57`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Boundary hardening over architectural rewrite.

### Key Components

- **Recommendation fail-open boundary**: `advisor_recommend` adds an `unavailableOutput()` branch parallel to `absentOutput()`, before scoring.
- **Authority boundary**: `skill_graph_scan` requires trusted caller context before mutating SQLite or publishing a generation.
- **Live recovery boundary**: `initDb()` checks SQLite integrity and rebuild recovery serializes concurrent attempts.
- **Diagnostic boundary**: shared response envelopes redact filesystem and process paths before returning public errors.
- **Pattern boundary**: lane metadata, compatibility contracts, response envelopes, daemon mutations, and graph DB fixtures use shared helpers.

### Data Flow

MCP metadata builds `callerContext`, dispatcher plumbing forwards it, and skill-graph scan validates trust before mutation. Advisor status freshness flows into recommendation output; unavailable freshness now exits through a fail-open empty response instead of scoring.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Write unavailable fail-open regression before the fix. Evidence: pre-fix vitest exit 1.
- [x] Add `unavailableOutput()` and branch before scoring. Evidence: `advisor-recommend.ts:116`, `advisor-recommend.ts:181`.
- [x] Write scan auth regression before the fix. Evidence: pre-fix vitest exit 1.
- [x] Thread `callerContext` and gate `skill_graph_scan`. Evidence: `context-server.ts:438`, `scan.ts:34`.
- [x] Scaffold corruption, rebuild concurrency, and diagnostic redaction regressions. Evidence: five-regression vitest command exit 0.

### Phase 2: Core Implementation

- [x] Wire SQLite integrity checking into live `initDb()`. Evidence: `skill-graph-db.ts:203`.
- [x] Serialize rebuild recovery through a lease and busy retry. Evidence: `rebuild-from-source.ts:30`, `rebuild-from-source.ts:57`.
- [x] Redact diagnostic envelopes and plugin status output. Evidence: `response-envelope.ts:10`, `spec-kit-skill-advisor.js:575`.
- [x] Update 008/008 docs for path spelling, trusted caller model, strict validation, lane weight, promotion gate traceability, and ADR split. Evidence: 008/008 validator exit 0.
- [x] Consolidate daemon mutations, scorer lanes, compat contracts, response envelopes, and SQLite fixtures. Evidence: focused runtime command exit 0.

### Phase 3: Verification

- [x] Focused 11-file Vitest suite passed. Evidence: 87 tests, exit 0.
- [x] Python compatibility suite passed. Evidence: 4 tests, exit 0.
- [x] Typecheck and build passed. Evidence: `npm run typecheck` exit 0; `npm run build` exit 0.
- [x] Root 008/008 strict validator passed. Evidence: validator exit 0.
- [x] Remediation strict validator passed. Evidence: validator exit 0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | Unavailable fail-open, scan auth, corruption recovery, rebuild concurrency, diagnostic redaction | Vitest |
| Integration | Existing skill graph, plugin, scorer, DB, daemon foundation paths | Vitest |
| Compatibility | Python CLI fallback contract | pytest |
| Static | TypeScript project consistency | `npm run typecheck`, `npm run build` |
| Documentation | 008/008 root and remediation packet strict checks | Spec validator |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 008/008 deep-review report | Internal | Green | Source findings and evidence would be unavailable. |
| `runWithBusyRetry` helper | Internal | Green | Rebuild and daemon mutation retry boundaries would duplicate logic. |
| `callerContext` metadata | Internal | Green | Scan authority gate could not distinguish trusted operator calls. |
| Existing scoring tests | Internal | Green | Lane registry migration could drift scoring behavior. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any focused regression, typecheck, build, or strict validator fails after two fix attempts.
- **Procedure**: Revert the smallest failing sub-track: recommendation fail-open, scan auth plumbing, recovery/concurrency, diagnostics, docs, or pattern consolidation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 P1 tests/fixes -> Phase 2 recovery/concurrency -> Phase 3 docs/diagnostics -> Phase 4 consolidation -> Final validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | Source review and packet spec | All later phases |
| Phase 2 | Phase 1 regression scaffolds | Final regression suite |
| Phase 3 | Phase 1 authority model and Phase 2 diagnostic paths | Strict docs validation |
| Phase 4 | Stable runtime behavior from Phases 1-3 | Typecheck/build and focused suites |
| Final | Phases 1-4 | Release claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| P1 closures | High | 3-5 hours |
| Recovery and concurrency | Medium | 2-4 hours |
| Docs and diagnostics | Medium | 2-3 hours |
| Pattern consolidation | High | 4-6 hours |
| Final validation | Medium | 1-2 hours |
| **Total** | | **12-20 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Runtime regressions pass.
- [x] Static checks pass.
- [x] Spec validators pass.

### Rollback Procedure

1. Identify the failing sub-track from the focused regression or validator output.
2. Revert only the files for that sub-track.
3. Re-run the focused command that exposed the failure.
4. Re-run typecheck, build, and strict validators before release.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Remove runtime code changes; generated SQLite databases are test/runtime artifacts and are not part of this packet.
<!-- /ANCHOR:enhanced-rollback -->
