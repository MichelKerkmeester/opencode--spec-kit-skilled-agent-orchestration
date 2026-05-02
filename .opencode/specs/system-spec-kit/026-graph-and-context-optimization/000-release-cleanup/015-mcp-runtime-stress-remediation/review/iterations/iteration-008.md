# Iteration 008 - Maintainability: 028 contract impact

## Focus
028 contract impact; legacy compatibility; doc/code alignment. Source focus from `deep-review-strategy.md` iteration 8.

## Sources Read
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/review/deep-review-strategy.md:36`
- `.opencode/skill/system-spec-kit/references/structure/folder_structure.md:181`
- `.opencode/skill/system-spec-kit/references/structure/folder_structure.md:196`
- `.opencode/skill/system-spec-kit/references/structure/folder_structure.md:207`
- `.opencode/skill/system-spec-kit/references/structure/folder_structure.md:219`
- `.opencode/skill/sk-deep-review/SKILL.md:303`
- `.opencode/skill/sk-deep-review/references/state_format.md:43`

## Findings

### F-006
```json
{"id":"F-006","severity":"P2","dimension":"maintainability","summary":"folder_structure.md's illustrated child-phase layout still teaches a pt-01 default before the post-028 flat-first rule.","evidence":".opencode/skill/system-spec-kit/references/structure/folder_structure.md:196","status":"new"}
```
Severity rationale: the normative prose is correct later in the same section, so this is a reader-confusion risk, not a contract break.

Evidence: the example layout shows child-phase `research/019-system-hardening-pt-01/` at `folder_structure.md:196` and `review/019-system-hardening-pt-01/` at `folder_structure.md:207`, while the post-028 rule says first runs go flat at `folder_structure.md:219`.

## New Info Ratio
0.05. New weighted findings: P2 = 1. Any weighted findings considered: five P1 + two P2 = 27.

## Quality Gates
- Evidence: pass.
- Scope: pass. Maintains focus on 028 doc/code alignment.
- Coverage: maintainability dimension covered.

## Convergence Signal
approaching-convergence
