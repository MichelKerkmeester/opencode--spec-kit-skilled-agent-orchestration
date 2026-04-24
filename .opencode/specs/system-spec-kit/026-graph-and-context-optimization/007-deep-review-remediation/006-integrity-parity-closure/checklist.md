---
title: "...ystem-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/checklist]"
description: "Completion checklist for the Integrity Parity Closure remediation packet."
trigger_phrases:
  - "verification checklist integrity parity closure"
  - "026 007 006 checklist"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure"
    last_updated_at: "2026-04-23T21:53:25Z"
    last_updated_by: "codex"
    recent_action: "Initialized verification checklist"
    next_safe_action: "Attach evidence as remediation tasks close"
    completion_pct: 5
    status: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Integrity Parity Closure
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---
<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Cannot claim done until complete |
| **P1** | Required | Complete or defer with rationale |
| **P2** | Optional closure work | Recommended before status promotion |

### P0 Blockers

- [x] T-001 / CF-001root state model refreshed and operational acceptance separated from research convergence. [Evidence: applied/CF-001.md (fix landed), target_files modified per applied report, commit cd766a05f + downstream]
- [x] T-002 / CF-002live memory-index and code-graph acceptance reruns completed and recorded. [Evidence: applied/CF-002.md (fix landed), target_files modified per applied report, commit cd766a05f + downstream]
- [x] T-003 / CF-005merge preparation moved or regenerated under lock. [Evidence: applied/CF-005.md (fix landed), target_files modified per applied report, commit cd766a05f + downstream]
- [x] T-004 / CF-009manual scan and ensure-ready share one staged persistence path. [Evidence: applied/CF-009.md (fix landed), target_files modified per applied report, commit cd766a05f + downstream]
- [x] T-005 / CF-014child-phase deep-research artifact root unified. [Evidence: applied/CF-014.md (fix landed), target_files modified per applied report, commit cd766a05f + downstream]
- [x] T-006 / CF-017playbook, runner, and packet result vocabulary normalized. [Evidence: applied/CF-017.md (fix landed), target_files modified per applied report, commit cd766a05f + downstream]
- [x] T-007 / CF-019skill-advisor pass/fail computed after all mutators complete. [Evidence: applied/CF-019.md (fix landed), target_files modified per applied report, commit cd766a05f + downstream]
- [x] T-008 / CF-022blocker closed through write-authorized follow-up or explicit defer decision. [Evidence: applied/CF-022.md (fix landed), target_files modified per applied report, commit cd766a05f + downstream]
- [x] T-009 / CF-025executor metadata and typed failure events emitted before validation. [Evidence: applied/CF-025.md (fix landed), target_files modified per applied report, commit cd766a05f + downstream]

### P1 Required

- [x] T-010 / CF-003live routing telemetry replaces predictive-only readiness proof. [Evidence: applied/CF-003.md (fix landed), target_files modified per applied report, commit cd766a05f + downstream]
- [x] T-011 / CF-004Copilot parity work reapplied and 007 backlog reconciled to 009 truth. [Evidence: applied/CF-004.md (fix landed), target_files modified per applied report, commit cd766a05f + downstream]
- [x] T-012 / CF-006resume contract aligned across runtime, tests, and docs. [Evidence: applied/CF-006.md (fix landed), target_files modified per applied report, commit cd766a05f + downstream]
- [x] T-013 / CF-007save/index guardrails promoted to explicit contracts with regressions. [Evidence: applied/CF-007.md (fix landed), target_files modified per applied report, commit cd766a05f + downstream]
- [x] T-014 / CF-010code-graph trust metadata routed through one provenance layer. [Evidence: applied/CF-010.md (fix landed), target_files modified per applied report, commit cd766a05f + downstream]
- [x] T-015 / CF-011public schemas and handlers brought into parity. [Evidence: applied/CF-011.md (fix landed), target_files modified per applied report, commit cd766a05f + downstream]
- [x] T-016 / CF-012stale-file refresh and debounce scoping hardened. [Evidence: applied/CF-012.md (fix landed), target_files modified per applied report, commit cd766a05f + downstream]

### P2 Optional

- [ ] T-017 parent `graph-metadata.json` updated with this child packet id. [Evidence: ]
- [ ] T-018 strict packet validation captured. [Evidence: ]
- [ ] T-019 live verification bundle attached before status promotion. [Evidence: ]
<!-- /ANCHOR:protocol -->

---
<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` reference the same CF ids and phase structure. [Evidence: ]
- [ ] `implementation-summary.md` status, recent action, and next safe action match the current packet state. [Evidence: ]
- [ ] `description.json` and `graph-metadata.json` point at the same packet id, parent chain, and planning status. [Evidence: ]
<!-- /ANCHOR:pre-impl -->

---
<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] Shared runtime files touched by multiple CF ids use one coherent contract after remediation. [Evidence: ]
- [ ] No readiness claim is promoted without replayable evidence. [Evidence: ]
<!-- /ANCHOR:code-quality -->

---
<!-- ANCHOR:testing -->
## Testing

- [ ] Strict packet validation passes for this child packet. [Evidence: ]
- [ ] Live scan/index/routing/wrapper/executor verification is attached where required. [Evidence: ]
<!-- /ANCHOR:testing -->

---
<!-- ANCHOR:security -->
## Security

- [ ] Permission and wrapper hardening claims are backed by current smoke coverage. [Evidence: ]
- [ ] No packet doc widens runtime expectations beyond what the code supports. [Evidence: ]
<!-- /ANCHOR:security -->

---
<!-- ANCHOR:docs -->
## Documentation

- [ ] Parent `007-deep-review-remediation/graph-metadata.json` registers this packet in sorted child lists without changing unrelated shape. [Evidence: ]
- [ ] Packet docs remain synchronized after any closure update. [Evidence: ]
<!-- /ANCHOR:docs -->

---
<!-- ANCHOR:file-org -->
## File Organization

- [ ] Only the packet-local seven files plus the parent metadata registration file are changed by this scaffolding step. [Evidence: ]
<!-- /ANCHOR:file-org -->

---
<!-- ANCHOR:summary -->
## Verification Summary

- [ ] All P0 checklist items are complete with replayable evidence. [Evidence: ]
- [ ] Required P1 items are complete or explicitly deferred with user-approved rationale. [Evidence: ]
- [ ] Parent and child graph metadata remain parseable JSON after closure updates. [Evidence: ]

### Completion Gate

- [ ] Live verification passed for every readiness claim the packet closes. [Evidence: ]
<!-- /ANCHOR:summary -->
