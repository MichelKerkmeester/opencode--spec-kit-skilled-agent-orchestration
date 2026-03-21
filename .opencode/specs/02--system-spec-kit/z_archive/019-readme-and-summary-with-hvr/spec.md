---
title: "Feature Specification: Human Voice Rules — Template Integration [019-readme-and-summary-with-hvr/spec]"
description: "AI-generated documentation has a tell: it reads like AI wrote it. This spec fixes that. The Human Voice Rules (HVR), currently locked inside a Barter-specific document, get extr..."
trigger_phrases:
  - "feature"
  - "specification"
  - "human"
  - "voice"
  - "rules"
  - "spec"
  - "019"
  - "readme"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Human Voice Rules — Template Integration

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

AI-generated documentation has a tell: it reads like AI wrote it. This spec fixes that. The Human Voice Rules (HVR), currently locked inside a Barter-specific document, get extracted into a standalone, system-agnostic asset and embedded into four core documentation templates — two in SpecKit and two in the sk-doc skill. The result is that every implementation summary, decision record, README and install guide produced from these templates will read like a knowledgeable human wrote it, not a language model trying to sound professional.

**Key Decisions**: HVR as a standalone skill asset (not inline YAML); annotation-based embedding in templates (not mandatory enforcement scripts).

**Critical Dependencies**: Access to both template locations (SpecKit and sk-doc skill folders) and the source HVR document at `context/Rules - Human Voice - v0.101.md`.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-02-19 |
| **Spec Folder** | `.opencode/specs/02--system-spec-kit/z_archive/019-readme-and-summary-with-hvr` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Documentation generated from existing SpecKit and sk-doc templates reads like AI output. The current implementation-summary, decision-record, README and install-guide templates give no guidance on voice or tone. Writers fill them in, and what comes out carries the hallmarks of AI-generated text: hedging language, filler phrases, passive constructions, and that peculiar habit of listing exactly three things. The HVR document that solves this problem exists but is buried inside a Barter-specific context file, inaccessible to the broader toolchain.

### Purpose

Extract the Human Voice Rules into a reusable skill asset and integrate HVR guidance directly into four documentation templates, so that every document produced from those templates carries the discipline to sound human.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Extract and refactor `context/Rules - Human Voice - v0.101.md` into a system-agnostic `hvr_rules.md` at `.opencode/skill/sk-doc/assets/documentation/`
- Update the SpecKit `implementation-summary` template (all levels: 1, 2, 3, 3+) with HVR guidance
- Update the SpecKit `decision-record` template (levels 3 and 3+) with HVR guidance
- Update the sk-doc `readme_template.md` with HVR guidance
- Update the sk-doc `install_guide_template.md` with HVR guidance
- Update this spec folder's own documentation to demonstrate the style it promotes

### Out of Scope

- Automated HVR enforcement scripts or linters — this is guidance-based, not enforcement-based
- Updating existing completed documentation in live spec folders — only templates change
- Modifying HVR content beyond removing Barter-specific language — the rules themselves stay intact
- The `spec.md`, `plan.md`, `tasks.md` or `checklist.md` templates — they work differently and do not produce prose-heavy output where voice guidance applies

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-doc/assets/documentation/hvr_rules.md` | Create | Standalone, system-agnostic HVR extracted from context source |
| `.opencode/skill/system-spec-kit/templates/level_1/implementation-summary.md` | Modify | Add HVR annotation block and style guidance |
| `.opencode/skill/system-spec-kit/templates/level_2/implementation-summary.md` | Modify | Add HVR annotation block and style guidance |
| `.opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md` | Modify | Add HVR annotation block and style guidance |
| `.opencode/skill/system-spec-kit/templates/level_3+/implementation-summary.md` | Modify | Add HVR annotation block and style guidance |
| `.opencode/skill/system-spec-kit/templates/level_3/decision-record.md` | Modify | Add HVR annotation block and style guidance |
| `.opencode/skill/system-spec-kit/templates/level_3+/decision-record.md` | Modify | Add HVR annotation block and style guidance |
| `.opencode/skill/sk-doc/assets/documentation/readme_template.md` | Modify | Add HVR annotation block and style guidance |
| `.opencode/skill/sk-doc/assets/documentation/install_guide_template.md` | Modify | Add HVR annotation block and style guidance |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | HVR standalone asset created at the canonical path | File exists at `.opencode/skill/sk-doc/assets/documentation/hvr_rules.md`, contains all sections from source, no Barter-specific references remain |
| REQ-002 | All four templates updated with HVR annotation | Each template file contains an HVR guidance block with reference to `hvr_rules.md` and inline key rules |
| REQ-003 | SpecKit implementation-summary templates updated at all four levels | Level 1, 2, 3 and 3+ templates all carry HVR guidance |
| REQ-004 | SpecKit decision-record templates updated at levels 3 and 3+ | Both decision-record templates carry HVR guidance |
| REQ-005 | Workflows-doc templates updated | `readme_template.md` and `install_guide_template.md` both carry HVR guidance |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | HVR guidance blocks are actionable, not decorative | Blocks include at minimum: key banned words list, top 5 structural patterns to avoid, and a reference to the full hvr_rules.md |
| REQ-007 | This spec folder's own documents demonstrate human-voice style | spec.md, plan.md, tasks.md, decision-record.md pass a manual HVR review with no hard blockers |
| REQ-008 | Templates remain backward compatible | Existing template structure (ANCHOR tags, section IDs, level markers) unchanged after modification |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `hvr_rules.md` exists at the canonical path, loads without errors, and contains no Barter-specific references
- **SC-002**: All four target templates contain an HVR annotation block that references `hvr_rules.md` and lists the top hard-blocker words
- **SC-003**: A document written from any of the four updated templates by someone who reads the HVR block would produce noticeably less AI-detectable prose than one written from the current templates
- **SC-004**: This spec folder's own documentation demonstrates the style — no hard-blocker words, no "not just X but also Y" patterns, no exactly-three-item enumerations where the content is prose
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Source HVR document at `context/Rules - Human Voice - v0.101.md` | If content is incomplete, standalone asset quality suffers | File confirmed present and readable; no blocker |
| Dependency | Level 1/2 implementation-summary templates existing separately from level 3/3+ | Missing files would skip those template updates | Verify all four files exist before starting |
| Risk | HVR guidance blocks becoming outdated as HVR evolves | Templates drift from the canonical rules | Single source of truth pattern: blocks reference `hvr_rules.md` for full rules, inline only the most stable top-level rules |
| Risk | Template modifications breaking existing validation | validate.sh may reject changed templates | Read existing structure before editing; preserve all ANCHOR tags and level markers |
| Risk | Barter-specific references missed during refactoring | Standalone asset still reads as project-specific | Systematic grep for "Barter", "MEQT", "DEAL", "CONTENT" after refactoring |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The HVR annotation block in each template must be no more than 30 lines. Long blocks get skipped.
- **NFR-M02**: The standalone `hvr_rules.md` must be the single source of truth. Inline template blocks reference it; they do not duplicate it entirely.

### Discoverability
- **NFR-D01**: Each template's HVR block must appear before the first content section, so it's read before writing begins.

### Compatibility
- **NFR-C01**: No existing ANCHOR tags, SPECKIT_LEVEL markers, or SPECKIT_TEMPLATE_SOURCE markers may be removed or altered.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Template Usage

- **Writer skips HVR block**: The guidance works on a best-effort basis. No enforcement mechanism exists. The block should be written to be useful even when skim-read.
- **HVR rules conflict with technical documentation needs**: Technical terms are exempt from the banned-words list when used in their literal technical sense. Templates should note this distinction.

### HVR Refactoring

- **Words that appear in Barter section headers**: Section structure stays intact; only prose references to Barter systems get removed. The rules themselves are system-agnostic.
- **Context-dependent blocker words in the rules document itself**: The HVR document may reference banned words to explain them. Those references are in code blocks and are exempt.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 9 modified/created, LOC: ~400, Systems: 2 (SpecKit, workflows-doc) |
| Risk | 10/25 | No auth, no API, no breaking changes; low regression risk |
| Research | 12/20 | HVR source already exists; needs extraction analysis and template structure review |
| Multi-Agent | 8/15 | Single agent execution; no coordination needed |
| Coordination | 8/15 | Two skill locations to update; no cross-team dependencies |
| **Total** | **56/100** | **Level 3+ (governance: cross-skill impact, multi-template coordination)** |

The complexity score sits at 56. Level 3 would normally suffice at that score. The jump to 3+ is deliberate: this change touches two separate skill systems and establishes a cross-cutting standard that will affect every document produced going forward. That deserves the full governance treatment.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Template structure broken during edit | High | Low | Read full template before editing; preserve all ANCHOR tags |
| R-002 | HVR blocks too long, getting skipped by writers | Medium | Medium | Cap at 30 lines; prioritize the top 10 hard blockers |
| R-003 | Barter-specific language remains in standalone hvr_rules.md | Low | Low | Grep for known proper nouns after refactoring |
| R-004 | Level 1 implementation-summary template doesn't exist separately | Medium | Low | Check file existence before proceeding |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Write an implementation summary that doesn't read like AI (Priority: P0)

**As a** developer completing a spec folder, **I want** the implementation-summary template to guide me toward clear, direct writing, **so that** the resulting document is readable and doesn't embarrass the team.

**Acceptance Criteria**:

1. **Given** I open the implementation-summary template, **When** I read the opening section, **Then** I see an HVR guidance block before I reach the first content placeholder
2. **Given** the HVR block is visible, **When** I follow its top rules, **Then** my writing contains none of the 10 hard-blocker words listed
3. **Given** I have completed the implementation-summary, **When** a reader reviews it, **Then** the document reads in narrative prose rather than bullet-point lists throughout

### US-002: Document an architecture decision without jargon (Priority: P1)

**As a** technical lead filling in a decision record, **I want** the template to remind me to write plainly, **so that** the ADR is useful to future readers who weren't in the room.

**Acceptance Criteria**:

1. **Given** the decision-record template, **When** I reach the Context section, **Then** the template contains an HVR note prompting active voice and plain-language rationale
2. **Given** the HVR guidance in the decision-record template, **When** I complete the ADR, **Then** the Context and Decision sections contain no hard-blocker words
3. **Given** a completed ADR, **When** a reader unfamiliar with the original discussion reads it, **Then** the rationale is clear without needing to have been present for the decision

### US-003: Install-guide is readable on first pass (Priority: P1)

**As a** developer setting up a tool from an install guide, **I want** the guide to be direct and free of filler language, **so that** I can follow the steps without re-reading sentences.

**Acceptance Criteria**:

1. **Given** the updated install_guide_template, **When** a writer fills it in using HVR guidance, **Then** all step instructions use imperative verbs ("Run", "Open", "Copy") rather than passive constructions
2. **Given** the HVR block in the install-guide template, **When** a writer reads the pre-task guidance, **Then** they know to avoid the phrase "It's important to" before every step
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Project owner | Pending | — |
| Implementation Review | Project owner | Pending | — |
| Final Delivery | Project owner | Pending | — |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## 13. COMPLIANCE CHECKPOINTS

### Content Compliance
- [ ] No Barter-specific references in the standalone hvr_rules.md
- [ ] HVR rules in standalone asset match source document content
- [ ] Template ANCHOR tags and level markers preserved

### Style Compliance
- [ ] This spec folder's documents pass a manual HVR review
- [ ] No hard-blocker words used in any spec folder document
<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Project owner | Decision-maker | High: sets the writing standard for all future docs | Review at completion |
| Future spec writers | End user | High: uses templates daily | Embedded guidance in templates |
| workflows-doc skill users | End user | Medium: README/install guide quality | Embedded guidance in templates |
<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## 15. CHANGE LOG

### v1.0 (2026-02-19)
**Initial specification** — problem defined, scope locked, requirements written, risks assessed.
<!-- /ANCHOR:changelog -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

None. Scope is clear and source material is available.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **HVR Source**: See `context/Rules - Human Voice - v0.101.md`
