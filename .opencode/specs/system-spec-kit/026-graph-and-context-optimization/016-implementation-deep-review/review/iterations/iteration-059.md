# Iteration 59 - correctness - skill-md-part2

## Dispatcher
- iteration: 59 of 70
- dispatcher: cli-copilot gpt-5.4 high (operational doc review)
- timestamp: 2026-04-16T07:01:18.661Z

## Files Reviewed
- .opencode/skill/sk-code-opencode/SKILL.md
- .opencode/skill/sk-code-review/SKILL.md
- .opencode/skill/sk-code-web/SKILL.md
- .opencode/skill/sk-deep-research/SKILL.md
- .opencode/skill/sk-deep-review/SKILL.md
- .opencode/skill/sk-doc/SKILL.md
- .opencode/skill/sk-git/SKILL.md
- .opencode/skill/sk-improve-agent/SKILL.md
- .opencode/skill/sk-improve-prompt/SKILL.md
- .opencode/skill/system-spec-kit/SKILL.md

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. `.opencode/skill/sk-deep-research/SKILL.md:16-20` publishes a runtime path contract for OpenCode/Copilot, Claude, and Codex only, but the repo also ships `.gemini/agents/deep-research.md`. The same skill is documented as multi-runtime, so omitting Gemini makes the operational contract inaccurate for one supported runtime.

```json
{
  "claim": "sk-deep-research omits the Gemini runtime from its live runtime path contract even though a Gemini deep-research agent mirror exists in the repository.",
  "evidenceRefs": [
    ".opencode/skill/sk-deep-research/SKILL.md:16-20",
    ".gemini/agents/deep-research.md"
  ],
  "counterevidenceSought": "Checked whether the Gemini deep-research mirror was absent or intentionally not shipped.",
  "alternativeExplanation": "The runtime list was likely copied before Gemini mirror generation was added.",
  "finalSeverity": "P1",
  "confidence": 0.99,
  "downgradeTrigger": "Downgrade to P2 only if Gemini deep-research is intentionally unsupported by command dispatch and the checked mirror is non-runtime dead weight."
}
```

2. `.opencode/skill/sk-deep-review/SKILL.md:17-20` and `.opencode/skill/sk-deep-review/SKILL.md:379-386` both enumerate runtime agent paths but stop at Codex, while `.gemini/agents/deep-review.md` exists. This is a cross-runtime contract mismatch in both the overview and the reference section.

```json
{
  "claim": "sk-deep-review's runtime-path documentation is incomplete because it omits the Gemini mirror from both the top-level runtime resolution block and the explicit runtime-path reference table.",
  "evidenceRefs": [
    ".opencode/skill/sk-deep-review/SKILL.md:17-20",
    ".opencode/skill/sk-deep-review/SKILL.md:379-386",
    ".gemini/agents/deep-review.md"
  ],
  "counterevidenceSought": "Checked whether the Gemini deep-review mirror was missing or whether the references section intentionally documented a smaller supported set.",
  "alternativeExplanation": "The skill doc appears to have been updated for Codex mirror support but not for Gemini parity.",
  "finalSeverity": "P1",
  "confidence": 0.99,
  "downgradeTrigger": "Downgrade to P2 only if Gemini deep-review is intentionally excluded from the supported runtime matrix despite the mirror file being present."
}
```

### P2 Findings
- `.opencode/skill/sk-deep-research/SKILL.md:354-359` and `.opencode/skill/sk-deep-review/SKILL.md:446-451` still anchor framework/gate behavior to `CLAUDE.md` even though both skills present themselves as multi-runtime contracts earlier in the same file. That wording is stale for Copilot/Codex/Gemini loads and should be made runtime-neutral or point to the active runtime doc.
- `.opencode/skill/sk-improve-agent/SKILL.md:456-457` names only `.opencode/agent/improve-agent.md` as the mutator surface, but matching runtime mirrors also exist in `.claude/agents/improve-agent.md`, `.codex/agents/improve-agent.toml`, and `.gemini/agents/improve-agent.md`. The current wording is accurate for the OpenCode canonical file but incomplete for cross-runtime operators.

## Traceability Checks
- **Cross-runtime consistency:** Compared the documented agent/runtime paths against `.opencode`, `.claude`, `.codex`, and `.gemini` agent mirrors. The deep-loop skills missed Gemini; other checked mirrors resolved.
- **Skill↔code alignment:** Verified that `sk-deep-research` references to `assets/runtime_capabilities.json` and `scripts/runtime-capabilities.cjs` resolve, `system-spec-kit` references to `manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` and `feature_catalog/19--feature-flag-reference/` resolve, and `sk-improve-prompt`'s `cli_prompt_quality_card.md` exists in all four runtime mirror trees.
- **Command↔implementation alignment:** No broken asset/reference paths were found in the checked `sk-git`, `sk-improve-prompt`, or `system-spec-kit` operational references.

## Confirmed-Clean Surfaces
- `.opencode/skill/sk-code-opencode/SKILL.md`
- `.opencode/skill/sk-code-review/SKILL.md`
- `.opencode/skill/sk-code-web/SKILL.md`
- `.opencode/skill/sk-doc/SKILL.md`
- `.opencode/skill/sk-git/SKILL.md`
- `.opencode/skill/sk-improve-prompt/SKILL.md`
- `.opencode/skill/system-spec-kit/SKILL.md`

## Next Focus
- Check the remaining operational-doc surfaces for runtime-parity drift, especially references/assets that may still hard-code single-runtime paths after Gemini/Codex mirror rollout.
