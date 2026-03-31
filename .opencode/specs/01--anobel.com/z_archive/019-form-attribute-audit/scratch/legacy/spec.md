---
        title: "Feature Specification: Form Attribute Audit"
        description: "Comprehensive audit of form input components on anobel.com/nl/werkenbij to identify."
        trigger_phrases:
          - "019-form-attribute-audit"
          - "archive"
          - "specification"
        importance_tier: "normal"
        contextType: "general"
        ---
        # Feature Specification: Form Attribute Audit

        <!-- SPECKIT_LEVEL: 2 -->
        <!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

        ---

        <!-- ANCHOR:metadata -->
        ## 1. METADATA

        | Field | Value |
        |-------|-------|
        | **Level** | 2 |
        | **Priority** | P0 |
        | **Status** | Complete (Archived) |
        | **Created** | 2026-03-31 |
        | **Branch** | `.opencode/specs/01--anobel.com/z_archive/019-form-attribute-audit` |
        <!-- /ANCHOR:metadata -->

        ---

        <!-- ANCHOR:problem -->
        ## 2. PROBLEM & PURPOSE

        ### Problem Statement
        Spec: Form Attribute Audit Overview Comprehensive audit of form input components on anobel.com/nl/werkenbij to identify: - Unneeded/redundant attributes - Missing required attributes - Broken or malformed attributes - Accessibility gaps - Spec/implementation mismatches Scope In Scope - Live page analysis: https://anobel.com/nl/werkenbij - Spec folder analysis: `.opencode/specs/01--anobel.com/z_archive/011-form-input-upload-select` - Form input JS components (custom_select.js, filepond_upload.js, form_submission.js) - HTML attribute validation (data-*, aria-*, native attributes) - Accessibility compliance check Out of Scope - Other pages (focus only on werkenbij) - Backend/server-side components - Non-form elements Success Criteria 1. Complete inventory of all form-related attributes on live page 2.

        ### Purpose
        Keep the archived record for Form Attribute Audit readable, structurally valid, and faithful to the original implementation intent.
        <!-- /ANCHOR:problem -->

        ---

        <!-- ANCHOR:scope -->
        ## 3. SCOPE

        ### In Scope
        - Spec/implementation mismatches.
- ### In Scope.
- ### Out of Scope.

        ### Out of Scope
        - Re-implementing the archived feature from scratch.
- Changing production behavior beyond documentation normalization.
- Replacing historical decisions that belong to the archive record.

        ### Files to Change

        | File Path | Change Type | Description |
        |-----------|-------------|-------------|
        | `dropdown.js` | Modify | Referenced by the archived work and retained in the normalized record |
| `nav_dropdown.js` | Modify | Referenced by the archived work and retained in the normalized record |
| `mobile_menu.js` | Modify | Referenced by the archived work and retained in the normalized record |
| `nav_mobile_menu.js` | Modify | Referenced by the archived work and retained in the normalized record |
| `scratch/dom-analysis.md` | Modify | Referenced by the archived work and retained in the normalized record |
| `scratch/accessibility-audit.md` | Modify | Referenced by the archived work and retained in the normalized record |
        <!-- /ANCHOR:scope -->

        ---

        <!-- ANCHOR:requirements -->
        ## 4. REQUIREMENTS

        ### P0 - Blockers (MUST complete)

        | ID | Requirement | Acceptance Criteria |
        |----|-------------|---------------------|
        | REQ-001 | The archived record clearly captures the core change described for Form Attribute Audit. | Reviewer can confirm this is explicitly documented in the archive folder |
        | REQ-002 | The normalized spec identifies the primary files, components, or pages affected by the work. | Reviewer can confirm this is explicitly documented in the archive folder |
        | REQ-003 | The archive captures verification expectations or completed checks. | Reviewer can confirm this is explicitly documented in the archive folder |

        ### P1 - Required (complete OR user-approved deferral)

        | ID | Requirement | Acceptance Criteria |
        |----|-------------|---------------------|
        | REQ-004 | The documentation avoids broken local markdown references and invalid template structure. | Reviewer can confirm this is explicitly documented in the archive folder |
        | REQ-005 | The record notes important dependencies or rollout constraints mentioned in the archive. | Reviewer can confirm this is explicitly documented in the archive folder |

        ### Acceptance Scenarios

        1. **Given** the archived documents for Form Attribute Audit, **When** a reviewer opens `spec.md`, **Then** the original problem and purpose are clear.
2. **Given** the scope section, **When** a reviewer checks the documented implementation surface, **Then** primary references such as `dropdown.js` are visible.
3. **Given** the normalized plan, **When** a reviewer reads the phases and testing strategy, **Then** the delivery and verification flow can be reconstructed.
4. **Given** the supporting documents, **When** a reviewer inspects them, **Then** checklist, tasks, and summary remain aligned.
        <!-- /ANCHOR:requirements -->

        ---

        <!-- ANCHOR:success-criteria -->
        ## 5. SUCCESS CRITERIA

        - **SC-001**: The archive explains the original objective for Form Attribute Audit in plain language.
        - **SC-002**: The normalized documents follow the current template structure and validate without errors.
        - **SC-003**: Primary files, pages, or systems are listed for future reference.
        - **SC-004**: Verification expectations or completed checks are captured in the plan, checklist, and summary.
        <!-- /ANCHOR:success-criteria -->

        ---

        <!-- ANCHOR:risks -->
        ## 6. RISKS & DEPENDENCIES

        | Type | Item | Impact | Mitigation |
        |------|------|--------|------------|
        | Dependency | Archived implementation context | Future readers may miss why the change mattered | Problem statement and plan summary retain the original intent |
        | Risk | Over-normalizing historical notes | Subtle archived details could be lost | Keep folder-specific description and file references visible |
        | Risk | Stale environment assumptions | Replaying the work later may require fresh verification | Checklist and limitations call out archive-only status |
        <!-- /ANCHOR:risks -->

        ---

        <!-- ANCHOR:questions -->
        ## 10. OPEN QUESTIONS

        - Archived follow-up should focus on whether the documented implementation still matches current production behavior.
        - Resume work only after re-validating the referenced files and dependencies.
        <!-- /ANCHOR:questions -->

        ---
