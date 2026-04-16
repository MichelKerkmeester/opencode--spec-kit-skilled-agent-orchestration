# Iteration 55 - correctness - agents-codex+gemini

## Dispatcher
- iteration: 55 of 70
- dispatcher: cli-copilot gpt-5.4 high (operational doc review)
- timestamp: 2026-04-16T06:56:10Z

## Files Reviewed
- .gemini/agents/context.md
- .gemini/agents/debug.md
- .gemini/agents/deep-research.md
- .gemini/agents/deep-review.md
- .gemini/agents/improve-agent.md
- .gemini/agents/improve-prompt.md
- .gemini/agents/orchestrate.md
- .gemini/agents/review.md
- .gemini/agents/ultra-think.md
- .gemini/agents/write.md
- .codex/agents/context.toml
- .codex/agents/debug.toml
- .codex/agents/deep-research.toml
- .codex/agents/deep-review.toml
- .codex/agents/improve-agent.toml
- .codex/agents/improve-prompt.toml
- .codex/agents/orchestrate.toml
- .codex/agents/review.toml
- .codex/agents/write.toml
- .opencode/agent/context.md
- .opencode/agent/orchestrate.md
- .opencode/agent/write.md
- .claude/agents/context.md
- .claude/agents/orchestrate.md
- .claude/agents/write.md

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **The Gemini runtime mirrors declare `.gemini/agents/*.md` as canonical, but the live load instructions inside `context`, `orchestrate`, and `write` still send readers back to `.opencode/agent/*.md`.** That leaves the runtime-facing contract self-contradictory: the same Gemini docs say to treat Gemini-local paths as canonical, then instruct the orchestrator and related agents to read the OpenCode source path instead. In this repo the OpenCode files still exist, so this does not hard-fail immediately, but it breaks the stated runtime contract and makes cross-runtime loading behavior ambiguous. Evidence: `.gemini/agents/orchestrate.md:30`, `.gemini/agents/orchestrate.md:166-171`, `.gemini/agents/orchestrate.md:191`, `.gemini/agents/orchestrate.md:213`, `.gemini/agents/orchestrate.md:741`, `.gemini/agents/context.md:31`, `.gemini/agents/context.md:382`, `.gemini/agents/context.md:388`, `.gemini/agents/write.md:26`, `.gemini/agents/write.md:234`.

```json
{"claim":"Gemini agent mirrors say `.gemini/agents/*.md` is the canonical runtime path, but the same operational docs still instruct the runtime to load `.opencode/agent/*.md` for orchestrator/context/writer relationships and agent-definition reads.","evidenceRefs":[".gemini/agents/orchestrate.md:30",".gemini/agents/orchestrate.md:166-171",".gemini/agents/orchestrate.md:191",".gemini/agents/orchestrate.md:213",".gemini/agents/orchestrate.md:741",".gemini/agents/context.md:31",".gemini/agents/context.md:382",".gemini/agents/context.md:388",".gemini/agents/write.md:26",".gemini/agents/write.md:234"],"counterevidenceSought":"Checked the sibling runtime files and found the Gemini mirrors otherwise match the OpenCode/Claude bodies except for runtime-path edits, so this is not caused by missing mirror files; it is a localized instruction drift inside Gemini's own runtime-facing docs.","alternativeExplanation":"The mirror generator may intentionally preserve `.opencode/agent` as the authoring source while only patching the banner line for Gemini, but that still conflicts with the explicit 'canonical runtime path reference' contract exposed to runtime consumers.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Downgrade if the intended contract is formally changed back to 'Gemini reads `.opencode/agent/*.md` as source-of-truth' and the Gemini path-convention banner plus routing tables are updated consistently to say so."}
```

2. **The Codex mirror set no longer exposes a single canonical agent-definition path: some TOML mirrors still say `.opencode/agent/*.md`, while others say `.codex/agents/*.toml`.** That cross-runtime split means a Codex consumer cannot rely on one stable loader contract across the shipped agent set. `context`, `debug`, `deep-research`, `orchestrate`, and `write` still point at `.opencode/agent/*.md`, while `review`, `deep-review`, `improve-agent`, and `improve-prompt` have already moved to `.codex/agents/*.toml`. Evidence: `.codex/agents/context.toml:15`, `.codex/agents/debug.toml:13`, `.codex/agents/deep-research.toml:19`, `.codex/agents/orchestrate.toml:22`, `.codex/agents/orchestrate.toml:158-163`, `.codex/agents/orchestrate.toml:183`, `.codex/agents/orchestrate.toml:205`, `.codex/agents/write.toml:13`, `.codex/agents/write.toml:221`, `.codex/agents/review.toml:13`, `.codex/agents/deep-review.toml:20`, `.codex/agents/improve-agent.toml:17`, `.codex/agents/improve-prompt.toml:17`.

```json
{"claim":"The Codex runtime mirrors are internally inconsistent about their canonical definition path: multiple TOML files still point to `.opencode/agent/*.md`, while others have moved to `.codex/agents/*.toml`, so the runtime-facing agent contract is not uniform.","evidenceRefs":[".codex/agents/context.toml:15",".codex/agents/debug.toml:13",".codex/agents/deep-research.toml:19",".codex/agents/orchestrate.toml:22",".codex/agents/orchestrate.toml:158-163",".codex/agents/orchestrate.toml:183",".codex/agents/orchestrate.toml:205",".codex/agents/write.toml:13",".codex/agents/write.toml:221",".codex/agents/review.toml:13",".codex/agents/deep-review.toml:20",".codex/agents/improve-agent.toml:17",".codex/agents/improve-prompt.toml:17"],"counterevidenceSought":"Compared the mirrored Codex files directly and verified that both path styles are present at the same time in the live `.codex/agents/` set; there is no single repo-wide Codex convention documented inside the files themselves.","alternativeExplanation":"This may be an in-progress mirror migration where only part of the Codex set was retargeted to runtime-local TOML paths, but until the migration completes the operational contract remains inconsistent for runtime consumers.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"Downgrade if the Codex runtime intentionally standardizes on `.opencode/agent/*.md` as the sole source path or the remaining TOML mirrors are updated so every Codex agent advertises the same canonical path convention."}
```

### P2 Findings
- None.

## Traceability Checks
- **Cross-runtime consistency:** Failed. Gemini `context` / `orchestrate` / `write` partially localized their banner text to `.gemini/agents/*.md` but still embed `.opencode/agent/...` loader references; Codex is split between legacy `.opencode/agent/*.md` and localized `.codex/agents/*.toml`. The corresponding OpenCode and Claude mirrors stay internally consistent on their own runtime-local path conventions.
- **Skill↔code alignment:** The non-path references used by `@write` resolve cleanly: `.opencode/skill/sk-doc/SKILL.md`, `.opencode/skill/sk-doc/assets/agents/agent_template.md`, `.opencode/skill/sk-doc/scripts/{validate_document.py,extract_structure.py,init_skill.py,package_skill.py,quick_validate.py}`, and `.opencode/skill/system-spec-kit/templates/**` are all present. The break in this slice is the runtime path contract, not missing skill assets.
- **Command↔implementation alignment:** The command surfaces named in `@write` also resolve (`.opencode/command/create/agent.md`, `.opencode/command/create/folder_readme.md`, `.opencode/command/create/sk-skill.md`, `.opencode/command/create/feature-catalog.md`, `.opencode/command/create/testing-playbook.md`). Operational completeness is good; canonical-path guidance is the inconsistent part.

## Confirmed-Clean Surfaces
- `.gemini/agents/debug.md`, `.gemini/agents/deep-research.md`, `.gemini/agents/deep-review.md`, `.gemini/agents/improve-agent.md`, `.gemini/agents/improve-prompt.md`, `.gemini/agents/review.md`, and `.gemini/agents/ultra-think.md`: runtime-local path banners and body guidance are internally consistent in this slice, with no additional stale file references found.
- `.gemini/agents/write.md` resolves all referenced sk-doc/system-spec-kit assets and create-command entrypoints; its defect is limited to the agent-path routing row, not missing supporting resources.

## Next Focus
- Inspect the Claude/OpenCode agent docs and any agent-generation/mirroring workflows that produce these runtime copies, especially where path banners are rewritten but embedded loader references may still preserve legacy `.opencode/agent/...` paths.
