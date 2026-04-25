# Iteration 6 - Maintainability: sk-doc Compliance, HVR, Install Guide Refactor

## Summary

This pass audited the command markdown, install guide, implementation summary, sk-doc command template, HVR rules, and the mcp_server README Skill Advisor addendum. The DQI baselines still pass: `skill-advisor.md` scored 94/100 Excellent and `SET-UP - Skill Advisor.md` scored 99/100 Excellent via `extract_structure.py`. The required HVR grep found no hits in the command markdown, install guide, or implementation summary. README-wide grep returned only `curate` substring matches inside `accurately` / `accurate`, outside Section 3.1.14, so there is no actionable HVR banned-word use in the addendum.

The install guide refactor is mostly coherent: the AI-first prompt is copy-paste ready, includes prerequisite checks, invokes `/spec_kit:skill-advisor:confirm`, and includes rollback/build commands. The maintainability issues are narrower: `skill-advisor.md` has extra/unapproved H2 vocabulary despite the numbered 1-13 spine, the mcp_server README addendum repeats an unresolved “mutation boundaries enforced” claim contradicted by prior review evidence, and the implementation summary overstates the refactored guide as a per-phase walkthrough.

## Findings

### P0 (Blockers)

- None.

### P1 (Required)

- F-MAINT-001: `skill-advisor.md` does not fully comply with the sk-doc approved H2 vocabulary despite having a sequential 1-13 numbered spine.
  - Evidence: `.opencode/command/spec_kit/skill-advisor.md:20`, `.opencode/command/spec_kit/skill-advisor.md:47`, `.opencode/command/spec_kit/skill-advisor.md:252`, `.opencode/skill/sk-doc/assets/agents/command_template.md:276-299`, `.opencode/skill/sk-doc/assets/agents/command_template.md:1127-1140`
  - Impact: The command includes `## CONSTRAINTS`, `## 0. UNIFIED SETUP PHASE`, and `## 9. SCORING SYSTEM REFERENCE`, none of which appear in the approved command section vocabulary requested for this review. `## GATE 3 STATUS: EXEMPT` is template-supported and should remain, but the other extra H2s weaken cross-command consistency and make the template compliance claim harder to verify.
  - Remediation: Demote `CONSTRAINTS` and `0. UNIFIED SETUP PHASE` to H3 or merge them under `USER INPUT` / `INSTRUCTIONS`. Rename or fold `SCORING SYSTEM REFERENCE` into `REFERENCE` or another approved section name, while preserving the sequential 1-13 command spine.

- F-MAINT-002: The mcp_server README Skill Advisor addendum says mutation boundaries are “enforced in YAML,” but prior iterations already showed the YAML only declares boundaries and lacks concrete pre-write enforcement.
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/README.md:592`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/iterations/iteration-002.md:22-25`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/iterations/iteration-004.md:22-25`
  - Impact: Section 3.1.14 is otherwise accurate and links the correct command plus install guide, but this sentence upgrades a documented intent into an enforcement claim. That can mislead maintainers into believing path allowlist / denylist validation already exists.
  - Remediation: Change the addendum wording to “mutation boundaries declared in YAML” until the hard pre-apply target validation from F-CORR-006 / F-SEC-002 exists, or link to the exact enforcement step once implemented.

### P2 (Suggestions)

- F-MAINT-003: The implementation summary overstates the refactored install guide as containing a “per-phase walkthrough.”
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/implementation-summary.md:73`, `.opencode/install_guides/SET-UP - Skill Advisor.md:69-77`
  - Impact: The 144-line guide contains a copy-paste AI prompt and a compact five-phase diagram, but it delegates full phase detail to command markdown rather than walking through each phase. This is a minor coherence drift after the 455 -> 144 line refactor.
  - Remediation: Either add a short phase table to the guide, or revise the implementation summary phrase from “per-phase walkthrough” to “phase overview.”

## Non-Findings / Confirmed Correct

- DQI baselines still pass: command markdown scored 94/100 Excellent and install guide scored 99/100 Excellent with `python3 .opencode/skill/sk-doc/scripts/extract_structure.py`.
- The required HVR grep found no matches in `.opencode/command/spec_kit/skill-advisor.md`, `.opencode/install_guides/SET-UP - Skill Advisor.md`, or the packet `implementation-summary.md`.
- README Section 3.1.14 itself has no HVR banned-word matches. Whole-file README matches are substring false positives on `accurately` and `accurate` outside the addendum. Evidence: `.opencode/skill/system-spec-kit/mcp_server/README.md:428`, `.opencode/skill/system-spec-kit/mcp_server/README.md:500`, `.opencode/skill/system-spec-kit/mcp_server/README.md:570-604`.
- The install guide AI-first prompt includes prerequisite checks, a command invocation, approval-gate instructions, rollback, and rebuild commands. Evidence: `.opencode/install_guides/SET-UP - Skill Advisor.md:10-36`.
- The install guide is 144 lines and includes the expected run, verification, rollback, troubleshooting, and resource sections. Evidence: `.opencode/install_guides/SET-UP - Skill Advisor.md:42-144`.
- README Section 3.1.14 cites the correct command and links the end-user install guide. Evidence: `.opencode/skill/system-spec-kit/mcp_server/README.md:590-592`.
- README Section 3.1.14 has one local architecture paragraph and one fusion-lane paragraph; no duplicate scoring architecture block was found inside the addendum. Evidence: `.opencode/skill/system-spec-kit/mcp_server/README.md:580-584`.

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/deep-review-strategy.md:1-103`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/deep-review-state.jsonl:1-6`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/iterations/iteration-001.md:1-48`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/iterations/iteration-002.md:1-77`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/logs/iteration-003.log:170-316`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/iterations/iteration-004.md:1-85`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/iterations/iteration-005.md:1-102`
- `.opencode/command/spec_kit/skill-advisor.md:1-320`
- `.opencode/install_guides/SET-UP - Skill Advisor.md:1-144`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/implementation-summary.md:1-162`
- `.opencode/skill/sk-doc/assets/agents/command_template.md:276-299`
- `.opencode/skill/sk-doc/assets/agents/command_template.md:720-829`
- `.opencode/skill/sk-doc/assets/agents/command_template.md:1127-1140`
- `.opencode/skill/sk-doc/references/global/hvr_rules.md:1-120`
- `.opencode/skill/system-spec-kit/mcp_server/README.md:570-604`

## Verification Commands

- `python3 .opencode/skill/sk-doc/scripts/extract_structure.py .opencode/command/spec_kit/skill-advisor.md`
- `python3 .opencode/skill/sk-doc/scripts/extract_structure.py '.opencode/install_guides/SET-UP - Skill Advisor.md'`
- `grep -niE 'leverage|robust|seamless|ecosystem|utilize|holistic|curate|harness|elevate|foster|empower|landscape|groundbreaking|cutting-edge|delve|illuminate|innovative|remarkable' .opencode/command/spec_kit/skill-advisor.md '.opencode/install_guides/SET-UP - Skill Advisor.md' .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/implementation-summary.md .opencode/skill/system-spec-kit/mcp_server/README.md`

## Convergence Signals
