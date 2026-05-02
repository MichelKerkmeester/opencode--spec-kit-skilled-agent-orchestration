---
title: "Tasks: Skill-Advisor Release Remediation"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task list driving 3 P1 closures + 15 P2 advisories from the 008/008 deep review."
trigger_phrases:
  - "003-skill-advisor-fail-open tasks"
  - "skill-advisor remediation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-skill-advisor-fail-open"
    last_updated_at: "2026-04-28T15:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Completed remediation task list"
    next_safe_action: "Keep final validators green"
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Skill-Advisor Release Remediation

<!-- ANCHOR:notation -->
## Task Notation

Tasks are grouped by plan phase. Each lists `REQ | Status | Exit gate`. P1 tasks (Phase 1) are release-blocking.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T1** [REQ-001] Add `unavailableOutput()` in `mcp_server/skill_advisor/handlers/advisor-recommend.ts` mirroring `absentOutput()`. Branch on `freshness === 'unavailable'` before the `'absent'` check. Exit: helper compiles; no scorer call in branch. Evidence: `advisor-recommend.ts:116`, `advisor-recommend.ts:181`; `advisor-recommend-unavailable.vitest.ts` exit 0.
- [x] **T2** [REQ-003] Author `mcp_server/skill_advisor/tests/handlers/advisor-recommend-unavailable.vitest.ts`. Run BEFORE T1 to confirm initial failure. Exit: test fails against unfixed code; passes after T1. Evidence: pre-fix vitest exit 1, post-fix vitest exit 0.
- [x] **T3** [REQ-002] Author `mcp_server/skill_advisor/lib/auth/trusted-caller.ts` with `requireTrustedCaller()` helper. Exit: helper exists; unit test confirms accept/reject. Evidence: `trusted-caller.ts:20`, `skill-graph-scan-auth.vitest.ts:57`.
- [x] **T4** [REQ-002] Thread `callerContext` from `context-server.ts:1010` through `mcp_server/tools/index.ts:107` `dispatcher.handleTool()`. Exit: dispatcher receives caller context. Evidence: `context-server.ts:438`, `tools/index.ts:104`, `tools/skill-graph-tools.ts:59`.
- [x] **T5** [REQ-002] Gate `skill_graph_scan` in `mcp_server/handlers/skill-graph/scan.ts` on `callerContext.trusted`. Exit: untrusted call returns typed rejection; trusted call proceeds. Evidence: `scan.ts:34`, `scan.ts:36`, `skill-graph-scan-auth.vitest.ts:74`.
- [x] **T6** [REQ-003] Author `mcp_server/tests/handlers/skill-graph-scan-auth.vitest.ts` covering trusted/untrusted paths. Exit: both paths assert correct behavior; test fails before T5, passes after. Evidence: pre-fix vitest exit 1, post-fix vitest exit 0.
- [x] **T7** [REQ-003] Author scaffolds for the 3 remaining regression tests:
   - `mcp_server/tests/skill-graph-corruption-recovery.vitest.ts` (Phase 2 wire-up)
   - `mcp_server/stress_test/skill-advisor/skill-graph-rebuild-concurrency.vitest.ts` (Phase 2)
   - `mcp_server/tests/skill-graph-diagnostic-redaction.vitest.ts` (Phase 3)
   Exit: scaffolds in place asserting current (broken) behavior so Phase 2/3 fixes flip them green. Evidence: `skill-graph-corruption-recovery.vitest.ts:17`, `skill-graph-rebuild-concurrency.vitest.ts:13`, `skill-graph-diagnostic-redaction.vitest.ts:29`; pre-fix vitest exit 1, final exit 0.
- [x] **T8** [REQ-001, REQ-002, REQ-003] Run focused vitest set: `npx vitest run mcp_server/tests/handlers/advisor-recommend-unavailable.vitest.ts mcp_server/tests/handlers/skill-graph-scan-auth.vitest.ts`. Exit: both green. Evidence: `npx vitest run tests/handlers/skill-graph-scan-auth.vitest.ts skill_advisor/tests/handlers/advisor-recommend-unavailable.vitest.ts` exit 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T9** [REQ-007] Wire `checkSqliteIntegrity()` into `mcp_server/lib/skill-graph/skill-graph-db.ts:181` `initDb()` via `PRAGMA quick_check`. On corruption, invoke recovery. Exit: T7 corruption-recovery test passes. Evidence: `skill-graph-db.ts:203`; `skill-graph-corruption-recovery.vitest.ts` exit 0.
- [x] **T10** [REQ-008] Wrap `mcp_server/skill_advisor/lib/freshness/rebuild-from-source.ts:61` integrity-check + rename + rebuild in `runWithBusyRetry()` or generation lease. Exit: T7 rebuild-concurrency test passes; concurrent attempts serialize. Evidence: `rebuild-from-source.ts:30`, `rebuild-from-source.ts:57`; `skill-graph-rebuild-concurrency.vitest.ts` exit 0.
- [x] **T11** [REQ-007, REQ-008] Re-run Phase 1 + Phase 2 regressions. Exit: 4 of 5 regression files green (diagnostic redaction still pending Phase 3). Evidence: final 5-regression vitest command exit 0.

### Doc / ADR / Diagnostic Batch

- [x] **T12** [REQ-005] Resolve hyphen-vs-underscore path drift: pick `skill_advisor` (underscore); update 008/008 spec, decision record, and implementation summary. Exit: zero remaining `skill-advisor` (hyphen) runtime path references. Evidence: `spec.md:91`, `implementation-summary.md:44`; targeted `rg "mcp_server/skill-advisor"` on root docs has no matches.
- [x] **T13** [REQ-004] Add file:line anchors to every `[x]` CHK item in 008/008 checklist. Exit: spot-check 5 items resolves to actual lines. Evidence: `checklist.md:43`, `checklist.md:53`, `checklist.md:75`, `checklist.md:85`, `checklist.md:95`.
- [x] **T14** [REQ-009] Sanitize diagnostic envelopes in `scan.ts:30-37`, `advisor-status.ts:151-172`, `generation.ts:87-88`, plugin status tool. Replace absolute paths with relative or symbolic forms. Exit: T7 diagnostic-redaction test passes. Evidence: `response-envelope.ts:10`, `scan.ts:45`, `advisor-status.ts:153`, `generation.ts:84`, `spec-kit-skill-advisor.js:575`; redaction vitest exit 0.
- [x] **T15** [REQ-010] Document trusted-caller model in 008/008 spec. Add untrusted-scan negative scenario in the operator playbook. Exit: model is explicit; playbook covers negative case. Evidence: `spec.md:119`, `spec.md:170`, `003-unavailable-daemon.md:55`.
- [x] **T16** [REQ-011] Lane weight reconciliation: runtime ships 0.15 (`weights-config.ts:11`); update doc references from 0.10 to 0.15 in the decision record, implementation summary, and feature catalog. Exit: zero divergent references. Evidence: `lane-registry.ts:9`, `implementation-summary.md:121`, `01-five-lane-fusion.md:38`, `06-weights-config.md:31`.
- [x] **T17** [REQ-012] Promotion-gate artifact: rewrite the 008/008 implementation-summary line 129 reference around real `advisor_validate` slices. Exit: reference resolves. Evidence: `implementation-summary.md:129`, `decision-record.md:158`.
- [x] **T18** [REQ-018] Split the 008/008 decision record: keep ADR-001 umbrella + add ADR-002..ADR-007 child ADRs for freshness, schema, scorer, MCP authority, compat, promotion gates. Exit: 7 ADRs total with rationale per sub-track. Evidence: `decision-record.md:27`, `decision-record.md:65`, `decision-record.md:82`, `decision-record.md:99`, `decision-record.md:116`, `decision-record.md:133`, `decision-record.md:150`.
- [x] **T19** [REQ-006] Strict validation: run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification --strict`. Exit: exit 0 OR keep as explicit operator gate with rationale. Evidence: command exit 0.
### Pattern Consolidation

- [x] **T20** [REQ-013] Extract `mcp_server/skill_advisor/lib/daemon/state-mutation.ts` with shared busy retry. Migrate quarantine writes (`watcher.ts:239`) and other ad-hoc DB writes to use it. Exit: zero direct DB writes that bypass retry boundary. Evidence: `state-mutation.ts:17`, `watcher.ts:237`, `watcher.ts:252`, `watcher.ts:263`; daemon foundation vitest exit 0.
- [x] **T21** [REQ-014] Author `mcp_server/skill_advisor/lib/scorer/lane-registry.ts` with typed lane descriptors. Migrate `types.ts:7`, `weights-config.ts`, `lanes/*.ts`, fusion logic, schema. Exit: adding a new lane requires only registry edit. Evidence: `lane-registry.ts:5`, `types.ts:6`, `weights-config.ts:7`, `fusion.ts:55`, `advisor-tool-schemas.ts:6`; typecheck exit 0.
- [x] **T22** [REQ-015] Author `mcp_server/skill_advisor/lib/compat/contract.ts`. Generate JSON sidecar consumed by Python `skill_advisor.py` and plugin bridge OR add fixture-driven contract tests. Exit: TS / Python / plugin envelopes verifiably aligned. Evidence: `contract.ts:5`, `compat-contract.json:1`, `skill_advisor.py:178`, `spec-kit-skill-advisor-bridge.mjs:7`; pytest exit 0.
- [x] **T23** [REQ-016] Author `mcp_server/handlers/skill-graph/response-envelope.ts` with shared `SkillGraphResponse` schema + `okResponse()` / `errorResponse()` helpers. Migrate `scan.ts:65`, `query.ts`, `status.ts`. Exit: zero ad-hoc envelope construction in skill-graph handlers. Evidence: `response-envelope.ts:34`, `scan.ts:12`, `query.ts:9`, `status.ts:11`; skill-graph handler/schema vitest exit 0.
- [x] **T24** [REQ-017] Author `mcp_server/tests/fixtures/skill-graph-db.ts`. Migrate `skill-graph-handlers.vitest.ts:11` and any other duplicate `writeGraphMetadata()` callers. Exit: shared fixture used; duplicates removed. Evidence: `fixtures/skill-graph-db.ts:8`, `skill-graph-handlers.vitest.ts:9`, `skill-graph-db.vitest.ts:10`; fixture-focused vitest exit 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T25** Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-skill-advisor-fail-open --strict`. Exit: exit 0. Evidence: final validator exit 0.
- [x] **T26** Author implementation summary with disposition for each of the 18 source findings. Exit: every F-* / DR-008-* finding has a closed/closed-by-deferral note. Evidence: implementation summary disposition table.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual and automated verification passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-references

- Source review report: specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/review/008-skill-graph-daemon-and-advisor-unification-pt-01/review-report
- Specification: local spec document
- Plan: local plan document
- Checklist: local checklist document
<!-- /ANCHOR:cross-refs -->
