---
title: "Verification Checklist: Startup Context Injection Debug — Hook Runtime Brief + Sibling Handoff"
description: "Verification Date: 2026-04-02"
trigger_phrases:
  - "026 checklist"
importance_tier: "critical"
contextType: "verification"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Startup Context Injection Debug — Hook Runtime Brief + Sibling Handoff

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

- [ ] CHK-001 [P0] Requirements documented in `spec.md` for hook-runtime startup injection
- [ ] CHK-002 [P0] Technical approach defined in `plan.md` and kept separate from `027-opencode-structural-priming`
- [ ] CHK-003 [P1] Dependencies on code graph DB, hook state, and sibling packet handoff are stated clearly
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Shared `buildStartupBrief()` returns graph outline when DB exists with nodes
- [ ] CHK-011 [P0] Shared `buildStartupBrief()` returns session continuity when prior state `<24h` exists
- [ ] CHK-012 [P1] Startup-highlight query/helper returns meaningful startup highlights without assuming missing schema fields
- [ ] CHK-013 [P1] `026` no longer claims `PrimePackage` / `session_bootstrap` payload ownership
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Claude `handleStartup()` injects graph outline at session start
- [ ] CHK-021 [P0] Gemini `handleStartup()` injects graph outline at session start
- [ ] CHK-022 [P0] No crash when code graph DB missing or empty
- [ ] CHK-023 [P1] No crash when no prior session state exists
- [ ] CHK-024 [P1] Compaction, resume, and clear paths remain unchanged
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Startup brief avoids exposing unnecessary sensitive workspace details
- [ ] CHK-031 [P0] Recovery guidance does not bypass established tool-safety or scope rules
- [ ] CHK-032 [P1] Empty graph DB is distinguished from injection failure
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` stay synchronized
- [ ] CHK-041 [P1] `026-session-start-injection-debug` and `027-opencode-structural-priming` stay distinct in packet docs
- [ ] CHK-042 [P2] Helper reuse expectations are documented without pre-deciding Phase 027 payload details
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Work remains scoped to hook startup files plus packet docs
- [ ] CHK-051 [P1] No unrelated packet files modified while clarifying the 026/027 split
- [ ] CHK-052 [P2] Context preservation follow-up considered if implementation proceeds later
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 9 | 0/9 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-04-02
<!-- /ANCHOR:summary -->
