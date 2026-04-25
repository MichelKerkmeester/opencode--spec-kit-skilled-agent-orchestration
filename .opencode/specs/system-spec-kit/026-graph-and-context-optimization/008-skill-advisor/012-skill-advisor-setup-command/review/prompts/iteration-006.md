You are running iteration 6 of 7 in a deep-review loop.

# Iteration 6 — Maintainability: sk-doc Compliance, HVR, Install Guide Refactor

## Focus
Audit maintainability:
- sk-doc command_template.md Mode-Based compliance for `skill-advisor.md`
- HVR rule compliance across command markdown, install guide, implementation-summary
- Install guide refactor coherence (455 → 144 lines): no orphaned content, AI-FIRST PROMPT still functional
- Section vocabulary alignment with sk-doc Section 6 approved names
- DQI baselines: command 94/100, install guide 99/100 — verify with `extract_structure.py`
- mcp_server README addendum (Section 3.1.14) is accurate and not duplicative

## Required reads
1. Strategy + prior iterations (1-5)
2. `.opencode/command/spec_kit/skill-advisor.md`
3. `.opencode/install_guides/SET-UP - Skill Advisor.md`
4. `.opencode/specs/.../012-skill-advisor-setup-command/implementation-summary.md`
5. `.opencode/skill/sk-doc/assets/agents/command_template.md`
6. `.opencode/skill/sk-doc/references/global/hvr_rules.md`
7. `.opencode/skill/system-spec-kit/mcp_server/README.md` (Section 3.1.14)

## What to look for
- HVR banned words: leverage, robust, seamless, ecosystem, utilize, holistic, curate, harness, elevate, foster, empower, landscape, groundbreaking, cutting-edge, delve, illuminate, innovative, remarkable
- sk-doc Mode-Based template compliance: GATE 3 EXEMPT, USER INPUT, KEY BEHAVIORS, sequential numbering 1-13
- Install guide AI-FIRST PROMPT: copy-paste ready, includes prereq check, references command, includes rollback
- Command markdown DQI: run extract_structure.py and verify 90+ band
- Section vocabulary: every H2 in skill-advisor.md uses sk-doc-approved name (PURPOSE, USER INPUT, CONTRACT, WORKFLOW OVERVIEW, KEY BEHAVIORS, INSTRUCTIONS, OUTPUT FORMATS, REFERENCE, EXAMPLES, RELATED COMMANDS, COMMAND CHAIN, NEXT STEPS)
- mcp_server README addendum: cites correct command, links install guide, no duplicate scoring architecture description

## Outputs (MANDATORY)
Same three artifacts pattern with `iteration-006` suffix. ID prefix `F-MAINT-`.

## Constraints
- Read-only.
- Run actual scripts where applicable: `python3 .opencode/skill/sk-doc/scripts/extract_structure.py <file>`, `grep -niE 'leverage|robust|seamless|ecosystem|utilize|holistic|curate|harness|elevate|foster|empower|landscape|groundbreaking|cutting-edge|delve|illuminate|innovative|remarkable' <files>`.
- Cite file:line for every finding.
