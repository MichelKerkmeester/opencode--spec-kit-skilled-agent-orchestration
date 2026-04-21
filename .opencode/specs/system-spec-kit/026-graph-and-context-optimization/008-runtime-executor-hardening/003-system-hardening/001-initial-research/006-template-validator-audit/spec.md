---
title: "Feature Specification: Template v2.2 + Validator Ruleset Joint Audit (SSK-DR-1)"
description: "Deep-review sub-packet covering the SSK-DR-1 Tier 1 item. Audit template v2.2 against validator ruleset to find orphan rules, orphan fields, duplicate coverage, and unenforced invariants. Wave 3 dispatch per ADR-001 of 019/001."
trigger_phrases:
  - "template validator audit"
  - "ssk-dr-1 joint audit"
  - "validator ruleset hygiene"
  - "template v2.2 review"
importance_tier: "critical"
contextType: "review"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/006-template-validator-audit"
    last_updated_at: "2026-04-18T17:55:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Deep-review packet scaffolded"
    next_safe_action: "Dispatch after Wave 2 convergence"
    blockers: []

---
# Feature Specification: Template v2.2 + Validator Ruleset Joint Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Originating Source** | ../../../scratch/deep-review-research-suggestions.md §6 SSK-DR-1 |
| **Wave** | 3 (skill-wide audits) |
| **Dispatch** | `/spec_kit:deep-review :auto` |

Templates under `.opencode/skill/system-spec-kit/templates/level_{1,2,3}/` and validator rules in `scripts/spec/validate.sh` are coupled by design but evolve separately. The 026 root validator run shows 22 `PHASE_LINKS` warnings (child packets 012-018 missing `| **Parent Spec** | ../spec.md |` back-references) and similar mismatches — either the templates under-emit required fields, or the validator is over-strict. No single audit has examined the full coupling end-to-end.

This packet runs the canonical sk-deep-review workflow to enumerate every template anchor/field and every validator rule, cross-reference them, and identify orphan rules (validator enforces what templates don't emit), orphan fields (templates emit what validator ignores), duplicate coverage (multiple rules checking the same invariant), and unenforced invariants.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (skill-wide hygiene; directly impacts every spec packet creation) |
| **Status** | Spec Ready, Awaiting Wave 2 Convergence |
| **Created** | 2026-04-18 |
| **Branch** | `main` |
| **Parent Packet** | `../` |
| **Iteration Budget** | 10-12 |
| **Executor** | cli-codex gpt-5.4 high fast (timeout 1800s) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Templates and validator rules coevolve but independently. Templates define what a spec doc emits; validator rules define what a spec doc must contain. When a template adds a field, the validator may not yet enforce it. When a validator rule tightens, templates may not yet emit the required field. Either mismatch produces validator noise:

- **Orphan rule**: validator demands a field that no template emits. Example: `PHASE_LINKS` demands child specs carry `| **Parent Spec** | ../spec.md |`, but the child spec template doesn't include it. Every new child packet generates a warning.
- **Orphan field**: template emits a field that no validator checks. Example: `contextType: "planning"` in old frontmatter variants — the template had it but no rule validates against it, so typos pass silently.
- **Duplicate coverage**: two validator rules check the same invariant. Example: both `SECTIONS_PRESENT` and `TEMPLATE_HEADERS` check for required `## N. FOO` sections. Wording differs slightly; validator noise is 2× for genuine misses.
- **Unenforced invariants**: documented template conventions that no validator rule enforces. Example: the CLAUDE.md "frontmatter `recent_action` must stay compact and non-narrative" — enforced by `SPECDOC_FRONTMATTER_004`, but similar compactness rules for `next_safe_action` and `blockers` may be unenforced.

### Purpose

Produce a comprehensive coverage matrix (rules × fields), identify every orphan/duplicate/unenforced case, and rank proposed changes (either template updates to emit missing fields, or validator updates to drop obsolete rules).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 In Scope

- Enumerate every HTML-comment anchor directive (pattern: ANCHOR-colon-name inside an HTML comment) and required field in every template: `level_1/`, `level_2/`, `level_3/`, CORE + ADDENDUM files.
- Enumerate every validator rule in the strict mode set: FILE_EXISTS, PLACEHOLDER_FILLED, SECTIONS_PRESENT, TEMPLATE_HEADERS, PHASE_LINKS, SPEC_DOC_INTEGRITY, ANCHORS_VALID, CROSS_ANCHOR_CONTAMINATION, POST_SAVE_FINGERPRINT, CONTINUITY_FRESHNESS, MERGE_LEGALITY, NORMALIZER_LINT, EVIDENCE_MARKER_LINT, TOC_POLICY, FRONTMATTER_MEMORY_BLOCK, SPEC_DOC_SUFFICIENCY, LEVEL_DECLARED, LEVEL_MATCH, LINKS_VALID, GRAPH_METADATA_PRESENT, PRIORITY_TAGS.
- Build coverage matrix: which rules check which template-emitted fields.
- Classify mismatches: orphan rule, orphan field, duplicate coverage, unenforced invariant.
- Rank proposed changes by impact (how many packets affected, validator noise reduction).

### 3.2 Out of Scope

- Implementing the proposed changes. Belongs to a sibling child.
- Template v3.0 evolution research (Tier 3 item SSK-RR-4 in scratch doc).
- Non-strict mode validator behavior.

### 3.3 Files to Read (review inputs)

- `.opencode/skill/system-spec-kit/templates/level_{1,2,3}/*.md`
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/skill/system-spec-kit/scripts/spec/rules/` (validator rule implementations)
- Recent 026 root validator output (already surfaces 22 PHASE_LINKS warnings + SPEC_DOC_SUFFICIENCY + FRONTMATTER_MEMORY_BLOCK issues)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Coverage matrix MUST be complete | review-report.md §Coverage Matrix has row per rule × col per template field |
| REQ-002 | Every orphan/duplicate/unenforced case MUST be enumerated | review-report.md §Mismatches lists all 4 categories non-empty if any exist |
| REQ-003 | Ranked proposed changes MUST cite affected packet count | Each proposed change row has "affected_packets" count |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | P1 findings that simplify the validator or eliminate false-positive classes MUST be flagged | review-report.md §P1 Findings section non-empty |
| REQ-005 | Template changes MUST preserve backward compatibility | Proposed changes include migration notes |
| REQ-006 | CORE + ADDENDUM architecture MUST be verified | review-report.md §Architecture section explicitly addresses this |
<!-- /ANCHOR:requirements -->

---

### Acceptance Scenarios

**Given** templates enumerated, **when** matched against validator rules, **then** every orphan/duplicate/unenforced case appears in the coverage matrix.

**Given** PHASE_LINKS warnings on the 026 root (22 instances), **when** audited, **then** the classification says either "orphan rule" (templates need updating) or "orphan field" (validator rule is over-strict).

**Given** `SPECDOC_FRONTMATTER_004` compactness rule for `recent_action`, **when** checked for peers, **then** similar rules for `next_safe_action`, `blockers`, etc. are reported as present or missing.

**Given** proposed changes, **when** ranked, **then** they include affected packet count and validator noise reduction estimate.

**Given** the CORE + ADDENDUM architecture, **when** audited, **then** the review report identifies any template architectural drift.

**Given** the iteration loop converges, **when** code-graph events emitted, **then** the graph convergence signal aligns with inline stop vote.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Coverage matrix complete.
- **SC-002**: All 4 mismatch categories enumerated.
- **SC-003**: Ranked changes with impact estimates.
- **SC-004**: Findings propagated to parent registry.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `/spec_kit:deep-review :auto` | High | Gate 4 |
| Dependency | Full validator rule implementation files | Medium | Scripts in known paths; read-only |
| Risk | Budget exhausted before full matrix | Medium | Accept partial with prioritized rule set |
<!-- /ANCHOR:risks -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability

- **NFR-R01**: Coverage matrix uses exact rule + field names; no paraphrase.

### Security

- **NFR-S01**: Review outputs stay local.

---

## L2: EDGE CASES

- If templates are in flux during audit, snapshot commit hash at audit time.
- If a validator rule has been disabled (not in strict set), note as "inactive" rather than "orphan."

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | 20+ rules × 3 template levels × many fields |
| Risk | 8/25 | Review only; no runtime impact |
| Research | 16/20 | Empirical coverage matrix |
| Multi-Agent | 4/15 | Single executor |
| Coordination | 6/15 | Wave 3 |
| **Total** | **52/100** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Q-001**: Should orphan rules be deleted or downgraded to warnings? Requires careful migration to avoid surfacing old issues.
- **Q-002**: Are `FRONTMATTER_MEMORY_BLOCK` and `SPEC_DOC_SUFFICIENCY` rules overlapping with existing anchor checks?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Parent Packet**: `../spec.md`
- **Scratch Source**: `../../../scratch/deep-review-research-suggestions.md` §6 SSK-DR-1
