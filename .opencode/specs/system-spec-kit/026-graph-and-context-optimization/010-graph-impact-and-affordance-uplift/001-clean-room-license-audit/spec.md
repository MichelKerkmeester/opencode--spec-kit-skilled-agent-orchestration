---
speckit_template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
title: "Feature Specification: Clean-Room License Audit (012/001)"
description: "P0 governance gate. Audit external/LICENSE; record clean-room rule and pattern-allow-list ADR. Blocks all 012 code sub-phases until signed off."
trigger_phrases:
  - "012 license audit"
  - "clean room license"
  - "external-project license"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/001-clean-room-license-audit"
    last_updated_at: "2026-04-25T11:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Initialized sub-phase scaffold"
    next_safe_action: "Read external/LICENSE and external/ARCHITECTURE.md; draft ADR"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Clean-Room License Audit (012/001)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | **P0** |
| **Status** | Draft |
| **Created** | 2026-04-25 |
| **Branch** | `012/001-clean-room-license-audit` |
<!-- /ANCHOR:metadata -->

---

## 2. PROBLEM & PURPOSE

### Problem Statement
pt-02 §12 ranks license contamination from direct External Project reuse as a P0 risk. No formal license audit of `external/` has been performed. Code work in 012/002-005 cannot safely begin without a recorded license posture.

### Purpose
Produce a single ADR in this sub-phase's `decision-record.md` (or surfaced into 012 phase-root `decision-record.md` ADR-012-001) confirming the license posture and explicit allow-list of pattern-only adaptations.

---

## 3. SCOPE

### In Scope
- Read `external/LICENSE`
- Read `external/ARCHITECTURE.md` (license-relevant sections)
- Record license posture decision
- Articulate clean-room adaptation rule
- Publish allow-list of pattern-only adaptations vs forbidden source forms

### Out of Scope
- Any code implementation (deferred to 012/002+)
- External legal counsel engagement (note as escalation path; do not block on it)
- Modifying `external/` (read-only)

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `012/decision-record.md` (phase root) | Modify | ADR-012-001 already drafted; this sub-phase verifies it against actual LICENSE text |
| `012/001/decision-record.md` | Create | Sub-phase-local ADR with verbatim LICENSE quote + allow-list table |
| `012/001/implementation-summary.md` | Modify | Populate post-audit |

---

## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| R-001-1 | LICENSE file at `external/LICENSE` is read in full and quoted verbatim in the audit ADR |
| R-001-2 | Audit ADR explicitly classifies each in-scope adaptation pattern (phase-DAG, edge metadata, blast_radius enrichment, affordance evidence, trust display) as ALLOWED (clean-room) or BLOCKED (requires external review) |
| R-001-3 | Audit ADR articulates fail-closed rule: any future PR copying External Project source/schema/logic verbatim is auto-rejected |
| R-001-4 | If LICENSE forbids the clean-room path needed by 012/002-005, this sub-phase HALTS the entire phase and escalates to user |

---

## 5. VERIFICATION

- [ ] LICENSE text quoted in `012/001/decision-record.md`
- [ ] Allow-list table covers all 4 code-touching sub-phases (002, 003, 004, 005)
- [ ] Sub-phase status flips to `complete` only after user sign-off recorded in implementation-summary.md
- [ ] 012 phase-root ADR-012-001 references this sub-phase's audit
- [ ] `validate.sh --strict` passes on this sub-phase

---

## 6. REFERENCES
- 012/spec.md §6 (risks) — license contamination row
- 012/decision-record.md ADR-012-001 (clean-room rule)
- pt-02 §12 RISK-01: `.../007-external-project/research/007-external-project-pt-02/research.md`
- External source: `external/LICENSE`
