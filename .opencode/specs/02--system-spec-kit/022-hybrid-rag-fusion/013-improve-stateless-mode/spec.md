---
title: "Feature Specification: Improve Stateless Mode Quality"
description: "Stateless memory saves via generate-context.js produce ~30/100 quality because they lack structured session data. This spec targets 60+/100 by mining richer context from available sources."
trigger_phrases:
  - "stateless mode"
  - "memory save quality"
  - "generate-context quality"
  - "improve stateless"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Improve Stateless Mode Quality

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-03-08 |
| **Parent** | 022-hybrid-rag-fusion |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM AND PURPOSE

### Problem Statement
Stateless memory saves (when `generate-context.js` receives a spec folder path instead of a pre-built JSON file) produce quality scores around 30/100. The system falls back to OpenCode session capture which only extracts minimal conversation data (2-3 exchanges), missing observations, decisions, learning metrics, and file change context. This makes stateless saves nearly useless for future context retrieval.

### Purpose
Increase stateless mode quality scores from ~30/100 to 60+/100 by mining richer context from available sources (git history, file modifications, conversation logs, spec folder contents) without requiring callers to pre-build a JSON data file.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix existing OpenCode-path defects (field-name mismatches, prompt relevance filtering)
- Analyze the full stateless code path to identify where data is lost
- Identify all available context sources that stateless mode could tap
- Design improvements to session data collection in stateless mode
- Add provenance-aware enrichment from git and spec folder sources
- Calibrate quality scoring for stateless-specific data patterns (Phase 4, deferred)
- Create a concrete implementation plan with estimated LOC and risk

### Out of Scope
- Modifying the stateful (JSON) mode, it already works well
- Adding new CLI flags or changing the CLI interface
- Modifying the MCP tool interface

### Files to Change (Estimated)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/utils/input-normalizer.ts` | Modify | Fix snake_case/camelCase mismatch, add prompt relevance filtering |
| `scripts/extractors/collect-session-data.ts` | Modify | Backfill SPEC_FOLDER, add richer context mining |
| `scripts/extractors/opencode-capture.ts` | Modify | Improve OpenCode session capture depth |
| `scripts/extractors/file-extractor.ts` | Modify | Better file change detection, preserve ACTION field |
| `scripts/loaders/data-loader.ts` | Modify | Enhance stateless data loading |
| `scripts/core/workflow.ts` | Modify | Insert enrichment after alignment guards |
| `scripts/extractors/spec-folder-extractor.ts` | Create | Parse spec folder docs for structured context |
| `scripts/extractors/git-context-extractor.ts` | Create | Mine git status, diff, commits |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `qualityValidation.valid === true` for stateless saves | No V-rule failures (V7, V8, V9) block indexing |
| REQ-002 | No regression in stateful (JSON) mode quality | Existing stateful tests still pass |
| REQ-003 | No new CLI arguments required | Script signature unchanged |
| REQ-004 | OpenCode field-name mismatch fixed | snake_case capture fields correctly mapped to camelCase |
| REQ-005 | Cross-spec contamination bounded | Unfiltered `userPrompts` do not leak foreign spec content |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Stateless saves produce legacy quality score >= 60/100 on repos with git history | Run on repo with recent commits and verify |
| REQ-007 | File modifications detected and listed accurately | Compare file list in output vs `git status` |
| REQ-008 | Semantic indexing succeeds for stateless saves | Indexing proceeds after save, memory ID assigned |
| REQ-009 | Synthetic observations carry provenance markers | Git/spec-derived data distinguishable from live session evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `qualityValidation.valid === true` (no V-rule failures) for stateless saves
- **SC-002**: Legacy quality score >= 60/100 on repos with git history (secondary signal)
- **SC-003**: Semantic indexing does not skip stateless saves due to quality gate failure
- **SC-004**: No regression in stateful mode quality or behavior
- **SC-005**: No cross-spec contamination (V8) or generic title (V9) failures
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS AND DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Git history mining could be slow on large repos | Medium | Limit to last N commits or time window |
| Risk | OpenCode session log format may vary across versions | Medium | Defensive parsing with fallbacks |
| Risk | Cross-spec contamination via unfiltered userPrompts | High | Add prompt-level relevance filtering |
| Risk | Synthetic data treated as live session evidence | High | Provenance markers on all enriched data |
| Risk | Git commands fail on shallow/large repos (HEAD~5 unavailable) | Medium | Graceful fallback, check rev count |
| Dependency | OpenCode session log availability | High if missing | Graceful degradation to git-only signals |
| Risk | Spec folder contents may be minimal on new folders | Low | Fall back to git and file signals |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Stateless save completes in < 10 seconds (same as current)
- **NFR-P02**: Git history mining adds < 2 seconds overhead

### Reliability
- **NFR-R01**: Graceful degradation when git or session logs unavailable
- **NFR-R02**: No crashes on empty repos or missing spec folder contents
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty git history: Fall back to file-only signals
- Shallow repo (HEAD~5 unavailable): Use available rev count, graceful fallback
- No OpenCode session log: Use git + spec folder contents only
- Very large git history: Cap at last 20 commits or 24 hours
- Foreign-spec prompt leakage: Filter userPrompts by spec-folder relevance

### Error Scenarios
- Git not available: Skip git mining, proceed with other sources
- Spec folder is new (no existing files): Produce minimal but valid output
- Git rename/delete: Preserve ACTION through file extraction pipeline
- Concurrent saves: No special handling needed (saves are idempotent)

### State Transitions
- Partial data collection: Produce output with available data, log warnings
- Synthetic timestamps: Use stable ordering so enriched data does not distort lastAction/nextAction
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 8 files, ~650-1000 LOC estimated (5 phases) |
| Risk | 12/25 | Contamination and provenance risks require care |
| Research | 15/20 | 10 research agents completed, some findings stale |
| **Total** | **45/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS (RESOLVED)

- **Indexing gate**: `qualityValidation.valid` (v2 validator), not legacy score. Indexing proceeds when no V-rules fail. (Resolved by code review of workflow.ts:842-933)
- **Claude Code logs**: Yes, JSONL transcripts at `~/.claude/projects/` with full tool traces. Deferred to Phase 4 due to schema drift and privacy risks. (Resolved by R05)
- **V2 scoring**: Base 1.0, -0.25 per failed V-rule, +0.05/0.05/0.10 bonuses. Structural validity, not semantic richness. (Resolved by R06)

## 11. REVIEW FINDINGS (GPT-5.4 xhigh)

Review verdict: **REVISE** (applied). Key fixes incorporated:
1. Added Phase 0 for OpenCode-path defect hardening
2. Reframed acceptance around `qualityValidation.valid`, not just legacy score
3. Added provenance markers as named requirement
4. Added cross-spec contamination filtering as P0 requirement
5. Moved enrichment insertion after alignment guards
6. Deferred Claude Code capture and scoring calibration to later phases
