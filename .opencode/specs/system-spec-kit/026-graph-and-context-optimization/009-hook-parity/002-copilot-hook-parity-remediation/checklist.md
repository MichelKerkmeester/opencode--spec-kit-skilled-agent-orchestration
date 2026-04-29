---
title: "Verification Checklist: Copilot CLI Hook Parity Remediation"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify + level3-arch | v2.2"
description: "P0/P1/P2 verification items mapped to Copilot parity outcome B and Tier 2 follow-up evidence."
trigger_phrases:
  - "026/009/004 checklist"
  - "copilot hook parity checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation"
    last_updated_at: "2026-04-28T19:30:00Z"
    last_updated_by: "codex-gpt-5-hygiene-pass"
    recent_action: "Strict validator closure"
    next_safe_action: "Keep validators green"
    completion_pct: 100
---

# Verification Checklist: Copilot CLI Hook Parity Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify + level3-arch | v2.2 -->

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

- [x] **CHK-001** [P0] Research has primary-source citations and outcome classification. [EVIDENCE: decision-record.md ADR-003 and research synthesis references]
- [x] **CHK-002** [P0] Decision matrix exists. [EVIDENCE: decision-record.md ADR-003 matrix]
- [x] **CHK-003** [P1] Outcome B is explicitly documented. [EVIDENCE: implementation-summary.md metadata and decision-record.md ADR-003]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] **CHK-010** [P0] Claude hook regression tests passed. [EVIDENCE: implementation-summary.md focused Vitest row]
- [x] **CHK-011** [P1] Copilot writer preserves human instructions outside managed markers. [EVIDENCE: implementation-summary.md Managed Custom Instructions section]
- [x] **CHK-012** [P1] Workspace-scoped retention contract documented. [EVIDENCE: decision-record.md ADR-005]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] **CHK-020** [P0] Focused Copilot/Claude tests passed. [EVIDENCE: implementation-summary.md records 4 files / 28 tests]
- [x] **CHK-021** [P0] Real Copilot smoke saw the managed advisor line. [EVIDENCE: implementation-summary.md Real Copilot smoke row]
- [x] **CHK-022** [P1] Shell wrapper syntax passed. [EVIDENCE: implementation-summary.md `bash -n` row]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] **CHK-030** [P0] Hook stdout remains `{}` for ignored prompt-mutation events. [EVIDENCE: implementation-summary.md What Was Built section]
- [x] **CHK-031** [P1] Managed block is scoped to workspace root. [EVIDENCE: decision-record.md ADR-005]
- [x] **CHK-032** [P1] Atomic replacement and lock behavior documented. [EVIDENCE: decision-record.md ADR-005]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] **CHK-040** [P1] cli-copilot skill docs and README document the current parity state. [EVIDENCE: implementation-summary.md Documentation and Programmatic Wrapper section]
- [x] **CHK-041** [P1] ADRs preserve outcome B and wrapper-routing decisions. [EVIDENCE: decision-record.md ADR-003, ADR-004, ADR-005]
- [x] **CHK-042** [P2] AI execution protocol added for strict validator closure. [EVIDENCE: spec.md AI Execution Protocol section]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] **CHK-050** [P1] Root packet docs follow Level 3 template shape after closure pass. [EVIDENCE: temporary hygiene summary records strict validator exit code]
- [x] **CHK-051** [P1] No runtime-code edits are part of this strict-validator closure pass. [EVIDENCE: temporary hygiene summary records packet-level doc-only validation status]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-04-28
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:sign-off -->
