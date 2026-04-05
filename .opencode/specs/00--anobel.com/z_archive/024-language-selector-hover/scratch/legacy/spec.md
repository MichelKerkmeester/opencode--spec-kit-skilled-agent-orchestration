---
title: "Feature Specification: Language Selector - [00--anobel.com/z_archive/024-language-selector-hover/scratch/legacy/spec]"
description: "title: \"Feature Specification: Language Selector - Desktop Hover to Open\""
trigger_phrases:
  - "feature"
  - "specification"
  - "language"
  - "selector"
  - "spec"
  - "legacy"
importance_tier: "important"
contextType: "implementation"
---
---
        title: "Feature Specification: Language Selector - Desktop Hover to Open"
        description: "Modify nav_language_selector.js to open the dropdown on hover (desktop only), matching the behavior of nav_dropdown.js."
        trigger_phrases:
          - "024-language-selector-hover"
          - "archive"
          - "specification"
        importance_tier: "normal"
        contextType: "general"
        ---
        # Feature Specification: Language Selector - Desktop Hover to Open

        <!-- SPECKIT_LEVEL: 1 -->
        <!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

        ---

        <!-- ANCHOR:metadata -->
        ## 1. METADATA

        | Field | Value |
        |-------|-------|
        | **Level** | 1 |
        | **Priority** | P1 |
        | **Status** | Complete (Archived) |
        | **Created** | 2026-03-31 |
        | **Branch** | `.opencode/specs/00--anobel.com/z_archive/024-language-selector-hover` |
        <!-- /ANCHOR:metadata -->

        ---

        <!-- ANCHOR:problem -->
        ## 2. PROBLEM & PURPOSE

        ### Problem Statement
        Spec: Language Selector - Desktop Hover to Open Overview Modify `nav_language_selector.js` to open the dropdown on hover (desktop only), matching the behavior of `nav_dropdown.js`. Current Behavior | Viewport | Trigger | Action | |----------|---------|--------| | Desktop | Click | Opens/closes dropdown | | Desktop | Hover | Only animates button color | | Mobile | N/A | Dropdown always visible (accordion style) | Desired Behavior | Viewport | Trigger | Action | |----------|---------|--------| | Desktop | Hover (enter) | Opens dropdown | | Desktop | Hover (leave) | Closes dropdown after 150ms delay | | Desktop | Hover on dropdown | Keeps dropdown open | | Desktop | Click | Closes dropdown if open | | Mobile | N/A | No change (accordion style) | Reference Implementation `nav_dropdown.js` lines 299-343 - hover pattern with timeout Files to Modify - `src/2_javascript/navigation/nav_language_selector.js` - `src/2_javascript/z_minified/navigation/nav_language_selector.js` (regenerate) Success Criteria - [ ] Desktop: Dropdown opens on mouseenter - [ ] Desktop: Dropdown closes on mouseleave with 150ms delay - [ ] Desktop: Dropdown stays open when cursor moves to dropdown - [ ] Desktop: Click closes dropdown if open - [ ] Desktop: Nav dropdowns close when language selector opens - [ ] Mobile: No behavior change - [ ] No console errors - [ ] Minified version works correctly Plan: Language Selector - Desktop Hover to Open Implementation Changes Change 1: Add hover timeout variable (~Line 49) Change 2: Modify mouseenter handler (~Line 207-212) Replace color-only animation with dropdown open: Change 3: Modify mouseleave handler (~Line 214-219) Add delayed close: Change 4: Add dropdown hover handlers (new, after mouseleave) Keep dropdown open when hovering over it: Change 5: Modify click handler (~Line 222-226) Click should close if open (allow hover to handle opening): Change 6: Add integration helper (new, in utility functions) Close nav dropdowns when language selector opens: Post-Implementation 1.

        ### Purpose
        Keep the archived record for Language Selector - Desktop Hover to Open readable, structurally valid, and faithful to the original implementation intent.
        <!-- /ANCHOR:problem -->

        ---

        <!-- ANCHOR:scope -->
        ## 3. SCOPE

        ### In Scope
        - ## Reference Implementation.
- ## Implementation Changes.
- ### Change 1: Add hover timeout variable (~Line 49).

        ### Out of Scope
        - Re-implementing the archived feature from scratch.
- Changing production behavior beyond documentation normalization.
- Replacing historical decisions that belong to the archive record.

        ### Files to Change

        | File Path | Change Type | Description |
        |-----------|-------------|-------------|
        | `nav_language_selector.js` | Modify | Referenced by the archived work and retained in the normalized record |
| `nav_dropdown.js` | Modify | Referenced by the archived work and retained in the normalized record |
| `src/2_javascript/navigation/nav_language_selector.js` | Modify | Referenced by the archived work and retained in the normalized record |
| `src/2_javascript/z_minified/navigation/nav_language_selector.js` | Modify | Referenced by the archived work and retained in the normalized record |
        <!-- /ANCHOR:scope -->

        ---

        <!-- ANCHOR:requirements -->
        ## 4. REQUIREMENTS

        ### P0 - Blockers (MUST complete)

        | ID | Requirement | Acceptance Criteria |
        |----|-------------|---------------------|
        | REQ-001 | The archived record clearly captures the core change described for Language Selector - Desktop Hover to Open. | Reviewer can confirm this is explicitly documented in the archive folder |
        | REQ-002 | The normalized spec identifies the primary files, components, or pages affected by the work. | Reviewer can confirm this is explicitly documented in the archive folder |

        ### P1 - Required (complete OR user-approved deferral)

        | ID | Requirement | Acceptance Criteria |
        |----|-------------|---------------------|
        | REQ-003 | The archive explains how success was verified or intended to be verified. | Reviewer can confirm this is explicitly documented in the archive folder |

        ### Acceptance Scenarios

        1. **Given** the archived documents for Language Selector - Desktop Hover to Open, **When** a reviewer opens `spec.md`, **Then** the original problem and purpose are clear.
2. **Given** the scope section, **When** a reviewer checks the documented implementation surface, **Then** primary references such as `nav_language_selector.js` are visible.
        <!-- /ANCHOR:requirements -->

        ---

        <!-- ANCHOR:success-criteria -->
        ## 5. SUCCESS CRITERIA

        - **SC-001**: The archive explains the original objective for Language Selector - Desktop Hover to Open in plain language.
        - **SC-002**: The normalized documents follow the current template structure and validate without errors.
        <!-- /ANCHOR:success-criteria -->

        ---

        <!-- ANCHOR:risks -->
        ## 6. RISKS & DEPENDENCIES

        | Type | Item | Impact | Mitigation |
        |------|------|--------|------------|
        | Dependency | Archived implementation context | Future readers may miss why the change mattered | Problem statement and plan summary retain the original intent |
        | Risk | Over-normalizing historical notes | Subtle archived details could be lost | Keep folder-specific description and file references visible |
        <!-- /ANCHOR:risks -->

        ---

        <!-- ANCHOR:questions -->
        ## 7. OPEN QUESTIONS

        - Resume work only after re-checking the current codebase against these archived assumptions.
        - Treat any remaining deployment or rollout tasks as fresh work rather than assumed current state.
        <!-- /ANCHOR:questions -->

        ---
