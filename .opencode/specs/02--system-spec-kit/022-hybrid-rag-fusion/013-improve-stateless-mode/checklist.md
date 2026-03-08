---
title: "Verification Checklist: Improve Stateless Mode Quality"
description: "P0/P1/P2 verification items for stateless mode quality improvements. Primary gate: qualityValidation.valid. Secondary: legacy score 60+/100."
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

- [ ] **CHK-001**: `qualityValidation.valid === true` for stateless saves
  - Run: `node generate-context.js .opencode/specs/.../013-improve-stateless-mode`
  - Verify: no V-rule failures (especially V7, V8, V9)
  - Primary acceptance gate (not legacy score)
- [ ] **CHK-002**: No regression in stateful (JSON) mode quality
  - Run: existing stateful test suite passes
  - Verify: stateful quality score unchanged from baseline
- [ ] **CHK-003**: No new CLI arguments required
  - Verify: script signature and usage unchanged
- [ ] **CHK-004**: Enrichment only activates for stateless path
  - Verify: enrichment gated by stateless detection (matching workflow.ts:447)
  - Verify: when `_source === 'file'`, enrichment is skipped
- [ ] **CHK-005**: No crashes on missing git or empty spec folders
  - Test: run on repo with no git, run on spec folder with only description.json
- [ ] **CHK-006**: OpenCode snake_case/camelCase field mismatch fixed (Phase 0)
  - Verify: `opencode-capture.ts` snake_case fields correctly mapped in `input-normalizer.ts`
  - Test: OpenCode capture with snake_case metadata produces valid observations
- [ ] **CHK-007**: Cross-spec contamination bounded (Phase 0)
  - Verify: `userPrompts` filtered by spec-folder relevance
  - Test: mixed-spec OpenCode session does not leak foreign content
  - Verify: no V8 failures on cross-spec sessions

## P1 - Required (complete OR approved deferral)

- [ ] **CHK-008**: Stateless save produces legacy quality score >= 60/100 on repos with git history
  - Run on repo with recent commits
  - Verify: quality score >= 60 in output (secondary signal)
- [ ] **CHK-009**: File modifications detected accurately from git
  - Compare `FILES` in output vs `git status` output
- [ ] **CHK-010**: Semantic indexing succeeds for stateless saves
  - Verify: indexing proceeds after save, memory ID assigned
- [ ] **CHK-011**: Spec folder content mined correctly
  - Verify: title, trigger phrases, requirements extracted from spec.md
  - Verify: task status extracted from tasks.md (if present)
  - Verify: decisions extracted from decision-record.md (if present)
- [ ] **CHK-012**: Synthetic observations carry provenance markers
  - Verify: git-derived items have `_provenance: 'git'`
  - Verify: spec-derived items have `_provenance: 'spec-folder'`
  - Verify: downstream extractors do not treat synthetic data as live session evidence
- [ ] **CHK-013**: Git-derived observations have unique semantic titles
  - Verify: no repeated generic titles in observations
  - Check: `buildToolObservationTitle()` output for dedup ratio >= 0.7
- [ ] **CHK-014**: Observation dedup score >= 10/15
  - Verify: observationDedup dimension in quality breakdown
- [ ] **CHK-015**: Enrichment runs AFTER contamination/alignment guards
  - Verify: `enrichStatelessData()` insertion point is after workflow.ts:472
  - Test: synthetic files do not mask cross-spec contamination detection
- [ ] **CHK-016**: Git ACTION field preserved through file extraction
  - Verify: rename/delete actions survive from git-context-extractor to render
  - Test: `file-extractor.ts` passes ACTION field through
- [ ] **CHK-017**: Shallow repos handled gracefully
  - Test: repo with < 5 commits does not crash on `HEAD~5`
  - Verify: git-context-extractor checks available rev count first

## P2 - Nice to Have

- [ ] **CHK-018**: Claude Code capture works when running under Claude Code (Phase 3, deferred)
  - Verify: captures exchanges from `~/.claude/projects/` when available
  - Verify: `thinking` blocks excluded from extraction
  - Verify: exact project + sessionId matching prevents cross-project contamination
- [ ] **CHK-019**: Enrichment completes in < 2 seconds
  - Verify: NFR-P02 met (git mining < 2s overhead)
- [ ] **CHK-020**: Quality scoring calibration distinguishes rich vs thin saves (Phase 4, deferred)
  - Verify: generic file descriptions score lower than specific ones
- [ ] **CHK-021**: All new modules have unit tests
  - Verify: spec-folder-extractor, git-context-extractor tested
  - Verify: field-mapping and prompt-filtering in input-normalizer tested
- [ ] **CHK-022**: Synthetic timestamps do not distort downstream ordering
  - Verify: lastAction/nextAction not affected by enriched observations

## Summary

| Priority | Total | Passed | Status |
|----------|-------|--------|--------|
| P0 | 7 | 0 | Pending |
| P1 | 10 | 0 | Pending |
| P2 | 5 | 0 | Pending |
