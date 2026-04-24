---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
title: "Verification Checklist: Index Scope and Constitutional Tier Invariants"
description: "Verification log for shared path exclusions, constitutional tier gating, cleanup CLI results, and Level 3 packet validation."
trigger_phrases:
  - "026/011 checklist"
  - "index scope invariants checklist"
  - "constitutional cleanup checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Checklist drafted"
    next_safe_action: "Fill checklist evidence after code, tests, and cleanup complete"
    blockers: []
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Index Scope and Constitutional Tier Invariants

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | HARD BLOCKER | Cannot claim done until complete |
| **P1** | Required | Must complete or be documented as a carryover |
| **P2** | Optional | Can defer with rationale |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` [EVIDENCE: spec.md records REQ-001 through REQ-010 and the live DB baseline]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` [EVIDENCE: plan.md defines the shared-helper, save-guard, cleanup, and verification phases]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: plan.md dependency table lists the MCP server runtime, SQLite toolchain, and Vitest harness]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Shared helper enforces memory exclusions for `z_future`, `external`, and `z_archive`
- [ ] CHK-011 [P0] Shared helper enforces code-graph exclusions for `external` plus existing default excludes
- [ ] CHK-012 [P0] Save-time guard rejects excluded paths and downgrades invalid constitutional tiers
- [ ] CHK-013 [P1] Constitutional README discovery is limited to `.opencode/skill/system-spec-kit/constitutional/README.md`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Unit tests for `shouldIndexForMemory()` and `shouldIndexForCodeGraph()` pass
- [ ] CHK-021 [P0] Integration test proves `z_future` scan candidates are skipped
- [ ] CHK-022 [P0] Integration test proves non-constitutional `importanceTier: constitutional` saves as `important`
- [ ] CHK-023 [P0] Integration test proves `/constitutional/` saves preserve the constitutional tier
- [ ] CHK-024 [P1] `npm run typecheck` exits `0`
- [ ] CHK-025 [P1] `npm run build` exits `0`
- [ ] CHK-026 [P1] Focused Vitest command exits `0`
- [ ] CHK-027 [P1] `npm run test:core` outcome recorded honestly, including carryover failures if any
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Cleanup CLI runs all mutations inside a single transaction
- [ ] CHK-031 [P0] Cleanup CLI is idempotent across repeat runs
- [ ] CHK-032 [P1] Duplicate `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md` handling keeps the newer row and rewrites references safely
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `research/research.md` contains exact file:line references for every investigated code point
- [ ] CHK-041 [P1] `decision-record.md` records delete-vs-downgrade and README decisions
- [ ] CHK-042 [P1] `implementation-summary.md` includes before/after DB counts and command exit codes
- [ ] CHK-043 [P1] `.opencode/skill/system-spec-kit/mcp_server/README.md` documents the three invariants and helper location
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Packet 011 passes strict validation
- [ ] CHK-051 [P1] Parent 026 metadata references child 011
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 10 | 0/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-04-24
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in `decision-record.md`
- [ ] CHK-101 [P1] Alternatives documented with rejection rationale
- [ ] CHK-102 [P1] Rollback and verify steps documented for cleanup and runtime changes
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Activation note records whether MCP restart is required
- [ ] CHK-121 [P0] Cleanup `--verify` exits `0` after apply
- [ ] CHK-122 [P1] Post-apply constitutional-tier count is recorded
<!-- /ANCHOR:deploy-ready -->
