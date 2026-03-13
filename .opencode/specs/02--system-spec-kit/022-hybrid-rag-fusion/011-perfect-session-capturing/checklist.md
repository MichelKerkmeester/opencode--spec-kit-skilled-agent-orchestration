# Checklist: Generate-Context Pipeline Quality

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + merged-partitions | v2.2 -->

<!-- ANCHOR:part-i -->
## Part I: Audit & Remediation

# Checklist: Perfect Session Capturing

## P0 — Critical (must pass)
- [x] `npx tsc --build` completes with zero errors [Evidence: build passed in `.opencode/skill/system-spec-kit/scripts`]
- [x] Session ID generation uses `crypto.randomBytes()` (not `Math.random()`) [Evidence: `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts` uses `crypto.randomBytes()`]
- [x] No data loss in tool output handling (truncation is configurable) [Evidence: `.opencode/skill/system-spec-kit/scripts/core/config.ts` + `.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts` use config-backed limits]
- [x] No path traversal possible in file paths [Evidence: `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts` uses sanitizePath + allowed base list]
- [x] All CRITICAL findings from audit resolved [Evidence: P0 fixes tracked as complete in `tasks.md` D1]

## P1 — Important (should pass)
- [x] No content leakage (irrelevant content in memory files) [Evidence: spec-folder relevance filtering in `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`]
- [x] No placeholder leakage in rendered templates [Evidence: `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts` `validateNoLeakedPlaceholders()`]
- [x] Contamination filter covers >= 25 patterns [Evidence: `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts` contains 30+ patterns]
- [x] All HIGH findings from audit resolved [Evidence: P1 fixes tracked as complete in `tasks.md` D2]
- [x] Decision confidence not hardcoded [Evidence: `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts` uses evidence-based defaults]
- [x] No-tool sessions classified correctly [Evidence: `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts` returns `RESEARCH` when tool count is zero]
- [x] File action semantics preserved [Evidence: `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts` includes Created/Modified/Deleted/Read/Renamed mapping]
- [x] Batch write failure rolls back prior files [Evidence: `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts` rollback loop]
- [x] Postflight deltas require both-side data [Evidence: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` checks both pre/post scores]
- [ ] Quality scores on well-formed sessions >= 85% — PARTIAL: legacy 100/100 passes, v2 score 0.80 below 0.85 target; needs v2 calibration
- [x] No truncation artifacts in generated memory files [Evidence: manual output check recorded in `implementation-summary.md`]
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

### Evidence Snapshot (2026-03-13 fix pass)
- `npm run build` passed in `.opencode/skill/system-spec-kit/scripts`
- `npx vitest run --config ../mcp_server/vitest.config.ts --root . scripts/tests/stateless-enrichment.vitest.ts scripts/tests/task-enrichment.vitest.ts` passed (`40/40`)
- Earlier verified suite still stands: `scripts/tests/memory-render-fixture.vitest.ts`, `scripts/tests/runtime-memory-inputs.vitest.ts`, `node tests/test-extractors-loaders.js` (`278 passed, 1 skipped`)
- `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/scripts` passed (`0 findings`)
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-perfect-session-capturing` passed (`0 errors, 0 warnings`)

## P0 - Blockers (MUST pass before completion)

- [ ] **CHK-001**: `qualityValidation.valid === true` for stateless saves
  - Run: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-perfect-session-capturing`
  - Verify: no V-rule failures (especially V7, V8, V9)
  - Primary acceptance gate (not legacy score)
- [ ] **CHK-002**: No regression in stateful (JSON) mode quality
  - Run: existing stateful test suite passes
  - Verify: stateful quality score unchanged from baseline
- [x] **CHK-003**: No new CLI arguments required [Evidence: loader/workflow signatures unchanged; CLI authority tests pass]
  - Verify: script signature and usage unchanged
- [x] **CHK-004**: Enrichment only activates for stateless path [Evidence: `enrichStatelessData()` returns early for `_source === 'file'` and is gated by stateless detection in workflow]
  - Verify: enrichment gated by stateless detection (matching workflow.ts runtime path)
  - Verify: when `_source === 'file'`, enrichment is skipped
- [x] **CHK-005**: No crashes on missing git or empty/sparse spec folders [Evidence: `scripts/tests/stateless-enrichment.vitest.ts` validates no-git fallback and sparse spec-folder extraction without crashing]
  - Test: run on repo with no git, run on spec folder with only description.json
- [x] **CHK-006**: OpenCode snake_case/camelCase field mismatch fixed (Phase 0) [Evidence: mapping in `transformOpencodeCapture()`]
  - Verify: `opencode-capture.ts` snake_case fields correctly mapped in `input-normalizer.ts`
  - Test: OpenCode capture with snake_case metadata produces valid observations
- [ ] **CHK-007**: Cross-spec contamination bounded (Phase 0) — PARTIAL: targeted regression in `scripts/tests/stateless-enrichment.vitest.ts` filters unrelated prompts and keeps spec-relevant content; direct OpenCode-mode validation remains blocked by `NO_DATA_AVAILABLE`
  - Verify: `userPrompts` filtered by spec-folder relevance
  - Test: mixed-spec OpenCode session does not leak foreign content
  - Verify: no V8 failures on cross-spec sessions

## P1 - Required (complete OR approved deferral)

- [ ] **CHK-008**: Stateless save produces legacy quality score >= 60/100 on repos with git history
  - Run on repo with recent commits
  - Verify: quality score >= 60 in output (secondary signal)
- [ ] **CHK-009**: File modifications detected accurately from git — PARTIAL: git scoping/path behavior covered in `scripts/tests/stateless-enrichment.vitest.ts`; end-to-end runtime comparison against live `git status` output remains pending
  - Compare `FILES` in output vs `git status` output
- [ ] **CHK-010**: Semantic indexing succeeds for stateless saves
  - Verify: indexing proceeds after save, memory ID assigned
- [x] **CHK-011**: Spec folder content mined correctly [Evidence: `scripts/tests/stateless-enrichment.vitest.ts` covers merged-frontmatter trigger phrases, files-to-change mining, task completion observations, and decision extraction]
  - Verify: title, trigger phrases, requirements extracted from spec.md
  - Verify: task status extracted from tasks.md (if present)
  - Verify: decisions extracted from decision-record.md (if present)
- [x] **CHK-012**: Synthetic observations carry provenance markers [Evidence: `_provenance: 'git'` and `_provenance: 'spec-folder'` in extractor outputs]
  - Verify: git-derived items have `_provenance: 'git'`
  - Verify: spec-derived items have `_provenance: 'spec-folder'`
  - Verify: downstream extractors do not treat synthetic data as live session evidence
- [ ] **CHK-013**: Git-derived observations have unique semantic titles
  - Verify: no repeated generic titles in observations
  - Check: `buildToolObservationTitle()` output for dedup ratio >= 0.7
- [ ] **CHK-014**: Observation dedup score >= 10/15
  - Verify: observationDedup dimension in quality breakdown
- [x] **CHK-015**: Enrichment runs AFTER contamination/alignment guards [Evidence: workflow insertion after stateless pre-check + spec resolution]
  - Verify: `enrichStatelessData()` insertion point is after workflow.ts:472
  - Test: synthetic files do not mask cross-spec contamination detection
- [x] **CHK-016**: Git ACTION field preserved through file extraction [Evidence: git extractor emits ACTION, file extractor preserves ACTION mapping]
  - Verify: rename/delete actions survive from git-context-extractor to render
  - Test: `file-extractor.ts` passes ACTION field through
- [x] **CHK-017**: Shallow repos handled gracefully [Evidence: single-commit repo handling exercised in git-scoping test and no-git degradation validated in `scripts/tests/stateless-enrichment.vitest.ts`]
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
- [x] **CHK-021**: All new modules have unit tests [Evidence: targeted regression coverage in `scripts/tests/stateless-enrichment.vitest.ts` + `scripts/tests/task-enrichment.vitest.ts`; Vitest boundary suite `40/40`]
  - Verify: spec-folder-extractor, git-context-extractor tested
  - Verify: field-mapping and prompt-filtering in input-normalizer tested
- [ ] **CHK-022**: Synthetic timestamps do not distort downstream ordering — PARTIAL: project-state snapshot now prefers live observations over synthetic enrichment (`scripts/tests/stateless-enrichment.vitest.ts`), but direct-mode timestamp-order validation remains blocked by `NO_DATA_AVAILABLE`
  - Verify: lastAction/nextAction not affected by enriched observations

<!-- /ANCHOR:part-ii -->
<!-- ANCHOR:summary -->
## Summary

| Priority | Part I Total | Part I Passed | Part I Pending | Part II Total | Part II Passed | Part II Pending | Combined Total | Combined Passed | Combined Pending |
|----------|--------------|---------------|----------------|---------------|----------------|-----------------|----------------|-----------------|------------------|
| P0 | 5 | 5 | 0 | 7 | 4 | 3 | 12 | 9 | 3 |
| P1 | 12 | 10 | 2 | 10 | 5 | 5 | 22 | 15 | 7 |
| P2 | 10 | 7 | 3 | 5 | 1 | 4 | 15 | 8 | 7 |
<!-- /ANCHOR:summary -->
