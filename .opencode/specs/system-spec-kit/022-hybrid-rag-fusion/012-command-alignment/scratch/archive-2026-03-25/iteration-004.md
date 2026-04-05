# Review Findings: Wave 2, Agent B2

## Metadata
- Dimension: correctness
- Files Reviewed: 9 (6 YAMLs + 3 command docs)
- Model: gpt-5.4
- Effort: high
- Wave: 2 of 5

## Findings

### [F-017] [P1] Plan save-context never invokes the required memory-generation step
- **File**: `spec_kit_plan_auto.yaml:419-430`, `spec_kit_plan_confirm.yaml:460-477`
- **Evidence**: plan.md:277-283 requires generate-context.js after Step 6. But YAMLs only Read SKILL.md, assume output filename, and call memory_save on assumed path.
- **Impact**: Step 6 can claim success without ever creating the memory file it tries to index.
- **Fix**: Add explicit generate-context.js call and index the actual emitted file.

### [F-018] [P1] Command tool allowlists do not permit the memory tools their YAMLs require
- **File**: `plan.md:1-4`, `implement.md:1-4`, `complete.md:1-4`
- **Evidence**: plan/implement allow memory_context/memory_search but not memory_save; complete allows no memory tools. YAMLs require them for context load/index steps.
- **Impact**: A compliant executor cannot perform documented context load/index steps.
- **Fix**: Align frontmatter allowed-tools with YAML contract.

### [F-019] [P1] Implement PRE/POSTFLIGHT definitions no longer match MCP contract
- **File**: `implement.md:282-305`, `spec_kit_implement_auto.yaml:370-389,469-489`
- **Evidence**: implement.md requires 0-100 scores and weighted learning index. YAMLs use 0-10 narrative scorecards and /3 averaging.
- **Impact**: Implementation mode cannot produce the learning records the command doc specifies.
- **Fix**: Replace narrative blocks with actual MCP-call schema from implement.md.
- **Note**: Overlaps with F-009 (same root cause, different evidence angle).

### [F-020] [P1] `:with-research` is inserted before specification instead of at planning Step 6
- **File**: `complete.md:98`, `spec_kit_complete_auto.yaml:37-38,462-476`
- **Evidence**: complete.md says research at Step 6. YAMLs run phase_3_research before step_3_specification.
- **Impact**: Workflow order contradicts documented lifecycle; research starts before spec artifacts exist.
- **Fix**: Move research insertion to planning boundary.
- **Note**: Overlaps with F-010 (same root cause, more evidence).

### [F-021] [P1] Checklist evidence is required before implementation exists
- **File**: `spec_kit_implement_auto.yaml:352-360`, `spec_kit_complete_auto.yaml:539-549`
- **Evidence**: YAMLs require verifying checklist items and marking evidence before development step. Docs reserve verification for post-implementation.
- **Impact**: Forces premature pass/fail decisions before code/tests exist.
- **Fix**: Split checklist generation from post-implementation verification.

### [F-022] [P2] Complete auto/confirm variants do not emit identical step outputs
- **File**: `spec_kit_complete_auto.yaml:512-515` vs `spec_kit_complete_confirm.yaml:549-551`
- **Evidence**: Auto includes Step 3 location output that confirm omits. Multiple output shape differences.
- **Fix**: Normalize outputs between variants.

### [F-023] [P2] Task completion markers are internally inconsistent
- **File**: `spec_kit_implement_auto.yaml:409` vs `spec_kit_implement_auto.yaml:290`
- **Evidence**: Development steps use [X], enforcement checks count [x].
- **Fix**: Standardize on one checkbox form.

## Summary
- Total findings: 7 (P0=0, P1=5, P2=2)
- Duplicate overlaps: F-019≈F-009, F-020≈F-010
- newFindingsRatio: 0.71 (5 unique new P1s after dedup)
