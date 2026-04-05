# Iteration 78: Q15 Verification Against Current Runtime Files

## Focus
Verify the current state of Q15 findings from iterations 058, 062, and 065 by reading live runtime files. Specifically: confirm the four-tier fallback model, check whether MCP first-call priming is implemented, verify OpenCode's hook/instruction surface, recount `.opencode/agent/`, and detect any drift in `CODEX.md`, resume workflow assets, or Claude recovery docs.

## Findings

### 1. The four-tier fallback model still fits the current codebase, but Tier 2 remains memory-focused rather than code-graph-primed
The current repository still supports the same broad fallback layering:

- **T1 hooks (Claude only)** is confirmed. `.claude/CLAUDE.md` explicitly documents `PreCompact`, `SessionStart`, and `Stop`, and the Claude hook docs in `mcp_server/hooks/` describe those exact lifecycle events and scripts.  
- **T2 instruction-file triggers** is confirmed in a narrower form than some prior writeups implied. `CODEX.md` still instructs the agent to call `memory_context(... mode: "resume" ...)` after compaction and lists code graph tools in routing/tool sections, but it does **not** contain a "Session Start Protocol" or any automatic `code_graph_status()` / `code_graph_scan()` step.  
- **T3 command-based recovery** is confirmed. `spec_kit_resume_auto.yaml` still implements the resume workflow via session detection, context loading, progress calculation, and presentation.  
- **T4 Gate 1 automatic** is confirmed. The root `CLAUDE.md` still requires `memory_match_triggers(prompt)` on each new user message.

This means the four-tier model remains a valid conceptual description of current runtime behavior, but Tier 2 should be described as **instruction-based memory recovery + query routing**, not as implemented session-start graph priming.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.claude/CLAUDE.md:20-32]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:35-43]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:7-22]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/CODEX.md:5-31]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:113-155]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/CLAUDE.md:99-104]

### 2. MCP "first-call priming" is still a design idea, not an implemented universal mechanism
`resolveTrustedSession()` still provides the session primitive identified in iteration 062: if no `sessionId` is supplied, the server returns a new `effectiveSessionId` and marks it `trusted: false`. That part of the prior finding is real.

However, a repo-wide search of the MCP server found **no implemented first-call priming layer**, no `sessionPriming` response field, and no first-call tracker/interceptor. The live code therefore supports the **feasibility** claim ("`resolveTrustedSession()` could underpin universal priming") but does **not** support the stronger claim that T1.5 currently exists in the product.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:385-435]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:731]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:212]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/ search for `sessionPriming|first-call|first call|priming` returned only Claude hook/session references and no generic first-call priming implementation]

### 3. OpenCode still has no native lifecycle hook system; it uses global MCP config, commands, and agent instructions
Current `opencode.json` still registers MCP servers only (`sequential_thinking`, `spec_kit_memory`, `cocoindex_code`, `code_mode`) and shows no hook/lifecycle registration surface. The OpenCode runtime continues to rely on:

- agent markdown definitions in `.opencode/agent/`
- command/workflow files such as `spec_kit_resume_auto.yaml`
- the universal framework in the root `CLAUDE.md`

That confirms the core claim from iteration 065: OpenCode has **no native hook system** comparable to Claude Code's lifecycle hooks.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/opencode.json:10-57]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/context.md:1-23]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:1-18]

### 4. OpenCode still has 10 agents with YAML frontmatter, but the "10 agents with MCP bindings" claim is now overstated
The `.opencode/agent/` directory still contains exactly 10 markdown agent files:

`context`, `debug`, `deep-research`, `deep-review`, `handover`, `orchestrate`, `review`, `speckit`, `ultra-think`, `write`.

All 10 use YAML frontmatter. But the current frontmatter evidence does **not** support "10 agents with MCP bindings" as a literal statement:

- `context.md` declares `mcpServers: [spec_kit_memory, cocoindex_code]`
- `ultra-think.md` declares `mcpServers: [spec_kit_memory, sequential_thinking]`
- sampled peers such as `debug.md`, `orchestrate.md`, `write.md`, and others do **not** declare `mcpServers:` in frontmatter

Some agent bodies still reference CocoIndex/code graph tools in their instructions, so tool awareness exists in content. But explicit frontmatter MCP bindings are currently visible only on a subset of agents, not all 10.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/ -- directory listing showing 10 files]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/context.md:1-23]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/ultra-think.md:1-23]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/debug.md:1-20]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/orchestrate.md:1-16]

### 5. The resume flow exists, but the previously proposed code-graph freshness step has not been added
`spec_kit_resume_auto.yaml` still defines a four-step workflow:

1. session detection  
2. load memory  
3. calculate progress  
4. present resume

There is still no inserted "Step 1.5" / "Step 1b" to check `code_graph_status()` or trigger `code_graph_scan()` / `ccc_reindex()`. So the prior OpenCode enhancement idea remains unimplemented.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:113-155]

### 6. "~90% parity with Claude Code hooks achievable" remains a design estimate, not a verified present-state fact
The current codebase verifies the ingredients behind the estimate:

- Claude has true lifecycle hooks.
- Non-Claude runtimes have instruction files, Gate 1 trigger loading, and manual resume workflows.
- OpenCode/Codex still expose code graph and CocoIndex tools.

But the repository does **not** yet implement the strongest parity-improving pieces discussed in earlier research:

- no universal MCP T1.5 first-call priming
- no session-start code graph trigger in `CODEX.md`
- no code-graph freshness step in `spec_kit_resume_auto.yaml`

Therefore the "~90% parity" number should be treated as an **architectural projection** from the proposed design, not as something verified by current code.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/CODEX.md:5-31]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:113-155]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.claude/CLAUDE.md:20-32]

## Ruled Out
- The claim that MCP first-call priming is already implemented in the current MCP server
- The claim that all 10 OpenCode agents currently declare explicit MCP bindings in frontmatter
- The claim that `CODEX.md` now includes session-start code graph auto-trigger instructions

## Dead Ends
None. All requested verification targets produced usable evidence.

## Sources Consulted
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/CODEX.md`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/CLAUDE.md`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.claude/CLAUDE.md`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/opencode.json`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/agent/` (all 10 headers inspected)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md`

## Assessment
- New information ratio: 0.44
- Questions addressed: Q15 verification against current code
- Questions answered:
  - Is the four-tier fallback framing still consistent with the repo? Yes, with narrower Tier 2 wording.
  - Is T1.5 MCP first-call priming implemented? No; only the session primitive exists.
  - Has OpenCode agent inventory drifted? Count is still 10, but the "all 10 have MCP bindings" wording has drifted.

## Reflection
- What worked and why: Directly re-reading the live runtime files cleanly separated "still true", "partially true", and "proposal only". The combination of `CODEX.md`, `spec_kit_resume_auto.yaml`, and the session manager source was enough to verify both instruction-layer behavior and server-layer implementation status.
- What did not work and why: Memory retrieval for this exact verification query returned no useful matches inside the spec folder, so this iteration depended on first-principles source reading rather than prior indexed memories.
- What I would do differently: If more time were available, I would cross-check Codex/Copilot runtime-specific config files in the same pass so the final synthesis can compare OpenCode drift and Codex drift side by side.

## Recommended Next Focus
Verify the remaining non-Claude runtime parity claims against their live instruction surfaces (`.codex/agents/`, `.agents/settings.json`, `AGENTS.md`, `GEMINI.md`) so the final synthesis can distinguish implemented behavior, documented fallback, and unimplemented design proposals per runtime.
