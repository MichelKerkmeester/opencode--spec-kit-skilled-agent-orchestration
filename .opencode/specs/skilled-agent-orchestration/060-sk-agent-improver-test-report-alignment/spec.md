<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
---
title: "Phase Parent Spec: 060 — sk-improve-agent Test-Report Alignment"
description: "Phase-parent root spec. Two-phase work: (001) deep research producing prioritized improvement recommendations for the sk-improve-agent triad, (002) implementation of those recommendations + multi-round stress tests + test-report.md, all modeled on packet 059's @code stress-test campaign."
trigger_phrases:
  - "060 root"
  - "060 phase parent"
  - "sk-improve-agent test report alignment"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment"
    last_updated_at: "2026-05-02T11:47:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Restructured into phase parent; 001 complete, 002 scaffolded"
    next_safe_action: "Execute 002 stage 1"
    blockers: []
    key_files:
      - .opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations/research/research.md
      - .opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/spec.md
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "Phase 001 complete: research synthesis at 001/research/research.md (854 lines)"
      - "Phase 002 scaffolded: 8 markdown + 2 JSON files; awaiting Stage 1 execution"
---

# Phase Parent Spec: 060 — sk-improve-agent Test-Report Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_PHASE_PARENT: true -->

---

<!-- ANCHOR:purpose -->
## ROOT PURPOSE

Apply packet 059's @code stress-test methodology (same-task A/B dispatch, sandboxed isolation, grep-only verdict signals, multi-round iterative score progression) to the **sk-improve-agent triad** — the skill, agent, and command that exist to improve other agents.

The premise is reflexive: if the 059 lens revealed two real design gaps in @code after a single round of stress scenarios, an honest test of sk-improve-agent should reveal analogous gaps. This packet researches what those gaps are (phase 001) and then closes them under stress (phase 002), producing a `test-report.md` that mirrors 059's structure.
<!-- /ANCHOR:purpose -->

---

<!-- ANCHOR:phases -->
## PHASES

| Phase | Folder | Purpose | Status |
|-------|--------|---------|--------|
| **001** | `001-deep-research-recommendations/` | 10-iteration cli-copilot research producing prioritized diff sketches, scenario sketches, and fixture-target recommendation | **COMPLETE** (research.md synthesized) |
| **002** | `002-stress-test-implementation/` | Apply diffs, author CP-040..CP-045 playbook entries, build fixture, run multi-round stress tests, produce `test-report.md` | **SCAFFOLDED** (Stage 1 in progress) |

### 001 — Deep Research and Recommendations

Status: COMPLETE
Output: `001-deep-research-recommendations/research/research.md` (854 lines)

10 cli-copilot iterations (gpt-5.5, high reasoning) followed by 1 synthesis call. Final output covers all 7 research questions with file:line evidence, sketches 11 unique CP-XXX scenarios, drafts 5 P0/P1 diff sketches across the triad + 2 helper scripts, and recommends a fixture-target design.

### 002 — Stress-Test Implementation

Status: SCAFFOLDED (8 markdown + 2 JSON written; Stage 1 ready to execute)
Inputs: 001/research/research.md as source of truth
Outputs: source-file diffs applied, 6 new playbook entries, multi-round stress transcripts, `test-report.md` mirroring 059

Five stages: scaffold + fixture design → author 6 CP-XXX scenarios → apply diffs → run R0/R1/R2 stress → produce test-report + close-out.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:active-child -->
## ACTIVE CHILD

`002-stress-test-implementation/` — Stage 1 in progress. Resume points to that packet's `_memory.continuity.next_safe_action`.

001 is complete; subsequent reads of this packet should treat 002 as the active surface.
<!-- /ANCHOR:active-child -->

---

<!-- ANCHOR:reference-packet -->
## REFERENCE PACKET

`../059-agent-implement-code/` — the methodology source. Both 001 and 002 reference 059's `test-report.md` (570 lines, §9 lessons-learned) as the structural and discipline template.
<!-- /ANCHOR:reference-packet -->
