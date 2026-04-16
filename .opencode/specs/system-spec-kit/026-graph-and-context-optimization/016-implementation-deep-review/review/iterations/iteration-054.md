# Iteration 54 - correctness - agents-claude+opencode

## Dispatcher
- iteration: 54 of 70
- dispatcher: cli-copilot gpt-5.4 high (operational doc review)
- timestamp: 2026-04-16T06:52:00.655Z

## Files Reviewed
- .claude/agents/context.md
- .claude/agents/debug.md
- .claude/agents/deep-research.md
- .claude/agents/deep-review.md
- .claude/agents/improve-agent.md
- .claude/agents/improve-prompt.md
- .claude/agents/orchestrate.md
- .claude/agents/review.md
- .claude/agents/ultra-think.md
- .claude/agents/write.md
- .opencode/agent/context.md
- .opencode/agent/debug.md
- .opencode/agent/deep-research.md
- .opencode/agent/deep-review.md
- .opencode/agent/improve-agent.md

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **The Claude agent mirrors still hardcode OpenCode agent-definition paths in runtime instructions, even while the same files declare `.claude/agents/*.md` as the canonical path convention.** In `.claude/agents/context.md`, the related-resources table points the Claude runtime at `.opencode/agent/orchestrate.md` and `.opencode/agent/deep-research.md` instead of the local Claude mirrors (`:382`, `:388`). `.claude/agents/orchestrate.md` repeats the same contract break in its primary agent-file table (`:166-171`) and in its anti-pattern guidance that tells dispatchers every custom agent definition lives in `.opencode/agent/` (`:741`). That is a real cross-runtime contract mismatch because the OpenCode mirrors are separately shipped and the Claude docs simultaneously advertise `.claude/agents/*.md` as the canonical runtime reference. Evidence: `.claude/agents/context.md:31`, `.claude/agents/context.md:382`, `.claude/agents/context.md:388`, `.claude/agents/orchestrate.md:30`, `.claude/agents/orchestrate.md:166-171`, `.claude/agents/orchestrate.md:741`.

```json
{"claim":"Claude runtime agent docs self-contradict their own path convention by telling dispatchers to load `.opencode/agent/...` definitions instead of the local `.claude/agents/...` mirrors.","evidenceRefs":[".claude/agents/context.md:31",".claude/agents/context.md:382",".claude/agents/context.md:388",".claude/agents/orchestrate.md:30",".claude/agents/orchestrate.md:166-171",".claude/agents/orchestrate.md:741"],"counterevidenceSought":"Looked for nearby text declaring `.opencode/agent/` to be the shared canonical source for Claude dispatches, but these files instead explicitly say `.claude/agents/*.md` is the canonical runtime reference.","alternativeExplanation":"The `.opencode/agent/` paths may have been left behind from a packaging-source convention, but the Claude mirrors are runtime-loaded docs and their own path-convention text says the opposite.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"Downgrade to P2 if Claude dispatch intentionally resolves `.opencode/agent/...` as the only supported source and the `.claude/agents/*.md` path-convention text is confirmed to be non-operative legacy wording."}
```

2. **Several Claude agent mirrors tell the runtime to load OpenCode skill docs even though the corresponding Claude skill mirrors are present locally, so the runtime-local contract is stale.** `.claude/agents/deep-review.md` instructs reviewers to load `.opencode/skill/sk-code-review/references/review_core.md` for severity doctrine (`:122`, `:267`) and `.opencode/skill/sk-deep-review/references/loop_protocol.md` for lifecycle rules (`:148`, `:311`). `.claude/agents/deep-research.md` does the same for `sk-deep-research` (`:79`), `.claude/agents/improve-prompt.md` does it for `sk-improve-prompt` (`:90`), and `.claude/agents/write.md` points to `.opencode/skill/sk-doc/SKILL.md` and `.opencode/skill/system-spec-kit/SKILL.md` (`:364-365`). The repo also ships those same resources under `.claude/skills/...`, so the Claude mirrors are no longer self-consistent about where runtime-loaded skill contracts live. Evidence: `.claude/agents/deep-review.md:122`, `.claude/agents/deep-review.md:148`, `.claude/agents/deep-review.md:267`, `.claude/agents/deep-review.md:311`, `.claude/agents/deep-research.md:79`, `.claude/agents/improve-prompt.md:90`, `.claude/agents/write.md:364-365`, `.claude/skills/sk-code-review/references/review_core.md:1-3`, `.claude/skills/sk-deep-review/references/loop_protocol.md:1-3`, `.claude/skills/sk-improve-prompt/SKILL.md:1-3`, `.claude/skills/sk-doc/SKILL.md:1-3`, `.claude/skills/system-spec-kit/SKILL.md:1-3`.

```json
{"claim":"Claude agent mirrors still direct readers to `.opencode/skill/...` doctrine/skill files even though matching `.claude/skills/...` runtime mirrors exist locally, creating a stale cross-runtime path contract.","evidenceRefs":[".claude/agents/deep-review.md:122",".claude/agents/deep-review.md:148",".claude/agents/deep-review.md:267",".claude/agents/deep-review.md:311",".claude/agents/deep-research.md:79",".claude/agents/improve-prompt.md:90",".claude/agents/write.md:364-365",".claude/skills/sk-code-review/references/review_core.md:1-3",".claude/skills/sk-deep-review/references/loop_protocol.md:1-3",".claude/skills/sk-improve-prompt/SKILL.md:1-3",".claude/skills/sk-doc/SKILL.md:1-3",".claude/skills/system-spec-kit/SKILL.md:1-3"],"counterevidenceSought":"Checked whether the Claude runtime lacked local skill mirrors, but the cited doctrine and skill files are present under `.claude/skills/...`, so the OpenCode-only paths are not required for this runtime.","alternativeExplanation":"These OpenCode skill paths may be surviving source-of-truth references from the packaging pipeline, but that explanation still leaves the shipped Claude mirrors pointing at the wrong runtime-local surface.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"Downgrade to P2 if Claude intentionally treats `.opencode/skill/...` as the only supported canonical lookup root and the `.claude/skills/...` copies are explicitly documented as non-runtime packaging artifacts."}
```

### P2 Findings
- None.

## Traceability Checks
- **Cross-runtime consistency:** `.opencode/agent/debug.md` and `.opencode/agent/improve-agent.md` match their Claude mirrors after the expected runtime-prefix substitution, but the Claude `context` and `orchestrate` docs still embed `.opencode/agent/...` paths inside runtime guidance. That means the drift is selective, not systemic.
- **Skill↔code alignment:** The referenced OpenCode command/skill surfaces resolve (`.opencode/command/improve/agent.md`, `.opencode/command/improve/prompt.md`, `.opencode/command/spec_kit/complete.md`, `.opencode/command/spec_kit/resume.md`, `.opencode/skill/sk-improve-prompt/SKILL.md`, `.opencode/skill/sk-improve-agent/SKILL.md` all exist), and the matching Claude skill mirrors also exist. The defect is therefore the Claude-path contract, not a missing file on disk.
- **Command↔implementation alignment:** The OpenCode agent docs reviewed in this slice remain internally aligned with the current `.opencode/skill/...` and `.opencode/command/...` layout. The correctness issue is isolated to the Claude mirrors continuing to describe OpenCode lookup roots as if they were Claude-runtime instructions.

## Confirmed-Clean Surfaces
- `.claude/agents/debug.md` and `.opencode/agent/debug.md`: normalized content matches aside from the runtime path prefix, and the command references in this slice stay consistent.
- `.claude/agents/improve-agent.md` and `.opencode/agent/improve-agent.md`: proposal-only boundaries, required-input contract, and `/improve:agent` linkage are consistent across both runtimes.
- `.opencode/agent/context.md`, `.opencode/agent/deep-research.md`, `.opencode/agent/deep-review.md`, and `.opencode/agent/improve-agent.md`: reviewed OpenCode-side paths resolve against the live `.opencode/skill/...` and `.opencode/command/...` layout.

## Next Focus
- Inspect the remaining Claude/Codex/Gemini agent and command mirrors for the same packaging-source leakage pattern: `.opencode/agent/...` or `.opencode/skill/...` paths embedded in runtime-local docs that claim a different canonical lookup root.
