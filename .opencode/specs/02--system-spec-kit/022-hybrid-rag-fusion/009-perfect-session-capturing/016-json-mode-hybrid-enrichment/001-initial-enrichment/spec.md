---
title: "...-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/001-initial-enrichment/spec]"
description: "This phase documented a broader hybrid-enrichment design, but the shipped implementation in this tree is narrower: JSON-mode type and normalization hardening landed, while the full file-backed hybrid enrichment path did not."
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

JSON-mode saves became the safe path for multi-spec sessions, but the implementation that actually shipped in this tree is narrower than the original phase design. The code now accepts richer structured JSON summaries such as `toolCalls` and `exchanges`, but it does not ship the full file-backed hybrid enrichment path originally described here.

**Key Decisions**: Preserve the structured JSON contract improvements that shipped, and correct this spec pack so it no longer claims unshipped file-backed enrichment behavior.

**Critical Dependencies**: Existing git/spec-folder extractors, session aggregation logic, and input normalization all had to stay backward compatible with older JSON payloads.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-20 |
| **Branch** | `016-json-mode-hybrid-enrichment` |
| **Spec Folder** | `009-perfect-session-capturing/016-json-mode-hybrid-enrichment` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Predecessor** | [015-runtime-contract-and-indexability](../../015-runtime-contract-and-indexability/spec.md) |
| **Successor** | [002-scoring-and-filter](../002-scoring-and-filter/spec.md) |

---

<!-- ANCHOR:problem -->
<!-- /ANCHOR:metadata -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The original phase-016 pack had drifted away from the code that actually shipped. It described a broader file-backed hybrid enrichment path, while the live implementation in this tree only landed structured-summary support, file-backed JSON authority preservation, and later Wave 2 hardening.

### Purpose

Correct the phase record so it matches the shipped implementation, preserve the useful structured JSON contract additions that did land, and keep the Wave 2 hardening documented without implying an unimplemented hybrid branch exists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add richer structured JSON support for caller-authored session summaries such as `toolCalls` and `exchanges`.
- Harden JSON-mode normalization and help text for the shipped structured-input contract.
- Update input validation and `generate-context` help text for the new JSON shape.
- Ship Wave 2 fixes for decision confidence, truncated outcomes, `git_changed_file_count`, and count override behavior.
- Fix 5 root cause bugs (RC1-RC5) where JSON payload fields (`sessionSummary`, `triggerPhrases`, `keyDecisions`, `importanceTier`, `contextType`) were silently discarded or overridden.
- Add post-save quality review module (Step 10.5) that compares saved frontmatter against original JSON payload.
- Update the 4 tracked instruction files present in this repo (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `AGENTS_example_fs_enterprises.md`) with post-save review guidance.
- Update feature catalog and manual testing playbook with RC fixes and post-save review coverage.

### Out of Scope

- Full file-backed hybrid enrichment for JSON mode; that design did not ship in this tree.
- Quality scorer redesign or broader retrieval-scoring changes.
- Replacing stateless or JSON-primary save contracts outside this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/types/session-types.ts` | Modify | Add shipped structured JSON summary types such as `toolCalls` and `exchanges` |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Modify | Keep existing JSON/file authority behavior; no file-source enrichment path shipped here |
| `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` | Modify | Preserve the shipped Wave 2 count, confidence, and outcome handling |
| `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` | Modify | Normalize structured JSON inputs without inventing an unshipped nested metadata contract |
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | Modify | Document the shipped structured JSON fields and structured-first save workflow |
| `016-json-mode-hybrid-enrichment/*.md` | Modify | Correct the phase pack so it matches the live code and archives the non-shipped design analysis clearly |
| `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts` | Modify | RC5: Move `decisionCount` check, add `explicitContextType` param |
| `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` | Modify | RC3: fast-path keyDecisions; RC5: contextType extraction |
| `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` | Create | Post-save quality review module |
| `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `AGENTS_example_fs_enterprises.md` | Modify | Post-save review instructions in the 4 tracked instruction files present in this repo |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Structured JSON summaries remain supported | `toolCalls` and `exchanges` are accepted by the shared JSON contract |
| REQ-002 | JSON mode remains authoritative for file-backed input | File-backed JSON stays on the structured path instead of entering implicit stateless enrichment |
| REQ-003 | The spec pack must not claim unshipped hybrid enrichment behavior | This spec and its addenda describe the narrower shipped contract accurately |
| REQ-004 | Existing JSON payloads remain backward compatible | Payloads that omit the newer structured-summary fields still produce valid output |
| REQ-005 | Operator-facing documentation matches the shipped JSON contract | CLI help text, spec docs, and implementation summary describe the same structured fields and authority rules |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Wave 2 decision confidence behavior remains documented accurately | Explicit confidence handling is preserved in the implementation narrative and verification notes |
| REQ-007 | Wave 2 changed-file count behavior remains documented accurately | The stable priority chain for `git_changed_file_count` is preserved in the implementation narrative and verification notes |
| REQ-008 | Template output honors explicit message and tool counts | Session-level overrides survive template assembly for JSON mode |
| REQ-009 | Research artifacts that target the abandoned design are explicitly marked archival | The shared research note makes its historical and non-shipped scope unambiguous |
| REQ-010 | The phase pack validates as a truthful record of shipped work | Plan, tasks, checklist, ADR, summary, and research note no longer conflict about what landed |

### P0 - Wave 3 (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | JSON `sessionSummary` must appear as the preferred title candidate | `_JSON_SESSION_SUMMARY` is first in `pickPreferredMemoryTask()` candidates |
| REQ-012 | JSON `triggerPhrases` must appear in frontmatter `trigger_phrases` | Manual phrases are merged into `preExtractedTriggers` before folder token dedup |
| REQ-013 | JSON `keyDecisions` must propagate through both fast-path and slow-path | Fast-path creates `_manualDecisions` and decision-type observations |
| REQ-014 | JSON `contextType` must be honored when valid | `detectSessionCharacteristics()` accepts and validates `explicitContextType` |
| REQ-015 | Post-save quality review must detect silent field overrides | Step 10.5 compares saved frontmatter against JSON payload with severity grading |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Structured JSON fields such as `toolCalls` and `exchanges` flow through the JSON contract.
- **SC-002**: File-backed JSON remains on the structured path and does not implicitly enter stateless enrichment.
- **SC-003**: This spec pack no longer claims unshipped `enrichFileSourceData()` behavior.
- **SC-004**: Older JSON payloads still succeed without adding the new fields.
- **SC-005**: Wave 2 fixes preserve accurate decision confidence, outcomes text, changed-file counts, and session counts.
- **SC-006**: The phase documentation validates cleanly under strict level-3 rules.
- **SC-007**: JSON payload fields (`sessionSummary`, `triggerPhrases`, `keyDecisions`, `importanceTier`, `contextType`) all propagate to frontmatter correctly.
- **SC-008**: Post-save quality review reports PASSED (0 issues) when all JSON fields are correctly propagated.
- **SC-009**: Post-save quality review detects and reports silent field overrides with fix instructions.

### Acceptance Scenarios

1. **Given** a structured JSON payload with `toolCalls` and `exchanges`, **when** save-time processing runs, **then** the shared contract accepts those fields and the docs describe them consistently.
2. **Given** a file-backed JSON payload, **when** save-time processing runs, **then** it stays on the authoritative structured path and does not enter implicit stateless enrichment.
3. **Given** the phase-016 doc pack, **when** a maintainer reads spec, plan, tasks, checklist, ADR, summary, and research, **then** they see one consistent story about the narrower shipped scope.
4. **Given** Wave 2 hardening notes for confidence, changed-file counts, and explicit counts, **when** the phase documentation is reviewed, **then** those behaviors are described without inventing a non-shipped branch.
5. **Given** an older JSON payload that omits the newer structured fields, **when** the save pipeline runs, **then** it still succeeds through backward-compatible defaults.
6. **Given** the post-save review instructions, **when** operators consult the updated guidance, **then** they see the current instruction-file set without pointing at nonexistent markdown docs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `session-types.ts` shared contract remains stable | Structured-summary support would drift out of the save path if it regressed | Keep the shipped `toolCalls` and `exchanges` fields optional and documented |
| Dependency | `workflow.ts` file-backed authority check remains stable | File-backed JSON could accidentally re-enter stateless flow | Keep `_source: 'file'` authoritative and test it explicitly |
| Risk | Phase docs drift back toward the abandoned hybrid design | High | Keep the pack synchronized and archive non-shipped research clearly |
| Risk | Operator guidance diverges from the live JSON contract | Medium | Keep `generate-context.ts` help text and the phase summary aligned |
| Risk | Type additions break existing callers | Medium | Keep all new fields optional and preserve legacy fallback behavior |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
<!-- ANCHOR:requirements -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The corrected structured path must stay additive and avoid introducing a new enrichment branch or extra heavy scans.

### Security

- **NFR-S01**: The shipped structured contract must be documented truthfully so operators do not rely on fields the live code does not actually support in this phase.

### Reliability

- **NFR-R01**: File-backed JSON saves must continue to work on the authoritative structured path without silently reopening stateless reconstruction.

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries

- Older payloads without `toolCalls` or `exchanges`: continue to succeed through backward-compatible defaults.
- Confidence input as `85` or `0.85`: normalize both to the same stored confidence value.
- Missing changed-file counts: preserve the documented Wave 2 fallback chain without implying a non-shipped enrichment branch.

### Error Scenarios

- Phase readers infer a shipped `enrichFileSourceData()` branch from stale docs: prevent this by keeping the pack synchronized.
- Research findings from the abandoned design are mistaken for current regressions: prevent this with explicit archival framing.
- Truncated observation titles ending with `...`: use the longer narrative where available to avoid losing meaning.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 19/25 | 5 system-script files plus spec updates, Wave 1 and Wave 2 fixes |
| Risk | 21/25 | Save-time correctness, metadata priority, contamination safety |
| Research | 14/20 | Root cause already known, but Wave 2 quality gaps required follow-up analysis |
| Multi-Agent | 8/15 | This phase documents a targeted implementation, not a broad parallel rollout |
| Coordination | 10/15 | Changes cross workflow, input normalization, and extraction boundaries |
| **Total** | **72/100** | **Level 3** |

<!-- /ANCHOR:complexity -->
---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Phase 016 is read as shipping an unimplemented hybrid branch | High | Medium | Keep the phase pack synchronized and explicit about the narrower shipped scope |
| R-002 | Explicit message and tool counts are overwritten during template assembly | Medium | Medium | Preserve the documented Wave 2 reassertion step |
| R-003 | Operator guidance diverges from the live JSON contract | Medium | Medium | Keep CLI help text, implementation summary, and spec pack aligned |
| R-004 | New structured-summary fields break legacy payloads | Medium | Low | Keep them optional and preserve backward-compatible defaults |

---

## 11. USER STORIES

### US-001: Truthful Phase Record (Priority: P0)

**As a** maintainer reading phase 016, **I want** the spec pack to describe only the behavior that actually shipped, **so that** later phases do not build on a false premise.

**Acceptance Criteria**:
1. Given the phase docs, when I review them end to end, then they consistently describe structured-summary support rather than a non-shipped hybrid branch.
2. Given the archival research note, when I read it, then it is obvious that it analyzed the abandoned design rather than the live phase behavior.

---

### US-002: Structured JSON Contract Support (Priority: P0)

**As a** calling AI composing JSON save input, **I want** the shipped structured-summary fields to remain supported, **so that** saved context can include curated `toolCalls` and `exchanges` without reopening transcript reconstruction.

**Acceptance Criteria**:
1. Given a structured JSON payload with `toolCalls` and `exchanges`, when save-time processing runs, then the shared contract accepts those fields.
2. Given file-backed JSON input, when save-time processing runs, then it remains on the authoritative structured path.

---

### US-003: Correct Derived Counts and Outcomes (Priority: P1)

**As a** user reviewing saved memory output, **I want** counts, changed-file totals, and outcomes text to reflect the real session, **so that** the saved record is trustworthy.

**Acceptance Criteria**:
1. Given explicit message and tool counts, when template assembly runs, then those counts survive to final output.
2. Given truncated observation titles or explicit changed-file counts, when output is assembled, then the final fields preserve the more accurate source.

---

<!-- ANCHOR:questions -->
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
<!-- /ANCHOR:questions -->
