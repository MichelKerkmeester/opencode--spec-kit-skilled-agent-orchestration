# Iteration 008 — Browser-Backed Exploration As A Research Capability

Date: 2026-04-09

## Research question
Should `system-spec-kit` treat browser-backed exploration as a first-class deep-research runtime capability, following the external repo's browser bridge patterns?

## Hypothesis
Not by default. The external browser tooling is valuable, but it looks more like an adjacent testing/research subsystem than a core deep-research requirement.

## Method
I reviewed the external browser-bridge MCP server and frontend E2E command, then compared that to the current deep-research runtime framing and capability docs.

## Evidence
- `[SOURCE: external/mcp-servers/browser-bridge/server.js:4-14]` The external server is a standalone MCP bridge with WebSocket transport, context persistence, health checks, and browser-specific tooling.
- `[SOURCE: external/mcp-servers/browser-bridge/server.js:95-176]` The tool surface is rich and browser-native: navigate, execute DOM actions, get page context, screenshot, and wait for elements.
- `[SOURCE: external/commands/frontend-e2e.md:1-8]` The external repo positions browser-bridge as a dedicated live-testing workflow, not just incidental web fetch.
- `[SOURCE: external/commands/frontend-e2e.md:34-45]` Setup logic includes production safety checks, connectivity verification, navigation, fallback waits, and screenshots before deeper actions.
- `[SOURCE: external/commands/frontend-e2e.md:99-145]` The command treats screenshots, per-page isolation, and DOM evaluation as core evidence artifacts.
- `[SOURCE: .opencode/command/spec_kit/deep-research.md:196-209]` Current deep research integrates memory context, CocoIndex bootstrap, and post-run memory save, but it does not define browser-backed evidence gathering as part of the standard protocol.
- `[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:159-175]` The dispatch contract is generic about tools and runtime context, not opinionated about browser automation.

## Analysis
The external browser system is substantial enough to be its own product surface. It adds value where research depends on live UI behavior, authenticated flows, or DOM-level evidence, but it also drags in transport, session, and safety complexity. That makes it a poor default for `system-spec-kit`'s general deep-research loop. The better lesson is capability declaration: browser-backed evidence is a distinct runtime class that should be discoverable and opt-in, not silently assumed. In other words, the architectural takeaway is "capability matrix richness," not "embed browser bridge into deep research."

## Conclusion
confidence: medium

finding: `system-spec-kit` should reject browser-backed exploration as a default deep-research dependency, but it may want to document it as an optional runtime capability for specialized research packets.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/deep-research.md`, `.opencode/skill/sk-deep-research/references/capability_matrix.md`
- **Change type:** rejected
- **Blast radius:** medium
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for a lightweight browser capability in the current deep-research protocol that would justify making browser work first-class. I found no such dependency.

## Follow-up questions for next iteration
- Can the portfolio-governance ideas help keep optional capabilities from bloating the base workflow?
- Would a capability-matrix note be enough, or does this need an adjacent command instead?
- What local validation guard could prevent browser-only features from leaking into core research requirements?
