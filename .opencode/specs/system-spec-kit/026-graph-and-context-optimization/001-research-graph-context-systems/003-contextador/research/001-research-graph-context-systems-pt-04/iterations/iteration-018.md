# Iteration 18 -- 003-contextador

## Metadata
- Run: 18 of 20
- Focus: question closure pass: setup wizard, framework presets, and .mcp.json onboarding reality
- Agent: codex (gpt-5.4, model_reasoning_effort=high)
- Started: UNKNOWN
- Finished: 2026-04-08T07:39:46Z
- Tool calls used: 5

## Focus
Close Q10 by splitting the onboarding story into wizard-time global config, init-time project scaffolding, and doctor-time presence checks.

## Findings
- Q10 answer, wizard scope: `runSetup()` asks for provider, framework, and optional Mainframe settings, tests non-`claude-code` providers, then saves the result to `~/.contextador/config.json` with `0600` permissions; it does not itself write project-local MCP wiring (`external/src/lib/setup/wizard.ts:31-114`, `external/src/lib/setup/wizard.ts:116-149`, `external/src/lib/setup/wizard.ts:299-325`). [SOURCE: external/src/lib/setup/wizard.ts:31-114] [SOURCE: external/src/lib/setup/wizard.ts:116-149] [SOURCE: external/src/lib/setup/wizard.ts:299-325]
- Q10 answer, init-time project scaffolding: `contextador init` writes `.mcp.json` only when the file is missing, and the generated content is a single `mcpServers.contextador` entry using `bunx contextador-mcp`; it also adds optional framework-specific helper artifacts only for OpenClaw or Hermes (`external/src/cli.ts:141-158`). [SOURCE: external/src/cli.ts:141-158]
- The README's "auto-detected via .mcp.json" wording therefore compresses two weaker realities: the project file is created only by `contextador init`, and the later doctor flow simply checks for `.mcp.json` existence before warning that MCP editors will not auto-detect Contextador if it is missing (`external/src/cli.ts:769-776`, `external/README.md:46-57`, `external/README.md:98-117`). [SOURCE: external/src/cli.ts:769-776] [SOURCE: external/README.md:46-57] [SOURCE: external/README.md:98-117]

## Ruled Out
No new approaches were ruled out in this iteration.

## Dead Ends
No permanent dead ends were added in this iteration.

## Sources Consulted
- `external/src/lib/setup/wizard.ts:31-149`
- `external/src/lib/setup/wizard.ts:299-325`
- `external/src/cli.ts:141-158`
- `external/src/cli.ts:769-776`
- `external/README.md:46-57`
- `external/README.md:98-117`

## Assessment
- New information ratio: 0.14
- Questions addressed: Q10
- Questions answered: Q10

## Reflection
- What worked and why: splitting setup into global-config, init, and doctor phases turned a fuzzy onboarding claim into a concrete sequence of files and checks.
- What did not work and why: looking only at README commands would have overstated framework integration and editor auto-detection.
- What I would do differently: if this pattern is reused later, document generated project files and host-discovery behavior separately so users know what is actually scaffolded.

## Recommended Next Focus
Resolve Q11 directly from package metadata and license files so the adoption boundary is anchored in the repository's own legal/runtime declarations.
