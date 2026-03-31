---
        title: "Feature Specification: Social Share CMS Integration"
        description: "Enhance the social share component to support separate URL and slug CMS fields in Webflow, enabling more flexible CMS binding while maintaining backwards compatibility."
        trigger_phrases:
          - "008-social-share-cms"
          - "archive"
          - "specification"
        importance_tier: "normal"
        contextType: "general"
        ---
        # Feature Specification: Social Share CMS Integration

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
        | **Branch** | `.opencode/specs/01--anobel.com/z_archive/008-social-share-cms` |
        <!-- /ANCHOR:metadata -->

        ---

        <!-- ANCHOR:problem -->
        ## 2. PROBLEM & PURPOSE

        ### Problem Statement
        Social Share CMS Integration Overview Enhance the social share component to support separate URL and slug CMS fields in Webflow, enabling more flexible CMS binding while maintaining backwards compatibility. Problem Statement Current implementation uses a single `data-social-share-link` attribute for the full URL.

        ### Purpose
        Keep the archived record for Social Share CMS Integration readable, structurally valid, and faithful to the original implementation intent.
        <!-- /ANCHOR:problem -->

        ---

        <!-- ANCHOR:scope -->
        ## 3. SCOPE

        ### In Scope
        - Current implementation uses a single `data-social-share-link` attribute for the full URL. In Webflow CMS, it's often more practical to have:.
- Add two new attributes that combine to form the share URL:.
- Changes: ~25 lines modified/added.

        ### Out of Scope
        - Re-implementing the archived feature from scratch.
- Changing production behavior beyond documentation normalization.
- Replacing historical decisions that belong to the archive record.

        ### Files to Change

        | File Path | Change Type | Description |
        |-----------|-------------|-------------|
        | `src/2_javascript/cms/social_share.js` | Modify | Referenced by the archived work and retained in the normalized record |
        <!-- /ANCHOR:scope -->

        ---

        <!-- ANCHOR:requirements -->
        ## 4. REQUIREMENTS

        ### P0 - Blockers (MUST complete)

        | ID | Requirement | Acceptance Criteria |
        |----|-------------|---------------------|
        | REQ-001 | The archived record clearly captures the core change described for Social Share CMS Integration. | Reviewer can confirm this is explicitly documented in the archive folder |
        | REQ-002 | The normalized spec identifies the primary files, components, or pages affected by the work. | Reviewer can confirm this is explicitly documented in the archive folder |

        ### P1 - Required (complete OR user-approved deferral)

        | ID | Requirement | Acceptance Criteria |
        |----|-------------|---------------------|
        | REQ-003 | The archive explains how success was verified or intended to be verified. | Reviewer can confirm this is explicitly documented in the archive folder |

        ### Acceptance Scenarios

        1. **Given** the archived documents for Social Share CMS Integration, **When** a reviewer opens `spec.md`, **Then** the original problem and purpose are clear.
2. **Given** the scope section, **When** a reviewer checks the documented implementation surface, **Then** primary references such as `src/2_javascript/cms/social_share.js` are visible.
        <!-- /ANCHOR:requirements -->

        ---

        <!-- ANCHOR:success-criteria -->
        ## 5. SUCCESS CRITERIA

        - **SC-001**: The archive explains the original objective for Social Share CMS Integration in plain language.
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
