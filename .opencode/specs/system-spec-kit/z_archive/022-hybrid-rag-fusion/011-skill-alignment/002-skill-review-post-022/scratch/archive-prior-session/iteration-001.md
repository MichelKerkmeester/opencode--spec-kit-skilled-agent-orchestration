# Iteration 001 — Correctness, SKILL.md sections 1-3

**Agent**: A1 (codex 5.3, xhigh)
**Dimension**: Correctness
**Model**: gpt-5.3-codex
**Duration**: ~4m 6s

## Findings

### Finding 001-F1
- **Severity**: P1
- **Dimension**: correctness
- **File**: `.opencode/skill/system-spec-kit/SKILL.md:336`
- **Title**: Gate 3 options missing phase-folder routing (Option E)
- **Evidence**: `"**Spec Folder** (required): A) Existing | B) New | C) Update related | D) Skip"`
- **Expected**: Include Option E for phase-folder routing aligned to 022 direct-child phase workflow (parent link + neighboring phase references)
- **Impact**: Agents may route phase work as generic "new spec," causing invalid phase navigation and PHASE_LINKS validation warnings
- **Fix**: Update Gate 3 prompt/table to include **E) Phase folder** with example path and phase-link normalization guidance
- **Note**: CLAUDE.md already includes Option E — SKILL.md needs alignment

### Finding 001-F2
- **Severity**: P1
- **Dimension**: correctness
- **File**: `.opencode/skill/system-spec-kit/SKILL.md:20`
- **Title**: Spec-folder definition too narrow for normalized parent/child packet topology
- **Evidence**: `"contains all documentation for a single feature or task"` and `"Always under specs/ directory with format ###-short-name/"`
- **Expected**: Support coordination-root + nested packet forms used by 022 (e.g., `022-hybrid-rag-fusion/011-skill-alignment/002-child/`)
- **Impact**: Incorrect folder assumptions can misplace docs and break navigation consistency
- **Fix**: Broaden definition to include domain-parent + child packet patterns, not only flat `specs/###-short-name/`

### Finding 001-F3
- **Severity**: P2
- **Dimension**: correctness
- **File**: `.opencode/skill/system-spec-kit/SKILL.md:22`
- **Title**: Core guidance omits ADR-001 coordination-document and snapshot truth model
- **Evidence**: Section 1 describes generic spec tracking, no "coordination document" / "point-in-time snapshot" / "current tree truth" language
- **Expected**: Reflect ADR-001: root packet as coordination document with tree truth and point-in-time snapshots
- **Impact**: Future root docs can drift back to historical synthesis prose
- **Fix**: Add root-coordination subsection with "tree truth over historical synthesis" and snapshot-reporting rules

## Summary
- P0: 0
- P1: 2
- P2: 1
- Files reviewed: SKILL.md, 022/spec.md, 022/decision-record.md
- newFindingsRatio: 0.647
