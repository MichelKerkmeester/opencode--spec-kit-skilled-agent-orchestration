---
title: "Feature Specification: description.json Rich-Content Regen Strategy (RR-2)"
description: "Deep-research sub-packet covering the RR-2 Tier 1 item. Research preservation strategies for hand-authored rich content in description.json under canonical-save regen. Wave 2 dispatch per ADR-001 of 019/001."
trigger_phrases:
  - "description regen strategy"
  - "rr-2 description preservation"
  - "canonical save overwrite"
  - "rich content regen research"
importance_tier: "critical"
contextType: "research"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/001-initial-research/004-description-regen-strategy"
    last_updated_at: "2026-04-18T17:50:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Research packet scaffolded"
    next_safe_action: "Dispatch after Wave 1 convergence"
    blockers: []

---
# Feature Specification: description.json Rich-Content Regen Strategy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Originating Source** | ../../../scratch/deep-review-research-suggestions.md §3 RR-2 |
| **Wave** | 2 (026-scoped research) |
| **Dispatch** | `/spec_kit:deep-research :auto` |

Root implementation-summary `§Known Limitations #4` flags that the H-56-1 fix triggers `generate-description.js` auto-regen, overwriting hand-authored rich content with the minimal template. Observed on 017's own description.json during implementation. This is a recurring pain point: every rich description.json in the 026 tree is one canonical-save away from getting clobbered. Phase 018 R4 added parse/schema split + merge-preserving repair in response, but did not solve the regen-overwrite root cause.

This packet researches four candidate preservation strategies (opt-in regen flag, hash-based change detection, schema-versioned authored layer with derived overlay, field-level merge policy by content-type marker), audits all 86 description.json files in the 026 tree for authored-content patterns, and recommends one strategy with migration path + validation fixtures.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (recurring UX regression; data-loss risk) |
| **Status** | Spec Ready, Awaiting Wave 1 Convergence |
| **Created** | 2026-04-18 |
| **Branch** | `main` |
| **Parent Packet** | `../` |
| **Iteration Budget** | 8-12 |
| **Executor** | cli-codex gpt-5.4 high fast (timeout 1800s) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The canonical-save pipeline calls `generate-description.js` to refresh `description.json`. Before the H-56-1 fix, the dead-code guard prevented this path from firing on most saves. After H-56-1, the path fires consistently — and the regen implementation uses a minimal template that overwrites any hand-authored fields. Users authoring rich content (extended `description`, custom `keywords`, hand-curated `memoryNameHistory`, packet-specific fields) lose their work every canonical save.

Phase 018 R4 added a parse/schema split: malformed JSON is distinguished from schema-invalid JSON, and schema-invalid files get a merge-preserving repair helper. But the regen path still writes the minimal template for the valid-but-rich case. R4 didn't change the regen decision — it only improved repair of already-broken files.

Four strategy candidates:

1. **Opt-in regen flag**: `description.json.regen_policy: "preserve" | "overwrite"`. Users mark packets that should keep authored content.
2. **Hash-based change detection**: Compute content hash of authored fields; only regen if hash matches the last-auto-generated value (indicating no human edits since).
3. **Schema-versioned authored layer**: Separate `description.json.derived.*` (safe to regen) from `description.json.authored.*` (never regen). Merge at consumer-read time.
4. **Field-level merge policy**: Each field has a `source` marker (`derived` / `authored` / `either`); regen only touches `derived` fields.

### Purpose

Evaluate all four strategies empirically against the 86 description.json files in 026's tree. Recommend one strategy with concrete migration path, schema changes, and validation fixtures that prevent regression after implementation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 In Scope

- Catalogue all fields across 86 description.json files in 026's tree (including nested phase packets).
- Classify each field as "always derived" (safe to regen) vs "can be authored" (must preserve).
- Evaluate all four candidate strategies against the cataloged field set.
- Audit the 29-of-86 "rich" description.json files 018 research.md §5 identified.
- Recommend one strategy with:
  - Schema changes (TypeScript types + Zod schema updates if any)
  - Migration path (how to convert existing 86 files to the new schema without data loss)
  - Validation fixtures (how to prevent regression)
- Compare vs rejected alternatives; include rationale.

### 3.2 Out of Scope

- Implementing the recommended strategy. Belongs to a sibling child (`019/002-description-regen-hardening` or similar).
- Changes to graph-metadata.json regen (different code path; own packet if needed).
- Archive/revive policy for packets (`z_archive/`, `z_future/`).

### 3.3 Files to Read (research inputs)

- `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts`
- 86 description.json files under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/**/description.json`
- Phase 018 R4 code: `description-repair.ts` module + `generate-description.ts` parse/schema split
- Phase 018 research.md §5 (lists 29 rich description.json files)
- 018 Wave B implementation commits
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Catalogue MUST cover all 86 description.json files | research.md §Field Catalogue cites 86 files audited |
| REQ-002 | All four candidate strategies MUST be evaluated with concrete examples | research.md §Strategy Evaluation has one subsection per strategy |
| REQ-003 | Recommended strategy MUST include migration path | research.md §Recommendation §Migration Path non-empty |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Field classification must be exhaustive | Every unique field name appears in §Field Catalogue |
| REQ-005 | Validation fixture design must prevent regression | research.md §Validation Fixtures lists concrete test cases |
| REQ-006 | Rejected alternatives must have explicit rationale | research.md §Rejected Alternatives non-empty with reasons |
<!-- /ANCHOR:requirements -->

---

### Acceptance Scenarios

**Given** the field catalogue is written, **when** a reader reviews it, **then** they can identify which fields are safe to regen and which must preserve.

**Given** all four strategies evaluated, **when** a decision needs making, **then** the comparison table makes trade-offs explicit.

**Given** the recommendation is chosen, **when** the migration plan is read, **then** a single engineer can execute it without losing existing authored content.

**Given** the validation fixtures are designed, **when** a future save overwrites an authored field, **then** the fixture reproduces the regression.

**Given** the recommendation impacts 29 rich description.json files, **when** migration runs, **then** all 29 are handled with explicit cutover or preserve-as-is instructions.

**Given** the iteration loop converges, **when** the parent registry receives this packet's findings, **then** they form a coherent "description.json preservation" cluster.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Field catalogue covers 86 files.
- **SC-002**: One strategy recommended with migration path.
- **SC-003**: Validation fixtures designed.
- **SC-004**: Findings propagated to parent registry.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `/spec_kit:deep-research :auto` | High | Gate 4 |
| Dependency | 86 description.json files | High | Read-only audit input |
| Risk | Strategy collides with 018 R4 repair helper | Medium | Research must check compatibility; document interaction |
<!-- /ANCHOR:risks -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability

- **NFR-R01**: Migration path MUST be reversible.
- **NFR-R02**: Recommendation MUST specify schema version bump if introduced.

### Security

- **NFR-S01**: Research stays local.

---

## L2: EDGE CASES

- Files with no rich content: should work transparently under any strategy.
- Files with broken JSON: handled by 018 R4 repair helper; recommendation must not regress that path.

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | 86 files audited + 4 strategies evaluated |
| Risk | 10/25 | Data-loss risk if migration botched |
| Research | 16/20 | Empirical evaluation across files |
| Multi-Agent | 4/15 | Single executor |
| Coordination | 8/15 | Wave-2 position |
| **Total** | **54/100** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Q-001**: Should the recommendation include a transition mode (both old and new schemas accepted) to ease migration, or hard-cut to the new schema?
- **Q-002**: Does the 018 R4 description-repair-helper need updating to coexist with the new preservation strategy, or is it orthogonal?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Parent Packet**: `../spec.md`
- **Scratch Source**: `../../../scratch/deep-review-research-suggestions.md` §3 RR-2
