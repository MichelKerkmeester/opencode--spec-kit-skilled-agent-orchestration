You are running iteration 4 of 5 in a CLOSURE re-review loop.

# Iteration 4 — Closure Verification: Maintainability (F-MAINT-001..003 + DQI baselines)

## Required reads
1. `.opencode/specs/.../012-skill-advisor-setup-command/review-pt-02/deep-review-strategy.md`
2. `.opencode/specs/.../012-skill-advisor-setup-command/review-pt-02/iterations/iteration-{001,002,003}.md`
3. `.opencode/specs/.../012-skill-advisor-setup-command/review/iterations/iteration-006.md` (original F-MAINT findings)
4. CURRENT command markdown, install guide, implementation-summary, mcp_server README

## What to verify

- F-MAINT-001: `skill-advisor.md` H2 vocabulary: SCORING SYSTEM REFERENCE folded
  → expect: section 9 is now `## 9. EXAMPLES` (not SCORING); section count compresses 1-12 (not 1-13); CONSTRAINTS and `## 0. UNIFIED SETUP PHASE` retained as family convention; "Five Scoring Lanes" + "Mutation Boundaries" exist as H3 subsections under `## 8. REFERENCE`
- F-MAINT-002: mcp_server README §3.1.14 wording
  → expect: "validated in Phase 3 by canonical-path validator (realpath + repo-relative + allowlist exact-match)" replacing "enforced in YAML"
- F-MAINT-003 (P2): implementation-summary "per-phase walkthrough" → "phase overview"
  → expect: line ~73 says "phase overview diagram"

## Verification commands to run

```bash
# DQI baselines (must hold band)
python3 .opencode/skill/sk-doc/scripts/extract_structure.py .opencode/command/spec_kit/skill-advisor.md
python3 .opencode/skill/sk-doc/scripts/extract_structure.py '.opencode/install_guides/SET-UP - Skill Advisor.md'

# HVR check (must remain 0 banned words)
grep -niE 'leverage|robust|seamless|ecosystem|utilize|holistic|curate|harness|elevate|foster|empower|landscape|groundbreaking|cutting-edge|delve|illuminate|innovative|remarkable' \
  .opencode/command/spec_kit/skill-advisor.md \
  '.opencode/install_guides/SET-UP - Skill Advisor.md' \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/implementation-summary.md
```

Report DQI scores and HVR results in your iteration markdown.

## Outputs (MANDATORY)
Same three artifacts pattern with `iteration-004` suffix. ID prefix `F-MAINT-` for any new findings.

## Constraints
- Read-only.
- Run the verification commands above.
- Cite file:line for every verdict.
