# Iteration 006 — Maintainability, references/workflows/

**Agent**: A6 (gpt 5.4, high)
**Dimension**: Maintainability
**Model**: gpt-5.4
**Duration**: ~2m 58s

## Findings

### Finding 006-F1
- **Severity**: P1
- **Dimension**: maintainability
- **File**: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:231`
- **Title**: Update/create guidance doesn't distinguish coordination root from active child phase
- **Evidence**: Decision table says "update existing spec" for iterative work; never states concrete work should resume in child phase
- **Expected**: Explicitly state root packet is coordination/snapshot only; implementation happens in child phase
- **Impact**: Maintainers append implementation detail to root, recreating drift
- **Fix**: Add phased-work rule: if target has phase children, resume in child; root for coordination only

### Finding 006-F2
- **Severity**: P1
- **Dimension**: maintainability
- **File**: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:481`
- **Title**: Resume/memory guidance assumes single active packet, no phase awareness
- **Evidence**: Resume points to `specs/###-folder/memory/` with no root-vs-child distinction
- **Expected**: Detect parent-with-children, prompt for child selection, save to child
- **Impact**: Resume flows reopen parent context instead of active child
- **Fix**: Add phased resume/save flow with parent-with-children detection

### Finding 006-F3
- **Severity**: P1
- **Dimension**: maintainability
- **File**: `.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:118`
- **Title**: Execution methods teach legacy subfolder creation, not coordination-root phase operations
- **Evidence**: Uses `create.sh --subfolder` and single-folder `validate.sh` examples
- **Expected**: Show `create.sh --phase <parent>` and `validate.sh <parent> --recursive`
- **Impact**: Maintainers infer phase workflow; may use generic subfolder patterns
- **Fix**: Add phase creation and recursive validation examples

### Finding 006-F4
- **Severity**: P2
- **Dimension**: maintainability
- **File**: `.opencode/skill/system-spec-kit/references/workflows/worked_examples.md:153`
- **Title**: No worked example shows normalized coordination-root packet for large decomposed work
- **Evidence**: Highest-complexity example is single-folder Level 3 architecture change
- **Expected**: At least one phased coordination example with root snapshot, child phases, child-first resume
- **Impact**: Readers model complex work as single synthesized packet
- **Fix**: Add phased coordination worked example

## Summary
- P0: 0, P1: 3, P2: 1
- newFindingsRatio: 0.188
