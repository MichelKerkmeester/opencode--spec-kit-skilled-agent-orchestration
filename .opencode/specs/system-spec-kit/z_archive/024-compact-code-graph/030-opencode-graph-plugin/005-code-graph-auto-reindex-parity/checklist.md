---
title: "Verifica [system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/005-code-graph-auto-reindex-parity/checklist]"
description: "Verification Date: 2026-04-04"
trigger_phrases:
  - "phase 5 checklist"
  - "auto reindex parity verification"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/005-code-graph-auto-reindex-parity"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["checklist.md"]
---
# Verification Checklist: Code Graph Auto-Reindex Parity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim phase completion until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` [EVIDENCE: Phase 5 spec sections 2-12 define the runtime parity goal and safety boundary]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` [EVIDENCE: Phase 5 plan records bounded inline refresh, runtime wiring, and verification]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: plan cites `ensure-ready.ts`, structural handlers, tests, and parent packet docs]
- [x] CHK-004 [P1] Required Level 3 files exist [EVIDENCE: spec, plan, tasks, checklist, ADR, and implementation summary all exist]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Inline refresh stays bounded to safe stale conditions [EVIDENCE: `ensure-ready.ts` now performs inline selective reindex only for small stale sets, including safe post-commit HEAD drift when tracked-file drift is still small, and keeps existing timeout/debounce protections]
- [x] CHK-011 [P0] Large stale states still avoid inline full rescans [EVIDENCE: structural handlers call `ensureCodeGraphReady(..., { allowInlineIndex: true, allowInlineFullScan: false })`, which returns stale guidance instead of inline full scan]
- [x] CHK-012 [P1] Query and context paths use the same bounded policy [EVIDENCE: both `handlers/code-graph/query.ts` and `handlers/code-graph/context.ts` use the same readiness options and return the same readiness metadata shape]
- [x] CHK-013 [P1] Phase docs keep CocoIndex parity wording truthful [EVIDENCE: spec and plan say “mimic” or “parity,” not exact same implementation]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `ensure-ready` tests cover fresh, inline-selective, post-commit selective recovery, and stale-refusal paths [EVIDENCE: `tests/ensure-ready.vitest.ts` now covers inline selective reindex, small HEAD-drift recovery, and inline full-scan refusal]
- [x] CHK-021 [P0] Structural handler tests prove safe inline behavior [EVIDENCE: `tests/code-graph-query-handler.vitest.ts` and `tests/code-graph-context-handler.vitest.ts` verify bounded handler readiness behavior]
- [x] CHK-022 [P1] `npx tsc --noEmit` passes after runtime changes [EVIDENCE: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`]
- [x] CHK-023 [P1] Strict packet validation passes after parent truth-sync [EVIDENCE: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin --recursive --strict`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Workspace and path safety remain unchanged [EVIDENCE: Phase 5 only changes bounded readiness policy; rootDir-relative globs, timeout, debounce, and workspace-bounded behavior remain intact]
- [x] CHK-031 [P0] Scope boundaries remain explicit [EVIDENCE: out-of-scope section keeps broader graph/model redesign out]
- [x] CHK-032 [P1] CocoIndex and code graph remain separate systems [EVIDENCE: phase docs position this as behavior parity, not backend merger]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Phase Level 3 docs are present and synchronized [EVIDENCE: spec, plan, tasks, checklist, ADR, and summary now align to the same delivered bounded scope]
- [x] CHK-041 [P1] Parent packet docs reflect Phase 5 delivery accurately [EVIDENCE: parent packet docs now record Phase 5 as implemented and verified]
- [x] CHK-042 [P1] Implementation summary is updated after runtime delivery lands [EVIDENCE: this phase summary now records runtime files, tests, and validation evidence]
- [x] CHK-043 [P2] Follow-on scope remains explicit [EVIDENCE: the phase and parent packet keep phases 001-004 separate from this work]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] New phase stays inside packet 030 [EVIDENCE: phase folder is nested under `030-opencode-graph-plugin/005-code-graph-auto-reindex-parity`]
- [x] CHK-051 [P1] Parent-child linkage is explicit [EVIDENCE: phase context and cross-references point back to packet 030]
- [x] CHK-052 [P2] Packet validation remains clean after truth-sync [EVIDENCE: strict recursive packet validation passes cleanly after the Phase 5 doc sync]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 10 | 10/10 |
| P2 Items | 3 | 1/3 |

**Verification Date**: 2026-04-04
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md` [EVIDENCE: ADR-001 proposes reuse of the existing freshness engine]
- [x] CHK-101 [P1] ADR status recorded [EVIDENCE: ADR metadata declares Proposed status]
- [x] CHK-102 [P1] Alternatives documented with rationale [EVIDENCE: ADR alternatives table records the rejected options]
- [x] CHK-103 [P2] Migration path documented where relevant [EVIDENCE: plan rollback and enhanced rollback sections document how to restore stale-report-only read-path behavior]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Inline refresh latency remains bounded [EVIDENCE: the existing 10s timeout and 5s debounce remain intact, and full scans stay disabled on read paths]
- [x] CHK-111 [P1] Fresh graph reads remain cheap [EVIDENCE: fresh graphs still return `action: none` with no indexing work performed]
- [x] CHK-112 [P2] Load-testing scope documented accurately [EVIDENCE: this bounded runtime phase verified selective inline refresh behavior without introducing a separate load-testing campaign]
- [x] CHK-113 [P2] Benchmark scope documented accurately [EVIDENCE: the phase records bounded latency and readiness behavior without overstating dedicated benchmark coverage]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented [EVIDENCE: plan rollback section present]
- [x] CHK-121 [P0] Validation gates are documented before implementation begins [EVIDENCE: plan and tasks record typecheck, vitest, and strict validation gates]
- [x] CHK-122 [P1] Readiness signal exists [EVIDENCE: `code_graph_query` and `code_graph_context` now return a `readiness` block showing freshness, action, inlineIndexPerformed, and reason]
- [x] CHK-123 [P1] Runbook applicability documented accurately [EVIDENCE: the phase intentionally reuses existing packet/runtime docs instead of claiming a separate runbook]
- [x] CHK-124 [P2] Deployment runbook requirement marked not applicable [EVIDENCE: this bounded runtime pass did not introduce a separate deployment surface]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] AI Execution Protocol documented [EVIDENCE: plan and tasks include pre-task, execution, status, and blocked-task guidance]
- [x] CHK-131 [P1] Dependency references remain explicit [EVIDENCE: spec and plan cite the actual runtime and packet prerequisites]
- [x] CHK-132 [P2] Security-review scope documented accurately [EVIDENCE: the phase records safety boundaries for inline refresh behavior without claiming a broader security review surface]
- [x] CHK-133 [P2] Data-handling boundaries remain explicit [EVIDENCE: spec and ADR keep scope and safety boundaries explicit]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All phase docs synchronized [EVIDENCE: spec, plan, tasks, checklist, ADR, and summary align to the delivered Phase 5 scope]
- [x] CHK-141 [P1] Parent linkage documented [EVIDENCE: phase context and cross-references point to packet 030]
- [x] CHK-142 [P2] User-facing documentation scope documented accurately [EVIDENCE: the phase records runtime-facing contract changes within packet/server docs and does not claim extra user-doc rollout]
- [x] CHK-143 [P2] Knowledge transfer captured [EVIDENCE: the phase packet now records the implementation target and safety boundaries]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Packet Maintainer | Technical Lead | Pending | |
| Requester | Product Owner | Pending | |
| Spec Validator | QA Lead | Pending | |
<!-- /ANCHOR:sign-off -->
