---
title: "Feature Specification: Post-Save Render Fixes"
description: "Level 3 sub-phase for nine render-layer fixes in the memory-save pipeline so compact-wrapper saves match the 006 wrapper contract."
trigger_phrases:
  - "009 post-save render fixes"
  - "memory save render fixes"
  - "canonical sources render lane"
  - "post-save wrapper contract"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/009-post-save-render-fixes"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["spec.md"]

---
# Feature Specification: Post-Save Render Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Packet `009-post-save-render-fixes` repairs the nine systematic render-layer defects still visible in the 2026-04-09 `005-code-graph-upgrades` memory saves: filename-garbage titles, empty canonical sources, zeroed file counts, prose-bigram trigger noise, duplicated distinguishing evidence, stale phase and status capture, missing causal link auto-population, self-referential `parent_spec`, and the unresolved two-scorer naming conflict. The goal is to make fresh memory saves honestly satisfy the compact-wrapper contract defined by the sibling `001/.../006-research-memory-redundancy` packet without reopening the wrapper-template body or the Phase 6 sanitizer and duplication-review work that shipped in commit `7f0c0572a`. [SOURCE: ../../005-code-graph-upgrades/memory/09-04-26_08-46__created-the-new-level-3-planning-packet-014-code.md:2-35] [SOURCE: ../../005-code-graph-upgrades/memory/09-04-26_10-30__implemented-the-014-code-graph-upgrade-runtime.md:2-39] [SOURCE: ../../001-research-graph-context-systems/006-research-memory-redundancy/spec.md:44-58] [SOURCE: ../../001-research-graph-context-systems/006-research-memory-redundancy/research/research.md:103-120]

**Key Decisions**: Keep `009` scoped to render-layer helpers only, leave the wrapper-template body and Phase 6 sanitizer and `DUP1-DUP7` reviewer checks untouched, and fix all nine render defects in one bounded packet because they all corrupt the same saved wrapper surface. [SOURCE: ../../003-memory-quality-issues/006-memory-duplication-reduction/implementation-summary.md:25-67] [SOURCE: ../../003-memory-quality-issues/spec.md:62-71]

**Critical Dependencies**: `003/006-memory-duplication-reduction` is a soft predecessor because it defines the compact-wrapper runtime and the meaning of canonical narrative ownership. There are no hard runtime-packet dependencies, and `009` must not touch packets `005-014` in the 026 runtime train. [SOURCE: ../../003-memory-quality-issues/006-memory-duplication-reduction/implementation-summary.md:25-63] [SOURCE: ../../003-memory-quality-issues/spec.md:94-99]

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-04-09 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Predecessor** | `008-input-normalizer-fastpath-fix` |
| **Successor** | `010-memory-save-heuristic-calibration` |
| **Motivating Audit** | `005-code-graph-upgrades/memory/*` plus the manually patched positive reference at `026-graph-and-context-optimization/memory/09-04-26_07-37__...` |
<!-- /ANCHOR:metadata -->


---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The shipped compact-wrapper runtime from `003/006` fixed duplication and contract shape, but the live saves from packet `014` still show nine render defects that make the wrapper dishonest or incomplete:

1. The saved title appends a filename slug suffix instead of a meaningful title-only label. [SOURCE: ../../005-code-graph-upgrades/memory/09-04-26_08-46__created-the-new-level-3-planning-packet-014-code.md:2-2] [SOURCE: ../../005-code-graph-upgrades/memory/09-04-26_10-30__implemented-the-014-code-graph-upgrade-runtime.md:2-2]
2. `## CANONICAL SOURCES` renders its heading and explainer but no document links. [SOURCE: ../../005-code-graph-upgrades/memory/09-04-26_08-46__created-the-new-level-3-planning-packet-014-code.md:107-111] [SOURCE: ../../005-code-graph-upgrades/memory/09-04-26_10-30__implemented-the-014-code-graph-upgrade-runtime.md:107-113]
3. `captured_file_count`, `filesystem_file_count`, and `git_changed_file_count` stay `0` despite file-changing sessions. [SOURCE: ../../005-code-graph-upgrades/memory/09-04-26_08-46__created-the-new-level-3-planning-packet-014-code.md:32-34] [SOURCE: ../../005-code-graph-upgrades/memory/09-04-26_10-30__implemented-the-014-code-graph-upgrade-runtime.md:36-38]
4. Trigger phrases contain prose bigrams like `lane detector` and `taxonomy additive` instead of retrieval-quality phrases only. [SOURCE: ../../005-code-graph-upgrades/memory/09-04-26_10-30__implemented-the-014-code-graph-upgrade-runtime.md:11-29]
5. `## DISTINGUISHING EVIDENCE` repeats paraphrased or identical bullets instead of compact anchored evidence. [SOURCE: ../../005-code-graph-upgrades/memory/09-04-26_10-30__implemented-the-014-code-graph-upgrade-runtime.md:129-137]
6. The implementation save still reports `Session Status: IN_PROGRESS`, `Completion %: 95%`, and `Phase: RESEARCH` after the runtime commit landed. [SOURCE: ../../005-code-graph-upgrades/memory/09-04-26_10-30__implemented-the-014-code-graph-upgrade-runtime.md:87-101]
7. Related saves in the same packet do not auto-populate causal lineage. [SOURCE: ../../005-code-graph-upgrades/memory/09-04-26_08-46__created-the-new-level-3-planning-packet-014-code.md:227-239] [SOURCE: ../../005-code-graph-upgrades/memory/09-04-26_10-30__implemented-the-014-code-graph-upgrade-runtime.md:231-243]
8. `parent_spec` defaults to the current `spec_folder`, producing a self-reference instead of a parent packet or null. [SOURCE: ../../005-code-graph-upgrades/memory/09-04-26_10-30__implemented-the-014-code-graph-upgrade-runtime.md:294-305]
9. The manually patched 026 deep-review save proves the intended output surface is achievable and clarifies the expected title, canonical sources, and anchored evidence quality. [SOURCE: ../../memory/09-04-26_07-37__ran-15-deep-review-iterations-on-the-full-026.md:2-25] [SOURCE: ../../memory/09-04-26_07-37__ran-15-deep-review-iterations-on-the-full-026.md:134-181]

### Purpose

Fix the render layer of `generate-context.js` and its extractor helpers so a fresh save produces a truthful compact wrapper: clear title, populated canonical sources, accurate file counts, clean trigger phrases, deduplicated distinguishing evidence, truthful phase and status, meaningful lineage fields, and unambiguous quality-score names. This packet aligns the runtime with the `006-research-memory-redundancy` wrapper contract without reopening the broader collector-to-contract data-flow work already owned by `003/006`. [SOURCE: ../../001-research-graph-context-systems/006-research-memory-redundancy/spec.md:44-58] [SOURCE: ../../001-research-graph-context-systems/006-research-memory-redundancy/research/research.md:103-120]
<!-- /ANCHOR:problem -->

> **Scope fence:** Packet `009` only fixes render-layer helpers in `scripts/core/`, `scripts/extractors/`, and `scripts/memory/generate-context.ts`, plus additive template rendering needed for canonical sources. It does not rewrite the wrapper-template body contract, the single-word sanitizer, the Phase 6 duplication reviewer checks, or any 026 runtime packet.

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Title generation cleanup for the saved dashboard title.
- Canonical sources auto-discovery and render population.
- Structured-JSON file capture plumbing and file-count rendering.
- Trigger-phrase render cleanup that removes prose-bigram noise from saved trigger lists.
- Distinguishing-evidence deduplication and anchor-aware selection.
- Truthful phase and session-status rendering from payload or git-derived state.
- Auto-population of `causal_links.derived_from` and planning-to-implementation `supersedes`.
- Parent-packet resolution for `parent_spec`.
- Quality-score field-name disambiguation between rendered-memory quality and input completeness.

### Out of Scope

- Modifying the wrapper-template body or compact-wrapper structure shipped by `003/006`.
- Modifying the single-word junk trigger sanitizer from Phase 6.
- Modifying the post-save reviewer `DUP1-DUP7` duplication checks.
- Touching packets `005` through `014` in the 026 runtime packet train.
- Reworking collector to workflow to contract data flow beyond the render helper boundaries needed to populate the saved output correctly.
- Rewriting `generate-context.ts` wholesale or introducing a new subsystem.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/core/title-builder.ts` | Modify | Remove or gate the filename-garbage suffix from rendered dashboard titles. |
| `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts` | Modify | Rename rendered frontmatter score fields to `render_quality_score` and `render_quality_flags`. |
| `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts` | Modify | Add parent-spec resolution and causal-link auto-population helpers. |
| `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` | Modify | Emit renamed render/input score wording without changing Phase 6 duplication checks. |
| `.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts` | Modify | Rename the rendered-memory score field to disambiguate it from extractor completeness scoring. |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Modify | Wire corrected trigger, canonical-source, lineage, parent-spec, and score fields into the render path. |
| `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` | Modify | Fix canonical-source discovery, file capture, distinguishing evidence, and phase/status derivation. |
| `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts` | Modify | Ensure structured payload file lists contribute accurate counts in JSON mode. |
| `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts` | Modify | Detect the canonical packet docs needed for non-empty canonical-source rendering. |
| `.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts` | Modify | Rename input completeness scoring output to avoid the generic `qualityScore` conflict. |
| `.opencode/skill/system-spec-kit/templates/context_template.md` | Modify additively only if required | Render discovered canonical source entries without changing other sections. |
| `.opencode/skill/system-spec-kit/scripts/tests/*.vitest.ts` | Create/Modify | Add one focused test per lane plus the round-trip wrapper-contract verification. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Saved titles must no longer append the `[folder/file-stem]` garbage suffix by default. | A focused title-builder test proves the saved title lacks the filename suffix pattern while preserving a meaningful base title. |
| REQ-002 | `## CANONICAL SOURCES` must auto-populate authoritative packet docs when they exist. | Discovery returns the expected canonical doc links in priority order, the template renders them, and a round-trip memory save shows non-empty canonical sources. |
| REQ-003 | Structured JSON saves must populate file counts from real modified files or a git fallback. | A focused collector test proves `captured_file_count`, `filesystem_file_count`, and `git_changed_file_count` match payload or fallback data, and the round-trip save shows the expected counts. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Saved trigger phrases must stop carrying prose bigram noise. | A focused extractor test proves explicit trigger phrases survive and synthetic prose bigrams do not appear in the saved trigger list. |
| REQ-005 | Distinguishing evidence must deduplicate paraphrase or exact repeats and prefer anchor-bearing bullets. | A focused evidence test proves duplicates are removed, anchored bullets are preferred, and the rendered save contains only unique evidence bullets. |
| REQ-006 | Phase and session status must follow explicit payload fields or sensible git-derived truth instead of stale defaults. | A focused collector test proves payload `phase` and `status` win, and fallback derivation is no longer stuck at `RESEARCH` / `IN_PROGRESS`. |

### P2 - Nice-to-have (ship if low-risk)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Later saves in the same packet should auto-populate lineage through `causal_links.derived_from`, and planning-to-implementation transitions should also set `supersedes`. | A focused lineage test proves a second save points at the prior session id and adds `supersedes` for the planning-to-implementation upgrade case. |
| REQ-008 | `parent_spec` must resolve to the parent packet or null, never to the same `spec_folder`. | A focused resolver test proves child packets get their parent path and top-level packets return null or omit the field. |
| REQ-009 | The two quality scorers must use distinct field names that explain what each score measures. | Focused scorer tests prove the rendered-memory score uses `render_quality_score`, metadata uses `input_completeness_score`, and no generic `quality_score` naming conflict remains between the two systems. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fresh round-trip save produces a non-garbage title and populated canonical sources.
- **SC-002**: The same save renders truthful file counts, trigger phrases, evidence bullets, and continuation state.
- **SC-003**: Metadata surfaces now carry non-self-referential `parent_spec`, truthful lineage fields, and disambiguated quality-score names.
- **SC-004**: Existing Phase 6 regression suites remain green, proving `009` fixed render defects without reopening `003/006` scope.
<!-- /ANCHOR:success-criteria -->

### Acceptance Scenarios

**Given** a packet has canonical docs and a structured JSON payload, **when** a memory save is rendered, **then** the saved wrapper includes canonical doc links, accurate file counts, truthful phase and status, and clean trigger phrases.

**Given** the packet already contains an earlier planning save, **when** an implementation save is rendered, **then** the later save derives lineage from the earlier session and does not self-reference its own packet as `parent_spec`.

**Given** both the extractor scorer and rendered-memory scorer run on the same save, **when** operators inspect the output, **then** they can distinguish input completeness from rendered wrapper quality by field name alone.

**Given** a packet only has a subset of canonical docs, **when** discovery runs, **then** the saved wrapper renders only the docs that exist and does not leave the canonical section empty.

**Given** a structured payload already provides `phase`, `status`, and `filesModified`, **when** the collector runs, **then** those explicit values win over stale or generic fallbacks.

**Given** the save is the first memory in a packet, **when** lineage and parent resolution run, **then** `derived_from` stays empty and `parent_spec` resolves to the real parent packet or null.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `003/006` remains the compact-wrapper authority | High | Keep edits additive and limited to render helpers plus required template population. |
| Risk | Fixing trigger, evidence, or lineage helpers accidentally reopens Phase 6 reviewer or sanitizer behavior | High | Do not touch `DUP1-DUP7` logic or the single-word junk filter; keep regression suites green. |
| Risk | Canonical-source discovery produces broken links for nested packet paths | Medium | Use relative links from the saved memory file and verify them in the round-trip test. |
| Risk | Git-state fallback for phase/status or file counts is too coarse in clean worktrees | Medium | Prefer explicit payload fields first, then use bounded git-derived heuristics only as fallback. |
| Risk | Score renaming breaks downstream tooling expecting the old names | Medium | Keep the scoring math intact, rename surfaces consistently, and document both meanings in reviewer output. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Each bug fix must stay in an existing helper or render binding rather than introducing a new pipeline layer.
- **NFR-M02**: Tests must map one-to-one to the nine requested lanes plus the round-trip wrapper-contract test.

### Reliability
- **NFR-R01**: A structured JSON save should render the same canonical sources, counts, and trigger list on repeated runs against the same packet state.
- **NFR-R02**: The round-trip verification must prove the saved file satisfies the wrapper contract without manual patching.

### Performance
- **NFR-P01**: Canonical-source discovery and lineage resolution must stay bounded to the current spec folder and its `memory/` subfolder.

### Testability
- **NFR-T01**: Every lane must have a focused vitest file.
- **NFR-T02**: Final verification must include typecheck, targeted vitest, strict packet validation, and a real `generate-context.js` save.

---

## 8. EDGE CASES

- A top-level packet without a parent packet must render `parent_spec` as null or omit it.
- A first save in a packet must leave `derived_from` empty without fabricating lineage.
- A packet with only some canonical docs present must render the ones that exist without placeholder empty rows.
- Structured JSON payloads may omit explicit phase, status, or files; fallback behavior must remain sensible without defaulting to stale research markers.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Nine bounded render fixes across helper files and tests |
| Risk | 14/25 | Shared save pipeline helpers with strict scope fences |
| Research | 8/20 | Root cause work is already evidenced by the 014 memory audit |
| Multi-Agent | 2/15 | Single bounded implementation lane |
| Coordination | 8/15 | Cross-file render assembly plus packet closeout verification |
| **Total** | **50/100** | **Level 3 because the fixes span multiple pipeline helpers and require end-to-end save verification.** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Render-layer fixes drift into 003/006-owned wrapper or sanitizer scope | H | M | Keep edits limited to the files listed above and leave regression suites green. |
| R-002 | Canonical-source discovery returns no links for valid nested packets | H | M | Add dedicated fixture coverage for nested relative-path rendering. |
| R-003 | Git fallback overstates completion on clean but unfinished worktrees | M | M | Prefer explicit payload fields and keep git fallback conservative. |
| R-004 | Score-field renaming confuses downstream readers | M | M | Rename fields consistently and explain both metrics in reviewer output and metadata. |

---

## 11. USER STORIES

### US-001: Operator needs truthful wrapper saves after implementation work (Priority: P0)

As an operator, I want the rendered memory save to show real canonical docs, counts, and completion state so I can trust a fresh save without manual cleanup.

**Acceptance Criteria**:
1. Given a structured payload with canonical docs and modified files, when the save renders, then canonical sources and file counts are populated.
2. Given an implementation save, when the save renders, then the title, phase, and session status do not contain stale or filename-garbage output.

### US-002: Maintainer needs trigger and evidence surfaces to stay retrieval-quality (Priority: P1)

As a maintainer, I want trigger phrases and distinguishing evidence to stay compact and meaningful so retrieval works without replaying prose noise.

**Acceptance Criteria**:
1. Given explicit trigger phrases, when the save renders, then prose bigrams do not leak into the saved trigger list.
2. Given repeated evidence bullets, when the save renders, then duplicates are removed and anchored bullets win.

### US-003: Packet lineage needs truthful metadata fields (Priority: P2)

As a maintainer, I want lineage and score metadata to describe real relationships and meanings so packet history and save quality are interpretable.

**Acceptance Criteria**:
1. Given a later implementation save, when the packet already has a planning save, then `derived_from` and `supersedes` are populated correctly.
2. Given both quality scorers run, when operators inspect the outputs, then they see distinct score names for rendered quality and input completeness.

---

## 12. OPEN QUESTIONS

- Should the saved title ever use a small timestamp disambiguator, or is title-only rendering sufficient once frontmatter metadata carries the real identity?
- Should future follow-on work backfill historical 014 saves manually after `009` lands, or should verification stop at fresh-save proof only?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
