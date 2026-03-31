---
        title: "Feature Specification: Video Play/Pause Button Hover Effect"
        description: "Add a scale animation to .video--pause and .video--play icons when hovering over .video--play-pause-btn."
        trigger_phrases:
          - "006-video-play-pause-hover"
          - "archive"
          - "specification"
        importance_tier: "normal"
        contextType: "general"
        ---
        # Feature Specification: Video Play/Pause Button Hover Effect

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
        | **Branch** | `.opencode/specs/01--anobel.com/z_archive/006-video-play-pause-hover` |
        <!-- /ANCHOR:metadata -->

        ---

        <!-- ANCHOR:problem -->
        ## 2. PROBLEM & PURPOSE

        ### Problem Statement
        Video Play/Pause Button Hover Effect Overview Add a scale animation to `.video--pause` and `.video--play` icons when hovering over `.video--play-pause-btn`. Requirements - On hover of `.video--play-pause-btn`, scale up the nested play/pause icons - Use the existing `data-trigger` / `data-hover` CSS pattern from `link_card_image.css` - Scale factor: 15% (more noticeable for small icons) - Smooth 300ms transition - Respect `prefers-reduced-motion` accessibility preference Structure Technical Approach Uses CSS custom property `--_state---on` (0 or 1) with `clamp()` for smooth state transitions: Files - **CSS:** `src/1_css/animations/video_play_pause_btn.css` Plan: Video Play/Pause Hover Effect Phase 1: CSS Implementation 1.

        ### Purpose
        Keep the archived record for Video Play/Pause Button Hover Effect readable, structurally valid, and faithful to the original implementation intent.
        <!-- /ANCHOR:problem -->

        ---

        <!-- ANCHOR:scope -->
        ## 3. SCOPE

        ### In Scope
        - description: "Add a scale animation to .video--pause and .video--play icons when hovering over .video--play-pause-btn.".
- Add a scale animation to `.video--pause` and `.video--play` icons when hovering over `.video--play-pause-btn`.
- ## Phase 1: CSS Implementation.

        ### Out of Scope
        - Re-implementing the archived feature from scratch.
- Changing production behavior beyond documentation normalization.
- Replacing historical decisions that belong to the archive record.

        ### Files to Change

        | File Path | Change Type | Description |
        |-----------|-------------|-------------|
        | `link_card_image.css` | Modify | Referenced by the archived work and retained in the normalized record |
| `src/1_css/animations/video_play_pause_btn.css` | Modify | Referenced by the archived work and retained in the normalized record |
| `src/1_css/animations/link_card_image.css` | Modify | Referenced by the archived work and retained in the normalized record |
        <!-- /ANCHOR:scope -->

        ---

        <!-- ANCHOR:requirements -->
        ## 4. REQUIREMENTS

        ### P0 - Blockers (MUST complete)

        | ID | Requirement | Acceptance Criteria |
        |----|-------------|---------------------|
        | REQ-001 | The archived record clearly captures the core change described for Video Play/Pause Button Hover Effect. | Reviewer can confirm this is explicitly documented in the archive folder |
        | REQ-002 | The normalized spec identifies the primary files, components, or pages affected by the work. | Reviewer can confirm this is explicitly documented in the archive folder |

        ### P1 - Required (complete OR user-approved deferral)

        | ID | Requirement | Acceptance Criteria |
        |----|-------------|---------------------|
        | REQ-003 | The archive explains how success was verified or intended to be verified. | Reviewer can confirm this is explicitly documented in the archive folder |

        ### Acceptance Scenarios

        1. **Given** the archived documents for Video Play/Pause Button Hover Effect, **When** a reviewer opens `spec.md`, **Then** the original problem and purpose are clear.
2. **Given** the scope section, **When** a reviewer checks the documented implementation surface, **Then** primary references such as `link_card_image.css` are visible.
        <!-- /ANCHOR:requirements -->

        ---

        <!-- ANCHOR:success-criteria -->
        ## 5. SUCCESS CRITERIA

        - **SC-001**: The archive explains the original objective for Video Play/Pause Button Hover Effect in plain language.
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
