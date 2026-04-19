---
title: "Implementation Summary: Advisor Brief Producer + Cache Policy"
description: "Placeholder. Populated post-implementation with Files Changed + bench lanes."
trigger_phrases:
  - "020 004 summary"
importance_tier: "critical"
contextType: "implementation-summary"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Placeholder scaffolded"
    next_safe_action: "Populate post-implementation"
    blockers: []
    key_files: []

---
# Implementation Summary: Advisor Brief Producer + Cache Policy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

> **Placeholder.** Populated after `/spec_kit:implement :auto` converges.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-advisor-brief-producer-cache-policy |
| **Completed** | TBD |
| **Level** | 2 |
| **Parent** | `../spec.md` |
| **Predecessors** | `../002-shared-payload-advisor-contract/`, `../003-advisor-freshness-and-source-cache/` |
| **Position in train** | 3 of 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

TBD post-implementation. Expected: `buildSkillAdvisorBrief()` orchestrator + prompt policy + HMAC exact prompt cache + subprocess wrapper. Composes into `AdvisorHookResult` with fail-open contract.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| TBD | TBD | TBD |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

TBD.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Inherits ADR-002 + ADR-003 from parent. No new ADRs at this level.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

TBD. Will include:
- 10 acceptance scenarios pass/fail
- Warm-cache producer p50/p95/p99
- Cold producer p50/p95/p99
- Privacy audit results
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

TBD.
<!-- /ANCHOR:limitations -->
