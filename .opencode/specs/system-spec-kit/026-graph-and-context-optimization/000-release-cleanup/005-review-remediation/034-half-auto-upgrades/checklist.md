---
title: "Checklist: Half-Auto Upgrades"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist | v2.2"
description: "Verification checklist for packet 034 half-auto upgrade remediation."
trigger_phrases:
  - "034-half-auto-upgrades"
  - "half-auto upgrade checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/034-half-auto-upgrades"
    last_updated_at: "2026-04-29T14:15:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Half-auto upgrades complete"
    next_safe_action: "Run packet 035 next"
    blockers: []
    completion_pct: 100
---
# Verification Checklist: Half-Auto Upgrades

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

- [x] CHK-001 [P0] Requirements documented in spec.md. [EVIDENCE: spec.md requirements table]
- [x] CHK-002 [P0] Technical approach defined in plan.md. [EVIDENCE: plan.md architecture and phases]
- [x] CHK-003 [P1] 012 and 013 research reports read. [EVIDENCE: packet scope and baseline findings cited]
- [x] CHK-004 [P1] All target files read before editing. [EVIDENCE: listed source reads completed before patches]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Runtime behavior changes are limited to requested surfaces. [EVIDENCE: Codex fallback, Copilot block header, advisor rebuild only]
- [x] CHK-011 [P0] Feature-flag runtime defaults unchanged. [EVIDENCE: `search-flags.ts` not modified]
- [x] CHK-012 [P1] Copilot current-prompt overclaim removed from scoped docs. [EVIDENCE: NEXT-PROMPT wording in all scoped docs]
- [x] CHK-013 [P1] Codex timeout fallback is machine-visible. [EVIDENCE: stale marker line in `additionalContext`]
- [x] CHK-014 [P1] `advisor_status` remains diagnostic-only. [EVIDENCE: no rebuild call in advisor-status handler]
- [x] CHK-015 [P1] `advisor_rebuild` uses existing schema and dispatcher patterns. [EVIDENCE: handler, tool descriptor, schema, dispatcher registration]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `hooks-codex-freshness.vitest.ts` passes. [EVIDENCE: targeted Vitest run]
- [x] CHK-021 [P0] `advisor-rebuild.vitest.ts` passes. [EVIDENCE: targeted Vitest run]
- [x] CHK-022 [P0] TypeScript build succeeds. [EVIDENCE: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`]
- [x] CHK-023 [P0] Strict validator exits 0. [EVIDENCE: final `validate.sh --strict` run]
- [x] CHK-024 [P1] Legacy runtime parity expectation updated for new Codex marker. [EVIDENCE: test fixture expectation patched]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Codex warning contains no raw prompt text. [EVIDENCE: warning fields are runtime/event/stale/reason/workspaceRoot/durationMs]
- [x] CHK-031 [P0] No secrets copied from user runtime config. [EVIDENCE: docs cite config paths and flags only]
- [x] CHK-032 [P0] No destructive commands used. [EVIDENCE: no reset/checkout/delete commands used]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Copilot docs lead with next-prompt freshness. [EVIDENCE: Copilot README line 14]
- [x] CHK-041 [P1] Codex timeout fallback semantics documented. [EVIDENCE: hook_system lines 86-88]
- [x] CHK-042 [P1] Feature flags table includes required columns. [EVIDENCE: ENV reference line 32]
- [x] CHK-043 [P1] CLAUDE and SKILL reference feature defaults table. [EVIDENCE: CLAUDE automation defaults note; SKILL Feature Flags note]
- [x] CHK-044 [P1] Advisor docs cross-reference status and rebuild. [EVIDENCE: skill-advisor-hook lines 49-52 and 180-185]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Required seven packet files exist. [EVIDENCE: strict validator FILE_EXISTS passed]
- [x] CHK-051 [P1] Packet metadata JSON is valid and scoped to 034. [EVIDENCE: strict validator metadata checks passed]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 14 | 14/14 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-04-29 - half-auto upgrades complete, validator green
<!-- /ANCHOR:summary -->
