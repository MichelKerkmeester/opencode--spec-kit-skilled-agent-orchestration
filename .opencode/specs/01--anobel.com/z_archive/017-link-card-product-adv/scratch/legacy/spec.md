---
title: "Feature Specification: Link Card Product/Adv [01--anobel.com/z_archive/017-link-card-product-adv/scratch/legacy/spec]"
description: "title: \"Feature Specification: Link Card Product/Adv - CTA Button Hover Animation\""
trigger_phrases:
  - "feature"
  - "specification"
  - "link"
  - "card"
  - "product"
  - "spec"
  - "legacy"
importance_tier: "important"
contextType: "implementation"
---
---
        title: "Feature Specification: Link Card Product/Adv - CTA Button Hover Animation"
        description: "Extend the link card ad hover state to trigger the CTA button Secondary-Full animations, including."
        trigger_phrases:
          - "017-link-card-product-adv"
          - "archive"
          - "specification"
        importance_tier: "normal"
        contextType: "general"
        ---
        # Feature Specification: Link Card Product/Adv - CTA Button Hover Animation

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
        | **Branch** | `.opencode/specs/01--anobel.com/z_archive/017-link-card-product-adv` |
        <!-- /ANCHOR:metadata -->

        ---

        <!-- ANCHOR:problem -->
        ## 2. PROBLEM & PURPOSE

        ### Problem Statement
        Link Card Product/Adv - CTA Button Hover Animation Overview Extend the link card ad hover state to trigger the CTA button Secondary-Full animations, including: - Main button border color change (neutral-dark → brand-dark) - Icon button background color change (brand-base → brand-dark) - Icon swap animation (static icon slides out, animated icon slides in) Requirements 1. When `[data-adv]` card is hovered, trigger CTA button hover styles 2.

        ### Purpose
        Keep the archived record for Link Card Product/Adv - CTA Button Hover Animation readable, structurally valid, and faithful to the original implementation intent.
        <!-- /ANCHOR:problem -->

        ---

        <!-- ANCHOR:scope -->
        ## 3. SCOPE

        ### In Scope
        - ## Out of Scope.
- title: "Implementation Plan [018-link-card-product-adv/plan]".
- "implementation".

        ### Out of Scope
        - Re-implementing the archived feature from scratch.
- Changing production behavior beyond documentation normalization.
- Replacing historical decisions that belong to the archive record.

        ### Files to Change

        | File Path | Change Type | Description |
        |-----------|-------------|-------------|
        | `src/1_css/animations/link_card_ad.css` | Modify | Referenced by the archived work and retained in the normalized record |
| `btn_cta.css` | Modify | Referenced by the archived work and retained in the normalized record |
        <!-- /ANCHOR:scope -->

        ---

        <!-- ANCHOR:requirements -->
        ## 4. REQUIREMENTS

        ### P0 - Blockers (MUST complete)

        | ID | Requirement | Acceptance Criteria |
        |----|-------------|---------------------|
        | REQ-001 | The archived record clearly captures the core change described for Link Card Product/Adv - CTA Button Hover Animation. | Reviewer can confirm this is explicitly documented in the archive folder |
        | REQ-002 | The normalized spec identifies the primary files, components, or pages affected by the work. | Reviewer can confirm this is explicitly documented in the archive folder |

        ### P1 - Required (complete OR user-approved deferral)

        | ID | Requirement | Acceptance Criteria |
        |----|-------------|---------------------|
        | REQ-003 | The archive explains how success was verified or intended to be verified. | Reviewer can confirm this is explicitly documented in the archive folder |

        ### Acceptance Scenarios

        1. **Given** the archived documents for Link Card Product/Adv - CTA Button Hover Animation, **When** a reviewer opens `spec.md`, **Then** the original problem and purpose are clear.
2. **Given** the scope section, **When** a reviewer checks the documented implementation surface, **Then** primary references such as `src/1_css/animations/link_card_ad.css` are visible.
        <!-- /ANCHOR:requirements -->

        ---

        <!-- ANCHOR:success-criteria -->
        ## 5. SUCCESS CRITERIA

        - **SC-001**: The archive explains the original objective for Link Card Product/Adv - CTA Button Hover Animation in plain language.
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
