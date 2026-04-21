---
title: "Verification Checklist: Smart-Router Remediation + OpenCode Plugin"
description: "Level 2 verification checklist for Phase 023 smart-router remediation, telemetry, OpenCode plugin delivery, and regression checks."
trigger_phrases:
  - "023 smart router checklist"
  - "spec-kit-skill-advisor plugin verification"
importance_tier: "important"
contextType: "verification"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin"
    last_updated_at: "2026-04-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed Phase 023 verification checklist"
    next_safe_action: "Hand off plugin rollout and observe-only telemetry measurement"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/tasks.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Smart-Router Remediation + OpenCode Plugin

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`. [EVIDENCE: Phase 023 spec read before coding]
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. [EVIDENCE: plan scaffold created for Areas A-F]
- [x] CHK-003 [P1] Dependencies identified and available. [EVIDENCE: Phase 020 producer/renderer/metrics and plugin pattern files were read]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Static smart-router checker exits 0 for missing route paths. [EVIDENCE: `check-smart-router.sh` exit 0; `--json` returned empty `errors`.]
- [x] CHK-011 [P0] TypeScript compile check is clean. [EVIDENCE: `cd .opencode/skill/system-spec-kit && npm run typecheck` exit 0.]
- [x] CHK-012 [P1] Plugin and bridge fail open without exposing prompts or secrets. [EVIDENCE: plugin tests cover env/config opt-out, bridge timeout, bridge error, and prompt-safe status fields.]
- [x] CHK-013 [P1] Code follows existing OpenCode plugin and system-spec-kit script patterns. [EVIDENCE: plugin mirrors compact-code-graph default-export plus bridge shape; checker and telemetry live under existing `scripts/` areas.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Area A-F acceptance criteria met. [EVIDENCE: Areas A-F implemented and recorded in `implementation-summary.md`.]
- [x] CHK-021 [P0] Phase 020 advisor/hook regression tests pass. [EVIDENCE: 19 files / 118 tests passed.]
- [x] CHK-022 [P1] Telemetry compliance tests pass. [EVIDENCE: `mcp_server/tests/smart-router-telemetry.vitest.ts` passed in 2-file 023 run.]
- [x] CHK-023 [P1] Skill-advisor plugin tests pass. [EVIDENCE: `mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts` passed in 2-file 023 run.]
- [x] CHK-024 [P1] ON_DEMAND corpus hit rate reaches at least 15%. [EVIDENCE: 48.0% after tuning, up from 5.5%.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets added. [EVIDENCE: changes add paths, keywords, tests, plugin settings, and telemetry fields only; no credentials or tokens added.]
- [x] CHK-031 [P0] Plugin status output remains prompt-safe. [EVIDENCE: status test asserts no raw prompt and exposes only counts/settings/status metadata.]
- [x] CHK-032 [P1] Telemetry records actual reads supplied by callers without enforcing or capturing raw prompts. [EVIDENCE: telemetry schema stores promptId, selectedSkill, route/resource arrays, class, timestamp; no prompt text field.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, and implementation summary synchronized. [EVIDENCE: final strict validation passed with errors=0.]
- [x] CHK-041 [P1] Keyword rationale documented in `implementation-summary.md`. [EVIDENCE: Area B rationale by skill family recorded.]
- [x] CHK-042 [P2] Follow-up runtime enforcement and rollout notes captured. [EVIDENCE: limitations/next steps identify plugin rollout and observe-only telemetry measurement before enforcement.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary files are limited to `scratch/` or system temp locations. [EVIDENCE: packet notes are under `scratch/`; tests use OS temp directories.]
- [x] CHK-051 [P1] Telemetry JSONL directory is ignored by git. [EVIDENCE: `.gitignore` includes `.opencode/skill/.smart-router-telemetry/`.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-04-19
<!-- /ANCHOR:summary -->
