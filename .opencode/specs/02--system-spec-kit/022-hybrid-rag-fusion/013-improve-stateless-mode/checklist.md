---
title: "Verification Checklist: Improve Stateless Mode Quality"
description: "P0/P1/P2 verification items for stateless mode quality improvements targeting 60+/100 quality scores."
trigger_phrases:
  - "stateless checklist"
  - "quality verification"
  - "stateless verification"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: Improve Stateless Mode Quality

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

## P0 - Blockers (MUST pass before completion)

- [ ] **CHK-001**: Stateless save produces quality score >= 50/100
  - Run: `node generate-context.js .opencode/specs/.../013-improve-stateless-mode`
  - Verify: legacy quality score in output >= 50
- [ ] **CHK-002**: No regression in stateful (JSON) mode quality
  - Run: existing stateful test suite passes
  - Verify: stateful quality score unchanged from baseline
- [ ] **CHK-003**: No new CLI arguments required
  - Verify: script signature and usage unchanged
- [ ] **CHK-004**: Enrichment only activates for stateless path
  - Verify: when `_source === 'file'`, enrichment is skipped
- [ ] **CHK-005**: No crashes on missing git or empty spec folders
  - Test: run on repo with no git, run on spec folder with only description.json

## P1 - Required (complete OR approved deferral)

- [ ] **CHK-006**: Stateless save produces quality score >= 60/100 on repos with git history
  - Run on repo with recent commits
  - Verify: quality score >= 60 in output
- [ ] **CHK-007**: File modifications detected accurately from git
  - Compare `FILES` in output vs `git status` output
- [ ] **CHK-008**: Semantic indexing succeeds for stateless saves (no QUALITY_GATE_FAIL)
  - Verify: indexing proceeds after save, memory ID assigned
- [ ] **CHK-009**: Spec folder content mined correctly
  - Verify: title, trigger phrases, requirements extracted from spec.md
  - Verify: task status extracted from tasks.md (if present)
  - Verify: decisions extracted from decision-record.md (if present)
- [ ] **CHK-010**: Git-derived observations have unique semantic titles
  - Verify: no repeated `Tool: read` / `Tool: edit` titles in observations
- [ ] **CHK-011**: Observation dedup score >= 10/15
  - Verify: observationDedup dimension in quality breakdown

## P2 - Nice to Have

- [ ] **CHK-012**: Claude Code capture works when running under Claude Code
  - Verify: captures exchanges from `~/.claude/projects/` when available
- [ ] **CHK-013**: Enrichment completes in < 2 seconds
  - Verify: NFR-P02 met (git mining < 2s overhead)
- [ ] **CHK-014**: Quality scoring calibration distinguishes rich vs thin saves
  - Verify: generic file descriptions score lower than specific ones
- [ ] **CHK-015**: All new modules have unit tests
  - Verify: spec-folder-extractor, git-context-extractor, claude-code-capture tested

## Summary

| Priority | Total | Passed | Status |
|----------|-------|--------|--------|
| P0 | 5 | 0 | Pending |
| P1 | 6 | 0 | Pending |
| P2 | 4 | 0 | Pending |
