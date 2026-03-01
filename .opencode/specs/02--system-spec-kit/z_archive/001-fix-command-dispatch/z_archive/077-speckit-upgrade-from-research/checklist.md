---
title: "QA Verification Checklist [077-speckit-upgrade-from-research/checklist]"
description: "checklist document for 077-speckit-upgrade-from-research."
trigger_phrases:
  - "verification"
  - "checklist"
  - "077"
  - "speckit"
importance_tier: "normal"
contextType: "implementation"
---
# QA Verification Checklist

> **Spec:** 077-speckit-upgrade-from-research
> **Level:** 3+ (Consolidated from research specs)
> **Created:** 2026-01-22

---

## Pre-Implementation Checks

### P0 - Must Complete Before Starting

- [ ] All source research specs reviewed and understood
  - Evidence: _[List specs reviewed: 060, 061, 062, 063]_
- [ ] Environment constraint (OpenCode, no hooks) acknowledged
  - Evidence: _[Confirm: OpenCode-compatible solutions only]_
- [ ] Current v1.0.6.0 implementation state verified
  - Evidence: _[Current SKILL.md version, state of gates]_
- [ ] Spec folder structure created correctly
  - Evidence: _[Folder path verified, all required files present]_

---

## Phase 1 Validation: Uncertainty Tracking & Core Epistemic

### P0 - Core Epistemic Infrastructure

- [x] Uncertainty tracking field added to AGENTS.md (separate from confidence)
  - Evidence: _AGENTS.md Section 4: "Uncertainty Tracking (Separate from Confidence)" subsection with 4-factor weighted table, 0.0-1.0 range, thresholds ≤0.35/0.36-0.60/>0.60_
- [x] Dual-threshold validation logic documented
  - Evidence: _AGENTS.md Section 4: "Dual-Threshold Validation" subsection with READINESS = (confidence >= 0.70) AND (uncertainty <= 0.35), 4-state table, investigation protocol_
- [x] Enhanced resume detection uses memory file priority
  - Evidence: _resume.md Section 6: New "Session Detection Priority" with 4-tier priority: CLI > memory_search() > memory_match_triggers() > glob fallback_
- [x] PREFLIGHT baseline capture implemented
  - Evidence: _context_template.md: New PREFLIGHT BASELINE section with ANCHOR tags, knowledge/uncertainty/context scores, dual-threshold status_
- [x] All Phase 1 documentation updates complete
  - Evidence: _AGENTS.md Section 4 contains: Uncertainty Tracking, Dual-Threshold Validation, combined assessment formats_

---

## Phase 2 Validation: Learning Delta System

### P0 - PREFLIGHT/POSTFLIGHT Implementation

- [x] PREFLIGHT baseline capture implemented
  - Evidence: _context_template.md: PREFLIGHT section captures knowledge/uncertainty/context scores with ANCHOR:preflight-{{SESSION_ID}}-{{SPEC_FOLDER}} tags_
- [x] POSTFLIGHT learning delta calculation implemented
  - Evidence: _context_template.md: POSTFLIGHT section with Before/After/Delta table, Learning Index formula = (Knowledge Delta × 0.4) + (Uncertainty Reduction × 0.35) + (Context Improvement × 0.25)_
- [x] Learning deltas stored in memory files
  - Evidence: _context_template.md: POSTFLIGHT section includes Gaps Closed, New Gaps, Learning Summary with ANCHOR:postflight-{{SESSION_ID}}-{{SPEC_FOLDER}} tags_
- [ ] Delta calculation verified with test cases
  - Evidence: _[Deferred: Requires generate-context.js implementation to produce actual files]_

---

## Phase 3 Validation: Agent Reasoning Framework

### P1 - Five Checks & Decision Format

- [x] Five Checks framework added to AGENTS.md
  - Evidence: _AGENTS.md Section 5: "Five Checks Framework (>100 LOC or architectural)" with 5-check table (Necessary?, Beyond Local Maxima?, Sufficient?, Fits Goal?, Open Horizons?) and Quick Assessment Format_
- [x] Structured decision format documented
  - Evidence: _AGENTS.md Section 2: "Structured Gate Decision Format" with GATE/DECISION/CONFIDENCE/UNCERTAINTY/EVIDENCE format and example output_
- [x] skill_advisor.py updated with uncertainty check
  - Evidence: _skill_advisor.py: calculate_uncertainty() function (lines ~472-517), passes_dual_threshold() function (lines ~519-535), output includes uncertainty field and passes_threshold boolean_
- [x] Gate responses follow PASS/BLOCK + CONFIDENCE format
  - Evidence: _AGENTS.md Section 2: Format documented with GATE:[NAME] DECISION:[PASS|BLOCK] CONFIDENCE:[HIGH|MEDIUM|LOW] UNCERTAINTY:[0.0-1.0] EVIDENCE:[justification]_

---

## Phase 3 Validation (Continued): Decision Quality

### P2 - Extended Decision Tracking

- [x] Decision journaling enhanced with audit trail
  - Evidence: _level_3+/decision-record.md: New "Session Decision Log" section with Timestamp/Gate/Decision/Confidence/Uncertainty/Evidence table format_
- [x] Decision log queryable by session/spec/gate
  - Evidence: _Level 3/3+ decision-record.md: Five Checks Evaluation table added after Alternatives Considered section, Level 3+ has Session Decision Log for audit trail_

---

## Integration Testing

### P1 - End-to-End Workflow Verification

- [ ] Full workflow tested: spec creation → implementation → completion
  - Evidence: _[Test spec folder path, completion status]_
- [ ] Memory save/restore cycle verified
  - Evidence: _[Save command output, restore retrieval]_
- [ ] Resume detection tested with memory files present/absent
  - Evidence: _[Both scenarios tested, correct behavior confirmed]_
- [ ] Uncertainty thresholds validated in real usage
  - Evidence: _[Real task with uncertainty tracking output]_

---

## Documentation Updates

### P1 - System Documentation

- [x] AGENTS.md updated with new gates
  - Evidence: _Section 2 (Gate 2 dual-threshold), Section 4 (Uncertainty Tracking, Dual-Threshold Validation), Section 5 (Five Checks)_
- [ ] SKILL.md updated with new commands
  - Evidence: _[Deferred: No new commands added, existing commands enhanced]_
- [x] Memory system documentation updated
  - Evidence: _context_template.md: PREFLIGHT/POSTFLIGHT sections with delta calculation formulas documented in HTML comments_
- [ ] Release notes prepared
  - Evidence: _[Pending: Version tagging not yet performed]_

---

## Level 3+ Verification: Architecture

### P0 - Architectural Integrity

- [ ] All architectural decisions documented in decision-record.md
  - Evidence: _[8 decisions documented: DR-1 through DR-8]_
- [ ] Decision dependencies correctly identified and respected
  - Evidence: _[Dependency graph validated, no circular dependencies]_
- [ ] Scope boundaries enforced (no out-of-scope implementations)
  - Evidence: _[State file excluded, hooks excluded per decisions]_
- [ ] Memory-based approach validated as sufficient
  - Evidence: _[Resume detection tests without state file]_

---

## Level 3+ Verification: Performance

### P1 - Performance Baseline

- [ ] MCP server startup time unchanged or improved
  - Evidence: _[Baseline: X ms, Current: X ms]_
- [ ] Memory search performance acceptable (<200ms typical)
  - Evidence: _[Search timing results]_
- [ ] No regression in memory save operations
  - Evidence: _[Save timing results]_
- [ ] Database migrations non-blocking
  - Evidence: _[Migration test on existing database]_

---

## Level 3+ Verification: Deployment Readiness

### P1 - Release Preparation

- [ ] Rollback strategy documented and tested
  - Evidence: _[Rollback commands in plan.md, tested successfully]_
- [ ] Breaking changes documented
  - Evidence: _[AGENTS.md sections affected listed]_
- [ ] Migration path for existing spec folders
  - Evidence: _[Existing folders compatible, no migration needed]_
- [ ] Version tagging plan defined
  - Evidence: _[v1.0.7.0 → v1.0.8.0 → v1.0.9.0 progression]_

---

## Level 3+ Verification: Compliance Checkpoints

### P1 - Template & Standard Compliance

- [ ] All documents follow Level 3+ template structure
  - Evidence: _[spec.md, plan.md, tasks.md, checklist.md, decision-record.md present]_
- [ ] ANCHOR markers used correctly in memory files
  - Evidence: _[Sample memory file with valid anchors]_
- [ ] Six-tier importance system respected
  - Evidence: _[Memory priorities assigned correctly]_
- [ ] Constitutional rules preserved
  - Evidence: _[Critical Rules section unchanged]_

### P2 - Extended Compliance

- [ ] AI execution framework documented
  - Evidence: _[AGENTS.md sections mapped to implementation]_
- [ ] Stakeholder matrix defined (if applicable)
  - Evidence: _[N/A for internal tooling OR matrix location]_
- [ ] Edge cases documented
  - Evidence: _[Edge case handling in spec.md or plan.md]_

---

## Final Verification

### P0 - Completion Gate

- [ ] All P0 items verified with evidence
  - Evidence: _[Count: X/X P0 items complete]_
- [ ] All P1 items verified with evidence
  - Evidence: _[Count: X/X P1 items complete]_
- [ ] No regression in existing functionality
  - Evidence: _[Existing commands tested: /spec_kit:complete, :resume, etc.]_
- [ ] Browser verification completed (if applicable)
  - Evidence: _[N/A for CLI-only changes OR verification details]_

---

## Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| Implementer | | | |
| Reviewer | | | |

---

## Priority Legend

| Priority | Meaning | Action |
|----------|---------|--------|
| **P0** | Hard blocker | MUST complete before claiming done |
| **P1** | Must complete | Required OR user-approved deferral |
| **P2** | Can defer | May defer without explicit approval |

---

## Notes

- Evidence fields MUST be filled before marking item complete
- Use specific file paths, line numbers, or command outputs as evidence
- If deferring P1 items, document reason and user approval
