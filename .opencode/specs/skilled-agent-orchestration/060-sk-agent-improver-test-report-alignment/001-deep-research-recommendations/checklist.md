<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
---
title: "Completion Checklist: 060 — sk-improve-agent Test-Report Alignment"
description: "Level 3 completion checklist. Items map 1:1 to tasks T-001..T-008. Each item requires evidence."
trigger_phrases:
  - "060 checklist"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations"
    last_updated_at: "2026-05-02T10:50:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Completion checklist authored"
    next_safe_action: "Run T-002 generate-context.js then T-003 strict-validate"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Completion Checklist: 060 — sk-improve-agent Test-Report Alignment

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:phase-1-checklist -->
## Phase 1 — Scaffold + Metadata

- [ ] **T-001 — All 8 markdown files exist at packet root**
  - Evidence: `ls .opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/*.md` returns 8 files
- [ ] **T-002 — description.json and graph-metadata.json exist**
  - Evidence: `ls .opencode/specs/.../060-.../description.json .opencode/specs/.../060-.../graph-metadata.json`
- [ ] **T-003 — Strict-validate exits 0**
  - Evidence: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment --strict; echo $?` → `0`
<!-- /ANCHOR:phase-1-checklist -->

---

<!-- ANCHOR:phase-2-checklist -->
## Phase 2 — Deep-Research

- [ ] **T-004 — Deep-research dispatched without parse errors**
  - Evidence: workflow logs show successful setup phase + first iteration started
- [ ] **T-005 — Convergence reached (or 10-iter cap hit)**
  - Evidence: `cat research/deep-research-state.jsonl | tail -1` shows convergence_reached=true OR iteration count = 10
- [ ] **T-006 — research/research.md has all 6 required sections**
  - Evidence: grep for section headers: Gap Analysis, Scenario Sketches, Diff Sketches, Fixture-Target Recommendation, Lessons Learned, Hand-off Notes
- [ ] **T-006a — All 7 RQs addressed in research.md**
  - Evidence: grep -E "RQ-[1-7]" research/research.md returns ≥7 matches
- [ ] **T-006b — At least 6 CP-XXX scenarios sketched**
  - Evidence: grep -cE "CP-[0-9]{3}" research/research.md ≥ 6
- [ ] **T-006c — Diff sketches cite section anchors**
  - Evidence: research.md diff sketches reference specific §N or ANCHOR:foo anchors in target files
- [ ] **T-007 — implementation-summary.md updated**
  - Evidence: completion_pct=100; no `[###-feature-name]` placeholders remain in summary section
- [ ] **T-008 — Memory save + handover.md updated**
  - Evidence: `/memory:save` output OK; handover.md cites research/research.md as packet 061's input
<!-- /ANCHOR:phase-2-checklist -->

---

<!-- ANCHOR:final-acceptance -->
## Final Acceptance

- [ ] All Phase 1 items complete
- [ ] All Phase 2 items complete
- [ ] Strict-validate still exits 0 after Phase 2 writes
- [ ] No regressions to neighboring spec folders (058, 059)
<!-- /ANCHOR:final-acceptance -->
