# Iteration 002 — Traceability, references/structure/

**Agent**: A2 (gpt 5.4, high)
**Dimension**: Traceability
**Model**: gpt-5.4
**Duration**: ~3m 10s

## Findings

### Finding 002-F1
- **Severity**: P2
- **Dimension**: traceability
- **File**: `.opencode/skill/system-spec-kit/references/structure/folder_structure.md:252`
- **Title**: Sub-folder examples flatten phased packets into generic iterations
- **Evidence**: "Iterative Work (Sub-folders)" shows flat `001-endpoint-analysis/` pattern
- **Expected**: Show 022 pattern: root coordination packet with point-in-time spec.md + numbered child phase packets
- **Impact**: Readers won't model coordination-root + phase-packet topology correctly
- **Fix**: Add phased coordination packet example showing root docs + 001-019 direct phases

### Finding 002-F2
- **Severity**: P1
- **Dimension**: traceability
- **File**: `.opencode/skill/system-spec-kit/references/structure/folder_routing.md:254`
- **Title**: Fallback routing uses numeric heuristics instead of explicit root-or-phase targeting
- **Evidence**: "Suggests highest-numbered" via `ls specs/ | grep "^[0-9]" | sort -rn | head -1`
- **Expected**: Phase-aware guidance: prefer explicit root packet or explicit full phase path
- **Impact**: In 19-phase tree, highest-numbered misroutes context into wrong packet
- **Fix**: Replace highest-numbered fallback with phase-aware routing guidance + 022-style examples

### Finding 002-F3
- **Severity**: P1
- **Dimension**: traceability
- **File**: `.opencode/skill/system-spec-kit/references/structure/phase_definitions.md:124`
- **Title**: Child phase spec example teaches pre-normalization YAML back-reference format
- **Evidence**: Uses YAML `parent: specs/###-parent-feature/` and `phase: 1 of 3`
- **Expected**: Match 022 reality: in-document metadata table with Parent Spec, Predecessor, Successor
- **Impact**: Teaches obsolete child navigation contract; authors will omit neighboring-phase links
- **Fix**: Replace YAML example with 022-style metadata table as canonical pattern

### Finding 002-F4
- **Severity**: P1
- **Dimension**: traceability
- **File**: `.opencode/skill/system-spec-kit/references/structure/phase_definitions.md:207`
- **Title**: PHASE_LINKS rules omit neighboring-phase navigation requirements
- **Evidence**: Only checks parent back-reference, status consistency, naming convention
- **Expected**: Include predecessor/successor checks per 022 normalization
- **Impact**: Newly standardized neighbor navigation invisible; same drift can recur
- **Fix**: Expand PHASE_LINKS to include predecessor/successor checks

### Finding 002-F5
- **Severity**: P2
- **Dimension**: traceability
- **File**: `.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:205`
- **Title**: Nested-path guidance stops at parent/child, not 022-style deeper packet families
- **Evidence**: Examples only show two-level nesting: `003-parent/121-child`
- **Expected**: Cover deeper trees like 022->001-epic->010-sprint (3+ levels)
- **Impact**: Future deep-nested packet families documented as if only one child level exists
- **Fix**: Add three-level 022-style example distinguishing root, phase, and deeper descendants

## Summary
- P0: 0
- P1: 3
- P2: 2
- Files reviewed: folder_structure.md, folder_routing.md, phase_definitions.md, sub_folder_versioning.md, 022/spec.md, 022/002-indexing-normalization/spec.md
- newFindingsRatio: 0.607
