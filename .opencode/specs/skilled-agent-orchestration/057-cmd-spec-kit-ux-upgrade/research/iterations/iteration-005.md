# Focus

Axis 6: personas and UX tone. Compare SPAR's persona-backed prompt posture, `spar-specify` teammate tone, and `spar-plan` follow-up budgeting against our system-spec-kit command and agent prompt patterns.

# Actions Taken

1. Read SPAR persona source material in `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/Research/Personas/Personas.md`.
2. Read SPAR runtime skill prompts for `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-specify/SKILL.md` and `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/install-root/skills/spar-plan/SKILL.md`.
3. Read SPAR retrospective recommendations in `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/Research/research/personasRetrospective/spar.specify.recommendations.md` and `spar.plan.recommendations.md`.
4. Compared those against internal prompt surfaces in `AGENTS.md`, `.codex/AGENTS.md`, `.opencode/command/spec_kit/plan.md`, `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`, `.opencode/agent/orchestrate.md`, `.opencode/agent/improve-prompt.md`, and `.opencode/agent/ultra-think.md`.

# Findings

1. **Evidence correction: SPAR's persona file now contains six personas, not five.** The focus prompt names Vera/Pete/Tess/Maya/Max, but `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/Research/Personas/Personas.md` also includes Consultant Cass. Treat this as a useful signal, not a blocker: SPAR's persona layer is an audience map that can grow without changing every skill prompt. Internal comparison: our `.codex/AGENTS.md` and `AGENTS.md` define voice and gates globally, but do not name audience personas. Verdict: **adapt** a compact audience map, not literal persona roleplay. Risk: low if used as design guidance; medium if injected into runtime prompts. Follow-on: `058-audience-map-for-intake-and-command-ux`.

2. **Terminal Tess, Maintainer Max, and Manager Maya map cleanly to existing system-spec-kit values.** Tess wants explicit, reproducible terminal behavior; Max wants durable repo guidance; Maya wants reviewable team artifacts. Those align directly with `AGENTS.md` gate language, `.opencode/command/spec_kit/plan.md` single consolidated prompt, `.opencode/skill/system-spec-kit/SKILL.md` spec-folder discipline, and `.opencode/agent/orchestrate.md` accountability/delegation rules. Verdict: **adopt as-is conceptually** for prioritizing UX trade-offs. Risk: low. Follow-on: `058-audience-map-for-intake-and-command-ux`.

3. **Vibe Vera and Promptwright Pete are useful stress tests, but they clash with the current operator-heavy surface if taken literally.** SPAR's Vera/Pete framing emphasizes low-friction momentum and lightweight structure; our internal stack emphasizes hard gates, documentation levels, memory routing, and explicit verification. The right adaptation is not to soften gates, but to rewrite intake copy so the gate asks are understandable and bounded. Internal anchors: `AGENTS.md` Gate 3 and consolidated question protocol, `.opencode/command/spec_kit/plan.md` first-message protocol, `.codex/AGENTS.md` "lead with the answer" voice rules. Verdict: **take inspiration**. Risk: medium, because convenience language can accidentally hide hard constraints. Follow-on: `059-gate-copy-and-intake-question-budget`.

4. **SPAR's `spar-specify` teammate tone is stronger than our intake tone, but should become a context-aware opening rule rather than a persona voice.** SPAR says the agent is a product-manager partner and should ask one strong question or offer concrete options; its retrospective explicitly recommends inferring the likely feature from recent chat when signal is strong. Our `/spec_kit:plan` setup flow instead front-loads Q0-Q8 as a consolidated machine-readable prompt. The adoption path is a narrow preface: acknowledge inferred intent, then present the required consolidated prompt. Verdict: **adapt**. Risk: medium if inference silently picks the wrong feature. Follow-on: `059-gate-copy-and-intake-question-budget`.

5. **SPAR's Key vs Optional follow-up split is the clearest immediate improvement.** `spar.plan.recommendations.md` separates blockers from optional exploration and caps questions at seven. Internally, `AGENTS.md` already requires consolidated questions, and `spec_kit_complete_auto.yaml` caps clarification at three high-impact items. The better internal form is stricter than SPAR: use `Required To Proceed` and `Optional Refinements`, with optional items omitted when the prompt is already long. Verdict: **adapt**. Risk: low. Follow-on: `059-gate-copy-and-intake-question-budget`.

6. **Reject named runtime personas inside system-spec-kit commands.** Internal voice is intentionally senior-engineer, direct, and evidence-first (`.codex/AGENTS.md`), while agent files such as `.opencode/agent/improve-prompt.md` and `.opencode/agent/orchestrate.md` are role and contract driven. Naming Vera/Pete/Tess/Maya/Max inside command execution prompts would add a second identity layer that competes with hard gates. Use personas in design docs and evaluation scenarios instead. Verdict: **reject-with-rationale** for runtime prompt injection. Risk avoided: inconsistent tone and hidden prioritization conflicts. Follow-on: `060-persona-evaluation-scenarios`.

7. **Our existing "personas" are analytical lenses, not user personas.** `.opencode/agent/ultra-think.md` uses Analytical, Creative, Critical, Pragmatic, and Holistic lenses for diversity, while SPAR's personas are audience archetypes. These should remain separate: use SPAR-style personas for UX evaluation, not reasoning diversity. Verdict: **adapt boundary language**. Risk: low. Follow-on: `060-persona-evaluation-scenarios`.

# Questions Answered

- Q4: Tess, Max, and Maya translate cleanly into system-spec-kit priorities; Pete partially translates through prompt-iteration workflows; Vera is valuable as a friction test but clashes with hard-gate density if treated as the primary runtime audience. The source currently includes Cass as a sixth persona, which should be included in future evaluation fixtures.
- Q7: SPAR's Key vs Optional follow-up split should influence our consolidated-question protocol. The internal version should be stricter and more operator-friendly: required blockers first, optional refinements only when budget allows, and no broad brainstorm once the plan is sufficiently specified.
- Q8: Evidence is thick for SPAR's desired tone because the external tree includes both skill prompts and retrospective recommendations. Evidence is thinner on internal persona guidance because our system mostly encodes global voice, gates, and agent roles rather than explicit user archetypes.

# Questions Remaining

- How much of the intake prompt can be softened without weakening Gate 3's machine-readable reply format?
- Should the internal audience map live in `system-spec-kit` references, a command UX packet, or an evaluation fixture only?
- Does `:confirm` mode need a different optional-question budget than `:auto`, or should the rule be global?

# Next Focus

Axis synthesis pass: start ranking cross-axis adoption candidates into 10-20 final findings, with special attention to which patterns belong in packets `058-*` through `06X-*` and which patterns are explicit rejects.
