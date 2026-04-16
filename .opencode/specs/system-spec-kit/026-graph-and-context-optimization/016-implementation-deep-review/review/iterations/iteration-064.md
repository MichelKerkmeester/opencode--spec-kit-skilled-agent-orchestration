# Iteration 64 - maintainability - skill-refs-all-others

## Dispatcher
- iteration: 64 of 70
- dispatcher: cli-copilot gpt-5.4 high (operational doc review)
- timestamp: 2026-04-16T07:10:17.621Z

## Files Reviewed
- `.opencode/skill/cli-claude-code/references/agent_delegation.md`
- `.opencode/skill/cli-claude-code/references/claude_tools.md`
- `.opencode/skill/cli-claude-code/references/cli_reference.md`
- `.opencode/skill/cli-claude-code/references/integration_patterns.md`
- `.opencode/skill/cli-codex/references/agent_delegation.md`
- `.opencode/skill/cli-codex/references/cli_reference.md`
- `.opencode/skill/cli-codex/references/codex_tools.md`
- `.opencode/skill/cli-codex/references/integration_patterns.md`
- `.opencode/skill/cli-copilot/references/agent_delegation.md`
- `.opencode/skill/cli-copilot/references/cli_reference.md`
- `.opencode/skill/cli-copilot/references/copilot_tools.md`
- `.opencode/skill/cli-copilot/references/integration_patterns.md`
- `.opencode/skill/cli-gemini/references/agent_delegation.md`
- `.opencode/skill/cli-gemini/references/cli_reference.md`
- `.opencode/skill/cli-gemini/references/gemini_tools.md`

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **Claude Code's agent-delegation reference still advertises removed agent IDs (`speckit`, `research`) as live runtime targets.**
   - The operational reference includes a runnable `--agent speckit` example, a `.opencode/agent/research.md` inventory entry, and an active roster row for `research` [`.opencode/skill/cli-claude-code/references/agent_delegation.md:83-85`, `.opencode/skill/cli-claude-code/references/agent_delegation.md:92-101`, `.opencode/skill/cli-claude-code/references/agent_delegation.md:111-121`].
   - The current runtime inventory exposes `deep-research` instead [`.opencode/agent/deep-research.md:1-3`], and the live `.opencode/agent/*.md` inventory contains no `speckit.md` or `research.md`.
   - Result: a conductor following the reference can compose nonexistent Claude Code invocations.

   ```json
   {
     "claim": "The Claude Code delegation reference exposes removed agent names (`speckit`, `research`) as if they were current runtime targets.",
     "evidenceRefs": [
       ".opencode/skill/cli-claude-code/references/agent_delegation.md:83-85",
       ".opencode/skill/cli-claude-code/references/agent_delegation.md:92-101",
       ".opencode/skill/cli-claude-code/references/agent_delegation.md:111-121",
       ".opencode/agent/deep-research.md:1-3",
       "Runtime inventory: .opencode/agent/*.md lists context, debug, deep-research, deep-review, improve-agent, improve-prompt, orchestrate, review, ultra-think, write"
     ],
     "counterevidenceSought": "Checked the live .opencode/agent inventory for hidden `speckit` or `research` mirrors and looked for a surviving alias note in the surrounding reference; none were present.",
     "alternativeExplanation": "The reference likely preserved pre-rename examples after the runtime standardized on `deep-research` and dropped the old `speckit` lane.",
     "finalSeverity": "P1",
     "confidence": 0.98,
     "downgradeTrigger": "Downgrade to P2 only if Claude Code still accepts undocumented `speckit` and `research` aliases at runtime."
   }
   ```

2. **The Codex delegation contract splits one runtime identity into two names (`deep-research` vs `research`).**
   - The file frames `.codex/agents/` as the active agent source, points operators to `@deep-research`, and titles the section `@deep-research` [`.opencode/skill/cli-codex/references/agent_delegation.md:21-29`, `.opencode/skill/cli-codex/references/agent_delegation.md:220-239`, `.opencode/skill/cli-codex/references/agent_delegation.md:316-317`].
   - The executable examples and config stanza instead require `codex exec -p research` / `[profiles.research]` [`.opencode/skill/cli-codex/references/agent_delegation.md:81-83`, `.opencode/skill/cli-codex/references/agent_delegation.md:104-110`, `.opencode/skill/cli-codex/references/agent_delegation.md:236-238`].
   - The live runtime mirror is named `deep-research`, not `research` [`.codex/agents/deep-research.toml:1-10`].
   - Result: the same operational doc tells conductors to map one capability through two different identifiers, which is a cross-runtime contract split.

   ```json
   {
     "claim": "The Codex delegation reference uses `deep-research` for the agent identity but `research` for the executable profile/config contract.",
     "evidenceRefs": [
       ".opencode/skill/cli-codex/references/agent_delegation.md:21-29",
       ".opencode/skill/cli-codex/references/agent_delegation.md:81-83",
       ".opencode/skill/cli-codex/references/agent_delegation.md:104-110",
       ".opencode/skill/cli-codex/references/agent_delegation.md:220-239",
       ".opencode/skill/cli-codex/references/agent_delegation.md:316-317",
       ".codex/agents/deep-research.toml:1-10"
     ],
     "counterevidenceSought": "Checked the live .codex/agents inventory and the surrounding reference for an explicit alias/translation rule between `deep-research` and `research`; none was documented.",
     "alternativeExplanation": "The authors may have intended `research` as a profile alias layered over the `deep-research` agent but never documented the alias boundary clearly.",
     "finalSeverity": "P1",
     "confidence": 0.95,
     "downgradeTrigger": "Downgrade to P2 if the doc adds an explicit, normative alias rule showing that `research` is the required exec profile name for the `deep-research` runtime agent."
   }
   ```

3. **Copilot's agent-delegation reference invents a prompt-level agent/profile surface (`@Explore`, `@Task`, `.github/copilot/profiles/`) that the current Copilot CLI does not advertise.**
   - The reference says agent roles are selected with `@` inside the `-p` prompt, provides runnable `As @Explore` / `As @Task` examples, and points custom profiles at `.github/copilot/profiles/*.md` [`.opencode/skill/cli-copilot/references/agent_delegation.md:57-90`].
   - The current Copilot CLI help instead documents `@` as file mention syntax and exposes `/agent` as the agent-management surface; it does not advertise `@Explore` / `@Task` prompt routing or repository-local `.github/copilot/profiles/` definitions [GitHub Copilot CLI documentation: Help Command Output].
   - The local repo also has no `.github/copilot/**/*` payload at all.
   - Result: conductors following this reference are told to target an agent/profile syntax that is not surfaced by the current CLI contract.

   ```json
   {
     "claim": "The Copilot agent-delegation reference documents unsupported or undocumented prompt-level agent/profile syntax (`@Explore`, `@Task`, `.github/copilot/profiles/`).",
     "evidenceRefs": [
       ".opencode/skill/cli-copilot/references/agent_delegation.md:57-90",
       "GitHub Copilot CLI documentation: Help Command Output (`@` mentions files, `/agent` manages agents, `/delegate` is a slash command)",
       "Runtime inventory: glob .github/copilot/**/* => no files"
     ],
     "counterevidenceSought": "Checked the authoritative Copilot CLI README/help output for built-in `@Explore` / `@Task` agent routing or a documented `.github/copilot/profiles/` contract and checked the repo for the referenced profile directory; none were found.",
     "alternativeExplanation": "These examples may describe an older or experimental Copilot surface that has since been replaced by slash-command and interactive agent selection.",
     "finalSeverity": "P1",
     "confidence": 0.9,
     "downgradeTrigger": "Downgrade to P2 if the current Copilot CLI still supports `As @Explore` / `As @Task` and `.github/copilot/profiles/` as undocumented compatibility aliases."
   }
   ```

4. **Two Copilot references publish non-existent flag-based automation patterns, so the examples are not executable against the current CLI.**
   - `copilot_tools.md` instructs operators to use `--autopilot`, `--delegate`, `--output-format`, and `--plan-only` [`.opencode/skill/cli-copilot/references/copilot_tools.md:163-189`].
   - `cli_reference.md` also tells users to parse `--output-format json`, models `/delegate` as a direct shell invocation, and presents `Shift+Tab` as the interactive trigger for planning/autopilot [`.opencode/skill/cli-copilot/references/cli_reference.md:176-190`, `.opencode/skill/cli-copilot/references/cli_reference.md:214-223`, `.opencode/skill/cli-copilot/references/cli_reference.md:250-271`].
   - The authoritative Copilot CLI docs expose `/delegate`, `/plan`, `/review`, and `shift+tab` as interactive/help surfaces, and list no `--autopilot`, `--delegate`, `--plan-only`, or `--output-format` flags in the current CLI help/README [GitHub Copilot CLI documentation: README + Help Command Output].
   - Result: these operator docs currently prescribe commands that do not match the live Copilot CLI command surface.

   ```json
   {
     "claim": "The Copilot tool/reference docs prescribe unsupported flag-based commands (`--autopilot`, `--delegate`, `--plan-only`, `--output-format`) instead of the current slash-command/mode contract.",
     "evidenceRefs": [
       ".opencode/skill/cli-copilot/references/copilot_tools.md:163-189",
       ".opencode/skill/cli-copilot/references/cli_reference.md:176-190",
       ".opencode/skill/cli-copilot/references/cli_reference.md:214-223",
       ".opencode/skill/cli-copilot/references/cli_reference.md:250-271",
       "GitHub Copilot CLI documentation: README + Help Command Output"
     ],
     "counterevidenceSought": "Compared the documented flags against the authoritative Copilot CLI help/README and looked for those switches in the exposed flag list; only slash commands and mode toggles were documented.",
     "alternativeExplanation": "The repository docs may have been written against a prerelease Copilot build whose flags were removed in favor of interactive slash commands and experimental modes.",
     "finalSeverity": "P1",
     "confidence": 0.94,
     "downgradeTrigger": "Downgrade to P2 if the current Copilot CLI still supports those flags as undocumented compatibility options."
   }
   ```

### P2 Findings
- **Copilot integration patterns file contains an unresolved duplicate tail/merge artifact.** The file cleanly closes one `CROSS-VALIDATION` + `ANTI-PATTERNS` pair at lines 264-309, then immediately appends a second copy plus a broken `ross-validation -->` fragment at lines 310-359 [`.opencode/skill/cli-copilot/references/integration_patterns.md:264-359`].
- **Copilot CLI reference has a stale default-model statement.** It marks `claude-sonnet-4.6` as the default model [`.opencode/skill/cli-copilot/references/cli_reference.md:132-139`], while the authoritative Copilot CLI README says the current default is Claude Sonnet 4.5.
- **All three non-Copilot agent-catalog banners still claim "9" agents even though the live runtime inventories are now at 10 definitions each.** See Claude's roster heading [`.opencode/skill/cli-claude-code/references/agent_delegation.md:111-121`], Codex's title/description [`.opencode/skill/cli-codex/references/agent_delegation.md:1-3`], and Gemini's title/description [`.opencode/skill/cli-gemini/references/agent_delegation.md:1-3`], versus the current `.opencode/agent/*.md`, `.codex/agents/*`, and `.gemini/agents/*` inventories.

## Traceability Checks
- **Cross-runtime consistency:** Failed. Claude/Codex/Gemini no longer present a stable shared agent inventory: Claude still names `research`, Codex splits `deep-research` vs `research`, and the banner counts for all three lag the live 10-agent inventories.
- **Skill↔code alignment:** Failed hardest on Copilot. The Copilot skill refs describe flags and prompt-level agent routing that the current authoritative Copilot CLI docs/help do not expose.
- **Command↔implementation alignment:** Failed for Claude and Copilot runnable examples (`--agent speckit`, `As @Explore`, `--autopilot`, `--delegate`, `--plan-only`). Passed for the reviewed Claude/Gemini/Codex capability references outside those drifted command surfaces.

## Confirmed-Clean Surfaces
- `.opencode/skill/cli-claude-code/references/claude_tools.md`, `.opencode/skill/cli-claude-code/references/cli_reference.md`, and `.opencode/skill/cli-claude-code/references/integration_patterns.md` stayed internally aligned on Claude-specific capability contracts such as `--permission-mode plan`, `--json-schema`, `--max-budget-usd`, and conductor/executor orchestration; the drift in this packet is localized to `agent_delegation.md`.
- `.opencode/skill/cli-codex/references/codex_tools.md` remained internally coherent on `/review`, `--search`, MCP, resume/fork, image input, and sandbox semantics; the detected Codex issue is the agent/profile naming seam in `agent_delegation.md`, not the capability reference itself.
- `.opencode/skill/cli-gemini/references/cli_reference.md` and `.opencode/skill/cli-gemini/references/gemini_tools.md` remained internally consistent on `-o` output modes, `-m gemini-3.1-pro-preview`, `--allowed-tools`, `google_web_search`, `codebase_investigator`, and Gemini's tool naming. The only Gemini drift found this pass is the stale 9-agent banner in `agent_delegation.md`.

## Next Focus
- Check the remaining runtime-facing wrappers and root operational docs for the same renamed-agent drift and Copilot slash-command-vs-flag mismatch, especially anywhere that still turns interactive Copilot features into shell flags.
