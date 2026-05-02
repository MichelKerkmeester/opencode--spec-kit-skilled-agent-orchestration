<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
---
title: "Completion Checklist: 060/002 — Stress-Test Implementation"
description: "Level 3 checklist mapping to T-001..T-026."
trigger_phrases:
  - "060/002 checklist"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation"
    last_updated_at: "2026-05-02T11:42:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Authored checklist"
    next_safe_action: "Begin Stage 1"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Completion Checklist: 060/002 — Stress-Test Implementation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:stage-1-checklist -->
## Stage 1 — Scaffold + Fixture Design

- [ ] **T-001** All 8 markdown files at packet root — Evidence: `ls 002-stress-test-implementation/*.md` returns 8
- [ ] **T-002** description.json + graph-metadata.json bootstrapped — Evidence: both files exist + parse as JSON
- [ ] **T-003** Strict-validate exits 0 (or fails only on known template-shape errors matching 001/059 pattern) — Evidence: exit code captured
- [ ] **T-004** Fixture-target requirements extracted from 001/research §6 — Evidence: requirements listed in fixture README
- [ ] **T-005** Fixture-target spec authored — Evidence: README at chosen path
<!-- /ANCHOR:stage-1-checklist -->

---

<!-- ANCHOR:stage-2-checklist -->
## Stage 2 — Author 6 CP-XXX Scenarios

- [ ] **T-006** cli-codex authoring prompt composed with Gate 3 pre-answer — Evidence: prompt file at `/tmp/060-002-codex-prompt.md`
- [ ] **T-007** cli-codex dispatch succeeded — Evidence: codex output captured; 6 files written
- [ ] **T-008** Each of 6 files has CP-027-format compliance — Evidence: grep verifies frontmatter + 5 standard sections per file
- [ ] **T-009** Root playbook §10 routing-table updated — Evidence: 6 new rows present
- [ ] **T-010** Root playbook §16 cross-reference index updated — Evidence: 6 new entries present
<!-- /ANCHOR:stage-2-checklist -->

---

<!-- ANCHOR:stage-3-checklist -->
## Stage 3 — Apply Diff Sketches

- [ ] **T-011** P1: scan-integration.cjs `.gemini/agents` constant fixed — Evidence: grep `.gemini/agents` in scanner returns hit
- [ ] **T-012** P0: score-candidate.cjs consumes `--baseline` + emits `delta` — Evidence: grep `delta` in scorer + manual run with `--baseline=<path>` produces expected output
- [ ] **T-013** P0: auto YAML emits `legal_stop_evaluated` with 5-gate bundle — Evidence: grep `legal_stop_evaluated` in auto.yaml; bundle includes contractGate/behaviorGate/integrationGate/evidenceGate/improvementGate
- [ ] **T-014** P0: confirm YAML emits same — Evidence: grep parity
- [ ] **T-015** P0: improve-agent.md §6.5 CRITIC PASS bullets added — Evidence: grep `CRITIC PASS` in canonical agent file
- [ ] **T-016** 4-runtime mirror parity — Evidence: diff (with path-convention adjustments) shows identical content across .opencode/.claude/.gemini/.codex
- [ ] **T-017** P0: SKILL.md "skill load ≠ protocol execution" clarification — Evidence: grep `not proof of protocol` (or similar wording) in SKILL.md
<!-- /ANCHOR:stage-3-checklist -->

---

<!-- ANCHOR:stage-4-checklist -->
## Stage 4 — Multi-Round Stress Runs

- [ ] **T-018** R0 baseline transcripts captured for ≥2 models — Evidence: transcripts under `/tmp/cp-040-{A,B}-{gpt55,opus}.txt`
- [ ] **T-019** R1 stress run: 6 scenarios executed, 6 verdicts captured — Evidence: 6 transcripts + 6 grep-verdict files
- [ ] **T-020** R2 (if needed): targeted edits + re-run of affected scenarios — Evidence: R2 transcripts + score change
- [ ] **T-021** R3 (if needed): final round — Evidence: R3 transcripts + final score
<!-- /ANCHOR:stage-4-checklist -->

---

<!-- ANCHOR:stage-5-checklist -->
## Stage 5 — Test-Report + Close-out

- [ ] **T-022** test-report.md authored with 11 ANCHOR pairs — Evidence: grep `<!-- ANCHOR:` returns 22 (11 pairs)
- [ ] **T-023** implementation-summary.md updated with final score — Evidence: completion_pct=100; final score documented
- [ ] **T-024** handover.md updated with close-out — Evidence: handover.md current state reads "COMPLETE"
- [ ] **T-025** /memory:save executed — Evidence: continuity surfaces refreshed; new memory entries for surfaced lessons
- [ ] **T-026** Optional commit + push — Evidence: commit hash captured if user directed push
<!-- /ANCHOR:stage-5-checklist -->

---

<!-- ANCHOR:final-acceptance -->
## Final Acceptance

- [ ] All Stage 1-5 items complete
- [ ] Final score reaches 6/0/0 OR honest gaps documented in test-report.md and follow-on packet sketched
- [ ] Strict-validate still exits 0 (or fails only on known template-shape errors)
- [ ] No regressions to neighboring packets (058, 059, 001 sibling)
- [ ] No regressions to non-targeted sk-improve-agent functionality (verify by reading 13 unchanged scripts haven't been touched)
<!-- /ANCHOR:final-acceptance -->
