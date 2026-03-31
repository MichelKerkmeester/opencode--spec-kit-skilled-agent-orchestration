---
    title: "Feature Specification: Blog Sort Dropdown Fix"
    description: "Fix the blog page sort dropdown to properly trigger Finsweet fs-list sorting. Currently, selecting a sort option updates the hidden select value but does not trigger list re-sor."
    trigger_phrases:
      - "018-blog-sort-fix"
      - "archive"
      - "specification"
    importance_tier: "normal"
    contextType: "general"
    ---
    # Feature Specification: Blog Sort Dropdown Fix

    <!-- SPECKIT_LEVEL: 3 -->
    <!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

    ---

    ## EXECUTIVE SUMMARY

    Spec: Blog Sort Dropdown Fix Overview Fix the blog page sort dropdown to properly trigger Finsweet fs-list sorting.

    **Key Decisions**: Preserve archived implementation intent, normalize structure without changing substance.

    **Critical Dependencies**: Archived file references, rollout assumptions, and verification notes remain available for future review.

    ---

    <!-- ANCHOR:metadata -->
    ## 1. METADATA

    | Field | Value |
    |-------|-------|
    | **Level** | 3 |
    | **Priority** | P0 |
    | **Status** | Complete (Archived) |
    | **Created** | 2026-01-18 |
    | **Branch** | `.opencode/specs/01--anobel.com/z_archive/018-blog-sort-fix` |
    <!-- /ANCHOR:metadata -->

    ---

    <!-- ANCHOR:problem -->
    ## 2. PROBLEM & PURPOSE

    ### Problem Statement
    Spec: Blog Sort Dropdown Fix Overview Fix the blog page sort dropdown to properly trigger Finsweet fs-list sorting. Currently, selecting a sort option updates the hidden select value but does not trigger list re-sorting.

    ### Purpose
    Keep the archived record for Blog Sort Dropdown Fix readable, structurally valid, and faithful to the original implementation intent.
    <!-- /ANCHOR:problem -->

    ---

    <!-- ANCHOR:scope -->
    ## 3. SCOPE

    ### In Scope
    - title: "Spec: Blog Sort Dropdown Fix [018-blog-sort-fix/spec] [01--anobel.com/z_archive/018-blog-sort-fix/spec]".
- description: "Fix the blog page sort dropdown to properly trigger Finsweet fs-list sorting. Currently, selecting a sort option updates the hidden select value but does not trigger list re-sor...".
- # Spec: Blog Sort Dropdown Fix.

    ### Out of Scope
    - Re-implementing the archived feature from scratch.
- Changing production behavior beyond documentation normalization.
- Replacing historical decisions that belong to the archive record.

    ### Files to Change

    | File Path | Change Type | Description |
    |-----------|-------------|-------------|
    | `input_select.js` | Modify | Referenced by the archived work and retained in the normalized record |
| `input_select_fs_bridge.js` | Modify | Referenced by the archived work and retained in the normalized record |
| `decision-record.md` | Modify | Referenced by the archived work and retained in the normalized record |
| `src/2_javascript/form/input_select_fs_bridge.js` | Modify | Referenced by the archived work and retained in the normalized record |
| `src/2_javascript/z_minified/form/input_select_fs_bridge.js` | Modify | Referenced by the archived work and retained in the normalized record |
| `src/0_html/blog.html` | Modify | Referenced by the archived work and retained in the normalized record |
    <!-- /ANCHOR:scope -->

    ---

    <!-- ANCHOR:requirements -->
    ## 4. REQUIREMENTS

    ### P0 - Blockers (MUST complete)

    | ID | Requirement | Acceptance Criteria |
    |----|-------------|---------------------|
    | REQ-001 | The archived record clearly captures the core change described for Blog Sort Dropdown Fix. | Reviewer can confirm this is explicitly documented in the archive folder |
    | REQ-002 | The normalized spec identifies the primary files, components, or pages affected by the work. | Reviewer can confirm this is explicitly documented in the archive folder |
    | REQ-003 | The archive captures verification expectations or completed checks. | Reviewer can confirm this is explicitly documented in the archive folder |
    | REQ-004 | The documentation keeps key architectural or coordination decisions visible for future review. | Reviewer can confirm this is explicitly documented in the archive folder |

    ### P1 - Required (complete OR user-approved deferral)

    | ID | Requirement | Acceptance Criteria |
    |----|-------------|---------------------|
    | REQ-005 | The documentation avoids broken local markdown references and invalid template structure. | Reviewer can confirm this is explicitly documented in the archive folder |
    | REQ-006 | The record notes important dependencies or rollout constraints mentioned in the archive. | Reviewer can confirm this is explicitly documented in the archive folder |
    | REQ-007 | The normalized documents remain useful for future reference without changing the archived outcome. | Reviewer can confirm this is explicitly documented in the archive folder |
    | REQ-008 | Known limitations or follow-up questions remain visible where they were recorded. | Reviewer can confirm this is explicitly documented in the archive folder |

    ### Acceptance Scenarios

    1. **Given** the archived documents for Blog Sort Dropdown Fix, **When** a reviewer opens `spec.md`, **Then** the original problem and purpose are clear.
2. **Given** the scope section, **When** a reviewer checks the documented implementation surface, **Then** primary references such as `input_select.js` are visible.
3. **Given** the normalized plan, **When** a reviewer reads the phases and testing strategy, **Then** the delivery and verification flow can be reconstructed.
4. **Given** the supporting documents, **When** a reviewer inspects them, **Then** checklist, tasks, and summary remain aligned.
5. **Given** the archived record, **When** a future maintainer looks for dependencies or rollback context, **Then** that information is still present.
6. **Given** any remaining limitations, **When** someone resumes the work, **Then** open questions are visible instead of implied.
    <!-- /ANCHOR:requirements -->

    ---

    <!-- ANCHOR:success-criteria -->
    ## 5. SUCCESS CRITERIA

    - **SC-001**: The archive explains the original objective for Blog Sort Dropdown Fix in plain language.
    - **SC-002**: The normalized documents follow the current template structure and validate without errors.
    - **SC-003**: Primary files, pages, or systems are listed for future reference.
    - **SC-004**: Verification expectations or completed checks are captured in supporting documents.
    - **SC-005**: Known risks, dependencies, or unanswered questions remain visible in the archive.
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
    ## 7. NON-FUNCTIONAL REQUIREMENTS

    ### Performance
    - **NFR-P01**: The archived record should make the major performance or operational target easy to identify.

    ### Security
    - **NFR-S01**: Security-sensitive assumptions mentioned in the archive remain visible for future review.

    ### Reliability
    - **NFR-R01**: Future maintainers can reconstruct the original delivery context without relying on broken references.

    ---

    ## 8. EDGE CASES

    ### Data Boundaries
    - Empty or partial archive notes should still preserve the minimum viable context.
    - Missing production evidence should remain clearly identified as archive-only context.

    ### Error Scenarios
    - If linked dependencies have drifted, the archive should still explain the original approach.
    - If rollout assumptions changed after archiving, validation should preserve the historical record rather than overwrite it.

    ---

    ## 9. COMPLEXITY ASSESSMENT

    | Dimension | Score | Triggers |
    |-----------|-------|----------|
    | Scope | 18/25 | Multiple files and coordinated updates documented in archive |
    | Risk | 16/25 | Archived context includes delivery and verification dependencies |
    | Research | 12/20 | Historical notes and analysis must remain discoverable |
    | Multi-Agent | 0/15 | Archived as a single preserved record |
    | Coordination | 10/15 | Multiple documents must stay aligned |
    | **Total** | **56/100** | **Level 3** |

    ---

    ## 10. RISK MATRIX

    | Risk ID | Description | Impact | Likelihood | Mitigation |
    |---------|-------------|--------|------------|------------|
    | R-001 | Archive structure drifts away from the original implementation context | H | M | Re-home original details into the current template structure |
    | R-002 | Historical references point to renamed or removed markdown files | M | M | Restrict normalized references to existing local documents |

    ---

    ## 11. USER STORIES

    ### US-001: Archive clarity (Priority: P0)

    **As a** maintainer, **I want** the archive for Blog Sort Dropdown Fix to explain what changed, **so that** I can resume work from reliable context.

    **Acceptance Criteria**:
    1. Given the archived folder, When I open `spec.md`, Then I can understand the original goal and scope.

    ---

    ### US-002: Verification traceability (Priority: P1)

    **As a** reviewer, **I want** plan, tasks, checklist, and summary documents to align, **so that** I can verify what was completed and what remained open.

    **Acceptance Criteria**:
    1. Given the normalized archive, When I inspect the supporting docs, Then risks, decisions, and verification remain traceable.

    ---

    ## 12. OPEN QUESTIONS

    - Resume implementation only after re-checking the current codebase against these archived assumptions.
    - Any remaining rollout or deployment steps should be treated as fresh work, not assumed complete from the archive alone.
    <!-- /ANCHOR:questions -->

    ---

    ## RELATED DOCUMENTS

    - **Implementation Plan**: See `plan.md`
    - **Task Breakdown**: See `tasks.md`
    - **Verification Checklist**: See `checklist.md`
    - **Decision Records**: See `decision-record.md`

    ---
