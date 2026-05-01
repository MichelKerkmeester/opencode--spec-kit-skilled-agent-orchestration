---
title: "Feature Specification: Template System Consolidation — Levels and Addendum to Generator"
description: "The spec-kit templates folder ships 83 .md files / ~13K LOC, materializing each level (level_1 through level_3+) as duplicate files alongside their core/+addendum/ source. Investigate replacing the per-level outputs with on-demand generation while preserving the validator, ~800 existing spec folders, phase-parent lean trio, and cross-cutting templates."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2"
trigger_phrases:
  - "template consolidation"
  - "template generator"
  - "spec-kit templates"
  - "core addendum"
  - "level templates"
  - "templates folder"
  - "compose.sh"
  - "template levels"
importance_tier: "high"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-template-levels"
    last_updated_at: "2026-05-01T07:34:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet; spec.md authored"
    next_safe_action: "Let /spec_kit:deep-research:auto loop converge; do not interfere with iteration state"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/templates/core/"
      - ".opencode/skill/system-spec-kit/templates/addendum/"
      - ".opencode/skill/system-spec-kit/templates/level_1/"
      - ".opencode/skill/system-spec-kit/templates/level_2/"
      - ".opencode/skill/system-spec-kit/templates/level_3/"
      - ".opencode/skill/system-spec-kit/templates/level_3+/"
      - ".opencode/skill/system-spec-kit/scripts/templates/compose.sh"
      - ".opencode/skill/system-spec-kit/scripts/templates/wrap-all-templates.ts"
      - ".opencode/skill/system-spec-kit/scripts/spec/create.sh"
      - ".opencode/skill/system-spec-kit/scripts/lib/template-utils.sh"
      - ".opencode/skill/system-spec-kit/scripts/rules/check-files.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-01-template-consolidation-investigation"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Can level_1/ … level_3+/ directories be eliminated entirely?"
      - "Generator implementation: shell vs TS vs JSON-driven?"
      - "Backward-compat path for ~800 existing spec folders with SPECKIT_TEMPLATE_SOURCE markers?"
    answered_questions: []
---
# Feature Specification: Template System Consolidation — Levels and Addendum to Generator

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The spec-kit templates folder maintains **83 .md files / ~13K LOC** in a CORE + ADDENDUM v2.2 architecture, but composition runs at *build time* (`compose.sh` + `wrap-all-templates.sh`) and the resulting `level_1/` … `level_3+/` outputs are committed to disk alongside their sources — duplicating intent across ~60 files and creating two surfaces that drift independently. This packet investigates whether the per-level output directories can be eliminated entirely in favor of **on-demand generation** from a single source of truth (4 CORE files + 4 ADDENDUM manifests + a level-rules JSON), without breaking the validator, ~800+ existing spec folders, the phase-parent lean trio, or cross-cutting templates.

**Key Decisions**: Whether to consolidate (CONSOLIDATE / PARTIAL / STATUS QUO); generator implementation (extend `compose.sh`, rewrite in TS, or JSON-driven); backward-compat strategy for the `<!-- SPECKIT_TEMPLATE_SOURCE -->` markers in existing spec folders.

**Critical Dependencies**: `create.sh::copy_template`, `check-files.sh` validator level rules, `wrap-all-templates.ts` ANCHOR injection semantics, `phase_parent/` lean-trio detection, ~800 existing spec folders that reference template source markers.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-01 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The current template system at `.opencode/skill/system-spec-kit/templates/` has accumulated **83 .md template files (~13K LOC)** across `core/`, `addendum/{level2-verify,level3-arch,level3-plus-govern,phase}/`, and four materialized output directories (`level_1/`, `level_2/`, `level_3/`, `level_3+/`). The CORE + ADDENDUM architecture (v2.2) was designed to be composable, yet `compose.sh` writes the composition results back to disk and consumers (`create.sh::copy_template`) read those materialized outputs — meaning every CORE or ADDENDUM edit demands a re-run of `compose.sh` AND a commit of the regenerated level files. This produces two independent drift surfaces, ~60 redundant files, and a maintenance tax disproportionate to the ~12 conceptual sections actually being authored.

### Purpose
Determine — through structured deep-research — whether the per-level output directories can be eliminated and replaced with an on-demand generator that runs at spec-folder creation time, while preserving the validator, all existing spec folders, the phase-parent lean trio, and cross-cutting templates. The packet ends with a recommendation (CONSOLIDATE / PARTIAL / STATUS QUO) and a concrete refactor plan if the recommendation is to consolidate.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Investigation of `templates/{level_1,level_2,level_3,level_3+}/` output directories — can they be removed?
- Design of a generator interface (CLI signature, output stability, hash determinism, ANCHOR-tag preservation) that produces level outputs on demand
- Definition of the minimum source-of-truth set (hypothesis: 4 CORE files + 4 ADDENDUM manifests + 1 level-rules JSON)
- Backward-compatibility path for ~800+ existing spec folders that contain `<!-- SPECKIT_TEMPLATE_SOURCE: ... -->` markers
- Validator (`check-files.sh`) integration — required-file rules per level must keep working
- Risk analysis and mitigation matrix
- Final recommendation with concrete refactor steps (if CONSOLIDATE) or justified rationale (if STATUS QUO)

### Out of Scope
- Performing the consolidation itself — this packet ends at "decision + plan"; implementation is a follow-on packet
- `templates/phase_parent/` lean-trio system — preserved as-is, evaluated only for co-location
- Cross-cutting templates (`handover.md`, `debug-delegation.md`, `research.md`, `resource-map.md`, `context-index.md`) — preserved as-is, evaluated only for co-location
- `templates/{changelog,examples,stress_test,scratch}/` and `.hashes/` — out of scope, no changes considered
- Migration of existing spec folders' `SPECKIT_TEMPLATE_SOURCE` markers (decided as part of backward-compat plan, not executed in this packet)

### Files to Change

This packet is investigation-only. The deep-research loop will produce findings and a recommendation; the actual refactor (if approved) lands in a follow-on packet. Files referenced for investigation:

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/templates/{level_1,level_2,level_3,level_3+}/` | Investigate | Candidate for elimination |
| `.opencode/skill/system-spec-kit/templates/core/` | Investigate | Source-of-truth candidate |
| `.opencode/skill/system-spec-kit/templates/addendum/` | Investigate | Source-of-truth candidate |
| `.opencode/skill/system-spec-kit/scripts/templates/compose.sh` | Investigate | Existing composer to extend or replace |
| `.opencode/skill/system-spec-kit/scripts/templates/wrap-all-templates.{ts,sh}` | Investigate | ANCHOR injection logic to preserve |
| `.opencode/skill/system-spec-kit/scripts/spec/create.sh` | Investigate | Primary template consumer |
| `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh` | Investigate | `copy_template` function |
| `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh` | Investigate | Validator level rules |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Deep-research loop converges on a clear recommendation | Final `research/research.md` contains one of: CONSOLIDATE / PARTIAL / STATUS QUO with rationale |
| REQ-002 | Backward-compatibility path identified for ~800 existing spec folders | Recommendation includes either (a) zero-migration path, OR (b) a concrete migration script and rollout sequence |
| REQ-003 | Validator (`check-files.sh`) interaction documented | Recommendation explains how level required-file rules continue to work without on-disk level outputs |
| REQ-004 | ANCHOR-tag semantic preservation verified | Generator (if recommended) must produce byte-identical or semantically-equivalent ANCHOR-wrapped output for memory-frontmatter parsers |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | File count + LOC reduction quantified | Recommendation cites concrete deltas (files removed, LOC removed, drift surface eliminated) |
| REQ-006 | Generator implementation choice justified | Shell vs TS vs JSON-driven decision with trade-off table |
| REQ-007 | Risk register populated | All P0/P1 risks from §6 and §10 have impact + likelihood + mitigation entries |
| REQ-008 | Decision record (ADR-001) finalized | `decision-record.md` ADR-001 reflects the chosen direction with reasoning, alternatives considered, and consequences |

### P2 — Nice-to-have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Hash determinism explored | Recommendation discusses whether on-demand generation can produce byte-identical output to current `level_N/` files for an audit/migration window |
| REQ-010 | Performance impact estimated | Latency added to `create.sh` invocations measured or estimated within an order of magnitude |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Deep-research loop converges within ≤10 iterations OR hits convergence threshold 0.05, whichever comes first
- **SC-002**: Final recommendation is one of {CONSOLIDATE, PARTIAL, STATUS QUO} with cited evidence (file paths, LOC counts, dependency traces)
- **SC-003**: Risk register identifies the top 5 risks with impact / likelihood / mitigation per row
- **SC-004**: Backward-compatibility decision documented — either zero-migration path proven OR concrete migration script outlined
- **SC-005**: `decision-record.md` ADR-001 captures the recommendation with rationale; `plan.md` Phase 1 onward is populated by the deep-research synthesis (currently TBD)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `compose.sh` + `wrap-all-templates.ts` ANCHOR semantics | If generator drops anchor tags, memory-frontmatter parsers break | Generator must preserve ANCHOR injection; verified via byte-diff against current level_N outputs |
| Dependency | `check-files.sh` validator | If level rules tied to on-disk outputs, eliminating them breaks `validate.sh` for all packets | Refactor validator to read level rules from a single JSON manifest (also consumed by generator) |
| Risk | ~800 existing spec folders with `<!-- SPECKIT_TEMPLATE_SOURCE -->` markers | High — markers reference deprecated paths after consolidation | Preserve marker semantics; either keep marker as descriptive comment OR migration script updates them in a single batch |
| Risk | Phase-parent lean-trio detection (`isPhaseParent()`) | Low — function reads spec folder contents, not template paths | Verify via grep that `phase_parent/` directory existence is not a precondition |
| Risk | External tools / IDE integrations grepping `templates/level_N/` | Medium — internal tooling assumed; external grep callers unknown | Audit `.opencode/`, `.claude/`, `.codex/` configs for hardcoded paths |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Generator (if recommended) must complete in <500ms for any single level — `create.sh` end-to-end must not regress beyond 1s

### Maintainability
- **NFR-M01**: Single source of truth — every conceptual section (executive summary, problem, scope, requirements, etc.) must live in exactly one file
- **NFR-M02**: Adding a new level or addendum requires changes in ≤2 files

### Reliability
- **NFR-R01**: Generator must be deterministic — identical inputs produce identical outputs across runs and across machines

---

## 8. EDGE CASES

### Phase-parent packets
- Phase parents use the lean trio (`spec.md`, `description.json`, `graph-metadata.json`) — generator must NOT inject Level 3 sections into phase-parent specs
- `isPhaseParent()` detection runs at validate time, not template-copy time — confirm assumption

### Cross-cutting templates
- `handover.md`, `debug-delegation.md`, `research.md`, `resource-map.md`, `context-index.md` are NOT level-specific — generator should leave them as plain templates copied verbatim
- Some of these are written by skill workflows mid-execution (e.g., `handover.md` by `/memory:save`), not at scaffold time — confirm copy semantics

### Legacy markers
- Existing `<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify -->` markers may differ in spacing or addendum ordering across spec folders — migration script (if needed) must tolerate variance

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: ~83 templates + 5 scripts; LOC: ~13K; Systems: validator, generator, ~800 spec folders |
| Risk | 20/25 | Auth: N, API: N, Breaking: Y (validator + spec folders); affects every future spec folder creation |
| Research | 18/20 | Deep investigation needs: ANCHOR semantics, backward-compat, generator design space |
| Multi-Agent | 5/15 | Single deep-research loop, no parallel workstreams |
| Coordination | 8/15 | Dependencies: validator team, future packet implementers |
| **Total** | **69/100** | **Level 3 confirmed** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Breaking ~800 existing spec folders with `SPECKIT_TEMPLATE_SOURCE` marker references | H | M | Preserve markers as descriptive comments; add migration script if semantics change |
| R-002 | Validator (`check-files.sh`) silently breaks for new spec folders | H | L | Refactor validator to read level rules from same JSON manifest the generator uses |
| R-003 | ANCHOR-tag semantics regression breaks memory-frontmatter parsers | H | L | Byte-diff generator output against current `level_N/` files in CI; reject regressions |
| R-004 | Phase-parent lean-trio detection relies on `phase_parent/` directory existence | M | L | Confirm via `grep -r 'phase_parent' .opencode/skill/system-spec-kit/scripts/` before refactor |
| R-005 | External tools / hardcoded paths in `.opencode`, `.claude`, `.codex` configs | M | M | Audit all runtime configs for `templates/level_N/` strings before deletion |

---

## 11. USER STORIES

### US-001: Maintainer adds a new section to all levels (Priority: P0)

**As a** spec-kit maintainer, **I want** to add a new section to all level templates by editing exactly one file, **so that** I do not have to re-run `compose.sh` and commit ~60 regenerated files for every change.

**Acceptance Criteria**:
1. Given I edit a CORE or ADDENDUM source file, When I run `create.sh`, Then the resulting spec folder reflects my edit immediately with no rebuild step

---

### US-002: Maintainer guarantees no drift between source and output (Priority: P0)

**As a** spec-kit maintainer, **I want** the level outputs to be derivable from a single source of truth, **so that** I cannot accidentally commit a CORE/ADDENDUM edit without the corresponding level output (or vice versa).

**Acceptance Criteria**:
1. Given the generator runs at spec-folder creation time, When source and output exist as separate concepts, Then the output is computed not stored, eliminating the drift surface

---

### US-003: Existing spec folders continue to validate (Priority: P0)

**As a** developer working in a pre-existing spec folder, **I want** my packet's `<!-- SPECKIT_TEMPLATE_SOURCE -->` marker to remain meaningful and `validate.sh` to keep passing, **so that** the consolidation does not break in-flight work.

**Acceptance Criteria**:
1. Given an existing Level 3 spec folder created before consolidation, When I run `validate.sh --strict`, Then it exits 0 or 1 (warnings only, no errors) with the same behavior as before consolidation

---

### US-004: New spec folder creation is no slower (Priority: P1)

**As a** developer running `create.sh`, **I want** spec folder creation to feel instant, **so that** the generator does not introduce a noticeable latency regression.

**Acceptance Criteria**:
1. Given I run `create.sh --level 3`, When the generator composes templates on demand, Then total wall-clock time stays within 1s of current behavior

---

## 12. OPEN QUESTIONS

- Can `level_1/` … `level_3+/` directories be eliminated entirely, or do some references force partial retention (audit/migration window)?
- What is the minimum source-of-truth file set? Hypothesis: 4 CORE + 4 ADDENDUM manifests + 1 level-rules JSON + cross-cutting templates unchanged
- Generator implementation: extend `compose.sh` (shell), rewrite in TS, or build a JSON-driven config system?
- How does the validator (`check-files.sh`) know required files per level if levels are no longer materialized as directories?
- Backward compatibility: do the ~800 existing spec folders need their `SPECKIT_TEMPLATE_SOURCE` markers updated, or do markers remain descriptive comments?
- Hash determinism: can on-demand generation produce byte-identical output to current `level_N/` files for an audit/migration window?
- What governance / SKILL.md / CLAUDE.md references hardcode `templates/level_N/` paths and must be updated as part of the migration?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md` (Phase 0 = research; Phases 1-N TBD pending convergence)
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md` (ADR-001 stub; finalized post-research)
- **Research Artifacts**: See `research/research.md` (produced by `/spec_kit:deep-research:auto`)
- **Parent Spec**: `../spec.md` (026-graph-and-context-optimization theme)
