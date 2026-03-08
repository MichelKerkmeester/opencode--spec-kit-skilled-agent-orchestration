# Agent 8: Documentation Quality (HVR + Structure)

**Reviewer:** @review agent (Claude Opus 4.6)
**Date:** 2026-03-08
**Confidence:** HIGH (all files read, all checks performed with evidence)

---

## Files Reviewed

| # | File | Short Name |
|---|------|------------|
| 1 | `.opencode/skill/system-spec-kit/references/structure/phase_definitions.md` | phase_definitions |
| 2 | `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` | quick_reference (phase sections) |
| 3 | `.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md` | sub_folder_versioning (phase sections) |
| 4 | `.opencode/skill/system-spec-kit/templates/addendum/phase/phase-parent-section.md` | phase-parent-section |
| 5 | `.opencode/skill/system-spec-kit/templates/addendum/phase/phase-child-header.md` | phase-child-header |

**Standard reference:** `sk-doc/SKILL.md` and `sk-doc/references/hvr_rules.md`

---

## Check 1: HVR Compliance -- 18 Banned Filler Words Scan

Scanned words: "straightforward", "simply", "just", "easy", "easily", "obviously", "clearly", "of course", "naturally", "as you know", "everyone knows", "it goes without saying", "needless to say", "trivial", "basic", "mere", "merely", "effortless"

### File 1: phase_definitions.md

**Result: PASS**
No banned filler words found.

### File 2: quick_reference.md (phase sections only)

**Result: FAIL**

| Line | Word | Context | In Phase Section? |
|------|------|---------|-------------------|
| 331 | "just" | "Consider complexity and risk, not just LOC" | No (Section 11, Troubleshooting) |
| 345 | "just" | "What if it's just exploration?" | No (Section 11, Troubleshooting) |
| 356 | "just" | "Documentation changes require specs just like code changes" | No (Section 11, Troubleshooting) |
| 661 | "just" | "ALWAYS mark items with evidence, not just [x]" | No (Section 18, Checklist) |

**Note:** None of these "just" occurrences fall within the phase-specific sections (Section 9 Confirmation Options, Section 16 Phase Workflow Shortcuts). When scoped to phase sections only, result is **PASS**. However, the full document has 4 violations.

**Fix:** Replace "just" with context-appropriate alternatives:
- Line 331: "not only LOC" or "beyond LOC"
- Line 345: "purely exploration" or "only exploration"
- Line 356: "the same as code changes" (remove "just like")
- Line 661: "not with [x] alone"

### File 3: sub_folder_versioning.md (phase sections only)

**Result: PASS**
No banned filler words found (Section 8 "Phases vs Versions" is the phase-relevant section).

### File 4: phase-parent-section.md

**Result: PASS**
No banned filler words found.

### File 5: phase-child-header.md

**Result: PASS**
No banned filler words found.

---

## Check 2: Third-Person Voice

Scanned for: "you", "your", "you'll", "you're", "you've", "we", "our", "we'll", "we're", "we've" addressing the reader directly.

### File 1: phase_definitions.md

**Result: PASS**
No second-person or first-person plural addressing found. Document uses impersonal/third-person throughout.

### File 2: quick_reference.md (phase sections only)

**Result: FAIL** (full document)

| Line | Word | Context |
|------|------|---------|
| 118 | "your" | "Add 1 to the result to get your next number." |
| 349 | "you" | "Once you write/edit ANY files = SPEC REQUIRED" |
| 673 | "you" (x3) | "Future you will thank present you for creating that spec folder." |

**Phase sections only:** PASS -- no violations in Section 9 or Section 16.

**Note on HVR voice rules:** The HVR standard (`hvr_rules.md`, Section 2: Voice Directives) actually *recommends* direct address with "you" and "your" (`direct_address` directive). This creates a tension with the third-person requirement stated in the review task. Flagging this as a **context-dependent finding**: if the project mandates third-person for spec reference documents specifically (overriding HVR's general recommendation), these are violations. If HVR's direct_address rule applies, these are compliant.

**Fix (if third-person required):**
- Line 118: "Add 1 to the result for the next number."
- Line 349: "Writing/editing ANY files = SPEC REQUIRED"
- Line 673: "The future self benefits from creating that spec folder."

### File 3: sub_folder_versioning.md (phase sections only)

**Result: FAIL** (borderline)

| Line | Word | Context |
|------|------|---------|
| 157 | "you" | AI dialogue: "Would you like to organize work in a sub-folder?" |

This occurrence is inside a quoted AI dialogue example (Step-by-Step Walkthrough, step 4). The "you" addresses a hypothetical user in a UI prompt scenario, not the reader directly. **Contextually acceptable** as it represents sample AI output.

**Phase section (Section 8):** PASS -- no violations.

### File 4: phase-parent-section.md

**Result: PASS**
No second-person or first-person plural found.

### File 5: phase-child-header.md

**Result: PASS**
The word "your" appears on line 7 only as a frontmatter `trigger_phrases` entry (metadata, not prose). No reader-addressing violations in document content.

---

## Check 3: No TOC on Spec Artifacts

Checked for: "Table of Contents", `<!-- TOC -->`, `<!-- toc -->`, or any auto-generated TOC block.

### File 1: phase_definitions.md

**Result: PASS** -- No TOC present.

### File 2: quick_reference.md

**Result: PASS** -- No TOC present.

### File 3: sub_folder_versioning.md

**Result: PASS** -- No TOC present.

### File 4: phase-parent-section.md

**Result: PASS** -- No TOC present.

### File 5: phase-child-header.md

**Result: PASS** -- No TOC present.

---

## Check 4: Heading Hierarchy

Checked for: H1 > H2 > H3 progression with no level skips.

### File 1: phase_definitions.md

**Result: PASS**

Hierarchy: H1 (line 6) > H2 (lines 13, 33, 74, 148, 205, 235) > H3 (nested under respective H2s). No skips. The H2 headings at lines 115 and 191 are inside markdown code blocks (example content) and do not violate structural hierarchy.

### File 2: quick_reference.md

**Result: PASS**

Hierarchy: H1 (line 6) > H2 (20 sections, numbered 1-20) > H3 (nested under respective H2s). No skips. Headings inside code blocks (lines 102, 129, 131-132, 135, 138, 274, 277, 280, 283, 631, 633, 641, 649) are not structural and do not count.

### File 3: sub_folder_versioning.md

**Result: PASS**

Hierarchy: H1 (line 6) > H2 (10 sections, numbered 1-10) > H3 (nested under respective H2s). No skips.

### File 4: phase-parent-section.md

**Result: PASS (N/A for H1)**

This is an addendum fragment (`<!-- SPECKIT_ADDENDUM: Phase - Parent Section -->`) designed to be appended to a parent `spec.md`. It starts at H2 (`## PHASE DOCUMENTATION MAP`) with H3 children (`### Phase Transition Rules`, `### Phase Handoff Criteria`). No H1 is expected for an injection fragment. Internal hierarchy is correct: H2 > H3.

### File 5: phase-child-header.md

**Result: PASS (N/A for H1)**

This is an addendum fragment (`<!-- SPECKIT_ADDENDUM: Phase - Child Header -->`) injected into a child `spec.md`. Contains only H3 (`### Phase Context`), which is appropriate for injection into an existing H2 context. No hierarchy skip within the fragment.

---

## Check 5: Anchor Tags

Checked for: Presence and proper formatting of `<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->` pairs for cross-reference support.

### File 1: phase_definitions.md

**Result: PASS**

6 anchor pairs found, all properly formatted and matching:
- `overview` (lines 12/31)
- `phase-detection` (lines 32/72)
- `folder-structure` (lines 73/146)
- `phase-lifecycle` (lines 147/203)
- `validation` (lines 204/233)
- `related-resources` (lines 234/244)

All use consistent `<!-- ANCHOR:kebab-case -->` format with matching close tags.

### File 2: quick_reference.md

**Result: PASS**

20 anchor pairs found, all properly formatted with matching open/close tags. Uses consistent `<!-- ANCHOR:kebab-case -->` format. Section coverage is complete (every numbered section has its own anchor pair).

### File 3: sub_folder_versioning.md

**Result: PASS**

10 anchor pairs found, all properly formatted with matching open/close tags. Uses consistent `<!-- ANCHOR:kebab-case -->` format. Complete coverage of all numbered sections.

### File 4: phase-parent-section.md

**Result: PASS**

1 anchor pair found: `phase-map` (lines 18/39). Properly formatted.

### File 5: phase-child-header.md

**Result: PASS**

1 anchor pair found: `phase-context` (lines 26/38). Properly formatted.

---

## Check 6: Placeholder Format Consistency

Checked for: Consistent `[YOUR_VALUE_HERE:*]` format in templates. Also checked for malformed, inconsistent, or mixed placeholder patterns.

### File 1: phase_definitions.md

**Result: N/A**
Reference document, not a template. No placeholders expected or present.

### File 2: quick_reference.md

**Result: N/A**
Reference document, not a template. No `[YOUR_VALUE_HERE:*]` placeholders expected or present.

### File 3: sub_folder_versioning.md

**Result: N/A**
Reference document, not a template. No placeholders expected or present.

### File 4: phase-parent-section.md

**Result: PASS**

2 placeholders found, both properly formatted:
- Line 25: `[YOUR_VALUE_HERE: PHASE_ROW]`
- Line 38: `[YOUR_VALUE_HERE: HANDOFF_ROW]`

Both follow the `[YOUR_VALUE_HERE: DESCRIPTOR]` format with colon separator and uppercase descriptor. Both are inside HTML comments with explanatory text (good practice for templates).

### File 5: phase-child-header.md

**Result: FAIL**

12 placeholder occurrences found. 11 follow the correct `[YOUR_VALUE_HERE: DESCRIPTOR]` format. **1 is malformed:**

| Line | Placeholder | Issue |
|------|-------------|-------|
| 2 | `[YOUR_VALUE_HERE [template:addendum/phase/phase-child-header.md]` | **Missing colon separator** after `YOUR_VALUE_HERE`. Also appears to conflate a placeholder token with a template path reference, creating a broken/hybrid token. |

**Correct format on same line (for comparison):**
`[YOUR_VALUE_HERE: PHASE_NUMBER]` (also on line 2, first occurrence)

**All other placeholders (lines 3, 19-24, 29, 31, 34, 37):** Correctly formatted with colon separator.

**Fix:** Line 2 should read:
```
title: "This is Phase [YOUR_VALUE_HERE: PHASE_NUMBER] of the [YOUR_VALUE_HERE: PARENT_SPEC_NAME] [template:addendum/phase/phase-child-header.md]"
```
Or, if the template path tag is separate metadata:
```
title: "This is Phase [YOUR_VALUE_HERE: PHASE_NUMBER] of the [YOUR_VALUE_HERE: PARENT_SPEC_NAME] specification [template:addendum/phase/phase-child-header.md]"
```

**Additional note on placeholder casing consistency:** Most placeholders use `UPPER_CASE` descriptors (`PHASE_NUMBER`, `PARENT_FOLDER`, `TOTAL_PHASES`), but line 24 uses mixed case: `[YOUR_VALUE_HERE: handoff criteria]` and line 31 uses lowercase: `[YOUR_VALUE_HERE: phase scope description]`, line 34: `[YOUR_VALUE_HERE: predecessor dependencies]`, line 37: `[YOUR_VALUE_HERE: phase deliverables]`. This is an inconsistency (not a format break, but a style inconsistency).

**Suggested standardization:** Either all-caps (`HANDOFF_CRITERIA`, `PHASE_SCOPE_DESCRIPTION`) or all-lowercase. Current state mixes both.

---

## Additional HVR Findings (Beyond the 18 Banned Words)

During the review, the following additional HVR violations were detected:

### Em Dash Usage (HVR Punctuation Ban)

| File | Line | Context |
|------|------|---------|
| quick_reference.md | 261 | "Add phase to existing spec **---** target a specific phase child" |
| quick_reference.md | 566 | "ONLY @speckit creates spec documentation **---** Never route..." |
| sub_folder_versioning.md | 220 | "`specs/003-parent/memory/` (wrong **---** parent-level, not child)" |
| phase-parent-section.md | 25 | `[YOUR_VALUE_HERE: PHASE_ROW] **---** Replaced by create.sh...` |
| phase-parent-section.md | 38 | `[YOUR_VALUE_HERE: HANDOFF_ROW] **---** Replaced by create.sh...` |

**Note on templates (lines 25, 38 of phase-parent-section.md):** These em dashes are inside HTML comments that serve as developer-facing placeholder documentation, not user-facing prose. They will not appear in rendered output.

**Fix for prose em dashes:**
- Line 261 (quick_reference): Replace with a period or colon
- Line 566 (quick_reference): Replace with a period
- Line 220 (sub_folder_versioning): Replace with a comma or parenthetical

### Semicolon Usage (HVR Punctuation Ban)

| File | Line | Context |
|------|------|---------|
| phase_definitions.md | 56 | "...the phase score determines whether to decompose into child folders. Both thresholds must be met independently." -- Actually uses semicolons as list separators: "L1/L2/L3/L3+**;** the phase score..." |
| sub_folder_versioning.md | 21 | "...`scratch/` automatically. Existing root docs are not auto-moved**;** archival/reorganization remains explicit." |

**Fix:**
- phase_definitions.md line 56: Split into two sentences at the semicolon
- sub_folder_versioning.md line 21: Replace semicolon with period, start new sentence

### HVR Hard Blocker Word

| File | Line | Word | Context |
|------|------|------|---------|
| quick_reference.md | 499 | "seamless" | "Creates a continuation document for seamless session transitions." |

**Fix:** Replace with "smooth" -- `"Creates a continuation document for smooth session transitions."`

---

## Summary Table

| Check | phase_definitions | quick_reference (phase) | sub_folder_versioning (phase) | phase-parent-section | phase-child-header |
|-------|:-:|:-:|:-:|:-:|:-:|
| 1. HVR 18 banned words | PASS | PASS* | PASS | PASS | PASS |
| 2. Third-person voice | PASS | PASS* | PASS | PASS | PASS |
| 3. No TOC | PASS | PASS | PASS | PASS | PASS |
| 4. Heading hierarchy | PASS | PASS | PASS | PASS | PASS |
| 5. Anchor tags | PASS | PASS | PASS | PASS | PASS |
| 6. Placeholder format | N/A | N/A | N/A | PASS | **FAIL** |

*PASS when scoped to phase sections only. Full document has violations (4x "just", 3x "you/your", 1x "seamless", 2x em dash).

---

## Issue Summary

### P1 -- Required Fixes

| # | File | Line | Issue | Fix |
|---|------|------|-------|-----|
| 1 | phase-child-header.md | 2 | Malformed placeholder: missing colon separator in `[YOUR_VALUE_HERE [template:...]` | Add colon and separate template path tag from placeholder value |

### P2 -- Suggestions

| # | File | Line(s) | Issue | Fix |
|---|------|---------|-------|-----|
| 1 | phase-child-header.md | 24, 31, 34, 37 | Inconsistent placeholder descriptor casing (mixed UPPER and lowercase) | Standardize to all-caps descriptors |
| 2 | quick_reference.md (full doc) | 331, 345, 356, 661 | Banned filler word "just" (4 occurrences) | Replace with alternatives per fix suggestions above |
| 3 | quick_reference.md (full doc) | 499 | HVR hard blocker word "seamless" | Replace with "smooth" |
| 4 | quick_reference.md (full doc) | 261, 566 | Em dash usage (HVR punctuation ban) | Replace with period or colon |
| 5 | sub_folder_versioning.md | 220 | Em dash usage (HVR punctuation ban) | Replace with comma or parenthetical |
| 6 | phase_definitions.md | 56 | Semicolon usage (HVR punctuation ban) | Split into two sentences |
| 7 | sub_folder_versioning.md | 21 | Semicolon usage (HVR punctuation ban) | Replace with period |
| 8 | quick_reference.md (full doc) | 118, 349, 673 | Second-person voice (if third-person is required for spec references) | Rewrite in impersonal voice |

### Positive Highlights

- All 5 files have complete and properly formatted anchor tag systems for cross-referencing
- Heading hierarchy is clean across all documents with no level skips
- No auto-generated TOC present in any spec artifact
- phase_definitions.md is exceptionally clean: zero HVR violations, perfect third-person voice, complete anchor coverage
- phase-parent-section.md template is clean and well-structured with correct placeholder format
- Code block examples correctly use markdown headings without breaking document structure
