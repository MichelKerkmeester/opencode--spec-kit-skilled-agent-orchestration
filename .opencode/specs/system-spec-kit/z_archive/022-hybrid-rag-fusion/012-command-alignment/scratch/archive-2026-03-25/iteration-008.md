# Review Findings: Wave 4, Agent B4

## Metadata
- Dimension: traceability + maintainability
- Files Reviewed: 7 YAML assets (phase, debug, handover, resume) + cross-refs
- Model: gpt-5.4
- Effort: high
- Wave: 4 of 5

## Findings

### [F-045] [P1] Phase workflows save context through undefined `parent_spec_path` token
- **File**: spec_kit_phase_auto.yaml:186,223; spec_kit_phase_confirm.yaml:223,281
- **Evidence**: Outputs define `parent_folder` but Step 6 invokes `generate-context.js {parent_spec_path}`.
- **Impact**: Context-save command not wireable from data produced by Step 3.
- **Fix**: Use canonical `parent_folder` variable or emit `parent_spec_path` earlier.

### [F-046] [P1] Resume workflows advertise four-source context priority but only implement two
- **File**: spec_kit_resume_auto.yaml:70,117-123; spec_kit_resume_confirm.yaml:70,141-148
- **Evidence**: Declared priority includes CONTINUE_SESSION.md and checklist.md, but loading logic only checks handover.md and memory/*.md.
- **Impact**: CONTINUE_SESSION.md and checklist.md are dead branches in documented priority.
- **Fix**: Add explicit load steps or remove from published priority list.

### [F-047] [P1] handover_full binds agent dispatch to wrong workflow shape and step number
- **File**: spec_kit_handover_full.yaml:178-179,218-229
- **Evidence**: Says agent available in "Step 3" but workflow uses unnumbered execution.steps list where item 3 is "Analyze context" not "Generate handover.md" (item 8).
- **Impact**: Agent routing rule unmappable to actual execution stage.
- **Fix**: Number steps or update availability condition.

### [F-048] [P2] Debug workflows split same spec reference across two placeholder families
- **File**: spec_kit_debug_auto.yaml:30-41,51,149; spec_kit_debug_confirm.yaml:30-41,51
- **Evidence**: `spec_path` vs `spec_folder_name`/`spec_folder_path` used interchangeably without alias mapping.
- **Fix**: Standardize on one placeholder family or add explicit alias derivation.

### [F-049] [P2] phase_confirm offers premature "Done" exit before required Step 7
- **File**: spec_kit_phase_confirm.yaml:286-289,297-330
- **Evidence**: Step 6 offers "Done" exit but Step 7 owns recursive validation. Auto variant has no such exit.
- **Fix**: Move terminal Done to Step 7 only.

## Validated as Correct
- Template paths in focus YAMLs resolve to real files under templates/
- Runtime agent filenames resolve under .opencode/agent/

## Summary
- Total findings: 5 (P0=0, P1=3, P2=2)
- newFindingsRatio: 0.10
