# Iteration 4: Skill Loading and Advisor Routing

## Focus

This iteration focused on Q1: how agents pick up skills, whether agent frontmatter has an auto-load field, what the Skill Advisor hook produces, and what a future `@code` agent would need to declare to use `sk-code`.

## Actions Taken

- Read iterations 1-3 first to avoid repeating the caller restriction, write safety, and LEAF enforcement inventories.
- Read `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` end-to-end.
- Searched `.opencode/agent/*.md` frontmatter for `skills:`, `skill:`, `auto_skills:`, `loaded_skills:`, `requires:`, `uses:`, `dependencies:`, and `routes:`.
- Inspected `@orchestrate` for skill-routing prose and delegation task format.
- Inspected `@improve-agent`, `@improve-prompt`, and `@review` for body-level skill binding patterns.
- Read the relevant `sk-code` smart-router sections for stack detection, resource loading, and related skill boundaries.
- Searched agent, command, plugin, and `system-spec-kit` runtime surfaces for `auto_load_skills`, `preload_skills`, agent-skill binding, and advisor hook injection patterns.

## Findings

1. The Skill Advisor hook is a prompt-time recommendation surface, not a skill loader. The reference says the hook injects a compact advisor brief before the model responds, and explicitly says it "does not replace skill loading." The default flow is prompt received, adapter parses prompt payload, calls `buildSkillAdvisorBrief(prompt, { runtime, workspaceRoot })`, uses native or fallback routing, then renders a short `Advisor: ...` brief or fail-open empty result. Evidence: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:25`, `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:29`, `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:31`, `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:34`.

2. The advisor brief is runtime/global prompt context, not agent-scoped metadata. Claude, Gemini, and Codex use `hookSpecificOutput.additionalContext`; Copilot writes a managed custom-instructions block for next-prompt freshness; OpenCode mutates `output.system` through `experimental.chat.system.transform`. Evidence: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:52`, `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:54`, `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:55`, `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:57`, `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:59`, `.opencode/plugins/spec-kit-skill-advisor.js:567`, `.opencode/plugins/spec-kit-skill-advisor.js:579`, `.opencode/plugins/spec-kit-skill-advisor.js:638`, `.opencode/plugins/spec-kit-skill-advisor.js:673`.

3. The rendered model-visible format is intentionally small: either `Advisor: <freshness>; use <skill> <confidence>/<uncertainty> pass.` or, for close scores, `Advisor: <freshness>; ambiguous: <skillA> ... vs <skillB> ... pass.` It filters recommendations by threshold and returns null when no recommendation passes. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:115`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:124`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:135`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:150`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:156`.

4. No current `.opencode/agent/*.md` frontmatter contains any of the searched skill auto-load fields. The agent frontmatter inventory contains `name`, `description`, `mode`, `temperature`, `permission`, and sometimes `mcpServers`; there were no frontmatter matches for `skills`, `skill`, `auto_skills`, `loaded_skills`, `requires`, `uses`, `dependencies`, or `routes`. Evidence: focused frontmatter grep returned headers only for all ten agent files; full key inventory showed only the existing runtime fields in `.opencode/agent/debug.md`, `.opencode/agent/context.md`, `.opencode/agent/deep-review.md`, `.opencode/agent/improve-prompt.md`, `.opencode/agent/write.md`, `.opencode/agent/ultra-think.md`, `.opencode/agent/deep-research.md`, `.opencode/agent/review.md`, `.opencode/agent/orchestrate.md`, and `.opencode/agent/improve-agent.md`.

5. Runtime/plugin searches found advisor recommendation and integration-scan concepts, but no generic agent-skill-binding loader such as `auto_load_skills` or `preload_skills`. The searched hits for `skills:` or `agent.*skills` were body tables, documentation, skill graph data, or improve-agent integration reports, not frontmatter loader code. Evidence: `.opencode/agent/orchestrate.md:51`, `.opencode/agent/orchestrate.md:194`, `.opencode/command/improve/agent.md:195`, `.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs:202`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json:1`.

6. `@orchestrate` does not say to invoke `skill_advisor` first. Its workflow says to scan for relevant skills, commands, and agents, and its task format has a `Skills: [Specific skills the agent should use]` line. Its routing table maps task classes to agents and skills, but this is prose/table routing, not a frontmatter mechanism. Evidence: `.opencode/agent/orchestrate.md:49`, `.opencode/agent/orchestrate.md:51`, `.opencode/agent/orchestrate.md:93`, `.opencode/agent/orchestrate.md:98`, `.opencode/agent/orchestrate.md:100`, `.opencode/agent/orchestrate.md:194`.

7. The strongest current "agent needs skill X" pattern is body-level instruction. `@improve-agent` lists `sk-improve-agent` in a Skills table with `Use When: Always`, then lists it again under related skills. `@improve-prompt` says to read `sk-improve-prompt` source material in its core workflow, lists it in the Skills table, and has an explicit always-rule to read `.opencode/skill/sk-improve-prompt/SKILL.md` before composing output. Evidence: `.opencode/agent/improve-agent.md:48`, `.opencode/agent/improve-agent.md:52`, `.opencode/agent/improve-agent.md:205`, `.opencode/agent/improve-agent.md:209`, `.opencode/agent/improve-prompt.md:37`, `.opencode/agent/improve-prompt.md:52`, `.opencode/agent/improve-prompt.md:90`, `.opencode/agent/improve-prompt.md:182`, `.opencode/agent/improve-prompt.md:239`.

8. `@review` gives the clearest `sk-code` binding precedent for a future code/review agent: a body instruction says the agent must load the `sk-code` baseline first, then exactly one `sk-code-*` overlay based on stack/codebase signals. Again, this is body prose and workflow sequencing, not auto-loaded metadata. Evidence: `.opencode/agent/review.md:31`, `.opencode/agent/review.md:47`.

9. `sk-code` itself is an umbrella skill, not an agent frontmatter binding system. Its frontmatter description says it detects stack first, classifies intent, and loads stack-aware resources; its body states that stack detection gates all downstream resource loading. Evidence: `.opencode/skill/sk-code/SKILL.md:2`, `.opencode/skill/sk-code/SKILL.md:3`, `.opencode/skill/sk-code/SKILL.md:12`, `.opencode/skill/sk-code/SKILL.md:14`, `.opencode/skill/sk-code/SKILL.md:75`, `.opencode/skill/sk-code/SKILL.md:77`.

10. `sk-code` does not auto-load sibling skills for normal implementation work. It owns WEBFLOW, NEXTJS, and GO routing internally via marker files and resource maps under its own `references/` and `assets/` directories. Sibling skills are described as related boundaries: `sk-code-review` for formal findings-first review and `sk-code-opencode` for `.opencode/` harness/system code. Evidence: `.opencode/skill/sk-code/SKILL.md:101`, `.opencode/skill/sk-code/SKILL.md:105`, `.opencode/skill/sk-code/SKILL.md:111`, `.opencode/skill/sk-code/SKILL.md:124`, `.opencode/skill/sk-code/SKILL.md:303`, `.opencode/skill/sk-code/SKILL.md:318`, `.opencode/skill/sk-code/SKILL.md:332`, `.opencode/skill/sk-code/SKILL.md:630`, `.opencode/skill/sk-code/SKILL.md:631`.

11. AGENTS.md Gate 2 matches the observed runtime shape. The advisor brief is primary when already surfaced; `skill_advisor.py` is fallback; confidence above threshold means the agent must invoke the recommended skill by reading `.opencode/skill/<skill-name>/SKILL.md` and then bundled resources. This is an instruction chain for the active model, not automatic loading by the OpenCode agent loader. Evidence: `AGENTS.md:77`, `AGENTS.md:195`, `AGENTS.md:196`, `AGENTS.md:197`, `AGENTS.md:199`, `AGENTS.md:367`, `AGENTS.md:371`, `AGENTS.md:380`, `AGENTS.md:382`.

## Questions Answered

- Q1 is answered with high confidence for the current repo state: an agent declares it needs `sk-code` through body prose, routing tables, and task prompt fields, not through an agent frontmatter field that auto-loads the skill on entry.
- The Skill Advisor hook can recommend `sk-code` at prompt time, but it only surfaces a compact advisory brief. The active model still has to invoke the skill by reading `SKILL.md` and following its resource-loading protocol.

## Questions Remaining

- Q2 remains open: stack-agnostic detection in `sk-code` should get a dedicated pass, especially edge cases around Webflow vs Next/React vs Go vs UNKNOWN.
- A design question remains for future `@code`: whether to add a new machine-readable `skills:` or `requiredSkills:` frontmatter field plus loader support, or stay aligned with current convention and use body prose plus orchestrator task `Skills:` routing.

## Sources Consulted

- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:25`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:31`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:52`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:59`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:124`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:150`
- `.opencode/plugins/spec-kit-skill-advisor.js:567`
- `.opencode/plugins/spec-kit-skill-advisor.js:638`
- `.opencode/plugins/spec-kit-skill-advisor.js:673`
- `.opencode/agent/orchestrate.md:51`
- `.opencode/agent/orchestrate.md:93`
- `.opencode/agent/orchestrate.md:98`
- `.opencode/agent/orchestrate.md:100`
- `.opencode/agent/orchestrate.md:194`
- `.opencode/agent/improve-agent.md:52`
- `.opencode/agent/improve-agent.md:209`
- `.opencode/agent/improve-prompt.md:37`
- `.opencode/agent/improve-prompt.md:52`
- `.opencode/agent/improve-prompt.md:90`
- `.opencode/agent/review.md:31`
- `.opencode/agent/review.md:47`
- `.opencode/skill/sk-code/SKILL.md:77`
- `.opencode/skill/sk-code/SKILL.md:101`
- `.opencode/skill/sk-code/SKILL.md:270`
- `.opencode/skill/sk-code/SKILL.md:303`
- `.opencode/skill/sk-code/SKILL.md:630`
- `AGENTS.md:77`
- `AGENTS.md:195`
- `AGENTS.md:199`
- `AGENTS.md:367`
- `AGENTS.md:371`
- `AGENTS.md:380`

## Reflection

- What worked and why: Reading the hook reference before searching frontmatter kept the layers separate. The hook explains recommendation timing, while the agent files show how skill usage is actually expressed.
- What did not work and why: Broad runtime grep for `skills` was noisy because skill graphs, integration scanners, docs, and agent body tables all use that word. Exact loader-shaped terms like `auto_load_skills` and frontmatter-key searches were more decisive.
- What I would do differently: I would inspect the agent template and loader source earlier if the next task is implementation, because this iteration proves the current convention but not the best schema for a future extension.

## Recommended Next Focus

Focus Q2 next: audit `sk-code` stack detection as its own system. Start with `references/router/stack_detection.md`, then test marker precedence against representative repo roots and edge cases. For future `@code`, the conservative design is body-level binding: say "load `sk-code` first; if working under `.opencode/`, use `sk-code-opencode`; for formal review, pair with `sk-code-review`." Do not claim automatic skill loading unless a new frontmatter field and loader are added.

## Ruled Out

- Existing agent frontmatter keys named `skills`, `skill`, `auto_skills`, `loaded_skills`, `requires`, `uses`, `dependencies`, or `routes`.
- Existing searched runtime loader patterns named `auto_load_skills`, `preload_skills`, or generic agent-skill binding.
- Treating the Skill Advisor hook as skill auto-loading. It recommends and injects brief context; it does not read or load `SKILL.md` for the agent.
