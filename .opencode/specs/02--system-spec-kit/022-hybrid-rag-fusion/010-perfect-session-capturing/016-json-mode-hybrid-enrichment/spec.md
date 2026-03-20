---
title: "Feature Specification: JSON Mode Hybrid Enrichment (Phase 1B)"
description: "JSON-mode memory saves were dropping session and git metadata because file-backed inputs skipped all enrichment. This phase restores safe metadata enrichment without reintroducing V8 contamination risk."
trigger_phrases:
  - "json mode"
  - "hybrid enrichment"
  - "session metadata"
  - "git metadata"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: JSON Mode Hybrid Enrichment (Phase 1B)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

JSON-mode saves became the safe path for multi-spec sessions, but that safety came with a metadata blind spot: file-backed inputs skipped all enrichment and lost session status, git provenance, and realistic tool and message counts. This phase restores the missing metadata through a selective hybrid path that keeps risky observation injection disabled.

**Key Decisions**: Split file-source enrichment into a safe `enrichFileSourceData()` path, and let explicit JSON `session` and `git` fields override heuristics when callers know better than the pipeline.

**Critical Dependencies**: Existing git/spec-folder extractors, session aggregation logic, and input normalization all had to stay backward compatible with older JSON payloads.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-20 |
| **Branch** | `016-json-mode-hybrid-enrichment` |
| **Spec Folder** | `010-perfect-session-capturing/016-json-mode-hybrid-enrichment` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Predecessor** | `015-runtime-contract-and-indexability` |
| **Successor** | `017-json-primary-deprecation` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

JSON-mode memory saves for file-backed inputs were shipping incomplete metadata. Session state stayed stuck at heuristic defaults, git fields often came back empty, `_sourceSessionId` was missing, counts were understated, and short file descriptions stayed generic because `workflow.ts` returned early for `_source: 'file'`.

### Purpose

Restore safe metadata enrichment for JSON mode so saved context is complete enough to be useful, while still blocking the observation and `FILES` injection paths that risk V8 contamination.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `SessionMetadata` and `GitMetadata` support to the JSON-mode data model.
- Introduce `enrichFileSourceData()` to enrich file-backed inputs without injecting observations.
- Let explicit `session.*` and `git.*` fields override heuristic session aggregation.
- Update input validation and `generate-context` help text for the new JSON shape.
- Ship Wave 2 fixes for decision confidence, truncated outcomes, `git_changed_file_count`, and count override behavior.

### Out of Scope

- Full observation enrichment for file-backed JSON mode, because that would reopen the contamination path.
- Quality scorer redesign or broader retrieval-scoring changes.
- Replacing stateless or JSON-primary save contracts outside this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/types/session-types.ts` | Modify | Add `SessionMetadata`, `GitMetadata`, and supporting optional fields |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Modify | Add file-source enrichment path and Wave 2 count fixes |
| `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` | Modify | Consume explicit session and git metadata with priority rules |
| `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` | Modify | Validate new JSON blocks and decision confidence input |
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | Modify | Document the `session` and `git` JSON blocks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | File-backed JSON saves preserve explicit session status and completion metadata | `session.status` and `session.completionPercent` override heuristic values in generated output |
| REQ-002 | File-backed JSON saves preserve explicit git metadata | `git.headRef`, `git.commitRef`, and related fields flow into output when provided |
| REQ-003 | Hybrid enrichment keeps V8 safety intact | `enrichFileSourceData()` skips observations and `FILES` injection for file-backed inputs |
| REQ-004 | Existing JSON payloads remain backward compatible | Payloads without `session` or `git` blocks still produce valid output through fallback behavior |
| REQ-005 | Input validation rejects malformed `session` and `git` blocks | Arrays, primitives, and invalid numeric fields are rejected before save-time processing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | File descriptions improve when git context is available | Short descriptions can be upgraded from git commit subjects |
| REQ-007 | Spec-folder triggers and decisions still merge into file-backed context | Trigger phrases and decisions appear in enriched output without observation leakage |
| REQ-008 | Decision confidence can be caller-controlled | Explicit confidence values normalize to the stored confidence format |
| REQ-009 | `git_changed_file_count` reflects real changed-file information | Explicit counts, enrichment counts, and provenance fallback follow a stable priority chain |
| REQ-010 | Template output honors explicit message and tool counts | Session-level overrides survive template assembly for JSON mode |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: JSON-mode saves can emit `COMPLETED` and `100%` when the caller provides explicit session completion data.
- **SC-002**: Git fields and source session ID are present for file-backed JSON saves when either the caller or enrichment path can supply them.
- **SC-003**: No file-backed JSON path injects observations or raw `FILES` arrays into the V8-sensitive memory payload.
- **SC-004**: Older JSON payloads still succeed without adding the new fields.
- **SC-005**: Wave 2 fixes preserve accurate decision confidence, outcomes text, changed-file counts, and session counts.
- **SC-006**: The phase documentation validates cleanly under strict level-3 rules.

### Acceptance Scenarios

1. **Given** a file-backed JSON payload with explicit `session.status` and `session.completionPercent`, **when** save-time processing runs, **then** the generated output reflects those caller-supplied values.
2. **Given** a file-backed JSON payload with explicit git metadata, **when** the hybrid path runs, **then** the generated output keeps those git fields instead of falling back to empty defaults.
3. **Given** file-backed JSON input without explicit session or git blocks, **when** the hybrid path runs, **then** safe enrichment restores provenance and descriptions without breaking legacy fallback behavior.
4. **Given** file-backed JSON input, **when** `enrichFileSourceData()` runs, **then** observations and raw `FILES` arrays remain excluded from the final memory payload.
5. **Given** explicit confidence, changed-file counts, and session counts in the payload, **when** Wave 2 hardening logic runs, **then** those values survive normalization and final template assembly.
6. **Given** an older JSON payload that omits the new fields, **when** the save pipeline runs, **then** it still succeeds through backward-compatible defaults.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `extractGitContext()` and `extractSpecFolderContext()` remain reusable and stable | Hybrid enrichment would lose automatic provenance if they break | Keep the new path additive and allow explicit JSON metadata to override missing enrichment |
| Dependency | `collectSessionData()` still drives template assembly | Incorrect priority ordering would reintroduce bad counts or stale status | Apply explicit override ordering before heuristics and again during template assembly |
| Risk | Hybrid enrichment accidentally reintroduces observation leakage | High | Explicitly skip `gitContext.observations` and `gitContext.FILES` in the file-source path |
| Risk | Callers send partial or malformed JSON blocks | Medium | Validate object shape and numeric boundaries before processing |
| Risk | Type additions break existing callers | Medium | Keep all new fields optional and preserve legacy fallback behavior |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Hybrid enrichment must stay additive and avoid expensive new scans beyond the existing git/spec-folder extraction calls.

### Security

- **NFR-S01**: Input validation must reject malformed `session` and `git` blocks before they can influence generated context.

### Reliability

- **NFR-R01**: File-backed JSON saves must continue to work even when git extraction fails, falling back to explicit JSON metadata or legacy heuristics.

---

## 8. EDGE CASES

### Data Boundaries

- Empty `session` or `git` blocks: accept the object shape and fall back to heuristics for missing fields.
- Confidence input as `85` or `0.85`: normalize both to the same stored confidence value.
- Missing changed-file counts: fall back from explicit JSON to enrichment-derived `_gitChangedFileCount`, then to provenance counting.

### Error Scenarios

- `session` or `git` provided as arrays or primitives: reject during normalization.
- Git extraction failure in hybrid mode: degrade gracefully and keep JSON-provided git metadata if present.
- Truncated observation titles ending with `...`: use the longer narrative where available to avoid losing meaning.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 19/25 | 5 system-script files plus spec updates, Wave 1 and Wave 2 fixes |
| Risk | 21/25 | Save-time correctness, metadata priority, contamination safety |
| Research | 14/20 | Root cause already known, but Wave 2 quality gaps required follow-up analysis |
| Multi-Agent | 8/15 | This phase documents a targeted implementation, not a broad parallel rollout |
| Coordination | 10/15 | Changes cross workflow, input normalization, and extraction boundaries |
| **Total** | **72/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | File-backed JSON mode leaks observations into saved context | High | Low | Hard-block observation and `FILES` injection in `enrichFileSourceData()` |
| R-002 | Explicit session counts are overwritten during template assembly | Medium | Medium | Reassert session-derived counts after conversation-derived spreads |
| R-003 | Git metadata remains empty when enrichment fails | Medium | Medium | Let explicit JSON metadata win before fallback logic runs |
| R-004 | New validation rejects valid legacy payloads | Medium | Low | Restrict validation to new optional blocks and keep absent fields backward compatible |

---

## 11. USER STORIES

### US-001: Accurate JSON Save Metadata (Priority: P0)

**As a** calling AI composing JSON save input, **I want** my explicit session and git metadata to flow into the saved memory, **so that** the saved context matches the real session instead of a weak heuristic guess.

**Acceptance Criteria**:
1. Given a JSON payload with `session.status` and `session.completionPercent`, when save-time processing runs, then the output reflects those values.
2. Given a JSON payload with explicit git metadata, when save-time processing runs, then the output uses those values instead of empty defaults.

---

### US-002: Safe File-Backed Enrichment (Priority: P0)

**As a** maintainer of the session-capture pipeline, **I want** file-backed JSON mode to enrich only safe metadata, **so that** we regain useful provenance without reintroducing contamination.

**Acceptance Criteria**:
1. Given file-backed JSON input, when hybrid enrichment runs, then it can merge safe provenance and description improvements.
2. Given file-backed JSON input, when hybrid enrichment runs, then observations and raw `FILES` arrays are not injected.

---

### US-003: Correct Derived Counts and Outcomes (Priority: P1)

**As a** user reviewing saved memory output, **I want** counts, changed-file totals, and outcomes text to reflect the real session, **so that** the saved record is trustworthy.

**Acceptance Criteria**:
1. Given explicit message and tool counts, when template assembly runs, then those counts survive to final output.
2. Given truncated observation titles or explicit changed-file counts, when output is assembled, then the final fields preserve the more accurate source.

---

## 12. OPEN QUESTIONS

- None. The phase scope and delivery are complete, and remaining work moved into successor phases.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Specification**: See `../spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
