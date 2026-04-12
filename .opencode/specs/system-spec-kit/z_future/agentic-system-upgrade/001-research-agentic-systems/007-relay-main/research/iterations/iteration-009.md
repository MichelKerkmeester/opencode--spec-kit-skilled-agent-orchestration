# Iteration 009 — Cross-Runtime Parity

Date: 2026-04-09

## Research question
Does Relay's TypeScript/Python parity pattern suggest a maintainability improvement for Public's multi-provider delegation documentation surfaces?

## Hypothesis
Relay reduces drift by keeping the conceptual surface aligned across runtimes, and Public could reuse that discipline across its current delegation skills.

## Method
Compared Relay's TypeScript and Python SDK docs for shared concepts, then compared that parity pattern with Public's three separate CLI delegation references.

## Evidence
- Relay's TypeScript docs expose `AgentRelay`, provider-specific spawn helpers, lifecycle hooks, `sendMessage`, and idle handling. [SOURCE: external/packages/sdk/README.md:31-150]
- Relay's Python docs expose the same core ideas: `AgentRelay`, runtime-specific spawners, readiness waits, message/callback hooks, and communicate-mode adapters. [SOURCE: external/packages/sdk-py/README.md:32-159]
- Python additionally documents a lightweight `Relay`/`on_relay()` communicate mode that wraps existing frameworks while preserving direct messages, channel posts, inbox reads, and receive hooks. [SOURCE: external/packages/sdk-py/README.md:64-84] [SOURCE: external/packages/sdk-py/README.md:119-159]
- Public's Codex, Gemini, and Copilot references all share the conductor/executor model, but each describes capabilities in tool-specific prose and syntax. [SOURCE: .opencode/skill/cli-codex/references/agent_delegation.md:17-22] [SOURCE: .opencode/skill/cli-gemini/references/agent_delegation.md:15-22] [SOURCE: .opencode/skill/cli-copilot/references/agent_delegation.md:14-20]
- The three Public references diverge on what they foreground: profiles and stateless exec for Codex, prompt-invoked agents and tool lists for Gemini, and Explore/Task/Cloud modes for Copilot. [SOURCE: .opencode/skill/cli-codex/references/agent_delegation.md:62-89] [SOURCE: .opencode/skill/cli-gemini/references/agent_delegation.md:60-79] [SOURCE: .opencode/skill/cli-copilot/references/agent_delegation.md:57-79]

## Analysis
Relay's parity win is conceptual, not lexical. The APIs are idiomatic to each language, but the same mental model appears in both docs. Public already has the raw ingredients for this across Codex, Gemini, and Copilot, yet a conductor still has to relearn each surface independently. A parity rubric would lower drift and make future transport-aware features easier to document consistently.

## Conclusion
confidence: medium
finding: Public should adopt a shared delegation-capability rubric across its CLI skills. This is less urgent than readiness or coordination-shape taxonomy, but it is a clean maintainability win that would make future transport work less fragmented.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/cli-codex/references/agent_delegation.md`, `.opencode/skill/cli-gemini/references/agent_delegation.md`, `.opencode/skill/cli-copilot/references/agent_delegation.md`, and the `system-spec-kit` documentation contract
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define a shared rubric covering conductor model, execution mode, context persistence, research capability, and transport expectations
- **Priority:** should-have (adopt now)

## Counter-evidence sought
Looked for a centralized parity rubric already shared across the three CLI delegation references; none was present in the files reviewed.

## Follow-up questions for next iteration
- Where should the shared rubric live so all three skills can reference it?
- Which capabilities deserve mandatory parity and which are provider-specific by design?
- Does any Relay pattern here become dangerous if over-copied into Public?
