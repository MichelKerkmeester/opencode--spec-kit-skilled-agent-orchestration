---
title: "Implementation Plan: Automation Reality Supplemental Research [template:level_2/plan.md]"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Plan for 5-iteration supplemental research extending 012's automation reality map with deep-loop graph + CCC + eval + ablation + validator auto-fire coverage and adversarial 4-P1 retest."
trigger_phrases:
  - "013 automation supplemental plan"
  - "automation reality supplemental plan"
  - "deep research supplemental plan"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-automation-reality-supplemental-research"
    last_updated_at: "2026-04-29T15:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "5-iter supplemental research converged"
    next_safe_action: "Plan packet 031-doc-truth-pass first"
    blockers: []
    key_files:
      - "research/research-report.md"
      - "research/deep-research-state.jsonl"
    completion_pct: 100
---
# Implementation Plan: Automation Reality Supplemental Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts, JSONL state, shell validator |
| **Framework** | system-spec-kit deep research packet (continuation of 012) |
| **Storage** | Packet-local `research/` tree and spec docs |
| **Testing** | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` |
| **Executor** | cli-codex `gpt-5.5` reasoning=`xhigh` service-tier=`fast` |

### Overview
This plan executes the charter in `spec.md` as a 5-iteration supplemental loop. It extends 012's 50-row reality map with new rows for deep-loop graph, CCC, eval, ablation, and validator auto-fire surfaces; adversarially re-tests 012's 4 P1 aspirational findings with NEW evidence; and produces a sequenced remediation backlog (packets 031-035) with effort estimates and dependencies. Research-only; no runtime code changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Charter and supplemental scope clear. [EVIDENCE: spec.md:48-72 - problem statement and 6 RQs documented]
- [x] Continuation lineage configured. [EVIDENCE: research/deep-research-config.json - parentSessionId + lineageMode=continuation set]
- [x] 012 baseline reality map available. [EVIDENCE: 012/research/research-report.md exists with 50-row reality map and 4 P1 findings enumerated]

### Definition of Done
- [x] Five iteration files and five delta files exist. [EVIDENCE: research/iterations/iteration-{001..005}.md + research/deltas/iter-{001..005}.jsonl]
- [x] Final research-report.md answers RQ1-RQ6 with 7-section structure. [EVIDENCE: research/research-report.md sections 1-7 + Convergence Report]
- [x] Each of 012's 4 P1 findings has adversarial retest verdict. [EVIDENCE: P1-1 validated, P1-2 validated, P1-3 reclassified, P1-4 reclassified — research/deltas/iter-004.jsonl]
- [x] Sequenced remediation backlog (packets 031-035) authored with effort estimates. [EVIDENCE: research-report.md sections 6, packets 031, 032, 033, 034, 035 with hours-of-work estimates and dependency graph]
- [x] Strict validator passes on this packet. [EVIDENCE: bash validate.sh --strict — RESULT: PASSED, 0 errors 0 warnings]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Externalized research loop with packet-local state, lineage-linked to 012.

### Key Components
- **Iteration files**: One markdown file per pass (5 total), each with focus, sources, findings, adversarial checks (iter 4 mandatory), and convergence signal.
- **Delta JSONL files**: One metric row per pass for convergence accounting.
- **State JSONL**: Append-only deep research state events (linked to 012 via parentSessionId).
- **Research report**: Final 7-section synthesis: supplemental scope vs 012, extended reality map (delta), per-RQ answers, 4-P1 adversarial outcomes, NEW gaps, remediation backlog packets 031-035, open questions.

### Data Flow
Source evidence flows from runtime hook code, MCP handlers, deep-loop graph helpers, eval/CCC/ablation handlers, and config files into iteration findings. Iteration deltas and state events feed convergence detection. Final synthesis produces sequenced remediation backlog seeding downstream packets 031-035.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Init & Lineage Bind
- [x] Create packet structure (research/, prompts/, iterations/, deltas/). [EVIDENCE: directories created at packet init]
- [x] Configure lineage continuation to 012. [EVIDENCE: research/deep-research-config.json parentSessionId=2026-04-29T13:15:00.000Z]
- [x] Author strategy with 5-iter focus map. [EVIDENCE: research/deep-research-strategy.md]

### Phase 2: Iterative Supplemental Research
- [x] Iter 1 — deep-loop graph automation reality (RQ1). [EVIDENCE: research/iterations/iteration-001.md, newInfoRatio=0.82]
- [x] Iter 2 — CCC + eval + ablation reality (RQ2). [EVIDENCE: research/iterations/iteration-002.md, newInfoRatio=0.78]
- [x] Iter 3 — validator auto-fire surface (RQ3). [EVIDENCE: research/iterations/iteration-003.md, newInfoRatio=0.86]
- [x] Iter 4 — adversarial Hunter→Skeptic→Referee on 012's 4 P1 + NEW gap hunt (RQ4 + RQ5). [EVIDENCE: research/iterations/iteration-004.md, newInfoRatio=0.74]
- [x] Iter 5 — synthesis + sequenced remediation backlog (RQ6). [EVIDENCE: research/iterations/iteration-005.md, newInfoRatio=0.12, status=converged]

### Phase 3: Synthesis and Validation
- [x] Author `research/research-report.md` with 7-section structure. [EVIDENCE: 226-line synthesis with all 7 sections + convergence report]
- [x] Update packet continuity (frontmatter + implementation-summary.md). [EVIDENCE: spec.md/plan.md/tasks.md/checklist.md/implementation-summary.md frontmatter completion_pct: 100]
- [x] Run strict packet validator. [EVIDENCE: validate.sh --strict — RESULT: PASSED, 0 errors 0 warnings]
- [ ] Refresh memory index with `generate-context.js`. [EVIDENCE: pending in phase save step]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Artifact presence | 5 iter + 5 delta files, research-report.md | `find`, validator |
| Documentation integrity | Template headers, anchors, links, evidence markers | `validate.sh --strict` |
| Research completeness | RQ1-RQ6 + adversarial 4-P1 verdicts + remediation backlog | Manual source-to-finding trace |
| Convergence honesty | newInfoRatio sequence + stop reason | state log inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 012 packet shipped on main | Internal | Green | Lineage anchor and 50-row baseline reality map |
| system-spec-kit source tree | Internal | Green | Required for file:line evidence |
| Runtime config files (.claude, .codex, .opencode) | Internal | Green | Required for adversarial Copilot/Codex hook retest |
| Spec validator | Internal | Green | Required for final acceptance |
| cli-codex gpt-5.5 + xhigh + fast | External | Green | Required for iteration dispatch |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Packet-local docs fail validation in a way that cannot be repaired without changing runtime code; OR adversarial retest of 012's 4 P1 findings produces irreconcilable contradictions.
- **Procedure**: Revert only the packet-local artifact files from this run; leave 012 and runtime sources untouched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Init & Lineage Bind) -> Phase 2 (Iterative Research) -> Phase 3 (Synthesis and Validation)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Init & Lineage Bind | 012 baseline + charter | Iterative Research |
| Iterative Research | Source evidence + 012 reality map | Synthesis and Validation |
| Synthesis and Validation | Completed iterations + adversarial verdicts | Downstream remediation packets 031-035 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Init & Lineage Bind | Low | 5-10 minutes |
| Iterative Research | High | 5 cli-codex passes × ~6 min = ~30 min |
| Synthesis and Validation | Medium | 1 synthesis pass + validator + index ≈ 10 min |
| **Total** | | **~50 min wall-clock** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Runtime code remains read-only. [EVIDENCE: scope.md NFR-S01 + Out of Scope]
- [x] Writes are restricted to packet-local docs and `research/`. [EVIDENCE: spec.md scope]
- [ ] Final staging targets the packet directory only. [EVIDENCE: pending]

### Rollback Procedure
1. Remove or revert the packet-local research artifacts created in this run.
2. Re-run strict validation on the packet.
3. Re-stage the packet directory if the validator passes.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Packet-local artifact revert only.
<!-- /ANCHOR:enhanced-rollback -->
