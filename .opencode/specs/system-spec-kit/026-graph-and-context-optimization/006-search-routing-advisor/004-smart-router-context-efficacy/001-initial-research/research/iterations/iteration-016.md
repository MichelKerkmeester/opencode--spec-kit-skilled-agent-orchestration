# Iteration 016 - Assistant Compliance and Blind-Following

## Focus Questions

V2, V4, V7

## Tools Used

- Behavioral inference from instructions and hook output
- Review of corpus mismatches and no-op cases

## Sources Queried

- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts`
- Iteration 002 mismatch list

## Findings

- The visible brief uses imperative wording: `use <skill>`. This maximizes routing clarity but could encourage blind following when the underlying advisor is wrong. (sourceStrength: primary)
- Existing global instructions still require skill loading when a task clearly matches a skill and instruct agents to read `SKILL.md`; this means a high-confidence advisor brief may not be sufficient to make assistants skip skill reads without changing global instructions. (sourceStrength: primary)
- Low-confidence no-brief behavior is important: when no recommendation passes threshold, the hook does not add a misleading instruction, so the assistant should fall back to normal reasoning. (sourceStrength: primary)
- An OpenCode plugin should not claim that the assistant may skip `SKILL.md` entirely unless the skill body has a compact route contract or the global instruction set is changed to allow "brief-only" routing. (sourceStrength: moderate)
- Recommended wording experiment: compare `use <skill>` versus `consider <skill>` versus `route: <skill>` in an isolated transcript harness, measuring correct skill choice and unnecessary file reads. (sourceStrength: moderate)

## Novelty Justification

This pass surfaced a key tension: the brief reduces preload, but current global skill rules can still force `SKILL.md` reads.

## New Info Ratio

0.19

## Next Iteration Focus

Prepare final synthesis structure and evidence grading.
