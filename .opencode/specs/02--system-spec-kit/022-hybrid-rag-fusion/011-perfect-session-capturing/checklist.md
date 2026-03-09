# Checklist: Generate-Context Pipeline Quality

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + merged-partitions | v2.2 -->

<!-- ANCHOR:part-i -->
## Part I: Audit & Remediation

# Checklist: Perfect Session Capturing

## P0 — Critical (must pass)
- [x] `npx tsc --build` completes with zero errors — VERIFIED: clean build after all 20 fixes
- [x] Session ID generation uses `crypto.randomBytes()` (not `Math.random()`) — VERIFIED: session-extractor.ts:131
- [x] No data loss in tool output handling (truncation is configurable) — VERIFIED: config.ts `toolOutputMaxLength`, opencode-capture.ts uses `CONFIG.TOOL_OUTPUT_MAX_LENGTH`
- [x] No path traversal possible in file paths — VERIFIED: data-loader.ts sanitization intact
- [x] All CRITICAL findings from audit resolved — VERIFIED: 3/3 P0 fixes implemented

## P1 — Important (should pass)
- [x] No content leakage (irrelevant content in memory files) — VERIFIED: spec-folder relevance filter in input-normalizer.ts (prior fix)
- [x] No placeholder leakage in rendered templates — VERIFIED: file-writer.ts `validateNoLeakedPlaceholders()` intact
- [x] Contamination filter covers >= 25 patterns — VERIFIED: 30+ patterns in contamination-filter.ts
- [x] All HIGH findings from audit resolved — VERIFIED: 8/8 P1 fixes implemented
- [x] Decision confidence not hardcoded — VERIFIED: evidence-based computation (50/65/70 base) in decision-extractor.ts
- [x] No-tool sessions classified correctly — VERIFIED: `total === 0` returns RESEARCH in session-extractor.ts
- [x] File action semantics preserved — VERIFIED: 5-value mapping (Created/Modified/Deleted/Read/Renamed) in file-extractor.ts
- [x] Batch write failure rolls back prior files — VERIFIED: file-writer.ts rollback loop
- [x] Postflight deltas require both-side data — VERIFIED: collect-session-data.ts type guards
- [ ] Quality scores on well-formed sessions >= 85% — PARTIAL: legacy 100/100 passes, v2 score 0.80 below 0.85 target; needs v2 calibration
- [x] No truncation artifacts in generated memory files — VERIFIED: 0 PLACEHOLDER/TRUNCATED/undefined artifacts in 503-line output
- [ ] Task extraction regex has <= 5% false positive rate — UNVERIFIED: 1 correct sample insufficient for statistical rate claim

## P2 — Desirable (nice to have)
- [x] All hardcoded magic numbers documented or configurable — VERIFIED: 7 values moved to config.ts
- [x] Consistent error handling pattern across all extractors — VERIFIED: redundant patterns cleaned
- [x] MAX_FILES_IN_MEMORY configurable — VERIFIED: config.ts `maxFilesInMemory`
- [x] HTML stripping is code-block-safe — VERIFIED: workflow.ts splits on code fences before stripping
- [x] memoryId zero handled correctly — VERIFIED: workflow.ts `!== null` check
- [x] File description dedup prefers richer content — VERIFIED: file-extractor.ts longer-is-better
- [x] Learning index weights configurable via config.ts — VERIFIED: config.ts exposes learningWeights with [0,1] validation and deep merge; collect-session-data.ts uses CONFIG.LEARNING_WEIGHTS
- [x] Phase detection improved beyond simple regex — VERIFIED: ratio-based detection adequate; no false classifications observed in runtime test
- [ ] All MEDIUM findings from audit resolved — PARTIAL: ~67 medium findings remain (see implementation-summary.md)
- [ ] Generated memory files pass manual quality inspection (5 samples) — PARTIAL: 1/5 samples verified (08-03-26_20-47__fixes-for-memory-pipeline-contamination.md — 100/100 score, correct slug, 0 artifacts, 503 lines); 4 samples remaining

<!-- /ANCHOR:part-i -->
<!-- ANCHOR:part-ii -->
## Part II: Stateless Quality Improvements

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

<!-- /ANCHOR:part-ii -->
<!-- ANCHOR:summary -->
## Summary

| Priority | Part I Total | Part I Passed | Part I Pending | Part II Total | Part II Passed | Part II Pending | Combined Total | Combined Passed | Combined Pending |
|----------|--------------|---------------|----------------|---------------|----------------|-----------------|----------------|-----------------|------------------|
| P0 | 5 | 5 | 0 | 7 | 0 | 7 | 12 | 5 | 7 |
| P1 | 12 | 10 | 2 | 10 | 0 | 10 | 22 | 10 | 12 |
| P2 | 10 | 7 | 3 | 5 | 0 | 5 | 15 | 7 | 8 |
<!-- /ANCHOR:summary -->
