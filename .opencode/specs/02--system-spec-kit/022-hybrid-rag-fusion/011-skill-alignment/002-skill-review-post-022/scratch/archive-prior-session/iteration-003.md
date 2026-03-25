# Iteration 003 — Correctness, references/templates/

**Agent**: A3 (codex 5.3, xhigh)
**Dimension**: Correctness
**Model**: gpt-5.3-codex
**Duration**: ~7m 53s

## Findings

### Finding 003-F1
- **Severity**: P1
- **Dimension**: correctness
- **File**: `.opencode/skill/system-spec-kit/references/templates/template_style_guide.md:52`
- **Title**: Level metadata format excludes Level 3+ coordination specs
- **Evidence**: `"Level: [FORMAT: 1 / 2 / 3]"` — no 3+ option
- **Expected**: Include `3+` and coordination-root table-style exception with snapshot language
- **Impact**: Authors can incorrectly downgrade/reformat valid 3+ coordination docs
- **Fix**: Update metadata format to `1 / 2 / 3 / 3+` with coordination-root exception

### Finding 003-F2
- **Severity**: P1
- **Dimension**: correctness
- **File**: `.opencode/skill/system-spec-kit/references/templates/level_selection_guide.md:93`
- **Title**: Level 3+ selection hard-tied to 80-100 complexity, missing coordination-root exception
- **Evidence**: `| 80-100 | 3+ | Extended |`
- **Expected**: Allow Level 3+ for coordination-root packets even below 80 complexity
- **Impact**: 022-style root packets misclassified as Level 3
- **Fix**: Add coordination-root override rule with examples

### Finding 003-F3
- **Severity**: P1
- **Dimension**: correctness
- **File**: `.opencode/skill/system-spec-kit/references/templates/level_specifications.md:374`
- **Title**: Level 3+ spec requirements omit coordination-root content contract
- **Evidence**: Focus on Complexity Assessment + Executive Summary, no coordination patterns
- **Expected**: Include point-in-time snapshots, direct-phase map, current-tree-truth precedence
- **Impact**: Level 3+ output can drift from 022 normalized reality
- **Fix**: Add Level 3+ coordination profile subsection

### Finding 003-F4
- **Severity**: P1
- **Dimension**: correctness
- **File**: `.opencode/skill/system-spec-kit/references/templates/template_guide.md:227`
- **Title**: Level 3+ adaptation workflow lacks coordination-root branch
- **Evidence**: Only AI protocol/checklist/governance items; no coordination-root path
- **Expected**: Coordination-root adaptation path with snapshot metadata and phase-map alignment
- **Impact**: Template users produce governance-heavy but 022-incompatible root packets
- **Fix**: Add "If spec is root coordination packet" steps in Level 3+ section

## Summary
- P0: 0
- P1: 4
- P2: 0
- Files reviewed: level_specifications.md, template_guide.md, template_style_guide.md, level_selection_guide.md, 022/spec.md
- newFindingsRatio: 0.417
