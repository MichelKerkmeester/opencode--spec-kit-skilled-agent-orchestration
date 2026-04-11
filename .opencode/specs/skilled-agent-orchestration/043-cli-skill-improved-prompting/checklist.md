---
title: "Verification Checklist: CLI Skill Prompt-Quality Integration via Mirror Cards [043]"
description: "Verification Date: pending implementation"
trigger_phrases:
  - "043 checklist"
  - "prompt quality verification"
importance_tier: "important"
contextType: "planning"
---
# Verification Checklist: CLI Skill Prompt-Quality Integration via Mirror Cards

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim packet completion until complete |
| **[P1]** | Required | Must complete or receive user-approved deferral |
| **[P2]** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements are documented in `spec.md`
- [ ] CHK-002 [P0] Technical approach is defined in `plan.md`
- [ ] CHK-003 [P1] Current guard constraints and active runtime directories were inspected from real repo files
- [ ] CHK-004 [P1] Optional drift-fixture decision is recorded before packet closeout
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The canonical prompt-quality card exists under `sk-improve-prompt/assets/`
- [ ] CHK-011 [P0] Four local mirror cards exist under the CLI skill `assets/` folders
- [ ] CHK-012 [P0] Every CLI skill adds the local prompt-quality card to the `ALWAYS` loading block
- [ ] CHK-013 [P0] No CLI skill uses a `..` routable path for prompt-quality resources
- [ ] CHK-014 [P1] Each CLI skill documents the CLEAR pre-dispatch check and escalation trigger rule
- [ ] CHK-015 [P1] The `sk-improve-prompt` skill definition documents the agent invocation contract and fast-path asset
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Presence checks pass for the canonical card, four mirror cards, and four runtime agent definitions
- [ ] CHK-021 [P0] Framework-tag presence checks pass for all four CLI prompt-template assets
- [ ] CHK-022 [P1] Guard-safety checks confirm no prompt-quality path in CLI skills contains `..`
- [ ] CHK-023 [P1] Manual contract review confirms the CLI skills, `@improve-prompt`, and `/improve:prompt` all describe the same structured escalation output
- [ ] CHK-024 [P1] Strict packet validation passes for `.opencode/specs/skilled-agent-orchestration/043-cli-skill-improved-prompting/`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Compliance/security-sensitive prompts are documented as escalation triggers, not fast-path-only cases
- [ ] CHK-031 [P1] The `@improve-prompt` agent remains read-only and leaf-only across all runtime mirrors
- [ ] CHK-032 [P1] No change weakens the existing runtime sandbox or routing constraints described in the current agent formats
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `decision-record.md` describe the same two-tier architecture
- [ ] CHK-041 [P1] The implementation summary is updated from placeholder to delivery summary once implementation completes
- [ ] CHK-042 [P1] The packet explicitly records whether the drift fixture landed or was deferred
- [ ] CHK-043 [P1] The command and skill docs both point to the same `@improve-prompt` escalation surface
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] New assets stay inside the correct skill trees and do not introduce shared cross-skill routing paths
- [ ] CHK-051 [P1] Runtime mirrors exist only in the active runtime directories already present in this repo
- [ ] CHK-052 [P1] Packet-local docs remain synchronized with the final implementation scope
- [ ] CHK-053 [P2] Any temporary analysis or smoke-test notes stay in `scratch/` only
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 13 | 0/13 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-04-11
**Current Packet State**: Planning docs created; implementation and behavioral verification still pending.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions are captured in `decision-record.md`
- [ ] CHK-101 [P1] Mirror-card versus cross-skill-reference tradeoffs are documented with rejection rationale
- [ ] CHK-102 [P1] Fast-path versus deep-path behavior is documented consistently across spec, plan, and command surfaces
- [ ] CHK-103 [P2] Drift-management guidance is documented and reviewed
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Routine CLI dispatches document the lightweight fast-path token budget goal
- [ ] CHK-111 [P1] Agent escalation remains reserved for high-complexity or compliance-heavy prompts
- [ ] CHK-112 [P2] Mirror-card size stays intentionally compact after implementation
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Runtime agent mirrors are present in all active runtime directories
- [ ] CHK-121 [P1] `/improve:prompt` inline mode remains the default for ordinary prompt work
- [ ] CHK-122 [P1] Agent mode auto-selection is documented for complexity or isolation signals
- [ ] CHK-123 [P2] A rollback note exists for removing the mirror-card system if needed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Compliance/security triggers explicitly route to agent mode
- [ ] CHK-131 [P1] The packet preserves the decision to leave `skill_advisor.py` unchanged
- [ ] CHK-132 [P2] Optional drift-check automation is reviewed for maintenance cost before landing
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All planning docs exist in the packet root
- [ ] CHK-141 [P1] All planning docs reflect the same file inventory and requirement numbering
- [ ] CHK-142 [P2] The implementation summary is converted from placeholder to final summary at closeout
- [ ] CHK-143 [P2] Memory save is completed after implementation if the user requests context preservation
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [User] | Packet Owner | [ ] Approved | |
| [AI assistant] | Implementation Operator | [ ] Approved | |
| [AI assistant] | Verification Owner | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
