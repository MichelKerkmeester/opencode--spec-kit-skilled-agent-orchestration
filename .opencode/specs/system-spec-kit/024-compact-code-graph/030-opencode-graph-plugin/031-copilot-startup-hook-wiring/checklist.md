---
title: "Verificatio [system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/031-copilot-startup-hook-wiring/checklist]"
description: "Verification Date: 2026-04-04"
trigger_phrases:
  - "phase 031 checklist"
  - "copilot startup hook verification"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/031-copilot-startup-hook-wiring"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["checklist.md"]
---
# Verification Checklist: Copilot Startup Hook Wiring

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim phase closeout until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` [EVIDENCE: Phase 031 spec sections 2-12 define the live Copilot wiring gap, dynamic detection, and packet truth-sync scope]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` [EVIDENCE: Phase 031 plan records the wrapper-based repair, dynamic detection, and validation gates]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: existing hook binary, repo hook config, tests, and validator are all documented in `plan.md`]
- [x] CHK-004 [P1] All required Level 3 phase files exist [EVIDENCE: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` all exist]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Copilot `sessionStart` now routes through a repo-local wrapper [EVIDENCE: `.github/hooks/superset-notify.json` now points `sessionStart` at `.github/hooks/scripts/session-start.sh`]
- [x] CHK-011 [P0] Shared startup banner content remains reused [EVIDENCE: `session-start.sh` delegates to `dist/hooks/copilot/session-prime.js` and emits the shared startup banner with the snapshot note]
- [x] CHK-012 [P1] Superset fan-out remains best-effort and non-banner-safe [EVIDENCE: `.github/hooks/scripts/superset-notify.sh` returns `{}` and silently forwards to `${SUPERSET_COPILOT_HOOK:-$HOME/.superset/hooks/copilot-hook.sh}` when present]
- [x] CHK-013 [P1] Copilot hook policy is now dynamic and truthful [EVIDENCE: `runtime-detection.ts` checks `.github/hooks/*.json` for `sessionStart` before returning `enabled`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Copilot hook wiring tests pass [EVIDENCE: `cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/copilot-hook-wiring.vitest.ts`]
- [x] CHK-021 [P0] Runtime detection and cross-runtime fallback tests pass [EVIDENCE: `cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/runtime-detection.vitest.ts tests/cross-runtime-fallback.vitest.ts`]
- [x] CHK-022 [P1] Typecheck passes after runtime changes [EVIDENCE: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`]
- [x] CHK-023 [P1] Hook config JSON validates and wrapper smoke runs pass [EVIDENCE: `jq empty .github/hooks/superset-notify.json`; `./.github/hooks/scripts/session-start.sh`; `./.github/hooks/scripts/superset-notify.sh sessionEnd`]
- [x] CHK-024 [P1] Strict packet validation passes after truth-sync [EVIDENCE: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin --recursive --strict`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials were added [EVIDENCE: wrappers only reference public repo paths and optional `${HOME}`-based Superset helper lookup]
- [x] CHK-031 [P0] Scope boundaries remain explicit [EVIDENCE: Phase 031 only changes Copilot hook wiring, runtime detection, tests, and related docs]
- [x] CHK-032 [P1] Optional external notifier failures remain non-fatal [EVIDENCE: wrapper scripts ignore Superset notifier failures and still produce valid output]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Phase 031 Level 3 docs are present and synchronized [EVIDENCE: spec, plan, tasks, checklist, ADR, and summary all align to the same delivered scope]
- [x] CHK-041 [P1] Parent packet docs reflect Phase 031 accurately [EVIDENCE: parent packet now records six completed phases and the Copilot wiring repair]
- [x] CHK-042 [P1] Phase 004 stale Copilot wording is corrected [EVIDENCE: Phase 004 docs no longer claim `.github/hooks/superset-notify.json` is local/untracked]
- [x] CHK-043 [P2] Related runtime-detection docs are updated [EVIDENCE: playbook 252/253 and feature catalog 05/06 now describe dynamic Copilot detection]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] New phase stays inside packet 030 [EVIDENCE: phase folder is nested under `030-opencode-graph-plugin/031-copilot-startup-hook-wiring`]
- [x] CHK-051 [P1] Repo hook scripts are grouped under `.github/hooks/scripts/` [EVIDENCE: startup and Superset notifier wrappers live under the existing hook root]
- [x] CHK-052 [P2] Parent-child linkage is explicit [EVIDENCE: parent phase map and child phase context both point to Phase 031]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 10 | 10/10 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-04-04
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md` [EVIDENCE: ADR-001 records the wrapper-first decision]
- [x] CHK-101 [P1] ADR status recorded [EVIDENCE: ADR metadata declares Accepted status]
- [x] CHK-102 [P1] Alternatives documented with rationale [EVIDENCE: ADR alternatives table records the rejected options]
- [x] CHK-103 [P2] Rollback path documented where relevant [EVIDENCE: plan rollback sections document how to restore the old hook wiring]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Startup wrapper remains bounded by the existing timeout [EVIDENCE: `sessionStart` stays under the 5-second hook timeout in smoke runs]
- [x] CHK-111 [P1] Non-startup hook wrapper remains cheap and JSON-safe [EVIDENCE: `superset-notify.sh sessionEnd` returns `{}` immediately]
- [x] CHK-112 [P2] Load-testing scope documented accurately [EVIDENCE: this bounded hook/config phase verified startup smoke behavior without introducing a separate load-testing campaign]
- [x] CHK-113 [P2] Benchmark scope documented accurately [EVIDENCE: the phase records timeout-bounded smoke evidence without overstating dedicated benchmark coverage]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented [EVIDENCE: plan rollback section present]
- [x] CHK-121 [P0] Validation gates are documented before implementation begins [EVIDENCE: plan and tasks record vitest, shell, JSON, and packet validation gates]
- [x] CHK-122 [P1] Readiness signal exists [EVIDENCE: targeted tests plus smoke runs prove the hook wiring and runtime-detection behavior]
- [x] CHK-123 [P1] Runbook applicability documented accurately [EVIDENCE: the phase intentionally reused existing packet/runtime docs instead of claiming a separate runbook]
- [x] CHK-124 [P2] Deployment runbook requirement marked not applicable [EVIDENCE: this bounded runtime/config pass did not introduce a separate deployment surface]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] AI Execution Protocol documented [EVIDENCE: plan and tasks include pre-task, execution, status, and blocked-task guidance]
- [x] CHK-131 [P1] Dependency references remain explicit [EVIDENCE: spec and plan cite the hook binary, repo config, tests, and validator]
- [x] CHK-132 [P2] Security-review scope documented accurately [EVIDENCE: the phase records bounded hook/config changes without claiming a broader security review surface]
- [x] CHK-133 [P2] Data-handling boundaries remain explicit [EVIDENCE: spec and ADR keep Superset optional and keep broader rollout outside this packet]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All phase docs synchronized [EVIDENCE: spec, plan, tasks, checklist, ADR, and summary align to the delivered Phase 031 scope]
- [x] CHK-141 [P1] Parent linkage documented [EVIDENCE: phase context and cross-references point to packet 030]
- [x] CHK-142 [P2] User-facing runtime docs updated where relevant [EVIDENCE: runtime-detection playbook and feature catalog now describe dynamic Copilot detection]
- [x] CHK-143 [P2] Knowledge transfer captured [EVIDENCE: the phase packet records the live report, repair shape, and runtime verification gates]
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
