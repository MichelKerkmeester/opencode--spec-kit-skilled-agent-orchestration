## Iteration 04

### Focus

This pass mapped which runtimes actually stay inside the shared builder-and-renderer contract. The aim was to confirm whether packet-02 is dealing with isolated drift or a broader pattern where some runtimes still maintain bespoke prompt-time logic.

### Context Consumed

- `../deep-research-strategy.md`
- `iteration-03.md`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`

### Findings

- Claude, Gemini, and Copilot all follow the shared runtime contract by calling `buildSkillAdvisorBrief()` and then `renderAdvisorBrief()`, which means their prompt-visible advisor behavior is centralized in the shared package [.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:156-181] [.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:170-195] [.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:186-207].
- Copilot is still transport-different even when it uses the shared builder: it writes a managed custom-instructions file and returns `{}`, so its user-visible advisor surface depends on file refresh semantics rather than direct hook output parity [.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:3-7] [.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:120-132] [.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:56-57].
- Codex remains the only runtime hook adapter that attempts a native fast path before the shared builder, so the actual shared contract is "Claude/Gemini/Copilot always shared, Codex conditional, OpenCode bridge-specific" rather than the uniformly shared flow described in the high-level reference [.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:227-241] [.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:30-41].

### Evidence

> const result = await buildBrief(prompt, {
>   runtime: 'claude',
>   workspaceRoot: workspaceRootFor(input),
> });
> const brief = renderBrief(result); [.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:156-162]

> const result = await buildBrief(prompt, {
>   runtime: 'gemini',
>   workspaceRoot: workspaceRootFor(input),
> });
> const brief = renderBrief(result); [.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:170-176]

> const result = await buildBrief(prompt, {
>   runtime: 'copilot',
>   workspaceRoot: workspaceRootFor(input),
> });
> const brief = renderBrief(result);
> return {
>   brief,
>   writeResult: await refreshCopilotInstructions(brief, dependencies), [.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:186-207]

### Negative Knowledge

- I did not find another runtime besides Codex and OpenCode preserving a separate prompt-time build/render path.
- The shared contract is real for three runtimes, so packet-02 should treat the remaining parity issues as specific branch exceptions rather than universal drift.

### New Questions

#### Runtime Parity

- What exactly do Codex and OpenCode lose by skipping or partially bypassing the shared builder/renderer?
- Is there any operator-visible metadata today that says which path produced the final brief?

#### MCP Surface

- Can the public tool surfaces audit those branch decisions without code inspection?
- Are workspace selection and threshold settings consistent across the tools these runtimes depend on?

#### Telemetry

- Do the current diagnostic records distinguish shared vs bespoke execution paths?

### Status

new-territory
