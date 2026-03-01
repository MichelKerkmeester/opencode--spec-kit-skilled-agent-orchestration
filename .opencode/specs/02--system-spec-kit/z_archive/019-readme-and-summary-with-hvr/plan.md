---
title: "Implementation Plan: Human Voice Rules — Template Integration [137-readme-and-summary-with-hvr/plan]"
description: "This plan covers two categories of work. First, extracting the Human Voice Rules from a Barter-specific context document into a standalone, system-agnostic file at the canonical..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "human"
  - "voice"
  - "rules"
  - "137"
  - "readme"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Human Voice Rules — Template Integration

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML (within HVR source) |
| **Framework** | SpecKit template system, sk-doc skill |
| **Storage** | File system only — no database changes |
| **Testing** | Manual review: grep for hard-blocker words, visual inspection of template structure |

### Overview

This plan covers two categories of work. First, extracting the Human Voice Rules from a Barter-specific context document into a standalone, system-agnostic file at the canonical sk-doc skill path. Second, annotating four documentation templates across two skill systems with a concise HVR guidance block. No code changes. No automation. The work is file editing with discipline.

The approach is annotation-based: each template gets an HVR block early in the file that writers will see before they start filling in sections. The block references the full standalone rules and includes the most critical inline guidance — hard-blocker words and top structural patterns to avoid.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] HVR source document confirmed at `context/Rules - Human Voice - v0.101.md`
- [x] All target template file paths confirmed
- [x] Spec folder documentation complete (this document is part of that)

### Definition of Done

- [ ] `hvr_rules.md` exists at canonical path with no Barter-specific references
- [ ] All four target templates contain HVR blocks before their first content section
- [ ] Manual grep for hard-blocker words passes on this spec folder's documents
- [ ] Template ANCHOR tags and level markers intact in all modified files
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-source-of-truth with embedded guidance. The canonical `hvr_rules.md` holds the complete rules. Templates embed a lightweight annotation block (not the full rules) that points writers to the canonical source. This avoids duplication drift: when HVR evolves, only `hvr_rules.md` needs updating.

### Key Components

- **`hvr_rules.md`**: The standalone skill asset. Lives at `.opencode/skill/sk-doc/assets/documentation/hvr_rules.md`. Contains the full HVR document with Barter-specific references removed and the loading condition generalised.
- **HVR annotation block**: A 20-25 line Markdown comment block added to each target template. Contains: a reference to `hvr_rules.md`, the top 10 hard-blocker words to avoid, the 4 structural patterns most common in AI output, and 2 specific guidance lines for the template's content type.
- **Four target templates**: `implementation-summary.md` (4 SpecKit levels) and `decision-record.md` (2 SpecKit levels), `readme_template.md` and `install_guide_template.md` (both workflows-doc).

### Data Flow

Writer opens template → Sees HVR block at top → Reads guidance before writing → Fills sections with voice discipline → References full `hvr_rules.md` if needed for edge cases.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Extract HVR Standalone Asset

- [ ] Read full source document at `context/Rules - Human Voice - v0.101.md`
- [ ] Identify and remove all Barter-specific references (proper nouns, system names, project-specific scoring integrations)
- [ ] Update the loading condition from Barter-scoped to general ("Always active for documentation generation tasks")
- [ ] Update the scope statement from "6 Barter content systems" to system-agnostic language
- [ ] Write the cleaned document to `.opencode/skill/sk-doc/assets/documentation/hvr_rules.md`
- [ ] Grep for "Barter", "MEQT", "DEAL", "CONTENT", "LinkedIn" to verify no references remain

### Phase 2: Draft the HVR Annotation Block

Before touching any template, draft the standard HVR block that will go into all four templates. The block should be:
- A Markdown HTML comment so it is visible in source but does not render in preview
- 20-25 lines maximum
- Split into: reference line, hard-blocker words section, structural patterns section, template-specific note

The block will be customised slightly per template type (implementation summary vs. decision record vs. README vs. install guide) but shares the same structure.

- [ ] Draft base HVR block (shared content)
- [ ] Write implementation-summary variant (narrative prose guidance)
- [ ] Write decision-record variant (ADR context/rationale guidance)
- [ ] Write README variant (setup and overview guidance)
- [ ] Write install-guide variant (step-by-step instruction guidance)

### Phase 3: Update SpecKit Templates

The SpecKit template system has level-specific files. Check which levels have their own `implementation-summary.md` before editing.

- [ ] Locate all level templates: `templates/level_1/`, `level_2/`, `level_3/`, `level_3+/`
- [ ] Read each `implementation-summary.md` in full before modifying
- [ ] Insert HVR annotation block after the SPECKIT_TEMPLATE_SOURCE comment and before the first content section
- [ ] Read each `decision-record.md` for levels 3 and 3+ before modifying
- [ ] Insert HVR annotation block in same position
- [ ] Verify all ANCHOR tags and level markers intact after each edit

### Phase 4: Update Workflows-Doc Templates

- [ ] Read `readme_template.md` in full
- [ ] Insert README-variant HVR block after template headers
- [ ] Read `install_guide_template.md` in full
- [ ] Insert install-guide-variant HVR block after template headers
- [ ] Verify existing structure of both files unchanged

### Phase 5: Verify

- [ ] Run `scripts/spec/validate.sh` on this spec folder
- [ ] Grep all modified files for known hard-blocker words (delve, embark, leverage, seamless, holistic, ecosystem, journey as metaphor, paradigm, utilize)
- [ ] Confirm `hvr_rules.md` is readable and well-structured
- [ ] Manual read-through of HVR blocks in each template for clarity and completeness
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural verification | ANCHOR tags intact, SPECKIT markers unchanged | grep, manual read |
| Content verification | No Barter references in hvr_rules.md | grep for known proper nouns |
| Style verification | This spec folder's docs pass HVR review | Manual read, grep for hard blockers |
| Template usability | HVR block readable and actionable | Manual read of each block |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `context/Rules - Human Voice - v0.101.md` | Internal file | Green — file confirmed present | Cannot extract HVR standalone asset |
| SpecKit `level_1` through `level_3+` template directories | Internal | Green — confirmed via Glob | Cannot update implementation-summary templates |
| Workflows-doc assets directory | Internal | Green — confirmed writable | Cannot create hvr_rules.md or update README/install templates |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Template edit breaks validation or removes required structural elements
- **Procedure**: Restore from git. Every file touched has a clean state in version control. No database migrations. No deployed assets. A `git checkout -- [file]` restores any file to its pre-edit state.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Extract HVR) ──────┐
                            ├──► Phase 3 (SpecKit templates)  ──► Phase 5 (Verify)
Phase 2 (Draft blocks) ─────┤
                            └──► Phase 4 (Workflows-doc templates)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Extract HVR | None | Phase 3, Phase 4 (need standalone file path confirmed) |
| Draft blocks | None | Phase 3, Phase 4 (need block content ready) |
| SpecKit templates | Extract HVR, Draft blocks | Phase 5 |
| Workflows-doc templates | Extract HVR, Draft blocks | Phase 5 |
| Verify | All above | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Extract HVR standalone asset | Medium | 30-45 minutes |
| Draft annotation blocks | Low | 20-30 minutes |
| Update SpecKit templates (6 files) | Low | 30-45 minutes |
| Update workflows-doc templates (2 files) | Low | 15-20 minutes |
| Verification | Low | 15-20 minutes |
| **Total** | | **1.5-2.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migrations — file edits only
- [x] No feature flags required — documentation changes
- [ ] Git state clean before starting (check `git status`)

### Rollback Procedure
1. Identify affected file(s) from git diff
2. Run `git checkout -- [file path]` to restore
3. Verify restoration with `git status`
4. No stakeholder notification required — documentation changes only

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — git revert covers all changes
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Phase 1         │────►│  Phase 3         │────►│  Phase 5        │
│  Extract HVR     │     │  SpecKit edits   │     │  Verification   │
└──────────────────┘     └──────────────────┘     └─────────────────┘
                                                           ▲
┌──────────────────┐     ┌──────────────────┐             │
│  Phase 2         │────►│  Phase 4         │─────────────┘
│  Draft blocks    │     │  Workflows-doc   │
└──────────────────┘     └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| HVR extraction | Source file | `hvr_rules.md` | Phase 3, 4 |
| Block drafting | None | HVR annotation blocks | Phase 3, 4 |
| SpecKit edits | HVR extraction, blocks | Updated 6 templates | Verification |
| Workflows-doc edits | HVR extraction, blocks | Updated 2 templates | Verification |
| Verification | All edits | Confirmed delivery | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Read source HVR document** — 5 min — CRITICAL (everything depends on content analysis)
2. **Extract and write hvr_rules.md** — 30 min — CRITICAL (templates reference this path)
3. **Draft annotation blocks** — 20 min — CRITICAL (needed before any template edit)
4. **Update 6 SpecKit templates** — 40 min — CRITICAL
5. **Update 2 workflows-doc templates** — 20 min — CRITICAL
6. **Verify all changes** — 20 min — CRITICAL

**Total Critical Path**: approximately 2.5 hours

**Parallel Opportunities**:
- Phase 1 (HVR extraction) and Phase 2 (block drafting) can run in parallel — they have no mutual dependency
- SpecKit template edits for different levels can be done sequentially with no inter-dependency
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | HVR standalone asset complete | `hvr_rules.md` exists, no Barter refs, grep clean | End of Phase 1 |
| M2 | Annotation blocks ready | All 4 block variants drafted and reviewed | End of Phase 2 |
| M3 | All templates updated | 8 template files modified, structure intact | End of Phase 4 |
| M4 | Delivery verified | validate.sh passes, manual review complete | End of Phase 5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the two key decisions: the standalone HVR asset approach and the annotation-based embedding strategy.

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation (this spec folder)
**Files**: spec.md, plan.md, tasks.md, checklist.md, decision-record.md
**Duration**: ~45 min
**Agent**: @speckit (leaf — no sub-agent dispatch)

### Tier 2: Sequential Execution (implementation)
All implementation work runs sequentially in a single agent context. No parallel agent coordination needed.

| Step | Focus | Files |
|------|-------|-------|
| HVR extraction | Extract and clean source | hvr_rules.md |
| Block drafting | Draft 4 annotation variants | (in-context, then applied) |
| Template editing | Apply blocks to 8 files | 6 SpecKit + 2 workflows-doc |

### Tier 3: Verification
**Agent**: Primary (same context)
**Task**: grep checks, validate.sh, manual review
**Duration**: ~20 min
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | HVR Asset | Primary | `hvr_rules.md` | Phase 1 |
| W-B | SpecKit Templates | Primary | 6 template files | Phase 3 |
| W-C | Workflows-doc Templates | Primary | 2 template files | Phase 4 |

### Sync Points

| Sync ID | Trigger | Output |
|---------|---------|--------|
| SYNC-001 | W-A complete | HVR asset path confirmed for all block references |
| SYNC-002 | W-B, W-C complete | Final verification pass |

### File Ownership Rules

Each workstream owns its files exclusively. No file appears in two workstreams.
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints

- **Per phase**: Update tasks.md with completed items
- **On completion**: Run validation, report results to project owner

### Escalation Path

1. Template structure broken → Stop, restore from git, report to project owner before continuing
2. Source HVR content ambiguous → Document the ambiguity in decision-record.md, choose the system-agnostic interpretation
<!-- /ANCHOR:communication -->
