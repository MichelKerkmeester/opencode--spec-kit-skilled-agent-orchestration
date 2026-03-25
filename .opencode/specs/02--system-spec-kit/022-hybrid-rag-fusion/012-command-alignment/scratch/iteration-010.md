# Review Findings: Wave 5, Agent B5

## Metadata
- Dimension: maintainability
- Files Reviewed: 17 YAML assets
- Model: gpt-5.4
- Effort: high
- Wave: 5 of 5

## Findings

### [F-059] [P2] Workflow node naming uses three different executable schemas
- **File**: plan_auto.yaml:284-305, complete_auto.yaml:419-462, deep-research_auto.yaml:89-98, handover_full.yaml:218-229
- **Evidence**: step_* nodes, phase_* containers with nested step_*, flat execution.steps list.
- **Fix**: Standardize on one schema or version schema families.

### [F-060] [P2] Spec-folder concept named four different ways
- **File**: debug_auto.yaml:30-31,51; plan_auto.yaml:31,59; deep-research_auto.yaml:145-153
- **Evidence**: spec_path, spec_folder, specFolder, spec-folder used interchangeably.
- **Fix**: Pick one name (spec_folder) and confine alternates to external JSON payloads.

### [F-061] [P2] Auto/confirm variant symmetry not uniform
- **File**: resume_auto.yaml:116-140 vs resume_confirm.yaml:140-183
- **Evidence**: resume_confirm inserts extra step, renumbers downstream, changes output shape.
- **Fix**: Preserve shared step IDs or formally declare variant deltas.

### [F-062] [P2] handover_full missing common recovery-section contract
- **File**: handover_full.yaml:218-234 vs debug_auto.yaml:258-266
- **Evidence**: Only asset without explicit error_recovery section.
- **Fix**: Add standard error_recovery block or mark as different schema.

## Summary
- Total findings: 4 (P0=0, P1=0, P2=4)
- newFindingsRatio: 0.06
- No dead/unreachable skip_to targets found
- Indentation/formatting generally consistent
