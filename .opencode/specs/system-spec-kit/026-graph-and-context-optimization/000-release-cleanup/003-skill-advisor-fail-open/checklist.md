---
title: "Verification Checklist: Skill-Advisor Release Remediation"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2"
description: "Verification gates for closing 3 P1 blockers and 15 P2 advisories in the skill-advisor remediation packet."
trigger_phrases:
  - "003-skill-advisor-fail-open checklist"
  - "skill-advisor remediation verification"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-skill-advisor-fail-open"
    last_updated_at: "2026-04-28T16:13:26Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed remediation verification checklist"
    next_safe_action: "Keep final validators green"
    completion_pct: 100
---

# Verification Checklist: Skill-Advisor Release Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete or be documented as a carryover |
| **[P2]** | Optional | Can defer with rationale |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] **CHK-001** [P0] Source review report read end-to-end. [EVIDENCE: `review-report.md:28` and `review-report.md:78` active finding registry read before edits]
- [x] **CHK-002** [P0] All 18 source findings (3 P1 + 15 P2) accounted for in REQ-001..REQ-018. [EVIDENCE: `spec.md:108`]
- [x] **CHK-003** [P1] Existing 008/008 focused vitest suite reproduces green before any change. [EVIDENCE: Existing focused suite re-run after boundary updates: 11 files, 87 tests, exit 0]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] **CHK-T01** [P0] `unavailableOutput()` exists in `advisor-recommend.ts` and branches before scoring. [EVIDENCE: `advisor-recommend.ts:116`, `advisor-recommend.ts:181`]
- [x] **CHK-T02** [P0] `tests/handlers/advisor-recommend-unavailable.vitest.ts` failed pre-fix and passes post-fix. [EVIDENCE: pre-fix exit 1, final focused vitest exit 0]
- [x] **CHK-T08** [P1] `checkSqliteIntegrity()` wired into live `initDb()`. [EVIDENCE: `skill-graph-db.ts:203`; corruption recovery vitest exit 0]
- [x] **CHK-T09** [P1] `rebuildFromSource()` runs inside busy-retry / lease boundary. [EVIDENCE: `rebuild-from-source.ts:30`, `rebuild-from-source.ts:57`; rebuild concurrency vitest exit 0]
- [x] **CHK-T16** [P2] Daemon-state mutation helper extracted; consumers migrated. [EVIDENCE: `state-mutation.ts:17`, `watcher.ts:237`, `watcher.ts:252`, `watcher.ts:263`]
- [x] **CHK-T17** [P2] Scorer lane registry replaces hand-maintained lists. [EVIDENCE: `lane-registry.ts:5`, `types.ts:6`, `weights-config.ts:7`, `advisor-tool-schemas.ts:6`]
- [x] **CHK-T18** [P2] Compat contract single-source aligns TS/Python/plugin envelopes. [EVIDENCE: `contract.ts:5`, `compat-contract.json:1`, `skill_advisor.py:178`, `spec-kit-skill-advisor-bridge.mjs:7`]
- [x] **CHK-T19** [P2] Skill-graph response envelope schema + helper consumed by handlers. [EVIDENCE: `response-envelope.ts:34`, `scan.ts:12`, `query.ts:9`, `status.ts:11`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] **CHK-T06** [P0] `tests/handlers/skill-graph-scan-auth.vitest.ts` covers trusted + untrusted paths. [EVIDENCE: pre-fix exit 1, post-fix exit 0]
- [x] **CHK-T07** [P0] All 5 regression vitests written and passing after corresponding fixes. [EVIDENCE: five-regression focused vitest command exit 0]
- [x] **CHK-V02** [P0] Source review report walked through; each of 18 findings marked closed or deferred with disposition. [EVIDENCE: implementation summary disposition table]
- [x] **CHK-V03** [P1] `npm run typecheck` and `npm run build` both exit 0. [EVIDENCE: `npm run typecheck` exit 0; `npm run build` exit 0]
- [x] **CHK-V04** [P1] All 5 regression vitests green. [EVIDENCE: five-regression focused vitest command exit 0]
- [x] **CHK-V05** [P1] Existing focused 008/008 suite still green. [EVIDENCE: 11 focused files, 87 tests, exit 0]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] **CHK-T03** [P0] `requireTrustedCaller()` helper exists with unit tests. [EVIDENCE: `trusted-caller.ts:20`, `skill-graph-scan-auth.vitest.ts:57`]
- [x] **CHK-T04** [P0] `callerContext` threaded through dispatcher to scan handler. [EVIDENCE: `context-server.ts:438`, `tools/index.ts:104`, `tools/skill-graph-tools.ts:59`]
- [x] **CHK-T05** [P0] `skill_graph_scan` rejects untrusted callers with typed envelope; accepts trusted. [EVIDENCE: `scan.ts:34`, `skill-graph-scan-auth.vitest.ts:74`, `skill-graph-scan-auth.vitest.ts:86`]
- [x] **CHK-T10** [P1] Diagnostic envelopes redact filesystem paths. [EVIDENCE: `response-envelope.ts:10`, `scan.ts:45`, `advisor-status.ts:153`, `generation.ts:84`, `spec-kit-skill-advisor.js:575`; redaction vitest exit 0]
- [x] **CHK-T13** [P2] Trusted-caller model documented in spec and playbook. [EVIDENCE: `008/008/spec.md:119`, `008/008/spec.md:170`, `003-unavailable-daemon.md:55`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] **CHK-T11** [P2] Hyphen-vs-underscore drift resolved in 008/008 root docs. [EVIDENCE: `spec.md:91`, `implementation-summary.md:44`; targeted drift rg returned no runtime-path matches]
- [x] **CHK-T12** [P2] Checklist evidence has file:line anchors. [EVIDENCE: `008/008/checklist.md:43`, `008/008/checklist.md:53`, `008/008/checklist.md:75`, `008/008/checklist.md:85`, `008/008/checklist.md:95`]
- [x] **CHK-T14** [P2] Lane weight 0.10 vs 0.15 reconciled. [EVIDENCE: `lane-registry.ts:9`, `implementation-summary.md:121`, `01-five-lane-fusion.md:38`, `06-weights-config.md:31`]
- [x] **CHK-T15** [P2] Promotion-gate artifact reference resolves. [EVIDENCE: `implementation-summary.md:129`, `decision-record.md:158`]
- [x] **CHK-T21** [P2] Decision record split into umbrella + 6 child ADRs. [EVIDENCE: `decision-record.md:27`, `decision-record.md:65`, `decision-record.md:82`, `decision-record.md:99`, `decision-record.md:116`, `decision-record.md:133`, `decision-record.md:150`]
- [x] **CHK-V01** [P0] Strict packet validator exits 0 for 008/008 root and this remediation sub-phase. [EVIDENCE: 008/008 validator exit 0; remediation validator exit 0]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] **CHK-T20** [P2] Shared `tests/fixtures/skill-graph-db.ts`; selected tests migrated. [EVIDENCE: `fixtures/skill-graph-db.ts:8`, `skill-graph-handlers.vitest.ts:9`, `skill-graph-db.vitest.ts:10`]
- [x] **CHK-ORG-01** [P1] No temp files were added under the packet root. [EVIDENCE: packet root contains only spec docs and metadata]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 8 | 8/8 |
| P2 Items | 12 | 12/12 |

**Verification Date**: 2026-04-28
<!-- /ANCHOR:summary -->
