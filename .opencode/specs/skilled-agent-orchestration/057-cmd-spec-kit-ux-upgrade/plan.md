---
title: "Implementation Plan: SPAR-Kit UX comparison synthesis"
description: "Plan for completing packet 057 by synthesizing ten deep-research iterations into canonical research outputs and validation-ready packet documentation."
trigger_phrases:
  - "057 plan"
  - "spar-kit synthesis plan"
  - "spec kit ux upgrade plan"
importance_tier: "normal"
contextType: "research"
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade"
    last_updated_at: "2026-05-01T11:03:48+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Created Level 2 plan for completed synthesis pass"
    next_safe_action: "Review checklist"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/resource-map.md"
      - "research/deep-research-state.jsonl"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1-Q8 answered in research.md"
---
# Implementation Plan: SPAR-Kit UX comparison synthesis

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSONL |
| **Framework** | system-spec-kit deep-research packet |
| **Storage** | Packet-local files under `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/` |
| **Testing** | `validate.sh --strict`, JSONL parse check, section-structure check |

### Overview

Complete packet 057 by turning the 10 iteration narratives into a canonical 17-section `research/research.md`, a cited-path ledger in `research/resource-map.md`, and an append-only `synthesis_complete` event in `research/deep-research-state.jsonl`. No external SPAR-Kit files or production command behavior are modified.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement and six comparison axes documented in `spec.md`.
- [x] Ten iteration files available under `research/iterations/`.
- [x] State log, strategy, and registry read before synthesis.

### Definition of Done

- [x] `research/research.md` contains the canonical 17-section synthesis.
- [x] `research/resource-map.md` lists every cited external and internal path.
- [x] `research/deep-research-state.jsonl` ends with `synthesis_complete`.
- [x] Packet-level validation has been run and remaining issues, if any, are reported.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Research synthesis over append-only loop state.

### Key Components

- **Iteration narratives**: source-of-truth findings because `findings-registry.json` remained empty.
- **Final synthesis**: canonical 17-section `research/research.md` with 12 ranked findings.
- **Resource map**: lean ledger of cited paths grouped by external and internal surfaces.
- **State event**: JSONL append marking synthesis completion.

### Data Flow

Iteration markdown, state log, strategy, and spec context feed the final research synthesis. The synthesis cites both external SPAR-Kit paths and internal system-spec-kit paths, then the resource map mirrors every cited path for auditability.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research State Intake

- [x] Read `spec.md`, `deep-research-strategy.md`, `deep-research-state.jsonl`, and `findings-registry.json`.
- [x] Read `iteration-001.md` through `iteration-010.md`.
- [x] Confirm all six axes have evidence.

### Phase 2: Synthesis Authoring

- [x] Write `research/research.md` with 17 canonical sections.
- [x] Include 12 ranked findings with verdicts, citations, risks, and follow-on packets.
- [x] Write `research/resource-map.md` as a cited-path ledger.

### Phase 3: State and Verification

- [x] Append `synthesis_complete` to `research/deep-research-state.jsonl`.
- [x] Validate JSONL parsing.
- [x] Check 17 section headings.
- [x] Run strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | 17 canonical research sections | `rg '^## [0-9]+\\.' research/research.md` |
| State | JSONL parse and final event | `node -e ... JSON.parse(...)` and `tail -n 1` |
| Packet | Spec-folder compliance | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade --strict` |
| Manual | Finding coverage and citations | Review research sections 5-7 and 17 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Iteration files 001-010 | Internal research state | Green | Synthesis would lack evidence |
| External SPAR-Kit tree | External reference checked into packet | Green | Findings could not cite external surface |
| Internal system-spec-kit docs and commands | Internal reference | Green | Findings could not compare against internal surface |
| Validator script | Internal tooling | Green | Completion evidence would be weaker |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: research synthesis is found materially inaccurate or outside packet scope.
- **Procedure**: revert `research/research.md`, `research/resource-map.md`, and the final `synthesis_complete` JSONL line, then rerun synthesis from the iteration files.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Research State Intake) -> Phase 2 (Synthesis Authoring) -> Phase 3 (State and Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Research State Intake | Existing packet research files | Synthesis Authoring |
| Synthesis Authoring | Research State Intake | State and Verification |
| State and Verification | Synthesis Authoring | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Research State Intake | Medium | Completed |
| Synthesis Authoring | Medium | Completed |
| State and Verification | Low | Completed |
| **Total** | | **Completed in this pass** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] No production code changed.
- [x] External SPAR-Kit reference tree left read-only.
- [x] Changes confined to packet 057 documentation and research state.

### Rollback Procedure

1. Remove the synthesized `research/research.md` and `research/resource-map.md` files.
2. Remove the final `synthesis_complete` line from `research/deep-research-state.jsonl`.
3. Re-run synthesis from the unchanged iteration narratives.
4. Re-run strict packet validation.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: file-level revert only.
<!-- /ANCHOR:enhanced-rollback -->
