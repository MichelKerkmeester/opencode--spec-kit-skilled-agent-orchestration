# Iteration 004 — Traceability, references/validation/

**Agent**: A4 (gpt 5.4, high)
**Dimension**: Traceability
**Model**: gpt-5.4
**Duration**: ~3m 25s

## Findings

### Finding 004-F1
- **Severity**: P1
- **Dimension**: traceability
- **File**: `.opencode/skill/system-spec-kit/references/validation/validation_rules.md:888`
- **Title**: PHASE_LINKS documents obsolete `parent:` frontmatter instead of metadata-table navigation
- **Evidence**: Uses `parent: specs/042-payment-system/` YAML frontmatter example
- **Expected**: 022 pattern uses metadata-table navigation: `Parent Spec | ../spec.md`, `Predecessor | ...`, `Successor | ...`
- **Impact**: Reviewers pointed toward pre-normalization format
- **Fix**: Rewrite PHASE_LINKS examples to use metadata-table navigation contract

### Finding 004-F2
- **Severity**: P2
- **Dimension**: traceability
- **File**: `.opencode/skill/system-spec-kit/references/validation/phase_checklists.md:122`
- **Title**: Phase completion checklist omits recursive phase-link truth verification
- **Evidence**: "Before Claiming Complete" only requires P0 evidence + browser test + save context
- **Expected**: Require recursive validation, direct-child phase discovery, PHASE_LINKS warning review
- **Impact**: Reviewer can complete workflow without checking root phase map vs live child tree
- **Fix**: Add phased-spec branch with PHASE_LINKS verification steps

### Finding 004-F3
- **Severity**: P1
- **Dimension**: traceability
- **File**: `.opencode/skill/system-spec-kit/references/validation/path_scoped_rules.md:57`
- **Title**: Path-scoped rules only describe shallow `specs/*/`, not deep nested packet families
- **Evidence**: Pattern table uses `specs/*/` for level-appropriate validation
- **Expected**: Cover recursive paths like `specs/system-spec-kit/022-hybrid-rag-fusion/015-.../`
- **Impact**: Under-specifies validation for deep packet paths 022 depends on
- **Fix**: Replace shallow pattern with recursive spec-root patterns

### Finding 004-F4
- **Severity**: P1
- **Dimension**: traceability
- **File**: `.opencode/skill/system-spec-kit/references/validation/decision_format.md:30`
- **Title**: Decision format models gate logs, not ADR records
- **Evidence**: Defines GATE/DECISION/CONFIDENCE format only, no ADR structure
- **Expected**: Include ADR-style decisions like 022's ADR-001 with identifier, status, context, alternatives
- **Impact**: Level 3+ traceability lacks architectural decision record format
- **Fix**: Add ADR section with canonical format for coordination-root decision records

### Finding 004-F5
- **Severity**: P1
- **Dimension**: traceability
- **File**: `.opencode/skill/system-spec-kit/references/validation/five_checks.md:32`
- **Title**: Five Checks wrongly exempt documentation-only coordination decisions
- **Evidence**: "Not Required" includes "Documentation-only changes"
- **Expected**: Narrow exemption to trivial copy/layout; require Five Checks for coordination contract changes
- **Impact**: Root-packet normalization changes skip formal decision scrutiny
- **Fix**: Narrow exemption, require Five Checks when docs modify coordination contracts or ADR-governed decisions

## Summary
- P0: 0
- P1: 4
- P2: 1
- Files reviewed: validation_rules.md, phase_checklists.md, path_scoped_rules.md, decision_format.md, five_checks.md, 022/checklist.md
- newFindingsRatio: 0.304
