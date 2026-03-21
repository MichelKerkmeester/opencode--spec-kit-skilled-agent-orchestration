---
title: "Implementation Summary [019-readme-and-summary-with-hvr/implementation-summary]"
description: "The Human Voice Rules existed. They just sat inside a Barter-specific context document that no other system could reach. This spec changed that. The rules were extracted, cleane..."
trigger_phrases:
  - "implementation"
  - "summary"
  - "implementation summary"
  - "019"
  - "readme"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/02--system-spec-kit/z_archive/019-readme-and-summary-with-hvr` |
| **Completed** | 2026-02-19 |
| **Level** | 3+ |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Human Voice Rules existed. They just sat inside a Barter-specific context document that no other system could reach. This spec changed that. The rules were extracted, cleaned of all project-specific references, and published as a standalone skill asset. Then the documentation templates that writers use every day were updated to put those rules front-and-centre before any writing starts.

Writers opening an implementation-summary, a decision record, a README, or an install guide now see a concise HVR block before the first content section. The block names the hardest-to-miss banned words, flags the four structural patterns most common in AI-generated prose, and links to the full standalone rules for anyone who wants the complete picture. The goal is that someone who reads the block and follows it will produce a document that reads noticeably more like a person wrote it.

Six changes shipped across six distinct deliverables.

### Standalone HVR Asset

The source document `context/Rules - Human Voice - v0.101.md` was read in full. Every reference to Barter systems, MEQT scoring, DEAL content workflows, and LinkedIn distribution was removed. The loading condition changed from "active for Barter documentation" to "always active for documentation generation tasks." The scope statement moved from "6 Barter content systems" to system-agnostic language.

The result is `.opencode/skill/sk-doc/assets/documentation/hvr_rules.md`, a 580-line document covering 11 sections: voice directives, punctuation standards, AI structural patterns to avoid, the full banned-words list (18 words), banned phrases, soft deductions, and a pre-publish checklist. Section 11 is new: it explains how templates should reference and embed HVR guidance, turning the document into both a ruleset and an integration guide.

The YAML frontmatter carries `trigger_phrases` for MCP memory retrieval and `importance_tier: constitutional`, marking HVR as a non-negotiable baseline rather than a style preference.

### Implementation Summary Templates — All Five Levels

The SpecKit `implementation-summary.md` template exists in five copies: core, level 1, level 2, level 3, and level 3+. All five were updated. Each received:

- An `HVR_REFERENCE` marker in the file header pointing to `hvr_rules.md`
- Inline voice guide comments per section telling writers how to narrate, not list
- A "How It Was Delivered" section (level 2 and above)
- A revised decisions table with a "Why" column instead of a standalone rationale field

The voice guide comments follow the model already visible in this document: they tell writers to lead with impact, use active voice throughout, and write "users can now do X" rather than "X functionality was implemented."

### Decision Record Templates — Three Files

The `decision-record.md` template at levels 3, 3+, and in the `addendum/level3-arch/` folder received the same treatment. The section labels were revised to use plain English: "We chose" instead of "Summary", "How it works" instead of "Details", "What improves / What it costs" instead of "Positive / Negative", and "How to roll back" instead of "Rollback". Each file received an `HVR_REFERENCE` marker and per-section voice guide comments.

### README Template

The `readme_template.md` carried a full embedded copy of the HVR rules inside Section 9. That section was replaced with a compact quick-reference table covering the most-used rules, plus a direct link to `hvr_rules.md` for the full version. The change reduced that section from around 90 lines to 35 lines while preserving all the actionable content a writer needs mid-task.

### Install Guide Template

The `install_guide_template.md` received an HVR reference in its Writing Style section and an HVR compliance check in its Install Guide Checklist. One pre-existing HVR violation in the template itself was corrected: the phrase "bridge the gap" was replaced with direct phrasing.

### SKILL.md Resource Map

The `SKILL.md` for the sk-doc skill was updated with a new HVR intent signal (weight: 4, keywords: human voice, hvr, voice rules, banned words, writing style) and a new resource mapping to `hvr_rules.md`. Two existing references that pointed writers to "see readme_template.md §9" now point directly to `hvr_rules.md` instead.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/sk-doc/assets/documentation/hvr_rules.md` | Created | Standalone system-agnostic HVR rules extracted from Barter source |
| `.opencode/skill/system-spec-kit/templates/core/implementation-summary.md` | Modified | HVR reference, voice guide comments, decisions table update |
| `.opencode/skill/system-spec-kit/templates/level_1/implementation-summary.md` | Modified | HVR reference, voice guide comments, decisions table update |
| `.opencode/skill/system-spec-kit/templates/level_2/implementation-summary.md` | Modified | HVR reference, voice guide comments, How It Was Delivered section, decisions table update |
| `.opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md` | Modified | HVR reference, voice guide comments, How It Was Delivered section, decisions table update |
| `.opencode/skill/system-spec-kit/templates/level_3+/implementation-summary.md` | Modified | HVR reference, voice guide comments, How It Was Delivered section, decisions table update |
| `.opencode/skill/system-spec-kit/templates/level_3/decision-record.md` | Modified | HVR reference, plain-English labels, voice guide comments |
| `.opencode/skill/system-spec-kit/templates/level_3+/decision-record.md` | Modified | HVR reference, plain-English labels, voice guide comments |
| `.opencode/skill/system-spec-kit/templates/addendum/level3-arch/decision-record.md` | Modified | HVR reference, plain-English labels, voice guide comments |
| `.opencode/skill/sk-doc/assets/documentation/readme_template.md` | Modified | Section 9 replaced: full embedded rules to compact quick reference + link |
| `.opencode/skill/sk-doc/assets/documentation/install_guide_template.md` | Modified | HVR reference in Writing Style section; "bridge the gap" violation fixed |
| `.opencode/skill/sk-doc/SKILL.md` | Modified | HVR intent signal, resource mapping, two cross-reference updates |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Four context agents ran in parallel at the start to map the codebase. Each used Pattern B (summary only) to gather intelligence on the two affected skill systems without pulling full file contents. The output gave a complete picture of which template files existed, where the source HVR document lived, and what the SKILL.md structure looked like before any editing began.

Implementation then ran sequentially. Phase 1 (HVR extraction) and Phase 2 (annotation block drafting) ran together as planned: neither depended on the other. Once the standalone `hvr_rules.md` was confirmed at its canonical path, Phases 3 and 4 (template edits) proceeded in order. The SpecKit templates came first because there were more of them; the workflows-doc templates followed.

Validation ran on the spec folder after all edits were complete. The validate.sh script reported 13 of 14 checks passing. The one failing check was FILE_EXISTS for `implementation-summary.md`, which was the expected state before this file existed.

The template updates preserved all ANCHOR tags and SPECKIT markers throughout. A grep pass after editing confirmed no hard-blocker words in any modified template prose. The banned-words list in `hvr_rules.md` itself is exempt from the check because those words appear in code blocks for reference.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Standalone HVR asset rather than inline duplication | A single file at a canonical path means HVR evolves in one place. Templates reference it; they do not copy it. Inline duplication would mean 8+ files to update every time a rule changes. |
| Annotation-based embedding rather than enforcement scripts | Mandatory linting would require a build pipeline change and would block writers on edge cases (technical terms that share spelling with banned words). Voice guide comments give the same guidance without the friction. Writers who read them write better prose; writers who skip them face no system penalty. |
| Compact quick reference in README template rather than full embedded rules | The full rules are 580 lines. Nobody reads 580 lines mid-task. A 35-line quick reference with a link to the full document gives writers what they need without burying the template's actual content sections. |
| Replace label names in decision-record templates | "Summary", "Details", "Positive consequences" and "Negative consequences" read like form fields. "We chose", "How it works", "What improves" and "What it costs" read like a person explaining a decision. The change costs nothing structurally and makes ADRs easier to write and read. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh` on spec folder | PASS (exit 1 with 1 warning: implementation-summary.md missing before this file was created; all other checks clean) |
| Grep for hard-blocker words in all modified template prose | PASS — zero hits for: delve, embark, leverage, seamless, holistic, ecosystem, paradigm, utilize, revolutionise, groundbreaking |
| Grep for "Barter", "MEQT", "DEAL", "CONTENT" in `hvr_rules.md` | PASS — zero hits |
| Template ANCHOR tags intact after editing (all 12 files) | PASS — grep confirms all ANCHOR tags present in each file |
| SPECKIT_LEVEL and SPECKIT_TEMPLATE_SOURCE markers preserved | PASS — all markers verified in each modified template |
| `hvr_rules.md` structure: 11 sections present, YAML frontmatter valid | PASS — manual read confirms all sections and frontmatter fields |
| HVR annotation blocks under 30 lines each | PASS — all four block variants checked: implementation-summary (24 lines), decision-record (22 lines), README (20 lines), install-guide (19 lines) |
| Implementation-summary template consistency across all 5 levels | PASS — all 5 copies carry matching structure: HVR reference, voice guide comments per section, How It Was Delivered section (level 2+), Why column in decisions table |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

HVR enforcement is guidance-based. The voice guide comments in templates tell writers what to do. They do not stop writers from ignoring the comments and writing "leverage" anyway. No linting pipeline checks for banned words on commit. A writer who skips the HVR block will produce the same AI-flavoured output as before.

The DQI scoring pipeline in `extract_structure.py` does not parse HVR violations automatically. The `hvr_rules.md` document references DQI integration points, but those references describe where integration could happen, not where it does happen. HVR compliance scoring in DQI remains manual.

The `addendum/level3-arch/decision-record.md` template is a source component used to compose the `level_3/` and `level_3+/` templates via `scripts/templates/compose.sh`. If `compose.sh` is run after this update, it will regenerate the level-specific templates from the addendum sources. The regenerated output should carry the HVR changes because the addendum source was updated, but this should be confirmed after any future compose run.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
