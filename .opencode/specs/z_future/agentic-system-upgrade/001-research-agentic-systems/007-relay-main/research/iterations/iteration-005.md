# Iteration 005 — Provider-First Spawn Ergonomics

Date: 2026-04-09

## Research question
Do Relay's provider-first spawn helpers and explicit PTY/headless defaults suggest a better capability model for Public's current CLI delegation skills?

## Hypothesis
Relay's spawn surface exposes provider capabilities and transport defaults more cleanly than Public's current per-CLI delegation references.

## Method
Read the SDK README, client spawn helpers, high-level spawner creation, and broker tests for runtime defaults; then compared them with Public's Codex, Gemini, and Copilot delegation references.

## Evidence
- Relay documents provider-first helpers such as `spawnOpencode`, `spawnClaude`, and generic `spawnProvider`, plus notes the PTY/headless defaults for each provider. [SOURCE: external/packages/sdk/README.md:107-143]
- The client resolves transport with a simple rule: Opencode defaults to `headless`, everything else to `pty`, and headless is restricted to supported providers. [SOURCE: external/packages/sdk/src/client.ts:85-91] [SOURCE: external/packages/sdk/src/client.ts:326-377]
- The high-level facade bakes the same defaults into shorthand spawners: Codex/Claude/Gemini as PTY, OpenCode as headless. [SOURCE: external/packages/sdk/src/relay.ts:434-437] [SOURCE: external/packages/sdk/src/relay.ts:1568-1610]
- Broker tests assert PTY as the default runtime and reject unsupported headless providers. [SOURCE: external/src/main.rs:6864-6932]
- Public's Codex delegation reference focuses on profile selection, sandbox mode, and stateless prompt construction. [SOURCE: .opencode/skill/cli-codex/references/agent_delegation.md:62-89] [SOURCE: .opencode/skill/cli-codex/references/agent_delegation.md:124-132]
- Public's Gemini delegation reference describes agent invocation syntax and tool sets, but no normalized provider-capability matrix. [SOURCE: .opencode/skill/cli-gemini/references/agent_delegation.md:60-79] [SOURCE: .opencode/skill/cli-gemini/references/agent_delegation.md:81-88]
- Public's Copilot delegation reference differentiates Explore/Task/Cloud but again does so in tool-specific prose, not a cross-provider schema. [SOURCE: .opencode/skill/cli-copilot/references/agent_delegation.md:57-79] [SOURCE: .opencode/skill/cli-copilot/references/agent_delegation.md:98-103]

## Analysis
Relay's main ergonomics win here is not "more providers"; Public already has several. The win is a normalized capability surface where provider name, transport mode, and supported defaults are explicit and comparable. Public's current docs are accurate but siloed, so a conductor has to mentally translate three different invocation models. A shared provider matrix would make future transport-aware coordination much easier to reason about.

## Conclusion
confidence: high
finding: Public should adopt Relay's provider-first framing at the documentation layer now. That means documenting each provider's interaction mode, default transport assumptions, and constraints in one shared schema rather than three loosely parallel narratives.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/cli-codex/references/agent_delegation.md`, `.opencode/skill/cli-gemini/references/agent_delegation.md`, `.opencode/skill/cli-copilot/references/agent_delegation.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define a shared cross-provider table format and normalize terms such as interactive, headless, cloud, read-only, and write-capable
- **Priority:** must-have (adopt now)

## Counter-evidence sought
Looked for an existing shared provider-capability table across Public's delegation skills; none found.

## Follow-up questions for next iteration
- How should Public name its coordination shapes once provider capabilities are normalized?
- Can the same shared schema cover Copilot cloud delegation without pretending it is the same as PTY/headless?
- Which existing command docs would benefit first from the capability matrix?
