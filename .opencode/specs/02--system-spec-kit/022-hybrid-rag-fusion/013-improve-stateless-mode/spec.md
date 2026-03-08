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
- Analyze the full stateless code path to identify where data is lost
- Identify all available context sources that stateless mode could tap
- Design improvements to session data collection in stateless mode
- Propose quality scoring adjustments for stateless-specific data patterns
- Create a concrete implementation plan with estimated LOC and risk

### Out of Scope
- Modifying the stateful (JSON) mode, it already works well
- Changing the quality scoring algorithm itself (only its inputs)
- Adding new CLI flags or changing the CLI interface
- Modifying the MCP tool interface

### Files to Change (Estimated)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/extractors/collect-session-data.ts` | Modify | Add richer context mining for stateless mode |
| `scripts/extractors/opencode-capture.ts` | Modify | Improve OpenCode session capture depth |
| `scripts/extractors/session-extractor.ts` | Modify | Extract more session signals |
| `scripts/extractors/file-extractor.ts` | Modify | Better file change detection |
| `scripts/loaders/data-loader.ts` | Modify | Enhance stateless data loading |
| `scripts/core/workflow.ts` | Modify | Adjust stateless flow handling |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Stateless saves produce quality score >= 50/100 | Run `generate-context.js specs/folder` and verify score in output |
| REQ-002 | No regression in stateful (JSON) mode quality | Existing stateful tests still pass |
| REQ-003 | No new CLI arguments required | Script signature unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Stateless saves produce quality score >= 60/100 on repos with git history | Run on repo with recent commits and verify |
| REQ-005 | File modifications detected and listed accurately | Compare file list in output vs `git status` |
| REQ-006 | Semantic indexing succeeds for stateless saves (no QUALITY_GATE_FAIL) | Verify indexing proceeds after save |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Stateless quality score >= 60/100 on a repo with recent git history and file changes
- **SC-002**: Semantic indexing does not skip stateless saves due to quality gate failure
- **SC-003**: No regression in stateful mode quality or behavior
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS AND DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Git history mining could be slow on large repos | Medium | Limit to last N commits or time window |
| Risk | OpenCode session log format may vary across versions | Medium | Defensive parsing with fallbacks |
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
- No OpenCode session log: Use git + spec folder contents only
- Very large git history: Cap at last 50 commits or 24 hours

### Error Scenarios
- Git not available: Skip git mining, proceed with other sources
- Spec folder is new (no existing files): Produce minimal but valid output
- Concurrent saves: No special handling needed (saves are idempotent)

### State Transitions
- Partial data collection: Produce output with available data, log warnings
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 6 files, ~200-400 LOC estimated |
| Risk | 10/25 | No breaking changes, additive improvements |
| Research | 15/20 | Need to understand quality scoring and all data sources |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- What is the minimum quality score threshold for semantic indexing to proceed?
- Can Claude Code conversation logs be accessed programmatically beyond OpenCode capture?
- What weight does each quality dimension carry in the v2 scoring formula?
